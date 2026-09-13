"use client";

import { Button, CardArt, EyebrowLabel } from "./ui";

const AGENTS = [
  {
    number: "01",
    name: "Story Agent",
    description: "Reads the deal synopsis and proposes three genuinely different strategic angles to sell from.",
  },
  {
    number: "02",
    name: "Narrative Agent",
    description: "Picks a tone and a slide-by-slide flow built to fit the story you chose.",
  },
  {
    number: "03",
    name: "Theming Agent",
    description: "Researches live brand signals and proposes visual directions led by the client's own identity.",
  },
];

export function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ position: "relative" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -80,
          left: "50%",
          transform: "translateX(-50%)",
          width: 900,
          height: 500,
          background:
            "radial-gradient(circle at 30% 30%, rgba(45,225,253,0.16), transparent 60%), radial-gradient(circle at 70% 40%, rgba(252,49,187,0.12), transparent 55%), radial-gradient(circle at 50% 80%, rgba(255,122,0,0.1), transparent 60%)",
          filter: "blur(10px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", textAlign: "center", padding: "var(--space-16) 0 var(--space-10)", maxWidth: 780, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <EyebrowLabel>Infosys | Co-branded sales presentations</EyebrowLabel>
        </div>
        <h1 className="display h1" style={{ fontSize: "clamp(38px, 5vw, 58px)", marginTop: "var(--space-5)", marginBottom: "var(--space-5)" }}>
          Infosys <span className="gradient-text">Sales Deck Studio</span>
        </h1>
        <p className="subhead" style={{ margin: "0 auto", maxWidth: 620 }}>
          Turn a deal synopsis into a polished, co-branded presentation. Three agents shape the story, narrative, and
          visual direction — then hand off a single, ready-to-run prompt that builds the actual deck, real brand
          logos included.
        </p>
        <div style={{ marginTop: "var(--space-8)" }}>
          <Button variant="primary" onClick={onStart}>
            Start creating →
          </Button>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "var(--space-5)",
          marginTop: "var(--space-10)",
        }}
      >
        {AGENTS.map((agent, i) => (
          <div key={agent.number} className="card" style={{ position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <CardArt index={i} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <span className="field-hint" style={{ marginTop: 0, letterSpacing: "0.08em" }}>
                STEP {agent.number}
              </span>
              <h3 style={{ fontSize: "var(--fs-h4)", fontWeight: 700 }}>{agent.name}</h3>
              <p className="body-copy" style={{ fontSize: "var(--fs-body-sm)" }}>
                {agent.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="field-hint" style={{ textAlign: "center", marginTop: "var(--space-10)" }}>
        Sample client names and deal synopses offered in this tool are fictional and for demonstration only.
      </p>
    </div>
  );
}
