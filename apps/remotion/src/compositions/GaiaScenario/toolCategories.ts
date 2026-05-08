// Predefined GAIA tool categories — mirrors libs/shared/ts/src/icons/
// tool-icon-config.ts from the GAIA repo. Used by the right-sidebar
// tool_calls editor to render labelled selects with branded icons.
//
// `image` entries point at /images/icons/<file> assets copied from the
// GAIA app into apps/web/public. `huge` entries fall back to a HugeIcons
// glyph for category-level (non-integration) icons.

import {
  AlarmClockIcon,
  BodyPartMuscleIcon,
  Brain02Icon,
  CheckListIcon,
  ComputerTerminal01Icon,
  ConnectIcon,
  FileEmpty02Icon,
  FolderFileStorageIcon,
  Image02Icon,
  InformationCircleIcon,
  NotificationIcon,
  PackageOpenIcon,
  PuzzleIcon,
  SourceCodeCircleIcon,
  SquareArrowUpRight02Icon,
  Target02Icon,
  TaskDailyIcon,
  ToolsIcon,
  WorkflowCircle06Icon,
  ZapIcon,
} from "@hugeicons/core-free-icons";

export type ToolCategoryDef = {
  key: string;
  label: string;
} & (
  | { kind: "image"; src: string }
  | { kind: "huge"; icon: typeof ToolsIcon; iconClass: string }
);

