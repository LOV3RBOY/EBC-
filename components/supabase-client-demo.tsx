"use client"

import { useState } from "react"
import { createClientComponentClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"

export default function SupabaseClientDemo() {
  const [mediaCount, setMediaCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMediaCount = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClientComponentClient()
      const { count, error } = await supabase.from("media_items").select("*", { count: "exact", head: true })

      if (error) throw error

      setMediaCount(count)
    } catch (err) {
      console.error("Error fetching media count:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Client-Side Supabase Demo</h2>

      <div className="flex flex-col items-center gap-4">
        <Button onClick={fetchMediaCount} disabled={isLoading} className="transition-all duration-200 hover:scale-105">
          {isLoading ? "Loading..." : "Fetch Media Count"}
        </Button>

        {mediaCount !== null && !error && (
          <div className="text-center">
            <div className="text-3xl font-bold text-violet-400">{mediaCount}</div>
            <div className="text-zinc-400">Total media items in database</div>
          </div>
        )}

        {error && <div className="text-red-500 text-center">Error: {error}</div>}
      </div>

      <div className="mt-4 text-center text-zinc-400 text-sm">
        <p>This component demonstrates client-side Supabase integration.</p>
        <p>Check the Network tab to see the Supabase API call when you click the button.</p>
      </div>
    </div>
  )
}

