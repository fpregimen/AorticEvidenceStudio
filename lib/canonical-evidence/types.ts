export type Brand<T, Name extends string> = T & { readonly __brand: Name };

export type SourceId = Brand<string, "SourceId">;
export type SourceVersionId = Brand<string, "SourceVersionId">;
export type SourceFileId = Brand<string, "SourceFileId">;
export type EvidenceItemId = Brand<string, "EvidenceItemId">;
export type ReviewId = Brand<string, "ReviewId">;
export type LocationId = Brand<string, "LocationId">;
export type ReviewerId = Brand<string, "ReviewerId">;
export type ReferenceChainId = Brand<string, "ReferenceChainId">;
export type EvidenceRevisionReference = Brand<string, "EvidenceRevisionReference">;

export const evidenceAuthorityTypes = ["guideline_recommendation", "primary_study_result", "systematic_review_synthesis", "regulatory_statement", "ifu_requirement", "expert_interpretation"] as const;
export type EvidenceAuthorityType = typeof evidenceAuthorityTypes[number];
export const specialistDecisions = ["pending", "approved", "needs_correction", "excluded"] as const;
export type SpecialistDecision = typeof specialistDecisions[number];
export const verificationStatuses = ["original_source_verified", "underlying_primary_evidence_verified", "secondary_citation_only", "primary_source_not_yet_verified", "unable_to_verify", "citation_mismatch", "conflicting_interpretation"] as const;
export type VerificationStatus = typeof verificationStatuses[number];

export const sourceLifecycleStates = ["active", "superseded", "withdrawn"] as const;
export type SourceLifecycle = typeof sourceLifecycleStates[number];
export const evidenceReviewLifecycleStates = ["draft", "pending", "needs_correction", "approved", "excluded"] as const;
export type EvidenceReviewLifecycle = typeof evidenceReviewLifecycleStates[number];
export const publicationLifecycleStates = ["unpublished", "release_candidate", "published", "superseded", "retired"] as const;
export type PublicationLifecycle = typeof publicationLifecycleStates[number];
export const disputeLifecycleStates = ["none", "open", "resolved"] as const;
export type DisputeLifecycle = typeof disputeLifecycleStates[number];
export const evidencePackLifecycleStates = ["draft", "validated", "signed", "published", "revoked"] as const;
export type EvidencePackLifecycle = typeof evidencePackLifecycleStates[number];

export interface AuditMetadata { createdAt: string; createdBy: string; schemaVersion: string; }
export interface LegacyAlias { system: "aes_legacy" | "question_review" | string; value: string; }
export interface HashValue { algorithm: string; value: string; canonicalizationProfile?: string; }

