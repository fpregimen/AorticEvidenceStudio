import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { reviewListAggregation } from "../lib/approval-completeness.ts";
import { reviewDecisionCounts } from "../lib/review-workflow.ts";
import type { ContentReview, ExtractedClaim, ItemReviewDecision, OutcomeData } from "../lib/content-review-model.ts";

const load = async (name: string) => JSON.parse(await readFile(new URL(`../database/content_reviews/${name}.json`, import.meta.url), "utf8")) as ContentReview;

for (const [name, approved] of [["Q03_AES-GDL-001", 14], ["Q03_AES-GDL-002", 15], ["Q03_AES-GDL-003", 16]] as const) {
  const review = await load(name), ui = reviewListAggregation(review), authoritative = reviewDecisionCounts(review);
  assert.deepEqual(ui.decisions, authoritative, `${name} UI and authoritative aggregation match`);
  assert.equal(authoritative.approved, approved, `${name} authoritative approved count`);
  assert.equal(ui.claims.Approved, approved, `${name} approved record is fully approved in the UI`);
  assert.equal(ui.claims.Pending, 0, `${name} approved record is not displayed as Pending`);
  assert.equal(ui.claims["Approval incomplete"], 0, `${name} approved metadata is complete`);
}

const gdl004 = await load("Q03_AES-GDL-004"), gdl004Ui = reviewListAggregation(gdl004), gdl004Authoritative = reviewDecisionCounts(gdl004);
assert.deepEqual(gdl004Ui.decisions, gdl004Authoritative, "Q03 AES-GDL-004 UI and authoritative aggregation match");
assert.equal(gdl004Ui.claims.Pending, 18, "Q03 AES-GDL-004 remains Pending before specialist review");
assert.equal(gdl004Ui.claims.Approved, 0);

const q02 = await load("Q02_AES-RCT-001"), q02Ui = reviewListAggregation(q02), q02Authoritative = reviewDecisionCounts(q02);
assert.deepEqual(q02Ui.decisions, q02Authoritative, "Q02 decision counts remain compatible");
assert.equal(Object.values(q02Ui.claims).reduce((sum, value) => sum + value, 0), q02.extracted_claims.length, "all legacy Q02 claims are counted");

const claim = (id: string): ExtractedClaim => ({ claim_id: id, claim_text: id, evidence_category: "Test", exact_supporting_text: "Supporting text", page: "p. 1", section: null, table: null, figure: null, source_location_note: null, direct_or_indirect: "Direct", confidence: "Test", verified_by_reviewer: false, suitable_for_generated_answer: false });
const outcome = (id: string, location: string | null): OutcomeData => ({ outcome_id: id, outcome_name: id, population: "Test", intervention: "Test", comparator: null, follow_up: null, result_text: "Result", numeric_result: null, page_or_location: location, verified_by_reviewer: false });
const decision = (status: ItemReviewDecision["status"], complete = true): ItemReviewDecision => ({ status, reviewer_name: complete ? "Reviewer" : "", review_date: complete ? "2026-07-17" : "", original_source_confirmed: complete, reviewer_note: status === "Needs correction" ? "Correction required" : status === "Excluded" ? "Excluded by reviewer" : "" });
const synthetic: ContentReview = {
  review_id: "SYNTHETIC-AGGREGATION", evaluation_question_number: 3, question: "Synthetic aggregation test", source_id: "SYNTHETIC", review_status: "In review", reviewer: null, review_date: null, source_access_type: null, source_version_or_date: null, relevant_sections: [], extracted_claims: [claim("pending"), claim("correction"), claim("excluded"), claim("approved-incomplete"), claim("approved")], guideline_recommendations: [], outcome_data: [outcome("outcome-complete", "p. 2"), outcome("outcome-incomplete", null)], limitations: [], contradictions: [], reviewer_notes: null, last_updated: "2026-07-17",
  specialist_validation: { claims: { pending: decision("Pending", false), correction: decision("Needs correction"), excluded: decision("Excluded"), "approved-incomplete": decision("Approved", false), approved: decision("Approved") }, outcomes: { "outcome-1": decision("Approved"), "outcome-2": decision("Approved") } },
};
const syntheticCounts = reviewListAggregation(synthetic);
assert.deepEqual(syntheticCounts.claims, { Pending: 1, Approved: 1, "Approval incomplete": 1, "Needs correction": 1, Excluded: 1 });
assert.deepEqual(syntheticCounts.outcomes, { Pending: 0, Approved: 1, "Approval incomplete": 1, "Needs correction": 0, Excluded: 0 });
assert.deepEqual(syntheticCounts.decisions, { approved: 4, correctionRequired: 1, pending: 1, excluded: 1, total: 7 });

console.log("Review-list aggregation tests: 25 passed");
