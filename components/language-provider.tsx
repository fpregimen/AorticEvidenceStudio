"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Language } from "@/lib/i18n";
const Context=createContext<{language:Language;setLanguage:(v:Language)=>void}>({language:"en",setLanguage:()=>{}});
export function LanguageProvider({children}:{children:React.ReactNode}){const [language,setLanguageState]=useState<Language>("en");useEffect(()=>{const timer=window.setTimeout(()=>{const v=localStorage.getItem("aes-language");if(v==="ja")setLanguageState("ja")},0);return()=>window.clearTimeout(timer)},[]);const setLanguage=(v:Language)=>{setLanguageState(v);localStorage.setItem("aes-language",v)};return <Context.Provider value={{language,setLanguage}}>{children}</Context.Provider>}
export const useLanguage=()=>useContext(Context);
