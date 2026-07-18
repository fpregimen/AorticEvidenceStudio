# Aortic Evidence Studio Architecture Readiness Review

**Review date:** 2026-07-17  
**Scope:** All Markdown architecture, requirements, workflow, migration, safety, handoff, and ADR documents under `docs/` and `docs/adr/`  
**Purpose:** Final consistency and implementation-readiness review before Phase 1 canonical-model work  
**Status:** Review record; recommendations in this document do not change an approved architecture decision

## 1. Executive conclusion

The target architecture is **ready for Phase 1 with the listed product-owner decisions**. Its major safety boundaries are consistent: private authoring data remains separate from the commercial application; original sources are reviewed manually; evidence is immutable and revisioned; only eligible, released evidence enters a signed Evidence Pack; commercial retrieval is Pack-local by default; live search is separately labeled; and Q02/Q03 remain compatibility and regression cases rather than templates for further question-specific duplication.

Phase 1 must not begin as an implicit migration. It is limited to a new, vendor-neutral canonical TypeScript model, validation, read-only compatibility adapters, duplicate-candidate reporting, and synthetic tests. Existing medical records and application behavior remain authoritative and unchanged.

Five decisions require product-owner approval before Phase 1 implementation choices are frozen:

1. The canonical authority/validation classification vocabulary.
2. Separation and names of source, evidence-revision, review-decision, and publication lifecycle states.
3. The stable opaque identifier format and revision notation.
4. The boundary between a new Evidence Item and a new Evidence Item Revision.
5. Whether a correction/erratum is a Source Version, a related Source, or either under explicit rules.

## 2. Documents reviewed and interpretation rule

This review covered every Markdown file present under `docs/` and `docs/adr/` on the review date. The target architecture is primarily defined by:

- `AES_MASTER_ARCHITECTURE_REQUIREMENTS.md`
- the four Authoring Portal documents
- `CANONICAL_EVIDENCE_DATA_MODEL.md`
- the four Evidence Pack documents
- `EXPERT_VALIDATED_EVIDENCE_STANDARD.md`
- the two Commercial App documents
- `Q02_Q03_CANONICAL_MIGRATION_DESIGN.md`
- `REFERENCE_CHAIN_VERIFICATION_STANDARD.md`
- `IMPLEMENTATION_PHASES_AND_ACCEPTANCE_CRITERIA.md`
- ADR-002 through ADR-005

The remaining documents describe current behavior, earlier requirements, operational workflows, safety constraints, source identity, or project history. They remain important compatibility inputs. The repository does not yet contain a normative documentation index that explicitly distinguishes target architecture from current-state and historical documents. This is itself recorded as issue AR-01; this review does not silently establish a new precedence rule.

## 3. Consistency summary

| Area | Consistency assessment | Readiness effect |
|---|---|---|
| Canonical entity names | Core entities align; several supporting entities and aliases need a single registry | Phase 1 decision needed |
| Identifiers and revisions | Direction is consistent; opaque format and some revision forms remain undecided | Phase 1 decision needed |
| Evidence lifecycle | Lifecycle intent aligns; state vocabularies currently mix separate state machines | Phase 1 decision needed |
| Validation and authority | Safety intent aligns; enumerations and labels differ | Phase 1 decision needed |
| Reviewer/release-editor roles | Separation of duties is consistent; quorum and exact publication handoff remain open | Model can support policy without choosing it |
| Signing boundary | Signer separation is consistent; artifact/signature hashing has a circularity ambiguity | Not a Phase 1 blocker; blocks Pack implementation |
| Pack contents/exclusions | Primary boundary is consistent; interpretation and secondary-only eligibility need policy decisions | Decide before Pack implementation |
| Storage boundaries | Consistent and implementation-ready at the architectural level | No Phase 1 blocker |
| Commercial query behavior | Consistent: verify Pack, filter eligibility, rank locally, distinguish live search | No Phase 1 blocker |
| Bilingual behavior | Original text/translation separation is consistent; translation governance is incomplete | Define types in Phase 1; policy can follow |
| Q02/Q03 migration/rollback | Non-destructive migration and rollback intent is consistent; field mappings need explicit rules | Compatibility-only Phase 1 is ready |

## 4. Issue register

No issue below is resolved merely by its recommended resolution. “Product-owner approval” indicates whether adoption changes product policy or the meaning of evidence; engineering clarifications that preserve approved policy are marked “No.”

### AR-01 — No normative document hierarchy or architecture glossary

- **Documents involved:** all documents; especially `AES_MASTER_ARCHITECTURE_REQUIREMENTS.md`, `PRODUCT_REQUIREMENTS.md`, `PROJECT_HANDOFF_2026-07-15.md`, and ADR-002–ADR-005.
- **Statements:** target-state architecture, current MVP behavior, historical milestones, and accepted ADR directions coexist without an index declaring which documents are normative, current-state, transitional, or historical.
- **Risk:** implementers may treat question-specific or older workflow language as a target requirement, or overlook a newer safety boundary.
- **Recommended resolution:** create a later architecture index with document status, owner, effective date, supersession links, and a controlled glossary. Do not delete historical documents.
- **Product-owner approval required:** No, if it only records existing authority; Yes if it changes precedence.

