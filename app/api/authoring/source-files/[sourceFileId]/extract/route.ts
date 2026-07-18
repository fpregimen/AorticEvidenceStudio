import{extractSourceFile}from"@/lib/authoring/payload-safe-pdf";
export const runtime="nodejs";
export const maxDuration=60;
export async function POST(_:Request,{params}:{params:Promise<{sourceFileId:string}>}){try{return Response.json(await extractSourceFile((await params).sourceFileId))}catch(error){return Response.json({error:error instanceof Error?error.message:"Extraction failed",status:"failed"},{status:400})}}
