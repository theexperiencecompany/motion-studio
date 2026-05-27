"use client";
import { AbsoluteFill, Audio, useCurrentFrame, useVideoConfig } from "remotion";
import { type ClipStyle, resolveClipStyle } from "../../clip-style";
import { FONTS, fontKeyFromFamily, type HAlign, type VAlign } from "./config";

export type CaptionWord = {
  start: number;
  end: number;
  text: string;
};

export type TikTokCaptionProps = {
  words: CaptionWord[];
  audioUrl?: string;
  captionVAlign?: VAlign;
  captionHAlign?: HAlign;
  // Multiplier on the base font size. 1 = medium, 0.7 small, 1.6 huge.
  fontScale?: number;
  clipStyle?: ClipStyle;
};

const BASE_FONT_SIZE = 132;
// Group consecutive words into a phrase until either a noticeable speech
// gap (the speaker pauses) or the phrase grows too long to read in one
// glance. Tuned for short-form voiceover pacing.
const PHRASE_MAX_GAP_SECONDS = 0.5;
const PHRASE_MAX_WORDS = 6;
const INACTIVE_COLOR = "#a1a1aa";

const VERT_TO_JUSTIFY: Record<VAlign, string> = {
  top: "flex-start",
  center: "center",
  bottom: "flex-end",
};

const HORIZ_TO_ALIGN: Record<HAlign, string> = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

const HORIZ_TO_TEXT_ALIGN: Record<HAlign, "left" | "center" | "right"> = {
  left: "left",
  center: "center",
  right: "right",
};

function groupIntoPhrases(words: CaptionWord[]): CaptionWord[][] {
  const phrases: CaptionWord[][] = [];
  let current: CaptionWord[] = [];
  for (const w of words) {
    const prev = current[current.length - 1];
    const shouldBreak =
      current.length >= PHRASE_MAX_WORDS ||
      (prev && w.start - prev.end > PHRASE_MAX_GAP_SECONDS);
    if (shouldBreak && current.length > 0) {
      phrases.push(current);
      current = [];
    }
    current.push(w);
  }
  if (current.length > 0) phrases.push(current);
  return phrases;
}

export const TikTokCaption: React.FC<TikTokCaptionProps> = ({
  words,
  audioUrl,
  captionVAlign = "center",
  captionHAlign = "center",
  fontScale = 1,
  clipStyle,
}) => {
  // Real frame — word timestamps from Whisper are wall-clock seconds, so
  // they must be compared against real time, not the 60fps design frame.
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const s = resolveClipStyle(clipStyle, {
    background: "transparent",
    color: "#ffffff",
    fontFamily: "'Anton', Impact, sans-serif",
    accent: "#ffffff",
  });

  const fontKey = fontKeyFromFamily(s.fontFamily);
  const font = FONTS[fontKey];

  const timeSeconds = frame / fps;

  let activeIndex = -1;
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (!w) continue;
    if (timeSeconds >= w.start && timeSeconds < w.end) {
      activeIndex = i;
      break;
    }
    if (timeSeconds < w.start) {
      activeIndex = i - 1;
      break;
    }
    if (i === words.length - 1 && timeSeconds >= w.end) {
      activeIndex = i;
    }
  }

  const phrases = groupIntoPhrases(words);
  const activePhrase =
    activeIndex >= 0
      ? phrases.find((p) => p.some((w) => w === words[activeIndex]))
      : undefined;

  const shortSide = Math.min(width, height);
  const baseSize = (BASE_FONT_SIZE * shortSide) / 1080;
  const fontSize = baseSize * fontScale;
  const strokeWidth = Math.max(2, fontSize * 0.06);

  const isTransparent = s.background === "transparent";

  return (
    <AbsoluteFill
      style={{
        background: isTransparent ? "transparent" : s.background,
        fontFamily: font.cssFamily,
        fontWeight: font.weight,
        display: "flex",
        flexDirection: "column",
        alignItems: HORIZ_TO_ALIGN[captionHAlign],
        justifyContent: VERT_TO_JUSTIFY[captionVAlign],
        padding: `${height * 0.08}px ${width * 0.06}px`,
      }}
    >
      {audioUrl ? <Audio src={audioUrl} /> : null}

      {activePhrase ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: `${fontSize * 0.12}px ${fontSize * 0.28}px`,
            justifyContent: HORIZ_TO_ALIGN[captionHAlign],
            textAlign: HORIZ_TO_TEXT_ALIGN[captionHAlign],
            maxWidth: width * 0.88,
            lineHeight: 1.05,
          }}
        >
          {activePhrase.map((w, i) => {
            const isActive = w === words[activeIndex];
            return (
              <span
                key={`${w.start}-${i}`}
                style={{
                  display: "inline-block",
                  fontSize,
                  fontWeight: font.weight,
                  letterSpacing: "-0.01em",
                  color: isActive ? s.accent : INACTIVE_COLOR,
                  WebkitTextStroke: `${strokeWidth}px #000`,
                  paintOrder: "stroke fill",
                  textShadow: isTransparent
                    ? `0 ${fontSize * 0.025}px ${fontSize * 0.06}px rgba(0,0,0,0.55)`
                    : `0 ${fontSize * 0.02}px ${fontSize * 0.04}px rgba(0,0,0,0.5)`,
                }}
              >
                {w.text}
              </span>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
