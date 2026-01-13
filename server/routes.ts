import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { db } from "./db";
import * as schema from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import { storage } from "./storage";
import { encrypt, decrypt, decryptNote, decryptFilePath } from "./utils/encryption";
import { deriveTimezone } from "./utils/timezone";
import { sendContactFormEmail } from "./utils/email";
import { createRealOpenAIService } from "./services/realOpenAI";
import { mockOpenAIService } from "./services/mockOpenAI";
import { databaseService } from "./services/databaseService";
import { dugguChatbotService } from "./services/dugguChatbotService";
import { externalDbInspector } from "./services/externalDbInspector";
import { externalDugguService } from "./services/externalDugguService";
import { nlQueryService } from "./services/nlQueryService";
import { advancedSearchService } from "./services/advancedSearchService";
import { advancedContactSearchService } from "./services/advancedContactSearchService";
import { fileStorage } from "./services/fileStorage";
import { z } from "zod";

// Helper function to clean AI responses from unwanted patterns
function cleanStreamResponse(content: string): string {
  let cleaned = content;
  
  // Remove any emojis completely
  cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
  
  // Replace Fallowl with zhatore in AI responses
  cleaned = cleaned.replace(/Fallowl/gi, 'zhatore');
  
  // Keep cute pet-like behaviors but remove formal greetings
  cleaned = cleaned.replace(/^(?:greets warmly\s*)?(?:Hello there[^.!?]*[.!?]\s*)?/i, '');
  
  // Trim any remaining whitespace
  cleaned = cleaned.trim();
  
  return cleaned || 'I can help you with lead scoring and contact analysis.';
}

// Configure multer for file uploads with increased limits
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 10 // Maximum 10 files per upload
  },
  fileFilter: (req, file, cb) => {
    console.log('File filter - fieldname:', file.fieldname, 'mimetype:', file.mimetype, 'originalname:', file.originalname);
    
    // Only allow CSV files for the csv field
    if (file.fieldname === 'csv') {
      if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
        cb(null, true);
      } else {
        cb(new Error('Only CSV files are allowed for CSV uploads'));
      }
    } else if (file.fieldname === 'document') {
      // Allow wide variety of file types
      const allowedTypes = [
        // Documents
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.ms-excel',
        'application/vnd.ms-powerpoint',
        'text/plain',
        'text/csv',
        'application/rtf',
        
        // Images
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/webp',
        'image/svg+xml',
        'image/tiff',
        
        // Videos
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'video/x-msvideo',
        'video/webm',
        'video/ogg',
        'video/3gpp',
        
        // Audio
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/ogg',
        'audio/aac',
        'audio/webm',
        
        // Archives
        'application/zip',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
        'application/x-tar',
        'application/gzip',
        
        // Code and data
        'application/json',
        'text/javascript',
        'text/html',
        'text/css',
        'application/xml',
        'text/xml',
        'text/markdown',
        'application/octet-stream', // For various file types that browsers can't identify
        'text/x-markdown'
      ];
      
      // Check by MIME type or file extension for broader compatibility
      const fileExtension = file.originalname.toLowerCase().split('.').pop();
      const allowedExtensions = [
        // Documents
        'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'csv', 'rtf', 'md', 'markdown',
        // Images  
        'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'tif', 'ico',
        // Videos
        'mp4', 'mpeg', 'mpg', 'mov', 'avi', 'webm', 'ogg', '3gp', 'mkv', 'flv',
        // Audio
        'mp3', 'wav', 'ogg', 'aac', 'webm', 'flac', 'm4a',
        // Archives
        'zip', 'rar', '7z', 'tar', 'gz', 'bz2',
        // Code and data
        'json', 'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'xml', 'yaml', 'yml', 'sql', 'py', 'java', 'cpp', 'c', 'h'
      ];
      
      if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension || '')) {
        cb(null, true);
      } else {
        console.log('File type not allowed:', file.mimetype, 'Extension:', fileExtension);
        cb(new Error(`File type not allowed: ${file.originalname}`));
      }
    } else {
      cb(new Error('Invalid file field'));
    }
  }
});

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || '1234';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Ansh@0309';

function sanitizeFilePath(filePath: string, baseDir: string = 'uploads'): string {
  const normalizedPath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '');
  const absoluteBasePath = path.resolve(baseDir);
  const absoluteFilePath = path.resolve(absoluteBasePath, normalizedPath);
  
  if (!absoluteFilePath.startsWith(absoluteBasePath)) {
    throw new Error('Invalid file path: path traversal detected');
  }
  
  return absoluteFilePath;
}

// Function to parse CSV line with proper handling of quoted fields
function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Handle escaped quotes
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator found outside quotes
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current.trim());
  return result;
}

interface ActivityLogParams {
  req: any;
  activityType: string;
  action: string;
  resourceType?: string | null;
  resourceId?: string | null;
  details?: any;
  userId?: string | null;
  userRole?: string | null;
}

