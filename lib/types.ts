export interface MediaItem {
  id: string
  title: string
  description?: string
  fileName: string
  fileType: string
  fileSize: number
  url: string
  thumbnailUrl?: string
  uploadDate: string
  lastModified?: string
  uploader?: string
  tags?: string[]
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
}

