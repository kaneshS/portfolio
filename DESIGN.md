# Design: Terminal

The portfolio reads like a well-kept shell session. Near-black ground with a faint dotted grid, off-white monospace text, hairline rules, and one phosphor-green accent that only ever marks a prompt, a status dot, a link or the primary action. Every section is a command and its output.

## Modes

- **Dark (default):** `#0a0b0a` ground, off-white text, phosphor green `#39d98a`.
- **Light:** a paper-white terminal in the Solarized-light family: `#fdf6e3` ground, slate text, deep green `#167a48`. Same grammar.

The toggle lives in `src/components/theme-provider.tsx`; the class `dark` on `<html>` switches the token set. An inline script in `src/app/layout.tsx` applies the saved theme before paint.

Tokens live in `src/app/globals.css` as space-separated RGB triples, mapped in `tailwind.config.ts`.

| Token | Role | Dark | Light |
|---|---|---|---|
| `--bg` | page ground | `#0a0b0a` | `#fdf6e3` |
| `--surface` | terminal windows, rows on hover | `#111311` | `#f7f0dc` |
| `--surface-2` | hover on ghost buttons | `#171a17` | `#eee8d5` |
| `--rule` | hairlines, borders | `#282c28` | `#d6ceb8` |
| `--fg` | body text | `#e6e8e3` | `#1f2d33` |
| `--fg-dim` | secondary text | `#9aa09a` | `#586e75` |
| `--fg-faint` | labels, paths, comments | `#7a827a` | `#5a6f76` |
| `--accent` | prompts, dots, links, primary button | `#39d98a` | `#167a48` |
| `--on-accent` | text on accent | `#06130c` | `#fdf6e3` |

Measured contrast against `--bg`: body ≥ 13:1, secondary ≥ 7:1, faint labels ≥ 4.9:1, accent ≥ 4.9:1 in both modes.

The dotted grid is a `radial-gradient` on `body` at 24px spacing, 10% (light) / 7.5% (dark) of the foreground.

## Type

One face: **Geist Mono**, loaded from `src/app/fonts/GeistMonoVF.woff` via `next/font/local` as `--font-mono`. Body 15px mobile / 16px desktop, 1.65 line height, max 62ch. Headings weight 500, tracking -0.01em. Numbers are tabular everywhere.

## Grammar

- **Section header** (`SectionHead` in `src/components/ui/section.tsx`): `01 FEATURED WORK` left in small caps with the number in accent, `~/projects/featured` right in faint, hairline below. Under it, the command that "produced" the section: `$ ls -al projects/`, `$ git log --oneline`, `$ tree stack/`.
- **Prompt** (`.prompt`): the `$` or `›` glyph in accent, never selectable.
- **Status dot** (`.dot`): 7px accent circle with a soft halo. Used in the wordmark, the AVAILABLE pill and terminal title bars.
- **Terminal window** (`.term` + `.term-bar`): surface background, hairline border, three grey lights, path in the centre, `● ready` on the right. Used by the ask box on the home page, the chat transcript and every dialog (`TermDialog` in `src/components/ui/dialog.tsx`, a native `<dialog>`).
- **Row** (`.row`): one line of `ls -al` or `git log` output. Full-width button, hairline below, surface tint on hover, `↗` turns accent and nudges. Projects list name / headline metric / stack; experience lists a short hash (djb2 of the company name, `shortHash` in `src/lib/utils.ts`), the date range, the role and company.
- **Tree** (`.tree`): `<ul>` whose items draw `├── ` and `└── ` with `::before`. Used for every skill group in `resume.skills`.
- **Buttons**: `.btn-primary` (accent fill, 44px) for the one primary action per view, `.btn-ghost` (hairline, surface) for everything else. Press scales to 0.97.
- **Links** (`.t-link`): accent underline draws left to right on hover; `aria-current` keeps it drawn.
- **Fields** (`.field`): 16px so iOS does not zoom, accent border and 3px ring on focus.

## Motion

One authored moment: the name in the hero types in (`steps()` on width in `ch` units, 700ms after a 400ms pause) and a block caret blinks after it. Dialogs rise 6px over 180ms. Hover states transition only the properties they change. Nothing fades in on scroll. `prefers-reduced-motion` removes the typing, the blink, the dialog rise and all press scaling.

## Chat (`/ai`)

Before the first message: a centred greeting, one large input and five chips (`$ me`, `$ projects`, `$ skills`, `$ stack`, `$ contact`) that send preset questions. After the first message the page becomes a terminal transcript: user lines start with a green `$`, assistant output sits behind a hairline left rule, the input is pinned to the bottom of the window. The home-page ask box is a plain GET form that lands on `/ai?q=…`, which sends the question once on mount.

## Rules

- Green is for prompts, status dots, links and the primary button. Body text is never green.
- No gradient text, no glass, no coloured left borders above 1px, no fade-in per section.
- Icons from lucide at one stroke weight; `↗`, `→`, `⟶`, `├──` are typographic, not icons.
- Every fact on the page comes from `src/data/resume.json` or `src/data/profile.ts`. No portrait, no invented clients, metrics or quotes.
