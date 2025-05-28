import { createClient } from '@supabase/supabase-js';

// Initialize with empty values to effectively disconnect
export const supabase = createClient('', '');