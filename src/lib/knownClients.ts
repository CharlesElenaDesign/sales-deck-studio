/**
 * Curated client list for the TITAN Europe AI Showcase (source: David's brand list in the
 * "TITAN Europe AI Showcase" Teams chat, 27 Aug 2026, plus NatWest from a 1:1 on 25 Aug 2026).
 *
 * Colours are Charles Elena's reference values for each brand's primary identity, gathered
 * from public brand material. They are a reliable starting point that beats scraping a
 * homepage, but they are still labelled "approximated" downstream so the final AI platform
 * verifies against official guidelines before designing. Suggestions only: the intake form
 * always accepts any client name typed by hand.
 */

import { BrandProfile } from "./types";

export type KnownClientGroup = "Financial services" | "Manufacturing";

export interface KnownClient {
  id: string;
  name: string;
  /** Alternative spellings that should also match while typing. */
  aliases?: string[];
  group: KnownClientGroup;
  /** "showcase" = on David's list for the two events; "extended" = other large European accounts kept as a safety net. */
  tier: "showcase" | "extended";
  /** Event the brand was listed under. */
  event: string;
  website: string;
  /** Brand primary colour (hex). */
  primary: string;
  /** Brand secondary / accent colour (hex). */
  secondary: string;
  /** Short, plain-language colour description used in image prompts. */
  colorWords: string;
  /** A concrete visual cue for photographic image prompts (David's "orange jacket for ING" idea). */
  photoCue: string;
  /** Industry label used to pick photographic scene settings. */
  industry: string;
}

const FS_EVENT = "FS Europe — Amsterdam, 14–15 Sept 2026";
const MFG_EVENT = "CoreMfg Europe — Frankfurt, 22–23 Sept 2026";
const EXTENDED_EVENT = "Extended European account list (not on David's showcase list)";

/** Compact constructor for the extended tier; the photo cue is derived from the accent colour word. */
function ext(
  id: string,
  name: string,
  group: KnownClientGroup,
  industry: string,
  website: string,
  primary: string,
  secondary: string,
  colorWords: string,
  accentWord: string,
  aliases?: string[]
): KnownClient {
  return {
    id,
    name,
    aliases,
    group,
    tier: "extended",
    event: EXTENDED_EVENT,
    website,
    primary,
    secondary,
    colorWords,
    photoCue: `one subtle ${accentWord} accent object in the scene (a jacket, a cup, a panel) echoing ${name}'s signature ${accentWord}`,
    industry,
  };
}

