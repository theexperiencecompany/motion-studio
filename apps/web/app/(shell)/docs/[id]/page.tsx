import Link from "next/link";
import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowLeft01Icon,
  ArrowDown01Icon,
  Copy01Icon,
  Edit02Icon,
  ListViewIcon,
} from "@hugeicons/core-free-icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import {
  compositions,
  compositionsById,
} from "@workspace/compositions/registry";
import type { Field } from "@workspace/compositions/schema";
import { DocsPreview } from "./DocsPreview";

export function generateStaticParams() {
  return compositions.map((c) => ({ id: c.id }));
}

export default async function ComponentDocsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const info = compositionsById[id];
  if (!info) notFound();

  const index = compositions.findIndex((c) => c.id === id);
  const prev =
    index > 0
      ? { href: `/docs/${compositions[index - 1]!.id}`, label: compositions[index - 1]!.title }
      : { href: "/docs", label: "Introduction" };
  const next =
    index < compositions.length - 1
      ? { href: `/docs/${compositions[index + 1]!.id}`, label: compositions[index + 1]!.title }
      : null;

  const toc = [
    { label: "Overview", id: "overview" },
    { label: "Preview", id: "preview" },
    { label: "Props", id: "props" },
    { label: "Composition", id: "composition" },
  ];

  return (
    <div className="flex">
      <div className="flex flex-1 justify-center">
        <div className="min-w-0 w-full max-w-3xl px-12 py-10">
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{info.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-12">
            <section id="overview">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-4xl font-bold tracking-tight">
                  {info.title}
                </h1>
                <div className="flex items-center gap-1 shrink-0">
                  <button className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-[12px] font-medium text-foreground hover:bg-muted transition-colors">
                    <HugeiconsIcon icon={Copy01Icon} size={12} />
                    <span>Copy Page</span>
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      size={12}
                      className="text-muted-foreground"
                    />
                  </button>
                  {prev ? (
                    <Link
                      href={prev.href}
                      aria-label="Previous page"
                      className="flex items-center justify-center size-7 rounded-md border border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                    </Link>
                  ) : (
                    <button
                      aria-label="Previous page"
                      disabled
                      className="flex items-center justify-center size-7 rounded-md border border-border bg-muted/40 text-muted-foreground/40 cursor-not-allowed"
                    >
                      <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                    </button>
                  )}
                  {next ? (
                    <Link
                      href={next.href}
                      aria-label="Next page"
                      className="flex items-center justify-center size-7 rounded-md border border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                    </Link>
                  ) : (
                    <button
                      aria-label="Next page"
                      disabled
                      className="flex items-center justify-center size-7 rounded-md border border-border bg-muted/40 text-muted-foreground/40 cursor-not-allowed"
                    >
                      <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {info.description}
              </p>
              <div className="mt-5">
                <Link
                  href={`/docs/${info.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background hover:opacity-90"
                >
                  <HugeiconsIcon icon={Edit02Icon} size={14} />
                  Open editor
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </Link>
              </div>
            </section>

            <section id="preview" className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">Preview</h2>
              <DocsPreview info={info} />
            </section>

            <section id="props" className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">Props</h2>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30">
                    <tr className="text-left text-[12px] font-medium text-muted-foreground">
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2">Default</th>
                    </tr>
                  </thead>
                  <tbody>
                    {info.fields.map((f) => (
                      <FieldRow
                        key={f.key}
                        field={f}
                        defaultValue={
                          (info.defaultProps as Record<string, unknown>)[f.key]
                        }
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="composition" className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">
                Composition
              </h2>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="ID" value={info.id} />
                <Stat
                  label="Resolution"
                  value={`${info.width}×${info.height}`}
                />
                <Stat label="FPS" value={String(info.fps)} />
                <Stat
                  label="Duration"
                  value={`${(info.durationInFrames / info.fps).toFixed(1)}s`}
                />
              </dl>
            </section>

            <div className="flex justify-between border-t border-border pt-4">
              <Link
                href={prev.href}
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                {prev.label}
              </Link>
              {next && (
                <Link
                  href={next.href}
                  className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {next.label}
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <aside className="hidden w-48 shrink-0 px-6 py-10 xl:block">
        <div className="sticky top-24">
          <div className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground/60 uppercase">
            <HugeiconsIcon icon={ListViewIcon} size={13} />
            <span>On This Page</span>
          </div>
          <ul className="space-y-2">
            {toc.map((t) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function FieldRow({
  field,
  defaultValue,
}: {
  field: Field;
  defaultValue: unknown;
}) {
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-2 font-mono text-[13px]">{field.key}</td>
      <td className="px-4 py-2 text-muted-foreground">{describeType(field)}</td>
      <td className="px-4 py-2 font-mono text-[12px] text-muted-foreground">
        {formatDefault(defaultValue)}
      </td>
    </tr>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-3">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}

function describeType(field: Field): string {
  switch (field.kind) {
    case "chat":
      return "ChatMessage[]";
    case "text":
    case "textarea":
      return "string";
    case "number":
      return "number";
    case "select":
      return field.options.map((o) => `"${o.value}"`).join(" | ");
  }
}

function formatDefault(v: unknown): string {
  if (v === undefined) return "—";
  if (typeof v === "string") return `"${v}"`;
  if (Array.isArray(v)) return `[${v.length} item${v.length === 1 ? "" : "s"}]`;
  return String(v);
}
