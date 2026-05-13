"use client";

import type { Project } from "@workspace/compositions/project";
import { useCallback, useRef, useState } from "react";
import {
  downloadMp4Blob,
  isBrowserExportSupported,
  renderProjectInBrowser,
} from "../lib/browser-export";

export type ExportPhase = "idle" | "starting" | "rendering" | "done" | "error";

export type ExportState = {
  phase: ExportPhase;
  progress: number;
  error: string | null;
  errorStack?: string | null;
};

/**
 * Drives the in-browser MP4 export. The actual frame-walking +
 * encoding lives in `../lib/browser-export.ts` — this hook just owns
 * the UI state machine and a cancel token so re-clicking Export
 * mid-flight doesn't run two encoders concurrently.
 */
export function useExportRender() {
  const [state, setState] = useState<ExportState>({
    phase: "idle",
    progress: 0,
    error: null,
  });

  // Generation counter — bumped on reset/start, used to ignore stale
  // progress callbacks if the user dismisses the overlay mid-render.
  const generationRef = useRef(0);

  const reset = useCallback(() => {
    generationRef.current += 1;
    setState({ phase: "idle", progress: 0, error: null });
  }, []);

  const start = useCallback(async (project: Project) => {
    const myGeneration = ++generationRef.current;
    console.info("[export-hook] start", {
      width: project.width,
      height: project.height,
      fps: project.fps,
      clips: project.clips?.length,
    });

    if (!isBrowserExportSupported()) {
      console.warn("[export-hook] WebCodecs unavailable");
      setState({
        phase: "error",
        progress: 0,
        error:
          "Your browser does not support in-browser MP4 export (WebCodecs unavailable). Try the latest Chrome or Edge.",
        errorStack: null,
      });
      return;
    }

    setState({ phase: "starting", progress: 0, error: null, errorStack: null });

    // Give React one tick to paint the "Preparing render…" UI before the
    // encoder hogs the main thread.
    await new Promise<void>((r) => setTimeout(r, 0));
    if (generationRef.current !== myGeneration) return;

    setState({
      phase: "rendering",
      progress: 0,
      error: null,
      errorStack: null,
    });

    try {
      const blob = await renderProjectInBrowser({
        project,
        onProgress: (progress) => {
          if (generationRef.current !== myGeneration) return;
          setState({
            phase: "rendering",
            progress,
            error: null,
            errorStack: null,
          });
        },
      });

      if (generationRef.current !== myGeneration) return;

      console.info("[export-hook] done", blob.size, "bytes");
      setState({ phase: "done", progress: 1, error: null, errorStack: null });
      downloadMp4Blob(blob, "project.mp4");
    } catch (e) {
      if (generationRef.current !== myGeneration) return;
      console.error("[export-hook] failed", e);
      const err = e instanceof Error ? e : new Error(String(e));
      setState({
        phase: "error",
        progress: 0,
        error: err.message || "Render failed",
        errorStack: err.stack ?? null,
      });
    }
  }, []);

  return { state, start, reset };
}
