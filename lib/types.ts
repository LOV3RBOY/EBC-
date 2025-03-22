export interface MediaItem {
  id: string
  title: string
  fileName?: string
  fileType: string
  fileSize: number
  uploadDate: string
  description?: string
  tags?: string[]
  url?: string
  thumbnailUrl?: string
  uploader?: string
  lastModified?: string
}

export interface MediaUploadParams {
  file: File
  title?: string
  description?: string
  tags?: string[]
}

export interface MediaUpdateParams {
  title?: string
  description?: string
  tags?: string[]
  url?: string
  thumbnailUrl?: string
}

