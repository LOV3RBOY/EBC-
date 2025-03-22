import { generateId, getFileTypeFromMime } from "./utils"
import type { MediaItem, MediaUploadParams } from "./types"

export type UploadProgressCallback = (progress: number) => void

export async function handleFileUpload(
  file: File,
  metadata: {
    title?: string
    description?: string
    tags?: string[]
  } = {},
  onProgress: (progress: number) => void
): Promise<MediaItem> {
  // Simulate file upload with progress
  const totalSize = file.size;
  let uploadedSize = 0;
  const chunkSize = totalSize / 10; // Simulate 10 chunks

  // Simulate upload progress
  for (let i = 0; i < 10; i++) {
    await new Promise(resolve => setTimeout(resolve, 300));
    uploadedSize += chunkSize;
    onProgress(Math.min((uploadedSize / totalSize) * 100, 100));
  }

  // Create the media item
  const mediaItem: MediaItem = {
    id: generateId(),
    title: metadata.title || file.name,
    fileName: file.name,
    fileType: getFileTypeFromMime(file.type),
    fileSize: file.size,
    uploadDate: new Date().toISOString(),
    description: metadata.description,
    tags: metadata.tags,
    url: URL.createObjectURL(file),
    ...(file.type.startsWith('image/') && { thumbnailUrl: URL.createObjectURL(file) }),
    uploader: 'Current User',
  };

  // In a real app, you'd upload to a server here
  // For demo purposes, we're just returning the created media item
  return mediaItem;
}

