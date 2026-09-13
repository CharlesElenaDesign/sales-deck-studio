"use client";

import { useMemo, useState } from "react";
import { buildDeckPrompt } from "@/lib/promptBuilder";
import { DeckState, ImagePromptStyle, QaFlag, SlideOutlineItem } from "@/lib/types";
import { ImagePromptsPanel } from "./ImagePromptsPanel";
import { SlideThumbnail } from "./SlideThumbnail";
import { Badge, Button, EyebrowLabel } from "./ui";

interface Props {
  deck: DeckState;
  onEditOutlineItem: (slideIndex: number, patch: Partial<SlideOutlineItem>) => void;
  onRegenerateSlide: (slideIndex: number) => void;
  onRerunQa: () => void;
  onSetImagePromptStyle: (style: ImagePromptStyle) => void;
  onUpdateImagePrompt: (slideIndex: number, text: string) => void;
}

const SEVERITY_ORDER: QaFlag["severity"][] = ["critical", "warning", "info"];
const SEVERITY_LABEL: Record<QaFlag["severity"], string> = {
  critical: "Critical",
  warning: "Warning",
  info: "Info",
};

export function ReviewExportStep({ deck, onEditOutlineItem, onRegenerateSlide, onRerunQa, onSetImagePromptStyle, onUpdateImagePrompt }: Props) {
  const [editingSlide, setEditingSlide] = useState<number | null>(null);
  const [qaOpen, setQaOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(() => buildDeckPrompt(deck), [deck]);

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this prompt:", prompt);
    }
  }

  const grouped = SEVERITY_ORDER.map((sev) => ({
    sev,
    flags: deck.qaFlags.filter((f) => f.severity === sev),
  })).filter((g) => g.flags.length > 0);
  const criticalCount = deck.qaFlags.filter((f) => f.severity === "critical").length;
  const warningCount = deck.qaFlags.filter((f) => f.severity === "warning").length;
  const infoCount = deck.qaFlags.filter((f) => f.severity === "info").length;

  const theme = deck.themeOptions.find((t) => t.id === deck.selectedThemeId);
  const internalCount = deck.outline.filter((o) => o.role === "internal").length;
  const editingItem = deck.outline.find((o) => o.slideIndex === editingSlide) ?? null;
  const editingPosition = editingItem ? deck.outline.indexOf(editingItem) : -1;

  if (!deck.selectedThemeId || !theme) {
    return <p className="body-copy">Select a theme in Step 3 before reviewing the deck.</p>;
  }

  function progressFor(index: number): number {
    const internalIndex = deck.outline.slice(0, index + 1).filter((o) => o.role === "internal").length;
    return internalIndex / Math.max(internalCount, 1);
  }

  function thumbnailFor(item: SlideOutlineItem, index: number) {
    return (
      <SlideThumbnail
        role={item.role}
        theme={theme!}
        clientCompany={deck.form.clientCompany}
        headline={item.headline}
        subhead={item.subhead}
        bullets={item.bodyBullets}
        eyebrow={item.eyebrow}
        clientLogoDataUrl={deck.form.clientLogoDataUrl}
        slideNumber={item.role === "internal" ? item.slideIndex : undefined}
        progress={progressFor(index)}
      />
    );
  }

  function openSlide(slideIndex: number | null) {
    setEditingSlide(slideIndex);
  }

  const qaSummary =
    deck.qaFlags.length === 0
      ? "No issues found"
      : [criticalCount && `${criticalCount} critical`, warningCount && `${warningCount} to validate`, infoCount && `${infoCount} info`].filter(Boolean).join(" · ");

  return (
    <div>
      <EyebrowLabel>Final review</EyebrowLabel>
      <h1 className="display h1" style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-2)" }}>
        Review &amp; export
      </h1>
      <p className="subhead" style={{ marginBottom: "var(--space-6)", maxWidth: 700 }}>
        Everything below feeds the prompt you&apos;ll hand to your AI platform, including speaker notes and per-slide image prompts.
        Click any slide to edit it, jump back to an earlier agent, or copy the prompt when ready.
      </p>

      {/* ── Deck preview + inline editor + collapsible quality check ─────────── */}
      <div className="panel" style={{ padding: "var(--space-6)", marginBottom: "var(--space-8)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-4)", flexWrap: "wrap", marginBottom: "var(--space-4)" }}>
          <div>
            <h3 style={{ fontSize: "var(--fs-h4)", fontWeight: 700 }}>Deck preview — &ldquo;{theme.name}&rdquo;</h3>
            <p className="field-hint">
              What the finished deck should look like. Click a slide to change its text, notes and image prompt; the preview and the export
              prompt update as you type.
            </p>
          </div>
          {editingItem && (
            <Button size="sm" variant="secondary" onClick={() => openSlide(null)}>
              Close editor
            </Button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
          {deck.outline.map((item, i) => {
            const active = item.slideIndex === editingSlide;
            return (
              <div
                key={item.slideIndex}
                role="button"
                tabIndex={0}
                aria-pressed={active}
                aria-label={`Edit slide ${item.slideIndex}: ${item.headline}`}
                onClick={() => openSlide(active ? null : item.slideIndex)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openSlide(active ? null : item.slideIndex);
                  }
                }}
                className={active ? "card-selected" : ""}
                style={{
                  display: "grid",
                  gap: 8,
                  padding: 8,
                  borderRadius: "var(--radius-md)",
                  border: active ? undefined : "1px solid transparent",
                  cursor: "pointer",
                }}
              >
                {thumbnailFor(item, i)}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <span className="field-hint" style={{ marginTop: 0 }}>
                    Slide {item.slideIndex} · {item.role}
                  </span>
                  <span className="btn btn-ghost btn-sm" style={{ padding: "4px 10px", pointerEvents: "none" }}>
                    {active ? "Editing" : "Edit"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {editingItem && (
          <SlideEditor
            item={editingItem}
            position={editingPosition}
            total={deck.outline.length}
            preview={thumbnailFor(editingItem, editingPosition)}
            onChange={(patch) => onEditOutlineItem(editingItem.slideIndex, patch)}
            onChangeImagePrompt={(text) => onUpdateImagePrompt(editingItem.slideIndex, text)}
            onRegenerate={editingItem.role === "internal" ? () => onRegenerateSlide(editingItem.slideIndex) : undefined}
            onPrev={editingPosition > 0 ? () => openSlide(deck.outline[editingPosition - 1].slideIndex) : undefined}
            onNext={editingPosition < deck.outline.length - 1 ? () => openSlide(deck.outline[editingPosition + 1].slideIndex) : undefined}
            onClose={() => openSlide(null)}
          />
        )}

        {/* Quality check — collapsed by default; the toggle carries the summary */}
        <div style={{ marginTop: "var(--space-6)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--border-hairline)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setQaOpen((o) => !o)}
              aria-expanded={qaOpen}
              aria-controls="qa-details"
              className="btn btn-ghost btn-sm"
              style={{ padding: "4px 6px", gap: 10 }}
            >
              <span aria-hidden="true" style={{ display: "inline-block", width: 10, transition: "transform var(--motion-fast) var(--ease-standard)", transform: qaOpen ? "rotate(90deg)" : "none" }}>
                ▶
              </span>
              <span style={{ fontWeight: 700, color: "var(--fg-on-dark)" }}>Quality check</span>
              <Badge tone={criticalCount > 0 ? "warn" : "default"}>{qaSummary}</Badge>
            </button>
            <Button size="sm" variant="ghost" onClick={onRerunQa}>
              Re-run
            </Button>
          </div>
          {qaOpen && (
            <div id="qa-details" style={{ display: "grid", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
              {deck.qaFlags.length === 0 ? (
                <p className="field-hint">No issues found.</p>
              ) : (
                grouped.map(({ sev, flags }) => (
                  <div key={sev}>
                    <p className="field-label" style={{ marginBottom: 4 }}>
                      {SEVERITY_LABEL[sev]} ({flags.length})
                    </p>
                    <ul style={{ display: "grid", gap: 4 }}>
                      {flags.map((f) => (
                        <li key={f.id} style={{ fontSize: "var(--fs-body-sm)", color: "var(--fg-on-dark-2)" }}>
                          <Badge tone={sev === "critical" ? "warn" : "default"}>{f.category}</Badge>{" "}
                          {f.slideIndex !== undefined && (
                            <>
                              <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                style={{ padding: "0 4px", textDecoration: "underline" }}
                                onClick={() => openSlide(f.slideIndex ?? null)}
                              >
                                Slide {f.slideIndex}
                              </button>
                              {": "}
                            </>
                          )}
                          {f.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Step 1: deck prompt ───────────────────────────────────────────────── */}
      <StepHeading number="1" title="Build the deck" />
      <div className="panel" style={{ padding: "var(--space-6)", marginBottom: "var(--space-8)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: "var(--fs-h4)" }}>Your prompt for your AI platform</p>
            <p className="field-hint" style={{ maxWidth: 620 }}>
              Paste this into any AI platform that can produce a PowerPoint file or run Python — Claude, ChatGPT, Gemini, Copilot and
              similar. It will retrieve {deck.form.clientCompany || "the client"}&apos;s real logo and Infosys&apos;s real logo, build the
              cover motif exactly as previewed above, and design the actual .pptx from the story, narrative, and theme direction below — no
              fabricated facts, well-designed even without photography. Platforms that can generate images will also use the per-slide
              image prompts.
            </p>
          </div>
          <Button variant="primary" onClick={handleCopyPrompt}>
            {copied ? "Copied ✓" : "Copy prompt"}
          </Button>
        </div>
        <textarea
          readOnly
          value={prompt}
          className="textarea"
          style={{ minHeight: 260, fontFamily: "monospace", fontSize: 12.5, lineHeight: 1.6 }}
          onFocus={(e) => e.target.select()}
        />
      </div>

      {/* ── Step 2: images ────────────────────────────────────────────────────── */}
      <StepHeading number="2" title="Add the images (optional)" />
      <div className="panel" style={{ padding: "var(--space-6)", marginBottom: "var(--space-6)" }}>
        <p style={{ fontWeight: 700, fontSize: "var(--fs-h4)", marginBottom: "var(--space-2)" }}>Do this after your AI platform has returned the .pptx</p>
        <p className="body-copy" style={{ fontSize: "var(--fs-body-sm)", maxWidth: 720, marginBottom: "var(--space-4)" }}>
          The deck already looks finished without images — the cover motif is built from shapes. Images are an optional upgrade, and the deck
          prompt above already tells the AI what to do with them. Check which case you are in:
        </p>
        <ol style={{ display: "grid", gap: "var(--space-3)", paddingLeft: "1.2em", listStyle: "decimal", maxWidth: 720, marginBottom: "var(--space-5)" }}>
          <li className="body-copy" style={{ fontSize: "var(--fs-body-sm)" }}>
            <strong>Your AI platform can generate images</strong> (Claude with image tools, ChatGPT, Gemini, Copilot): it will have generated and
            placed these images itself. Open the deck, check each one, done.
          </li>
          <li className="body-copy" style={{ fontSize: "var(--fs-body-sm)" }}>
            <strong>Your AI platform cannot generate images:</strong> the deck will contain an outlined placeholder frame on each slide, and the
            matching prompt below is also saved in that slide&apos;s speaker notes. For each slide: press <strong>Copy</strong> next to the prompt,
            paste it into any image tool (Midjourney, DALL·E, Adobe Firefly, Canva, Gemini), download the result, then in PowerPoint right-click
            the placeholder frame → <em>Change Picture</em> (or drag the file onto it). Keep the left side of cover and closing images clear so the
            title stays readable.
          </li>
          <li className="body-copy" style={{ fontSize: "var(--fs-body-sm)" }}>
            <strong>No time for images:</strong> delete the placeholder frames. Nothing else in the deck depends on them.
          </li>
        </ol>
        <ImagePromptsPanel
          outline={deck.outline}
          theme={theme}
          clientCompany={deck.form.clientCompany}
          style={deck.imagePromptStyle}
          onSetStyle={onSetImagePromptStyle}
          onUpdatePrompt={onUpdateImagePrompt}
        />
        <p className="field-hint" style={{ marginTop: "var(--space-3)" }}>
          Switching Abstract / Photographic here rewrites the prompts and updates the deck prompt above — copy the deck prompt again if you change
          it after pasting.
        </p>
      </div>
    </div>
  );
}

/** Inline editor for one slide: live thumbnail on the left, every editable field on the right. */
function SlideEditor({
  item,
  position,
  total,
  preview,
  onChange,
  onChangeImagePrompt,
  onRegenerate,
  onPrev,
  onNext,
  onClose,
}: {
  item: SlideOutlineItem;
  position: number;
  total: number;
  preview: React.ReactNode;
  onChange: (patch: Partial<SlideOutlineItem>) => void;
  onChangeImagePrompt: (text: string) => void;
  onRegenerate?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onClose: () => void;
}) {
  const field = (label: string, control: React.ReactNode, hint?: string) => (
    <div>
      <p className="field-label" style={{ marginBottom: 4 }}>
        {label}
      </p>
      {control}
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );

  return (
    <div
      style={{
        marginTop: "var(--space-6)",
        paddingTop: "var(--space-6)",
        borderTop: "1px solid var(--border-hairline)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "var(--space-6)",
        alignItems: "start",
      }}
    >
      <div style={{ position: "sticky", top: 96 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
          <Badge>
            Slide {item.slideIndex} · {item.role}
          </Badge>
          <div style={{ display: "flex", gap: 4 }}>
            <Button size="sm" variant="ghost" onClick={onPrev} disabled={!onPrev}>
              ← Prev
            </Button>
            <Button size="sm" variant="ghost" onClick={onNext} disabled={!onNext}>
              Next →
            </Button>
          </div>
        </div>
        {preview}
        <p className="field-hint">
          Slide {position + 1} of {total}. Preview updates live as you type.
        </p>
      </div>

      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        {item.role === "internal" &&
          field("Eyebrow (chapter label)", <input className="input" value={item.eyebrow ?? ""} onChange={(e) => onChange({ eyebrow: e.target.value })} />)}
        {field("Headline", <input className="input" value={item.headline} onChange={(e) => onChange({ headline: e.target.value })} />)}
        {item.role !== "internal" &&
          field(
            "Subhead",
            <textarea className="textarea" style={{ minHeight: 60 }} value={item.subhead ?? ""} onChange={(e) => onChange({ subhead: e.target.value })} />
          )}
        {item.role === "internal" &&
          field(
            "Bullets (one per line)",
            <textarea
              className="textarea"
              style={{ minHeight: 110 }}
              value={item.bodyBullets.join("\n")}
              onChange={(e) => onChange({ bodyBullets: e.target.value.split("\n") })}
            />,
            "Keep to three or four short lines — the quality check flags anything longer."
          )}
        {field(
          "Speaker notes",
          <textarea className="textarea" style={{ minHeight: 90 }} value={item.speakerNotes} onChange={(e) => onChange({ speakerNotes: e.target.value })} />
        )}
        {field(
          "Image prompt",
          <textarea
            className="textarea"
            style={{ minHeight: 90, fontSize: "var(--fs-body-sm)" }}
            value={item.imagePrompt ?? ""}
            onChange={(e) => onChangeImagePrompt(e.target.value)}
          />,
          "Also listed under Step 2 below, and copied into the deck prompt."
        )}
        {item.placeholderFlags.length > 0 && (
          <div>
            <p className="field-label" style={{ marginBottom: 4 }}>
              Validate before presenting
            </p>
            <ul style={{ display: "grid", gap: 4 }}>
              {item.placeholderFlags.map((f, i) => (
                <li key={i} className="field-hint" style={{ marginTop: 0 }}>
                  ⚠ {f}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end", flexWrap: "wrap" }}>
          {onRegenerate && (
            <Button size="sm" variant="secondary" onClick={onRegenerate}>
              Regenerate this slide
            </Button>
          )}
          <Button size="sm" variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

function StepHeading({ number, title }: { number: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
      <span
        aria-hidden="true"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "var(--ce-white)",
          color: "#050505",
          fontWeight: 700,
          fontSize: 13,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {number}
      </span>
      <h2 style={{ fontSize: "var(--fs-h3)", fontWeight: 700 }}>
        Step {number} — {title}
      </h2>
    </div>
  );
}
