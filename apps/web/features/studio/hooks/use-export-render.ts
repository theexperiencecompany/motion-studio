"use client";

import type { Project } from "@workspace/compositions/project";
import { useCallback, useRef, useState } from "react";

export type ExportPhase = "idle" | "starting" | "rendering" | "done" | "error";

export type ExportState = {
  phase: ExportPhase;
  progress: number;
  error: string | null;
};

const POLL_INTERVAL_MS = 400;

export function useExportRender() {
  const [state, setState] = useState<ExportState>({
    phase: "idle",
    progress: 0,
    error: null,
  });

  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    if (pollTimer.current) clearTimeout(pollTimer.current);
    pollTimer.current = null;
    setState({ phase: "idle", progress: 0, error: null });
  }, []);

  const start = useCallback(async (project: Project) => {
    setState({ phase: "starting", progress: 0, error: null });

    let jobId: string;
    try {
      const startRes = await fetch("/api/render-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (!startRes.ok)
        throw new Error(`Failed to start render: ${startRes.status}`);
      const data = (await startRes.json()) as {
        jobId?: string;
        error?: string;
      };
      if (!data.jobId) throw new Error(data.error ?? "Missing jobId");
      jobId = data.jobId;
    } catch (e) {
      setState({
        phase: "error",
        progress: 0,
        error: e instanceof Error ? e.message : "Unknown error",
      });
      return;
    }

    setState({ phase: "rendering", progress: 0, error: null });

    function poll() {
      fetch(`/api/render-project/${jobId}`)
        .then((r) => r.json())
        .then(
          (status: {
            progress: number;
            status: "rendering" | "done" | "error";
            error?: string;
          }) => {
            if (status.status === "error") {
              setState({
                phase: "error",
                progress: status.progress ?? 0,
                error: status.error ?? "Render failed",
              });
              return;
            }
            if (status.status === "done") {
              setState({ phase: "done", progress: 1, error: null });
              triggerDownload(jobId);
              return;
            }
            setState({
              phase: "rendering",
              progress: status.progress ?? 0,
              error: null,
            });
            pollTimer.current = setTimeout(poll, POLL_INTERVAL_MS);
          },
        )
        .catch((e: unknown) => {
          setState({
            phase: "error",
            progress: 0,
            error: e instanceof Error ? e.message : "Polling failed",
          });
        });
    }

    poll();
  }, []);

  return { state, start, reset };
}

function triggerDownload(jobId: string) {
  const a = document.createElement("a");
  a.href = `/api/render-project/${jobId}/download`;
  a.download = "project.mp4";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
