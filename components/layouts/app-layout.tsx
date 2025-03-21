"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, FolderOpen, Upload, Wrench, Menu, X, ArrowUp, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Browse", href: "/media", icon: FolderOpen },
    { name: "Upload", href: "/upload", icon: Upload },
    { name: "Tools", href: "/tools", icon: Wrench },
    { name: "Supabase Demo", href: "/supabase-demo", icon: Database },
  ]

  // Handle scroll events to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isMobileMenuOpen && !target.closest(".mobile-menu") && !target.closest(".menu-button")) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50 menu-button">
        <Button
          variant="outline"
          size="icon"
          className="bg-zinc-900/80 border-zinc-800 backdrop-blur-sm hover:bg-zinc-800/90 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900/95 border-r border-zinc-800 backdrop-blur-sm transition-transform duration-300 md:translate-x-0 md:relative mobile-menu",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full p-4">
          <Link href="/" className="block">
            <div className="flex items-center gap-2 px-2 py-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <div className="font-display font-bold text-xl tracking-tight">Encore</div>
            </div>
          </Link>

          <nav className="mt-8 flex-1">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname === item.href

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-violet-600/10 text-violet-400 border-l-2 border-violet-600"
                          : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 hover:translate-x-1",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon
                        className={cn("h-5 w-5 transition-transform duration-200", isActive ? "scale-110" : "")}
                      />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="border-t border-zinc-800 pt-4">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-zinc-800/50 cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">E</div>
              <div>
                <div className="text-sm font-medium">Encore Employee</div>
                <div className="text-xs text-zinc-500">employee@encore.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 relative overflow-x-hidden">
        {children}

        {/* Scroll to top button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 p-3 rounded-full bg-violet-600 text-white shadow-lg hover:bg-violet-700 transition-colors z-50"
              onClick={scrollToTop}
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

