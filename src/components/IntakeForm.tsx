"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { KNOWN_CLIENTS, KnownClient, matchKnownClient, suggestKnownClients } from "@/lib/knownClients";
import { LIST_LOGO_MARKER, logoForKnownClient } from "@/lib/knownClientLogos";
import { PRESET_SYNOPSES } from "@/lib/sampleData";
import { IntakeFormData } from "@/lib/types";
import { Button, EyebrowLabel, FieldLabel } from "./ui";

interface Props {
  initial: IntakeFormData;
  onSubmit: (form: IntakeFormData) => void;
  /** Step back to the landing page. Whatever is typed here stays in the draft. */
  onBack: () => void;
}

type Errors = Partial<Record<"clientCompany" | "synopsisText", string>>;

const SUGGESTION_SECTIONS: { group: KnownClient["group"]; tier: KnownClient["tier"]; label: string }[] = [
  { group: "Financial services", tier: "showcase", label: "Financial services — showcase list" },
  { group: "Manufacturing", tier: "showcase", label: "Manufacturing — showcase list" },
  { group: "Financial services", tier: "extended", label: "Other European — financial services & insurance" },
  { group: "Manufacturing", tier: "extended", label: "Other European — manufacturing & industrial" },
];

function withDefaultPreset(form: IntakeFormData): IntakeFormData {
  if (form.synopsisMode === "preset" && !form.presetSynopsisId) {
    const first = PRESET_SYNOPSES[0];
    return { ...form, presetSynopsisId: first.id, synopsisText: first.text };
  }
  return form;
}

