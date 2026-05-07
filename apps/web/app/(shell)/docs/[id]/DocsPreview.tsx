"use client"

import { Player } from "@remotion/player"
import type { AnyCompositionInfo } from "@workspace/compositions/schema"
import { componentsById } from "@workspace/compositions/components"

export function DocsPreview({ info }: { info: AnyCompositionInfo }) {
  const Component = componentsById[info.id]
  if (!Component) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        No component registered for id &quot;{info.id}&quot;.
      </div>
    )
  }
  return (
    <div
      className="overflow-hidden rounded-lg border border-border bg-background"
      style={{ aspectRatio: `${info.width} / ${info.height}` }}
    >
      <Player
        component={Component}
        inputProps={info.defaultProps}
        durationInFrames={info.durationInFrames}
        fps={info.fps}
        compositionWidth={info.width}
        compositionHeight={info.height}
        style={{ width: "100%", height: "100%" }}
        loop
        controls
        autoPlay
        initiallyMuted
        acknowledgeRemotionLicense
      />
    </div>
  )
}
