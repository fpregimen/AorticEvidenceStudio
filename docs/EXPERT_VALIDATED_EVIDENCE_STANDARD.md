# Expert-Validated Evidence standard

## Purpose

This standard defines the minimum content, original-source provenance, specialist validation, and publication-eligibility requirements for an AES evidence revision to be described as Expert-Validated Evidence.

It applies to papers, guidelines, trial reports, IFUs, regulatory documents, official reports, tables, figures, supplements, and appendices. Meeting this standard does not make an item clinically applicable to every patient or substitute for original-source review and clinical judgment.

## Normative terms

- **Must** denotes a mandatory condition.
- **Should** denotes a recommended condition that requires documented justification if omitted.
- **Authoritative source text** is the exact text in the verified original-source version and language.
- **Expert-Validated Evidence** is an approved evidence revision satisfying this standard; it is not expert interpretation or AI synthesis.

## Minimum evidence record

### Source identity and version

Every evidence revision must identify:

- canonical source and source-version IDs;
- full citation appropriate to the source type;
- exact title and author/group/issuer;
- document type;
- edition, publication version, revision, correction, supplement, or report identity;
- journal, publisher, society, manufacturer, or regulator;
- publication year and date when verified;
- DOI, PMID, official identifier, trial registration, regulatory identifier, or official URL when available;
- authoritative source language;
- jurisdiction and verification date for regulatory and IFU evidence;
- identity-verification outcome and any warnings.

A conflicting DOI, PMID, title, journal/issuer, publication year, edition, or official version prevents approval until resolved.

### Source-file integrity

The reviewed rendition must have:

- source-file ID;
- raw-byte cryptographic hash and algorithm;
- byte length and MIME type;
- page count when paginated;
- acquisition/access classification;
- ingestion timestamp;
- derived text/OCR artifact hash when used for navigation or extraction.

The source-file hash proves byte identity only. It does not prove that the file is authentic, complete, correctly identified, or medically accurate.

### Exact location

Every evidence revision must have at least one location bound to the reviewed source-file hash. The location must include printed page and PDF page when both exist, plus sufficient additional provenance to locate the evidence unambiguously.

Applicable fields include:

- chapter;
- section and subsection;
- recommendation number;
- paragraph or stable text anchor;
- exact supporting quotation;
- Table number, title, row, column, spanning header, and footnote;
- Figure number, title, panel, axes, units, legend/series, and time point;
- supplement or appendix name, section, page, table, or figure;
- protocol, statistical-analysis-plan, or erratum relationship.

**A page number alone is not sufficient.** A generic location such as “Results section” or “Table 2” is also insufficient when row, column, panel, or paragraph context is available.

### Exact supporting text

- Store the exact authoritative quotation without silently correcting spelling, punctuation, capitalization, or terminology.
- Record an ellipsis only when omitted text is not needed to preserve meaning, and identify that the quotation is discontinuous.
- Do not join text from separate locations without recording each location.
- Preserve recommendation wording exactly and separately store class/strength and level of evidence as printed.
- Preserve source-specific definitions for disease phase, population, endpoint, and measurement.
- Store a supporting-text hash with its algorithm and normalization profile.
- Translations are separate records and must be labeled as translations, not original-source quotations.

## Evidence-type requirements

### Narrow textual claims

Claims must be atomic enough that one specialist decision can apply to the entire assertion. Population, setting, phase, comparator, endpoint, time point, and uncertainty must not be omitted when they materially constrain the claim.

### Guideline recommendations

Require exact recommendation wording, recommendation identifier, class/strength, evidence level, table/section location, edition/version, issuing body, and source-language text. Supporting narrative and cited primary evidence are separate evidence items and authority classifications.

### Numerical outcomes

Require exact result, units, numerator and denominator when reported, population, intervention/comparator, time point, analysis set, endpoint definition, effect measure, uncertainty, and source location. Reported and calculated values must be distinguished. Thresholds and baseline descriptors must not be labeled clinical outcomes.

