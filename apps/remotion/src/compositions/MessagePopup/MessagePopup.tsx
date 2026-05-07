"use client";
import {
  AbsoluteFill,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";

const ICON_SRC = staticFile("message_icon.png");

export type MessagePopupProps = {
  sender: string;
  time: string;
  body: string;
};

const D_CARD = 0;
const D_SENDER = 14;
const D_TIME = 20;
const D_BODY_START = 30;
const WORD_STAGGER = 4;

const NOTIF_WIDTH = 1080;
const NOTIF_PADDING = 28;
const ICON_SIZE = 96;

export const MessagePopup: React.FC<MessagePopupProps> = ({
  sender,
  time,
  body,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: "#f4f4ef",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif",
        color: "#0f1014",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <NotificationBanner
          frame={frame}
          fps={fps}
          sender={sender}
          time={time}
          body={body}
        />
      </div>
    </AbsoluteFill>
  );
};

function NotificationBanner({
  frame,
  fps,
  sender,
  time,
  body,
}: {
  frame: number;
  fps: number;
  sender: string;
  time: string;
  body: string;
}) {
  const bodyWords = body.split(" ");

  const cardPop = spring({
    frame: frame - D_CARD,
    fps,
    config: { damping: 13, stiffness: 130, mass: 0.85 },
  });
  const cardScale = 0.85 + cardPop * 0.15;
  const cardOpacity = cardPop;
  const cardY = (1 - cardPop) * 24;

  return (
    <div
      style={{
        width: NOTIF_WIDTH,
        borderRadius: 32,
        background: "#ffffff",
        border: "1px solid rgba(15,16,20,0.05)",
        boxShadow:
          "0 30px 80px rgba(15,16,20,0.10), 0 4px 10px rgba(15,16,20,0.05)",
        padding: NOTIF_PADDING,
        display: "flex",
        gap: 22,
        alignItems: "center",
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        willChange: "transform, opacity",
      }}
    >
      <Img
        src={ICON_SRC}
        alt={sender}
        width={ICON_SIZE}
        height={ICON_SIZE}
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          borderRadius: 22,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 6,
          }}
        >
          <PopText frame={frame} fps={fps} delay={D_SENDER}>
            <span
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "#0f1014",
                letterSpacing: "-0.01em",
              }}
            >
              {sender}
            </span>
          </PopText>
          <PopText frame={frame} fps={fps} delay={D_TIME}>
            <span
              style={{
                fontSize: 24,
                color: "rgba(15,16,20,0.45)",
                fontWeight: 500,
              }}
            >
              {time}
            </span>
          </PopText>
        </div>

        <div
          style={{
            fontSize: 30,
            color: "#0f1014",
            fontWeight: 400,
            lineHeight: 1.3,
            letterSpacing: "-0.005em",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {bodyWords.map((word, i) => (
            <PopText
              key={i}
              frame={frame}
              fps={fps}
              delay={D_BODY_START + i * WORD_STAGGER}
            >
              <span style={{ display: "inline-block", marginRight: "0.28em" }}>
                {word}
              </span>
            </PopText>
          ))}
        </div>
      </div>
    </div>
  );
}

function PopText({
  frame,
  fps,
  delay,
  children,
}: {
  frame: number;
  fps: number;
  delay: number;
  children: React.ReactNode;
}) {
  const pop = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });

  const opacity = pop;
  const translateY = (1 - pop) * 18;
  const scale = 0.7 + pop * 0.3;

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: "center center",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </span>
  );
}
