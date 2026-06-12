"use client";

import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { FC } from "react";
import "./wave-spinner.css";

/**
 * WaveSpinner - A beautiful animated loading spinner with wave effects
 *
 * Features multiple patterns, colors, sizes, and animation styles.
 * Designed to be highly customizable while maintaining visual consistency.
 */

// Animation delay patterns for different visual effects
const DELAY_PATTERNS = {
  /** Diagonal wave from top-left */
  diagonalTL: [0, 0.12, 0.24, 0.12, 0.24, 0.36, 0.24, 0.36, 0.48],
  /** Diagonal wave from top-right */
  diagonalTR: [0.24, 0.12, 0, 0.36, 0.24, 0.12, 0.48, 0.36, 0.24],
  /** Diagonal wave from bottom-left */
  diagonalBL: [0.24, 0.36, 0.48, 0.12, 0.24, 0.36, 0, 0.12, 0.24],
  /** Diagonal wave from bottom-right */
  diagonalBR: [0.48, 0.36, 0.24, 0.36, 0.24, 0.12, 0.24, 0.12, 0],
  /** Ripple effect from center */
  ripple: [0.36, 0.24, 0.36, 0.24, 0, 0.24, 0.36, 0.24, 0.36],
  /** Horizontal wave */
  horizontal: [0, 0.12, 0.24, 0, 0.12, 0.24, 0, 0.12, 0.24],
  /** Vertical wave */
  vertical: [0, 0, 0, 0.12, 0.12, 0.12, 0.24, 0.24, 0.24],
  /** Random-like pattern */
  random: [0.1, 0.3, 0.2, 0.4, 0, 0.35, 0.15, 0.25, 0.45],
  /** Spiral from center */
  spiral: [0.4, 0.32, 0.24, 0.48, 0, 0.16, 0.56, 0.64, 0.08],
} as const;

// Grid configurations for different patterns
const GRID_CONFIGS = {
  /** 3x3 grid (standard) */
  square3x3: { cols: 3, count: 9 },
  /** 2x2 grid (minimal) */
  square2x2: { cols: 2, count: 4 },
  /** 4x4 grid (detailed) */
  square4x4: { cols: 4, count: 16 },
  /** Single row (linear) */
  line: { cols: 3, count: 3 },
  /** Diamond pattern */
  diamond: { cols: 3, count: 5, specialLayout: "diamond" as const },
  /** Cross pattern */
  cross: { cols: 3, count: 5, specialLayout: "cross" as const },
  /** Circle arrangement */
  circle: { cols: 1, count: 8, specialLayout: "circle" as const },
} as const;

type DelayPattern = keyof typeof DELAY_PATTERNS;
type GridPattern = keyof typeof GRID_CONFIGS;

// Color presets matching GAIA's design system
const COLOR_PRESETS = {
  /** GAIA primary blue (#00bbff) */
  primary: "#00bbff",
  /** Success green */
  success: "#22c55e",
  /** Warning amber */
  warning: "#f59e0b",
  /** Danger red */
  danger: "#ef4444",
  /** Muted zinc */
  muted: "#71717a",
  /** Purple accent */
  purple: "#a855f7",
  /** Cyan accent */
  cyan: "#06b6d4",
  /** Rose accent */
  rose: "#f43f5e",
  /** Indigo accent */
  indigo: "#6366f1",
  /** Emerald accent */
  emerald: "#10b981",
} as const;

type ColorPreset = keyof typeof COLOR_PRESETS;

