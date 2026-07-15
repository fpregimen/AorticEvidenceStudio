# Aortic Evidence Studio — Development Handoff

**Updated:** 2026-07-15  
**Project owner:** Dai Yamanouchi  
**Repository:** `AorticEvidenceStudio`  
**Primary local path:** `/Users/dai/Developer/AorticEvidenceStudio`  
**Primary branch:** `main`

---

## 1. Purpose of this document

This file is the handoff context for continuing development of **Aortic Evidence Studio** in a new ChatGPT or Codex thread.

Before making changes:

1. Open the repository at `/Users/dai/Developer/AorticEvidenceStudio`
2. Confirm the current Git branch is `main`
3. Read `AGENTS.md`
4. Inspect the current repository state
5. Do not recreate the previous complex synthesis-button or blocker-navigation implementation

---

## 2. Product vision

Aortic Evidence Studio is a bilingual English/Japanese evidence and academic-workflow application for aortic and vascular specialists.

The intended differentiation from broad medical-answer systems is:

- Aortic-specialty focus
- Claim-level citations
- Original-source traceability
- Guideline and regulatory comparison
- United States/Japan/Europe comparison
- Device and IFU awareness
- Specialist validation before production use
- Academic-output workflows such as slides, guideline drafts, conference discussion, and research background

The application is not intended to replace:

- Clinical judgment
- Multidisciplinary review
- Original-source review
- Regulatory verification
- Manufacturer IFU review

---

## 3. Current overall progress

Estimated status:

- Interactive frontend: approximately 80%
- Source Library and evidence metadata framework: approximately 60%
- Claim/outcome extraction infrastructure: approximately 70%
- Specialist and synthesis validation workflow: approximately 75%
- Evaluation Question 2 vertical MVP: approximately 75–80%
- Initial 30-question / 50-source MVP: approximately 35–40%
- Production-ready product: approximately 15–20%

The key accomplishment is that one clinical question can now move through most of the full workflow:

**source registration → original-source extraction → claim/outcome review → specialist decision → synthesis decision → results display**

---

## 4. Repository and Git status

The active repository was moved out of Google Drive for better Next.js and Codex performance.

Use:

```text
/Users/dai/Developer/AorticEvidenceStudio
```

The working branch is:

```text
main
```

The temporary branch `specialist-validation-v2` was merged into `main` and may be deleted after confirmation.

The previous stashed complex approval implementation should not be restored.

`.DS_Store` should be ignored through `.gitignore` and removed from Git tracking.

---

## 5. Important repository instructions

The repository root contains:

```text
AGENTS.md
README.md
app/
components/
database/
docs/
lib/
scripts/
source_documents/
package.json
```

`AGENTS.md` contains permanent Codex rules, including:

- Never fabricate medical references, trial results, recommendations, regulatory claims, or source locations
- Never mark content specialist validated automatically
- Never expose private PDF paths
- Preserve English/Japanese behavior
- Run the required validation commands after milestone changes

Every new Codex thread should begin with:

```text
Before changing anything:

1. Run git branch --show-current.
2. Confirm the current branch is main.
3. Read and follow AGENTS.md.
4. Inspect the current repository state.
5. Briefly report what exists before editing.
```

---

## 6. Implemented application areas

The application currently includes:

- Home page
- English/Japanese language switching
- Question input and workflow selection
- Prototype results page
- Projects placeholder
- Source Library
- Evaluation framework
- Evaluation Question 2 review workspace
- Source-level review pages
- Synthesis page
- Synthesis validation page
- Results integration
- Source and review validation scripts

Technology:

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- Local JSON and CSV evidence storage
- No authentication
- No cloud database
- No external AI API
- No live PubMed retrieval

---

## 7. Evidence source architecture

The source catalog is stored in:

```text
database/source_catalog.csv
```

The source schema is stored in:

```text
database/source_schema.json
```

Current registered sources: **10**

Initial TBAD/preemptive-TEVAR set:

### Guidelines

- AES-GDL-001 — 2022 ACC/AHA Aortic Disease Guideline
- AES-GDL-002 — STS/AATS Type B Aortic Dissection Guideline
- AES-GDL-003 — EACTS/STS Aortic Syndromes Guideline
- AES-GDL-004 — JCS/JSCVS/JATS/JSVS Aortic Guideline

