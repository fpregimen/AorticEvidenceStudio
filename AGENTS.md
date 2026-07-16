# AGENTS.md

## Project

Aortic Evidence Studio is a bilingual English/Japanese evidence and academic-workflow platform for aortic and vascular specialists.

The current MVP focuses on:
- Type B aortic dissection
- Preemptive TEVAR
- False lumen embolization
- Fenestrated and branched repair
- PMEG
- TAMBE and TBE
- Type II endoleak prevention
- HTAD and endovascular treatment

## Working priorities

1. Protect evidence integrity and patient privacy.
2. Preserve a simple, maintainable architecture.
3. Complete one validated clinical question end-to-end before expanding scope.
4. Prefer small, reviewable changes over broad rewrites.
5. Keep English and Japanese interfaces functional.

## Non-negotiable medical-safety rules

- Never fabricate references, PMIDs, DOIs, quotations, guideline wording, trial outcomes, device specifications, approval status, or source locations.
- Never present expert commentary, institutional practice, or AI inference as published evidence.
- Never mark content as `Specialist validated` without an explicit specialist action.
- Never set `verified_by_reviewer = true` automatically.
- Never set `suitable_for_generated_answer = true` before synthesis-level specialist approval.
- Clearly distinguish acute, subacute, and chronic disease; uncomplicated and complicated TBAD; randomized and observational evidence.
- Do not treat a remodeling endpoint as proof of mortality benefit.
- Do not interpret a nonsignificant result as equivalence.
- State when direct comparative evidence is absent.
- Regulatory and IFU claims must include region and verification date.
- The application supports specialist decision-making and academic work; it does not replace clinical judgment, original-source review, multidisciplinary discussion, regulatory confirmation, or IFU review.

## Patient privacy

- Do not add or store patient names, MRNs, dates of birth, addresses, contact information, identifiable images, or other protected health information.
- Do not create sample patient records containing realistic identifiers.
- Keep the warning against entering identifiable patient information visible near clinical input fields.

## Source and PDF handling

- `source_documents/private/` contains local review copies and must remain Git-ignored.
- Never expose private PDF paths, absolute repository paths, or private documents to the browser.
- Never commit copyrighted PDFs unless redistribution is explicitly permitted.
- Source identity should primarily use DOI, PMID, normalized title, journal, and publication year.
- Minor author-list, punctuation, subtitle, or group-authorship differences should produce a metadata warning rather than stopping extraction when core identifiers match.
- A conflicting DOI, PMID, article title, journal, or publication year is a mismatch and must stop extraction.

## Evidence workflow

When asked to prepare a source review, follow the permanent, source-type-aware workflow in `docs/CODEX_SOURCE_REVIEW_WORKFLOW.md`.

Use this sequence:

Question
→ domain classification
→ source selection
→ original-source extraction
→ claim-level citation
→ numerical-outcome extraction
→ validation scripts
→ specialist claim review
→ synthesis review
→ approved answer generation

Each claim should be narrow and traceable to:
- `source_id`
- exact supporting text
- printed or PDF page
- section, table, figure, or a clear source-location note

Do not generate production answers from metadata-only records or unvalidated extraction records.

## Current project state

- Product requirements, safety rules, evaluation framework, and evidence architecture exist.
- The interactive frontend and Source Library v1 exist.
- Ten initial TBAD/preemptive-TEVAR sources are registered.
- Original-source extraction exists for INSTEAD, INSTEAD-XL, and ADSORB.
- Specialist validation and synthesis approval are the current priority.
- Live external retrieval is not yet implemented.

## Scope control

Unless the task explicitly changes scope:

- Do not add authentication, cloud storage, analytics, EHR integration, DICOM processing, billing, or a native mobile app.
- Do not connect an AI model, PubMed API, or other external service.
- Do not broaden the MVP to general medicine.
- Do not redesign unrelated pages.
- Do not replace existing schemas or documentation wholesale.
- Do not add production dependencies without explaining why they are required.

## Development conventions

- Use TypeScript and the existing Next.js App Router structure.
- Reuse existing components and types before creating duplicates.
- Keep server-only file access out of client components.
- Never accept arbitrary file paths from browser input.
- Use safe and atomic local JSON writes for review decisions.
- Preserve responsive desktop, iPad, and mobile layouts.
- Maintain natural specialist-level Japanese rather than literal machine translation.
- Hide empty metadata fields instead of rendering `undefined`, `null`, or blank labels.
- Keep prototype and unvalidated-content notices prominent.

## Required checks

After relevant changes, run:

```bash
npm run validate:sources
npm run validate:reviews
npm run lint
npm run build
```

Do not report completion if a required check fails. Fix in-scope failures or explain the blocker precisely.

For UI changes, also confirm:
- English/Japanese switching
- Desktop and mobile behavior
- No horizontal page overflow
- No private paths or PDFs exposed
- Unsupported source IDs are rejected
- Required confirmation cannot be bypassed

## Git and task completion

- Do not rewrite Git history.
- Do not delete existing project documents or evidence records without explicit instruction.
- Keep commits focused.
- At task completion, report:
  - files created
  - files modified
  - schema or dependency changes
  - validation results
  - lint result
  - build result
  - remaining limitations
  - exact manual review steps

## Current milestone

Complete Evaluation Question 2 end-to-end:

1. Specialist validation interface for AES-RCT-001, AES-RCT-002, and AES-RCT-003
2. Claim and numeric-outcome review
3. Synthesis validation
4. Explicit approval gate
5. Integration of the approved synthesis into the results page
6. No public answer until all required specialist approvals are complete
