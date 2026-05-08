import type { ClipEffect } from "./effects/schema";

export type Clip = {
  id: string;
  compositionId: string;
  props: Record<string, unknown>;
  durationInFrames: number;
  effects?: ClipEffect[];
};

export type Project = {
  fps: number;
  width: number;
  height: number;
  clips: Clip[];
};

export const DEFAULT_PROJECT: Project = {
  fps: 60,
  width: 1920,
  height: 1080,
  clips: [],
};

export function projectDuration(project: Project): number {
  return Math.max(
    1,
    project.clips.reduce((sum, c) => sum + c.durationInFrames, 0),
  );
}
