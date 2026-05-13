"use client";
import {
  AbsoluteFill,
  Img,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ChatMessage } from "../../editors/types";

export type MessageBubblesProps = {
  contactName: string;
  contactAvatar?: string;
  messages: ChatMessage[];
  theme: "light" | "dark";
};

type Palette = {
  bg: string;
  text: string;
  mutedText: string;
  border: string;
  receivedBg: string;
  sentBg: string;
  receivedText: string;
  sentText: string;
};

function getPalette(theme: "light" | "dark"): Palette {
  if (theme === "dark") {
    return {
      bg: "#000000",
      text: "#ffffff",
      mutedText: "rgba(255,255,255,0.55)",
      border: "rgba(255,255,255,0.08)",
      receivedBg: "#26252A",
      sentBg: "#00BBFF",
      receivedText: "#ffffff",
      sentText: "#0a0a0a",
    };
  }
  return {
    bg: "#ffffff",
    text: "#0f1014",
    mutedText: "rgba(15,16,20,0.55)",
    border: "rgba(15,16,20,0.08)",
    receivedBg: "#D4D4D8",
    sentBg: "#00BBFF",
    receivedText: "#0f1014",
    sentText: "#0a0a0a",
  };
}

// Group position relative to consecutive same-side runs.
type GroupPos = "first" | "middle" | "last" | "only";

function getGroupPos(
  messages: ChatMessage[],
  index: number,
  frame: number,
): GroupPos {
  const cur = messages[index]!;
  const prev = messages[index - 1];
  const next = messages[index + 1];
  const prevVisible = prev && frame >= prev.delay && prev.side === cur.side;
  const nextVisible = next && frame >= next.delay && next.side === cur.side;
  if (prevVisible && nextVisible) return "middle";
  if (prevVisible && !nextVisible) return "last";
  if (!prevVisible && nextVisible) return "first";
  return "only";
}

const ROW_SHIFT = 110;
const BASE_BOTTOM = 120;
const TIGHT_GAP = 16;
const SIDE_PADDING = 140;
const HEADER_HEIGHT = 220;

