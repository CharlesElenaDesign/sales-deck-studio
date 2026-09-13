"use client";

import { useEffect, useRef, useState } from "react";
import { IntakeForm } from "@/components/IntakeForm";
import { LandingPage } from "@/components/LandingPage";
import { NarrativeAgentStep } from "@/components/NarrativeAgentStep";
import { ReviewExportStep } from "@/components/ReviewExportStep";
import { Stepper } from "@/components/Stepper";
import { StoryAgentStep } from "@/components/StoryAgentStep";
import { ThemingAgentStep } from "@/components/ThemingAgentStep";
import { Button } from "@/components/ui";
import { createInitialDeckState } from "@/lib/deckFactory";
import { applyImagePrompts, knownClientForForm } from "@/lib/imagePromptEngine";
import { brandProfileFromKnownClient, mergeKnownClientIntoProfile } from "@/lib/knownClients";
import { buildOutline, generateFlowOptions, generateToneOptions } from "@/lib/narrativeEngine";
import { generateStoryOptions } from "@/lib/storyEngine";
import { clearDeck, loadDeck, saveDeck } from "@/lib/storage";
import { generateThemeOptions } from "@/lib/themeEngine";
import { runQaChecks } from "@/lib/qaEngine";
import {
  BrandProfile,
  DeckState,
  ImagePromptStyle,
  IntakeFormData,
  NarrativeFlowOption,
  SlideOutlineItem,
  StoryOption,
  ThemeOption,
  ToneOption,
  WizardStep,
  internalSlideCount,
} from "@/lib/types";

const STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

/** On static hosting (GitHub Pages) there is no server to scan websites, so unknown clients get an honest placeholder. */
function staticFallbackProfile(companyName: string): BrandProfile {
  return {
    companyName,
    colors: [],
    fonts: [],
    sources: [],
    confidence: "unavailable",
    notes: [
      "The live website colour scan is not available on this hosted version (static site). Clients on the built-in list still get their reference colours and logo; for others a neutral palette is used and the AI platform is told to research the brand itself.",
    ],
    fetchedAt: new Date().toISOString(),
  };
}

