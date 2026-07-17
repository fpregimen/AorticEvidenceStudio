import { getReviewResponse, putReviewResponse } from "@/lib/review-route-handlers";
import { getEvaluationQuestion } from "@/lib/evaluation-questions";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
async function question(value: string) { return (await getEvaluationQuestion(value))?.question_id ?? null }
export async function GET(_: Request, { params }: { params: Promise<{ questionId: string; sourceId: string }> }) { const values = await params, id = await question(values.questionId); return id ? getReviewResponse(id, values.sourceId) : NextResponse.json({ error: "Unknown question ID" }, { status: 404 }) }
export async function PUT(request: Request, { params }: { params: Promise<{ questionId: string; sourceId: string }> }) { const values = await params, id = await question(values.questionId); return id ? putReviewResponse(request, id, values.sourceId) : NextResponse.json({ error: "Unknown question ID" }, { status: 404 }) }