### Table-derived evidence

Require table number/title, row path, column path, spanning headers, cell text, applicable footnotes, analysis population, and exact table location. The specialist must inspect the full table context, not only an isolated cell.

### Figure-derived evidence

Require figure number/title, panel, axes, units, scale, legend/series, time point, caption, and extraction method. A value digitized from a graph must never be represented as directly reported text.

### IFU and regulatory evidence

Require document revision, jurisdiction, regulator/manufacturer, official identifier, effective/verification date, and region-specific status. A regulatory claim in one region must not be generalized to another.

### Secondary sources

A guideline, review, or meta-analysis may be directly verified as a secondary source. That does not make the cited primary study verified. The evidence record must point to reference-chain verification and carry the appropriate authority classification.

## Specialist validation record

Every specialist review must record:

- reviewer identity;
- specialty;
- role in the review;
- qualifications snapshot required by policy;
- review date and timestamp;
- exact evidence revision reviewed;
- decision;
- comments or correction rationale;
- explicit original-source confirmation;
- whether the reviewer inspected the full text;
- whether the reviewer inspected the relevant table;
- whether the reviewer inspected the relevant figure;
- whether the reviewer inspected the relevant supplement or appendix;
- whether the reviewer inspected a cited primary source;
- conflict-of-interest disclosure or policy result when required;
- authenticated audit-event identifier.

Inspection flags are tri-state: `yes`, `no`, or `not_applicable`. They must not default to `yes`.

### Decisions

- `Pending`: no final review decision.
- `Approved`: transcription, source identity, location, scope, and classification satisfy policy.
- `Needs correction`: a correctable problem prevents approval.
- `Excluded`: intentionally not eligible for use, with rationale.
- `Disputed`: qualified disagreement remains unresolved.
- `Retired`: previously usable evidence is no longer eligible prospectively.

Existing application decisions may map into this vocabulary during migration, but migration must not create new approvals.

### Release editor

Publication requires a release-editor record containing:

- release editor identity and role;
- publication eligibility policy version;
- selected evidence revision;
- Pack candidate/release ID;
- publication decision and timestamp;
- confirmation that restricted fields and source files are excluded;
- publication date after successful Pack signing.

Release editing verifies publication controls; it does not replace specialist medical review.

## Evidence-authority classifications

These values are mutually distinguishable and must not be collapsed into a generic `validated` flag.

| Classification | Required meaning | Fully primary-source verified? |
|---|---|---|
| `guideline_recommendation_directly_verified` | Exact recommendation checked in the original guideline version | No; verifies the guideline recommendation itself |
| `primary_evidence_directly_verified` | Claim/result checked directly in its original primary source | Yes |
| `underlying_primary_evidence_verified` | A secondary assertion has a verified chain to supporting primary evidence | Yes for the linked primary support, subject to chain scope |
| `secondary_citation_only` | Secondary source checked; cited primary source not independently checked | No |
| `primary_source_not_yet_verified` | Candidate primary source identified but verification incomplete | No |
| `unable_to_verify` | Required source/version/location could not be obtained or resolved | No |
| `citation_mismatch` | Citation does not support the inherited claim or resolves to the wrong source | No |
| `conflicting_interpretation` | Qualified interpretations conflict and remain unresolved | No unless a Pack policy permits explicit dispute content |
| `expert_interpretation` | Human contextual interpretation | Not published evidence |
| `ai_synthesis` | Machine-generated synthesis | Not published evidence |

Secondary-source-only evidence must never display a badge, filter, field, or wording that implies full primary-source verification.

## Approval completeness

An `Approved` decision is invalid unless:

