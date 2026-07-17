import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

export interface EvaluationQuestion {
  question_id: string;
  question_number: number;
  wording_en: string;
  wording_ja: string;
  clinical_domain: string;
  implementation_status: string;
  synthesis_filename?: string | null;
}

const questionIdPattern = /^Q\d{2}$/;
const registryFile = path.join(process.cwd(), "database", "evaluation_questions.json");

export function isSafeQuestionId(value: string) {
  return questionIdPattern.test(value);
}

export function normalizeQuestionId(value: string) {
  if (isSafeQuestionId(value)) return value;
  if (/^\d{1,2}$/.test(value)) return `Q${value.padStart(2, "0")}`;
  return null;
}

export function questionRouteSegment(questionId: string) {
  return questionId === "Q02" ? "2" : questionId;
}

export async function getEvaluationQuestions(): Promise<EvaluationQuestion[]> {
  const questions = JSON.parse(await readFile(registryFile, "utf8")) as EvaluationQuestion[];
  return questions.filter(question => isSafeQuestionId(question.question_id));
}

export async function getEvaluationQuestion(value: string) {
  const questionId = normalizeQuestionId(value);
  if (!questionId) return null;
  return (await getEvaluationQuestions()).find(question => question.question_id === questionId) ?? null;
}
