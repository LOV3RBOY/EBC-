"use client"

import { useEffect, useRef } from "react"

interface GradientOrbProps {
  position: { x: number; y: number }
  size?: number
  opacity?: number
}

export default function GradientOrb({ position, size = 400, opacity = 0.2 }: GradientOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const drawGradient = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient = ctx.createRadialGradient(position.x, position.y, 0, position.x, position.y, size)

      gradient.addColorStop(0, "rgba(139, 92, 246, 0.8)") // Violet
      gradient.addColorStop(0.5, "rgba(79, 70, 229, 0.3)") // Indigo
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    drawGradient()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawGradient()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [position, size])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" style={{ opacity }} />
}

