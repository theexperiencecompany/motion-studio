"use client";

import { Player } from "@remotion/player";
import {
  HERO_DEMO_DURATION,
  HERO_DEMO_FPS,
  HERO_DEMO_HEIGHT,
  HERO_DEMO_WIDTH,
  HeroDemo,
} from "./hero-demo";

export function HeroDemoPlayer() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-black">
      <Player
        component={HeroDemo}
        durationInFrames={HERO_DEMO_DURATION}
        fps={HERO_DEMO_FPS}
        compositionWidth={HERO_DEMO_WIDTH}
        compositionHeight={HERO_DEMO_HEIGHT}
        style={{
          width: "100%",
          aspectRatio: `${HERO_DEMO_WIDTH} / ${HERO_DEMO_HEIGHT}`,
        }}
        controls
        autoPlay
        loop
      />
    </div>
  );
}
