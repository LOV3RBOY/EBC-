import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Create a Supabase client for server-side usage
export function createServerClient() {
  const cookieStore = cookies()
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables. Check your .env file.')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

