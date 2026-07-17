import { validIsoDate, type ItemReviewDecision, type SpecialistValidation } from "./content-review-model.ts";

export type BulkReviewScope = "pending-without-reviewer" | "all-pending" | "all-items";
export interface BulkReviewInformation { reviewer_name: string; review_date: string; original_source_confirmed: boolean }
export interface BulkReviewPreview { claimsUpdated: number; outcomesUpdated: number; preserved: number; reviewerRecordsReplaced: number }
export interface BulkReviewApplication { validation: SpecialistValidation; summary: BulkReviewPreview }

export function bulkReviewInformationIsValid(information: BulkReviewInformation) {
  return Boolean(information.reviewer_name.trim() && validIsoDate(information.review_date) && information.original_source_confirmed);
}
function hasReviewerInformation(decision: ItemReviewDecision) { return Boolean(decision.reviewer_name.trim() || decision.review_date.trim() || decision.original_source_confirmed) }
function matchesScope(decision: ItemReviewDecision, scope: BulkReviewScope) { if(scope==="all-items")return true;if(decision.status!=="Pending")return false;return scope==="all-pending"||!hasReviewerInformation(decision) }
function informationDiffers(decision: ItemReviewDecision, information: BulkReviewInformation) { return decision.reviewer_name!==information.reviewer_name.trim()||decision.review_date!==information.review_date||decision.original_source_confirmed!==information.original_source_confirmed }
export function previewBulkReviewInformation(validation: SpecialistValidation, information: BulkReviewInformation, scope: BulkReviewScope): BulkReviewPreview {
  const preview={claimsUpdated:0,outcomesUpdated:0,preserved:0,reviewerRecordsReplaced:0};
  for(const [kind,decisions] of Object.entries(validation) as ["claims"|"outcomes",Record<string,ItemReviewDecision>][])for(const decision of Object.values(decisions)){if(!matchesScope(decision,scope)){preview.preserved++;continue}if(kind==="claims")preview.claimsUpdated++;else preview.outcomesUpdated++;if(hasReviewerInformation(decision)&&informationDiffers(decision,information))preview.reviewerRecordsReplaced++}return preview;
}
export function applyBulkReviewInformation(validation: SpecialistValidation, information: BulkReviewInformation, scope: BulkReviewScope, allItemsOverwriteConfirmed=false): BulkReviewApplication {
  if(!bulkReviewInformationIsValid(information))throw new Error("Valid reviewer name, review date, and original-source confirmation are required.");
  if(scope==="all-items"&&!allItemsOverwriteConfirmed)throw new Error("Explicit confirmation is required to replace completed-item reviewer information.");
  const summary=previewBulkReviewInformation(validation,information,scope);const applyTo=(decisions:Record<string,ItemReviewDecision>)=>Object.fromEntries(Object.entries(decisions).map(([id,decision])=>[id,matchesScope(decision,scope)?{...decision,reviewer_name:information.reviewer_name.trim(),review_date:information.review_date,original_source_confirmed:information.original_source_confirmed}:decision]));
  return{validation:{claims:applyTo(validation.claims),outcomes:applyTo(validation.outcomes)},summary};
}
