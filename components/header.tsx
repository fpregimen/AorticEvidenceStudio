"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "./language-provider";
import { t } from "@/lib/i18n";

const nav = [
  ["/", "Home", "ホーム"],
  ["/projects", "Projects", "プロジェクト"],
  ["/sources", "Source Library", "ソースライブラリ"],
  ["/evaluation", "Evaluation", "評価"],
];

export function Header() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  return <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
    <div className="shell flex min-h-20 items-center gap-4 md:gap-7">
      <Link href="/" className="mr-auto text-inherit no-underline">
        <div className="font-bold text-[1.05rem]">Aortic Evidence Studio</div>
        <div className="mt-1 hidden text-xs text-slate-500 sm:block">{t(language,"Evidence, devices, and academic workflow for aortic specialists","大動脈専門医のためのエビデンス・デバイス・学術支援")}</div>
      </Link>
      <nav className="desktop-only flex gap-5" aria-label={t(language,"Main navigation","メインナビゲーション")}>{nav.map(n=><Link className="text-sm font-semibold text-slate-600 no-underline hover:text-blue-700" href={n[0]} key={n[0]}>{t(language,n[1],n[2])}</Link>)}</nav>
      <div className="language-selector flex rounded-lg border border-slate-300 bg-slate-100 p-1 shadow-inner" aria-label={t(language,"Language","言語")}>
        <button aria-pressed={language==="en"} className={`min-h-8 rounded-md px-3 py-1 text-xs font-bold transition ${language==="en"?"bg-blue-700 text-white shadow-sm":"text-slate-600 hover:bg-white"}`} onClick={()=>setLanguage("en")}>EN</button>
        <button aria-pressed={language==="ja"} className={`min-h-8 rounded-md px-3 py-1 text-xs font-bold transition ${language==="ja"?"bg-blue-700 text-white shadow-sm":"text-slate-600 hover:bg-white"}`} onClick={()=>setLanguage("ja")}>日本語</button>
      </div>
      <div aria-label={t(language,"User placeholder","ユーザー表示")} className="desktop-only grid size-9 place-items-center rounded-full bg-slate-200 text-sm font-bold">AS</div>
      <button className="mobile-only min-h-11 rounded-lg border border-slate-300 px-3 py-2 font-bold" aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(!open)}>{open?"×":"☰"}<span className="sr-only">{t(language,"Toggle navigation","ナビゲーションを切り替え")}</span></button>
    </div>
    {open&&<nav id="mobile-navigation" className="mobile-only shell border-t border-slate-100 py-3" aria-label={t(language,"Main navigation","メインナビゲーション")}>{nav.map(n=><Link onClick={()=>setOpen(false)} className="block py-3 text-sm font-semibold text-slate-700 no-underline" href={n[0]} key={n[0]}>{t(language,n[1],n[2])}</Link>)}</nav>}
  </header>;
}
