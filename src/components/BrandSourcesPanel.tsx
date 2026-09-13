"use client";

import { useState } from "react";
import { BrandProfile } from "@/lib/types";
import { Badge, Button } from "./ui";

function BrandColumn({
  label,
  brand,
  loading,
  onRetryWithUrl,
}: {
  label: string;
  brand?: BrandProfile;
  loading: boolean;
  onRetryWithUrl?: (url: string) => void;
}) {
  const [urlInput, setUrlInput] = useState("");

  if (loading) {
    return (
      <div style={{ flex: 1, minWidth: 260 }}>
        <p className="field-label">{label}</p>
        <div className="skeleton" style={{ height: 14, width: "60%", marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: "80%", marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: "40%" }} />
      </div>
    );
  }

  if (!brand) {
    return (
      <div style={{ flex: 1, minWidth: 260 }}>
        <p className="field-label">{label}</p>
        <p className="field-hint">Research has not run yet.</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, minWidth: 260 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-2)" }}>
        <p className="field-label" style={{ marginBottom: 0 }}>
          {label}
        </p>
        <Badge tone={brand.confidence === "unavailable" ? "warn" : "live"}>
          {brand.confidence === "unavailable" ? "Unavailable" : "Approximated from live site"}
        </Badge>
      </div>

      {brand.colors.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginBottom: "var(--space-3)" }}>
          {brand.colors.map((c) => (
            <div key={c.hex} title={`${c.label}: ${c.hex}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ width: 22, height: 22, borderRadius: 5, background: c.hex, border: "1px solid var(--border-hairline)" }} />
              <span style={{ fontSize: 9, color: "var(--fg-on-dark-3)" }}>{c.hex}</span>
            </div>
          ))}
        </div>
      )}

      {brand.fonts.length > 0 && (
        <p className="field-hint" style={{ marginTop: 0, marginBottom: "var(--space-2)" }}>
          Fonts detected: {brand.fonts.join(", ")}
        </p>
      )}

      {brand.sources.length > 0 && (
        <ul style={{ display: "grid", gap: 4, marginBottom: "var(--space-2)" }}>
          {brand.sources.map((s) => (
            <li key={s.url} style={{ fontSize: "var(--fs-label-small)" }}>
              <a href={s.url} target="_blank" rel="noreferrer" style={{ color: "var(--ce-aqua)", textDecoration: "underline" }}>
                {s.label}
              </a>{" "}
              <span style={{ color: "var(--fg-on-dark-3)" }}>· accessed {new Date(s.accessedAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}

      {brand.notes.map((n, i) => (
        <p key={i} className="field-hint" style={{ marginTop: i === 0 ? "var(--space-2)" : 4 }}>
          {n}
        </p>
      ))}

      {brand.confidence === "unavailable" && onRetryWithUrl && (
        <div style={{ display: "flex", gap: 6, marginTop: "var(--space-3)" }}>
          <input
            className="input"
            placeholder="Correct website address…"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            style={{ fontSize: "var(--fs-body-sm)" }}
          />
          <Button size="sm" variant="secondary" onClick={() => urlInput.trim() && onRetryWithUrl(urlInput.trim())}>
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}

export function BrandSourcesPanel({
  infosysBrand,
  clientBrand,
  status,
  clientCompany,
  onRetryClient,
}: {
  infosysBrand?: BrandProfile;
  clientBrand?: BrandProfile;
  status: "idle" | "loading" | "done" | "error";
  clientCompany: string;
  onRetryClient: (url: string) => void;
}) {
  return (
    <div className="panel" style={{ padding: "var(--space-6)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
        <h3 style={{ fontSize: "var(--fs-h4)", fontWeight: 700 }}>Brand sources</h3>
        <Badge>Public brand identity research only — never the deal synopsis</Badge>
      </div>
      <div style={{ display: "flex", gap: "var(--space-8)", flexWrap: "wrap" }}>
        <BrandColumn label="Infosys" brand={infosysBrand} loading={status === "loading"} />
        <BrandColumn label={clientCompany || "Client"} brand={clientBrand} loading={status === "loading"} onRetryWithUrl={onRetryClient} />
      </div>
    </div>
  );
}
