"use client";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ChatMessage } from "../../editors/types";

export type DiscordMessagesProps = {
  contactName: string;
  messages: ChatMessage[];
  theme: "light" | "dark";
};

const ROW_SHIFT = 180;
const BASE_BOTTOM = 140;
const SIDE_PADDING = 100;

// Discord username gradient colors (role gradient).
const COLOR_LEFT_GRAD = "linear-gradient(90deg, #5865F2, #EB459E)";
const COLOR_RIGHT_GRAD = "linear-gradient(90deg, #FAA61A, #ED4245)";
const COLOR_LEFT_SOLID = "#5865F2";
const COLOR_RIGHT_SOLID = "#FAA61A";

type Palette = {
  bg: string;
  headerBg: string;
  headerBorder: string;
  channelHash: string;
  channelText: string;
  bodyText: string;
  metaText: string;
  typingText: string;
  typingDot: string;
  typingStrong: string;
  reactionBg: string;
  reactionBorder: string;
  reactionText: string;
  botTagBg: string;
};

function getPalette(theme: "light" | "dark"): Palette {
  if (theme === "light") {
    return {
      bg: "#FFFFFF",
      headerBg: "#F2F3F5",
      headerBorder: "#E3E5E8",
      channelHash: "#6D6F78",
      channelText: "#060607",
      bodyText: "#2E3338",
      metaText: "#5C5E66",
      typingText: "#5C5E66",
      typingDot: "#5C5E66",
      typingStrong: "#060607",
      reactionBg: "#E3E5E8",
      reactionBorder: "#D4D6D9",
      reactionText: "#4F5660",
      botTagBg: "#5865F2",
    };
  }
  return {
    bg: "#313338",
    headerBg: "#2b2d31",
    headerBorder: "#1f2023",
    channelHash: "#80848e",
    channelText: "#f2f3f5",
    bodyText: "#dbdee1",
    metaText: "#80848e",
    typingText: "#b5bac1",
    typingDot: "#b5bac1",
    typingStrong: "#f2f3f5",
    reactionBg: "rgba(88,101,242,0.15)",
    reactionBorder: "rgba(88,101,242,0.4)",
    reactionText: "#dbdee1",
    botTagBg: "#5865F2",
  };
}

export const DiscordMessages: React.FC<DiscordMessagesProps> = ({
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
        fontFamily: "'gg sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
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
        borderBottom: `1px solid ${palette.headerBorder}`,
        background: palette.headerBg,
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: enter,
        transform: `translateY(${(1 - enter) * -8}px)`,
        boxShadow: "0 1px 0 rgba(4,4,5,0.2)",
      }}
    >
      <span
        style={{
          fontSize: 50,
          color: palette.channelHash,
          fontWeight: 600,
          marginRight: 6,
        }}
      >
        #
      </span>
      <span
        style={{
          fontSize: 40,
          fontWeight: 700,
          color: palette.channelText,
          letterSpacing: "-0.005em",
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
  const accentSolid = isRight ? COLOR_RIGHT_SOLID : COLOR_LEFT_SOLID;
  const accentGrad = isRight ? COLOR_RIGHT_GRAD : COLOR_LEFT_GRAD;
  const isBot = !isRight;
  const isLatest = index === messages.length - 1;

  const pop = spring({
    frame: localBubble,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.55 },
  });

  const showReaction = isLatest && localBubble > 30;
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
        gap: 24,
        alignItems: "flex-start",
        opacity: pop,
        transform: `translateY(${(1 - pop) * 18}px)`,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: accentSolid,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {senderName.slice(0, 1).toUpperCase()}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 34,
              fontWeight: 700,
              background: accentGrad,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.005em",
            }}
          >
            {senderName}
          </span>
          {isBot ? (
            <span
              style={{
                background: palette.botTagBg,
                color: "#fff",
                fontSize: 16,
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: 4,
                lineHeight: 1,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              BOT
            </span>
          ) : null}
          <span style={{ fontSize: 20, color: palette.metaText }}>
            Today at 14:32
          </span>
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: palette.bodyText,
            lineHeight: 1.375,
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
              gap: 10,
              opacity: reactionPop,
              transform: `scale(${0.7 + reactionPop * 0.3})`,
              transformOrigin: "left center",
            }}
          >
            <Reaction emoji="🔥" count={4} palette={palette} />
            <Reaction emoji="👀" count={2} palette={palette} />
            <Reaction emoji="🎮" count={3} palette={palette} />
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
        borderRadius: 10,
        padding: "5px 12px",
        fontSize: 22,
        fontWeight: 600,
      }}
    >
      <span style={{ fontSize: 26 }}>{emoji}</span>
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
        fontSize: 22,
        color: palette.typingText,
      }}
    >
      {[0, 1, 2].map((i) => {
        const phase = (frame + i * 5) / 7;
        const yBob = Math.sin(phase) * 3;
        return (
          <span
            key={i}
            style={{
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: palette.typingDot,
              transform: `translateY(${-Math.abs(yBob)}px)`,
              opacity: 0.7,
            }}
          />
        );
      })}
      <span style={{ marginLeft: 6 }}>
        <strong style={{ color: palette.typingStrong, fontWeight: 600 }}>
          {name}
        </strong>{" "}
        is typing…
      </span>
    </div>
  );
}
