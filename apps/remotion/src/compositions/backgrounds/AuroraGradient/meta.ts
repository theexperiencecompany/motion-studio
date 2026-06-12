import type { CompositionInfo } from "../../../schema";
import type { AuroraGradientProps } from "./AuroraGradient";

export const AURORA_GRADIENT_DURATION = 1200;
export const AURORA_GRADIENT_FPS = 60;
export const AURORA_GRADIENT_WIDTH = 1920;
export const AURORA_GRADIENT_HEIGHT = 1080;

export const auroraGradientDefaultProps: AuroraGradientProps = {};

export const auroraGradientInfo: CompositionInfo<AuroraGradientProps> = {
  id: "AuroraGradient",
  category: "background",
  agentNotes:
    "Soothing gradient field with soft clouds of light drifting slowly across at different paces, plus a gentle bottom horizon glow. A calm, premium backdrop for titles, product shots, or intro moments. The base field and lighter tone come from the Style section (background + accent).",
  title: "Aurora Gradient",
  description:
    "Calm animated blue gradient with soft clouds of light drifting across and a gentle bottom horizon glow.",
  durationInFrames: AURORA_GRADIENT_DURATION,
  fps: AURORA_GRADIENT_FPS,
  width: AURORA_GRADIENT_WIDTH,
  height: AURORA_GRADIENT_HEIGHT,
  defaultProps: auroraGradientDefaultProps,
  fields: [],
};
