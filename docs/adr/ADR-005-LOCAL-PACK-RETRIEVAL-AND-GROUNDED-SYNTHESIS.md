# ADR-005: Local Pack retrieval and grounded synthesis

- **Status:** Accepted architecture direction; implementation pending
- **Date:** 2026-07-17
- **Decision owners:** Product, clinical evidence governance, commercial application, safety/regulatory, bilingual UX, security/privacy, and architecture governance
- **Related:** `AES_MASTER_ARCHITECTURE_REQUIREMENTS.md`, `ADR-002-CANONICAL-EVIDENCE-AND-PROVENANCE.md`, `ADR-003-VERSIONED-SIGNED-EVIDENCE-PACKS.md`, `ADR-004-PRIVATE-CLOUD-AUTHORING-PORTAL.md`, `COMMERCIAL_APP_EVIDENCE_QUERY_MODEL.md`, `LOCAL_EVIDENCE_RETRIEVAL_AND_RANKING.md`, `EVIDENCE_GROUNDED_SYNTHESIS_AND_CITATION_STANDARD.md`, `COMMERCIAL_APP_SAFETY_BILINGUAL_AND_REGRESSION_REQUIREMENTS.md`, `IMPLEMENTATION_PHASES_AND_ACCEPTANCE_CRITERIA.md`

## Context

The commercial application needs fast, reliable, bilingual evidence search with exact specialist-validation provenance. Normal answers must not depend on or expose the private Authoring Portal. Free-form synthesis introduces risks of citation invention, authority inflation, numerical alteration, hidden conflict, and filling evidence gaps from model knowledge.

## Decision

The commercial application's normal query path will:

1. analyze question language and intent;
2. retrieve only from the locally active verified Evidence Pack;
3. apply hard publication, authority, applicability, jurisdiction, supersession, retirement, dispute, and rights gates before ranking;
4. rank eligible candidates through versioned vendor-neutral interfaces;
5. assess coverage, conflicts, indirectness, translation ambiguity, and gaps;
6. synthesize only from the selected eligible retrieval set;
7. mechanically bind every factual assertion to exact evidence/source/Pack revisions and provenance;
8. validate numerical, authority, population, phase, jurisdiction, conflict, and safety fidelity;
9. display adaptive bilingual Results with original text, labeled translations, and provenance;
10. keep live evidence search separate and explicitly not individually specialist reviewed.

Only evidence revisions in the active verified Pack may receive the Expert-Validated label.

## Retrieval decision

Eligibility precedes relevance. Semantic similarity or exact terminology cannot override publication state, evidence authority, applicability, jurisdiction, conflict, or retirement. Ranking uses explicit stages and receipts rather than a single opaque “best evidence” score.

The app does not query the private authoring database for normal answers.

## Synthesis decision

Grounded synthesis receives an atomic fact ledger derived from selected Pack evidence plus coverage/conflict/gap diagnostics. It cannot cite outside the retrieval set, alter numbers/thresholds, infer primary verification, turn association into causation, turn eligibility into prediction, turn prognosis into treatment-effect modification, hide disagreement, or fill gaps from unstated model knowledge.

When safe free-form synthesis is unavailable, the app displays structured retrieved evidence and provenance rather than weakening controls.

## Bilingual decision

English/Japanese language switching preserves the evidence set, IDs, numbers, authority, applicability, citations, and medical meaning. Original source text remains unchanged; translations are separately labeled/versioned. Ambiguity is visible.

## Offline and live-search decision

Verified local retrieval continues offline subject to signed Pack-status policy. Server AI unavailability leads to approved on-device synthesis or structured fallback. Live search is unavailable offline, has its own dated unreviewed provenance, never inherits Pack validation, and cannot silently modify the validated answer.

## Alternatives considered

### Query private authoring database directly

Rejected because it violates trust boundaries, offline operation, source privacy, and Pack publication controls.

### Let semantic rank choose any similar content

Rejected because relevance cannot establish publication eligibility, authority, or applicability.

### Give synthesis model the entire Pack or pretrained knowledge

Rejected because citations and gaps become difficult to constrain; synthesis receives only selected eligible facts.

### Merge live results into validated answer

Rejected because live material has not completed specialist review.

### Require server AI for every Results page

Rejected because validated evidence should remain available offline and structured fallback is safer than unsupported generation.

### Translate evidence by replacing original quotations

Rejected because source-language provenance and translation uncertainty must remain visible.

## Consequences

### Positive

- Fast offline-capable validated retrieval.
- No commercial access to private authoring data.
- Exact evidence and Pack provenance.
- Hard protection against authority/relevance conflation.
- Safe structured fallback.
- Clear bilingual and live-search boundaries.
- Q02/Q03 provide strong transition regression fixtures.

### Costs and risks

- Local indexes/models and multi-platform testing add complexity.
- Coverage may be visibly incomplete until new Packs are published.
- On-device versus server synthesis and retention remain unresolved.
- Bilingual semantic equivalence requires specialist testing.
- Institutional overlays may create inconsistent ranking if not constrained.

## Implementation guardrails

- No AI provider/model is selected by this ADR.
- No free-form synthesis is implemented before grounding, citation, numerical, safety, and fallback criteria are approved.
- No live provider is connected before separate privacy/licensing/safety approval.
- No Q02/Q03 legacy path is retired before golden regression and rollback approval.
- No retired/Pending/Excluded/unpacked evidence may enter validated retrieval.
- Local storage/preferences must not become medical validation authority.
- No patient-identifiable information is required.

## Unresolved decisions

- On-device/server synthesis and offline permissions.
- Reviewer-name display.
- Response/query/receipt retention.
- Live-search providers.
- Ranking weights and institutional overlays.
- Regulatory positioning, user authentication, and entitlements.
- Safety disclaimers and emergency behavior.
- Minimum Pack freshness/offline grace.
- Translation review and terminology governance.

## Acceptance evidence

This ADR is implemented only when tests demonstrate local-Pack-only validated retrieval, hard pre-rank eligibility, complete provenance, citation-set containment, numerical and authority fidelity, visible conflict/gaps, bilingual evidence equivalence, safe offline fallback, live-search isolation, and Q02/Q03 same-or-stronger regression with tested rollback—without modifying approved medical content automatically.
