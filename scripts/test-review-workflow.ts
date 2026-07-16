import assert from "node:assert/strict";
import type { ContentReview, ExtractedClaim, OutcomeData } from "../lib/content-review-model.ts";
import { finalizationPreflight, loadReviewWorkflowContext, parseGitPorcelain, requireSingleSourceId, unrelatedGitChanges } from "../lib/review-workflow.ts";

const root = process.cwd();
const context = await loadReviewWorkflowContext(root, "AES-REG-001");
assert.equal(context.sourceId, "AES-REG-001", "A registered source ID is accepted");
await assert.rejects(() => loadReviewWorkflowContext(root, "AES-REG-999"), /Unknown or unsupported/, "An unknown source ID is rejected");
for (const unsafe of ["../AES-REG-001", "AES-REG-001/../../etc", "AES-REG-001%2F..%2F.."]){
  assert.throws(() => requireSingleSourceId([unsafe]), /Unsafe or invalid/, `Path traversal is rejected: ${unsafe}`);
}

const claim: ExtractedClaim = {
  claim_id: "TEST-C01", claim_text: "Test", evidence_category: "Test", exact_supporting_text: "Support", page: "1", section: null, table: null, figure: null, source_location_note: null, direct_or_indirect: "Direct", confidence: "High", verified_by_reviewer: false, suitable_for_generated_answer: false,
};
const outcome: OutcomeData = {
  outcome_id: "TEST-O01", outcome_name: "Outcome", population: "Population", intervention: "Intervention", comparator: null, follow_up: "1 year", result_text: "Result", numeric_result: "1", page_or_location: "p. 1", verified_by_reviewer: false,
};
const review: ContentReview = {
  review_id: "TEST", evaluation_question_number: 2, question: "Question", source_id: "AES-REG-001", review_status: "In review", reviewer: null, review_date: null, source_access_type: null, source_version_or_date: null, relevant_sections: [], extracted_claims: [claim], guideline_recommendations: [], outcome_data: [outcome], limitations: [], contradictions: [], reviewer_notes: null, last_updated: "2026-07-15",
  specialist_validation: { claims: { "TEST-C01": { status: "Pending", reviewer_name: "", review_date: "", original_source_confirmed: false, reviewer_note: "" } }, outcomes: { "outcome-1": { status: "Pending", reviewer_name: "", review_date: "", original_source_confirmed: false, reviewer_note: "" } } },
};
const expected = "database/content_reviews/Q02_AES-REG-001.json";
const cleanChange = parseGitPorcelain(` M ${expected}\n`);
assert.equal(finalizationPreflight(review, cleanChange, expected).ok, false, "An incomplete review fails finalization preflight");
assert.deepEqual(unrelatedGitChanges(parseGitPorcelain(` M ${expected}\n?? notes.txt\n`), expected).map((change) => change.path), ["notes.txt"], "Unrelated changes are detected");
const complete: ContentReview = structuredClone(review);
complete.specialist_validation!.claims["TEST-C01"] = { status: "Approved", reviewer_name: "Specialist", review_date: "2026-07-15", original_source_confirmed: true, reviewer_note: "" };
complete.specialist_validation!.outcomes["outcome-1"] = { status: "Excluded", reviewer_name: "Specialist", review_date: "2026-07-15", original_source_confirmed: true, reviewer_note: "Not applicable" };
assert.equal(finalizationPreflight(complete, cleanChange, expected).ok, true, "A complete review with only the expected file changed passes preflight");
assert.equal(finalizationPreflight(complete, parseGitPorcelain(` M ${expected}\n?? notes.txt\n`), expected).ok, false, "Unrelated changes block an otherwise successful preflight");
complete.extracted_claims[0].suitable_for_generated_answer = true;
assert.equal(finalizationPreflight(complete, cleanChange, expected).ok, false, "Finalization rejects suitable_for_generated_answer=true");

console.log("Review workflow tests: 10 passed");
