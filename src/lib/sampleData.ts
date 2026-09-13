export interface PresetSynopsis {
  id: string;
  label: string;
  industry: string;
  text: string;
}

/** Fictional, illustrative deal synopses — for demonstration only. */
export const PRESET_SYNOPSES: PresetSynopsis[] = [
  {
    id: "core-modernisation",
    label: "Core systems modernisation (fictional)",
    industry: "Financial services",
    text: "The client is running a 20-year-old core policy administration system alongside a patchwork of regional add-ons. New product launches take over a year, and every regulatory change touches multiple teams. Leadership wants a modernised, cloud-based core that lets them launch products faster while keeping the current book of business stable during migration.",
  },
  {
    id: "cx-unification",
    label: "Unified customer experience (fictional)",
    industry: "Retail / consumer",
    text: "Store, app, and call-centre channels are run by separate teams on separate platforms, so customers get inconsistent pricing, promotions, and service history across channels. The client wants a single view of the customer and a consistent experience across every touchpoint, without disrupting the upcoming peak trading season.",
  },
  {
    id: "supply-chain-resilience",
    label: "Supply chain resilience (fictional)",
    industry: "Manufacturing / logistics",
    text: "Recent disruptions exposed how little visibility the client has into tier-2 and tier-3 suppliers. Planning is done in spreadsheets, and a single-site outage last year caused a multi-week delay before anyone noticed a shortfall. The client wants better visibility and faster response when something goes wrong, without a multi-year overhaul.",
  },
  {
    id: "digital-innovation",
    label: "New digital revenue line (fictional)",
    industry: "Telecommunications",
    text: "The client's core connectivity business is mature and margins are under pressure. Leadership has asked for a small number of new, digitally-delivered services that can be brought to market quickly and tested with a subset of customers before a wider rollout, using the client's existing customer base as distribution.",
  },
];

/** Index into centralIdeaVariants/valueOutcomeVariants: 0 = direct/measured,
 * 1 = warm/consultative, 2 = bold/ambitious. Selection leans on the client's own
 * researched brand color (a lightweight, honestly-approximate nod to their visual
 * energy, not a real brand-voice analysis) plus randomization on each regenerate. */
export type ToneVariantIndex = 0 | 1 | 2;

type Sentence = (client: string, hook: string) => string;
type ShortSentence = (client: string) => string;

export interface DirectionTemplate {
  id: string;
  label: string;
  keywords: string[];
  nameTemplate: (client: string) => string;
  centralIdeaVariants: [Sentence, Sentence, Sentence];
  challenge: Sentence;
  change: Sentence;
  valueOutcomeVariants: [ShortSentence, ShortSentence, ShortSentence];
  progression: { title: string; description: string }[];
  assertionHeadlines: ((client: string) => string)[];
  relevance: Sentence;
  assumptions: (client: string) => string[];
  tones: { name: string; description: string; voiceNotes: string[] }[];
}

