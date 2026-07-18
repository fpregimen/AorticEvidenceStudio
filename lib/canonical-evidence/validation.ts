import { parseCanonicalId, parseEvidenceRevisionReference } from "./identifiers.ts";
import { evidenceAuthorityTypes, evidencePackLifecycleStates, evidenceReviewLifecycleStates, publicationLifecycleStates, sourceLifecycleStates, specialistDecisions, disputeLifecycleStates, verificationStatuses } from "./types.ts";
import type { CanonicalGraph, EvidenceLocation, EvidencePackLifecycle, EvidenceReviewLifecycle, FigureEvidenceLocation, PublicationLifecycle, SourceLifecycle, SpecialistReview, TableEvidenceLocation, DisputeLifecycle } from "./types.ts";

export interface ValidationIssue { code: string; path: string; message: string; }
export interface ValidationResult { valid: boolean; issues: ValidationIssue[]; }
const transitionMaps = {
  source: { active: ["superseded", "withdrawn"], superseded: [], withdrawn: [] },
  evidenceReview: { draft: ["pending"], pending: ["needs_correction", "approved", "excluded"], needs_correction: ["pending"], approved: [], excluded: [] },
  publication: { unpublished: ["release_candidate"], release_candidate: ["published", "unpublished"], published: ["superseded", "retired"], superseded: [], retired: [] },
  dispute: { none: ["open"], open: ["resolved"], resolved: ["open"] },
  evidencePack: { draft: ["validated"], validated: ["signed", "draft"], signed: ["published"], published: ["revoked"], revoked: [] },
} as const;
type MachineState = { source: SourceLifecycle; evidenceReview: EvidenceReviewLifecycle; publication: PublicationLifecycle; dispute: DisputeLifecycle; evidencePack: EvidencePackLifecycle };

export function validateLifecycleTransition<K extends keyof MachineState>(machine: K, from: MachineState[K], to: MachineState[K]) {
  if (from === to) return true;
  const transitions = transitionMaps[machine] as Record<string, readonly string[]>;
  return transitions[from]?.includes(to) ?? false;
}

function hasAnchor(location: EvidenceLocation) {
  return Boolean(location.section?.trim() || location.paragraphAnchor?.trim() || location.recommendationNumber?.trim() || location.quotedPrefix?.trim() || location.quotedSuffix?.trim() || "tableNumber" in location || "figureNumber" in location);
}
export function validateLocation(location: EvidenceLocation): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  try { parseCanonicalId(location.locationId, "LOC_"); } catch { issues.push({ code: "invalid_location_id", path: "locationId", message: "Location ID must use LOC_ with a UUIDv7-compatible payload" }); }
  try { parseCanonicalId(location.sourceFileId, "SFL_"); } catch { issues.push({ code: "invalid_source_file_id", path: "sourceFileId", message: "Source file ID is invalid" }); }
  if (!hasAnchor(location)) issues.push({ code: "page_only_provenance", path: "location", message: "Page number alone is insufficient provenance" });
  if ("kind" in location && location.kind === "table") {
    const table = location as TableEvidenceLocation;
    if (!table.tableNumber.trim() || !table.rowPath.length || !table.columnPath.length) issues.push({ code: "incomplete_table_context", path: "location", message: "Table evidence requires table, row, and column context" });
  }
  if ("kind" in location && location.kind === "figure") {
    const figure = location as FigureEvidenceLocation;
    if (!figure.figureNumber.trim() || !figure.panel.trim()) issues.push({ code: "incomplete_figure_context", path: "location", message: "Figure evidence requires figure and panel context" });
  }
  return issues;
}

