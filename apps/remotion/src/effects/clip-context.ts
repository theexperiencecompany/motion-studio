"use client";

import { createContext, useContext } from "react";

export const ClipDurationContext = createContext(0);

export function useClipDurationInFrames(): number {
  return useContext(ClipDurationContext);
}
