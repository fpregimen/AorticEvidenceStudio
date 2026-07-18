declare module"pdfjs-dist/legacy/build/pdf.worker.mjs"{
  export const WorkerMessageHandler:unknown;
}

// eslint-disable-next-line no-var -- ambient var declares a globalThis property.
declare var pdfjsWorker:{WorkerMessageHandler:unknown}|undefined;