### AR-02 — Canonical entity vocabulary is duplicated and not fully closed

- **Documents involved:** `CANONICAL_EVIDENCE_DATA_MODEL.md`, `AES_MASTER_ARCHITECTURE_REQUIREMENTS.md`, `EXPERT_VALIDATED_EVIDENCE_STANDARD.md`, and `Q02_Q03_CANONICAL_MIGRATION_DESIGN.md`.
- **Statements:** the central model consistently uses Source, Source Version, Source File, Evidence Item, Evidence Item Revision, Source Location, Review Decision, Reference Chain, Translation, Audit Event, Question Evidence Link, and Pack entities. Some documents introduce identifiers such as `TRN`, `QEL`, and `AUD` without one authoritative entity/identifier registry or complete invariants for each.
- **Risk:** duplicate TypeScript types, incompatible serialized names, and incomplete validation.
- **Recommended resolution:** Phase 1 should create one canonical vocabulary module and entity-to-ID registry; other schemas import or derive from it.
- **Product-owner approval required:** No for consolidation; Yes if an entity is added, removed, or semantically changed.

### AR-03 — Stable identifier format is unresolved

- **Documents involved:** `CANONICAL_EVIDENCE_DATA_MODEL.md`, `Q02_Q03_CANONICAL_MIGRATION_DESIGN.md`, and `IMPLEMENTATION_PHASES_AND_ACCEPTANCE_CRITERIA.md`.
- **Statements:** canonical identifiers are stable and opaque, with examples such as `SRC-*`, `SRV-*`, and `EVI-*`; ULID versus UUIDv7 remains open. Existing `AES-*` IDs are preserved as aliases.
- **Risk:** persisted identifiers could require an avoidable migration, sorting behavior may differ, and unsafe parsing may be implemented inconsistently.
- **Recommended resolution:** choose one opaque format, prefix grammar, case rule, validation rule, and non-reuse policy before Phase 1 fixtures become contractual. Preserve `AES-*` as external aliases, not canonical IDs.
- **Product-owner approval required:** Yes.

### AR-04 — Revision notation is not uniform across entity types

- **Documents involved:** `CANONICAL_EVIDENCE_DATA_MODEL.md`, `Q02_Q03_CANONICAL_MIGRATION_DESIGN.md`, and Evidence Pack documents.
- **Statements:** evidence examples use `EVI@rN`; questions use `Q03@v1`; synthesis examples use forms such as `SYN-Q03-v1-1`; Pack versions use semantic-style release versions. Translation and source metadata revision notation is not fully specified.
- **Risk:** APIs and audit links may compare unlike version concepts or accept ambiguous references.
- **Recommended resolution:** distinguish immutable entity ID, monotonic entity revision, question definition version, and release version as separate branded types. Define formatting per type rather than one generic string.
- **Product-owner approval required:** Yes for public notation; No for branded TypeScript separation.

### AR-05 — Multiple lifecycle vocabularies combine different state machines

- **Documents involved:** `AES_MASTER_ARCHITECTURE_REQUIREMENTS.md`, `EXPERT_VALIDATED_EVIDENCE_STANDARD.md`, `AUTHORING_PORTAL_AUDIT_AND_GOVERNANCE.md`, `EVIDENCE_PACK_PUBLICATION_AND_RELEASE_PROCESS.md`, and `COMMERCIAL_APP_EVIDENCE_QUERY_MODEL.md`.
- **Statements:** the master lifecycle includes Registered, Identity Verified/Mismatch, Extracted, Specialist Review, Correction Required, Excluded, Approved, Pack Eligible, Published, and Superseded. Review decisions include Pending, Approved, Needs correction, Excluded, Disputed, and Retired. Pack distribution additionally uses revoked and withdrawn.
- **Risk:** an item could be called “Approved” simultaneously as a review decision and lifecycle state; “Retired” and “Superseded” may be applied at the wrong level; validation could permit impossible combinations.
- **Recommended resolution:** define separate enums and transition rules for source identity, evidence revision workflow, specialist decision, eligibility computation, Pack candidate/release, and Pack distribution status.
- **Product-owner approval required:** Yes.

### AR-06 — Authority and validation classification names conflict

- **Documents involved:** `AES_MASTER_ARCHITECTURE_REQUIREMENTS.md`, `EXPERT_VALIDATED_EVIDENCE_STANDARD.md`, `REFERENCE_CHAIN_VERIFICATION_STANDARD.md`, and `EVIDENCE_GROUNDED_SYNTHESIS_AND_CITATION_STANDARD.md`.
- **Statements:** the master list includes “guideline recommendation directly verified,” “underlying primary evidence verified,” “secondary citation only,” “primary source not verified,” “citation mismatch,” “expert interpretation,” and “AI synthesis.” The detailed standard uses overlapping but different labels such as `primary_evidence_directly_verified`, `primary_source_not_yet_verified`, `unable_to_verify`, and `conflicting_interpretation`.
- **Risk:** medical authority may be overstated, filters may disagree, and UI labels may imply verification that did not occur.
- **Recommended resolution:** approve one machine-readable authority enum, separately model verification result and content type, and maintain explicit bilingual display labels.
- **Product-owner approval required:** Yes, with clinical governance review.