// CVA variants for the container
const waveSpinnerVariants = cva("flex items-center justify-center w-fit", {
  variants: {
    size: {
      xs: "[--dot-size:3px] [--gap-size:1px]",
      sm: "[--dot-size:4px] [--gap-size:1.5px]",
      md: "[--dot-size:6px] [--gap-size:2px]",
      lg: "[--dot-size:8px] [--gap-size:3px]",
      xl: "[--dot-size:10px] [--gap-size:4px]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// Props interface with full documentation
export interface WaveSpinnerProps
  extends VariantProps<typeof waveSpinnerVariants> {
  /** The color of the spinner dots. Can be a preset name or any CSS color value */
  color?: ColorPreset | (string & {});
  /** The pattern of the grid layout */
  pattern?: GridPattern;
  /** The animation delay pattern for the wave effect */
  animation?: DelayPattern;
  /** Animation duration in seconds */
  duration?: number;
  /** The shape of individual dots */
  dotShape?: "square" | "rounded" | "circle";
  /** Additional className for customization */
  className?: string;
  /** Label for accessibility */
  "aria-label"?: string;
}

// Helper to get delay pattern for various grid sizes
const getDelayForIndex = (
  index: number,
  animation: DelayPattern,
  gridConfig: (typeof GRID_CONFIGS)[GridPattern],
): number => {
  const pattern = DELAY_PATTERNS[animation];

  // Special layouts use their own delay patterns
  if ("specialLayout" in gridConfig) {
    const count = gridConfig.count;
    // Create a proportional delay based on position
    const normalizedIndex = index / (count - 1);
    const patternIndex = Math.floor(normalizedIndex * (pattern.length - 1));
    return pattern[patternIndex] ?? 0;
  }

  // For larger grids, interpolate
  if (gridConfig.count > 9) {
    const gridSize = Math.sqrt(gridConfig.count);
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    // Map to 3x3 equivalent position
    const mappedRow = Math.floor((row / gridSize) * 3);
    const mappedCol = Math.floor((col / gridSize) * 3);
    const mappedIndex = mappedRow * 3 + mappedCol;
    return pattern[Math.min(mappedIndex, pattern.length - 1)] ?? 0;
  }

  // For smaller grids, use direct mapping
  if (gridConfig.count === 4) {
    // 2x2 mapping: 0,1,3,4 of 3x3
    const mapping = [0, 2, 6, 8];
    return pattern[mapping[index] ?? 0] ?? 0;
  }

  // For 3 dots (line), use first row
  if (gridConfig.count === 3) {
    return pattern[index] ?? 0;
  }

  return pattern[index % pattern.length] ?? 0;
};

// Component to render special layouts
const SpecialLayoutDots: FC<{
  config: (typeof GRID_CONFIGS)[GridPattern];
  color: string;
  dotShape: string;
  animation: DelayPattern;
  duration: number;
}> = ({ config, color, dotShape, animation, duration }) => {
  if (!("specialLayout" in config)) return null;

  const borderRadius =
    dotShape === "circle" ? "50%" : dotShape === "rounded" ? "30%" : "0";

  if (config.specialLayout === "diamond") {
    // Diamond pattern: center + 4 corners arranged as diamond
    const positions = [
      { top: "0%", left: "50%", transform: "translateX(-50%)" },
      { top: "50%", left: "0%", transform: "translateY(-50%)" },
      { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
      { top: "50%", left: "100%", transform: "translate(-100%, -50%)" },
      { top: "100%", left: "50%", transform: "translate(-50%, -100%)" },
    ];

    return (
      <div
        className="relative"
        style={{
          width: "calc(var(--dot-size) * 3 + var(--gap-size) * 2)",
          height: "calc(var(--dot-size) * 3 + var(--gap-size) * 2)",
        }}
      >
        {positions.map((pos, idx) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed position list
            key={idx}
            className="absolute transition-all"
            style={{
              width: "var(--dot-size)",
              height: "var(--dot-size)",
              backgroundColor: color,
              borderRadius,
              animation: `waveSpinnerPulse ${duration}s ease-out infinite`,
              animationDelay: `${getDelayForIndex(idx, animation, config)}s`,
              ...pos,
            }}
          />
        ))}
      </div>
    );
  }

  if (config.specialLayout === "cross") {
    // Cross pattern: center + 4 edges
    const positions = [
      { top: "0%", left: "50%", transform: "translateX(-50%)" },
      { top: "50%", left: "0%", transform: "translateY(-50%)" },
      { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
      { top: "50%", left: "100%", transform: "translate(-100%, -50%)" },
      { top: "100%", left: "50%", transform: "translate(-50%, -100%)" },
    ];

    return (
      <div
        className="relative"
        style={{
          width: "calc(var(--dot-size) * 3 + var(--gap-size) * 2)",
          height: "calc(var(--dot-size) * 3 + var(--gap-size) * 2)",
        }}
      >
        {positions.map((pos, idx) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed position list
            key={idx}
            className="absolute transition-all"
            style={{
              width: "var(--dot-size)",
              height: "var(--dot-size)",
              backgroundColor: color,
              borderRadius,
              animation: `waveSpinnerPulse ${duration}s ease-out infinite`,
              animationDelay: `${getDelayForIndex(idx, animation, config)}s`,
              ...pos,
            }}
          />
        ))}
      </div>
    );
  }

  if (config.specialLayout === "circle") {
    // Circle arrangement: 8 dots in a circle
    const angleStep = (2 * Math.PI) / config.count;
    const radius = "calc(var(--dot-size) * 1.5)";

    return (
      <div
        className="relative"
        style={{
          width: "calc(var(--dot-size) * 4)",
          height: "calc(var(--dot-size) * 4)",
        }}
      >
        {Array.from({ length: config.count }).map((_, idx) => {
          const angle = idx * angleStep - Math.PI / 2;
          const x = Math.cos(angle);
          const y = Math.sin(angle);
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed circle dot count
              key={idx}
              className="absolute transition-all"
              style={{
                width: "var(--dot-size)",
                height: "var(--dot-size)",
                backgroundColor: color,
                borderRadius: "50%", // Always circular for circle pattern
                animation: `waveSpinnerPulse ${duration}s ease-out infinite`,
                animationDelay: `${(idx / config.count) * duration}s`,
                top: "50%",
                left: "50%",
                transform: `translate(calc(-50% + ${x} * ${radius}), calc(-50% + ${y} * ${radius}))`,
              }}
            />
          );
        })}
      </div>
    );
  }

  return null;
};

export const WaveSpinner: FC<WaveSpinnerProps> = ({
  color = "primary",
  pattern = "square3x3",
  animation = "diagonalTL",
  duration = 0.7,
  dotShape = "square",
  size,
  className,
  "aria-label": ariaLabel = "Loading",
}) => {
  // Resolve color from preset or use as-is
  const resolvedColor =
    color in COLOR_PRESETS ? COLOR_PRESETS[color as ColorPreset] : color;

  const gridConfig = GRID_CONFIGS[pattern];
  const borderRadius =
    dotShape === "circle" ? "50%" : dotShape === "rounded" ? "30%" : "0";

  // Check if this is a special layout
  const isSpecialLayout = "specialLayout" in gridConfig;

  return (
    <div
      className={cn(waveSpinnerVariants({ size }), className)}
      role="status"
      aria-label={ariaLabel}
    >
      <div className="relative flex items-center justify-center">
        {isSpecialLayout ? (
          <SpecialLayoutDots
            config={gridConfig}
            color={resolvedColor}
            dotShape={dotShape}
            animation={animation}
            duration={duration}
          />
        ) : (
          <div
            className="relative grid"
            style={{
              gridTemplateColumns: `repeat(${gridConfig.cols}, var(--dot-size))`,
              gap: "var(--gap-size)",
            }}
          >
            {Array.from({ length: gridConfig.count }).map((_, idx) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed grid count
                key={idx}
                className="transition-all"
                style={{
                  width: "var(--dot-size)",
                  height: "var(--dot-size)",
                  backgroundColor: resolvedColor,
                  borderRadius,
                  animation: `waveSpinnerPulse ${duration}s ease-out infinite`,
                  animationDelay: `${getDelayForIndex(idx, animation, gridConfig)}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export type { ColorPreset, DelayPattern, GridPattern };
// Re-export types and constants for external use
export { COLOR_PRESETS, DELAY_PATTERNS, GRID_CONFIGS };
