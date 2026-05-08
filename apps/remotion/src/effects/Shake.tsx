"use client";

import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { EffectInfo } from "./schema";

export type ShakeProps = {
  intensity: number;
  frequency: number;
  axis: "x" | "y" | "both";
  children?: React.ReactNode;
};

export function Shake({ intensity, frequency, axis, children }: ShakeProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = frame / fps;
  const omega = Math.PI * 2 * frequency;
  const dx = axis === "y" ? 0 : Math.sin(t * omega) * intensity;
  const dy = axis === "x" ? 0 : Math.sin(t * omega * 1.37 + 0.6) * intensity;

  return (
    <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px)` }}>
      {children}
    </AbsoluteFill>
  );
}

export const shakeInfo: EffectInfo<{
  intensity: number;
  frequency: number;
  axis: "x" | "y" | "both";
}> = {
  id: "Shake",
  title: "Shake",
  description: "Continuous wiggle on x, y, or both axes",
  trigger: "loop",
  defaultProps: {
    intensity: 8,
    frequency: 6,
    axis: "both",
  },
  fields: [
    {
      kind: "number",
      key: "intensity",
      label: "Intensity (px)",
      min: 0,
      max: 60,
    },
    {
      kind: "number",
      key: "frequency",
      label: "Frequency (Hz)",
      min: 1,
      max: 30,
    },
    {
      kind: "select",
      key: "axis",
      label: "Axis",
      options: [
        { value: "both", label: "Both" },
        { value: "x", label: "Horizontal" },
        { value: "y", label: "Vertical" },
      ],
    },
  ],
};
