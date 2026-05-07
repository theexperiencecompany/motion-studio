"use client";

import type { PrimitiveField } from "../schema";

type Props = {
  field: PrimitiveField;
  value: unknown;
  onChange: (v: unknown) => void;
};

export function PrimitiveControl({ field, value, onChange }: Props) {
  if (field.kind === "text") {
    return (
      <Wrapper label={field.label}>
        <input
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
        />
      </Wrapper>
    );
  }

  if (field.kind === "textarea") {
    return (
      <Wrapper label={field.label}>
        <textarea
          value={(value as string) ?? ""}
          rows={field.rows ?? 3}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
        />
      </Wrapper>
    );
  }

  if (field.kind === "number") {
    return (
      <Wrapper label={field.label}>
        <input
          type="number"
          value={(value as number) ?? 0}
          min={field.min}
          max={field.max}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper label={field.label}>
      <select
        value={(value as string) ?? field.options[0]?.value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
      >
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Wrapper>
  );
}

function Wrapper({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-medium">{label}</label>
      {children}
    </div>
  );
}
