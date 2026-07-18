import{downloadPrivateSourceFile}from"@/lib/authoring/repository";
export const dynamic="force-dynamic";
export async function GET(_:Request,{params}:{params:Promise<{sourceFileId:string}>}){try{const{bytes,sha256}=await downloadPrivateSourceFile((await params).sourceFileId);return new Response(bytes,{headers:{"content-type":"application/pdf","content-disposition":"inline","cache-control":"private, no-store","x-content-type-options":"nosniff",etag:`\"${sha256}\"`}})}catch{return new Response("Not found",{status:404})}}
