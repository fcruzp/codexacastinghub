-- Primero eliminamos las políticas existentes
DROP POLICY IF EXISTS "Users can view their own casting company" ON casting_companies;
DROP POLICY IF EXISTS "Users can insert their own casting company" ON casting_companies;
DROP POLICY IF EXISTS "Users can update their own casting company" ON casting_companies;
DROP POLICY IF EXISTS "Actors can view casting companies" ON casting_companies;

-- Luego creamos las nuevas políticas
CREATE POLICY "Users can view their own casting company"
  ON casting_companies
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = casting_companies.id AND auth.uid() = profiles.id
  ));

CREATE POLICY "Users can insert their own casting company"
  ON casting_companies
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = casting_companies.id AND auth.uid() = profiles.id
  ));

CREATE POLICY "Users can update their own casting company"
  ON casting_companies
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = casting_companies.id AND auth.uid() = profiles.id
  ));

CREATE POLICY "Actors can view casting companies"
  ON casting_companies
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM actor_profiles WHERE id = auth.uid()
  ));

-- También necesitamos actualizar las políticas de casting_projects
DROP POLICY IF EXISTS "Casting companies can view their projects" ON casting_projects;
DROP POLICY IF EXISTS "Casting companies can insert their projects" ON casting_projects;
DROP POLICY IF EXISTS "Casting companies can update their projects" ON casting_projects;
DROP POLICY IF EXISTS "Casting companies can delete their projects" ON casting_projects;

CREATE POLICY "Casting companies can view their projects"
  ON casting_projects
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM casting_companies 
    JOIN profiles ON casting_companies.id = profiles.id
    WHERE profiles.id = auth.uid() 
    AND casting_companies.id = casting_projects.company_id
  ));

CREATE POLICY "Casting companies can insert their projects"
  ON casting_projects
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM casting_companies 
    JOIN profiles ON casting_companies.id = profiles.id
    WHERE profiles.id = auth.uid() 
    AND casting_companies.id = casting_projects.company_id
  ));

CREATE POLICY "Casting companies can update their projects"
  ON casting_projects
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM casting_companies 
    JOIN profiles ON casting_companies.id = profiles.id
    WHERE profiles.id = auth.uid() 
    AND casting_companies.id = casting_projects.company_id
  ));

CREATE POLICY "Casting companies can delete their projects"
  ON casting_projects
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM casting_companies 
    JOIN profiles ON casting_companies.id = profiles.id
    WHERE profiles.id = auth.uid() 
    AND casting_companies.id = casting_projects.company_id
  ));

-- Agregar políticas para actor_profiles
DROP POLICY IF EXISTS "Users can view their own actor profile" ON actor_profiles;
DROP POLICY IF EXISTS "Users can insert their own actor profile" ON actor_profiles;
DROP POLICY IF EXISTS "Users can update their own actor profile" ON actor_profiles;
DROP POLICY IF EXISTS "Casting companies can view actor profiles" ON actor_profiles;

CREATE POLICY "Users can view their own actor profile"
  ON actor_profiles
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = actor_profiles.id AND auth.uid() = profiles.id
  ));

CREATE POLICY "Users can insert their own actor profile"
  ON actor_profiles
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = actor_profiles.id AND auth.uid() = profiles.id
  ));

CREATE POLICY "Users can update their own actor profile"
  ON actor_profiles
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = actor_profiles.id AND auth.uid() = profiles.id
  ));

CREATE POLICY "Casting companies can view actor profiles"
  ON actor_profiles
  FOR SELECT
  USING (true); 