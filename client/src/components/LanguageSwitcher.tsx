import { useLocale } from "@/contexts/LocaleContext";
import { useLocation } from "wouter";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, t, switchLocaleHref } = useLocale();
  const [, setLocation] = useLocation();

  const go = (target: "en" | "ar") => {
    if (target === locale) return;
    setLocation(switchLocaleHref(target));
  };

  return (
    <div
      className={`lang-switcher ${className}`}
      role="group"
      aria-label={locale === "ar" ? t("lang.switchToEn") : t("lang.switchToAr")}
    >
      <button
        type="button"
        className={locale === "en" ? "is-active" : ""}
        aria-current={locale === "en" ? "true" : undefined}
        aria-label={locale === "en" ? t("lang.currentEn") : t("lang.switchToEn")}
        onClick={() => go("en")}
      >
        {t("lang.en")}
      </button>
      <span className="lang-switcher-divider" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        className={locale === "ar" ? "is-active" : ""}
        aria-current={locale === "ar" ? "true" : undefined}
        aria-label={locale === "ar" ? t("lang.currentAr") : t("lang.switchToAr")}
        onClick={() => go("ar")}
      >
        {t("lang.ar")}
      </button>
    </div>
  );
}
