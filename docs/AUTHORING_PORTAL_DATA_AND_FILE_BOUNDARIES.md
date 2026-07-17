# Evidence Authoring Portal data and file boundaries

## Purpose

This document defines where Authoring Portal data may exist, who may access it, what may cross service and publication boundaries, and whether it may be deleted, archived, superseded, or must remain immutable.

It is a logical, vendor-neutral classification. Physical regions, services, retention periods, and vendors remain product-owner decisions.

## Boundary principles

1. Private source files are not canonical evidence and are never commercial Pack content by default.
2. Browser access is mediated; browsers never receive private storage paths or credentials.
3. Approved evidence is not mutable; correction creates a successor revision.
4. Audit and specialist-review events are append-only.
5. Release candidates contain an allowlisted projection, not an authoring database export.
6. Published Packs are immutable artifacts; revocation and supersession are additive.
7. Deletion never breaks required provenance, legal hold, or historical Pack reconstruction.
8. Data residency and source-license scope are enforced by data class and resource, not only by user role.

## Data classification

- **Restricted source content:** Private PDFs, supplements, page images, OCR, table/figure crops, and licensed full text.
- **Restricted identity/governance:** Reviewer identities, qualifications, conflicts, account/device data, and security events.
- **Confidential authoring:** Evidence drafts, comments, corrections, unresolved chains, extraction prompts/outputs, and release candidates.
- **Approved publication data:** Allowlisted approved evidence revisions and permitted provenance prepared for Packs.
- **Published artifacts:** Signed Pack, manifest, signature metadata, public/releasable metrics, supersession/revocation notices.
- **Operational sensitive data:** Credentials, secrets, keys, network/configuration details, and detailed monitoring.

No patient data belongs in any class.

## Logical stores

### Canonical metadata store

Contains sources, versions, evidence items/revisions, locations, structured outcomes, translations, question links, syntheses, and lifecycle relationships. It contains source-file IDs and hashes but not private paths or file bytes.

### Restricted source object store

Contains private PDFs and protected derived artifacts. Access is only through authorized services. Object keys are opaque and never used as public identifiers.

### Draft/extraction workspace

Contains temporary upload parts, OCR, extraction output, thumbnails, page tiles, job state, and user drafts. It is encrypted, isolated by source/version, retention-bounded, and never authoritative for approval.

### Identity and policy store

Contains user mappings, institution, roles, specialty eligibility, authenticators/device references, geographic policy, assignments, and recovery state. Authentication secrets remain with the identity/secrets systems rather than evidence records.

### Append-only audit store

Contains security, evidence, review, correction, access, and release events plus integrity checkpoints. It is separated from ordinary transactional administration.

### Release-candidate store

Contains immutable candidate manifests, allowlisted artifacts, validation reports, quality metrics, editor decisions, and handoff results. It contains no PDFs, private paths, credentials, or unrestricted comments.

### Published Pack store

Contains signed immutable Pack artifacts, manifests, signatures, compatibility metadata, metrics, and revocation/supersession notices.

### Backup/archive boundary

Contains encrypted, versioned backups and archives under class-specific retention, residency, rights, and legal-hold policy. Restore access is exceptional and audited.

## Data-class boundary matrix

| Data | Authoritative boundary | Browser exposure | Release-candidate eligibility | Commercial Pack eligibility | Lifecycle rule |
|---|---|---|---|---|---|
| Source metadata | Canonical metadata | Authorized fields | Allowlisted | Permitted citation/version fields | Correct by audited metadata revision; archive source, do not erase used identity |
| Private PDFs | Restricted object store | Mediated rendered/streamed access only | Never | Never by default | Delete only when rights/retention permit and provenance remains; legal hold overrides |
| Extracted text/OCR | Draft/artifact store; authoritative quotation in evidence revision | Authorized author/reviewer | Exact approved quotation only if rights permit | Policy-limited quotation | Temporary artifacts may expire; hashes and reviewed quotation remain |
| Evidence drafts | Canonical draft/workspace | Assigned users | No | No | May be abandoned/archived; deletion only if never governed and policy permits, with audit record |
| Approved evidence | Canonical immutable revision | Authorized users | Yes when eligible | Yes, allowlisted | Immutable; supersede/dispute/retire, never edit/delete |
| Reviewer comments | Review/governance store | Need-to-know | Only publication-approved subset | Usually no | Immutable with review; redact only through governed privacy process preserving audit proof |
| Reviewer identities | Identity/governance plus review snapshot | Policy-scoped | Governance identifier/subset | Product-policy subset | Historical snapshot immutable; account may deactivate, identifiers remain resolvable |
| Reference-chain records | Canonical metadata | Authorized evidence users | Eligible fields | Verification state and links as policy permits | Append verification; supersede/reverify, never overwrite history |
| Audit records | Append-only audit boundary | Auditor/governance views | Integrity/provenance summary only | Selected release provenance only | Immutable for retention period; legal hold; expiration by controlled retention process |
| Release candidates | Candidate boundary | Release editor/auditor | N/A | Not until signed publication | Immutable candidate; reject/archive or hand off; change creates new candidate |
| Published Pack artifacts | Published artifact boundary | Download through commercial channel | N/A | Yes | Immutable; supersede/revoke, never overwrite version |
| Security secrets | Secrets/key boundary | Never | Never | Never | Rotate/revoke/delete according to security lifecycle |
| Signing keys | Separate publication signing boundary | Never | Never | Signature only | Never available to portal; rotate/revoke under separate governance |

