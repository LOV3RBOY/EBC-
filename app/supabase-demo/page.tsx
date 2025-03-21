import { createServerComponentClient } from "@/utils/supabase/server"
import SupabaseClientDemo from "@/components/supabase-client-demo"
import MediaForm from "@/components/media-form"

export default async function SupabaseDemo() {
  const supabase = createServerComponentClient()

  // Fetch media items from the database
  const { data: mediaItems, error } = await supabase
    .from("media_items")
    .select("*")
    .order("upload_date", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching media items:", error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Supabase Integration Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Media Items (Server Component)</h2>

            {error ? (
              <div className="text-red-500">Error loading media items: {error.message}</div>
            ) : !mediaItems || mediaItems.length === 0 ? (
              <div className="text-zinc-400">No media items found. Try uploading some!</div>
            ) : (
              <ul className="space-y-2">
                {mediaItems.map((item) => (
                  <li key={item.id} className="border-b border-zinc-800 pb-2">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-zinc-400">
                      {new Date(item.upload_date).toLocaleDateString()} • {item.file_type}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <SupabaseClientDemo />
        </div>

        <div>
          <MediaForm />
        </div>
      </div>

      <div className="mt-8 text-center text-zinc-400 text-sm">
        <p>This page demonstrates server-side, client-side, and server action Supabase integration.</p>
      </div>
    </div>
  )
}

