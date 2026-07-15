# Aortic Evidence Studio

A bilingual evidence and academic-workflow prototype for aortic and vascular specialists. The interface is designed for desktop, iPad, and mobile use and deliberately separates demonstration content from future validated evidence.

## Technology stack

- Next.js with App Router
- React and TypeScript
- Tailwind CSS
- ESLint
- Browser-local React state and `localStorage`

## Installation and local development

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. To create and run a production build:

```bash
npm run build
npm start
```

Run static checks with `npm run lint`.

## Current prototype features

- Immediate English/Japanese language switching
- Specialist question field, safety notice, examples, and five workflow modes
- Local persistence for language, the last question, and selected mode
- Interactive demonstration results with seven tabs
- Responsive reference panel and placeholder supporting pages
- Clear evidence-category labels, verification states, and prototype disclaimers
- Keyboard-accessible native controls and responsive layouts

Live evidence retrieval is **not yet implemented**. The prototype does not call an AI model, PubMed, regulatory service, or any external API. Its displayed clinical area is sample interface content only, not a literature search or medical recommendation.

## Project structure

- `app/` — App Router pages, layout, and global styles
- `components/` — reusable interactive interface components
- `lib/` — shared types and localization helper
- `docs/` — product requirements, safety, evaluation, and evidence architecture
- `database/` — source catalog schema and seed catalog
- `source_documents/` — future validated source-document workspace

## Current Development Status

- Product requirements completed
- Safety rules completed
- Evaluation framework completed
- Evidence source architecture completed
- Interactive frontend prototype completed
- Source Library v1 completed
- Initial 10 TBAD and preemptive TEVAR sources registered
- Core bibliographic metadata verified
- Content review architecture completed
- Evaluation Question 2 review workspace created
- Claim extraction not yet started
- Claim-level citation review not yet completed
- Specialist validation not yet started
- Live evidence retrieval not yet started

## Next development milestone

Populate and specialist-validate the local source catalog, then connect a retrieval workflow with traceable source passages. This milestone must preserve the evidence-category separation and regulatory safeguards defined in `docs/`.
