"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Download, Share, Pencil, Trash2, Loader2, Save, X, File, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import NoiseTexture from "@/components/noise-texture"
import { useMediaStore } from "@/lib/stores/media-store"
import { formatDate, formatFileSize } from "@/lib/utils"
import type { MediaItem, MediaUpdateParams } from "@/lib/types"
import AppLayout from "@/components/layouts/app-layout"

export default function MediaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { getMediaById, updateMedia, deleteMedia } = useMediaStore()
  const [mediaItem, setMediaItem] = useState<MediaItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedTitle, setEditedTitle] = useState("")
  const [editedDescription, setEditedDescription] = useState("")
  const [editedTags, setEditedTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Fetch media item details
  useEffect(() => {
    const fetchMediaItem = async () => {
      if (!params.id) return

      try {
        setIsLoading(true)
        const item = await getMediaById(params.id as string)

        if (item) {
          setMediaItem(item)
          setEditedTitle(item.title)
          setEditedDescription(item.description || "")
          setEditedTags(item.tags || [])
        } else {
          toast({
            title: "Media not found",
            description: "The requested media item could not be found.",
            variant: "destructive",
          })
          router.push("/media")
        }
      } catch (error) {
        console.error("Error fetching media:", error)
        toast({
          title: "Error",
          description: "Failed to load media details.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMediaItem()
  }, [params.id, getMediaById, router, toast])

  const handleDownload = () => {
    if (!mediaItem) return

    toast({
      title: "Download started",
      description: `Downloading ${mediaItem.title}...`,
    })
  }

  const handleShare = () => {
    if (!mediaItem) return

    navigator.clipboard.writeText(`${window.location.origin}/media/${mediaItem.id}`)
    toast({
      title: "Link copied",
      description: "Shareable link copied to clipboard.",
    })
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    if (!mediaItem) return

    setEditedTitle(mediaItem.title)
    setEditedDescription(mediaItem.description || "")
    setEditedTags(mediaItem.tags || [])
    setIsEditing(false)
  }

  const handleSaveEdit = async () => {
    if (!mediaItem) return

    if (!editedTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for the media.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      const updateParams: MediaUpdateParams = {
        title: editedTitle,
        description: editedDescription || undefined,
        tags: editedTags.length > 0 ? editedTags : undefined,
      }

      const updatedItem = await updateMedia(mediaItem.id, updateParams)
      setMediaItem(updatedItem)
      setIsEditing(false)

      toast({
        title: "Changes saved",
        description: "Media details have been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating media:", error)
      toast({
        title: "Update failed",
        description: "Failed to update media details.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!mediaItem) return

    try {
      setIsDeleting(true)
      await deleteMedia(mediaItem.id)

      toast({
        title: "Media deleted",
        description: "The media has been deleted successfully.",
      })

      router.push("/media")
    } catch (error) {
      console.error("Error deleting media:", error)
      toast({
        title: "Delete failed",
        description: "Failed to delete the media.",
        variant: "destructive",
      })
      setIsDeleting(false)
      setConfirmDelete(false)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !editedTags.includes(tagInput.trim())) {
      setEditedTags([...editedTags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setEditedTags(editedTags.filter((t) => t !== tag))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
          <NoiseTexture opacity={0.03} />
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600 mb-4" />
            <p className="text-zinc-400">Loading media details...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!mediaItem) {
    return (
      <AppLayout>
        <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
          <NoiseTexture opacity={0.03} />
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Media not found</h2>
            <p className="text-zinc-400 mb-6">The requested media item could not be found.</p>
            <Button onClick={() => router.push("/media")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Media
            </Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
        <NoiseTexture opacity={0.03} />

        <div className="container mx-auto px-4 py-8 pb-24">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <Button
                variant="ghost"
                className="hover:bg-zinc-800/50 transition-colors -ml-3"
                onClick={() => router.push("/media")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Media
              </Button>

              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 transition-all duration-200"
                        onClick={handleShare}
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 transition-all duration-200"
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Download</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {!isEditing && (
                  <>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 transition-all duration-200"
                            onClick={handleEdit}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 transition-all duration-200 hover:bg-red-900/20 hover:border-red-900/50 hover:text-red-500"
                            onClick={() => setConfirmDelete(true)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}

                {isEditing && (
                  <>
                    <Button
                      variant="outline"
                      className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 transition-all duration-200"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>

                    <Button
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                      className="transition-all duration-200 hover:scale-105"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
              <div className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-zinc-400 mb-1">
                        Title
                      </label>
                      <Input
                        id="title"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 focus-visible:ring-violet-600"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-zinc-400 mb-1">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 focus-visible:ring-violet-600 min-h-[150px]"
                      />
                    </div>

                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-zinc-400 mb-1">
                        Tags
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="tags"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          className="bg-zinc-900 border-zinc-800 focus-visible:ring-violet-600"
                          placeholder="Add a tag and press Enter"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="border-zinc-800 hover:bg-zinc-800"
                          onClick={handleAddTag}
                        >
                          Add
                        </Button>
                      </div>

                      {editedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {editedTags.map((tag) => (
                            <Badge key={tag} variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300">
                              {tag}
                              <button
                                type="button"
                                className="ml-2 text-zinc-500 hover:text-zinc-300"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <motion.h1
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-3xl md:text-4xl font-display font-bold tracking-tight"
                    >
                      {mediaItem.title}
                    </motion.h1>

                    {mediaItem.description && (
                      <div className="text-zinc-300 whitespace-pre-line">{mediaItem.description}</div>
                    )}

                    {mediaItem.tags && mediaItem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {mediaItem.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                )}

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                  {mediaItem.fileType === "image" ? (
                    <div className="flex justify-center p-4">
                      <img
                        src={mediaItem.url || "/placeholder.svg"}
                        alt={mediaItem.title}
                        className="max-w-full max-h-[70vh] object-contain rounded-md"
                      />
                    </div>
                  ) : mediaItem.fileType === "video" ? (
                    <div className="p-4">
                      <video
                        src={mediaItem.url}
                        controls
                        className="w-full max-h-[70vh] rounded-md"
                        poster={mediaItem.thumbnailUrl}
                      />
                    </div>
                  ) : mediaItem.fileType === "audio" ? (
                    <div className="p-8 flex flex-col items-center justify-center">
                      <audio src={mediaItem.url} controls className="w-full" />
                    </div>
                  ) : (
                    <div className="p-8 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                        {mediaItem.fileType === "document" ? (
                          <FileText className="h-8 w-8 text-yellow-400" />
                        ) : (
                          <File className="h-8 w-8 text-zinc-400" />
                        )}
                      </div>
                      <p className="text-zinc-400 mb-4">Preview not available</p>
                      <Button onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download to view
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">File Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-zinc-800 pb-2">
                        <span className="text-zinc-400">File name</span>
                        <span className="text-zinc-300 font-medium">{mediaItem.fileName}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-800 pb-2">
                        <span className="text-zinc-400">File type</span>
                        <span className="text-zinc-300 font-medium capitalize">{mediaItem.fileType}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-800 pb-2">
                        <span className="text-zinc-400">Size</span>
                        <span className="text-zinc-300 font-medium">{formatFileSize(mediaItem.fileSize)}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-800 pb-2">
                        <span className="text-zinc-400">Uploaded</span>
                        <span className="text-zinc-300 font-medium">{formatDate(mediaItem.uploadDate)}</span>
                      </div>
                      {mediaItem.lastModified && (
                        <div className="flex justify-between border-b border-zinc-800 pb-2">
                          <span className="text-zinc-400">Last modified</span>
                          <span className="text-zinc-300 font-medium">{formatDate(mediaItem.lastModified)}</span>
                        </div>
                      )}
                      {mediaItem.uploader && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Uploader</span>
                          <span className="text-zinc-300 font-medium">{mediaItem.uploader}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Actions</h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-zinc-800 hover:bg-zinc-800/50"
                        onClick={handleDownload}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download File
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-zinc-800 hover:bg-zinc-800/50"
                        onClick={handleShare}
                      >
                        <Share className="mr-2 h-4 w-4" />
                        Share Link
                      </Button>
                      {!isEditing && (
                        <>
                          <Button
                            variant="outline"
                            className="w-full justify-start border-zinc-800 hover:bg-zinc-800/50"
                            onClick={handleEdit}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Details
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start border-zinc-800 hover:bg-red-900/20 hover:border-red-900/50 hover:text-red-500"
                            onClick={() => setConfirmDelete(true)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete File
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
          <DialogContent className="bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle>Delete Media</DialogTitle>
            </DialogHeader>
            <p className="text-zinc-300">
              Are you sure you want to delete <span className="font-medium">{mediaItem.title}</span>? This action cannot
              be undone.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                className="border-zinc-800 hover:bg-zinc-800/50"
                onClick={() => setConfirmDelete(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}

