# Codex source-review workflow

Use this workflow whenever the user asks to prepare a source review, including a short request such as `Prepare source review for Q03 AES-GDL-001.` It applies to every question registered in `database/evaluation_questions.json`.

## Safety invariants

- Read `AGENTS.md` before acting and preserve all medical-safety and privacy requirements.
- Work on `main`. Start with `git branch --show-current`, `git status --short`, and `npm run review:status -- <QUESTION_ID> <SOURCE_ID>`.
- Accept only a question ID registered in `database/evaluation_questions.json` and a source ID registered for that question in `database/source_catalog.csv`. Never accept a path, filename, URL, or shell fragment as either ID.
- Inspect the original PDF. Never extract quotations, outcomes, recommendations, or source locations from memory, abstracts elsewhere, metadata alone, or another review record.
- Never add private PDF paths or filenames to committed review JSON or browser code. Private review copies remain under the Git-ignored private-source directory.
- Never approve an item automatically, mark it reviewer verified, or make it suitable for generated answers. New and changed extraction items remain `Pending`, with `verified_by_reviewer=false` and `suitable_for_generated_answer=false`.
- Specialist decisions are made manually in the existing source-review UI. Do not change synthesis approval behavior or its native radio controls.
- Do not commit or push extraction work. Finalization happens only after manual specialist review with the dedicated finalization command.

## Preparation sequence

1. Confirm `main` and inspect the working tree. Preserve existing user changes; stop if they conflict with the requested record.
2. Run `npm run review:status -- <QUESTION_ID> <SOURCE_ID>`. Read the question registry, catalog row, and question-specific review record.
3. Require exactly one private PDF whose basename begins with `<SOURCE_ID>_` and ends in `.pdf`. If it is missing or ambiguous, stop and report the registered title, journal or organization, year, DOI, PMID, and expected filename pattern.
4. Verify normalized title, journal or organization, publication year, DOI, and PMID when printed or otherwise present in the original PDF. A conflicting core identifier stops extraction. A missing PMID in the PDF is documented as unavailable rather than invented. Minor punctuation, subtitle, author-list, or group-authorship differences are metadata warnings.
5. Inspect every relevant PDF page using text extraction plus rendered-page review. Record printed page and PDF page, section, table, figure, recommendation number, or another precise source-location note.
6. Create or update only `database/content_reviews/<QUESTION_ID>_<SOURCE_ID>.json`. Preserve existing specialist decisions unless the specialist explicitly changes them through the UI. Do not alter other evidence records.
7. Extract narrow claims and numerical outcomes only when directly supported by the original source. Preserve exact wording where the source makes a formal recommendation. Keep clinical outcomes distinct from surrogate or remodeling outcomes.
8. Leave all new items Pending and all safety flags false. Do not mark the review `Specialist validated`.
9. Run `npm run validate:sources`, `npm run validate:reviews`, `npm run lint`, and `npm run build`. Fix only in-scope errors.
10. Report identity verification, files changed, claims and outcomes with exact locations, limitations, unresolved ambiguities, check results, and the question-specific manual review URL.

## Source-type requirements

### Clinical guidelines

- Preserve recommendation wording, class or strength, and evidence level exactly as printed.
- Record chapter, section, recommendation table, recommendation number, printed page, and PDF page.
- Separate formal recommendations from supporting narrative and secondary summaries of studies.
- Preserve each guideline's own phase, risk, and disease terminology; do not force equivalence across societies or regions.
- Include complicated-disease recommendations only when needed to prevent misapplication to uncomplicated disease.

### Randomized trials

- Record randomization design, analysis population, arms, allocation counts, eligibility, follow-up, crossovers, and prespecified endpoints.
- Distinguish intention-to-treat, per-protocol, and imaging populations.
- Report denominators, effect estimates, uncertainty, and exact time points as printed.
- Do not interpret nonsignificance as equivalence or remodeling as mortality benefit. Record power and missing-data limitations.

### Registries

- State whether enrollment was prospective or retrospective, consecutive or nonconsecutive, multicenter or single-center, and whether a comparator existed.
- Record phase-specific eligibility and treatment indications so mixed complicated, symptomatic, high-risk, and uncomplicated cohorts are not conflated.
- Treat phase and timing comparisons as observational associations, not causal treatment effects.
- Record follow-up completeness, adjudication or core-laboratory methods, reinterventions, complications, funding, and conflicts of interest.

### Observational studies

- Identify cohort or case-control design, data source, selection method, sample size, exposure definition, comparator, adjustment method, follow-up, and missing data.
- Keep adjusted and unadjusted results distinct. Record confounders included in reported models and do not infer control of unmeasured confounding.
- Distinguish association from causation, and document selection bias, immortal-time bias, surveillance differences, and generalizability where applicable.

## Manual review and finalization

1. Start the application and run `npm run review:open -- <QUESTION_ID> <SOURCE_ID>` to open the local review page. This command passes only the validated IDs to the browser and never exposes a private PDF path.
2. The specialist reviews every claim and outcome, enters a final decision, reviewer name, valid review date, and original-source confirmation, and saves through the existing UI. Approved claims must retain supporting text and a source location; approved outcomes must retain a source location.
3. `Needs correction` and `Pending` are not final decisions. Return to extraction and specialist review until every item is Approved or Excluded.
4. With only the requested review JSON modified on `main`, run `npm run review:finalize -- <QUESTION_ID> <SOURCE_ID>`. The command performs a fail-closed preflight, runs all required checks, stages only that review JSON, creates a question- and source-specific commit, and pushes `main` to `origin`.
5. Never run finalization before explicit manual specialist approval. If any preflight or validation fails, do not bypass it with manual Git commands.
