# Aortic Evidence Studio — Data Sources and Evidence Architecture

## 1. Purpose

The source library will support:

- Evidence-grounded answers
- Guideline comparisons
- Device and regulatory comparisons
- United States/Japan/Europe comparisons
- Academic output generation
- Citation verification

No AI-generated answer should be treated as validated unless every substantive claim can be traced to a registered source.

## 2. Source Categories

| Category | Definition |
|---|---|
| Peer-reviewed original clinical study | A primary clinical investigation published after peer review that does not fall into a more specific design below. |
| Randomized clinical trial | A clinical study that prospectively assigns participants to interventions using random allocation. |
| Prospective registry | A predefined longitudinal collection of clinical data accrued prospectively. |
| Retrospective study | A clinical analysis based primarily on previously collected records or observations. |
| Systematic review or meta-analysis | A structured synthesis of existing studies, with quantitative pooling when applicable. |
| Clinical guideline | An official, methodologically developed set of clinical recommendations issued by a recognized organization. |
| Consensus statement | Expert recommendations or positions developed through a stated consensus process. |
| FDA regulatory document | An official United States Food and Drug Administration record, approval document, labeling document, or safety communication. |
| PMDA regulatory document | An official Japanese Pharmaceuticals and Medical Devices Agency review, approval, labeling, or safety document. |
| European regulatory document | An official European or national competent-authority regulatory or conformity document. |
| Manufacturer IFU | A manufacturer-issued instructions-for-use document for a device and region. |
| Japanese package insert | Official Japanese device labeling or package-insert information. |
| Clinical trial registry | A record from an official study registry, including status and protocol metadata. |
| Conference abstract | Research reported in abstract or presentation form without a corresponding full peer-reviewed publication. |
| Technical report | A technical description, case series, procedural note, or similar report not otherwise classified. |
| Bench study | Nonclinical testing performed in a laboratory, simulator, or engineered model. |
| Animal study | Preclinical research conducted in animal models. |
| Expert commentary | An identified expert interpretation that is not primary published evidence or a formal guideline. |
| Institutional practice document | A local protocol, pathway, or practice statement that is not a universal standard. |

## 3. Initial Geographic Coverage

- United States
- Japan
- Europe
- International or multinational

## 4. Initial Clinical Domains

- Acute type B aortic dissection
- Subacute type B aortic dissection
- Chronic type B aortic dissection
- Preemptive TEVAR
- False lumen embolization
- Fenestrated EVAR
- Branched EVAR
- Physician-modified endografts
- TAMBE
- TBE
- Type II endoleak prevention
- Heritable thoracic aortic disease
- Acute type A aortic dissection
- Frozen elephant trunk
- Ascending aortic endovascular repair
- Endovascular Bentall

## 5. Required Source Metadata

The canonical record is defined by `database/source_schema.json`. Its fields are:

| Field | Description |
|---|---|
| `source_id` | Stable, unique Aortic Evidence Studio identifier. |
| `title` | Full source title. |
| `authors` | Ordered list of authors or responsible contributors. |
| `publication_year` | Four-digit publication year. |
| `publication_date` | Full ISO 8601 publication date when known. |
| `source_type` | Controlled source category. |
| `evidence_design` | More detailed study-design description when applicable. |
| `evidence_level` | Evidence grade or level, including the grading system when known. |
| `region` | Controlled geographic coverage category. |
| `country` | Specific country or countries relevant to the source. |
| `clinical_domains` | One or more indexed clinical domains. |
| `diseases` | Diseases or conditions addressed. |
| `procedures` | Procedures or techniques addressed. |
| `devices` | Devices addressed. |
| `manufacturer` | Device manufacturer when applicable. |
| `journal_or_organization` | Publishing journal, agency, society, registry, or organization. |
| `PMID` | PubMed identifier when available. |
| `DOI` | Digital Object Identifier when available. |
| `official_url` | Authoritative public URL. |
| `local_file_path` | Repository-relative path to an authorized local copy. |
| `language` | Controlled source-language value. |
| `regulatory_status` | Controlled regulatory classification. |
| `approval_region` | Jurisdiction in which the stated regulatory status applies. |
| `approval_date` | ISO 8601 approval date when applicable. |
| `version` | Guideline, labeling, IFU, or document version. |
| `is_peer_reviewed` | Whether the source completed peer review. |
| `is_primary_source` | Whether the record represents a primary rather than secondary source. |
| `is_current` | Whether the source is current at the last verification. |
| `superseded_by` | `source_id` of the replacing source when superseded. |
| `last_verified_date` | ISO 8601 date on which metadata or status was last checked. |
| `verification_status` | Controlled review-workflow status. |
| `reviewer` | Reviewer name or stable reviewer identifier. |
| `notes` | Free-text curation notes. |
| `evidence_summary` | Concise evidence summary; may be null before review. |
| `key_findings` | List of important findings tied to the source. |
| `limitations` | List of documented source limitations. |
| `relevant_evaluation_questions` | Evaluation question numbers, limited to 1–30. |

