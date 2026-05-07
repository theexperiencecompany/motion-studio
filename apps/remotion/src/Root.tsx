import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./compositions/Composition";
import {
  HeroDemo,
  HERO_DEMO_DURATION,
  HERO_DEMO_FPS,
  HERO_DEMO_WIDTH,
  HERO_DEMO_HEIGHT,
} from "./compositions/HeroDemo";
import {
  FollowerCelebration,
  FOLLOWER_DURATION,
  FOLLOWER_FPS,
  FOLLOWER_WIDTH,
  FOLLOWER_HEIGHT,
  calculateFollowerMetadata,
} from "./compositions/FollowerCelebration";
import {
  IntroText,
  INTRO_TEXT_DURATION,
  INTRO_TEXT_FPS,
  INTRO_TEXT_WIDTH,
  INTRO_TEXT_HEIGHT,
} from "./compositions/IntroText";
import {
  BrowserScroll,
  BROWSER_SCROLL_DURATION,
  BROWSER_SCROLL_FPS,
  BROWSER_SCROLL_WIDTH,
  BROWSER_SCROLL_HEIGHT,
} from "./compositions/BrowserScroll";
import { compositions } from "./registry";
import { componentsById } from "./components";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {compositions.map((c) => (
        <Composition
          key={c.id}
          id={c.id}
          component={componentsById[c.id]!}
          durationInFrames={c.durationInFrames}
          fps={c.fps}
          width={c.width}
          height={c.height}
          defaultProps={c.defaultProps}
        />
      ))}
      <Composition
        id="BrowserScroll"
        component={BrowserScroll}
        durationInFrames={BROWSER_SCROLL_DURATION}
        fps={BROWSER_SCROLL_FPS}
        width={BROWSER_SCROLL_WIDTH}
        height={BROWSER_SCROLL_HEIGHT}
        defaultProps={{
          imageFile: "page.png",
          pageHeight: 2400,
        }}
      />
      <Composition
        id="IntroText"
        component={IntroText}
        durationInFrames={INTRO_TEXT_DURATION}
        fps={INTRO_TEXT_FPS}
        width={INTRO_TEXT_WIDTH}
        height={INTRO_TEXT_HEIGHT}
      />
      <Composition
        id="FollowerCelebration"
        component={FollowerCelebration}
        durationInFrames={FOLLOWER_DURATION}
        fps={FOLLOWER_FPS}
        width={FOLLOWER_WIDTH}
        height={FOLLOWER_HEIGHT}
        defaultProps={{
          username: "t3dotgg",
          userAvatarUrl: "https://github.com/t3dotgg.png?size=200",
          followerCount: 0,
          followers: [],
        }}
        calculateMetadata={calculateFollowerMetadata}
      />
      <Composition
        id="HeroDemo"
        component={HeroDemo}
        durationInFrames={HERO_DEMO_DURATION}
        fps={HERO_DEMO_FPS}
        width={HERO_DEMO_WIDTH}
        height={HERO_DEMO_HEIGHT}
      />
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
