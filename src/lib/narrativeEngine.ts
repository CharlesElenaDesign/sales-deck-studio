import { findDirection, FLOW_TEMPLATES } from "./sampleData";
import {
  IntakeFormData,
  NarrativeFlowOption,
  NarrativeSlidePlan,
  SlideOutlineItem,
  StoryOption,
  ToneOption,
} from "./types";

export function generateToneOptions(story: StoryOption): ToneOption[] {
  const dir = findDirection(story.direction);
  return dir.tones.map((t, i) => ({
    id: `${story.id}-tone-${i}`,
    name: t.name,
    description: t.description,
    voiceNotes: t.voiceNotes,
  }));
}

function distribute<T>(items: T[], buckets: number): T[][] {
  if (buckets >= items.length) {
    return items.map((it) => [it]);
  }
  const extra = items.length - buckets;
  const sizes = Array.from({ length: buckets }, (_, i) => (i === 0 ? 1 + extra : 1));
  const out: T[][] = [];
  let cursor = 0;
  for (const size of sizes) {
    out.push(items.slice(cursor, cursor + size));
    cursor += size;
  }
  return out;
}

export function generateFlowOptions(
  story: StoryOption,
  tone: ToneOption,
  internalSlideCount: number
): NarrativeFlowOption[] {
  return FLOW_TEMPLATES.map((flowTpl) => {
    const labelBuckets = distribute(flowTpl.structureLabels, internalSlideCount);
    const progBuckets = distribute(story.progression, internalSlideCount);
    const headlineBuckets = distribute(story.assertionHeadlines, internalSlideCount);

    const slides: NarrativeSlidePlan[] = labelBuckets.map((labels, i) => {
      const progs = progBuckets[i];
      const headlines = headlineBuckets[i];
      const purpose = `Establish: ${labels.join(" & ")}.`;
      const keyMessage = headlines[0];
      const supportingContent = progs
        .map((p) => `${p.title} — ${p.description}`)
        .join(" ");
      const prevLabels = i > 0 ? labelBuckets[i - 1] : null;
      const nextLabels = i < labelBuckets.length - 1 ? labelBuckets[i + 1] : null;
      return {
        slideIndex: i + 1,
        headline: headlines[0],
        purpose,
        keyMessage,
        supportingContent,
        connectionPrev: prevLabels
          ? `Builds on "${prevLabels[prevLabels.length - 1]}" from the previous slide.`
          : `Opens the narrative — no prior slide to build on.`,
        connectionNext: nextLabels
          ? `Sets up "${nextLabels[0]}" on the next slide.`
          : `Leads directly into the close.`,
      };
    });

    return {
      id: `${story.id}-${flowTpl.id}`,
      name: flowTpl.name,
      structureLabels: flowTpl.structureLabels,
      description: flowTpl.descriptionTemplate(story.name),
      whySuited: flowTpl.whySuitedTemplate(story.name, tone.name),
      slides,
    };
  });
}

function speakerNotesFor(
  role: "cover" | "internal" | "closing",
  headline: string,
  supporting: string,
  form: IntakeFormData
): string {
  if (role === "cover") {
    const presenter = form.presenterName ? ` ${form.presenterName} will open by` : " Open by";
    return `${presenter} welcoming the room and framing why this conversation matters right now for ${form.clientCompany}. State the headline as the thesis for the deck: "${headline}." Keep it to under a minute — the goal is orientation, not detail.`;
  }
  if (role === "closing") {
    return `Land on the core idea one more time, thank the room for their time, and hand back to ${form.clientCompany} for questions. If presenter contact details are shown, mention they're available for follow-up conversations offline.`;
  }
  return `Talk track: assert "${headline}" as the takeaway before explaining it. ${supporting} Pause for reactions before moving on — this slide is meant to land a point, not narrate a list.`;
}

export function buildOutline(
  form: IntakeFormData,
  story: StoryOption,
  tone: ToneOption,
  flow: NarrativeFlowOption
): SlideOutlineItem[] {
  const outline: SlideOutlineItem[] = [];

  const coverHeadline = form.presentationTitle?.trim() || story.name;
  outline.push({
    slideIndex: 1,
    role: "cover",
    headline: coverHeadline,
    subhead: story.centralIdea,
    bodyBullets: [],
    speakerNotes: speakerNotesFor("cover", coverHeadline, story.centralIdea, form),
    placeholderFlags: [],
  });

  flow.slides.forEach((slide, i) => {
    const assumption = story.assumptions[i % story.assumptions.length];
    outline.push({
      slideIndex: i + 2,
      role: "internal",
      eyebrow: flow.structureLabels[Math.min(i, flow.structureLabels.length - 1)],
      headline: slide.headline,
      bodyBullets: [
        slide.supportingContent,
        `Why it matters now: ${slide.purpose.replace(/^Establish:\s*/, "")}`,
        slide.connectionNext,
      ],
      speakerNotes: speakerNotesFor("internal", slide.headline, slide.supportingContent, form),
      placeholderFlags: [`Validate before presenting: ${assumption}`],
    });
  });

  const closingIndex = flow.slides.length + 2;
  outline.push({
    slideIndex: closingIndex,
    role: "closing",
    headline: "Thank you",
    subhead: story.valueOutcome,
    bodyBullets: [],
    speakerNotes: speakerNotesFor("closing", "Thank you", story.valueOutcome, form),
    placeholderFlags: [],
  });

  return outline;
}
