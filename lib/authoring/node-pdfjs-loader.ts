import"server-only";

/** Load PDF.js only after installing the geometry globals it reads at import time. */
export async function loadNodePdfJs(){
  const canvas=await import("@napi-rs/canvas");
  const globals=globalThis as unknown as Record<string,unknown>;
  globals.DOMMatrix??=canvas.DOMMatrix;
  globals.ImageData??=canvas.ImageData;
  globals.Path2D??=canvas.Path2D;
  return import("pdfjs-dist/legacy/build/pdf.mjs");
}
