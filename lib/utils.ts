import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getFileTypeFromMime(mimeType: string): string {
  const type = mimeType.split("/")[0]
  switch (type) {
    case "image":
      return "image"
    case "video":
      return "video"
    case "audio":
      return "audio"
    case "text":
    case "application":
      if (
        mimeType.includes("pdf") ||
        mimeType.includes("word") ||
        mimeType.includes("excel") ||
        mimeType.includes("powerpoint") ||
        mimeType.includes("document")
      ) {
        return "document"
      }
      return "other"
    default:
      return "other"
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

