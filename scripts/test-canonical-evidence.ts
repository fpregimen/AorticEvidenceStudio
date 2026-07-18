import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import type { ContentReview } from "../lib/content-review-model.ts";
import { adaptLegacyReviewReadOnly, duplicateReportToMarkdown, formatEvidenceRevisionReference, generateDuplicateCandidateReport, parseCanonicalId, validateCanonicalGraph, validateLifecycleTransition } from "../lib/canonical-evidence/index.ts";
import type { CanonicalGraph, EvidenceRevision } from "../lib/canonical-evidence/index.ts";

const ids = {
  source: parseCanonicalId("SRC_018f22e2-4f00-7a00-8000-000000000001", "SRC_"),
  version: parseCanonicalId("SRV_018f22e2-4f00-7a00-8000-000000000002", "SRV_"),
  file: parseCanonicalId("SFL_018f22e2-4f00-7a00-8000-000000000003", "SFL_"),
  item: parseCanonicalId("EVI_018f22e2-4f00-7a00-8000-000000000004", "EVI_"),
  location: parseCanonicalId("LOC_018f22e2-4f00-7a00-8000-000000000005", "LOC_"),
  review: parseCanonicalId("REV_018f22e2-4f00-7a00-8000-000000000006", "REV_"),
  reviewer: parseCanonicalId("RVR_018f22e2-4f00-7a00-8000-000000000007", "RVR_"),
};
const audit = { createdAt: "2099-01-01T00:00:00Z", createdBy: "synthetic-test", schemaVersion: "1" };
const ref = formatEvidenceRevisionReference(ids.item, 1);
const baseGraph = (): CanonicalGraph => ({
  sources: [{ sourceId: ids.source, authoritativeTitle: "Synthetic materials report", sourceType: "synthetic", lifecycle: "active", aliases: [{ system: "aes_legacy", value: "AES-SYN-001" }], audit }],
  sourceVersions: [{ sourceVersionId: ids.version, sourceId: ids.source, versionType: "version_of_record", versionLabel: "1", authoritativeLanguage: "en", audit }],
  sourceFiles: [{ sourceFileId: ids.file, sourceVersionId: ids.version, contentHash: { algorithm: "sha256", value: "file-hash" }, byteLength: 100, mimeType: "application/pdf", accessClassification: "restricted", audit }],
  corrections: [], evidenceItems: [{ evidenceItemId: ids.item, sourceVersionId: ids.version, authorityType: "primary_study_result", sourceLifecycle: "active", disputeLifecycle: "none", aliases: [], audit }],
  locations: [{ locationId: ids.location, sourceFileId: ids.file, printedPage: "1", pdfPage: 2, section: "Synthetic results", paragraphAnchor: "synthetic anchor" }],
  reviewers: [{ reviewerId: ids.reviewer, displayName: "Synthetic Reviewer", specialty: "Synthetic testing", active: true, audit }],
  reviews: [{ reviewId: ids.review, revisionReference: ref, reviewerId: ids.reviewer, decision: "approved", reviewDate: "2099-01-01", inspection: { confirmed: true, inspectedSourceFileId: ids.file, fullText: true, table: false, figure: false, supplement: false }, comments: "Synthetic", audit }],
  evidenceRevisions: [{ revisionReference: ref, evidenceItemId: ids.item, revisionNumber: 1, authorityType: "primary_study_result", verificationStatus: "original_source_verified", reviewLifecycle: "approved", publicationLifecycle: "release_candidate", assertion: "Synthetic units changed.", quotation: { text: "Synthetic units changed.", sourceLanguage: "en", hash: { algorithm: "sha256", value: "text-hash", canonicalizationProfile: "synthetic-v1" } }, locationIds: [ids.location], numericalOutcomes: [], applicability: {}, limitations: [], specialistReviewIds: [ids.review], changeReason: "initial", audit }],
  referenceChains: [],
});
assert.equal(validateCanonicalGraph(baseGraph()).valid, true, "valid canonical record");
assert.throws(() => parseCanonicalId("SRV_018f22e2-4f00-7a00-8000-000000000001", "SRC_"), /Invalid SourceId/, "invalid typed prefix");
assert.throws(() => formatEvidenceRevisionReference(ids.item, 0), /positive integer/, "invalid revision");
assert.equal(validateLifecycleTransition("evidenceReview", "pending", "approved"), true);
assert.equal(validateLifecycleTransition("evidenceReview", "draft", "approved"), false, "no automatic approval transition");
assert.equal(validateLifecycleTransition("publication", "unpublished", "published"), false);
assert.equal(validateLifecycleTransition("source", "active", "withdrawn"), true);

