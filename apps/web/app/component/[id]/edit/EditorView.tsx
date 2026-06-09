"use client";

import { Player } from "@remotion/player";
import { renderMediaOnWeb } from "@remotion/web-renderer";
import type { ClipStyle } from "@workspace/compositions/clip-style";
import { componentsById } from "@workspace/compositions/components";
import { FieldsRenderer } from "@workspace/compositions/editors";
import type { AnyCompositionInfo } from "@workspace/compositions/schema";
import { Button } from "@workspace/ui/components/button";
import { useMemo, useReducer, useState } from "react";
import { ClipStyleSection } from "@/features/studio/components/clip-style-section";
import { downloadMp4Blob } from "@/features/studio/lib/local-export";

// The three render fields are one export operation — they move together as
// the in-browser render starts, reports progress, fails, or settles.
type ExportState = {
  rendering: boolean;
  progress: number;
  error: string | null;
};

type ExportAction =
  | { type: "start" }
  | { type: "progress"; progress: number }
  | { type: "error"; error: string }
  | { type: "settled" };

const INITIAL_EXPORT: ExportState = {
  rendering: false,
  progress: 0,
  error: null,
};

function exportReducer(state: ExportState, action: ExportAction): ExportState {
  switch (action.type) {
    case "start":
      return { rendering: true, progress: 0, error: null };
    case "progress":
      return { ...state, progress: action.progress };
    case "error":
      return { ...state, error: action.error };
    case "settled":
      return { ...state, rendering: false };
    default:
      return state;
  }
}

export function EditorView({
  info,
}: {
  info: Omit<AnyCompositionInfo, "calculateMetadata">;
}) {
  const Component = componentsById[info.id];
  const [props, setProps] = useState<Record<string, unknown>>(
    () => structuredClone(info.defaultProps) as Record<string, unknown>,
  );
  const [clipStyle, setClipStyle] = useState<ClipStyle>({});
  const [exportState, dispatchExport] = useReducer(
    exportReducer,
    INITIAL_EXPORT,
  );
  const { rendering, progress, error } = exportState;

  // Brand-locked compositions hardcode their authentic look — don't pass
  // clipStyle through (matches Project.tsx behavior in the Studio).
  const isLocked = info.brandMode === "locked";
  const playerProps = useMemo(
    () => (isLocked ? props : { ...props, clipStyle }),
    [props, clipStyle, isLocked],
  );

  async function handleDownload(format: "mp4" | "webm") {
    if (!Component) return;
    dispatchExport({ type: "start" });
    try {
      const isWebm = format === "webm";
      const result = await renderMediaOnWeb({
        composition: {
          id: info.id,
          component: Component as React.ComponentType<Record<string, unknown>>,
          width: info.width,
          height: info.height,
          fps: info.fps,
          durationInFrames: info.durationInFrames,
        },
        inputProps: playerProps,
        // WebM + VP9 carries an alpha channel — pair it with a transparent
        // clip background (Style → Background = transparent) to drop the
        // result straight into another video editor.
        container: isWebm ? "webm" : "mp4",
        videoCodec: isWebm ? "vp9" : "h264",
        hardwareAcceleration: "prefer-hardware",
        // MP4/h264 path: tight keyframe interval + heavy bitrate eliminate
        // at-rest text shimmer. VP9 doesn't have the same drift behavior,
        // so we let the encoder pick a sensible interval.
        videoBitrate: 50_000_000,
        ...(isWebm
          ? {}
          : { keyframeIntervalInSeconds: 1 / Math.max(1, info.fps) }),
        onProgress: ({ progress: p }) =>
          dispatchExport({ type: "progress", progress: p }),
      });
      const blob = await result.getBlob();
      downloadMp4Blob(blob, `${info.id}.${format}`);
    } catch (e) {
      dispatchExport({
        type: "error",
        error: e instanceof Error ? e.message : "Unknown error",
      });
    } finally {
      dispatchExport({ type: "settled" });
    }
  }

  if (!Component) {
    return (
      <div className="p-6 text-sm text-red-500">
        No component registered for id &quot;{info.id}&quot;.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] lg:min-h-0 lg:flex-1">
      <aside className="flex flex-col border-b border-border lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex flex-col lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          <FieldsRenderer
            fields={info.fields}
            value={props}
            onChange={setProps}
          />
          {!isLocked && (
            <div className="border-t border-border">
              <div className="px-5 pt-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Style
              </div>
              <ClipStyleSection
                style={clipStyle}
                onPatch={(patch) =>
                  setClipStyle((prev) => ({ ...prev, ...patch }))
                }
                onReset={() => setClipStyle({})}
              />
            </div>
          )}
        </div>
        <div className="shrink-0 space-y-2 border-t border-border p-4">
          <Button
            className="w-full"
            onClick={() => handleDownload("mp4")}
            disabled={rendering}
          >
            {rendering
              ? `Rendering… ${Math.round(progress * 100)}%`
              : "Download MP4"}
          </Button>
          {!isLocked && (
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleDownload("webm")}
              disabled={rendering}
              title="Exports WebM/VP9 with alpha — set Background to transparent in the Style section first."
            >
              Download WebM (transparent)
            </Button>
          )}
          {error && <p className="mt-2 text-[12px] text-red-500">{error}</p>}
        </div>
      </aside>

      <div className="flex items-center justify-center bg-muted/20 p-6 lg:min-h-0">
        <div
          className="w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-background shadow-sm"
          style={{ aspectRatio: `${info.width} / ${info.height}` }}
        >
          <Player
            component={Component}
            inputProps={playerProps}
            durationInFrames={info.durationInFrames}
            fps={info.fps}
            compositionWidth={info.width}
            compositionHeight={info.height}
            style={{ width: "100%", height: "100%" }}
            controls
            loop
            autoPlay
            initiallyMuted
            acknowledgeRemotionLicense
          />
        </div>
      </div>
    </div>
  );
}
