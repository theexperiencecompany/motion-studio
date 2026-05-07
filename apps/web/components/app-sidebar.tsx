"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { compositions } from "@workspace/compositions/registry"
import {
  Book01Icon,
  Download01Icon,
  PaintBrush01Icon,
  Moon01Icon,
  CommandLineIcon,
  Clock01Icon,
  Cursor01Icon,
  CreditCardIcon,
  BubbleChatIcon,
  InputCursorTextIcon,
  ToggleOnIcon,
  MenuSquareIcon,
  Notification01Icon,
  VideoReplayIcon,
} from "@hugeicons/core-free-icons"

const nav = [
  {
    section: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs", icon: Book01Icon },
      { title: "Installation", href: "/docs/installation", icon: Download01Icon },
      { title: "Theming", href: "/docs/theming", icon: PaintBrush01Icon },
      { title: "Dark Mode", href: "/docs/dark-mode", icon: Moon01Icon },
      { title: "CLI", href: "/docs/cli", icon: CommandLineIcon },
      { title: "Changelog", href: "/docs/changelog", icon: Clock01Icon, badge: "v1.0" },
    ],
  },
  {
    section: "Components",
    items: [
      { title: "Button", href: "/docs/components/button", icon: Cursor01Icon },
      { title: "Card", href: "/docs/components/card", icon: CreditCardIcon },
      { title: "Dialog", href: "/docs/components/dialog", icon: BubbleChatIcon },
      { title: "Input", href: "/docs/components/input", icon: InputCursorTextIcon },
      { title: "Select", href: "/docs/components/select", icon: ToggleOnIcon },
      { title: "Tabs", href: "/docs/components/tabs", icon: MenuSquareIcon },
      { title: "Toast", href: "/docs/components/toast", icon: Notification01Icon },
    ],
  },
  {
    section: "Templates",
    items: compositions.map((c) => ({
      title: c.title,
      href: `/docs/${c.id}`,
      icon: VideoReplayIcon,
    })),
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-14 h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto py-8 pl-8 pr-6">
      <nav className="space-y-7">
        {nav.map((group) => (
          <div key={group.section}>
            <p className="mb-2.5 px-3 text-[10px] font-semibold tracking-[0.14em] uppercase text-muted-foreground/50">
              {group.section}
            </p>
            <ul className="space-y-px">
              {group.items.map((item) => {
                const active = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group relative flex h-8 items-center gap-2.5 rounded-md px-3 text-[13px] transition-all duration-150 ease-out ${
                        active
                          ? "bg-accent/60 text-foreground font-medium"
                          : "text-muted-foreground/85 hover:bg-accent/30 hover:text-foreground"
                      }`}
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        size={14}
                        className={`shrink-0 transition-colors duration-150 ${
                          active
                            ? "text-foreground"
                            : "text-muted-foreground/60 group-hover:text-foreground"
                        }`}
                      />
                      <span className="flex-1 truncate">{item.title}</span>
                      {"badge" in item && item.badge && (
                        <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-400">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
