"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  GithubIcon,
  Moon02Icon,
  NewTwitterIcon,
  Search01Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { BrandLink } from "@/components/brand-link"
import { DocsSearch } from "@/components/docs-search"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      title="Toggle theme"
    >
      <HugeiconsIcon icon={Sun03Icon} className="size-4 hidden dark:block" />
      <HugeiconsIcon icon={Moon02Icon} className="size-4 block dark:hidden" />
    </Button>
  )
}

const navLinks = [
  { label: "Docs", href: "/docs" },
  { label: "Studio", href: "/studio" },
]

export function DocsHeader() {
  const [searchOpen, setSearchOpen] = React.useState(false)

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-dashed border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-14 items-center gap-6 px-8">
          {/* Logo */}
          <BrandLink />

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3">
            {/* Search */}
            <Button
              variant="outline"
              size="sm"
              className="w-48 justify-start gap-2 text-muted-foreground"
              onClick={() => setSearchOpen(true)}
            >
              <HugeiconsIcon icon={Search01Icon} size={13} />
              <span className="flex-1 text-left text-[13px]">Search docs...</span>
              <kbd className="font-mono text-[11px] text-muted-foreground/60">⌘K</kbd>
            </Button>

            <div className="flex items-center gap-0.5">
              <ThemeToggle />

              {/* GitHub */}
              <Button variant="ghost" size="icon-sm" asChild>
                <Link href="https://github.com/theexperiencecompany/motion-studio" title="GitHub">
                  <HugeiconsIcon icon={GithubIcon} className="size-4" />
                </Link>
              </Button>

              {/* Twitter/X */}
              <Button variant="ghost" size="icon-sm" asChild>
                <Link href="https://x.com/madebyexp" title="X (Twitter)">
                  <HugeiconsIcon icon={NewTwitterIcon} className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <DocsSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
