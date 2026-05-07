import type { AnyCompositionInfo } from "./schema";
import { messagePopupInfo } from "./compositions/MessagePopup/meta";
import { messageBubblesInfo } from "./compositions/MessageBubbles/meta";

export const compositions: AnyCompositionInfo[] = [
  messagePopupInfo,
  messageBubblesInfo,
];

export const compositionsById: Record<string, AnyCompositionInfo> =
  Object.fromEntries(compositions.map((c) => [c.id, c]));
