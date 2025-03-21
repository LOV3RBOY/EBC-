"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, File, Image, Film, Music, FileText, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import NoiseTexture from "@/components/noise-texture"
import { useMediaStore } from "@/lib/stores/media-store"
import { cn } from "@/lib/utils"
import AppLayout from "@/components/layouts/app-layout"

// Import the upload handler
import { handleFileUpload } from "@/lib/upload-handler"

export default function MediaUploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { uploadMedia } = useMediaStore()
  const [files, setFiles] = useState<File[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<{ title?: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Reset form when navigating away
  useEffect(() => {
    // This will run when the component unmounts
    return () => {
      // Clean up any resources or state
      setFiles([])
      setTitle("")
      setDescription("")
      setTags([])
      setTagInput("")
      setIsUploading(false)
      setUploadProgress(0)
      setIsDragging(false)
      setErrors({})
    }
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const addTag = useCallback(() => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()])
      setTagInput("")
    }
  }, [tagInput, tags])

  const removeTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }, [])

  const handleTagKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        addTag()
      }
    },
    [addTag],
  )

  const getFileIcon = (file: File) => {
    const type = file.type.split("/")[0]
    switch (type) {
      case "image":
        return <Image className="h-6 w-6 text-blue-400" />
      case "video":
        return <Film className="h-6 w-6 text-red-400" />
      case "audio":
        return <Music className="h-6 w-6 text-green-400" />
      case "text":
      case "application":
        return <FileText className="h-6 w-6 text-yellow-400" />
      default:
        return <File className="h-6 w-6 text-zinc-400" />
    }
  }

  const getFilePreview = (file: File) => {
    const type = file.type.split("/")[0]
    if (type === "image") {
      return URL.createObjectURL(file)
    }
    return null
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateForm = () => {
    const newErrors: { title?: string } = {}

    // Title is now optional, so no validation needed

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Upload each file
      for (const file of files) {
        await handleFileUpload(
          file,
          {
            title: title.trim() || undefined, // Will use filename as fallback if title is empty
            description: description || undefined,
            tags: tags.length > 0 ? tags : undefined,
          },
          (progress) => {
            setUploadProgress(progress)
          },
        )
      }

      toast({
        title: "Upload successful",
        description: `${files.length} file${files.length > 1 ? "s" : ""} uploaded successfully.`,
      })

      // Redirect to media page after successful upload
      setTimeout(() => {
        router.push("/media")
      }, 1500)
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive",
      })
      setIsUploading(false)
    }
  }

  return (
    <AppLayout>
      <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
        <NoiseTexture opacity={0.03} />

        <div className="container mx-auto px-4 py-8 pb-24">
          <div className="max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-8"
            >
              Upload Media
            </motion.h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div
                ref={dropZoneRef}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300",
                  isDragging
                    ? "border-violet-500 bg-violet-500/10 scale-[1.02]"
                    : "border-zinc-800 bg-zinc-900/20 hover:border-violet-600/50 hover:bg-zinc-900/30",
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                  aria-label="Upload files"
                />
                <motion.div
                  animate={{
                    scale: isDragging ? 1.1 : 1,
                    y: isDragging ? -10 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-zinc-500" />
                  <h3 className="text-xl font-medium mb-2">
                    {isDragging ? "Drop files here" : "Drag and drop files here"}
                  </h3>
                  <p className="text-zinc-400 mb-4">or click to browse your device</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-zinc-700 hover:bg-zinc-800/50 transition-all duration-200 hover:scale-105"
                  >
                    Select Files
                  </Button>
                </motion.div>
              </div>

              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Selected Files ({files.length})</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFiles([])}
                        className="text-zinc-400 hover:text-zinc-100 transition-colors"
                      >
                        Clear all
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {files.map((file, index) => (
                        <motion.div
                          key={`${file.name}-${index}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors">
                            <div className="relative">
                              {getFilePreview(file) ? (
                                <div className="aspect-video bg-zinc-800 relative">
                                  <img
                                    src={getFilePreview(file) || "/placeholder.svg"}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="aspect-video bg-zinc-800 flex items-center justify-center">
                                  {getFileIcon(file)}
                                </div>
                              )}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 bg-zinc-900/80 hover:bg-zinc-800 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeFile(index)
                                }}
                                aria-label={`Remove ${file.name}`}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <CardContent className="p-4">
                              <div className="truncate font-medium mb-1" title={file.name}>
                                {file.name}
                              </div>
                              <div className="text-sm text-zinc-400">{formatFileSize(file.size)}</div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-zinc-300">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      if (errors.title) {
                        setErrors((prev) => ({ ...prev, title: undefined }))
                      }
                    }}
                    className={cn(
                      "bg-zinc-900 border-zinc-800 focus-visible:ring-violet-600 transition-all duration-200",
                      errors.title ? "border-red-500" : "",
                    )}
                    placeholder="Enter a title for your upload"
                    aria-invalid={errors.title ? "true" : "false"}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <Label htmlFor="description" className="text-zinc-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 focus-visible:ring-violet-600 min-h-[100px] transition-all duration-200"
                    placeholder="Add a description (optional)"
                  />
                </div>

                <div>
                  <Label htmlFor="tags" className="text-zinc-300">
                    Tags
                  </Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      className="bg-zinc-900 border-zinc-800 focus-visible:ring-violet-600 transition-all duration-200"
                      placeholder="Add tags (press Enter to add)"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addTag}
                      className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-colors"
                      aria-label="Add tag"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <AnimatePresence>
                    {tags.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-2 mt-2"
                      >
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="bg-zinc-800/50 border-zinc-700 text-zinc-300 transition-all duration-200 hover:border-zinc-600"
                          >
                            {tag}
                            <button
                              type="button"
                              className="ml-2 text-zinc-500 hover:text-zinc-300 transition-colors"
                              onClick={() => removeTag(tag)}
                              aria-label={`Remove tag ${tag}`}
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-zinc-400">
                    <span>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2 bg-zinc-800" indicatorClassName="bg-violet-600" />
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-zinc-800 hover:bg-zinc-800/50 transition-all duration-200"
                  onClick={() => router.push("/media")}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={files.length === 0 || isUploading}
                  className="min-w-[120px] transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {uploadProgress < 100 ? `Uploading ${Math.round(uploadProgress)}%` : "Processing..."}
                    </>
                  ) : (
                    "Upload Files"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

