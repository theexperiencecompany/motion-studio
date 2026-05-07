export type ChatMessage = {
  text: string;
  side: "left" | "right";
  delay: number;
  typingFrames: number;
};
