import { put, del, list, head } from "@vercel/blob"
import { generateId } from "@/lib/utils"

export async function uploadToBlob(file: File, fileName?: string) {
  try {
    // Generate a unique name if not provided
    const uniqueFileName = fileName || `${generateId()}-${file.name}`

    // Upload to Vercel Blob
    const blob = await put(uniqueFileName, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return {
      url: blob.url,
      success: true,
    }
  } catch (error) {
    console.error("Error uploading to Blob:", error)
    return {
      url: "",
      success: false,
      error,
    }
  }
}

export async function deleteFromBlob(url: string) {
  try {
    await del(url)
    return { success: true }
  } catch (error) {
    console.error("Error deleting from Blob:", error)
    return { success: false, error }
  }
}

export async function listBlobFiles() {
  try {
    const { blobs } = await list()
    return { blobs, success: true }
  } catch (error) {
    console.error("Error listing Blob files:", error)
    return { blobs: [], success: false, error }
  }
}

export async function checkBlobExists(url: string) {
  try {
    const blob = await head(url)
    return { exists: !!blob, blob }
  } catch (error) {
    return { exists: false, error }
  }
}

