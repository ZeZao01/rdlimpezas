import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://liowxepenimzqrztubvm.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpb3d4ZXBlbmltenFyenR1YnZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzNjA2OTEsImV4cCI6MjEwODkzNjY5MX0.CXWs3fEbfc3a28ghUD4xG3YGm6F0u-mxS-iGY937PWA'

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null
