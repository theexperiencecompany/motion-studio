import type { NextRequest } from "next/server";
import { createJob, runRender } from "./jobs";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  let inputProps: Record<string, unknown>;
  try {
    inputProps = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const job = createJob();
  // Fire and forget — progress is tracked via the job map.
  void runRender(job.id, inputProps);

  return Response.json({ jobId: job.id });
}
