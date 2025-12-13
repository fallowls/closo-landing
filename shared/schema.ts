import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, numeric } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const crmUsers = pgTable("crm_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email"),
  passwordHash: text("password_hash"),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  encryptedData: text("encrypted_data").notNull(),
  fieldMappings: jsonb("field_mappings").notNull(),
  recordCount: integer("record_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  encryptedContent: text("encrypted_content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  encryptedPath: text("encrypted_path").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  mobile: text("mobile"),
  emailSent: boolean("email_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  fullName: text("full_name").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  title: text("title"),
  mobilePhone: text("mobile_phone"),
  otherPhone: text("other_phone"),
  homePhone: text("home_phone"),
  corporatePhone: text("corporate_phone"),
  company: text("company"),
  employees: integer("employees"),
  employeeSizeBracket: text("employee_size_bracket"),
  industry: text("industry"),
  website: text("website"),
  companyLinkedin: text("company_linkedin"),
  technologies: text("technologies").array(),
  annualRevenue: numeric("annual_revenue"),
  personLinkedin: text("person_linkedin"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  companyAddress: text("company_address"),
  companyCity: text("company_city"),
  companyState: text("company_state"),
  companyCountry: text("company_country"),
  emailDomain: text("email_domain"),
  countryCode: text("country_code"),
  timezone: text("timezone"),
  leadScore: numeric("lead_score"),
  companyAge: integer("company_age"),
  technologyCategory: text("technology_category"),
  region: text("region"),
  businessType: text("business_type"),
  updatedAt: timestamp("updated_at"),
  isDeleted: boolean("is_deleted").default(false),
});

export const crmContacts = pgTable("crm_contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  title: text("title"),
  email: text("email"),
  mobilePhone: text("mobile_phone"),
  otherPhone: text("other_phone"),
  homePhone: text("home_phone"),
  corporatePhone: text("corporate_phone"),
  company: text("company"),
  employees: integer("employees"),
  employeeSizeBracket: text("employee_size_bracket"),
  industry: text("industry"),
  website: text("website"),
  companyLinkedin: text("company_linkedin"),
  technologies: text("technologies").array(),
  annualRevenue: numeric("annual_revenue"),
  personLinkedin: text("person_linkedin"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  companyAddress: text("company_address"),
  companyCity: text("company_city"),
  companyState: text("company_state"),
  companyCountry: text("company_country"),
  emailDomain: text("email_domain"),
  countryCode: text("country_code"),
  timezone: text("timezone"),
  leadScore: numeric("lead_score"),
  companyAge: integer("company_age"),
  technologyCategory: text("technology_category"),
  region: text("region"),
  businessType: text("business_type"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isDeleted: boolean("is_deleted").default(false),
});

export const contactActivities = pgTable("contact_activities", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id"),
  activityType: text("activity_type"),
  description: text("description"),
  changes: jsonb("changes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const crmContactActivities = pgTable("crm_contact_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contactId: varchar("contact_id"),
  activityType: text("activity_type"),
  description: text("description"),
  changes: jsonb("changes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const importJobs = pgTable("import_jobs", {
  id: serial("id").primaryKey(),
  filename: text("filename"),
  status: text("status"),
  totalRows: integer("total_rows"),
  processedRows: integer("processed_rows"),
  successfulRows: integer("successful_rows"),
  errorRows: integer("error_rows"),
  duplicateRows: integer("duplicate_rows"),
  fieldMapping: jsonb("field_mapping"),
  errors: jsonb("errors"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const crmImportJobs = pgTable("crm_import_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename"),
  status: text("status"),
  totalRows: integer("total_rows"),
  processedRows: integer("processed_rows"),
  successfulRows: integer("successful_rows"),
  errorRows: integer("error_rows"),
  duplicateRows: integer("duplicate_rows"),
  fieldMapping: jsonb("field_mapping"),
  errors: jsonb("errors"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const crmSessions = pgTable("crm_sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Pet records table for AI to manage pet information
export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // dog, cat, bird, etc.
  breed: text("breed"),
  age: integer("age"),
  weight: text("weight"),
  gender: text("gender"),
  medicalHistory: jsonb("medical_history").default({}),
  vaccinations: jsonb("vaccinations").default([]),
  allergies: text("allergies").array().default([]),
  medications: jsonb("medications").default([]),
  emergencyContact: jsonb("emergency_contact"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI interaction history for learning and context
export const aiInteractions = pgTable("ai_interactions", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => pets.id),
  userMessage: text("user_message").notNull(),
  aiResponse: text("ai_response").notNull(),
  intent: text("intent"), // health, nutrition, training, etc.
  confidence: integer("confidence"), // 1-100
  feedback: text("feedback"), // user feedback on response quality
  context: jsonb("context").default({}), // conversation context
  createdAt: timestamp("created_at").defaultNow(),
});

// Pet health records that AI can track and analyze
export const petHealthRecords = pgTable("pet_health_records", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => pets.id),
  recordType: text("record_type").notNull(), // vaccination, checkup, medication, symptom, etc.
  title: text("title").notNull(),
  description: text("description"),
  veterinarian: text("veterinarian"),
  date: timestamp("date").notNull(),
  nextDueDate: timestamp("next_due_date"),
  cost: text("cost"),
  attachments: text("attachments").array().default([]),
  aiAnalysis: text("ai_analysis"), // AI insights about this record
  createdAt: timestamp("created_at").defaultNow(),
});

// Pet activities and behaviors for AI tracking
export const petActivities = pgTable("pet_activities", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => pets.id),
  activityType: text("activity_type").notNull(), // walk, play, feeding, training, etc.
  duration: integer("duration"), // in minutes
  intensity: text("intensity"), // low, medium, high
  notes: text("notes"),
  location: text("location"),
  weather: text("weather"),
  aiRecommendations: text("ai_recommendations"),
  date: timestamp("date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Document uploads that AI can analyze
export const petDocuments = pgTable("pet_documents", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => pets.id),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  documentType: text("document_type").notNull(), // medical, photo, certificate, etc.
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  filePath: text("file_path").notNull(),
  aiAnalysis: text("ai_analysis"), // AI analysis of document content
  extractedText: text("extracted_text"), // OCR or text extraction
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat sessions for organizing conversations
export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  petName: text("pet_name"),
  petType: text("pet_type"),
  title: text("title"), // Auto-generated title for the conversation
  isActive: boolean("is_active").default(true),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Individual chat messages within sessions
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").references(() => chatSessions.sessionId).notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // Store additional info like tokens, processing time, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// API keys for developers to integrate with FallOwl
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  isActive: boolean("is_active").default(true),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userActivityLogs = pgTable("user_activity_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  userRole: text("user_role"),
  activityType: text("activity_type").notNull(),
  action: text("action").notNull(),
  resourceType: text("resource_type"),
  resourceId: text("resource_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const loginHistory = pgTable("login_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  userRole: text("user_role").notNull(),
  success: boolean("success").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  failureReason: text("failure_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activeSessions = pgTable("active_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  userId: text("user_id"),
  userRole: text("user_role").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const campaignViews = pgTable("campaign_views", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  userId: text("user_id"),
  viewDuration: integer("view_duration"),
  contactsViewed: integer("contacts_viewed"),
  actionsPerformed: jsonb("actions_performed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactInteractions = pgTable("contact_interactions", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull(),
  userId: text("user_id"),
  interactionType: text("interaction_type").notNull(),
  details: jsonb("details"),
  campaignId: integer("campaign_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const searchQueries = pgTable("search_queries", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  query: text("query").notNull(),
  filters: jsonb("filters"),
  resultsCount: integer("results_count"),
  campaignId: integer("campaign_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fileOperations = pgTable("file_operations", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  operationType: text("operation_type").notNull(),
  filename: text("filename").notNull(),
  fileSize: integer("file_size"),
  campaignId: integer("campaign_id"),
  success: boolean("success").notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const apiUsageLogs = pgTable("api_usage_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  statusCode: integer("status_code").notNull(),
  responseTime: integer("response_time"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const securityEvents = pgTable("security_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  severity: text("severity").notNull(),
  userId: text("user_id"),
  ipAddress: text("ip_address"),
  details: jsonb("details"),
  resolved: boolean("resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminUserConversations = pgTable("admin_user_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => crmUsers.id).notNull(),
  title: text("title"),
  lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
  unreadCount: integer("unread_count").default(0).notNull(),
  adminUnreadCount: integer("admin_unread_count").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const adminUserMessages = pgTable("admin_user_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => adminUserConversations.id).notNull(),
  senderType: text("sender_type").notNull(),
  senderId: varchar("sender_id"),
  messageType: text("message_type").default('text').notNull(),
  content: text("content").notNull(),
  attachmentUrl: text("attachment_url"),
  attachmentName: text("attachment_name"),
  attachmentSize: integer("attachment_size"),
  isRead: boolean("is_read").default(false).notNull(),
  readAt: timestamp("read_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Enterprise Blog System Tables

// Blog Authors
export const blogAuthors = pgTable("blog_authors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  bio: text("bio"),
  avatar: text("avatar"),
  socialLinks: jsonb("social_links").default({}),
  expertise: text("expertise").array().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog Categories
export const blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: integer("parent_id"),
  color: text("color").default("#6366f1"),
  icon: text("icon"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog Tags
export const blogTags = pgTable("blog_tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  color: text("color").default("#10b981"),
  postCount: integer("post_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blog Posts with Enterprise SEO
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  contentHtml: text("content_html"),
  featuredImage: text("featured_image"),
  featuredImageAlt: text("featured_image_alt"),
  authorId: integer("author_id").references(() => blogAuthors.id),
  categoryId: integer("category_id").references(() => blogCategories.id),
  status: text("status").default("draft").notNull(),
  visibility: text("visibility").default("public"),
  publishedAt: timestamp("published_at"),
  scheduledAt: timestamp("scheduled_at"),
  
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  canonicalUrl: text("canonical_url"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  twitterTitle: text("twitter_title"),
  twitterDescription: text("twitter_description"),
  twitterImage: text("twitter_image"),
  structuredData: jsonb("structured_data"),
  
  focusKeyword: text("focus_keyword"),
  seoScore: integer("seo_score").default(0),
  readabilityScore: integer("readability_score").default(0),
  
  wordCount: integer("word_count").default(0),
  readingTime: integer("reading_time").default(0),
  
  allowComments: boolean("allow_comments").default(true),
  isPinned: boolean("is_pinned").default(false),
  isFeatured: boolean("is_featured").default(false),
  
  viewCount: integer("view_count").default(0),
  shareCount: integer("share_count").default(0),
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  
  affiliateLinks: jsonb("affiliate_links").default([]),
  adPlacements: jsonb("ad_placements").default([]),
  monetizationSettings: jsonb("monetization_settings").default({}),
  
  relatedPosts: integer("related_posts").array().default([]),
  internalLinks: jsonb("internal_links").default([]),
  externalLinks: jsonb("external_links").default([]),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog Post Tags Junction Table
export const blogPostTags = pgTable("blog_post_tags", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => blogPosts.id).notNull(),
  tagId: integer("tag_id").references(() => blogTags.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blog Comments
export const blogComments = pgTable("blog_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => blogPosts.id).notNull(),
  parentId: integer("parent_id"),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  authorWebsite: text("author_website"),
  content: text("content").notNull(),
  status: text("status").default("pending").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  isSpam: boolean("is_spam").default(false),
  spamScore: integer("spam_score").default(0),
  likeCount: integer("like_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog Analytics
export const blogAnalytics = pgTable("blog_analytics", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => blogPosts.id),
  eventType: text("event_type").notNull(),
  source: text("source"),
  medium: text("medium"),
  campaign: text("campaign"),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  country: text("country"),
  city: text("city"),
  device: text("device"),
  browser: text("browser"),
  os: text("os"),
  sessionId: text("session_id"),
  timeOnPage: integer("time_on_page"),
  scrollDepth: integer("scroll_depth"),
  clickedLinks: jsonb("clicked_links").default([]),
  affiliateClicks: jsonb("affiliate_clicks").default([]),
  adImpressions: jsonb("ad_impressions").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blog Subscribers
export const blogSubscribers = pgTable("blog_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  status: text("status").default("active").notNull(),
  source: text("source"),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  confirmationToken: text("confirmation_token"),
  confirmedAt: timestamp("confirmed_at"),
  preferences: jsonb("preferences").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blog Revenue Tracking
export const blogRevenue = pgTable("blog_revenue", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => blogPosts.id),
  revenueType: text("revenue_type").notNull(),
  source: text("source"),
  amount: numeric("amount").notNull(),
  currency: text("currency").default("USD"),
  transactionId: text("transaction_id"),
  affiliateId: text("affiliate_id"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blog Media Library
export const blogMedia = pgTable("blog_media", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  filePath: text("file_path").notNull(),
  width: integer("width"),
  height: integer("height"),
  altText: text("alt_text"),
  caption: text("caption"),
  credit: text("credit"),
  folderId: integer("folder_id"),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertPetSchema = createInsertSchema(pets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiInteractionSchema = createInsertSchema(aiInteractions).omit({
  id: true,
  createdAt: true,
});

export const insertPetHealthRecordSchema = createInsertSchema(petHealthRecords).omit({
  id: true,
  createdAt: true,
});

export const insertPetActivitySchema = createInsertSchema(petActivities).omit({
  id: true,
  createdAt: true,
});

export const insertPetDocumentSchema = createInsertSchema(petDocuments).omit({
  id: true,
  createdAt: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  lastMessageAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertApiKeySchema = createInsertSchema(apiKeys).omit({
  id: true,
  createdAt: true,
  lastUsedAt: true,
});

export const insertCrmContactSchema = createInsertSchema(crmContacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCrmUserSchema = createInsertSchema(crmUsers).omit({
  id: true,
  createdAt: true,
});

export const insertUserActivityLogSchema = createInsertSchema(userActivityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertLoginHistorySchema = createInsertSchema(loginHistory).omit({
  id: true,
  createdAt: true,
});

export const insertActiveSessionSchema = createInsertSchema(activeSessions).omit({
  id: true,
  createdAt: true,
  lastActivity: true,
});

export const insertCampaignViewSchema = createInsertSchema(campaignViews).omit({
  id: true,
  createdAt: true,
});

export const insertContactInteractionSchema = createInsertSchema(contactInteractions).omit({
  id: true,
  createdAt: true,
});

export const insertSearchQuerySchema = createInsertSchema(searchQueries).omit({
  id: true,
  createdAt: true,
});

export const insertFileOperationSchema = createInsertSchema(fileOperations).omit({
  id: true,
  createdAt: true,
});

export const insertApiUsageLogSchema = createInsertSchema(apiUsageLogs).omit({
  id: true,
  createdAt: true,
});

export const insertSecurityEventSchema = createInsertSchema(securityEvents).omit({
  id: true,
  createdAt: true,
});

export const insertAdminUserConversationSchema = createInsertSchema(adminUserConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastMessageAt: true,
});

export const insertAdminUserMessageSchema = createInsertSchema(adminUserMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type CrmUser = typeof crmUsers.$inferSelect;
export type InsertCrmUser = z.infer<typeof insertCrmUserSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type Pet = typeof pets.$inferSelect;
export type InsertPet = z.infer<typeof insertPetSchema>;
export type AiInteraction = typeof aiInteractions.$inferSelect;
export type InsertAiInteraction = z.infer<typeof insertAiInteractionSchema>;
export type PetHealthRecord = typeof petHealthRecords.$inferSelect;
export type InsertPetHealthRecord = z.infer<typeof insertPetHealthRecordSchema>;
export type PetActivity = typeof petActivities.$inferSelect;
export type InsertPetActivity = z.infer<typeof insertPetActivitySchema>;
export type PetDocument = typeof petDocuments.$inferSelect;
export type InsertPetDocument = z.infer<typeof insertPetDocumentSchema>;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type CrmContact = typeof crmContacts.$inferSelect;
export type InsertCrmContact = z.infer<typeof insertCrmContactSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type UserActivityLog = typeof userActivityLogs.$inferSelect;
export type InsertUserActivityLog = z.infer<typeof insertUserActivityLogSchema>;
export type LoginHistory = typeof loginHistory.$inferSelect;
export type InsertLoginHistory = z.infer<typeof insertLoginHistorySchema>;
export type ActiveSession = typeof activeSessions.$inferSelect;
export type InsertActiveSession = z.infer<typeof insertActiveSessionSchema>;
export type CampaignView = typeof campaignViews.$inferSelect;
export type InsertCampaignView = z.infer<typeof insertCampaignViewSchema>;
export type ContactInteraction = typeof contactInteractions.$inferSelect;
export type InsertContactInteraction = z.infer<typeof insertContactInteractionSchema>;
export type SearchQuery = typeof searchQueries.$inferSelect;
export type InsertSearchQuery = z.infer<typeof insertSearchQuerySchema>;
export type FileOperation = typeof fileOperations.$inferSelect;
export type InsertFileOperation = z.infer<typeof insertFileOperationSchema>;
export type ApiUsageLog = typeof apiUsageLogs.$inferSelect;
export type InsertApiUsageLog = z.infer<typeof insertApiUsageLogSchema>;
export type SecurityEvent = typeof securityEvents.$inferSelect;
export type InsertSecurityEvent = z.infer<typeof insertSecurityEventSchema>;
export type AdminUserConversation = typeof adminUserConversations.$inferSelect;
export type InsertAdminUserConversation = z.infer<typeof insertAdminUserConversationSchema>;
export type AdminUserMessage = typeof adminUserMessages.$inferSelect;
export type InsertAdminUserMessage = z.infer<typeof insertAdminUserMessageSchema>;

// Blog Insert Schemas
export const insertBlogAuthorSchema = createInsertSchema(blogAuthors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogCategorySchema = createInsertSchema(blogCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogTagSchema = createInsertSchema(blogTags).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogPostTagSchema = createInsertSchema(blogPostTags).omit({
  id: true,
  createdAt: true,
});

export const insertBlogCommentSchema = createInsertSchema(blogComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogAnalyticsSchema = createInsertSchema(blogAnalytics).omit({
  id: true,
  createdAt: true,
});

export const insertBlogSubscriberSchema = createInsertSchema(blogSubscribers).omit({
  id: true,
  createdAt: true,
});

export const insertBlogRevenueSchema = createInsertSchema(blogRevenue).omit({
  id: true,
  createdAt: true,
});

export const insertBlogMediaSchema = createInsertSchema(blogMedia).omit({
  id: true,
  createdAt: true,
});

// Blog Types
export type BlogAuthor = typeof blogAuthors.$inferSelect;
export type InsertBlogAuthor = z.infer<typeof insertBlogAuthorSchema>;
export type BlogCategory = typeof blogCategories.$inferSelect;
export type InsertBlogCategory = z.infer<typeof insertBlogCategorySchema>;
export type BlogTag = typeof blogTags.$inferSelect;
export type InsertBlogTag = z.infer<typeof insertBlogTagSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPostTag = typeof blogPostTags.$inferSelect;
export type InsertBlogPostTag = z.infer<typeof insertBlogPostTagSchema>;
export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = z.infer<typeof insertBlogCommentSchema>;
export type BlogAnalytics = typeof blogAnalytics.$inferSelect;
export type InsertBlogAnalytics = z.infer<typeof insertBlogAnalyticsSchema>;
export type BlogSubscriber = typeof blogSubscribers.$inferSelect;
export type InsertBlogSubscriber = z.infer<typeof insertBlogSubscriberSchema>;
export type BlogRevenue = typeof blogRevenue.$inferSelect;
export type InsertBlogRevenue = z.infer<typeof insertBlogRevenueSchema>;
export type BlogMedia = typeof blogMedia.$inferSelect;
export type InsertBlogMedia = z.infer<typeof insertBlogMediaSchema>;
