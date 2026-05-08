"use client";

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useClipDurationInFrames } from "./clip-context";
import type { EffectInfo } from "./schema";

export type KenBurnsProps = {
  fromScale: number;
  toScale: number;
  panX: number;
  panY: number;
  children?: React.ReactNode;
};

export function KenBurns({
  fromScale,
  toScale,
  panX,
  panY,
  children,
}: KenBurnsProps) {
  const frame = useCurrentFrame();
  const duration = Math.max(1, useClipDurationInFrames());

  const scale = interpolate(frame, [0, duration - 1], [fromScale, toScale], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tx = interpolate(frame, [0, duration - 1], [0, panX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ty = interpolate(frame, [0, duration - 1], [0, panY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
        transformOrigin: "center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
}

export const kenBurnsInfo: EffectInfo<{
  fromScale: number;
  toScale: number;
  panX: number;
  panY: number;
}> = {
  id: "KenBurns",
  title: "Ken Burns",
  description: "Slow scale + pan over the clip duration",
  trigger: "range",
  defaultProps: {
    fromScale: 1,
    toScale: 1.15,
    panX: 0,
    panY: 0,
  },
  fields: [
    {
      kind: "number",
      key: "fromScale",
      label: "From scale",
      min: 0.5,
      max: 3,
    },
    { kind: "number", key: "toScale", label: "To scale", min: 0.5, max: 3 },
    { kind: "number", key: "panX", label: "Pan X (px)", min: -400, max: 400 },
    { kind: "number", key: "panY", label: "Pan Y (px)", min: -400, max: 400 },
  ],
};