export const DIRECTIONS: DirectionTemplate[] = [
  {
    id: "simplification",
    label: "Simplification",
    keywords: [
      "simplify", "complex", "complexity", "fragmented", "disparate", "streamline",
      "consolidat", "legacy", "sprawl", "manual", "patchwork", "spreadsheet",
    ],
    nameTemplate: (client) => `${client}, Simplified`,
    centralIdeaVariants: [
      (client) => `Reduce ${client}'s operational complexity so teams spend less effort running systems and more time on customers and growth.`,
      (client) => `Help ${client}'s teams spend less time wrestling with systems and more time on the work that actually matters to customers.`,
      (client) => `Strip out the complexity holding ${client} back and make simplicity the new default, not an exception.`,
    ],
    challenge: (client, hook) =>
      `As described, ${client} is dealing with ${hook} Fragmented tools and manual workarounds tend to slow decisions and quietly multiply effort across teams — the specific scale of that drag at ${client} should be confirmed before it's quantified.`,
    change: (_client) =>
      `Rather than adding another layer on top, the proposed shift is to consolidate around a smaller number of well-integrated capabilities and retire what's redundant.`,
    valueOutcomeVariants: [
      () => `Faster decisions, a lower cost to run, and an estate that's easier to govern, secure, and extend going forward.`,
      () => `A calmer, more manageable operation that teams actually enjoy working in.`,
      () => `A dramatically leaner estate that turns complexity from a liability into a non-issue.`,
    ],
    progression: [
      { title: "Where complexity lives", description: "Name the specific systems, handoffs, and workarounds that create drag today." },
      { title: "One coherent core", description: "Show the smaller, integrated footprint that replaces the patchwork." },
      { title: "A simpler way of working", description: "Describe how day-to-day work changes once the core is in place." },
      { title: "Keeping complexity out", description: "Explain the operating model that stops complexity creeping back in." },
    ],
    assertionHeadlines: [
      (client) => `${client}'s complexity has a shape — and it's mappable`,
      (client) => `One core replaces the patchwork at ${client}`,
      (client) => `Simpler for ${client} means faster for everyone downstream`,
      (client) => `${client} stays simple by design, not by discipline`,
    ],
    relevance: (client, hook) =>
      `Given ${hook} simplification gives ${client} a concrete, low-drama way to free up capacity before layering on anything new.`,
    assumptions: (client) => [
      `The specific systems or processes named are illustrative until confirmed with ${client}.`,
      "No client-specific cost, effort, or timeline figures are available yet — validate before quoting any numbers.",
      "Assumes appetite for consolidation rather than incremental patching — confirm with stakeholders.",
    ],
    tones: [
      { name: "Plain-Spoken and Practical", description: "Direct, low-jargon language that respects the audience's time.", voiceNotes: ["Short sentences, concrete nouns", "Name the problem before the solution"] },
      { name: "Calm and Reassuring", description: "Steady tone that acknowledges the disruption of change without overselling.", voiceNotes: ["Lead with stability, not disruption", "Avoid urgency language"] },
      { name: "Confident and Tidy", description: "Crisp, well-organised delivery that mirrors the simplicity being proposed.", voiceNotes: ["One idea per slide", "Visual rhythm matters as much as words"] },
    ],
  },
  {
    id: "resilience",
    label: "Resilience",
    keywords: [
      "resilien", "risk", "disruption", "outage", "visibility", "exposure", "continuity",
      "shortage", "shortfall", "delay", "single-site", "single point",
    ],
    nameTemplate: (client) => `Built to Withstand: ${client}'s Resilience Story`,
    centralIdeaVariants: [
      (client) => `Give ${client} the visibility and response speed to absorb disruption before it becomes a customer-facing problem.`,
      (client) => `Help ${client}'s teams feel confident that disruption won't catch them off guard, together.`,
      (client) => `Make ${client}'s resilience so strong that disruption becomes a non-event, not a crisis.`,
    ],
    challenge: (client, hook) =>
      `The synopsis points to ${hook} That kind of blind spot is common when visibility stops at the first tier of a process or supply chain — the specific gaps at ${client} would need to be mapped, not assumed.`,
    change: (_client) =>
      `The proposed shift is from reactive firefighting to early visibility: surfacing the signals that matter before they become incidents.`,
    valueOutcomeVariants: [
      () => `Fewer surprises, faster response when something does go wrong, and more confidence in commitments made to customers.`,
      () => `A steadier operation that customers and teams alike can rely on.`,
      () => `Resilience strong enough to turn a crisis into a non-story.`,
    ],
    progression: [
      { title: "The blind spot", description: "Show where visibility currently stops and what that has cost in disruption." },
      { title: "Designing for resilience", description: "Introduce the monitoring and response model that closes the gap." },
      { title: "Proof under pressure", description: "Describe how the new model behaves when something actually goes wrong." },
      { title: "Confidence at scale", description: "Show how resilience becomes a durable capability, not a one-off fix." },
    ],
    assertionHeadlines: [
      (client) => `${client}'s visibility stops earlier than it should`,
      (_client) => `Resilience is a design choice, not a hope`,
      (client) => `${client} can prove this works before it's tested by a real event`,
      (_client) => `Resilience becomes routine, not a project`,
    ],
    relevance: (client, hook) =>
      `Because ${hook} resilience is the direction that speaks most directly to what ${client} has already experienced, rather than a hypothetical risk.`,
    assumptions: (client) => [
      `The nature and cause of past disruptions are as described by ${client} and have not been independently verified.`,
      "No specific incident timelines, costs, or root causes are available yet — validate before including any in the deck.",
      "Assumes the client wants improved visibility and response rather than a full network redesign — confirm scope.",
    ],
    tones: [
      { name: "Steady and Assured", description: "Measured tone that projects control without minimising the real risk.", voiceNotes: ["Acknowledge the risk plainly", "Avoid alarmist language"] },
      { name: "Evidence-Led and Grounded", description: "Leans on the specifics already shared rather than generic risk language.", voiceNotes: ["Reference the client's own situation, not industry averages", "Be precise about what's known vs. assumed"] },
      { name: "Collaborative and Candid", description: "Frames resilience as a shared responsibility, not a product pitch.", voiceNotes: ["Use 'together' framing", "Invite validation rather than asserting certainty"] },
    ],
  },
  {
    id: "transformation",
    label: "Transformation",
    keywords: [
      "transform", "modern", "modernis", "modernize", "cloud", "migrat", "overhaul",
      "core system", "replace", "20-year", "legacy system",
    ],
    nameTemplate: (client) => `${client}: The Next Chapter`,
    centralIdeaVariants: [
      (client) => `Move ${client} from a constrained, aging foundation to one built for the next decade — without putting today's business at risk.`,
      (client) => `Bring ${client}'s foundation into the next decade at a pace the organisation can actually absorb.`,
      (client) => `Rebuild ${client}'s foundation for the next decade, not just the next fiscal year.`,
    ],
    challenge: (client, hook) =>
      `${client} is working with ${hook} Ageing foundations tend to slow every subsequent change, and the specific constraints described are the starting point for this story, not a general industry claim.`,
    change: (_client) =>
      `The proposed change is a staged move to a modern foundation, sequenced so the current book of business stays stable throughout.`,
    valueOutcomeVariants: [
      () => `A foundation that can absorb future change quickly, instead of treating every change as a project of its own.`,
      () => `A foundation the whole organisation can grow into, confidently and steadily.`,
      (client) => `A foundation built to make ${client}'s next decade look nothing like its last.`,
    ],
    progression: [
      { title: "The weight of the current state", description: "Name what the existing foundation makes slow, risky, or expensive." },
      { title: "A foundation built forward", description: "Introduce the target state and why it removes those constraints." },
      { title: "Getting there without disruption", description: "Show the staged path that protects business continuity." },
      { title: "What becomes possible next", description: "Point to the kinds of change this foundation makes routine." },
    ],
    assertionHeadlines: [
      (client) => `${client}'s foundation is now the constraint, not the enabler`,
      (client) => `A foundation ${client} can build the next decade on`,
      (client) => `${client} can modernise without pausing the business`,
      (_client) => `Change becomes routine once the foundation is right`,
    ],
    relevance: (client, hook) =>
      `Transformation fits because ${hook} describes a structural constraint, not a point problem — ${client} needs a foundation change, not another workaround.`,
    assumptions: (client) => [
      `The age, scope, and specific limitations of the current systems are as described by ${client} and should be validated during discovery.`,
      "No migration timeline, cost, or risk figures are available yet — these must come from a proper technical assessment.",
      `Assumes ${client} is prepared to sequence delivery in stages rather than a single cutover — confirm appetite.`,
    ],
    tones: [
      { name: "Bold and Transformational", description: "Ambitious framing that treats this as a step-change, not a maintenance project.", voiceNotes: ["Use future-facing language", "Contrast 'what was built for' vs. 'what's needed now'"] },
      { name: "Executive and Assured", description: "Board-ready tone focused on risk management and long-term positioning.", voiceNotes: ["Lead with governance and continuity", "Quantify nothing that isn't confirmed"] },
      { name: "Pragmatic and Sequenced", description: "Emphasises careful staging over big-bang ambition.", voiceNotes: ["Name phases explicitly", "Reassure on continuity at every step"] },
    ],
  },
  {
    id: "customer-experience",
    label: "Customer Experience",
    keywords: [
      "customer", "experience", "channel", "omnichannel", "consisten", "service",
      "loyalty", "journey", "touchpoint",
    ],
    nameTemplate: (client) => `One ${client}, Every Touchpoint`,
    centralIdeaVariants: [
      (client) => `Give ${client}'s customers one consistent experience regardless of which channel they use.`,
      (client) => `Help ${client}'s customers feel like they're dealing with one company, every time, everywhere.`,
      (client) => `Make ${client}'s customer experience so consistent it becomes the thing competitors get compared to.`,
    ],
    challenge: (client, hook) =>
      `The synopsis describes ${hook} When channels are run separately, customers notice the seams first — inconsistent pricing, service history, or promotions — before anyone internally does.`,
    change: (_client) =>
      `The proposed change is a shared view of the customer that every channel draws from, so the experience is consistent by design rather than by coordination effort.`,
    valueOutcomeVariants: [
      () => `A customer experience that feels like one company, and internal teams that spend less time reconciling channel differences.`,
      () => `Customers who feel genuinely looked after, whichever channel they choose.`,
      (client) => `An experience so consistent it becomes ${client}'s sharpest competitive edge.`,
    ],
    progression: [
      { title: "Where the experience breaks", description: "Show the specific moments where channels currently disagree." },
      { title: "One view of the customer", description: "Introduce the shared foundation that channels draw from." },
      { title: "A consistent journey", description: "Describe what the experience looks like once channels are unified." },
      { title: "Protecting peak performance", description: "Address how this holds up under the client's highest-demand periods." },
    ],
    assertionHeadlines: [
      (client) => `${client}'s customers notice the seams before anyone inside does`,
      (client) => `One view of the customer, every channel at ${client}`,
      (client) => `Consistency ${client}'s customers can feel, not just measure`,
      (client) => `Built to hold at ${client}'s busiest moments`,
    ],
    relevance: (client, hook) =>
      `Because ${hook} the priority for ${client} is consistency customers can feel, not just a back-end integration project.`,
    assumptions: (client) => [
      `The channel and platform details described are illustrative until confirmed with ${client}'s technical teams.`,
      "No customer satisfaction, retention, or revenue figures are available yet — validate before including any in the deck.",
      "Assumes the priority is consistency across existing channels rather than launching new ones — confirm scope.",
    ],
    tones: [
      { name: "Warm and Customer-First", description: "Centres the customer's felt experience over internal system language.", voiceNotes: ["Describe moments, not modules", "Use customer language, not IT language"] },
      { name: "Consultative and Collaborative", description: "Positions the work as a shared design exercise with the client's teams.", voiceNotes: ["Invite input rather than prescribe", "Reference the client's own channels by name"] },
      { name: "Energetic and Optimistic", description: "Upbeat tone suited to a customer-facing growth story.", voiceNotes: ["Favour active verbs", "Keep sentences short and forward-leaning"] },
    ],
  },
  {
    id: "speed",
    label: "Speed",
    keywords: [
      "faster", "speed", "quick", "time to", "launch", "slow", "year", "months",
      "agile", "time-to-market",
    ],
    nameTemplate: (client) => `${client}: Built for Speed`,
    centralIdeaVariants: [
      (client) => `Cut the time it takes ${client} to go from idea to live, without cutting corners on quality or control.`,
      (client) => `Help ${client}'s teams ship faster without feeling rushed or unsupported.`,
      (client) => `Make speed ${client}'s default setting, not a special project.`,
    ],
    challenge: (client, hook) =>
      `${hook} That kind of lag usually comes from dependencies and handoffs stacking up across teams, not from any one team working slowly — worth confirming where the specific delay sits at ${client}.`,
    change: (_client) =>
      `The proposed change reduces the number of handoffs between idea and launch, and gives teams a repeatable path to ship rather than a bespoke project each time.`,
    valueOutcomeVariants: [
      () => `Shorter time-to-market and a repeatable delivery model, rather than a one-time acceleration that fades.`,
      () => `A calmer, more predictable path from idea to launch for the whole team.`,
      (client) => `Speed fast enough to change how ${client} competes, not just how it ships.`,
    ],
    progression: [
      { title: "Where time gets lost", description: "Map the specific handoffs and dependencies that slow delivery today." },
      { title: "A faster path", description: "Introduce the streamlined model that removes unnecessary handoffs." },
      { title: "Speed without shortcuts", description: "Show how governance and quality are preserved at the new pace." },
      { title: "Speed as a habit", description: "Describe how the faster path becomes the default, not a special case." },
    ],
    assertionHeadlines: [
      (client) => `${client}'s delay lives in the handoffs, not the teams`,
      (client) => `A faster path for ${client}, with fewer places to wait`,
      (client) => `Speed at ${client} doesn't mean cutting governance`,
      (client) => `Fast becomes ${client}'s default, not the exception`,
    ],
    relevance: (client, hook) =>
      `Speed matters here because ${hook} is a direct, felt cost to ${client}, not an abstract efficiency argument.`,
    assumptions: (client) => [
      `The current timelines and causes of delay are as described by ${client} and have not been independently measured.`,
      "No specific cycle-time or delivery figures are available yet — validate before quoting any numbers.",
      "Assumes governance and quality requirements stay constant while speed improves — confirm with risk/compliance stakeholders.",
    ],
    tones: [
      { name: "Energetic and Direct", description: "Fast-moving tone that mirrors the outcome being sold.", voiceNotes: ["Short, punchy sentences", "Favour verbs over adjectives"] },
      { name: "Confident and Focused", description: "Assured tone that treats speed as a controlled outcome, not a gamble.", voiceNotes: ["Pair every speed claim with a control point", "Avoid hype language"] },
      { name: "Executive and Assured", description: "Frames speed as a competitive and governance issue for leadership.", voiceNotes: ["Tie speed to market timing", "Keep language board-level"] },
    ],
  },
  {
    id: "cost-optimisation",
    label: "Cost Optimisation",
    keywords: [
      "cost", "margin", "budget", "efficien", "spend", "expensive", "pressure",
      "profitability",
    ],
    nameTemplate: (client) => `Smarter Spend, Sharper ${client}`,
    centralIdeaVariants: [
      (client) => `Free up cost and capacity inside ${client}'s current operation to reinvest where it matters most.`,
      (client) => `Help ${client} free up room to invest in what matters, without a blunt, disruptive cut.`,
      (client) => `Strip structural cost out of ${client}'s operation fast enough to fund what's next.`,
    ],
    challenge: (client, hook) =>
      `${hook} Cost pressure like this is usually structural — spread across duplicated effort, ageing systems, or manual processes — rather than solvable with a single cut, though the specific drivers at ${client} need confirming.`,
    change: (_client) =>
      `The proposed change targets structural cost — duplicated systems, manual effort, and unused capacity — rather than proposing a blanket reduction.`,
    valueOutcomeVariants: [
      () => `A leaner cost base that funds reinvestment, with the savings coming from removing waste rather than reducing service.`,
      () => `Breathing room to reinvest, achieved without disrupting the team or the service.`,
      () => `A leaner cost base freed up fast enough to fund the next big move.`,
    ],
    progression: [
      { title: "Where cost is hiding", description: "Identify the categories of structural cost at play, without inventing figures." },
      { title: "A leaner way to operate", description: "Introduce the target operating model that removes that cost." },
      { title: "Protecting what matters", description: "Show that service levels and quality are protected through the change." },
      { title: "Reinvesting the gain", description: "Point to where freed-up capacity or budget could go next." },
    ],
    assertionHeadlines: [
      (client) => `${client}'s cost pressure is structural, not seasonal`,
      (client) => `A leaner ${client}, without a blanket cut`,
      (client) => `Savings at ${client} come from waste, not service`,
      (client) => `${client} reinvests before it retreats`,
    ],
    relevance: (client, hook) =>
      `Because ${hook} this direction gives ${client} a story about disciplined reinvestment, not just cost-cutting.`,
    assumptions: (client) => [
      `No specific cost, margin, or budget figures for ${client} are available — every number in this deck must be supplied and validated by the client before use.`,
      "The categories of structural cost named are illustrative, based on common patterns, not a confirmed diagnosis.",
      "Assumes leadership wants savings reinvested rather than returned — confirm intent before finalising the value narrative.",
    ],
    tones: [
      { name: "Disciplined and Precise", description: "Careful, numbers-aware tone that never overstates what's confirmed.", voiceNotes: ["Flag every unconfirmed figure explicitly", "Prefer 'typically' to absolute claims"] },
      { name: "Executive and Assured", description: "Board-level framing suited to a cost and reinvestment conversation.", voiceNotes: ["Lead with the reinvestment story, not just the cut", "Keep tone measured, not defensive"] },
      { name: "Consultative and Collaborative", description: "Positions the cost review as a joint diagnostic, not a sales pitch.", voiceNotes: ["Invite the client's own data into the conversation", "Avoid presuming the answer"] },
    ],
  },
  {
    id: "innovation",
    label: "Innovation",
    keywords: [
      "innovat", "new service", "new product", "digital", "pilot", "test", "revenue line",
      "new revenue", "experiment",
    ],
    nameTemplate: (client) => `What's Next for ${client}`,
    centralIdeaVariants: [
      (client) => `Help ${client} test and launch new value quickly, using what it already has, before betting big.`,
      (client) => `Help ${client} explore what's next in a way that feels safe to try and easy to walk back.`,
      (client) => `Give ${client} a fast, low-risk way to find its next big revenue line before anyone else does.`,
    ],
    challenge: (client, hook) =>
      `${hook} Mature core businesses often need a disciplined way to explore new ideas without risking the core — the right pace and scale for ${client} specifically still needs to be agreed.`,
    change: (_client) =>
      `The proposed change is a structured way to pilot new ideas with a subset of customers, learn quickly, and scale only what works.`,
    valueOutcomeVariants: [
      () => `A repeatable way to test new ideas at low risk, and a clearer view of which ones deserve a wider rollout.`,
      () => `A comfortable, low-pressure way to learn what's worth scaling.`,
      () => `A validated new revenue line, proven fast enough to move ahead of competitors.`,
    ],
    progression: [
      { title: "The innovation gap", description: "Name the pressure or opportunity driving the need for something new." },
      { title: "A structured way to explore", description: "Introduce the pilot model and how it limits risk." },
      { title: "Learning in the open", description: "Show how early signals are captured and acted on." },
      { title: "Scaling what works", description: "Describe the path from pilot to wider rollout." },
    ],
    assertionHeadlines: [
      (client) => `${client}'s core is mature — its next revenue line doesn't have to be`,
      (client) => `${client} tests new ideas without betting the core business`,
      (client) => `Learning fast is ${client}'s real advantage here`,
      (client) => `${client} scales only what's already proven to work`,
    ],
    relevance: (client, hook) =>
      `Innovation is the right frame because ${hook} calls for new value, not just improvement to what already exists.`,
    assumptions: (client) => [
      `The scope and scale of any pilot are illustrative — actual customer segments and success criteria must be defined with ${client}.`,
      "No performance, adoption, or revenue projections are available yet — validate before including any in the deck.",
      "Assumes the client wants to test with existing customers before wider investment — confirm appetite for pace and risk.",
    ],
    tones: [
      { name: "Bold and Transformational", description: "Forward-leaning tone suited to a growth and innovation story.", voiceNotes: ["Favour possibility language", "Contrast today's core with tomorrow's options"] },
      { name: "Curious and Experimental", description: "Frames the work as disciplined learning, not a guaranteed outcome.", voiceNotes: ["Use 'test and learn' language", "Avoid overpromising results"] },
      { name: "Consultative and Collaborative", description: "Treats the client's existing customer base and brand as the starting asset.", voiceNotes: ["Reference what the client already has, not just what's new", "Invite co-design"] },
    ],
  },
  {
    id: "growth",
    label: "Growth",
    keywords: ["growth", "expand", "expansion", "new market", "scale", "scaling", "grow", "market share"],
    nameTemplate: (client) => `${client}'s Next Growth Curve`,
    centralIdeaVariants: [
      (client) => `Give ${client} a clear, low-risk path to grow beyond where the current business already tops out.`,
      (client) => `Help ${client} grow in a way that feels like a natural next step for the business, not a leap of faith.`,
      (client) => `Push ${client} past its current ceiling with a growth path built to move fast and prove itself early.`,
    ],
    challenge: (client, hook) =>
      `${hook} Growth beyond the current core usually stalls when there's no clear, validated next segment to point resources at — the right target for ${client} still needs sharpening.`,
    change: (_client) =>
      `The proposed shift is to pick a specific, validated growth vector and commit resourcing to it, rather than spreading effort across many small bets.`,
    valueOutcomeVariants: [
      () => `A growth path with an identified target, not just a growth ambition.`,
      () => `Steady, well-supported growth that the whole organisation can get behind.`,
      () => `A bold new growth line proven fast enough to reinvest in before competitors move.`,
    ],
    progression: [
      { title: "Where growth is stalling", description: "Show where the current business tops out and why." },
      { title: "The validated next step", description: "Introduce the specific growth vector worth committing to." },
      { title: "Committing resources deliberately", description: "Show how effort concentrates on the chosen vector instead of spreading thin." },
      { title: "Proof this growth sticks", description: "Describe how early traction gets validated before scaling further." },
    ],
    assertionHeadlines: [
      (client) => `${client}'s core has a ceiling — growth means finding what's past it`,
      (client) => `The next growth vector for ${client} is already visible, not hypothetical`,
      (client) => `${client} grows by committing, not by spreading thin`,
      (client) => `Growth ${client} can defend, not just announce`,
    ],
    relevance: (client, hook) =>
      `Growth is the right frame because ${hook} points to a ceiling on the current business, not just an efficiency gap.`,
    assumptions: (client) => [
      `The specific growth vector named is illustrative — actual market sizing and validation must come from ${client}.`,
      "No revenue, market-share, or growth-rate figures are available yet — validate before including any in the deck.",
      "Assumes leadership wants to concentrate resourcing on one vector rather than diversify broadly — confirm appetite.",
    ],
    tones: [
      { name: "Ambitious and Focused", description: "Growth-forward tone that still respects discipline in where effort goes.", voiceNotes: ["Name the target segment plainly", "Pair ambition with a validation step"] },
      { name: "Steady and Reassuring", description: "Frames growth as a natural next step, not a risky bet.", voiceNotes: ["Lead with fit, not size", "Avoid hype language"] },
      { name: "Bold and Transformational", description: "Treats growth as a race worth moving fast on.", voiceNotes: ["Use momentum language", "Contrast speed of competitors vs. client"] },
    ],
  },
  {
    id: "security-trust",
    label: "Security & Trust",
    keywords: ["security", "breach", "compliance", "regulat", "data protection", "privacy", "trust", "vulnerab", "audit"],
    nameTemplate: (client) => `Trust, Engineered: ${client}'s Security Story`,
    centralIdeaVariants: [
      (client) => `Give ${client} a security posture that holds up to scrutiny, not just a checklist of controls.`,
      (client) => `Help ${client} build the kind of trust with customers and regulators that doesn't need to be re-earned after every incident.`,
      (client) => `Make security a competitive edge for ${client}, not just a cost of doing business.`,
    ],
    challenge: (client, hook) =>
      `${hook} Security and compliance gaps tend to surface at the worst possible moment — an audit, a breach, or a customer's own due diligence — and the specific exposure at ${client} needs mapping, not assuming.`,
    change: (_client) =>
      `The proposed shift moves from point-in-time compliance to continuously demonstrable security, so evidence is always ready rather than assembled under pressure.`,
    valueOutcomeVariants: [
      () => `Fewer surprises at audit time, and a defensible answer ready whenever trust is tested.`,
      () => `Customers and regulators who extend trust by default, not by exception.`,
      () => `A security story worth leading with, not just defending.`,
    ],
    progression: [
      { title: "Where trust is exposed", description: "Name the specific gaps between current controls and what scrutiny actually demands." },
      { title: "Continuous, not point-in-time", description: "Introduce the model that keeps evidence current rather than assembled once a year." },
      { title: "Proof on demand", description: "Show what it looks like to answer an audit or customer question with confidence." },
      { title: "Trust as an asset", description: "Describe how a strong security posture becomes something to lead with commercially." },
    ],
    assertionHeadlines: [
      (client) => `${client}'s security evidence shouldn't need a fire drill to produce`,
      (client) => `Trust ${client} can prove, not just claim`,
      (client) => `${client} answers audits before they're asked`,
      (client) => `Security becomes ${client}'s edge, not its exposure`,
    ],
    relevance: (client, hook) =>
      `Security and trust is the right frame because ${hook} points to exposure that's already been felt, not a hypothetical compliance exercise.`,
    assumptions: (client) => [
      `The nature and scope of any past incidents or gaps are as described by ${client} and have not been independently verified.`,
      "No specific vulnerability, breach, or audit-finding details are available yet — validate before including any in the deck.",
      "Assumes the priority is demonstrable, continuous compliance rather than a one-time certification push — confirm scope.",
    ],
    tones: [
      { name: "Measured and Credible", description: "Serious tone that treats security as a discipline, not a scare tactic.", voiceNotes: ["Avoid fear-based language", "Lead with control, not consequence"] },
      { name: "Consultative and Collaborative", description: "Frames security as a shared responsibility with the client's own risk and compliance teams.", voiceNotes: ["Reference the client's own frameworks by name where known", "Invite validation of assumptions"] },
      { name: "Executive and Assured", description: "Board-level framing suited to a risk and governance conversation.", voiceNotes: ["Tie security posture to commercial trust", "Quantify nothing that isn't confirmed"] },
    ],
  },
  {
    id: "talent-culture",
    label: "Talent & Culture",
    keywords: ["talent", "culture", "attrition", "retention", "hiring", "skills", "workforce", "employee", "capability"],
    nameTemplate: (client) => `${client}'s People-Powered Next Step`,
    centralIdeaVariants: [
      (client) => `Help ${client} build the skills and ways of working the business will actually need next, not just fill today's gaps.`,
      (client) => `Help ${client}'s people feel genuinely equipped for what's coming, not left to catch up.`,
      (client) => `Turn ${client}'s talent and capability into a competitive advantage, not a recurring risk to manage.`,
    ],
    challenge: (client, hook) =>
      `${hook} Capability gaps like this tend to compound quietly — showing up as slower delivery or rising attrition long before anyone names the root cause — and the specific gap at ${client} needs mapping, not assuming.`,
    change: (_client) =>
      `The proposed change targets the specific capabilities the business will need next, building and buying deliberately rather than hiring reactively.`,
    valueOutcomeVariants: [
      () => `A workforce with the right capabilities in place before they're urgently needed.`,
      () => `Teams that feel supported and set up to succeed, not stretched thin.`,
      () => `A capability base sharp enough to become a genuine competitive differentiator.`,
    ],
    progression: [
      { title: "Where the capability gap sits", description: "Name the specific skills or roles the current organisation lacks." },
      { title: "Building deliberately", description: "Introduce the plan to build and buy the right capability, not hire reactively." },
      { title: "Support that sticks", description: "Show how the organisation retains and grows the capability once it's in place." },
      { title: "Capability as advantage", description: "Describe how this becomes a durable edge, not a one-time fix." },
    ],
    assertionHeadlines: [
      (client) => `${client}'s capability gap is quiet until it isn't`,
      (client) => `${client} builds the skills it will need, not just the ones it's missing today`,
      (client) => `Retention at ${client} starts with feeling equipped, not just paid`,
      (client) => `Capability becomes ${client}'s edge, not its risk`,
    ],
    relevance: (client, hook) =>
      `Talent and culture is the right frame because ${hook} is fundamentally a people and capability problem before it's a systems one.`,
    assumptions: (client) => [
      `The specific skills gaps or attrition patterns named are illustrative until confirmed with ${client}'s people team.`,
      "No attrition, hiring, or productivity figures are available yet — validate before including any in the deck.",
      "Assumes appetite for building capability internally alongside any external hiring — confirm approach.",
    ],
    tones: [
      { name: "Warm and People-First", description: "Centres the lived experience of employees over abstract workforce metrics.", voiceNotes: ["Use people language, not headcount language", "Acknowledge the human side of change"] },
      { name: "Consultative and Collaborative", description: "Positions the plan as co-designed with the client's own people leaders.", voiceNotes: ["Invite the client's own data and context", "Avoid prescribing without input"] },
      { name: "Executive and Assured", description: "Frames capability as a board-level strategic asset.", voiceNotes: ["Tie capability directly to business outcomes", "Keep tone measured, not aspirational fluff"] },
    ],
  },
  {
    id: "sustainability",
    label: "Sustainability",
    keywords: ["sustainab", "carbon", "emission", "esg", "environment", "net zero", "green", "climate"],
    nameTemplate: (client) => `${client}'s Credible Sustainability Story`,
    centralIdeaVariants: [
      (client) => `Help ${client} make sustainability commitments it can actually back up with evidence, not just intent.`,
      (client) => `Help ${client} bring its sustainability ambition and its day-to-day operations into step with each other.`,
      (client) => `Make sustainability a genuine differentiator for ${client}, backed by real operational change.`,
    ],
    challenge: (client, hook) =>
      `${hook} Sustainability commitments tend to outpace the operational and data changes needed to prove them — the specific gap between ambition and evidence at ${client} needs mapping, not assuming.`,
    change: (_client) =>
      `The proposed change closes the gap between stated ambition and operational reality, starting with the data needed to measure and report credibly.`,
    valueOutcomeVariants: [
      () => `Sustainability claims backed by real, reportable evidence rather than intent alone.`,
      () => `Progress the whole organisation can see and stand behind, not just a headline target.`,
      () => `A sustainability story strong enough to be a genuine market differentiator.`,
    ],
    progression: [
      { title: "The ambition-evidence gap", description: "Show where current commitments outpace what can actually be measured or proven." },
      { title: "Data worth reporting", description: "Introduce the measurement foundation that makes claims defensible." },
      { title: "Operational change that counts", description: "Describe the concrete changes that move the numbers, not just the messaging." },
      { title: "A story worth telling", description: "Show how credible progress becomes something to lead with externally." },
    ],
    assertionHeadlines: [
      (client) => `${client}'s sustainability ambition has outpaced its evidence`,
      (client) => `${client} can prove progress, not just promise it`,
      (client) => `Operational change is where ${client}'s sustainability story gets real`,
      (client) => `${client}'s progress becomes a story worth telling externally`,
    ],
    relevance: (client, hook) =>
      `Sustainability is the right frame because ${hook} points to a gap between ambition and evidence that needs closing before it's put in front of stakeholders.`,
    assumptions: (client) => [
      `The specific sustainability commitments and gaps named are illustrative until confirmed with ${client}.`,
      "No emissions, energy, or ESG performance figures are available yet — validate before including any in the deck.",
      "Assumes the priority is credible measurement and reporting rather than a broader operational overhaul — confirm scope.",
    ],
    tones: [
      { name: "Credible and Grounded", description: "Careful tone that never overstates progress or claims more than is evidenced.", voiceNotes: ["Prefer measured claims to aspirational language", "Flag every unconfirmed figure explicitly"] },
      { name: "Consultative and Collaborative", description: "Positions the work as a shared measurement and reporting exercise.", voiceNotes: ["Invite the client's own ESG data into the conversation", "Avoid presuming the answer"] },
      { name: "Bold and Transformational", description: "Treats credible sustainability as a genuine market differentiator worth pursuing ambitiously.", voiceNotes: ["Contrast intent-only competitors with evidence-backed progress", "Use forward-facing language"] },
    ],
  },
  {
    id: "data-intelligence",
    label: "Data & Intelligence",
    keywords: ["data", "analytics", "insight", "reporting", "dashboard", "ai", "machine learning", "decision"],
    nameTemplate: (client) => `${client}, Decided by Data`,
    centralIdeaVariants: [
      (client) => `Give ${client}'s decision-makers a trusted, single source of truth instead of competing spreadsheets.`,
      (client) => `Help ${client}'s teams trust the numbers enough to act on them quickly and confidently.`,
      (client) => `Turn ${client}'s data into a genuine decision-making advantage, not just a reporting exercise.`,
    ],
    challenge: (client, hook) =>
      `${hook} Fragmented or untrusted data usually means decisions get made on gut feel or the loudest spreadsheet in the room — the specific gaps at ${client} need mapping, not assuming.`,
    change: (_client) =>
      `The proposed change establishes a trusted, shared data foundation that decision-makers can act on directly, rather than reconciling numbers before every meeting.`,
    valueOutcomeVariants: [
      () => `Decisions made faster because the numbers are trusted, not because they're rushed.`,
      () => `Teams who trust the data enough to stop double-checking it before every decision.`,
      () => `A data foundation sharp enough to become a genuine decision-making advantage.`,
    ],
    progression: [
      { title: "Where trust in the data breaks", description: "Name the specific sources or reports that currently disagree with each other." },
      { title: "One trusted foundation", description: "Introduce the shared data model that decision-makers can rely on." },
      { title: "Decisions made faster", description: "Show how the right people get the right numbers without reconciliation delay." },
      { title: "Intelligence as advantage", description: "Describe how this foundation supports more advanced analytics or AI use cases next." },
    ],
    assertionHeadlines: [
      (client) => `${client}'s data problem is trust, not volume`,
      (client) => `One number, not five, guides decisions at ${client}`,
      (client) => `${client} decides faster once the data is trusted`,
      (client) => `Data becomes ${client}'s advantage, not its argument`,
    ],
    relevance: (client, hook) =>
      `Data and intelligence is the right frame because ${hook} points to a trust and access problem, not a lack of data itself.`,
    assumptions: (client) => [
      `The specific data sources or reporting conflicts named are illustrative until confirmed with ${client}'s teams.`,
      "No specific accuracy, latency, or decision-speed figures are available yet — validate before including any in the deck.",
      "Assumes the priority is a trusted shared foundation rather than a specific analytics or AI use case yet — confirm scope.",
    ],
    tones: [
      { name: "Disciplined and Precise", description: "Careful, evidence-aware tone that never overstates data maturity.", voiceNotes: ["Flag every unconfirmed figure explicitly", "Prefer 'typically' to absolute claims"] },
      { name: "Curious and Experimental", description: "Frames the data foundation as the start of a longer analytics and AI journey.", voiceNotes: ["Use 'test and learn' language for advanced use cases", "Avoid overpromising AI outcomes"] },
      { name: "Executive and Assured", description: "Board-level framing suited to a decision-speed and governance conversation.", voiceNotes: ["Tie data trust directly to decision quality", "Keep tone measured, not hype-driven"] },
    ],
  },
];

