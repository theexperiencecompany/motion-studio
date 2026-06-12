import type { CompositionInfo } from "../../schema";
import type { LineChartProps } from "./LineChart";

export const lineChartDefaultProps: LineChartProps = {
  title: "Revenue",
  caption: "Last 12 weeks · USD",
  labels: "W1, W2, W3, W4, W5, W6, W7, W8, W9, W10, W11, W12",
  values: "12, 18, 24, 22, 31, 38, 44, 49, 55, 62, 71, 88",
  showAxes: true,
  showGrid: true,
  showDots: true,
};

export const lineChartInfo: CompositionInfo<LineChartProps> = {
  id: "LineChart",
  category: "data",
  agentNotes:
    "Animated line chart with axis labels. Use for trend / growth / time-series reveals as the result beat. data is an array of points (~5–8 is ideal — too many gets noisy). Title prop sells the takeaway ('Active users, last 30 days').",
  title: "Line Chart",
  description:
    "A smooth line chart that draws itself in left-to-right with springy data point dots and optional gridlines.",
  durationInFrames: 200,
  fps: 60,
  width: 1920,
  height: 1080,
  defaultProps: lineChartDefaultProps,
  fields: [
    { kind: "text", key: "title", label: "Title" },
    { kind: "text", key: "caption", label: "Caption" },
    { kind: "text", key: "labels", label: "Labels (comma-separated)" },
    { kind: "text", key: "values", label: "Values (comma-separated)" },
    { kind: "switch", key: "showAxes", label: "Show axes" },
    { kind: "switch", key: "showGrid", label: "Show grid" },
    { kind: "switch", key: "showDots", label: "Show dots" },
  ],
};
