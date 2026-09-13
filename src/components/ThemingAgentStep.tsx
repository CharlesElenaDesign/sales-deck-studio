"use client";

import { useState } from "react";
import { BrandProfile, IntakeFormData, SlideOutlineItem, ThemeOption } from "@/lib/types";
import { BrandSourcesPanel } from "./BrandSourcesPanel";
import { SlideThumbnail } from "./SlideThumbnail";
import { Button, EyebrowLabel } from "./ui";

interface Props {
  form: IntakeFormData;
  outline: SlideOutlineItem[];
  themeOptions: ThemeOption[];
  selectedThemeId?: string;
  infosysBrand?: BrandProfile;
  clientBrand?: BrandProfile;
  brandResearchStatus: "idle" | "loading" | "done" | "error";
  onRetryBrandResearch: (clientUrl?: string) => void;
  onSelectTheme: (id: string) => void;
  onUpdateTheme: (id: string, patch: Partial<ThemeOption>) => void;
  onContinue: () => void;
  onBack: () => void;
}

const DETAIL_FIELDS: { key: keyof ThemeOption; label: string }[] = [
  { key: "colorStrategy", label: "Colour strategy" },
  { key: "typographyApproach", label: "Typography approach" },
  { key: "layoutSystem", label: "Layout system" },
  { key: "imageryStyle", label: "Imagery / illustration style" },
  { key: "chartTreatment", label: "Chart, diagram & icon treatment" },
  { key: "coBrandingTreatment", label: "Co-branding treatment" },
  { key: "accessibilityNotes", label: "Accessibility considerations" },
  { key: "howReinforcesStory", label: "How this reinforces the story" },
];

export function ThemingAgentStep({
  form,
  outline,
  themeOptions,
  selectedThemeId,
  infosysBrand,
  clientBrand,
  brandResearchStatus,
  onRetryBrandResearch,
  onSelectTheme,
  onUpdateTheme,
  onContinue,
  onBack,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const cover = outline.find((o) => o.role === "cover");
  const internal = outline.find((o) => o.role === "internal");
  const closing = outline.find((o) => o.role === "closing");
  const internalCount = outline.filter((o) => o.role === "internal").length;

  return (
    <div>
      <EyebrowLabel>Step 3 — Theming Agent</EyebrowLabel>
      <h1 className="display h1" style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-2)" }}>
        Choose a visual style
      </h1>
      <p className="subhead" style={{ marginBottom: "var(--space-6)", maxWidth: 700 }}>
        Three distinct abstract graphics, built from {form.clientCompany || "client"}&apos;s own color signal since no
        photography is required. Whichever style you pick, its motif carries through every internal slide and the
        closing slide, and the export prompt describes it shape by shape so the finished deck matches this preview.
        Ready-to-paste image prompts for every slide follow on the final review page, after the deck prompt.
      </p>

      <div style={{ marginBottom: "var(--space-8)" }}>
        <BrandSourcesPanel
          infosysBrand={infosysBrand}
          clientBrand={clientBrand}
          status={brandResearchStatus}
          clientCompany={form.clientCompany}
          onRetryClient={(url) => onRetryBrandResearch(url)}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-5)" }}>
        {themeOptions.map((theme) => {
          const isSelected = theme.id === selectedThemeId;
          const isExpanded = expandedId === theme.id;
          const isEditing = editingId === theme.id;
          return (
            <div key={theme.id} className={`card ${isSelected ? "card-selected" : ""}`} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {isEditing ? (
                <input className="input" value={theme.name} onChange={(e) => onUpdateTheme(theme.id, { name: e.target.value })} />
              ) : (
                <h3 style={{ fontSize: "var(--fs-h3)", fontWeight: 700 }}>{theme.name}</h3>
              )}

              {isEditing ? (
                <textarea className="textarea" style={{ minHeight: 60 }} value={theme.rationale} onChange={(e) => onUpdateTheme(theme.id, { rationale: e.target.value })} />
              ) : (
                <p className="body-copy" style={{ fontSize: "var(--fs-body-sm)" }}>{theme.rationale}</p>
              )}

              <div>
                <p className="field-label" style={{ marginBottom: 6 }}>
                  Deck cover
                </p>
                <SlideThumbnail
                  role="cover"
                  theme={theme}
                  clientCompany={form.clientCompany}
                  headline={cover?.headline ?? "Presentation title"}
                  subhead={cover?.subhead}
                  clientLogoDataUrl={form.clientLogoDataUrl}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <p className="field-hint" style={{ marginTop: 0, marginBottom: 4 }}>
                    Internal slides inherit this
                  </p>
                  <SlideThumbnail
                    role="internal"
                    theme={theme}
                    clientCompany={form.clientCompany}
                    headline={internal?.headline ?? "Internal slide headline"}
                    bullets={internal?.bodyBullets}
                    eyebrow={internal?.eyebrow}
                    slideNumber={1}
                    progress={1 / Math.max(internalCount, 1)}
                  />
                </div>
                <div>
                  <p className="field-hint" style={{ marginTop: 0, marginBottom: 4 }}>
                    Closing slide
                  </p>
                  <SlideThumbnail
                    role="closing"
                    theme={theme}
                    clientCompany={form.clientCompany}
                    headline={closing?.headline ?? "Thank you"}
                    clientLogoDataUrl={form.clientLogoDataUrl}
                  />
                </div>
              </div>

              <button type="button" onClick={() => setExpandedId(isExpanded ? null : theme.id)} className="btn-ghost btn btn-sm" style={{ alignSelf: "flex-start", padding: 0 }}>
                {isExpanded ? "Hide details ▲" : "See full details ▼"}
              </button>

              {isExpanded && (
                <div style={{ display: "grid", gap: "var(--space-3)" }}>
                  {DETAIL_FIELDS.map(({ key, label }) => (
                    <div key={key}>
                      <p className="field-label" style={{ marginBottom: 2 }}>
                        {label}
                      </p>
                      <p style={{ fontSize: "var(--fs-body-sm)", color: "var(--fg-on-dark-2)", lineHeight: 1.5 }}>{theme[key] as string}</p>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "auto" }}>
                <Button variant={isSelected ? "primary" : "secondary"} size="sm" onClick={() => onSelectTheme(theme.id)}>
                  {isSelected ? "Selected ✓" : "Select this style"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditingId(isEditing ? null : theme.id)}>
                  {isEditing ? "Done" : "Edit"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "var(--space-8)", display: "flex", justifyContent: "space-between" }}>
        <Button variant="ghost" onClick={onBack}>
          ← Back to Narrative Agent
        </Button>
        <Button variant="primary" onClick={onContinue} disabled={!selectedThemeId}>
          Continue to final review →
        </Button>
      </div>
    </div>
  );
}
