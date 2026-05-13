"use client";
import {
  AbsoluteFill,
  Img,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ChatMessage } from "../../editors/types";

export type TelegramMessagesProps = {
  contactName: string;
  contactAvatar?: string;
  messages: ChatMessage[];
  theme: "light" | "dark";
};

const ROW_GAP = 18;
const BOTTOM_PADDING = 60;
const HEADER_HEIGHT = 140;
const SIDE_PADDING = 90;

type Palette = {
  bg: string;
  wallpaper: string;
  wallpaperDot: string;
  headerBg: string;
  headerBorder: string;
  headerText: string;
  headerSub: string;
  receivedBg: string;
  sentBg: string;
  receivedText: string;
  sentText: string;
  receivedMeta: string;
  sentMeta: string;
  bubbleShadow: string;
  dot: string;
  check: string;
};

function getPalette(theme: "light" | "dark"): Palette {
  if (theme === "dark") {
    return {
      bg: "#0E1621",
      wallpaper: "#0E1621",
      wallpaperDot: "rgba(255,255,255,0.04)",
      headerBg: "#17212B",
      headerBorder: "rgba(255,255,255,0.06)",
      headerText: "#FFFFFF",
      headerSub: "rgba(255,255,255,0.55)",
      receivedBg: "#182533",
      sentBg: "#2B5278",
      receivedText: "#FFFFFF",
      sentText: "#FFFFFF",
      receivedMeta: "rgba(255,255,255,0.5)",
      sentMeta: "rgba(195,224,255,0.85)",
      bubbleShadow: "0 1px 2px rgba(0,0,0,0.3)",
      dot: "rgba(255,255,255,0.55)",
      check: "#6FB0E6",
    };
  }
  return {
    bg: "#E6EBEE",
    wallpaper: "#E6EBEE",
    wallpaperDot: "rgba(60,90,120,0.07)",
    headerBg: "#FFFFFF",
    headerBorder: "rgba(0,0,0,0.08)",
    headerText: "#000000",
    headerSub: "rgba(0,0,0,0.55)",
    receivedBg: "#FFFFFF",
    sentBg: "#EFFDDE", // Light Telegram outgoing
    receivedText: "#000000",
    sentText: "#000000",
    receivedMeta: "rgba(0,0,0,0.45)",
    sentMeta: "rgba(0,120,30,0.7)",
    bubbleShadow: "0 1px 2px rgba(0,0,0,0.08)",
    dot: "rgba(0,0,0,0.45)",
    check: "#4FAE4E",
  };
}

export const TelegramMessages: React.FC<TelegramMessagesProps> = ({
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
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: palette.receivedText,
        overflow: "hidden",
      }}
    >
      {/* Subtle dot pattern wallpaper, Telegram-ish */}
      <AbsoluteFill
        style={{
          // eslint-disable-next-line @remotion/no-background-image -- intentional dot pattern
          backgroundImage: `radial-gradient(${palette.wallpaperDot} 1.6px, transparent 1.6px)`,
          backgroundSize: "32px 32px",
          opacity: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header
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
      </div>
    </AbsoluteFill>
  );
};

function Header({
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
        background: palette.headerBg,
        borderBottom: `1px solid ${palette.headerBorder}`,
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        gap: 22,
        opacity: enter,
        transform: `translateY(${(1 - enter) * -8}px)`,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          overflow: "hidden",
          background: "linear-gradient(135deg, #2AABEE 0%, #229ED9 100%)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          fontWeight: 600,
          flexShrink: 0,
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
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: palette.headerText,
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: "-0.005em",
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </div>
        <div
          style={{
            color: palette.headerSub,
            fontSize: 22,
            marginTop: 4,
            fontWeight: 400,
          }}
        >
          online
        </div>
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
  const heights = messages.map((msg) => {
    const local = frame - msg.delay;
    if (local < 0) return 0;
    const isTyping = local < msg.typingFrames;
    return isTyping ? TYPING_BUBBLE_HEIGHT : estimateBubbleHeight(msg.text);
  });

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      {messages.map((msg, i) => (
        <MessageRow
          key={i}
          msg={msg}
          index={i}
          messages={messages}
          heights={heights}
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
  heights,
  frame,
  fps,
  palette,
}: {
  msg: ChatMessage;
  index: number;
  messages: ChatMessage[];
  heights: number[];
  frame: number;
  fps: number;
  palette: Palette;
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
      config: { damping: 24, stiffness: 130, mass: 0.7 },
    });
    stackOffset += progress * (heights[j]! + ROW_GAP);
  }

  const bottom = BOTTOM_PADDING + stackOffset;

  const next = messages[index + 1];
  const nextVisibleSameSide =
    next && frame >= next.delay && next.side === msg.side;
  const showTail = !nextVisibleSameSide;

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
          fps={fps}
          palette={palette}
        />
      ) : (
        <MessageBubble
          side={msg.side}
          text={msg.text}
          localFrame={local - msg.typingFrames}
          fps={fps}
          palette={palette}
          showTail={showTail}
        />
      )}
    </div>
  );
}

