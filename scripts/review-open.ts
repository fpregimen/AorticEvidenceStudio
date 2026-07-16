import { spawnSync } from "node:child_process";
import { loadReviewWorkflowContext, requireSingleSourceId } from "../lib/review-workflow.ts";

try {
  const sourceId = requireSingleSourceId(process.argv.slice(2));
  await loadReviewWorkflowContext(process.cwd(), sourceId);
  const url = `http://localhost:3000/evaluation/2/review/${encodeURIComponent(sourceId)}`;
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
