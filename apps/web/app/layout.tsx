import { Geist_Mono, Inter } from "next/font/google"

import "@workspace/ui/globals.css"
import "streamdown/styles.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { DocsHeader } from "@/components/docs-header"
import { cn } from "@workspace/ui/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <div className="mx-auto max-w-[1400px] border-x border-dashed border-border/60 min-h-screen">
            <DocsHeader />
            <div className="flex">
              <AppSidebar />
              <main className="flex-1 min-w-0 border-l border-dashed border-border/60">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
