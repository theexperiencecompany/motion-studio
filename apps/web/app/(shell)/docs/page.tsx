import { notFound } from "next/navigation";
import { DocsShell } from "@/components/docs/docs-shell";
import { getDoc } from "@/lib/docs";

export default function DocsIntroductionPage() {
  const doc = getDoc("introduction");
  if (!doc) notFound();
  return <DocsShell doc={doc} />;
}