export function IntakeForm({ initial, onSubmit, onBack }: Props) {
  const [form, setForm] = useState<IntakeFormData>(() => withDefaultPreset(initial));
  const [errors, setErrors] = useState<Errors>({});
  const [clientMenuOpen, setClientMenuOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const clientFieldRef = useRef<HTMLDivElement>(null);

  function set<K extends keyof IntakeFormData>(key: K, value: IntakeFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  useEffect(() => {
    if (!clientMenuOpen) return;
    function onDocClick(e: MouseEvent) {
      if (clientFieldRef.current && !clientFieldRef.current.contains(e.target as Node)) setClientMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [clientMenuOpen]);

  const suggestions = suggestKnownClients(form.clientCompany);
  const knownSelected = form.knownClientId ? KNOWN_CLIENTS.find((c) => c.id === form.knownClientId) : undefined;

  /** Attach the listed client's logo unless the user uploaded their own; drop a list logo when the client changes. */
  function listLogoPatch(f: IntakeFormData, client: KnownClient | undefined): Partial<IntakeFormData> {
    const userUploaded = !!f.clientLogoDataUrl && f.clientLogoFileName !== LIST_LOGO_MARKER;
    if (userUploaded) return {};
    const logo = client ? logoForKnownClient(client.id) : undefined;
    return logo ? { clientLogoDataUrl: logo, clientLogoFileName: LIST_LOGO_MARKER } : { clientLogoDataUrl: undefined, clientLogoFileName: undefined };
  }

  /** Free text always wins: typing keeps whatever the user wrote, and only an exact match re-links a curated client. */
  function handleClientNameChange(value: string) {
    const exact = matchKnownClient(value);
    setForm((f) => {
      const previous = KNOWN_CLIENTS.find((c) => c.id === f.knownClientId);
      // A website we auto-filled for a previous pick should not outlive that pick.
      const websiteWasAutoFilled = !!previous && f.clientWebsite === previous.website;
      let clientWebsite = f.clientWebsite;
      if (exact && (!clientWebsite || websiteWasAutoFilled)) clientWebsite = exact.website;
      else if (!exact && websiteWasAutoFilled) clientWebsite = "";
      return { ...f, clientCompany: value, knownClientId: exact?.id, clientWebsite, ...listLogoPatch(f, exact) };
    });
    setClientMenuOpen(true);
    setActiveSuggestion(-1);
  }

  function pickKnownClient(client: KnownClient) {
    setForm((f) => {
      const previous = KNOWN_CLIENTS.find((c) => c.id === f.knownClientId);
      const keepTypedWebsite = !!f.clientWebsite && f.clientWebsite !== previous?.website;
      return { ...f, clientCompany: client.name, knownClientId: client.id, clientWebsite: keepTypedWebsite ? f.clientWebsite : client.website, ...listLogoPatch(f, client) };
    });
    setClientMenuOpen(false);
    setActiveSuggestion(-1);
  }

  function handleClientKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!clientMenuOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setClientMenuOpen(true);
      return;
    }
    if (!clientMenuOpen || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeSuggestion >= 0) {
      e.preventDefault();
      pickKnownClient(suggestions[activeSuggestion]);
    } else if (e.key === "Escape") {
      setClientMenuOpen(false);
    }
  }

  function handlePresetChange(id: string) {
    const preset = PRESET_SYNOPSES.find((p) => p.id === id);
    setForm((f) => ({ ...f, presetSynopsisId: id, synopsisText: preset?.text ?? "" }));
  }

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        set("clientLogoDataUrl", reader.result as string);
        set("clientLogoFileName", file.name);
      };
      reader.readAsDataURL(file);
    } else {
      set("clientLogoDataUrl", undefined);
      set("clientLogoFileName", file.name);
    }
  }

  function validate(): boolean {
    const next: Errors = {};
    if (!form.clientCompany.trim()) next.clientCompany = "Client company name is required.";
    if (!form.synopsisText.trim()) next.synopsisText = "A deal synopsis is required — choose a preset or write your own.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (validate()) onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <EyebrowLabel>New presentation</EyebrowLabel>
      <h1 className="display h1" style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-2)" }}>
        Tell us about the deal
      </h1>
      <p className="subhead" style={{ marginBottom: "var(--space-10)", maxWidth: 640 }}>
        Three agents — Story, Narrative, and Theming — will turn this into a co-branded, editable Infosys
        presentation. All fictional client and deal details in the presets below are for demonstration only.
      </p>

      <div className="panel" style={{ padding: "var(--space-8)", display: "grid", gap: "var(--space-6)" }}>
        <div ref={clientFieldRef} style={{ position: "relative" }}>
          <FieldLabel htmlFor="clientCompany" required>
            Client company name
          </FieldLabel>
          <input
            id="clientCompany"
            className={`input ${errors.clientCompany ? "input-error" : ""}`}
            value={form.clientCompany}
            onChange={(e) => handleClientNameChange(e.target.value)}
            onFocus={() => setClientMenuOpen(true)}
            onKeyDown={handleClientKeyDown}
            placeholder="Type any client name, or pick from the showcase list"
            autoComplete="off"
            role="combobox"
            aria-expanded={clientMenuOpen}
            aria-controls="clientCompany-suggestions"
            aria-autocomplete="list"
            aria-invalid={!!errors.clientCompany}
            aria-describedby={errors.clientCompany ? "clientCompany-error" : "clientCompany-hint"}
          />
          {clientMenuOpen && suggestions.length > 0 && (
            <ul
              id="clientCompany-suggestions"
              role="listbox"
              className="panel"
              style={{
                position: "absolute",
                zIndex: 30,
                left: 0,
                right: 0,
                marginTop: 6,
                maxHeight: 320,
                overflowY: "auto",
                padding: 6,
                boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
              }}
            >
              {SUGGESTION_SECTIONS.map(({ group, tier, label }) => {
                const items = suggestions.filter((c) => c.group === group && c.tier === tier);
                if (items.length === 0) return null;
                return (
                  <li key={`${tier}-${group}`} role="presentation">
                    <p className="field-hint" style={{ margin: "6px 10px 4px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {label}
                    </p>
                    <ul role="group" aria-label={group}>
                      {items.map((c) => {
                        const idx = suggestions.indexOf(c);
                        const active = idx === activeSuggestion;
                        return (
                          <li
                            key={c.id}
                            role="option"
                            aria-selected={form.knownClientId === c.id}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => pickKnownClient(c)}
                            onMouseEnter={() => setActiveSuggestion(idx)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "8px 10px",
                              borderRadius: "var(--radius-sm)",
                              cursor: "pointer",
                              background: active ? "rgba(255,255,255,0.08)" : "transparent",
                            }}
                          >
                            <span aria-hidden="true" style={{ display: "inline-flex", gap: 2 }}>
                              <span style={{ width: 10, height: 10, borderRadius: 2, background: c.primary, border: "1px solid rgba(255,255,255,0.2)" }} />
                              <span style={{ width: 10, height: 10, borderRadius: 2, background: c.secondary, border: "1px solid rgba(255,255,255,0.2)" }} />
                            </span>
                            <span style={{ fontSize: "var(--fs-body-sm)", fontWeight: 500 }}>{c.name}</span>
                            <span className="field-hint" style={{ marginTop: 0, marginLeft: "auto" }}>{c.website}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}
          {errors.clientCompany ? (
            <p id="clientCompany-error" className="field-error" role="alert">
              {errors.clientCompany}
            </p>
          ) : (
            <p id="clientCompany-hint" className="field-hint">
              {knownSelected
                ? knownSelected.tier === "showcase"
                  ? `${knownSelected.name} is on the TITAN Europe showcase list — website and reference brand colours are pre-filled.`
                  : `${knownSelected.name} is on the extended European list — website and reference brand colours are pre-filled.`
                : "Suggestions come from David's TITAN Europe showcase list; type two letters to search the wider European list. Any other client name works too."}
            </p>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="clientWebsite">Client website (optional)</FieldLabel>
          <input
            id="clientWebsite"
            className="input"
            value={form.clientWebsite ?? ""}
            onChange={(e) => set("clientWebsite", e.target.value)}
            placeholder="e.g. meridianfinancial.com"
          />
          <p className="field-hint">Improves the accuracy of live brand research in Step 3. We&apos;ll guess a domain from the company name if this is left blank.</p>
        </div>

        <div>
          <FieldLabel>Deal synopsis</FieldLabel>
          <div role="radiogroup" aria-label="Deal synopsis mode" style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
            <Button
              type="button"
              size="sm"
              variant={form.synopsisMode === "preset" ? "primary" : "secondary"}
              aria-pressed={form.synopsisMode === "preset"}
              onClick={() => {
                set("synopsisMode", "preset");
                if (!form.presetSynopsisId) handlePresetChange(PRESET_SYNOPSES[0].id);
              }}
            >
              Use preset synopsis
            </Button>
            <Button
              type="button"
              size="sm"
              variant={form.synopsisMode === "custom" ? "primary" : "secondary"}
              aria-pressed={form.synopsisMode === "custom"}
              onClick={() => set("synopsisMode", "custom")}
            >
              Write my own
            </Button>
          </div>

          {form.synopsisMode === "preset" && (
            <select
              className="select"
              style={{ marginBottom: "var(--space-4)" }}
              value={form.presetSynopsisId ?? ""}
              onChange={(e) => handlePresetChange(e.target.value)}
              aria-label="Preset deal synopsis"
            >
              {PRESET_SYNOPSES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} — {p.industry}
                </option>
              ))}
            </select>
          )}

          <textarea
            id="synopsisText"
            className={`textarea ${errors.synopsisText ? "input-error" : ""}`}
            value={form.synopsisText}
            onChange={(e) => set("synopsisText", e.target.value)}
            placeholder="Describe the client's situation, the problem to solve, and what a win looks like…"
            aria-invalid={!!errors.synopsisText}
            aria-describedby={errors.synopsisText ? "synopsis-error" : undefined}
          />
          {errors.synopsisText && (
            <p id="synopsis-error" className="field-error" role="alert">
              {errors.synopsisText}
            </p>
          )}
          <p className="field-hint">This synopsis is treated as confidential — it is never sent anywhere except this app&apos;s own generation logic.</p>
        </div>

        <Divider />

        <div className="grid-2">
          <div>
            <FieldLabel htmlFor="presentationTitle">Presentation title (optional)</FieldLabel>
            <input
              id="presentationTitle"
              className="input"
              value={form.presentationTitle ?? ""}
              onChange={(e) => set("presentationTitle", e.target.value)}
              placeholder="Defaults to the selected story name"
            />
          </div>
          <div>
            <FieldLabel htmlFor="presenterName">Presenter name (optional)</FieldLabel>
            <input
              id="presenterName"
              className="input"
              value={form.presenterName ?? ""}
              onChange={(e) => set("presenterName", e.target.value)}
            />
          </div>
        </div>

        <div className="grid-2">
          <div>
            <FieldLabel htmlFor="presenterDate">Presentation date (optional)</FieldLabel>
            <input
              id="presenterDate"
              type="date"
              className="input"
              value={form.presenterDate ?? ""}
              onChange={(e) => set("presenterDate", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="presenterEmail">Presenter contact (optional)</FieldLabel>
            <input
              id="presenterEmail"
              className="input"
              value={form.presenterEmail ?? ""}
              onChange={(e) => set("presenterEmail", e.target.value)}
              placeholder="name@infosys.com"
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="notes">Supporting notes (optional)</FieldLabel>
          <textarea
            id="notes"
            className="textarea"
            style={{ minHeight: 70 }}
            value={form.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Anything else the Story Agent should factor in…"
          />
        </div>

        <div>
          <FieldLabel htmlFor="clientLogo">Upload client logo or brand guidelines (optional)</FieldLabel>
          <input
            id="clientLogo"
            type="file"
            accept="image/*,.pdf"
            className="input"
            onChange={handleLogoChange}
          />
          {form.clientLogoFileName === LIST_LOGO_MARKER && form.clientLogoDataUrl ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
              <span style={{ background: "#fff", borderRadius: 6, padding: "4px 8px", display: "inline-flex" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.clientLogoDataUrl} alt={`${form.clientCompany} logo`} style={{ height: 22, width: "auto" }} />
              </span>
              <p className="field-hint" style={{ marginTop: 0 }}>
                {knownSelected?.name ?? form.clientCompany}&apos;s official logo is already on file from the client list. Upload a file only to
                replace it.
              </p>
            </div>
          ) : form.clientLogoFileName ? (
            <p className="field-hint">Attached: {form.clientLogoFileName}</p>
          ) : knownSelected ? (
            <p className="field-hint">
              {knownSelected.name}&apos;s website and reference colours are on file. No logo file is stored for this one, so upload one if you
              want it in the in-app preview; the AI platform retrieves the official logo itself when it builds the deck.
            </p>
          ) : null}
        </div>

        <div>
          <FieldLabel>Slide count</FieldLabel>
          <div role="radiogroup" aria-label="Slide count" style={{ display: "flex", gap: "var(--space-3)" }}>
            <Button
              type="button"
              size="sm"
              variant={form.slideCount === 6 ? "primary" : "secondary"}
              aria-pressed={form.slideCount === 6}
              onClick={() => set("slideCount", 6)}
            >
              6 slides (cover + 4 internal + close)
            </Button>
            <Button
              type="button"
              size="sm"
              variant={form.slideCount === 5 ? "primary" : "secondary"}
              aria-pressed={form.slideCount === 5}
              onClick={() => set("slideCount", 5)}
            >
              5 slides (cover + 3 internal + close)
            </Button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "var(--space-8)", display: "flex", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap" }}>
        <Button type="button" variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <Button type="submit" variant="primary">
          Generate story options →
        </Button>
      </div>
    </form>
  );
}

function Divider() {
  return <hr className="hairline" style={{ margin: 0 }} />;
}
