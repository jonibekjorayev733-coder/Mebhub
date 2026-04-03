-- ============================================================
-- Clean Database Initialization Script
-- Creates all tables with proper sequences
-- ============================================================

-- Drop existing sequences first (if they exist)
DROP SEQUENCE IF EXISTS admin_roles_id_seq CASCADE;
DROP SEQUENCE IF EXISTS emailuser_id_seq CASCADE;
DROP SEQUENCE IF EXISTS games_id_seq CASCADE;
DROP SEQUENCE IF EXISTS learning_items_id_seq CASCADE;
DROP SEQUENCE IF EXISTS med_id_seq CASCADE;
DROP SEQUENCE IF EXISTS medical_terms_id_seq CASCADE;
DROP SEQUENCE IF EXISTS medical_topics_id_seq CASCADE;
DROP SEQUENCE IF EXISTS multiplayer_rooms_id_seq CASCADE;
DROP SEQUENCE IF EXISTS options_id_seq CASCADE;
DROP SEQUENCE IF EXISTS questions_id_seq CASCADE;
DROP SEQUENCE IF EXISTS scores_id_seq CASCADE;
DROP SEQUENCE IF EXISTS test_questions_id_seq CASCADE;
DROP SEQUENCE IF EXISTS test_sets_id_seq CASCADE;
DROP SEQUENCE IF EXISTS user_certificates_id_seq CASCADE;
DROP SEQUENCE IF EXISTS user_learning_progress_id_seq CASCADE;
DROP SEQUENCE IF EXISTS user_test_results_id_seq CASCADE;
DROP SEQUENCE IF EXISTS users_id_seq CASCADE;

-- Drop existing tables (if they exist)
DROP TABLE IF EXISTS public."admin_roles" CASCADE;
DROP TABLE IF EXISTS public."emailuser" CASCADE;
DROP TABLE IF EXISTS public."games" CASCADE;
DROP TABLE IF EXISTS public."learning_items" CASCADE;
DROP TABLE IF EXISTS public."med" CASCADE;
DROP TABLE IF EXISTS public."medical_terms" CASCADE;
DROP TABLE IF EXISTS public."medical_topics" CASCADE;
DROP TABLE IF EXISTS public."multiplayer_rooms" CASCADE;
DROP TABLE IF EXISTS public."options" CASCADE;
DROP TABLE IF EXISTS public."questions" CASCADE;
DROP TABLE IF EXISTS public."scores" CASCADE;
DROP TABLE IF EXISTS public."test_questions" CASCADE;
DROP TABLE IF EXISTS public."test_sets" CASCADE;
DROP TABLE IF EXISTS public."user_certificates" CASCADE;
DROP TABLE IF EXISTS public."user_learning_progress" CASCADE;
DROP TABLE IF EXISTS public."user_test_results" CASCADE;
DROP TABLE IF EXISTS public."users" CASCADE;

-- ============================================================
-- CREATE SEQUENCES
-- ============================================================

CREATE SEQUENCE admin_roles_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE emailuser_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE games_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE learning_items_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE med_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE medical_terms_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE medical_topics_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE multiplayer_rooms_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE options_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE questions_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE scores_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE test_questions_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE test_sets_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE user_certificates_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE user_learning_progress_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE user_test_results_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE users_id_seq START 1 INCREMENT 1;

