import { execFileSync } from "node:child_process";
import { loadReviewWorkflowContext, requireSingleSourceId, reviewDecisionCounts } from "../lib/review-workflow.ts";

try {
  const sourceId = requireSingleSourceId(process.argv.slice(2));
  const root = process.cwd();
  const context = await loadReviewWorkflowContext(root, sourceId);
  const branch = execFileSync("git", ["branch", "--show-current"], { cwd: root, encoding: "utf8" }).trim();
  const gitStatus = execFileSync("git", ["status", "--porcelain=v1", "--untracked-files=all"], { cwd: root, encoding: "utf8" });
  const counts = reviewDecisionCounts(context.review);
  console.log(`Source review status: ${sourceId}`);
  console.log(`Current branch: ${branch || "(detached HEAD)"}`);
  console.log(`Working tree clean: ${gitStatus.trim() ? "No" : "Yes"}`);
  console.log("Source ID registered: Yes");
  console.log(`Expected review JSON: ${context.reviewRelativePath}`);
  console.log(`Expected private PDF: ${context.expectedPdfPattern}`);
  console.log(`Matching private PDF: ${context.privatePdfBasename ?? "None"}`);
  console.log(`PDF exists: ${context.privatePdfBasename ? "Yes" : "No"}`);
  console.log(`Current review status: ${context.review.review_status}`);
  console.log(`Approved items: ${counts.approved}`);
  console.log(`Correction-required items: ${counts.correctionRequired}`);
  console.log(`Pending items: ${counts.pending}`);
  console.log(`Excluded items: ${counts.excluded}`);
  console.log(`Total items: ${counts.total}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : "Unable to read review status");
  process.exitCode = 1;
}
