"use client";
import type { ComponentType } from "react";
import { leafComponentsById } from "./leaf-components";
import { PhoneFrame } from "./compositions/PhoneFrame/PhoneFrame";
import { SplitScene } from "./compositions/SplitScene/SplitScene";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const componentsById: Record<string, ComponentType<any>> = {
  ...leafComponentsById,
  PhoneFrame,
  SplitScene,
};
