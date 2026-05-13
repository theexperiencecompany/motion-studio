"use client";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ChatMessage } from "../../editors/types";

export type SlackMessagesProps = {
  contactName: string;
  messages: ChatMessage[];
  theme: "light" | "dark";
};

const ROW_SHIFT = 180;
const BASE_BOTTOM = 140;
const SIDE_PADDING = 100;

const COLOR_LEFT = "#4A154B";
const COLOR_RIGHT = "#1264A3";

type Palette = {
  bg: string;
  border: string;
  hoverBg: string;
  channelText: string;
  channelHash: string;
  senderText: string;
  bodyText: string;
  metaText: string;
  typingText: string;
  typingDot: string;
  typingStrong: string;
  reactionBg: string;
  reactionText: string;
  reactionBorder: string;
};

function getPalette(theme: "light" | "dark"): Palette {
  if (theme === "dark") {
    return {
      bg: "#1A1D21",
      border: "rgba(255,255,255,0.08)",
      hoverBg: "rgba(255,255,255,0.04)",
      channelText: "#FFFFFF",
      channelHash: "#9A9B9D",
      senderText: "#FFFFFF",
      bodyText: "#D1D2D3",
      metaText: "#9A9B9D",
      typingText: "#9A9B9D",
      typingDot: "#9A9B9D",
      typingStrong: "#FFFFFF",
      reactionBg: "rgba(29,155,209,0.15)",
      reactionText: "#1D9BD1",
      reactionBorder: "rgba(29,155,209,0.35)",
    };
  }
  return {
    bg: "#FFFFFF",
    border: "#e8e8e8",
    hoverBg: "#F8F8F8",
    channelText: "#1d1c1d",
    channelHash: "#616061",
    senderText: "#1d1c1d",
    bodyText: "#1d1c1d",
    metaText: "#616061",
    typingText: "#616061",
    typingDot: "#616061",
    typingStrong: "#1d1c1d",
    reactionBg: "#E8F5FA",
    reactionText: "#1264A3",
    reactionBorder: "#B8DCEE",
  };
}

export const SlackMessages: React.FC<SlackMessagesProps> = ({
  contactName,
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
          "Lato, -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif",
        color: palette.bodyText,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header name={contactName} frame={frame} fps={fps} palette={palette} />
      <Conversation
        frame={frame}
        fps={fps}
        messages={messages}
        contactName={contactName}
        palette={palette}
      />
    </AbsoluteFill>
  );
};

function Header({
  name,
  frame,
  fps,
  palette,
}: {
  name: string;
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
        padding: "32px 48px",
        borderBottom: `1px solid ${palette.border}`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: enter,
        transform: `translateY(${(1 - enter) * -8}px)`,
      }}
    >
      <span
        style={{
          fontSize: 44,
          color: palette.channelHash,
          fontWeight: 400,
          marginRight: 4,
        }}
      >
        #
      </span>
      <span
        style={{
          fontSize: 42,
          fontWeight: 800,
          color: palette.channelText,
          letterSpacing: "-0.01em",
        }}
      >
        {name.toLowerCase().replace(/\s+/g, "-")}
      </span>
    </div>
  );
}

function Conversation({
  frame,
  fps,
  messages,
  contactName,
  palette,
}: {
  frame: number;
  fps: number;
  messages: ChatMessage[];
  contactName: string;
  palette: Palette;
}) {
  const last = messages[messages.length - 1];
  const lastLocal = last ? frame - last.delay : -1;
  const showTyping = last && lastLocal >= 0 && lastLocal < last.typingFrames;
  const typingName = last?.side === "right" ? "you" : contactName;

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
          contactName={contactName}
          palette={palette}
        />
      ))}
      {showTyping ? (
        <TypingIndicator
          name={typingName}
          frame={frame}
          fps={fps}
          palette={palette}
        />
      ) : null}
    </div>
  );
}

