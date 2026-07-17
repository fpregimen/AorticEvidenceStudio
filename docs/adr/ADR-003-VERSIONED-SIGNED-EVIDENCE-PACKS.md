# ADR-003: Versioned signed Evidence Packs

- **Status:** Accepted architecture direction; implementation pending
- **Date:** 2026-07-17
- **Decision owners:** Product, clinical evidence governance, release governance, security/cryptography, commercial application, and architecture governance
- **Related:** `AES_MASTER_ARCHITECTURE_REQUIREMENTS.md`, `ADR-002-CANONICAL-EVIDENCE-AND-PROVENANCE.md`, `ADR-004-PRIVATE-CLOUD-AUTHORING-PORTAL.md`, `EVIDENCE_PACK_SPECIFICATION.md`, `EVIDENCE_PACK_PUBLICATION_AND_RELEASE_PROCESS.md`, `EVIDENCE_PACK_SIGNING_AND_TRUST_MODEL.md`, `EVIDENCE_PACK_DISTRIBUTION_UPDATE_AND_ROLLBACK.md`

## Context

The commercial application must normally search specialist-approved evidence locally without direct access to private authoring data. It needs a portable way to verify exactly which canonical evidence revisions were approved for publication, detect alteration, update safely, operate offline within policy, and roll back or revoke unsafe content.

Authoring database access, Git history, HTTPS delivery, and ordinary object-storage checksums do not independently establish authorized medical evidence publication.

## Decision

AES will publish Evidence Packs as static, immutable, versioned, digitally signed artifacts.

Each Pack will:

1. contain only approved, release-eligible canonical evidence revisions and permitted provenance;
2. pin exact source/evidence/location/translation/reference verification revisions;
3. include a complete manifest, schema/compatibility metadata, release notes, metrics, portable search index, hashes, and detached signature metadata;
4. exclude private PDFs, private paths, unapproved evidence, private comments/audit details, unrestricted copyrighted text, user questions, and generated answers;
5. separate deterministic logical content from variable signing/publication metadata;
6. use algorithm-agile hashes and digital signatures under independently distributed trust roots;
7. be built, validated, release-approved, signed, and published by separated authorities;
8. be downloaded to temporary storage, fully verified, and atomically activated by the commercial app;
9. preserve the previous safe verified Pack for rollback;
10. use signed status/revocation/minimum-safe-version metadata without rewriting Pack bytes.

## Publication authority decision

- Specialist reviewers approve evidence.
- Release editors approve immutable candidates.
- Deterministic builder assembles but does not approve.
- Independent validator checks but does not approve.
- Isolated signing service signs only exact authorized validated hashes.
- Distribution publishes immutable bytes but is not trusted for medical authority.
- AI performs none of these human approval/signing actions.

No portal role has direct signing-key access or the ability to silently modify a published revision.

## Version decision

Packs use an ordered semantic version model:

- major for incompatible schema/trust/profile behavior;
- minor for backward-compatible evidence/coverage additions;
- patch for compatible corrections, retirements, or packaging/index fixes.

Clinical urgency is represented separately from version magnitude. Every Pack and evidence revision remains historical and auditable. Current/recommended status is a separately signed versioned document.

## Trust decision

Trust roots are distributed independently of Packs. Signatures bind manifest/artifact identity, Pack version/profile, release authorization, validation proof, key ID, trust profile, and time. Algorithms and key hierarchy remain configurable through versioned policy with candidate modern defaults and an explicit migration path.

## Update decision

Commercial app will:

1. verify signed current/revocation status;
2. resumably download immutable bytes into temporary storage;
3. verify artifact, manifest, signature, key trust/status, all files, schema, compatibility, and minimum safe version;
4. stage and smoke-test locally;
5. atomically switch active Pack;
6. retain prior safe Pack;
7. keep predecessor active on any failure;
8. never bypass signature/compatibility by user confirmation.

Offline operation is allowed only within an approved signed-status freshness/grace policy and must not overstate currentness.

## Alternatives considered

### Commercial app queries private authoring API

Rejected because it expands the private trust boundary, reduces offline availability, and risks source/reviewer data exposure.

### Unsigned static JSON over HTTPS

Rejected because transport/storage compromise, mirror use, offline copies, and artifact substitution require end-to-end publication verification independent of hosting.

### Git commit/tag signature as Pack signature

Rejected because repository history is an authoring/development mechanism, not a minimized commercial publication contract or isolated release authority.

### Mutable “latest” evidence database export

Rejected because it cannot reconstruct exact historical inputs and permits silent content change.

### Embed private PDFs for original-source verification

Rejected because commercial distribution conflicts with privacy/licensing boundaries and normal app requirements.

### Let release editor directly sign

Rejected because release judgment and cryptographic key custody require separation and independent policy checks.

### Let AI select and publish eligible evidence

Rejected because evidence and release approval require authenticated human action.

## Consequences

### Positive

- Local fast evidence search with no private authoring access.
- Exact provenance and version reconstruction.
- End-to-end integrity independent of hosting vendor.
- Safe failed updates and rollback.
- Explicit corrections, retirement, withdrawal, and compromised-key response.
- Portable static artifacts and replaceable interfaces.
- Measurable Pack coverage and reliability growth.

### Costs and risks

- Key governance, signing isolation, revocation, status freshness, and recovery are operationally complex.
- Offline clients may miss urgent revocations until status refresh or grace expiration.
- Pack segmentation and compatibility can fragment coverage if poorly designed.
- Copyright limits may constrain quotation/search content.
- Deterministic search/index builds require strict tooling and testing.

## Implementation guardrails

- No final algorithm, key service, storage, manifest, or distribution vendor is selected by this ADR.
- No signing key may be created/configured before custody, trust-root, rotation, recovery, and incident policies are approved.
- No Pack may include Pending, Excluded, Needs correction, incomplete, or ineligible evidence as validated content.
- No private PDF/path or publication-unapproved reviewer data may cross the boundary.
- Published bytes are immutable.
- App never activates unverified content.
- Revoked/below-minimum Packs cannot be restored by rollback.
- Current Q02/Q03 data is not a Pack input until canonical migration and separate release approval.

## Unresolved decisions

- Pack profile/segmentation and semantic-version details.
- Exact schema/container/search formats.
- Reviewer and quotation publication projection.
- Release/editor quorum and emergency process.
- Final algorithms, canonicalization, trust hierarchy, custody, and timestamping.
- Update channels, forced update, offline grace, rollback, and minimum-safe-version policy.
- Artifact/status hosting, regional distribution, telemetry, and institutional controls.
- Pack and revocation retention requirements.

## Acceptance evidence

This ADR is implemented only when independent tests demonstrate deterministic logical builds, eligibility/private-field exclusion, exact editor/validator/signer hash binding, cross-platform signature verification, planned rotation and compromise recovery, resumable safe download, atomic activation, failed-update preservation, rollback/revocation/minimum-safe behavior, offline freshness labeling, and complete audit reconstruction—without changing medical evidence or relying on private authoring access.
