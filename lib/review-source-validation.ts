const sourceIdPattern = /^AES-[A-Z0-9]+(?:-[A-Z0-9]+)*$/;

export function isSafeReviewSourceId(sourceId: string) {
  return sourceIdPattern.test(sourceId);
}

export function isRegisteredReviewSourceId(
  sourceId: string,
  catalogSourceIds: ReadonlySet<string>,
  reviewSourceIds: ReadonlySet<string>,
) {
  return isSafeReviewSourceId(sourceId) && catalogSourceIds.has(sourceId) && reviewSourceIds.has(sourceId);
}
