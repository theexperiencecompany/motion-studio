export type ChatMessage = {
  text: string;
  side: "left" | "right";
  delay: number;
  typingFrames: number;
  /**
   * Optional image attachment (data URL or static asset path). When set the
   * message renders as an iMessage photo bubble — the image masked into the
   * same curved-tail shape as a text bubble — and `text` is ignored.
   */
  image?: string;
};
