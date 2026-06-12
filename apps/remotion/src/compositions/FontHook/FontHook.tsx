"use client";

import { AbsoluteFill, useVideoConfig } from "remotion";
import { type ClipStyle, resolveClipStyle } from "../../clip-style";
import { useDesignFrame } from "../../use-design-frame";
import { useFontReady } from "../../use-font-ready";

export type FontHookProps = {
  headline: string;
  subtitle: string;
  clipStyle?: ClipStyle;
};

type FontStack = {
  family: string;
  weight: number;
};

const FALLBACK_STACK: FontStack = {
  family: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
  weight: 400,
};

const DEFAULT_STACKS = [
  FALLBACK_STACK,
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
] as const satisfies readonly FontStack[];

const SEGMENT_FRAMES = 6;

export const FontHook: React.FC<FontHookProps> = ({
  headline = "Stop\nScrolling",
  subtitle = "",
  clipStyle,
}) => {
  const frame = useDesignFrame();
  const { width } = useVideoConfig();

  const s = resolveClipStyle(clipStyle, {
    background: "#ffffff",
    color: "#111827",
    fontFamily: FALLBACK_STACK.family,
    accent: "#111827",
  });

  useFontReady(s.fontFamily);
  useFontReady(FALLBACK_STACK.family);
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
  const baseStack: FontStack = {
    family: s.fontFamily,
    weight: 700,
  };

  const fontStacks = hasBase ? DEFAULT_STACKS : [baseStack, ...DEFAULT_STACKS];
  const segment = Math.floor(frame / SEGMENT_FRAMES);
  const font = fontStacks[segment % fontStacks.length] ?? FALLBACK_STACK;

  const pad = width * 0.12;
  const headlineSize = Math.min(width * 0.18, 210);
  const subtitleSize = Math.min(width * 0.045, 52);

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
            letterSpacing: 0,
            lineHeight: 0.95,
            whiteSpace: "pre-line",
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
              letterSpacing: 0,
              opacity: 0.7,
            }}
          >
            {subtitle}
          </div>
        )}
      </AbsoluteFill>
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
