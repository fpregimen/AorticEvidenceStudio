"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import { useLanguage } from "./language-provider";

interface ResultSource {
  sourceId: string;
  title: string;
  sourceType: string;
}

interface ApprovedSynthesis {
  approved: boolean;
  evidenceComplete: boolean;
  incompleteCount: number;
  incompleteSources: string[];
  findings: string[];
  sources: ResultSource[];
}

const tabs = [
  ["Summary", "要約"],
  ["Evidence", "エビデンス"],
  ["Guidelines", "ガイドライン"],
  ["Devices", "デバイス"],
  ["US vs Japan", "米国と日本"],
  ["Evidence Gaps", "エビデンスギャップ"],
  ["Create Output", "成果物作成"],
];

const evidenceLabels: Record<string, [string, string]> = {
  "AES-RCT-001": ["Published evidence · randomized trial", "公表エビデンス・ランダム化試験"],
  "AES-RCT-002": ["Published evidence · extended randomized follow-up", "公表エビデンス・ランダム化試験の長期追跡"],
  "AES-RCT-003": ["Published evidence · randomized trial", "公表エビデンス・ランダム化試験"],
  "AES-GDL-001": ["Guideline recommendation · United States", "ガイドライン推奨・米国"],
  "AES-GDL-002": ["Guideline recommendation · United States", "ガイドライン推奨・米国"],
  "AES-GDL-003": ["Guideline recommendation · Europe/international", "ガイドライン推奨・欧州／国際"],
  "AES-GDL-004": ["Guideline recommendation · Japan", "ガイドライン推奨・日本"],
  "AES-REG-001": ["Published evidence · prospective registry", "公表エビデンス・前向きレジストリ"],
  "AES-OBS-001": ["Published evidence · retrospective cohort", "公表エビデンス・後ろ向きコホート"],
};

const sourceFindingIndex: Record<string, number> = {
  "AES-RCT-001": 1,
  "AES-RCT-002": 2,
  "AES-RCT-003": 3,
  "AES-GDL-001": 4,
  "AES-GDL-002": 4,
  "AES-GDL-003": 4,
  "AES-GDL-004": 4,
  "AES-REG-001": 6,
  "AES-OBS-001": 7,
};

function Label({ children }: { children: React.ReactNode }) {
  return <span className="badge">{children}</span>;
}

