import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  CodeIcon,
  Copy01Icon,
  FilmRoll02Icon,
  PaintBrush02Icon,
} from "@hugeicons/core-free-icons"
import { compositions } from "@workspace/compositions/registry"
import { Button } from "@workspace/ui/components/button"
import { DocsHeader } from "@/components/docs-header"
import { FeaturedComponents } from "@/components/featured-components"

const features = [
  {
    icon: Copy01Icon,
    title: "Copy & paste",
    description:
      "Composable Remotion primitives you own. No opaque framework, no lock-in.",
  },
  {
    icon: CodeIcon,
    title: "Fully typed",
    description:
      "Strict TypeScript end-to-end — props, schemas, and registry entries.",
  },
  {
    icon: PaintBrush02Icon,
    title: "Themeable",
    description:
      "Tailwind-friendly tokens with light & dark modes baked in.",
  },
  {
    icon: FilmRoll02Icon,
    title: "Production-ready",
    description:
      "Render in the browser with the Remotion Player or ship to MP4 via the renderer.",
  },
]

export default function LandingPage() {
  const featured = compositions.slice(0, 6)

  return (
    <div className="mx-auto min-h-screen max-w-[1600px] border-x border-dashed border-border">
      <DocsHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-dashed border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(circle at 50% 30%, black 0%, transparent 70%)",
          }}
        />
        <div className="relative px-8 pt-24 pb-28 sm:pt-32 sm:pb-36">
          <div className="mx-auto max-w-3xl text-center">
            <Button variant="outline" size="xs" asChild>
              <Link href="/docs/changelog">
                <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium text-background">
                  v1.0
                </span>
                <span>Initial release is out</span>
                <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
              </Link>
            </Button>

            <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
              Beautifully designed motion components.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
              A collection of Remotion components and templates you can drop
              into your video pipeline. Copy, paste, render.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button asChild>
                <Link href="/docs">
                  Get started
                  <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/studio">Open Studio</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-dashed border-border px-8 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to ship video.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Stop reinventing transitions. These components are built for
              Remotion and tuned for production rendering.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-dashed border-border bg-border/50 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="bg-background p-6">
                <div className="mb-3 flex size-8 items-center justify-center rounded-md border border-dashed border-border bg-muted/30 text-foreground">
                  <HugeiconsIcon icon={f.icon} className="size-4" />
                </div>
                <h3 className="text-sm font-medium">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured components */}
      <section className="border-b border-dashed border-border px-8 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Browse the components.
              </h2>
              <p className="mt-3 text-muted-foreground">
                A growing library of titles, overlays, and templates.
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild className="hidden shrink-0 sm:inline-flex">
              <Link href="/docs">
                View all
                <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
              </Link>
            </Button>
          </div>

          <FeaturedComponents items={featured} />
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-24">
        <div className="mx-auto max-w-3xl rounded-xl border border-dashed border-border bg-muted/20 px-8 py-14 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Start shipping motion in minutes.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Read the docs, copy a component, render your first scene.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link href="/docs">
                Read the docs
                <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://github.com">GitHub</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dashed border-border px-8 py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="size-4 rounded bg-foreground" />
            <span>motioncrow</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/docs" className="hover:text-foreground">
              Docs
            </Link>
            <Link href="/studio" className="hover:text-foreground">
              Studio
            </Link>
            <Link href="https://github.com" className="hover:text-foreground">
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