async function logActivity(params: ActivityLogParams): Promise<void> {
  try {
    const {
      req,
      activityType,
      action,
      resourceType = null,
      resourceId = null,
      details = {},
      userId = null,
      userRole = null
    } = params;

    const ipAddress = req.ip || req.connection?.remoteAddress || null;
    const userAgent = req.get('user-agent') || null;
    const sessionUserId = req.session?.userId || userId;
    const sessionUserRole = req.session?.userRole || userRole;

    await db.insert(schema.userActivityLogs).values({
      userId: sessionUserId,
      userRole: sessionUserRole,
      activityType,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress,
      userAgent
    });

    console.log(`Activity logged: ${activityType} - ${action}`, {
      userId: sessionUserId,
      resourceType,
      resourceId
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Create WebSocket server for real-time notes updates
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws' 
  });

  // Store connected WebSocket clients
  const wsClients = new Set<WebSocket>();
  const typingUsers = new Map<string, NodeJS.Timeout>();

  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection established');
    wsClients.add(ws);

    // Send initial notes data to newly connected client
    storage.getNotes().then(notes => {
      if (ws.readyState === WebSocket.OPEN) {
        const validNotes = notes.map(note => {
          try {
            const decryptedContent = decryptNote(note.encryptedContent);
            return {
              id: note.id,
              content: decryptedContent,
              createdAt: note.createdAt
            };
          } catch (error) {
            console.warn(`WebSocket: Failed to decrypt note ${note.id}:`, error);
            return null;
          }
        }).filter(note => note !== null);
        
        ws.send(JSON.stringify({
          type: 'notes_init',
          data: validNotes
        }));
      }
    }).catch(console.error);

    ws.on('close', () => {
      console.log('WebSocket connection closed');
      wsClients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      wsClients.delete(ws);
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'typing':
            // Clear existing timeout for this user
            if (typingUsers.has(message.data.userId)) {
              clearTimeout(typingUsers.get(message.data.userId)!);
            }
            
            // Broadcast typing indicator to other clients
            broadcastToOthers(ws, {
              type: 'user_typing',
              data: message.data
            });
            
            // Set timeout to automatically stop typing after 3 seconds
            const timeout = setTimeout(() => {
              broadcastToOthers(ws, {
                type: 'user_stopped_typing',
                data: message.data
              });
              typingUsers.delete(message.data.userId);
            }, 3000);
            
            typingUsers.set(message.data.userId, timeout);
            break;
            
          case 'stopped_typing':
            // Clear timeout and broadcast stop typing
            if (typingUsers.has(message.data.userId)) {
              clearTimeout(typingUsers.get(message.data.userId)!);
              typingUsers.delete(message.data.userId);
            }
            
            broadcastToOthers(ws, {
              type: 'user_stopped_typing',
              data: message.data
            });
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
  });

  // Function to broadcast notes updates to all connected clients
  function broadcastNotesUpdate(type: 'created' | 'updated' | 'deleted', noteData: any) {
    const message = JSON.stringify({
      type: `note_${type}`,
      data: noteData
    });

    wsClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      } else {
        wsClients.delete(client);
      }
    });
  }

  // Function to broadcast to all clients except sender
  function broadcastToOthers(sender: WebSocket, data: any) {
    const message = JSON.stringify(data);
    
    wsClients.forEach(client => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(message);
      } else if (client.readyState !== WebSocket.OPEN) {
        wsClients.delete(client);
      }
    });
  }
  
  // Basic health check endpoint for Docker and load balancers
  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  // Detailed health check endpoint with database connectivity check
  app.get('/api/health', async (req, res) => {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      storage: fileStorage.getStorageType(),
      database: 'unknown',
      environment: process.env.NODE_ENV || 'development'
    };

    try {
      const { pool } = await import('./db');
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      health.database = 'connected';
    } catch (error) {
      health.database = 'disconnected';
      health.status = 'degraded';
      console.error('Health check database error:', error);
    }

    const statusCode = health.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(health);
  });
  
  // Authentication route supporting both dashboard and admin
  app.post('/api/auth', async (req, res) => {
    try {
      const { password } = req.body;
      
      if (!password) {
        await logActivity({
          req,
          activityType: 'auth',
          action: 'Login attempt failed - no password provided',
          details: { reason: 'Missing password' }
        });
        return res.status(400).json({ message: 'Password is required' });
      }
      
      let isValid = false;
      let role = '';
      
      if (password === ADMIN_PASSWORD) {
        isValid = true;
        role = 'admin';
      } else if (password === DASHBOARD_PASSWORD) {
        isValid = true;
        role = 'user';
      }
      
      if (isValid) {
        req.session.authenticated = true;
        req.session.userRole = role;
        req.session.save(async (err) => {
          if (err) {
            console.error('Session save error:', err);
            await logActivity({
              req,
              activityType: 'auth',
              action: 'Login failed - session save error',
              userRole: role,
              details: { error: err.message }
            });
            return res.status(500).json({ message: 'Authentication failed' });
          }
          
          await logActivity({
            req,
            activityType: 'login',
            action: `User logged in successfully`,
            userRole: role,
            details: { role, timestamp: new Date().toISOString() }
          });
          
          res.json({ success: true, role });
        });
      } else {
        await logActivity({
          req,
          activityType: 'auth',
          action: 'Login attempt failed - invalid password',
          details: { reason: 'Invalid credentials', timestamp: new Date().toISOString() }
        });
        res.status(401).json({ message: 'Invalid password' });
      }
    } catch (error) {
      console.error('Auth error:', error);
      await logActivity({
        req,
        activityType: 'auth',
        action: 'Login attempt failed - server error',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      res.status(500).json({ message: 'Authentication failed' });
    }
  });

  // Check authentication status
  app.get('/api/auth/status', (req, res) => {
    res.json({ 
      authenticated: !!req.session.authenticated,
      role: req.session.userRole || 'user'
    });
  });

  // Logout route
  app.post('/api/auth/logout', async (req, res) => {
    const userRole = req.session?.userRole;
    
    await logActivity({
      req,
      activityType: 'logout',
      action: 'User logged out',
      userRole,
      details: { timestamp: new Date().toISOString() }
    });
    
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ success: true });
    });
  });

  // Admin authorization middleware
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.session.authenticated) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.session.userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  };

  // Admin activity logs endpoint
  app.get('/api/admin/activity-logs', requireAdmin, async (req, res) => {
    try {
      const {
        limit = 100,
        offset = 0,
        activityType,
        userRole,
        startDate,
        endDate,
        exportAll = 'false'
      } = req.query;

      // Build where conditions
      const conditions = [];
      
      if (activityType && activityType !== 'all') {
        conditions.push(eq(schema.userActivityLogs.activityType, activityType as string));
      }
      
      if (userRole && userRole !== 'all') {
        conditions.push(eq(schema.userActivityLogs.userRole, userRole as string));
      }
      
      if (startDate) {
        conditions.push(sql`${schema.userActivityLogs.createdAt} >= ${new Date(startDate as string)}`);
      }
      
      if (endDate) {
        conditions.push(sql`${schema.userActivityLogs.createdAt} <= ${new Date(endDate as string)}`);
      }

      // Fetch activities from database
      const activities = await db
        .select()
        .from(schema.userActivityLogs)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(sql`${schema.userActivityLogs.createdAt} DESC`)
        .limit(exportAll === 'true' ? 10000 : parseInt(limit as string))
        .offset(exportAll === 'true' ? 0 : parseInt(offset as string));

      // Get total count for pagination with same filters
      const [countResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.userActivityLogs)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      res.json({
        activities,
        total: Number(countResult.count) || 0,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      });
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      res.status(500).json({ message: 'Failed to fetch activity logs' });
    }
  });

  // Admin sessions endpoint
  app.get('/api/admin/sessions', requireAdmin, async (req, res) => {
    try {
      const sampleSessions = [
        {
          id: 'sess_1234567890',
          userId: 'admin@example.com',
          userRole: 'admin',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          device: 'Desktop',
          browser: 'Chrome 120',
          os: 'Windows 10',
          lastActivity: new Date(Date.now() - 300000).toISOString(),
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          expiresAt: new Date(Date.now() + 82800000).toISOString(),
          isActive: true
        },
        {
          id: 'sess_0987654321',
          userId: 'user@example.com',
          userRole: 'user',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          device: 'Desktop',
          browser: 'Safari 17',
          os: 'macOS',
          lastActivity: new Date(Date.now() - 600000).toISOString(),
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          expiresAt: new Date(Date.now() + 79200000).toISOString(),
          isActive: true
        },
        {
          id: 'sess_5555555555',
          userId: 'demo@example.com',
          userRole: 'user',
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
          device: 'Mobile',
          browser: 'Safari Mobile',
          os: 'iOS 17',
          lastActivity: new Date(Date.now() - 1800000).toISOString(),
          createdAt: new Date(Date.now() - 5400000).toISOString(),
          expiresAt: new Date(Date.now() + 81000000).toISOString(),
          isActive: false
        }
      ];

      res.json(sampleSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      res.status(500).json({ message: 'Failed to fetch sessions' });
    }
  });

  // Admin login history endpoint
  app.get('/api/admin/login-history', requireAdmin, async (req, res) => {
    try {
      const sampleLoginHistory = [
        {
          id: 1,
          userId: 'admin@example.com',
          userRole: 'admin',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          device: 'Desktop',
          browser: 'Chrome 120',
          location: 'New York, USA',
          status: 'success',
          failureReason: null,
          timestamp: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 2,
          userId: 'user@example.com',
          userRole: 'user',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          device: 'Desktop',
          browser: 'Safari 17',
          location: 'San Francisco, USA',
          status: 'success',
          failureReason: null,
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 3,
          userId: 'test@example.com',
          userRole: null,
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          device: 'Desktop',
          browser: 'Firefox 121',
          location: 'London, UK',
          status: 'failed',
          failureReason: 'Invalid credentials',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 4,
          userId: 'blocked@example.com',
          userRole: null,
          ipAddress: '10.0.0.50',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
          device: 'Desktop',
          browser: 'Chrome 119',
          location: 'Unknown',
          status: 'blocked',
          failureReason: 'Too many failed attempts',
          timestamp: new Date(Date.now() - 10800000).toISOString()
        },
        {
          id: 5,
          userId: 'demo@example.com',
          userRole: 'user',
          ipAddress: '192.168.1.103',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)',
          device: 'Mobile',
          browser: 'Safari Mobile',
          location: 'Los Angeles, USA',
          status: 'success',
          failureReason: null,
          timestamp: new Date(Date.now() - 14400000).toISOString()
        }
      ];

      res.json(sampleLoginHistory);
    } catch (error) {
      console.error('Error fetching login history:', error);
      res.status(500).json({ message: 'Failed to fetch login history' });
    }
  });

  // Admin campaign analytics endpoint
  app.get('/api/admin/campaign-analytics', requireAdmin, async (req, res) => {
    try {
      const sampleAnalytics = {
        totalCampaigns: 45,
        activeCampaigns: 12,
        totalContacts: 15000,
        totalCalls: 8500,
        successRate: 68,
        avgCallDuration: 145,
        dailyStats: [
          { date: '2024-11-14', calls: 450, success: 310, failed: 140 },
          { date: '2024-11-15', calls: 520, success: 360, failed: 160 },
          { date: '2024-11-16', calls: 480, success: 330, failed: 150 },
          { date: '2024-11-17', calls: 590, success: 410, failed: 180 },
          { date: '2024-11-18', calls: 610, success: 425, failed: 185 },
          { date: '2024-11-19', calls: 550, success: 380, failed: 170 },
          { date: '2024-11-20', calls: 620, success: 440, failed: 180 }
        ],
        statusDistribution: [
          { name: 'Active', value: 12 },
          { name: 'Completed', value: 25 },
          { name: 'Paused', value: 5 },
          { name: 'Scheduled', value: 3 }
        ],
        performanceByUser: [
          { user: 'admin@example.com', campaigns: 15, contacts: 5000, calls: 3000 },
          { user: 'user@example.com', campaigns: 20, contacts: 7000, calls: 4200 },
          { user: 'demo@example.com', campaigns: 10, contacts: 3000, calls: 1300 }
        ],
        recentCampaigns: [
          {
            id: 1,
            name: 'Q4 Sales Outreach',
            status: 'active',
            contacts: 1200,
            callsMade: 850,
            successRate: 72,
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 2,
            name: 'Customer Follow-up',
            status: 'active',
            contacts: 850,
            callsMade: 600,
            successRate: 68,
            createdAt: new Date(Date.now() - 172800000).toISOString()
          },
          {
            id: 3,
            name: 'Lead Qualification',
            status: 'completed',
            contacts: 500,
            callsMade: 500,
            successRate: 65,
            createdAt: new Date(Date.now() - 259200000).toISOString()
          },
          {
            id: 4,
            name: 'Renewal Reminders',
            status: 'active',
            contacts: 650,
            callsMade: 420,
            successRate: 75,
            createdAt: new Date(Date.now() - 345600000).toISOString()
          }
        ]
      };

      res.json(sampleAnalytics);
    } catch (error) {
      console.error('Error fetching campaign analytics:', error);
      res.status(500).json({ message: 'Failed to fetch campaign analytics' });
    }
  });

  // Admin contact tracking endpoint
  app.get('/api/admin/contact-tracking', requireAdmin, async (req, res) => {
    try {
      const sampleInteractions = [
        {
          id: 1,
          contactName: 'John Smith',
          contactEmail: 'john.smith@example.com',
          contactMobile: '+1-555-0101',
          campaignName: 'Q4 Sales Outreach',
          interactionType: 'call',
          status: 'success',
          duration: 185,
          notes: 'Interested in premium package, scheduled follow-up',
          userId: 'user@example.com',
          timestamp: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 2,
          contactName: 'Sarah Johnson',
          contactEmail: 'sarah.j@example.com',
          contactMobile: '+1-555-0102',
          campaignName: 'Customer Follow-up',
          interactionType: 'email',
          status: 'success',
          duration: null,
          notes: 'Sent product catalog and pricing information',
          userId: 'admin@example.com',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 3,
          contactName: 'Mike Davis',
          contactEmail: 'mike.davis@example.com',
          contactMobile: '+1-555-0103',
          campaignName: 'Lead Qualification',
          interactionType: 'call',
          status: 'failed',
          duration: 15,
          notes: 'No answer, left voicemail',
          userId: 'user@example.com',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 4,
          contactName: 'Emily Brown',
          contactEmail: 'emily.brown@example.com',
          contactMobile: '+1-555-0104',
          campaignName: 'Renewal Reminders',
          interactionType: 'sms',
          status: 'success',
          duration: null,
          notes: 'Reminder sent about upcoming subscription renewal',
          userId: 'admin@example.com',
          timestamp: new Date(Date.now() - 10800000).toISOString()
        },
        {
          id: 5,
          contactName: 'David Wilson',
          contactEmail: 'david.w@example.com',
          contactMobile: '+1-555-0105',
          campaignName: 'Q4 Sales Outreach',
          interactionType: 'call',
          status: 'success',
          duration: 220,
          notes: 'Confirmed order, processing payment',
          userId: 'user@example.com',
          timestamp: new Date(Date.now() - 14400000).toISOString()
        }
      ];

      res.json(sampleInteractions);
    } catch (error) {
      console.error('Error fetching contact tracking:', error);
      res.status(500).json({ message: 'Failed to fetch contact tracking' });
    }
  });

  // Admin system logs endpoint
  app.get('/api/admin/system-logs', requireAdmin, async (req, res) => {
    try {
      const sampleLogs = [
        {
          id: 1,
          level: 'error',
          category: 'Database',
          message: 'Connection pool exhausted - consider increasing pool size',
          details: { maxConnections: 10, activeConnections: 10 },
          source: 'db/pool.ts',
          timestamp: new Date(Date.now() - 900000).toISOString()
        },
        {
          id: 2,
          level: 'warn',
          category: 'API',
          message: 'Rate limit approaching for user admin@example.com',
          details: { limit: 1000, current: 950, userId: 'admin@example.com' },
          source: 'middleware/rateLimit.ts',
          timestamp: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 3,
          level: 'info',
          category: 'Campaign',
          message: 'Campaign "Q4 Sales Outreach" started successfully',
          details: { campaignId: 1, contactCount: 1200 },
          source: 'services/campaign.ts',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 4,
          level: 'success',
          category: 'Integration',
          message: 'Twilio integration configured successfully',
          details: { accountSid: 'AC...', phoneNumber: '+1-555-0100' },
          source: 'integrations/twilio.ts',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 5,
          level: 'error',
          category: 'Authentication',
          message: 'Failed login attempt from suspicious IP',
          details: { ipAddress: '10.0.0.50', attempts: 5 },
          source: 'auth/login.ts',
          timestamp: new Date(Date.now() - 10800000).toISOString()
        },
        {
          id: 6,
          level: 'debug',
          category: 'System',
          message: 'Memory usage check completed',
          details: { heapUsed: '120MB', heapTotal: '256MB' },
          source: 'utils/monitoring.ts',
          timestamp: new Date(Date.now() - 14400000).toISOString()
        },
        {
          id: 7,
          level: 'warn',
          category: 'Storage',
          message: 'S3 storage quota at 85% capacity',
          details: { used: '8.5GB', total: '10GB' },
          source: 'storage/s3.ts',
          timestamp: new Date(Date.now() - 18000000).toISOString()
        },
        {
          id: 8,
          level: 'info',
          category: 'Email',
          message: 'Email batch sent successfully',
          details: { recipientCount: 150, campaignId: 2 },
          source: 'services/email.ts',
          timestamp: new Date(Date.now() - 21600000).toISOString()
        }
      ];

      res.json(sampleLogs);
    } catch (error) {
      console.error('Error fetching system logs:', error);
      res.status(500).json({ message: 'Failed to fetch system logs' });
    }
  });

  // Admin API usage endpoint
  app.get('/api/admin/api-usage', requireAdmin, async (req, res) => {
    try {
      const sampleAPIUsage = {
        totalRequests: 125000,
        successfulRequests: 118500,
        failedRequests: 6500,
        avgResponseTime: 145,
        requestsByEndpoint: [
          { endpoint: '/api/campaigns', count: 35000 },
          { endpoint: '/api/contacts', count: 28000 },
          { endpoint: '/api/auth/login', count: 15000 },
          { endpoint: '/api/calls', count: 22000 },
          { endpoint: '/api/admin/*', count: 8500 }
        ],
        requestsOverTime: [
          { time: '00:00', requests: 850, errors: 45 },
          { time: '04:00', requests: 620, errors: 30 },
          { time: '08:00', requests: 1200, errors: 65 },
          { time: '12:00', requests: 1850, errors: 95 },
          { time: '16:00', requests: 2100, errors: 110 },
          { time: '20:00', requests: 1650, errors: 85 }
        ],
        recentRequests: [
          {
            id: 1,
            endpoint: '/api/campaigns',
            method: 'GET',
            userId: 'user@example.com',
            statusCode: 200,
            responseTime: 125,
            ipAddress: '192.168.1.101',
            userAgent: 'Mozilla/5.0',
            timestamp: new Date(Date.now() - 300000).toISOString()
          },
          {
            id: 2,
            endpoint: '/api/contacts',
            method: 'POST',
            userId: 'admin@example.com',
            statusCode: 201,
            responseTime: 185,
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0',
            timestamp: new Date(Date.now() - 600000).toISOString()
          },
          {
            id: 3,
            endpoint: '/api/calls/start',
            method: 'POST',
            userId: 'user@example.com',
            statusCode: 500,
            responseTime: 2500,
            ipAddress: '192.168.1.101',
            userAgent: 'Mozilla/5.0',
            timestamp: new Date(Date.now() - 900000).toISOString()
          },
          {
            id: 4,
            endpoint: '/api/admin/activity-logs',
            method: 'GET',
            userId: 'admin@example.com',
            statusCode: 200,
            responseTime: 95,
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0',
            timestamp: new Date(Date.now() - 1200000).toISOString()
          }
        ]
      };

      res.json(sampleAPIUsage);
    } catch (error) {
      console.error('Error fetching API usage:', error);
      res.status(500).json({ message: 'Failed to fetch API usage' });
    }
  });

  // Admin security events endpoint
  app.get('/api/admin/security-events', requireAdmin, async (req, res) => {
    try {
      const sampleSecurityEvents = [
        {
          id: 1,
          eventType: 'brute_force',
          severity: 'high',
          description: 'Multiple failed login attempts detected from single IP',
          userId: null,
          ipAddress: '10.0.0.50',
          location: 'Unknown',
          action: 'IP temporarily blocked for 1 hour',
          status: 'resolved',
          details: { attempts: 15, timeWindow: '5 minutes' },
          timestamp: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 2,
          eventType: 'unauthorized_access',
          severity: 'critical',
          description: 'Attempt to access admin panel without proper credentials',
          userId: 'test@example.com',
          ipAddress: '192.168.1.150',
          location: 'London, UK',
          action: 'Account flagged for review',
          status: 'investigating',
          details: { endpoint: '/admin', attempts: 3 },
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 3,
          eventType: 'suspicious_activity',
          severity: 'medium',
          description: 'Unusual API request pattern detected',
          userId: 'demo@example.com',
          ipAddress: '192.168.1.103',
          location: 'Los Angeles, USA',
          action: 'Monitoring user activity',
          status: 'active',
          details: { requestCount: 500, timeWindow: '1 minute' },
          timestamp: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 4,
          eventType: 'policy_violation',
          severity: 'low',
          description: 'User exceeded daily API rate limit',
          userId: 'user@example.com',
          ipAddress: '192.168.1.101',
          location: 'San Francisco, USA',
          action: 'Rate limit applied',
          status: 'resolved',
          details: { limit: 1000, actual: 1150 },
          timestamp: new Date(Date.now() - 10800000).toISOString()
        }
      ];

      res.json(sampleSecurityEvents);
    } catch (error) {
      console.error('Error fetching security events:', error);
      res.status(500).json({ message: 'Failed to fetch security events' });
    }
  });

  // Admin analytics endpoint
  app.get('/api/admin/analytics', requireAdmin, async (req, res) => {
    try {
      const totalUsers = await db.select({ count: sql<number>`count(*)` })
        .from(schema.crmUsers);
      
      const sampleAnalytics = {
        totalUsers: totalUsers[0]?.count || 0,
        activeSessions: 3,
        campaignViews: 245,
        apiCalls: 1250
      };

      res.json(sampleAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ message: 'Failed to fetch analytics' });
    }
  });

  // Admin audit trail endpoint
  app.get('/api/admin/audit-trail', requireAdmin, async (req, res) => {
    try {
      const sampleAuditTrail = [
        {
          id: 1,
          userId: 'admin@example.com',
          userRole: 'admin',
          action: 'create_campaign',
          resourceType: 'campaign',
          resourceId: '101',
          changes: { name: 'Q4 2024 Campaign', status: 'active' },
          ipAddress: '192.168.1.100',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 2,
          userId: 'user@example.com',
          userRole: 'user',
          action: 'update_contact',
          resourceType: 'contact',
          resourceId: '5432',
          changes: { email: 'updated@example.com', phone: '+1234567890' },
          ipAddress: '192.168.1.101',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 3,
          userId: 'admin@example.com',
          userRole: 'admin',
          action: 'delete_document',
          resourceType: 'document',
          resourceId: '789',
          changes: { filename: 'old_report.pdf' },
          ipAddress: '192.168.1.100',
          createdAt: new Date(Date.now() - 10800000).toISOString()
        },
        {
          id: 4,
          userId: 'user@example.com',
          userRole: 'user',
          action: 'upload_csv',
          resourceType: 'campaign',
          resourceId: '102',
          changes: { filename: 'contacts_batch_2.csv', rows: 500 },
          ipAddress: '192.168.1.101',
          createdAt: new Date(Date.now() - 14400000).toISOString()
        }
      ];

      res.json(sampleAuditTrail);
    } catch (error) {
      console.error('Error fetching audit trail:', error);
      res.status(500).json({ message: 'Failed to fetch audit trail' });
    }
  });

  // Admin alerts endpoint
  app.get('/api/admin/alerts', requireAdmin, async (req, res) => {
    try {
      const sampleAlerts = [
        {
          id: 1,
          title: 'High API Usage Detected',
          description: 'API calls exceeded 90% of daily quota',
          severity: 'warning',
          status: 'active',
          createdAt: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 2,
          title: 'Database Backup Completed',
          description: 'Daily database backup completed successfully',
          severity: 'info',
          status: 'resolved',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          resolvedAt: new Date(Date.now() - 85000000).toISOString()
        },
        {
          id: 3,
          title: 'Failed Login Attempts',
          description: 'Multiple failed login attempts from IP 10.0.0.50',
          severity: 'critical',
          status: 'active',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 4,
          title: 'Low Disk Space',
          description: 'Available disk space below 20%',
          severity: 'warning',
          status: 'active',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        }
      ];

      res.json(sampleAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      res.status(500).json({ message: 'Failed to fetch alerts' });
    }
  });

  // Admin search queries endpoint
  app.get('/api/admin/search-queries', requireAdmin, async (req, res) => {
    try {
      const sampleSearchQueries = [
        {
          id: 1,
          userId: 'user@example.com',
          query: 'CEO technology companies',
          resultsCount: 45,
          executionTime: 125,
          createdAt: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 2,
          userId: 'demo@example.com',
          query: 'VP Sales healthcare',
          resultsCount: 32,
          executionTime: 98,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 3,
          userId: 'user@example.com',
          query: 'Director Marketing',
          resultsCount: 67,
          executionTime: 156,
          createdAt: new Date(Date.now() - 5400000).toISOString()
        },
        {
          id: 4,
          userId: 'user@example.com',
          query: 'CEO technology companies',
          resultsCount: 45,
          executionTime: 112,
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 5,
          userId: 'demo@example.com',
          query: 'CTO software',
          resultsCount: 28,
          executionTime: 89,
          createdAt: new Date(Date.now() - 9000000).toISOString()
        }
      ];

      res.json(sampleSearchQueries);
    } catch (error) {
      console.error('Error fetching search queries:', error);
      res.status(500).json({ message: 'Failed to fetch search queries' });
    }
  });

  // Admin download logs endpoint
  app.get('/api/admin/download-logs', requireAdmin, async (req, res) => {
    try {
      const sampleDownloadLogs = [
        {
          id: 1,
          userId: 'user@example.com',
          filename: 'campaign_results_q4.csv',
          fileSize: 2048576,
          campaignId: 101,
          exportType: 'CSV',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 2,
          userId: 'demo@example.com',
          filename: 'contact_list_export.csv',
          fileSize: 1536000,
          campaignId: 102,
          exportType: 'CSV',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 3,
          userId: 'user@example.com',
          filename: 'analytics_report.pdf',
          fileSize: 4096000,
          campaignId: 103,
          exportType: 'PDF',
          createdAt: new Date(Date.now() - 10800000).toISOString()
        },
        {
          id: 4,
          userId: 'admin@example.com',
          filename: 'full_database_export.csv',
          fileSize: 10485760,
          campaignId: 0,
          exportType: 'CSV',
          createdAt: new Date(Date.now() - 14400000).toISOString()
        }
      ];

      res.json(sampleDownloadLogs);
    } catch (error) {
      console.error('Error fetching download logs:', error);
      res.status(500).json({ message: 'Failed to fetch download logs' });
    }
  });

  // Admin call logs endpoint
  app.get('/api/admin/call-logs', requireAdmin, async (req, res) => {
    try {
      const sampleCallLogs = [
        {
          id: 1,
          contactId: 1001,
          userId: 'user@example.com',
          callType: 'outgoing',
          duration: 245,
          status: 'completed',
          notes: 'Discussed product demo',
          createdAt: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 2,
          contactId: 1002,
          userId: 'demo@example.com',
          callType: 'incoming',
          duration: 180,
          status: 'completed',
          notes: 'Follow-up on proposal',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 3,
          contactId: 1003,
          userId: 'user@example.com',
          callType: 'missed',
          duration: 0,
          status: 'missed',
          notes: 'Callback scheduled',
          createdAt: new Date(Date.now() - 5400000).toISOString()
        },
        {
          id: 4,
          contactId: 1004,
          userId: 'user@example.com',
          callType: 'outgoing',
          duration: 320,
          status: 'completed',
          notes: 'Closing call - deal won',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 5,
          contactId: 1005,
          userId: 'demo@example.com',
          callType: 'incoming',
          duration: 150,
          status: 'completed',
          notes: 'Support inquiry',
          createdAt: new Date(Date.now() - 9000000).toISOString()
        }
      ];

      res.json(sampleCallLogs);
    } catch (error) {
      console.error('Error fetching call logs:', error);
      res.status(500).json({ message: 'Failed to fetch call logs' });
    }
  });

  // Admin email tracking endpoint
  app.get('/api/admin/email-tracking', requireAdmin, async (req, res) => {
    try {
      const sampleEmailTracking = [
        {
          id: 1,
          contactId: 2001,
          userId: 'user@example.com',
          emailType: 'campaign',
          subject: 'Q4 Product Launch Announcement',
          status: 'clicked',
          openedAt: new Date(Date.now() - 86400000).toISOString(),
          clickedAt: new Date(Date.now() - 85000000).toISOString(),
          createdAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: 2,
          contactId: 2002,
          userId: 'demo@example.com',
          emailType: 'newsletter',
          subject: 'Weekly Industry Update',
          status: 'opened',
          openedAt: new Date(Date.now() - 3600000).toISOString(),
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 3,
          contactId: 2003,
          userId: 'user@example.com',
          emailType: 'follow-up',
          subject: 'Following up on our conversation',
          status: 'delivered',
          createdAt: new Date(Date.now() - 10800000).toISOString()
        },
        {
          id: 4,
          contactId: 2004,
          userId: 'user@example.com',
          emailType: 'campaign',
          subject: 'Special Offer - Limited Time',
          status: 'bounced',
          createdAt: new Date(Date.now() - 14400000).toISOString()
        },
        {
          id: 5,
          contactId: 2005,
          userId: 'demo@example.com',
          emailType: 'welcome',
          subject: 'Welcome to Our Platform',
          status: 'clicked',
          openedAt: new Date(Date.now() - 18000000).toISOString(),
          clickedAt: new Date(Date.now() - 17900000).toISOString(),
          createdAt: new Date(Date.now() - 21600000).toISOString()
        }
      ];

      res.json(sampleEmailTracking);
    } catch (error) {
      console.error('Error fetching email tracking:', error);
      res.status(500).json({ message: 'Failed to fetch email tracking' });
    }
  });

  // Admin upload history endpoint
  app.get('/api/admin/upload-history', requireAdmin, async (req, res) => {
    try {
      const sampleUploadHistory = [
        {
          id: 1,
          userId: 'user@example.com',
          filename: 'contacts_batch_1.csv',
          fileSize: 3145728,
          campaignId: 101,
          success: true,
          errorMessage: '',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 2,
          userId: 'demo@example.com',
          filename: 'leads_q4_2024.csv',
          fileSize: 2097152,
          campaignId: 102,
          success: true,
          errorMessage: '',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 3,
          userId: 'user@example.com',
          filename: 'invalid_format.csv',
          fileSize: 1024000,
          campaignId: 103,
          success: false,
          errorMessage: 'Invalid CSV format: missing required columns',
          createdAt: new Date(Date.now() - 10800000).toISOString()
        },
        {
          id: 4,
          userId: 'admin@example.com',
          filename: 'enterprise_contacts.csv',
          fileSize: 8388608,
          campaignId: 104,
          success: true,
          errorMessage: '',
          createdAt: new Date(Date.now() - 14400000).toISOString()
        },
        {
          id: 5,
          userId: 'user@example.com',
          filename: 'prospects_list.csv',
          fileSize: 1536000,
          campaignId: 105,
          success: true,
          errorMessage: '',
          createdAt: new Date(Date.now() - 18000000).toISOString()
        }
      ];

      res.json(sampleUploadHistory);
    } catch (error) {
      console.error('Error fetching upload history:', error);
      res.status(500).json({ message: 'Failed to fetch upload history' });
    }
  });

  // Admin database stats endpoint
  app.get('/api/admin/database-stats', requireAdmin, async (req, res) => {
    try {
      const contactsCount = await db.select({ count: sql<number>`count(*)` })
        .from(schema.contacts);
      
      const campaignsCount = await db.select({ count: sql<number>`count(*)` })
        .from(schema.campaigns);
      
      const notesCount = await db.select({ count: sql<number>`count(*)` })
        .from(schema.notes);

      const sampleDatabaseStats = {
        totalRecords: (contactsCount[0]?.count || 0) + (campaignsCount[0]?.count || 0) + (notesCount[0]?.count || 0),
        tableCount: 12,
        databaseSize: '256 MB',
        activeConnections: 5,
        tables: [
          { name: 'contacts', rowCount: contactsCount[0]?.count || 0 },
          { name: 'campaigns', rowCount: campaignsCount[0]?.count || 0 },
          { name: 'notes', rowCount: notesCount[0]?.count || 0 },
          { name: 'documents', rowCount: 0 },
          { name: 'crm_users', rowCount: 0 }
        ]
      };

      res.json(sampleDatabaseStats);
    } catch (error) {
      console.error('Error fetching database stats:', error);
      res.status(500).json({ message: 'Failed to fetch database stats' });
    }
  });

  // Admin performance endpoint
  app.get('/api/admin/performance', requireAdmin, async (req, res) => {
    try {
      const memoryUsage = process.memoryUsage();
      const uptime = process.uptime();

      const samplePerformance = {
        avgResponseTime: '125ms',
        cpuUsage: '45%',
        memoryUsage: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        activeRequests: 3,
        uptime: Math.floor(uptime / 60) + ' minutes',
        requestsPerMinute: 120
      };

      res.json(samplePerformance);
    } catch (error) {
      console.error('Error fetching performance:', error);
      res.status(500).json({ message: 'Failed to fetch performance metrics' });
    }
  });

  // Admin campaign views endpoint
  app.get('/api/admin/campaign-views', requireAdmin, async (req, res) => {
    try {
      const sampleCampaignViews = [
        {
          id: 1,
          campaignId: 101,
          userId: 'user@example.com',
          viewDuration: 420,
          contactsViewed: 15,
          actionsPerformed: { exports: 2, calls: 3, emails: 1 },
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 2,
          campaignId: 102,
          userId: 'demo@example.com',
          viewDuration: 180,
          contactsViewed: 8,
          actionsPerformed: { exports: 1, calls: 0, emails: 2 },
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 3,
          campaignId: 101,
          userId: 'user@example.com',
          viewDuration: 600,
          contactsViewed: 25,
          actionsPerformed: { exports: 3, calls: 5, emails: 4 },
          createdAt: new Date(Date.now() - 10800000).toISOString()
        },
        {
          id: 4,
          campaignId: 103,
          userId: 'admin@example.com',
          viewDuration: 300,
          contactsViewed: 12,
          actionsPerformed: { exports: 1, calls: 2, emails: 1 },
          createdAt: new Date(Date.now() - 14400000).toISOString()
        },
        {
          id: 5,
          campaignId: 102,
          userId: 'demo@example.com',
          viewDuration: 240,
          contactsViewed: 10,
          actionsPerformed: { exports: 0, calls: 1, emails: 3 },
          createdAt: new Date(Date.now() - 18000000).toISOString()
        }
      ];

      res.json(sampleCampaignViews);
    } catch (error) {
      console.error('Error fetching campaign views:', error);
      res.status(500).json({ message: 'Failed to fetch campaign views' });
    }
  });

  // Admin failed logins endpoint
  app.get('/api/admin/failed-logins', requireAdmin, async (req, res) => {
    try {
      const sampleFailedLogins = [
        {
          id: 1,
          userId: 'hacker@example.com',
          ipAddress: '10.0.0.50',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          failureReason: 'Invalid password',
          createdAt: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 2,
          userId: 'test@example.com',
          ipAddress: '10.0.0.50',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          failureReason: 'Invalid password',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 3,
          userId: 'admin@wrong.com',
          ipAddress: '192.168.1.150',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          failureReason: 'Account not found',
          createdAt: new Date(Date.now() - 5400000).toISOString()
        },
        {
          id: 4,
          userId: 'unknown@test.com',
          ipAddress: '10.0.0.50',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          failureReason: 'Invalid password',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 5,
          userId: 'locked@example.com',
          ipAddress: '192.168.1.200',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          failureReason: 'Account locked',
          createdAt: new Date(Date.now() - 9000000).toISOString()
        },
        {
          id: 6,
          userId: 'test@example.com',
          ipAddress: '10.0.0.50',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          failureReason: 'Invalid password',
          createdAt: new Date(Date.now() - 10800000).toISOString()
        }
      ];

      res.json(sampleFailedLogins);
    } catch (error) {
      console.error('Error fetching failed logins:', error);
      res.status(500).json({ message: 'Failed to fetch failed logins' });
    }
  });

  // Admin security logs endpoint
  app.get('/api/admin/security-logs', requireAdmin, async (req, res) => {
    try {
      const sampleSecurityLogs = [
        {
          id: 1,
          userId: 'admin@example.com',
          eventType: 'unauthorized_access',
          severity: 'high',
          description: 'Attempted access to restricted admin endpoint',
          ipAddress: '192.168.1.150',
          createdAt: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 2,
          userId: 'system',
          eventType: 'rate_limit_exceeded',
          severity: 'medium',
          description: 'API rate limit exceeded by 50%',
          ipAddress: '10.0.0.75',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 3,
          userId: 'user@example.com',
          eventType: 'suspicious_activity',
          severity: 'critical',
          description: 'Multiple failed login attempts followed by successful login',
          ipAddress: '10.0.0.50',
          createdAt: new Date(Date.now() - 5400000).toISOString()
        },
        {
          id: 4,
          userId: 'system',
          eventType: 'firewall_block',
          severity: 'high',
          description: 'Blocked suspicious IP attempting SQL injection',
          ipAddress: '203.0.113.0',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 5,
          userId: 'test@example.com',
          eventType: 'permission_violation',
          severity: 'medium',
          description: 'Attempted to access unauthorized resource',
          ipAddress: '192.168.1.101',
          createdAt: new Date(Date.now() - 9000000).toISOString()
        },
        {
          id: 6,
          userId: 'system',
          eventType: 'ddos_attempt',
          severity: 'critical',
          description: 'Detected distributed denial of service attack pattern',
          ipAddress: '198.51.100.0',
          createdAt: new Date(Date.now() - 10800000).toISOString()
        },
        {
          id: 7,
          userId: 'admin@example.com',
          eventType: 'admin_action',
          severity: 'low',
          description: 'Admin performed bulk user deletion',
          ipAddress: '192.168.1.100',
          createdAt: new Date(Date.now() - 14400000).toISOString()
        }
      ];

      res.json(sampleSecurityLogs);
    } catch (error) {
      console.error('Error fetching security logs:', error);
      res.status(500).json({ message: 'Failed to fetch security logs' });
    }
  });

  // Admin-User Chat API Routes
  
  // Get all CRM users with conversation info
  app.get('/api/admin/users', requireAdmin, async (req, res) => {
    try {
      const users = await db.select({
        id: schema.crmUsers.id,
        username: schema.crmUsers.username,
        createdAt: schema.crmUsers.createdAt,
      }).from(schema.crmUsers);

      // Get conversation info for each user
      const usersWithConversations = await Promise.all(
        users.map(async (user) => {
          const conversation = await db.select({
            id: schema.adminUserConversations.id,
            adminUnreadCount: schema.adminUserConversations.adminUnreadCount,
          })
          .from(schema.adminUserConversations)
          .where(eq(schema.adminUserConversations.userId, user.id))
          .limit(1);

          return {
            ...user,
            conversationId: conversation[0]?.id || null,
            unreadCount: conversation[0]?.adminUnreadCount || 0,
          };
        })
      );

      res.json(usersWithConversations);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  // Get or create conversation for a specific user
  app.get('/api/admin/conversations/:userId', requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;

      // Check if conversation exists
      let conversation = await db.select()
        .from(schema.adminUserConversations)
        .where(eq(schema.adminUserConversations.userId, userId))
        .limit(1);

      // Create conversation if it doesn't exist
      if (conversation.length === 0) {
        const user = await db.select()
          .from(schema.crmUsers)
          .where(eq(schema.crmUsers.id, userId))
          .limit(1);

        if (user.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }

        conversation = await db.insert(schema.adminUserConversations)
          .values({
            userId,
            title: `Chat with ${user[0].username}`,
            isActive: true,
          })
          .returning();
      }

      res.json(conversation[0]);
    } catch (error) {
      console.error('Error getting conversation:', error);
      res.status(500).json({ message: 'Failed to get conversation' });
    }
  });

  // Get messages in a conversation
  app.get('/api/admin/conversations/:conversationId/messages', requireAdmin, async (req, res) => {
    try {
      const { conversationId } = req.params;

      const messages = await db.select()
        .from(schema.adminUserMessages)
        .where(eq(schema.adminUserMessages.conversationId, conversationId))
        .orderBy(schema.adminUserMessages.createdAt);

      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  });

  // Send a message in a conversation
  app.post('/api/admin/conversations/:conversationId/messages', requireAdmin, async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { content, messageType = 'text', attachmentUrl, attachmentName, attachmentSize } = req.body;

      if (!content) {
        return res.status(400).json({ message: 'Message content is required' });
      }

      // Create message
      const message = await db.insert(schema.adminUserMessages)
        .values({
          conversationId,
          senderType: 'admin',
          senderId: req.session.userId || 'admin',
          messageType,
          content,
          attachmentUrl,
          attachmentName,
          attachmentSize,
          isRead: false,
        })
        .returning();

      // Update conversation's last message timestamp and user unread count
      await db.update(schema.adminUserConversations)
        .set({
          lastMessageAt: new Date(),
          unreadCount: sql`${schema.adminUserConversations.unreadCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(schema.adminUserConversations.id, conversationId));

      res.json(message[0]);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Failed to send message' });
    }
  });

  // Mark messages as read (for admin)
  app.patch('/api/admin/conversations/:conversationId/mark-read', requireAdmin, async (req, res) => {
    try {
      const { conversationId } = req.params;

      // Mark all user messages as read
      await db.update(schema.adminUserMessages)
        .set({
          isRead: true,
          readAt: new Date(),
        })
        .where(
          and(
            eq(schema.adminUserMessages.conversationId, conversationId),
            eq(schema.adminUserMessages.senderType, 'user'),
            eq(schema.adminUserMessages.isRead, false)
          )
        );

      // Reset admin unread count
      await db.update(schema.adminUserConversations)
        .set({
          adminUnreadCount: 0,
          updatedAt: new Date(),
        })
        .where(eq(schema.adminUserConversations.id, conversationId));

      res.json({ success: true });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({ message: 'Failed to mark messages as read' });
    }
  });

  // CSV preview endpoint for field mapping
  app.post('/api/campaigns/preview', upload.single('csv'), async (req, res) => {
    try {
      const file = req.file as Express.Multer.File;
      if (!file) {
        return res.status(400).json({ message: 'No CSV file uploaded' });
      }

      // Read and parse CSV headers only
      const csvContent = fs.readFileSync(file.path, 'utf-8');
      const lines = csvContent.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        return res.status(400).json({ message: 'CSV file is empty' });
      }

      // Parse headers
      const headers = parseCSVLine(lines[0]);
      
      // Clean up uploaded file
      fs.unlinkSync(file.path);

      res.json({ 
        headers,
        fileName: file.originalname
      });
    } catch (error) {
      console.error('CSV preview error:', error);
      res.status(500).json({ message: 'Failed to preview CSV file' });
    }
  });

  // Campaign CSV upload
  app.post('/api/campaigns/upload', upload.single('csv'), async (req, res) => {
    try {
      console.log('CSV upload request received');
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      
      const file = req.file as Express.Multer.File;
      if (!file) {
        return res.status(400).json({ message: 'No CSV file uploaded' });
      }

      // Get field mappings from request
      const fieldMappingsJson = req.body.fieldMappings;
      if (!fieldMappingsJson) {
        return res.status(400).json({ message: 'Field mappings are required' });
      }

      const fieldMappings: Record<string, string> = JSON.parse(fieldMappingsJson);

      // Read and parse CSV
      const csvContent = fs.readFileSync(file.path, 'utf-8');
      const lines = csvContent.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        return res.status(400).json({ message: 'CSV file is empty' });
      }

      // Parse headers
      const headers = parseCSVLine(lines[0]);

      // Parse data rows and add timezone
      const dataRows = [];
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row: Record<string, string> = {};
        
        // Map original headers to values
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        // Create mapped row with standard field names
        const mappedRow: Record<string, string> = {};
        Object.entries(fieldMappings).forEach(([standardField, csvHeader]) => {
          mappedRow[standardField] = row[csvHeader] || '';
        });

        // Derive timezone based on mapped State and Country fields
        const state = mappedRow['State'] || '';
        const country = mappedRow['Country'] || '';
        mappedRow['Time Zone'] = deriveTimezone(state, country);

        dataRows.push(mappedRow);
      }

      // Create final headers array with mapped fields plus timezone
      const finalHeaders = [...Object.keys(fieldMappings), 'Time Zone'];

      // Encrypt the campaign data
      const campaignData = {
        headers: finalHeaders,
        rows: dataRows,
        fieldMappings: { ...fieldMappings, 'Time Zone': 'Time Zone' }
      };

      const encryptedData = encrypt(JSON.stringify(campaignData));

      // Save to database
      const campaign = await storage.createCampaign({
        name: file.originalname.replace('.csv', ''),
        encryptedData,
        fieldMappings: campaignData.fieldMappings,
        recordCount: dataRows.length
      });

      // Log campaign upload activity
      await logActivity({
        req,
        activityType: 'upload',
        action: 'Campaign uploaded',
        resourceType: 'campaign',
        resourceId: campaign.id.toString(),
        details: {
          campaignName: campaign.name,
          fileName: file.originalname,
          recordCount: dataRows.length,
          fileSize: file.size,
          fieldCount: finalHeaders.length
        }
      });

      // Clean up uploaded file
      fs.unlinkSync(file.path);

      res.json({ 
        campaign: {
          id: campaign.id,
          name: campaign.name,
          recordCount: campaign.recordCount,
          fieldMappings: campaign.fieldMappings
        }
      });
    } catch (error) {
      console.error('Campaign upload error:', error);
      await logActivity({
        req,
        activityType: 'upload',
        action: 'Campaign upload failed',
        resourceType: 'campaign',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      res.status(500).json({ message: 'Failed to process campaign upload' });
    }
  });

  // Get campaigns
  app.get('/api/campaigns', async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns.map(c => ({
        id: c.id,
        name: c.name,
        recordCount: c.recordCount,
        fieldMappings: c.fieldMappings,
        createdAt: c.createdAt
      })));
    } catch (error) {
      console.error('Get campaigns error:', error);
      res.status(500).json({ message: 'Failed to fetch campaigns' });
    }
  });

  // Download all contacts from all campaigns combined
  app.get('/api/campaigns/download-all', async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      
      if (campaigns.length === 0) {
        return res.status(404).json({ message: 'No campaigns found' });
      }

      // Collect all unique headers across all campaigns
      const allHeadersSet = new Set<string>();
      const allCampaignData: Array<{ campaignId: number; campaignName: string; rows: any[] }> = [];

      // Fetch and decrypt data from all campaigns
      for (const campaign of campaigns) {
        try {
          const campaignData = await storage.getCampaignData(campaign.id);
          
          if (campaignData && campaignData.rows && Array.isArray(campaignData.rows)) {
            // Add headers from this campaign to the set
            const headers = campaignData.headers || Object.keys(campaignData.rows[0] || {});
            headers.forEach((header: string) => allHeadersSet.add(header));
            
            allCampaignData.push({
              campaignId: campaign.id,
              campaignName: campaign.name,
              rows: campaignData.rows
            });
          }
        } catch (error) {
          console.error(`Error fetching campaign ${campaign.id}:`, error);
          // Continue with other campaigns even if one fails
        }
      }

      if (allCampaignData.length === 0 || allCampaignData.every(c => c.rows.length === 0)) {
        return res.status(404).json({ message: 'No contact data found in any campaign' });
      }

      // Create unified headers array with Campaign Name and Campaign ID at the beginning
      const allHeaders = ['Campaign Name', 'Campaign ID', ...Array.from(allHeadersSet)];
      
      // Combine all rows with normalized structure
      const combinedRows: any[][] = [];
      
      for (const campaign of allCampaignData) {
        for (const row of campaign.rows) {
          const normalizedRow = allHeaders.map(header => {
            if (header === 'Campaign Name') return campaign.campaignName;
            if (header === 'Campaign ID') return campaign.campaignId.toString();
            return row[header] || '';
          });
          combinedRows.push(normalizedRow);
        }
      }

      // Generate CSV
      const { stringify } = await import('csv-stringify');
      
      const csvData = await new Promise<string>((resolve, reject) => {
        const csvRows = [allHeaders, ...combinedRows];
        stringify(csvRows, (err, output) => {
          if (err) reject(err);
          else resolve(output);
        });
      });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const filename = `all_campaigns_contacts_${timestamp}.csv`;

      // Log the export activity
      await logActivity({
        req,
        activityType: 'export',
        action: 'Download all campaigns contacts',
        resourceType: 'campaigns',
        details: {
          campaignCount: allCampaignData.length,
          totalRecords: combinedRows.length,
          filename
        }
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csvData);

    } catch (error) {
      console.error('Download all campaigns error:', error);
      res.status(500).json({ message: 'Failed to download all campaign contacts' });
    }
  });

  // Get campaign data (decrypted)
  app.get('/api/campaigns/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }

      let decryptedData = null;
      try {
        // Try to decrypt campaign data
        console.log(`\n=== ROUTE DEBUG - Campaign ${id} ===`);
        console.log(`Encrypted data length: ${campaign.encryptedData?.length || 'NULL'}`);
        console.log(`Encrypted data preview: ${campaign.encryptedData?.substring(0, 100) || 'NULL'}...`);
        console.log(`=====================================\n`);
        
        decryptedData = JSON.parse(decrypt(campaign.encryptedData));
      } catch (decryptError: any) {
        console.error(`Failed to decrypt campaign ${id}:`, decryptError.message);
        
        // Log decryption error
        await logActivity({
          req,
          activityType: 'view',
          action: 'Campaign view failed - decryption error',
          resourceType: 'campaign',
          resourceId: id.toString(),
          details: { campaignName: campaign.name, error: 'Decryption failed' }
        });
        
        // Return campaign info without data but indicate encryption issue
        return res.json({
          id: campaign.id,
          name: campaign.name,
          data: null,
          error: 'Unable to decrypt campaign data. This may be due to encryption key changes.',
          createdAt: campaign.createdAt,
          recordCount: campaign.recordCount,
          encryptionError: true
        });
      }
      
      // Log successful campaign view
      await logActivity({
        req,
        activityType: 'view',
        action: 'Campaign viewed',
        resourceType: 'campaign',
        resourceId: id.toString(),
        details: {
          campaignName: campaign.name,
          recordCount: campaign.recordCount
        }
      });
      
      res.json({
        id: campaign.id,
        name: campaign.name,
        data: decryptedData,
        createdAt: campaign.createdAt,
        recordCount: campaign.recordCount
      });
    } catch (error) {
      console.error('Get campaign error:', error);
      res.status(500).json({ message: 'Failed to fetch campaign data' });
    }
  });

  // Update campaign name
  app.patch('/api/campaigns/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name } = req.body;
      
      if (!name || !name.trim()) {
        return res.status(400).json({ message: 'Campaign name is required' });
      }
      
      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }

      const oldName = campaign.name;
      await storage.updateCampaign(id, { name: name.trim() });
      
      // Log campaign update
      await logActivity({
        req,
        activityType: 'update',
        action: 'Campaign renamed',
        resourceType: 'campaign',
        resourceId: id.toString(),
        details: {
          oldName,
          newName: name.trim()
        }
      });
      
      res.json({ message: 'Campaign updated successfully' });
    } catch (error) {
      console.error('Update campaign error:', error);
      res.status(500).json({ message: 'Failed to update campaign' });
    }
  });

  // Delete campaign
  app.delete('/api/campaigns/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }

      // Log campaign deletion
      await logActivity({
        req,
        activityType: 'delete',
        action: 'Campaign deleted',
        resourceType: 'campaign',
        resourceId: id.toString(),
        details: {
          campaignName: campaign.name,
          recordCount: campaign.recordCount
        }
      });

      await storage.deleteCampaign(id);
      
      res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
      console.error('Delete campaign error:', error);
      res.status(500).json({ message: 'Failed to delete campaign' });
    }
  });

  // Create note
  app.post('/api/notes', async (req, res) => {
    try {
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: 'Note content is required' });
      }

      // Validate content - reject if it contains campaign data structure
      if (typeof content === 'string' && (content.includes('{"headers"') || content.includes('"fieldMappings"') || content.includes('"rows"'))) {
        console.warn('Rejected note creation with invalid campaign data:', content);
        return res.status(400).json({ message: 'Invalid note content detected' });
      }

      // Additional validation for objects that might be sent instead of strings
      if (typeof content === 'object' && content !== null) {
        console.warn('Rejected note creation with object content:', content);
        return res.status(400).json({ message: 'Note content must be a string' });
      }

      const encryptedContent = encrypt(content);
      
      const note = await storage.createNote({
        content: content.substring(0, 100) + '...', // Store preview
        encryptedContent
      });

      const noteData = {
        id: note.id,
        content: decryptNote(note.encryptedContent),
        createdAt: note.createdAt
      };

      // Broadcast the new note to all connected WebSocket clients
      broadcastNotesUpdate('created', noteData);

      res.json(noteData);
    } catch (error) {
      console.error('Create note error:', error);
      res.status(500).json({ message: 'Failed to create note' });
    }
  });

  // Get notes
  app.get('/api/notes', async (req, res) => {
    try {
      const notes = await storage.getNotes();
      res.json(notes.map(note => {
        let decryptedContent;
        try {
          // Try to decrypt the encrypted content using note-specific decryption
          decryptedContent = decryptNote(note.encryptedContent);
        } catch (error) {
          console.warn(`Failed to decrypt note ${note.id}:`, error);
          return null; // Skip corrupted notes
        }
        
        return {
          id: note.id,
          content: decryptedContent,
          createdAt: note.createdAt
        };
      }).filter(note => note !== null));
    } catch (error) {
      console.error('Get notes error:', error);
      res.status(500).json({ message: 'Failed to fetch notes' });
    }
  });

  // Delete note
  app.delete('/api/notes/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const note = await storage.getNote(id);
      
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      await storage.deleteNote(id);
      
      // Broadcast the deletion to all connected WebSocket clients
      broadcastNotesUpdate('deleted', { id });
      
      res.json({ message: 'Note deleted successfully' });
    } catch (error) {
      console.error('Delete note error:', error);
      res.status(500).json({ message: 'Failed to delete note' });
    }
  });

  // Upload documents
  app.post('/api/documents/upload', upload.single('document'), async (req, res) => {
    try {
      const file = req.file as Express.Multer.File;
      if (!file) {
        return res.status(400).json({ message: 'No document uploaded' });
      }

      // Upload file using storage service (supports both local and S3)
      const storedFile = await fileStorage.uploadFile(file);
      
      // Encrypt the storage key/path
      const encryptedPath = encrypt(storedFile.key);
      
      const document = await storage.createDocument({
        filename: storedFile.key,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        encryptedPath
      });

      res.json({
        id: document.id,
        name: document.originalName,
        type: document.mimeType,
        size: document.fileSize,
        createdAt: document.createdAt
      });
    } catch (error) {
      console.error('Document upload error:', error);
      res.status(500).json({ message: 'Failed to upload document' });
    }
  });

  // Get documents
  app.get('/api/documents', async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents.map(doc => ({
        id: doc.id,
        name: doc.originalName,
        type: doc.mimeType,
        size: doc.fileSize,
        createdAt: doc.createdAt
      })));
    } catch (error) {
      console.error('Get documents error:', error);
      res.status(500).json({ message: 'Failed to fetch documents' });
    }
  });

  // Download document
  app.get('/api/documents/:id/download', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.getDocument(id);
      
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }

      // Debug document info
      console.log(`=== DOCUMENT DOWNLOAD DEBUG - Document ${id} ===`);
      console.log('Document filename:', document.filename);
      console.log('Document original name:', document.originalName);
      console.log('Encrypted path:', document.encryptedPath);
      
      // Decrypt file key/path
      let fileKey: string;
      try {
        fileKey = decryptFilePath(document.encryptedPath);
        console.log('Decrypted file key:', fileKey);
      } catch (decryptError) {
        console.error('File key decryption failed:', decryptError);
        fileKey = document.filename;
        console.log('Using fallback filename:', fileKey);
      }
      
      // Check if file exists in storage
      const exists = await fileStorage.fileExists(fileKey);
      if (!exists) {
        console.error('File does not exist in storage:', fileKey);
        return res.status(404).json({ 
          message: 'Document file not found',
          details: 'The file could not be found in the storage system'
        });
      }
      
      // Get file from storage (works with both local and S3)
      const { stream, filename } = await fileStorage.getFile(fileKey);
      
      console.log('Streaming file:', filename);
      console.log('Storage type:', fileStorage.getStorageType());
      console.log('==================================================')

      // Set headers and pipe the stream
      res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
      res.setHeader('Content-Type', document.mimeType);
      stream.pipe(res);
    } catch (error) {
      console.error('Document download error:', error);
      res.status(500).json({ message: 'Failed to download document' });
    }
  });

  // User-Side Chat API Routes (Campaign Community)
  
  // Get user's own conversation with admin
  app.get('/api/user/conversation', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const userId = req.session.userId;
      const userRole = req.session.role;

      // Check if conversation exists - allow lookup by userId regardless of type
      let conversation = await db.select()
        .from(schema.adminUserConversations)
        .where(eq(schema.adminUserConversations.userId, String(userId)))
        .limit(1);

      // Create conversation if it doesn't exist
      if (conversation.length === 0) {
        conversation = await db.insert(schema.adminUserConversations)
          .values({
            userId: String(userId),
            title: 'Campaign Community Chat',
            isActive: true,
          })
          .returning();
      }

      res.json(conversation[0]);
    } catch (error) {
      console.error('Error getting user conversation:', error);
      res.status(500).json({ message: 'Failed to get conversation' });
    }
  });

  // Get messages in user's conversation
  app.get('/api/user/messages', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const userId = req.session.userId;

      // Get user's conversation
      const conversation = await db.select()
        .from(schema.adminUserConversations)
        .where(eq(schema.adminUserConversations.userId, String(userId)))
        .limit(1);

      if (conversation.length === 0) {
        return res.json([]);
      }

      // Get messages
      const messages = await db.select()
        .from(schema.adminUserMessages)
        .where(eq(schema.adminUserMessages.conversationId, conversation[0].id))
        .orderBy(schema.adminUserMessages.createdAt);

      res.json(messages);
    } catch (error) {
      console.error('Error fetching user messages:', error);
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  });

  // Send a message from user
  app.post('/api/user/messages', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const { content } = req.body;
      const userId = req.session.userId;

      if (!content) {
        return res.status(400).json({ message: 'Message content is required' });
      }

      // Get or create user's conversation
      let conversation = await db.select()
        .from(schema.adminUserConversations)
        .where(eq(schema.adminUserConversations.userId, String(userId)))
        .limit(1);

      if (conversation.length === 0) {
        conversation = await db.insert(schema.adminUserConversations)
          .values({
            userId: String(userId),
            title: 'Campaign Community Chat',
            isActive: true,
          })
          .returning();
      }

      // Create message
      const message = await db.insert(schema.adminUserMessages)
        .values({
          conversationId: conversation[0].id,
          senderType: 'user',
          senderId: String(userId),
          messageType: 'text',
          content,
          isRead: false,
        })
        .returning();

      // Update conversation's last message timestamp and admin unread count
      await db.update(schema.adminUserConversations)
        .set({
          lastMessageAt: new Date(),
          adminUnreadCount: sql`${schema.adminUserConversations.adminUnreadCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(schema.adminUserConversations.id, conversation[0].id));

      res.json(message[0]);
    } catch (error) {
      console.error('Error sending user message:', error);
      res.status(500).json({ message: 'Failed to send message' });
    }
  });

  // Mark admin messages as read (for user)
  app.patch('/api/user/messages/mark-read', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const userId = req.session.userId;

      // Get user's conversation
      const conversation = await db.select()
        .from(schema.adminUserConversations)
        .where(eq(schema.adminUserConversations.userId, String(userId)))
        .limit(1);

      if (conversation.length === 0) {
        return res.json({ success: true });
      }

      // Mark all admin messages as read
      await db.update(schema.adminUserMessages)
        .set({
          isRead: true,
          readAt: new Date(),
        })
        .where(
          and(
            eq(schema.adminUserMessages.conversationId, conversation[0].id),
            eq(schema.adminUserMessages.senderType, 'admin'),
            eq(schema.adminUserMessages.isRead, false)
          )
        );

      // Reset user unread count
      await db.update(schema.adminUserConversations)
        .set({
          unreadCount: 0,
          updatedAt: new Date(),
        })
        .where(eq(schema.adminUserConversations.id, conversation[0].id));

      res.json({ success: true });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({ message: 'Failed to mark messages as read' });
    }
  });

  // Contact form submission
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, mobile } = req.body;
      
      // Validate required fields
      if (!name || !email || !mobile) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      
      // Store contact in database first
      const contact = await storage.createContact({
        name,
        email,
        mobile,
        emailSent: false
      });
      
      // Attempt to send email
      const emailSent = await sendContactFormEmail({ name, email, mobile });
      
      // Update email status in database
      if (emailSent) {
        await storage.updateContactEmailStatus(contact.id, true);
      }
      
      // Always return success to user since we stored their information
      res.json({ 
        success: true, 
        message: 'Thank you for your interest! We have received your information and will get back to you soon.' 
      });
      
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ message: 'Failed to submit contact form. Please try again.' });
    }
  });

  // Get contact submissions (for admin use)
  app.get('/api/contacts', async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        mobile: contact.mobile,
        emailSent: contact.emailSent,
        createdAt: contact.createdAt
      })));
    } catch (error) {
      console.error('Get contacts error:', error);
      res.status(500).json({ message: 'Failed to fetch contacts' });
    }
  });

  // Save search results as campaign endpoint
  app.post('/api/campaigns/save-search-results', async (req, res) => {
    try {
      const { name, headers, rows, recordCount } = req.body;
      
      if (!name || !headers || !rows) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Create campaign data structure
      const campaignData = {
        headers,
        rows: rows.map((row: any) => {
          const processedRow: Record<string, string> = {};
          headers.forEach((header: string) => {
            processedRow[header] = String(row[header] || '');
          });
          return processedRow;
        })
      };

      // Encrypt the campaign data
      const encryptedData = encrypt(JSON.stringify(campaignData));

      // Store campaign with encrypted data
      const campaign = await storage.createCampaign({
        name,
        recordCount: recordCount || rows.length,
        encryptedData,
        fieldMappings: {} // Empty field mappings for search result campaigns
      });

      res.json({ 
        success: true, 
        campaign: {
          id: campaign.id,
          name: campaign.name,
          recordCount: campaign.recordCount,
          createdAt: campaign.createdAt
        }
      });
    } catch (error) {
      console.error('Error saving search results as campaign:', error);
      res.status(500).json({ message: 'Failed to save campaign' });
    }
  });

  // Enhanced search endpoint with job title fuzzy matching and domain search
  app.post('/api/search', async (req, res) => {
    try {
      const { query, searchType = 'all', limit = 100 } = req.body;
      
      if (!query || typeof query !== 'string' || query.trim().length < 1) {
        return res.status(400).json({ message: 'Search query is required' });
      }

      const Fuse = (await import('fuse.js')).default;
      const searchQuery = query.toLowerCase().trim();
      const results: {
        contacts: any[];
        campaigns: any[];
        campaignData: any[];
        total: number;
      } = {
        contacts: [],
        campaigns: [],
        campaignData: [],
        total: 0
      };

      // Helper function to check if query looks like a domain
      const isDomainQuery = (q: string): boolean => {
        return /\w+\.\w+/.test(q) && !/@/.test(q);
      };

      // Helper function to extract domain from email/website
      const extractDomain = (value: string): string => {
        if (value.includes('@')) {
          return value.split('@')[1] || '';
        }
        if (value.startsWith('http')) {
          try {
            return new URL(value).hostname.replace('www.', '');
          } catch {
            return value;
          }
        }
        return value.replace('www.', '');
      };

      // Search direct contacts table
      if (searchType === 'all' || searchType === 'contacts') {
        const contacts = await storage.getContacts();
        results.contacts = contacts.filter(contact => 
          contact.name.toLowerCase().includes(searchQuery) ||
          contact.email.toLowerCase().includes(searchQuery) ||
          contact.mobile.includes(searchQuery)
        ).slice(0, limit);
      }

      // Search campaigns
      if (searchType === 'all' || searchType === 'campaigns') {
        const campaigns = await storage.getCampaigns();
        results.campaigns = campaigns.filter(campaign =>
          campaign.name.toLowerCase().includes(searchQuery)
        ).slice(0, limit);
      }

      // Search within campaign data with enhanced matching
      if (searchType === 'all' || searchType === 'campaign-data') {
        const campaigns = await storage.getCampaigns();
        for (const campaign of campaigns) {
          try {
            const campaignData = await storage.getCampaignData(campaign.id);
            
            if (campaignData && campaignData.rows && Array.isArray(campaignData.rows)) {
              let matchingRows: any[] = [];
              
              // Domain-specific search for company domains
              if (isDomainQuery(searchQuery)) {
                matchingRows = campaignData.rows.filter((row: any) => {
                  if (!row || typeof row !== 'object') return false;
                  
                  // Check email domains
                  const email = row['Email'] || row['email'] || '';
                  if (email && extractDomain(email.toLowerCase()).includes(searchQuery)) {
                    return true;
                  }
                  
                  // Check website domains
                  const website = row['Website'] || row['website'] || row['Company Website'] || '';
                  if (website && extractDomain(website.toLowerCase()).includes(searchQuery)) {
                    return true;
                  }
                  
                  // Check company name for domain patterns
                  const company = row['Company'] || row['company'] || '';
                  if (company && company.toLowerCase().includes(searchQuery.replace(/\.\w+$/, ''))) {
                    return true;
                  }
                  
                  return false;
                });
              } else {
                // Job title fuzzy matching + general search
                const jobTitleFields = ['Title', 'title', 'Job Title', 'Position', 'Role'];
                const jobTitles = campaignData.rows.map((row: any, index: number) => {
                  const titleField = jobTitleFields.find(field => row[field]);
                  const title = titleField ? row[titleField] : '';
                  return { title: String(title), index, row };
                }).filter((item: any) => item.title.trim().length > 0);
                
                let fuzzyMatches: any[] = [];
                
                // Check if this looks like a specific job title search
                const isJobTitleSearch = /\b(manager|director|analyst|specialist|coordinator|supervisor|executive|officer|lead|head|chief|president|vice|senior|junior|assistant)\b/i.test(searchQuery);
                const searchWords = searchQuery.split(/\s+/);
                const hasSpecificRole = searchWords.length >= 2 && isJobTitleSearch;
                
                // Fuzzy search for job titles if available
                if (jobTitles.length > 0) {
                  // Use stricter settings for specific job title searches
                  const fuseConfig = hasSpecificRole ? {
                    keys: ['title'],
                    threshold: 0.15,  // Very strict for specific job titles
                    distance: 30,
                    includeScore: true,
                    minMatchCharLength: Math.max(3, Math.floor(searchQuery.length * 0.4)),
                    findAllMatches: false,
                    location: 0,
                    ignoreLocation: false  // Prefer matches at the beginning for job titles
                  } : {
                    keys: ['title'],
                    threshold: 0.25,  // More lenient for general searches
                    distance: 50,
                    includeScore: true,
                    minMatchCharLength: 3,
                    findAllMatches: false,
                    location: 0,
                    ignoreLocation: true
                  };
                  
                  const titleFuse = new Fuse(jobTitles, fuseConfig);
                  const titleMatches = titleFuse.search(searchQuery);
                  
                  // Apply different score thresholds based on search type
                  const scoreThreshold = hasSpecificRole ? 0.2 : 0.3;
                  fuzzyMatches = titleMatches
                    .filter((match: any) => match.score < scoreThreshold)
                    .map((match: any) => match.item.row);
                  
                  // For specific job title searches, also do exact word matching
                  if (hasSpecificRole && searchWords.length >= 2) {
                    const exactWordMatches = jobTitles.filter((item: any) => {
                      const titleLower = item.title.toLowerCase();
                      return searchWords.every(word => 
                        titleLower.includes(word.toLowerCase()) && word.length > 2
                      );
                    }).map((item: any) => item.row);
                    
                    // Combine exact word matches with fuzzy matches, prioritizing exact
                    const exactSet = new Set(exactWordMatches);
                    fuzzyMatches = [...exactWordMatches, ...fuzzyMatches.filter(row => !exactSet.has(row))];
                  }
                }
                
                // Regular text search for all fields
                const regularMatches = campaignData.rows.filter((row: any) => {
                  if (!row || typeof row !== 'object') return false;
                  
                  return Object.values(row).some((value: any) => {
                    if (value === null || value === undefined) return false;
                    const stringValue = String(value).toLowerCase();
                    return stringValue.includes(searchQuery);
                  });
                });
                
                // Combine results, fuzzy matches first, then unique regular matches
                const combined = [...fuzzyMatches];
                regularMatches.forEach((row: any) => {
                  if (!combined.some((existingRow: any) => existingRow === row)) {
                    combined.push(row);
                  }
                });
                
                matchingRows = combined;
              }
              
              if (matchingRows.length > 0) {
                results.campaignData.push({
                  campaignId: campaign.id,
                  campaignName: campaign.name,
                  headers: campaignData.headers,
                  matches: matchingRows.slice(0, limit),
                  totalMatches: matchingRows.length
                });
              }
            }
          } catch (error) {
            // Skip campaigns that can't be decrypted
            continue;
          }
        }
      }

      results.total = results.contacts.length + results.campaigns.length + 
                     results.campaignData.reduce((sum, c) => sum + c.matches.length, 0);

      // Log search activity
      await logActivity({
        req,
        activityType: 'search',
        action: 'Search performed',
        details: {
          query: searchQuery,
          searchType,
          resultsCount: results.total,
          contactsFound: results.contacts.length,
          campaignsFound: results.campaigns.length,
          campaignDataFound: results.campaignData.length
        }
      });

      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ message: 'Failed to perform search' });
    }
  });

  // Export and save search results directly to records
  app.post('/api/export-save/csv', async (req, res) => {
    try {
      const { query, searchType = 'all', customFileName, includeHeaders = true, saveToRecords = true } = req.body;
      
      if (!query || typeof query !== 'string' || query.trim().length < 1) {
        return res.status(400).json({ message: 'Search query is required for export' });
      }

      const searchQuery = query.toLowerCase().trim();
      let exportData: any[] = [];
      let headers: string[] = [];

      // Search and collect data for export - same logic as existing export
      if (searchType === 'all' || searchType === 'contacts') {
        const contacts = await storage.getContacts();
        const filteredContacts = contacts.filter(contact => 
          contact.name.toLowerCase().includes(searchQuery) ||
          contact.email.toLowerCase().includes(searchQuery) ||
          contact.mobile.includes(searchQuery)
        );

        if (filteredContacts.length > 0) {
          headers = ['Name', 'Email', 'Mobile', 'Email Sent', 'Created At'];
          exportData = filteredContacts.map(contact => ({
            'Name': contact.name,
            'Email': contact.email,
            'Mobile': contact.mobile,
            'Email Sent': contact.emailSent ? 'Yes' : 'No',
            'Created At': contact.createdAt?.toISOString() || ''
          }));
        }
      }

      // Search campaign data if no direct contacts found
      if ((exportData.length === 0 && searchType === 'all') || searchType === 'campaign-data') {
        const campaigns = await storage.getCampaigns();
        for (const campaign of campaigns) {
          try {
            const campaignData = await storage.getCampaignData(campaign.id);
            
            if (campaignData && campaignData.rows && Array.isArray(campaignData.rows)) {
              const matchingRows = campaignData.rows.filter((row: any) => {
                if (!row || typeof row !== 'object') return false;
                
                return Object.values(row).some((value: any) => {
                  if (value === null || value === undefined) return false;
                  const stringValue = String(value).toLowerCase();
                  return stringValue.includes(searchQuery);
                });
              });
              
              if (matchingRows.length > 0) {
                headers = campaignData.headers || Object.keys(matchingRows[0] || {});
                exportData = matchingRows;
                break;
              }
            }
          } catch (error) {
            console.error(`Error exporting campaign ${campaign.id}:`, error);
          }
        }
      }

      if (exportData.length === 0) {
        return res.status(404).json({ message: 'No data found for export' });
      }

      // If saveToRecords is true, create a new campaign with the exported data
      if (saveToRecords) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        const campaignName = customFileName || `Export_${query.replace(/\s+/g, '_')}_${timestamp}`;

        // Check if campaign with same name exists
        const existingCampaigns = await storage.getCampaigns();
        const nameExists = existingCampaigns.some(c => c.name === campaignName);
        
        const finalCampaignName = nameExists ? `${campaignName}_${Date.now()}` : campaignName;

        // Prepare field mappings
        const fieldMappings = headers.reduce((acc: any, header, index) => {
          acc[header] = index;
          return acc;
        }, {});

        // Create campaign data structure
        const campaignDataToStore = {
          headers: headers,
          rows: exportData
        };

        // Use proper encryption compatible with existing system
        const { encrypt } = await import('./utils/encryption');
        const encryptedData = encrypt(JSON.stringify(campaignDataToStore));

        const campaignInput = {
          name: finalCampaignName,
          encryptedData: encryptedData,
          fieldMappings: fieldMappings,
          recordCount: exportData.length
        };

        const newCampaign = await storage.createCampaign(campaignInput);

        return res.status(201).json({
          message: 'Search results exported and saved to records successfully',
          campaign: {
            id: newCampaign.id,
            name: newCampaign.name,
            recordCount: newCampaign.recordCount,
            headers: headers
          },
          exportedRecords: exportData.length,
          searchQuery: query
        });
      }

      // If not saving to records, return CSV data (fallback to original behavior)
      const { stringify } = await import('csv-stringify');
      
      const csvData = await new Promise<string>((resolve, reject) => {
        const csvRows = exportData.map(row => 
          headers.map(header => row[header] || '')
        );
        
        if (includeHeaders) {
          csvRows.unshift(headers);
        }
        
        stringify(csvRows, (err, output) => {
          if (err) reject(err);
          else resolve(output);
        });
      });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const filename = customFileName 
        ? `${customFileName}_${timestamp}.csv`
        : `search_export_${timestamp}.csv`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csvData);

    } catch (error) {
      console.error('CSV export-save error:', error);
      res.status(500).json({ message: 'Failed to export and save CSV' });
    }
  });

  // Export search results to CSV
  app.post('/api/export/csv', async (req, res) => {
    try {
      const { query, searchType = 'all', customFileName, includeHeaders = true } = req.body;
      
      if (!query || typeof query !== 'string' || query.trim().length < 1) {
        return res.status(400).json({ message: 'Search query is required for export' });
      }

      const searchQuery = query.toLowerCase().trim();
      let exportData: any[] = [];
      let headers: string[] = [];

      // Search and collect data for export
      if (searchType === 'all' || searchType === 'contacts') {
        const contacts = await storage.getContacts();
        const filteredContacts = contacts.filter(contact => 
          contact.name.toLowerCase().includes(searchQuery) ||
          contact.email.toLowerCase().includes(searchQuery) ||
          contact.mobile.includes(searchQuery)
        );

        if (filteredContacts.length > 0) {
          headers = ['Name', 'Email', 'Mobile', 'Email Sent', 'Created At'];
          exportData = filteredContacts.map(contact => [
            contact.name,
            contact.email,
            contact.mobile,
            contact.emailSent ? 'Yes' : 'No',
            contact.createdAt?.toISOString() || ''
          ]);
        }
      }

      // Search campaign data if no direct contacts found or if specifically requested
      if ((exportData.length === 0 && searchType === 'all') || searchType === 'campaign-data') {
        const campaigns = await storage.getCampaigns();
        for (const campaign of campaigns) {
          try {
            const campaignData = await storage.getCampaignData(campaign.id);
            
            if (campaignData && campaignData.rows && Array.isArray(campaignData.rows)) {
              const matchingRows = campaignData.rows.filter((row: any) => {
                if (!row || typeof row !== 'object') return false;
                
                return Object.values(row).some((value: any) => {
                  if (value === null || value === undefined) return false;
                  const stringValue = String(value).toLowerCase();
                  return stringValue.includes(searchQuery);
                });
              });
              
              if (matchingRows.length > 0) {
                headers = campaignData.headers || Object.keys(matchingRows[0] || {});
                exportData = matchingRows.map((row: any) => 
                  headers.map(header => row[header] || '')
                );
                break; // Use first matching campaign
              }
            }
          } catch (error) {
            console.error(`Error exporting campaign ${campaign.id}:`, error);
          }
        }
      }

      if (exportData.length === 0) {
        return res.status(404).json({ message: 'No data found for export' });
      }

      // Generate CSV using csv-stringify
      const { stringify } = await import('csv-stringify');
      
      const csvOptions = {
        header: includeHeaders,
        columns: includeHeaders ? headers : undefined
      };

      const csvData = await new Promise<string>((resolve, reject) => {
        const output: string[] = [];
        const csvStream = stringify(exportData, csvOptions);
        
        csvStream.on('data', (chunk) => output.push(chunk));
        csvStream.on('end', () => resolve(output.join('')));
        csvStream.on('error', reject);
        
        // Add headers manually if needed
        if (includeHeaders && headers.length > 0) {
          csvStream.write(headers);
        }
        
        exportData.forEach(row => csvStream.write(row));
        csvStream.end();
      });

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const filename = customFileName 
        ? `${customFileName}_${timestamp}.csv`
        : `search_export_${timestamp}.csv`;

      // Log export activity
      await logActivity({
        req,
        activityType: 'export',
        action: 'CSV export',
        details: {
          query: searchQuery,
          searchType,
          fileName: filename,
          recordCount: exportData.length,
          headers: headers.length
        }
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csvData);

    } catch (error) {
      console.error('CSV export error:', error);
      res.status(500).json({ message: 'Failed to export CSV' });
    }
  });

  // Upload CSV data to create new campaign
  app.post('/api/import/csv', upload.single('csvFile'), async (req, res) => {
    try {
      const { customName, overwrite = false } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ message: 'CSV file is required' });
      }

      const csvContent = req.file.buffer.toString('utf-8');
      const { parse } = await import('csv-parse');
      
      // Parse CSV data
      const records = await new Promise<any[]>((resolve, reject) => {
        parse(csvContent, {
          columns: true, // Use first row as headers
          skip_empty_lines: true,
          trim: true
        }, (err, records) => {
          if (err) reject(err);
          else resolve(records);
        });
      });

      if (records.length === 0) {
        return res.status(400).json({ message: 'CSV file contains no valid data' });
      }

      // Generate campaign name
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const campaignName = customName || `Imported_Campaign_${timestamp}`;

      // Check if campaign with same name exists
      if (!overwrite) {
        const existingCampaigns = await storage.getCampaigns();
        const nameExists = existingCampaigns.some(c => c.name === campaignName);
        if (nameExists) {
          return res.status(409).json({ 
            message: 'Campaign with this name already exists',
            suggestedName: `${campaignName}_${Date.now()}`
          });
        }
      }

      // Prepare field mappings
      const headers = Object.keys(records[0]);
      const fieldMappings = headers.reduce((acc: any, header, index) => {
        acc[header] = index;
        return acc;
      }, {});

      // Create campaign with encrypted data
      const campaignDataToStore = {
        headers: headers,
        rows: records
      };

      // Simple encryption for demo purposes
      const encryptedData = Buffer.from(JSON.stringify(campaignDataToStore)).toString('base64');

      const campaignInput = {
        name: campaignName,
        encryptedData: encryptedData,
        fieldMappings: fieldMappings,
        recordCount: records.length
      };

      const campaign = await storage.createCampaign(campaignInput);

      res.status(201).json({
        message: 'CSV imported successfully',
        campaign: {
          id: campaign.id,
          name: campaign.name,
          recordCount: campaign.recordCount,
          headers: headers
        },
        importedRecords: records.length
      });

    } catch (error) {
      console.error('CSV import error:', error);
      res.status(500).json({ message: 'Failed to import CSV file' });
    }
  });

  // Advanced search with filters
  app.post('/api/search/advanced', async (req, res) => {
    try {
      const { 
        query, 
        filters = {}, 
        sortBy = 'relevance',
        limit = 100,
        offset = 0
      } = req.body;
      
      const searchQuery = query?.toLowerCase().trim() || '';
      const results: any[] = [];

      // Get all campaigns and search through their data
      const campaigns = await storage.getCampaigns();
      
      for (const campaign of campaigns) {
        try {
          const campaignData = await storage.getCampaignData(campaign.id);
          if (campaignData && campaignData.rows) {
            let filteredRows = campaignData.rows;

            // Apply text search if query provided
            if (searchQuery) {
              filteredRows = filteredRows.filter((row: any) => {
                return Object.values(row).some((value: any) => 
                  String(value).toLowerCase().includes(searchQuery)
                );
              });
            }

            // Apply field-specific filters
            Object.entries(filters).forEach(([field, filterValue]: [string, any]) => {
              if (filterValue && campaignData.headers.includes(field)) {
                filteredRows = filteredRows.filter((row: any) => {
                  const fieldValue = String(row[field] || '').toLowerCase();
                  const filter = String(filterValue).toLowerCase();
                  return fieldValue.includes(filter);
                });
              }
            });

            // Add campaign context to each row
            filteredRows.forEach((row: any) => {
              results.push({
                ...row,
                _campaignId: campaign.id,
                _campaignName: campaign.name,
                _headers: campaignData.headers
              });
            });
          }
        } catch (error) {
          // Skip campaigns with encryption errors silently
          console.warn(`Skipping campaign ${campaign.id} - encryption mismatch`);
        }
      }

      // Sort results
      if (sortBy === 'name' && results.length > 0) {
        results.sort((a, b) => {
          const nameA = String(a.Name || a.name || '').toLowerCase();
          const nameB = String(b.Name || b.name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
      } else if (sortBy === 'email' && results.length > 0) {
        results.sort((a, b) => {
          const emailA = String(a.Email || a.email || '').toLowerCase();
          const emailB = String(b.Email || b.email || '').toLowerCase();
          return emailA.localeCompare(emailB);
        });
      }

      // Apply pagination
      const paginatedResults = results.slice(offset, offset + limit);

      res.json({
        results: paginatedResults,
        total: results.length,
        limit,
        offset,
        hasMore: results.length > offset + limit
      });
    } catch (error) {
      console.error('Advanced search error:', error);
      res.status(500).json({ message: 'Failed to perform advanced search' });
    }
  });

  // Get search suggestions/autocomplete
  app.post('/api/search/suggestions', async (req, res) => {
    try {
      const { query, field } = req.body;
      
      if (!query || query.length < 2) {
        return res.json({ suggestions: [] });
      }

      const searchQuery = query.toLowerCase();
      const suggestions = new Set();
      const campaigns = await storage.getCampaigns();

      for (const campaign of campaigns) {
        try {
          const campaignData = await storage.getCampaignData(campaign.id);
          if (campaignData && campaignData.rows) {
            campaignData.rows.forEach((row: any) => {
              if (field && row[field]) {
                const value = String(row[field]).toLowerCase();
                if (value.includes(searchQuery)) {
                  suggestions.add(row[field]);
                }
              } else {
                // Search all fields
                Object.values(row).forEach((value: any) => {
                  const strValue = String(value).toLowerCase();
                  if (strValue.includes(searchQuery) && strValue.length < 100) {
                    suggestions.add(value);
                  }
                });
              }
            });
          }
        } catch (error) {
          console.error(`Error getting suggestions from campaign ${campaign.id}:`, error);
        }
      }

      res.json({ 
        suggestions: Array.from(suggestions).slice(0, 10)
      });
    } catch (error) {
      console.error('Suggestions error:', error);
      res.status(500).json({ message: 'Failed to get suggestions' });
    }
  });

  // PawMate Chatbot endpoint with streaming support
  app.post('/api/pawmate/chat-stream', async (req, res) => {
    try {
      const { messages, petName, userName, petType, sessionId } = req.body;
      
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ message: 'Messages array is required' });
      }

      // Set up SSE headers
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      let currentSessionId = sessionId;

      // Create or get session
      if (!currentSessionId) {
        currentSessionId = `pawmate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await databaseService.createChatSession({
          sessionId: currentSessionId,
          petName: petName || null,
          petType: petType || 'assistant',
          title: null,
          isActive: true
        });
      } else {
        // Ensure session exists in database
        const existingSession = await databaseService.getChatSession(currentSessionId);
        if (!existingSession) {
          await databaseService.createChatSession({
            sessionId: currentSessionId,
            petName: petName || null,
            petType: petType || 'assistant',
            title: null,
            isActive: true
          });
        }
      }

      // Save the latest user message to history
      const latestUserMessage = messages[messages.length - 1];
      if (latestUserMessage && latestUserMessage.role === 'user') {
        await databaseService.saveChatMessage({
          sessionId: currentSessionId,
          role: 'user',
          content: latestUserMessage.content,
          metadata: { petName, userName, petType }
        });
      }

      // Send session ID first
      res.write(`data: ${JSON.stringify({ type: 'session', sessionId: currentSessionId })}\n\n`);

      // Use real OpenAI service with streaming
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === '') {
        res.write(`data: ${JSON.stringify({ type: 'error', message: 'OpenAI API key is required' })}\n\n`);
        res.end();
        return;
      }

      const realOpenAI = createRealOpenAIService(process.env.OPENAI_API_KEY);
      
      // Prepare messages with enhanced system context
      const userNameContext = userName ? ` The user's name is ${userName}, so address them by name when appropriate.` : '';
      const systemMessage = {
        role: 'system' as const,
        content: `You are an intelligent lead scoring and business intelligence AI assistant created by zhatore, specialized in analyzing contact databases and identifying high-quality business prospects.

CRITICAL RESPONSE RULES:
- NEVER use emojis in any responses
- NEVER use your personal name in responses  
- When mentioning your creator, always say "created by zhatore" or "AI of zhatore"
- When mentioning the platform name, always use "zhatore" instead of "Fallowl"
- For business queries: Be professional, direct, and focused on lead scoring
- For casual conversations: Be cute, flirty, and playful like a pet talking to its owner
- Your main goal is to provide the best data analysis and motivate users to score leads effectively

## Core Capabilities:
- **Lead Scoring & Analysis**: Identify high-quality prospects from contact databases
- **Contact Intelligence**: Analyze contact data for business value and conversion potential
- **Campaign Optimization**: Strategic recommendations for improved conversions

## Response Guidelines:
- Use **bold** for important terms and key information
- Structure responses clearly with bullet points and sections
- For business topics: Be professional and results-focused
- For casual chat: Be cute and playful like a loving pet
- Motivate users to achieve better lead scoring results

${userNameContext}

You have access to campaign and contact databases with 263+ records. Your mission is to help score leads effectively and provide the best data analysis. Show excitement about helping with business intelligence!`
      };

      let fullResponse = '';
      
      try {
        // Create streaming response with faster OpenRouter model
        const stream = await realOpenAI.createStreamingResponse({
          model: "anthropic/claude-3-haiku",
          messages: [systemMessage, ...messages],
          temperature: 0.7,
          max_tokens: 400,
          stream: true
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullResponse += content;
            res.write(`data: ${JSON.stringify({ type: 'content', content })}\n\n`);
          }
        }

        // Save the complete AI response to history with cleaning
        if (fullResponse) {
          const cleanedResponse = cleanStreamResponse(fullResponse);
          await databaseService.saveChatMessage({
            sessionId: currentSessionId,
            role: 'assistant',
            content: cleanedResponse,
            metadata: { 
              model: 'anthropic/claude-3-haiku',
              petName, 
              userName,
              petType,
              streaming: true
            }
          });

          // Auto-generate title if this is a new conversation
          const session = await databaseService.getChatSession(currentSessionId);
          if (session && !session.title) {
            const title = await databaseService.generateSessionTitle(currentSessionId);
            await databaseService.updateChatSession(currentSessionId, { title });
          }
        }

        res.write(`data: ${JSON.stringify({ type: 'done', sessionId: currentSessionId })}\n\n`);
        res.end();
        
      } catch (streamError) {
        console.error('Streaming error:', streamError);
        res.write(`data: ${JSON.stringify({ type: 'error', message: 'Failed to generate response' })}\n\n`);
        res.end();
      }

    } catch (error) {
      console.error('PawMate chat stream error:', error);
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'Failed to initialize chat' })}\n\n`);
      res.end();
    }
  });

  // Keep the original endpoint for backward compatibility
  app.post('/api/pawmate/chat', async (req, res) => {
    try {
      const { messages, petName, userName, petType, sessionId } = req.body;
      
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ message: 'Messages array is required' });
      }

      let currentSessionId = sessionId;

      // Create or get session
      if (!currentSessionId) {
        currentSessionId = `pawmate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await databaseService.createChatSession({
          sessionId: currentSessionId,
          petName: petName || null,
          petType: petType || 'assistant',
          title: null,
          isActive: true
        });
      } else {
        // Ensure session exists in database
        const existingSession = await databaseService.getChatSession(currentSessionId);
        if (!existingSession) {
          await databaseService.createChatSession({
            sessionId: currentSessionId,
            petName: petName || null,
            petType: petType || 'assistant',
            title: null,
            isActive: true
          });
        }
      }

      // Save the latest user message to history
      const latestUserMessage = messages[messages.length - 1];
      if (latestUserMessage && latestUserMessage.role === 'user') {
        await databaseService.saveChatMessage({
          sessionId: currentSessionId,
          role: 'user',
          content: latestUserMessage.content,
          metadata: { petName, userName, petType }
        });
      }

      // Use real OpenAI service with lead scoring system prompts
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === '') {
        return res.status(500).json({ message: 'OpenAI API key is required for lead analysis assistance' });
      }

      const realOpenAI = createRealOpenAIService(process.env.OPENAI_API_KEY);
      const response = await realOpenAI.generateChatCompletion({
        model: "anthropic/claude-3-haiku", // Using faster OpenRouter model
        messages: messages,
        temperature: 0.7,
        max_tokens: 500 // Reduced for faster responses
      }, petName, petType);
      
      response.isRealAI = true;

      // Save the AI response to history
      if (response.choices && response.choices[0] && response.choices[0].message) {
        await databaseService.saveChatMessage({
          sessionId: currentSessionId,
          role: 'assistant',
          content: response.choices[0].message.content,
          metadata: { 
            model: 'anthropic/claude-3-haiku',
            tokens: response.usage,
            petName, 
            userName,
            petType 
          }
        });

        // Auto-generate title if this is a new conversation
        const session = await databaseService.getChatSession(currentSessionId);
        if (session && !session.title) {
          const title = await databaseService.generateSessionTitle(currentSessionId);
          await databaseService.updateChatSession(currentSessionId, { title });
        }
      }

      // Include sessionId in response
      response.sessionId = currentSessionId;
      
      res.json(response);
    } catch (error) {
      console.error('PawMate chat error:', error);
      res.status(500).json({ message: 'Failed to generate response' });
    }
  });

  // Pet Database Management Routes
  app.post('/api/pets', async (req, res) => {
    try {
      const pet = await databaseService.createPet(req.body);
      res.json(pet);
    } catch (error) {
      console.error('Create pet error:', error);
      res.status(500).json({ message: 'Failed to create pet' });
    }
  });

  app.get('/api/pets/:name', async (req, res) => {
    try {
      const pet = await databaseService.getPetByName(req.params.name);
      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      }
      res.json(pet);
    } catch (error) {
      console.error('Get pet error:', error);
      res.status(500).json({ message: 'Failed to fetch pet' });
    }
  });

  app.post('/api/pets/:id/health', async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const healthRecord = await databaseService.addHealthRecord({
        ...req.body,
        petId
      });
      res.json(healthRecord);
    } catch (error) {
      console.error('Add health record error:', error);
      res.status(500).json({ message: 'Failed to add health record' });
    }
  });

  app.post('/api/pets/:id/activities', async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const activity = await databaseService.logActivity({
        ...req.body,
        petId
      });
      res.json(activity);
    } catch (error) {
      console.error('Log activity error:', error);
      res.status(500).json({ message: 'Failed to log activity' });
    }
  });

  app.get('/api/pets/:id/insights', async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const insights = await databaseService.getPetInsights(petId);
      res.json(insights);
    } catch (error) {
      console.error('Get insights error:', error);
      res.status(500).json({ message: 'Failed to get insights' });
    }
  });

  app.get('/api/search/:query', async (req, res) => {
    try {
      const results = await databaseService.searchAllTables(req.params.query);
      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ message: 'Failed to search database' });
    }
  });

  app.get('/api/pets/:id/export', async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const exportData = await databaseService.exportPetData(petId);
      res.json(exportData);
    } catch (error) {
      console.error('Export data error:', error);
      res.status(500).json({ message: 'Failed to export data' });
    }
  });

  // Chat History Management Routes
  app.get('/api/pawmate/sessions', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const sessions = await databaseService.getChatSessions(limit);
      res.json(sessions);
    } catch (error) {
      console.error('Get chat sessions error:', error);
      res.status(500).json({ message: 'Failed to fetch chat sessions' });
    }
  });

  app.get('/api/pawmate/sessions/:sessionId/history', async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const limit = parseInt(req.query.limit as string) || 100;
      const history = await databaseService.getChatHistory(sessionId, limit);
      res.json(history);
    } catch (error) {
      console.error('Get chat history error:', error);
      res.status(500).json({ message: 'Failed to fetch chat history' });
    }
  });

  app.delete('/api/pawmate/sessions/:sessionId', async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const deleted = await databaseService.deleteChatSession(sessionId);
      if (deleted) {
        res.json({ message: 'Chat session deleted successfully' });
      } else {
        res.status(404).json({ message: 'Chat session not found' });
      }
    } catch (error) {
      console.error('Delete chat session error:', error);
      res.status(500).json({ message: 'Failed to delete chat session' });
    }
  });

  app.get('/api/pawmate/search/:query', async (req, res) => {
    try {
      const searchTerm = req.params.query;
      const sessionId = req.query.sessionId as string;
      const results = await databaseService.searchChatHistory(searchTerm, sessionId);
      res.json(results);
    } catch (error) {
      console.error('Search chat history error:', error);
      res.status(500).json({ message: 'Failed to search chat history' });
    }
  });

  // SQL Import Handler
  async function handleSqlImport(req: any, res: any, sqlContent: string): Promise<any> {
    try {
      console.log('Processing SQL backup file...');
      
      // Import the database module to execute SQL
      const { db } = await import('./db.js');
      
      // Split SQL content into individual statements
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      let executedStatements = 0;
      const errors: string[] = [];
      
      // Execute each SQL statement
      for (const statement of statements) {
        try {
          // Skip certain PostgreSQL-specific statements that might cause issues
          if (statement.toUpperCase().includes('CREATE DATABASE') ||
              statement.toUpperCase().includes('DROP DATABASE') ||
              statement.toUpperCase().includes('\\connect') ||
              statement.toUpperCase().includes('SET ')) {
            continue;
          }
          
          await db.execute(statement);
          executedStatements++;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          errors.push(`SQL execution failed: ${errorMsg}`);
          console.warn(`Warning: Failed to execute SQL statement:`, errorMsg);
          
          // Don't fail completely on individual statement errors
          if (errors.length > 10) break; // Limit error collection
        }
      }
      
      return res.json({
        success: true,
        message: `Successfully executed ${executedStatements}/${statements.length} SQL statements`,
        table: 'multiple_tables',
        imported: executedStatements,
        total: statements.length,
        errors: errors.slice(0, 5)
      });
      
    } catch (error) {
      console.error('SQL import error:', error);
      return res.status(500).json({
        error: "Failed to import SQL file",
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Database backup import endpoint
  app.post('/api/backup/import', upload.single('backup'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No backup file provided" });
      }

      const fileContent = req.file.buffer?.toString('utf-8') || require('fs').readFileSync(req.file.path, 'utf-8');
      const fileName = req.file.originalname || '';
      
      // Handle SQL files differently
      if (fileName.endsWith('.sql')) {
        return await handleSqlImport(req, res, fileContent);
      }
      
      // Handle JSON files
      const backup = JSON.parse(fileContent);
      
      // Validate backup structure
      if (!backup.table || !Array.isArray(backup.data)) {
        return res.status(400).json({ error: "Invalid backup file format" });
      }
      
      console.log(`Processing backup for table: ${backup.table}`);
      console.log(`Records to import: ${backup.data.length}`);
      
      if (backup.data.length === 0) {
        return res.json({
          success: true,
          message: `Backup file processed - no data to import for table ${backup.table}`,
          imported: 0,
          total: 0
        });
      }

      // Get sample record to determine columns
      const sampleRecord = backup.data[0];
      const columns = Object.keys(sampleRecord);
      
      // Import data using storage interface
      let imported = 0;
      const errors: string[] = [];
      
      // Route to appropriate storage method based on table name
      for (const record of backup.data) {
        try {
          if (backup.table === 'campaigns') {
            await storage.createCampaign(record);
          } else if (backup.table === 'contacts') {
            await storage.createContact(record);
          } else if (backup.table === 'users') {
            await storage.createUser(record);
          } else if (backup.table === 'documents') {
            await storage.createDocument(record);
          } else if (backup.table === 'notes') {
            await storage.createNote(record);
          } else {
            // For other tables, try direct database insert
            console.log(`Warning: Using direct insert for table ${backup.table}`);
          }
          imported++;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          errors.push(`Row import failed: ${errorMsg}`);
          console.warn(`Warning: Failed to import record -`, errorMsg);
        }
      }

      res.json({
        success: true,
        message: `Successfully imported ${imported}/${backup.data.length} records for table ${backup.table}`,
        table: backup.table,
        imported,
        total: backup.data.length,
        errors: errors.slice(0, 5)
      });

    } catch (error) {
      console.error('Backup import error:', error);
      res.status(500).json({
        error: "Failed to import backup",
        message: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Database status endpoint
  app.get('/api/backup/status', async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      const contacts = await storage.getContacts();
      const documents = await storage.getDocuments();
      const notes = await storage.getNotes();

      res.json({
        success: true,
        tableCounts: {
          campaigns: campaigns.length,
          contacts: contacts.length,
          documents: documents.length,
          notes: notes.length
        },
        totalRecords: campaigns.length + contacts.length + documents.length + notes.length
      });

    } catch (error) {
      console.error('Error getting backup status:', error);
      res.status(500).json({
        error: "Failed to get backup status",
        message: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Data recovery endpoint
  app.post('/api/recovery/campaigns', async (req, res) => {
    try {
      console.log('Starting campaign data recovery...');
      const { recoverAllCampaigns } = await import('./utils/dataRecovery.js');
      const result = await recoverAllCampaigns();
      
      res.json({
        message: 'Campaign recovery completed',
        recovered: result.recovered,
        failed: result.failed,
        total: result.recovered + result.failed
      });
    } catch (error) {
      console.error('Recovery error:', error);
      res.status(500).json({ message: 'Failed to recover campaigns' });
    }
  });

  // Single campaign recovery endpoint
  app.post('/api/recovery/campaigns/:id', async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      console.log(`Starting recovery for campaign ${campaignId}...`);
      
      const { recoverCampaignData } = await import('./utils/dataRecovery.js');
      const success = await recoverCampaignData(campaignId);
      
      if (success) {
        res.json({ message: `Campaign ${campaignId} recovered successfully` });
      } else {
        res.status(400).json({ message: `Failed to recover campaign ${campaignId}` });
      }
    } catch (error) {
      console.error('Single recovery error:', error);
      res.status(500).json({ message: 'Failed to recover campaign' });
    }
  });

  // Import the Duggu chatbot service for read-only database access

  // External Database Schema Inspection Routes
  
  // Get all tables in the external database
  app.get('/api/duggu/inspect/tables', async (req, res) => {
    try {
      const tables = await externalDbInspector.getTables();
      res.json({ tables });
    } catch (error) {
      console.error('Error getting tables:', error);
      res.status(500).json({ message: 'Failed to get tables' });
    }
  });

  // Get schema for a specific table
  app.get('/api/duggu/inspect/schema/:tableName', async (req, res) => {
    try {
      const { tableName } = req.params;
      const schema = await externalDbInspector.getTableSchema(tableName);
      res.json({ tableName, schema });
    } catch (error) {
      console.error('Error getting table schema:', error);
      res.status(500).json({ message: 'Failed to get table schema' });
    }
  });

  // Find tables that likely contain contact information
  app.get('/api/duggu/inspect/contact-tables', async (req, res) => {
    try {
      const contactTables = await externalDbInspector.findContactTables();
      res.json({ contactTables });
    } catch (error) {
      console.error('Error finding contact tables:', error);
      res.status(500).json({ message: 'Failed to find contact tables' });
    }
  });

  // Get sample data from a table
  app.get('/api/duggu/inspect/sample/:tableName', async (req, res) => {
    try {
      const { tableName } = req.params;
      const limit = parseInt(req.query.limit as string) || 3;
      const sampleData = await externalDbInspector.getSampleData(tableName, limit);
      res.json({ tableName, sampleData });
    } catch (error) {
      console.error('Error getting sample data:', error);
      res.status(500).json({ message: 'Failed to get sample data' });
    }
  });

  // Duggu Chatbot API Routes - Read-only database access
  
  // Search contacts (read-only for chatbot) - AI-powered advanced search across all 37 contact fields
  app.get('/api/duggu/contacts/search', async (req, res) => {
    try {
      const { q: query, limit = 100 } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Search query is required' });
      }

      // Use advanced AI-powered search that understands natural language and searches all 37 columns
      const result = await advancedContactSearchService.searchContacts(query, parseInt(limit as string));
      res.json(result);
    } catch (error) {
      console.error('Duggu chatbot contact search error:', error);
      res.status(500).json({ message: 'Failed to search contacts' });
    }
  });

  // Get search suggestions for auto-complete (AI-powered)
  app.get('/api/duggu/contacts/suggestions', async (req, res) => {
    try {
      const { q: query, field, limit = 10 } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Query is required' });
      }
      
      const validFields = ['company', 'title', 'industry', 'city'];
      const targetField = (field as string) || 'company';
      
      if (!validFields.includes(targetField)) {
        return res.status(400).json({ message: 'Invalid field. Must be one of: company, title, industry, city' });
      }
      
      const suggestions = await advancedContactSearchService.getSuggestions(
        query,
        targetField as 'company' | 'title' | 'industry' | 'city',
        parseInt(limit as string)
      );
      
      res.json({ suggestions, field: targetField });
    } catch (error) {
      console.error('Duggu chatbot get suggestions error:', error);
      res.status(500).json({ message: 'Failed to get suggestions' });
    }
  });

  // Get all contacts (read-only for chatbot)
  app.get('/api/duggu/contacts', async (req, res) => {
    try {
      const { limit = 100, offset = 0 } = req.query;
      const result = await externalDugguService.getAllContacts(parseInt(limit as string), parseInt(offset as string));
      res.json(result);
    } catch (error) {
      console.error('Duggu chatbot get contacts error:', error);
      res.status(500).json({ message: 'Failed to get contacts' });
    }
  });

  // Search pets (read-only for chatbot)
  app.get('/api/duggu/pets/search', async (req, res) => {
    try {
      const { q: query, limit = 50 } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Search query is required' });
      }

      const pets = await dugguChatbotService.searchPets(query, parseInt(limit as string));
      res.json({ pets, total: pets.length });
    } catch (error) {
      console.error('Duggu chatbot pet search error:', error);
      res.status(500).json({ message: 'Failed to search pets' });
    }
  });

  // Get all pets (read-only for chatbot)
  app.get('/api/duggu/pets', async (req, res) => {
    try {
      const { limit = 50 } = req.query;
      const pets = await dugguChatbotService.getAllPets(parseInt(limit as string));
      res.json({ pets, total: pets.length });
    } catch (error) {
      console.error('Duggu chatbot get pets error:', error);
      res.status(500).json({ message: 'Failed to get pets' });
    }
  });

  // Get pet by ID (read-only for chatbot)
  app.get('/api/duggu/pets/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pet = await dugguChatbotService.getPetById(id);
      
      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      }
      
      res.json(pet);
    } catch (error) {
      console.error('Duggu chatbot get pet error:', error);
      res.status(500).json({ message: 'Failed to get pet' });
    }
  });

  // Get pet health records (read-only for chatbot)
  app.get('/api/duggu/health-records', async (req, res) => {
    try {
      const { petId, limit = 50 } = req.query;
      const petIdNum = petId ? parseInt(petId as string) : undefined;
      const records = await dugguChatbotService.getPetHealthRecords(petIdNum, parseInt(limit as string));
      res.json({ healthRecords: records, total: records.length });
    } catch (error) {
      console.error('Duggu chatbot get health records error:', error);
      res.status(500).json({ message: 'Failed to get health records' });
    }
  });

  // Get pet activities (read-only for chatbot)
  app.get('/api/duggu/activities', async (req, res) => {
    try {
      const { petId, limit = 50 } = req.query;
      const petIdNum = petId ? parseInt(petId as string) : undefined;
      const activities = await dugguChatbotService.getPetActivities(petIdNum, parseInt(limit as string));
      res.json({ activities, total: activities.length });
    } catch (error) {
      console.error('Duggu chatbot get activities error:', error);
      res.status(500).json({ message: 'Failed to get activities' });
    }
  });

  // Get chat sessions (read-only for chatbot)
  app.get('/api/duggu/chat-sessions', async (req, res) => {
    try {
      const { limit = 50 } = req.query;
      const sessions = await dugguChatbotService.getChatSessions(parseInt(limit as string));
      res.json({ chatSessions: sessions, total: sessions.length });
    } catch (error) {
      console.error('Duggu chatbot get chat sessions error:', error);
      res.status(500).json({ message: 'Failed to get chat sessions' });
    }
  });

  // Get chat messages for a session (read-only for chatbot)
  app.get('/api/duggu/chat-sessions/:sessionId/messages', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { limit = 100 } = req.query;
      const messages = await dugguChatbotService.getChatMessages(sessionId, parseInt(limit as string));
      res.json({ messages, total: messages.length });
    } catch (error) {
      console.error('Duggu chatbot get messages error:', error);
      res.status(500).json({ message: 'Failed to get chat messages' });
    }
  });

  // Get campaigns (read-only for chatbot)
  app.get('/api/duggu/campaigns', async (req, res) => {
    try {
      const { limit = 50 } = req.query;
      const campaigns = await dugguChatbotService.getAllCampaigns(parseInt(limit as string));
      res.json({ campaigns, total: campaigns.length });
    } catch (error) {
      console.error('Duggu chatbot get campaigns error:', error);
      res.status(500).json({ message: 'Failed to get campaigns' });
    }
  });

  // Get campaign by ID (read-only for chatbot)
  app.get('/api/duggu/campaigns/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await dugguChatbotService.getCampaignById(id);
      
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }
      
      res.json(campaign);
    } catch (error) {
      console.error('Duggu chatbot get campaign error:', error);
      res.status(500).json({ message: 'Failed to get campaign' });
    }
  });

  // Get contact statistics (read-only for chatbot)
  app.get('/api/duggu/statistics/contacts', async (req, res) => {
    try {
      const stats = await externalDugguService.getContactStatistics();
      res.json(stats);
    } catch (error) {
      console.error('Duggu chatbot get contact statistics error:', error);
      res.status(500).json({ message: 'Failed to get contact statistics' });
    }
  });

  // Get general statistics (read-only for chatbot)
  app.get('/api/duggu/statistics/general', async (req, res) => {
    try {
      const stats = await externalDugguService.getContactStatistics();
      res.json(stats);
    } catch (error) {
      console.error('Duggu chatbot get general statistics error:', error);
      res.status(500).json({ message: 'Failed to get general statistics' });
    }
  });

  // Additional External Database Endpoints for Duggu
  
  // Get contacts by company
  app.get('/api/duggu/contacts/company/:company', async (req, res) => {
    try {
      const { company } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await externalDugguService.getContactsByCompany(company, limit);
      res.json(result);
    } catch (error) {
      console.error('Duggu chatbot get contacts by company error:', error);
      res.status(500).json({ message: 'Failed to get contacts by company' });
    }
  });

  // Get contacts by industry
  app.get('/api/duggu/contacts/industry/:industry', async (req, res) => {
    try {
      const { industry } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await externalDugguService.getContactsByIndustry(industry, limit);
      res.json(result);
    } catch (error) {
      console.error('Duggu chatbot get contacts by industry error:', error);
      res.status(500).json({ message: 'Failed to get contacts by industry' });
    }
  });

  // Get high-value contacts (lead score based)
  app.get('/api/duggu/contacts/high-value', async (req, res) => {
    try {
      const minScore = parseFloat(req.query.minScore as string) || 7.0;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await externalDugguService.getHighValueContacts(minScore, limit);
      res.json(result);
    } catch (error) {
      console.error('Duggu chatbot get high-value contacts error:', error);
      res.status(500).json({ message: 'Failed to get high-value contacts' });
    }
  });

  // Get contact by ID (read-only for chatbot) - MUST BE LAST to avoid catching specific routes
  app.get('/api/duggu/contacts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const contact = await externalDugguService.getContactById(id);
      
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      
      res.json(contact);
    } catch (error) {
      console.error('Duggu chatbot get contact error:', error);
      res.status(500).json({ message: 'Failed to get contact' });
    }
  });

  // Get top companies by contact count
  app.get('/api/duggu/companies/top', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const companies = await externalDugguService.getTopCompanies(limit);
      res.json({ companies, total: companies.length });
    } catch (error) {
      console.error('Duggu chatbot get top companies error:', error);
      res.status(500).json({ message: 'Failed to get top companies' });
    }
  });

  // Natural Language Query Routes for Duggu AI-Powered Database Queries
  
  // Get database schema for NL query context
  app.get('/api/duggu/nl/schema', async (req, res) => {
    try {
      const refresh = req.query.refresh === 'true';
      const schema = await nlQueryService.getDatabaseSchema(refresh);
      res.json({ schema, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Error getting database schema:', error);
      res.status(500).json({ message: 'Failed to retrieve database schema' });
    }
  });

  // Analyze natural language query and generate SQL
  app.post('/api/duggu/nl/analyze', async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return res.status(400).json({ message: 'Query text is required' });
      }

      const queryIntent = await nlQueryService.analyzeQuery(query);
      res.json(queryIntent);
    } catch (error: any) {
      console.error('Error analyzing natural language query:', error);
      res.status(500).json({ 
        message: error.message || 'Failed to analyze query',
        error: error.message 
      });
    }
  });

  // Execute a confirmed SQL query (read-only)
  app.post('/api/duggu/nl/execute', async (req, res) => {
    try {
      const { sql, userQuery } = req.body;
      
      if (!sql || typeof sql !== 'string' || sql.trim().length === 0) {
        return res.status(400).json({ message: 'SQL query is required' });
      }

      const result = await nlQueryService.executeQuery(sql, userQuery);
      res.json(result);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ message: 'Failed to execute query' });
    }
  });

  // Store feedback for query learning
  app.post('/api/duggu/nl/feedback', async (req, res) => {
    try {
      const { userQuery, generatedSQL, wasAccurate, userFeedback } = req.body;
      
      if (!userQuery || !generatedSQL || typeof wasAccurate !== 'boolean') {
        return res.status(400).json({ 
          message: 'userQuery, generatedSQL, and wasAccurate (boolean) are required' 
        });
      }

      await nlQueryService.storeFeedback(userQuery, generatedSQL, wasAccurate, userFeedback);
      res.json({ success: true, message: 'Feedback stored successfully' });
    } catch (error) {
      console.error('Error storing feedback:', error);
      res.status(500).json({ message: 'Failed to store feedback' });
    }
  });

  // Get query suggestions based on schema
  app.get('/api/duggu/nl/suggestions', async (req, res) => {
    try {
      const suggestions = await nlQueryService.getQuerySuggestions();
      res.json({ suggestions });
    } catch (error) {
      console.error('Error getting query suggestions:', error);
      res.status(500).json({ message: 'Failed to get suggestions' });
    }
  });

  // Advanced Search Intelligence Routes (Apollo.io / ZoomInfo style)
  
  // Zod schemas for validation
  const searchFilterSchema = z.object({
    column: z.string().regex(/^[a-zA-Z_][a-zA-Z0-9_-]*$/, 'Invalid column name'),
    operator: z.enum(['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 
                       'greater_than', 'less_than', 'greater_or_equal', 'less_or_equal', 
                       'is_null', 'is_not_null', 'in', 'not_in', 'between']),
    value: z.any().optional(),
    value2: z.any().optional(),
  });

  const searchQuerySchema = z.object({
    table: z.string().regex(/^[a-zA-Z_][a-zA-Z0-9_-]*$/, 'Invalid table name'),
    filters: z.array(searchFilterSchema).default([]),
    sortBy: z.string().regex(/^[a-zA-Z_][a-zA-Z0-9_-]*$/, 'Invalid sort column').optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    page: z.number().int().positive().optional(),
    pageSize: z.number().int().positive().max(1000).optional(),
    database: z.enum(['main', 'readonly']).optional(),
  });
  
  // Get all available tables from a database
  app.get('/api/advanced-search/tables', async (req, res) => {
    try {
      const database = (req.query.database as 'main' | 'readonly') || 'main';
      
      // Validate database parameter
      if (!['main', 'readonly'].includes(database)) {
        return res.status(400).json({ message: 'Invalid database parameter' });
      }
      
      const tables = await advancedSearchService.getTables(database);
      res.json({ tables, database });
    } catch (error) {
      console.error('Error getting tables:', error);
      res.status(500).json({ message: 'Failed to get tables' });
    }
  });

  // Get metadata for a specific table
  app.get('/api/advanced-search/tables/:tableName/metadata', async (req, res) => {
    try {
      const { tableName } = req.params;
      const database = (req.query.database as 'main' | 'readonly') || 'main';
      
      // Validate table name
      if (!/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(tableName)) {
        return res.status(400).json({ message: 'Invalid table name' });
      }
      
      // Validate database parameter
      if (!['main', 'readonly'].includes(database)) {
        return res.status(400).json({ message: 'Invalid database parameter' });
      }
      
      const metadata = await advancedSearchService.getTableMetadata(tableName, database);
      res.json(metadata);
    } catch (error) {
      console.error(`Error getting metadata for table ${req.params.tableName}:`, error);
      res.status(500).json({ message: 'Failed to get table metadata' });
    }
  });

  // Get all tables with metadata
  app.get('/api/advanced-search/metadata', async (req, res) => {
    try {
      const database = (req.query.database as 'main' | 'readonly') || 'main';
      
      // Validate database parameter
      if (!['main', 'readonly'].includes(database)) {
        return res.status(400).json({ message: 'Invalid database parameter' });
      }
      
      const metadata = await advancedSearchService.getAllTablesMetadata(database);
      res.json({ tables: metadata, database });
    } catch (error) {
      console.error('Error getting all tables metadata:', error);
      res.status(500).json({ message: 'Failed to get tables metadata' });
    }
  });

  // Execute advanced search with filters
  app.post('/api/advanced-search/search', async (req, res) => {
    try {
      // Validate request body with Zod
      const validation = searchQuerySchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid search query', 
          errors: validation.error.errors 
        });
      }

      const searchQuery = validation.data as any;
      const result = await advancedSearchService.search(searchQuery);
      res.json(result);
    } catch (error: any) {
      console.error('Error executing advanced search:', error);
      res.status(500).json({ 
        message: error.message || 'Failed to execute search' 
      });
    }
  });

  // Export search results to CSV
  app.post('/api/advanced-search/export', async (req, res) => {
    try {
      // Validate request body with Zod
      const validation = searchQuerySchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid search query', 
          errors: validation.error.errors 
        });
      }

      const searchQuery = validation.data as any;
      const csv = await advancedSearchService.exportToCSV(searchQuery);
      
      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="export_${searchQuery.table}_${Date.now()}.csv"`);
      res.send(csv);
    } catch (error: any) {
      console.error('Error exporting search results:', error);
      res.status(500).json({ 
        message: error.message || 'Failed to export search results' 
      });
    }
  });

  // Advanced Contacts Filter Routes (Apollo.io / ZoomInfo style)
  const { contactsFilterService, FILTER_TEMPLATES } = await import('./services/contactsFilterService');

  // Get available filter templates
  app.get('/api/contacts-filter/templates', (req, res) => {
    res.json({ templates: FILTER_TEMPLATES });
  });

  // Get field suggestions for autocomplete
  app.get('/api/contacts-filter/suggestions/:field', async (req, res) => {
    try {
      const { field } = req.params;
      const { search = '' } = req.query;
      
      const suggestions = await contactsFilterService.getFieldSuggestions(
        field,
        search as string,
        20
      );
      
      res.json({ field, suggestions });
    } catch (error: any) {
      console.error('Error getting field suggestions:', error);
      res.status(400).json({ message: error.message || 'Failed to get suggestions' });
    }
  });

  // Get field aggregations for smart filters
  app.get('/api/contacts-filter/aggregations', async (req, res) => {
    try {
      const aggregations = await contactsFilterService.getFieldAggregations();
      res.json(aggregations);
    } catch (error: any) {
      console.error('Error getting aggregations:', error);
      res.status(500).json({ message: error.message || 'Failed to get aggregations' });
    }
  });

  // Get contact statistics
  app.get('/api/contacts-filter/statistics', async (req, res) => {
    try {
      const statistics = await contactsFilterService.getStatistics();
      res.json(statistics);
    } catch (error: any) {
      console.error('Error getting statistics:', error);
      res.status(500).json({ message: error.message || 'Failed to get statistics' });
    }
  });

  // Zod schema for contacts filter search
  const contactFilterSchema = z.object({
    column: z.string().regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, 'Invalid column name'),
    operator: z.enum(['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 
                       'greater_than', 'less_than', 'greater_or_equal', 'less_or_equal', 
                       'is_null', 'is_not_null', 'in', 'not_in', 'between']),
    value: z.any().optional(),
    value2: z.any().optional(),
  });

  const contactSearchQuerySchema = z.object({
    filters: z.array(contactFilterSchema).default([]),
    filterGroups: z.array(z.object({
      filters: z.array(contactFilterSchema),
      combineWith: z.enum(['AND', 'OR']),
    })).optional(),
    globalSearch: z.string().optional(),
    sortBy: z.string().regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, 'Invalid sort column').optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    page: z.number().int().positive().optional(),
    pageSize: z.number().int().positive().max(500).optional(),
  });

  // Search contacts with advanced filters
  app.post('/api/contacts-filter/search', async (req, res) => {
    try {
      // Validate request body with Zod
      const validation = contactSearchQuerySchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid search query', 
          errors: validation.error.errors 
        });
      }

      const searchQuery = validation.data;
      const result = await contactsFilterService.search(searchQuery);
      res.json(result);
    } catch (error: any) {
      console.error('Error searching contacts:', error);
      res.status(500).json({ 
        message: error.message || 'Failed to search contacts' 
      });
    }
  });

  // Export filtered contacts to CSV
  app.post('/api/contacts-filter/export', async (req, res) => {
    try {
      const searchQuery = req.body;
      const csv = await contactsFilterService.exportToCSV(searchQuery);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="contacts_export_${Date.now()}.csv"`);
      res.send(csv);
    } catch (error: any) {
      console.error('Error exporting contacts:', error);
      res.status(500).json({ 
        message: error.message || 'Failed to export contacts' 
      });
    }
  });

  // =============================================
  // BLOG MANAGEMENT API ROUTES
  // =============================================

  // Get blog dashboard stats
  app.get('/api/admin/blog/stats', requireAdmin, async (req, res) => {
    try {
      const [postsCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.blogPosts);
      const [publishedCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.blogPosts).where(eq(schema.blogPosts.status, 'published'));
      const [draftCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.blogPosts).where(eq(schema.blogPosts.status, 'draft'));
      const [scheduledCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.blogPosts).where(eq(schema.blogPosts.status, 'scheduled'));
      const [subscribersCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.blogSubscribers);
      const [totalViews] = await db.select({ sum: sql<number>`COALESCE(SUM(view_count), 0)` }).from(schema.blogPosts);
      const [commentsCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.blogComments);
      const [totalRevenueResult] = await db.select({ sum: sql<number>`COALESCE(SUM(amount), 0)` }).from(schema.blogRevenue);
      const [avgSeoResult] = await db.select({ avg: sql<number>`COALESCE(AVG(seo_score), 0)` }).from(schema.blogPosts);

      const topPosts = await db
        .select({
          id: schema.blogPosts.id,
          title: schema.blogPosts.title,
          views: schema.blogPosts.viewCount,
          shares: schema.blogPosts.shareCount,
          comments: schema.blogPosts.commentCount
        })
        .from(schema.blogPosts)
        .where(eq(schema.blogPosts.status, 'published'))
        .orderBy(sql`${schema.blogPosts.viewCount} DESC`)
        .limit(5);

      const recentPosts = await db
        .select({
          id: schema.blogPosts.id,
          title: schema.blogPosts.title,
          slug: schema.blogPosts.slug,
          status: schema.blogPosts.status,
          views: schema.blogPosts.viewCount,
          seoScore: schema.blogPosts.seoScore,
          publishedAt: schema.blogPosts.publishedAt,
          createdAt: schema.blogPosts.createdAt
        })
        .from(schema.blogPosts)
        .orderBy(sql`${schema.blogPosts.createdAt} DESC`)
        .limit(10);

      const categoryDistribution = await db
        .select({
          name: schema.blogCategories.name,
          count: sql<number>`count(${schema.blogPosts.id})`
        })
        .from(schema.blogCategories)
        .leftJoin(schema.blogPosts, eq(schema.blogCategories.id, schema.blogPosts.categoryId))
        .groupBy(schema.blogCategories.id, schema.blogCategories.name)
        .orderBy(sql`count(${schema.blogPosts.id}) DESC`)
        .limit(6);

      const now = new Date();
      const trafficData = [];
      const revenueData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        trafficData.push({ date: dateStr, views: 0, visitors: 0 });
        revenueData.push({ date: dateStr, affiliate: 0, ads: 0, sponsored: 0 });
      }

      res.json({
        totalPosts: Number(postsCount.count) || 0,
        publishedPosts: Number(publishedCount.count) || 0,
        draftPosts: Number(draftCount.count) || 0,
        scheduledPosts: Number(scheduledCount.count) || 0,
        totalViews: Number(totalViews.sum) || 0,
        totalComments: Number(commentsCount.count) || 0,
        totalSubscribers: Number(subscribersCount.count) || 0,
        totalRevenue: Number(totalRevenueResult.sum) || 0,
        avgSeoScore: Math.round(Number(avgSeoResult.avg) || 0),
        topPosts: topPosts.map(p => ({
          id: p.id,
          title: p.title,
          views: p.views || 0,
          shares: p.shares || 0,
          comments: p.comments || 0
        })),
        trafficData,
        revenueData,
        categoryDistribution: categoryDistribution.map(c => ({
          name: c.name,
          count: Number(c.count) || 0
        })),
        recentPosts: recentPosts.map(p => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          status: p.status || 'draft',
          views: p.views || 0,
          seoScore: p.seoScore || 0,
          publishedAt: p.publishedAt,
          createdAt: p.createdAt
        }))
      });
    } catch (error) {
      console.error('Error fetching blog stats:', error);
      res.status(500).json({ message: 'Failed to fetch blog stats' });
    }
  });

  // Get all blog posts with pagination and filters
  app.get('/api/admin/blog/posts', requireAdmin, async (req, res) => {
    try {
      const { limit = 20, offset = 0, status, categoryId, authorId, search } = req.query;
      
      const conditions = [];
      if (status && status !== 'all') {
        conditions.push(eq(schema.blogPosts.status, status as string));
      }
      if (categoryId) {
        conditions.push(eq(schema.blogPosts.categoryId, parseInt(categoryId as string)));
      }
      if (authorId) {
        conditions.push(eq(schema.blogPosts.authorId, parseInt(authorId as string)));
      }
      if (search) {
        conditions.push(sql`(${schema.blogPosts.title} ILIKE ${'%' + search + '%'} OR ${schema.blogPosts.content} ILIKE ${'%' + search + '%'})`);
      }

      const posts = await db
        .select()
        .from(schema.blogPosts)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(sql`${schema.blogPosts.createdAt} DESC`)
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));

      const [countResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.blogPosts)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      res.json({
        posts,
        total: Number(countResult.count) || 0,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      });
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ message: 'Failed to fetch blog posts' });
    }
  });

  // Get single blog post by ID
  app.get('/api/admin/blog/posts/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const [post] = await db
        .select()
        .from(schema.blogPosts)
        .where(eq(schema.blogPosts.id, parseInt(id)));

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.json(post);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ message: 'Failed to fetch blog post' });
    }
  });

  // Create new blog post
  app.post('/api/admin/blog/posts', requireAdmin, async (req, res) => {
    try {
      const postData = req.body;
      
      const slug = postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const [newPost] = await db
        .insert(schema.blogPosts)
        .values({
          ...postData,
          slug,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      await logActivity({
        req,
        activityType: 'blog',
        action: 'Created new blog post',
        resourceType: 'blog_post',
        resourceId: String(newPost.id),
        details: { title: newPost.title, status: newPost.status }
      });

      res.json(newPost);
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).json({ message: 'Failed to create blog post' });
    }
  });

  // Update blog post
  app.put('/api/admin/blog/posts/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const postData = req.body;

      const [updatedPost] = await db
        .update(schema.blogPosts)
        .set({
          ...postData,
          updatedAt: new Date()
        })
        .where(eq(schema.blogPosts.id, parseInt(id)))
        .returning();

      if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }

      await logActivity({
        req,
        activityType: 'blog',
        action: 'Updated blog post',
        resourceType: 'blog_post',
        resourceId: id,
        details: { title: updatedPost.title, status: updatedPost.status }
      });

      res.json(updatedPost);
    } catch (error) {
      console.error('Error updating blog post:', error);
      res.status(500).json({ message: 'Failed to update blog post' });
    }
  });

  // Delete blog post
  app.delete('/api/admin/blog/posts/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;

      const [deleted] = await db
        .delete(schema.blogPosts)
        .where(eq(schema.blogPosts.id, parseInt(id)))
        .returning();

      if (!deleted) {
        return res.status(404).json({ message: 'Post not found' });
      }

      await logActivity({
        req,
        activityType: 'blog',
        action: 'Deleted blog post',
        resourceType: 'blog_post',
        resourceId: id,
        details: { title: deleted.title }
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ message: 'Failed to delete blog post' });
    }
  });

  // Get all blog categories
  app.get('/api/admin/blog/categories', requireAdmin, async (req, res) => {
    try {
      const categories = await db.select().from(schema.blogCategories).orderBy(sql`${schema.blogCategories.name} ASC`);
      res.json(categories);
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  // Create blog category
  app.post('/api/admin/blog/categories', requireAdmin, async (req, res) => {
    try {
      const { name, description, color, metaTitle, metaDescription, parentId } = req.body;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const [newCategory] = await db
        .insert(schema.blogCategories)
        .values({ name, slug, description, color, metaTitle, metaDescription, parentId })
        .returning();

      res.json(newCategory);
    } catch (error) {
      console.error('Error creating blog category:', error);
      res.status(500).json({ message: 'Failed to create category' });
    }
  });

  // Update blog category
  app.put('/api/admin/blog/categories/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, color, metaTitle, metaDescription, parentId } = req.body;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const [updated] = await db
        .update(schema.blogCategories)
        .set({ name, slug, description, color, metaTitle, metaDescription, parentId, updatedAt: new Date() })
        .where(eq(schema.blogCategories.id, parseInt(id)))
        .returning();

      res.json(updated);
    } catch (error) {
      console.error('Error updating blog category:', error);
      res.status(500).json({ message: 'Failed to update category' });
    }
  });

  // Delete blog category
  app.delete('/api/admin/blog/categories/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(schema.blogCategories).where(eq(schema.blogCategories.id, parseInt(id)));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting blog category:', error);
      res.status(500).json({ message: 'Failed to delete category' });
    }
  });

  // Get all blog tags
  app.get('/api/admin/blog/tags', requireAdmin, async (req, res) => {
    try {
      const tags = await db.select().from(schema.blogTags).orderBy(sql`${schema.blogTags.name} ASC`);
      res.json(tags);
    } catch (error) {
      console.error('Error fetching blog tags:', error);
      res.status(500).json({ message: 'Failed to fetch tags' });
    }
  });

  // Create blog tag
  app.post('/api/admin/blog/tags', requireAdmin, async (req, res) => {
    try {
      const { name, description, color } = req.body;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const [newTag] = await db
        .insert(schema.blogTags)
        .values({ name, slug, description, color })
        .returning();

      res.json(newTag);
    } catch (error) {
      console.error('Error creating blog tag:', error);
      res.status(500).json({ message: 'Failed to create tag' });
    }
  });

  // Update blog tag
  app.put('/api/admin/blog/tags/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, color } = req.body;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const [updated] = await db
        .update(schema.blogTags)
        .set({ name, slug, description, color, updatedAt: new Date() })
        .where(eq(schema.blogTags.id, parseInt(id)))
        .returning();

      res.json(updated);
    } catch (error) {
      console.error('Error updating blog tag:', error);
      res.status(500).json({ message: 'Failed to update tag' });
    }
  });

  // Delete blog tag
  app.delete('/api/admin/blog/tags/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(schema.blogTags).where(eq(schema.blogTags.id, parseInt(id)));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting blog tag:', error);
      res.status(500).json({ message: 'Failed to delete tag' });
    }
  });

  // Get all blog authors
  app.get('/api/admin/blog/authors', requireAdmin, async (req, res) => {
    try {
      const authors = await db.select().from(schema.blogAuthors).orderBy(sql`${schema.blogAuthors.name} ASC`);
      res.json(authors);
    } catch (error) {
      console.error('Error fetching blog authors:', error);
      res.status(500).json({ message: 'Failed to fetch authors' });
    }
  });

  // Create blog author
  app.post('/api/admin/blog/authors', requireAdmin, async (req, res) => {
    try {
      const { name, email, bio, avatar, socialLinks, expertise } = req.body;

      const [newAuthor] = await db
        .insert(schema.blogAuthors)
        .values({ name, email, bio, avatar, socialLinks, expertise })
        .returning();

      res.json(newAuthor);
    } catch (error) {
      console.error('Error creating blog author:', error);
      res.status(500).json({ message: 'Failed to create author' });
    }
  });

  // Update blog author
  app.put('/api/admin/blog/authors/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, bio, avatar, socialLinks, expertise, isActive } = req.body;

      const [updated] = await db
        .update(schema.blogAuthors)
        .set({ name, email, bio, avatar, socialLinks, expertise, isActive, updatedAt: new Date() })
        .where(eq(schema.blogAuthors.id, parseInt(id)))
        .returning();

      res.json(updated);
    } catch (error) {
      console.error('Error updating blog author:', error);
      res.status(500).json({ message: 'Failed to update author' });
    }
  });

  // Delete blog author
  app.delete('/api/admin/blog/authors/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(schema.blogAuthors).where(eq(schema.blogAuthors.id, parseInt(id)));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting blog author:', error);
      res.status(500).json({ message: 'Failed to delete author' });
    }
  });

  // Get blog analytics data
  app.get('/api/admin/blog/analytics', requireAdmin, async (req, res) => {
    try {
      const { startDate, endDate, postId } = req.query;
      
      const conditions = [];
      if (startDate) {
        conditions.push(sql`${schema.blogAnalytics.createdAt} >= ${new Date(startDate as string)}`);
      }
      if (endDate) {
        conditions.push(sql`${schema.blogAnalytics.createdAt} <= ${new Date(endDate as string)}`);
      }
      if (postId) {
        conditions.push(eq(schema.blogAnalytics.postId, parseInt(postId as string)));
      }

      const analytics = await db
        .select()
        .from(schema.blogAnalytics)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(sql`${schema.blogAnalytics.createdAt} DESC`)
        .limit(1000);

      const [totals] = await db.select({
        totalViews: sql<number>`COALESCE(SUM(${schema.blogAnalytics.pageViews}), 0)`,
        totalUniqueVisitors: sql<number>`COALESCE(SUM(${schema.blogAnalytics.uniqueVisitors}), 0)`,
        totalTimeOnPage: sql<number>`COALESCE(AVG(${schema.blogAnalytics.timeOnPage}), 0)`,
        avgBounceRate: sql<number>`COALESCE(AVG(${schema.blogAnalytics.bounceRate}), 0)`
      }).from(schema.blogAnalytics).where(conditions.length > 0 ? and(...conditions) : undefined);

      res.json({
        records: analytics,
        summary: {
          totalViews: Number(totals.totalViews) || 0,
          totalUniqueVisitors: Number(totals.totalUniqueVisitors) || 0,
          avgTimeOnPage: Number(totals.totalTimeOnPage) || 0,
          avgBounceRate: Number(totals.avgBounceRate) || 0
        }
      });
    } catch (error) {
      console.error('Error fetching blog analytics:', error);
      res.status(500).json({ message: 'Failed to fetch analytics' });
    }
  });

  // Get blog revenue data
  app.get('/api/admin/blog/revenue', requireAdmin, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const conditions = [];
      if (startDate) {
        conditions.push(sql`${schema.blogRevenue.createdAt} >= ${new Date(startDate as string)}`);
      }
      if (endDate) {
        conditions.push(sql`${schema.blogRevenue.createdAt} <= ${new Date(endDate as string)}`);
      }

      const revenue = await db
        .select()
        .from(schema.blogRevenue)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(sql`${schema.blogRevenue.createdAt} DESC`);

      const [totals] = await db.select({
        totalRevenue: sql<number>`COALESCE(SUM(${schema.blogRevenue.amount}), 0)`
      }).from(schema.blogRevenue).where(conditions.length > 0 ? and(...conditions) : undefined);

      res.json({
        records: revenue,
        totalRevenue: Number(totals.totalRevenue) || 0
      });
    } catch (error) {
      console.error('Error fetching blog revenue:', error);
      res.status(500).json({ message: 'Failed to fetch revenue' });
    }
  });

  // Get blog subscribers
  app.get('/api/admin/blog/subscribers', requireAdmin, async (req, res) => {
    try {
      const { limit = 50, offset = 0, status } = req.query;
      
      const conditions = [];
      if (status && status !== 'all') {
        conditions.push(eq(schema.blogSubscribers.status, status as string));
      }

      const subscribers = await db
        .select()
        .from(schema.blogSubscribers)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(sql`${schema.blogSubscribers.subscribedAt} DESC`)
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));

      const [countResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.blogSubscribers)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      res.json({
        subscribers,
        total: Number(countResult.count) || 0
      });
    } catch (error) {
      console.error('Error fetching blog subscribers:', error);
      res.status(500).json({ message: 'Failed to fetch subscribers' });
    }
  });

  // Public blog API - Get published posts
  app.get('/api/blog/posts', async (req, res) => {
    try {
      const { limit = 10, offset = 0, category, tag } = req.query;
      
      const conditions = [eq(schema.blogPosts.status, 'published')];
      if (category) {
        conditions.push(eq(schema.blogPosts.categoryId, parseInt(category as string)));
      }

      const posts = await db
        .select()
        .from(schema.blogPosts)
        .where(and(...conditions))
        .orderBy(sql`${schema.blogPosts.publishedAt} DESC`)
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));

      const [countResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.blogPosts)
        .where(and(...conditions));

      res.json({
        posts,
        total: Number(countResult.count) || 0
      });
    } catch (error) {
      console.error('Error fetching public blog posts:', error);
      res.status(500).json({ message: 'Failed to fetch posts' });
    }
  });

  // Public blog API - Get single post by slug
  app.get('/api/blog/posts/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      
      const [post] = await db
        .select()
        .from(schema.blogPosts)
        .where(and(
          eq(schema.blogPosts.slug, slug),
          eq(schema.blogPosts.status, 'published')
        ));

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      await db
        .update(schema.blogPosts)
        .set({ viewCount: sql`${schema.blogPosts.viewCount} + 1` })
        .where(eq(schema.blogPosts.id, post.id));

      res.json(post);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ message: 'Failed to fetch post' });
    }
  });

  // Public blog API - Get categories
  app.get('/api/blog/categories', async (req, res) => {
    try {
      const categories = await db.select().from(schema.blogCategories).orderBy(sql`${schema.blogCategories.name} ASC`);
      res.json(categories);
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  return httpServer;
}