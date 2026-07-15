export type Language = "en" | "ja";
export const t = (language: Language, en: string, ja: string) => language === "ja" ? ja : en;
