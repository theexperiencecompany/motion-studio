import type { CompositionInfo } from "../../schema";
import { TITLE_FIELDS } from "../title-shared";
import type { FontHookProps } from "./FontHook";

export const FONT_HOOK_DURATION = 120;
export const FONT_HOOK_FPS = 60;
export const FONT_HOOK_WIDTH = 1080;
export const FONT_HOOK_HEIGHT = 1920;

export const fontHookDefaultProps: FontHookProps = {
  headline: "Stop\nScrolling",
  subtitle: "Font speed hook",
};

export const fontHookInfo: CompositionInfo<FontHookProps> = {
  id: "FontHook",
  category: "text",
  title: "Font Hook",
  description:
    "Rapid font cycling for punchy, scroll-stopping openers and title cards.",
  durationInFrames: FONT_HOOK_DURATION,
  fps: FONT_HOOK_FPS,
  width: FONT_HOOK_WIDTH,
  height: FONT_HOOK_HEIGHT,
  defaultProps: fontHookDefaultProps,
  fields: TITLE_FIELDS,
  phoneFitMode: "cover",
};
