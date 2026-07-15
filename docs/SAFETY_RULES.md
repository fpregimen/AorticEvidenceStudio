# Aortic Evidence Studio — Safety and Evidence Integrity Rules

## 1. Intended Use

Aortic Evidence Studio is intended for:

- Aortic surgeons
- Vascular surgeons
- Cardiovascular specialists
- Researchers
- Fellows and residents under appropriate supervision

It is a specialist decision-support and academic research tool. It does not replace:

- Clinical judgment
- Multidisciplinary discussion
- Institutional policy
- Device instructions for use (IFU) review
- Regulatory review
- Direct review of the original publication

## 2. Prohibited Patient Information

For the MVP, users must not enter:

- Patient names
- Medical record numbers
- Dates of birth
- Exact admission or procedure dates
- Addresses
- Phone numbers
- Email addresses
- Facial images
- Identifiable radiology images
- Any other protected health information

The following warning must appear near every input field:

> Do not enter patient-identifiable information.

The natural Japanese warning is:

> 患者氏名、診療録番号、生年月日など、個人を特定できる情報は入力しないでください。

## 3. Evidence Classification

Every statement must be classified as one of the following:

- Published clinical evidence
- Guideline recommendation
- Regulatory information
- Manufacturer IFU information
- Conference abstract
- Bench research
- Animal research
- Expert commentary
- Institutional practice
- AI inference

The system must not combine categories without clear, statement-level labeling.

## 4. Citation Requirements

- Every substantive factual claim must have a source.
- References must include the title and source.
- PMID or DOI should be included when available.
- Official URLs should be used for regulatory and guideline documents.
- References must not be fabricated.
- Each citation must support the specific claim associated with it.
- The system must not cite a review article as if it were the original clinical trial when the original trial is available.

## 5. Source Priority

Use the following hierarchy when possible:

1. Current official guidelines
2. FDA, PMDA, or other official regulatory documents
3. Original peer-reviewed clinical trials
4. Prospective registries
5. Systematic reviews and meta-analyses
6. Retrospective studies
7. Conference abstracts
8. Case reports and technical reports
9. Expert opinion
10. AI inference

Source priority may vary depending on the question. Relevance, recency, study design, directness, and regional applicability should be considered alongside the hierarchy.

## 6. Date and Version Control

For guidelines, IFUs, regulatory status, and device availability, the system must display:

- Country or region
- Publication or approval date
- Version, when available
- Last verified date

The application must warn users that device availability and regulatory status may change and should be confirmed against current official sources.

## 7. Regulatory Separation

The system must clearly distinguish:

- FDA-approved use
- PMDA-approved use
- CE-marked use
- Investigational use
- Off-label use
- Physician-modified use
- Unapproved or unavailable use

The system must never describe investigational or off-label use as approved. Regulatory statements must name the relevant jurisdiction and verification date.

## 8. Evidence Uncertainty

The system must explicitly state when:

- Direct evidence is unavailable
- Evidence is indirect
- Evidence is limited to small case series
- Only conference abstracts are available
- Results are inconsistent
- Follow-up is short
- Comparative data are unavailable
- Expert opinion is being used

Preferred English and natural Japanese language includes:

| English | Japanese |
|---|---|
| No direct comparative evidence was identified. | 直接比較エビデンスは確認されていません。 |
| This conclusion is based on indirect evidence. | この結論は間接的なエビデンスに基づいています。 |
| Evidence is limited to small observational series. | エビデンスは小規模な観察研究に限られています。 |
| Long-term durability remains uncertain. | 長期耐久性は依然として不明です。 |

## 9. Conflict Detection

When sources disagree, the system should:

- Present both positions
- Identify the date and quality of each source
- Explain the likely reason for disagreement
- Avoid forcing a single conclusion when evidence is unresolved

## 10. Device Information Safety

Device information must include, when available:

- Device name
- Manufacturer
- Region
- Approved indication
- Relevant dimensions
- Access requirements
- IFU limitations
- Source document
- Last verified date

The application must not generate device dimensions or IFU requirements from memory. These details require confirmation from a current official IFU or regulatory source.

## 11. Expert Commentary

Expert commentary must:

- Be labeled as expert commentary
- Identify the author or institution when permission is provided
- Be separated from published evidence
- Include a date
- Not misrepresent institutional practice as a universal standard

## 12. AI Inference

AI-generated interpretation must:

- Be labeled as AI inference
- Cite the evidence used for the inference
- Explain uncertainty
- Never be presented as a published conclusion
- Never create a fabricated recommendation, endpoint, device specification, or citation

## 13. Clinical Recommendation Limits

The MVP must not:

- Diagnose a patient
- Automatically select treatment
- Recommend a specific device for a specific identifiable patient
- Calculate procedural measurements from imaging
- Replace multidisciplinary review
- Replace direct IFU confirmation
- Provide emergency medical management

## 14. High-Risk Queries

High-risk queries include:

- Rupture
- Hemodynamic instability
- Acute malperfusion
- Neurologic deficit
- Visceral ischemia
- Limb ischemia
- Suspected device failure
- Immediate postoperative deterioration

For these queries, the application should state that urgent specialist evaluation and institutional emergency protocols take priority over the application.

## 15. Output Safety Labels

Every generated answer should display:

- Evidence last reviewed date
- Region covered
- Evidence categories used
- Important limitations
- Specialist-use disclaimer

## 16. Quality Review

Before an answer is accepted as validated, review:

- Citation accuracy
- Source completeness
- Evidence classification
- Regulatory accuracy
- Date accuracy
- Translation accuracy
- Whether uncertainty is clearly stated
- Whether expert commentary is properly labeled

## 17. Reporting Errors

A future reporting mechanism should allow users to report:

- Incorrect references
- Missing major studies
- Outdated regulatory information
- Incorrect device specifications
- Translation problems
- Unsupported conclusions
