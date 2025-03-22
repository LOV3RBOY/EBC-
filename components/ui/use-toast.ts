import { useState } from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    const newToast = { ...props }
    setToasts((prev) => [...prev, newToast])
    
    // Remove toast after a delay
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== newToast))
    }, 5000)
  }

  return { toast, toasts }
}
