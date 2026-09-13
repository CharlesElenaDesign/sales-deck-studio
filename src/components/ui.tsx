"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export function Button({
  variant = "secondary",
  size,
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: "sm" }) {
  const variantClass =
    variant === "primary" ? "btn-primary" : variant === "ghost" ? "btn-ghost" : variant === "danger" ? "btn-danger" : "btn-secondary";
  const sizeClass = size === "sm" ? "btn-sm" : "";
  return (
    <button className={`btn ${variantClass} ${sizeClass} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}

export function Card({
  children,
  className = "",
  selected = false,
  onClick,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
  as?: "div" | "button";
}) {
  const classes = `card ${onClick ? "card-hover" : ""} ${selected ? "card-selected" : ""} ${className}`.trim();
  if (as === "button" || onClick) {
    return (
      <button type="button" onClick={onClick} className={classes} style={{ width: "100%", textAlign: "left", position: "relative" }}>
        {children}
      </button>
    );
  }
  return (
    <div className={classes} style={{ position: "relative" }}>
      {children}
    </div>
  );
}

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "live" | "warn" }) {
  const cls = tone === "live" ? "badge badge-live" : tone === "warn" ? "badge badge-warn" : "badge";
  return <span className={cls}>{children}</span>;
}

export function Spinner() {
  return <span className="spinner" aria-hidden="true" />;
}

export function EyebrowLabel({ children }: { children: ReactNode }) {
  return (
    <div className="eyebrow-label">
      <span className="tick" aria-hidden="true" />
      {children}
    </div>
  );
}

export function FieldLabel({ children, htmlFor, required }: { children: ReactNode; htmlFor?: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="field-label">
      {children}
      {required && <span aria-hidden="true" style={{ color: "var(--ce-orange)" }}> *</span>}
    </label>
  );
}

export function Divider() {
  return <hr className="hairline" />;
}

export function CardArt({ index }: { index: number }) {
  return (
    <div className="card-art" data-art={String(index % 3)} aria-hidden="true">
      <span className="blob b1" />
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="panel" style={{ padding: "var(--space-10)", textAlign: "center" }}>
      <h3 style={{ fontSize: "var(--fs-h4)", fontWeight: 700, marginBottom: "var(--space-3)" }}>{title}</h3>
      <p className="body-copy" style={{ maxWidth: 480, margin: "0 auto" }}>
        {description}
      </p>
      {action && <div style={{ marginTop: "var(--space-6)" }}>{action}</div>}
    </div>
  );
}
