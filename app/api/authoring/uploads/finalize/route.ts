import{finalizeSignedPdfUpload}from"@/lib/authoring/payload-safe-pdf";
export async function POST(request:Request){try{const body=await request.json()as{uploadId?:string};return Response.json(await finalizeSignedPdfUpload(String(body.uploadId??"")))}catch(error){return Response.json({error:error instanceof Error?error.message:"Unable to finalize upload"},{status:400})}}
