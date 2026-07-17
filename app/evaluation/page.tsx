import { EvaluationQuestionsClient } from "@/components/evaluation-questions-client";
import { getEvaluationQuestions } from "@/lib/evaluation-questions";
export default async function Page() { return <EvaluationQuestionsClient questions={await getEvaluationQuestions()} /> }
