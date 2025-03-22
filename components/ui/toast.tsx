"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const ToastProvider = React.createContext<
  React.Dispatch<React.SetStateAction<React.ReactNode[]>> | undefined
>(undefined)

export function useToastProvider() {
  const [toasts, setToasts] = React.useState<React.ReactNode[]>([])
  return { toasts, setToasts }
}

export const ToastContext: React.FC<{
  children: React.ReactNode
  setToasts: React.Dispatch<React.SetStateAction<React.ReactNode[]>>
  toasts: React.ReactNode[]
}> = ({ children, setToasts, toasts }) => {
  return (
    <ToastProvider.Provider value={setToasts}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-md w-full">
        {toasts.map((toast, index) => (
          <React.Fragment key={index}>{toast}</React.Fragment>
        ))}
      </div>
    </ToastProvider.Provider>
  )
}

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[swipe=end]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "bg-zinc-800 border-zinc-700 text-zinc-50",
        destructive: "destructive group border-red-500 bg-red-500/10 text-red-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ToastProps extends React.ComponentPropsWithoutRef<typeof Toast> {
  duration?: number; // Add this line
}

const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof toastVariants> & {
    onClose?: () => void
  }
>(({ className, variant, onClose, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      <div>{props.children}</div>
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
})
Toast.displayName = "Toast"

export { Toast }
