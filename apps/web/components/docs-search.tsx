"use client";

import {
  Book01Icon,
  TextFontIcon,
  VideoAiIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { compositions } from "@workspace/compositions/registry";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import { useRouter } from "next/navigation";
import { docs } from "@/lib/docs";

const compositionIds = new Set(compositions.map((c) => c.id));
const textAnimationIds = new Set(
  compositions.filter((c) => c.id.startsWith("Title")).map((c) => c.id),
);

type SearchItem = { title: string; description: string; href: string };
type SearchGroup = {
  heading: string;
  icon: typeof Book01Icon;
  items: SearchItem[];
};

function buildSearchGroups(): SearchGroup[] {
  const gettingStarted: SearchGroup = {
    heading: "Getting Started",
    icon: Book01Icon,
    items: [],
  };
  const textAnimations: SearchGroup = {
    heading: "Text Animations",
    icon: TextFontIcon,
    items: [],
  };
  const templates: SearchGroup = {
    heading: "Templates",
    icon: VideoAiIcon,
    items: [],
  };

  for (const doc of docs) {
    const item: SearchItem = {
      title: doc.meta.title,
      description: doc.meta.description,
      href: doc.href,
    };
    if (!compositionIds.has(doc.slug)) {
      gettingStarted.items.push(item);
    } else if (textAnimationIds.has(doc.slug)) {
      textAnimations.items.push(item);
    } else {
      templates.items.push(item);
    }
  }

  return [gettingStarted, textAnimations, templates].filter(
    (g) => g.items.length > 0,
  );
}

const searchGroups = buildSearchGroups();

interface DocsSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocsSearch({ open, onOpenChange }: DocsSearchProps) {
  const router = useRouter();

  function handleSelect(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search docs"
      description="Search documentation pages"
    >
      <CommandInput placeholder="Search docs..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {searchGroups.map((group) => (
          <CommandGroup key={group.heading} heading={group.heading}>
            {group.items.map((item) => (
              <CommandItem
                key={item.href}
                value={`${item.title} ${item.description}`}
                onSelect={() => handleSelect(item.href)}
              >
                <HugeiconsIcon
                  icon={group.icon}
                  size={14}
                  className="shrink-0 opacity-60"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{item.title}</span>
                  {item.description && (
                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
