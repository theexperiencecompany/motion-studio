import type { CompositionInfo } from "../../schema";
import { TITLE_FIELDS } from "../title-shared";
import type { TitleFadeProps } from "./TitleFade";

export const TITLE_FADE_DURATION = 100;
export const TITLE_FADE_FPS = 60;
export const TITLE_FADE_WIDTH = 1920;
export const TITLE_FADE_HEIGHT = 1080;

export const titleFadeDefaultProps: TitleFadeProps = {
  headline: "Quietly perfect",
  subtitle: "No fanfare needed",
};

export const titleFadeInfo: CompositionInfo<TitleFadeProps> = {
  id: "TitleFade",
  category: "text",
  agentNotes:
    "Calm, premium fade-in title with optional subtitle. Use for editorial / serious / brand-forward openers. Pairs with the off-white or warm-cream bases for an Apple-style feel.",
  title: "Fade In",
  description:
    "The simplest, most restrained intro: the headline fades up and the subtitle follows. Reach for this when the words should do the work.",
  durationInFrames: TITLE_FADE_DURATION,
  fps: TITLE_FADE_FPS,
  width: TITLE_FADE_WIDTH,
  height: TITLE_FADE_HEIGHT,
  defaultProps: titleFadeDefaultProps,
  fields: TITLE_FIELDS,
};