export const MessageBubbles: React.FC<MessageBubblesProps> = ({
  contactName,
  contactAvatar,
  messages,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palette = getPalette(theme);

  return (
    <AbsoluteFill
      style={{
        background: palette.bg,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif",
        color: palette.text,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ChatHeader
        name={contactName}
        avatar={contactAvatar}
        frame={frame}
        fps={fps}
        palette={palette}
      />
      <Conversation
        frame={frame}
        fps={fps}
        messages={messages}
        palette={palette}
      />
    </AbsoluteFill>
  );
};

function ChatHeader({
  name,
  avatar,
  frame,
  fps,
  palette,
}: {
  name: string;
  avatar?: string;
  frame: number;
  fps: number;
  palette: Palette;
}) {
  const enter = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 90 },
  });
  return (
    <div
      style={{
        height: HEADER_HEIGHT,
        padding: "60px 0 30px",
        borderBottom: `1px solid ${palette.border}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        opacity: enter,
        transform: `translateY(${(1 - enter) * -8}px)`,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          overflow: "hidden",
          background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 52,
          fontWeight: 600,
          letterSpacing: "-0.01em",
        }}
      >
        {avatar ? (
          <Img
            src={avatar}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          name.slice(0, 1).toUpperCase()
        )}
      </div>
      <div
        style={{
          fontSize: 40,
          fontWeight: 600,
          color: palette.text,
          letterSpacing: "-0.01em",
        }}
      >
        {name}
      </div>
    </div>
  );
}

function Conversation({
  frame,
  fps,
  messages,
  palette,
}: {
  frame: number;
  fps: number;
  messages: ChatMessage[];
  palette: Palette;
}) {
  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      {messages.map((msg, i) => (
        <MessageRow
          key={i}
          msg={msg}
          index={i}
          messages={messages}
          frame={frame}
          fps={fps}
          palette={palette}
        />
      ))}
    </div>
  );
}

function MessageRow({
  msg,
  index,
  messages,
  frame,
  fps,
  palette,
}: {
  msg: ChatMessage;
  index: number;
  messages: ChatMessage[];
  frame: number;
  fps: number;
  palette: Palette;
}) {
  const local = frame - msg.delay;
  if (local < 0) return null;
  const isTyping = local < msg.typingFrames;

  // Stack offset accumulates rows above this one (newer ones).
  let stackOffset = 0;
  for (let j = index + 1; j < messages.length; j++) {
    const newerLocal = frame - messages[j]!.delay;
    if (newerLocal < 0) continue;
    const progress = spring({
      frame: newerLocal,
      fps,
      config: { damping: 20, stiffness: 120, mass: 0.7 },
    });
    // Tight gap if the newer message is on the same side as the row above it.
    const sameSide = messages[j]!.side === messages[j - 1]?.side;
    stackOffset +=
      progress * (sameSide ? TIGHT_GAP + ROW_SHIFT * 0.55 : ROW_SHIFT);
  }

  const bottom = BASE_BOTTOM + stackOffset;
  const groupPos = getGroupPos(messages, index, frame);

  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left: SIDE_PADDING,
        right: SIDE_PADDING,
        display: "flex",
        justifyContent: msg.side === "right" ? "flex-end" : "flex-start",
        willChange: "transform",
      }}
    >
      {isTyping ? (
        <TypingBubble
          side={msg.side}
          localFrame={local}
          palette={palette}
          showTail
        />
      ) : (
        <BubbleView
          side={msg.side}
          text={msg.text}
          localFrame={local - msg.typingFrames}
          fps={fps}
          palette={palette}
          groupPos={groupPos}
        />
      )}
    </div>
  );
}

function radiiFor(side: ChatMessage["side"], pos: GroupPos): string {
  // Match gaia-ui message-bubble.css: 20px corners, tight 5px on stacking side
  // for grouped middle/first/last (not the last bubble's tail-side bottom).
  const R = 36; // scaled up for 1920×1080
  const T = 12; // tight corner radius
  if (side === "left") {
    // from-them — tight corners on bottom-left side
    if (pos === "only") return `${R}px ${R}px ${R}px ${R}px`;
    if (pos === "first") return `${R}px ${R}px ${R}px ${T}px`;
    if (pos === "middle") return `${T}px ${R}px ${R}px ${T}px`;
    return `${T}px ${R}px ${R}px ${R}px`; // last
  }
  // from-me — tight corners on bottom-right side
  if (pos === "only") return `${R}px ${R}px ${R}px ${R}px`;
  if (pos === "first") return `${R}px ${R}px ${T}px ${R}px`;
  if (pos === "middle") return `${R}px ${T}px ${T}px ${R}px`;
  return `${R}px ${T}px ${R}px ${R}px`; // last
}

function BubbleView({
  side,
  text,
  localFrame,
  fps,
  palette,
  groupPos,
}: {
  side: ChatMessage["side"];
  text: string;
  localFrame: number;
  fps: number;
  palette: Palette;
  groupPos: GroupPos;
}) {
  const pop = spring({
    frame: localFrame,
    fps,
    config: { damping: 11, stiffness: 170, mass: 0.55 },
  });
  const isRight = side === "right";
  const bubbleColor = isRight ? palette.sentBg : palette.receivedBg;
  const textColor = isRight ? palette.sentText : palette.receivedText;
  // Tail only on "only" and "last" bubbles.
  const showTail = groupPos === "only" || groupPos === "last";

  return (
    <div
      style={{
        position: "relative",
        background: bubbleColor,
        color: textColor,
        padding: "18px 32px",
        borderRadius: radiiFor(side, groupPos),
        maxWidth: "60%",
        fontSize: 38,
        fontWeight: 400,
        lineHeight: 1.28,
        letterSpacing: "-0.005em",
        opacity: pop,
        transform: `scale(${0.7 + pop * 0.3})`,
        transformOrigin: isRight ? "bottom right" : "bottom left",
        willChange: "transform, opacity",
        wordWrap: "break-word",
        whiteSpace: "pre-wrap",
      }}
    >
      {text}
      {showTail ? (
        <BubbleTail
          side={side}
          bubbleColor={bubbleColor}
          bgColor={palette.bg}
        />
      ) : null}
    </div>
  );
}

function TypingBubble({
  side,
  localFrame,
  palette,
  showTail,
}: {
  side: ChatMessage["side"];
  localFrame: number;
  palette: Palette;
  showTail: boolean;
}) {
  const isRight = side === "right";
  return (
    <div
      style={{
        position: "relative",
        background: palette.receivedBg,
        padding: "26px 36px",
        borderRadius: 40,
        display: "flex",
        gap: 14,
        alignItems: "center",
        transformOrigin: isRight ? "bottom right" : "bottom left",
        willChange: "transform, opacity",
      }}
    >
      {[0, 1, 2].map((i) => {
        const phase = (localFrame + i * 5) / 7;
        const yBob = Math.sin(phase) * 5;
        const dotOpacity = 0.5 + Math.sin(phase) * 0.3;
        return (
          <span
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: palette.mutedText,
              transform: `translateY(${-Math.abs(yBob)}px)`,
              opacity: dotOpacity,
            }}
          />
        );
      })}
      {showTail ? (
        <BubbleTail
          side={side}
          bubbleColor={palette.receivedBg}
          bgColor={palette.bg}
        />
      ) : null}
    </div>
  );
}

// Pseudo-element tail re-creation per gaia-ui CSS rules (left: -7px / right: -7px etc.)
function BubbleTail({
  side,
  bubbleColor,
  bgColor,
}: {
  side: ChatMessage["side"];
  bubbleColor: string;
  bgColor: string;
}) {
  const isRight = side === "right";
  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          height: 36,
          width: 40,
          backgroundColor: bubbleColor,
          ...(isRight
            ? { right: -14, borderBottomLeftRadius: "32px 28px" }
            : { left: -14, borderBottomRightRadius: 32 }),
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          height: 36,
          width: 52,
          backgroundColor: bgColor,
          ...(isRight
            ? { right: -52, borderBottomLeftRadius: 20 }
            : { left: -52, borderBottomRightRadius: 20 }),
        }}
      />
    </>
  );
}
