import { execFileSync, spawnSync } from "node:child_process";
import { finalizationPreflight, loadReviewWorkflowContext, parseGitPorcelain, requireSingleSourceId } from "../lib/review-workflow.ts";

function run(command: string, args: string[], cwd: string) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed`);
}

try {
  const sourceId = requireSingleSourceId(process.argv.slice(2));
  const root = process.cwd();
  const context = await loadReviewWorkflowContext(root, sourceId);
  const branch = execFileSync("git", ["branch", "--show-current"], { cwd: root, encoding: "utf8" }).trim();
  if (branch !== "main") throw new Error(`Finalization requires main; current branch is ${branch || "detached HEAD"}`);
  const status = execFileSync("git", ["status", "--porcelain=v1", "--untracked-files=all"], { cwd: root, encoding: "utf8" });
  const preflight = finalizationPreflight(context.review, parseGitPorcelain(status), context.reviewRelativePath);
  if (!preflight.ok) throw new Error(`Finalization preflight failed:\n- ${preflight.errors.join("\n- ")}`);
  console.log(`Finalization preflight passed for ${sourceId}. Running required checks before staging.`);
  for (const script of ["validate:sources", "validate:reviews", "lint", "build"]) run("npm", ["run", script], root);
  run("git", ["add", "--", context.reviewRelativePath], root);
  const staged = execFileSync("git", ["diff", "--cached", "--name-only"], { cwd: root, encoding: "utf8" }).trim().split("\n").filter(Boolean);
  if (staged.length !== 1 || staged[0] !== context.reviewRelativePath) throw new Error("Staging safety check failed; commit was not created");
  run("git", ["commit", "-m", `Finalize specialist review for ${sourceId}`], root);
  run("git", ["push", "origin", "main"], root);
  console.log(`Finalized and pushed ${sourceId}.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : "Unable to finalize source review");
  process.exitCode = 1;
}
