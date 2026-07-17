const sourceIdPattern = /^AES-[A-Z0-9]+(?:-[A-Z0-9]+)*$/;
const questionIdPattern = /^Q\d{2}$/;

export function isSafeReviewSourceId(sourceId: string) {
  return sourceIdPattern.test(sourceId);
}

export function isSafeReviewQuestionId(questionId: string) {
  return questionIdPattern.test(questionId);
}

export function expectedReviewFilename(questionId: string, sourceId: string) {
  if (!isSafeReviewQuestionId(questionId) || !isSafeReviewSourceId(sourceId)) throw new Error("Unsafe question or source ID");
  return `${questionId}_${sourceId}.json`;
}

export function isRegisteredReviewSourceId(
  sourceId: string,
  catalogSourceIds: ReadonlySet<string>,
  reviewSourceIds: ReadonlySet<string>,
) {
  return isSafeReviewSourceId(sourceId) && catalogSourceIds.has(sourceId) && reviewSourceIds.has(sourceId);
}
