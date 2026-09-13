import { describeColor } from "./colorUtils";
import { describeCoverArt } from "./coverArt";
import { findKnownClientById, KnownClient, matchKnownClient } from "./knownClients";
import { PRESET_SYNOPSES } from "./sampleData";
import { ImagePromptStyle, IntakeFormData, SlideOutlineItem, ThemeOption } from "./types";

/**
 * Produces a ready-to-paste prompt per slide for any image generator (Midjourney, DALL·E,
 * Firefly, Canva, Gemini, etc.). Two styles:
 *  - abstract: the theme's own geometric motif in the client's palette — consistent with a
 *    deck that uses no photography.
 *  - photographic: an editorial corporate scene keyed to the slide's role in the narrative.
 *
 * Nothing confidential goes into these prompts (they may be pasted into public tools):
 * only the client's name, the industry category, palette hex values and slide headlines.
 */

const INDUSTRY_SETTING: Record<string, string> = {
  "Financial services": "a glass-walled financial headquarters and a modern trading floor",
  "Retail / consumer": "a bright flagship store and a busy fulfilment centre",
  "Manufacturing / logistics": "an automated factory floor and a container port at dawn",
  Telecommunications: "a network operations centre and a city skyline with light trails at night",
};

const LABEL_SCENE: Record<string, string> = {
  Challenge: "a close-up of hands over a cluttered control-room dashboard, quiet tension",
  Implication: "a wide, nearly empty operations floor at dusk, long shadows",
  Solution: "engineers gathered around a large wall display, focused collaboration",
  Value: "an executive at a window looking out over a city at sunrise",
  "Current State": "a legacy server room with tangled cabling and warm tungsten light",
  "Future Vision": "a sleek, light-filled workspace with glass, timber and greenery",
  "Transformation Path": "a long bridge or highway curving toward a bright horizon",
  Outcomes: "a small team sharing a quiet moment of success in a bright meeting room",
  "Strategic Opportunity": "an aerial view of a city grid or busy port at golden hour",
  "Design Principles": "an architect's desk with crisp blueprints and drafting tools",
  "Delivery Model": "a coordinated crew in a modern workshop, each at a station",
  "Partnership Value": "two people in conversation in a sunlit atrium, relaxed and confident",
};

export function knownClientForForm(form: IntakeFormData): KnownClient | undefined {
  return findKnownClientById(form.knownClientId) ?? matchKnownClient(form.clientCompany);
}

/** The client's own industry wins; the preset synopsis category is only a fallback for unknown clients. */
export function industryForForm(form: IntakeFormData): string | undefined {
  const known = knownClientForForm(form);
  if (known) return known.industry;
  if (form.synopsisMode === "preset" && form.presetSynopsisId) {
    return PRESET_SYNOPSES.find((p) => p.id === form.presetSynopsisId)?.industry;
  }
  return undefined;
}

interface BrandCue {
  /** "in the style of ING's brand palette — vivid ING orange against deep indigo" */
  paletteLine: string;
  /** Concrete accent object for photographic prompts. */
  photoCue: string;
}

/**
 * Brand-name cue, built automatically from the client name typed on the intake form. Known
 * clients get curated colour words and a concrete photo cue (David's "orange jacket for ING");
 * anyone else gets colour words derived from the palette the theme is actually using, so the
 * cue is never generic even when the name is unfamiliar.
 */
function brandCueFor(clientCompany: string, theme: ThemeOption, known?: KnownClient): BrandCue {
  const client = clientCompany || "the client";
  if (known) {
    return {
      paletteLine: `echoing ${known.name}'s own brand palette (${known.colorWords}; ${known.primary}, ${known.secondary})`,
      photoCue: known.photoCue,
    };
  }
  const primaryWord = describeColor(theme.palette.primary);
  const secondaryWord = describeColor(theme.palette.secondary);
  return {
    paletteLine: `echoing ${client}'s own brand palette (${primaryWord} ${theme.palette.primary} with ${secondaryWord} ${theme.palette.secondary})`,
    photoCue: `one subtle ${primaryWord} accent object in the scene (a jacket, a cup, a panel) echoing ${client}'s signature colour`,
  };
}

function shapeWordFor(variant: ThemeOption["layoutVariant"]): string {
  if (variant === "grid") return "small flat squares in a loose lattice";
  if (variant === "gradient-band") return "stacked chevron arrows climbing upward";
  return "large overlapping translucent circles";
}

