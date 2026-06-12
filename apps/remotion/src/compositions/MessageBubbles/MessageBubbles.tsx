import { spring, useVideoConfig } from "remotion";
import type { ChatMessage } from "../../editors/types";
import { useDesignFrame } from "../../use-design-frame";
import { ChatDemo, type ChatMessageItem } from "../_chat-demo/ChatDemo";
import { ChatFill } from "../_chat-demo/ChatFill";
import { KEYBOARD_BG } from "../_chat-demo/Keyboard";

export type MessageBubblesProps = {
  contactName: string;
  contactAvatar?: string;
  messages: ChatMessage[];
  orientation?: "landscape" | "portrait";
  scale?: number;
  /** Custom wallpaper behind the conversation (static path or http URL). */
  backgroundImage?: string;
  /** Render incoming bubbles, composer, and buttons as WebGL liquid glass. */
  liquidGlass?: boolean;
  /** Light or dark iMessage appearance (uses Apple's exact bubble grays). */
  theme?: "light" | "dark";
  /** Show the on-screen keyboard typing out outgoing messages in real time. */
  showKeyboard?: boolean;
};

/** Pop balloon hold + rise timings (frames) for the keyboard key press. */
const POP_HOLD = 7;
const POP_RISE = 2;

type ChatState = {
  items: ChatMessageItem[];
  composerText: string;
  pressedKey: string | null;
  pressT: number;
};

/**
 * Drive the whole conversation off the current frame. Without the keyboard
 * this is the classic behaviour (every message shows a typing-dots bubble then
 * its text). With the keyboard on, OUTGOING messages are instead "typed": their
 * text fills the composer character-by-character (popping the matching key),
 * and only once finished does the bubble send into the thread. Incoming
 * messages are unchanged — that's the other person typing.
 */
function buildChatState(
  messages: ChatMessage[],
  frame: number,
  keyboardOn: boolean,
): ChatState {
  const items: ChatMessageItem[] = [];
  let composerText = "";
  let pressedKey: string | null = null;
  let pressT = 0;

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i]!;
    // Never render an empty bubble — a message with no text and no image is
    // dropped from the video entirely.
    if (!m.image && !m.text.trim()) continue;
    if (frame < m.delay) continue;
    const local = frame - m.delay;
    const isOutgoing = m.side === "right";
    const inTyping = local < m.typingFrames;

    // Images can't be "typed" on the keyboard — they always send as a bubble.
    if (keyboardOn && isOutgoing && !m.image) {
      if (inTyping) {
        // Being typed on the keyboard → lives in the composer, not the thread.
        const chars = Array.from(m.text);
        const len = chars.length || 1;
        const typed = Math.max(
          0,
          Math.min(len, Math.floor((local / m.typingFrames) * len)),
        );
        composerText = chars.slice(0, typed).join("");

        // Active key = the most-recently-registered character still inside its
        // pop window. Each char j "presses" at the midpoint of its time slice.
        let bestJ = -1;
        let bestT = -Infinity;
        for (let j = 0; j < len; j++) {
          const tj = m.delay + ((j + 0.5) / len) * m.typingFrames;
          if (tj <= frame && tj > bestT) {
            bestT = tj;
            bestJ = j;
          }
        }
        if (bestJ >= 0) {
          const elapsed = frame - bestT;
          if (elapsed < POP_HOLD) {
            pressedKey = chars[bestJ]!.toLowerCase();
            pressT = elapsed < POP_RISE ? elapsed / POP_RISE : 1;
          }
        }
        continue;
      }
      // Sent — pop into the thread from the send frame onward.
      items.push({
        id: i,
        from: "me",
        text: m.text,
        image: m.image,
        typing: false,
        enterFrames: local - m.typingFrames,
      });
      continue;
    }

    // Classic path: incoming messages, or keyboard-off outgoing.
    items.push({
      id: i,
      from: isOutgoing ? "me" : "them",
      text: m.text,
      image: m.image,
      typing: inTyping,
      enterFrames: local,
    });
  }

  return { items, composerText, pressedKey, pressT };
}

export const MessageBubbles: React.FC<MessageBubblesProps> = ({
  contactName,
  contactAvatar = "https://avatars.githubusercontent.com/aryanranderiya?s=200",
  messages,
  orientation = "landscape",
  scale = 2,
  backgroundImage,
  liquidGlass = true,
  theme = "light",
  showKeyboard = false,
}) => {
  const frame = useDesignFrame();
  const { fps } = useVideoConfig();
  const { items, composerText, pressedKey, pressT } = buildChatState(
    messages,
    frame,
    showKeyboard,
  );

  // Keyboard slides up at the very start, before the first message lands.
  const keyboardOpen = showKeyboard
    ? spring({
        frame,
        fps,
        config: { damping: 18, stiffness: 130, mass: 0.7 },
        durationInFrames: 18,
      })
    : 1;

  const backdrop = backgroundImage || theme === "dark" ? "#000000" : "#ffffff";

  return (
    <ChatFill
      backdrop={backdrop}
      chromeColor={backdrop}
      bottomChromeColor={showKeyboard ? KEYBOARD_BG[theme] : undefined}
      scale={scale}
      orientation={orientation}
    >
      <ChatDemo
        platform="imessage"
        title={contactName}
        headerAvatar={contactAvatar}
        messages={items}
        backgroundImage={backgroundImage}
        liquidGlass={liquidGlass}
        theme={theme}
        showKeyboard={showKeyboard}
        composerText={composerText}
        pressedKey={pressedKey}
        pressT={pressT}
        keyboardOpen={keyboardOpen}
      />
    </ChatFill>
  );
};
