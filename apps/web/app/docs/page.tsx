import Link from "next/link"
import { ChevronRight } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"

const toc = [
  { label: "Introduction", id: "introduction" },
  { label: "Why aesthetic/ui", id: "why" },
  { label: "FAQ", id: "faq" },
]

export default function HomePage() {
  return (
    <div className="flex">

      {/* Main content */}
      <div className="flex-1 min-w-0 px-12 py-10 max-w-3xl">

        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Introduction</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-12">

          <section id="introduction">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Introduction</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A collection of beautifully designed, accessible components built with{" "}
              <Link href="#" className="text-foreground underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground transition-colors">
                Radix UI
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-foreground underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-foreground transition-colors">
                Tailwind CSS
              </Link>
              . Open source. Free forever.
            </p>
          </section>

          <hr className="border-border" />

          <section id="why" className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Why aesthetic/ui?</h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Most component libraries lock you in. You install a package, import components, and
              hope the API fits your needs. When it doesn&apos;t, you fight the library.
            </p>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              aesthetic/ui works differently. You copy the components you need directly into your
              project. The code is yours — read it, change it, break it, own it.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { title: "Copy & paste", desc: "No npm install. Drop the code directly into your project." },
                { title: "Fully typed", desc: "Every component ships with TypeScript types out of the box." },
                { title: "Dark mode", desc: "Built-in dark mode support using CSS variables." },
                { title: "Accessible", desc: "Built on Radix UI primitives with ARIA roles and keyboard nav." },
              ].map((f) => (
                <div key={f.title} className="rounded-lg border border-border p-5 space-y-1.5">
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-border" />

          <section id="faq" className="space-y-7">
            <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
            {[
              {
                q: "Is this a component library?",
                a: "Not in the traditional sense. You don't install it as a dependency. You copy the source into your project and own it entirely.",
              },
              {
                q: "Which frameworks are supported?",
                a: "Any React-based framework — Next.js, Remix, Vite, Astro. The components are just React + Tailwind.",
              },
              {
                q: "Can I use this in a commercial project?",
                a: "Yes. MIT licensed. Use it however you want.",
              },
            ].map((item) => (
              <div key={item.q} className="space-y-2">
                <h3 className="text-[15px] font-semibold">{item.q}</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </section>

          {/* Prev / next nav */}
          <div className="flex justify-end pt-4 border-t border-border">
            <Link
              href="/docs/installation"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Installation
              <ChevronRight size={14} />
            </Link>
          </div>

        </div>
      </div>

      {/* Right TOC */}
      <aside className="hidden xl:block w-56 shrink-0 border-l border-dashed border-border/60 py-10 px-6">
        <div className="sticky top-24">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">
            On This Page
          </p>
          <ul className="space-y-2 border-l border-border pl-4">
            {toc.map((t) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

    </div>
  )
}