function abstractPrompt(item: SlideOutlineItem, theme: ThemeOption, clientCompany: string, cue: BrandCue): string {
  const art = describeCoverArt(theme.layoutVariant, theme.palette, 1);
  const p = theme.palette;
  const palette = `${describeColor(p.primary)} (${p.primary}), ${describeColor(p.secondary)} (${p.secondary}) and ${describeColor(p.accent)} (${p.accent}) on a dark ${describeColor(p.neutralDark).replace(/^deep /, "")} (${p.neutralDark}) background`;

  if (item.role === "cover" || item.role === "closing") {
    return `Abstract ${art.motifName} — ${shapeWordFor(theme.layoutVariant)} in ${palette}. Soft edges, subtle gradient and layered translucency, minimalist corporate design, ${cue.paletteLine}. Composition: every shape confined to the right 45% of the frame, gathered toward the ${theme.layoutVariant === "editorial" ? "top-right and bottom-right" : "bottom-right corner"}; the left 55% is an empty, evenly dark field. No text, no letters, no logos, no people, no photographic elements. 16:9 aspect ratio, high resolution, clean vector-like finish.`;
  }

  const lightPalette = `${describeColor(p.primary)} (${p.primary}) and ${describeColor(p.secondary)} (${p.secondary}) on a ${describeColor(p.surface)} (${p.surface}) background`;
  return `Abstract supporting graphic for a slide titled "${item.headline}" — a small cluster of ${shapeWordFor(theme.layoutVariant)} in ${lightPalette}, rendered at low intensity (about 40% opacity) in one corner, most of the frame calm and empty. Minimalist corporate style, ${cue.paletteLine}, soft edges, faint gradient. No text, no letters, no logos, no people. 4:3 aspect ratio, high resolution, clean vector-like finish.`;
}

function photographicPrompt(item: SlideOutlineItem, theme: ThemeOption, clientCompany: string, cue: BrandCue, industry?: string): string {
  const p = theme.palette;
  const client = clientCompany || "the client";
  const setting = (industry && INDUSTRY_SETTING[industry]) || "a modern corporate headquarters and its operations floor";
  const grade = `colour grade leaning toward ${describeColor(p.primary)} (${p.primary}), muted, cohesive tones, ${cue.paletteLine}; include ${cue.photoCue}`;
  const noBrand = "No visible text, signage, screens with readable content, logos or brand marks.";

  if (item.role === "cover") {
    return `Wide editorial establishing shot of ${setting}, cinematic natural light, shallow depth of field, ${grade}. Composition: the subject sits in the right half of the frame; the left half is calm negative space (sky, wall or shadow) for a title. Mood: ${item.subhead ? "assured and forward-looking" : "confident"}. Suitable for a presentation about ${client}. ${noBrand} 16:9 aspect ratio, high resolution, photorealistic.`;
  }
  if (item.role === "closing") {
    return `Calm sunrise or golden-hour view of ${setting}, wide shot, soft haze, ${grade}. Composition: horizon low in the frame, generous open sky on the left for a closing message. Mood: quiet optimism. ${noBrand} 16:9 aspect ratio, high resolution, photorealistic.`;
  }

  const scene = (item.eyebrow && LABEL_SCENE[item.eyebrow]) || `a focused team at work inside ${setting}`;
  return `Editorial corporate photograph for a slide titled "${item.headline}": ${scene}. Natural light, shallow depth of field, candid and unposed, ${grade}. Subject offset to one side leaving clean space for a caption. ${noBrand} 4:3 aspect ratio, high resolution, photorealistic.`;
}

export function generateImagePrompt(
  item: SlideOutlineItem,
  theme: ThemeOption,
  clientCompany: string,
  style: ImagePromptStyle,
  industry?: string,
  known?: KnownClient
): string {
  const cue = brandCueFor(clientCompany, theme, known);
  return style === "photographic" ? photographicPrompt(item, theme, clientCompany, cue, industry) : abstractPrompt(item, theme, clientCompany, cue);
}

export function applyImagePrompts(
  outline: SlideOutlineItem[],
  theme: ThemeOption,
  form: IntakeFormData,
  style: ImagePromptStyle
): SlideOutlineItem[] {
  const industry = industryForForm(form);
  const known = knownClientForForm(form);
  return outline.map((item) => ({ ...item, imagePrompt: generateImagePrompt(item, theme, form.clientCompany, style, industry, known) }));
}
