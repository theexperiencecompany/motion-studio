"use client";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ChatMessage } from "../../editors/types";

export type MessageBubblesProps = {
  contactName: string;
  messages: ChatMessage[];
};

export const MessageBubbles: React.FC<MessageBubblesProps> = ({
  contactName,
  messages,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: "#ffffff",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif",
        color: "#0f1014",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ChatHeader name={contactName} frame={frame} fps={fps} />
      <Conversation frame={frame} fps={fps} messages={messages} />
    </AbsoluteFill>
  );
};

function ChatHeader({
  name,
  frame,
  fps,
}: {
  name: string;
  frame: number;
  fps: number;
}) {
  const enter = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 90 },
  });

  return (
    <div
      style={{
        padding: "48px 0 28px",
        borderBottom: "1px solid rgba(15,16,20,0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity: enter,
        transform: `translateY(${(1 - enter) * -8}px)`,
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          fontWeight: 600,
          letterSpacing: "-0.01em",
        }}
      >
        {name.slice(0, 1).toUpperCase()}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: "#0f1014",
          letterSpacing: "-0.01em",
        }}
      >
        {name}
      </div>
    </div>
  );
}

const ROW_SHIFT = 85;
const BASE_BOTTOM = 80;
const SIDE_PADDING = 100;

function Conversation({
  frame,
  fps,
  messages,
}: {
  frame: number;
  fps: number;
  messages: ChatMessage[];
}) {
  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {messages.map((msg, i) => (
        <MessageRow
          key={i}
          msg={msg}
          index={i}
          messages={messages}
          frame={frame}
          fps={fps}
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
}: {
  msg: ChatMessage;
  index: number;
  messages: ChatMessage[];
  frame: number;
  fps: number;
}) {
  const local = frame - msg.delay;
  if (local < 0) return null;

  const isTyping = local < msg.typingFrames;

  let stackOffset = 0;
  for (let j = index + 1; j < messages.length; j++) {
    const newerLocal = frame - messages[j]!.delay;
    if (newerLocal < 0) continue;
    const progress = spring({
      frame: newerLocal,
      fps,
      config: { damping: 20, stiffness: 120, mass: 0.7 },
    });
    stackOffset += progress;
  }

  const bottom = BASE_BOTTOM + stackOffset * ROW_SHIFT;

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
        <TypingBubble side={msg.side} localFrame={local} fps={fps} />
      ) : (
        <MessageBubble
          side={msg.side}
          text={msg.text}
          localFrame={local - msg.typingFrames}
          fps={fps}
        />
      )}
    </div>
  );
}

function TypingBubble({
  side,
  localFrame,
  fps,
}: {
  side: ChatMessage["side"];
  localFrame: number;
  fps: number;
}) {
  const enter = spring({
    frame: localFrame,
    fps,
    config: { damping: 13, stiffness: 160, mass: 0.6 },
  });

  return (
    <div
      style={{
        background: "#E9E9EB",
        padding: "22px 28px",
        borderRadius: 30,
        borderBottomLeftRadius: side === "left" ? 8 : 30,
        borderBottomRightRadius: side === "right" ? 8 : 30,
        display: "flex",
        gap: 12,
        alignItems: "center",
        opacity: enter,
        transform: `scale(${0.7 + enter * 0.3})`,
        transformOrigin: side === "left" ? "bottom left" : "bottom right",
        willChange: "transform, opacity",
      }}
    >
      {[0, 1, 2].map((i) => {
        const phase = (localFrame + i * 5) / 7;
        const yBob = Math.sin(phase) * 4;
        const dotOpacity = 0.5 + Math.sin(phase) * 0.3;
        return (
          <span
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "rgba(60,60,67,0.55)",
              transform: `translateY(${-Math.abs(yBob)}px)`,
              opacity: dotOpacity,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </div>
  );
}

function MessageBubble({
  side,
  text,
  localFrame,
  fps,
}: {
  side: ChatMessage["side"];
  text: string;
  localFrame: number;
  fps: number;
}) {
  const pop = spring({
    frame: localFrame,
    fps,
    config: { damping: 11, stiffness: 170, mass: 0.55 },
  });

  const isRight = side === "right";

  return (
    <div
      style={{
        background: isRight ? "#007AFF" : "#E9E9EB",
        color: isRight ? "#ffffff" : "#0f1014",
        padding: "18px 26px",
        borderRadius: 30,
        borderBottomLeftRadius: isRight ? 30 : 8,
        borderBottomRightRadius: isRight ? 8 : 30,
        maxWidth: 720,
        fontSize: 32,
        fontWeight: 400,
        lineHeight: 1.3,
        letterSpacing: "-0.005em",
        opacity: pop,
        transform: `scale(${0.7 + pop * 0.3})`,
        transformOrigin: isRight ? "bottom right" : "bottom left",
        willChange: "transform, opacity",
        wordWrap: "break-word",
      }}
    >
      {text}
    </div>
  );
}
