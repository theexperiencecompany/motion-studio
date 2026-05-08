"use client";

import { FieldsRenderer } from "@workspace/compositions/editors";
import type { Clip } from "@workspace/compositions/project";
import type { compositionsById } from "@workspace/compositions/registry";
import { Button } from "@workspace/ui/components/button";
import type { ComponentProps } from "react";

type Info = NonNullable<(typeof compositionsById)[string]>;

type Props = {
  clip: Clip;
  info: Info;
  onChange: ComponentProps<typeof FieldsRenderer>["onChange"];
  onClose: () => void;
};

export function Inspector({ clip, info, onChange, onClose }: Props) {
  return (
    <aside className="flex w-80 shrink-0 flex-col border-l border-border bg-background">
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">Inspector</p>
          <p className="mt-1 truncate text-sm font-medium text-foreground">
            {info.title}
          </p>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClose} title="Close">
          ×
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <FieldsRenderer
          fields={info.fields}
          value={clip.props}
          onChange={onChange}
        />
      </div>
    </aside>
  );
}
