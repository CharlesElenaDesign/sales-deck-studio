import { coverArtSpecText } from "./coverArt";
import { DeckState, internalSlideCount } from "./types";

function section(title: string, body: string): string {
  return `${title}\n${"-".repeat(title.length)}\n${body.trim()}\n`;
}

export function buildDeckPrompt(deck: DeckState): string {
  const { form, outline } = deck;
  const story = deck.storyOptions.find((s) => s.id === deck.selectedStoryId);
  const tone = deck.toneOptions.find((t) => t.id === deck.selectedToneId);
  const flow = deck.flowOptions.find((f) => f.id === deck.selectedFlowId);
  const theme = deck.themeOptions.find((t) => t.id === deck.selectedThemeId);

  if (!story || !tone || !flow || !theme || outline.length === 0) {
    return "Complete Steps 1-3 and reach Final Review before generating the prompt — the story, tone, flow, and theme all feed into it.";
  }

  const internalCount = internalSlideCount(form.slideCount);
  const client = form.clientCompany || "the client";

  const clientBrandLines = deck.clientBrand
    ? [
        `${client}: ${deck.clientBrand.confidence === "unavailable" ? "no reliable public color/logo signal found automatically" : `colors ${deck.clientBrand.colors.map((c) => c.hex).join(", ") || "none detected"}${deck.clientBrand.fonts.length ? `, fonts ${deck.clientBrand.fonts.join(", ")}` : ""}`}.`,
        ...deck.clientBrand.sources.map((s) => `  Source: ${s.label} — ${s.url} (accessed ${new Date(s.accessedAt).toLocaleDateString()})`),
      ]
    : [`${client}: not yet researched — look up their current official brand assets before designing.`];

  const infosysBrandLines = deck.infosysBrand
    ? [
        `Infosys: ${deck.infosysBrand.confidence === "unavailable" ? "no reliable public color/logo signal found automatically — use infosys.com as the source of truth" : `colors ${deck.infosysBrand.colors.map((c) => c.hex).join(", ") || "none detected"}${deck.infosysBrand.fonts.length ? `, fonts ${deck.infosysBrand.fonts.join(", ")}` : ""}`}.`,
        ...deck.infosysBrand.sources.map((s) => `  Source: ${s.label} — ${s.url} (accessed ${new Date(s.accessedAt).toLocaleDateString()})`),
      ]
    : ["Infosys: look up infosys.com for current brand colors and the official logo."];

  const slideLines = outline
    .map((item) => {
      const parts = [`${item.slideIndex}. [${item.role.toUpperCase()}]${item.eyebrow ? ` eyebrow: "${item.eyebrow}"` : ""}`, `   Headline: "${item.headline}"`];
      if (item.subhead) parts.push(`   Subhead: "${item.subhead}"`);
      if (item.bodyBullets.length) parts.push(...item.bodyBullets.map((b) => `   - ${b}`));
      parts.push(`   Speaker notes: ${item.speakerNotes}`);
      if (item.placeholderFlags.length) parts.push(...item.placeholderFlags.map((f) => `   ⚠ ${f}`));
      if (item.imagePrompt) parts.push(`   Image: see IMAGE PROMPTS section, slide ${item.slideIndex}.`);
      return parts.join("\n");
    })
    .join("\n\n");

  const imagePromptLines = outline
    .filter((item) => item.imagePrompt)
    .map((item) => `Slide ${item.slideIndex} (${item.role}${item.role === "cover" || item.role === "closing" ? ", 16:9 full-bleed backdrop, right 45% of the slide" : ", 4:3 supporting panel"}):\n${item.imagePrompt}`)
    .join("\n\n");
  const imageStyleLabel = deck.imagePromptStyle === "photographic" ? "editorial photography" : "abstract brand-motif graphics";

  const meta: string[] = [];
  if (form.presenterName) meta.push(`Presenter: ${form.presenterName}`);
  if (form.presenterDate) meta.push(`Date: ${form.presenterDate}`);
  if (form.presenterEmail) meta.push(`Contact: ${form.presenterEmail}`);
  if (form.presentationTitle) meta.push(`Requested title: ${form.presentationTitle}`);

  return `Create a polished, fully editable PowerPoint (.pptx) sales presentation co-branded as "Infosys | ${client}".

Format: 16:9 widescreen, ${form.slideCount} slides total — 1 cover, ${internalCount} internal, 1 closing. Consulting-quality: consistent grid, spacing, and type hierarchy across every slide; slide numbers on internal slides; speaker notes on every slide; no slide should feel like a generic template fill-in.

Output: the .pptx file itself. If you cannot produce a file directly on this platform, write a complete, runnable python-pptx script that builds the identical deck (all slides, shapes, colors, notes), plus the one command to run it.

${section(
  "BRAND RESEARCH — USE REAL WEB SEARCH, DON'T SETTLE FOR THE HINTS BELOW",
  `Use your own web search/browsing to find each brand's actual identity before designing anything. Search for things like "${client} brand guidelines", "${client} brand colors", "${client} press kit logo", and the equivalent for Infosys — official brand portals and newsroom/press pages first, the company's own official website second, Wikipedia or other reputable sources only if nothing official turns up.

Retrieve and use the real official logos:
- ${client}'s official logo.
- Infosys's official logo.
Use the real files as-is. Do not redraw, recolor, distort, or merge the two logos into a new combined mark.${form.clientLogoDataUrl ? ` (The presenter already holds ${client}'s official logo file — if this platform accepts file uploads, ask for it and use it directly instead of searching.)` : ""} If a logo genuinely can't be found or confidently verified after searching, fall back to a clean text wordmark rather than guessing or fabricating one.

Co-branding lockup: ${client}'s logo first, then a thin neutral divider, then the Infosys logo — small and restrained, placed on the cover and closing slide only (not repeated on every internal slide). Infosys reads as a credible delivery-partner endorsement, not a co-owner of the page — ${client}'s own brand identity (colors, tone) should visually lead every slide, based on what you find from real search, not a guess. This single image-based lockup is the only co-branding mark on the slide — do not also add a separate text line spelling out "${client}" and "Infosys" (as an eyebrow, caption, or watermark) anywhere else on the same slide. One lockup, never two.

A quick, unverified scan of each site was already done inside the tool that produced this prompt — treat it only as a rough starting point, not a substitute for your own search, since it can pick up an incidental page color rather than the true brand color:
${[...clientBrandLines, "", ...infosysBrandLines].join("\n")}`
)}
${section(
  "DESIGN QUALITY — MUST LOOK DESIGNED EVEN WITHOUT PHOTOGRAPHY",
  `No stock photography is required or expected — this deck must read as premium and professionally designed purely through typography, color, layout, shapes, and simple diagrams. Follow the visual direction below (adapted from the "${theme.name}" style chosen in this workflow):
- Color strategy: ${theme.colorStrategy}
- Typography: ${theme.typographyApproach}
- Layout system: ${theme.layoutSystem}
- Imagery/illustration style: ${theme.imageryStyle}
- Charts/diagrams/icons: ${theme.chartTreatment}
- Accessibility: ${theme.accessibilityNotes}
Vary layout meaningfully across the internal slides (don't repeat one title+bullets template on every page) while keeping eyebrow/title/type hierarchy consistent.

Use gradients and transparency deliberately as the main source of visual richness in place of photography:
- Gradient fills (in the client's and Infosys's own color family, never a generic rainbow) on background bands, section dividers, shape accents, or a cover/closing backdrop — subtle two- or three-stop gradients, not loud ones.
- Layered translucency for depth: soft translucent shape overlays, a tinted panel sitting over a gradient backdrop, a faint duotone wash behind a headline — used to create visual interest and hierarchy, not decoration for its own sake.
- Depth and rhythm from these effects should replace the "big photo + text on top" pattern entirely — every slide should feel intentionally composed, not like a placeholder waiting for an image.

Cover graphic (required — build it exactly as specified; this is what the user previewed and approved):
${coverArtSpecText(theme.layoutVariant, theme.palette)}

Visual consistency (required): every other slide in the deck inherits this same motif rather than introducing a new one. Reuse the identical shape family — at smaller scale and lower opacity, as specified above — inside internal-slide decorative panels, diagram placeholders, and any section-break moment, and again at full strength on the closing slide. The deck should read as one consistent visual system built around a single graphic idea, not a different decoration per slide. Keep the same left-clear rule wherever a title or chapter label sits on the left of an abstract graphic.

Zero tolerance for overlapping or crowded text — verify before finishing:
- No text box may overlap another text box, a logo, a shape, or a chart. Check every slide's layered elements (gradients, translucent panels, icons) against the text sitting on top for real, checked contrast — not just a color pair that looks fine in isolation.
- Give every text block enough width and height for its content at the stated font size — no clipped or overflowing text, no shrink-to-fit guessing.
- Keep consistent margins and breathing room; recheck any slide where a headline or bullet list runs long.`
)}
${section(
  "STORY (Story Agent output — keep every slide consistent with this)",
  `Direction: ${story.directionLabel} — "${story.name}"
Central idea: ${story.centralIdea}
Business challenge: ${story.challenge}
Proposed change: ${story.change}
Value / outcome: ${story.valueOutcome}
Why this fits ${client} and this deal: ${story.relevance}
Assumptions to validate before presenting (do not state these as confirmed fact):
${story.assumptions.map((a) => `  - ${a}`).join("\n")}`
)}
${section(
  "NARRATIVE (Narrative Agent output)",
  `Tone: ${tone.name} — ${tone.description}
Flow: ${flow.name} (${flow.structureLabels.join(" → ")})
Why this flow suits the story and tone: ${flow.whySuited}`
)}
${section(
  "SLIDE-BY-SLIDE CONTENT — use this as the factual basis for every slide; refine wording for flow and concision only. Do not invent new facts, figures, client claims, or performance results beyond what's here",
  slideLines
)}
${section(
  `IMAGE PROMPTS PER SLIDE (optional — style: ${imageStyleLabel})`,
  `The cover graphic above is built from native shapes and needs no image. The prompts below are an optional enhancement, one per slide, already written for any image generator.
- If this platform can generate images: generate each one, and place it in the zone named for that slide (cover/closing: full-bleed backdrop behind the shapes, right 45% of the slide only; internal: the 4:3 supporting panel). Keep the left-clear rule and re-check text contrast over the image.
- If this platform cannot generate images: do NOT substitute stock photos or invent artwork. Leave a clearly outlined placeholder frame of the stated size in that zone, and copy the slide's image prompt verbatim into that slide's speaker notes under the heading "Image prompt" so a person can generate it later in any image tool (Midjourney, DALL·E, Firefly, Canva, Gemini) and drop it in.

${imagePromptLines || "No image prompts were generated for this deck."}`
)}
${section(
  "HARD CONSTRAINTS",
  `- No fabricated statistics, client claims, quotations, case studies, or performance figures anywhere in the deck.
- Where a real number or proof point would strengthen a slide, insert a clearly visible placeholder (e.g. "[${client} to confirm: specific figure]") rather than inventing one.
- The deal synopsis below is confidential context only — do not search for it online or expose it beyond this deck.
- Deal synopsis: "${form.synopsisText}"${form.notes ? `\n- Additional notes: "${form.notes}"` : ""}
${meta.length ? `- ${meta.join(" · ")}` : ""}`
)}
Before finishing: render or otherwise inspect every slide and confirm no text overlaps another element, nothing is clipped, and every gradient/transparent layer still leaves text clearly legible. Fix and re-check any slide that fails this before calling the deck done.

DELIVERABLE: one .pptx file (or, failing that, a complete python-pptx script that produces it), 16:9, fully editable text/shapes/charts, speaker notes on every slide, slide numbers on internal slides, real client and Infosys logos in the cover/closing lockup, the specified cover motif built from native shapes and echoed across the deck, gradients and layered transparency carrying the visual design in place of photography.`;
}
