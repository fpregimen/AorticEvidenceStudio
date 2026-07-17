import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { applyBulkReviewInformation, bulkReviewInformationIsValid, previewBulkReviewInformation } from "../lib/bulk-review-information.ts";
import type { ContentReview, ItemReviewDecision, SpecialistValidation } from "../lib/content-review-model.ts";

const pending=(name="",date="",confirmed=false,note="pending note"):ItemReviewDecision=>({status:"Pending",reviewer_name:name,review_date:date,original_source_confirmed:confirmed,reviewer_note:note});
const approved:ItemReviewDecision={status:"Approved",reviewer_name:"Reviewer A",review_date:"2026-07-01",original_source_confirmed:true,reviewer_note:"approved note"};
const excluded:ItemReviewDecision={status:"Excluded",reviewer_name:"Reviewer A",review_date:"2026-07-02",original_source_confirmed:true,reviewer_note:"excluded note"};
const original:SpecialistValidation={claims:{empty:pending(),partial:pending("Reviewer A"),approved,excluded},outcomes:{empty:pending("","",false,"outcome note"),assigned:pending("Reviewer A","2026-07-03",true)}};
const info={reviewer_name:"Reviewer B",review_date:"2026-07-17",original_source_confirmed:true};

const defaultPreview=previewBulkReviewInformation(original,info,"pending-without-reviewer");
assert.deepEqual(defaultPreview,{claimsUpdated:1,outcomesUpdated:1,preserved:4,reviewerRecordsReplaced:0});
const defaultResult=applyBulkReviewInformation(original,info,"pending-without-reviewer").validation;
assert.equal(defaultResult.claims.empty.reviewer_name,"Reviewer B");assert.equal(defaultResult.outcomes.empty.reviewer_name,"Reviewer B");
assert.deepEqual(defaultResult.claims.partial,original.claims.partial);assert.deepEqual(defaultResult.outcomes.assigned,original.outcomes.assigned);
assert.deepEqual(defaultResult.claims.approved,approved);assert.deepEqual(defaultResult.claims.excluded,excluded);

const pendingResult=applyBulkReviewInformation(original,info,"all-pending").validation;
for(const decision of [pendingResult.claims.empty,pendingResult.claims.partial,pendingResult.outcomes.empty,pendingResult.outcomes.assigned]){assert.equal(decision.reviewer_name,"Reviewer B");assert.equal(decision.status,"Pending")}
assert.deepEqual(pendingResult.claims.approved,approved);assert.deepEqual(pendingResult.claims.excluded,excluded);
assert.equal(pendingResult.claims.empty.reviewer_note,"pending note");assert.equal(pendingResult.outcomes.empty.reviewer_note,"outcome note");

assert.throws(()=>applyBulkReviewInformation(original,info,"all-items"),/Explicit confirmation/);
const allResult=applyBulkReviewInformation(original,info,"all-items",true).validation;
assert.equal(allResult.claims.approved.status,"Approved");assert.equal(allResult.claims.excluded.status,"Excluded");
assert.equal(allResult.claims.approved.reviewer_name,"Reviewer B");assert.equal(allResult.claims.excluded.reviewer_name,"Reviewer B");
assert.equal(allResult.claims.approved.reviewer_note,"approved note");assert.equal(allResult.claims.excluded.reviewer_note,"excluded note");

for(const invalid of [{...info,reviewer_name:" "},{...info,review_date:"2026-02-30"},{...info,original_source_confirmed:false}]){assert.equal(bulkReviewInformationIsValid(invalid),false);assert.throws(()=>applyBulkReviewInformation(original,invalid,"all-pending"),/Valid reviewer/)}

const review=JSON.parse(await readFile(new URL("../database/content_reviews/Q03_AES-GDL-001.json",import.meta.url),"utf8")) as ContentReview;
const contentBefore=JSON.stringify({claims:review.extracted_claims,outcomes:review.outcome_data,reviewStatus:review.review_status});
const decisionsBefore=Object.fromEntries(Object.entries(review.specialist_validation!.claims).map(([id,decision])=>[id,decision.status]));
const appliedToReview=structuredClone(review);appliedToReview.specialist_validation=applyBulkReviewInformation(review.specialist_validation!,info,"all-pending").validation;
assert.equal(JSON.stringify({claims:appliedToReview.extracted_claims,outcomes:appliedToReview.outcome_data,reviewStatus:appliedToReview.review_status}),contentBefore);
assert.ok(appliedToReview.extracted_claims.every(claim=>!claim.verified_by_reviewer&&!claim.suitable_for_generated_answer));
assert.ok(appliedToReview.outcome_data.every(outcome=>!outcome.verified_by_reviewer));
assert.deepEqual(Object.fromEntries(Object.entries(appliedToReview.specialist_validation!.claims).map(([id,decision])=>[id,decision.status])),decisionsBefore);

const component=await readFile(new URL("../components/bulk-review-information.tsx",import.meta.url),"utf8"),detail=await readFile(new URL("../components/review-detail-client.tsx",import.meta.url),"utf8");
assert.match(component,/pending-without-reviewer/);assert.match(component,/all-pending/);assert.match(component,/all-items/);assert.match(component,/window\.confirm/);assert.match(component,/Save review/);
assert.doesNotMatch(component,/Approve all|Exclude all|localStorage/);assert.match(detail,/BulkReviewInformation/);assert.match(detail,/Reviewer note/);

const q02=JSON.parse(await readFile(new URL("../database/content_reviews/Q02_AES-RCT-001.json",import.meta.url),"utf8")) as ContentReview,q02Before=JSON.stringify(q02);
assert.equal(JSON.stringify(q02),q02Before,"loading the reusable control does not mutate Q02 records");
console.log("Bulk review-information tests: 45 passed");
