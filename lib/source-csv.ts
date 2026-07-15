import type { SourceRecord } from "./source-model";

export function parseCsv(text:string):Record<string,string>[] {
  const rows:string[][]=[];let row:string[]=[];let cell="";let quoted=false;
  for(let i=0;i<text.length;i++){const char=text[i];if(char==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++}else quoted=!quoted}else if(char===','&&!quoted){row.push(cell);cell=""}else if((char==='\n'||char==='\r')&&!quoted){if(char==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(value=>value.length>0))rows.push(row);row=[];cell=""}else cell+=char}
  row.push(cell);if(row.some(value=>value.length>0))rows.push(row);if(!rows.length)return[];
  const headers=rows[0].map(value=>value.trim());return rows.slice(1).map(values=>Object.fromEntries(headers.map((header,index)=>[header,(values[index]??"").trim()])));
}

const nullable=(value:string|undefined)=>value?.trim()||null;
const list=(value:string|undefined)=>value?.split(";").map(item=>item.trim()).filter(Boolean)??[];
const bool=(value:string|undefined):boolean|null=>value==="true"?true:value==="false"?false:null;
const number=(value:string|undefined):number|null=>value?.trim()?Number(value):null;

export function toSourceRecord(raw:Record<string,string>):SourceRecord{return{
  source_id:raw.source_id||"",title:raw.title||"",authors:list(raw.authors),publication_year:number(raw.publication_year),publication_date:nullable(raw.publication_date),source_type:raw.source_type||"",evidence_design:nullable(raw.evidence_design),evidence_level:nullable(raw.evidence_level),region:raw.region||"",country:nullable(raw.country),clinical_domains:list(raw.clinical_domains),diseases:list(raw.diseases),procedures:list(raw.procedures),devices:list(raw.devices),manufacturer:nullable(raw.manufacturer),journal_or_organization:nullable(raw.journal_or_organization),PMID:nullable(raw.PMID),DOI:nullable(raw.DOI),official_url:nullable(raw.official_url),language:raw.language||"",regulatory_status:nullable(raw.regulatory_status),approval_region:nullable(raw.approval_region),approval_date:nullable(raw.approval_date),version:nullable(raw.version),is_peer_reviewed:bool(raw.is_peer_reviewed),is_primary_source:bool(raw.is_primary_source),is_current:bool(raw.is_current),superseded_by:nullable(raw.superseded_by),last_verified_date:nullable(raw.last_verified_date),verification_status:raw.verification_status||"",reviewer:nullable(raw.reviewer),notes:nullable(raw.notes),evidence_summary:nullable(raw.evidence_summary),key_findings:list(raw.key_findings),limitations:list(raw.limitations),relevant_evaluation_questions:list(raw.relevant_evaluation_questions).map(Number)
}}
