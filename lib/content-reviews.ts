import "server-only";
import { readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ContentReview } from "./content-review-model";
import { getEvaluationQuestion } from "./evaluation-questions";
import { expectedReviewFilename, isSafeReviewSourceId } from "./review-source-validation";
import { getSource } from "./source-catalog";

const reviewDir = path.join(process.cwd(), "database", "content_reviews");

async function readReviewFile(questionId: string, sourceId: string) {
  const filename = expectedReviewFilename(questionId, sourceId);
  const target = path.resolve(reviewDir, filename);
  if (path.dirname(target) !== path.resolve(reviewDir)) throw new Error("Unsafe review record path");
  try {
    const review = JSON.parse(await readFile(target, "utf8")) as ContentReview;
    const question = await getEvaluationQuestion(questionId);
    if (!question || review.evaluation_question_number !== question.question_number || review.source_id !== sourceId) return null;
    return { filename, target, review };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function getContentReviews(questionId = "Q02"): Promise<ContentReview[]> {
  const question = await getEvaluationQuestion(questionId);
  if (!question) return [];
  const files = (await readdir(reviewDir)).filter(file => file.startsWith(`${question.question_id}_`) && file.endsWith(".json")).sort();
  const reviews = await Promise.all(files.map(async file => JSON.parse(await readFile(path.join(reviewDir, file), "utf8")) as ContentReview));
  return reviews.filter(review => review.evaluation_question_number === question.question_number);
}

export async function getContentReview(questionId: string, sourceId?: string) {
  const effectiveQuestionId = sourceId ? questionId : "Q02";
  const effectiveSourceId = sourceId ?? questionId;
  if (!isSafeReviewSourceId(effectiveSourceId) || !await getEvaluationQuestion(effectiveQuestionId)) return null;
  return (await readReviewFile(effectiveQuestionId, effectiveSourceId))?.review ?? null;
}

export async function isRegisteredContentReviewSourceId(questionId: string, sourceId?: string) {
  const effectiveQuestionId = sourceId ? questionId : "Q02";
  const effectiveSourceId = sourceId ?? questionId;
  const [question, source, review] = await Promise.all([getEvaluationQuestion(effectiveQuestionId), getSource(effectiveSourceId), getContentReview(effectiveQuestionId, effectiveSourceId)]);
  return Boolean(question && source && review);
}

export async function saveContentReview(questionId: string, review: ContentReview) {
  if (!await isRegisteredContentReviewSourceId(questionId, review.source_id)) throw new Error("Unsupported question or source ID");
  const entry = await readReviewFile(questionId, review.source_id);
  if (!entry) throw new Error("Review not found");
  const saved: ContentReview = { ...entry.review, specialist_validation: review.specialist_validation, last_updated: new Date().toISOString().slice(0, 10) };
  const temporary = `${entry.target}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(saved, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  await rename(temporary, entry.target);
  return JSON.parse(await readFile(entry.target, "utf8")) as ContentReview;
}
