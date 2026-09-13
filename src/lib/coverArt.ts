import { mixWithBlack, mixWithWhite } from "./colorUtils";
import { ThemeOption, ThemePalette } from "./types";

/**
 * Single source of truth for each theme's abstract motif.
 *
 * The thumbnail preview draws these shapes as SVG, and the export prompt describes the very
 * same shapes in words (position and size as a percentage of the slide), so what the user
 * sees in the Theming step is what the AI platform is told to build in the .pptx.
 *
 * Coordinate space: a 16:9 slide as a 160 x 90 box. x runs 0..160, y runs 0..90.
 * Every composition stays inside the right ~45% of the slide (x >= 88) so the left side
 * remains a clean field for the title.
 */

export const ART_W = 160;
export const ART_H = 90;

export type ArtShape =
  | { kind: "circle"; label: string; cx: number; cy: number; r: number; fill: string; opacity: number }
  | { kind: "ring"; label: string; cx: number; cy: number; r: number; stroke: string; strokeWidth: number; opacity: number }
  | { kind: "rect"; label: string; x: number; y: number; w: number; h: number; fill: string; opacity: number }
  | { kind: "polygon"; label: string; points: [number, number][]; fill: string; opacity: number }
  | { kind: "line"; label: string; x1: number; y1: number; x2: number; y2: number; stroke: string; strokeWidth: number; opacity: number };

export interface CoverArt {
  motifName: string;
  /** Two-stop backdrop for cover/closing slides, top-left to bottom-right. */
  backdrop: { from: string; to: string };
  shapes: ArtShape[];
}

function artColors(palette: ThemePalette) {
  // Lightened toward white so the shapes read against the dark backdrop whatever the brand hue.
  return {
    primary: mixWithWhite(palette.primary, 0.35),
    secondary: mixWithWhite(palette.secondary, 0.3),
    accent: mixWithWhite(palette.accent, 0.45),
  };
}

export function describeCoverArt(variant: ThemeOption["layoutVariant"], palette: ThemePalette, intensity = 1): CoverArt {
  const c = artColors(palette);
  const backdrop = { from: palette.neutralDark, to: mixWithBlack(mixWithWhite(palette.primary, 0.1), 0.45) };
  const o = (v: number) => Math.min(1, v * intensity);

  if (variant === "grid") {
    const shapes: ArtShape[] = [];
    const size = 8;
    const step = 11;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        shapes.push({
          kind: "rect",
          label: `Square r${row + 1}c${col + 1}`,
          x: 152 - size - col * step,
          y: 84 - size - row * step,
          w: size,
          h: size,
          fill: (row + col) % 2 === 0 ? c.primary : c.secondary,
          opacity: o(0.78 - (col + row) * 0.09),
        });
      }
    }
    shapes.push({ kind: "rect", label: "Anchor square (large)", x: 126, y: 18, w: 20, h: 20, fill: c.primary, opacity: o(0.32) });
    shapes.push({ kind: "rect", label: "Anchor square (small)", x: 149, y: 7, w: 11, h: 11, fill: c.accent, opacity: o(0.45) });
    return { motifName: "fragmented grid of squares", backdrop, shapes };
  }

  if (variant === "gradient-band") {
    const shapes: ArtShape[] = [];
    const L = 18;
    const t = 6;
    for (let k = 0; k < 4; k++) {
      const ax = 118 + k * 10;
      const ay = 78 - k * 18;
      shapes.push({
        kind: "polygon",
        label: `Chevron ${k + 1}`,
        points: [
          [ax, ay],
          [ax + L, ay + L],
          [ax + L, ay + L + t],
          [ax, ay + t],
          [ax - L, ay + L + t],
          [ax - L, ay + L],
        ],
        fill: k % 2 === 0 ? c.primary : c.accent,
        opacity: o(0.3 + k * 0.1),
      });
    }
    shapes.push({ kind: "rect", label: "Right-edge band", x: 154, y: 0, w: 6, h: 90, fill: c.primary, opacity: o(0.5) });
    shapes.push({ kind: "line", label: "Guide line", x1: 96, y1: 90, x2: 160, y2: 6, stroke: c.secondary, strokeWidth: 0.5, opacity: o(0.5) });
    return { motifName: "ascending chevrons", backdrop, shapes };
  }

  // editorial (default): soft orbit of circles
  const shapes: ArtShape[] = [
    { kind: "circle", label: "Circle A (large)", cx: 150, cy: 12, r: 46, fill: c.primary, opacity: o(0.55) },
    { kind: "circle", label: "Circle B (medium)", cx: 128, cy: 82, r: 30, fill: c.accent, opacity: o(0.45) },
    { kind: "circle", label: "Circle C (small)", cx: 112, cy: 40, r: 9, fill: c.secondary, opacity: o(0.6) },
    { kind: "ring", label: "Ring D (outline)", cx: 140, cy: 50, r: 22, stroke: c.secondary, strokeWidth: 0.6, opacity: o(0.5) },
  ];
  return { motifName: "soft orbit of translucent circles", backdrop, shapes };
}

