import {notFound} from "next/navigation";import {SourceDetailClient} from "@/components/source-detail-client";import {getSource,getSources} from "@/lib/source-catalog";
export async function generateStaticParams(){return (await getSources()).map(source=>({sourceId:source.source_id}))}
export default async function Page({params}:{params:Promise<{sourceId:string}>}){const{sourceId}=await params;const source=await getSource(decodeURIComponent(sourceId));if(!source)notFound();return <SourceDetailClient source={source}/>}
