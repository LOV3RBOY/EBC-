import { initializeStorage } from "./supabase/storage"

export async function initializeApp() {
  try {
    // Initialize storage bucket
    await initializeStorage()
    console.log("Storage initialized successfully")

    // Add any other initialization tasks here

    return { success: true }
  } catch (error) {
    console.error("Error initializing app:", error)
    return { success: false, error }
  }
}

