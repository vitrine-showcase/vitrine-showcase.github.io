# Design Language — vitrine-maquette

This document is the contract for anyone building a module on this site. Module authors work independently and submit their work via pull request. Reviewers use this document as a checklist. Anything that violates a rule here should be flagged in the PR before merge.

The site has three sections: **Citoyens**, **Décideurs**, and **Médias**. Each section contains independent modules. All modules must feel like they came from the same design system regardless of who built them.

---

## 1. Color

### Base palette — shared across all sections

| Token | Hex | Use |
|-------|-----|-----|
| `$black` | `#000000` | Primary text, borders, default backgrounds |
| `$white` | `#ffffff` | Page background, inverted text |
| `$beige` | `#f5f5f0` | Secondary backgrounds, subtle fills |
| `$grey` | `#7a7a7a` | Muted text, metadata |
| `$grey-light` | `#f0f0f0` | Dividers, disabled fills |
| `$red` | `#ff2b06` | Errors, alerts |
| `$red-dark` | `#b11b00` | Error button state |
| `$green` | `#24b03e` | Success states |

### Accent palette — section identity colors

Each section owns one accent color. Use it for section headers, eyebrow labels, button fills, card borders, tag backgrounds, and loading spinners within that section.

| Section | Accent | Hex | Dark variant |
|---------|--------|-----|-------------|
| Citoyens | `$cyan` | `#65daff` | `$cyan-dark #26a3cb` |
| Décideurs | `$pink` | `#feadff` | `$pink-dark #e976eb` |
| Médias | `$yellow` | `#feec20` | `$yellow-dark #d2be17` |

### Rules

- Global chrome (navbar, footer, shared buttons) uses only black, white, and beige. Accents never appear there.
- A module only uses its own section's accent. Never mix accents across sections.
- Do not introduce new colors. If a new use case genuinely requires it, open a discussion before adding anything to `variables.module.scss`.
- The `MediaTreemap` component is the only dark-surface exception in the site. Its dark palette (`#0c1117`, `#0f1620`) is isolated to that component. Do not extend dark-mode styling to other modules.

---

## 2. Typography

### Fonts

| Font | Weight | Role |
|------|--------|------|
| `Superpose` Light | 300 | Body text, all headings, default |
| `Superpose` Regular | 400 | UI labels, metadata |
| `Superdot` Bold | 700 | Eyebrow labels, category tags, data callouts |

Both fonts are licensed. Do not substitute them.

### Rules

- All headings default to `Superpose Light (300)`. Do not increase heading weight.
- `Superdot` is for short strings only — under 4 words. Never use it on sentences or paragraphs. Apply it via the `%has-font-secondary` SCSS extend or `.has-font-secondary` utility class.
- Uppercase labels always carry `letter-spacing: 0.08em – 0.16em`.
- The `responsive-size()` scale below is mandatory. Do not freestyle font sizes in component files.

### Type scale

| Role | Function call | Approx range |
|------|--------------|-------------|
| Hero headline | `responsive-size(48, 96)` | 48–96px, `line-height: 0.92` |
| H1 | `responsive-size(48, 94)` | 48–94px, `line-height: 1em` |
| H2 | `responsive-size(24, 32)` | 24–32px |
| H3 | `responsive-size(20, 28)` | 20–28px |
| H4 | `responsive-size(18, 24)` | 18–24px |
| Large body | `responsive-size(16, 26)` | 16–26px, `line-height: 1.5` |
| Body | `responsive-size(16, 22)` | 16–22px, `line-height: 1.5` |
| Metadata | `responsive-size(13, 15)` | 13–15px |
| Eyebrow label | `responsive-size(11, 14)` | 11–14px, uppercase, `letter-spacing: 0.14em` |
| Small label | `responsive-size(9, 12)` | 9–12px, uppercase |

If a module needs a size not in this scale, propose it for addition centrally — do not solve it locally.

---

## 3. Spacing

All layout spacing uses `responsive-gap($multiply)` from `variables.module.scss`. The base scales from 20px (mobile) to 49px (desktop).

