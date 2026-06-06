"use client";

import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { type ClipStyle, resolveClipStyle } from "../../clip-style";
import { DESIGN_FPS, useDesignFrame } from "../../use-design-frame";
import { useFontReady } from "../../use-font-ready";

export type FontHookProps = {
  headline: string;
  subtitle: string;
  clipStyle?: ClipStyle;
};

type FontStack = {
  label: string;
  family: string;
  weight: number;
};

const DEFAULT_STACKS: FontStack[] = [
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
];

const SEGMENT_FRAMES = 6;

export const FontHook: React.FC<FontHookProps> = ({
  headline = "Stop\nScrolling",
  subtitle = "Font speed hook",
  clipStyle,
}) => {
  const frame = useDesignFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  const s = resolveClipStyle(clipStyle, {
    background:
      "radial-gradient(circle at 50% 20%, #1d4ed8 0%, #0b0b11 55%, #050507 100%)",
    color: "#f8fafc",
    fontFamily: DEFAULT_STACKS[0].family,
    accent: "#22d3ee",
  });

  useFontReady(s.fontFamily);
  useFontReady(DEFAULT_STACKS[0].family);
  useFontReady(DEFAULT_STACKS[1].family);
  useFontReady(DEFAULT_STACKS[2].family);
  useFontReady(DEFAULT_STACKS[3].family);
  useFontReady(DEFAULT_STACKS[4].family);
  useFontReady(DEFAULT_STACKS[5].family);
  useFontReady(DEFAULT_STACKS[6].family);

  const baseKey = fontKey(s.fontFamily);
  const hasBase = DEFAULT_STACKS.some(
    (stack) => fontKey(stack.family) === baseKey,
  );
  const baseLabel = primaryFamily(s.fontFamily) || "Style";
  const baseStack: FontStack = {
    label: baseLabel,
    family: s.fontFamily,
    weight: 700,
  };

  const fontStacks = hasBase ? DEFAULT_STACKS : [baseStack, ...DEFAULT_STACKS];
  const segment = Math.floor(frame / SEGMENT_FRAMES);
  const font = fontStacks[segment % fontStacks.length];
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

  const designDuration = (durationInFrames * DESIGN_FPS) / fps;
  const accentX = interpolate(frame, [0, designDuration - 1], [-0.2, 1.2], {
    extrapolateRight: "clamp",
  });

  const backgroundPulse = interpolate(
    segmentFrame,
    [0, SEGMENT_FRAMES * 0.5, SEGMENT_FRAMES],
    [0.2, 0.6, 0.3],
    { extrapolateRight: "clamp" },
  );

  const pad = width * 0.12;
  const headlineSize = width * 0.166;
  const subtitleSize = width * 0.041;
  const labelSize = width * 0.026;
  const barWidth = width * 0.26;
  const barHeight = Math.max(8, width * 0.008);
  const barTravel = width * 0.24;
  const barTop = height * 0.08;
  const barLeft = width * 0.1;

  return (
    <AbsoluteFill
      style={{
        background: s.background,
        color: s.color,
        fontFamily: s.fontFamily,
      }}
    >
      <AbsoluteFill
        style={{
          color: s.color,
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.2 + backgroundPulse * 0.2,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: barTop,
          left: barLeft,
          height: barHeight,
          width: barWidth,
          borderRadius: 999,
          background: `linear-gradient(90deg, ${s.accent}, ${s.color})`,
          transform: `translateX(${accentX * barTravel}px)`,
          opacity: 0.7,
        }}
      />

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
            fontFamily: font.family,
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
            whiteSpace: "pre-line",
            textShadow: `0 ${width * 0.022}px ${width * 0.055}px rgba(15,23,42,0.6)`,
            transform: `scale(${pop})`,
            opacity: flash,
          }}
        >
          {headline}
        </div>

        {subtitle.trim() && (
          <div
            style={{
              marginTop: width * 0.033,
              fontSize: subtitleSize,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              opacity: 0.75,
            }}
          >
            {subtitle}
          </div>
        )}
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          bottom: height * 0.07,
          right: width * 0.08,
          fontSize: labelSize,
          fontWeight: font.weight,
          fontFamily: font.family,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          opacity: 0.6,
        }}
      >
        {font.label}
      </div>
    </AbsoluteFill>
  );
};

function primaryFamily(fontFamily: string): string {
  const first = fontFamily.split(",")[0] ?? "";
  return first.replace(/["']/g, "").trim();
}

function fontKey(fontFamily: string): string {
  return primaryFamily(fontFamily).toLowerCase();
}