## Browser/PDF boundary

- Portal API authorizes every source and page request.
- Viewer receives short-lived, user/session/resource-bound access or proxied page content.
- Responses use restrictive cache policy and content security controls appropriate to browser capabilities.
- Persistent object URLs, bucket names, filesystem paths, credentials, and broad signed URLs are prohibited.
- Authorization is rechecked on page/document change and after session, role, assignment, institution, rights, or device changes.
- Page tiles/thumbnails are derived restricted artifacts and inherit PDF rights.
- Browser deterrents such as disabled download are not treated as complete DRM; contractual, identity, access, and audit controls remain primary.

## Upload boundary

1. Browser obtains an authorized upload session for a registered source/version candidate.
2. Chunks are encrypted in transport and stored in quarantine.
3. Upload session is bound to actor, institution, source candidate, size/type limits, and expiration.
4. Server scans, validates structure, computes hash, and checks duplicate candidates.
5. Only after curator confirmation does a clean object move to restricted source storage.
6. Failed, abandoned, malicious, or mismatched uploads remain quarantined then expire under policy.
7. Resume credentials cannot grant read access to completed PDFs.

## Extraction/AI boundary

- Source content is untrusted input and may contain prompt injection or malicious structures.
- AI/extraction workers receive only the exact authorized source/version and minimal task context.
- Whether restricted files may leave the controlled environment for a model/service is an explicit policy and contractual decision; recommended default is no external retention and no training.
- Outputs remain drafts, record tool/model version and hashes, and cannot invoke human-decision or publication authority.
- Prompts, outputs, and logs inherit source restrictions and have defined retention.
- Worker compromise must not grant access to unrelated sources, reviewer identities, releases, or signing keys.

## Reviewer identity and comments boundary

- Authentication identity and professional profile are distinct but linked.
- Review snapshot stores identity, specialty/role, eligibility, and date needed for historical provenance.
- Commercial display uses a separate allowlisted projection decided by product policy.
- Sensitive conflict, recovery, device, and security fields never enter evidence or Packs.
- Reviewer comments are classified by purpose: publication-safe rationale, internal correction detail, or restricted governance/security note.
- Redaction requests do not rewrite immutable events; use access-restricted successor/redaction records and preserve integrity proof.

## Reference-chain boundary

- Citation text and target identity are canonical records.
- Private target files remain in restricted storage.
- Retrieval attempts must not log credentials or private paths.
- Pack projection may include verification level, support scope, mismatch, and canonical target references without including copyrighted source files.
- Unable-to-retrieve and mismatch history remains auditable even if not displayed fully to commercial users.

## Release-candidate allowlist

Candidate generation starts from an empty schema allowlist. Candidate may include:

- canonical IDs and pinned revisions;
- permitted citation/source-version metadata;
- allowed exact supporting text under rights policy;
- precise non-private location metadata;
- structured approved evidence and limitations;
- permitted reviewer/review provenance subset;
- reference-chain verification states;
- translations approved for publication;
- schema/compatibility/version metadata;
- quality metrics and hashes.

Candidate must reject:

- source file bytes, page images, private paths/object keys, storage URLs, or credentials;
- Pending, correction-required, excluded, disputed, retired, mismatched, or ineligible evidence as answerable content;
- reviewer-only comments or hidden identities outside policy;
- extraction prompts, raw AI output, account/device data, detailed audit/security logs;
- signing keys or portal secrets.

## Lifecycle definitions

### Delete

Physical or logical removal permitted only when no provenance, legal, security, licensing, Pack reconstruction, or retention requirement remains. Examples may include expired incomplete upload chunks and non-governed temporary processing files. Deletion is audited.

