# Theming visuals, per-slide image prompts, platform-neutral prompt

Date: 2026-09-13
Status: approved in conversation (three design choices confirmed by user)

## Problems

1. **Slide thumbnails render empty on wide screens.** `SlideThumbnail` sets
   `padding: 6cqw` (and `width: 2.5cqw` for the Ascent band) on the same element
   that declares `container-type: inline-size`. An element cannot resolve
   container-query units against itself, so `cqw` falls back to the small
   viewport width. On a 1300px+ viewport the padding grows to ~80px per side
   inside a ~175px-tall thumbnail and pushes all content out of view. The
   Fragments squares also lose their square shape (percentage width plus
   `aspect-ratio` inside an absolutely positioned box).
   The motifs themselves are also too faint and sparse to sell each direction.
   The prompt describes the motif loosely, so the generated PPT may not match
   the preview.

2. **No image prompts.** Users whose AI platform cannot generate images have
   nothing to hand to a separate image tool. The theming step should give a
   ready-to-paste image prompt per slide.

3. **Prompt is Claude-specific.** UI copy says "Your prompt for Claude" and
   mentions the pptx skill. Users may paste into ChatGPT, Gemini, Copilot, etc.

## Decisions (confirmed)

- Image prompts: generated per slide, with an **Abstract / Photographic**
  toggle in the theming step that switches all prompts.
- Final Review gets a **deck preview strip**: every slide rendered in the
  selected theme, image-prompt hint under each.
- Cover art reaches the AI platform as **words only**: a precise geometry
  spec (shape, position and size as % of slide, hex, opacity) in the prompt.
  No SVG embedding, no download button.

## Design

### A. Thumbnail fix and richer motifs (`src/components/SlideThumbnail.tsx`, new `src/lib/coverArt.ts`)

- `Frame` gains a third layer: outer (aspect-ratio) → middle (absolute inset 0,
  `container-type: inline-size`) → inner (absolute inset 0, receives the
  per-slide style incl. `cqw` padding). All `cqw` values then resolve against
  the middle layer.
- Motif geometry moves out of JSX into `src/lib/coverArt.ts` as data:
  `describeCoverArt(variant, palette, intensity)` returns a list of shapes
  `{ kind: "circle" | "square" | "polygon", xPct, yPct, wPct, hPct, fill, opacity, points? }`
  plus a backdrop gradient. `SlideThumbnail` renders these shapes as one SVG
  (`viewBox 0 0 160 90`), so geometry is expressed in slide percentages and
  square shapes stay square. Shapes are lightened toward white as today so
  they stay visible on the dark backdrop.
- Richer compositions per variant (all confined to the right ~45%):
  - Orbit: three large overlapping circles with a soft radial gradient
    backdrop, plus one thin ring outline.
  - Fragments: a 4×4 staggered grid of squares with opacity rising toward the
    corner, plus two larger anchor squares.
  - Ascent: four stacked chevrons plus a thin diagonal guide line and a
    gradient band on the far right edge.
- `coverArtSpecText(variant, palette, clientCompany)` renders the same shape
  list as prose for the prompt (e.g. "Circle A: centre at 88% x / 12% y of
  the slide, diameter 55% of slide width, fill #6E7580 at 55% opacity").
  Preview and prompt therefore come from one data source.

### B. Per-slide image prompts (new `src/lib/imagePromptEngine.ts`)

- New types: `ImagePromptStyle = "abstract" | "photographic"`;
  `SlideOutlineItem.imagePrompt?: string`; `DeckState.imagePromptStyle`
  (default `"abstract"`).
- `generateImagePrompt(item, theme, clientCompany, style, slideCount)`:
  - Abstract: motif name, palette hex values, "no text, no logos, no people",
    composition rule (cover: right 45% only, left clear; internal: supporting
    panel ratio 4:3; closing: mirror of cover), lighting/finish words drawn
    from the theme's `imageryStyle`, aspect ratio.
  - Photographic: scene derived from slide role and eyebrow/headline keywords
    plus the deal domain (from the preset synopsis category when available),
    "no visible text or logos", colour grade toward the palette primary,
    negative space on the left for the cover, aspect ratio.
- `applyImagePrompts(outline, theme, clientCompany, style, slideCount)` maps
  over the outline and fills `imagePrompt` for every slide.
- Prompts regenerate when the user selects a theme or flips the style
  toggle. Manual edits persist until the next regeneration.

### C. Theming step UI (`src/components/ThemingAgentStep.tsx`)

- Below the theme cards, once a theme is selected: panel
  "Image prompts for every slide". Header row has the Abstract / Photographic
  toggle and a "Copy all" button. Each slide row shows slide number, role,
  headline, an editable textarea with the prompt, and a per-row "Copy" button.
- Page title changes from "Choose a cover image" to "Choose a visual style".

### D. Final Review (`src/components/ReviewExportStep.tsx`)

- New "Deck preview" section above the slide cards: horizontal, wrapping grid
  of `SlideThumbnail`s for every outline item in the selected theme, with
  slide number and the first ~90 chars of the image prompt under each.
- Prompt panel copy becomes platform-neutral: heading "Your prompt for your
  AI platform", hint lists Claude, ChatGPT, Gemini and Copilot and states the
  requirement (a platform that can produce a .pptx file or run Python).
  Intro paragraph no longer names Claude.

### E. Prompt builder (`src/lib/promptBuilder.ts`)

- Rename `buildClaudePrompt` → `buildDeckPrompt`.
- Remove platform references. Add a fallback clause: if the platform cannot
  output a .pptx directly, produce a complete python-pptx script that builds
  the identical deck.
- Replace the loose "Cover image" paragraph with `coverArtSpecText(...)`, and
  state that the same shape family recurs on internal slides (at ~40%
  opacity) and the closing slide (full strength).
- New section "IMAGE PROMPTS PER SLIDE (optional)": one prompt per slide and
  the rule: generate and place the image if the platform can; otherwise leave
  a clearly sized placeholder frame in the marked zone and copy the prompt
  into that slide's speaker notes so a person can generate it in any image
  tool.

### F. State wiring (`src/app/page.tsx`)

- `handleSelectTheme` also applies image prompts to the outline.
- New `handleSetImagePromptStyle(style)` regenerates prompts.
- New `handleUpdateImagePrompt(slideIndex, text)`.
- Outline edits and regenerations in Review preserve `imagePrompt`.
- Existing localStorage drafts lack `imagePromptStyle` and `imagePrompt`;
  `loadDeck` defaults the style to `"abstract"`, and Review regenerates
  missing prompts lazily when a theme is selected.

## Out of scope

- SVG export or any binary asset generation.
- Calling an image model from the app.
- Changing story, tone or flow generation.

## Testing

- Manual: theming step at 640px and 1400px viewports, all three themes show
  lockup, headline, motif, internal and closing thumbnails.
- Toggle Abstract/Photographic and confirm all prompts change; edit one and
  confirm it persists across navigation.
- Review shows deck preview and platform-neutral prompt containing the
  geometry spec and image prompt section.
- `npm run lint` and `npx tsc --noEmit` pass.
