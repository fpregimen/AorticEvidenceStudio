# ADR-002: Canonical evidence and original-source provenance

- **Status:** Accepted architecture direction; implementation pending
- **Date:** 2026-07-17
- **Decision owners:** Product owner, clinical evidence governance, and architecture governance
- **Supersedes:** Question-owned source review as the target architecture; current Q02/Q03 implementation remains transitional
- **Related:** `AES_MASTER_ARCHITECTURE_REQUIREMENTS.md`, `CANONICAL_EVIDENCE_DATA_MODEL.md`, `EXPERT_VALIDATED_EVIDENCE_STANDARD.md`, `REFERENCE_CHAIN_VERIFICATION_STANDARD.md`, `Q02_Q03_CANONICAL_MIGRATION_DESIGN.md`

## Context

The current AES workflow stores extracted evidence and specialist decisions in question-specific review JSON files. This completed Q02 end to end and supports Q03, but it can duplicate source-level evidence and review work when one source supports multiple questions. It also cannot serve as the permanent model for signed Evidence Packs, immutable revisions, detailed table/figure provenance, and verified citation chains.

AES requires one authoritative evidence identity that can be reviewed once and reused across unlimited questions while preserving exact original-source provenance and every historical review decision.

## Decision

AES will adopt a canonical, source-level evidence model with:

1. one canonical `source` per intellectual work or official document;
2. explicit `source_versions` and hashed restricted `source_files`;
3. one stable `evidence_item` ID per distinct claim, recommendation, numerical result, table-derived result, figure-derived result, or definition;
4. immutable `evidence_revisions` under the stable evidence ID;
5. exact, source-file-bound locations beyond page-only citations;
6. append-only specialist reviews bound to exact revisions;
7. explicit authority classifications separating recommendation, primary evidence, secondary citation, interpretation, and AI synthesis;
8. independently verified reference-chain edges;
9. question-to-evidence links instead of copied question evidence;
10. immutable audit events and explicit superseded, disputed, and retired relationships.

Opaque canonical IDs will not encode vendor, path, title, source type, reviewer, question, or region. Existing `AES-*`, `Q##-*`, and question-prefixed review IDs remain aliases and migration provenance.

## Required provenance boundary

Expert-Validated Evidence must include verified source/version identity, file and supporting-text hashes, exact quotation, printed and PDF pages, and applicable structural anchors such as paragraph, recommendation, table cell, figure panel, or supplement location. A page number alone is insufficient.

Specialist approval must record reviewer identity, specialty/role, date, decision, comments, original-source confirmation, and applicable inspection of full text, table, figure, supplement, and cited primary source.

## Reference-chain decision

Citation chains are explicit graph relationships. Resolution of a citation does not verify its content. Each edge records direct/indirect status, retrieval, identity match, support scope, reviewer, date, mismatch, and inability to retrieve. Transitive verification is prohibited.

## Alternatives considered

### Continue question-specific review records

Rejected as the target architecture because it duplicates evidence and decisions, makes corrections harder to propagate safely, and cannot measure source-level verification consistently. Retained temporarily for compatibility and migration.

### Canonical source records with question-owned claims

Rejected because claim review would still be duplicated and divergent across questions.

### Content-address evidence IDs derived from quotation hashes

Rejected because corrected wording or extraction would change identity and make revision history difficult. Hashes remain integrity and matching signals, not primary IDs.

### Automatically merge identical normalized text

Rejected because identical text can have different versions, locations, populations, contexts, meanings, or review histories. Matching produces candidates only.

### Treat guideline verification as primary-evidence verification

Rejected because it perpetuates uncertain citation chaining and overstates verification depth.

## Consequences

### Positive

- Review once and reuse across unlimited questions.
- Corrections propagate through explicit revision and mapping workflows.
- Evidence Packs can include immutable, traceable, approved revisions.
- Primary-source verification rates and unresolved chains become measurable.
- Q02/Q03 can serve as regression fixtures for migration.
- Vendor-neutral identifiers and boundaries support portability.

### Costs and risks

- More entities, governance, review states, and migration tooling.
- Manual duplicate and conflict resolution is required.
- Source rights may constrain quotations and table/figure artifacts in Packs.
- Current UI, APIs, scripts, and JSON schemas require compatibility adapters before replacement.
- Review and release policies remain product-owner decisions.

## Migration rule

Q02/Q03 migration is non-destructive and fail-closed. Candidate evidence is never merged silently. Existing text, locations, decisions, reviewer metadata, synthesis approval, and Results behavior remain unchanged until manual resolution and dual-read regression acceptance pass. Migration creates no approvals.

## Implementation guardrails

- No application implementation begins from this ADR alone; detailed schemas and security/Pack contracts require approval.
- Published revisions and reviews are immutable.
- Approval does not transfer to a new revision.
- Page-only provenance cannot pass validation.
- Private source files and paths never enter browser or Pack data.
- Secondary-only evidence cannot be labeled primary verified.
- Expert interpretation and AI synthesis remain separate record types.
- Q02 Results regression is a cutover gate.

## Unresolved decisions

- exact opaque-ID standard;
- review quorum and separation of duties;
- Pack treatment of secondary-only or disputed evidence;
- source-rights limits;
- translation governance;
- reviewer identity visibility;
- canonicalization and hash upgrade policy;
- migration cutover granularity and rollback duration.

## Acceptance evidence for implementation

This ADR is implemented only when tests demonstrate canonical reuse across questions, immutable revision and review history, complete provenance validation, non-transitive reference verification, non-destructive Q02/Q03 migration, unchanged Q02 Results behavior, and exclusion of private authoring data from Pack candidates.