function reviewEligible(review: SpecialistReview) { return review.decision === "approved" && review.inspection.confirmed && Boolean(review.reviewerId) && /^\d{4}-\d{2}-\d{2}$/.test(review.reviewDate); }
export function validateCanonicalGraph(graph: CanonicalGraph): ValidationResult {
  const issues: ValidationIssue[] = [];
  const add = (code: string, path: string, message: string) => issues.push({ code, path, message });
  const aliases = new Map<string, string>();
  for (const [index, source] of graph.sources.entries()) {
    try { parseCanonicalId(source.sourceId, "SRC_"); } catch { add("invalid_source_id", `sources[${index}].sourceId`, "Invalid source ID"); }
    for (const alias of source.aliases) { const key = `${alias.system}:${alias.value}`; const prior = aliases.get(key); if (prior && prior !== source.sourceId) add("legacy_alias_collision", `sources[${index}].aliases`, `Alias collides with ${prior}`); else aliases.set(key, source.sourceId); }
  }
  const versions = new Map(graph.sourceVersions.map(value => [value.sourceVersionId, value]));
  for (const [index, version] of graph.sourceVersions.entries()) { try { parseCanonicalId(version.sourceVersionId, "SRV_"); parseCanonicalId(version.sourceId, "SRC_"); } catch { add("invalid_source_version", `sourceVersions[${index}]`, "Invalid source-version identity"); } }
  const files = new Map(graph.sourceFiles.map(value => [value.sourceFileId, value]));
  for (const [index, file] of graph.sourceFiles.entries()) { try { parseCanonicalId(file.sourceFileId, "SFL_"); } catch { add("invalid_source_file", `sourceFiles[${index}]`, "Invalid source-file ID"); } if (!versions.has(file.sourceVersionId)) add("source_file_parent_missing", `sourceFiles[${index}].sourceVersionId`, "SourceFile must belong to an existing SourceVersion"); }
  const items = new Map(graph.evidenceItems.map(value => [value.evidenceItemId, value]));
  const locations = new Map(graph.locations.map(value => [value.locationId, value]));
  graph.locations.forEach((location, index) => { for (const issue of validateLocation(location)) issues.push({ ...issue, path: `locations[${index}].${issue.path}` }); if (!files.has(location.sourceFileId)) add("location_file_missing", `locations[${index}].sourceFileId`, "Location must reference an existing SourceFile"); });
  const reviews = new Map(graph.reviews.map(value => [value.reviewId, value]));
  for (const [index, review] of graph.reviews.entries()) { try { parseCanonicalId(review.reviewId, "REV_"); parseEvidenceRevisionReference(review.revisionReference); } catch { add("invalid_review_binding", `reviews[${index}]`, "Review must bind to one exact Evidence Revision"); } if (!specialistDecisions.includes(review.decision)) add("invalid_review_decision", `reviews[${index}].decision`, "Invalid decision"); }
  for (const [index, revision] of graph.evidenceRevisions.entries()) {
    let parsed; try { parsed = parseEvidenceRevisionReference(revision.revisionReference); } catch { add("invalid_revision", `evidenceRevisions[${index}].revisionReference`, "Invalid revision reference"); continue; }
    if (revision.revisionNumber < 1 || !Number.isInteger(revision.revisionNumber) || parsed.revisionNumber !== revision.revisionNumber) add("invalid_revision_number", `evidenceRevisions[${index}].revisionNumber`, "Revision number must be positive and match its reference");
    if (parsed.evidenceItemId !== revision.evidenceItemId || !items.has(revision.evidenceItemId)) add("revision_item_mismatch", `evidenceRevisions[${index}].evidenceItemId`, "Revision must belong to its Evidence Item");
    if (!evidenceAuthorityTypes.includes(revision.authorityType) || !verificationStatuses.includes(revision.verificationStatus)) add("invalid_taxonomy", `evidenceRevisions[${index}]`, "Authority and verification must use separate approved taxonomies");
    if (!evidenceReviewLifecycleStates.includes(revision.reviewLifecycle) || !publicationLifecycleStates.includes(revision.publicationLifecycle)) add("invalid_lifecycle", `evidenceRevisions[${index}]`, "Invalid independent lifecycle state");
    if (revision.predecessor) { const predecessor = parseEvidenceRevisionReference(revision.predecessor); if (predecessor.evidenceItemId !== revision.evidenceItemId || predecessor.revisionNumber >= revision.revisionNumber) add("invalid_predecessor", `evidenceRevisions[${index}].predecessor`, "Correction must preserve a prior revision of the same Evidence Item"); }
    revision.locationIds.forEach(id => { if (!locations.has(id)) add("location_missing", `evidenceRevisions[${index}].locationIds`, "Revision location is missing"); });
    const boundReviews = revision.specialistReviewIds.map(id => reviews.get(id)).filter((value): value is SpecialistReview => Boolean(value));
    for (const review of boundReviews) if (review.revisionReference !== revision.revisionReference) add("review_revision_mismatch", `evidenceRevisions[${index}].specialistReviewIds`, "Approval applies only to the exact revision reviewed");
    const approved = boundReviews.some(reviewEligible);
    if (revision.reviewLifecycle === "approved" && !approved) add("approval_missing", `evidenceRevisions[${index}]`, "Approved lifecycle requires an eligible review bound to this revision");
    if (["release_candidate", "published"].includes(revision.publicationLifecycle) && !approved) add("unapproved_publication", `evidenceRevisions[${index}]`, "Unapproved evidence cannot be publication eligible");
    if (["needs_correction", "excluded"].includes(revision.reviewLifecycle) && revision.publicationLifecycle === "published") add("invalid_publication", `evidenceRevisions[${index}]`, "Correction-required or excluded evidence cannot be published");
    if (revision.verificationStatus === "underlying_primary_evidence_verified" && !graph.referenceChains.some(chain => chain.citingRevision === revision.revisionReference && chain.verifications.some(v => v.verificationStatus === "underlying_primary_evidence_verified" && v.originalSourceConfirmed))) add("primary_verification_not_supported", `evidenceRevisions[${index}].verificationStatus`, "Secondary citation does not imply primary verification");
    const firstLocation = locations.get(revision.locationIds[0]);
    const sourceFile = firstLocation ? files.get(firstLocation.sourceFileId) : undefined;
    if (sourceFile && revision.quotation.hash.algorithm === sourceFile.contentHash.algorithm && revision.quotation.hash.value === sourceFile.contentHash.value) add("hashes_not_separate", `evidenceRevisions[${index}].quotation.hash`, "Source-file and supporting-text hashes must remain separate values");
  }
  for (const correction of graph.corrections) if (!correction.affectedSourceId || (!correction.correctionSourceId && !correction.correctedSourceVersionId)) add("invalid_correction_relationship", "corrections", "Corrections must preserve and link affected and successor identities");
  return { valid: issues.length === 0, issues };
}

export const canonicalTaxonomies = { evidenceAuthorityTypes, specialistDecisions, verificationStatuses, sourceLifecycleStates, evidenceReviewLifecycleStates, publicationLifecycleStates, disputeLifecycleStates, evidencePackLifecycleStates };