| Expression | Approx range | Typical use |
|-----------|-------------|-------------|
| `responsive-gap(0.5)` | 10–25px | Tight internal padding, small gaps |
| `responsive-gap(0.75)` | 15–37px | List item gaps, card internal spacing |
| `responsive-gap(1)` | 20–49px | Default section gap, grid column gap |
| `responsive-gap(1.25)` | 25–61px | Card padding, medium section spacing |
| `responsive-gap(1.5)` | 30–74px | Section bottom margins |
| `responsive-gap(2)` | 40–98px | Major section separators |
| `responsive-gap(3)` | 60–147px | Page-level top/bottom padding |

### Rules

- `responsive-gap()` is mandatory for any spacing that affects layout: section margins, card padding, grid gaps.
- Hard-coded values (`1rem`, `8px`) are only acceptable for micro-details inside a component — icon-to-text gap, border-radius, button padding. Never for layout.

---

## 4. Component structure

### Folder organization

```
src/components/
  ├─ shared/          ← Navbar, Footer, Button, Modal, SVGs, Loading, and all reusable UI
  ├─ citoyens/        ← Modules belonging to the Citoyens section
  ├─ decideurs/       ← Modules belonging to the Décideurs section
  └─ medias/          ← Modules belonging to the Médias section
```

Each component lives in its own folder:

```
src/components/citoyens/MyModule/
  ├─ MyModule.tsx
  └─ MyModule.scss
```

### Rules

- Never put styles from one component inside another component's SCSS file.
- Never use inline `style={}` props for anything that can be expressed in SCSS. Inline styles are only acceptable for truly dynamic values derived from data (e.g. a color value coming from an API).
- Local SCSS variables are allowed for values specific to one component (one-off animation timings, layout magic numbers). Any value that appears in more than one component must be moved to `variables.module.scss`.
- `shared/` components and global style files are centrally owned. Changes to them go through a separate review.

---

## 5. Borders and radius

These values are fixed. Consistent radius is one of the strongest signals of a unified system — deviating makes modules feel foreign.

| Element | Border radius |
|---------|--------------|
| Cards, panels | `1.5rem` |
| Badges, tags | `1rem` |
| Buttons | `1.5em` |
| Form controls (checkbox, input) | `1rem` |

| Surface | Border |
|---------|--------|
| Light surface | `1px solid $black` |
| Dark surface (MediaTreemap only) | `1px solid rgba(255, 255, 255, 0.12)` |

### Rules

- Do not introduce new radius values without discussion.
- No `box-shadow` on light surfaces. Box-shadow is only used for interactive hover states on dark surfaces.

---

## 6. Motion

Motion confirms interactions. It does not decorate.

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Color, border, background changes | `0.4s` | `ease-in-out` |
| Card hover lift | `180ms` | `ease` |
| Spinner rotation | `500ms` | `linear infinite` |

### Rules

- Only use the timings defined above. Do not introduce new durations.
- Never use `transition: all`. Always specify exactly which properties transition.
- Hover transforms are capped at `translateY(-2px)`. No dramatic lifts, scales, or rotations.
- No entrance animations (fade-in, slide-in on page load) unless explicitly designed as a named feature.
- No scroll-triggered animations unless explicitly requested.

---

## 7. Module independence and review

Module authors have full autonomy inside their section folder. There is no approval needed before building — work independently, then submit a pull request.

### What module authors own

- Everything under their section folder (`citoyens/`, `decideurs/`, `medias/`)
- Their component SCSS files and local variables

### What is centrally owned — do not modify without discussion

- `src/components/shared/` — shared UI components
- `src/assets/styles/variables.module.scss` — all design tokens
- `src/assets/styles/index.scss` — global resets and base styles
- `MainNavbar`, `MainFooter`

### PR review checklist

Before approving a module PR, verify:

- [ ] Section accent color used correctly, no cross-section mixing
- [ ] All headings are `Superpose Light (300)`
- [ ] `Superdot` used only for short labels (< 4 words)
- [ ] All font sizes use `responsive-size()` from the defined scale
- [ ] All layout spacing uses `responsive-gap()`
- [ ] Border radius values match the defined set
- [ ] No `transition: all`, no new animation durations
- [ ] No inline styles except for data-driven dynamic values
- [ ] Component lives in the correct section folder with its own `.tsx` and `.scss`
- [ ] No new colors introduced outside the defined palette
