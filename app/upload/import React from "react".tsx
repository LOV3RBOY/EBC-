import React from "react"

interface NoiseTextureProps {
  opacity?: number
  className?: string
}

const NoiseTexture: React.FC<NoiseTextureProps> = ({ 
  opacity = 0.05,
  className = ""
}) => {
  return (
    <div 
      className={`pointer-events-none fixed inset-0 z-20 h-full w-full ${className}`}
      style={{ 
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  )
}

export default NoiseTexture
