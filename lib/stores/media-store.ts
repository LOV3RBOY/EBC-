import { create } from "zustand"
import { supabaseClient } from "@/lib/supabase/client"
import { uploadFile, deleteFile, generateThumbnail } from "@/lib/supabase/storage"
import { getFileTypeFromMime } from "@/lib/utils"
import type { MediaItem, MediaUploadParams, MediaUpdateParams } from "@/lib/types"

interface MediaStore {
  mediaItems: MediaItem[]
  isLoading: boolean
  error: string | null
  fetchMediaItems: () => Promise<MediaItem[]>
  getMediaById: (id: string) => Promise<MediaItem | undefined>
  uploadMedia: (params: MediaUploadParams) => Promise<MediaItem>
  updateMedia: (id: string, params: MediaUpdateParams) => Promise<MediaItem>
  deleteMedia: (id: string) => Promise<void>
}

export const useMediaStore = create<MediaStore>((set, get) => ({
  mediaItems: [],
  isLoading: false,
  error: null,

  fetchMediaItems: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabaseClient
        .from("media_items")
        .select("*")
        .order("upload_date", { ascending: false })

      if (error) throw error

      // Transform the data to match our MediaItem interface
      const mediaItems = data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description || undefined,
        fileName: item.file_name,
        fileType: item.file_type,
        fileSize: item.file_size,
        url: item.url,
        thumbnailUrl: item.thumbnail_url || undefined,
        uploadDate: item.upload_date,
        lastModified: item.last_modified || undefined,
        uploader: item.uploader || undefined,
        tags: item.tags || [],
      }))

      set({ mediaItems, isLoading: false })
      return mediaItems
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  getMediaById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabaseClient.from("media_items").select("*").eq("id", id).single()

      if (error) {
        if (error.code === "PGRST116") {
          // Record not found
          set({ isLoading: false })
          return undefined
        }
        throw error
      }

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

      set({ isLoading: false })
      return mediaItem
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  uploadMedia: async (params: MediaUploadParams) => {
    set({ isLoading: true, error: null })
    try {
      // 1. Upload file to Supabase Storage
      const { url, path, success, error: uploadError } = await uploadFile(params.file)

      if (!success || !url) {
        throw uploadError || new Error("Failed to upload file")
      }

      // 2. Generate thumbnail if it's an image
      const thumbnailUrl = await generateThumbnail(params.file)

      // 3. Get user info (in a real app, this would come from auth)
      const user = { id: "anonymous", name: "Encore Employee" }

      // 4. Insert record into the database
      const { data, error } = await supabaseClient
        .from("media_items")
        .insert({
          title: params.title || params.file.name,
          description: params.description,
          file_name: params.file.name,
          file_type: getFileTypeFromMime(params.file.type),
          file_size: params.file.size,
          url: url,
          thumbnail_url: thumbnailUrl,
          uploader: user.id,
          tags: params.tags || [],
        })
        .select()
        .single()

      if (error) throw error

      // 5. Transform to match our MediaItem interface
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

      // 6. Update the state with the new media item
      set((state) => ({
        mediaItems: [mediaItem, ...state.mediaItems],
        isLoading: false,
      }))

      return mediaItem
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  updateMedia: async (id: string, params: MediaUpdateParams) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabaseClient
        .from("media_items")
        .update({
          title: params.title,
          description: params.description,
          tags: params.tags,
          last_modified: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

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

      // Update the state with the updated media item
      set((state) => ({
        mediaItems: state.mediaItems.map((item) => (item.id === id ? mediaItem : item)),
        isLoading: false,
      }))

      return mediaItem
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  deleteMedia: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      // 1. Get the media item to find its URL
      const mediaItem = await get().getMediaById(id)

      if (!mediaItem) {
        throw new Error("Media item not found")
      }

      // 2. Delete the file from storage
      await deleteFile(mediaItem.url)

      // 3. Delete the database record
      const { error } = await supabaseClient.from("media_items").delete().eq("id", id)

      if (error) throw error

      // 4. Remove the deleted item from the state
      set((state) => ({
        mediaItems: state.mediaItems.filter((item) => item.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },
}))

