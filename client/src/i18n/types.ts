export type Locale = "en" | "ar";

export const LOCALES: Locale[] = ["en", "ar"];

export const DEFAULT_LOCALE: Locale = "en";

export interface TranslationDict {
  [key: string]: string | TranslationDict | undefined;
}
