import type { NextRequest } from "next/server";
import { getJob } from "../jobs";

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
  return Response.json({
    status: job.status,
    progress: job.progress,
    error: job.error,
  });
}
