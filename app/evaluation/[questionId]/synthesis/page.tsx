import { notFound } from "next/navigation";
import { SynthesisClient } from "@/components/synthesis-client";
import { getContentReview } from "@/lib/content-reviews";
import { reviewProgress } from "@/lib/content-review-model";
import { getEvaluationQuestion, questionRouteSegment } from "@/lib/evaluation-questions";
import { getSource } from "@/lib/source-catalog";
import { getSynthesisDraft } from "@/lib/synthesis-drafts";
export default async function Page({ params }: { params: Promise<{ questionId: string }> }) { const question = await getEvaluationQuestion((await params).questionId); if (!question || question.question_id === "Q02") notFound(); const draft = await getSynthesisDraft(question.question_id); if (!draft) notFound(); const [reviews, sources] = await Promise.all([Promise.all(draft.source_ids.map(id => getContentReview(question.question_id, id))), Promise.all(draft.source_ids.map(getSource))]); const rows = draft.source_ids.map((sourceId, index) => { const progress = reviews[index] ? reviewProgress(reviews[index]!) : null; return { sourceId, title: sources[index]?.title ?? sourceId, complete: Boolean(progress?.complete), incomplete: progress?.incomplete ?? 0 } }); return <SynthesisClient draft={draft} rows={rows} questionId={question.question_id} routeSegment={questionRouteSegment(question.question_id)} /> }
