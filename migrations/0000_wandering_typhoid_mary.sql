CREATE TABLE "active_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"user_id" text,
	"user_role" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"last_activity" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "active_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "admin_user_conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text,
	"last_message_at" timestamp DEFAULT now() NOT NULL,
	"unread_count" integer DEFAULT 0 NOT NULL,
	"admin_unread_count" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_user_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"sender_type" text NOT NULL,
	"sender_id" integer,
	"message_type" text DEFAULT 'text' NOT NULL,
	"content" text NOT NULL,
	"attachment_url" text,
	"attachment_name" text,
	"attachment_size" integer,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"pet_id" integer,
	"user_message" text NOT NULL,
	"ai_response" text NOT NULL,
	"intent" text,
	"confidence" integer,
	"feedback" text,
	"context" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "api_usage_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"endpoint" text NOT NULL,
	"method" text NOT NULL,
	"status_code" integer NOT NULL,
	"response_time" integer,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_id" integer NOT NULL,
	"user_id" text,
	"view_duration" integer,
	"contacts_viewed" integer,
	"actions_performed" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"encrypted_data" text NOT NULL,
	"field_mappings" jsonb NOT NULL,
	"record_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"pet_name" text,
	"pet_type" text,
	"title" text,
	"is_active" boolean DEFAULT true,
	"last_message_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chat_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "contact_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact_id" integer,
	"activity_type" text,
	"description" text,
	"changes" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contact_interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"contact_id" integer NOT NULL,
	"user_id" text,
	"interaction_type" text NOT NULL,
	"details" jsonb,
	"campaign_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"mobile" text,
	"email_sent" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"full_name" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"title" text,
	"mobile_phone" text,
	"other_phone" text,
	"home_phone" text,
	"corporate_phone" text,
	"company" text,
	"employees" integer,
	"employee_size_bracket" text,
	"industry" text,
	"website" text,
	"company_linkedin" text,
	"technologies" text[],
	"annual_revenue" numeric,
	"person_linkedin" text,
	"city" text,
	"state" text,
	"country" text,
	"company_address" text,
	"company_city" text,
	"company_state" text,
	"company_country" text,
	"email_domain" text,
	"country_code" text,
	"timezone" text,
	"lead_score" numeric,
	"company_age" integer,
	"technology_category" text,
	"region" text,
	"business_type" text,
	"updated_at" timestamp,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "crm_contact_activities" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_id" varchar,
	"activity_type" text,
	"description" text,
	"changes" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "crm_contacts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"title" text,
	"email" text,
	"mobile_phone" text,
	"other_phone" text,
	"home_phone" text,
	"corporate_phone" text,
	"company" text,
	"employees" integer,
	"employee_size_bracket" text,
	"industry" text,
	"website" text,
	"company_linkedin" text,
	"technologies" text[],
	"annual_revenue" numeric,
	"person_linkedin" text,
	"city" text,
	"state" text,
	"country" text,
	"company_address" text,
	"company_city" text,
	"company_state" text,
	"company_country" text,
	"email_domain" text,
	"country_code" text,
	"timezone" text,
	"lead_score" numeric,
	"company_age" integer,
	"technology_category" text,
	"region" text,
	"business_type" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "crm_import_jobs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" text,
	"status" text,
	"total_rows" integer,
	"processed_rows" integer,
	"successful_rows" integer,
	"error_rows" integer,
	"duplicate_rows" integer,
	"field_mapping" jsonb,
	"errors" jsonb,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "crm_sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crm_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "crm_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"encrypted_path" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "file_operations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"operation_type" text NOT NULL,
	"filename" text NOT NULL,
	"file_size" integer,
	"campaign_id" integer,
	"success" boolean NOT NULL,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "import_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text,
	"status" text,
	"total_rows" integer,
	"processed_rows" integer,
	"successful_rows" integer,
	"error_rows" integer,
	"duplicate_rows" integer,
	"field_mapping" jsonb,
	"errors" jsonb,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "login_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"user_role" text NOT NULL,
	"success" boolean NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"failure_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"encrypted_content" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pet_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"pet_id" integer,
	"activity_type" text NOT NULL,
	"duration" integer,
	"intensity" text,
	"notes" text,
	"location" text,
	"weather" text,
	"ai_recommendations" text,
	"date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pet_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"pet_id" integer,
	"filename" text NOT NULL,
	"original_name" text NOT NULL,
	"document_type" text NOT NULL,
	"mime_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"file_path" text NOT NULL,
	"ai_analysis" text,
	"extracted_text" text,
	"tags" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pet_health_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"pet_id" integer,
	"record_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"veterinarian" text,
	"date" timestamp NOT NULL,
	"next_due_date" timestamp,
	"cost" text,
	"attachments" text[] DEFAULT '{}',
	"ai_analysis" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"breed" text,
	"age" integer,
	"weight" text,
	"gender" text,
	"medical_history" jsonb DEFAULT '{}'::jsonb,
	"vaccinations" jsonb DEFAULT '[]'::jsonb,
	"allergies" text[] DEFAULT '{}',
	"medications" jsonb DEFAULT '[]'::jsonb,
	"emergency_contact" jsonb,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "search_queries" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"query" text NOT NULL,
	"filters" jsonb,
	"results_count" integer,
	"campaign_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "security_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"severity" text NOT NULL,
	"user_id" text,
	"ip_address" text,
	"details" jsonb,
	"resolved" boolean DEFAULT false,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"user_role" text,
	"activity_type" text NOT NULL,
	"action" text NOT NULL,
	"resource_type" text,
	"resource_id" text,
	"details" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "admin_user_conversations" ADD CONSTRAINT "admin_user_conversations_user_id_crm_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."crm_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_user_messages" ADD CONSTRAINT "admin_user_messages_conversation_id_admin_user_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."admin_user_conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_interactions" ADD CONSTRAINT "ai_interactions_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_chat_sessions_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("session_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_activities" ADD CONSTRAINT "pet_activities_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_documents" ADD CONSTRAINT "pet_documents_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_health_records" ADD CONSTRAINT "pet_health_records_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;