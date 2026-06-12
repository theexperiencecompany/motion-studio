"use client";

import { Player } from "@remotion/player";
import {
  FONT_HOOK_DURATION,
  FONT_HOOK_FPS,
  FONT_HOOK_HEIGHT,
  FONT_HOOK_WIDTH,
  FontHook,
} from "./font-hook";

export function FontHookPlayer() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-black">
      <Player
        component={FontHook}
        durationInFrames={FONT_HOOK_DURATION}
        fps={FONT_HOOK_FPS}
        compositionWidth={FONT_HOOK_WIDTH}
        compositionHeight={FONT_HOOK_HEIGHT}
        style={{
          width: "100%",
          aspectRatio: `${FONT_HOOK_WIDTH} / ${FONT_HOOK_HEIGHT}`,
        }}
        controls
        autoPlay
        loop
      />
    </div>
  );
}
