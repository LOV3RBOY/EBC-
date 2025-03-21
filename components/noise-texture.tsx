"use client"

import { useEffect, useRef } from "react"

interface NoiseTextureProps {
  opacity?: number
}

export default function NoiseTexture({ opacity = 0.05 }: NoiseTextureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      generateNoise()
    }

    const generateNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255
        data[i] = value
        data[i + 1] = value
        data[i + 2] = value
        data[i + 3] = Math.random() * 50 // Alpha channel
      }

      ctx.putImageData(imageData, 0, 0)
    }

    resize()
    window.addEventListener("resize", resize)

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" style={{ opacity }} />
}

