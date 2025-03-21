"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, ArrowRight, Menu, FolderOpen, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import NoiseTexture from "@/components/noise-texture"
import GradientOrb from "@/components/gradient-orb"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const { left, top } = containerRef.current.getBoundingClientRect()
        setCursorPosition({
          x: e.clientX - left,
          y: e.clientY - top,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const sections = [
    { name: "BROWSE", path: "/media", icon: FolderOpen, description: "Browse and download media assets" },
    { name: "UPLOAD", path: "/upload", icon: Upload, description: "Upload new media content" },
    { name: "TOOLS", path: "/tools", icon: Wrench, description: "Social media assistance tools" },
  ]

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-screen overflow-x-hidden overflow-y-auto bg-zinc-950 text-zinc-100"
    >
      <NoiseTexture opacity={0.03} />

      <div className="absolute inset-0 pointer-events-none">
        <GradientOrb position={cursorPosition} size={hoveredSection ? 600 : 400} opacity={0.15} />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 md:p-10">
        <div className="flex items-center gap-8">
          <Button
            variant="ghost"
            size="icon"
            className="relative overflow-hidden group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 transition-all duration-300 group-hover:scale-110" />
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-100 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          </Button>

          <div className="hidden md:block text-xs tracking-widest font-light">
            <span className="text-zinc-500">ENCORE</span>
            <span className="mx-2 text-zinc-700">/</span>
            <span className="text-zinc-500">MEDIA HUB</span>
          </div>
        </div>

        <Link href="/media" passHref>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative group"
          >
            <Button
              variant="ghost"
              className="text-xs tracking-widest font-light px-0 hover:bg-transparent"
              onMouseEnter={() => setHoveredSection("BROWSE")}
              onMouseLeave={() => setHoveredSection(null)}
            >
              BROWSE
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-100 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
            </Button>
          </motion.div>
        </Link>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-md"
          >
            <div className="h-full flex flex-col justify-center items-center gap-8 p-10">
              <Link href="/" passHref>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="font-display text-5xl md:text-7xl font-light tracking-tighter hover:text-zinc-300 transition-colors duration-300 cursor-pointer">
                    HOME
                  </span>
                  <span className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-xs text-zinc-600 font-mono">
                    01
                  </span>
                </motion.div>
              </Link>

              <Link href="/media" passHref>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="font-display text-5xl md:text-7xl font-light tracking-tighter hover:text-zinc-300 transition-colors duration-300 cursor-pointer">
                    BROWSE
                  </span>
                  <span className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-xs text-zinc-600 font-mono">
                    02
                  </span>
                </motion.div>
              </Link>

              <Link href="/upload" passHref>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="font-display text-5xl md:text-7xl font-light tracking-tighter hover:text-zinc-300 transition-colors duration-300 cursor-pointer">
                    UPLOAD
                  </span>
                  <span className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-xs text-zinc-600 font-mono">
                    03
                  </span>
                </motion.div>
              </Link>

              <Link href="/tools" passHref>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="font-display text-5xl md:text-7xl font-light tracking-tighter hover:text-zinc-300 transition-colors duration-300 cursor-pointer">
                    TOOLS
                  </span>
                  <span className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-xs text-zinc-600 font-mono">
                    04
                  </span>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative h-full w-full flex flex-col items-center justify-center min-h-screen">
        {/* Background gradient circle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-full bg-gradient-to-br from-violet-900/10 to-indigo-900/10 blur-3xl" />
        </div>

        {/* Title container */}
        <div className="relative z-30 flex flex-col items-center">
          <div className="w-full">
            <h1 className="font-display text-[12vw] md:text-[18vw] lg:text-[15vw] font-black tracking-tighter mb-4 text-center text-white">
              Encore
            </h1>
          </div>

          <p className="text-zinc-400 text-sm md:text-base font-light max-w-md text-center px-6 mb-12">
            A premium platform for sophisticated content curation, where creativity meets elegance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-4xl px-6">
            {sections.map((section) => (
              <Link href={section.path} key={section.name} passHref>
                <motion.div
                  className="group"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onMouseEnter={() => setHoveredSection(section.name)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 h-full transition-all duration-300 group-hover:border-violet-600/50 group-hover:bg-zinc-900/80 group-hover:shadow-lg group-hover:shadow-violet-900/10">
                    <section.icon className="w-8 h-8 mb-4 text-zinc-400 group-hover:text-violet-400 transition-colors" />
                    <h3 className="text-lg font-medium mb-2 group-hover:text-violet-300 transition-colors">
                      {section.name}
                    </h3>
                    <p className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      {section.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-between items-end p-6 md:p-10">
        <div className="hidden md:block">
          <div className="text-xs tracking-widest font-light text-zinc-500">© ENCORE {new Date().getFullYear()}</div>
        </div>

        <Link href="/media" passHref>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-10"
            onMouseEnter={() => setHoveredSection("EXPLORE")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className="group cursor-pointer flex items-center gap-2">
              <span className="text-xs tracking-widest font-light text-zinc-400 group-hover:text-white transition-colors duration-300">
                EXPLORE
              </span>
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </motion.div>
        </Link>

        <div className="hidden md:block">
          <div className="text-xs tracking-widest font-light text-zinc-500">BETA</div>
        </div>
      </div>
    </div>
  )
}