### AR-07 — “Specialist validated” and “Expert-Validated Evidence” are not explicitly mapped

- **Documents involved:** `SPECIALIST_VALIDATION_WORKFLOW.md`, `CONTENT_REVIEW_WORKFLOW.md`, `EXPERT_VALIDATED_EVIDENCE_STANDARD.md`, commercial documents, and Q02/Q03 migration documents.
- **Statements:** current UI and legacy records use specialist-validation terminology, while the target commercial label is Expert-Validated Evidence. Synthesis-level approval and source-item approval are also distinct.
- **Risk:** users may infer that a synthesis approval validates every source item or that legacy approval alone satisfies Pack eligibility.
- **Recommended resolution:** define the exact scope of each label and a legacy-to-canonical display mapping. Never infer item-level Pack eligibility from synthesis approval.
- **Product-owner approval required:** Yes.

### AR-08 — Evidence Item versus Evidence Item Revision boundary is incomplete

- **Documents involved:** `CANONICAL_EVIDENCE_DATA_MODEL.md`, `EXPERT_VALIDATED_EVIDENCE_STANDARD.md`, and `Q02_Q03_CANONICAL_MIGRATION_DESIGN.md`.
- **Statements:** a materially different proposition should become a new Evidence Item, while wording/location corrections should create a revision; “materially different” is not operationally defined.
- **Risk:** contradictory claims may be overwritten as revisions, or harmless corrections may fragment reuse and audit history.
- **Recommended resolution:** approve decision rules and examples covering changed population, intervention, comparator, outcome, time point, effect estimate, polarity, and source location.
- **Product-owner approval required:** Yes, with clinical governance review.

### AR-09 — Correction and erratum modeling is unresolved

- **Documents involved:** `CANONICAL_EVIDENCE_DATA_MODEL.md`, `SOURCE_IDENTITY_VALIDATION.md`, `REFERENCE_CHAIN_VERIFICATION_STANDARD.md`, and Pack specifications.
- **Statements:** source versions model editions and publication versions, while a correction may be treated as a new Source Version or as a related correction document; no governing rule is selected.
- **Risk:** corrected evidence may remain linked to the wrong source state, and Pack freshness or revocation decisions may be incomplete.
- **Recommended resolution:** define correction, erratum, retraction, expression-of-concern, supplement, and new-edition relationships and their effect on evidence eligibility.
- **Product-owner approval required:** Yes.

### AR-10 — Target source-location requirements are stricter than legacy approval validation

- **Documents involved:** `EXPERT_VALIDATED_EVIDENCE_STANDARD.md`, `CANONICAL_EVIDENCE_DATA_MODEL.md`, `CONTENT_REVIEW_WORKFLOW.md`, `SPECIALIST_VALIDATION_WORKFLOW.md`, and `Q02_Q03_CANONICAL_MIGRATION_DESIGN.md`.
- **Statements:** the target standard says page-only provenance is insufficient and requires an anchor; valid legacy records may satisfy current validation with page plus section/table/figure or a location note under older schemas.
- **Risk:** compatibility code could invalidate an explicit historical specialist decision, or it could incorrectly claim canonical provenance completeness.
- **Recommended resolution:** read legacy decisions unchanged, compute a separate canonical-provenance completeness result, and report gaps without modifying approval state or content.
- **Product-owner approval required:** Yes for user-visible status; No for preserving historical decisions.

### AR-11 — Legacy decision precedence needs a normative compatibility rule

- **Documents involved:** `Q02_Q03_CANONICAL_MIGRATION_DESIGN.md`, `CONTENT_REVIEW_WORKFLOW.md`, and current review-workflow documentation.
- **Statements:** newer records may carry authoritative `specialist_validation` decision maps while older valid records may contain embedded decisions. The migration design preserves both, but no architecture-wide normative precedence statement exists.
- **Risk:** UI, CLI, migration, and duplicate reporting could count different decisions.
- **Recommended resolution:** codify current authoritative precedence in the compatibility reader, expose which representation supplied the result, and test Q02/Q03 parity.
- **Product-owner approval required:** No if it exactly preserves current behavior.

### AR-12 — `suitable_for_generated_answer` and canonical Pack eligibility are different concepts

- **Documents involved:** `SAFETY_RULES.md`, current review workflow documents, `CANONICAL_EVIDENCE_DATA_MODEL.md`, and commercial query documents.
- **Statements:** legacy safety rules gate `suitable_for_generated_answer` through synthesis approval. Target architecture computes Pack eligibility from source-level evidence, authority, review, provenance, and release policy.
- **Risk:** a legacy Boolean could be treated as proof of canonical eligibility, or changing it could alter approved medical workflow.
- **Recommended resolution:** preserve the legacy field only in compatibility output; never map it directly to Pack eligibility. Define canonical eligibility as a separate derived result with reasons.
- **Product-owner approval required:** No for separation; Yes before deprecating the legacy field.

