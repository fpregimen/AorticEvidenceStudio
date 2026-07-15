import "server-only";
import { copyFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ContentReview, ValidationDecision } from "./content-review-model";
import { approvalStatus } from "./approval-completeness";

export const supportedSourceIds = ["AES-RCT-001", "AES-RCT-002", "AES-RCT-003"] as const;
export type SupportedSourceId = (typeof supportedSourceIds)[number];

const root = process.cwd();
const reviewDir = path.join(root, "database", "content_reviews");
const backupDir = path.join(root, "database", "local_backups");
const auditDir = path.join(root, "database", "local_audit");
const isoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
const safeStamp = () => new Date().toISOString().replaceAll(":", "-");

export function isSupportedSourceId(value: string): value is SupportedSourceId {
  return supportedSourceIds.includes(value as SupportedSourceId);
}

export interface ItemUpdate {
  itemType: "claim" | "outcome";
  itemId: string;
  decision: ValidationDecision;
  reviewer: string;
  reviewDate: string;
  reviewerNote: string;
  confirmed: boolean;
}

function fieldError(fields:Record<string,string>){const error=new Error("Validation requirements are incomplete.")as Error&{fields:Record<string,string>};error.fields=fields;throw error}
function validateInput(input: ItemUpdate) {
  if (!["claim", "outcome"].includes(input.itemType) || !input.itemId || !["Pending","Approved", "Needs correction", "Excluded"].includes(input.decision)) throw new Error("Malformed validation request.");
  if(input.decision==="Pending")return;const fields:Record<string,string>={};if(!input.reviewer?.trim())fields.reviewer="Reviewer is required.";if(!isoDate(input.reviewDate))fields.reviewDate="A valid review date is required.";if(input.decision==="Approved"&&!input.confirmed)fields.confirmed="Original-source confirmation is required.";if(["Needs correction","Excluded"].includes(input.decision)&&!input.reviewerNote?.trim())fields.reviewerNote=input.decision==="Excluded"?"An exclusion reason is required.":"A correction note is required.";if(Object.keys(fields).length)fieldError(fields)
}

async function assertSynthesisIsEditable() {
  const synthesis = JSON.parse(await readFile(path.join(root, "database/synthesis_drafts/Q02_PREEMPTIVE_TEVAR_DRAFT.json"), "utf8")) as { synthesis_validation_decision?: string };
  if (synthesis.synthesis_validation_decision === "Approved") throw new Error("Return the approved synthesis for correction before changing a source decision.");
}

async function atomicJsonUpdate(target: string, value: unknown, audit: Record<string, unknown>) {
  await mkdir(backupDir, { recursive: true });
  await mkdir(auditDir, { recursive: true });
  const stamp = safeStamp();
  const base = path.basename(target, ".json");
  await copyFile(target, path.join(backupDir, `${base}_${stamp}.json`));
  const serialized = JSON.stringify(value, null, 2) + "\n";
  JSON.parse(serialized);
  const temporary = path.join(path.dirname(target), `.${base}.${stamp}.tmp`);
  await writeFile(temporary, serialized, { encoding: "utf8", flag: "wx" });
  await rename(temporary, target);
  await writeFile(path.join(auditDir, `${stamp}_${base}.json`), JSON.stringify(audit, null, 2) + "\n", { encoding: "utf8", flag: "wx" });
}

export async function updateReviewItem(sourceId: string, input: ItemUpdate) {
  if (!isSupportedSourceId(sourceId)) throw new Error("Unsupported source ID.");
  validateInput(input);
  await assertSynthesisIsEditable();
  const target = path.join(reviewDir, `Q02_${sourceId}.json`);
  const review = JSON.parse(await readFile(target, "utf8")) as ContentReview;
  let previous = "Pending";
  if (input.itemType === "claim") {
    const item = review.extracted_claims.find((candidate) => candidate.claim_id === input.itemId);
    if (!item) throw new Error("Claim not found.");if(input.decision==="Approved"){const fields:Record<string,string>={};if(!item.exact_supporting_text?.trim())fields.exact_supporting_text="Exact supporting text is required.";if(![item.page,item.section,item.table,item.figure,item.source_location_note].some(v=>v?.trim()))fields.source_location="A source location is required.";if(Object.keys(fields).length)fieldError(fields)}
    previous = item.validation_decision ?? "Pending";
    Object.assign(item, { validation_decision: input.decision, reviewer: input.reviewer.trim()||null, review_date: input.reviewDate||null, reviewer_note: input.reviewerNote.trim() || null, verified_by_reviewer: input.decision==="Approved"&&input.confirmed, suitable_for_generated_answer: false });
  } else {
    const index = review.outcome_data.findIndex((item, itemIndex) => (item.outcome_id ?? `${sourceId}-O${String(itemIndex + 1).padStart(2, "0")}`) === input.itemId);
    if (index < 0) throw new Error("Outcome not found.");
    const item = review.outcome_data[index];
    if(input.decision==="Approved"){const fields:Record<string,string>={};if(!item.page_or_location?.trim())fields.source_location="A source location is required.";if(!item.outcome_name?.trim())fields.outcome_name="Outcome name is required.";if(!item.result_text?.trim()&&(item.numeric_result===null||item.numeric_result===""))fields.result="Result text or a numeric result is required.";if(Object.keys(fields).length)fieldError(fields)}
    previous = item.validation_decision ?? "Pending";
    Object.assign(item, { outcome_id: input.itemId, validation_decision: input.decision, reviewer: input.reviewer.trim()||null, review_date: input.reviewDate||null, reviewer_note: input.reviewerNote.trim() || null, verified_by_reviewer: input.decision==="Approved"&&input.confirmed });
  }
  review.reviewer = input.reviewer.trim();
  review.review_date = input.reviewDate;
  review.last_updated = input.reviewDate;
  const statuses=[...review.extracted_claims,...review.outcome_data].map(approvalStatus);
  review.review_status = statuses.includes("Needs correction")||statuses.includes("Approval incomplete") ? "Requires correction" : statuses.every((status) => status !== "Pending") ? "Specialist validated" : "In review";
  await atomicJsonUpdate(target, review, { timestamp: new Date().toISOString(), evaluation_question_number: 2, source_id: sourceId, item_id: input.itemId, previous_decision: previous, new_decision: input.decision, reviewer: input.reviewer.trim(), review_date: input.reviewDate, reviewer_note: input.reviewerNote.trim() || null });
  return review;
}