export function ResultsClient({ synthesis }: { synthesis: ApprovedSynthesis }) {
  const { language } = useLanguage();
  const [tab, setTab] = useState("Summary");
  const [question, setQuestion] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [mobilePanel, setMobilePanel] = useState(false);
  const [desktopPanel, setDesktopPanel] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuestion(localStorage.getItem("aes-question")?.trim() || null);
      setMode(localStorage.getItem("aes-mode")?.trim() || null);
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function selectTab(value: string, event: React.MouseEvent<HTMLButtonElement>) {
    setTab(value);
    event.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  return <div className="results-shell shell py-10">
    <div className="prototype-notice rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-900">
      {t(language, "Prototype demonstration — not a live literature search.", "プロトタイプ表示 — 実際の文献検索結果ではありません。")}
    </div>
    {synthesis.approved && <ApprovedSummary synthesis={synthesis} language={language} />}
    <div className="results-heading mt-7">
      <div className="eyebrow">{t(language, "Submitted question", "送信された質問")}</div>
      {loaded && question ? <>
        <h1 className="mt-2 max-w-4xl text-2xl font-semibold">{question}</h1>
        <p className="mt-3 text-sm text-slate-600"><span className="prototype-label">{t(language, "Prototype result", "プロトタイプ結果")}</span>{mode && <> · {t(language, "Workflow", "ワークフロー")}: <b>{mode}</b></>}</p>
      </> : loaded ? <div className="mt-3 rounded-xl border border-slate-200 bg-white p-5">
        <p className="font-semibold">{t(language, "No submitted question was found.", "送信された質問が見つかりません。")}</p>
        <Link href="/" className="mt-3 inline-block text-sm font-bold text-blue-700">{t(language, "Return home to ask a question", "ホームに戻って質問を入力する")} →</Link>
      </div> : <p className="mt-3 text-sm text-slate-500">{t(language, "Loading submitted question…", "送信された質問を読み込んでいます…")}</p>}
    </div>
    <div className="results-layout mt-8 flex items-start gap-7">
      <section className="min-w-0 flex-1">
        <div className="tabs-fade"><div role="tablist" aria-label={t(language, "Result sections", "結果セクション")} className="results-tabs flex gap-1 overflow-x-auto border-b border-slate-200">
          {tabs.map(item => <button role="tab" aria-selected={tab === item[0]} onClick={event => selectTab(item[0], event)} key={item[0]} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold ${tab === item[0] ? "border-blue-700 bg-blue-50/60 text-blue-800" : "border-transparent text-slate-500"}`}>{t(language, item[0], item[1])}</button>)}
        </div></div>
        <div className="results-content mt-6">
          {tab === "Summary" && <Summary synthesis={synthesis} language={language} />}
          {tab === "Evidence" && <Evidence synthesis={synthesis} language={language} />}
          {tab === "Guidelines" && <Guidelines synthesis={synthesis} language={language} />}
          {tab === "Devices" && <Devices />}
          {tab === "US vs Japan" && <Regional synthesis={synthesis} language={language} />}
          {tab === "Evidence Gaps" && <Gaps synthesis={synthesis} language={language} />}
          {tab === "Create Output" && <Outputs language={language} />}
        </div>
        <div className="mobile-reference md:hidden">
          <button className="btn btn-secondary mt-5 min-h-11 w-full" aria-expanded={mobilePanel} onClick={() => setMobilePanel(!mobilePanel)}>{mobilePanel ? t(language, "Hide References", "参照パネルを閉じる") : t(language, "Show References", "参照パネルを表示")}</button>
          {mobilePanel && <Reference synthesis={synthesis} language={language} />}
        </div>
      </section>
      <aside className="desktop-only sticky top-28 w-80 shrink-0">
        <button className="mb-2 w-full text-right text-sm font-bold" aria-expanded={desktopPanel} onClick={() => setDesktopPanel(!desktopPanel)}>{desktopPanel ? t(language, "Hide References", "参照パネルを閉じる") : t(language, "Show References", "参照パネルを表示")}</button>
        {desktopPanel && <Reference synthesis={synthesis} language={language} />}
      </aside>
    </div>
  </div>;
}

function ApprovedSummary({ synthesis, language }: { synthesis: ApprovedSynthesis; language: "en" | "ja" }) {
  return <section className={`mt-5 rounded-xl border p-5 ${synthesis.evidenceComplete ? "border-emerald-300 bg-emerald-50" : "border-amber-300 bg-amber-50"}`}>
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold text-white ${synthesis.evidenceComplete ? "bg-emerald-600" : "bg-amber-500"}`}>{synthesis.evidenceComplete ? t(language, "Specialist validated", "専門医検証済み") : t(language, "Approved with unresolved Evidence", "未完了のエビデンスを含む承認")}</span>
    {!synthesis.evidenceComplete && <><p className="mt-3 font-bold text-amber-950">{synthesis.incompleteCount} {t(language, "incomplete Evidence items", "件の未完了エビデンス項目")}</p><div className="mt-2 flex flex-wrap gap-3">{synthesis.incompleteSources.map(sourceId => <Link className="font-bold text-blue-700" href={`/evaluation/2/review/${sourceId}`} key={sourceId}>{sourceId}: {t(language, "Review source", "ソースをレビュー")}</Link>)}</div></>}
    <div className="mt-4 space-y-3">{synthesis.findings.map((finding, index) => <p className="leading-7" key={index}>{finding}</p>)}</div>
    <p className="mt-4 border-t border-current/20 pt-4 text-sm font-semibold">{t(language, "For specialist decision support only. Review the original sources, clinical context, regulatory status, and device IFU before use.", "専門医の意思決定支援のみを目的としています。使用前に、原典、臨床状況、規制状況、デバイスIFUを確認してください。")}</p>
  </section>;
}

function Summary({ synthesis, language }: { synthesis: ApprovedSynthesis; language: "en" | "ja" }) {
  const cards = [
    ["Brief conclusion", "簡潔な結論", "Published evidence + guideline recommendations", "公表エビデンス＋ガイドライン推奨", synthesis.findings[8]],
    ["Clinical implications", "臨床的な意味", "Expert interpretation", "専門家による解釈", t(language, "Do not apply preemptive TEVAR routinely to every uncomplicated acute TBAD. Separate complicated or evolving disease from truly uncomplicated disease, begin medical therapy and surveillance, and consider selective intervention using guideline-specific high-risk features, anatomy, procedural risk, and timing.", "合併症を伴わない急性B型大動脈解離の全例に予防的TEVARを一律に適用すべきではありません。複雑化または進行中の病態と真に非合併症例を区別し、内科治療と画像フォローを開始した上で、各ガイドライン固有の高リスク所見、解剖学的条件、手技リスク、施行時期を考慮して選択的介入を検討します。")],
    ["Important limitations", "重要な限界", "Limitations and inference", "限界と推論", synthesis.findings[5]],
  ];
  return <><div className="mb-4 flex flex-wrap gap-2"><Label>{t(language, "Published evidence", "公表エビデンス")}</Label><Label>{t(language, "Guideline recommendations", "ガイドライン推奨")}</Label><Label>{t(language, "Expert interpretation", "専門家による解釈")}</Label><Label>{t(language, "Limitations or inference", "限界または推論")}</Label></div><div className="grid gap-4 lg:grid-cols-3">{cards.map(card => <article className="card p-5" key={card[0]}><h2 className="font-bold">{t(language, card[0], card[1])}</h2><span className="badge mt-3">{t(language, card[2], card[3])}</span><p className="mt-3 text-sm leading-6 text-slate-700">{card[4]}</p></article>)}</div></>;
}

function Evidence({ synthesis, language }: { synthesis: ApprovedSynthesis; language: "en" | "ja" }) {
  return <div className="card table-wrap"><table><thead><tr>{[["Source", "ソース"], ["Evidence category", "エビデンス区分"], ["Approved synthesis finding", "承認済み統合所見"]].map(item => <th key={item[0]}>{t(language, item[0], item[1])}</th>)}</tr></thead><tbody>{synthesis.sources.map(source => <tr key={source.sourceId}><td><b>{source.sourceId}</b><div className="mt-1 text-xs text-slate-600">{source.title}</div></td><td>{t(language, ...(evidenceLabels[source.sourceId] ?? [source.sourceType, source.sourceType]))}</td><td>{synthesis.findings[sourceFindingIndex[source.sourceId]]}</td></tr>)}</tbody></table></div>;
}

function Guidelines({ synthesis, language }: { synthesis: ApprovedSynthesis; language: "en" | "ja" }) {
  const cards = [
    ["United States", "米国", "AES-GDL-001 · AES-GDL-002", t(language, "ACC/AHA allows endovascular management to be considered for uncomplicated acute TBAD with high-risk anatomic features. STS/AATS retains optimal medical therapy as standard and allows prophylactic TEVAR in stable, anatomically suitable high-risk patients.", "ACC/AHAは、高リスクの解剖学的所見を伴う非合併症性急性B型大動脈解離で血管内治療を考慮し得るとしています。STS/AATSは至適内科治療を標準としつつ、安定した解剖学的適応のある高リスク患者で予防的TEVARを選択肢としています。")],
    ["Europe / international", "欧州／国際", "AES-GDL-003", t(language, "EACTS/STS recommends medical therapy and monitoring when high-risk features are absent and says TEVAR should be considered in the subacute phase when high-risk features are present.", "EACTS/STSは、高リスク所見がない場合には内科治療と経過観察を推奨し、高リスク所見がある場合には亜急性期のTEVARを考慮すべきとしています。")],
    ["Japan", "日本", "AES-GDL-004", t(language, "The Japanese guideline supports selective TEVAR from the subacute to early chronic phase when false-lumen enlargement is predicted, gives a weaker acute-phase option, and rejects TEVAR for every patent-false-lumen case.", "日本のガイドラインは、偽腔拡大が予測される症例で亜急性期から慢性早期の選択的TEVARを支持し、急性期についてはより弱い選択肢とし、偽腔開存例の全例にTEVARを行う考えを否定しています。")],
  ];
  return <><p className="mb-4 text-sm leading-6 text-slate-600"><Label>{t(language, "Guideline recommendations", "ガイドライン推奨")}</Label> {t(language, "Terminology and timing categories differ across guidelines and are not treated as equivalent.", "用語と時期区分はガイドライン間で異なり、同義とは扱っていません。")}</p><div className="grid gap-4 md:grid-cols-3">{cards.map(card => <article className="card p-5" key={card[0]}><h2 className="font-bold">{t(language, card[0], card[1])}</h2><p className="mt-2 text-xs font-bold text-blue-700">{card[2]}</p><p className="mt-3 text-sm leading-6 text-slate-700">{card[3]}</p></article>)}</div><p className="mt-4 text-sm leading-6 text-slate-700"><Label>{t(language, "Limitations or inference", "限界または推論")}</Label> {synthesis.findings[5]}</p></>;
}

function Devices() {
  return <div className="card table-wrap"><table><thead><tr>{["Device or Technique", "Region", "Regulatory Category", "Evidence Category", "Last Verified"].map(item => <th key={item}>{item}</th>)}</tr></thead><tbody><tr><td>Example technique</td><td>Region placeholder</td><td>Not loaded</td><td>Demonstration content</td><td>Not verified</td></tr></tbody></table></div>;
}

function Regional({ synthesis, language }: { synthesis: ApprovedSynthesis; language: "en" | "ja" }) {
  const rows = [
    ["Initial management", "初期治療", t(language, "US guidelines retain optimal medical therapy with surveillance as the standard for uncomplicated acute TBAD.", "米国のガイドラインは、非合併症性急性B型大動脈解離の標準として至適内科治療と画像フォローを維持しています。"), t(language, "The Japanese guideline also begins from medical management for uncomplicated disease.", "日本のガイドラインも、非合併症例では内科治療を基本としています。")],
    ["Selective TEVAR", "選択的TEVAR", t(language, "Consideration centers on stable, anatomically suitable patients with guideline-defined high-risk features.", "安定し、解剖学的適応があり、ガイドラインで定義された高リスク所見を有する患者が検討の中心です。"), t(language, "Selection emphasizes predicted false-lumen enlargement rather than treating every patent false lumen.", "偽腔開存例の全例を治療するのではなく、偽腔拡大予測に基づく選択を重視しています。")],
    ["Timing", "施行時期", t(language, "US recommendations permit selective treatment but do not establish one definitive optimal window.", "米国の推奨は選択的治療を許容しますが、単一の至適時期を確立していません。"), t(language, "The Japanese recommendation distinguishes a stronger subacute-to-early-chronic option from a weaker acute-phase option.", "日本の推奨は、亜急性期から慢性早期の選択肢をより重く位置づけ、急性期の選択肢をより弱く区別しています。")],
  ];
  return <><div className="mb-4"><Label>{t(language, "Guideline recommendations", "ガイドライン推奨")}</Label></div><div className="card table-wrap"><table><thead><tr><th>{t(language, "Comparison", "比較項目")}</th><th>{t(language, "United States", "米国")}</th><th>{t(language, "Japan", "日本")}</th></tr></thead><tbody>{rows.map(row => <tr key={row[0]}><td><b>{t(language, row[0], row[1])}</b></td><td>{row[2]}</td><td>{row[3]}</td></tr>)}</tbody></table></div><p className="mt-4 text-sm leading-6 text-slate-700"><Label>{t(language, "Expert interpretation", "専門家による解釈")}</Label> {t(language, "Both approaches support selection rather than routine intervention; their high-risk terminology and phase definitions should not be forced into equivalence.", "いずれも一律介入ではなく症例選択を支持していますが、高リスク用語と病期定義を無理に同一視すべきではありません。")}</p><p className="mt-3 text-sm leading-6 text-slate-700"><Label>{t(language, "Limitations or inference", "限界または推論")}</Label> {synthesis.findings[5]}</p></>;
}

function Gaps({ synthesis, language }: { synthesis: ApprovedSynthesis; language: "en" | "ja" }) {
  const gaps = [
    t(language, "The magnitude of any all-cause survival benefit remains uncertain.", "全死亡に対する利益の大きさは依然として不確実です。"),
    t(language, "Improved remodeling is not proof of survival benefit.", "リモデリング改善は生存利益の証明ではありません。"),
    t(language, "The optimal intervention window is uncertain and phase definitions differ among guidelines.", "至適介入時期は不確実であり、病期定義はガイドライン間で異なります。"),
    t(language, "Registry and retrospective findings cannot establish causal treatment benefit.", "レジストリおよび後ろ向き研究の所見から治療の因果的利益を確立することはできません。"),
  ];
  return <><p className="text-sm leading-6 text-slate-700"><Label>{t(language, "Limitations or inference", "限界または推論")}</Label> {synthesis.findings[8]}</p><div className="mt-4 grid gap-3 md:grid-cols-2">{gaps.map(item => <div className="card p-4 font-semibold" key={item}>{item}</div>)}</div></>;
}

function Outputs({ language }: { language: "en" | "ja" }) {
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{["One-Slide Summary", "Two-Slide Summary", "Conference Discussion", "Guideline Draft", "Research Background", "Unmet-Need Statement"].map(item => <div className="card p-5" key={item}><h2 className="font-bold">{item}</h2><p className="my-4 text-sm text-slate-500">{t(language, "Demonstration output format", "デモ用の出力形式")}</p><button className="btn" disabled>{t(language, "Generate (demo only)", "生成（デモのみ）")}</button></div>)}</div>;
}

function Reference({ synthesis, language }: { synthesis: ApprovedSynthesis; language: "en" | "ja" }) {
  return <div className="card mt-2 p-5"><h2 className="font-bold">{t(language, "Approved source set", "承認済みソースセット")}</h2><p className="my-4 text-sm leading-6 text-slate-600">{t(language, "These registered sources support the approved Question 2 synthesis. Open a review record to inspect claim-level traceability.", "これらの登録ソースが、承認済みの評価質問2の統合結果を支えています。レビュー記録を開くと、主張単位のトレーサビリティを確認できます。")}</p><div className="space-y-3">{synthesis.sources.map(source => <div className="border-t border-slate-100 pt-3 text-xs" key={source.sourceId}><b className="block text-slate-700">{source.sourceId}</b><span className="mt-1 block text-slate-600">{source.title}</span><Link className="mt-1 inline-block font-bold text-blue-700" href={`/evaluation/2/review/${source.sourceId}`}>{t(language, "Review source", "ソースをレビュー")} →</Link></div>)}</div></div>;
}
