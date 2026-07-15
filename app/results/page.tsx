import {ApprovedSynthesisResult} from "@/components/approved-synthesis-result";import {ResultsClient} from "@/components/results-client";import {getQ02Synthesis} from "@/lib/synthesis-drafts";
export default async function Results(){const synthesis=await getQ02Synthesis();return <><ApprovedSynthesisResult synthesis={synthesis}/><ResultsClient/></>}
export const dynamic="force-dynamic";
