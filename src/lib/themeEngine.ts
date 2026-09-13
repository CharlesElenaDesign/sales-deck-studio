import { isValidHex, mixWithBlack, mixWithWhite } from "./colorUtils";
import { BrandProfile, NarrativeFlowOption, StoryOption, ThemeOption, ToneOption } from "./types";

/** Infosys's own accent, used only as a restrained endorsement mark (the lockup wordmark,
 * a hairline divider) — it never leads the palette. The client's brand leads every slide. */
export const INFOSYS_ENDORSEMENT = "#0B3B6D";

const NEUTRAL_PRIMARY_FALLBACK = "#1F2937";
const NEUTRAL_SECONDARY_FALLBACK = "#3B4656";

function firstValidColor(brand: BrandProfile | undefined, fallback: string): string {
  const found = brand?.colors.find((c) => isValidHex(c.hex));
  return found?.hex ?? fallback;
}

function secondValidColor(brand: BrandProfile | undefined, fallback: string): string {
  const valid = brand?.colors.filter((c) => isValidHex(c.hex)) ?? [];
  return valid[1]?.hex ?? fallback;
}

export function generateThemeOptions(
  clientCompany: string,
  story: StoryOption,
  tone: ToneOption,
  flow: NarrativeFlowOption,
  clientBrand: BrandProfile | undefined
): ThemeOption[] {
  const hasClientColor = !!clientBrand?.colors.find((c) => isValidHex(c.hex));
  const clientPrimary = firstValidColor(clientBrand, NEUTRAL_PRIMARY_FALLBACK);
  const clientSecondary = secondValidColor(clientBrand, NEUTRAL_SECONDARY_FALLBACK);
  const neutralLight = mixWithWhite(clientPrimary, 0.92);
  const neutralDark = mixWithBlack(clientPrimary, 0.55);

  const isCurated = !!clientBrand?.sources.some((src) => src.label.startsWith("Charles Elena curated"));
  const brandBasis = isCurated
    ? `${clientCompany}'s reference brand colors from Charles Elena's curated client list (verify against official guidelines)`
    : hasClientColor
      ? `colors approximated from ${clientCompany}'s current public website`
      : `a neutral placeholder palette — no reliable ${clientCompany} brand color was found, so nothing is guessed`;

  const coBranding = `${clientCompany}'s own logo leads the lockup — client mark, a thin neutral divider, then a small Infosys wordmark — on the cover and closing slide only, never repeated on every internal slide and never redrawn or merged into a single mark. Infosys's presence stays a credible endorsement, not a co-owner of the page: ${clientCompany}'s color leads every slide.`;

  const options: ThemeOption[] = [
    {
      id: "client-editorial",
      name: `${clientCompany || "Client"} Orbit`,
      layoutVariant: "editorial",
      rationale: `A soft orbit of translucent circles in ${clientCompany}'s own color, bleeding off the cover's right edge — the same shapes echo, more quietly, behind internal-slide content and the closing slide. Suits a ${tone.name.toLowerCase()} tone and keeps "${story.name}" reading as ${clientCompany}'s own narrative, with Infosys present only in the lockup.`,
      colorStrategy: `${clientCompany}'s primary color drives every eyebrow, title accent, and diagram border, using ${brandBasis}. Infosys's own blue is confined to the small lockup wordmark.`,
      typographyApproach: `Arial throughout: a small tracked-caps eyebrow in the client's color, a bold ~30pt dark title, and a light 14pt subtitle — a consistent three-line hierarchy on every content slide.`,
      layoutSystem: `Single-column editorial layout with wide margins — eyebrow, title, and subtitle stacked top-left, body content and a supporting visual placeholder beneath. One idea per slide.`,
      imageryStyle: `No photography: the cover and closing slide carry a soft-edged orbit of two or three translucent circles in ${clientCompany}'s color family, bled off the right edge of the slide — confined to roughly the right 45% so the left side stays clean for the title and chapter text. Internal slides use simple geometric placeholders or line diagrams, clearly marked for real client imagery if supplied later.`,
      chartTreatment: `Minimal single-series charts and numbered step diagrams in the client's color, thin strokes, generous label spacing.`,
      coBrandingTreatment: coBranding,
      accessibilityNotes: `Body text always resolves to near-black or white depending on the surface, checked for WCAG AA contrast; the client's color is reserved for accents and short labels, never body copy.`,
      howReinforcesStory: `A quiet, confident editorial layout matches a story about ${story.directionLabel.toLowerCase()} — ${clientCompany}'s own color does the branding work, not decoration.`,
      palette: {
        primary: clientPrimary,
        secondary: clientSecondary,
        accent: INFOSYS_ENDORSEMENT,
        neutralDark,
        neutralLight,
        surface: "#ffffff",
      },
      headingFont: "Arial",
      bodyFont: "Arial",
      exportHeadingFont: "Arial",
      exportBodyFont: "Arial",
    },
    {
      id: "client-structured-panels",
      name: `${clientCompany || "Client"} Fragments`,
      layoutVariant: "grid",
      rationale: `A fragmented cluster of small squares in ${clientCompany}'s own color, gathered in the cover's bottom-right corner — the same fragments reappear at lower intensity inside internal-slide panels. Suited to a flow built around "${flow.name}" where side-by-side contrast (before/after, challenge/response) does real work.`,
      colorStrategy: `Both panels use tints and shades of ${clientCompany}'s own primary color (${brandBasis}); Infosys's blue never enters the panels, appearing only in the cover/closing lockup.`,
      typographyApproach: `The same Arial eyebrow/title hierarchy as the editorial style, but titles can run two lines; panel labels use a small tracked caption style.`,
      layoutSystem: `Two rounded panels side by side (roughly 60/40), each holding a distinct block of content — a stat callout, a short paragraph, or a proof point placeholder — so slides read as structured comparisons.`,
      imageryStyle: `No photography: the cover and closing slide carry a small fragmented grid of squares in ${clientCompany}'s color family, clustered in the bottom-right corner — confined to roughly the right 45% so the left side stays clean for the title and chapter text. On internal slides, the solid panel carries a subtle diagonal gradient for depth, and small circular icon marks with consistent stroke weight sit on each panel to add visual texture.`,
      chartTreatment: `Stat-callout tiles (large number, small caption) plus simple comparison bars — every figure clearly marked as a placeholder pending client-confirmed data.`,
      coBrandingTreatment: coBranding,
      accessibilityNotes: `Each panel sets its own text color for contrast — dark text on the tinted panel, white text on the solid panel — checked against WCAG AA before rendering either combination.`,
      howReinforcesStory: `Panel-by-panel contrast mirrors a story that turns on a clear before/after or challenge/response structure, in ${clientCompany}'s own color.`,
      palette: {
        primary: clientPrimary,
        secondary: neutralLight,
        accent: INFOSYS_ENDORSEMENT,
        neutralDark,
        neutralLight,
        surface: "#ffffff",
      },
      headingFont: "Arial",
      bodyFont: "Arial",
      exportHeadingFont: "Arial",
      exportBodyFont: "Arial",
    },
    {
      id: "client-progress-line",
      name: `${clientCompany || "Client"} Ascent`,
      layoutVariant: "gradient-band",
      rationale: `A set of ascending chevrons in ${clientCompany}'s own color climb from the cover's bottom-right corner — the same shapes reappear faintly on internal slides, alongside a progress band that tracks movement through the four-part story. Fitting for a ${tone.name.toLowerCase()} telling of "${story.name}".`,
      colorStrategy: `${clientCompany}'s primary color fills a narrow left-edge band, rendered as a gradient that deepens as it grows across the deck, tracking progress through the story; Infosys's blue is not part of this device, appearing only in the lockup.`,
      typographyApproach: `Bold, tightly-tracked dark titles paired with light-weight tinted supporting labels for contrast between assertion and explanation.`,
      layoutSystem: `Content sits in a fixed right-hand column, with a slim left-edge accent band marking progress through the narrative — early slides fill less of the band, later slides more.`,
      imageryStyle: `No photography: the cover and closing slide carry a set of ascending translucent chevrons in ${clientCompany}'s color family, stacked from the bottom-right corner toward the top edge — confined to roughly the right 45% so the left side stays clean for the title and chapter text. Internal slides use simple stepped-path or timeline line-art with a translucent tint layer behind each step, echoing the four-part story progression.`,
      chartTreatment: `Stepped timeline diagrams with a single marker for "you are here," plus simple progress bars, all in ${clientCompany}'s color family.`,
      coBrandingTreatment: coBranding,
      accessibilityNotes: `The accent band is a narrow decorative strip only; all readable text sits on solid white or dark neutral for guaranteed contrast.`,
      howReinforcesStory: `A visible sense of progression mirrors a narrative about change, making the shape of the story legible before the audience reads a word.`,
      palette: {
        primary: clientPrimary,
        secondary: clientSecondary,
        accent: INFOSYS_ENDORSEMENT,
        neutralDark,
        neutralLight,
        surface: "#ffffff",
      },
      headingFont: "Arial",
      bodyFont: "Arial",
      exportHeadingFont: "Arial",
      exportBodyFont: "Arial",
    },
  ];

  return options;
}
