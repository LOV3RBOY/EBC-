import { type NextRequest, NextResponse } from "next/server"
import { uploadToBlob } from "@/lib/blob-storage"
import { getFileTypeFromMime } from "@/lib/utils"
import { prisma } from "@/lib/prisma"

// GET - Fetch all media items
export async function GET() {
  try {
    const mediaItems = await prisma.mediaItem.findMany({
      orderBy: { uploadDate: "desc" },
    })

    return NextResponse.json({ mediaItems })
  } catch (error) {
    console.error("Error fetching media items:", error)
    return NextResponse.json({ error: "Failed to fetch media items" }, { status: 500 })
  }
}

// POST - Upload new media
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = (formData.get("title") as string) || file.name
    const description = formData.get("description") as string
    const tagsString = formData.get("tags") as string
    const tags = tagsString ? JSON.parse(tagsString) : []

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload file to Blob storage
    const { url, success, error } = await uploadToBlob(file)

    if (!success) {
      throw error
    }

    // Create media item in database
    const mediaItem = await prisma.mediaItem.create({
      data: {
        title,
        description,
        fileName: file.name,
        fileType: getFileTypeFromMime(file.type),
        fileSize: file.size,
        url,
        thumbnailUrl: file.type.startsWith("image/") ? url : null,
        uploadDate: new Date(),
        uploader: "Encore Employee", // Will be replaced with actual user
        tags,
      },
    })

    return NextResponse.json({ mediaItem })
  } catch (error) {
    console.error("Error uploading media:", error)
    return NextResponse.json({ error: "Failed to upload media" }, { status: 500 })
  }
}