### AR-13 — Approved synthesis may coexist with unresolved Evidence

- **Documents involved:** current synthesis validation/workflow documents, Q02 migration design, `EXPERT_VALIDATED_EVIDENCE_STANDARD.md`, and Pack documents.
- **Statements:** current Q02 behavior can preserve an approved synthesis with unresolved Evidence warnings. Target Packs contain only evidence that independently meets publication eligibility.
- **Risk:** migration could incorrectly publish every source referenced by an approved synthesis or describe the synthesis as fully evidence-validated.
- **Recommended resolution:** treat synthesis approval as a separate historical decision; compute source-item Pack eligibility independently and preserve unresolved-warning provenance.
- **Product-owner approval required:** No; this follows existing safety boundaries.

### AR-14 — Question-specific paraphrase versus canonical evidence proposition is unresolved

- **Documents involved:** `Q02_Q03_CANONICAL_MIGRATION_DESIGN.md`, `CANONICAL_EVIDENCE_DATA_MODEL.md`, and synthesis/citation standards.
- **Statements:** legacy question-specific claims may be paraphrases tailored to Q02/Q03, whereas canonical evidence items should be reusable source-supported propositions. The migration design does not select whether all paraphrases become canonical evidence revisions, Question Evidence Link annotations, or expert interpretations.
- **Risk:** migration could mislabel interpretation as exact evidence, duplicate claims, or lose question context.
- **Recommended resolution:** defer real migration; in Phase 1 preserve raw legacy text and classify candidate mappings without writing. Approve a mapping policy before any migration.
- **Product-owner approval required:** Yes before real migration; not required to start read-only Phase 1.

### AR-15 — Pack manifest, artifact hash, and included signature can form a circular dependency

- **Documents involved:** `EVIDENCE_PACK_SPECIFICATION.md`, `EVIDENCE_PACK_SIGNING_AND_TRUST_MODEL.md`, and `EVIDENCE_PACK_PUBLICATION_AND_RELEASE_PROCESS.md`.
- **Statements:** the Pack layout includes a signature file; the manifest enumerates files and hashes; the artifact hash is signed; signing occurs after the builder emits the candidate.
- **Risk:** it is impossible to hash a final archive that contains a signature over that same final hash without an explicitly layered construction.
- **Recommended resolution:** specify an unsigned canonical payload and manifest hash, a detached signature envelope over that hash, and a separately computed distribution-envelope hash, or another non-circular standard construction.
- **Product-owner approval required:** No for cryptographic correctness; security review required before Pack implementation.

### AR-16 — Mutable Pack status is described both inside and outside an immutable Pack

- **Documents involved:** `EVIDENCE_PACK_SPECIFICATION.md`, `EVIDENCE_PACK_DISTRIBUTION_UPDATE_AND_ROLLBACK.md`, and `EVIDENCE_PACK_SIGNING_AND_TRUST_MODEL.md`.
- **Statements:** manifest examples/requirements include published, superseded, revoked, or withdrawn status, while current status is also an external signed status document and signed Packs are immutable.
- **Risk:** consumers may trust stale embedded status or expect an immutable manifest to change after revocation.
- **Recommended resolution:** embed only publication state at release; treat current availability, supersession, revocation, and withdrawal as signed external status assertions linked to the immutable Pack ID and hash.
- **Product-owner approval required:** No; security and release governance approval required.

### AR-17 — Pack inclusion of expert interpretation or AI synthesis is ambiguous

- **Documents involved:** `AES_MASTER_ARCHITECTURE_REQUIREMENTS.md`, `EVIDENCE_PACK_SPECIFICATION.md`, `EVIDENCE_GROUNDED_SYNTHESIS_AND_CITATION_STANDARD.md`, and commercial app documents.
- **Statements:** Packs contain only approved, published evidence; expert interpretation and AI synthesis are separate authority classes. Pack exclusions sometimes specify “unapproved AI synthesis,” which could imply approved AI synthesis is permitted.
- **Risk:** generated or interpretive content could be presented as published evidence or silently become searchable under the validated label.
- **Recommended resolution:** explicitly define whether interpretations/syntheses are excluded, placed in a distinct signed artifact class, or published in a separately labeled profile with different retrieval rules.
- **Product-owner approval required:** Yes before Pack implementation and commercial release.

### AR-18 — Secondary-only and disputed evidence Pack eligibility is unresolved

- **Documents involved:** `EXPERT_VALIDATED_EVIDENCE_STANDARD.md`, `REFERENCE_CHAIN_VERIFICATION_STANDARD.md`, and Pack documents.
- **Statements:** Pack candidates generally exclude disputed/unverified evidence, but secondary-citation-only evidence may be eligible “if policy permits”; the policy is not defined.
- **Risk:** evidence with an incomplete reference chain may receive the same commercial treatment as directly verified primary evidence.
- **Recommended resolution:** define Pack profiles or explicit exclusion rules and mandatory display labels for secondary-only, unable-to-verify, disputed, and citation-mismatch states.
- **Product-owner approval required:** Yes before Pack publication.