export const KNOWN_CLIENTS: KnownClient[] = [
  // ── Financial services ──────────────────────────────────────────────────────
  { id: "danske", name: "Danske Bank", aliases: ["Danske"], group: "Financial services", tier: "showcase", event: FS_EVENT, website: "danskebank.com", primary: "#003755", secondary: "#009EDB", colorWords: "deep Danske navy with a clear sky-blue accent", photoCue: "a small navy-and-light-blue accent object (a notebook, a lanyard) echoing Danske Bank's blue", industry: "Financial services" },
  { id: "ing", name: "ING", aliases: ["ING Bank", "ING Group"], group: "Financial services", tier: "showcase", event: FS_EVENT, website: "ing.com", primary: "#FF6200", secondary: "#000066", colorWords: "vivid ING orange against deep indigo", photoCue: "one bright orange accent in the scene (an orange jacket, an orange cup) echoing ING's signature orange", industry: "Financial services" },
  { id: "rabobank", name: "Rabobank", aliases: ["Rabo"], group: "Financial services", tier: "showcase", event: FS_EVENT, website: "rabobank.com", primary: "#000099", secondary: "#FD6400", colorWords: "Rabobank royal blue with a warm orange accent", photoCue: "a royal-blue accent object with a touch of orange, echoing Rabobank's palette", industry: "Financial services" },
  { id: "ubs", name: "UBS", group: "Financial services", tier: "showcase", event: FS_EVENT, website: "ubs.com", primary: "#EC0016", secondary: "#000000", colorWords: "UBS red against black and warm grey", photoCue: "a single crisp red accent (a folder, a tie, a door frame) echoing UBS red", industry: "Financial services" },
  { id: "commerzbank", name: "Commerzbank", group: "Financial services", tier: "showcase", event: FS_EVENT, website: "commerzbank.com", primary: "#FFCC33", secondary: "#003E3E", colorWords: "Commerzbank yellow with deep petrol green", photoCue: "a warm yellow accent object (a chair, a mug) echoing Commerzbank yellow", industry: "Financial services" },
  { id: "deutsche-bank", name: "Deutsche Bank", aliases: ["DB"], group: "Financial services", tier: "showcase", event: FS_EVENT, website: "db.com", primary: "#0018A8", secondary: "#000000", colorWords: "Deutsche Bank cobalt blue against black", photoCue: "a strong cobalt-blue accent (a glass panel, a folder) echoing Deutsche Bank blue", industry: "Financial services" },
  { id: "abn-amro", name: "ABN AMRO", aliases: ["ABN", "ABN-AMRO"], group: "Financial services", tier: "showcase", event: FS_EVENT, website: "abnamro.com", primary: "#009286", secondary: "#FFD200", colorWords: "ABN AMRO teal green with a bright yellow accent", photoCue: "a teal-green accent with a small yellow detail, echoing ABN AMRO's green and yellow", industry: "Financial services" },
  { id: "natwest", name: "NatWest", aliases: ["NatWest Group", "National Westminster"], group: "Financial services", tier: "showcase", event: "Unlock AI keynote spin (David, 25 Aug 2026)", website: "natwest.com", primary: "#42145F", secondary: "#5A287D", colorWords: "NatWest deep purple with a lighter violet tint", photoCue: "a deep purple accent object (a scarf, a notebook, a wall panel) echoing NatWest purple", industry: "Financial services" },

  // ── Manufacturing ───────────────────────────────────────────────────────────
  { id: "volkswagen", name: "Volkswagen", aliases: ["VW", "Volkswagen Group"], group: "Manufacturing", tier: "showcase", event: MFG_EVENT, website: "volkswagen-group.com", primary: "#001E50", secondary: "#00B0F0", colorWords: "Volkswagen deep navy with a bright cyan accent", photoCue: "a deep navy accent with a touch of bright cyan light, echoing Volkswagen blue", industry: "Manufacturing / logistics" },
  { id: "mercedes-benz", name: "Mercedes-Benz", aliases: ["Daimler Benz", "Daimler", "Mercedes"], group: "Manufacturing", tier: "showcase", event: MFG_EVENT, website: "group.mercedes-benz.com", primary: "#000000", secondary: "#A4AAAE", colorWords: "Mercedes-Benz black with brushed silver", photoCue: "brushed-silver and black surfaces with a single chrome highlight, echoing Mercedes-Benz", industry: "Manufacturing / logistics" },
  { id: "daimler-truck", name: "Daimler Truck", aliases: ["Daimler Trucks"], group: "Manufacturing", tier: "showcase", event: MFG_EVENT, website: "daimlertruck.com", primary: "#00677F", secondary: "#1A1A1A", colorWords: "Daimler Truck petrol teal against charcoal", photoCue: "a petrol-teal accent (a work jacket, a signage panel) echoing Daimler Truck's teal", industry: "Manufacturing / logistics" },
  { id: "bmw", name: "BMW", aliases: ["BMW Group"], group: "Manufacturing", tier: "showcase", event: MFG_EVENT, website: "bmwgroup.com", primary: "#1C69D4", secondary: "#262626", colorWords: "BMW bright blue against near-black", photoCue: "a bright blue accent (a lit panel, a cable, a chair) echoing BMW blue", industry: "Manufacturing / logistics" },
  { id: "kone", name: "KONE", aliases: ["Kone"], group: "Manufacturing", tier: "showcase", event: MFG_EVENT, website: "kone.com", primary: "#0071B9", secondary: "#6E6E6E", colorWords: "KONE blue with cool mid-grey", photoCue: "a clear blue accent in a modern building lobby or lift interior, echoing KONE blue", industry: "Manufacturing / logistics" },
  { id: "toyota-europe", name: "Toyota Motor Europe", aliases: ["Toyota", "Toyota Europe"], group: "Manufacturing", tier: "showcase", event: MFG_EVENT, website: "toyota-europe.com", primary: "#EB0A1E", secondary: "#58595B", colorWords: "Toyota red against neutral grey", photoCue: "one crisp red accent (a toolbox, a safety rail, a sign) echoing Toyota red", industry: "Manufacturing / logistics" },
  { id: "metsa", name: "Metsä Group", aliases: ["Metsa", "Metsä"], group: "Manufacturing", tier: "showcase", event: MFG_EVENT, website: "metsagroup.com", primary: "#007B3E", secondary: "#8CC63F", colorWords: "Metsä forest green with a fresh leaf-green accent", photoCue: "a forest-green accent and natural timber textures, echoing Metsä's Nordic forest identity", industry: "Manufacturing / logistics" },
  { id: "airbus", name: "Airbus", group: "Manufacturing", tier: "showcase", event: MFG_EVENT, website: "airbus.com", primary: "#00205B", secondary: "#6399AE", colorWords: "Airbus deep navy with a steel-blue accent", photoCue: "a deep navy accent and a steel-blue sky tone, echoing Airbus blue", industry: "Manufacturing / logistics" },
  { id: "volvo", name: "Volvo Group", aliases: ["Volvo", "Volvo Trucks"], group: "Manufacturing", tier: "showcase", event: MFG_EVENT, website: "volvogroup.com", primary: "#003057", secondary: "#1F3B5A", colorWords: "Volvo dark blue with a slate-blue tint", photoCue: "a dark-blue accent object (a jacket, a dashboard glow) echoing Volvo blue", industry: "Manufacturing / logistics" },
  { id: "siemens", name: "Siemens", aliases: ["Siemens AG"], group: "Manufacturing", tier: "showcase", event: MFG_EVENT, website: "siemens.com", primary: "#009999", secondary: "#000028", colorWords: "Siemens petrol with deep midnight blue", photoCue: "a petrol-teal accent light or panel against a dark backdrop, echoing Siemens petrol", industry: "Manufacturing / logistics" },

  // ── Extended European list (safety net beyond David's showcase list) ────────
  ext("hsbc", "HSBC", "Financial services", "Financial services", "hsbc.com", "#DB0011", "#000000", "HSBC red against black and white", "red", ["HSBC Holdings"]),
  ext("barclays", "Barclays", "Financial services", "Financial services", "barclays.com", "#00AEEF", "#00395D", "Barclays cyan blue with deep navy", "cyan blue"),
  ext("lloyds", "Lloyds Banking Group", "Financial services", "Financial services", "lloydsbankinggroup.com", "#006A4D", "#0F3B2B", "Lloyds deep green with darker forest green", "green", ["Lloyds", "Lloyds Bank"]),
  ext("standard-chartered", "Standard Chartered", "Financial services", "Financial services", "sc.com", "#0473EA", "#38D200", "Standard Chartered blue with a bright green accent", "blue", ["StanChart", "SCB"]),
  ext("santander", "Santander", "Financial services", "Financial services", "santander.com", "#EC0000", "#1B1B1B", "Santander red against charcoal", "red", ["Banco Santander"]),
  ext("bbva", "BBVA", "Financial services", "Financial services", "bbva.com", "#072146", "#1973B8", "BBVA midnight navy with a mid blue", "navy"),
  ext("caixabank", "CaixaBank", "Financial services", "Financial services", "caixabank.com", "#007EAE", "#2F3A44", "CaixaBank blue with slate grey", "blue", ["Caixa"]),
  ext("bnp-paribas", "BNP Paribas", "Financial services", "Financial services", "group.bnpparibas", "#00915A", "#1D1D1B", "BNP Paribas green against near-black", "green", ["BNP"]),
  ext("societe-generale", "Société Générale", "Financial services", "Financial services", "societegenerale.com", "#E60028", "#000000", "Société Générale red against black", "red", ["Societe Generale", "SocGen", "SG"]),
  ext("credit-agricole", "Crédit Agricole", "Financial services", "Financial services", "credit-agricole.com", "#009597", "#E30613", "Crédit Agricole teal green with a red accent", "teal", ["Credit Agricole", "CA"]),
  ext("unicredit", "UniCredit", "Financial services", "Financial services", "unicreditgroup.eu", "#E2001A", "#000000", "UniCredit red against black", "red"),
  ext("intesa-sanpaolo", "Intesa Sanpaolo", "Financial services", "Financial services", "group.intesasanpaolo.com", "#007A5E", "#F58220", "Intesa Sanpaolo green with an orange accent", "green", ["Intesa"]),
  ext("nordea", "Nordea", "Financial services", "Financial services", "nordea.com", "#0000A0", "#00005E", "Nordea deep blue with midnight blue", "blue"),
  ext("seb", "SEB", "Financial services", "Financial services", "sebgroup.com", "#60CD18", "#007AC7", "SEB fresh green with a clear blue", "green", ["Skandinaviska Enskilda Banken"]),
  ext("swedbank", "Swedbank", "Financial services", "Financial services", "swedbank.com", "#FF5F00", "#3B1E1E", "Swedbank orange against dark brown", "orange"),
  ext("dnb", "DNB", "Financial services", "Financial services", "dnb.no", "#007272", "#14555A", "DNB sea green with a darker teal", "sea green", ["DNB Bank"]),
  ext("kbc", "KBC", "Financial services", "Financial services", "kbc.com", "#00AEEF", "#003665", "KBC light blue with navy", "light blue", ["KBC Group"]),
  ext("erste", "Erste Group", "Financial services", "Financial services", "erstegroup.com", "#2870ED", "#143C8C", "Erste bright blue with a deeper blue", "blue", ["Erste", "Erste Bank"]),
  ext("allianz", "Allianz", "Financial services", "Financial services", "allianz.com", "#003781", "#49648C", "Allianz deep blue with steel blue", "blue"),
  ext("axa", "AXA", "Financial services", "Financial services", "axa.com", "#00008F", "#FF1721", "AXA deep blue with a red diagonal accent", "blue"),
  ext("zurich", "Zurich Insurance", "Financial services", "Financial services", "zurich.com", "#2167AE", "#1B365D", "Zurich blue with a deeper navy", "blue", ["Zurich"]),
  ext("generali", "Generali", "Financial services", "Financial services", "generali.com", "#C5281C", "#4B4B4B", "Generali red against dark grey", "red"),
  ext("munich-re", "Munich Re", "Financial services", "Financial services", "munichre.com", "#00457C", "#7FB2D6", "Munich Re deep blue with a pale sky blue", "blue", ["Munich Reinsurance"]),
  ext("aviva", "Aviva", "Financial services", "Financial services", "aviva.com", "#FFD900", "#004FB6", "Aviva yellow with a strong blue", "yellow"),
  ext("bosch", "Bosch", "Manufacturing", "Manufacturing / logistics", "bosch.com", "#E20015", "#005691", "Bosch red with a deep blue", "red", ["Robert Bosch"]),
  ext("continental", "Continental", "Manufacturing", "Manufacturing / logistics", "continental.com", "#FFA500", "#000000", "Continental orange against black", "orange", ["Conti"]),
  ext("zf", "ZF", "Manufacturing", "Manufacturing / logistics", "zf.com", "#0B5DA3", "#262626", "ZF blue against charcoal", "blue", ["ZF Friedrichshafen", "ZF Group"]),
  ext("schaeffler", "Schaeffler", "Manufacturing", "Manufacturing / logistics", "schaeffler.com", "#00893D", "#1D1D1B", "Schaeffler green against near-black", "green"),
  ext("stellantis", "Stellantis", "Manufacturing", "Manufacturing / logistics", "stellantis.com", "#243882", "#00A3E0", "Stellantis deep blue with a bright cyan", "blue"),
  ext("renault", "Renault Group", "Manufacturing", "Manufacturing / logistics", "renaultgroup.com", "#FFCC33", "#000000", "Renault yellow against black", "yellow", ["Renault"]),
  ext("scania", "Scania", "Manufacturing", "Manufacturing / logistics", "scania.com", "#041E42", "#E30613", "Scania midnight navy with a red griffin accent", "navy"),
  ext("man", "MAN Truck & Bus", "Manufacturing", "Manufacturing / logistics", "man.eu", "#E4032E", "#303030", "MAN red against dark grey", "red", ["MAN", "MAN Trucks"]),
  ext("rolls-royce", "Rolls-Royce", "Manufacturing", "Manufacturing / logistics", "rolls-royce.com", "#10069F", "#0E0E0E", "Rolls-Royce deep blue against black", "deep blue", ["Rolls Royce", "Rolls-Royce plc"]),
  ext("safran", "Safran", "Manufacturing", "Manufacturing / logistics", "safran-group.com", "#002F87", "#009DE0", "Safran navy with a bright sky blue", "blue"),
  ext("thales", "Thales", "Manufacturing", "Manufacturing / logistics", "thalesgroup.com", "#242A75", "#00A4E4", "Thales indigo with a bright cyan", "indigo", ["Thales Group"]),
  ext("leonardo", "Leonardo", "Manufacturing", "Manufacturing / logistics", "leonardo.com", "#E31937", "#1E1E1E", "Leonardo red against charcoal", "red", ["Leonardo S.p.A."]),
  ext("abb", "ABB", "Manufacturing", "Manufacturing / logistics", "global.abb", "#FF000F", "#000000", "ABB red against black", "red"),
  ext("schneider-electric", "Schneider Electric", "Manufacturing", "Manufacturing / logistics", "se.com", "#3DCD58", "#1A1A1A", "Schneider Electric life green against charcoal", "green", ["Schneider"]),
  ext("philips", "Philips", "Manufacturing", "Manufacturing / logistics", "philips.com", "#0B5ED7", "#1E1E1E", "Philips blue against charcoal", "blue", ["Royal Philips"]),
  ext("nokia", "Nokia", "Manufacturing", "Manufacturing / logistics", "nokia.com", "#124191", "#001135", "Nokia blue with midnight navy", "blue"),
  ext("ericsson", "Ericsson", "Manufacturing", "Manufacturing / logistics", "ericsson.com", "#0082F0", "#002561", "Ericsson bright blue with deep navy", "blue"),
  ext("basf", "BASF", "Manufacturing", "Manufacturing / logistics", "basf.com", "#21A0D2", "#004A96", "BASF light blue with a deep blue", "light blue"),
  ext("bayer", "Bayer", "Manufacturing", "Manufacturing / logistics", "bayer.com", "#10384F", "#89D329", "Bayer deep teal with a bright green accent", "teal"),
  ext("sandvik", "Sandvik", "Manufacturing", "Manufacturing / logistics", "home.sandvik", "#003473", "#6A737B", "Sandvik navy with steel grey", "navy"),
  ext("atlas-copco", "Atlas Copco", "Manufacturing", "Manufacturing / logistics", "atlascopcogroup.com", "#0098DB", "#1B365D", "Atlas Copco blue with a deep navy", "blue", ["Atlas Copco Group"]),
  ext("heidelberg-materials", "Heidelberg Materials", "Manufacturing", "Manufacturing / logistics", "heidelbergmaterials.com", "#00573F", "#A5C400", "Heidelberg Materials deep green with a lime accent", "green", ["HeidelbergCement"]),
  ext("orsted", "Ørsted", "Manufacturing", "Manufacturing / logistics", "orsted.com", "#0A2C5C", "#4CA0D9", "Ørsted navy with a clear sky blue", "navy", ["Orsted"]),
  ext("vestas", "Vestas", "Manufacturing", "Manufacturing / logistics", "vestas.com", "#00295B", "#0C6BB6", "Vestas deep blue with a mid blue", "blue"),
];

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function findKnownClientById(id: string | undefined): KnownClient | undefined {
  if (!id) return undefined;
  return KNOWN_CLIENTS.find((c) => c.id === id);
}