function MessageRow({
  msg,
  index,
  messages,
  frame,
  fps,
  contactName,
  palette,
}: {
  msg: ChatMessage;
  index: number;
  messages: ChatMessage[];
  frame: number;
  fps: number;
  contactName: string;
  palette: Palette;
}) {
  const local = frame - msg.delay;
  if (local < msg.typingFrames) return null;
  const localBubble = local - msg.typingFrames;

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
  const isRight = msg.side === "right";
  const senderName = isRight ? "you" : contactName;
  const accent = isRight ? COLOR_RIGHT : COLOR_LEFT;
  const isLatest = index === messages.length - 1;

  const pop = spring({
    frame: localBubble,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.55 },
  });

  // Highlight the currently-animating-in message subtly.
  const highlight = Math.max(0, Math.min(1, 1 - localBubble / 30));

  // Reaction appears 30 frames after bubble lands, only on every-other message.
  const showReaction = !isLatest && localBubble > 30 && index % 2 === 1;
  const reactionPop = spring({
    frame: Math.max(0, localBubble - 30),
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.5 },
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left: SIDE_PADDING,
        right: SIDE_PADDING,
        display: "flex",
        gap: 22,
        alignItems: "flex-start",
        opacity: pop,
        transform: `translateY(${(1 - pop) * 18}px)`,
        padding: "10px 16px",
        marginLeft: -16,
        marginRight: -16,
        background: `rgba(29,155,209,${highlight * 0.06})`,
        borderRadius: 8,
        transition: "background 200ms ease",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 10,
          background: accent,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          fontWeight: 700,
          flexShrink: 0,
          letterSpacing: "-0.01em",
        }}
      >
        {senderName.slice(0, 1).toUpperCase()}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 14,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: palette.senderText,
              letterSpacing: "-0.005em",
            }}
          >
            {senderName}
          </span>
          <span style={{ fontSize: 20, color: palette.metaText }}>
            Today at 14:32
          </span>
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: palette.bodyText,
            lineHeight: 1.35,
            wordWrap: "break-word",
          }}
        >
          {msg.text}
        </div>
        {showReaction ? (
          <div
            style={{
              marginTop: 14,
              display: "flex",
              gap: 8,
              opacity: reactionPop,
              transform: `scale(${0.7 + reactionPop * 0.3})`,
              transformOrigin: "left center",
            }}
          >
            <Reaction emoji="🎉" count={3} palette={palette} />
            <Reaction emoji="🚀" count={1} palette={palette} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Reaction({
  emoji,
  count,
  palette,
}: {
  emoji: string;
  count: number;
  palette: Palette;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: palette.reactionBg,
        border: `1px solid ${palette.reactionBorder}`,
        color: palette.reactionText,
        borderRadius: 18,
        padding: "6px 14px",
        fontSize: 22,
        fontWeight: 600,
      }}
    >
      <span style={{ fontSize: 24 }}>{emoji}</span>
      <span>{count}</span>
    </div>
  );
}

function TypingIndicator({
  name,
  frame,
  fps,
  palette,
}: {
  name: string;
  frame: number;
  fps: number;
  palette: Palette;
}) {
  const enter = spring({
    frame: frame - 2,
    fps,
    config: { damping: 14, stiffness: 160 },
  });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        left: SIDE_PADDING,
        right: SIDE_PADDING,
        display: "flex",
        gap: 10,
        alignItems: "center",
        opacity: enter,
        fontSize: 24,
        color: palette.typingText,
        fontStyle: "italic",
      }}
    >
      {[0, 1, 2].map((i) => {
        const phase = (frame + i * 5) / 7;
        const dotOpacity = 0.45 + Math.sin(phase) * 0.3;
        return (
          <span
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: palette.typingDot,
              opacity: dotOpacity,
            }}
          />
        );
      })}
      <span style={{ marginLeft: 6 }}>
        <strong style={{ color: palette.typingStrong, fontWeight: 700 }}>
          {name}
        </strong>{" "}
        is typing
      </span>
    </div>
  );
}
