import { getSynthesisResponse, putSynthesisResponse } from "@/lib/synthesis-route-handlers";
import { getEvaluationQuestion } from "@/lib/evaluation-questions";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
async function question(value: string) { return (await getEvaluationQuestion(value))?.question_id ?? null }
export async function GET(_: Request, { params }: { params: Promise<{ questionId: string }> }) { const id = await question((await params).questionId); return id ? getSynthesisResponse(id) : NextResponse.json({ error: "Unknown question ID" }, { status: 404 }) }
export async function PUT(request: Request, { params }: { params: Promise<{ questionId: string }> }) { const id = await question((await params).questionId); return id ? putSynthesisResponse(request, id) : NextResponse.json({ error: "Unknown question ID" }, { status: 404 }) }
