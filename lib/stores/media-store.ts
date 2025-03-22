import { create } from 'zustand';
import { supabaseClient } from "@/lib/supabase/client"
import { uploadFile, deleteFile, generateThumbnail } from "@/lib/supabase/storage"
import { getFileTypeFromMime } from "@/lib/utils"
import { generateId } from '../utils';
import type { MediaItem, MediaUploadParams, MediaUpdateParams } from '../types';

type MediaStore = {
  mediaItems: MediaItem[];
  fetchMediaItems: () => Promise<MediaItem[]>;
  getMediaById: (id: string) => Promise<MediaItem | undefined>;
  uploadMedia: (file: File, metadata: { title?: string; description?: string; tags?: string[] }) => Promise<MediaItem>;
  updateMedia: (id: string, updates: MediaUpdateParams) => Promise<MediaItem>;
  deleteMedia: (id: string) => Promise<void>;
};

// Mock data
const sampleMediaItems: MediaItem[] = [
  {
    id: "media1",
    title: "Summer Beach",
    fileName: "beach.jpg",
    fileType: "image",
    fileSize: 2400000,
    uploadDate: "2023-06-15T10:30:00Z",
    description: "Beautiful summer day at the beach",
    tags: ["summer", "beach", "vacation"],
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
    uploader: "John Doe"
  },
  {
    id: "media2",
    title: "Mountain Hiking",
    fileName: "mountain.jpg",
    fileType: "image",
    fileSize: 3500000,
    uploadDate: "2023-07-20T14:45:00Z",
    description: "Breathtaking view from the top of the mountain",
    tags: ["hiking", "nature", "mountains"],
    url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2076&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2076&auto=format&fit=crop",
    uploader: "Sarah Smith"
  },
  {
    id: "media3",
    title: "Project Presentation",
    fileName: "presentation.pdf",
    fileType: "document",
    fileSize: 1800000,
    uploadDate: "2023-08-05T09:15:00Z",
    description: "Final project presentation for the client",
    tags: ["work", "presentation", "project"],
    url: "#",
    uploader: "Alex Johnson"
  },
  {
    id: "media4",
    title: "New Product Demo",
    fileName: "demo.mp4",
    fileType: "video",
    fileSize: 25000000,
    uploadDate: "2023-09-12T16:20:00Z",
    description: "Demonstration of our new product features",
    tags: ["product", "demo", "marketing"],
    url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2074&auto=format&fit=crop",
    uploader: "Emma Wilson"
  },
  {
    id: "media5",
    title: "Podcast Episode 12",
    fileName: "podcast_ep12.mp3",
    fileType: "audio",
    fileSize: 15000000,
    uploadDate: "2023-10-25T08:00:00Z",
    description: "Interview with industry expert on future trends",
    tags: ["podcast", "interview", "tech"],
    url: "https://sample-videos.com/audio/mp3/crowd-cheering.mp3",
    uploader: "Michael Brown"
  }
];

export const useMediaStore = create<MediaStore>((set, get) => ({
  mediaItems: [],
  
  fetchMediaItems: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mediaItems = [...sampleMediaItems];
    set({ mediaItems });
    return mediaItems;
  },
  
  getMediaById: async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return get().mediaItems.find(item => item.id === id);
  },
  
  uploadMedia: async (file, metadata) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newMediaItem: MediaItem = {
      id: generateId(),
      title: metadata.title || file.name,
      fileName: file.name,
      fileType: file.type.split('/')[0] === 'image' ? 'image' : 
                file.type.split('/')[0] === 'video' ? 'video' : 
                file.type.split('/')[0] === 'audio' ? 'audio' : 'document',
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      description: metadata.description,
      tags: metadata.tags,
      url: URL.createObjectURL(file),
      thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      uploader: "Current User"
    };
    
    set(state => ({
      mediaItems: [newMediaItem, ...state.mediaItems]
    }));
    
    return newMediaItem;
  },
  
  updateMedia: async (id: string, updates: MediaUpdateParams) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let updatedItem: MediaItem | undefined;
    
    set(state => {
      const updatedItems = state.mediaItems.map(item => {
        if (item.id === id) {
          updatedItem = {
            ...item,
            ...updates,
            lastModified: new Date().toISOString()
          };
          return updatedItem;
        }
        return item;
      });
      
      return { mediaItems: updatedItems };
    });
    
    if (!updatedItem) {
      throw new Error(`Media item with id ${id} not found`);
    }
    
    return updatedItem;
  },
  
  deleteMedia: async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    set(state => ({
      mediaItems: state.mediaItems.filter(item => item.id !== id)
    }));
  }
}));

