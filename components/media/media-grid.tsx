"use client"
import { useState } from "react"
import type React from "react"

import { motion } from "framer-motion"
import { ImageIcon, Film, Music, FileText, File, MoreVertical, Download, Share, ExternalLink } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import type { MediaItem } from "@/lib/types"
import { formatDate, formatFileSize } from "@/lib/utils"
import Link from "next/link"

interface MediaGridProps {
  items: MediaItem[]
}

export default function MediaGrid({ items }: MediaGridProps) {
  const { toast } = useToast()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "image":
        return <ImageIcon className="h-6 w-6 text-blue-400" />
      case "video":
        return <Film className="h-6 w-6 text-red-400" />
      case "audio":
        return <Music className="h-6 w-6 text-green-400" />
      case "document":
        return <FileText className="h-6 w-6 text-yellow-400" />
      default:
        return <File className="h-6 w-6 text-zinc-400" />
    }
  }

  const handleShare = (item: MediaItem, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(`${window.location.origin}/media/${item.id}`)
    toast({
      title: "Link copied",
      description: "Shareable link copied to clipboard.",
    })
  }

  const handleDownload = (item: MediaItem, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toast({
      title: "Download started",
      description: `Downloading ${item.title}...`,
    })
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {items.map((mediaItem) => (
        <motion.div
          key={mediaItem.id}
          variants={item}
          onMouseEnter={() => setHoveredItem(mediaItem.id)}
          onMouseLeave={() => setHoveredItem(null)}
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Link href={`/media/${mediaItem.id}`} passHref>
            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden h-full flex flex-col hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:shadow-violet-900/10">
              <div className="aspect-video bg-zinc-800 relative cursor-pointer overflow-hidden">
                {mediaItem.fileType === "image" ? (
                  <img
                    src={mediaItem.thumbnailUrl || mediaItem.url}
                    alt={mediaItem.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getFileIcon(mediaItem.fileType)}
                  </div>
                )}

                <Badge variant="outline" className="absolute top-2 right-2 bg-zinc-900/80 border-zinc-800 text-xs">
                  {mediaItem.fileType}
                </Badge>

                {/* Quick action buttons that appear on hover */}
                <div
                  className={`absolute bottom-2 right-2 transition-opacity duration-300 ${hoveredItem === mediaItem.id ? "opacity-100" : "opacity-0"}`}
                >
                  <div className="flex gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-zinc-900/80 hover:bg-zinc-800 transition-colors"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              window.location.href = `/media/${mediaItem.id}`
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-zinc-900/80 hover:bg-zinc-800 transition-colors"
                            onClick={(e) => handleDownload(mediaItem, e)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 flex-grow">
                <div className="font-medium mb-1 truncate cursor-pointer hover:text-violet-400 transition-colors">
                  {mediaItem.title}
                </div>
                <div className="text-xs text-zinc-500 mb-2">
                  {formatDate(mediaItem.uploadDate)} • {formatFileSize(mediaItem.fileSize)}
                </div>
                {mediaItem.description && <p className="text-sm text-zinc-400 line-clamp-2">{mediaItem.description}</p>}
              </CardContent>

              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <div className="flex flex-wrap gap-1">
                  {mediaItem.tags &&
                    mediaItem.tags.slice(0, 2).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-zinc-800/50 border-zinc-700 text-zinc-400 text-xs transition-colors hover:border-zinc-600"
                      >
                        {tag}
                      </Badge>
                    ))}
                  {mediaItem.tags && mediaItem.tags.length > 2 && (
                    <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-400 text-xs">
                      +{mediaItem.tags.length - 2}
                    </Badge>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-zinc-800/50 transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-zinc-800 transition-colors"
                      onClick={(e) => {
                        e.preventDefault()
                        window.location.href = `/media/${mediaItem.id}`
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-zinc-800 transition-colors"
                      onClick={(e) => handleDownload(mediaItem, e)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-zinc-800 transition-colors"
                      onClick={(e) => handleShare(mediaItem, e)}
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}

