"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon,
  Settings01Icon,
  UserCircleIcon,
  Search01Icon,
  PencilEdit01Icon,
  BubbleChatAddIcon,
  Plug01Icon,
} from "@hugeicons/core-free-icons"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"

const navItems = [
  { title: "Home", href: "/", icon: Home01Icon },
  { title: "Search", href: "/search", icon: Search01Icon },
  { title: "Integrations", href: "/integrations", icon: Plug01Icon },
  { title: "New Chat", href: "/chat", icon: BubbleChatAddIcon, highlight: true },
]

const secondaryItems = [
  { title: "Settings", href: "/settings", icon: Settings01Icon },
  { title: "Profile", href: "/profile", icon: UserCircleIcon },
]

const posts = [
  {
    id: "1",
    title: "Why shipping fast matters",
    preview: "The best way to learn is to build and iterate quickly...",
    time: "2m ago",
  },
  {
    id: "2",
    title: "Design systems at scale",
    preview:
      "Consistency across products starts with a single source of truth...",
    time: "1h ago",
  },
  {
    id: "3",
    title: "Building in public",
    preview: "Sharing your journey openly attracts the right audience...",
    time: "3h ago",
  },
  {
    id: "4",
    title: "The indie maker mindset",
    preview: "You don't need a team to build something people love...",
    time: "Yesterday",
  },
  {
    id: "5",
    title: "Morning routines are overrated",
    preview: "What actually moves the needle isn't your 5am wake-up...",
    time: "2d ago",
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <span className="font-semibold">PostCrow</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    className={item.highlight ? "bg-indigo-500/15 hover:bg-indigo-500/20 text-indigo-200" : ""}
                  >
                    <Link href={item.href}>
                      <HugeiconsIcon icon={item.icon} size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between pr-2">
            <SidebarGroupLabel>Posts</SidebarGroupLabel>
            <button className="text-sidebar-foreground/40 transition-colors hover:text-sidebar-foreground">
              <HugeiconsIcon icon={PencilEdit01Icon} size={13} />
            </button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {posts.map((post) => (
                <SidebarMenuItem key={post.id}>
                  <SidebarMenuButton asChild tooltip={post.title}>
                    <Link
                      href={`/posts/${post.id}`}
                      className="flex w-full items-center justify-between gap-2"
                    >
                      <span className="truncate text-xs">{post.title}</span>
                      <span className="shrink-0 text-[10px] text-sidebar-foreground/40">
                        {post.time}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {secondaryItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
              >
                <Link href={item.href}>
                  <HugeiconsIcon icon={item.icon} size={18} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
