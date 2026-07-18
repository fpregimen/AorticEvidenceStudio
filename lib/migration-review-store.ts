import "server-only";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { MigrationCandidateReport, MigrationDecisionFile, MigrationResolution } from "./migration-review-model.ts";
import { applyExactBulkDecision, applyIndividualDecision } from "./migration-review-model.ts";

const directory = path.join(process.cwd(), "migration_reports", "q02-q03-canonical-candidates");
const reportPath = path.join(directory, "candidate-report.json");
const decisionsPath = path.join(directory, "migration-decisions.json");
export async function getMigrationReviewData() {
  const [reportText, decisionText] = await Promise.all([readFile(reportPath, "utf8"), readFile(decisionsPath, "utf8")]);
  return { report: JSON.parse(reportText) as MigrationCandidateReport, decisionFile: JSON.parse(decisionText) as MigrationDecisionFile };
}
async function atomicSave(file: MigrationDecisionFile) { const temporary = `${decisionsPath}.${process.pid}.tmp`; await writeFile(temporary, `${JSON.stringify(file, null, 2)}\n`, { encoding: "utf8", flag: "wx" }); await rename(temporary, decisionsPath); return JSON.parse(await readFile(decisionsPath, "utf8")) as MigrationDecisionFile; }
export async function saveIndividualMigrationDecision(candidateId: string, resolution: MigrationResolution) { const { report, decisionFile } = await getMigrationReviewData(); return atomicSave(applyIndividualDecision(decisionFile, report, candidateId, resolution, new Date().toISOString())); }
export async function saveExactBulkMigrationDecision(candidateIds: string[], confirmed: boolean) { const { report, decisionFile } = await getMigrationReviewData(); return atomicSave(applyExactBulkDecision(decisionFile, report, candidateIds, confirmed, new Date().toISOString())); }
