"use server"

import { createServerActionClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function createMediaItem(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const fileType = formData.get("fileType") as string
    const fileSize = Number.parseInt(formData.get("fileSize") as string)
    const url = formData.get("url") as string

    const supabase = createServerActionClient()

    const { data, error } = await supabase
      .from("media_items")
      .insert({
        title,
        description,
        file_name: title, // Simplified for demo
        file_type: fileType,
        file_size: fileSize,
        url,
        upload_date: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Revalidate the page to show the new item
    revalidatePath("/supabase-demo")

    return { success: true, data }
  } catch (error) {
    console.error("Error creating media item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

