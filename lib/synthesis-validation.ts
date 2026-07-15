import "server-only";
import { copyFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ContentReview } from "./content-review-model";
import { supportedSourceIds } from "./specialist-validation";

const root = process.cwd(), backups = path.join(root, "database", "local_backups"), audits = path.join(root, "database", "local_audit");
const iso = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
const stamp = () => new Date().toISOString().replaceAll(":", "-");

async function atomic(target: string, value: unknown, audit: unknown) {
  await mkdir(backups, { recursive: true }); await mkdir(audits, { recursive: true });
  const currentStamp = stamp(), base = path.basename(target, ".json");
  await copyFile(target, path.join(backups, `${base}_${currentStamp}.json`));
  const text = JSON.stringify(value, null, 2) + "\n"; JSON.parse(text);
  const temporary = path.join(path.dirname(target), `.${base}.${currentStamp}.tmp`);
  await writeFile(temporary, text, { flag: "wx" }); await rename(temporary, target);
  await writeFile(path.join(audits, `${currentStamp}_${base}.json`), JSON.stringify(audit, null, 2) + "\n", { flag: "wx" });
}

export interface SynthesisUpdate { decision: "Approved" | "Needs correction"; reviewer: string; reviewDate: string; reviewerNote: string; confirmed: boolean }

export async function updateSynthesis(input: SynthesisUpdate) {
  if (!["Approved", "Needs correction"].includes(input.decision) || !input.reviewer?.trim() || !iso(input.reviewDate) || !input.confirmed) throw new Error("Reviewer, valid review date, decision, and synthesis confirmation are required.");
  if (input.decision === "Needs correction" && !input.reviewerNote?.trim()) throw new Error("A reviewer note is required when returning the synthesis for correction.");
  const target = path.join(root, "database/synthesis_drafts/Q02_PREEMPTIVE_TEVAR_DRAFT.json");
  const draft = JSON.parse(await readFile(target, "utf8")) as Record<string, unknown>;
  const refs = new Set((draft.draft_findings as Array<{ claim_refs: string[] }>).flatMap((finding) => finding.claim_refs));
  const reviews = await Promise.all(supportedSourceIds.map(async (id) => JSON.parse(await readFile(path.join(root, `database/content_reviews/Q02_${id}.json`), "utf8")) as ContentReview));
  if (input.decision === "Approved") {
    for (const ref of refs) {
      const claim = reviews.flatMap((review) => review.extracted_claims).find((candidate) => candidate.claim_id === ref);
      if (!claim) throw new Error(`Referenced claim does not exist: ${ref}`);
      if ((claim.validation_decision ?? "Pending") !== "Approved" || !claim.verified_by_reviewer) throw new Error(`Referenced claim is not approved: ${ref}`);
    }
    for (const review of reviews) for (const [index, outcome] of review.outcome_data.entries()) if ((outcome.validation_decision ?? "Pending") !== "Approved" || !outcome.verified_by_reviewer) throw new Error(`Numeric outcome is not approved: ${outcome.outcome_id ?? `${review.source_id}-O${String(index + 1).padStart(2, "0")}`}`);
  }
  const previous = String(draft.synthesis_validation_decision ?? "Pending"), approved = input.decision === "Approved";
  for (const review of reviews) {
    let changed = false;
    for (const claim of review.extracted_claims) {
      const suitable = approved && refs.has(claim.claim_id) && claim.validation_decision === "Approved";
      if (claim.suitable_for_generated_answer !== suitable) { claim.suitable_for_generated_answer = suitable; changed = true; }
    }
    if (changed) await atomic(path.join(root, `database/content_reviews/Q02_${review.source_id}.json`), review, { timestamp: new Date().toISOString(), evaluation_question_number: 2, source_id: review.source_id, item_id: "synthesis-production-readiness", previous_decision: approved ? "unsuitable" : "suitable", new_decision: approved ? "suitable for generated answers" : "unsuitable for generated answers", reviewer: input.reviewer.trim(), review_date: input.reviewDate, reviewer_note: input.reviewerNote?.trim() || null });
  }
  Object.assign(draft, { specialist_review_status: approved ? "Specialist validated" : "Requires correction", synthesis_validation_decision: input.decision, synthesis_reviewer: input.reviewer.trim(), synthesis_review_date: input.reviewDate, synthesis_reviewer_note: input.reviewerNote?.trim() || null, last_updated: input.reviewDate, safety: { verified_by_reviewer: approved, specialist_validated: approved, suitable_for_generated_answer: approved } });
  await atomic(target, draft, { timestamp: new Date().toISOString(), evaluation_question_number: 2, synthesis_id: draft.synthesis_id, item_id: "Q02-synthesis", previous_decision: previous, new_decision: input.decision, reviewer: input.reviewer.trim(), review_date: input.reviewDate, reviewer_note: input.reviewerNote?.trim() || null });
  return draft;
}
