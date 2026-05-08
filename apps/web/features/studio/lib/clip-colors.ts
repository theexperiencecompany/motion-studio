export const PX_PER_SECOND = 80;

export const CLIP_COLORS = [
  "from-violet-400 to-violet-600",
  "from-sky-400 to-sky-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
  "from-fuchsia-400 to-fuchsia-600",
];

export function colorForCompositionId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return CLIP_COLORS[Math.abs(hash) % CLIP_COLORS.length]!;
}
