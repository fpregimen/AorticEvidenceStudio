import assert from"node:assert/strict";
import{readFile}from"node:fs/promises";
import{missingSynthesisRequirements,synthesisCanSave,synthesisDisplayStatus}from"../lib/synthesis-validation.ts";

const validApproved={selectedDecision:"Approved"as const,reviewerName:"Reviewer",reviewDate:"2026-07-15",confirmed:true,reviewerNote:""};
assert.equal(synthesisCanSave(validApproved),true,"Approved requires only valid synthesis form fields");
assert.deepEqual(missingSynthesisRequirements({...validApproved,reviewerName:"",reviewDate:"",confirmed:false}),["reviewer name","valid review date","synthesis confirmation"],"Approved requires decision, reviewer, valid date, and confirmation");
assert.equal(synthesisCanSave({...validApproved,selectedDecision:"Requires correction",reviewerNote:""}),false,"Requires correction additionally requires a reviewer note");
assert.equal(synthesisCanSave({...validApproved,selectedDecision:"Requires correction",reviewerNote:"Correction needed"}),true,"Requires correction saves when all synthesis fields are complete");
assert.equal(synthesisDisplayStatus("Approve synthesis",false),"Approved with unresolved Evidence");
assert.equal(synthesisDisplayStatus("Approve synthesis",true),"Specialist validated");

const client=await readFile(new URL("../components/synthesis-client.tsx",import.meta.url),"utf8");
const api=await readFile(new URL("../app/api/evaluation/2/synthesis/route.ts",import.meta.url),"utf8");
assert.match(client,/type="radio" name="decision" value="Approved" required checked=\{selectedDecision==="Approved"\}/,"Approved uses a checked native decision radio");
assert.match(client,/type="radio" name="decision" value="Requires correction" required checked=\{selectedDecision==="Requires correction"\}/,"Requires correction uses a checked native decision radio");
assert.match(client,/onChange=\{event=>setSelectedDecision\(event\.target\.value as"Approved"\)\}/,"Approved radio updates selectedDecision");
assert.match(client,/onChange=\{event=>setSelectedDecision\(event\.target\.value as"Requires correction"\)\}/,"Requires correction radio updates selectedDecision");
assert.doesNotMatch(client,/type="radio"[^>]*disabled/,"Evidence completeness must not disable either radio");
assert.doesNotMatch(api,/sourcesComplete|getContentReview|reviewProgress|Evidence reviews must be complete/,"Server save validation must not include Evidence completeness");
assert.match(api,/reviewer_name\?\.trim\(\)/);assert.match(api,/validIsoDate\(review\.review_date\)/);assert.match(api,/!review\.confirmed/);assert.match(api,/review\.decision==="Return for correction"&&!review\.reviewer_note\.trim\(\)/);
assert.match(client,/button type="submit"[^>]*>\{saving\?t\(language,"Saving…","保存中…"\):t\(language,"Save synthesis decision","統合結果の判断を保存"\)\}/,"Standard synthesis submit button exists");
assert.doesNotMatch(client,/localStorage/,"Medical validation state must not use localStorage");
assert.doesNotMatch(client,/source_documents\/private|private PDF|\.pdf\b/i,"No private PDF path may be exposed");
assert.match(client,/Evidence review warnings/);assert.match(client,/href=\{`\/evaluation\/2\/review\/\$\{row\.sourceId\}`\}/);

console.log("Synthesis validation behavior tests: 15 passed");