-- ============================================================
-- CREATE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public."users" (
  "id" integer DEFAULT nextval('users_id_seq'::regclass) PRIMARY KEY,
  "email" varchar(255) UNIQUE NOT NULL,
  "password" varchar(255),
  "full_name" varchar(255),
  "provider" varchar(50) DEFAULT 'email',
  "google_id" varchar(255),
  "is_active" boolean DEFAULT true,
  "is_admin" boolean DEFAULT false,
  "profile_picture" text,
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."admin_roles" (
  "id" integer DEFAULT nextval('admin_roles_id_seq'::regclass) PRIMARY KEY,
  "user_id" integer REFERENCES public."users"("id") ON DELETE CASCADE,
  "email" varchar(255),
  "role" varchar(50),
  "permissions" text,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public."medical_topics" (
  "id" integer DEFAULT nextval('medical_topics_id_seq'::regclass) PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "description" text,
  "order" integer
);

CREATE TABLE IF NOT EXISTS public."learning_items" (
  "id" integer DEFAULT nextval('learning_items_id_seq'::regclass) PRIMARY KEY,
  "topic_id" integer REFERENCES public."medical_topics"("id") ON DELETE CASCADE,
  "title" varchar(255),
  "content" text,
  "order" integer
);

CREATE TABLE IF NOT EXISTS public."test_sets" (
  "id" integer DEFAULT nextval('test_sets_id_seq'::regclass) PRIMARY KEY,
  "title" varchar(255),
  "description" text,
  "topic_id" integer REFERENCES public."medical_topics"("id") ON DELETE CASCADE,
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."questions" (
  "id" integer DEFAULT nextval('questions_id_seq'::regclass) PRIMARY KEY,
  "test_set_id" integer REFERENCES public."test_sets"("id") ON DELETE CASCADE,
  "question_text" text,
  "question_type" varchar(50),
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."options" (
  "id" integer DEFAULT nextval('options_id_seq'::regclass) PRIMARY KEY,
  "question_id" integer REFERENCES public."questions"("id") ON DELETE CASCADE,
  "option_text" text,
  "is_correct" boolean DEFAULT false,
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."test_questions" (
  "id" integer DEFAULT nextval('test_questions_id_seq'::regclass) PRIMARY KEY,
  "test_id" integer,
  "question_id" integer REFERENCES public."questions"("id") ON DELETE CASCADE,
  "order" integer
);

CREATE TABLE IF NOT EXISTS public."user_test_results" (
  "id" integer DEFAULT nextval('user_test_results_id_seq'::regclass) PRIMARY KEY,
  "user_id" integer REFERENCES public."users"("id") ON DELETE CASCADE,
  "test_set_id" integer REFERENCES public."test_sets"("id") ON DELETE CASCADE,
  "score" integer,
  "completed_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."user_learning_progress" (
  "id" integer DEFAULT nextval('user_learning_progress_id_seq'::regclass) PRIMARY KEY,
  "user_id" integer REFERENCES public."users"("id") ON DELETE CASCADE,
  "topic_id" integer REFERENCES public."medical_topics"("id") ON DELETE CASCADE,
  "completed" boolean DEFAULT false,
  "last_accessed" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."user_certificates" (
  "id" integer DEFAULT nextval('user_certificates_id_seq'::regclass) PRIMARY KEY,
  "user_id" integer REFERENCES public."users"("id") ON DELETE CASCADE,
  "certificate_name" varchar(255),
  "issued_date" timestamp with time zone,
  "expires_date" timestamp with time zone,
  "certificate_url" text,
  "created_at" timestamp without time zone
);

CREATE TABLE IF NOT EXISTS public."games" (
  "id" integer DEFAULT nextval('games_id_seq'::regclass) PRIMARY KEY,
  "name" varchar(255),
  "description" character varying
);

CREATE TABLE IF NOT EXISTS public."scores" (
  "id" integer DEFAULT nextval('scores_id_seq'::regclass) PRIMARY KEY,
  "user_id" integer,
  "score" integer
);

CREATE TABLE IF NOT EXISTS public."multiplayer_rooms" (
  "id" integer DEFAULT nextval('multiplayer_rooms_id_seq'::regclass) PRIMARY KEY,
  "room_name" character varying
);

CREATE TABLE IF NOT EXISTS public."medical_terms" (
  "id" integer DEFAULT nextval('medical_terms_id_seq'::regclass) PRIMARY KEY,
  "term" varchar(255),
  "definition" text,
  "related_topic_id" integer REFERENCES public."medical_topics"("id") ON DELETE CASCADE,
  "created_at" timestamp with time zone DEFAULT now()
);

-- ============================================================
-- INSERT TEST DATA
-- ============================================================

-- Insert admin user
INSERT INTO public."users" ("email", "password", "full_name", "provider", "is_active", "is_admin") 
VALUES ('admin@example.com', '$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUe', 'Admin User', 'email', true, true)
ON CONFLICT DO NOTHING;

-- Insert test users
INSERT INTO public."users" ("email", "password", "full_name", "provider", "is_active", "is_admin") 
VALUES ('test@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUVdc/na', 'Test User', 'email', true, false)
ON CONFLICT DO NOTHING;

INSERT INTO public."users" ("email", "password", "full_name", "provider", "is_active", "is_admin") 
VALUES ('user1@example.com', '$2b$12$4QJN.kwRhCUpqlXW5ACqseqiBmXLDhra/qkCgdNz5XKKNoibjDt1O', 'User One', 'email', true, false)
ON CONFLICT DO NOTHING;

INSERT INTO public."users" ("email", "password", "full_name", "provider", "is_active", "is_admin") 
VALUES ('user2@example.com', '$2b$12$MeNWM7a/fczpSpR1Ck80WeOA5.jI6tk7vhfz7brXyoDcDbhetan8O', 'User Two', 'email', true, false)
ON CONFLICT DO NOTHING;

-- Insert sample medical topic
INSERT INTO public."medical_topics" ("name", "description") 
VALUES ('Anatomy Basics', 'Introduction to human anatomy')
ON CONFLICT DO NOTHING;

-- Insert sample test set
INSERT INTO public."test_sets" ("title", "description", "topic_id") 
VALUES ('Anatomy Quiz 1', 'Basic anatomy quiz', 1)
ON CONFLICT DO NOTHING;

-- Insert sample question
INSERT INTO public."questions" ("test_set_id", "question_text", "question_type") 
VALUES (1, 'What is the largest organ in the human body?', 'multiple_choice')
ON CONFLICT DO NOTHING;

-- Insert sample options
INSERT INTO public."options" ("question_id", "option_text", "is_correct") 
VALUES (1, 'Brain', false)
ON CONFLICT DO NOTHING;

INSERT INTO public."options" ("question_id", "option_text", "is_correct") 
VALUES (1, 'Skin', true)
ON CONFLICT DO NOTHING;

INSERT INTO public."options" ("question_id", "option_text", "is_correct") 
VALUES (1, 'Heart', false)
ON CONFLICT DO NOTHING;

-- ============================================================
-- DONE
-- ============================================================

COMMIT;
