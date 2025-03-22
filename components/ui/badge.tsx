import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-violet-600 text-white hover:bg-violet-700",
    secondary: "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
    outline: "border border-zinc-700 text-zinc-300",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  }
  
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
