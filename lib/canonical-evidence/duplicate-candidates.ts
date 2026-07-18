import type { LegacyCandidateItem, LegacyCompatibilityResult } from "./legacy-compatibility.ts";

export type DuplicateCandidateClass = "likely_equivalent" | "related_but_not_equivalent" | "conflicting" | "insufficient_information";
export interface FieldDifference { field: "wording" | "quotation" | "location" | "interpretation" | "limitation" | "reviewer" | "review_date" | "decision" | "verification_status"; left: unknown; right: unknown; }
export interface FieldComparison extends FieldDifference { equal: boolean; }
export interface DuplicateCandidate { sourceId: string; left: { questionId: string; itemId: string; legacyAlias: string }; right: { questionId: string; itemId: string; legacyAlias: string }; classification: DuplicateCandidateClass; comparisons: FieldComparison[]; differences: FieldDifference[]; requiresManualResolution: true; merged: false; }
export interface DuplicateCandidateReport { generatedFrom: "read_only_legacy_candidates"; candidates: DuplicateCandidate[]; mergePerformed: false; }
const normalize = (value: string) => value.normalize("NFC").replace(/\s+/g, " ").trim().toLowerCase();
function comparisons(left: LegacyCandidateItem, right: LegacyCandidateItem): FieldComparison[] {
  const pairs: Array<[FieldDifference["field"], unknown, unknown]> = [["wording", left.wording, right.wording], ["quotation", left.supportingText, right.supportingText], ["location", left.sourceLocation, right.sourceLocation], ["interpretation", left.interpretation, right.interpretation], ["limitation", left.limitations, right.limitations], ["reviewer", left.reviewerName, right.reviewerName], ["review_date", left.reviewDate, right.reviewDate], ["decision", left.effectiveLegacyDecision, right.effectiveLegacyDecision], ["verification_status", left.verificationStatus, right.verificationStatus]];
  return pairs.map(([field, a, b]) => ({ field, left: a, right: b, equal: JSON.stringify(a) === JSON.stringify(b) }));
}
function classify(left: LegacyCandidateItem, right: LegacyCandidateItem): DuplicateCandidateClass | null {
  const sameSupport = Boolean(left.supportingText && normalize(left.supportingText) === normalize(right.supportingText)); const sameWording = normalize(left.wording) === normalize(right.wording); const sameLocation = normalize(left.sourceLocation) === normalize(right.sourceLocation);
  const incomplete = !left.wording || !right.wording || !left.supportingText || !right.supportingText || !left.sourceLocation || !right.sourceLocation;
  if (incomplete && (sameSupport || sameWording || sameLocation || left.legacyItemId === right.legacyItemId)) return "insufficient_information";
  if (sameSupport && sameWording && sameLocation) return "likely_equivalent";
  if (sameSupport || (sameWording && sameLocation)) return "likely_equivalent";
  const leftTerms = new Set(normalize(left.wording).split(" ").filter(term => term.length > 3)); const rightTerms = new Set(normalize(right.wording).split(" ").filter(term => term.length > 3)); const overlap = [...rightTerms].filter(term => leftTerms.has(term)).length; const overlapRatio = overlap / Math.max(1, Math.min(leftTerms.size, rightTerms.size));
  if (overlap >= 6 && overlapRatio >= 0.55 && left.kind === right.kind) return "related_but_not_equivalent";
  if ((sameLocation || left.legacyItemId === right.legacyItemId) && left.kind === right.kind) return "conflicting";
  return null;
}
export function generateDuplicateCandidateReport(left: LegacyCompatibilityResult, right: LegacyCompatibilityResult): DuplicateCandidateReport {
  if (left.sourceId !== right.sourceId) throw new Error("Duplicate comparison requires the same source");
  const candidates: DuplicateCandidate[] = [];
  for (const a of left.candidates) for (const b of right.candidates) { const compared = comparisons(a, b); const diff = compared.filter(comparison => !comparison.equal).map(({ field, left: leftValue, right: rightValue }) => ({ field, left: leftValue, right: rightValue })); const classification = classify(a, b); if (classification) candidates.push({ sourceId: left.sourceId, left: { questionId: a.questionId, itemId: a.legacyItemId, legacyAlias: a.alias.value }, right: { questionId: b.questionId, itemId: b.legacyItemId, legacyAlias: b.alias.value }, classification, comparisons: compared, differences: diff, requiresManualResolution: true, merged: false }); }
  return { generatedFrom: "read_only_legacy_candidates", candidates, mergePerformed: false };
}
export function duplicateReportToMarkdown(report: DuplicateCandidateReport) {
  const lines = ["# Canonical duplicate-candidate report", "", "Read-only report. No merge or medical decision was performed.", ""];
  for (const candidate of report.candidates) { lines.push(`## ${candidate.classification}: ${candidate.left.questionId}/${candidate.left.itemId} ↔ ${candidate.right.questionId}/${candidate.right.itemId}`, "", `Source: ${candidate.sourceId}`, "", `Legacy provenance: ${candidate.left.legacyAlias} ↔ ${candidate.right.legacyAlias}`, "", "Manual resolution required: Yes", "", ...candidate.comparisons.map(comparison => `- ${comparison.field} (${comparison.equal ? "same" : "different"}): ${JSON.stringify(comparison.left)} → ${JSON.stringify(comparison.right)}`), ""); }
  return lines.join("\n");
}
