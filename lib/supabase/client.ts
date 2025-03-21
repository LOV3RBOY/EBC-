import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for browser-side usage
const supabaseUrl = "https://udtkhmgsukvkrvizekrp.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkdGtobWdzdWt2a3J2aXpla3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1ODcxMzgsImV4cCI6MjA1ODE2MzEzOH0.Q6zEV4_ihClyuGayQbR2r0sT79Xrs2RYAaTXBZrRz44"

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