export default function Home() {
  const [deck, setDeck] = useState<DeckState>(() => createInitialDeckState());
  const [hydrated, setHydrated] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // One-time hydration from localStorage after mount — SSR has no access to it,
    // so this can't be done in a lazy useState initializer without a hydration mismatch.
    const loaded = loadDeck();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (loaded) setDeck(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveDeck(deck);
      setLastSaved(new Date());
    }, 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [deck, hydrated]);

  async function runBrandResearch(form: IntakeFormData) {
    const known = knownClientForForm(form);
    if (STATIC_EXPORT) {
      setDeck((d) => ({
        ...d,
        clientBrand: known ? brandProfileFromKnownClient(known) : staticFallbackProfile(form.clientCompany),
        infosysBrand: d.infosysBrand ?? staticFallbackProfile("Infosys"),
        brandResearchStatus: "done",
      }));
      return;
    }
    // Curated clients get their reference colours immediately; live research then adds sources.
    setDeck((d) => ({ ...d, brandResearchStatus: "loading", clientBrand: known ? brandProfileFromKnownClient(known) : d.clientBrand }));
    try {
      const res = await fetch("/api/brand-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientCompany: form.clientCompany, clientWebsite: form.clientWebsite || known?.website }),
      });
      if (!res.ok) throw new Error("Brand research request failed");
      const data = (await res.json()) as { infosysBrand: BrandProfile; clientBrand: BrandProfile };
      const clientBrand = known ? mergeKnownClientIntoProfile(known, data.clientBrand) : data.clientBrand;
      setDeck((d) => ({ ...d, infosysBrand: data.infosysBrand, clientBrand, brandResearchStatus: "done" }));
    } catch {
      // A curated client still has usable colours even when the live scan fails.
      setDeck((d) => ({ ...d, brandResearchStatus: known ? "done" : "error" }));
    }
  }

  async function retryClientBrandResearch(url?: string) {
    if (STATIC_EXPORT) return;
    setDeck((d) => ({ ...d, brandResearchStatus: "loading" }));
    try {
      const res = await fetch("/api/brand-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientCompany: deck.form.clientCompany, clientWebsite: url }),
      });
      if (!res.ok) throw new Error("Brand research request failed");
      const data = (await res.json()) as { infosysBrand: BrandProfile; clientBrand: BrandProfile };
      const known = knownClientForForm(deck.form);
      const clientBrand = known ? mergeKnownClientIntoProfile(known, data.clientBrand) : data.clientBrand;
      setDeck((d) => ({ ...d, clientBrand, brandResearchStatus: "done" }));
    } catch {
      setDeck((d) => ({ ...d, brandResearchStatus: "error" }));
    }
  }

  function handleIntakeSubmit(form: IntakeFormData) {
    const storyOptions = generateStoryOptions(form.clientCompany, form.synopsisText, form.notes);
    setDeck((d) => ({
      ...d,
      form,
      storyOptions,
      selectedStoryId: undefined,
      toneOptions: [],
      selectedToneId: undefined,
      flowOptions: [],
      selectedFlowId: undefined,
      outline: [],
      themeOptions: [],
      selectedThemeId: undefined,
      qaFlags: [],
      step: "story",
    }));
    void runBrandResearch(form);
  }

  function handleStoryContinue() {
    const story = deck.storyOptions.find((s) => s.id === deck.selectedStoryId);
    if (!story) return;
    const toneOptions = generateToneOptions(story);
    setDeck((d) => ({
      ...d,
      toneOptions,
      selectedToneId: undefined,
      flowOptions: [],
      selectedFlowId: undefined,
      outline: [],
      themeOptions: [],
      selectedThemeId: undefined,
      qaFlags: [],
      step: "narrative",
    }));
  }

  function handleSelectTone(id: string) {
    const story = deck.storyOptions.find((s) => s.id === deck.selectedStoryId);
    const tone = deck.toneOptions.find((t) => t.id === id);
    if (!story || !tone) return;
    const count = internalSlideCount(deck.form.slideCount);
    const flowOptions = generateFlowOptions(story, tone, count);
    setDeck((d) => ({ ...d, selectedToneId: id, flowOptions, selectedFlowId: undefined, outline: [] }));
  }

  function handleUpdateTone(id: string, patch: Partial<ToneOption>) {
    setDeck((d) => ({ ...d, toneOptions: d.toneOptions.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
  }

  function handleSelectFlow(id: string) {
    const story = deck.storyOptions.find((s) => s.id === deck.selectedStoryId);
    const tone = deck.toneOptions.find((t) => t.id === deck.selectedToneId);
    const flow = deck.flowOptions.find((f) => f.id === id);
    if (!story || !tone || !flow) return;
    const outline = buildOutline(deck.form, story, tone, flow);
    setDeck((d) => ({ ...d, selectedFlowId: id, outline }));
  }

  function handleUpdateFlowSlide(flowId: string, slideIndex: number, patch: Partial<NarrativeFlowOption["slides"][number]>) {
    setDeck((d) => {
      const flowOptions = d.flowOptions.map((f) =>
        f.id === flowId ? { ...f, slides: f.slides.map((s) => (s.slideIndex === slideIndex ? { ...s, ...patch } : s)) } : f
      );
      let outline = d.outline;
      if (d.selectedFlowId === flowId && d.selectedStoryId && d.selectedToneId) {
        const story = d.storyOptions.find((s) => s.id === d.selectedStoryId);
        const tone = d.toneOptions.find((t) => t.id === d.selectedToneId);
        const flow = flowOptions.find((f) => f.id === flowId);
        if (story && tone && flow) outline = buildOutline(d.form, story, tone, flow);
        const theme = d.themeOptions.find((t) => t.id === d.selectedThemeId);
        if (theme) outline = applyImagePrompts(outline, theme, d.form, d.imagePromptStyle);
      }
      return { ...d, flowOptions, outline };
    });
  }

  function handleUpdateOutlineItem(slideIndex: number, patch: Partial<SlideOutlineItem>) {
    setDeck((d) => ({ ...d, outline: d.outline.map((o) => (o.slideIndex === slideIndex ? { ...o, ...patch } : o)) }));
  }

  function handleNarrativeContinue() {
    const story = deck.storyOptions.find((s) => s.id === deck.selectedStoryId);
    const tone = deck.toneOptions.find((t) => t.id === deck.selectedToneId);
    const flow = deck.flowOptions.find((f) => f.id === deck.selectedFlowId);
    if (!story || !tone || !flow) return;
    const themeOptions = generateThemeOptions(deck.form.clientCompany, story, tone, flow, deck.clientBrand);
    setDeck((d) => ({ ...d, themeOptions, selectedThemeId: undefined, qaFlags: [], step: "theming" }));
  }

  function handleSelectTheme(id: string) {
    setDeck((d) => {
      const theme = d.themeOptions.find((t) => t.id === id);
      if (!theme) return d;
      return { ...d, selectedThemeId: id, outline: applyImagePrompts(d.outline, theme, d.form, d.imagePromptStyle) };
    });
  }

  function handleSetImagePromptStyle(style: ImagePromptStyle) {
    setDeck((d) => {
      const theme = d.themeOptions.find((t) => t.id === d.selectedThemeId);
      const outline = theme ? applyImagePrompts(d.outline, theme, d.form, style) : d.outline;
      return { ...d, imagePromptStyle: style, outline };
    });
  }

  function handleUpdateImagePrompt(slideIndex: number, text: string) {
    setDeck((d) => ({ ...d, outline: d.outline.map((o) => (o.slideIndex === slideIndex ? { ...o, imagePrompt: text } : o)) }));
  }

  function handleUpdateTheme(id: string, patch: Partial<ThemeOption>) {
    setDeck((d) => ({ ...d, themeOptions: d.themeOptions.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
  }

  function handleThemingContinue() {
    setDeck((d) => {
      const theme = d.themeOptions.find((t) => t.id === d.selectedThemeId);
      // Drafts saved before image prompts existed reach Review without them — fill in here.
      const needsPrompts = theme && d.outline.some((o) => !o.imagePrompt);
      const outline = needsPrompts ? applyImagePrompts(d.outline, theme, d.form, d.imagePromptStyle) : d.outline;
      return { ...d, outline, qaFlags: runQaChecks({ ...d, outline }), step: "review" };
    });
  }

  function handleRegenerateSlide(slideIndex: number) {
    setDeck((d) => {
      const story = d.storyOptions.find((s) => s.id === d.selectedStoryId);
      const tone = d.toneOptions.find((t) => t.id === d.selectedToneId);
      const flow = d.flowOptions.find((f) => f.id === d.selectedFlowId);
      if (!story || !tone || !flow) return d;
      const theme = d.themeOptions.find((t) => t.id === d.selectedThemeId);
      const rebuilt = buildOutline(d.form, story, tone, flow);
      const fresh = theme ? applyImagePrompts(rebuilt, theme, d.form, d.imagePromptStyle) : rebuilt;
      const freshItem = fresh.find((o) => o.slideIndex === slideIndex);
      if (!freshItem) return d;
      return { ...d, outline: d.outline.map((o) => (o.slideIndex === slideIndex ? freshItem : o)) };
    });
  }

  function handleReset() {
    if (!window.confirm("Start a new presentation? This clears the current draft.")) return;
    clearDeck();
    setDeck(createInitialDeckState());
  }

  function goToStep(step: WizardStep) {
    setDeck((d) => ({ ...d, step }));
  }

  const story = deck.storyOptions.find((s) => s.id === deck.selectedStoryId);

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(5,5,5,0.9)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--border-hairline-soft)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "var(--space-4) var(--gutter)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-6)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <span style={{ fontWeight: 700, letterSpacing: "0.02em" }}>Sales Deck Studio</span>
            <span className="field-hint" style={{ marginTop: 0 }}>
              Infosys{deck.form.clientCompany ? ` | ${deck.form.clientCompany}` : ""}
            </span>
          </div>
          {deck.step !== "landing" && deck.step !== "intake" && <Stepper current={deck.step} />}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <span className="field-hint" style={{ marginTop: 0 }}>
              {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "Autosave on"}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                saveDeck(deck);
                setLastSaved(new Date());
              }}
            >
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={handleReset}>
              Start over
            </Button>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, width: "100%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "var(--space-10) var(--gutter) var(--space-24)" }}>
          {deck.step === "landing" && <LandingPage onStart={() => goToStep("intake")} />}

          {deck.step === "intake" && <IntakeForm initial={deck.form} onSubmit={handleIntakeSubmit} />}

          {deck.step === "story" && (
            <StoryAgentStep
              form={deck.form}
              storyOptions={deck.storyOptions}
              selectedStoryId={deck.selectedStoryId}
              clientBrand={deck.clientBrand}
              onChangeOptions={(options: StoryOption[]) => setDeck((d) => ({ ...d, storyOptions: options }))}
              onSelect={(id) => setDeck((d) => ({ ...d, selectedStoryId: id }))}
              onContinue={handleStoryContinue}
              onBackToForm={() => goToStep("intake")}
            />
          )}

          {deck.step === "narrative" && story && (
            <NarrativeAgentStep
              story={story}
              toneOptions={deck.toneOptions}
              selectedToneId={deck.selectedToneId}
              flowOptions={deck.flowOptions}
              selectedFlowId={deck.selectedFlowId}
              onSelectTone={handleSelectTone}
              onUpdateTone={handleUpdateTone}
              onSelectFlow={handleSelectFlow}
              onUpdateFlowSlide={handleUpdateFlowSlide}
              onContinue={handleNarrativeContinue}
              onBack={() => goToStep("story")}
            />
          )}

          {deck.step === "theming" && (
            <ThemingAgentStep
              form={deck.form}
              outline={deck.outline}
              themeOptions={deck.themeOptions}
              selectedThemeId={deck.selectedThemeId}
              infosysBrand={deck.infosysBrand}
              clientBrand={deck.clientBrand}
              brandResearchStatus={deck.brandResearchStatus}
              onRetryBrandResearch={retryClientBrandResearch}
              onSelectTheme={handleSelectTheme}
              onUpdateTheme={handleUpdateTheme}
              onContinue={handleThemingContinue}
              onBack={() => goToStep("narrative")}
            />
          )}

          {deck.step === "review" && (
            <ReviewExportStep
              deck={deck}
              onEditOutlineItem={handleUpdateOutlineItem}
              onRegenerateSlide={handleRegenerateSlide}
              onRerunQa={() => setDeck((d) => ({ ...d, qaFlags: runQaChecks(d) }))}
              onSetImagePromptStyle={handleSetImagePromptStyle}
              onUpdateImagePrompt={handleUpdateImagePrompt}
            />
          )}
        </div>
      </main>
    </div>
  );
}
