# Design: Editorial light

A quiet, numbers-led portfolio in the manner of a well-set magazine page. Warm off-white ground, near-black type, one burnt red-brown accent, generous whitespace. The content is the design; the interface recedes.

Model: aanandmadhav.com for the home page, aaabadcode.com for the AI page.

## Modes

- **Light (default):** warm off-white ground, near-black ink.
- **Dark:** warm charcoal ground, bone-coloured ink, the accent lifted for contrast. Same grammar, inverted.

Tokens live in `src/app/globals.css` as space-separated RGB triples, mapped in `tailwind.config.ts`.

| Token | Role | Light | Dark |
|---|---|---|---|
| `--bg` | page ground | `#f4f1ec` | `#1c1a17` |
| `--surface` | soft panel | `#ebe6de` | `#26231f` |
| `--ink` | text, headings | `#1a1816` | `#ece7df` |
| `--ink-soft` | secondary text, placeholders | `#5f5851` | `#b0a89d` |
| `--ink-faint` | separators inside text ( · ) | `#8a8279` | `#7f786f` |
| `--rule` | hairlines, borders | `#d9d2c7` | `#3a3631` |
| `--accent` | the one accent: second half of a heading, focus ring, role title | `#9a3b1e` | `#de7c54` |
| `--accent-fg` | text on accent | `#f4f1ec` | `#1c1a17` |

The accent is used for: the second sentence of a section heading, focus rings, the role title inside the experience dialog, the hover state of the primary button, and error text. Nowhere else.

## Type

- **Schibsted Grotesk** (`--font-sans`) for everything. Headings at weight 500, tracking -0.025em, line height 1.05. Body 17px / 1.6.
- **JetBrains Mono** (`--font-mono`) only for the `.meta` class: dates, the clock, metric captions, panel titles. 12px, uppercase, 0.04em tracking. Never above a section heading.
- Hero: three short words stacked, `clamp(3rem, 9vw, 6rem)`.

Both via `next/font/google`, self-hosted at build.

## Structure (`src/app/page.tsx`)

1. **Nav** (`navigation.tsx`): name + role left; Work / Experience / Skills / Ask AI; live Gurugram clock (`clock.tsx`, hidden below `lg`); theme toggle; "Get in touch". Mobile: full-screen menu, 44px rows, clock and CTA at the bottom.
2. **Hero** (`sections/hero.tsx`): H1 "Pipelines. Platforms. Scale.", first sentence of `resume.summary`, "Start a conversation" opens the contact form, "Open to senior backend roles". Right column: `system-diagram.tsx`, an authored SVG of a Kafka pipeline with autoscaled workers. **Portrait slot:** there is no photo of Kaneshwar; the diagram occupies the slot. To add one later, replace `<SystemDiagram>` in `hero.tsx` with a `next/image` at the same column width.
3. **Work** (`sections/work.tsx`): heading "Real load. Real numbers." Two `.panel`s for the two biggest numbers ($600K+, ~5M), then `.row`s for the other curated projects (name, metric, one line, ↗). Every panel and row opens the project `Dialog` with metrics, problem, architecture, Mermaid diagram, stack. Below: "Also built" from `resume.projects` and "On the side" from `freelanceProjects`.
4. **Experience** (`sections/experience.tsx`): a ledger of rows (dates, company + role, one line, ↗) opening a `Dialog` with the achievements. Education as one line beneath.
5. **Skills** (`sections/skills.tsx`): every group from `resume.skills` as plain lists in a 2 / 4 column grid. No chips.
6. **AI CTA** (`sections/ai-cta.tsx`): one `.panel` linking to `/ai`.
7. **Contact** (`sections/contact.tsx`) + **Footer**: "Let's build something.", primary button opens the form, email as ghost button, links list (GitHub, LinkedIn, Medium, Resume PDF), footer with the clock.

## AI page (`src/app/ai/page.tsx`)

Centered greeting, one round input, five chips (Me / Projects / Skills / Stack / Contact) that send preset questions. After the first message the page becomes the chat: user bubbles on the right in `--surface`, assistant answers as plain prose, input pinned to the bottom. All fetch / SSE / typewriter / error-report logic is unchanged from the previous design.

## Components (`src/components/ui`)

- `.btn-primary` (ink on bg, accent on hover) / `.btn-ghost` (hairline border). 44px min height, hover lifts 2px, press scales to 0.97.
- `.link`: 1px underline in `--rule`, accent on hover and when `aria-current="true"`.
- `.row`: full-width ledger row, hairline above, `--surface` on hover.
- `.panel`: `--surface`, 8px radius.
- `.field`: 16px inputs, accent focus ring.
- `Dialog`: native `<dialog>`, `.sheet` styling, Esc and backdrop close, 44px close button.
- `Mermaid`: palette per theme; hard-coded `style` lines in diagrams are stripped.
- `InlineList`: "a · b · c" text lists.

## Motion

One authored moment: the three hero words rise out of a clipped box, 110ms apart (`.reveal`), and the sentence, CTA and diagram fade up after. Nothing else animates on scroll. Dialogs ease in over 220ms. Easing: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`. All transitions list exact properties. `prefers-reduced-motion` removes the rise, the fades and the lifts.

## Rules

- No kicker labels above headings. The `.meta` class marks data, never introduces a heading.
- No gradient text, no glass, no coloured left borders thicker than 1px, no chip clouds.
- Icons from lucide only, at one stroke weight; the hero diagram is authored SVG in `currentColor`.
- Every fact comes from `src/data/resume.json` or `src/data/profile.ts`. No invented metrics, clients or quotes.
