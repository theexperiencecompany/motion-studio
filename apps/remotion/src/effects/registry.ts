import type { ComponentType } from "react";
import { KenBurns, kenBurnsInfo } from "./KenBurns";
import { Pop, popInfo } from "./Pop";
import { Shake, shakeInfo } from "./Shake";
import type { AnyEffectInfo } from "./schema";

export const effects: AnyEffectInfo[] = [popInfo, shakeInfo, kenBurnsInfo];

export const effectsById: Record<string, AnyEffectInfo | undefined> =
  Object.fromEntries(effects.map((e) => [e.id, e]));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const effectComponentsById: Record<string, ComponentType<any>> = {
  Pop,
  Shake,
  KenBurns,
};
