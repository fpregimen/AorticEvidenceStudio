import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parseCsv } from "../lib/source-csv.ts";

type Json = Record<string, unknown>;
type Question = { question_id: string; question_number: number };
const root = process.cwd(), reviewDir = path.join(root, "database/content_reviews"), synthesisDir = path.join(root, "database/synthesis_drafts");
const sourceIds = new Set(parseCsv(await readFile(path.join(root, "database/source_catalog.csv"), "utf8")).map(row => row.source_id));
const questions = JSON.parse(await readFile(path.join(root, "database/evaluation_questions.json"), "utf8")) as Question[];
const questionByNumber = new Map(questions.map(question => [question.question_number, question]));
const errors: string[] = [], warnings: string[] = [], claimsByQuestion = new Map<string, Map<string, Json>>(), approvedClaimsByQuestion = new Map<string, Set<string>>(), reviewsByQuestion = new Map<string, Json[]>();
let valid = 0;
const error = (file: string, message: string) => errors.push(`${file}: ${message}`);
const iso = (value: unknown) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
const location = (item: Json) => ["page", "section", "table", "figure", "source_location_note"].some(key => typeof item[key] === "string" && String(item[key]).trim());
const legacyDecision = (item: Json) => String(item.validation_decision ?? "Pending");
const pii = /(patient\s*name|medical\s*record|\bmrn\b|date\s*of\s*birth|\bdob\b|social\s*security|患者氏名|診療録番号|生年月日)/i;

const reviewFiles = (await readdir(reviewDir)).filter(file => file.endsWith(".json")).sort();
for (const file of reviewFiles) {
  const before = errors.length;
  let review: Json;
  try { review = JSON.parse(await readFile(path.join(reviewDir, file), "utf8")) as Json } catch (cause) { error(file, `invalid JSON: ${cause}`); continue }
  const question = questionByNumber.get(Number(review.evaluation_question_number));
  if (!question) { error(file, "evaluation_question_number is not registered"); continue }
  const sourceId = String(review.source_id ?? ""), expectedFilename = `${question.question_id}_${sourceId}.json`;
  if (file !== expectedFilename) error(file, `review filename must be ${expectedFilename}`);
  if (!sourceIds.has(sourceId)) error(file, "unknown source_id");
  if (!iso(review.last_updated)) error(file, "last_updated must be ISO date");
  const claims = Array.isArray(review.extracted_claims) ? review.extracted_claims as Json[] : [], outcomes = Array.isArray(review.outcome_data) ? review.outcome_data as Json[] : [];
  const claimMap = claimsByQuestion.get(question.question_id) ?? new Map<string, Json>(), approved = approvedClaimsByQuestion.get(question.question_id) ?? new Set<string>();
  const specialist = (review.specialist_validation as Json | undefined)?.claims as Record<string, Json> | undefined;
  for (const claim of claims) {
    const id = String(claim.claim_id ?? "");
    if (!id || claimMap.has(id)) error(file, `missing or duplicate claim_id ${id}`);
    claimMap.set(id, claim);
    const decision = legacyDecision(claim), specialistDecision = specialist?.[id];
    if (!["Pending", "Approved", "Needs correction", "Excluded"].includes(decision)) error(file, `${id} has invalid decision`);
    if (decision === "Approved" && (!claim.verified_by_reviewer || !claim.reviewer || !iso(claim.review_date) || !claim.exact_supporting_text || !location(claim))) error(file, `${id} approved without reviewer, date, quotation, verification, or location`);
    if (decision === "Needs correction" && (!claim.reviewer_note || claim.verified_by_reviewer)) error(file, `${id} needs correction without note or is marked verified`);
    if (decision === "Excluded" && (!claim.reviewer_note || !claim.verified_by_reviewer)) error(file, `${id} excluded without note or verification`);
    if (decision === "Pending" && (claim.verified_by_reviewer || claim.suitable_for_generated_answer)) error(file, `${id} pending but marked verified/suitable`);
    if (decision === "Approved" && claim.verified_by_reviewer && claim.reviewer && iso(claim.review_date) && claim.exact_supporting_text && location(claim)) approved.add(id);
    if (specialistDecision?.status === "Approved" && specialistDecision.reviewer_name && iso(specialistDecision.review_date) && specialistDecision.original_source_confirmed === true && claim.exact_supporting_text && location(claim)) approved.add(id);
  }
  for (const [index, outcome] of outcomes.entries()) {
    const id = String(outcome.outcome_id ?? `outcome-${index + 1}`), decision = legacyDecision(outcome);
    if (decision === "Approved" && (!outcome.verified_by_reviewer || !outcome.reviewer || !iso(outcome.review_date) || !outcome.page_or_location)) error(file, `${id} approved without reviewer, date, verification, or source location`);
    if (decision === "Needs correction" && (!outcome.reviewer_note || outcome.verified_by_reviewer)) error(file, `${id} needs correction without note or is verified`);
    if (decision === "Excluded" && (!outcome.reviewer_note || !outcome.verified_by_reviewer)) error(file, `${id} excluded without note or verification`);
  }
  const serialized = JSON.stringify(review);
  if (pii.test(serialized)) error(file, "possible patient-identifiable information");
  if (serialized.includes("source_documents/private") || serialized.includes(".pdf")) error(file, "private PDF path or filename appears in committed review JSON");
  claimsByQuestion.set(question.question_id, claimMap); approvedClaimsByQuestion.set(question.question_id, approved);
  reviewsByQuestion.set(question.question_id, [...(reviewsByQuestion.get(question.question_id) ?? []), review]);
  if (errors.length === before) valid++;
}

