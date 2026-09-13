"use client";

import { useState } from "react";
import { ImagePromptStyle, SlideOutlineItem, ThemeOption } from "@/lib/types";
import { Badge, Button } from "./ui";

interface Props {
  outline: SlideOutlineItem[];
  theme: ThemeOption;
  clientCompany: string;
  style: ImagePromptStyle;
  onSetStyle: (style: ImagePromptStyle) => void;
  onUpdatePrompt: (slideIndex: number, text: string) => void;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    window.prompt("Copy this prompt:", text);
    return false;
  }
}

/**
 * One image prompt per slide, in the chosen theme's palette and motif. Not every AI platform
 * can generate images, so these are written to be pasted into any image tool separately.
 */
export function ImagePromptsPanel({ outline, theme, clientCompany, style, onSetStyle, onUpdatePrompt }: Props) {
  const [copiedIndex, setCopiedIndex] = useState<number | "all" | null>(null);

  function flashCopied(key: number | "all") {
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex((cur) => (cur === key ? null : cur)), 1800);
  }

  async function handleCopyAll() {
    const text = outline
      .filter((o) => o.imagePrompt)
      .map((o) => `Slide ${o.slideIndex} (${o.role}) — ${o.headline}\n${o.imagePrompt}`)
      .join("\n\n");
    if (await copyText(text)) flashCopied("all");
  }

  return (
    <div style={{ borderTop: "1px solid var(--border-hairline)", paddingTop: "var(--space-5)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-4)", marginBottom: "var(--space-5)" }}>
        <div style={{ maxWidth: 640 }}>
          <h3 style={{ fontSize: "var(--fs-h4)", fontWeight: 700 }}>Image prompts, one per slide</h3>
          <p className="field-hint">
            Written for the &ldquo;{theme.name}&rdquo; style in {clientCompany || "the client"}&apos;s own palette, with the client&apos;s brand
            cue built in. Each one is ready to paste as-is.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", flexWrap: "wrap" }}>
          <div role="radiogroup" aria-label="Image style" style={{ display: "inline-flex", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-pill)", padding: 3 }}>
            {(["abstract", "photographic"] as ImagePromptStyle[]).map((opt) => {
              const active = style === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onSetStyle(opt)}
                  className="btn btn-sm"
                  style={{
                    border: 0,
                    background: active ? "var(--ce-white)" : "transparent",
                    color: active ? "#050505" : "var(--fg-on-dark-2)",
                  }}
                >
                  {opt === "abstract" ? "Abstract motif" : "Photographic"}
                </button>
              );
            })}
          </div>
          <Button size="sm" variant="secondary" onClick={handleCopyAll}>
            {copiedIndex === "all" ? "Copied ✓" : "Copy all"}
          </Button>
        </div>
      </div>

      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        {outline.map((item) => (
          <div key={item.slideIndex} style={{ display: "grid", gap: "var(--space-2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", minWidth: 0 }}>
                <Badge>
                  Slide {item.slideIndex} · {item.role}
                </Badge>
                <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.headline}</span>
                <span className="field-hint" style={{ marginTop: 0, whiteSpace: "nowrap" }}>
                  {item.role === "internal" ? "4:3 panel" : "16:9 backdrop"}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={async () => {
                  if (await copyText(item.imagePrompt ?? "")) flashCopied(item.slideIndex);
                }}
              >
                {copiedIndex === item.slideIndex ? "Copied ✓" : "Copy"}
              </Button>
            </div>
            <textarea
              className="textarea"
              style={{ minHeight: 84, fontSize: "var(--fs-body-sm)", lineHeight: 1.5 }}
              value={item.imagePrompt ?? ""}
              onChange={(e) => onUpdatePrompt(item.slideIndex, e.target.value)}
              aria-label={`Image prompt for slide ${item.slideIndex}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
