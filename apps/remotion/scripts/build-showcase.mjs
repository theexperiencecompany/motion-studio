#!/usr/bin/env node
/**
 * Build the landing-page showcase project: a tight, sales-oriented tour
 * through the library. Short clips, value-prop title cards between scenes,
 * different chat platforms shown back-to-back to demonstrate breadth.
 *
 * Output: apps/remotion/showcase-project.json (consumed by `remotion render`).
 */
import { writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..", "..", "..");

let nextId = 1;
const id = () => `clip-${nextId++}`;

function clip(compositionId, props, durationSec, transition = "fade") {
  return {
    id: id(),
    compositionId,
    props,
    durationInFrames: Math.round(durationSec * 60),
    transition: { kind: transition, durationInFrames: 14 },
  };
}

const project = {
  fps: 60,
  width: 1920,
  height: 1080,
  clips: [
    // ───────────────── COLD OPEN ─────────────────
    // Big bold pitch, then a fast marquee that establishes the value props.
    clip(
      "TitlePopup",
      { headline: "Motion Studio.", subtitle: "" },
      1.6,
      "none",
    ),
    clip(
      "PerspectiveMarquee",
      {
        items:
          "Cinematic, Copy-paste, Open source, 60+ scenes, Browser-rendered, MIT, Remotion, Typed, Composable, Zero-config",
        speedPxPerFrame: 3.2,
        perspective: 1200,
        rotateY: -28,
        rotateX: 8,
        fontSize: 168,
        fontWeight: 700,
        textTransform: "uppercase",
      },
      3,
      "fade",
    ),

    // ───────────────── THE PITCH ─────────────────
    clip(
      "TitleSlideUp",
      {
        headline: "60+ scenes.",
        subtitle: "Drop-in. Fully typed. Copy the source.",
      },
      2.4,
      "fade",
    ),

    // Terminal — show how easy install / render is
    clip(
      "Terminal",
      {
        title: "~/projects/launch-reel",
        prompt: "❯",
        lines: [
          { kind: "comment", text: "# 1 — one dependency" },
          { kind: "command", text: "npm install remotion" },
          { kind: "success", text: "ready in 3.2s" },
          { kind: "comment", text: "" },
          { kind: "comment", text: "# 2 — render in the browser" },
          { kind: "command", text: "open localhost:3000/studio" },
          { kind: "output", text: "encoding @ 60fps via WebCodecs..." },
          { kind: "success", text: "shipped" },
        ],
        charactersPerSecond: 36,
        lineGap: 6,
        chromeStyle: "mac",
        cursorStyle: "block",
        fontSize: 26,
        paddingX: 32,
        paddingY: 28,
        cornerRadius: 16,
        successColor: "#10b981",
        outputOpacity: 0.62,
        commentOpacity: 0.4,
        showShadow: true,
        maxWidth: 1280,
      },
      5.4,
      "fade",
    ),

    // ───────────────── DATA STORYTELLING ─────────────────
    clip(
      "TitleFade",
      {
        headline: "Tell stories with data.",
        subtitle: "Charts that animate themselves.",
      },
      1.8,
      "swipe-up",
    ),
    clip(
      "BarChart",
      {
        title: "Monthly active users",
        caption: "Past 6 months · in thousands",
        labels: "Jan, Feb, Mar, Apr, May, Jun",
        values: "42, 58, 49, 73, 84, 96",
        showAxes: true,
        showGrid: true,
        showValues: true,
      },
      2.4,
      "fade",
    ),
    clip(
      "RadialChart",
      {
        title: "Conversion lift",
        caption: "Q4 target reached",
        label: "of monthly goal",
        value: 84,
        max: 100,
        unit: "%",
      },
      2.0,
      "zoom-in",
    ),
    clip(
      "StatCounter",
      { target: 12847, label: "developers shipping", prefix: "", suffix: "+" },
      2.0,
      "fade",
    ),
    clip(
      "AreaChart",
      {
        title: "Signups",
        caption: "Last 8 weeks",
        labels: "W1, W2, W3, W4, W5, W6, W7, W8",
        values: "120, 145, 132, 168, 195, 224, 270, 312",
        showAxes: true,
        showGrid: true,
      },
      2.2,
      "swipe-right",
    ),

    // ───────────────── BRAND-FAITHFUL SOCIAL ─────────────────
    clip(
      "TitlePopup",
      {
        headline: "Pixel-faithful UI.",
        subtitle: "Tweet, GitHub, every chat platform.",
      },
      1.8,
      "fade",
    ),
    clip(
      "GitHubStarButton",
      {
        owner: "theexperiencecompany",
        repo: "motion-studio",
        startCount: 1240,
        endCount: 1872,
        theme: "light",
      },
      2.6,
      "zoom-out",
    ),
    clip(
      "TweetCard",
      {
        displayName: "Motion Studio",
        handle: "@motionstudio",
        avatarUrl: "https://github.com/theexperiencecompany.png?size=200",
        verified: "yes",
        text:
          "shipped: 60+ Remotion scenes, in-browser MP4 export, fully typed.\n\nopen source. MIT.",
        timestamp: "10:30 PM · Today",
        replies: 84,
        retweets: 412,
        likes: 1893,
        views: 84200,
        theme: "light",
        backgroundColor: "#ffffff",
      },
      3.0,
      "swipe-down",
    ),

    // ───────────────── CHAT — show platform breadth ─────────────────
    clip(
      "TitleType",
      {
        headline: "Every chat. Every brand.",
        subtitle: "iMessage. WhatsApp. Telegram. Slack. Discord.",
      },
      2.4,
      "fade",
    ),
    clip(
      "MessageBubbles",
      {
        contactName: "design",
        contactAvatar: "https://github.com/theexperiencecompany.png",
        messages: [
          { text: "saw the new reel?", side: "left", typingFrames: 45, delay: 24 },
          { text: "yeah just rendered in browser 🔥", side: "right", typingFrames: 50, delay: 130 },
          { text: "how long did it take?", side: "left", typingFrames: 45, delay: 240 },
          { text: "12 seconds", side: "right", typingFrames: 30, delay: 340 },
        ],
        theme: "light",
      },
      4.2,
      "fade",
    ),
    clip(
      "WhatsAppMessages",
      {
        contactName: "shipping",
        contactAvatar: "https://github.com/theexperiencecompany.png",
        messages: [
          { text: "is it really open source?", side: "left", typingFrames: 45, delay: 24 },
          { text: "MIT licensed", side: "right", typingFrames: 30, delay: 130 },
          { text: "zero servers, zero SDK", side: "right", typingFrames: 45, delay: 230 },
          { text: "you're kidding", side: "left", typingFrames: 35, delay: 340 },
        ],
        theme: "light",
      },
      4.2,
      "swipe-left",
    ),
    clip(
      "TelegramMessages",
      {
        contactName: "launch",
        contactAvatar: "https://github.com/theexperiencecompany.png",
        messages: [
          { text: "demo's recorded", side: "left", typingFrames: 40, delay: 24 },
          { text: "via the browser?", side: "right", typingFrames: 35, delay: 130 },
          { text: "WebCodecs + mp4-muxer", side: "left", typingFrames: 50, delay: 240 },
          { text: "no FFmpeg needed 🎉", side: "right", typingFrames: 45, delay: 350 },
        ],
        theme: "light",
      },
      4.2,
      "swipe-left",
    ),
    clip(
      "SlackMessages",
      {
        contactName: "general",
        messages: [
          { text: "ship motion studio v1?", side: "left", typingFrames: 45, delay: 24 },
          { text: "lgtm 🚀", side: "right", typingFrames: 30, delay: 130 },
          { text: "60+ scenes, all typed", side: "left", typingFrames: 45, delay: 230 },
          { text: "merging now", side: "right", typingFrames: 35, delay: 340 },
        ],
        theme: "light",
      },
      4.2,
      "swipe-left",
    ),
    clip(
      "DiscordMessages",
      {
        contactName: "motion-studio",
        messages: [
          { text: "anyone tried the new charts?", side: "left", typingFrames: 50, delay: 24 },
          { text: "the radar one goes hard", side: "right", typingFrames: 45, delay: 140 },
          { text: "bar + line + area + pie + radial too", side: "left", typingFrames: 60, delay: 260 },
          { text: "all animated. all configurable.", side: "right", typingFrames: 55, delay: 380 },
        ],
        theme: "dark",
      },
      4.2,
      "swipe-left",
    ),

    // ───────────────── EXPORT ─────────────────
    clip(
      "TitleSlideUp",
      {
        headline: "Export in the browser.",
        subtitle: "WebCodecs + mp4-muxer. No servers. No SDK.",
      },
      2.4,
      "fade",
    ),
    clip(
      "Toast",
      {
        title: "Render complete",
        description: "Your MP4 is ready to download.",
        position: "bottom-right",
        variant: "success",
        showIcon: true,
        durationVisibleSec: 2.4,
      },
      2.6,
      "swipe-up",
    ),

    // ───────────────── CLOSE ─────────────────
    clip(
      "TextMaskRevealUp",
      {
        headline: "Open source.\nForever.",
        subtitle: "MIT licensed.",
      },
      2.2,
      "fade",
    ),
    clip(
      "TitleSlideUp",
      {
        headline: "Ship the reel.",
        subtitle: "motion-studio.heygaia.io",
      },
      2.4,
      "zoom-in",
    ),
  ],
};

const target = join(repoRoot, "apps", "remotion", "showcase-project.json");
writeFileSync(target, JSON.stringify(project, null, 2), "utf-8");
const totalSeconds = project.clips.reduce(
  (s, c) => s + c.durationInFrames / 60,
  0,
);
console.log(`Wrote ${project.clips.length} clips → ${target}`);
console.log(`Duration: ${totalSeconds.toFixed(1)}s @ 60fps`);
