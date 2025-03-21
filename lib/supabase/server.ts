import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Create a Supabase client for server-side usage
export function createServerClient() {
  const cookieStore = cookies()

  return createClient(
    "https://udtkhmgsukvkrvizekrp.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkdGtobWdzdWt2a3J2aXpla3JwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU4NzEzOCwiZXhwIjoyMDU4MTYzMTM4fQ.iIRBJft83niftatHnl2BAasdpwLzbQ9ZhyNQYj0EWxg",
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    },
  )
}

