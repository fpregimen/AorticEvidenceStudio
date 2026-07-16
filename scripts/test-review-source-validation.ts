import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parseCsv } from "../lib/source-csv.ts";
import { isRegisteredReviewSourceId, isSafeReviewSourceId } from "../lib/review-source-validation.ts";

const root = process.cwd();
const catalog = parseCsv(await readFile(path.join(root, "database", "source_catalog.csv"), "utf8"));
const catalogSourceIds = new Set(catalog.map((source) => source.source_id));
const reviewFiles = (await readdir(path.join(root, "database", "content_reviews"))).filter((file) => file.endsWith(".json"));
const reviews = await Promise.all(reviewFiles.map(async(file)=>JSON.parse(await readFile(path.join(root,"database","content_reviews",file),"utf8"))as{source_id:string}));
const reviewSourceIds = new Set(reviews.map((review) => review.source_id));
const registered = (sourceId: string) => isRegisteredReviewSourceId(sourceId, catalogSourceIds, reviewSourceIds);

assert.equal(registered("AES-GDL-001"), true, "AES-GDL-001 is a registered review source");
for (const sourceId of ["AES-RCT-001", "AES-RCT-002", "AES-RCT-003"]) assert.equal(registered(sourceId), true, `${sourceId} remains accepted`);
assert.equal(registered("AES-GDL-999"), false, "An unknown source ID is rejected");
for (const sourceId of ["../AES-GDL-001", "AES-GDL-001/../../source_catalog", "AES-GDL-001%2F..%2F.."]){assert.equal(isSafeReviewSourceId(sourceId),false,`Path traversal input is rejected: ${sourceId}`);assert.equal(registered(sourceId),false,`Path traversal input is not registered: ${sourceId}`)}

console.log("Review source validation tests: 11 passed");
