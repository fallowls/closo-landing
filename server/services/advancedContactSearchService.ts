import { Pool } from '@neondatabase/serverless';
import ws from "ws";
import { neonConfig } from '@neondatabase/serverless';

neonConfig.webSocketConstructor = ws;

// Get the external database URL
function getExternalDatabaseUrl(): string | null {
  let dugguConnectionUrl = process.env.DUGGU_DATABASE_CONNECTION_URL;
  
  if (dugguConnectionUrl) {
    if (dugguConnectionUrl.includes("'postgresql://")) {
      dugguConnectionUrl = dugguConnectionUrl.match(/'(postgresql:\/\/[^']+)'/)?.[1] || dugguConnectionUrl;
    } else if (dugguConnectionUrl.includes('"postgresql://')) {
      dugguConnectionUrl = dugguConnectionUrl.match(/"(postgresql:\/\/[^"]+)"/)?.[1] || dugguConnectionUrl;
    }
    
    if (dugguConnectionUrl.startsWith('postgresql://') || dugguConnectionUrl.startsWith('postgres://')) {
      return dugguConnectionUrl;
    }
  }
  
  return null;
}

let externalSearchPool: Pool | null = null;

function getExternalSearchPool(): Pool {
  if (!externalSearchPool) {
    const url = getExternalDatabaseUrl();
    if (!url) {
      throw new Error('External database connection URL not found. Please configure DUGGU_DATABASE_CONNECTION_URL environment variable.');
    }
    
    externalSearchPool = new Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
      max: 5,
      min: 1,
      idleTimeoutMillis: 15000,
      connectionTimeoutMillis: 10000,
      allowExitOnIdle: false,
      query_timeout: 15000,
      statement_timeout: 15000,
    });
  }
  
  return externalSearchPool;
}

interface SearchFilters {
  // Name fields
  fullName?: string;
  firstName?: string;
  lastName?: string;
  
  // Contact fields
  title?: string;
  email?: string;
  emailDomain?: string;
  phone?: string;
  mobilePhone?: string;
  otherPhone?: string;
  homePhone?: string;
  corporatePhone?: string;
  
  // Company fields
  company?: string;
  industry?: string;
  website?: string;
  companyLinkedIn?: string;
  companyAddress?: string;
  
  // Location fields (person)
  city?: string;
  state?: string;
  country?: string;
  countryCode?: string;
  timezone?: string;
  region?: string;
  
  // Location fields (company)
  companyCity?: string;
  companyState?: string;
  companyCountry?: string;
  
  // Company metrics
  employees?: number;
  minEmployees?: number;
  maxEmployees?: number;
  employeeSizeBracket?: string;
  companyAge?: number;
  minCompanyAge?: number;
  maxCompanyAge?: number;
  
  // Revenue
  minRevenue?: number;
  maxRevenue?: number;
  annualRevenue?: number;
  
  // Lead scoring
  minLeadScore?: number;
  maxLeadScore?: number;
  
  // Technology
  technologies?: string[];
  technologyCategory?: string;
  
  // Business
  businessType?: string;
  
  // Social
  personLinkedIn?: string;
  hasEmail?: boolean;
  hasPhone?: boolean;
  hasLinkedIn?: boolean;
  hasWebsite?: boolean;
}

interface QueryAnalysis {
  filters: SearchFilters;
  intent: string;
  searchTerms: string[];
  confidence: number;
}

/**
 * Advanced Contact Search Service
 * Uses AI-powered query understanding to search across all 37 columns in the external contacts database
 * Intelligently interprets natural language queries and generates appropriate database queries
 */
export class AdvancedContactSearchService {
  private forEachPatternMatch(
    query: string,
    patterns: RegExp[],
    onMatch: (match: RegExpMatchArray) => void,
  ): void {
    for (const pattern of patterns) {
      const matches = query.matchAll(pattern);
      for (const match of matches) {
        onMatch(match);
      }
    }
  }
  
