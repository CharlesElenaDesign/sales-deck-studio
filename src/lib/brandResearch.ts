import { BrandColor, BrandProfile, BrandSource } from "./types";

const KNOWN_DOMAINS: Record<string, string> = {
  infosys: "https://www.infosys.com",
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "")
    .replace(/(incorporated|limited|holdings|corporation|group|pty|ltd|inc|llc|corp|plc|co)$/i, "");
}

function candidateUrls(name: string, explicitUrl?: string): string[] {
  if (explicitUrl && explicitUrl.trim()) {
    const trimmed = explicitUrl.trim();
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    return [withProtocol];
  }
  const known = KNOWN_DOMAINS[name.toLowerCase().trim()];
  if (known) return [known];
  const slug = slugify(name);
  if (!slug) return [];
  return [`https://www.${slug}.com`, `https://${slug}.com`];
}

const BLOCKED_HOSTS = new Set(["localhost", "0.0.0.0", "127.0.0.1", "::1"]);

function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(h)) return true;
  if (h.endsWith(".local") || h.endsWith(".internal")) return true;
  const ipv4 = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 169 && b === 254) return true;
  }
  return false;
}

function isSafeUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    if (isPrivateHost(u.hostname)) return false;
    return true;
  } catch {
    return false;
  }
}

async function fetchWithTimeout(url: string, timeoutMs = 7000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SalesDeckStudio/1.0; +brand-research)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

function extractTag(html: string, regex: RegExp): string | undefined {
  const m = html.match(regex);
  return m ? m[1] : undefined;
}

function resolveUrl(base: string, maybeRelative: string): string {
  try {
    return new URL(maybeRelative, base).toString();
  } catch {
    return maybeRelative;
  }
}

function normalizeHex(hex: string): string {
  const withHash = hex.startsWith("#") ? hex : `#${hex}`;
  const digits = withHash.slice(1);
  const expanded = digits.length === 3 ? digits.split("").map((c) => c + c).join("") : digits;
  return `#${expanded}`;
}

const NEUTRAL_HEXES = new Set(["#ffffff", "#000000", "#fefefe", "#010101"]);

function isValidHexString(hex: string | undefined): hex is string {
  return !!hex && /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(hex);
}

/**
 * Colors a site's own developers explicitly declared as "this is our brand color" —
 * meta theme-color, Windows tile color, Safari pinned-tab mask-icon — are far more
 * trustworthy than whatever hex happens to appear most often in the page's CSS (which
 * is easily a CTA button or a promo banner, not the actual brand color).
 */
