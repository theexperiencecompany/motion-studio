"use client";
import type { ReactNode } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

type Props = {
  backdrop?: string;
  scale?: number;
  children: ReactNode;
};

export function ChatFill({ backdrop, scale = 1.6, children }: Props) {
  const { width, height } = useVideoConfig();
  const innerW = width / scale;
  const innerH = height / scale;
  return (
    <AbsoluteFill
      style={{ background: backdrop ?? "#000", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: innerW,
          height: innerH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
}
