import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { duplicateReportToMarkdown, generateDuplicateCandidateReport, readLegacyReviewReadOnly } from "../lib/canonical-evidence/index.ts";
import type { DuplicateCandidate, DuplicateCandidateClass } from "../lib/canonical-evidence/index.ts";

const root = process.cwd();
const reviewDirectory = path.join(root, "database", "content_reviews");
const outputDirectory = path.join(root, "migration_reports", "q02-q03-canonical-candidates");
const jsonPath = path.join(outputDirectory, "candidate-report.json");
const markdownPath = path.join(outputDirectory, "candidate-report.md");
const files = (await readdir(reviewDirectory)).filter(file => /^Q0[23]_AES-[A-Z0-9-]+\.json$/.test(file)).sort();
const hashesBefore = new Map<string, string>();
for (const file of files) hashesBefore.set(file, createHash("sha256").update(await readFile(path.join(reviewDirectory, file))).digest("hex"));
const sourceIds = [...new Set(files.map(file => file.replace(/^Q0[23]_/, "").replace(/\.json$/, "")))].filter(sourceId => files.includes(`Q02_${sourceId}.json`) && files.includes(`Q03_${sourceId}.json`)).sort();
const candidates: DuplicateCandidate[] = [];
const sourceComparisons = [];
for (const sourceId of sourceIds) {
  const q02 = await readLegacyReviewReadOnly(root, "Q02", sourceId);
  const q03 = await readLegacyReviewReadOnly(root, "Q03", sourceId);
  const report = generateDuplicateCandidateReport(q02, q03);
  candidates.push(...report.candidates);
  sourceComparisons.push({ sourceId, q02ReviewId: q02.reviewId, q03ReviewId: q03.reviewId, q02ItemCount: q02.candidates.length, q03ItemCount: q03.candidates.length, candidateCount: report.candidates.length });
}
const classifications: DuplicateCandidateClass[] = ["likely_equivalent", "related_but_not_equivalent", "conflicting", "insufficient_information"];
const counts = Object.fromEntries(classifications.map(classification => [classification, candidates.filter(candidate => candidate.classification === classification).length]));
const hashesAfter = new Map<string, string>();
for (const file of files) hashesAfter.set(file, createHash("sha256").update(await readFile(path.join(reviewDirectory, file))).digest("hex"));
const unchanged = files.every(file => hashesBefore.get(file) === hashesAfter.get(file));
if (!unchanged) throw new Error("A Q02/Q03 review file changed during read-only report generation");
const machineReport = { reportVersion: "phase1-q02-q03-candidates-v1", generatedAt: new Date().toISOString(), readOnly: true, canonicalApprovalsCreated: false, canonicalProductionRecordsCreated: false, automaticMergePerformed: false, everyCandidateRequiresManualResolution: candidates.every(candidate => candidate.requiresManualResolution && !candidate.merged), sourceComparisons, counts, candidates, inputIntegrity: { algorithm: "sha256", allFilesUnchanged: unchanged, files: files.map(file => ({ path: `database/content_reviews/${file}`, before: hashesBefore.get(file), after: hashesAfter.get(file), unchanged: hashesBefore.get(file) === hashesAfter.get(file) })) } };
const markdown = ["# Q02/Q03 canonical migration candidate report", "", "**Read-only:** Yes", "", "**Automatic merge performed:** No", "", "**Canonical approvals or production records created:** No", "", "Every candidate requires manual resolution. Classification is a migration aid, not a medical or specialist decision.", "", "## Sources compared", "", ...sourceComparisons.map(source => `- ${source.sourceId}: ${source.q02ItemCount} Q02 items, ${source.q03ItemCount} Q03 items, ${source.candidateCount} candidates`), "", "## Candidate counts", "", ...classifications.map(classification => `- ${classification.replaceAll("_", " ")}: ${counts[classification]}`), "", "## Input integrity", "", `All ${files.length} Q02/Q03 review files remained byte-for-byte unchanged: ${unchanged ? "Yes" : "No"}`, "", duplicateReportToMarkdown({ generatedFrom: "read_only_legacy_candidates", candidates, mergePerformed: false }).replace(/^# Canonical duplicate-candidate report\n+/, "## Candidate details\n\n")].join("\n");
await mkdir(outputDirectory, { recursive: true });
await writeFile(jsonPath, `${JSON.stringify(machineReport, null, 2)}\n`, "utf8");
await writeFile(markdownPath, `${markdown}\n`, "utf8");
console.log(`Compared sources: ${sourceIds.join(", ")}`);
console.log(`Counts: ${JSON.stringify(counts)}`);
console.log(`Input files unchanged: ${unchanged}`);
console.log(`Reports: ${path.relative(root, jsonPath)}, ${path.relative(root, markdownPath)}`);