const TYPING_BUBBLE_HEIGHT = 88;

function estimateBubbleHeight(text: string): number {
  const charsPerLine = 36;
  const explicitNewlines = text.match(/\n/g)?.length ?? 0;
  const lines = Math.max(
    1,
    Math.ceil(text.length / charsPerLine) + explicitNewlines,
  );
  return 90 + (lines - 1) * 48;
}

function TypingBubble({
  side,
  localFrame,
  fps,
  palette,
}: {
  side: ChatMessage["side"];
  localFrame: number;
  fps: number;
  palette: Palette;
}) {
  const enter = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 170, mass: 0.6 },
  });
  const isRight = side === "right";
  return (
    <div
      style={{
        position: "relative",
        background: isRight ? palette.sentBg : palette.receivedBg,
        padding: "22px 28px",
        borderRadius: 18,
        borderBottomRightRadius: isRight ? 4 : 18,
        borderBottomLeftRadius: isRight ? 18 : 4,
        display: "flex",
        gap: 12,
        alignItems: "center",
        opacity: enter,
        transform: `scale(${0.85 + enter * 0.15})`,
        transformOrigin: isRight ? "bottom right" : "bottom left",
        boxShadow: palette.bubbleShadow,
      }}
    >
      <BubbleTail side={side} palette={palette} />
      {[0, 1, 2].map((i) => {
        const phase = (localFrame + i * 5) / 7;
        const yBob = Math.sin(phase) * 4;
        const dotOpacity = 0.45 + Math.sin(phase) * 0.3;
        return (
          <span
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: palette.dot,
              transform: `translateY(${-Math.abs(yBob)}px)`,
              opacity: dotOpacity,
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
  palette,
  showTail,
}: {
  side: ChatMessage["side"];
  text: string;
  localFrame: number;
  fps: number;
  palette: Palette;
  showTail: boolean;
}) {
  const pop = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.55 },
  });
  const isRight = side === "right";
  return (
    <div
      style={{
        position: "relative",
        background: isRight ? palette.sentBg : palette.receivedBg,
        color: isRight ? palette.sentText : palette.receivedText,
        padding: "16px 22px 22px",
        borderRadius: 18,
        borderBottomRightRadius: isRight && showTail ? 4 : 18,
        borderBottomLeftRadius: !isRight && showTail ? 4 : 18,
        maxWidth: "62%",
        minWidth: 140,
        fontSize: 34,
        fontWeight: 400,
        lineHeight: 1.32,
        letterSpacing: "-0.005em",
        opacity: pop,
        transform: `scale(${0.85 + pop * 0.15})`,
        transformOrigin: isRight ? "bottom right" : "bottom left",
        wordWrap: "break-word",
        boxShadow: palette.bubbleShadow,
      }}
    >
      {showTail ? <BubbleTail side={side} palette={palette} /> : null}
      <div
        style={{
          paddingRight: isRight ? 130 : 90,
          whiteSpace: "pre-wrap",
        }}
      >
        {text}
      </div>
      <div
        style={{
          position: "absolute",
          right: 18,
          bottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 20,
          color: isRight ? palette.sentMeta : palette.receivedMeta,
        }}
      >
        <span>14:32</span>
        {isRight ? <DoubleCheck color={palette.check} /> : null}
      </div>
    </div>
  );
}

function BubbleTail({
  side,
  palette,
}: {
  side: ChatMessage["side"];
  palette: Palette;
}) {
  const isRight = side === "right";
  const bubbleColor = isRight ? palette.sentBg : palette.receivedBg;
  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          height: 22,
          width: 24,
          backgroundColor: bubbleColor,
          ...(isRight
            ? { right: -9, borderBottomLeftRadius: "18px 16px" }
            : { left: -9, borderBottomRightRadius: 18 }),
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          height: 22,
          width: 30,
          backgroundColor: palette.bg,
          ...(isRight
            ? { right: -30, borderBottomLeftRadius: 12 }
            : { left: -30, borderBottomRightRadius: 12 }),
        }}
      />
    </>
  );
}

function DoubleCheck({ color }: { color: string }) {
  return (
    <svg width="28" height="18" viewBox="0 0 18 11" fill="none">
      <title>read</title>
      <path
        d="M1 6 L4 9 L10 2"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 9 L9 6 M9 9 L17 1"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
