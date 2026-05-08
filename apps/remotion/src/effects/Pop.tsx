"use client";

import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { EffectInfo } from "./schema";

export type PopProps = {
  intensity: number;
  durationInFrames: number;
  delayInFrames: number;
  children?: React.ReactNode;
};

export function Pop({
  intensity,
  durationInFrames,
  delayInFrames,
  children,
}: PopProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Higher intensity → looser spring → bigger overshoot
  const damping = Math.max(2, 12 - intensity * 10);

  const scale = spring({
    frame: frame - delayInFrames,
    fps,
    from: 0.6,
    to: 1,
    durationInFrames,
    config: { damping, mass: 0.6, stiffness: 120 },
  });

  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
}

export const popInfo: EffectInfo<{
  intensity: number;
  durationInFrames: number;
  delayInFrames: number;
}> = {
  id: "Pop",
  title: "Pop in",
  description: "Spring-overshoot scale entrance",
  trigger: "enter",
  defaultProps: {
    intensity: 0.5,
    durationInFrames: 24,
    delayInFrames: 0,
  },
  fields: [
    { kind: "number", key: "intensity", label: "Intensity", min: 0, max: 1 },
    {
      kind: "number",
      key: "durationInFrames",
      label: "Duration (frames)",
      min: 4,
      max: 120,
    },
    {
      kind: "number",
      key: "delayInFrames",
      label: "Delay (frames)",
      min: 0,
      max: 240,
    },
  ],
};
