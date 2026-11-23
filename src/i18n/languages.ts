// Site languages. The language is driven by the URL (one prerendered URL per language),
// not by state. Names are endonyms: each language named in itself.
// Final list is still open in the design doc (Vietnamese suggested, not confirmed).
export const LANGUAGES = [
  { code: "en", name: "English", dir: "ltr", homePath: "/" },
  { code: "es", name: "Español", dir: "ltr", homePath: "/es/" },
  { code: "ko", name: "한국어", dir: "ltr", homePath: "/ko/" },
  { code: "fa", name: "فارسی", dir: "rtl", homePath: "/fa/" },
] as const;

export type Language = (typeof LANGUAGES)[number];
export type LanguageCode = Language["code"];

// The page's language. "en" until per-language routing and prerendering exist;
// then it comes from the URL.
export const CURRENT_LANGUAGE: LanguageCode = "en";

export function getLanguage(code: LanguageCode): Language {
  return LANGUAGES.find((language) => language.code === code) ?? LANGUAGES[0];
}
