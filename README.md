# Encore Media Hub

A premium platform for sophisticated content curation, where creativity meets elegance.

## Features

- **Media Upload**: Drag-and-drop interface for uploading various file types
- **Media Browser**: Browse, filter, and search through your media collection
- **Media Management**: Edit metadata, organize with tags, and delete media
- **Social Media Tools**: Generate posts, schedule content, and create color palettes

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL database and Storage)
- **State Management**: Zustand
- **Animation**: Framer Motion

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`

## Deployment

This project is configured for easy deployment on Vercel.

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

## License

MIT

