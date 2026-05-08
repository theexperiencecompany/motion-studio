# Project templates

Sample `Project` JSONs you can import into the studio once the import flow is wired up.

## Schema

```ts
type Project = {
  fps: number              // typically 60
  width: number            // typically 1920
  height: number           // typically 1080
  clips: Clip[]
}

type Clip = {
  id: string               // unique within the project
  compositionId: string    // must match an id in registry.ts
  durationInFrames: number // can be different from the composition's default duration
  props: Record<string, unknown>  // must match the composition's props shape
}
```

## Files

- **sample-launch.json** — 5-clip launch story (intro title → browser → tweet → chat → outro). ~30s @ 60fps. Uses `TitleSlideUp`, `BrowserWindow`, `TweetCard`, `WhatsAppMessages`, `TitleFade`.

## Notes

- `compositionId` must exactly match an id from `apps/remotion/src/registry.ts` (case-sensitive).
- `props` shape comes from each composition's `meta.ts` (`defaultProps`). Mismatched props will render with the missing fields as `undefined`.
- `id` on each clip just needs to be unique within the project — it doesn't have to be a UUID.
