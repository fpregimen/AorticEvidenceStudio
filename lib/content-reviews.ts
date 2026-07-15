import "server-only";import {readdir,readFile} from "node:fs/promises";import path from "node:path";import type {ContentReview} from "./content-review-model";
const reviewDir=path.join(process.cwd(),"database","content_reviews");
export async function getContentReviews():Promise<ContentReview[]>{const files=(await readdir(reviewDir)).filter(file=>file.endsWith(".json")).sort();return Promise.all(files.map(async file=>JSON.parse(await readFile(path.join(reviewDir,file),"utf8")) as ContentReview))}
export async function getContentReview(sourceId:string){return(await getContentReviews()).find(review=>review.source_id===sourceId)??null}
