import { uploadFile, generateThumbnail } from "./supabase/storage"
import { supabaseClient } from "./supabase/client"
import { getFileTypeFromMime } from "./utils"
import type { MediaItem } from "./types"

export type UploadProgressCallback = (progress: number) => void

export async function handleFileUpload(
  file: File,
  metadata: {
    title?: string
    description?: string
    tags?: string[]
  },
  onProgress?: UploadProgressCallback,
): Promise<MediaItem> {
  try {
    // Simulate upload progress
    let progress = 0
    const progressInterval = setInterval(() => {
      progress += Math.random() * 10
      if (progress > 95) {
        progress = 95
        clearInterval(progressInterval)
      }
      onProgress?.(progress)
    }, 300)

    // 1. Upload file to storage
    const { url, success, error } = await uploadFile(file)

    if (!success || !url) {
      throw error || new Error("Failed to upload file")
    }

    // 2. Generate thumbnail if it's an image
    const thumbnailUrl = await generateThumbnail(file)

    // 3. Insert record into the database
    const { data, error: dbError } = await supabaseClient
      .from("media_items")
      .insert({
        title: metadata.title || file.name,
        description: metadata.description,
        file_name: file.name,
        file_type: getFileTypeFromMime(file.type),
        file_size: file.size,
        url: url,
        thumbnail_url: thumbnailUrl,
        uploader: "anonymous", // In a real app, this would be the user ID
        tags: metadata.tags || [],
      })
      .select()
      .single()

    if (dbError) throw dbError

    // Clear the progress interval and set to 100%
    clearInterval(progressInterval)
    onProgress?.(100)

    // Transform to match our MediaItem interface
    const mediaItem: MediaItem = {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      fileName: data.file_name,
      fileType: data.file_type,
      fileSize: data.file_size,
      url: data.url,
      thumbnailUrl: data.thumbnail_url || undefined,
      uploadDate: data.upload_date,
      lastModified: data.last_modified || undefined,
      uploader: data.uploader || undefined,
      tags: data.tags || [],
    }

    return mediaItem
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

