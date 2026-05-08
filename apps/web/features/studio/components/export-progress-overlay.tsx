"use client";

import { Button } from "@workspace/ui/components/button";
import type { ExportState } from "../hooks/use-export-render";

type Props = {
  state: ExportState;
  onClose: () => void;
};

export function ExportProgressOverlay({ state, onClose }: Props) {
  if (state.phase === "idle") return null;

  const pct = Math.round(state.progress * 100);
  const dismissable = state.phase === "done" || state.phase === "error";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-2xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {state.phase === "starting" && "Preparing render…"}
            {state.phase === "rendering" && "Rendering video"}
            {state.phase === "done" && "Render complete"}
            {state.phase === "error" && "Render failed"}
          </h2>
          {dismissable && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onClose}
              title="Close"
            >
              ×
            </Button>
          )}
        </div>

        {state.phase !== "error" && (
          <p className="mb-4 text-[12px] text-muted-foreground">
            {state.phase === "starting" &&
              "Bundling your composition. First render may take longer."}
            {state.phase === "rendering" &&
              `Encoding frames — ${pct}% complete`}
            {state.phase === "done" && "Your MP4 is downloading now."}
          </p>
        )}

        {state.phase === "error" && (
          <p className="mb-4 break-words text-[12px] text-red-400">
            {state.error ?? "Unknown error"}
          </p>
        )}

        <ProgressBar phase={state.phase} pct={pct} />

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {state.phase === "rendering" || state.phase === "done"
              ? `${pct}%`
              : "—"}
          </span>
          {dismissable && (
            <Button variant="outline" size="xs" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({
  phase,
  pct,
}: {
  phase: ExportState["phase"];
  pct: number;
}) {
  if (phase === "starting") {
    return (
      <div className="relative h-2 overflow-hidden rounded-full bg-accent">
        <div className="absolute inset-y-0 left-0 w-1/3 animate-pulse rounded-full bg-blue-500" />
      </div>
    );
  }
  if (phase === "error") {
    return <div className="h-2 rounded-full bg-red-500/30" />;
  }
  return (
    <div className="h-2 overflow-hidden rounded-full bg-accent">
      <div
        className="h-full rounded-full bg-blue-500 transition-[width] duration-200"
        style={{ width: `${Math.max(2, pct)}%` }}
      />
    </div>
  );
}
