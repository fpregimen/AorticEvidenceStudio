# Source Documents

This directory stores authorized local source files associated with records in `database/source_catalog.csv` and records conforming to `database/source_schema.json`.

## Folder Structure

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

Create subfolders as the source collection is curated. A file's category and region should determine its location.

## Accepted File Types

Preferred source formats are:

- PDF (`.pdf`) for fixed publications, guidelines, regulatory documents, and IFUs
- Plain text (`.txt`) or Markdown (`.md`) for authorized text extracts and internal commentary
- HTML (`.html`) for preserved public pages when storage and redistribution are permitted
- CSV (`.csv`) or JSON (`.json`) for authorized registry or structured-source exports

Original file formats should be preserved where practical. A converted file should not replace the original source record without documenting the conversion.

## Filename Convention

Use:

```text
SOURCEID_YEAR_SHORT-TITLE_REGION_VERSION.ext
```

Example format only:

```text
AES-GDL-001_2025_AORTIC-GUIDELINE_US_V1.pdf
```

Use uppercase ASCII characters, hyphens within filename components, and underscores between components. Avoid patient information, author names when unnecessary, and unstable labels such as `FINAL`.

## Connecting Files to Source Records

Every stored document must have a unique `source_id` registered in the source catalog. The filename must begin with that exact identifier, and the record's `local_file_path` must contain the repository-relative path to the file. One `source_id` represents one version of one source; a superseding version should receive its own identifier and link back through metadata.

## Copyright and Public Repositories

Copyrighted files must not be committed to a public GitHub repository unless redistribution is explicitly permitted. Publicly available URLs and bibliographic metadata may be committed, but public availability does not itself grant document redistribution rights. Record the official URL and respect publisher, manufacturer, society, and regulator terms.

## Sensitive Data

Sensitive patient data and protected health information must never be stored in this directory. This includes identifiable images, names, medical record numbers, dates of birth, exact clinical dates, and any other information that could identify a patient.

## Registration and Review Workflow

1. Register source metadata in `database/source_catalog.csv`.
2. Run `npm run validate:sources`.
3. Add a permitted local source document when applicable.
4. Perform metadata verification.
5. Perform citation verification.
6. Perform specialist review.
7. Update the verification status and last verified date in the catalog.

Copyrighted PDFs must not be committed to a public GitHub repository unless redistribution is permitted. Official URLs and metadata may be stored. Patient-identifiable data must never be stored.
