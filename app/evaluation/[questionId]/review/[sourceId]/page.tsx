import { notFound } from "next/navigation";
import { ReviewDetailClient } from "@/components/review-detail-client";
import { getContentReview } from "@/lib/content-reviews";
import { getEvaluationQuestion, questionRouteSegment } from "@/lib/evaluation-questions";
import { getSource } from "@/lib/source-catalog";
export default async function Page({ params }: { params: Promise<{ questionId: string; sourceId: string }> }) { const values = await params, question = await getEvaluationQuestion(values.questionId); if (!question || question.question_id === "Q02") notFound(); const [review, source] = await Promise.all([getContentReview(question.question_id, values.sourceId), getSource(values.sourceId)]); if (!review || !source) notFound(); return <ReviewDetailClient review={review} source={source} questionId={question.question_id} routeSegment={questionRouteSegment(question.question_id)} /> }
