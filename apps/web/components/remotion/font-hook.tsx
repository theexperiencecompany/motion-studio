"use client";

import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const FONT_HOOK_FPS = 30;
export const FONT_HOOK_WIDTH = 1080;
export const FONT_HOOK_HEIGHT = 1920;
export const FONT_HOOK_DURATION = 120;

const FONT_STACKS = [
  {
    label: "Bebas Neue",
    family: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
    weight: 400,
  },
  {
    label: "Anton",
    family: "'Anton', 'Arial Black', sans-serif",
    weight: 400,
  },
  {
    label: "Archivo Black",
    family: "'Archivo Black', 'Arial Black', sans-serif",
    weight: 400,
  },
  {
    label: "Poppins",
    family: "'Poppins', 'Trebuchet MS', sans-serif",
    weight: 900,
  },
  {
    label: "Geist",
    family: "'Geist', system-ui, sans-serif",
    weight: 700,
  },
  {
    label: "Geist Mono",
    family: "'Geist Mono', ui-monospace, monospace",
    weight: 700,
  },
  {
    label: "Times",
    family: "Georgia, 'Times New Roman', serif",
    weight: 700,
  },
] as const;

const HOOK_TEXT = "STOP\nSCROLLING";
const SEGMENT_FRAMES = 6;

export function FontHook() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const segment = Math.floor(frame / SEGMENT_FRAMES);
  const font = FONT_STACKS[segment % FONT_STACKS.length];
  const segmentFrame = frame % SEGMENT_FRAMES;

  const pop = spring({
    frame: segmentFrame,
    fps,
    from: 0.9,
    to: 1,
    durationInFrames: SEGMENT_FRAMES,
  });

  const flash = interpolate(
    segmentFrame,
    [0, SEGMENT_FRAMES * 0.4, SEGMENT_FRAMES],
    [0.3, 1, 0.85],
    { extrapolateRight: "clamp" },
  );

  const accentX = interpolate(frame, [0, FONT_HOOK_DURATION - 1], [-0.2, 1.2], {
    extrapolateRight: "clamp",
  });

  const backgroundPulse = interpolate(
    segmentFrame,
    [0, SEGMENT_FRAMES * 0.5, SEGMENT_FRAMES],
    [0.2, 0.6, 0.3],
    { extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 20%, #1d4ed8 0%, #0b0b11 55%, #050507 100%)",
        color: "#f8fafc",
        fontFamily: font.family,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.2 + backgroundPulse * 0.2,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 120,
          left: 120,
          height: 10,
          width: 280,
          borderRadius: 999,
          background: "linear-gradient(90deg, #22d3ee, #a855f7)",
          transform: `translateX(${accentX * 260}px)`,
          opacity: 0.7,
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 140,
        }}
      >
        <div
          style={{
            fontSize: 180,
            fontWeight: font.weight,
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
            textTransform: "uppercase",
            whiteSpace: "pre-line",
            textShadow: "0 24px 60px rgba(15,23,42,0.6)",
            transform: `scale(${pop})`,
            opacity: flash,
          }}
        >
          {HOOK_TEXT}
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 44,
            fontWeight: 600,
            fontFamily: "'Geist', system-ui, sans-serif",
            color: "rgba(248,250,252,0.75)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Font speed hook
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          bottom: 90,
          right: 90,
          fontSize: 28,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(248,250,252,0.6)",
          fontFamily: "'Geist Mono', ui-monospace, monospace",
        }}
      >
        {font.label}
      </div>
    </AbsoluteFill>
  );
}
