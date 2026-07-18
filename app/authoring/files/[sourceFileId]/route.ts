import{privateSourceFileUrl}from"@/lib/authoring/repository";
export const dynamic="force-dynamic";
export async function GET(_:Request,{params}:{params:Promise<{sourceFileId:string}>}){try{return Response.redirect(await privateSourceFileUrl((await params).sourceFileId),307)}catch{return new Response("Not found",{status:404,headers:{"cache-control":"private, no-store"}})}}
