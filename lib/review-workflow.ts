import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { ContentReview, ItemReviewDecision } from "./content-review-model.ts";
import { outcomeReviewId, sourceLocationPresent, validIsoDate } from "./content-review-model.ts";
import { expectedReviewFilename, isSafeReviewQuestionId, isSafeReviewSourceId } from "./review-source-validation.ts";
import { parseCsv } from "./source-csv.ts";

export interface ReviewWorkflowContext {
  questionId: string;
  questionNumber: number;
  sourceId: string;
  source: Record<string, string>;
  review: ContentReview | null;
  reviewRelativePath: string;
  reviewAbsolutePath: string;
  expectedPdfPattern: string;
  privatePdfBasename: string | null;
}

export interface ReviewDecisionCounts {
  approved: number;
  correctionRequired: number;
  pending: number;
  excluded: number;
  total: number;
}

export interface FinalizationPreflight {
  ok: boolean;
  errors: string[];
  counts: ReviewDecisionCounts;
}

type GitChange = { path: string; status: string };

export function requireQuestionAndSourceIds(args: string[]) {
  if (args.length !== 2) throw new Error("Provide exactly one question ID and one source ID, for example: Q03 AES-GDL-001");
  const [questionId, sourceId] = args;
  if (!isSafeReviewQuestionId(questionId)) throw new Error("Unsafe or invalid question ID");
  if (!isSafeReviewSourceId(sourceId)) throw new Error("Unsafe or invalid source ID");
  return { questionId, sourceId };
}

