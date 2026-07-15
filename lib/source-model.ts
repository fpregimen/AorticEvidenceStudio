export const arraySourceFields = ["authors","clinical_domains","diseases","procedures","devices","key_findings","limitations"] as const;

export interface SourceRecord {
  source_id:string; title:string; authors:string[]; publication_year:number|null; publication_date:string|null;
  source_type:string; evidence_design:string|null; evidence_level:string|null; region:string; country:string|null;
  clinical_domains:string[]; diseases:string[]; procedures:string[]; devices:string[]; manufacturer:string|null;
  journal_or_organization:string|null; PMID:string|null; DOI:string|null; official_url:string|null;
  language:string; regulatory_status:string|null; approval_region:string|null; approval_date:string|null;
  version:string|null; is_peer_reviewed:boolean|null; is_primary_source:boolean|null; is_current:boolean|null;
  superseded_by:string|null; last_verified_date:string|null; verification_status:string; reviewer:string|null;
  notes:string|null; evidence_summary:string|null; key_findings:string[]; limitations:string[];
  relevant_evaluation_questions:number[];
}

export type PublicSourceRecord = SourceRecord;
