export interface WorkspaceDraft{
  exactQuotation:string;printedPage:string;sectionOrRecommendation:string;textAnchor:string;tableLocation:string;figureLocation:string;interpretation:string;limitation:string;authorityType:string;verificationStatus:string;authoringMethod:"manual"|"ai_suggested";aiProvider:string;aiModel:string
}
export interface AiCandidatePayload{candidates?:Array<Record<string,unknown>>;provider?:string;model?:string;error?:string;setupRequired?:boolean}
export interface PageSelection{quotation:string;start:number;end:number}

export function selectionFromTextarea(pageText:string,textareaValue:string,start:number,end:number):PageSelection|null{
  if(textareaValue!==pageText||!Number.isInteger(start)||!Number.isInteger(end)||start<0||end<=start||end>pageText.length)return null;
  const raw=pageText.slice(start,end),leading=raw.length-raw.trimStart().length,trailing=raw.length-raw.trimEnd().length,quotation=raw.trim();return quotation&&pageText.includes(quotation)?{quotation,start:start+leading,end:end-trailing}:null;
}
export function quotationFromTextareaSelection(pageText:string,textareaValue:string,start:number,end:number){return selectionFromTextarea(pageText,textareaValue,start,end)?.quotation??null}
export function emptyPageDraft():WorkspaceDraft{return{exactQuotation:"",printedPage:"",sectionOrRecommendation:"",textAnchor:"",tableLocation:"",figureLocation:"",interpretation:"",limitation:"",authorityType:"primary_study_result",verificationStatus:"primary_source_not_yet_verified",authoringMethod:"manual",aiProvider:"",aiModel:""}}
export function pageResponseIsCurrent(response:{sourceFileId:string;pdfPage:number},active:{sourceFileId:string;pdfPage:number},responseRequestId:number,currentRequestId:number){return responseRequestId===currentRequestId&&response.sourceFileId===active.sourceFileId&&response.pdfPage===active.pdfPage}
export function aiDisabledReason(input:{aiConfigured:boolean;extractionStatus?:string;hasPage:boolean;hasQuotation:boolean}){
  if(input.extractionStatus!=="complete")return"Extraction is incomplete / 抽出が完了していません";
  if(!input.hasPage)return"No extracted page selected / 抽出ページが選択されていません";
  if(!input.hasQuotation)return"Select or enter an exact quotation first / 先に正確な引用を選択または入力してください";
  if(!input.aiConfigured)return"AI configuration is missing / AI設定がありません";
  return null;
}
const value=(candidate:Record<string,unknown>,key:string,current:string)=>typeof candidate[key]==="string"&&candidate[key].trim()?candidate[key].trim():current;
export function mergeAiCandidate(current:WorkspaceDraft,candidate:Record<string,unknown>,provider:string,model:string):WorkspaceDraft{
  const authority=value(candidate,"authorityType",current.authorityType),allowedAuthorities=["guideline_recommendation","primary_study_result","systematic_review_synthesis","regulatory_statement","ifu_requirement","expert_interpretation"];
  return{...current,exactQuotation:current.exactQuotation,printedPage:value(candidate,"printedPage",current.printedPage),sectionOrRecommendation:value(candidate,"sectionOrRecommendation",current.sectionOrRecommendation),textAnchor:value(candidate,"textAnchor",current.textAnchor),tableLocation:value(candidate,"tableLocation",current.tableLocation),figureLocation:value(candidate,"figureLocation",current.figureLocation),interpretation:value(candidate,"interpretation",current.interpretation),limitation:value(candidate,"limitation",current.limitation),authorityType:allowedAuthorities.includes(authority)?authority:current.authorityType,verificationStatus:current.verificationStatus,authoringMethod:"ai_suggested",aiProvider:provider,aiModel:model};
}
export async function requestAiCandidate(fetcher:typeof fetch,url:string,input:{sourceFileId:string;pdfPage:number;selectedText:string}){
  const response=await fetcher(url,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(input)});let payload:AiCandidatePayload;
  try{payload=await response.json()as AiCandidatePayload}catch{throw new Error("AI service returned an invalid response / AIサービスの応答形式が正しくありません")}
  if(!response.ok)throw new Error(payload.error?`${payload.error} / AI候補を生成できませんでした`:"AI candidate request failed / AI候補リクエストに失敗しました");
  const candidate=payload.candidates?.[0];if(!candidate)throw new Error("No supported candidate was returned / 根拠付き候補が返されませんでした");
  return{candidate,provider:String(payload.provider??""),model:String(payload.model??"")};
}
