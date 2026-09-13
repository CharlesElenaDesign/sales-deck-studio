"use client";

import { WizardStep } from "@/lib/types";

const STEPS: { key: WizardStep; label: string; number: string }[] = [
  { key: "story", label: "Story Agent", number: "1" },
  { key: "narrative", label: "Narrative Agent", number: "2" },
  { key: "theming", label: "Theming Agent", number: "3" },
];

const ORDER: WizardStep[] = ["landing", "intake", "story", "narrative", "theming", "review"];

export function Stepper({ current }: { current: WizardStep }) {
  const currentIndex = ORDER.indexOf(current);

  return (
    <nav aria-label="Deck creation progress" className="stepper">
      {STEPS.map((step, i) => {
        const stepIndex = ORDER.indexOf(step.key);
        const isActive = current === step.key;
        const isComplete = currentIndex > stepIndex;
        return (
          <div key={step.key} style={{ display: "flex", alignItems: "center" }}>
            <div
              className={`stepper-step ${isActive ? "is-active" : ""} ${isComplete ? "is-complete" : ""}`}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="stepper-dot">{isComplete ? "✓" : step.number}</span>
              <span className="stepper-label">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && <span className={`stepper-connector ${isComplete ? "is-complete" : ""}`} />}
          </div>
        );
      })}
    </nav>
  );
}