### Archive

Move to restricted, lower-access storage while preserving identity, hashes, retention, and restore capability. Suitable for completed source versions, abandoned governed drafts, old candidates, and long-term audit records.

### Supersede

Create a successor and mark prospective preference. Applies to source versions, evidence revisions, translations, reference verification, question links, syntheses, and Pack releases. Does not delete predecessor.

### Retire/revoke

Prevent prospective use because evidence, rights, security, or product policy requires it. Retained for history. Published Pack revocation is additive metadata and distribution policy, not artifact modification.

### Immutable

Content cannot be updated or deleted through normal application operations. Corrections are new records. Applies to approved evidence revisions, specialist reviews, release-editor decisions, published Packs, and governed audit events.

## Detailed retention behavior

- **Source metadata:** Never delete if referenced by evidence, reviews, chains, questions, releases, or audit; correct/version/archive.
- **Private PDFs:** May be deleted after rights expiry or retention requirement if policy permits, but keep source/file identity, hashes, reviewed locations, and deletion event. If ongoing original-source verification requires the file, access must be reacquired lawfully before review.
- **Drafts:** Unsubmitted personal drafts may expire; submitted or reviewed drafts become governed records and are archived/superseded.
- **Approved evidence/reviews:** Immutable indefinitely under evidence provenance policy.
- **Comments:** Retain with governed review/correction; privacy redaction uses restricted overlays, not silent editing.
- **Audit:** Retain for approved period and legal hold; expiration is independently authorized and checkpoint-preserving.
- **Candidates:** Immutable after creation; rejected candidates archive under release-policy retention.
- **Packs:** Retain every published version, signature, manifest, and revocation/supersession record required for reconstruction.

## Data residency and international access

- Authorized access location and physical data residency are separate policies.
- Users in Japan may securely access data stored in an approved region without implying replication into Japan, subject to law, contract, latency, and product decision.
- Source licenses may prohibit cross-border access even when portal policy allows the user.
- Backups, logs, derived artifacts, monitoring, and support access follow the same residency classification as their source data unless formally approved otherwise.
- Region changes or replication are governed migrations with hash and audit reconciliation.

## Backup and restore boundaries

- Backups maintain separation between source files, canonical data, identity/security, audit, candidates, and published Packs.
- Signing private keys are excluded from ordinary portal backups.
- Restore permissions do not imply evidence or role update permission.
- Restored environments are isolated from production identity and publication endpoints until verified.
- Restoration verifies encryption, hashes, references, audit sequence/checkpoints, rights policy, current revocations, and latest immutable decisions.
- Test data must not use real restricted PDFs unless the recovery test is explicitly authorized and controlled.

## Portability requirements

- Domain records export in documented, versioned, vendor-neutral schemas.
- Source objects export with independent hashes and mapping manifests, subject to rights.
- Identity mappings use stable internal IDs and standards-based external subjects.
- Audit exports preserve sequence, checkpoint, actor/resource IDs, policy versions, and integrity verification instructions.
- Release candidates and Packs are independently verifiable outside the authoring vendor.
- Storage object names, database keys, region IDs, and provider resource names never become canonical IDs.
- Migration procedures include completeness counts, hashes, referential checks, access-policy translation, and rollback.

## Data-boundary acceptance criteria

- Browser/API inspection reveals no private paths, object keys, or credentials.
- A user with metadata access but no PDF rights cannot obtain page content or derived tiles.
- AI worker for one source cannot access another source or any approval/publication authority.
- Candidate generation uses an allowlist and fails on unknown fields.
- Private PDFs and reviewer-only comments never appear in a Pack candidate.
- Approved revisions, reviews, candidates, and Packs reject update/delete operations.
- Correction and supersession preserve historical hashes and references.
- Rights expiration can remove file access without erasing evidence provenance.
- Backup restore maintains boundary separation and current revocations.
- Export/import portability checks reproduce counts, hashes, relationships, and audit integrity.

## Unresolved product-owner decisions

1. Physical residency and backup regions for each data class.
2. Source-file retention after evidence approval or license expiration.
3. Exact quotation/table/figure content permitted in Packs.
4. Reviewer identity/comment projection into Packs.
5. Audit and security log retention periods.
6. Whether institutional source files share one object boundary or separate tenancy/keys.
7. AI processing locations, providers, retention, and training restrictions.
8. PDF download/print/clipboard and offline-cache policy.
9. Legal hold and takedown authority.
10. Published Pack retention and commercial revocation-check requirements.
