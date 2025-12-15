import { createClient } from '@supabase/supabase-js';

// Tries to get config from Environment Variables first (Secure/Production)
// If not found, tries to get from LocalStorage (Development/Prototyping)
const envUrl = process.env.SUPABASE_URL;
const envKey = process.env.SUPABASE_ANON_KEY;

const localUrl = typeof window !== 'undefined' ? localStorage.getItem('tlm_supabase_url') : null;
const localKey = typeof window !== 'undefined' ? localStorage.getItem('tlm_supabase_key') : null;

const supabaseUrl = envUrl || localUrl;
const supabaseAnonKey = envKey || localKey;

// Conditionally create the client.
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to save credentials via UI
export const setSupabaseConfig = (url: string, key: string) => {
  localStorage.setItem('tlm_supabase_url', url);
  localStorage.setItem('tlm_supabase_key', key);
  window.location.reload(); // Reload to initialize client with new keys
};

// Helper to clear credentials (Logout/Disconnect)
export const clearSupabaseConfig = () => {
  localStorage.removeItem('tlm_supabase_url');
  localStorage.removeItem('tlm_supabase_key');
  window.location.reload();
};
