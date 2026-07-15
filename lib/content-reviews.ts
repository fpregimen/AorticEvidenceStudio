import "server-only";import {readdir,readFile,rename,writeFile} from "node:fs/promises";import path from "node:path";import type {ContentReview} from "./content-review-model";
const reviewDir=path.join(process.cwd(),"database","content_reviews");
export async function getContentReviews():Promise<ContentReview[]>{const files=(await readdir(reviewDir)).filter(file=>file.endsWith(".json")).sort();return Promise.all(files.map(async file=>JSON.parse(await readFile(path.join(reviewDir,file),"utf8")) as ContentReview))}
export async function getContentReview(sourceId:string){return(await getContentReviews()).find(review=>review.source_id===sourceId)??null}
const allowedSourceIds=new Set(["AES-RCT-001","AES-RCT-002","AES-RCT-003"]);
export async function saveContentReview(review:ContentReview){
 if(!allowedSourceIds.has(review.source_id))throw new Error("Unsupported source ID");
 const current=await getContentReview(review.source_id);if(!current)throw new Error("Review not found");
 const saved:{[K in keyof ContentReview]:ContentReview[K]}={...current,specialist_validation:review.specialist_validation,last_updated:new Date().toISOString().slice(0,10)};
 const file=path.join(reviewDir,`Q02_${review.source_id}.json`),temp=`${file}.${process.pid}.tmp`;
 await writeFile(temp,`${JSON.stringify(saved,null,2)}\n`,{encoding:"utf8",flag:"wx"});await rename(temp,file);return JSON.parse(await readFile(file,"utf8"))as ContentReview;
}
