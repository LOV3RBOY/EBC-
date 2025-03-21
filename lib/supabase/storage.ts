import { supabaseClient } from "./client"
import { createServerClient } from "./server"
import { v4 as uuidv4 } from "uuid"

const STORAGE_BUCKET = "media"

// Initialize the storage bucket if it doesn't exist
export async function initializeStorage() {
  const supabase = createServerClient()

  // Check if bucket exists
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.some((bucket) => bucket.name === STORAGE_BUCKET)

  if (!bucketExists) {
    // Create the bucket with public access
    const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
      public: true,
      fileSizeLimit: 100 * 1024 * 1024, // 100MB limit
    })

    if (error) {
      console.error("Error creating storage bucket:", error)
      throw error
    }
  }
}

// Upload a file to Supabase Storage
export async function uploadFile(file: File) {
  try {
    // Generate a unique file path
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${fileName}`

    // Upload the file
    const { data, error } = await supabaseClient.storage.from(STORAGE_BUCKET).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) throw error

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabaseClient.storage.from(STORAGE_BUCKET).getPublicUrl(filePath)

    return {
      path: filePath,
      url: publicUrl,
      success: true,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return {
      path: "",
      url: "",
      success: false,
      error,
    }
  }
}

// Delete a file from Supabase Storage
export async function deleteFile(filePath: string) {
  try {
    // Extract the file path from the URL if needed
    const path = filePath.includes(STORAGE_BUCKET) ? filePath.split(`${STORAGE_BUCKET}/`)[1] : filePath

    const { error } = await supabaseClient.storage.from(STORAGE_BUCKET).remove([path])

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error deleting file:", error)
    return { success: false, error }
  }
}

// Generate a thumbnail for image files
export async function generateThumbnail(file: File): Promise<string | null> {
  if (!file.type.startsWith("image/")) return null

  try {
    // For images, we'll use the same image as thumbnail
    // In a production app, you might want to resize the image
    const { path, url, success } = await uploadFile(file)
    return success ? url : null
  } catch (error) {
    console.error("Error generating thumbnail:", error)
    return null
  }
}