function extractDeclaredColors(html: string): BrandColor[] {
  const colors: BrandColor[] = [];

  const themeColor = extractTag(html, /<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i);
  if (isValidHexString(themeColor)) colors.push({ hex: normalizeHex(themeColor), label: "Declared meta theme-color" });

  const tileColor = extractTag(html, /<meta[^>]+name=["']msapplication-TileColor["'][^>]+content=["']([^"']+)["']/i);
  if (isValidHexString(tileColor)) colors.push({ hex: normalizeHex(tileColor), label: "Declared Windows tile color" });

  const maskIconColor = extractTag(html, /<link[^>]+rel=["']mask-icon["'][^>]+color=["']([^"']+)["']/i);
  if (isValidHexString(maskIconColor)) colors.push({ hex: normalizeHex(maskIconColor), label: "Declared Safari pinned-tab color" });

  return colors.filter((c) => !NEUTRAL_HEXES.has(c.hex.toLowerCase()));
}

/** Best-effort: the site's own web app manifest often declares theme_color/background_color
 * explicitly — another strong, developer-declared signal rather than a guess. */
async function fetchManifestColors(html: string, baseUrl: string): Promise<BrandColor[]> {
  const manifestHref = extractTag(html, /<link[^>]+rel=["']manifest["'][^>]+href=["']([^"']+)["']/i);
  if (!manifestHref) return [];
  const manifestUrl = resolveUrl(baseUrl, manifestHref);
  if (!isSafeUrl(manifestUrl)) return [];
  try {
    const res = await fetchWithTimeout(manifestUrl, 4000);
    if (!res.ok) return [];
    const json = (await res.json()) as { theme_color?: string; background_color?: string };
    const colors: BrandColor[] = [];
    if (isValidHexString(json.theme_color)) colors.push({ hex: normalizeHex(json.theme_color), label: "Declared in web app manifest (theme_color)" });
    if (isValidHexString(json.background_color)) colors.push({ hex: normalizeHex(json.background_color), label: "Declared in web app manifest (background_color)" });
    return colors.filter((c) => !NEUTRAL_HEXES.has(c.hex.toLowerCase()));
  } catch {
    return [];
  }
}

function extractFrequentColors(html: string): BrandColor[] {
  const hexMatches = html.match(/#[0-9a-fA-F]{6}\b/g) || [];
  const freq = new Map<string, number>();
  for (const raw of hexMatches) {
    const hex = normalizeHex(raw).toLowerCase();
    if (NEUTRAL_HEXES.has(hex)) continue;
    freq.set(hex, (freq.get(hex) || 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hex], i) => ({ hex, label: i === 0 ? "Most frequent on-page color (weaker signal — may be incidental)" : "Frequently used on-page color (weaker signal — may be incidental)" }));
}

async function extractColors(html: string, baseUrl: string): Promise<BrandColor[]> {
  const declared = extractDeclaredColors(html);
  const manifest = await fetchManifestColors(html, baseUrl);
  const colors: BrandColor[] = [...manifest, ...declared];

  if (colors.length < 3) {
    for (const c of extractFrequentColors(html)) {
      if (!colors.find((existing) => existing.hex.toLowerCase() === c.hex.toLowerCase())) colors.push(c);
      if (colors.length >= 5) break;
    }
  }

  return colors.slice(0, 5);
}

function extractFonts(html: string): string[] {
  const fonts = new Set<string>();
  for (const m of html.matchAll(/fonts\.googleapis\.com\/css2?\?family=([^"'&]+)/gi)) {
    const family = decodeURIComponent(m[1]).split(":")[0].replace(/\+/g, " ").trim();
    if (family) fonts.add(family);
  }
  for (const m of html.matchAll(/font-family:\s*["']?([A-Za-z0-9 \-]+)["']?/gi)) {
    const f = m[1].trim();
    if (f && !/^(inherit|initial|sans-serif|serif|monospace|arial|helvetica|system-ui)$/i.test(f)) {
      fonts.add(f);
    }
  }
  return [...fonts].slice(0, 4);
}

function extractFavicon(html: string, baseUrl: string): string | undefined {
  const iconHref =
    extractTag(
      html,
      /<link[^>]+rel=["'](?:shortcut icon|icon|apple-touch-icon)["'][^>]+href=["']([^"']+)["']/i
    ) ||
    extractTag(
      html,
      /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut icon|icon|apple-touch-icon)["']/i
    );
  return iconHref ? resolveUrl(baseUrl, iconHref) : undefined;
}

function extractTitle(html: string): string | undefined {
  return extractTag(html, /<title[^>]*>([^<]*)<\/title>/i)?.trim();
}

export async function researchBrand(companyName: string, explicitUrl?: string): Promise<BrandProfile> {
  const now = new Date().toISOString();
  const candidates = candidateUrls(companyName, explicitUrl).filter(isSafeUrl);

  if (candidates.length === 0) {
    return {
      companyName,
      colors: [],
      fonts: [],
      sources: [],
      confidence: "unavailable",
      notes: [
        "Could not derive a public website to research from the company name alone.",
        "Provide the company's website address, or upload brand guidelines, to enable research.",
      ],
      fetchedAt: now,
    };
  }

  let lastError: string | undefined;
  for (const url of candidates) {
    try {
      const res = await fetchWithTimeout(url);
      if (!res.ok) {
        lastError = `${url} responded with HTTP ${res.status}`;
        continue;
      }
      const html = await res.text();
      const finalUrl = isSafeUrl(res.url) ? res.url : url;
      const colors = await extractColors(html, finalUrl);
      const fonts = extractFonts(html);
      const favicon = extractFavicon(html, finalUrl);
      const title = extractTitle(html);

      const source: BrandSource = {
        label: `${companyName} — official website homepage`,
        url: finalUrl,
        accessedAt: now,
      };

      const hasDeclaredColor = colors.some((c) => c.label.startsWith("Declared"));
      const notes = [
        hasDeclaredColor
          ? "Colors marked \"Declared\" come from the site's own metadata (theme-color, manifest, or pinned-tab icon) — a stronger signal than page styling, but still not an official brand guideline document."
          : "No developer-declared brand color (meta theme-color, manifest, pinned-tab icon) was found — colors below are inferred from frequent on-page styling and may be incidental (a button or banner color) rather than the true brand color. Verify against an official source before finalizing.",
      ];
      if (colors.length === 0) notes.push("No distinct on-page colors could be detected; a neutral palette will be used instead.");
      if (fonts.length === 0) notes.push("No custom web fonts were detected on the homepage markup.");

      return {
        companyName,
        domain: finalUrl,
        faviconUrl: favicon,
        colors,
        fonts,
        titleTagText: title,
        sources: [source],
        confidence: "approximated",
        notes,
        fetchedAt: now,
      };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }

  return {
    companyName,
    colors: [],
    fonts: [],
    sources: [],
    confidence: "unavailable",
    notes: [
      `Could not automatically reach an official website (${lastError ?? "unknown error"}).`,
      "Upload brand guidelines, or provide the correct website address, to continue — otherwise a neutral, clearly-labelled approximation will be used.",
    ],
    fetchedAt: now,
    error: lastError,
  };
}
