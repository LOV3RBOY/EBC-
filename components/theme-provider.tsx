"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

const ThemeProviderContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
}>({
  theme: "dark",
  setTheme: () => null,
})

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  attribute = "data-theme",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    
    root.classList.remove("light", "dark")
    
    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      root.setAttribute(attribute, systemTheme)
    } else {
      root.classList.add(theme)
      root.setAttribute(attribute, theme)
    }
  }, [theme, attribute, enableSystem])

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {disableTransitionOnChange && (
        <style>{`
          *:not(.no-transition-override) {
            transition: none !important;
          }
        `}</style>
      )}
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  
  return context
}