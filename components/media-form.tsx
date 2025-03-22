"use client"

import { useState } from "react"
import { createMediaItem } from "@/app/actions/media"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function MediaForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [fileType, setFileType] = useState("image")

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setMessage(null)

    try {
      // Add the file type from state
      formData.append("fileType", fileType)
      // Add a dummy file size
      formData.append("fileSize", "1024000")

      const result = await createMediaItem(formData)

      if (result.success) {
        setMessage({ type: "success", text: "Media item created successfully!" })
        // Reset form
        const form = document.getElementById("media-form") as HTMLFormElement
        form.reset()
      } else {
        setMessage({ type: "error", text: result.error || "Failed to create media item" })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Add Media Item (Server Action)</h2>

      <form id="media-form" action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-400 mb-1">
            Title
          </label>
          <Input id="title" name="title" required className="bg-zinc-800 border-zinc-700" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-400 mb-1">
            Description
          </label>
          <Textarea id="description" name="description" className="bg-zinc-800 border-zinc-700 min-h-[100px]" />
        </div>

        <div>
          <label htmlFor="fileType" className="block text-sm font-medium text-zinc-400 mb-1">
            File Type
          </label>
          <Select value={fileType} onValueChange={setFileType}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700">
              <SelectValue placeholder="Select file type" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-zinc-400 mb-1">
            URL
          </label>
          <Input
            id="url"
            name="url"
            required
            placeholder="https://example.com/image.jpg"
            className="bg-zinc-800 border-zinc-700"
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full transition-all duration-200 hover:scale-105">
          {isSubmitting ? "Creating..." : "Create Media Item"}
        </Button>

        {message && (
          <div
            className={`p-3 rounded ${message.type === "success" ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"}`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  )
}

