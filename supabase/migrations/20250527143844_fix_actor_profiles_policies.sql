-- Eliminar políticas existentes de actor_profiles
DROP POLICY IF EXISTS "Users can view their own actor profile" ON actor_profiles;
DROP POLICY IF EXISTS "Users can insert their own actor profile" ON actor_profiles;
DROP POLICY IF EXISTS "Users can update their own actor profile" ON actor_profiles;
DROP POLICY IF EXISTS "Casting companies can view actor profiles" ON actor_profiles;
DROP POLICY IF EXISTS "Authenticated users can view actor profiles" ON actor_profiles;
DROP POLICY IF EXISTS "Actors can insert their own profile" ON actor_profiles;
DROP POLICY IF EXISTS "Actors can update their own profile" ON actor_profiles;
DROP POLICY IF EXISTS "Actors can delete their own profile" ON actor_profiles;

-- Políticas para actor_profiles
-- 1. Cualquier usuario autenticado puede ver los perfiles de actores
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'actor_profiles' 
        AND policyname = 'Authenticated users can view actor profiles'
    ) THEN
        CREATE POLICY "Authenticated users can view actor profiles"
          ON actor_profiles
          FOR SELECT
          TO authenticated
          USING (true);
    END IF;
END $$;

-- 2. Solo los actores pueden crear su propio perfil
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'actor_profiles' 
        AND policyname = 'Actors can insert their own profile'
    ) THEN
        CREATE POLICY "Actors can insert their own profile"
          ON actor_profiles
          FOR INSERT
          TO authenticated
          WITH CHECK (
            EXISTS (
              SELECT 1 FROM actor_profiles
              WHERE id = auth.uid()
            )
          );
    END IF;
END $$;

-- 3. Solo los actores pueden actualizar su propio perfil
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'actor_profiles' 
        AND policyname = 'Actors can update their own profile'
    ) THEN
        CREATE POLICY "Actors can update their own profile"
          ON actor_profiles
          FOR UPDATE
          TO authenticated
          USING (id = auth.uid());
    END IF;
END $$;

-- 4. Solo los actores pueden eliminar su propio perfil
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'actor_profiles' 
        AND policyname = 'Actors can delete their own profile'
    ) THEN
        CREATE POLICY "Actors can delete their own profile"
          ON actor_profiles
          FOR DELETE
          TO authenticated
          USING (id = auth.uid());
    END IF;
END $$; 