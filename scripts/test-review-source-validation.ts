import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parseCsv } from "../lib/source-csv.ts";
import { expectedReviewFilename, isRegisteredReviewSourceId, isSafeReviewQuestionId, isSafeReviewSourceId } from "../lib/review-source-validation.ts";
const root = process.cwd(), catalog = parseCsv(await readFile(path.join(root, "database/source_catalog.csv"), "utf8")), catalogSourceIds = new Set(catalog.map(source => source.source_id));
const reviewFiles = (await readdir(path.join(root, "database/content_reviews"))).filter(file => file.endsWith(".json"));
const reviews = await Promise.all(reviewFiles.map(async file => JSON.parse(await readFile(path.join(root, "database/content_reviews", file), "utf8")) as { source_id: string }));
const reviewSourceIds = new Set(reviews.map(review => review.source_id)), registered = (sourceId: string) => isRegisteredReviewSourceId(sourceId, catalogSourceIds, reviewSourceIds);
assert.equal(registered("AES-GDL-001"), true);
for (const sourceId of ["AES-RCT-001", "AES-RCT-002", "AES-RCT-003"]) assert.equal(registered(sourceId), true);
assert.equal(registered("AES-GDL-999"), false);
for (const sourceId of ["../AES-GDL-001", "AES-GDL-001/../../source_catalog", "AES-GDL-001%2F..%2F.."]) { assert.equal(isSafeReviewSourceId(sourceId), false); assert.equal(registered(sourceId), false) }
assert.equal(isSafeReviewQuestionId("Q02"), true); assert.equal(isSafeReviewQuestionId("Q03"), true); assert.equal(isSafeReviewQuestionId("Q99"), true);
for (const questionId of ["../Q02", "Q03/../../etc", "Q03%2F..%2F.."]) assert.equal(isSafeReviewQuestionId(questionId), false);
assert.equal(expectedReviewFilename("Q03", "AES-GDL-001"), "Q03_AES-GDL-001.json");
assert.throws(() => expectedReviewFilename("../Q03", "AES-GDL-001"), /Unsafe/);
console.log("Review source validation tests: 20 passed");
