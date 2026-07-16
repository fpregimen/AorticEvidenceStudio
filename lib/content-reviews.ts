import "server-only";import {readdir,readFile,rename,writeFile} from "node:fs/promises";import path from "node:path";import type {ContentReview} from "./content-review-model";import{getSources}from"./source-catalog";import{isRegisteredReviewSourceId,isSafeReviewSourceId}from"./review-source-validation";
const reviewDir=path.join(process.cwd(),"database","content_reviews");
async function getReviewEntries(){const files=(await readdir(reviewDir)).filter(file=>file.endsWith(".json")).sort();return Promise.all(files.map(async file=>({file,review:JSON.parse(await readFile(path.join(reviewDir,file),"utf8"))as ContentReview})))}
export async function getContentReviews():Promise<ContentReview[]>{return(await getReviewEntries()).map(entry=>entry.review)}
export async function getContentReview(sourceId:string){if(!isSafeReviewSourceId(sourceId))return null;return(await getReviewEntries()).find(entry=>entry.review.source_id===sourceId)?.review??null}
export async function isRegisteredContentReviewSourceId(sourceId:string){if(!isSafeReviewSourceId(sourceId))return false;const[sources,entries]=await Promise.all([getSources(),getReviewEntries()]);return isRegisteredReviewSourceId(sourceId,new Set(sources.map(source=>source.source_id)),new Set(entries.map(entry=>entry.review.source_id)))}
export async function saveContentReview(review:ContentReview){
 if(!await isRegisteredContentReviewSourceId(review.source_id))throw new Error("Unsupported source ID");
 const entry=(await getReviewEntries()).find(candidate=>candidate.review.source_id===review.source_id);if(!entry)throw new Error("Review not found");const current=entry.review;
 const saved:{[K in keyof ContentReview]:ContentReview[K]}={...current,specialist_validation:review.specialist_validation,last_updated:new Date().toISOString().slice(0,10)};
 const file=path.join(reviewDir,entry.file),temp=`${file}.${process.pid}.tmp`;
 await writeFile(temp,`${JSON.stringify(saved,null,2)}\n`,{encoding:"utf8",flag:"wx"});await rename(temp,file);return JSON.parse(await readFile(file,"utf8"))as ContentReview;
}
