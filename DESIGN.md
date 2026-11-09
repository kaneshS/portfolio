# Design: The Marauder's Map

The portfolio is the map. Aged parchment, iron-gall ink, hand-drawn corridors, labelled rooms, and footprints that walk the visitor between places. The interface recedes; the artifact leads.

## Modes

- **Lumos (light, default):** parchment ground, dark ink. Mottled vignette + SVG grain on `body`.
- **Nox (dark):** the map read by wandlight. Dark leather ground, parchment-coloured ink. Same grammar, inverted.

Tokens live in `src/app/globals.css` as space-separated RGB triples, mapped in `tailwind.config.ts`.

| Token | Role | Lumos | Nox |
|---|---|---|---|
| `--bg` | parchment ground | `#e9d9b3` | `#1a140d` |
| `--bg-deep` | vignette edges | `#ceb786` | `#0a0704` |
| `--paper` | lighter note / card | `#f1e5c6` | `#261d12` |
| `--ink` | text, rules | `#2a1a0e` | `#e6d5ae` |
| `--ink-soft` | secondary text | `#5c4330` | `#bea889` |
| `--ink-faint` | hairlines, labels | `#8a6d50` | `#806a4c` |
| `--rule` | frame strokes | `#6e543a` | `#7a6548` |
| `--wax` | primary action (wax seal) | `#8f2a1f` | `#dc6854` |
| `--wax-fg` | text on wax | `#f4e8cf` | `#1a140d` |

Colour strategy: restrained. Wax red is the single accent and only ever marks an action or a role title.

## Type

- Display: **IM Fell English SC** (`--font-display`) for headings, nav, buttons, labels.
- Body: **Alegreya** (`--font-body`), 17px mobile / 18px desktop, 1.6 line height, max 66ch.
- Handwriting: **Caveat** (`--font-hand`) for margin notes, role titles, quotes. Always rotated ~-2° when used as a note.

All three via `next/font/google`, self-hosted at build.

## Components (`src/components/ui`)

- `Frame` / `.map-frame`: double-ruled box with corner flourishes. `paper` variant sits on `--paper`.
- `Ribbon`: section label on a notched banner. Used by `Banner` (section titles).
- `Trail`, `Footprint`: the signature. Footprints step in via `.footprint` + `.in-view` (CSS, 70ms stagger).
- `Compass`, `WaxSeal`, `Corner`: single-stroke SVG ornaments in `currentColor`.
- `.btn-wax` (primary) / `.btn-ink` (secondary): 44px min height, press scales to 0.97.
- `.ink-link`: underline draws left-to-right on hover; `aria-current` keeps it drawn.
- `InkList`: inline "a · b · c" lists in small caps. No chips.
- `NoteDialog`: native `<dialog>` styled as a folded note.
- `.field`: inputs, 16px so iOS does not zoom.

## Motion

One authored moment: the oath types onto blank parchment, then the page is revealed (`MapReveal`, once per session). Footprints walk the corridors as they enter view. Hero text inks in once. Nothing else fades in on scroll. Easing: `--ease-out: cubic-bezier(0.23,1,0.32,1)`, `--ease-in-out: cubic-bezier(0.77,0,0.175,1)`. Reduced motion keeps opacity only.

## Rules

- No kickers/eyebrows above headings; the ribbon is the heading.
- No gradient text, no glass, no coloured left borders.
- Icons only from lucide at one stroke weight; map ornaments are authored SVG.
- Copy stays in the map's voice (corridors, chambers, owl post) but every fact comes from `src/data/resume.json`.
