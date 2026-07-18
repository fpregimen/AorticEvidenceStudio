# ADR-006: Phase 1 canonical identity and lifecycle decisions

- **Status:** Accepted
- **Date:** 2026-07-17
- **Decision owners:** Product owner, clinical evidence governance, and architecture governance
- **Resolves:** AR-03, AR-04, AR-05, AR-06, AR-08, and AR-09 in `ARCHITECTURE_READINESS_REVIEW.md`; AR-07 remains a separate display-label decision
- **Related:** `ADR-002-CANONICAL-EVIDENCE-AND-PROVENANCE.md`, `CANONICAL_EVIDENCE_DATA_MODEL.md`, `EXPERT_VALIDATED_EVIDENCE_STANDARD.md`, `REFERENCE_CHAIN_VERIFICATION_STANDARD.md`, `Q02_Q03_CANONICAL_MIGRATION_DESIGN.md`, `IMPLEMENTATION_PHASES_AND_ACCEPTANCE_CRITERIA.md`

## Context

The architecture-readiness review identified five product decisions that had to be settled before Phase 1 could define canonical schemas and validators without embedding accidental policy. The product owner has formally approved the decisions below. This ADR records those decisions; it does not authorize application changes, real evidence migration, specialist-decision changes, cloud implementation, Pack signing, or commercial free-form synthesis.

## Decision 1: Separate authority, review decision, and verification status

These are independent dimensions. They must never be collapsed into a generic `Validated` state.

### Evidence authority/type

- `guideline_recommendation`
- `primary_study_result`
- `systematic_review_synthesis`
- `regulatory_statement`
- `ifu_requirement`
- `expert_interpretation`

Additional types require a governed vocabulary revision. Authority/type describes what an assertion is; it does not say that the assertion is approved or that an original source was verified.

### Specialist review decision

- `Pending`
- `Approved`
- `Needs correction`
- `Excluded`

Dispute and retirement are not specialist review decisions. They belong to their separate state machines.

### Source and reference verification status

- `original_source_verified`
- `underlying_primary_evidence_verified`
- `secondary_citation_only`
- `primary_source_not_yet_verified`
- `unable_to_verify`
- `citation_mismatch`
- `conflicting_interpretation`

Verification status describes the verified depth or problem for the exact evidence revision and reference-chain scope. It does not establish specialist approval or publication eligibility.

## Decision 2: Separate lifecycle state machines

The canonical model uses independent, typed state machines:

| State machine | Allowed states |
|---|---|
| Source lifecycle | `Active`, `Superseded`, `Withdrawn` |
| Evidence review lifecycle | `Draft`, `Pending`, `Needs correction`, `Approved`, `Excluded` |
| Publication lifecycle | `Unpublished`, `Release candidate`, `Published`, `Superseded`, `Retired` |
| Dispute lifecycle | `None`, `Open`, `Resolved` |
| Evidence Pack lifecycle | `Draft`, `Validated`, `Signed`, `Published`, `Revoked` |

The same display word in different state machines does not make the states interchangeable. Eligibility remains a computed policy result, not a lifecycle state or editable Boolean.

## Decision 3: Stable identifiers and revisions

- Canonical IDs are opaque and immutable.
- Typed prefixes include `SRC_`, `SRV_`, `SFL_`, `EVI_`, `REV_`, `LOC_`, `RFC_`, and `RVR_`.
- The domain model uses a UUIDv7-compatible identifier abstraction. It must not permanently depend on a particular UUID library.
- Evidence revisions are displayed as `EVI_<id>@r1`, `EVI_<id>@r2`, and so on.
- Existing `AES-*`, `Q02`, `Q03`, and question-owned identifiers remain immutable legacy aliases and provenance references.
- Existing identifiers are never silently replaced.

Phase 1 may define branded types, parsers, validators, and synthetic generators. It assigns no canonical identifier to real Q02/Q03 evidence.

## Decision 4: Evidence Item and Evidence Revision boundary

An **Evidence Item** is the stable identity of one distinct medical evidence concept. It owns a stable canonical ID, revision history, and relationships to successors, disputes, and retirement.

An **Evidence Revision** is an immutable reviewed representation containing wording, interpretation, exact source location, exact quotation, table/figure provenance, numerical values, applicability, limitations, hashes, review decision, reviewer metadata, and verification status.

A correction creates a new Evidence Revision. A new Evidence Item is required when medical meaning, population, intervention, comparator, outcome, threshold, or distinct result materially changes.

Approval applies only to the exact immutable Evidence Revision reviewed. It never transfers automatically to a successor or corrected revision.

## Decision 5: Source, version, file, and correction modeling

- **Source:** the intellectual work.
- **Source Version:** an edition, publication version, corrected version, or guideline revision.
- **Source File:** the exact inspected PDF or file, with its own hash.
- Errata and corrigenda are explicitly linked to the affected Source or Source Version.

When a correction affects an Evidence Revision, AES records the correction impact, creates a new Evidence Revision, requires specialist re-review and new approval, and permits publication only in a later Evidence Pack. The prior revision, approval history, and Pack provenance remain immutable.

A file-byte change always creates a new Source File. It never inherits location verification or approval automatically. Whether the changed file also represents a new Source Version follows the verified publication relationship: an official corrected publication is a Source Version; a byte-distinct rendition of the same unchanged publication remains a separate Source File bound to the same Source Version and requires location re-verification.

## Consequences

### Positive

- Types and validators can no longer conflate medical authority, human approval, verification depth, publication, dispute, or Pack status.
- Stable identity survives correction while immutable revisions preserve exactly what was reviewed.
- Errata and changed files cannot inherit approval silently.
- Legacy Q02/Q03 identifiers and decisions remain traceable and unchanged.

### Costs

- More explicit fields and state-transition validation are required.
- Compatibility adapters must report legacy concepts without upgrading them to canonical status.
- Display labels must always identify the dimension being shown.

## Phase 1 boundary

Phase 1 is fully unblocked for:

- vendor-neutral canonical TypeScript schemas;
- stable ID and revision types;
- validation rules;
- read-only compatibility reading of existing Q02/Q03 records;
- read-only duplicate-candidate reporting; and
- synthetic tests.

Phase 1 does not include real evidence migration, assignment of IDs to real records, specialist-decision modification, application workflow changes, cloud implementation, Pack signing, or commercial free-form synthesis.

## Unresolved decisions preserved

This ADR does not resolve review quorum or self-review, question-mapping approval, Pack eligibility for secondary-only or disputed evidence, reviewer identity/comment publication, hash/canonicalization profiles, figure digitization, source-rights policy, translation governance, real migration mapping/cutover, cloud governance, Pack cryptography, or commercial offline/synthesis policy.

## Acceptance evidence

Implementation of this ADR requires synthetic tests proving independent state dimensions, valid and invalid transitions, opaque typed IDs, immutable monotonic revisions, no approval transfer, correction/source-version/file rules, legacy alias preservation, read-only Q02/Q03 compatibility, no automatic merge, and no private-path exposure.
