import { getReviewResponse, putReviewResponse } from "@/lib/review-route-handlers";
export const dynamic = "force-dynamic";
export async function GET(_: Request, { params }: { params: Promise<{ sourceId: string }> }) { return getReviewResponse("Q02", (await params).sourceId) }
export async function PUT(request: Request, { params }: { params: Promise<{ sourceId: string }> }) { return putReviewResponse(request, "Q02", (await params).sourceId) }
