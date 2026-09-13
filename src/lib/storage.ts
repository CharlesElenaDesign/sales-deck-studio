import { DeckState, STORAGE_KEY } from "./types";

export function loadDeck(): DeckState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DeckState>;
    // Drafts saved before image prompts existed lack this field.
    return { ...parsed, imagePromptStyle: parsed.imagePromptStyle ?? "abstract" } as DeckState;
  } catch {
    return null;
  }
}

export function saveDeck(deck: DeckState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
  } catch {
    // storage quota or private mode — autosave is best-effort
  }
}

export function clearDeck(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
