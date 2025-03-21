import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for browser-side usage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a singleton instance for client-side usage
let clientInstance: ReturnType<typeof createClient> | null = null

export const createClientComponentClient = () => {
  if (clientInstance) return clientInstance

  clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  return clientInstance
}

