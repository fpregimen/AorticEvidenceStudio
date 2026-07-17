# ADR-004: Private cloud Evidence Authoring Portal

- **Status:** Accepted architecture direction; implementation pending
- **Date:** 2026-07-17
- **Decision owners:** Product, clinical evidence governance, security/privacy, source licensing, and architecture governance
- **Related:** `AES_MASTER_ARCHITECTURE_REQUIREMENTS.md`, `ADR-002-CANONICAL-EVIDENCE-AND-PROVENANCE.md`, `AUTHORING_PORTAL_PRODUCT_REQUIREMENTS.md`, `AUTHORING_PORTAL_SECURITY_AND_ACCESS_ARCHITECTURE.md`, `AUTHORING_PORTAL_AUDIT_AND_GOVERNANCE.md`, `AUTHORING_PORTAL_DATA_AND_FILE_BOUNDARIES.md`

## Context

Current AES evidence work relies on local repository files, Terminal commands, Git history, and question-specific review interfaces. These workflows established medical-safety controls and working Q02/Q03 review behavior but are not the target for distributed daily authoring across the United States, Japan, and other approved locations.

AES needs a private browser-based portal that preserves original-source review, canonical source-level reuse, specialist approval, immutable revisions, citation-chain verification, governance, and Pack-release boundaries without exposing private PDFs to the commercial application.

## Decision

AES will implement a private cloud Evidence Authoring Portal with these architectural boundaries:

1. Authorized browser access with mandatory MFA, server-side authorization, and policy-controlled US/Japan/other-location access.
2. Canonical evidence and review services separate from restricted source-file storage.
3. Browser-mediated PDF viewing with no private path, object credential, or unrestricted file URL exposure.
4. AI-assisted extraction as a Pending draft workflow with no approval, approval-transfer, release, or publication authority.
5. Explicit per-item specialist review against an immutable source/evidence revision; no Approve All function.
6. Append-only specialist decisions, reference verifications, administrative events, and audit history.
7. Correction through successor evidence revisions; published revisions cannot be modified silently.
8. Separate release-editor approval and Evidence Pack publication/signing boundaries.
9. Daily source registration, upload, extraction, review, correction, reference verification, release preparation, audit, and revocation workflows available without Terminal or Git.
10. Vendor-neutral service contracts, identifiers, schemas, data exports, and security requirements.

## Remote-access decision

Portal access is global only within approved policy. Authentication, role, institution, source rights, device/session assurance, geographic risk, and resource sensitivity are evaluated together. Country geolocation alone neither grants nor proves authorization.

Static application delivery may be globally optimized. Private data residency, replication, cross-border access, and backup location remain explicit product/legal decisions. Source licensing may impose narrower access than portal membership.

## Roles and separation of duties

- Administrators manage identity/policy but cannot approve evidence or sign Packs.
- Source curators register/upload/extract but do not approve evidence.
- Specialist reviewers make explicit medical evidence decisions on assigned revisions.
- Release editors prepare and approve immutable candidates but cannot edit evidence or sign Packs.
- Auditors read and verify history but cannot modify it.
- Commercial users consume published Packs and have no portal/PDF access by default.
- AI/service identities have no human decision authority.

Pack signing and final publication use a separately controlled system and keys unavailable to portal runtime.

## Data-boundary decision

Private PDFs and derived source artifacts remain in restricted storage. Canonical metadata references opaque file IDs and hashes, never private paths. Release candidates are allowlisted projections containing only eligible approved evidence and permitted provenance. Published Pack artifacts are immutable and do not contain private source files, authoring credentials, or reviewer-only comments.

## Alternatives considered

### Continue local repository authoring indefinitely

Rejected as the target because it requires specialized Terminal/Git access, limits global reviewer usability, and does not provide the required identity, device, audit, rights, and publication boundaries. Retained temporarily during migration.

### Give commercial application direct access to authoring services

Rejected because it expands the private trust boundary, risks source-file and reviewer-data exposure, and weakens offline verified-Pack operation.

### Use a shared document/file collaboration platform as the evidence system

Rejected because generic file collaboration does not enforce canonical evidence revisions, item-level specialist decisions, reference-chain states, deterministic Pack eligibility, or medical-safety rules.

### Permit AI approval with human spot checks

Rejected because approval must be explicit specialist action on each evidence revision.

### Store source PDFs in browser-accessible object URLs

Rejected because persistent URLs and storage credentials weaken rights, authorization, revocation, and privacy controls.

### Put Pack signing keys in portal secrets management

Rejected because release preparation and cryptographic publication authority require separation.

## Consequences

### Positive

- Browser-based daily work across approved locations.
- Strong user, reviewer, device, and institutional accountability.
- Original-source comparison and fine-grained provenance in one workflow.
- Durable separation of authoring, medical approval, release approval, and publication.
- Safer management of restricted PDFs and reviewer identities.
- Auditable correction and revocation without rewriting history.
- Lower dependence on a single infrastructure vendor.

### Costs and risks

- Identity, source rights, international access, audit, backup, incident, and governance operations are substantial.
- International latency and source-license differences require careful testing and policy.
- Browser PDF controls deter but cannot fully prevent an authorized user from capturing displayed content.
- Compatibility with current Q02/Q03 repository workflows requires a later migration and regression plan.
- Product-owner decisions on residency, reviewers, rights, and release governance block production implementation.

## Implementation guardrails

- No cloud account or vendor is selected by this ADR.
- No application implementation begins before unresolved security, residency, source-rights, review, and Pack-boundary decisions are approved.
- Server authorization is authoritative; UI hiding is insufficient.
- No user or service can edit a published evidence revision.
- No AI operation can approve evidence, transfer approval, or publish a Pack.
- Bulk reviewer/date entry cannot set decisions or original-source confirmation.
- No Approve All path exists in UI or API.
- Portal cannot access signing private keys.
- Private PDFs, paths, credentials, and restricted comments cannot cross the release boundary.
- Existing medical evidence and decisions are preserved during transition.

## Vendor-neutral implementation categories

The implementation may use managed web hosting, a managed relational database, private object storage, a standards-based identity provider, durable background jobs, secrets management, and monitoring/audit services. Selection must be based on required security, residency, portability, and operational capabilities rather than proprietary domain identifiers or irreversible data formats.

The recommended default is managed, standards-based infrastructure with exportable data, portable service contracts, and adapter boundaries. Exact vendor, region topology, scaling, archive tier, workflow engine, SIEM, and advanced search choices can be deferred.

## Unresolved decisions

- Authorized countries, residency, cross-border access, and travel exceptions.
- Identity federation, managed-device, MFA, session, and recovery policy.
- Reviewer eligibility, quorum, self-review, and adjudication.
- Institutional versus global access to licensed sources.
- PDF download/print/clipboard and retention rights.
- AI model/service data-processing restrictions.
- Reviewer identity and comment visibility.
- Audit retention, RPO/RTO, incident notification, and legal hold.
- Release-editor separation and publication/signing governance.
- Final vendor/category selection and cost envelope.

## Acceptance evidence

This ADR is implemented only when representative US and Japan users can complete browser-only authoring and review; role and resource isolation, MFA, revocation, source rights, immutable reviews/revisions, audit integrity, disaster restore, international latency, interrupted uploads, release-candidate allowlisting, and signing-key separation pass approved tests; and no current medical data is altered by migration without separate authorization.
