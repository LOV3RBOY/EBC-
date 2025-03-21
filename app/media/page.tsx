"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ImageIcon,
  Film,
  Music,
  FileText,
  File,
  Download,
  Share,
  Loader2,
  Eye,
  X,
  Search,
  Filter,
  Grid3X3,
  List,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog"
import NoiseTexture from "@/components/noise-texture"
import { cn } from "@/lib/utils"
import { useMediaStore } from "@/lib/stores/media-store"
import type { MediaItem } from "@/lib/types"
import AppLayout from "@/components/layouts/app-layout"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function MediaBrowsePage() {
  const { toast } = useToast()
  const { mediaItems, fetchMediaItems } = useMediaStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([])
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)
  const observerTarget = useRef<HTMLDivElement>(null)

  // Fetch initial media items
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)
      await fetchMediaItems()
      setIsLoading(false)
    }

    loadInitialData()
  }, [fetchMediaItems])

  // Implement infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !isLoading) {
          loadMoreItems()
        }
      },
      { threshold: 0.1 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, loadingMore, isLoading, filteredItems])

  // Simulate loading more items
  const loadMoreItems = async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // In a real app, this would fetch the next page of items
    // For demo purposes, we'll just set hasMore to false after the first "load more"
    setPage((prev) => prev + 1)
    setHasMore(false)
    setLoadingMore(false)
  }

  // Apply filters and sorting
  useEffect(() => {
    if (!mediaItems.length) return

    let results = [...mediaItems]

    // Apply search filter
    if (searchQuery) {
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))),
      )
    }

    // Apply file type filter
    if (fileTypeFilter !== "all") {
      results = results.filter((item) => item.fileType === fileTypeFilter)
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case "today":
          filterDate.setDate(now.getDate() - 1)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }

      results = results.filter((item) => new Date(item.uploadDate) >= filterDate)
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        results.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
        break
      case "oldest":
        results.sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime())
        break
      case "name-asc":
        results.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "name-desc":
        results.sort((a, b) => b.title.localeCompare(a.title))
        break
      case "size-asc":
        results.sort((a, b) => a.fileSize - b.fileSize)
        break
      case "size-desc":
        results.sort((a, b) => b.fileSize - a.fileSize)
        break
    }

    setFilteredItems(results)

    // Reset pagination when filters change
    setPage(1)
    setHasMore(true)
  }, [mediaItems, searchQuery, fileTypeFilter, dateFilter, sortBy])

  const handleDownload = (item: MediaItem) => {
    toast({
      title: "Download started",
      description: `Downloading ${item.title}...`,
      duration: 3000,
    })
  }

  const handleShare = (item: MediaItem) => {
    navigator.clipboard.writeText(`${window.location.origin}/media/${item.id}`)
    toast({
      title: "Link copied",
      description: "Shareable link copied to clipboard.",
      duration: 3000,
    })
  }

  const getFileIcon = (fileType: string, size: "sm" | "md" | "lg" = "md") => {
    const sizeMap = {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-10 w-10",
    }

    switch (fileType) {
      case "image":
        return <ImageIcon className={`${sizeMap[size]} text-blue-400`} />
      case "video":
        return <Film className={`${sizeMap[size]} text-red-400`} />
      case "audio":
        return <Music className={`${sizeMap[size]} text-green-400`} />
      case "document":
        return <FileText className={`${sizeMap[size]} text-yellow-400`} />
      default:
        return <File className={`${sizeMap[size]} text-zinc-400`} />
    }
  }

  return (
    <AppLayout>
      <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
        <NoiseTexture opacity={0.03} />

        <div className="container mx-auto px-4 py-8 pb-24">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-display font-bold tracking-tight"
              >
                Media Browser
              </motion.h1>

              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/upload">
                        <Button variant="default" size="sm" className="transition-all duration-200 hover:scale-105">
                          Upload New Media
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Upload new media files</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search media..."
                  className="pl-10 bg-zinc-900/50 border-zinc-800 focus-visible:ring-violet-600 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 transition-all duration-200 hover:scale-105"
                          >
                            <Filter className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Filter media</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <SheetContent className="bg-zinc-900 border-zinc-800 overflow-y-auto max-h-screen">
                    <SheetHeader>
                      <SheetTitle className="text-zinc-100">Filter Media</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-zinc-300">File Type</h3>
                        <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                          <SelectTrigger className="bg-zinc-800 border-zinc-700">
                            <SelectValue placeholder="All file types" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700">
                            <SelectItem value="all">All file types</SelectItem>
                            <SelectItem value="image">Images</SelectItem>
                            <SelectItem value="video">Videos</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                            <SelectItem value="document">Documents</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-zinc-300">Date Uploaded</h3>
                        <Select value={dateFilter} onValueChange={setDateFilter}>
                          <SelectTrigger className="bg-zinc-800 border-zinc-700">
                            <SelectValue placeholder="Any time" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700">
                            <SelectItem value="all">Any time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">Past week</SelectItem>
                            <SelectItem value="month">Past month</SelectItem>
                            <SelectItem value="year">Past year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-zinc-300">Sort By</h3>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="bg-zinc-800 border-zinc-700">
                            <SelectValue placeholder="Newest first" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700">
                            <SelectItem value="newest">Newest first</SelectItem>
                            <SelectItem value="oldest">Oldest first</SelectItem>
                            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                            <SelectItem value="size-asc">Size (smallest first)</SelectItem>
                            <SelectItem value="size-desc">Size (largest first)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="pt-4">
                        <Button
                          className="w-full"
                          onClick={() => {
                            setFileTypeFilter("all")
                            setDateFilter("all")
                            setSortBy("newest")
                            setIsFilterOpen(false)
                          }}
                        >
                          Reset Filters
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="border border-zinc-800 rounded-md flex">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "rounded-none rounded-l-md h-9 w-9 transition-colors duration-200",
                            viewMode === "grid" ? "bg-zinc-800" : "hover:bg-zinc-800/50",
                          )}
                          onClick={() => setViewMode("grid")}
                          aria-label="Grid view"
                        >
                          <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Separator orientation="vertical" className="h-9 bg-zinc-800" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "rounded-none rounded-r-md h-9 w-9 transition-colors duration-200",
                            viewMode === "list" ? "bg-zinc-800" : "hover:bg-zinc-800/50",
                          )}
                          onClick={() => setViewMode("list")}
                          aria-label="List view"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Change view mode</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] bg-zinc-900/50 border-zinc-800 transition-colors duration-200 hover:border-zinc-700">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="size-asc">Size (smallest first)</SelectItem>
                    <SelectItem value="size-desc">Size (largest first)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active filters */}
            <AnimatePresence>
              {(fileTypeFilter !== "all" || dateFilter !== "all") && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-wrap gap-2 items-center"
                >
                  <span className="text-sm text-zinc-500">Active filters:</span>
                  {fileTypeFilter !== "all" && (
                    <Badge
                      variant="outline"
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-300 animate-in fade-in"
                    >
                      Type: {fileTypeFilter}
                      <button
                        className="ml-2 text-zinc-500 hover:text-zinc-300 transition-colors"
                        onClick={() => setFileTypeFilter("all")}
                        aria-label={`Remove ${fileTypeFilter} filter`}
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {dateFilter !== "all" && (
                    <Badge
                      variant="outline"
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-300 animate-in fade-in"
                    >
                      Date: {dateFilter}
                      <button
                        className="ml-2 text-zinc-500 hover:text-zinc-300 transition-colors"
                        onClick={() => setDateFilter("all")}
                        aria-label={`Remove ${dateFilter} filter`}
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  <Button
                    variant="link"
                    size="sm"
                    className="text-zinc-500 hover:text-zinc-300 h-auto p-0 transition-colors"
                    onClick={() => {
                      setFileTypeFilter("all")
                      setDateFilter("all")
                    }}
                  >
                    Clear all
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-60">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600 mb-4" />
                <p className="text-zinc-400">Loading media...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-60 text-center"
              >
                <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 max-w-md">
                  <h3 className="text-xl font-medium mb-2">No media found</h3>
                  <p className="text-zinc-400 mb-4">
                    {searchQuery
                      ? `No results found for "${searchQuery}". Try adjusting your search or filters.`
                      : "No media items match your current filters."}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setFileTypeFilter("all")
                      setDateFilter("all")
                    }}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    Reset all filters
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="min-h-[60vh]">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                    {filteredItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="group"
                      >
                        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden h-full flex flex-col hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:shadow-violet-900/10">
                          <div
                            className="aspect-video bg-zinc-800 relative cursor-pointer overflow-hidden"
                            onClick={() => setPreviewItem(item)}
                          >
                            {item.fileType === "image" ? (
                              <img
                                src={item.thumbnailUrl || item.url}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                {getFileIcon(item.fileType, "lg")}
                              </div>
                            )}

                            <Badge
                              variant="outline"
                              className="absolute top-2 right-2 bg-zinc-900/80 border-zinc-800 text-xs"
                            >
                              {item.fileType}
                            </Badge>

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white bg-black/50 hover:bg-black/70"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPreviewItem(item)
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </Button>
                            </div>
                          </div>

                          <div className="p-4 flex-grow">
                            <div
                              className="font-medium mb-1 truncate cursor-pointer hover:text-violet-400 transition-colors"
                              onClick={() => setPreviewItem(item)}
                            >
                              {item.title}
                            </div>
                            <div className="text-xs text-zinc-500 mb-2">
                              {new Date(item.uploadDate).toLocaleDateString()}
                            </div>
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.tags.slice(0, 2).map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-zinc-800/50 border-zinc-700 text-zinc-400 text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {item.tags.length > 2 && (
                                  <Badge
                                    variant="outline"
                                    className="bg-zinc-800/50 border-zinc-700 text-zinc-400 text-xs"
                                  >
                                    +{item.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="p-4 pt-0 flex justify-between items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 hover:bg-zinc-800/50 transition-colors"
                              onClick={() => handleDownload(item)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-zinc-800/50 transition-colors"
                              onClick={() => handleShare(item)}
                            >
                              <Share className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-zinc-800 mt-6 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-zinc-900">
                          <tr className="border-b border-zinc-800">
                            <th className="text-left py-3 px-4">Name</th>
                            <th className="text-left py-3 px-4">Type</th>
                            <th className="text-left py-3 px-4">Size</th>
                            <th className="text-left py-3 px-4">Date</th>
                            <th className="text-right py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredItems.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors"
                            >
                              <td className="py-3 px-4">
                                <div
                                  className="flex items-center gap-2 cursor-pointer"
                                  onClick={() => setPreviewItem(item)}
                                >
                                  {getFileIcon(item.fileType, "sm")}
                                  <span className="truncate max-w-[200px] hover:text-violet-400 transition-colors">
                                    {item.title}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className="bg-zinc-900/50 border-zinc-800 text-xs capitalize">
                                  {item.fileType}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-zinc-400 text-sm">
                                {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                              </td>
                              <td className="py-3 px-4 text-zinc-400 text-sm">
                                {new Date(item.uploadDate).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex justify-end gap-1">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 hover:bg-zinc-800/50 transition-colors"
                                          onClick={() => setPreviewItem(item)}
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Preview</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>

                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 hover:bg-zinc-800/50 transition-colors"
                                          onClick={() => handleDownload(item)}
                                        >
                                          <Download className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Download</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>

                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 hover:bg-zinc-800/50 transition-colors"
                                          onClick={() => handleShare(item)}
                                        >
                                          <Share className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Share</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Infinite scroll observer */}
                <div ref={observerTarget} className="h-10 w-full flex justify-center items-center mt-4">
                  {loadingMore && (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                      <span className="text-zinc-500 text-sm">Loading more...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Media Preview Dialog */}
        <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
          <DialogContent className="bg-zinc-900 border-zinc-800 max-w-4xl w-[90vw]">
            <DialogTitle className="flex justify-between items-center">
              <span className="truncate">{previewItem?.title}</span>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </DialogTitle>

            <div className="mt-4">
              <div className="bg-zinc-950 rounded-md overflow-hidden">
                {previewItem?.fileType === "image" ? (
                  <div className="flex justify-center">
                    <img
                      src={previewItem.url || "/placeholder.svg"}
                      alt={previewItem.title}
                      className="max-h-[60vh] object-contain"
                    />
                  </div>
                ) : previewItem?.fileType === "video" ? (
                  <video src={previewItem.url} controls className="w-full max-h-[60vh]" />
                ) : previewItem?.fileType === "audio" ? (
                  <div className="p-8 flex flex-col items-center justify-center">
                    <audio src={previewItem.url} controls className="w-full" />
                  </div>
                ) : (
                  <div className="aspect-video flex flex-col items-center justify-center p-8">
                    {previewItem && getFileIcon(previewItem.fileType, "lg")}
                    <p className="mt-4 text-zinc-400">Preview not available</p>
                  </div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                <div>
                  {previewItem?.description && (
                    <p className="text-zinc-300 whitespace-pre-line">{previewItem.description}</p>
                  )}

                  {previewItem?.tags && previewItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {previewItem.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-zinc-800/30 rounded-md p-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">File name:</span>
                    <span className="text-zinc-300 font-medium">{previewItem?.fileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">File type:</span>
                    <span className="text-zinc-300 font-medium capitalize">{previewItem?.fileType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Size:</span>
                    <span className="text-zinc-300 font-medium">
                      {previewItem && (previewItem.fileSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Uploaded:</span>
                    <span className="text-zinc-300 font-medium">
                      {previewItem && new Date(previewItem.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                  {previewItem?.uploader && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Uploader:</span>
                      <span className="text-zinc-300 font-medium">{previewItem.uploader}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleShare(previewItem!)}
                  className="border-zinc-800 hover:bg-zinc-800/50 transition-all duration-200"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  onClick={() => handleDownload(previewItem!)}
                  className="transition-all duration-200 hover:scale-105"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}

