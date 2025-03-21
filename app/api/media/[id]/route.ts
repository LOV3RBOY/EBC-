import { type NextRequest, NextResponse } from "next/server"
import { deleteFromBlob } from "@/lib/blob-storage"
import { prisma } from "@/lib/prisma"

// GET - Fetch a specific media item
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const mediaItem = await prisma.mediaItem.findUnique({
      where: { id: params.id },
    })

    if (!mediaItem) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 })
    }

    return NextResponse.json({ mediaItem })
  } catch (error) {
    console.error("Error fetching media item:", error)
    return NextResponse.json({ error: "Failed to fetch media item" }, { status: 500 })
  }
}

// PATCH - Update a media item
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { title, description, tags } = await request.json()

    const mediaItem = await prisma.mediaItem.update({
      where: { id: params.id },
      data: {
        title,
        description,
        tags,
        lastModified: new Date(),
      },
    })

    return NextResponse.json({ mediaItem })
  } catch (error) {
    console.error("Error updating media item:", error)
    return NextResponse.json({ error: "Failed to update media item" }, { status: 500 })
  }
}

// DELETE - Delete a media item
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get the media item to find its URL
    const mediaItem = await prisma.mediaItem.findUnique({
      where: { id: params.id },
    })

    if (!mediaItem) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 })
    }

    // Delete from Blob storage
    await deleteFromBlob(mediaItem.url)

    // Delete from database
    await prisma.mediaItem.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting media item:", error)
    return NextResponse.json({ error: "Failed to delete media item" }, { status: 500 })
  }
}

