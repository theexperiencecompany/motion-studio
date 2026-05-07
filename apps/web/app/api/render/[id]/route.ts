import { NextRequest } from "next/server";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

export const runtime = "nodejs";
export const maxDuration = 300;

let bundlePromise: Promise<string> | null = null;

function getBundle() {
  if (!bundlePromise) {
    const entryPoint = path.resolve(
      process.cwd(),
      "../remotion/src/index.ts",
    );
    bundlePromise = bundle({
      entryPoint,
      webpackOverride: (config) => config,
    });
  }
  return bundlePromise;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const inputProps = (await req.json()) as Record<string, unknown>;

  const serveUrl = await getBundle();

  const composition = await selectComposition({
    serveUrl,
    id,
    inputProps,
  });

  const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "remotion-out-"));
  const outputLocation = path.join(outDir, `${id}.mp4`);

  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation,
    inputProps,
  });

  const file = await fs.readFile(outputLocation);
  await fs.rm(outDir, { recursive: true, force: true });

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename="${id}.mp4"`,
    },
  });
}
