import type { ClipStyle } from "./clip-style";
import type { ClipEffect } from "./effects/schema";
import {
  DEFAULT_SCENE_TRANSITION,
  normalizeSceneTransition,
  resolveTransition,
  type SceneTransition,
} from "./transitions";

export type Clip = {
  id: string;
  compositionId: string;
  props: Record<string, unknown>;
  durationInFrames: number;
  effects?: ClipEffect[];
  /** Universal visual overrides — see `clip-style.ts`. */
  style?: ClipStyle;
  /**
   * How this clip enters from the previous one. The transition window
   * overlaps the tail of the previous clip with the head of this one, so
   * both are visible simultaneously (no black flash between backgrounds).
   * First clip ignores transitions; non-first clips fall back to the
   * project's `defaultTransition`, then `DEFAULT_SCENE_TRANSITION`.
   */
  transition?: SceneTransition;
};

/**
 * Project-level background music. Sits at the AbsoluteFill root in the
 * `Project` composition — outside the TransitionSeries — so it spans the
 * whole timeline regardless of how the clips above are arranged or
 * transitioned. Optional: a project without `audio` set renders silent.
 */
export type ProjectAudio = {
  /** URL to mp3: pixabay direct, proxied, or browser blob: URL from upload. */
  src: string;
  /** Display label in the inspector. */
  title?: string;
  /** Royalty attribution string if the source requires it. */
  attribution?: string;
  /** 0..1, default 0.2 — sits politely under any future voiceover. */
  volume: number;
  /** Seek into the source file before playback starts. Seconds. Default 0. */
  trimStartSec?: number;
  /**
   * Frame within the project timeline where audio playback begins. Default
   * 0 (audio starts with the video). The renderer wraps the <Audio> in a
   * <Sequence from={startFrame}> so silence plays before this point. Used
   * by the timeline's drag-to-reposition handle.
   */
  startFrame?: number;
  /**
   * How many frames the audio plays for. Defaults to the project's total
   * duration (audio runs the whole video). Clamped to ≤ projectDuration in
   * the UI — audio can never outlast the video.
   */
  durationFrames?: number;
  /** Linear fade-in over this many frames. Default 15 (0.25s @ 60fps). */
  fadeInFrames?: number;
  /** Linear fade-out over this many frames at the END of durationFrames. Default 30. */
  fadeOutFrames?: number;
  /** If the source is shorter than durationFrames, loop to fill. */
  loop?: boolean;
  /**
   * Length of the source mp3 in seconds, when known. Pixabay results
   * provide this directly; for browser-uploaded mp3s the studio decodes
   * it via `<audio>` metadata events. Drives the trim-start slider's
   * upper bound and the "fits whole video?" UI hint.
   */
  sourceDurationSec?: number;
};

/**
 * Per-project brand kit — saved with the project JSON so importing the
 * file carries the brand across machines. The agent reads this and
 * prefers user brand values over generic design tokens; non-brand-locked
 * compositions can use these via `style` overrides.
 */
export type BrandKit = {
  /** Display name of the brand, surfaced in the agent's prompt context. */
  brandName?: string;
  /** Logo image — usually a data URL (uploaded) or external https URL. */
  logoUrl?: string;
  /** Main brand color used as `accent` on most clips. Hex like "#FF6B35". */
  primaryColor?: string;
  /** Secondary brand color used for backgrounds or highlights. */
  secondaryColor?: string;
  /** Google Fonts family — applied to non-brand-locked text clips. */
  fontFamily?: string;
};

export type Project = {
  fps: number;
  width: number;
  height: number;
  clips: Clip[];
  /**
   * Project-level transition applied to every non-first clip that doesn't
   * set its own override. Lets the user pick a global "look" (all fades, or
   * all slides) once instead of per-clip.
   */
  defaultTransition?: SceneTransition;
  /** Optional background music for the whole project. */
  audio?: ProjectAudio;
  /** Optional per-project brand kit — see `BrandKit` for shape. */
  brandKit?: BrandKit;
};

export const DEFAULT_PROJECT: Project = {
  fps: 60,
  width: 1920,
  height: 1080,
  clips: [],
  defaultTransition: DEFAULT_SCENE_TRANSITION,
};

/**
 * Total duration accounting for transition overlap. Each non-first
 * transition steals `durationInFrames` from the timeline because the two
 * adjacent clips render simultaneously during the transition window.
 */
export function projectDuration(project: Project): number {
  let total = 0;
  for (let i = 0; i < project.clips.length; i++) {
    const clip = project.clips[i];
    if (!clip) continue;
    total += clip.durationInFrames;
    if (i > 0) {
      const prev = project.clips[i - 1];
      const t = resolveTransition({
        clipTransition: clip.transition,
        projectDefault: project.defaultTransition,
        index: i,
      });
      const maxOverlap = Math.min(
        prev?.durationInFrames ?? t.durationInFrames,
        clip.durationInFrames,
      );
      total -= Math.min(t.durationInFrames, maxOverlap);
    }
  }
  return Math.max(1, total);
}

export { normalizeSceneTransition };
