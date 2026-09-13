import { DeckState, emptyIntakeForm } from "./types";

export function createInitialDeckState(): DeckState {
  return {
    form: { ...emptyIntakeForm },
    step: "landing",
    storyOptions: [],
    selectedStoryId: undefined,
    toneOptions: [],
    selectedToneId: undefined,
    flowOptions: [],
    selectedFlowId: undefined,
    outline: [],
    infosysBrand: undefined,
    clientBrand: undefined,
    brandResearchStatus: "idle",
    themeOptions: [],
    selectedThemeId: undefined,
    imagePromptStyle: "abstract",
    qaFlags: [],
    updatedAt: new Date().toISOString(),
  };
}
