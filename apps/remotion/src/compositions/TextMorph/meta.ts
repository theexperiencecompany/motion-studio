import type { CompositionInfo } from "../../schema";
import type { TextMorphProps } from "./TextMorph";

export const TEXT_MORPH_DURATION = 441; // 7 words × 63-frame cycle @ 60fps
export const TEXT_MORPH_FPS = 60;
export const TEXT_MORPH_WIDTH = 1920;
export const TEXT_MORPH_HEIGHT = 1080;

export const textMorphDefaultProps: TextMorphProps = {
  text: "Why\nis\nthis\nso\nsatisfying\nto\nwatch?",
};

export const textMorphInfo: CompositionInfo<TextMorphProps> = {
  id: "TextMorph",
  category: "text",
  agentNotes:
    "Gooey blur-morph headline: each word liquifies and reforms into the next via an SVG threshold filter. Great for hooks and rhetorical question sequences ('Why is this so satisfying to watch?'). One word per line. Colors and font come from the Style section.",
  title: "Text Morph",
  description:
    "Words melt and reform into one another with a gooey blur-threshold transition, one line at a time.",
  durationInFrames: TEXT_MORPH_DURATION,
  fps: TEXT_MORPH_FPS,
  width: TEXT_MORPH_WIDTH,
  height: TEXT_MORPH_HEIGHT,
  defaultProps: textMorphDefaultProps,
  fields: [
    {
      kind: "textarea",
      key: "text",
      label: "Words (one per line)",
      rows: 7,
    },
  ],
};
