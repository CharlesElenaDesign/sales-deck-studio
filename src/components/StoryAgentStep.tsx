"use client";

import { useState } from "react";
import {
  generateOneMoreDirection,
  generateStoryOptions,
  regenerateAllStoryOptions,
} from "@/lib/storyEngine";
import { BrandProfile, IntakeFormData, StoryOption } from "@/lib/types";
import { Badge, Button, CardArt, EyebrowLabel } from "./ui";

interface Props {
  form: IntakeFormData;
  storyOptions: StoryOption[];
  selectedStoryId?: string;
  clientBrand?: BrandProfile;
  onChangeOptions: (options: StoryOption[]) => void;
  onSelect: (id: string) => void;
  onContinue: () => void;
  onBackToForm: () => void;
}

export function StoryAgentStep({ form, storyOptions, selectedStoryId, clientBrand, onChangeOptions, onSelect, onContinue, onBackToForm }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const [showHintBox, setShowHintBox] = useState(false);

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function regenerateAll() {
    const current = storyOptions.map((s) => s.direction);
    onChangeOptions(regenerateAllStoryOptions(form.clientCompany, form.synopsisText, form.notes, current, clientBrand));
    setEditingId(null);
  }

  function regenerateWithHint() {
    const current = storyOptions.map((s) => s.direction);
    const combinedNotes = `${form.notes ?? ""} ${hint}`.trim();
    onChangeOptions(generateStoryOptions(form.clientCompany, form.synopsisText, combinedNotes, current, clientBrand));
    setShowHintBox(false);
    setHint("");
  }

  function regenerateSingle(id: string) {
    const target = storyOptions.find((s) => s.id === id);
    if (!target) return;
    const current = storyOptions.map((s) => s.direction);
    const replacement = generateOneMoreDirection(form.clientCompany, form.synopsisText, form.notes, current, clientBrand);
    onChangeOptions(storyOptions.map((s) => (s.id === id ? replacement : s)));
  }

  function updateField(id: string, field: keyof StoryOption, value: string) {
    onChangeOptions(
      storyOptions.map((s) => (s.id === id ? ({ ...s, [field]: value } as StoryOption) : s))
    );
  }

  function updateProgressionField(id: string, index: number, field: "title" | "description", value: string) {
    onChangeOptions(
      storyOptions.map((s) => {
        if (s.id !== id) return s;
        const progression = s.progression.map((p, i) => (i === index ? { ...p, [field]: value } : p));
        return { ...s, progression };
      })
    );
  }

  return (
    <div>
      <EyebrowLabel>Step 1 — Story Agent</EyebrowLabel>
      <h1 className="display h1" style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-2)" }}>
        Choose the strategic story
      </h1>
      <p className="subhead" style={{ marginBottom: "var(--space-8)", maxWidth: 700 }}>
        Three genuinely different strategic directions for {form.clientCompany || "this client"}, derived from the
        synopsis you provided. Select one to carry forward — you can edit the wording at any time.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "var(--space-5)",
          marginBottom: "var(--space-6)",
        }}
      >
        {storyOptions.map((story, i) => {
          const isSelected = story.id === selectedStoryId;
          const isExpanded = expanded.has(story.id);
          const isEditing = editingId === story.id;
          return (
            <div
              key={story.id}
              className={`card ${isSelected ? "card-selected" : ""}`}
              style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", position: "relative", overflow: "hidden" }}
            >
              <CardArt index={i} />
              <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-3)" }}>
                  <Badge>{story.directionLabel}</Badge>
                  {isSelected && <Badge tone="live">Selected</Badge>}
                </div>

                {isEditing ? (
                  <input className="input" value={story.name} onChange={(e) => updateField(story.id, "name", e.target.value)} />
                ) : (
                  <h3 style={{ fontSize: "var(--fs-h3)", fontWeight: 700, lineHeight: 1.25 }}>{story.name}</h3>
                )}

                {isEditing ? (
                  <textarea className="textarea" style={{ minHeight: 60 }} value={story.centralIdea} onChange={(e) => updateField(story.id, "centralIdea", e.target.value)} />
                ) : (
                  <p className="body-copy">{story.centralIdea}</p>
                )}

                <div style={{ display: "grid", gap: "var(--space-3)" }}>
                  <LabeledText label="Business challenge" value={story.challenge} editing={isEditing} onChange={(v) => updateField(story.id, "challenge", v)} />
                  <LabeledText label="Proposed change" value={story.change} editing={isEditing} onChange={(v) => updateField(story.id, "change", v)} />
                  <LabeledText label="Value / outcome" value={story.valueOutcome} editing={isEditing} onChange={(v) => updateField(story.id, "valueOutcome", v)} />
                </div>

                <button type="button" onClick={() => toggleExpanded(story.id)} className="btn-ghost btn btn-sm" style={{ alignSelf: "flex-start", padding: 0 }}>
                  {isExpanded ? "Hide full story ▲" : "See full story ▼"}
                </button>

                {isExpanded && (
                  <div style={{ display: "grid", gap: "var(--space-4)" }}>
                    <div>
                      <p className="field-label">Four-part story progression</p>
                      <ol style={{ display: "grid", gap: "var(--space-2)" }}>
                        {story.progression.map((p, idx) => (
                          <li key={idx} style={{ fontSize: "var(--fs-body-sm)", color: "var(--fg-on-dark-2)" }}>
                            <strong style={{ color: "var(--fg-on-dark)" }}>{idx + 1}. </strong>
                            {isEditing ? (
                              <span style={{ display: "block", marginTop: 4 }}>
                                <input className="input" style={{ marginBottom: 4 }} value={p.title} onChange={(e) => updateProgressionField(story.id, idx, "title", e.target.value)} />
                                <textarea className="textarea" style={{ minHeight: 44 }} value={p.description} onChange={(e) => updateProgressionField(story.id, idx, "description", e.target.value)} />
                              </span>
                            ) : (
                              <>
                                <strong>{p.title}</strong> — {p.description}
                              </>
                            )}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <LabeledText label="Why this fits the client & deal" value={story.relevance} editing={isEditing} onChange={(v) => updateField(story.id, "relevance", v)} />
                    <div>
                      <p className="field-label">Assumptions to validate</p>
                      <ul style={{ display: "grid", gap: "var(--space-1)" }}>
                        {story.assumptions.map((a, idx) => (
                          <li key={idx} className="field-hint" style={{ marginTop: 0 }}>
                            • {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginTop: "var(--space-2)" }}>
                  <Button variant={isSelected ? "primary" : "secondary"} size="sm" onClick={() => onSelect(story.id)}>
                    {isSelected ? "Selected ✓" : "Select this story"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingId(isEditing ? null : story.id)}>
                    {isEditing ? "Done editing" : "Edit"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => regenerateSingle(story.id)}>
                    Try a different direction
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel" style={{ padding: "var(--space-5) var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
          <Button variant="secondary" size="sm" onClick={regenerateAll}>
            Regenerate all options
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowHintBox((v) => !v)}>
            Ask for a different direction
          </Button>
          <Button variant="ghost" size="sm" onClick={onBackToForm}>
            ← Return to initial form
          </Button>
        </div>
        {showHintBox && (
          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <input
              className="input"
              placeholder="e.g. focus more on cost, or on customer trust…"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
            />
            <Button variant="primary" size="sm" onClick={regenerateWithHint}>
              Regenerate
            </Button>
          </div>
        )}
      </div>

      <div style={{ marginTop: "var(--space-8)", display: "flex", justifyContent: "flex-end" }}>
        <Button variant="primary" onClick={onContinue} disabled={!selectedStoryId}>
          Continue to Narrative Agent →
        </Button>
      </div>
    </div>
  );
}

function LabeledText({ label, value, editing, onChange }: { label: string; value: string; editing: boolean; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="field-label" style={{ marginBottom: 4 }}>
        {label}
      </p>
      {editing ? (
        <textarea className="textarea" style={{ minHeight: 56 }} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <p style={{ fontSize: "var(--fs-body-sm)", color: "var(--fg-on-dark-2)", lineHeight: 1.5 }}>{value}</p>
      )}
    </div>
  );
}
