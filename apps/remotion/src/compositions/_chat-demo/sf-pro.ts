import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/**
 * Authentic SF Pro Display — Apple's UI typeface — loaded from local OTF files
 * in `public/sf-pro-display/`. The chat compositions used to lean on the
 * `-apple-system` / `BlinkMacSystemFont` system stack, which only resolves to
 * real SF on macOS. In a headless export (Linux/Lambda Chromium) those names
 * don't exist, so the chat fell back to a generic sans and stopped looking like
 * iMessage. Loading the OTFs makes the font travel with the render, so the
 * Player and the exported MP4 look identical everywhere.
 *
 * `loadFont` (from @remotion/fonts) registers each weight via `FontFace` and
 * blocks the render (delayRender) until it's decoded — so an export never
 * rasterizes a fallback-font frame before the real font arrives. Importing this
 * module is enough to trigger the load; no hook/component call is required.
 */
export const SF_PRO_FAMILY = "SF Pro Display";

/**
 * Font stack that PREFERS the bundled OTF, then falls back to the live system
 * SF on macOS, then generics. With the OTF loaded, the Player and the export
 * resolve to the exact same SF Pro Display.
 */
export const SF_PRO_STACK = `"${SF_PRO_FAMILY}", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;

// Only the upright weights the chat actually uses. A request for 600 (semibold,
// e.g. the contact name) snaps to the nearest declared weight.
const WEIGHTS = [
  { weight: "400", file: "SFPRODISPLAYREGULAR.OTF" },
  { weight: "500", file: "SFPRODISPLAYMEDIUM.OTF" },
  { weight: "700", file: "SFPRODISPLAYBOLD.OTF" },
] as const;

for (const w of WEIGHTS) {
  loadFont({
    family: SF_PRO_FAMILY,
    url: staticFile(`sf-pro-display/${w.file}`),
    weight: w.weight,
    format: "opentype",
    display: "swap",
  });
}
