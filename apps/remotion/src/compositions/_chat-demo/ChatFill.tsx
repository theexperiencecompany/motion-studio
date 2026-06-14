"use client";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { useSafeArea } from "../../safe-area";
import { useDesignFrame } from "../../use-design-frame";

type Orientation = "landscape" | "portrait";

type Props = {
  /** Color rendered outside the chat tile (and behind the chat in portrait). */
  backdrop?: string;
  scale?: number;
  /**
   * Color used for the safe-area padding bars at the top/bottom of the
   * portrait viewport. Should match the chat's chrome (header/composer)
   * color so the chrome reads as a single continuous bar that extends
   * under the device's dynamic island and home indicator. Defaults to
   * `backdrop` if not provided.
   */
  chromeColor?: string;
  /**
   * Color for the BOTTOM safe-area bar only (defaults to `chromeColor`). Lets a
   * composition with an on-screen keyboard tint just the home-indicator strip
   * to the keyboard color so it reads as one continuous surface, while the top
   * bar stays the header/backdrop color.
   */
  bottomChromeColor?: string;
  /**
   * Landscape (default): fills the parent with the chat scaled up for
   * standalone viewing. Portrait: renders the chat inside a centered
   * phone-aspect column (9:19.5) sized to the parent's height so it
   * reads correctly when wrapped in PhoneFrame.
   *
   * All sizing is parent-relative — never call useVideoConfig() here.
   * When this composition is nested inside a wrapper (e.g. PhoneFrame),
   * useVideoConfig returns the wrapper's canvas dims, not ours, which
   * mis-positions everything.
   */
  orientation?: Orientation;
  /**
   * Fixed iPhone-logical layout width (px) to render the chat at before
   * uniformly scaling it to fill the canvas. When set, every element — bubbles,
   * header, composer, keyboard — keeps authentic iOS proportions relative to one
   * another regardless of canvas size, and `scale` becomes a fine zoom
   * multiplier (1 = natural fit-to-width). Without it, ChatFill keeps the legacy
   * behaviour where `scale` is a raw transform multiplier (used by the other
   * chat compositions, which are tuned to it — don't change those).
   */
  designWidth?: number;
  children: ReactNode;
};

/**
 * Lay children out at a fixed `designWidth` and uniformly scale the whole unit
 * to fill the parent. This keeps fixed-px elements (bubbles, header, composer)
 * in true iOS proportion to the width-responsive keyboard at any canvas size —
 * instead of the keyboard ballooning while the bubbles stay tiny on a wide
 * canvas. `zoom` is an extra multiplier (1 = natural fit-to-width).
 */
