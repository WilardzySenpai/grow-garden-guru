import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const SUPABASE_URL = "https://emufdclxlqzwhlcsvtjt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtdWZkY2x4bHF6d2hsY3N2dGp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjExOTEsImV4cCI6MjA2NzAzNzE5MX0.ooFCI3njW3iSrU6fAACUAjnhs6t8UmVeaD45s34ERdg";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});