In `database/source_catalog.csv`, array values must be encoded as semicolon-separated values. A semicolon occurring within a value should be avoided or normalized during curation. JSON remains the canonical representation for structured records.

## 6. Verification Status

- **Not reviewed:** The source has been registered but not checked.
- **Metadata verified:** Core bibliographic and indexing metadata have been checked.
- **Citation verified:** The citation resolves correctly and supports its associated bibliographic record.
- **Content reviewed:** Relevant content, findings, and limitations have been reviewed.
- **Specialist validated:** A qualified specialist has completed the required clinical review.
- **Outdated:** The source remains historically relevant but is no longer current.
- **Superseded:** A newer identified source replaces this version.
- **Retracted:** The source has been formally retracted and must not support claims.

Verification statuses describe workflow state, not evidence quality. A source marked retracted must be retained for auditability and clearly excluded from answer support.

## 7. Source Priority Rules

The application should prefer:

1. Current official guidelines
2. Current official regulatory documents
3. Original peer-reviewed studies
4. Prospective registries
5. Systematic reviews
6. Retrospective studies
7. Conference abstracts
8. Technical reports and case series
9. Expert commentary
10. AI inference

Priority may vary with the question, but primary sources should be cited instead of reviews when the original study is available. Reviews may still be used to identify sources, describe the broader evidence base, or provide a documented synthesis.

## 8. Version and Date Control

Guidelines, IFUs, package inserts, regulatory documents, and device-availability records must include country or region, version when available, publication or approval date, and last verified date.

Superseded sources must be retained for audit history. Mark them `Superseded`, set `is_current` to `false`, and link `superseded_by` to the replacement record. They must not be presented as current guidance, labeling, or regulatory status.

## 9. File Storage Rules

Suggested local organization:

```text
source_documents/
├── guidelines/
│   ├── us/
│   ├── japan/
│   └── europe/
├── regulatory/
│   ├── fda/
│   ├── pmda/
│   └── europe/
├── ifu/
├── clinical_trials/
├── peer_reviewed_articles/
├── conference_abstracts/
└── expert_commentary/
```

`local_file_path` must be repository-relative and must resolve to the authorized local document associated with `source_id`. Copyrighted documents must not be redistributed without permission or committed to a public repository when redistribution rights are absent.

## 10. Citation Traceability

Every answer should be traceable to:

- `source_id`
- Exact source
- Relevant page, section, table, figure, or text passage when available
- Date retrieved or verified

The system should support claim-level citations placed with the claims they support, rather than references placed only at the end of an answer.

## 11. Initial Source Collection Plan

The first collection target is approximately 50 high-value sources:

- 10 major guidelines or consensus statements
- 10 regulatory or IFU documents
- 20 landmark or recent peer-reviewed studies
- 5 major systematic reviews
- 5 trial-registry or conference sources

Specific references will be selected and verified during curation; none are presumed by this architecture document.

## 12. Manual Review Requirements

Specialist review is required for:

- Trial primary endpoints
- Regulatory approval status
- IFU requirements
- Device dimensions
- Guideline recommendation wording
- Off-label or investigational use
- Japan/US practice comparisons

## 13. Future Retrieval Architecture

The future vendor-neutral workflow is:

```text
Question
→ domain classification
→ source filtering
→ keyword and semantic retrieval
→ passage extraction
→ evidence classification
→ contradiction detection
→ answer generation
→ citation verification
→ specialist review when required
```

No specific AI vendor is selected at this stage.
