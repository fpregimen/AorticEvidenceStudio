import { GenericApprovedResultsClient } from "@/components/generic-approved-results-client";
import { ResultsClient } from "@/components/results-client";
import { ResultsUnavailableClient } from "@/components/results-unavailable-client";
import { getEvaluationQuestion } from "@/lib/evaluation-questions";
import { getApprovedResults } from "@/lib/results-data";
export const dynamic = "force-dynamic";
export default async function Results({ searchParams }: { searchParams: Promise<{ question?: string }> }) { const requested = (await searchParams).question ?? "Q02", question = await getEvaluationQuestion(requested) ?? await getEvaluationQuestion("Q02"); if (!question) throw new Error("Q02 question registry entry is missing"); const results = await getApprovedResults(question.question_id); if (!results) return <ResultsUnavailableClient question={question} />; if (question.question_id === "Q02") return <ResultsClient synthesis={results.synthesis} />; return <GenericApprovedResultsClient question={question} findings={results.synthesis.findings} sources={results.synthesis.sources} /> }
