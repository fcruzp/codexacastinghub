-- Eliminar políticas existentes de actor_profiles
DROP POLICY IF EXISTS "Users can view their own actor profile" ON actor_profiles;
DROP POLICY IF EXISTS "Users can insert their own actor profile" ON actor_profiles;
DROP POLICY IF EXISTS "Users can update their own actor profile" ON actor_profiles;
DROP POLICY IF EXISTS "Casting companies can view actor profiles" ON actor_profiles;

-- Crear nuevas políticas para actor_profiles
CREATE POLICY "Users can view their own actor profile"
  ON actor_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own actor profile"
  ON actor_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own actor profile"
  ON actor_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Política para permitir que los usuarios de casting vean todos los perfiles de actores
CREATE POLICY "Casting companies can view actor profiles"
  ON actor_profiles
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM casting_companies 
    WHERE casting_companies.id = auth.uid()
  )); 