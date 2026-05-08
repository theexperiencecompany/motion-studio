import fs from "node:fs/promises";
import type { NextRequest } from "next/server";
import { deleteJob, getJob } from "../../jobs";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;
  const job = getJob(jobId);
  if (!job) {
    return Response.json({ error: "Job not found" }, { status: 404 });
  }
  if (job.status !== "done" || !job.outputPath) {
    return Response.json(
      { error: `Job not ready (status=${job.status})` },
      { status: 409 },
    );
  }

  const file = await fs.readFile(job.outputPath);
  // Send the file, then clean up.
  queueMicrotask(() => deleteJob(jobId));

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename="project.mp4"`,
      "Cache-Control": "no-store",
    },
  });
}
