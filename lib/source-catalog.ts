import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseCsv, toSourceRecord } from "./source-csv";
import type { PublicSourceRecord } from "./source-model";

export async function getSources():Promise<PublicSourceRecord[]>{const csv=await readFile(path.join(process.cwd(),"database","source_catalog.csv"),"utf8");return parseCsv(csv).map(toSourceRecord)}
export async function getSource(sourceId:string){return (await getSources()).find(source=>source.source_id===sourceId)??null}