/** Exact match on name or alias (case/punctuation-insensitive). Used when the user types a name by hand. */
export function matchKnownClient(name: string): KnownClient | undefined {
  const n = norm(name);
  if (!n) return undefined;
  return KNOWN_CLIENTS.find((c) => norm(c.name) === n || (c.aliases ?? []).some((a) => norm(a) === n));
}

/**
 * Suggestions while typing. With fewer than two characters only David's showcase list shows
 * (short and scannable); from two characters on, the extended list joins the matches.
 */
export function suggestKnownClients(query: string): KnownClient[] {
  const q = norm(query);
  const pool = q.length >= 2 ? KNOWN_CLIENTS : KNOWN_CLIENTS.filter((c) => c.tier === "showcase");
  if (!q) return pool;
  return pool.filter((c) => norm(c.name).includes(q) || (c.aliases ?? []).some((a) => norm(a).includes(q)));
}

/** Brand profile seeded from the curated list, used before (and merged with) live research. */
export function brandProfileFromKnownClient(client: KnownClient): BrandProfile {
  const now = new Date().toISOString();
  return {
    companyName: client.name,
    domain: client.website,
    colors: [
      { hex: client.primary, label: "Curated primary (Charles Elena reference)" },
      { hex: client.secondary, label: "Curated secondary (Charles Elena reference)" },
    ],
    fonts: [],
    sources: [{ label: `Charles Elena curated brand reference — ${client.event}`, url: `https://${client.website}`, accessedAt: now }],
    confidence: "approximated",
    notes: [
      `Colours come from Charles Elena's curated reference for ${client.name} (${client.colorWords}); verify against official brand guidelines before finalising.`,
    ],
    fetchedAt: now,
  };
}

/** Keeps the curated colours in front, appends whatever live research found (sources, fonts, favicon). */
export function mergeKnownClientIntoProfile(client: KnownClient, researched: BrandProfile): BrandProfile {
  const curated = brandProfileFromKnownClient(client);
  const extraColors = researched.colors.filter((c) => !curated.colors.some((k) => k.hex.toLowerCase() === c.hex.toLowerCase()));
  return {
    ...researched,
    companyName: curated.companyName,
    domain: researched.domain ?? curated.domain,
    colors: [...curated.colors, ...extraColors.map((c) => ({ ...c, label: `${c.label} (live scan, secondary evidence)` }))],
    sources: [...curated.sources, ...researched.sources],
    confidence: "approximated",
    notes: [...curated.notes, ...researched.notes],
    error: undefined,
  };
}
