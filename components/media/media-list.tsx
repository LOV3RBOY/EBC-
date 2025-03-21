"use client"
import { useState } from "react"
import type React from "react"

import { motion } from "framer-motion"
import { ImageIcon, Film, Music, FileText, File, MoreVertical, Download, Share, ExternalLink } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import type { MediaItem } from "@/lib/types"
import { formatDate, formatFileSize } from "@/lib/utils"
import Link from "next/link"

interface MediaListProps {
  items: MediaItem[]
}

export default function MediaList({ items }: MediaListProps) {
  const { toast } = useToast()
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "image":
        return <ImageIcon className="h-4 w-4 text-blue-400" />
      case "video":
        return <Film className="h-4 w-4 text-red-400" />
      case "audio":
        return <Music className="h-4 w-4 text-green-400" />
      case "document":
        return <FileText className="h-4 w-4 text-yellow-400" />
      default:
        return <File className="h-4 w-4 text-zinc-400" />
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

  return (
    <div className="rounded-md border border-zinc-800 mt-6 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-zinc-900">
            <TableRow className="hover:bg-zinc-900/50 border-zinc-800">
              <TableHead className="w-[400px]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-zinc-900/50 border-zinc-800 transition-colors"
                onMouseEnter={() => setHoveredRow(item.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell className="font-medium">
                  <Link href={`/media/${item.id}`} passHref>
                    <div className="flex items-center gap-2">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {getFileIcon(item.fileType)}
                      </motion.div>
                      <span className="truncate max-w-[300px] cursor-pointer hover:text-violet-400 transition-colors">
                        {item.title}
                      </span>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-zinc-900/50 border-zinc-800 text-xs capitalize transition-colors hover:border-zinc-700"
                  >
                    {item.fileType}
                  </Badge>
                </TableCell>
                <TableCell>{formatFileSize(item.fileSize)}</TableCell>
                <TableCell>{formatDate(item.uploadDate)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={`/media/${item.id}`} passHref>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-zinc-800/50 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
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
                            className="h-8 w-8 hover:bg-zinc-800/50 transition-colors"
                            onClick={(e) => handleDownload(item, e)}
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
                            onClick={(e) => handleShare(item, e)}
                          >
                            <Share className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-800/50 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                        <Link href={`/media/${item.id}`} passHref>
                          <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800 transition-colors">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View details
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-zinc-800 transition-colors"
                          onClick={(e) => handleDownload(item, e)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-zinc-800 transition-colors"
                          onClick={(e) => handleShare(item, e)}
                        >
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

