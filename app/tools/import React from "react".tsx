import React from "react"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <ToastProvider>
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        {children}
      </main>
      <ToastViewport />
    </ToastProvider>
  )
}

export default AppLayout
