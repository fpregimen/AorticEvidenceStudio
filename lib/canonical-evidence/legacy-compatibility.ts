import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ContentReview, ItemReviewDecision } from "../content-review-model.ts";
import { outcomeReviewId } from "../content-review-model.ts";
import { expectedReviewFilename } from "../review-source-validation.ts";
import type { LegacyAlias, SpecialistDecision } from "./types.ts";

export interface LegacyCandidateItem {
  questionId: string; sourceId: string; legacyItemId: string; kind: "claim" | "outcome";
  alias: LegacyAlias; wording: string; supportingText: string; sourceLocation: string;
  interpretation: string; limitations: string[]; effectiveLegacyDecision: SpecialistDecision;
  reviewerName: string; reviewDate: string; originalSourceConfirmed: boolean;
  unmappedFields: Record<string, unknown>; canonicalApprovalCreated: false;
}
export interface LegacyCompatibilityResult { questionId: string; sourceId: string; reviewId: string; candidates: LegacyCandidateItem[]; unmappedReviewFields: Record<string, unknown>; }
const decisionMap: Record<string, SpecialistDecision> = { Pending: "pending", Approved: "approved", "Needs correction": "needs_correction", Excluded: "excluded" };
function mappedDecision(explicit: ItemReviewDecision | undefined, embedded?: string, reviewer?: string | null, date?: string | null, confirmed = false) {
  return { decision: decisionMap[explicit?.status ?? embedded ?? "Pending"] ?? "pending", reviewerName: explicit?.reviewer_name ?? reviewer ?? "", reviewDate: explicit?.review_date ?? date ?? "", originalSourceConfirmed: explicit?.original_source_confirmed ?? confirmed };
}
function without(record: Record<string, unknown>, keys: string[]) { return Object.fromEntries(Object.entries(record).filter(([key]) => !keys.includes(key))); }
export function adaptLegacyReviewReadOnly(questionId: string, review: ContentReview): LegacyCompatibilityResult {
  const candidates: LegacyCandidateItem[] = review.extracted_claims.map(claim => {
    const effective = mappedDecision(review.specialist_validation?.claims[claim.claim_id], claim.validation_decision, claim.reviewer, claim.review_date, claim.verified_by_reviewer);
    return { questionId, sourceId: review.source_id, legacyItemId: claim.claim_id, kind: "claim", alias: { system: "question_review", value: `${review.review_id}:${claim.claim_id}` }, wording: claim.claim_text ?? "", supportingText: claim.exact_supporting_text ?? "", sourceLocation: [claim.page, claim.section, claim.table, claim.figure, claim.source_location_note].filter(Boolean).join(" | "), interpretation: claim.direct_or_indirect ?? "", limitations: [...review.limitations], effectiveLegacyDecision: effective.decision, reviewerName: effective.reviewerName, reviewDate: effective.reviewDate, originalSourceConfirmed: effective.originalSourceConfirmed, unmappedFields: without(claim as unknown as Record<string, unknown>, ["claim_id", "claim_text", "exact_supporting_text", "page", "section", "table", "figure", "source_location_note", "direct_or_indirect", "validation_decision", "reviewer", "review_date", "verified_by_reviewer"]), canonicalApprovalCreated: false };
  });
  review.outcome_data.forEach((outcome, index) => {
    const id = outcome.outcome_id ?? outcomeReviewId(index); const effective = mappedDecision(review.specialist_validation?.outcomes[id] ?? review.specialist_validation?.outcomes[outcomeReviewId(index)], outcome.validation_decision, outcome.reviewer, outcome.review_date, outcome.verified_by_reviewer);
    candidates.push({ questionId, sourceId: review.source_id, legacyItemId: id, kind: "outcome", alias: { system: "question_review", value: `${review.review_id}:${id}` }, wording: outcome.result_text ?? outcome.outcome_name ?? "", supportingText: outcome.result_text ?? "", sourceLocation: outcome.page_or_location ?? "", interpretation: [outcome.population, outcome.intervention, outcome.comparator, outcome.follow_up].filter(Boolean).join(" | "), limitations: [...review.limitations], effectiveLegacyDecision: effective.decision, reviewerName: effective.reviewerName, reviewDate: effective.reviewDate, originalSourceConfirmed: effective.originalSourceConfirmed, unmappedFields: without(outcome as unknown as Record<string, unknown>, ["outcome_id", "outcome_name", "result_text", "page_or_location", "population", "intervention", "comparator", "follow_up", "validation_decision", "reviewer", "review_date", "verified_by_reviewer"]), canonicalApprovalCreated: false });
  });
  return { questionId, sourceId: review.source_id, reviewId: review.review_id, candidates, unmappedReviewFields: { study_characteristics: review.study_characteristics, source_identity_validation: review.source_identity_validation, guideline_recommendations: review.guideline_recommendations, contradictions: review.contradictions, reviewer_notes: review.reviewer_notes, source_access_type: review.source_access_type, source_version_or_date: review.source_version_or_date, relevant_sections: review.relevant_sections, review_status: review.review_status, last_updated: review.last_updated } };
}
export async function readLegacyReviewReadOnly(root: string, questionId: string, sourceId: string) {
  const filename = expectedReviewFilename(questionId, sourceId); const directory = path.resolve(root, "database", "content_reviews"); const target = path.resolve(directory, filename);
  if (path.dirname(target) !== directory) throw new Error("Unsafe review path");
  const review = JSON.parse(await readFile(target, "utf8")) as ContentReview;
  if (review.source_id !== sourceId) throw new Error("Cross-source review mismatch");
  return adaptLegacyReviewReadOnly(questionId, review);
}
