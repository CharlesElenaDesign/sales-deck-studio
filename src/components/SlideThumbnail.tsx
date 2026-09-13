"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import { readableTextOn } from "@/lib/colorUtils";
import { ART_H, ART_W, describeCoverArt } from "@/lib/coverArt";
import { ThemeOption } from "@/lib/types";

interface Props {
  role: "cover" | "internal" | "closing";
  theme: ThemeOption;
  clientCompany: string;
  headline: string;
  subhead?: string;
  bullets?: string[];
  eyebrow?: string;
  clientLogoDataUrl?: string;
  slideNumber?: number;
  progress?: number;
}

const frameOuter: CSSProperties = {
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
  aspectRatio: "16 / 9",
  position: "relative",
  overflow: "hidden",
  borderRadius: 6,
  border: "1px solid var(--border-hairline)",
};

/**
 * Three layers, deliberately:
 *  1. outer — owns the 16:9 aspect ratio (combining `container-type` with `aspect-ratio` on one
 *     element makes the browser drop the ratio, a real bug reproduced here);
 *  2. middle — the container-query context (`container-type: inline-size`);
 *  3. inner — receives the per-slide style, including `cqw` padding.
 * The inner layer must be separate from the container itself: an element cannot resolve `cqw`
 * against its own size, so `padding: 6cqw` on the container fell back to the viewport width and
 * blew out the thumbnails on wide screens.
 */
function Frame({ style, children }: { style: CSSProperties; children: ReactNode }) {
  return (
    <div style={frameOuter}>
      <div style={{ position: "absolute", inset: 0, containerType: "inline-size" }}>
        <div style={{ position: "absolute", inset: 0, ...style }}>{children}</div>
      </div>
    </div>
  );
}

/**
 * Draws the theme's motif from the shared shape data in `coverArt.ts`, so the preview and the
 * exported prompt always describe the same graphic. `withBackdrop` paints the cover gradient;
 * internal echoes leave the surface alone and only draw the shapes at reduced intensity.
 */
export function CoverArt({
  variant,
  palette,
  intensity = 1,
  withBackdrop = false,
}: {
  variant: ThemeOption["layoutVariant"];
  palette: ThemeOption["palette"];
  intensity?: number;
  withBackdrop?: boolean;
}) {
  const art = describeCoverArt(variant, palette, intensity);
  const gradId = `art-grad-${useId()}`;
  return (
    <svg
      viewBox={`0 0 ${ART_W} ${ART_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      {withBackdrop && (
        <>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={art.backdrop.from} />
              <stop offset="1" stopColor={art.backdrop.to} />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width={ART_W} height={ART_H} fill={`url(#${gradId})`} />
        </>
      )}
      {art.shapes.map((s, i) => {
        switch (s.kind) {
          case "circle":
            return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.fill} opacity={s.opacity} />;
          case "ring":
            return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="none" stroke={s.stroke} strokeWidth={s.strokeWidth} opacity={s.opacity} />;
          case "rect":
            return <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} fill={s.fill} opacity={s.opacity} />;
          case "polygon":
            return <polygon key={i} points={s.points.map(([x, y]) => `${x},${y}`).join(" ")} fill={s.fill} opacity={s.opacity} />;
          case "line":
            return <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.stroke} strokeWidth={s.strokeWidth} opacity={s.opacity} />;
        }
      })}
    </svg>
  );
}

