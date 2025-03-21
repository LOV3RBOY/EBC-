"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface TitleGlowProps {
  children: React.ReactNode
  className?: string
}

export default function TitleGlow({ children, className = "" }: TitleGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Add any additional effects here if needed
  }, [])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-violet-500/5 to-transparent rounded-full blur-xl" />
      {children}
    </div>
  )
}

