"use client";
import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";

/**
 * Wraps a ChatDemo in a centered, scaled container so the platform UI
 * (sized for a typical ~960px web preview) reads at the proper scale on
 * the 1920x1080 video canvas.
 *
 * Mobile platforms (iMessage / WhatsApp / Telegram) render in a portrait
 * "phone screenshot" frame with a soft shadow on a neutral backdrop.
 * Desktop platforms (Slack / Discord) render in a centered "desktop window"
 * frame with the same shadow treatment.
 */
type Variant = "mobile" | "desktop";

type Props = {
  variant: Variant;
  backdrop?: string;
  children: ReactNode;
};

// Inner design sizes — content scales 2x to fill 1920x1080-ish areas.
const SIZES: Record<Variant, { w: number; h: number; scale: number }> = {
  // 720x1080 portrait card, scaled 1.0 — leaves room for whitespace either
  // side of the phone. The chat UI was designed for ~720px wide.
  mobile: { w: 720, h: 1040, scale: 0.97 },
  // 1600x1000 landscape card, scaled 1.0 — Slack/Discord are designed for
  // desktop widths. Content reads at native size.
  desktop: { w: 1600, h: 1000, scale: 1 },
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