export async function loadReviewWorkflowContext(root: string, questionId: string, sourceId: string): Promise<ReviewWorkflowContext> {
  if (!isSafeReviewQuestionId(questionId)) throw new Error("Unsafe or invalid question ID");
  if (!isSafeReviewSourceId(sourceId)) throw new Error("Unsafe or invalid source ID");
  const catalogPath = path.join(root, "database", "source_catalog.csv");
  const questionsPath = path.join(root, "database", "evaluation_questions.json");
  const reviewDir = path.join(root, "database", "content_reviews");
  const privateDir = path.join(root, "source_documents", "private");
  const [catalogText, questionsText, privateFiles] = await Promise.all([
    readFile(catalogPath, "utf8"),
    readFile(questionsPath, "utf8"),
    readdir(privateDir).catch((error: NodeJS.ErrnoException) => error.code === "ENOENT" ? [] : Promise.reject(error)),
  ]);
  const sources = parseCsv(catalogText);
  const questions = JSON.parse(questionsText) as Array<{ question_id: string; question_number: number }>;
  const question = questions.find(candidate => candidate.question_id === questionId);
  if (!question) throw new Error("Unknown or unsupported question ID");
  const source = sources.find((row) => row.source_id === sourceId);
  if (!source) throw new Error("Unknown or unsupported source ID");
  const relevantQuestions = (source.relevant_evaluation_questions ?? "").split(";").map(value => Number(value.trim())).filter(Number.isFinite);
  if (!relevantQuestions.includes(question.question_number)) throw new Error("Source ID is not registered for this question");
  const filename = expectedReviewFilename(questionId, sourceId);
  const reviewAbsolutePath = path.resolve(reviewDir, filename);
  if (path.dirname(reviewAbsolutePath) !== path.resolve(reviewDir)) throw new Error("Unsafe review record path");
  let review: ContentReview | null = null;
  try {
    review = JSON.parse(await readFile(reviewAbsolutePath, "utf8")) as ContentReview;
    if (review.source_id !== sourceId || review.evaluation_question_number !== question.question_number) throw new Error("Cross-question review-file mismatch");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const pdfMatches = privateFiles.filter((file) => file.startsWith(`${sourceId}_`) && file.toLowerCase().endsWith(".pdf"));
  if (pdfMatches.length > 1) throw new Error(`Multiple private PDFs match ${sourceId}; keep exactly one source review copy`);
  return {
    questionId,
    questionNumber: question.question_number,
    sourceId,
    source,
    review,
    reviewRelativePath: path.posix.join("database", "content_reviews", filename),
    reviewAbsolutePath,
    expectedPdfPattern: `${sourceId}_${source.publication_year || "YEAR"}_*.pdf`,
    privatePdfBasename: pdfMatches[0] ?? null,
  };
}

export function requireExistingReview(context: ReviewWorkflowContext): asserts context is ReviewWorkflowContext & { review: ContentReview } {
  if (!context.review) throw new Error(`Review record not found: ${context.reviewRelativePath}`);
}

function itemDecision(review: ContentReview, kind: "claim" | "outcome", index: number): ItemReviewDecision | undefined {
  if (kind === "claim") return review.specialist_validation?.claims[review.extracted_claims[index].claim_id];
  return review.specialist_validation?.outcomes[outcomeReviewId(index)]
    ?? (review.outcome_data[index].outcome_id ? review.specialist_validation?.outcomes[review.outcome_data[index].outcome_id] : undefined);
}

function effectiveStatus(review: ContentReview, kind: "claim" | "outcome", index: number) {
  const item = kind === "claim" ? review.extracted_claims[index] : review.outcome_data[index];
  return itemDecision(review, kind, index)?.status ?? item.validation_decision ?? "Pending";
}

export function reviewDecisionCounts(review: ContentReview): ReviewDecisionCounts {
  const statuses = [
    ...review.extracted_claims.map((_, index) => effectiveStatus(review, "claim", index)),
    ...review.outcome_data.map((_, index) => effectiveStatus(review, "outcome", index)),
  ];
  return {
    approved: statuses.filter((status) => status === "Approved").length,
    correctionRequired: statuses.filter((status) => status === "Needs correction").length,
    pending: statuses.filter((status) => status === "Pending" || !status).length,
    excluded: statuses.filter((status) => status === "Excluded").length,
    total: statuses.length,
  };
}

export function parseGitPorcelain(output: string): GitChange[] {
  return output.split("\n").filter(Boolean).map((line) => {
    if (line.length < 4) throw new Error("Unable to parse Git status output");
    const status = line.slice(0, 2);
    const rawPath = line.slice(3);
    const filePath = rawPath.includes(" -> ") ? rawPath.split(" -> ").at(-1)! : rawPath;
    return { status, path: filePath.replace(/^"|"$/g, "") };
  });
}

export function unrelatedGitChanges(changes: GitChange[], expectedReviewPath: string) {
  return changes.filter((change) => change.path !== expectedReviewPath);
}

function approvedDecisionErrors(decision: ItemReviewDecision | undefined, fallback: {
  reviewer?: string | null;
  review_date?: string | null;
  verified_by_reviewer: boolean;
}, label: string) {
  const errors: string[] = [];
  const reviewer = decision?.reviewer_name ?? fallback.reviewer ?? "";
  const date = decision?.review_date ?? fallback.review_date ?? "";
  const confirmed = decision?.original_source_confirmed ?? fallback.verified_by_reviewer;
  if (!reviewer.trim()) errors.push(`${label}: approved item requires reviewer name`);
  if (!validIsoDate(date)) errors.push(`${label}: approved item requires a valid review date`);
  if (!confirmed) errors.push(`${label}: approved item requires original-source confirmation`);
  return errors;
}

export function finalizationPreflight(review: ContentReview, changes: GitChange[], expectedReviewPath: string): FinalizationPreflight {
  const errors: string[] = [];
  const unrelated = unrelatedGitChanges(changes, expectedReviewPath);
  if (unrelated.length) errors.push(`Unrelated working-tree changes: ${unrelated.map((change) => change.path).join(", ")}`);
  if (!changes.some((change) => change.path === expectedReviewPath)) errors.push("The requested review JSON has no change to finalize");
  review.extracted_claims.forEach((claim, index) => {
    const decision = itemDecision(review, "claim", index);
    const status = effectiveStatus(review, "claim", index);
    if (!decision) errors.push(`${claim.claim_id}: missing explicit specialist decision from the review UI`);
    if (status === "Pending" || status === "Needs correction") errors.push(`${claim.claim_id}: requires an explicit final specialist decision`);
    if (status === "Approved") {
      errors.push(...approvedDecisionErrors(decision, claim, claim.claim_id));
      if (!claim.exact_supporting_text?.trim() || !sourceLocationPresent(claim)) errors.push(`${claim.claim_id}: approved claim requires supporting text and source location`);
    }
    if (claim.suitable_for_generated_answer !== false) errors.push(`${claim.claim_id}: suitable_for_generated_answer must remain false`);
  });
  review.outcome_data.forEach((outcome, index) => {
    const label = outcome.outcome_id ?? outcomeReviewId(index);
    const decision = itemDecision(review, "outcome", index);
    const status = effectiveStatus(review, "outcome", index);
    if (!decision) errors.push(`${label}: missing explicit specialist decision from the review UI`);
    if (status === "Pending" || status === "Needs correction") errors.push(`${label}: requires an explicit final specialist decision`);
    if (status === "Approved") {
      errors.push(...approvedDecisionErrors(decision, outcome, label));
      if (!outcome.page_or_location?.trim()) errors.push(`${label}: approved outcome requires a source location`);
    }
  });
  return { ok: errors.length === 0, errors, counts: reviewDecisionCounts(review) };
}
