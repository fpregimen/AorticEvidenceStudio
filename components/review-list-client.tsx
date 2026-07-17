"use client";
import Link from "next/link";
import { useLanguage } from "./language-provider";
import { t } from "@/lib/i18n";
import type { ContentReview } from "@/lib/content-review-model";
import type { PublicSourceRecord } from "@/lib/source-model";
import { reviewHasMappedIncompleteApprovals, reviewListAggregation } from "@/lib/approval-completeness";

export function ReviewListClient({ items, questionId, routeSegment, hasSynthesis }: { items: Array<{ review: ContentReview; source: PublicSourceRecord }>; questionId: string; routeSegment: string; hasSynthesis: boolean }) {
  const { language } = useLanguage();
  return <main className="shell py-12">
    <Link href="/evaluation">← {t(language, "Evaluation Framework", "評価フレームワーク")}</Link>
    <div className="eyebrow mt-6">{questionId}</div>
    <h1 className="mt-2 text-3xl font-semibold">{t(language, "Content Review Workspace", "コンテンツレビューワークスペース")}</h1>
    {hasSynthesis && <Link href={`/evaluation/${routeSegment}/synthesis/validate`} className="btn mt-5 inline-block no-underline">{t(language, "Open synthesis validation", "統合検証を開く")}</Link>}
    {items.length === 0 && <p className="card mt-6 p-6 text-sm text-slate-600">{t(language, "No source review records have been created for this question.", "この質問のソースレビュー記録はまだ作成されていません。")}</p>}
    <div className="mt-6 space-y-4">{items.map(({ review, source }) => {
      const {claims,outcomes}=reviewListAggregation(review),status=reviewHasMappedIncompleteApprovals(review)?"Approval incomplete":review.review_status;
      return <article className="card p-5" key={review.review_id}><div className="flex flex-wrap justify-between gap-3"><div><b>{source.source_id}</b><p className="mt-1 text-sm">{source.title}</p></div><StatusBadge status={status} /></div><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4"><Count label={t(language, "Fully approved claims", "完全承認済み主張")} value={claims.Approved} /><Count label={t(language, "Incomplete approvals", "未完了承認")} value={claims["Approval incomplete"]} /><Count label={t(language, "Pending / correction / excluded", "保留 / 修正 / 除外")} value={`${claims.Pending} / ${claims["Needs correction"]} / ${claims.Excluded}`} /><Count label={t(language, "Approved / incomplete outcomes", "完全承認 / 未完了アウトカム")} value={`${outcomes.Approved} / ${outcomes["Approval incomplete"]}`} /></dl><div className="mt-4 flex gap-4"><Link href={`/evaluation/${routeSegment}/review/${source.source_id}`}>{t(language, "Review", "レビュー")}</Link><Link href={`/evaluation/${routeSegment}/review/${source.source_id}/validate`}>{t(language, "Validate", "検証")}</Link></div></article>;
    })}</div>
  </main>;
}

function Count({ label, value }: { label: string; value: string | number }) { return <div><dt className="text-xs font-bold text-slate-500">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div> }
export function StatusBadge({ status }: { status: string }) { const color = status === "Approved" || status === "Specialist validated" ? "bg-emerald-100 text-emerald-800" : status === "Approval incomplete" ? "bg-amber-100 text-amber-900" : status === "Needs correction" || status === "Requires correction" ? "bg-red-100 text-red-800" : status === "Excluded" ? "bg-slate-200 text-slate-700" : "bg-slate-100 text-slate-700"; return <span className={`validation-badge ${color}`}>{status}</span> }