### AR-19 — Release editor and signer/publisher handoff is not completely explicit

- **Documents involved:** `AUTHORING_PORTAL_AUDIT_AND_GOVERNANCE.md`, `EXPERT_VALIDATED_EVIDENCE_STANDARD.md`, and Evidence Pack release/signing documents.
- **Statements:** separation of duties consistently keeps the signer separate. Some language associates release-editor approval and publication date with the evidence record, while Pack documents give publication to the signing/release service.
- **Risk:** an editor may be granted signing authority unintentionally, or audit records may not identify who authorized versus executed publication.
- **Recommended resolution:** define separate events and actors for candidate approval, signing authorization, cryptographic signing, repository publication, and status publication.
- **Product-owner approval required:** Yes for role policy; No for separate audit event types.

### AR-20 — Reviewer self-approval, quorum, and conflict policy are open

- **Documents involved:** `AUTHORING_PORTAL_AUDIT_AND_GOVERNANCE.md`, `AUTHORING_PORTAL_PRODUCT_REQUIREMENTS.md`, and `EXPERT_VALIDATED_EVIDENCE_STANDARD.md`.
- **Statements:** specialist identity, specialty, and append-only decisions are required; self-review restrictions, number of reviewers, disagreement resolution, and source-type-specific quorum are unresolved.
- **Risk:** production governance may not meet clinical, institutional, or regulatory expectations.
- **Recommended resolution:** Phase 1 schemas must support multiple attributed decisions and policy evaluation without hardcoding one reviewer. Approve quorum and conflict policies before cloud approval workflows.
- **Product-owner approval required:** Yes, but it may be decided during Phase 1 because Phase 1 performs no real approvals.

### AR-21 — Hash and canonicalization profiles are examples rather than a closed specification

- **Documents involved:** `CANONICAL_EVIDENCE_DATA_MODEL.md`, `EXPERT_VALIDATED_EVIDENCE_STANDARD.md`, and Pack documents.
- **Statements:** SHA-256 and profiles such as normalized text and canonical JSON are proposed, but exact Unicode, line-ending, whitespace, number, key-order, and excluded-field rules are not all normative.
- **Risk:** identical evidence may hash differently across implementations, defeating provenance and reproducible Pack builds.
- **Recommended resolution:** define versioned byte-level canonicalization test vectors before production hashes are generated. Phase 1 may define branded hash/profile types and synthetic vectors only.
- **Product-owner approval required:** No; security/engineering review required during Phase 1.

### AR-22 — Publishing source-file hashes may disclose sensitive correlation information

- **Documents involved:** `EXPERT_VALIDATED_EVIDENCE_STANDARD.md`, `EVIDENCE_PACK_SPECIFICATION.md`, and Authoring Portal file-boundary/security documents.
- **Statements:** source-file hashes support provenance; private copyrighted files and private paths must not enter Packs. Whether raw private-file hashes are published is not fully governed.
- **Risk:** a hash can confirm possession or allow correlation with a restricted document even when the file is excluded.
- **Recommended resolution:** complete a rights/security review and define whether Packs receive the raw source-file hash, a provenance-service attestation, or no file hash for restricted sources.
- **Product-owner approval required:** Yes before cloud/Pack publication.

### AR-23 — Deterministic semantic indexes are underspecified

- **Documents involved:** `EVIDENCE_PACK_SPECIFICATION.md`, `LOCAL_EVIDENCE_RETRIEVAL_AND_RANKING.md`, and commercial query documents.
- **Statements:** Pack contents and indexes should be deterministic and reproducible; embedding model artifact, tokenizer, numeric precision, platform behavior, and index-build determinism are not completely specified.
- **Risk:** equivalent builds may produce different Pack hashes or retrieval ranking.
- **Recommended resolution:** version and hash the model/tokenizer/configuration, specify deterministic build constraints, or exclude non-reproducible indexes from the signed canonical payload and rebuild them locally under a verified profile.
- **Product-owner approval required:** Yes for product behavior before Pack/commercial implementation.

### AR-24 — Pack segmentation and dependency policy is open

- **Documents involved:** Pack specification/distribution documents and commercial query documents.
- **Statements:** possible segmentation by domain, jurisdiction, language, and release train is described, but the dependency and precedence model between base, regional, translation, and update Packs is not selected.
- **Risk:** conflicting evidence versions, incomplete bilingual results, or ambiguous rollback.
- **Recommended resolution:** define Pack profile IDs, dependency constraints, precedence, compatible commercial-app versions, and atomic rollback units.
- **Product-owner approval required:** Yes before Pack implementation.

### AR-25 — Commercial offline-expiry behavior is unresolved

- **Documents involved:** `COMMERCIAL_APP_SAFETY_BILINGUAL_AND_REGRESSION_REQUIREMENTS.md`, `EVIDENCE_PACK_DISTRIBUTION_UPDATE_AND_ROLLBACK.md`, and `COMMERCIAL_APP_EVIDENCE_QUERY_MODEL.md`.
- **Statements:** expired or status-unchecked Packs may warn, restrict, or disable after a grace period; the required policy is not selected.
- **Risk:** stale or revoked evidence may remain usable, or the app may become unusable in legitimate offline clinical environments.
- **Recommended resolution:** approve a risk-tiered offline policy with grace periods, last-known status, emergency behavior, and audit/display requirements.
- **Product-owner approval required:** Yes before commercial release.

