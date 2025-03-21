import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Create a Supabase client for server-side usage
export const createServerComponentClient = () => {
  const cookieStore = cookies()

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

// For server actions
export const createServerActionClient = () => {
  const cookieStore = cookies()

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: { path: string; maxAge: number; domain?: string }) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: { path: string; domain?: string }) {
        cookieStore.set({ name, value: "", ...options, maxAge: 0 })
      },
    },
  })
}

