# Sales Deck Studio

Turn a deal synopsis into a co-branded Infosys sales presentation in three guided steps — Story Agent, Narrative Agent, Theming Agent — then export a single prompt that any AI platform (Claude, ChatGPT, Gemini, Copilot) can turn into the finished `.pptx`.

Built by Charles Elena for the TITAN Europe AI Showcase (FS Europe, Amsterdam; CoreMfg Europe, Frankfurt).

## Try it

1. Pick a client from the showcase list (or type any name).
2. Choose a story, then a tone and narrative flow.
3. Choose a visual style — the preview is what the finished deck will look like.
4. On the review page, click any slide to edit it, then follow **Step 1** (copy the deck prompt into your AI platform) and **Step 2** (optional per-slide image prompts).

Everything is saved in your browser; nothing is sent anywhere except the live brand-colour scan of the client's public website.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Notes

- Client reference colours and logos live in `src/lib/knownClients.ts` and `public/logos/` (sources in `public/logos/SOURCES.json`). Colours are reference values — verify against official brand guidelines before a live pitch.
- Sample deal synopses are fictional and for demonstration only.
