import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useLocation } from "wouter";
import type { Locale } from "@/i18n/types";
import { createTranslator } from "@/i18n/translate";
import {
  parseLocaleFromPath,
  stripLocalePrefix,
  withLocalePath,
  switchLocalePath,
} from "@/i18n/routing";
import en from "@/i18n/translations/en";
import ar from "@/i18n/translations/ar";

type TFunction = (key: string, params?: Record<string, string | number>) => string;

interface LocaleContextValue {
  locale: Locale;
  t: TFunction;
  logicalPath: string;
  localePath: (logicalPath: string) => string;
  switchLocaleHref: (target: Locale) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const dictionaries = { en, ar } as const;

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [pathname, setLocation] = useLocation();

  const locale = parseLocaleFromPath(pathname);
  const logicalPath = stripLocalePrefix(pathname);

  const t = useMemo(
    () => createTranslator(dictionaries[locale]),
    [locale],
  );

  const localePath = useCallback(
    (path: string) => withLocalePath(locale, path),
    [locale],
  );

  const switchLocaleHref = useCallback(
    (target: Locale) => {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      return switchLocalePath(pathname, target, search, hash);
    },
    [pathname],
  );

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale === "ar" ? "ar" : "en";
    root.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  useEffect(() => {
    document.title = t("meta.title");
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute("content", t("meta.description"));
    }
  }, [locale, t]);

  // Redirect bare paths if needed — locale is URL-driven only
  void setLocation;

  const value = useMemo(
    () => ({
      locale,
      t,
      logicalPath,
      localePath,
      switchLocaleHref,
    }),
    [locale, t, logicalPath, localePath, switchLocaleHref],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