export function findDirection(id: string): DirectionTemplate {
  const d = DIRECTIONS.find((dir) => dir.id === id);
  if (!d) throw new Error(`Unknown direction: ${id}`);
  return d;
}

export const FALLBACK_DIRECTION_IDS = ["transformation", "customer-experience", "cost-optimisation"];

export interface FlowTemplateDefinition {
  id: string;
  name: string;
  structureLabels: string[];
  descriptionTemplate: (storyName: string) => string;
  whySuitedTemplate: (storyName: string, toneName: string) => string;
}

export const FLOW_TEMPLATES: FlowTemplateDefinition[] = [
  {
    id: "challenge-implication-solution-value",
    name: "Challenge → Implication → Solution → Value",
    structureLabels: ["Challenge", "Implication", "Solution", "Value"],
    descriptionTemplate: (storyName) =>
      `Opens on the problem, makes the cost of inaction concrete, then introduces "${storyName}" as the resolution and closes on outcome.`,
    whySuitedTemplate: (storyName, toneName) =>
      `A direct, problem-first structure suits the "${storyName}" story because it builds urgency before proposing change, and pairs naturally with a ${toneName.toLowerCase()} delivery.`,
  },
  {
    id: "current-future-path-outcomes",
    name: "Current State → Future Vision → Transformation Path → Outcomes",
    structureLabels: ["Current State", "Future Vision", "Transformation Path", "Outcomes"],
    descriptionTemplate: (storyName) =>
      `Grounds the audience in today's reality, paints the destination that "${storyName}" points to, then makes the path there concrete before naming outcomes.`,
    whySuitedTemplate: (storyName, toneName) =>
      `This structure works well for "${storyName}" when the audience needs to see the destination before they'll trust the path — especially in a ${toneName.toLowerCase()} register.`,
  },
  {
    id: "opportunity-principles-delivery-partnership",
    name: "Strategic Opportunity → Design Principles → Delivery Model → Partnership Value",
    structureLabels: ["Strategic Opportunity", "Design Principles", "Delivery Model", "Partnership Value"],
    descriptionTemplate: (storyName) =>
      `Leads with the opportunity behind "${storyName}", sets the principles guiding the approach, shows how delivery actually works, then closes on why this partnership specifically.`,
    whySuitedTemplate: (storyName, toneName) =>
      `Best suited to "${storyName}" when the differentiator is how the work gets delivered and by whom, not just what changes — a good match for a ${toneName.toLowerCase()} tone.`,
  },
];