function Lockup({ clientCompany, clientLogoDataUrl, textColor }: { clientCompany: string; clientLogoDataUrl?: string; textColor: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1cqw", fontSize: "3cqw", fontWeight: 700, color: textColor, letterSpacing: "0.08em" }}>
      {clientLogoDataUrl ? (
        <span style={{ background: "#ffffff", borderRadius: "0.8cqw", padding: "0.8cqw 1.4cqw", display: "inline-flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={clientLogoDataUrl} alt="" style={{ height: "4.2cqw", maxWidth: "24cqw", width: "auto", objectFit: "contain" }} />
        </span>
      ) : (
        <span>{clientCompany.toUpperCase() || "CLIENT"}</span>
      )}
      <span style={{ width: 1, height: "3cqw", background: textColor, opacity: 0.6, display: "inline-block" }} />
      <span style={{ fontSize: "2.4cqw" }}>INFOSYS</span>
    </div>
  );
}

const clamp2: CSSProperties = { overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" };

export function SlideThumbnail({ role, theme, clientCompany, headline, subhead, bullets = [], eyebrow, clientLogoDataUrl, slideNumber, progress }: Props) {
  const { primary, neutralDark, neutralLight, surface } = theme.palette;
  const darkFg = readableTextOn(neutralDark);
  const titleColor = readableTextOn(surface);

  if (role === "cover" || role === "closing") {
    return (
      <Frame style={{ background: neutralDark, padding: "6cqw", display: "flex", flexDirection: "column" }}>
        <CoverArt variant={theme.layoutVariant} palette={theme.palette} withBackdrop />
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
          <Lockup clientCompany={clientCompany} clientLogoDataUrl={clientLogoDataUrl} textColor={darkFg} />
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: role === "cover" ? "6.5cqw" : "7.5cqw", fontWeight: 700, color: darkFg, lineHeight: 1.1, marginBottom: "2cqw", maxWidth: "55%" }}>
            {headline}
          </div>
          {subhead && <div style={{ fontSize: "2.6cqw", color: darkFg, opacity: 0.75, maxWidth: "50%", ...clamp2 }}>{subhead}</div>}
        </div>
      </Frame>
    );
  }

  // internal
  if (theme.layoutVariant === "grid") {
    const rightText = readableTextOn(primary);
    const leftText = readableTextOn(neutralLight);
    return (
      <Frame style={{ background: surface, padding: "6cqw", display: "flex", flexDirection: "column" }}>
        {eyebrow && <div style={{ fontSize: "1.8cqw", fontWeight: 700, color: primary, letterSpacing: "0.1em" }}>{eyebrow.toUpperCase()}</div>}
        <div style={{ fontSize: "4.2cqw", fontWeight: 700, color: titleColor, lineHeight: 1.15, margin: "1.5cqw 0 2.5cqw" }}>{headline}</div>
        <div style={{ display: "flex", gap: "1.5cqw", flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1.4, background: neutralLight, borderRadius: 6, padding: "2cqw", display: "flex", flexDirection: "column", gap: "1cqw" }}>
            {bullets.slice(0, 2).map((b, i) => (
              <div key={i} style={{ fontSize: "1.9cqw", color: leftText, display: "flex", gap: "0.8cqw" }}>
                <span>•</span>
                <span style={clamp2}>{b}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, position: "relative", overflow: "hidden", background: primary, borderRadius: 6, padding: "2cqw", display: "flex", alignItems: "center" }}>
            <CoverArt variant="grid" palette={theme.palette} intensity={0.6} />
            <span style={{ position: "relative", zIndex: 1, fontSize: "1.8cqw", color: rightText, ...clamp2 }}>{bullets[2] ?? bullets[0] ?? ""}</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5cqw" }}>
          {slideNumber !== undefined && <span style={{ fontSize: "1.7cqw", color: titleColor, opacity: 0.6 }}>{slideNumber}</span>}
        </div>
      </Frame>
    );
  }

  if (theme.layoutVariant === "gradient-band") {
    const p = progress ?? 0.5;
    return (
      <Frame style={{ background: surface, display: "flex" }}>
        <div style={{ width: "2.5cqw", background: neutralLight, position: "relative", flex: "0 0 auto" }}>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${p * 100}%`, background: primary }} />
        </div>
        <div style={{ flex: 1, minWidth: 0, position: "relative", overflow: "hidden", padding: "6cqw", display: "flex", flexDirection: "column" }}>
          <CoverArt variant="gradient-band" palette={theme.palette} intensity={0.4} />
          {eyebrow && <div style={{ position: "relative", fontSize: "1.8cqw", fontWeight: 700, color: primary, letterSpacing: "0.1em" }}>{eyebrow.toUpperCase()}</div>}
          <div style={{ position: "relative", fontSize: "4.4cqw", fontWeight: 700, color: titleColor, lineHeight: 1.15, margin: "1.5cqw 0 2.5cqw", maxWidth: "62%" }}>{headline}</div>
          <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "1.2cqw", maxWidth: "62%" }}>
            {bullets.slice(0, 3).map((b, i) => (
              <div key={i} style={{ fontSize: "2cqw", color: titleColor, display: "flex", gap: "1cqw" }}>
                <span>•</span>
                <span style={clamp2}>{b}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ position: "relative", display: "flex", justifyContent: "flex-end" }}>
            {slideNumber !== undefined && <span style={{ fontSize: "1.7cqw", color: titleColor, opacity: 0.6 }}>{slideNumber}</span>}
          </div>
        </div>
      </Frame>
    );
  }

  // editorial (default)
  return (
    <Frame style={{ background: surface, padding: "6cqw", display: "flex", flexDirection: "column" }}>
      {eyebrow && <div style={{ fontSize: "1.8cqw", fontWeight: 700, color: primary, letterSpacing: "0.1em" }}>{eyebrow.toUpperCase()}</div>}
      <div style={{ fontSize: "4.6cqw", fontWeight: 700, color: titleColor, lineHeight: 1.15, margin: "1.5cqw 0 2.5cqw" }}>{headline}</div>
      <div style={{ display: "flex", gap: "2cqw", flex: 1, minHeight: 0 }}>
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: "1.4cqw" }}>
          {bullets.slice(0, 3).map((b, i) => (
            <div key={i} style={{ fontSize: "2.1cqw", color: titleColor, display: "flex", gap: "1cqw" }}>
              <span>•</span>
              <span style={clamp2}>{b}</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, position: "relative", overflow: "hidden", background: neutralLight, border: `1px solid ${primary}`, borderRadius: 4 }}>
          <CoverArt variant="editorial" palette={theme.palette} intensity={0.55} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5cqw" }}>
        {slideNumber !== undefined && <span style={{ fontSize: "1.7cqw", color: titleColor, opacity: 0.6 }}>{slideNumber}</span>}
      </div>
    </Frame>
  );
}
