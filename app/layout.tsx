import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import { ThemeProvider } from "../components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const monument = localFont({
  src: [
    {
      path: "../public/fonts/MonumentExtended-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/MonumentExtended-Ultrabold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-monument",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Encore | Premium Content Curation",
  description: "A premium platform for sophisticated content curation",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className={`${inter.variable} ${monument.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

