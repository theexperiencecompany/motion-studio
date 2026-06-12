"use client";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { type ClipStyle, resolveClipStyle } from "../../../clip-style";
import { useDesignFrame } from "../../../use-design-frame";

export type AuroraGradientProps = {
  clipStyle?: ClipStyle;
};

/**
 * Soft clouds of light wandering over a smooth gradient field. Each cloud
 * roams around an anchor point along an organic path built from two slow sine
 * harmonics per axis (never a straight line), so the motion feels calm and
 * non-repetitive. The harmonics use integer cycle counts, so the path closes
 * seamlessly at the loop boundary. Everything is a pure function of the loop
 * phase — byte-identical on scrub and on server export (no Math.random in a
 * frame).
 *
 * cx/cy   anchor (% of frame)        ax/ay   drift radius (% of frame)
 * fx/fy   cycles per loop (integer)  px/py   phase offsets (radians)
 */
const CLOUDS = [
  {
    cx: 30,
    cy: 32,
    ax: 12,
    ay: 8,
    fx: 1,
    fy: 1,
    px: 0.0,
    py: 1.1,
    size: 60,
    alpha: 0.5,
  },
  {
    cx: 68,
    cy: 58,
    ax: 10,
    ay: 11,
    fx: 1,
    fy: 1,
    px: 2.3,
    py: 0.4,
    size: 74,
    alpha: 0.42,
  },
  {
    cx: 50,
    cy: 44,
    ax: 14,
    ay: 7,
    fx: 1,
    fy: 1,
    px: 4.0,
    py: 3.2,
    size: 50,
    alpha: 0.55,
  },
  {
    cx: 78,
    cy: 80,
    ax: 9,
    ay: 9,
    fx: 1,
    fy: 1,
    px: 1.4,
    py: 5.0,
    size: 66,
    alpha: 0.34,
  },
];

export const AuroraGradient: React.FC<AuroraGradientProps> = ({
  clipStyle,
}) => {
  const frame = useDesignFrame();
  const { durationInFrames } = useVideoConfig();
  const s = resolveClipStyle(clipStyle, {
    background: "#1d4ed8",
    color: "#ffffff",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif",
    accent: "#3b82f6",
  });

  const tau = Math.PI * 2;
  const loop = (frame % durationInFrames) / durationInFrames;

  // Base diagonal sheen breathes once across the whole loop — barely there.
  const sheenAngle = 125 + Math.sin(loop * tau) * 5;

  return (
    <AbsoluteFill style={{ background: s.background, overflow: "hidden" }}>
      {/* diagonal accent sheen — lifts the base toward a lighter blue */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${sheenAngle}deg, ${s.background} 0%, ${s.accent} 55%, ${s.background} 100%)`,
          opacity: 0.7,
        }}
      />

      {/* wandering soft clouds */}
      {CLOUDS.map((c, i) => {
        // Two harmonics per axis → an organic, non-linear roaming path that
        // still closes seamlessly because every frequency is an integer.
        const x =
          c.cx +
          c.ax * Math.sin(loop * tau * c.fx + c.px) +
          c.ax * 0.25 * Math.sin(loop * tau * (c.fx + 1) + c.px * 2);
        const y =
          c.cy +
          c.ay * Math.sin(loop * tau * c.fy + c.py) +
          c.ay * 0.25 * Math.cos(loop * tau * (c.fy + 1) + c.py * 2);
        const breathe = c.alpha * (0.9 + 0.1 * Math.sin(loop * tau + i));
        return (
          <AbsoluteFill
            key={`cloud-${i}`}
            style={{
              background: `radial-gradient(${c.size}% ${c.size * 0.7}% at ${x.toFixed(2)}% ${y.toFixed(2)}%, rgba(255,255,255,${breathe.toFixed(3)}) 0%, rgba(255,255,255,${(breathe * 0.35).toFixed(3)}) 30%, rgba(255,255,255,0) 62%)`,
              mixBlendMode: "screen",
              filter: "blur(40px)",
            }}
          />
        );
      })}

      {/* soft horizon light along the bottom */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 55% at 50% 92%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 55%)",
          mixBlendMode: "screen",
        }}
      />

      {/* gentle top-down depth so the upper field stays rich */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 45%)",
        }}
      />
    </AbsoluteFill>
  );
};
