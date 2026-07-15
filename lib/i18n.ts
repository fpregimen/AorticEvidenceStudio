export type Language = "en" | "ja";
export const t = (language: Language, ...text: [en: string, ja: string]) => language === "ja" ? text[1] : text[0];
