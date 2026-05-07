"use client";

import type { ComponentType } from "react";
import type { EditorProps, Field, ShapeField } from "../schema";
import { PrimitiveControl } from "./primitives";
import { ChatEditor } from "./ChatEditor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shapeEditors: Record<ShapeField["kind"], ComponentType<EditorProps<any>>> = {
  chat: ChatEditor,
};

type Props = {
  fields: Field[];
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
};

export function FieldsRenderer({ fields, value, onChange }: Props) {
  function set(key: string, v: unknown) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {fields.map((field) => {
        if (field.kind === "chat") {
          const Editor = shapeEditors.chat;
          return (
            <div key={field.key} className="flex min-h-0 flex-1 flex-col">
              <Editor value={value[field.key] ?? []} onChange={(v) => set(field.key, v)} />
            </div>
          );
        }
        return (
          <div key={field.key} className="px-5 py-3">
            <PrimitiveControl
              field={field}
              value={value[field.key]}
              onChange={(v) => set(field.key, v)}
            />
          </div>
        );
      })}
    </div>
  );
}
