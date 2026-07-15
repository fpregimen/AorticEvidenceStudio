import {SourceLibraryClient} from "@/components/source-library-client";import {getSources} from "@/lib/source-catalog";
export default async function Page(){return <SourceLibraryClient sources={await getSources()}/>}
