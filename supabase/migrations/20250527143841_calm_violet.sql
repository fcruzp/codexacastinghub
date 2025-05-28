/*
  # Create database schema for Actor Casting Portal

  1. New Tables
    - `actor_profiles` - Stores actor details including physical attributes and skills
    - `media` - Stores media files uploaded by actors (headshots, reels, etc.)
    - `casting_companies` - Stores casting company information
    - `casting_projects` - Stores casting project details
    - `applications` - Stores actor applications to casting projects
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create actor profiles table
CREATE TABLE IF NOT EXISTS actor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  stage_name TEXT,
  date_of_birth DATE,
  gender TEXT NOT NULL,
  ethnicity TEXT,
  height_cm FLOAT,
  weight_kg FLOAT,
  eye_color TEXT,
  hair_color TEXT,
  languages TEXT[],
  skills TEXT[],
  biography TEXT,
  location_city TEXT,
  location_country TEXT,
  contact_phone TEXT,
  agent_contact_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT actor_profiles_user_id_key UNIQUE (user_id)
);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create casting companies table
CREATE TABLE IF NOT EXISTS casting_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  website TEXT,
  description TEXT,
  location_city TEXT,
  location_country TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT casting_companies_user_id_key UNIQUE (user_id)
);

-- Create casting projects table
CREATE TABLE IF NOT EXISTS casting_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES casting_companies NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  role_description TEXT NOT NULL,
  location TEXT,
  audition_date DATE,
  start_date DATE,
  end_date DATE,
  media_references TEXT[],
  status TEXT DEFAULT 'open' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users NOT NULL,
  casting_project_id UUID REFERENCES casting_projects NOT NULL,
  status TEXT DEFAULT 'applied' NOT NULL,
  note TEXT,
  applied_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Set up RLS for actor_profiles
ALTER TABLE actor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own actor profile"
  ON actor_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own actor profile"
  ON actor_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own actor profile"
  ON actor_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Casting companies can view actor profiles"
  ON actor_profiles
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM casting_companies WHERE user_id = auth.uid()
  ));

-- Set up RLS for media
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own media"
  ON media
  FOR SELECT
  USING (auth.uid() = actor_id);

CREATE POLICY "Users can insert their own media"
  ON media
  FOR INSERT
  WITH CHECK (auth.uid() = actor_id);

CREATE POLICY "Users can update their own media"
  ON media
  FOR UPDATE
  USING (auth.uid() = actor_id);

CREATE POLICY "Users can delete their own media"
  ON media
  FOR DELETE
  USING (auth.uid() = actor_id);

CREATE POLICY "Casting companies can view actor media"
  ON media
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM casting_companies WHERE user_id = auth.uid()
  ));

-- Set up RLS for casting_companies
ALTER TABLE casting_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own casting company"
  ON casting_companies
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own casting company"
  ON casting_companies
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own casting company"
  ON casting_companies
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Actors can view casting companies"
  ON casting_companies
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM actor_profiles WHERE user_id = auth.uid()
  ));

-- Set up RLS for casting_projects
ALTER TABLE casting_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Casting companies can view their projects"
  ON casting_projects
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM casting_companies 
    WHERE user_id = auth.uid() 
    AND id = casting_projects.company_id
  ));

CREATE POLICY "Casting companies can insert their projects"
  ON casting_projects
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM casting_companies 
    WHERE user_id = auth.uid() 
    AND id = casting_projects.company_id
  ));

CREATE POLICY "Casting companies can update their projects"
  ON casting_projects
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM casting_companies 
    WHERE user_id = auth.uid() 
    AND id = casting_projects.company_id
  ));

CREATE POLICY "Casting companies can delete their projects"
  ON casting_projects
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM casting_companies 
    WHERE user_id = auth.uid() 
    AND id = casting_projects.company_id
  ));

CREATE POLICY "Actors can view all projects"
  ON casting_projects
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM actor_profiles WHERE user_id = auth.uid()
  ));

-- Set up RLS for applications
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Actors can view their applications"
  ON applications
  FOR SELECT
  USING (auth.uid() = actor_id);

CREATE POLICY "Actors can insert their applications"
  ON applications
  FOR INSERT
  WITH CHECK (auth.uid() = actor_id);

CREATE POLICY "Casting companies can view applications for their projects"
  ON applications
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM casting_projects
    JOIN casting_companies ON casting_projects.company_id = casting_companies.id
    WHERE casting_companies.user_id = auth.uid()
    AND casting_projects.id = applications.casting_project_id
  ));

CREATE POLICY "Casting companies can update applications for their projects"
  ON applications
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM casting_projects
    JOIN casting_companies ON casting_projects.company_id = casting_companies.id
    WHERE casting_companies.user_id = auth.uid()
    AND casting_projects.id = applications.casting_project_id
  ));

-- Create storage buckets for media files
-- This is commented out as it would be done through the Supabase dashboard
-- and requires Supabase authentication to execute this command.
-- INSERT INTO storage.buckets (id, name, public) VALUES ('actor-media', 'actor-media', true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE actor_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE media;
ALTER PUBLICATION supabase_realtime ADD TABLE casting_companies;
ALTER PUBLICATION supabase_realtime ADD TABLE casting_projects;
ALTER PUBLICATION supabase_realtime ADD TABLE applications;

-- Add updated_at trigger for all tables
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON actor_profiles
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON media
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON casting_companies
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON casting_projects
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();