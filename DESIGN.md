# Design: Obsidian + Amber

Near-black ground, bone type, one warm accent. The page proves the work instead of describing it: the hero is a live diagram of a real pipeline, every project card is an authored system diagram, and the numbers come straight from the resume.

## Modes

- **Dark (default):** `#0b0c0f` ground, `#ecebe6` type, amber `#f5b544`.
- **Light:** warm paper `#f6f4ef`, `#15161a` type, deeper amber `#c47d0a` for contrast.

Tokens are RGB triples in `src/app/globals.css`, mapped in `tailwind.config.ts`.

| Token | Role | Dark | Light |
|---|---|---|---|
| `--bg` | page ground | `#0b0c0f` | `#f6f4ef` |
| `--surface` | cards, nav pill | `#121419` | `#fffefb` |
| `--surface-2` | insets, chips, fields | `#181b21` | `#eeebe4` |
| `--text` | primary type | `#ecebe6` | `#15161a` |
| `--text-soft` | secondary type | `#a7a69f` | `#5b5c62` |
| `--text-faint` | labels, hairline text | `#6e6e68` | `#8d8e94` |
| `--line` | borders at 10–25% alpha | `#ecebe6` | `#15161a` |
| `--accent` | one accent: actions, live dots, packets | `#f5b544` | `#c47d0a` |

Colour strategy: restrained. Amber marks an action, a live state, or a packet in motion. Never decoration.

## Type

- Display: **Bricolage Grotesque** (`--font-display`), weight 500, tracking -0.025em, for headings and numbers.
- Body: **Geist Sans** (`--font-body`, local file), 16px mobile / 17px desktop.
- Labels: **Geist Mono** (`--font-mono`, local file), 0.72rem, uppercase, 0.12em tracking (`.label`).

## Components (`src/components/ui`)

- `.card` / `.card-inset`: surface with 1px line at 10% alpha, 20px / 12px concentric radii, layered shadow.
- `FlowDiagram` (`flow-diagram.tsx`): nodes on a grid, bezier edges, SMIL packets. `lanes()` builds a straight pipeline. `compact` for cards. One pause control; paused under reduced motion.
- `.btn-accent` / `.btn-line` / `.btn-ghost`: pill buttons, 44px min, press scales to 0.97.
- `.link`: underline draws left to right; `aria-current` keeps it drawn.
- `Chips`: mono stack chips on `--surface-2`.
- `Dialog`: native `<dialog>` with blur backdrop.
- `LocalTime`: live IST clock (nav bento and footer).
- `.field`: 16px inputs, accent focus ring.

## Motion

One authored moment: hero lines rise from a mask (`.reveal`, 90ms stagger). Diagram packets loop at 2.6s with a pause button. Cards lift 2px on hover, buttons press. No scroll-triggered fades. Curves: `--ease-out: cubic-bezier(0.23,1,0.32,1)`, `--ease-in-out: cubic-bezier(0.77,0,0.175,1)`. Reduced motion keeps opacity only and pauses packets.

## Rules

- No gradient text, no glass as decoration, no coloured left borders, no section numbers.
- Icons from lucide at one stroke weight; diagrams are authored SVG, not icon tiles.
- Every number and claim traces to `src/data/resume.json` or `profile.ts`.
- No portrait on the site; if one is added, it belongs in the hero's right column in place of the diagram card, not beside it.
