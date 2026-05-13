"use client";
import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";

/**
 * Wraps a ChatDemo in a centered card so the platform UI reads at the
 * proper scale on a 1280x720 video canvas — matching InstagramMessages'
 * dimensions for consistency across all chat compositions.
 */
type Variant = "mobile" | "desktop";

type Props = {
  variant: Variant;
  backdrop?: string;
  children: ReactNode;
};

// Container sizes tuned for a 1280x720 canvas with margin for the backdrop
// to show through.
const SIZES: Record<Variant, { w: number; h: number; scale: number }> = {
  // Portrait phone-shaped card. The chat UI was designed for ~720px wide.
  mobile: { w: 520, h: 680, scale: 1 },
  // Landscape desktop window card. Slack / Discord look right at this size.
  desktop: { w: 1180, h: 660, scale: 1 },
};

export function ChatStage({ variant, backdrop, children }: Props) {
  const { w, h, scale } = SIZES[variant];
  return (
    <AbsoluteFill
      style={{
        background: backdrop ?? defaultBackdrop(variant),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: w,
          height: h,
          borderRadius: 28,
          overflow: "hidden",
          boxShadow:
            "0 30px 90px rgba(0,0,0,0.32), 0 6px 18px rgba(0,0,0,0.18)",
          background: "#fff",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          position: "relative",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
}

function defaultBackdrop(variant: Variant): string {
  return variant === "mobile"
    ? "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)"
    : "linear-gradient(135deg, #eef2ff 0%, #f3f4f6 100%)";
}
