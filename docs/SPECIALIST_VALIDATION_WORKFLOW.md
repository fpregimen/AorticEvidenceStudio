# Specialist Validation Workflow

## Purpose

Specialist Validation v1 is a local-only, read-and-record workflow for Evaluation Question 2. It covers the extracted claims and numeric outcomes from AES-RCT-001, AES-RCT-002, and AES-RCT-003, followed by the synthesis draft. It does not expose the private articles, change medical wording automatically, or connect validated content to the public results page.

## Claim review

Open the source review, choose **Validate**, and compare each stored claim, exact supporting text, and printed/PDF location with the original article outside the browser. Choose Approve, Needs correction, or Excluded; enter reviewer name and date; add a required note for correction or exclusion; check the source-comparison confirmation; then save. Merely opening a route never changes a decision.

## Numeric outcome review

Switch to Numeric outcomes and verify the population, arms, follow-up, result text, numeric value, and source location. The same decisions and confirmation rules apply. An outcome without a source location cannot be approved.

## Decisions

- **Pending:** no specialist decision has been saved.
- **Approved:** checked against the original; verified, but still unsuitable for generated answers until synthesis approval.
- **Needs correction:** not verified and requires a reviewer note describing the problem.
- **Excluded:** checked but intentionally unavailable for generated answers; requires an explanatory note.

## Completion rules

A source becomes Specialist validated only when every claim and outcome has a non-pending decision, no item needs correction, and reviewer/date metadata exists. Any correction decision makes the source Requires correction; otherwise partial work is Specialist review in progress.

## Synthesis approval

The synthesis validator shows its stored findings, limitations, supporting claim IDs, and current decisions. Approval is blocked if a referenced claim is missing, pending, needs correction, excluded, or otherwise unapproved, or if any numeric outcome remains unapproved. Approval requires reviewer name, review date, and explicit confirmation. Returning for correction requires a note.

Only successful synthesis approval sets the synthesis to Specialist validated and makes its referenced, approved claims suitable for generated answers. This does not publish them or alter their wording.

## Audit and backup behavior

Before each local JSON replacement, the server writes a timestamped backup under `database/local_backups/`, writes the replacement to a temporary file, validates its JSON serialization, and atomically renames it. Each change creates a timestamped record under `database/local_audit/` containing identifiers, decisions, reviewer metadata, and notes—never PDF content or private paths. Both directories are Git-ignored.

## Safety boundary

Extraction records what the publication says. Specialist validation confirms the extraction and citation location. Production use additionally requires synthesis approval and a separate future public-results integration. This workflow does not replace future independent quality review.
