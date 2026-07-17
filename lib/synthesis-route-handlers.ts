import { NextResponse } from "next/server";
import { validIsoDate } from "./content-review-model";
import { getSynthesisDraft, saveSynthesisReview, type SynthesisReview } from "./synthesis-drafts";

export async function getSynthesisResponse(questionId: string) {
  const draft = await getSynthesisDraft(questionId);
  return draft ? NextResponse.json(draft, { headers: { "Cache-Control": "no-store" } }) : NextResponse.json({ error: "Synthesis draft not found" }, { status: 404 });
}

export async function putSynthesisResponse(request: Request, questionId: string) {
  try {
    if (!await getSynthesisDraft(questionId)) return NextResponse.json({ error: "Synthesis draft not found" }, { status: 404 });
    const body = await request.json() as { review?: SynthesisReview }, review = body.review;
    if (!review || !["Approve synthesis", "Return for correction"].includes(review.decision) || !review.reviewer_name?.trim() || !validIsoDate(review.review_date) || !review.confirmed || typeof review.reviewer_note !== "string") return NextResponse.json({ error: "Reviewer name, valid review date, confirmation, and a synthesis decision are required." }, { status: 400 });
    if (review.decision === "Return for correction" && !review.reviewer_note.trim()) return NextResponse.json({ error: "Reviewer note is required when returning the synthesis for correction." }, { status: 400 });
    return NextResponse.json(await saveSynthesisReview(questionId, review), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save synthesis review" }, { status: 400 });
  }
}
