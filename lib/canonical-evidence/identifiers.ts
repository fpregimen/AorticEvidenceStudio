import type { EvidenceItemId, EvidenceRevisionReference, LocationId, ReferenceChainId, ReviewId, ReviewerId, SourceFileId, SourceId, SourceVersionId } from "./types.ts";

export const canonicalIdPrefixes = ["SRC_", "SRV_", "SFL_", "EVI_", "REV_", "LOC_", "RVR_", "RFC_"] as const;
export type CanonicalIdPrefix = typeof canonicalIdPrefixes[number];
const uuidV7Payload = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const prefixBrands = { SRC_: "SourceId", SRV_: "SourceVersionId", SFL_: "SourceFileId", EVI_: "EvidenceItemId", REV_: "ReviewId", LOC_: "LocationId", RVR_: "ReviewerId", RFC_: "ReferenceChainId" } as const;
type IdByPrefix = { SRC_: SourceId; SRV_: SourceVersionId; SFL_: SourceFileId; EVI_: EvidenceItemId; REV_: ReviewId; LOC_: LocationId; RVR_: ReviewerId; RFC_: ReferenceChainId };

export function isUuidV7CompatiblePayload(value: string) { return uuidV7Payload.test(value); }
export function parseCanonicalId<P extends CanonicalIdPrefix>(value: string, prefix: P): IdByPrefix[P] {
  if (!value.startsWith(prefix) || !isUuidV7CompatiblePayload(value.slice(prefix.length))) throw new Error(`Invalid ${prefixBrands[prefix]}`);
  return value as IdByPrefix[P];
}
export function formatEvidenceRevisionReference(evidenceItemId: EvidenceItemId, revision: number): EvidenceRevisionReference {
  if (!Number.isInteger(revision) || revision < 1) throw new Error("Evidence revision must be a positive integer");
  return `${evidenceItemId}@r${revision}` as EvidenceRevisionReference;
}
export function parseEvidenceRevisionReference(value: string) {
  const match = /^(EVI_[0-9a-f-]+)@r([1-9]\d*)$/.exec(value);
  if (!match) throw new Error("Invalid evidence revision reference");
  const evidenceItemId = parseCanonicalId(match[1], "EVI_");
  const revisionNumber = Number(match[2]);
  return { evidenceItemId, revisionNumber, reference: value as EvidenceRevisionReference };
}
