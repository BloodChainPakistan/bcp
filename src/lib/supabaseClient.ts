import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.',
  );
}

/**
 * Browser Supabase client. Uses the publishable (anon) key — safe to ship.
 * All access is governed by Row-Level Security policies in the database.
 */
export const supabase = createClient(supabaseUrl, supabaseKey);
