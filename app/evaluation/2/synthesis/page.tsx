import{SynthesisClient}from"@/components/synthesis-client";import{getQ02Synthesis}from"@/lib/synthesis-drafts";
export default async function Page(){return <SynthesisClient draft={await getQ02Synthesis()}/>}