const itemApproval = baseGraph(); itemApproval.reviews[0].revisionReference = ids.item as unknown as typeof ref;
assert(validateCanonicalGraph(itemApproval).issues.some(issue => issue.code === "invalid_review_binding"), "approval attached to item rejected");
const inherited = baseGraph(); const revision2 = structuredClone(inherited.evidenceRevisions[0]) as EvidenceRevision; revision2.revisionNumber = 2; revision2.revisionReference = formatEvidenceRevisionReference(ids.item, 2); revision2.predecessor = ref; inherited.evidenceRevisions.push(revision2);
assert(validateCanonicalGraph(inherited).issues.some(issue => issue.code === "review_revision_mismatch" || issue.code === "approval_missing"), "approval inheritance rejected");
const pageOnly = baseGraph(); pageOnly.locations[0] = { locationId: ids.location, sourceFileId: ids.file, printedPage: "1", pdfPage: 2 };
assert(validateCanonicalGraph(pageOnly).issues.some(issue => issue.code === "page_only_provenance"));
const paragraph = baseGraph(); assert.equal(validateCanonicalGraph(paragraph).valid, true, "paragraph provenance");
const table = baseGraph(); table.locations[0] = { locationId: ids.location, sourceFileId: ids.file, kind: "table", tableNumber: "1", rowPath: ["row"], columnPath: ["column"] };
assert.equal(validateCanonicalGraph(table).valid, true, "table provenance");
const badTable = baseGraph(); badTable.locations[0] = { locationId: ids.location, sourceFileId: ids.file, kind: "table", tableNumber: "1", rowPath: [], columnPath: [] };
assert(validateCanonicalGraph(badTable).issues.some(issue => issue.code === "incomplete_table_context"));
const figure = baseGraph(); figure.locations[0] = { locationId: ids.location, sourceFileId: ids.file, kind: "figure", figureNumber: "2", panel: "A" };
assert.equal(validateCanonicalGraph(figure).valid, true, "figure provenance");
const badFigure = baseGraph(); badFigure.locations[0] = { locationId: ids.location, sourceFileId: ids.file, kind: "figure", figureNumber: "2", panel: "" };
assert(validateCanonicalGraph(badFigure).issues.some(issue => issue.code === "incomplete_figure_context"));
const secondary = baseGraph(); secondary.evidenceRevisions[0].verificationStatus = "underlying_primary_evidence_verified";
assert(validateCanonicalGraph(secondary).issues.some(issue => issue.code === "primary_verification_not_supported"), "secondary citation cannot imply primary verification");
const correction = baseGraph(); correction.corrections.push({ relationshipId: "synthetic-correction", affectedSourceId: ids.source, correctedSourceVersionId: ids.version, kind: "corrected_version", impact: "synthetic change", audit }); correction.evidenceRevisions.push({ ...structuredClone(correction.evidenceRevisions[0]), revisionNumber: 2, revisionReference: formatEvidenceRevisionReference(ids.item, 2), predecessor: ref, reviewLifecycle: "pending", publicationLifecycle: "unpublished", specialistReviewIds: [], changeReason: "synthetic correction" });
assert.equal(validateCanonicalGraph(correction).valid, true, "correction preserves predecessor without approval inheritance");
const collision = baseGraph(); collision.sources.push({ ...structuredClone(collision.sources[0]), sourceId: parseCanonicalId("SRC_018f22e2-4f00-7a00-8000-000000000099", "SRC_") });
assert(validateCanonicalGraph(collision).issues.some(issue => issue.code === "legacy_alias_collision"));

const legacyPath = "database/content_reviews/Q03_AES-GDL-001.json"; const before = await readFile(legacyPath, "utf8"); const legacy = JSON.parse(before) as ContentReview; const adapted = adaptLegacyReviewReadOnly("Q03", legacy); const after = await readFile(legacyPath, "utf8");
assert.equal(after, before, "compatibility adapter is read-only"); assert.equal(adapted.sourceId, legacy.source_id); assert(adapted.candidates.every(candidate => candidate.canonicalApprovalCreated === false)); assert(adapted.candidates.every(candidate => candidate.alias.value.includes(legacy.review_id)), "legacy aliases preserved");

function syntheticLegacy(question: string, wording: string, supportingText: string, decision: "Approved" | "Pending", location = "p. 1, paragraph A") {
  const review: ContentReview = { review_id: `${question}-AES-SYN-001`, evaluation_question_number: Number(question.slice(1)), question: "Synthetic question", source_id: "AES-SYN-001", review_status: "In review", reviewer: null, review_date: null, source_access_type: null, source_version_or_date: null, relevant_sections: [], extracted_claims: [{ claim_id: `${question}-C01`, claim_text: wording, evidence_category: "Synthetic", exact_supporting_text: supportingText, page: location, section: "Paragraph A", table: null, figure: null, source_location_note: null, direct_or_indirect: "Direct", confidence: "Synthetic", verified_by_reviewer: false, suitable_for_generated_answer: false, validation_decision: decision }], guideline_recommendations: [], outcome_data: [], limitations: ["Synthetic limitation"], contradictions: [], reviewer_notes: null, last_updated: "2099-01-01" };
  return adaptLegacyReviewReadOnly(question, review);
}
const exactReport = generateDuplicateCandidateReport(syntheticLegacy("Q02", "Synthetic material retained strength", "Exact synthetic support", "Approved"), syntheticLegacy("Q03", "Synthetic material retained strength", "Exact synthetic support", "Pending"));
assert.equal(exactReport.mergePerformed, false); assert.equal(exactReport.candidates[0].merged, false); assert.equal(exactReport.candidates[0].requiresManualResolution, true); assert(exactReport.candidates[0].differences.some(diff => diff.field === "decision")); assert.match(duplicateReportToMarkdown(exactReport), /No merge/);
const conflictReport = generateDuplicateCandidateReport(syntheticLegacy("Q02", "Synthetic material increased", "Support A", "Approved"), syntheticLegacy("Q03", "Synthetic material decreased", "Support B", "Pending"));
assert(conflictReport.candidates.some(candidate => candidate.classification === "conflicting" && candidate.requiresManualResolution));

console.log("Canonical evidence Phase 1 tests: 24 passed");