const synthesisFiles = (await readdir(synthesisDir)).filter(file => file.endsWith(".json")).sort();
const seenSynthesisQuestions = new Set<string>();
for (const file of synthesisFiles) {
  const relative = path.posix.join("database", "synthesis_drafts", file), draft = JSON.parse(await readFile(path.join(synthesisDir, file), "utf8")) as Json;
  const question = questionByNumber.get(Number(draft.evaluation_question_number));
  if (!question) { error(relative, "evaluation_question_number is not registered"); continue }
  if (seenSynthesisQuestions.has(question.question_id)) error(relative, `multiple synthesis files exist for ${question.question_id}`);
  seenSynthesisQuestions.add(question.question_id);
  const review = draft.synthesis_review as Json | undefined, isApproved = review?.decision === "Approve synthesis", claims = claimsByQuestion.get(question.question_id) ?? new Map(), approvedClaims = approvedClaimsByQuestion.get(question.question_id) ?? new Set();
  for (const finding of (draft.draft_findings as Json[] | undefined) ?? []) for (const ref of (finding.claim_refs as string[] | undefined) ?? []) {
    if (!claims.has(ref)) error(relative, `unknown claim reference ${ref}`);
    else if (isApproved && !approvedClaims.has(ref)) error(relative, `approved synthesis references unapproved claim ${ref}`);
  }
  if (review && (!["Pending", "Approve synthesis", "Return for correction"].includes(String(review.decision)) || typeof review.reviewer_name !== "string" || !iso(review.review_date) || review.confirmed !== true || typeof review.reviewer_note !== "string")) error(relative, "invalid synthesis_review");
  if (review?.decision === "Return for correction" && !String(review.reviewer_note).trim()) error(relative, "returned synthesis requires reviewer note");
  if (!isApproved) for (const [id, claim] of claims) if (claim.suitable_for_generated_answer === true) error(relative, `${id} is suitable before synthesis approval`);
}

for (const folder of ["app", "components", "lib"]) for (const file of await walk(path.join(root, folder))) if (/\.(ts|tsx)$/.test(file)) { const text = await readFile(file, "utf8"); if (text.includes("source_documents/private") || /AES-[A-Z0-9-]+.*\.pdf/.test(text)) error(path.relative(root, file), "private PDF path appears in UI/server code") }
console.log("Content review validation");
console.log(`Registered questions: ${questions.length}`);
console.log(`Total review files: ${reviewFiles.length}`);
console.log(`Valid files: ${valid}`);
console.log(`Synthesis files: ${synthesisFiles.length}`);
console.log(`Warning count: ${warnings.length}`);
console.log(`Error count: ${errors.length}`);
warnings.forEach(message => console.warn(`WARNING: ${message}`)); errors.forEach(message => console.error(`ERROR: ${message}`));
if (errors.length) process.exitCode = 1;

async function walk(directory: string): Promise<string[]> { const output: string[] = []; for (const entry of await readdir(directory, { withFileTypes: true })) { if (entry.isDirectory()) output.push(...await walk(path.join(directory, entry.name))); else output.push(path.join(directory, entry.name)) } return output }