### AR-26 — Bilingual translation governance is incomplete

- **Documents involved:** `CANONICAL_EVIDENCE_DATA_MODEL.md`, `EXPERT_VALIDATED_EVIDENCE_STANDARD.md`, commercial bilingual requirements, and Authoring Portal role documents.
- **Statements:** translations are separate, versioned, labeled, and never replace original wording. Required reviewer qualifications, translation status, terminology governance, and treatment of source-authored translations are not fully specified.
- **Risk:** a translation may change clinical meaning while appearing equivalent to the verified original.
- **Recommended resolution:** define translation provenance, revision, reviewer role, bilingual decision state, terminology set version, and fallback/display rules.
- **Product-owner approval required:** Yes before commercial bilingual release; base entity types can be created in Phase 1.

### AR-27 — Duplicate detection boundaries are not yet operational

- **Documents involved:** `CANONICAL_EVIDENCE_DATA_MODEL.md`, `Q02_Q03_CANONICAL_MIGRATION_DESIGN.md`, and implementation phases.
- **Statements:** exact duplicates, probable duplicates, related nonduplicates, and conflicts must be distinguished; thresholds and reviewer action semantics are not specified.
- **Risk:** automatic merging could alter medical meaning, while overly broad reporting could overwhelm reviewers.
- **Recommended resolution:** Phase 1 must produce read-only candidate categories with explanations and no merge operation. Thresholds remain configurable and are evaluated on synthetic fixtures before real migration.
- **Product-owner approval required:** No for read-only reporting; Yes before any automated or assisted merge changes evidence state.

### AR-28 — Current source IDs are described as canonical in older documents but aliases in the target model

- **Documents involved:** `DATA_SOURCES.md`, `SOURCE_IDENTITY_VALIDATION.md`, `CODEX_SOURCE_REVIEW_WORKFLOW.md`, `CANONICAL_EVIDENCE_DATA_MODEL.md`, and migration design.
- **Statements:** current operational documents treat `AES-*` IDs as registered source IDs; the target model uses opaque canonical IDs and retains `AES-*` as aliases.
- **Risk:** Phase 1 could overwrite or reinterpret filenames, URLs, and review associations.
- **Recommended resolution:** compatibility readers accept current IDs exactly; canonical objects assign no new real IDs in Phase 1; synthetic tests prove alias resolution and path-safety behavior.
- **Product-owner approval required:** No; this is the documented migration direction.

### AR-29 — ADR sequence and decision-status index are incomplete

- **Documents involved:** ADR-002, ADR-003, ADR-004, and ADR-005.
- **Statements:** all four are accepted directions with implementation pending, but there is no ADR-001 in the current set and no ADR index explaining numbering, supersession, owners, or unresolved conditions.
- **Risk:** governance ambiguity rather than direct medical risk; future implementers may infer a missing prerequisite decision.
- **Recommended resolution:** add a later ADR index and record whether ADR-001 is intentionally absent, external, or retired. Do not renumber accepted ADRs.
- **Product-owner approval required:** No.

## 5. Consolidated product-owner decision register

### 5.1 Must decide before Phase 1

| Decision | Related issues | Required output |
|---|---|---|
| Canonical authority and validation taxonomy | AR-06, AR-07 | One enum model, meanings, bilingual labels, and mapping from legacy terms |
| Separate lifecycle state machines | AR-05 | Named enums, owning entity, valid transitions, and forbidden combinations |
| Stable identifier and revision policy | AR-03, AR-04 | Opaque format, prefixes, case, revision/version notation, alias rules |
| Evidence Item versus revision boundary | AR-08 | Clinically reviewed decision rules and examples |
| Source correction/erratum/version relationship | AR-09 | Relationship types and eligibility consequences |

These decisions are necessary because Phase 1 creates types and validators that would otherwise encode accidental policy.

### 5.2 Can decide during Phase 1

| Decision | Related issues | Phase 1 constraint |
|---|---|---|
| Legacy provenance completeness display | AR-10 | Never alter or invalidate the stored specialist decision |
| Formal legacy decision precedence record | AR-11 | Must match current authoritative Q02/Q03 behavior |
| Hash/canonicalization profile | AR-21 | Synthetic test vectors only; no production hashes |
| Reviewer multiplicity representation | AR-20 | Support multiple decisions; do not choose quorum automatically |
| Duplicate-candidate categories and thresholds | AR-27 | Read-only, explained, and no merge capability |
| Translation entity/revision fields | AR-26 | Preserve original-language authority and explicit translation label |
| Architecture index and glossary structure | AR-01, AR-02, AR-29 | Documentation follow-up; no precedence changes without approval |

### 5.3 Can safely defer until cloud implementation

