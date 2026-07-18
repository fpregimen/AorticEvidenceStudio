# Authoring AI provider contract

The Authoring Portal uses an optional server-only HTTP adapter. It does not send a PDF. It sends only the authenticated reviewer's selected extracted text, its full extracted page text, the PDF page number, source title, and source language.

The configured endpoint receives JSON with `model`, `task`, `constraints`, and `source`. It returns `{ "candidates": [...] }`. Candidate fields use the names defined by `CandidateSuggestion` in `lib/authoring/ai-provider.ts`.

The adapter rejects a candidate unless its exact quotation occurs verbatim on the extracted page. It fixes `pdfPage` to the extracted page and accepts location labels only when they also occur in that page text. Every accepted suggestion remains editable, is visibly labeled **AI suggested**, and can only be saved as a Pending revision after the specialist checks the quotation/location confirmation.

Credentials are server-only. If any required AI variable is absent, the AI control shows a setup-required state while authenticated PDF viewing, native-text extraction, and manual evidence entry continue to work.
