import assert from"node:assert/strict";
import{createHash}from"node:crypto";
import{readFile}from"node:fs/promises";

function minimalTextPdf(text:string){
  const objects=[
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${text.length+33} >>\nstream\nBT /F1 18 Tf 30 80 Td (${text}) Tj ET\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  ];
  let body="%PDF-1.4\n";const offsets=[0];
  objects.forEach((object,index)=>{offsets.push(Buffer.byteLength(body));body+=`${index+1} 0 obj\n${object}\nendobj\n`});
  const xref=Buffer.byteLength(body);body+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n${offsets.slice(1).map(value=>`${String(value).padStart(10,"0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new Uint8Array(Buffer.from(body));
}

const loader=await readFile("lib/authoring/node-pdfjs-loader.ts","utf8"),extraction=await readFile("lib/authoring/pdf-extraction.ts","utf8"),route=await readFile("app/api/authoring/source-files/[sourceFileId]/extract/route.ts","utf8"),workflow=await readFile("lib/authoring/payload-safe-pdf.ts","utf8"),nextConfig=await readFile("next.config.ts","utf8");
const canvasImport=loader.indexOf('import("@napi-rs/canvas")'),domInstall=loader.indexOf("globals.DOMMatrix"),workerImport=loader.indexOf('import("pdfjs-dist/legacy/build/pdf.worker.mjs")'),workerInstall=loader.indexOf("globalThis.pdfjsWorker="),pdfImport=loader.indexOf('import("pdfjs-dist/legacy/build/pdf.mjs")');
assert.ok(canvasImport>=0&&domInstall>canvasImport&&workerImport>domInstall&&workerInstall>workerImport&&pdfImport>workerInstall,"canvas, worker preload, and PDF.js main-module order must be enforced");
assert.doesNotMatch(extraction,/from["']pdfjs-dist|import\s+.*pdfjs-dist/);assert.match(extraction,/loadNodePdfJs/);assert.match(extraction,/useWorkerFetch:false/);assert.match(extraction,/disableAutoFetch:true/);assert.match(route,/export const runtime="nodejs"/);
assert.match(workflow,/extraction_status:"failed"/);assert.match(workflow,/source_file\.extraction_failed/);assert.doesNotMatch(workflow,/source_files"\)\.delete/);
assert.match(loader,/typeof worker\.WorkerMessageHandler!=="function"/);assert.match(nextConfig,/serverExternalPackages:\["@napi-rs\/canvas","pdfjs-dist"\]/);assert.match(nextConfig,/pdfjs-dist\/legacy\/build\/pdf\.worker\.mjs/);
delete(globalThis as Record<string,unknown>).DOMMatrix;delete(globalThis as Record<string,unknown>).ImageData;delete(globalThis as Record<string,unknown>).Path2D;delete(globalThis as Record<string,unknown>).pdfjsWorker;
const canvas=await import("@napi-rs/canvas"),globals=globalThis as unknown as Record<string,unknown>;globals.DOMMatrix=canvas.DOMMatrix;globals.ImageData=canvas.ImageData;globals.Path2D=canvas.Path2D;const worker=await import("pdfjs-dist/legacy/build/pdf.worker.mjs");assert.equal(typeof worker.WorkerMessageHandler,"function");globals.pdfjsWorker={WorkerMessageHandler:worker.WorkerMessageHandler};const pdfjs=await import("pdfjs-dist/legacy/build/pdf.mjs");assert.equal(typeof(globalThis as unknown as{pdfjsWorker?:{WorkerMessageHandler?:unknown}}).pdfjsWorker?.WorkerMessageHandler,"function");const task=pdfjs.getDocument({data:minimalTextPdf("Native PDF text"),useWorkerFetch:false,disableAutoFetch:true,disableStream:true}),document=await task.promise,page=await document.getPage(1),content=await page.getTextContent(),text=content.items.map(item=>"str" in item?item.str:"").join(" ").trim(),hash=createHash("sha256").update(text).digest("hex");await task.destroy();assert.equal(document.numPages,1);assert.match(text,/Native PDF text/);assert.equal(typeof globals.DOMMatrix,"function");assert.equal(hash.length,64);
console.log("Node PDF extraction tests: 21 passed");