- reviewer identity and eligible specialty/role are present;
- review date is valid;
- original-source confirmation is explicit;
- source identity and exact version are verified;
- exact supporting text is present;
- source-file and supporting-text hashes are present and reproducible;
- location exceeds page-only provenance;
- required table/figure/supplement context is present;
- authority classification is explicit;
- evidence meaning preserves population, phase, endpoint, timing, and uncertainty;
- no unresolved citation mismatch applies to the asserted authority;
- comments address any material warning;
- the reviewed revision is current and unchanged.

Client and server validation must enforce the same substantive rules. Server enforcement is authoritative.

## Immutability and correction

- A saved evidence revision and specialist review are immutable.
- Corrections create a new evidence revision and new review.
- Approval never transfers automatically to the new revision.
- The old revision remains linked through `supersedes`/`superseded_by` and to all historical Packs.
- A correction record states whether the change affects transcription, location, classification, interpretation, numerical value, citation chain, translation, or publication eligibility.
- Disputes and retirement append state relationships and audit events; they do not delete content.

## Publication eligibility

Only approved evidence revisions may be candidates for an Evidence Pack. Eligibility also requires:

- current, non-retired revision;
- satisfied review quorum;
- permissible authority classification;
- resolved required reference checks;
- source-rights clearance for included text and metadata;
- no restricted path, source file, credential, or reviewer-only note;
- valid release-editor decision;
- deterministic schema and integrity validation.

Whether `secondary_citation_only` and explicit disputes may appear in a Pack is unresolved product policy. If allowed, they must remain unmistakably labeled and excluded from primary-verified metrics.

## Synthetic non-medical example

```json
{
  "revision_id": "EVI-01J00000000000000000000004@r1",
  "authority_classification": "primary_evidence_directly_verified",
  "assertion": "Synthetic coating retained 90 units at day 30.",
  "exact_supporting_quotation": "At day 30, coating retention was 90 units.",
  "supporting_text_hash": {
    "algorithm": "sha256",
    "normalization": "aes-text-nfc-lf-v1",
    "value": "synthetic-placeholder-not-a-real-hash"
  },
  "location": {
    "printed_page": "12",
    "pdf_page": 14,
    "section": "Results",
    "paragraph_anchor": "at-day-30-coating-retention",
    "table": "Table 2",
    "row": "Day 30",
    "column": "Retention",
    "footnote": "Units are synthetic"
  },
  "specialist_review": {
    "reviewer_id": "RVR-01J00000000000000000000010",
    "specialty": "Synthetic materials review",
    "role": "specialist_reviewer",
    "decision": "Approved",
    "review_date": "2099-01-01",
    "original_source_confirmed": true,
    "inspected": {
      "full_text": "yes",
      "table": "yes",
      "figure": "not_applicable",
      "supplement": "not_applicable",
      "cited_primary_source": "not_applicable"
    }
  }
}
```

## Unresolved product-owner decisions

1. Required review quorum and adjudication by evidence category.
2. Reviewer specialty and credential requirements.
3. Whether reviewer identity and comments appear in commercial Packs.
4. Pack eligibility of secondary-only and disputed evidence.
5. Maximum quotation length and table/figure detail allowed by source rights.
6. Translation approval and display policy.
7. Re-review intervals and triggers by source type.
8. Whether release editor and specialist reviewer must be different people.
9. Conflict-of-interest disclosure and recusal rules.
10. Acceptability and validation of figure digitization.

## Implementation acceptance criteria

- No evidence can be approved with page-only provenance.
- Approval fails when any mandatory specialist-review field or applicable inspection flag is absent.
- A direct guideline recommendation cannot be mislabeled as verified underlying primary evidence.
- Secondary-only evidence cannot be counted or displayed as primary verified.
- Table and figure items fail their context-specific validation when coordinates or context are incomplete.
- Changing quotation, location, numerical result, or authority classification requires a new revision and review.
- Historical review and publication state remains reconstructable after correction.
- Restricted source-file information cannot enter a Pack candidate.
- Release-editor action cannot create or substitute for specialist approval.