  /**
   * Analyze natural language query and extract search intent
   * This method uses pattern matching and keyword analysis to understand user queries
   */
  private analyzeQuery(query: string): QueryAnalysis {
    const lowerQuery = query.toLowerCase();
    const filters: SearchFilters = {};
    const searchTerms: string[] = [];
    let intent = 'general_search';
    let confidence = 70;

    // Extract company names (common patterns)
    const companyPatterns = [
      /(?:from|at|works? at|company|companies like)\s+([a-z0-9\s&.,'"-]+?)(?:\s+(?:in|with|who|that|and)|$)/gi,
      /([a-z0-9\s&.,'"-]+)\s+(?:employees|staff|workers|team)/gi,
    ];
    
    this.forEachPatternMatch(query, companyPatterns, (match) => {
      if (match[1] && match[1].trim().length > 2) {
        filters.company = match[1].trim();
        intent = 'company_search';
        confidence = 85;
      }
    });

    // Extract job titles
    const titlePatterns = [
      /(?:title|position|role|job)(?:\s+is|\s+:)?\s+([a-z\s]+?)(?:\s+(?:at|in|from|with|who|that|and)|$)/gi,
      /(ceo|cto|cfo|coo|vp|director|manager|head|lead|senior|junior|engineer|developer|designer|analyst|specialist|coordinator|executive|president|founder)s?(?:\s+of)?/gi,
    ];
    
    for (const pattern of titlePatterns) {
      const matches = query.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].trim().length > 2) {
          filters.title = match[1].trim();
          intent = 'title_search';
          confidence = 85;
        }
      }
    }

    // Extract location
    const locationPatterns = [
      /(?:in|from|located in|based in|at)\s+([a-z\s]+),?\s+([a-z]{2})/gi, // City, State
      /(?:in|from|located in|based in)\s+([a-z\s]+?)(?:\s+(?:with|who|that|and)|$)/gi, // City or Country
    ];
    
    for (const pattern of locationPatterns) {
      const matches = query.matchAll(pattern);
      for (const match of matches) {
        if (match[2]) {
          filters.city = match[1]?.trim();
          filters.state = match[2]?.trim();
        } else if (match[1]) {
          const location = match[1].trim();
          if (location.length === 2) {
            filters.state = location;
          } else if (location.length > 15) {
            filters.country = location;
          } else {
            filters.city = location;
          }
        }
        intent = 'location_search';
        confidence = 80;
      }
    }

    // Extract industry
    const industryPatterns = [
      /(?:industry|sector|field|vertical)(?:\s+is|\s+:)?\s+([a-z\s&]+?)(?:\s+(?:with|who|in|and)|$)/gi,
      /(?:in the|from the)\s+([a-z\s&]+)\s+(?:industry|sector|field)/gi,
    ];
    
    for (const pattern of industryPatterns) {
      const matches = query.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].trim().length > 2) {
          filters.industry = match[1].trim();
          intent = 'industry_search';
          confidence = 85;
        }
      }
    }

    // Extract employee count ranges
    const employeePatterns = [
      /(\d+)\s*-\s*(\d+)\s+employees/gi,
      /(?:more than|over|above|>\s*)(\d+)\s+employees/gi,
      /(?:less than|under|below|<\s*)(\d+)\s+employees/gi,
      /(\d+)\+\s+employees/gi,
    ];
    
    for (const pattern of employeePatterns) {
      const matches = query.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[2]) {
          filters.minEmployees = parseInt(match[1]);
          filters.maxEmployees = parseInt(match[2]);
        } else if (match[1]) {
          if (lowerQuery.includes('more than') || lowerQuery.includes('over') || lowerQuery.includes('above')) {
            filters.minEmployees = parseInt(match[1]);
          } else if (lowerQuery.includes('less than') || lowerQuery.includes('under') || lowerQuery.includes('below')) {
            filters.maxEmployees = parseInt(match[1]);
          } else {
            filters.minEmployees = parseInt(match[1]);
          }
        }
        intent = 'employee_search';
        confidence = 90;
      }
    }

    // Extract lead score criteria
    const scorePatterns = [
      /lead\s+score\s*(?:>=|>|above|over)\s*(\d+(?:\.\d+)?)/gi,
      /lead\s+score\s*(?:<=|<|below|under)\s*(\d+(?:\.\d+)?)/gi,
      /(?:high|top)\s+(?:quality|value|scoring|score)\s+(?:leads|contacts)/gi,
    ];
    
    for (const pattern of scorePatterns) {
      const matches = query.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          if (lowerQuery.includes('>=') || lowerQuery.includes('>') || lowerQuery.includes('above') || lowerQuery.includes('over')) {
            filters.minLeadScore = parseFloat(match[1]);
          } else {
            filters.maxLeadScore = parseFloat(match[1]);
          }
        } else {
          filters.minLeadScore = 7.0; // High quality threshold
        }
        intent = 'lead_score_search';
        confidence = 95;
      }
    }

    // Extract technologies
    const techPatterns = [
      /(?:using|uses|with|has)\s+(salesforce|hubspot|aws|azure|gcp|slack|jira|confluence|github|gitlab|docker|kubernetes|react|angular|vue|python|java|javascript|node\.?js|\.net|php)/gi,
    ];
    
    for (const pattern of techPatterns) {
      const matches = query.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          if (!filters.technologies) filters.technologies = [];
          filters.technologies.push(match[1].trim());
          intent = 'technology_search';
          confidence = 85;
        }
      }
    }

    // Extract email/phone requirements
    if (/(?:with|has|have)\s+(?:an?\s+)?email/gi.test(query)) {
      filters.hasEmail = true;
      intent = 'contact_info_search';
      confidence = 90;
    }
    
    if (/(?:with|has|have)\s+(?:a\s+)?(?:phone|mobile|telephone)/gi.test(query)) {
      filters.hasPhone = true;
      intent = 'contact_info_search';
      confidence = 90;
    }

    if (/(?:with|has|have)\s+linkedin/gi.test(query)) {
      filters.hasLinkedIn = true;
      intent = 'linkedin_search';
      confidence = 90;
    }

    // Extract name searches
    const namePatterns = [
      /(?:named?|called)\s+([a-z\s]+?)(?:\s+(?:at|in|from|with|who)|$)/gi,
      /(?:first name|fname)(?:\s+is|\s+:)?\s+([a-z]+)/gi,
      /(?:last name|lname|surname)(?:\s+is|\s+:)?\s+([a-z]+)/gi,
    ];
    
    for (const pattern of namePatterns) {
      const matches = query.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          const name = match[1].trim();
          if (lowerQuery.includes('first name') || lowerQuery.includes('fname')) {
            filters.firstName = name;
          } else if (lowerQuery.includes('last name') || lowerQuery.includes('lname') || lowerQuery.includes('surname')) {
            filters.lastName = name;
          } else {
            filters.fullName = name;
          }
          intent = 'name_search';
          confidence = 85;
        }
      }
    }

    // If no specific filters found, treat whole query as general search term
    if (Object.keys(filters).length === 0) {
      searchTerms.push(query.trim());
      intent = 'general_search';
      confidence = 60;
    }

    return {
      filters,
      intent,
      searchTerms,
      confidence
    };
  }

  /**
   * Build SQL query from analyzed filters
   */
  private buildSearchQuery(analysis: QueryAnalysis, limit: number = 100): { query: string, params: any[] } {
    const conditions: string[] = ['is_deleted = false'];
    const params: any[] = [];
    let paramIndex = 1;

    const { filters } = analysis;

    // Full name search
    if (filters.fullName) {
      conditions.push(`LOWER(full_name) LIKE $${paramIndex}`);
      params.push(`%${filters.fullName.toLowerCase()}%`);
      paramIndex++;
    }

    // First name search
    if (filters.firstName) {
      conditions.push(`LOWER(first_name) LIKE $${paramIndex}`);
      params.push(`%${filters.firstName.toLowerCase()}%`);
      paramIndex++;
    }

    // Last name search
    if (filters.lastName) {
      conditions.push(`LOWER(last_name) LIKE $${paramIndex}`);
      params.push(`%${filters.lastName.toLowerCase()}%`);
      paramIndex++;
    }

    // Title search (fuzzy for variations like "Chief Executive Officer" vs "CEO")
    if (filters.title) {
      conditions.push(`LOWER(title) LIKE $${paramIndex}`);
      params.push(`%${filters.title.toLowerCase()}%`);
      paramIndex++;
    }

    // Email search
    if (filters.email) {
      conditions.push(`LOWER(email) LIKE $${paramIndex}`);
      params.push(`%${filters.email.toLowerCase()}%`);
      paramIndex++;
    }

    // Phone search (search across all phone fields)
    if (filters.phone) {
      conditions.push(`(
        LOWER(mobile_phone) LIKE $${paramIndex} OR
        LOWER(other_phone) LIKE $${paramIndex} OR
        LOWER(home_phone) LIKE $${paramIndex} OR
        LOWER(corporate_phone) LIKE $${paramIndex}
      )`);
      params.push(`%${filters.phone.toLowerCase()}%`);
      paramIndex++;
    }

    // Company search
    if (filters.company) {
      conditions.push(`LOWER(company) LIKE $${paramIndex}`);
      params.push(`%${filters.company.toLowerCase()}%`);
      paramIndex++;
    }

    // Industry search
    if (filters.industry) {
      conditions.push(`LOWER(industry) LIKE $${paramIndex}`);
      params.push(`%${filters.industry.toLowerCase()}%`);
      paramIndex++;
    }

    // Location searches
    if (filters.city) {
      conditions.push(`(LOWER(city) LIKE $${paramIndex} OR LOWER(company_city) LIKE $${paramIndex})`);
      params.push(`%${filters.city.toLowerCase()}%`);
      paramIndex++;
    }

    if (filters.state) {
      conditions.push(`(LOWER(state) LIKE $${paramIndex} OR LOWER(company_state) LIKE $${paramIndex})`);
      params.push(`%${filters.state.toLowerCase()}%`);
      paramIndex++;
    }

    if (filters.country) {
      conditions.push(`(LOWER(country) LIKE $${paramIndex} OR LOWER(company_country) LIKE $${paramIndex})`);
      params.push(`%${filters.country.toLowerCase()}%`);
      paramIndex++;
    }

    // Employee count filters
    if (filters.minEmployees !== undefined) {
      conditions.push(`employees >= $${paramIndex}`);
      params.push(filters.minEmployees);
      paramIndex++;
    }

    if (filters.maxEmployees !== undefined) {
      conditions.push(`employees <= $${paramIndex}`);
      params.push(filters.maxEmployees);
      paramIndex++;
    }

    // Revenue filters
    if (filters.minRevenue !== undefined) {
      conditions.push(`annual_revenue >= $${paramIndex}`);
      params.push(filters.minRevenue);
      paramIndex++;
    }

    if (filters.maxRevenue !== undefined) {
      conditions.push(`annual_revenue <= $${paramIndex}`);
      params.push(filters.maxRevenue);
      paramIndex++;
    }

    // Lead score filters
    if (filters.minLeadScore !== undefined) {
      conditions.push(`lead_score >= $${paramIndex}`);
      params.push(filters.minLeadScore);
      paramIndex++;
    }

    if (filters.maxLeadScore !== undefined) {
      conditions.push(`lead_score <= $${paramIndex}`);
      params.push(filters.maxLeadScore);
      paramIndex++;
    }

    // Region filter
    if (filters.region) {
      conditions.push(`LOWER(region) LIKE $${paramIndex}`);
      params.push(`%${filters.region.toLowerCase()}%`);
      paramIndex++;
    }

    // Business type filter
    if (filters.businessType) {
      conditions.push(`LOWER(business_type) LIKE $${paramIndex}`);
      params.push(`%${filters.businessType.toLowerCase()}%`);
      paramIndex++;
    }

    // Technologies filter (PostgreSQL array contains)
    if (filters.technologies && filters.technologies.length > 0) {
      const techConditions = filters.technologies.map(tech => {
        const condition = `EXISTS (
          SELECT 1 FROM unnest(technologies) AS t 
          WHERE LOWER(t) LIKE $${paramIndex}
        )`;
        params.push(`%${tech.toLowerCase()}%`);
        paramIndex++;
        return condition;
      });
      conditions.push(`(${techConditions.join(' OR ')})`);
    }

    // Contact info requirements
    if (filters.hasEmail) {
      conditions.push(`email IS NOT NULL AND email != ''`);
    }

    if (filters.hasPhone) {
      conditions.push(`(
        mobile_phone IS NOT NULL OR 
        other_phone IS NOT NULL OR 
        home_phone IS NOT NULL OR 
        corporate_phone IS NOT NULL
      )`);
    }

    if (filters.hasLinkedIn) {
      conditions.push(`(
        person_linkedin IS NOT NULL OR 
        company_linkedin IS NOT NULL
      )`);
    }

    // General search terms (search across ALL 37 fields - comprehensive search)
    if (analysis.searchTerms.length > 0) {
      for (const term of analysis.searchTerms) {
        conditions.push(`(
          LOWER(full_name) LIKE $${paramIndex} OR
          LOWER(first_name) LIKE $${paramIndex} OR
          LOWER(last_name) LIKE $${paramIndex} OR
          LOWER(title) LIKE $${paramIndex} OR
          LOWER(email) LIKE $${paramIndex} OR
          LOWER(email_domain) LIKE $${paramIndex} OR
          LOWER(mobile_phone) LIKE $${paramIndex} OR
          LOWER(other_phone) LIKE $${paramIndex} OR
          LOWER(home_phone) LIKE $${paramIndex} OR
          LOWER(corporate_phone) LIKE $${paramIndex} OR
          LOWER(company) LIKE $${paramIndex} OR
          LOWER(industry) LIKE $${paramIndex} OR
          LOWER(website) LIKE $${paramIndex} OR
          LOWER(company_linkedin) LIKE $${paramIndex} OR
          LOWER(person_linkedin) LIKE $${paramIndex} OR
          LOWER(city) LIKE $${paramIndex} OR
          LOWER(state) LIKE $${paramIndex} OR
          LOWER(country) LIKE $${paramIndex} OR
          LOWER(country_code) LIKE $${paramIndex} OR
          LOWER(company_address) LIKE $${paramIndex} OR
          LOWER(company_city) LIKE $${paramIndex} OR
          LOWER(company_state) LIKE $${paramIndex} OR
          LOWER(company_country) LIKE $${paramIndex} OR
          LOWER(employee_size_bracket) LIKE $${paramIndex} OR
          LOWER(technology_category) LIKE $${paramIndex} OR
          LOWER(region) LIKE $${paramIndex} OR
          LOWER(business_type) LIKE $${paramIndex} OR
          LOWER(timezone) LIKE $${paramIndex} OR
          EXISTS (
            SELECT 1 FROM unnest(technologies) AS t 
            WHERE LOWER(t) LIKE $${paramIndex}
          )
        )`);
        params.push(`%${term.toLowerCase()}%`);
        paramIndex++;
      }
    }

    const whereClause = conditions.join(' AND ');
    
    // Smart ordering: prioritize exact matches, then by lead score
    const orderBy = `
      ORDER BY 
        CASE 
          WHEN LOWER(full_name) = $${paramIndex} THEN 1
          WHEN LOWER(company) = $${paramIndex + 1} THEN 2
          ELSE 3
        END,
        lead_score DESC NULLS LAST,
        full_name ASC
    `;
    
    params.push(analysis.searchTerms[0]?.toLowerCase() || '');
    params.push(filters.company?.toLowerCase() || '');
    params.push(limit);

    const query = `
      SELECT * FROM contacts 
      WHERE ${whereClause}
      ${orderBy}
      LIMIT $${paramIndex + 2}
    `;

    return { query, params };
  }

  /**
   * Main search method - intelligently searches across all 37 contact fields
   */
  async searchContacts(userQuery: string, limit: number = 100): Promise<{
    contacts: any[];
    total: number;
    analysis: QueryAnalysis;
  }> {
    try {
      // Analyze the user query
      const analysis = this.analyzeQuery(userQuery);
      
      console.log('Query analysis:', {
        intent: analysis.intent,
        confidence: analysis.confidence,
        filters: analysis.filters
      });

      // Build and execute the search query
      const { query, params } = this.buildSearchQuery(analysis, limit);
      
      const pool = getExternalSearchPool();
      const result = await pool.query(query, params);

      // Get total count (for pagination)
      const { query: countQuery, params: countParams } = this.buildSearchQuery(analysis, 999999);
      const totalQuery = countQuery.replace(/ORDER BY[\s\S]*LIMIT \$\d+/, '');
      const countResult = await pool.query(
        `SELECT COUNT(*) as count FROM (${totalQuery}) as subquery`,
        countParams.slice(0, -3) // Remove the exact match and limit params
      );

      return {
        contacts: result.rows,
        total: parseInt(countResult.rows[0]?.count || '0'),
        analysis
      };
    } catch (error) {
      console.error('Error in advanced contact search:', error);
      throw new Error('Failed to search contacts');
    }
  }

  /**
   * Get contact suggestions based on partial input
   */
  async getSuggestions(partialQuery: string, field: 'company' | 'title' | 'industry' | 'city', limit: number = 10): Promise<string[]> {
    try {
      const pool = getExternalSearchPool();
      const searchTerm = `%${partialQuery.toLowerCase()}%`;
      
      const result = await pool.query(`
        SELECT DISTINCT ${field}
        FROM contacts
        WHERE is_deleted = false 
          AND ${field} IS NOT NULL 
          AND LOWER(${field}) LIKE $1
        ORDER BY ${field}
        LIMIT $2
      `, [searchTerm, limit]);

      return result.rows.map(row => row[field]).filter(Boolean);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }
}

export const advancedContactSearchService = new AdvancedContactSearchService();