| Decision | Related issues |
|---|---|
| Reviewer self-approval, quorum, disagreement, and institutional conflict policy | AR-20 |
| Release-editor, signing authorization, signer, publisher, and status-publisher permissions | AR-19 |
| Audit immutability mechanism and retention implementation | Authoring audit/security documents |
| Restricted-source hash publication policy | AR-22 |
| Cloud storage products, regions, key custody provider, and identity provider | Authoring security/file-boundary documents |
| Real legacy migration mapping and Q02/Q03 paraphrase classification | AR-14 |

### 5.4 Can safely defer until commercial release

| Decision | Related issues |
|---|---|
| Interpretation/AI artifact inclusion policy | AR-17 |
| Secondary-only and disputed evidence Pack eligibility | AR-18 |
| Pack segmentation, dependencies, and update precedence | AR-24 |
| Offline expiry/revocation behavior | AR-25 |
| Bilingual translation approval and terminology governance | AR-26 |
| Deterministic semantic index implementation | AR-23 |
| Final Pack signature/hash envelope construction | AR-15, AR-16 |

Items in this last group must be decided before their respective Pack or commercial implementation begins; “defer” does not authorize an implementation default.

## 6. Exact Phase 1 implementation boundary

### 6.1 In scope

Phase 1 is limited to:

1. Vendor-neutral canonical TypeScript interfaces, discriminated unions, and branded primitive types.
2. Stable canonical identifier, alias, revision, question-version, and release-version types following the approved pre-Phase-1 decisions.
3. Pure validation rules and structured validation errors for canonical synthetic objects.
4. A read-only compatibility reader for existing Q02/Q03 review and synthesis records.
5. Explicit compatibility diagnostics for legacy provenance or metadata gaps without changing decisions.
6. A read-only duplicate-candidate reporter that classifies and explains candidates but cannot merge, rewrite, approve, exclude, or retire evidence.
7. Synthetic fixtures and focused tests for model invariants, validation, compatibility, and duplicate reporting.
8. Documentation of the resulting schema version and validation contract.

### 6.2 Explicitly out of scope

Phase 1 includes none of the following:

- Real evidence migration or creation of canonical records from Q02/Q03.
- Any modification to a claim, numerical outcome, supporting text, source location, decision, reviewer, date, confirmation, synthesis, or Results content.
- Assignment of new canonical IDs to real records.
- Deduplication, merging, supersession, retirement, approval, or suitability changes.
- Cloud services, authentication, authorization, database selection, object storage, queues, or deployment.
- Pack building, signing, publishing, distribution, update, revocation, or rollback implementation.
- Changes to the native radio-button synthesis approval interface.
- Commercial free-form synthesis, live search, ranking changes, or Results redesign.
- Private PDF reading from application code, browser exposure, copying, hashing, or migration.
- Restoration, inspection, or modification of stash contents.

### 6.3 Files likely to be created

Exact paths should be confirmed against repository conventions before implementation. A small, isolated layout is expected:

- `lib/canonical-evidence/types.ts`
- `lib/canonical-evidence/identifiers.ts`
- `lib/canonical-evidence/vocabularies.ts`
- `lib/canonical-evidence/validation.ts`
- `lib/canonical-evidence/legacy-adapter.ts`
- `lib/canonical-evidence/duplicate-candidates.ts`
- `lib/canonical-evidence/index.ts`
- `scripts/validate-canonical-evidence.ts`
- `scripts/report-canonical-duplicate-candidates.ts`
- focused synthetic test scripts and fixtures under the repository’s established script/fixture conventions

If JSON Schema artifacts are required, they should be generated or maintained from one authoritative model rather than creating a second, divergent vocabulary. No existing schema is replaced in Phase 1.

### 6.4 Current components to reuse

Reuse means reading behavior or importing stable pure helpers where safe; it does not authorize modifying these modules.

- Current question registry and question-ID validation.
- Source catalog parsing and registered source-ID validation.
- Safe question/source filename resolution and traversal rejection.
- Current review model types and authoritative decision aggregation.
- Existing approval-completeness and valid-date logic as compatibility behavior.
- Existing review and synthesis validators for regression comparison.
- Existing Q02/Q03 source-review and synthesis loaders in read-only mode.

### 6.5 Components and data that must remain untouched

- All files in `database/content_reviews/`.
- All synthesis drafts and saved synthesis decisions.
- `database/source_catalog.csv` and current question definitions.
- Existing medical evidence, extracted claims, numerical outcomes, citations, and locations.
- Specialist decisions, reviewer metadata, and original-source confirmations.
- All application routes, APIs, Results pages, review interfaces, and synthesis components.
- Existing production schemas and validation behavior.
- `source_documents/private/`, all PDFs, and all browser privacy boundaries.
- All stash contents and Git history.

### 6.6 Safety gates

