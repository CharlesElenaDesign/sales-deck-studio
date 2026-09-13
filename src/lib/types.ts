export type DealSynopsisMode = "preset" | "custom";

export type WizardStep = "landing" | "intake" | "story" | "narrative" | "theming" | "review";

export interface IntakeFormData {
  clientCompany: string;
  /** Set when the name was picked from (or exactly matches) the curated client list. */
  knownClientId?: string;
  clientWebsite?: string;
  synopsisMode: DealSynopsisMode;
  presetSynopsisId?: string;
  synopsisText: string;
  presentationTitle?: string;
  presenterName?: string;
  presenterDate?: string;
  presenterEmail?: string;
  notes?: string;
  slideCount: 5 | 6;
  clientLogoDataUrl?: string;
  clientLogoFileName?: string;
}

export const emptyIntakeForm: IntakeFormData = {
  clientCompany: "",
  knownClientId: undefined,
  clientWebsite: "",
  synopsisMode: "preset",
  presetSynopsisId: undefined,
  synopsisText: "",
  presentationTitle: "",
  presenterName: "",
  presenterDate: "",
  presenterEmail: "",
  notes: "",
  slideCount: 6,
  clientLogoDataUrl: undefined,
  clientLogoFileName: undefined,
};

export interface StoryProgressionStep {
  title: string;
  description: string;
}

export interface StoryOption {
  id: string;
  direction: string;
  directionLabel: string;
  name: string;
  centralIdea: string;
  challenge: string;
  change: string;
  valueOutcome: string;
  progression: StoryProgressionStep[];
  assertionHeadlines: string[];
  relevance: string;
  assumptions: string[];
}

export interface ToneOption {
  id: string;
  name: string;
  description: string;
  voiceNotes: string[];
}

export interface NarrativeSlidePlan {
  slideIndex: number;
  headline: string;
  purpose: string;
  keyMessage: string;
  supportingContent: string;
  connectionPrev: string;
  connectionNext: string;
}

export interface NarrativeFlowOption {
  id: string;
  name: string;
  structureLabels: string[];
  description: string;
  whySuited: string;
  slides: NarrativeSlidePlan[];
}

export type ImagePromptStyle = "abstract" | "photographic";

export interface SlideOutlineItem {
  slideIndex: number;
  role: "cover" | "internal" | "closing";
  eyebrow?: string;
  headline: string;
  subhead?: string;
  bodyBullets: string[];
  speakerNotes: string;
  placeholderFlags: string[];
  /** Ready-to-paste prompt for any image generator, filled once a theme is selected. */
  imagePrompt?: string;
}

export interface BrandColor {
  hex: string;
  label: string;
}

export interface BrandSource {
  label: string;
  url: string;
  accessedAt: string;
}

export type BrandConfidence = "official" | "approximated" | "unavailable";

export interface BrandProfile {
  companyName: string;
  domain?: string;
  faviconUrl?: string;
  colors: BrandColor[];
  fonts: string[];
  titleTagText?: string;
  sources: BrandSource[];
  confidence: BrandConfidence;
  notes: string[];
  fetchedAt: string;
  error?: string;
}

export interface ThemePalette {
  primary: string;
  secondary: string;
  accent: string;
  neutralDark: string;
  neutralLight: string;
  surface: string;
}

export interface ThemeOption {
  id: string;
  name: string;
  rationale: string;
  colorStrategy: string;
  typographyApproach: string;
  layoutSystem: string;
  imageryStyle: string;
  chartTreatment: string;
  coBrandingTreatment: string;
  accessibilityNotes: string;
  howReinforcesStory: string;
  palette: ThemePalette;
  headingFont: string;
  bodyFont: string;
  exportHeadingFont: string;
  exportBodyFont: string;
  layoutVariant: "grid" | "editorial" | "gradient-band";
}

export type QaSeverity = "info" | "warning" | "critical";

export interface QaFlag {
  id: string;
  severity: QaSeverity;
  category: string;
  message: string;
  slideIndex?: number;
}

export interface DeckState {
  form: IntakeFormData;
  step: WizardStep;
  storyOptions: StoryOption[];
  selectedStoryId?: string;
  toneOptions: ToneOption[];
  selectedToneId?: string;
  flowOptions: NarrativeFlowOption[];
  selectedFlowId?: string;
  outline: SlideOutlineItem[];
  infosysBrand?: BrandProfile;
  clientBrand?: BrandProfile;
  brandResearchStatus: "idle" | "loading" | "done" | "error";
  themeOptions: ThemeOption[];
  selectedThemeId?: string;
  imagePromptStyle: ImagePromptStyle;
  qaFlags: QaFlag[];
  updatedAt: string;
}

export function internalSlideCount(slideCount: 5 | 6): number {
  return slideCount - 2;
}

export const STORAGE_KEY = "sales-deck-studio:v1";
