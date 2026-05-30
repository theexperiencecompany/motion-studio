import type { CompositionInfo } from "../../schema";
import type { LogoCloudProps } from "./LogoCloud";

export const LOGO_CLOUD_DURATION = 100;
export const LOGO_CLOUD_FPS = 60;
export const LOGO_CLOUD_WIDTH = 1280;
export const LOGO_CLOUD_HEIGHT = 720;

export const logoCloudDefaultProps: LogoCloudProps = {
  headline: "Trusted by teams at",
  logos: [
    { name: "Vercel", url: "https://cdn.simpleicons.org/vercel/0f1014" },
    { name: "Linear", url: "https://cdn.simpleicons.org/linear/0f1014" },
    { name: "Stripe", url: "https://cdn.simpleicons.org/stripe/0f1014" },
    { name: "Notion", url: "https://cdn.simpleicons.org/notion/0f1014" },
    { name: "Figma", url: "https://cdn.simpleicons.org/figma/0f1014" },
  ],
  theme: "light",
};

export const logoCloudInfo: CompositionInfo<LogoCloudProps> = {
  id: "LogoCloud",
  category: "marketing",
  title: "Logo Cloud",
  description:
    "A 'trusted by' section with a row of company logos that stagger in.",
  durationInFrames: LOGO_CLOUD_DURATION,
  fps: LOGO_CLOUD_FPS,
  width: LOGO_CLOUD_WIDTH,
  height: LOGO_CLOUD_HEIGHT,
  defaultProps: logoCloudDefaultProps,
  fields: [
    { kind: "text", key: "headline", label: "Headline" },
    {
      kind: "select",
      key: "theme",
      label: "Theme",
      options: [
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
      ],
    },
    {
      kind: "imageList",
      key: "logos",
      label: "Logos",
      itemLabel: "Logo",
      max: 12,
    },
  ],
};
