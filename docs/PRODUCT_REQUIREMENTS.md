# Aortic Evidence Studio — Product Requirements

## 1. Product Vision

Aortic Evidence Studio is a bilingual English/Japanese specialist platform for aortic and vascular clinicians and researchers. It connects published evidence, clinical guidelines, device information, regulatory information, expert commentary, and academic output creation in a single workflow.

The platform should support the complete path from a clinical or research question to an evidence-based answer, comparison table, slide outline, guideline draft, or research proposal. The MVP will focus on aortic disease and will not attempt to cover all of medicine.

## 2. Target Users

- Aortic surgeons
- Vascular surgeons
- Cardiovascular surgeons
- Interventional specialists
- Researchers
- Fellows and residents
- Medical device researchers

## 3. Initial Clinical Scope

The MVP is limited to:

1. Acute, subacute, and chronic type B aortic dissection
2. Preemptive TEVAR
3. False lumen embolization
4. Fenestrated and branched EVAR
5. Physician-modified endografts
6. TAMBE and TBE
7. Type II endoleak prevention
8. Heritable thoracic aortic disease and endovascular treatment

Peripheral vascular disease, carotid disease, dialysis access, and venous disease are outside the initial MVP.

## 4. Core Product Modes

### Ask Aortic

The user enters a specialist question and receives:

- Brief conclusion
- Clinical implications
- Evidence summary
- Guideline recommendations
- Regional differences
- Evidence gaps
- References

### Compare Strategies

The user can compare two or more treatments, devices, or techniques across:

- Indications
- Anatomy
- Technical feasibility
- Early outcomes
- Durability
- Reintervention
- Complications
- Evidence quality
- Regulatory status
- Limitations

### Create Output

The user can convert an evidence review into:

- One-slide summary
- Two-slide summary
- Conference discussion document
- Manuscript introduction outline
- Guideline draft
- Research background
- Unmet-need statement
- Study hypothesis

### Guideline Mode

The system can create:

- Clinical question
- Recommendation statement
- Evidence summary
- Recommendation strength placeholder
- Evidence gaps
- PMID list

### Research Mode

The system can create:

- Background
- Unmet need
- Hypothesis
- PICO
- Candidate study design
- Candidate endpoints
- Relevant prior studies
- Research gaps

## 5. Evidence Categories

The system must clearly separate:

- Published clinical evidence
- Guideline recommendations
- Regulatory documents
- Manufacturer IFU information
- Conference abstracts
- Bench or animal research
- Expert commentary
- AI inference

Expert commentary and AI inference must never be presented as published evidence. Each must be visibly labeled and distinguishable from sourced factual content.

## 6. Geographic Coverage

The product should compare the United States, Japan, and Europe, including:

- FDA status
- PMDA status
- Regional device availability
- Regional guidelines
- Differences in standard practice

## 7. Source Types

Supported source types should include:

- PubMed-indexed articles
- Official clinical guidelines
- FDA approval documents
- FDA Summary of Safety and Effectiveness Data (SSED) documents
- PMDA review reports
- Japanese package inserts
- Manufacturer instructions for use (IFUs)
- ClinicalTrials.gov
- UMIN
- jRCT
- Major professional society publications

## 8. Required Metadata

Each source should support:

- Title
- Authors
- Publication year
- Source type
- Region
- Disease
- Procedure
- Device
- Evidence level
- Regulatory status
- PMID
- DOI
- Official URL
- Last reviewed date

## 9. Main Screens

### Home Page

The home page should include:

- Large medical question field
- Example questions
- Mode selector
- Recent searches
- Saved projects
- English/Japanese language selector

### Results Page

The results page should include these tabs:

- Summary
- Evidence
- Guidelines
- Devices
- US vs Japan
- Evidence Gaps
- Create Output

A collapsible reference panel should appear on the right side.

## 10. Safety Requirements

- The MVP must not accept or store patient-identifiable information.
- The interface must clearly warn users not to enter names, medical record numbers, dates of birth, or other identifiers.
- Every substantive claim must link to a source or be labeled as inference.
- The application must identify uncertainty.
- The application must state when direct evidence is unavailable.
- The application must not fabricate references.
- Regulatory status must identify the relevant country and date.
- Content is for specialist decision support and does not replace clinical judgment.

## 11. Bilingual Requirements

The system must support:

- English interface
- Japanese interface
- English medical source retrieval
- Japanese source retrieval
- Natural, specialist-level Japanese translations
- Side-by-side English and Japanese output when requested

## 12. MVP Success Criteria

The MVP should:

- Answer 30 predefined aortic questions
- Identify the major relevant evidence
- Avoid fabricated references
- Correctly distinguish evidence from expert opinion
- Produce a usable evidence table
- Produce a usable one-slide summary
- Show US/Japan differences when applicable
- Allow users to save a search as a project

## 13. Non-Goals for the MVP

- Automatic clinical diagnosis
- Automatic treatment selection
- DICOM image analysis
- Patient-specific procedural planning
- EHR integration
- Medical billing
- General medical question answering
- Full mobile-native application

## 14. Future Development

- Device compatibility checking
- DICOM and centerline analysis
- Patient-specific anatomy matching
- Private institutional knowledge bases
- Expert-reviewed comments
- Additional vascular surgery domains
- Native iOS application
- Collaboration between specialists
