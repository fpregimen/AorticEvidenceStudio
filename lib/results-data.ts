import "server-only";
import { getContentReview } from "./content-reviews";
import { reviewProgress } from "./content-review-model";
import { getEvaluationQuestion } from "./evaluation-questions";
import { getSources } from "./source-catalog";
import { getSynthesisDraft } from "./synthesis-drafts";

export async function getApprovedResults(questionId: string) {
  const [question, draft, catalog] = await Promise.all([getEvaluationQuestion(questionId), getSynthesisDraft(questionId), getSources()]);
  if (!question || !draft || draft.synthesis_review?.decision !== "Approve synthesis") return null;
  const reviews = await Promise.all(draft.source_ids.map(sourceId => getContentReview(question.question_id, sourceId)));
  const progress = reviews.map(review => review ? reviewProgress(review) : { incomplete: 1, complete: false });
  const incompleteSources = draft.source_ids.filter((_, index) => !progress[index].complete);
  const sources = draft.source_ids.map(sourceId => catalog.find(source => source.source_id === sourceId)).filter(source => source !== undefined).map(source => ({ sourceId: source.source_id, title: source.title, sourceType: source.source_type }));
  return { question, synthesis: { approved: true, evidenceComplete: incompleteSources.length === 0, incompleteCount: progress.reduce((sum, item) => sum + item.incomplete, 0), incompleteSources, findings: draft.draft_findings.map(item => item.finding), sources } };
}
