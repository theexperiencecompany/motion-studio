import type { Metadata } from "next";
import { DragDropDemo } from "./drag-drop-demo";

export const metadata: Metadata = {
  title: "Drag & Drop Prototype",
  description:
    "Proof of concept: drag any motion-graphics composition around as a free-positioned overlay on the canvas.",
};

export default function DragDropPlaygroundPage() {
  return <DragDropDemo />;
}
