import type { LegacyCandidateItem, LegacyCompatibilityResult } from "./legacy-compatibility.ts";

export type DuplicateCandidateClass = "exact_candidate" | "probable_candidate" | "related_not_identical" | "conflict";
export interface FieldDifference { field: "wording" | "location" | "interpretation" | "limitation" | "reviewer" | "status"; left: unknown; right: unknown; }
export interface DuplicateCandidate { sourceId: string; left: { questionId: string; itemId: string }; right: { questionId: string; itemId: string }; classification: DuplicateCandidateClass; differences: FieldDifference[]; requiresManualResolution: true; merged: false; }
export interface DuplicateCandidateReport { generatedFrom: "read_only_legacy_candidates"; candidates: DuplicateCandidate[]; mergePerformed: false; }
const normalize = (value: string) => value.normalize("NFC").replace(/\s+/g, " ").trim().toLowerCase();
function differences(left: LegacyCandidateItem, right: LegacyCandidateItem): FieldDifference[] {
  const pairs: Array<[FieldDifference["field"], unknown, unknown]> = [["wording", left.wording, right.wording], ["location", left.sourceLocation, right.sourceLocation], ["interpretation", left.interpretation, right.interpretation], ["limitation", left.limitations, right.limitations], ["reviewer", { name: left.reviewerName, date: left.reviewDate, confirmed: left.originalSourceConfirmed }, { name: right.reviewerName, date: right.reviewDate, confirmed: right.originalSourceConfirmed }], ["status", left.effectiveLegacyDecision, right.effectiveLegacyDecision]];
  return pairs.filter(([, a, b]) => JSON.stringify(a) !== JSON.stringify(b)).map(([field, a, b]) => ({ field, left: a, right: b }));
}
function classify(left: LegacyCandidateItem, right: LegacyCandidateItem, diff: FieldDifference[]): DuplicateCandidateClass | null {
  const sameSupport = Boolean(left.supportingText && normalize(left.supportingText) === normalize(right.supportingText)); const sameWording = normalize(left.wording) === normalize(right.wording); const sameLocation = normalize(left.sourceLocation) === normalize(right.sourceLocation);
  if (sameSupport && sameWording && sameLocation) return diff.length ? "probable_candidate" : "exact_candidate";
  if (sameSupport || (sameWording && sameLocation)) return "probable_candidate";
  const sharedTerms = new Set(normalize(left.wording).split(" ")); const overlap = normalize(right.wording).split(" ").filter(term => sharedTerms.has(term)).length;
  if (overlap >= 4 && left.kind === right.kind) return "related_not_identical";
  if ((sameLocation || left.legacyItemId === right.legacyItemId) && left.kind === right.kind) return "conflict";
  return null;
}
export function generateDuplicateCandidateReport(left: LegacyCompatibilityResult, right: LegacyCompatibilityResult): DuplicateCandidateReport {
  if (left.sourceId !== right.sourceId) throw new Error("Duplicate comparison requires the same source");
  const candidates: DuplicateCandidate[] = [];
  for (const a of left.candidates) for (const b of right.candidates) { const diff = differences(a, b); const classification = classify(a, b, diff); if (classification) candidates.push({ sourceId: left.sourceId, left: { questionId: a.questionId, itemId: a.legacyItemId }, right: { questionId: b.questionId, itemId: b.legacyItemId }, classification, differences: diff, requiresManualResolution: true, merged: false }); }
  return { generatedFrom: "read_only_legacy_candidates", candidates, mergePerformed: false };
}
export function duplicateReportToMarkdown(report: DuplicateCandidateReport) {
  const lines = ["# Canonical duplicate-candidate report", "", "Read-only report. No merge or medical decision was performed.", ""];
  for (const candidate of report.candidates) { lines.push(`## ${candidate.classification}: ${candidate.left.questionId}/${candidate.left.itemId} ↔ ${candidate.right.questionId}/${candidate.right.itemId}`, "", `Source: ${candidate.sourceId}`, "", "Manual resolution required: Yes", "", ...candidate.differences.map(diff => `- ${diff.field}: ${JSON.stringify(diff.left)} → ${JSON.stringify(diff.right)}`), ""); }
  return lines.join("\n");
}
