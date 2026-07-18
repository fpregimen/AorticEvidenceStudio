import "server-only";
import{createHash}from"node:crypto";
import{loadNodePdfJs}from"./node-pdfjs-loader";
export interface ExtractedPdfPage{pdfPage:number;text:string;textSha256:string}
export async function extractNativePdfText(bytes:Uint8Array):Promise<ExtractedPdfPage[]>{
  const pdfjs=await loadNodePdfJs();
  const loadingTask=pdfjs.getDocument({data:bytes,useWorkerFetch:false,useSystemFonts:true,disableAutoFetch:true,disableStream:true}),document=await loadingTask.promise;
  const pages:ExtractedPdfPage[]=[];
  for(let pageNumber=1;pageNumber<=document.numPages;pageNumber++){
    const page=await document.getPage(pageNumber),content=await page.getTextContent();
    const text=content.items.map(item=>"str" in item?item.str:"").join(" ").replace(/\s+/g," ").trim();
    pages.push({pdfPage:pageNumber,text,textSha256:createHash("sha256").update(text).digest("hex")});
  }
  await loadingTask.destroy();return pages;
}
