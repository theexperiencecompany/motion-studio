import type { CompositionInfo } from "../../schema";
import type { TypingSearchProps } from "./TypingSearch";

export const TYPING_SEARCH_DURATION = 200;
export const TYPING_SEARCH_FPS = 60;
export const TYPING_SEARCH_WIDTH = 1920;
export const TYPING_SEARCH_HEIGHT = 1080;

export const typingSearchDefaultProps: TypingSearchProps = {
  query: "best new tech of 2025",
  placeholder: "Search the web…",
};

export const typingSearchInfo: CompositionInfo<TypingSearchProps> = {
  id: "TypingSearch",
  category: "devtools",
  agentNotes:
    "Search bar with text typing in and (optionally) results dropping down. Use for 'how to find X' beats, product search demos, or as a hook in tutorials. Pair the typed query with a relevant brand or product.",
  title: "Typing Search",
  description:
    "A search bar that types out a query character-by-character, then a mouse cursor flies in and clicks the search button.",
  durationInFrames: TYPING_SEARCH_DURATION,
  fps: TYPING_SEARCH_FPS,
  width: TYPING_SEARCH_WIDTH,
  height: TYPING_SEARCH_HEIGHT,
  defaultProps: typingSearchDefaultProps,
  fields: [
    { kind: "text", key: "query", label: "Query" },
    { kind: "text", key: "placeholder", label: "Placeholder" },
  ],
};
