import { compositionsById } from "@workspace/compositions/registry";

export function CompositionStats({ id }: { id: string }) {
  const info = compositionsById[id];
  if (!info) return null;

  const items = [
    { label: "ID", value: info.id },
    { label: "Resolution", value: `${info.width}×${info.height}` },
    { label: "FPS", value: String(info.fps) },
    {
      label: "Duration",
      value: `${(info.durationInFrames / info.fps).toFixed(1)}s`,
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 my-6 not-prose">
      {items.map((item) => (
        <div key={item.label} className="rounded-md border border-border p-3">
          <dt className="text-xs font-medium text-muted-foreground/60">
            {item.label}
          </dt>
          <dd className="mt-1 text-sm font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
