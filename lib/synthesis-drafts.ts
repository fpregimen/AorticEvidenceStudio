import "server-only";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { getEvaluationQuestion } from "./evaluation-questions";

export type SynthesisDecision = "Pending" | "Approve synthesis" | "Return for correction";
export interface SynthesisReview { decision: SynthesisDecision; reviewer_name: string; review_date: string; confirmed: boolean; reviewer_note: string }
export interface SynthesisDraft { synthesis_id: string; evaluation_question_number: number; status: string; last_updated: string; question: string; scope_note: string; source_ids: string[]; identity_outcomes: Array<{ source_id: string; outcome: string; warning: string | null }>; draft_findings: Array<{ finding: string; claim_refs: string[]; numeric_outcome_refs?: string[] }>; synthesis_review?: SynthesisReview; specialist_review_status?: string; synthesis_validation_decision?: "Approved" | "Needs correction"; synthesis_reviewer?: string; synthesis_review_date?: string; synthesis_reviewer_note?: string | null; safety: { verified_by_reviewer: boolean; specialist_validated: boolean; suitable_for_generated_answer: boolean } }

const draftDir = path.join(/*turbopackIgnore: true*/ process.cwd(), "database", "synthesis_drafts");

async function findSynthesisEntry(questionId: string) {
  const question = await getEvaluationQuestion(questionId);
  if (!question?.synthesis_filename || !/^[A-Z0-9_-]+\.json$/.test(question.synthesis_filename)) return null;
  const target = path.join(draftDir, question.synthesis_filename), draft = JSON.parse(await readFile(target, "utf8")) as SynthesisDraft;
  if (draft.evaluation_question_number !== question.question_number) throw new Error("Synthesis file does not match its registered question");
  return { target, draft };
}

export async function getSynthesisDraft(questionId: string) {
  return (await findSynthesisEntry(questionId))?.draft ?? null;
}

export async function saveSynthesisReview(questionId: string, review: SynthesisReview) {
  const entry = await findSynthesisEntry(questionId);
  if (!entry) throw new Error("Synthesis draft not found");
  const saved = { ...entry.draft, synthesis_review: review, last_updated: new Date().toISOString().slice(0, 10) };
  const temporary = `${entry.target}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(saved, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  await rename(temporary, entry.target);
  return JSON.parse(await readFile(entry.target, "utf8")) as SynthesisDraft;
}

export async function getQ02Synthesis() {
  const draft = await getSynthesisDraft("Q02");
  if (!draft) throw new Error("Q02 synthesis draft not found");
  return draft;
}

export async function saveQ02SynthesisReview(review: SynthesisReview) {
  return saveSynthesisReview("Q02", review);
}
