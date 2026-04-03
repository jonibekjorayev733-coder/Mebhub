
DROP TABLE IF EXISTS public."user_certificates" CASCADE;
DROP TABLE IF EXISTS public."test_questions" CASCADE;
DROP TABLE IF EXISTS public."learning_items" CASCADE;
DROP TABLE IF EXISTS public."medical_topics" CASCADE;
DROP TABLE IF EXISTS public."options" CASCADE;
DROP TABLE IF EXISTS public."questions" CASCADE;
DROP TABLE IF EXISTS public."test_sets" CASCADE;
DROP TABLE IF EXISTS public."scores" CASCADE;
DROP TABLE IF EXISTS public."games" CASCADE;
DROP TABLE IF EXISTS public."multiplayer_rooms" CASCADE;
DROP TABLE IF EXISTS public."users" CASCADE;
DROP TABLE IF EXISTS public."med" CASCADE;


CREATE TABLE public."med" (
  "id" SERIAL PRIMARY KEY,
  "email" varchar(255) UNIQUE NOT NULL,
  "hashed_password" varchar(255),
  "full_name" varchar(255),
  "is_active" boolean DEFAULT true,
  "is_admin" boolean DEFAULT false,
  "google_id" varchar(255) UNIQUE,
  "google_email" varchar(255),
  "provider" varchar(50) DEFAULT 'email',
  "profile_picture" text,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone
);

CREATE TABLE public."users" (
  "id" SERIAL PRIMARY KEY,
  "email" varchar(255) UNIQUE NOT NULL,
  "hashed_password" varchar(255),
  "full_name" varchar(255),
  "is_active" boolean DEFAULT true,
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE public."games" (
  "id" SERIAL PRIMARY KEY,
  "title" varchar(255),
  "description" varchar(500)
);

CREATE TABLE public."test_sets" (
  "id" SERIAL PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "category" varchar(100),
  "description" varchar(500),
  "difficulty_level" varchar(50) DEFAULT 'Medium',
  "total_questions" integer DEFAULT 0,
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE public."questions" (
  "id" SERIAL PRIMARY KEY,
  "test_set_id" integer NOT NULL,
  "question_text" varchar(500) NOT NULL,
  "question_number" integer NOT NULL,
  "explanation" varchar(1000),
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE public."options" (
  "id" SERIAL PRIMARY KEY,
  "question_id" integer NOT NULL REFERENCES public."questions"("id") ON DELETE CASCADE,
  "option_text" varchar(255) NOT NULL,
  "is_correct" boolean DEFAULT false,
  "option_number" integer NOT NULL,
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE public."scores" (
  "id" SERIAL PRIMARY KEY,
  "user_id" integer,
  "score" integer
);

CREATE TABLE public."multiplayer_rooms" (
  "id" SERIAL PRIMARY KEY,
  "room_name" varchar(255)
);

CREATE TABLE public."medical_topics" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "description" text,
  "order" integer DEFAULT 0
);

CREATE TABLE public."learning_items" (
  "id" SERIAL PRIMARY KEY,
  "topic_id" integer NOT NULL REFERENCES public."medical_topics"("id") ON DELETE CASCADE,
  "latin_term" varchar(255) NOT NULL,
  "uzbek_term" varchar(255) NOT NULL,
  "description" text,
  "order" integer DEFAULT 0
);

CREATE TABLE public."test_questions" (
  "id" SERIAL PRIMARY KEY,
  "topic_id" integer NOT NULL REFERENCES public."medical_topics"("id") ON DELETE CASCADE,
  "question_text" text NOT NULL,
  "correct_answer" varchar(500) NOT NULL,
  "options" jsonb NOT NULL,
  "difficulty" varchar(50) DEFAULT 'medium',
  "order" integer DEFAULT 0
);

CREATE TABLE public."user_certificates" (
  "id" SERIAL PRIMARY KEY,
  "user_id" integer NOT NULL,
  "full_name" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL,
  "profile_picture" text,
  "total_topics" integer NOT NULL,
  "completed_topics" integer NOT NULL,
  "total_questions" integer NOT NULL,
  "correct_answers" integer NOT NULL,
  "percentage" float NOT NULL,
  "issued_date" timestamp DEFAULT now(),
  "certificate_number" varchar(50) UNIQUE NOT NULL,
  "signature" varchar(255),
  "created_at" timestamp DEFAULT now()
);


INSERT INTO public."med" 
  ("email", "hashed_password", "full_name", "is_active", "is_admin", "provider") 
VALUES 
  ('admin@example.com', '$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUe', 'Admin User', true, true, 'email')
ON CONFLICT DO NOTHING;

INSERT INTO public."med" 
  ("email", "hashed_password", "full_name", "is_active", "is_admin", "provider") 
VALUES 
  ('test@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUVdc/na', 'Test User', true, false, 'email')
ON CONFLICT DO NOTHING;

INSERT INTO public."medical_topics" ("name", "description", "order") 
VALUES ('Anatomiya Asoslari', 'Inson anatomiyasining asosiy bilimlari', 1)
ON CONFLICT DO NOTHING;

INSERT INTO public."learning_items" ("topic_id", "latin_term", "uzbek_term", "description", "order") 
VALUES 
  (1, 'Cor', 'Yurak', 'Qon oqim uchun tanqasimon organ', 1),
  (1, 'Pulmo', 'O''pkalar', 'Nafas olish organi', 2),
  (1, 'Cerebrum', 'Beyin', 'Markaziy sinir sistemasining asosiy qismi', 3),
  (1, 'Os', 'Suyak', 'Tana qo''ziqasining asosi', 4)
ON CONFLICT DO NOTHING;

INSERT INTO public."test_questions" 
  ("topic_id", "question_text", "correct_answer", "options", "difficulty", "order") 
VALUES 
  (
    1, 
    'Eng katta organizmaning eng katta organi qaysi?', 
    'Teri',
    '[
      {"text": "Yurak", "correct": false},
      {"text": "Teri", "correct": true},
      {"text": "Suyak", "correct": false},
      {"text": "Mushak", "correct": false}
    ]'::jsonb,
    'easy',
    1
  )
ON CONFLICT DO NOTHING;


CREATE INDEX idx_med_email ON public."med"("email");
CREATE INDEX idx_med_google_id ON public."med"("google_id");
CREATE INDEX idx_users_email ON public."users"("email");
CREATE INDEX idx_questions_test_set ON public."questions"("test_set_id");
CREATE INDEX idx_options_question ON public."options"("question_id");
CREATE INDEX idx_learning_items_topic ON public."learning_items"("topic_id");
CREATE INDEX idx_test_questions_topic ON public."test_questions"("topic_id");
CREATE INDEX idx_user_certificates_number ON public."user_certificates"("certificate_number");

