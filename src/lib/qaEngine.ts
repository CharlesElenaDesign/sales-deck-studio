import { contrastRatio } from "./colorUtils";
import { findKnownClientById, matchKnownClient } from "./knownClients";
import { DeckState, QaFlag } from "./types";

let counter = 0;
function flag(severity: QaFlag["severity"], category: string, message: string, slideIndex?: number): QaFlag {
  counter += 1;
  return { id: `qa-${counter}-${Date.now()}`, severity, category, message, slideIndex };
}

const STAT_PATTERN = /(\$\s?\d[\d,.]*|\d[\d,.]*\s?%|\b\d+x\b)/i;

export function runQaChecks(deck: DeckState): QaFlag[] {
  counter = 0;
  const flags: QaFlag[] = [];

  const story = deck.storyOptions.find((s) => s.id === deck.selectedStoryId);
  const tone = deck.toneOptions.find((t) => t.id === deck.selectedToneId);
  const flow = deck.flowOptions.find((f) => f.id === deck.selectedFlowId);
  const theme = deck.themeOptions.find((t) => t.id === deck.selectedThemeId);

  if (!story) flags.push(flag("critical", "Story consistency", "No story has been selected yet — the deck cannot be generated without one."));
  if (!tone) flags.push(flag("critical", "Narrative consistency", "No tone has been selected yet."));
  if (!flow) flags.push(flag("critical", "Narrative consistency", "No narrative flow has been selected yet."));
  if (!theme) flags.push(flag("critical", "Brand alignment", "No visual theme has been selected yet."));

  if (deck.infosysBrand?.confidence === "unavailable") {
    flags.push(flag("warning", "Brand alignment", "Infosys brand research could not be completed automatically — visuals fall back to a neutral approximation."));
  }
  if (deck.clientBrand?.confidence === "unavailable") {
    flags.push(flag("warning", "Brand alignment", `${deck.form.clientCompany || "The client"}'s brand research could not be completed automatically — visuals fall back to a neutral, clearly-labelled approximation.`));
  }

  if (!deck.form.clientLogoDataUrl) {
    const known = findKnownClientById(deck.form.knownClientId) ?? matchKnownClient(deck.form.clientCompany);
    flags.push(
      flag(
        "info",
        "Logo treatment",
        known
          ? `${known.name}'s colours and website are on file, but no logo file is stored for any listed client, so this preview shows a text wordmark. The deck prompt instructs the AI platform to retrieve ${known.name}'s official logo itself — upload a logo only if you want it in the in-app preview.`
          : "No client logo was uploaded — this preview uses a text wordmark. The deck prompt instructs the AI platform to retrieve the official logo itself; upload a logo file only if you want it in the in-app preview."
      )
    );
  }

  for (const item of deck.outline) {
    if (item.headline.length > 90) {
      flags.push(flag("warning", "Text overflow", `Headline is long (${item.headline.length} characters) and may wrap awkwardly — consider shortening.`, item.slideIndex));
    }
    if (item.bodyBullets.length > 4) {
      flags.push(flag("warning", "Alignment and spacing", "More than four bullets on this slide may crowd the layout — consider trimming.", item.slideIndex));
    }
    for (const bullet of item.bodyBullets) {
      if (bullet.length > 240) {
        flags.push(flag("warning", "Text overflow", "A bullet is quite long and may overflow its text box — consider shortening.", item.slideIndex));
      }
      if (STAT_PATTERN.test(bullet)) {
        flags.push(flag("critical", "Unsupported claims", `Possible unverified statistic detected ("${bullet.match(STAT_PATTERN)?.[0]}") — confirm with ${deck.form.clientCompany || "the client"} before presenting, or remove.`, item.slideIndex));
      }
    }
    if (STAT_PATTERN.test(item.headline)) {
      flags.push(flag("critical", "Unsupported claims", `Possible unverified statistic detected in the headline ("${item.headline.match(STAT_PATTERN)?.[0]}") — confirm before presenting.`, item.slideIndex));
    }
    for (const placeholder of item.placeholderFlags) {
      flags.push(flag("warning", "Accuracy against synopsis", placeholder, item.slideIndex));
    }
  }

  if (theme) {
    const bodyOnSurface = contrastRatio(theme.palette.neutralDark, theme.palette.surface);
    if (bodyOnSurface < 4.5) {
      flags.push(flag("warning", "Contrast and legibility", "Default body text color does not meet 4.5:1 contrast against the surface color — the export pipeline will substitute a safe fallback automatically."));
    }
  }

  flags.push(flag("info", "Image quality", "No licensed photography is embedded in this deck — slides rely on typography, shapes, and simple diagrams. Replace placeholder image frames before presenting if imagery is required."));

  const expectedInternal = deck.form.slideCount - 2;
  const actualInternal = deck.outline.filter((o) => o.role === "internal").length;
  if (actualInternal !== expectedInternal && deck.outline.length > 0) {
    flags.push(flag("critical", "Slide-to-slide consistency", `Expected ${expectedInternal} internal slides for a ${deck.form.slideCount}-slide deck, found ${actualInternal}.`));
  }

  return flags;
}

export function severityWeight(s: QaFlag["severity"]): number {
  return s === "critical" ? 0 : s === "warning" ? 1 : 2;
}