function ScaledToDesignWidth({
  designWidth,
  zoom,
  children,
}: {
  designWidth: number;
  zoom: number;
  children: ReactNode;
}) {
  // Re-measure each frame (cheap, stable) — same approach as Keyboard, so it
  // settles correctly under @remotion/web-renderer headless export too.
  const frame = useDesignFrame();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    if (wrapRef.current) {
      const w = wrapRef.current.clientWidth;
      const h = wrapRef.current.clientHeight;
      if (w > 0 && h > 0) setSize({ w, h });
    }
  }, [frame]);

  const s = size.w > 0 ? (size.w / designWidth) * zoom : zoom;
  return (
    <div
      ref={wrapRef}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: designWidth,
          height: size.h > 0 ? size.h / s : "100%",
          // `zoom` re-runs LAYOUT at the final pixel size, so text/keys/bubbles
          // rasterize at full resolution — crisp in the @remotion/web-renderer
          // export. (The old `transform: scale` painted at the small design
          // size and bitmap-upscaled the result → the blur + keyboard moiré.)
          zoom: s,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Deterministic version of ScaledToDesignWidth for the STANDALONE design-width
 * path (no device frame): the scale comes straight from the canvas size via
 * `useVideoConfig()` instead of measuring `clientWidth` every frame. That
 * removes the per-frame DOM read entirely — so the layout can't wobble
 * frame-to-frame (the keyboard "shake"), and it can't read 0 on the first
 * headless-export frame. Only safe here because this branch is never nested in
 * a PhoneFrame, so useVideoConfig() reports the real output canvas.
 */
function ScaledToDesignWidthFixed({
  designWidth,
  zoom,
  children,
}: {
  designWidth: number;
  zoom: number;
  children: ReactNode;
}) {
  const { width, height } = useVideoConfig();
  const raw = (width / designWidth) * zoom;
  // Guard: a 0 / NaN scale (a 0 `scale` field value, or width not ready on the
  // first render) must never reach `height / s` — that would be Infinity, which
  // React rejects as a CSS height. Fall back to 1× until the scale is valid.
  const s = Number.isFinite(raw) && raw > 0 ? raw : 1;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: designWidth,
          height: height / s,
          // `zoom` re-runs layout at the final pixel size → crisp; see note in
          // ScaledToDesignWidth above.
          zoom: s,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Matches PhoneFrame's inner screen aspect (724×1524) so the chat fills the
// device edge-to-edge with no side bars when wrapped in PhoneFrame. Visually
// identical to a 9:19.5 phone for standalone portrait use.
const PORTRAIT_ASPECT = "724 / 1524";

export function ChatFill({
  backdrop,
  scale = 1.6,
  chromeColor,
  bottomChromeColor,
  orientation = "landscape",
  designWidth,
  children,
}: Props) {
  const safe = useSafeArea();
  const padColor = chromeColor ?? backdrop ?? "#000";
  const bottomPadColor = bottomChromeColor ?? padColor;

  // Auto-portrait when nested inside a device frame (PhoneFrame provides a
  // non-default SafeAreaContext). Landscape chat inside a phone always looks
  // wrong — it cover-fits over the tall screen and crops the conversation
  // down to a narrow vertical slice. Defaulting to portrait there matches
  // every realistic use case.
  const inDeviceFrame = safe.top > 0 || safe.bottom > 0;

  // Inside a device frame (PhoneFrame): fit the chat to the phone screen,
  // honoring the safe-area insets the frame provides.
  if (inDeviceFrame) {
    return (
      <AbsoluteFill
        style={{
          background: backdrop ?? "#000",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            aspectRatio: PORTRAIT_ASPECT,
            transform: "translateX(-50%)",
            background: padColor,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {safe.top > 0 && <div style={{ flexShrink: 0, height: safe.top }} />}
          <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
            {designWidth ? (
              <ScaledToDesignWidth designWidth={designWidth} zoom={scale}>
                {children}
              </ScaledToDesignWidth>
            ) : (
              children
            )}
          </div>
          {safe.bottom > 0 && (
            <div
              style={{
                flexShrink: 0,
                height: safe.bottom,
                background: bottomPadColor,
              }}
            />
          )}
        </div>
      </AbsoluteFill>
    );
  }

  // Standalone, design-width mode: lay the chat out at a fixed iPhone-logical
  // width and uniformly scale it to fill the canvas, so bubbles + keyboard keep
  // real iOS proportions (see ScaledToDesignWidth). `scale` is a zoom multiplier.
  if (designWidth) {
    return (
      <AbsoluteFill
        style={{ background: backdrop ?? "#000", overflow: "hidden" }}
      >
        <ScaledToDesignWidthFixed designWidth={designWidth} zoom={scale}>
          {children}
        </ScaledToDesignWidthFixed>
      </AbsoluteFill>
    );
  }

  // Standalone (no device frame): render the chat at (100 / scale)% of the
  // parent, then scale up to FILL the whole canvas — works the same for a 16:9
  // landscape canvas or a 9:16 portrait canvas. The canvas dimensions (set from
  // the Orientation prop) decide the shape; the chat always fills it instead of
  // sitting in a narrow centered column with black side bars.
  const pct = 100 / scale;
  return (
    <AbsoluteFill
      style={{ background: backdrop ?? "#000", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${pct}%`,
          height: `${pct}%`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
}
