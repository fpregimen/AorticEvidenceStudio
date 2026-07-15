import type {Metadata} from "next";import "./globals.css";import {LanguageProvider} from "@/components/language-provider";import {Header} from "@/components/header";import {Footer} from "@/components/footer";
export const metadata:Metadata={title:"Aortic Evidence Studio",description:"Bilingual aortic evidence workflow prototype"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><LanguageProvider><Header/><main>{children}</main><Footer/></LanguageProvider></body></html>}
