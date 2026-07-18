import { NextResponse } from "next/server";
import { getMigrationReviewData, saveExactBulkMigrationDecision, saveIndividualMigrationDecision } from "@/lib/migration-review-store";
import { validateResolution } from "@/lib/migration-review-model";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(await getMigrationReviewData(), { headers: { "Cache-Control": "no-store" } }); }
export async function PUT(request: Request) {
  try {
    const body = await request.json() as { mode?: unknown; candidateId?: unknown; resolution?: unknown; candidateIds?: unknown; confirmed?: unknown };
    if (body.mode === "individual" && typeof body.candidateId === "string" && validateResolution(body.resolution)) return NextResponse.json(await saveIndividualMigrationDecision(body.candidateId, body.resolution));
    if (body.mode === "exact_bulk" && Array.isArray(body.candidateIds) && body.candidateIds.every(value => typeof value === "string") && typeof body.confirmed === "boolean") return NextResponse.json(await saveExactBulkMigrationDecision(body.candidateIds, body.confirmed));
    return NextResponse.json({ error: "Invalid migration decision request" }, { status: 400 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save migration decision" }, { status: 400 }); }
}
