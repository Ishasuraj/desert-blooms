import type { TranslationDict } from "./types";

function getNested(dict: TranslationDict, key: string): string | undefined {
  const parts = key.split(".");
  let current: string | TranslationDict | undefined = dict;
  for (const part of parts) {
    if (current === undefined || typeof current === "string") return undefined;
    current = current[part];
  }
  return typeof current === "string" ? current : undefined;
}

export function createTranslator(dict: TranslationDict) {
  return function t(
    key: string,
    params?: Record<string, string | number>,
  ): string {
    let value = getNested(dict, key);
    if (value === undefined) {
      if (import.meta.env.DEV) {
        console.warn(`[i18n] Missing key: ${key}`);
      }
      return key;
    }
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return value;
  };
}
