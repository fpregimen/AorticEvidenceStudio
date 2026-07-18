import type { DuplicateCandidate, DuplicateCandidateReport } from "./canonical-evidence/duplicate-candidates.ts";

export const migrationResolutionChoices = ["same_canonical_evidence_item", "keep_separate_evidence_items", "needs_further_review"] as const;
export type MigrationResolution = typeof migrationResolutionChoices[number];
export interface MigrationDecision { candidateId: string; resolution: MigrationResolution; decidedAt: string; sourceId: string; leftLegacyAlias: string; rightLegacyAlias: string; }
export interface MigrationDecisionFile { version: "q02-q03-migration-decisions-v1"; reportVersion: string; updatedAt: string | null; canonicalRecordsCreated: false; canonicalApprovalsCreated: false; automaticMergePerformed: false; decisions: Record<string, MigrationDecision>; }
export interface MigrationCandidateReport extends DuplicateCandidateReport { reportVersion: string; sourceComparisons: Array<{ sourceId: string; q02ReviewId: string; q03ReviewId: string; q02ItemCount: number; q03ItemCount: number; candidateCount: number }>; counts: Record<string, number>; candidates: DuplicateCandidate[]; }
export const migrationCandidateId = (candidate: DuplicateCandidate) => `${candidate.sourceId}::${candidate.left.legacyAlias}::${candidate.right.legacyAlias}`;
const exactFields = ["wording", "quotation", "location", "interpretation", "limitation"];
export function isDeterministicallyExact(candidate: DuplicateCandidate) { return exactFields.every(field => candidate.comparisons.find(comparison => comparison.field === field)?.equal === true); }
export function exactCandidateIds(report: MigrationCandidateReport) { return report.candidates.filter(isDeterministicallyExact).map(migrationCandidateId); }
export function validateResolution(value: unknown): value is MigrationResolution { return typeof value === "string" && migrationResolutionChoices.includes(value as MigrationResolution); }
export function applyIndividualDecision(file: MigrationDecisionFile, report: MigrationCandidateReport, candidateId: string, resolution: MigrationResolution, now: string): MigrationDecisionFile {
  const candidate = report.candidates.find(item => migrationCandidateId(item) === candidateId); if (!candidate) throw new Error("Unknown migration candidate");
  const decision: MigrationDecision = { candidateId, resolution, decidedAt: now, sourceId: candidate.sourceId, leftLegacyAlias: candidate.left.legacyAlias, rightLegacyAlias: candidate.right.legacyAlias };
  return { ...file, updatedAt: now, decisions: { ...file.decisions, [candidateId]: decision }, canonicalRecordsCreated: false, canonicalApprovalsCreated: false, automaticMergePerformed: false };
}
export function applyExactBulkDecision(file: MigrationDecisionFile, report: MigrationCandidateReport, candidateIds: string[], confirmed: boolean, now: string): MigrationDecisionFile {
  if (!confirmed) throw new Error("Explicit bulk confirmation is required"); const allowed = new Set(exactCandidateIds(report));
  if (!candidateIds.length || candidateIds.some(id => !allowed.has(id)) || candidateIds.length !== allowed.size) throw new Error("Bulk confirmation must list every and only deterministically exact candidate");
  return candidateIds.reduce((current, id) => applyIndividualDecision(current, report, id, "same_canonical_evidence_item", now), file);
}