// Order matters — most-used integrations first, then generic
// category icons. Wave spinner is NOT in this list — it's a loading
// indicator variant, not a tool category. The LoadingFields editor
// exposes it as a separate "indicator type" toggle.
export const TOOL_CATEGORIES: ToolCategoryDef[] = [
  // Integration icons (image-based)
  {
    key: "gmail",
    label: "Gmail",
    kind: "image",
    src: "/images/icons/gmail.svg",
  },
  {
    key: "google_calendar",
    label: "Google Calendar",
    kind: "image",
    src: "/images/icons/googlecalendar.webp",
  },
  {
    key: "todoist",
    label: "Todoist",
    kind: "image",
    src: "/images/icons/todoist.svg",
  },
  {
    key: "search",
    label: "Search",
    kind: "image",
    src: "/images/icons/google.svg",
  },
  {
    key: "googledocs",
    label: "Google Docs",
    kind: "image",
    src: "/images/icons/googledocs.webp",
  },
  {
    key: "googlesheets",
    label: "Google Sheets",
    kind: "image",
    src: "/images/icons/googlesheets.webp",
  },
  {
    key: "googletasks",
    label: "Google Tasks",
    kind: "image",
    src: "/images/icons/googletasks.svg",
  },
  {
    key: "googlemeet",
    label: "Google Meet",
    kind: "image",
    src: "/images/icons/googlemeet.svg",
  },
  {
    key: "google_maps",
    label: "Google Maps",
    kind: "image",
    src: "/images/icons/google_maps.svg",
  },
  {
    key: "weather",
    label: "Weather",
    kind: "image",
    src: "/images/icons/weather.webp",
  },
  {
    key: "notion",
    label: "Notion",
    kind: "image",
    src: "/images/icons/notion.webp",
  },
  {
    key: "twitter",
    label: "Twitter / X",
    kind: "image",
    src: "/images/icons/x.svg",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    kind: "image",
    src: "/images/icons/linkedin.svg",
  },
  {
    key: "github",
    label: "GitHub",
    kind: "image",
    src: "/images/icons/github.png",
  },
  {
    key: "reddit",
    label: "Reddit",
    kind: "image",
    src: "/images/icons/reddit.svg",
  },
  {
    key: "airtable",
    label: "Airtable",
    kind: "image",
    src: "/images/icons/airtable.svg",
  },
  {
    key: "linear",
    label: "Linear",
    kind: "image",
    src: "/images/icons/linear.svg",
  },
  {
    key: "slack",
    label: "Slack",
    kind: "image",
    src: "/images/icons/slack.svg",
  },
  {
    key: "hubspot",
    label: "HubSpot",
    kind: "image",
    src: "/images/icons/hubspot.svg",
  },
  {
    key: "microsoft_teams",
    label: "Microsoft Teams",
    kind: "image",
    src: "/images/icons/microsoft_teams.svg",
  },
  { key: "zoom", label: "Zoom", kind: "image", src: "/images/icons/zoom.svg" },
  {
    key: "asana",
    label: "Asana",
    kind: "image",
    src: "/images/icons/asana.svg",
  },
  {
    key: "trello",
    label: "Trello",
    kind: "image",
    src: "/images/icons/trello.svg",
  },
  {
    key: "instagram",
    label: "Instagram",
    kind: "image",
    src: "/images/icons/instagram.svg",
  },
  {
    key: "clickup",
    label: "ClickUp",
    kind: "image",
    src: "/images/icons/clickup.svg",
  },
  {
    key: "deepwiki",
    label: "DeepWiki",
    kind: "image",
    src: "/images/icons/deepwiki.webp",
  },
  {
    key: "context7",
    label: "Context7",
    kind: "image",
    src: "/images/icons/context7.png",
  },
  {
    key: "hackernews",
    label: "Hacker News",
    kind: "image",
    src: "/images/icons/hackernews.png",
  },
  {
    key: "instacart",
    label: "Instacart",
    kind: "image",
    src: "/images/icons/instacart.png",
  },
  { key: "yelp", label: "Yelp", kind: "image", src: "/images/icons/yelp.png" },
  {
    key: "vercel",
    label: "Vercel",
    kind: "image",
    src: "/images/icons/vercel.svg",
  },
  {
    key: "perplexity",
    label: "Perplexity",
    kind: "image",
    src: "/images/icons/perplexity.png",
  },
  {
    key: "figma",
    label: "Figma",
    kind: "image",
    src: "/images/icons/figma.svg",
  },

  // Category icons (HugeIcons, no image asset)
  {
    key: "general",
    label: "General",
    kind: "huge",
    icon: ToolsIcon,
    iconClass: "text-zinc-400",
  },
  {
    key: "todos",
    label: "Todos",
    kind: "huge",
    icon: CheckListIcon,
    iconClass: "text-emerald-400",
  },
  {
    key: "reminders",
    label: "Reminders",
    kind: "huge",
    icon: AlarmClockIcon,
    iconClass: "text-blue-400",
  },
  {
    key: "documents",
    label: "Documents",
    kind: "huge",
    icon: FileEmpty02Icon,
    iconClass: "text-orange-400",
  },
  {
    key: "development",
    label: "Development",
    kind: "huge",
    icon: SourceCodeCircleIcon,
    iconClass: "text-cyan-400",
  },
  {
    key: "memory",
    label: "Memory",
    kind: "huge",
    icon: Brain02Icon,
    iconClass: "text-indigo-400",
  },
  {
    key: "creative",
    label: "Creative",
    kind: "huge",
    icon: Image02Icon,
    iconClass: "text-pink-400",
  },
  {
    key: "goal_tracking",
    label: "Goal tracking",
    kind: "huge",
    icon: Target02Icon,
    iconClass: "text-emerald-400",
  },
  {
    key: "notifications",
    label: "Notifications",
    kind: "huge",
    icon: NotificationIcon,
    iconClass: "text-yellow-400",
  },
  {
    key: "webpage",
    label: "Webpage",
    kind: "huge",
    icon: InformationCircleIcon,
    iconClass: "text-purple-400",
  },
  {
    key: "integrations",
    label: "Integrations",
    kind: "huge",
    icon: ConnectIcon,
    iconClass: "text-zinc-300",
  },
  {
    key: "handoff",
    label: "Handoff",
    kind: "huge",
    icon: SquareArrowUpRight02Icon,
    iconClass: "text-sky-400",
  },
  {
    key: "spawn_subagent",
    label: "Spawn subagent",
    kind: "huge",
    icon: WorkflowCircle06Icon,
    iconClass: "text-violet-400",
  },
  {
    key: "retrieve_tools",
    label: "Retrieve tools",
    kind: "huge",
    icon: PackageOpenIcon,
    iconClass: "text-indigo-400",
  },
  {
    key: "executor",
    label: "Executor",
    kind: "huge",
    icon: ComputerTerminal01Icon,
    iconClass: "text-teal-400",
  },
  {
    key: "fileSystem",
    label: "File system",
    kind: "huge",
    icon: FolderFileStorageIcon,
    iconClass: "text-fuchsia-400",
  },
  {
    key: "skills",
    label: "Skills",
    kind: "huge",
    icon: BodyPartMuscleIcon,
    iconClass: "text-rose-400",
  },
  {
    key: "context",
    label: "Context",
    kind: "huge",
    icon: PuzzleIcon,
    iconClass: "text-lime-400",
  },
  {
    key: "plan_tasks",
    label: "Plan tasks",
    kind: "huge",
    icon: TaskDailyIcon,
    iconClass: "text-violet-400",
  },
  {
    key: "workflows",
    label: "Workflows",
    kind: "huge",
    icon: ZapIcon,
    iconClass: "text-yellow-400",
  },
];

export function getToolCategory(key: string): ToolCategoryDef {
  return (
    TOOL_CATEGORIES.find((c) => c.key === key) ??
    TOOL_CATEGORIES.find((c) => c.key === "general")!
  );
}
