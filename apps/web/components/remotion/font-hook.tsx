"use client";

import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

export const FONT_HOOK_FPS = 30;
export const FONT_HOOK_WIDTH = 1080;
export const FONT_HOOK_HEIGHT = 1920;
export const FONT_HOOK_DURATION = 120;

const FALLBACK_FONT = {
  family: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
  weight: 400,
} as const;

const FONT_STACKS = [
  FALLBACK_FONT,
  {
    family: "'Anton', 'Arial Black', sans-serif",
    weight: 400,
  },
  {
    family: "'Archivo Black', 'Arial Black', sans-serif",
    weight: 400,
  },
  {
    family: "'Poppins', 'Trebuchet MS', sans-serif",
    weight: 900,
  },
  {
    family: "'Geist', system-ui, sans-serif",
    weight: 700,
  },
  {
    family: "'Geist Mono', ui-monospace, monospace",
    weight: 700,
  },
  {
    family: "Georgia, 'Times New Roman', serif",
    weight: 700,
  },
] as const;

const HOOK_TEXT = "STOP\nSCROLLING";
const SEGMENT_FRAMES = 6;

export function FontHook() {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const segment = Math.floor(frame / SEGMENT_FRAMES);
  const font = FONT_STACKS[segment % FONT_STACKS.length] ?? FALLBACK_FONT;
  const pad = width * 0.12;
  const headlineSize = Math.min(width * 0.18, 210);

  return (
    <AbsoluteFill
      style={{
        background: "#ffffff",
        color: "#111827",
        fontFamily: font.family,
      }}
    >
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: pad,
        }}
      >
        <div
          style={{
            fontSize: headlineSize,
            fontWeight: font.weight,
            letterSpacing: 0,
            lineHeight: 0.95,
            whiteSpace: "pre-line",
          }}
        >
          {HOOK_TEXT}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
