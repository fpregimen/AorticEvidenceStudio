# Source identity validation

Source identity validation is intentionally tolerant of minor bibliographic differences. It is used to decide whether a locally held document is the registered publication; it is not a clinical-content validation.

## Primary fields

- DOI
- PMID
- Normalized title
- Journal
- Publication year

## Supporting fields

- First author
- Normalized author overlap
- Trial or study-group name
- Volume, issue, and pages when available

Author comparison is not exact. Names are compared after case folding, Unicode/diacritic normalization, punctuation and hyphen removal, and removal of initials and `et al.` markers. Group/consortium authors, committee members, middle initials, minor order differences involving group authors, and additional or missing authors are tolerated when the primary fields identify the same publication.

## Outcomes

- **Matched:** DOI or PMID matches; normalized title, journal, and year are consistent; no material conflict exists.
- **Matched with metadata warning:** core identity matches, but minor author, punctuation, subtitle, page-range, or group-attribution differences exist. Extraction may proceed and the discrepancy is recorded as metadata.
- **Mismatch — stop:** DOI or PMID conflicts; title identifies another article; journal or year materially conflicts; or the file is an editorial, correction, supplement, abstract, or secondary article instead of the registered original.

An author-list difference alone is never a stop condition when DOI, PMID, normalized title, journal, and year identify the same publication.