export interface Source {
  sourceId: SourceId; authoritativeTitle: string; sourceType: string; lifecycle: SourceLifecycle;
  aliases: LegacyAlias[]; audit: AuditMetadata;
}
export interface SourceVersion {
  sourceVersionId: SourceVersionId; sourceId: SourceId; versionType: string; versionLabel: string;
  publicationDate?: string; authoritativeLanguage: string; audit: AuditMetadata;
}
export interface SourceFile {
  sourceFileId: SourceFileId; sourceVersionId: SourceVersionId; contentHash: HashValue;
  byteLength: number; mimeType: string; accessClassification: "restricted" | "public"; audit: AuditMetadata;
}
export interface SourceCorrectionRelationship {
  relationshipId: string; affectedSourceId: SourceId; affectedSourceVersionId?: SourceVersionId;
  correctionSourceId?: SourceId; correctedSourceVersionId?: SourceVersionId;
  kind: "erratum" | "corrigendum" | "corrected_version"; impact: string; audit: AuditMetadata;
}
export interface EvidenceItem {
  evidenceItemId: EvidenceItemId; sourceVersionId: SourceVersionId; authorityType: EvidenceAuthorityType;
  sourceLifecycle: SourceLifecycle; disputeLifecycle: DisputeLifecycle; aliases: LegacyAlias[]; audit: AuditMetadata;
}
export interface ExactSupportingQuotation { text: string; sourceLanguage: string; hash: HashValue; }
export interface EvidenceLocation {
  locationId: LocationId; sourceFileId: SourceFileId; printedPage?: string; pdfPage?: number;
  section?: string; paragraphAnchor?: string; recommendationNumber?: string; quotedPrefix?: string; quotedSuffix?: string;
}
export interface TableEvidenceLocation extends EvidenceLocation {
  kind: "table"; tableNumber: string; rowPath: string[]; columnPath: string[]; footnote?: string;
}
export interface FigureEvidenceLocation extends EvidenceLocation {
  kind: "figure"; figureNumber: string; panel: string; axesAndUnits?: string; timePoint?: string;
}
export interface NumericalOutcome {
  name: string; reportedValue: string; population: string; timePoint?: string; units?: string;
  numerator?: number; denominator?: number; locationId: LocationId;
}
export interface ApplicabilityMetadata { population?: string; intervention?: string; comparator?: string; outcome?: string; threshold?: string; timing?: string; jurisdiction?: string; }
export interface EvidenceLimitation { text: string; category: "study" | "applicability" | "uncertainty" | "interpretation" | "other"; }
export interface OriginalSourceInspection { confirmed: boolean; inspectedSourceFileId?: SourceFileId; fullText: boolean; table: boolean; figure: boolean; supplement: boolean; }
export interface ReviewerProfile { reviewerId: ReviewerId; displayName: string; specialty: string; active: boolean; audit: AuditMetadata; }
export interface SpecialistReview {
  reviewId: ReviewId; revisionReference: EvidenceRevisionReference; reviewerId: ReviewerId;
  decision: SpecialistDecision; reviewDate: string; inspection: OriginalSourceInspection; comments: string; audit: AuditMetadata;
}
export interface EvidenceRevision {
  revisionReference: EvidenceRevisionReference; evidenceItemId: EvidenceItemId; revisionNumber: number;
  predecessor?: EvidenceRevisionReference; authorityType: EvidenceAuthorityType; verificationStatus: VerificationStatus;
  reviewLifecycle: EvidenceReviewLifecycle; publicationLifecycle: PublicationLifecycle;
  assertion: string; interpretation?: string; quotation: ExactSupportingQuotation; locationIds: LocationId[];
  numericalOutcomes: NumericalOutcome[]; applicability: ApplicabilityMetadata; limitations: EvidenceLimitation[];
  specialistReviewIds: ReviewId[]; changeReason: string; audit: AuditMetadata;
}
export interface ReferenceRelationship { kind: "direct" | "indirect"; citationText: string; targetSourceVersionId?: SourceVersionId; inheritedClaim: string; }
export interface ReferenceVerification {
  reviewerId: ReviewerId; reviewDate: string; verificationStatus: VerificationStatus;
  support: "supports_exactly" | "supports_partially" | "supports_indirectly" | "does_not_support" | "contradicts" | "unable_to_determine" | "not_reviewed";
  originalSourceConfirmed: boolean; comments: string;
}
export interface ReferenceChain { referenceChainId: ReferenceChainId; citingRevision: EvidenceRevisionReference; relationships: ReferenceRelationship[]; verifications: ReferenceVerification[]; audit: AuditMetadata; }

export interface CanonicalGraph {
  sources: Source[]; sourceVersions: SourceVersion[]; sourceFiles: SourceFile[]; corrections: SourceCorrectionRelationship[];
  evidenceItems: EvidenceItem[]; evidenceRevisions: EvidenceRevision[]; locations: Array<EvidenceLocation | TableEvidenceLocation | FigureEvidenceLocation>;
  reviewers: ReviewerProfile[]; reviews: SpecialistReview[]; referenceChains: ReferenceChain[];
}
