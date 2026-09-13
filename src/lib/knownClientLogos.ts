/**
 * Logo files for the curated client list (plus Infosys), saved under public/logos/. `source` is the public
 * URL each file came from (Wikimedia Commons / company site), recorded in public/logos/SOURCES.json.
 * Trademarks belong to their owners; used here only to preview a co-branded pitch for that client.
 */
export interface LogoAsset {
  /** Path served by this app, e.g. /logos/ing.svg */
  path: string;
  /** Public URL the file was retrieved from — usable by an AI platform with web access. */
  source: string;
}

export const KNOWN_CLIENT_LOGOS: Record<string, LogoAsset> = {
  "danske": { path: "/logos/danske.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Danske_Bank_Logo.svg" },
  "ing": { path: "/logos/ing.svg", source: "https://ing.com/webfiles/1788951119972/images/ing-logo.svg" },
  "rabobank": { path: "/logos/rabobank.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Rabobank%20text%20logo.svg" },
  "ubs": { path: "/logos/ubs.png", source: "https://commons.wikimedia.org/wiki/Special:FilePath/UBS%20Logo.png" },
  "commerzbank": { path: "/logos/commerzbank.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Commerzbank_%282009%29.svg" },
  "deutsche-bank": { path: "/logos/deutsche-bank.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Deutsche_Bank_logo.svg" },
  "abn-amro": { path: "/logos/abn-amro.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/ABN_AMRO_logo.svg" },
  "natwest": { path: "/logos/natwest.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Natwest%202014%20logo.svg" },
  "volkswagen": { path: "/logos/volkswagen.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Volkswagen_Group_Logo_2023.svg" },
  "mercedes-benz": { path: "/logos/mercedes-benz.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-Benz_Group_black.svg" },
  "daimler-truck": { path: "/logos/daimler-truck.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Daimler_Truck_Logo.svg" },
  "bmw": { path: "/logos/bmw.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Logo_BMW_Group_2021.svg" },
  "kone": { path: "/logos/kone.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Kone_Logo_2023.svg" },
  "toyota-europe": { path: "/logos/toyota-europe.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_carlogo.svg" },
  "metsa": { path: "/logos/metsa.png", source: "https://commons.wikimedia.org/wiki/Special:FilePath/File%3AMetsa_Horiz_Logo_Color_RGB_transp.png" },
  "airbus": { path: "/logos/airbus.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Airbus_Logo_2017.svg" },
  "volvo": { path: "/logos/volvo.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Volvo-Spread-Word-Mark-Black.svg" },
  "siemens": { path: "/logos/siemens.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Siemens_AG_logo.svg" },
  "hsbc": { path: "/logos/hsbc.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/HSBC_logo_%282018%29.svg" },
  "barclays": { path: "/logos/barclays.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Barclays%20wordmark.svg" },
  "lloyds": { path: "/logos/lloyds.png", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Lloyds_Banking_Group_Plc.png" },
  "standard-chartered": { path: "/logos/standard-chartered.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Standard_Chartered_%282021%29.svg" },
  "santander": { path: "/logos/santander.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Banco_Santander_Logotipo.svg" },
  "bbva": { path: "/logos/bbva.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/BBVA_logo_2025.svg" },
  "caixabank": { path: "/logos/caixabank.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Logo%20CaixaBank.svg" },
  "bnp-paribas": { path: "/logos/bnp-paribas.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/BNP_Paribas_logo.svg" },
  "societe-generale": { path: "/logos/societe-generale.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Soci%C3%A9t%C3%A9_G%C3%A9n%C3%A9rale.svg" },
  "credit-agricole": { path: "/logos/credit-agricole.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Cr%C3%A9dit%20Agricole%202020%20logo.svg" },
  "unicredit": { path: "/logos/unicredit.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Unicredit_logo.svg" },
  "intesa-sanpaolo": { path: "/logos/intesa-sanpaolo.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Intesa%20Sanpaolo%20logo.svg" },
  "nordea": { path: "/logos/nordea.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Nordea%20logo.svg" },
  "seb": { path: "/logos/seb.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/SEB_Logo.svg" },
  "swedbank": { path: "/logos/swedbank.svg", source: "https://www.swedbank.com/content/dam/global/brand/logotypes/8999-swedbank-logo-default.svg" },
  "dnb": { path: "/logos/dnb.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/DNB_logo.svg" },
  "kbc": { path: "/logos/kbc.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/KBC_logo.svg" },
  "erste": { path: "/logos/erste.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Logo_Erste_Group_2023.svg" },
  "allianz": { path: "/logos/allianz.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Allianz.svg" },
  "axa": { path: "/logos/axa.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/AXA_Logo.svg" },
  "zurich": { path: "/logos/zurich.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Zurich_Insurance_Group_logo.svg" },
  "generali": { path: "/logos/generali.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Generali%20wordmark%20logo.svg" },
  "munich-re": { path: "/logos/munich-re.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/M%C3%BCnchener%20R%C3%BCck%20logo.svg" },
  "aviva": { path: "/logos/aviva.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Aviva_Logo.svg" },
  "bosch": { path: "/logos/bosch.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Bosch-logo.svg" },
  "continental": { path: "/logos/continental.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Continental_logo.svg" },
  "zf": { path: "/logos/zf.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/ZF_logo_STD_Blue_3CC.svg" },
  "schaeffler": { path: "/logos/schaeffler.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Schaeffler_logo.svg" },
  "stellantis": { path: "/logos/stellantis.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Stellantis.svg" },
  "renault": { path: "/logos/renault.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/2021_Renault_Group_logo.svg" },
  "scania": { path: "/logos/scania.svg", source: "https://www.scania.com/etc.clientlibs/scania-clientlibs/clientlibs/clientlib-site/resources/logotype/1.0.0/scania_symbol/scania-symbol.svg" },
  "man": { path: "/logos/man.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/MAN_Truck_%26_Bus_-_Logo.svg" },
  "rolls-royce": { path: "/logos/rolls-royce.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Rolls_royce_holdings_logo.svg" },
  "safran": { path: "/logos/safran.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Logo%20Safran.svg" },
  "thales": { path: "/logos/thales.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Thales_Logo.svg" },
  "leonardo": { path: "/logos/leonardo.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Logo_Leonardo.svg" },
  "abb": { path: "/logos/abb.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/ABB_logo.svg" },
  "schneider-electric": { path: "/logos/schneider-electric.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Schneider_Electric_2007.svg" },
  "philips": { path: "/logos/philips.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Philips_logo_new.svg" },
  "nokia": { path: "/logos/nokia.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Nokia_2023.svg" },
  "ericsson": { path: "/logos/ericsson.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Ericsson_%282018%29.svg" },
  "basf": { path: "/logos/basf.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/BASF-Logo_bw.svg" },
  "bayer": { path: "/logos/bayer.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Logo_Bayer.svg" },
  "sandvik": { path: "/logos/sandvik.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/SANDVIK.svg" },
  "atlas-copco": { path: "/logos/atlas-copco.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Atlas_Copco_Group_logo.svg" },
  "heidelberg-materials": { path: "/logos/heidelberg-materials.svg", source: "https://www.heidelbergmaterials.com/themes/custom/hm/__prototype__/public/images/logo_default_mobile.svg" },
  "orsted": { path: "/logos/orsted.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/%C3%98rsted_logo.svg" },
  "vestas": { path: "/logos/vestas.svg", source: "https://commons.wikimedia.org/wiki/Special:FilePath/Vestas.svg" },
};

export const INFOSYS_LOGO: LogoAsset | undefined = {"path": "/logos/infosys.svg", "source": "https://commons.wikimedia.org/wiki/Special:FilePath/Infosys%20logo.svg"};

export function logoForKnownClient(id: string | undefined): string | undefined {
  return id ? KNOWN_CLIENT_LOGOS[id]?.path : undefined;
}

export function logoAssetForKnownClient(id: string | undefined): LogoAsset | undefined {
  return id ? KNOWN_CLIENT_LOGOS[id] : undefined;
}

/** Marker stored in clientLogoFileName when the logo came from the curated list rather than an upload. */
export const LIST_LOGO_MARKER = "(official logo from client list)";

/** Absolute URL for an app-served asset, when running in the browser. */
export function absoluteAssetUrl(path: string): string {
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}
