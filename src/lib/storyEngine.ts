import { hexToHue, isValidHex } from "./colorUtils";
import { DIRECTIONS, FALLBACK_DIRECTION_IDS, findDirection, DirectionTemplate, ToneVariantIndex } from "./sampleData";
import { BrandProfile, StoryOption } from "./types";

export function extractHook(synopsis: string): string {
  const trimmed = synopsis.trim();
  if (!trimmed) return "the situation described in the synopsis.";
  const sentences = trimmed.split(/(?<=[.!?])\s+/).filter(Boolean);
  let hook = sentences[0] || trimmed;
  if (hook.length < 60 && sentences[1]) hook += " " + sentences[1];
  if (hook.length > 220) hook = hook.slice(0, 217).trimEnd() + "…";
  if (!/[.!?…]$/.test(hook)) hook += ".";
  return hook;
}

/** A second, distinct sentence from the synopsis (beyond the primary hook) so generated
 * stories draw on more of what the user actually wrote, not just its opening line. */
export function extractSecondaryDetail(synopsis: string, primaryHook: string): string | undefined {
  const trimmed = synopsis.trim();
  if (!trimmed) return undefined;
  const sentences = trimmed.split(/(?<=[.!?])\s+/).filter(Boolean);
  const candidate = sentences.find((s) => s.length > 20 && !primaryHook.includes(s.trim()));
  if (!candidate) return undefined;
  let detail = candidate.trim();
  if (detail.length > 180) detail = detail.slice(0, 177).trimEnd() + "…";
  if (!/[.!?…]$/.test(detail)) detail += ".";
  return detail;
}

function scoreDirection(dir: DirectionTemplate, text: string): number {
  const lower = text.toLowerCase();
  return dir.keywords.reduce((score, kw) => score + (lower.includes(kw.toLowerCase()) ? 1 : 0), 0);
}

export function rankDirections(synopsis: string, notes?: string): { dir: DirectionTemplate; score: number }[] {
  const text = `${synopsis} ${notes ?? ""}`;
  const scored = DIRECTIONS.map((d) => ({ dir: d, score: scoreDirection(d, text) }));
  scored.sort((a, b) => b.score - a.score);
  return scored;
}

export function pickDirectionIds(
  synopsis: string,
  notes: string | undefined,
  count: number,
  exclude: string[] = []
): string[] {
  const ranked = rankDirections(synopsis, notes).filter((r) => !exclude.includes(r.dir.id));
  const withSignal = ranked.filter((r) => r.score > 0).map((r) => r.dir.id);
  const picks: string[] = [...withSignal];
  const fillers = [...FALLBACK_DIRECTION_IDS, ...ranked.map((r) => r.dir.id)].filter(
    (id) => !exclude.includes(id) && !picks.includes(id)
  );
  for (const id of fillers) {
    if (picks.length >= count) break;
    picks.push(id);
  }
  return picks.slice(0, count);
}

/** Buckets a hue into which of the 3 tone variants (0=direct/measured, 1=warm/consultative,
 * 2=bold/ambitious) it leans toward — a lightweight, honestly-approximate nod to the
 * client's own brand energy, not a real brand-voice analysis. */
function hueLean(hue: number): ToneVariantIndex {
  if (hue >= 170 && hue <= 260) return 0; // blues/cyans -> direct, measured
  if ((hue >= 260 && hue < 330) || (hue >= 50 && hue < 170)) return 1; // purples/greens -> warm, consultative
  return 2; // reds/oranges/yellows/pinks -> bold, ambitious
}

/** Weighted pick: 60% chance of the brand-color lean (when available), otherwise spread
 * across the remaining variants — so results visibly vary across regenerations while
 * still nodding to the client's own visual energy more often than not. */
function pickToneVariant(clientBrand: BrandProfile | undefined): ToneVariantIndex {
  const firstColor = clientBrand?.colors.find((c) => isValidHex(c.hex))?.hex;
  const lean = firstColor ? hueLean(hexToHue(firstColor)) : undefined;
  if (lean === undefined) {
    return Math.floor(Math.random() * 3) as ToneVariantIndex;
  }
  if (Math.random() < 0.6) return lean;
  const others = ([0, 1, 2] as ToneVariantIndex[]).filter((v) => v !== lean);
  return others[Math.floor(Math.random() * others.length)];
}

function buildStoryOption(dir: DirectionTemplate, client: string, synopsis: string, clientBrand: BrandProfile | undefined): StoryOption {
  const hook = extractHook(synopsis);
  const secondaryDetail = extractSecondaryDetail(synopsis, hook);
  const variant = pickToneVariant(clientBrand);
  const challengeBase = dir.challenge(client, hook);
  const challenge = secondaryDetail ? `${challengeBase} ${secondaryDetail}` : challengeBase;

  return {
    id: `${dir.id}-${Math.random().toString(36).slice(2, 8)}`,
    direction: dir.id,
    directionLabel: dir.label,
    name: dir.nameTemplate(client),
    centralIdea: dir.centralIdeaVariants[variant](client, hook),
    challenge,
    change: dir.change(client, hook),
    valueOutcome: dir.valueOutcomeVariants[variant](client),
    progression: dir.progression.map((p) => ({ ...p })),
    assertionHeadlines: dir.assertionHeadlines.map((fn) => fn(client)),
    relevance: dir.relevance(client, hook),
    assumptions: dir.assumptions(client),
  };
}

export function generateStoryOptions(
  client: string,
  synopsis: string,
  notes?: string,
  exclude: string[] = [],
  clientBrand?: BrandProfile
): StoryOption[] {
  const ids = pickDirectionIds(synopsis, notes, 3, exclude);
  return ids.map((id) => buildStoryOption(findDirection(id), client, synopsis, clientBrand));
}

export function regenerateAllStoryOptions(
  client: string,
  synopsis: string,
  notes: string | undefined,
  currentDirectionIds: string[],
  clientBrand?: BrandProfile
): StoryOption[] {
  let ids = pickDirectionIds(synopsis, notes, 3, currentDirectionIds);
  if (ids.length < 3) {
    // exhausted the bank without repeats — wrap around
    const need = 3 - ids.length;
    const wrap = pickDirectionIds(synopsis, notes, need, ids);
    ids = [...ids, ...wrap];
  }
  return ids.map((id) => buildStoryOption(findDirection(id), client, synopsis, clientBrand));
}

export function generateOneMoreDirection(
  client: string,
  synopsis: string,
  notes: string | undefined,
  currentDirectionIds: string[],
  clientBrand?: BrandProfile
): StoryOption {
  const [id] = pickDirectionIds(synopsis, notes, 1, currentDirectionIds);
  const fallbackId = id ?? DIRECTIONS.find((d) => !currentDirectionIds.includes(d.id))?.id ?? DIRECTIONS[0].id;
  return buildStoryOption(findDirection(fallbackId), client, synopsis, clientBrand);
}
