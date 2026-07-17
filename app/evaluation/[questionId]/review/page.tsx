import { notFound } from "next/navigation";
import { ReviewListClient } from "@/components/review-list-client";
import { getContentReviews } from "@/lib/content-reviews";
import { getEvaluationQuestion, questionRouteSegment } from "@/lib/evaluation-questions";
import { getSources } from "@/lib/source-catalog";
import { getSynthesisDraft } from "@/lib/synthesis-drafts";
export default async function Page({ params }: { params: Promise<{ questionId: string }> }) { const question = await getEvaluationQuestion((await params).questionId); if (!question || question.question_id === "Q02") notFound(); const [reviews, sources, synthesis] = await Promise.all([getContentReviews(question.question_id), getSources(), getSynthesisDraft(question.question_id)]); const items = reviews.map(review => ({ review, source: sources.find(source => source.source_id === review.source_id) })).filter(item => item.source !== undefined); return <ReviewListClient items={items as Array<{ review: (typeof reviews)[number]; source: (typeof sources)[number] }>} questionId={question.question_id} routeSegment={questionRouteSegment(question.question_id)} hasSynthesis={Boolean(synthesis)} /> }
