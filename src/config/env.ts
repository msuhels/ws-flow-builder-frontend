/**
 * Environment configuration
 */

export const env = {
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Validate required environment variables
if (!env.supabaseUrl || !env.supabaseAnonKey) {
  console.warn('Missing Supabase configuration. Please check your .env file.');
}
