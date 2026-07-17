import { getSynthesisResponse, putSynthesisResponse } from "@/lib/synthesis-route-handlers";
export const dynamic = "force-dynamic";
export async function GET() { return getSynthesisResponse("Q02") }
export async function PUT(request: Request) { return putSynthesisResponse(request, "Q02") }
