"use client";
import {
  AbsoluteFill,
  Img,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ChatMessage } from "../../editors/types";

export type WhatsAppMessagesProps = {
  contactName: string;
  contactAvatar?: string;
  messages: ChatMessage[];
  theme: "light" | "dark";
};

const ROW_GAP = 22;
const BOTTOM_PADDING = 60;
const COMPOSER_HEIGHT = 120;
const HEADER_HEIGHT = 144;
const SIDE_PADDING = 80;

type Palette = {
  bg: string;
  headerBg: string;
  headerBorder: string;
  headerText: string;
  headerSub: string;
  headerIcon: string;
  receivedBg: string;
  sentBg: string;
  bubbleText: string;
  bubbleMeta: string;
  bubbleShadow: string;
  composerBg: string;
  composerInputBg: string;
  composerIcon: string;
  composerPlaceholder: string;
  dot: string;
  check: string;
};

function getPalette(theme: "light" | "dark"): Palette {
  if (theme === "dark") {
    return {
      bg: "#0B141A",
      headerBg: "#202C33",
      headerBorder: "rgba(255,255,255,0.06)",
      headerText: "#E9EDEF",
      headerSub: "rgba(233,237,239,0.6)",
      headerIcon: "rgba(233,237,239,0.7)",
      receivedBg: "#202C33",
      sentBg: "#005C4B",
      bubbleText: "#E9EDEF",
      bubbleMeta: "rgba(233,237,239,0.6)",
      bubbleShadow: "0 1px 0.5px rgba(0,0,0,0.35)",
      composerBg: "#202C33",
      composerInputBg: "#2A3942",
      composerIcon: "rgba(233,237,239,0.55)",
      composerPlaceholder: "rgba(233,237,239,0.45)",
      dot: "rgba(233,237,239,0.55)",
      check: "#53BDEB",
    };
  }
  return {
    bg: "#EFE7DD",
    headerBg: "#F0F2F5",
    headerBorder: "rgba(0,0,0,0.08)",
    headerText: "#111B21",
    headerSub: "rgba(17,27,33,0.55)",
    headerIcon: "rgba(17,27,33,0.55)",
    receivedBg: "#FFFFFF",
    sentBg: "#DCF8C6",
    bubbleText: "#111B21",
    bubbleMeta: "rgba(17,27,33,0.5)",
    bubbleShadow: "0 1px 0.5px rgba(11,20,26,0.13)",
    composerBg: "#F0F2F5",
    composerInputBg: "#FFFFFF",
    composerIcon: "rgba(17,27,33,0.55)",
    composerPlaceholder: "rgba(17,27,33,0.4)",
    dot: "rgba(17,27,33,0.45)",
    check: "#53BDEB",
  };
}

const WALLPAPER_URL = staticFile("whatsapp-tile-dark.png");

export const WhatsAppMessages: React.FC<WhatsAppMessagesProps> = ({
  contactName,
  contactAvatar = "https://github.com/aryanranderiya.png",
  messages,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palette = getPalette(theme);
  const isDark = theme === "dark";

  return (
    <AbsoluteFill
      style={{
        background: palette.bg,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: palette.bubbleText,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          // eslint-disable-next-line @remotion/no-background-image -- intentional tiled wallpaper
          backgroundImage: `url(${WALLPAPER_URL})`,
          backgroundSize: "720px 1308px",
          backgroundRepeat: "repeat",
          opacity: isDark ? 0.6 : 0.18,
          filter: isDark ? undefined : "invert(1)",
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
        <Composer palette={palette} />
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
  avatar: string;
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
        gap: 24,
        opacity: enter,
        transform: `translateY(${(1 - enter) * -8}px)`,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: "50%",
          overflow: "hidden",
          background:
            "conic-gradient(from 210deg, #6e7c84 0deg, #2a3942 120deg, #6e7c84 240deg, #2a3942 360deg)",
          flexShrink: 0,
        }}
      >
        <Img
          src={avatar}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: palette.headerText,
            fontSize: 34,
            fontWeight: 500,
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

function Composer({ palette }: { palette: Palette }) {
  return (
    <div
      style={{
        height: COMPOSER_HEIGHT,
        background: palette.composerBg,
        padding: "0 28px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          flex: 1,
          height: 70,
          borderRadius: 36,
          background: palette.composerInputBg,
          display: "flex",
          alignItems: "center",
          padding: "0 26px",
          gap: 16,
          color: palette.composerPlaceholder,
          fontSize: 24,
        }}
      >
        Type a message
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

  // Tail only on the most-recent bubble of each side run.
  const next = messages[index + 1];
  const nextVisible = next && frame >= next.delay && next.side === msg.side;
  const showTail = !nextVisible;

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

const TYPING_BUBBLE_HEIGHT = 92;

function estimateBubbleHeight(text: string): number {
  const charsPerLine = 38;
  const explicitNewlines = text.match(/\n/g)?.length ?? 0;
  const lines = Math.max(
    1,
    Math.ceil(text.length / charsPerLine) + explicitNewlines,
  );
  return 84 + (lines - 1) * 50;
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
        borderRadius: 14,
        borderBottomRightRadius: isRight ? 0 : 14,
        borderBottomLeftRadius: isRight ? 14 : 0,
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
        color: palette.bubbleText,
        padding: "14px 22px 18px",
        borderRadius: 14,
        borderBottomRightRadius: isRight && showTail ? 0 : 14,
        borderBottomLeftRadius: !isRight && showTail ? 0 : 14,
        maxWidth: "62%",
        minWidth: 140,
        fontSize: 34,
        fontWeight: 400,
        lineHeight: 1.35,
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
          paddingRight: isRight ? 110 : 80,
          whiteSpace: "pre-wrap",
        }}
      >
        {text}
      </div>
      <div
        style={{
          position: "absolute",
          right: 18,
          bottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 20,
          color: palette.bubbleMeta,
        }}
      >
        <span>now</span>
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
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 9 L9 6 M9 9 L17 1"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
