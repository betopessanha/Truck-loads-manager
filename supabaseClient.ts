import { createClient } from '@supabase/supabase-js';

// These environment variables should be configured for your project as secrets.
// They are typically found in your Supabase project's API settings.
const supabaseUrl = "https://stkounpbfofiltkfncog.supabase.co";
const supabaseAnonKey = "sb_publishable_ERU8ezXxPG4XjWf3kcT5aA_UA6OivxJ";

// Conditionally create the client. If the variables are not set, supabase will be null.
// This prevents the application from crashing on startup and allows the UI to show a helpful message.
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