1. New compatibility and duplicate APIs are pure/read-only and accept no arbitrary filesystem path.
2. Question and source inputs are validated against registered values before file resolution.
3. No write, save, migration, merge, approval, finalization, staging, commit, or push capability exists in Phase 1 modules or scripts.
4. Legacy approval remains a reported historical fact; canonical eligibility is separate and reason-coded.
5. No field automatically becomes `verified_by_reviewer`, `suitable_for_generated_answer`, Approved, Pack Eligible, or Published.
6. Exact supporting text and source location are never fabricated, normalized into different medical wording, or filled from another question.
7. Private paths, PDF contents, and restricted source files never appear in browser or report output.
8. Duplicate detection never implies equivalence, causality, conflict resolution, or permission to merge.
9. Original English/Japanese text remains immutable; translations are distinct labeled objects.
10. Existing Q02/Q03 validation outputs and application behavior remain unchanged.

### 6.7 Test requirements

Synthetic tests must cover:

- Valid and invalid canonical IDs, aliases, revisions, question versions, and release versions.
- Unknown IDs, malformed prefixes, path traversal, control characters, and cross-question/source confusion.
- Every controlled vocabulary value and invalid combinations across separate state machines.
- Required provenance, exact-text, location-anchor, reviewer, date, decision, and confirmation rules.
- Multiple review decisions and incomplete approval metadata without assuming a final quorum policy.
- Legacy `specialist_validation` map precedence and older embedded decision compatibility.
- Q02 and Q03 read parity with current authoritative aggregation.
- Approved legacy records that have canonical provenance gaps: decision preserved, gap reported.
- Separation of `suitable_for_generated_answer` from canonical Pack eligibility.
- Exact duplicate, probable duplicate, related nonduplicate, conflict, and unique synthetic cases.
- Claims and numerical outcomes, including thresholds that must not be treated as clinical outcomes.
- No automatic merge or state mutation from duplicate reporting.
- Bilingual original text and translation separation.
- No private PDF path or repository absolute path in serialized output.
- Before/after fixture hashes proving compatibility reads do not modify files.
- Existing validation, lint, and build regression checks.

Real medical text should not be copied into new test fixtures when a synthetic, clearly nonclinical fixture can prove the same invariant.

### 6.8 Rollback approach

Phase 1 must be additive and unreferenced by production routes by default. Rollback consists of removing or disabling only the newly introduced canonical modules, scripts, package-script entries, and synthetic fixtures. Because no real record is migrated and no runtime authority is transferred, rollback requires no evidence reversal, decision repair, schema downgrade, Pack revocation, or UI change. Existing Q02/Q03 readers and validators remain the source of truth throughout Phase 1.

### 6.9 Completion criteria

Phase 1 is complete only when:

1. All five pre-Phase-1 product decisions are recorded and reflected consistently in types and validators.
2. One canonical vocabulary and identifier registry drives all new Phase 1 code.
3. Validation produces structured, deterministic, reason-coded results.
4. Existing Q02/Q03 records can be read without mutation and with counts/status matching current authoritative behavior.
5. Canonical gaps are reported separately from legacy specialist decisions.
6. Duplicate candidates are reported read-only with explanation and no merge path.
7. All fixtures are synthetic and all focused tests pass.
8. Existing source/review validation, lint, and build checks pass unchanged.
9. A repository diff confirms no application, medical evidence, review, synthesis, Results, PDF, or stash change.
10. No Phase 2 cloud, Pack, or commercial behavior has been introduced.

## 7. Q02/Q03 migration and rollback readiness

Q02 and Q03 are suitable compatibility and regression inputs, but not migration inputs during Phase 1. The migration design consistently favors immutable source-level evidence, Question Evidence Links, and non-destructive rollback. The following constraints are mandatory:

- Existing IDs and filenames remain resolvable as aliases/current operational identifiers.
- Existing specialist decisions remain attached to the exact legacy content reviewed.
- A question-specific approval is never copied to a canonical item or another question.
- Synthesis approval is never converted into source-item approval or Pack eligibility.
- Compatibility output identifies whether a decision came from the authoritative decision map or a valid legacy embedded field.
- No canonical gap report changes the original decision.
- Rollback is selection of the existing reader, not reverse migration.

Real migration remains blocked by AR-08, AR-09, AR-10, and AR-14 policy decisions and is outside Phase 1.

## 8. Dependencies after Phase 1

The architecture documents identify the correct broad sequence, but implementation should not advance until the corresponding dependencies are closed:

1. **Before cloud authoring:** role/quorum policy, identity provider and regional policy, audit immutability, source-file rights/hash policy, and migration rules.
2. **Before Pack implementation:** authority eligibility, secondary/disputed policy, signature/hash envelope, immutable status model, segmentation/dependencies, deterministic build rules, and release handoff.
3. **Before commercial release:** offline status policy, bilingual governance, Pack compatibility/rollback UX, interpretation/AI artifact policy, specialist-use warnings, and regression acceptance.

## 9. Final readiness determination

**Determination: Ready for Phase 1 with listed product-owner decisions.**

There is no architectural reason to block additive, read-only canonical modeling once the five pre-Phase-1 decisions are approved. Phase 1 must retain the narrow boundary in Section 6. Pack cryptography, cloud governance, real evidence migration, and commercial synthesis are not ready for implementation and are intentionally deferred behind their issue-register decisions.

This review does not approve a medical claim, alter an evidence authority classification, settle a product-owner decision, or authorize migration.
