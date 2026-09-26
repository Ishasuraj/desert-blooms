/* Desert Botanical Editorial direction: a lost-path wayfinding moment using limestone, Oasis Green, terracotta, and calm garden language. */
import { ArrowUpRight, Leaf } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function NotFound() {
  const { t, localePath } = useLocale();

  return (
    <main className="not-found-page">
      <div className="not-found-topline"><span>{t("notFound.toplineLeft")}</span><span>{t("notFound.toplineRight")}</span></div>
      <section className="not-found-content">
        <div className="not-found-mark"><Leaf size={21} strokeWidth={1.4} /></div>
        <p className="eyebrow"><span className="eyebrow-line" /> {t("notFound.eyebrow")}</p>
        <h1>{t("notFound.title")}<br /><i>{t("notFound.titleEm")}</i></h1>
        <p className="not-found-copy">{t("notFound.body")}</p>
        <a className="button button-dark" href={localePath("/")}>{t("notFound.cta")} <ArrowUpRight size={17} /></a>
      </section>
      <div className="not-found-footer"><span>{t("notFound.footerLeft")}</span><span>{t("notFound.footerRight")}</span></div>
    </main>
  );
}
