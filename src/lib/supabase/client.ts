import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables not loaded. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
  // Optionally, you could throw an error or handle this case differently
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);