### Randomized trial publications

- AES-RCT-001 — INSTEAD
- AES-RCT-002 — INSTEAD-XL
- AES-RCT-003 — ADSORB

### Registry and observational studies

- AES-REG-001 — VIRTUE Registry
- AES-OBS-001 — Natural history of medically managed acute TBAD
- AES-OBS-002 — ADSORB predictors of aortic growth analysis

Bibliographic metadata validation currently passes for all 10 records.

---

## 8. Local original-source PDFs

The original article PDFs are local and Git-ignored.

Folder:

```text
source_documents/private/
```

Files:

```text
AES-RCT-001_2009_INSTEAD.pdf
AES-RCT-002_2013_INSTEAD-XL.pdf
AES-RCT-003_2014_ADSORB.pdf
```

Rules:

- Do not commit these PDFs
- Do not expose them through the browser
- Do not expose absolute local paths
- Do not redistribute copyrighted material
- Never store patient-identifiable information in this folder

A minor INSTEAD-XL author-list discrepancy was accepted as a bibliographic warning because core identity fields matched.

Primary source-identity fields:

- DOI
- PMID
- Normalized title
- Journal
- Publication year

Minor author-list or study-group differences should not stop extraction when core identity is secure.

---

## 9. Evaluation Question 2

Question:

> What evidence supports preemptive TEVAR for uncomplicated acute or subacute type B aortic dissection?

The review workspace is located at:

```text
/evaluation/2/review
```

The synthesis page is located at:

```text
/evaluation/2/synthesis
```

The synthesis validation page is located at:

```text
/evaluation/2/synthesis/validate
```

Original-source extraction was completed for:

- AES-RCT-001 — INSTEAD
- AES-RCT-002 — INSTEAD-XL
- AES-RCT-003 — ADSORB

Review records:

```text
database/content_reviews/Q02_AES-RCT-001.json
database/content_reviews/Q02_AES-RCT-002.json
database/content_reviews/Q02_AES-RCT-003.json
```

Synthesis draft:

```text
database/synthesis_drafts/Q02_PREEMPTIVE_TEVAR_DRAFT.json
```

The extraction distinguishes:

- Initial INSTEAD randomized findings
- INSTEAD-XL long-term follow-up
- Acute uncomplicated ADSORB population
- Clinical outcomes versus remodeling outcomes
- All-cause versus aorta-specific outcomes
- Trial limitations
- Disease-phase differences

The system must not overstate that:

- TEVAR improves survival in every uncomplicated TBAD patient
- Remodeling proves mortality benefit
- INSTEAD and ADSORB studied identical populations or disease phases
- One universal optimal treatment timing has been established

---

## 10. Specialist validation history

A complex first validation implementation created repeated UI and blocker-state problems.

Major problems included:

- Approve button state not visually clear
- Circular disabled logic
- Source-level and synthesis-level blockers being mixed
- Inconsistent completion rules
- Old browser/dev-server output being confused with current code
- Tests expecting removed custom-button behavior
- Merge conflicts with the old implementation

The project was rolled back and rebuilt on a branch named:

```text
specialist-validation-v2
```

The simplified v2 workflow was then merged into `main`.

### Current simplified synthesis decision interface

The custom approval buttons were replaced with native radio controls:

```text
( ) Approve synthesis
( ) Return for correction
```

Required synthesis fields:

- Decision
- Reviewer name
- Valid review date
- Confirmation checkbox
- Reviewer note only when returning for correction

Evidence incompleteness may be shown as a warning but does not prevent saving a synthesis decision in the current simplified implementation.

The synthesis decision was successfully saved through the native radio interface.

---

## 11. Important current behavior

The simplified synthesis validation page uses native radio inputs in:

```text
components/synthesis-client.tsx
```

The test was updated to expect native radio controls rather than custom buttons.

The final validation run passed:

- Source validation: 10/10 valid
- Review validation: 10/10 valid
- Synthesis validation tests: 15 passed
- ESLint: passed
- Production build: passed
- `/evaluation/2/synthesis/validate`: generated successfully

Do not restore old tests expecting:

```text
type="button"
aria-pressed
```

The current intended controls use:

```text
type="radio"
name="decision"
value="Approved"
value="Requires correction"
```

---

## 12. Required validation commands

At the end of a milestone, run:

```bash
npm run validate:sources
npm run validate:reviews
npm run lint
npm run build
```

Expected:

```text
Source catalog validation
Total records: 10
Valid records: 10
Warning count: 0
Error count: 0
```

```text
Content review validation
Total review files: 10
Valid files: 10
Warning count: 0
Error count: 0
```

The synthesis-validation test suite should also pass.

For small UI-only changes, targeted tests and lint may be run first, but complete validation and build are required before merging into `main`.

---

## 13. How to run locally

From the repository root:

```bash
npm run dev
```

Usually open:

```text
http://localhost:3000
```

Relevant routes:

```text
http://localhost:3000/evaluation/2/review
http://localhost:3000/evaluation/2/synthesis
http://localhost:3000/evaluation/2/synthesis/validate
http://localhost:3000/results
http://localhost:3000/sources
```

When the displayed interface appears older than the code:

```bash
pkill -f "next dev" 2>/dev/null || true
rm -rf .next
npm run dev
```

Then perform a browser hard reload:

```text
Command + Shift + R
```

Always confirm that Terminal is in:

```text
/Users/dai/Developer/AorticEvidenceStudio
```

---

## 14. Current limitations

- No live PubMed or guideline retrieval
- No external AI model
- No authentication
- No cloud database
- No reviewer identity verification
- No independent second-review workflow
- No production deployment
- Only three RCT publications have original-source content extraction
- The four guidelines remain metadata-only
- VIRTUE and the two observational studies remain metadata-only
- Question 2 is not yet a complete RCT + guideline + observational synthesis
- Evidence warning semantics should be reviewed before clinical production use

---

## 15. Recommended next milestone

Do not immediately add more approval-UI complexity.

First confirm on `main`:

1. `/evaluation/2/synthesis/validate` shows the native radio interface
2. The saved synthesis decision is visible after reload
3. `/results` shows the saved synthesis result and the correct validation/warning status
4. All validation commands pass

Then complete Question 2 by adding guideline evidence.

Recommended order:

1. ACC/AHA guideline extraction
2. STS/AATS guideline extraction
3. EACTS/STS guideline extraction
4. JCS/JSCVS/JATS/JSVS guideline extraction
5. Specialist review of exact recommendation wording
6. US/Japan/Europe comparison
7. Add VIRTUE and observational high-risk evidence
8. Produce final Question 2 answer with claim-level citations
9. Review results-page wording and status labels
10. Only then expand to the next evaluation question

---

## 16. Suggested next Codex prompt

```text
Read and follow AGENTS.md.

Work on main.

Before changing anything:

1. Run git branch --show-current.
2. Confirm the branch is main.
3. Inspect the current Question 2 synthesis, validation state, and results-page integration.
4. Run the existing validation commands.
5. Report the current baseline before editing.

Next milestone:
Prepare a safe original-source review workflow for the four registered
guidelines relevant to Evaluation Question 2:

- AES-GDL-001
- AES-GDL-002
- AES-GDL-003
- AES-GDL-004

Do not create guideline recommendations from memory.
Do not fabricate recommendation classes, evidence levels, wording, or page
locations.
Do not change the current working synthesis-validation interface.

First inspect whether the original guideline files are locally available.
If any required original source is missing, stop and report the missing files.
```

---

## 17. Development lessons

- Keep active Next.js repositories outside Google Drive
- Use GitHub for code history and backup
- Keep copyrighted PDFs local and ignored
- Use short, focused Codex tasks
- Do not repeatedly patch a broken component; simplify or replace it
- Separate decision selection from final save
- Prefer native controls for critical validation workflows
- Update tests when intentionally changing the interaction model
- Confirm the active branch, active folder, and dev-server instance before debugging UI
- Avoid mixing source-level validation and synthesis-level validation
- Do not use stashed old implementation code after a successful replacement

---

## 18. Definition of success for Question 2

Question 2 is fully complete only when:

- The three RCT publications are reviewed
- The four guidelines are reviewed
- Relevant registry/observational evidence is reviewed
- Exact source locations are recorded
- Recommendation wording is specialist validated
- Acute/subacute/chronic populations remain distinct
- Clinical outcomes and remodeling outcomes remain distinct
- Regional differences are presented accurately
- The final synthesis is specialist approved
- The results page displays only approved content
- Claim-level references are visible
- Validation, lint, and build pass
