# Project Guidelines

## Icons

Always use **HugeIcons** for all icons. Never use `lucide-react`, inline SVGs, or any other icon library.

```tsx
import { HugeiconsIcon } from "@hugeicons/react"
import { SomeIcon } from "@hugeicons/core-free-icons"

<HugeiconsIcon icon={SomeIcon} size={16} />
```

## UI Components & Styling

- Always use **shadcn/ui** components with their default styling (`Button`, `Input`, `Select`, etc.)
- Never use raw HTML `<input>`, `<button>`, `<select>`, etc. with custom styling unless explicitly requested
- Always use **Tailwind** utility classes for layout and spacing — no inline styles unless required by a third-party API (e.g. Remotion player dimensions)

## Type Checking

Always run `bun run tsc --noEmit` (or `bun run --cwd <package> tsc --noEmit`) after completing any changes and fix all new TypeScript errors before reporting done.

## Remotion Composition Registry

`apps/remotion/src/components.ts` uses a two-level split to avoid circular dependencies:

- **`leaf-components.ts`** — standalone compositions that do NOT import `componentsById` or `leafComponentsById`. Add new plain compositions here.
- **`components.ts`** — spreads `leafComponentsById` and adds wrapper compositions (`PhoneFrame`, `SplitScene`) that need to look up other compositions at render time.

Wrapper compositions (any component that embeds other compositions via `componentsById`) must:
1. Import from `leaf-components.ts`, never from `components.ts`
2. Live in `components.ts` (not in `leaf-components.ts`)

Violating this causes a circular-import TDZ crash at runtime.
