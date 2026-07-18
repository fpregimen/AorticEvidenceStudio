import type{EvidenceAuthorityType,SpecialistDecision,VerificationStatus}from"../canonical-evidence/types";
export interface AuthoringSource{source_id:string;title:string;source_type:string;identifier_type:string;identifier_value:string;source_language:string;created_at:string}
export interface AuthoringVersion{source_version_id:string;source_id:string;version_label:string;created_at:string}
export interface AuthoringRevision{revision_ref:string;evidence_item_id:string;revision_number:number;source_version_id:string;exact_quotation:string;printed_page:string|null;pdf_page:number|null;section_or_recommendation:string|null;text_anchor:string;table_location:string|null;figure_location:string|null;interpretation:string;limitation:string;authority_type:EvidenceAuthorityType;verification_status:VerificationStatus;review_lifecycle:string;created_at:string}
export interface AuthoringReview{review_id:string;revision_ref:string;decision:SpecialistDecision;reviewer_name:string;review_date:string;original_source_confirmed:boolean;reviewer_note:string;created_at:string}
export interface AuditEvent{audit_id:string;action:string;entity_type:string;entity_id:string;actor_id:string|null;created_at:string;details:Record<string,unknown>}
export interface SourceBundle{source:AuthoringSource;versions:AuthoringVersion[];revisions:AuthoringRevision[];reviews:AuthoringReview[];audit:AuditEvent[]}
