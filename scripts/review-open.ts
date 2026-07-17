import { spawnSync } from "node:child_process";
import { loadReviewWorkflowContext, requireExistingReview, requireQuestionAndSourceIds } from "../lib/review-workflow.ts";

try {
  const { questionId, sourceId } = requireQuestionAndSourceIds(process.argv.slice(2));
  const context = await loadReviewWorkflowContext(process.cwd(), questionId, sourceId);
  requireExistingReview(context);
  const segment = questionId === "Q02" ? "2" : questionId;
  const url = `http://localhost:3000/evaluation/${segment}/review/${encodeURIComponent(sourceId)}`;
  if (process.platform !== "darwin") {
    console.log(`Open this review URL: ${url}`);
  } else {
    const result = spawnSync("open", [url], { stdio: "ignore" });
    if (result.status === 0) console.log(`Opened review URL: ${url}`);
    else console.log(`Browser could not be opened. Open this review URL: ${url}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : "Unable to open source review");
  process.exitCode = 1;
}
