"use client";

import { useState } from "react";
import {
  NarrativeFlowOption,
  StoryOption,
  ToneOption,
} from "@/lib/types";
import { Badge, Button, EyebrowLabel } from "./ui";

interface Props {
  story: StoryOption;
  toneOptions: ToneOption[];
  selectedToneId?: string;
  flowOptions: NarrativeFlowOption[];
  selectedFlowId?: string;
  onSelectTone: (id: string) => void;
  onUpdateTone: (id: string, patch: Partial<ToneOption>) => void;
  onSelectFlow: (id: string) => void;
  onUpdateFlowSlide: (flowId: string, slideIndex: number, patch: Partial<NarrativeFlowOption["slides"][number]>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function NarrativeAgentStep({
  story,
  toneOptions,
  selectedToneId,
  flowOptions,
  selectedFlowId,
  onSelectTone,
  onUpdateTone,
  onSelectFlow,
  onUpdateFlowSlide,
  onContinue,
  onBack,
}: Props) {
  const [editingToneId, setEditingToneId] = useState<string | null>(null);
  const [editingFlowId, setEditingFlowId] = useState<string | null>(null);
  const [expandedFlowId, setExpandedFlowId] = useState<string | null>(null);

  return (
    <div>
      <EyebrowLabel>Step 2 — Narrative Agent</EyebrowLabel>
      <h1 className="display h1" style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-2)" }}>
        Shape the narrative
      </h1>
      <p className="subhead" style={{ marginBottom: "var(--space-6)", maxWidth: 700 }}>
        Inheriting the <strong style={{ color: "var(--fg-on-dark)" }}>&ldquo;{story.name}&rdquo;</strong> story. Choose a tone,
        then a narrative flow built to fit it.
      </p>

      <section style={{ marginBottom: "var(--space-10)" }}>
        <h2 style={{ fontSize: "var(--fs-h4)", fontWeight: 700, marginBottom: "var(--space-4)" }}>1. Choose a tone</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-4)" }}>
          {toneOptions.map((tone) => {
            const isSelected = tone.id === selectedToneId;
            const isEditing = editingToneId === tone.id;
            return (
              <div key={tone.id} className={`card ${isSelected ? "card-selected" : ""}`} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {isEditing ? (
                  <input className="input" value={tone.name} onChange={(e) => onUpdateTone(tone.id, { name: e.target.value })} />
                ) : (
                  <h3 style={{ fontSize: "var(--fs-body-lg)", fontWeight: 700 }}>{tone.name}</h3>
                )}
                {isEditing ? (
                  <textarea className="textarea" style={{ minHeight: 60 }} value={tone.description} onChange={(e) => onUpdateTone(tone.id, { description: e.target.value })} />
                ) : (
                  <p className="body-copy" style={{ fontSize: "var(--fs-body-sm)" }}>{tone.description}</p>
                )}
                <ul style={{ display: "grid", gap: 4 }}>
                  {tone.voiceNotes.map((v, i) => (
                    <li key={i} className="field-hint" style={{ marginTop: 0 }}>
                      • {v}
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "auto" }}>
                  <Button variant={isSelected ? "primary" : "secondary"} size="sm" onClick={() => onSelectTone(tone.id)}>
                    {isSelected ? "Selected ✓" : "Select tone"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingToneId(isEditing ? null : tone.id)}>
                    {isEditing ? "Done" : "Edit"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedToneId && (
        <section style={{ marginBottom: "var(--space-10)" }}>
          <h2 style={{ fontSize: "var(--fs-h4)", fontWeight: 700, marginBottom: "var(--space-4)" }}>2. Choose a narrative flow</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-4)" }}>
            {flowOptions.map((flow) => {
              const isSelected = flow.id === selectedFlowId;
              const isExpanded = expandedFlowId === flow.id;
              const isEditing = editingFlowId === flow.id;
              return (
                <div key={flow.id} className={`card ${isSelected ? "card-selected" : ""}`} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {flow.structureLabels.map((l) => (
                      <Badge key={l}>{l}</Badge>
                    ))}
                  </div>
                  <h3 style={{ fontSize: "var(--fs-body-lg)", fontWeight: 700 }}>{flow.name}</h3>
                  <p className="body-copy" style={{ fontSize: "var(--fs-body-sm)" }}>{flow.description}</p>
                  <p className="field-hint" style={{ marginTop: 0 }}>{flow.whySuited}</p>

                  <button type="button" onClick={() => setExpandedFlowId(isExpanded ? null : flow.id)} className="btn-ghost btn btn-sm" style={{ alignSelf: "flex-start", padding: 0 }}>
                    {isExpanded ? "Hide slide sequence ▲" : "See slide sequence ▼"}
                  </button>

                  {isExpanded && (
                    <div style={{ display: "grid", gap: "var(--space-3)" }}>
                      {flow.slides.map((slide) => (
                        <div key={slide.slideIndex} style={{ borderLeft: "2px solid var(--border-hairline)", paddingLeft: "var(--space-3)" }}>
                          <p className="field-hint" style={{ marginTop: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Internal slide {slide.slideIndex}
                          </p>
                          {isEditing ? (
                            <>
                              <input
                                className="input"
                                style={{ marginBottom: 4 }}
                                value={slide.headline}
                                onChange={(e) => onUpdateFlowSlide(flow.id, slide.slideIndex, { headline: e.target.value })}
                              />
                              <textarea
                                className="textarea"
                                style={{ minHeight: 44 }}
                                value={slide.keyMessage}
                                onChange={(e) => onUpdateFlowSlide(flow.id, slide.slideIndex, { keyMessage: e.target.value })}
                              />
                            </>
                          ) : (
                            <>
                              <p style={{ fontWeight: 700, fontSize: "var(--fs-body-sm)" }}>{slide.headline}</p>
                              <p className="field-hint" style={{ marginTop: 2 }}>
                                Purpose: {slide.purpose} Key message: {slide.keyMessage}
                              </p>
                              <p className="field-hint" style={{ marginTop: 2 }}>
                                {slide.connectionPrev} {slide.connectionNext}
                              </p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "auto" }}>
                    <Button variant={isSelected ? "primary" : "secondary"} size="sm" onClick={() => onSelectFlow(flow.id)}>
                      {isSelected ? "Selected ✓" : "Select flow"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditingFlowId(isEditing ? null : flow.id)}>
                      {isEditing ? "Done" : "Edit"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="ghost" onClick={onBack}>
          ← Back to Story Agent
        </Button>
        <Button variant="primary" onClick={onContinue} disabled={!selectedToneId || !selectedFlowId}>
          Continue to Theming Agent →
        </Button>
      </div>
    </div>
  );
}
