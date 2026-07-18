import{authoringAiSetup}from"@/lib/authoring/config";
import{evidenceCandidateProvider}from"@/lib/authoring/ai-provider";
import{requireAuthoringUser}from"@/lib/authoring/supabase-server";

export async function POST(request:Request,{params}:{params:Promise<{sourceId:string}>}){
 let diagnosticSourceId="unknown";
 try{
  const{client,user}=await requireAuthoringUser(),sourceId=(await params).sourceId;diagnosticSourceId=sourceId;
  const body=await request.json()as{sourceFileId?:string;pdfPage?:number;selectedText?:string};
  if(!/^SRC_[0-9a-f-]{36}$/.test(sourceId)||!/^SFL_[0-9a-f-]{36}$/.test(body.sourceFileId??"")||!Number.isInteger(body.pdfPage)||Number(body.pdfPage)<1)return Response.json({error:"Invalid candidate request"},{status:400});
  const[{data:source},{data:file}]=await Promise.all([client.from("authoring_sources").select("title,source_language").eq("source_id",sourceId).maybeSingle(),client.from("authoring_source_files").select("source_file_id").eq("source_file_id",body.sourceFileId).eq("source_id",sourceId).eq("created_by",user.id).maybeSingle()]);
  if(!source||!file)return Response.json({error:"Source file not found"},{status:404});
  const{data:page,error:pageError}=await client.from("authoring_pdf_pages").select("extracted_text").eq("source_file_id",file.source_file_id).eq("pdf_page",body.pdfPage).maybeSingle();
  if(pageError)throw new Error(`Page lookup failed: ${pageError.message}`);if(!page)return Response.json({error:"Source page not found"},{status:404});
  const selectedText=String(body.selectedText??"").trim();if(!selectedText||selectedText.length>20_000||!page.extracted_text.includes(selectedText))return Response.json({error:"The quotation is not present verbatim on the selected page"},{status:400});
  const provider=evidenceCandidateProvider();if(!provider)return Response.json({error:"AI configuration is missing",setupRequired:true},{status:503});
  const selectionStart=page.extracted_text.indexOf(selectedText),contextStart=Math.max(0,selectionStart-40_000),pageText=page.extracted_text.slice(contextStart,Math.min(page.extracted_text.length,selectionStart+selectedText.length+40_000));
  const candidates=await provider.suggest({pageText,selectedText,pdfPage:Number(body.pdfPage),sourceTitle:source.title,sourceLanguage:source.source_language}),config=authoringAiSetup();
  return Response.json({candidates,provider:config.provider,model:config.model});
 }catch(error){const detail=error instanceof Error?error.message:"Unknown AI candidate error";console.error("Authoring AI candidate request failed",{sourceId:diagnosticSourceId,error:detail});const authentication=detail==="AUTH_REQUIRED";return Response.json({error:authentication?"Authentication required":"AI candidate generation failed"},{status:authentication?401:502})}
}
