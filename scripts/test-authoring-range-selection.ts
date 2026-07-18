import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { selectionFromDomRange } from "../lib/authoring/workspace-client-state.ts";

const dom=new JSDOM("<!doctype html><body><pre data-extracted-page-text></pre><p id='outside'>Outside</p></body>"),document=dom.window.document,container=document.querySelector("pre")!,outside=document.querySelector("#outside")!;
container.append("First sentence.\n",document.createElement("span"),"Third sentence.");
container.querySelector("span")!.textContent="Second sentence; exact punctuation.\n";
const pageText=container.textContent!,nodes=[...container.childNodes],range=document.createRange();
range.setStart(nodes[0],6);range.setEnd(nodes[1].firstChild!,15);
const spanning=selectionFromDomRange(container,range,pageText);
assert.deepEqual(spanning,{quotation:"sentence.\nSecond sentence",start:6,end:31});
assert.equal(pageText.slice(spanning!.start,spanning!.end),spanning!.quotation);

const replacement=document.createRange();replacement.setStart(nodes[2],0);replacement.setEnd(nodes[2],15);
assert.deepEqual(selectionFromDomRange(container,replacement,pageText),{quotation:"Third sentence.",start:52,end:67});

const external=document.createRange();external.selectNodeContents(outside);
assert.equal(selectionFromDomRange(container,external,pageText),null);
const collapsed=document.createRange();collapsed.setStart(nodes[0],0);collapsed.collapse(true);
assert.equal(selectionFromDomRange(container,collapsed,pageText),null);
assert.equal(selectionFromDomRange(container,range,`${pageText} stale`),null);

console.log("Authoring Range selection tests: 5 passed");
