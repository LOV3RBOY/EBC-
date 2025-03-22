export interface MediaItem {
  id: string
  title: string
  fileType: string
  fileSize: number
  uploadDate: string
  description?: string
  tags?: string[]
  url?: string
}
