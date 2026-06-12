/**
 * Pure timing/layout helpers for TextMagicMove. Deliberately NOT a
 * `"use client"` module: `meta.ts` is evaluated on the server (the registry is
 * built server-side) and calls `computeMagicMoveDuration` at module load, so
 * this logic must stay free of any client-only boundary.
 *
 * All values are in DESIGN frames (60fps); the component's `useDesignFrame`
 * keeps them tied to wall-clock time at any export fps.
 */

export const MAGIC_ENTER = 22; // first phrase's entrance
export const MAGIC_HOLD = 40; // each phrase fully shown
export const MAGIC_MORPH = 26; // hand-off between two phrases
export const MAGIC_END_PAD = 24; // tail after the last phrase

export const DEFAULT_MAGIC_SPEED = 1;

/**
 * Playback rate. >1 plays faster (shorter holds + morphs), <1 slower. The
 * component multiplies the design frame by this, and the duration is divided
 * by it, so the whole clip scales while the motion shapes stay identical.
 */
export function normalizeSpeed(speed: number | undefined): number {
  return typeof speed === "number" && Number.isFinite(speed) && speed > 0
    ? speed
    : DEFAULT_MAGIC_SPEED;
}

/** Parse the newline-separated `phrases` prop into trimmed word arrays. */
export function parsePhrases(phrases: string): string[][] {
  const lines = phrases
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.split(/\s+/).filter(Boolean));
  return lines.length ? lines : [["Magic", "move"]];
}

/** Total clip length for a phrase set at a given speed, in design frames. */
export function computeMagicMoveDuration(phrases: string, speed = 1): number {
  const n = parsePhrases(phrases).length;
  const base =
    n * MAGIC_HOLD + Math.max(0, n - 1) * MAGIC_MORPH + MAGIC_END_PAD;
  return Math.max(1, Math.round(base / normalizeSpeed(speed)));
}