const pctW = (v: number) => `${Math.round((v / ART_W) * 100)}%`;
const pctH = (v: number) => `${Math.round((v / ART_H) * 100)}%`;
const pct = (v: number) => `${Math.round(v * 100)}%`;

function shapeSpec(s: ArtShape): string {
  switch (s.kind) {
    case "circle":
      return `${s.label}: filled circle, centre at ${pctW(s.cx)} across / ${pctH(s.cy)} down, diameter ${pctW(s.r * 2)} of slide width, fill ${s.fill} at ${pct(s.opacity)} opacity.`;
    case "ring":
      return `${s.label}: circle outline only (no fill), centre at ${pctW(s.cx)} across / ${pctH(s.cy)} down, diameter ${pctW(s.r * 2)} of slide width, thin ${s.stroke} stroke at ${pct(s.opacity)} opacity.`;
    case "rect":
      return `${s.label}: square/rectangle, top-left at ${pctW(s.x)} across / ${pctH(s.y)} down, ${pctW(s.w)} of slide width by ${pctH(s.h)} of slide height, fill ${s.fill} at ${pct(s.opacity)} opacity.`;
    case "polygon": {
      const pts = s.points.map(([x, y]) => `(${pctW(x)}, ${pctH(y)})`).join(" → ");
      return `${s.label}: chevron polygon with corners at ${pts} (x across, y down), fill ${s.fill} at ${pct(s.opacity)} opacity.`;
    }
    case "line":
      return `${s.label}: hairline from (${pctW(s.x1)}, ${pctH(s.y1)}) to (${pctW(s.x2)}, ${pctH(s.y2)}), ${s.stroke} at ${pct(s.opacity)} opacity.`;
  }
}

/**
 * Plain-language build instructions for the motif — precise enough that any AI platform can
 * recreate it with native PowerPoint shapes, and identical to what the preview renders.
 */
export function coverArtSpecText(variant: ThemeOption["layoutVariant"], palette: ThemePalette): string {
  const art = describeCoverArt(variant, palette, 1);
  const gridNote =
    variant === "grid"
      ? `The 16 grid squares form a 4 × 4 lattice anchored to the bottom-right corner; opacity is highest at the corner and fades toward the top-left of the cluster.\n`
      : "";
  return [
    `Motif: ${art.motifName}. Slide background: linear gradient from ${art.backdrop.from} (top-left) to ${art.backdrop.to} (bottom-right).`,
    `Build the motif from native, editable shapes (no raster image needed). Positions are percentages of the slide's width (across) and height (down), measured from the top-left corner. Shapes that run past the slide edge are intentionally cropped by the edge.`,
    gridNote + art.shapes.map(shapeSpec).join("\n"),
    `Everything above sits within the right 45% of the slide. Keep the left 55% completely free of shapes so the title, subtitle and co-branding lockup sit on a clean field.`,
    `Internal slides: reuse the same shape family at roughly 40% of these opacities and about half the scale, tucked into a supporting panel or the slide's right edge — never behind body text. Closing slide: repeat the cover composition at full strength.`,
  ].join("\n");
}
