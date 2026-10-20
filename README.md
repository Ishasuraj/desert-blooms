# Catalogue, Business Details, and Gallery Source Snapshot

> This file is a copy of the frontend source files listed below, included for convenient reference. The application uses the source files at their paths; edits to this README do not change the website.

## client/src/pages/Home.tsx

```tsx
/*
 * Desert Botanical Editorial direction: a calm, tactile Kuwait landscaping experience.
 */
import { contact } from "@/contact";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLocale } from "@/contexts/LocaleContext";
import { CartDrawer } from "@/components/tools/CartDrawer";
import { ReceiptModal } from "@/components/tools/ReceiptModal";
import { TOOLS } from "@/data/tools";
import { ToolCard } from "@/components/tools/ToolCard";
import { LocalizedLink } from "@/components/LocalizedLink";
import { SERVICES } from "@/data/services";
import { getLocalizedService } from "@/i18n/servicesLocalized";
import {
  ENQUIRY_SERVICES,
  enquiryDisplayLabel,
} from "@/i18n/enquiryLabels";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Compass,
  Droplets,
  Leaf,
  Phone,
  Sparkles,
  Sprout,
  SunMedium,
  Trees,
} from "lucide-react";

import companyOverviewImage from "@/assets/services/company_overview.png";
import { SiteHeader } from "@/components/SiteHeader";

const heroImage = "/images/desert-blooms-hero.webp";
const gardenImage = "/images/desert-blooms-garden.webp";
const brandMark = "/images/desert-blooms-logo.png";

const SERVICE_ICONS: Record<string, typeof Leaf> = {
  "indoor-landscaping": Leaf,
  "outdoor-landscaping": SunMedium,
  "landscape-design-installation": Compass,
  "irrigation-systems": Droplets,
  "landscape-maintenance": Sprout,
  "plants-palms-ground-covers": Trees,
};

const initialForm = {
  name: "",
  email: "",
  service: "",
  message: "",
  _gotcha: "",
};

const INTRO_STORAGE_KEY = "desert-blooms-intro-seen";

export default function Home() {
  const { t, locale, localePath } = useLocale();
  const [form, setForm] = useState(initialForm);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === "undefined") return false;
    const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mediaQuery?.matches) return false;
    try {
      return window.sessionStorage.getItem(INTRO_STORAGE_KEY) !== "true";
    } catch {
      return true;
    }
  });

  useCart();

  useEffect(() => {
    if (!showIntro) {
      try {
        window.sessionStorage.setItem(INTRO_STORAGE_KEY, "true");
      } catch {
        // no-op: browser storage may be unavailable
      }
      return;
    }

    const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mediaQuery?.matches) {
      setShowIntro(false);
      return;
    }

    const closeIntro = () => {
      setShowIntro(false);
      try {
        window.sessionStorage.setItem(INTRO_STORAGE_KEY, "true");
      } catch {
        // no-op: browser storage may be unavailable
      }
    };

    const timer = window.setTimeout(closeIntro, 2300);
    return () => window.clearTimeout(timer);
  }, [showIntro]);

  const dismissIntro = () => {
    setShowIntro(false);
    try {
      window.sessionStorage.setItem(INTRO_STORAGE_KEY, "true");
    } catch {
      // no-op: browser storage may be unavailable
    }
  };

  const introBrand = locale === "ar" ? "ديزرت بلومز" : "DESERT BLOOMS";
  const skipIntroLabel = locale === "ar" ? "تخطي المقدمة" : "Skip intro";

  const featuredTools = TOOLS.slice(0, 6);
  const displayAddress =
    locale === "ar" ? t("contact.addressAr") : contact.address;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const highlights = [
    t("home.highlight1"),
    t("home.highlight2"),
    t("home.highlight3"),
    t("home.highlight4"),
  ];

  const steps = [
    ["01", t("home.step1Title"), t("home.step1Text")],
    ["02", t("home.step2Title"), t("home.step2Text")],
    ["03", t("home.step3Title"), t("home.step3Text")],
  ] as const;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const responseText = await response.text();
      let data: { message?: string } | null = null;

      if (responseText) {
        try {
          data = JSON.parse(responseText) as { message?: string };
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.message ??
            (responseText ? responseText : t("home.formErrorGeneric")),
        );
      }

      setSent(true);
      setForm(initialForm);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : t("home.formErrorGeneric"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {showIntro && (
        <div
          className="home-intro-overlay"
          role="dialog"
          aria-live="polite"
          aria-modal="false"
          aria-label={skipIntroLabel}
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          <button
            type="button"
            className="home-intro-skip"
            onClick={dismissIntro}
            aria-label={skipIntroLabel}
          >
            {skipIntroLabel}
          </button>

          <div className="home-intro-content" aria-hidden="true">
            <div className="home-intro-wordmark">{introBrand}</div>
            <img src={brandMark} alt="" className="home-intro-logo" />
          </div>
        </div>
      )}

      <main className="min-h-screen overflow-hidden bg-[#f4f0e8] text-[#22352b]">
        <SiteHeader onNavigateSection={scrollTo} />

        <section id="top" className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" />{" "}
              <strong className="text-[#b86745] font-bold">DESERT BLOOMS</strong> ·{" "}
              {locale === "en"
                ? "Landscaping & Agricultural Care · Kuwait"
                : "تنسيق المناظر والعناية الزراعية · الكويت"}
            </p>
            {locale === "en" ? (
              <h1>
                Make room for a <i>better</i> kind of outdoors.
              </h1>
            ) : (
              <h1>{t("home.heroTitle")}</h1>
            )}
            <p className="hero-description">{t("home.heroDescription")}</p>
            <div className="hero-actions">
              <LocalizedLink href="/tools" className="button button-dark">
                {t("home.shopTools")} <ArrowUpRight size={17} />
              </LocalizedLink>
              <button type="button" className="text-link" onClick={() => scrollTo("overview")}>
                {t("home.learnAbout")} <ArrowDownRight size={16} />
              </button>
            </div>
            <div className="hero-note">
              <span>{t("home.heroNoteNum")}</span>
              <span className="note-rule" />
              <span style={{ whiteSpace: "pre-line" }}>{t("home.heroNoteText")}</span>
            </div>
          </div>
          <div className="hero-image-wrap">
            <img src={heroImage} alt={t("home.heroImgAlt")} className="hero-image" />
            <div className="hero-image-caption">
              <span>{t("home.heroCaptionFig")}</span>
              <span>{t("home.heroCaptionText")}</span>
            </div>
            <div className="hero-stamp">
              <span>{t("home.heroStampEst")}</span>
              <strong>DB</strong>
              <span>{t("home.heroStampKuwait")}</span>
            </div>
          </div>
        </section>

          <section className="field-note-strip">
          <div className="field-note-label">{t("home.fieldNoteLabel")}</div>
          <p>{t("home.fieldNoteBody")}</p>
          <div className="field-note-symbol">✳</div>
        </section>

        <section id="overview" className="company-overview-section section-shell py-20 border-b border-[#d8d0c1]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
              <div className="lg:col-span-7">
              <p className="eyebrow">
                <span className="eyebrow-line" /> {t("home.overviewEyebrow")}
              </p>
              {locale === "en" ? (
                <h2 className="text-4xl lg:text-6xl font-serif text-[#22352b] mb-6 leading-tight">
                  Desert Blooms <i>Agricultural Cont. Co.</i>
                </h2>
              ) : (
                <h2 className="text-4xl lg:text-6xl font-serif text-[#22352b] mb-6 leading-tight">
                  {t("home.overviewTitle")}
                </h2>
              )}
              <p className="text-base lg:text-lg text-[#4a584c] leading-relaxed font-sans mb-8">
                {t("home.overviewBody")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-center gap-3 p-3.5 rounded bg-white border border-[#d8d0c1] shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#315842] text-white flex items-center justify-center shrink-0">
                      <Check size={15} strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#22352b]">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative rounded-lg overflow-hidden border border-[#d8d0c1] bg-white shadow-md group">
                <img
                  src={companyOverviewImage}
                  alt={t("home.overviewImgAlt")}
                  className="w-full h-[380px] lg:h-[440px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white flex justify-between items-end">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-[#d8c8ac] font-bold">
                      {t("home.overviewImgLabel")}
                    </span>
                    <h4 className="text-xl font-serif text-[#f4f0e8] mt-0.5">
                      {t("home.overviewImgTitle")}
                    </h4>
                  </div>
                  <div className="px-3 py-1.5 rounded bg-[#b86745] text-white text-[10px] font-mono font-bold tracking-wider">
                    {t("home.overviewBadge")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 lg:p-12 rounded-xl bg-[#22352b] text-[#f1eadf] border border-[#22352b] shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
              <div className="p-8 rounded-lg bg-[#2a4236] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 text-xs tracking-widest text-[#d37a55] font-bold uppercase mb-4">
                    <Sparkles size={16} /> {t("home.visionLabel")}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-serif text-[#f1eadf] mb-4 leading-snug">
                    {t("home.visionTitle")}
                  </h3>
                  <p className="text-sm lg:text-base text-[#c7d1c5] leading-relaxed">
                    {t("home.visionQuote")}
                  </p>
                </div>
              </div>
              <div className="p-8 rounded-lg bg-[#2a4236] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 text-xs tracking-widest text-[#d37a55] font-bold uppercase mb-4">
                    <Leaf size={16} /> {t("home.missionLabel")}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-serif text-[#f1eadf] mb-4 leading-snug">
                    {t("home.missionTitle")}
                  </h3>
                  <p className="text-sm lg:text-base text-[#c7d1c5] leading-relaxed">
                    {t("home.missionQuote")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="services-section section-shell">
        <div className="section-rail">
          <span>{t("home.servicesRailNum")}</span>
          <span>{t("home.servicesRail")}</span>
        </div>
        <div className="services-content">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">{t("home.servicesEyebrow")}</p>
              {locale === "en" ? (
                <h2>
                  Landscapes that feel <i>at home.</i>
                </h2>
              ) : (
                <h2>{t("home.servicesTitle")}</h2>
              )}
            </div>
            <p className="section-intro">{t("home.servicesIntro")}</p>
          </div>
          <div className="services-list">
            {SERVICES.map((service) => {
              const localized = getLocalizedService(service, locale);
              const Icon = SERVICE_ICONS[service.slug] || Leaf;
              return (
                <LocalizedLink
                  className="service-row"
                  key={service.id}
                  href={`/services/${service.slug}`}
                >
                  <span className="service-number">{service.number}</span>
                  <span className="service-icon">
                    <Icon size={22} strokeWidth={1.4} />
                  </span>
                  <span className="service-copy">
                    <strong>{localized.title}</strong>
                    <small>{localized.summary}</small>
                  </span>
                  <ArrowUpRight className="service-arrow" size={20} />
                </LocalizedLink>
              );
            })}
          </div>
        </div>
      </section>

      <section className="featured-tools-section section-shell">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">{t("home.toolsEyebrow")}</p>
            {locale === "en" ? (
              <h2>
                Commercial <i>Gardening & Agricultural</i> Tools
              </h2>
            ) : (
              <h2>{t("home.toolsTitle")}</h2>
            )}
          </div>
          <div>
            <p className="section-intro">{t("home.toolsIntro")}</p>
            <LocalizedLink href="/tools" className="button button-dark" style={{ marginTop: "1rem" }}>
              {t("home.viewAllTools", { count: TOOLS.length })} <ArrowUpRight size={17} />
            </LocalizedLink>
          </div>
        </div>
        <div className="tools-grid" style={{ marginTop: "2rem" }}>
          {featuredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section id="approach" className="approach-section section-shell">
        <div className="approach-image-wrap">
          <img
            src={gardenImage}
            alt={t("home.approachImgAlt")}
            className="approach-image"
          />
          <span className="vertical-caption">{t("home.approachCaption")}</span>
        </div>
        <div className="approach-copy">
          <p className="eyebrow">{t("home.approachEyebrow")}</p>
          {locale === "en" ? (
            <h2>
              Good gardens begin with <i>attention.</i>
            </h2>
          ) : (
            <h2>{t("home.approachTitle")}</h2>
          )}
          <p>{t("home.approachBody")}</p>
          <div className="steps-list">
            {steps.map(([number, title, text]) => (
              <div className="step" key={number}>
                <span>{number}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="text-link" onClick={() => scrollTo("contact")}>
            {t("home.approachCta")} <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      <section className="proof-section section-shell">
        <div className="proof-quote">
          <span className="quote-mark">“</span>
          <blockquote>{t("home.proofQuote")}</blockquote>
          <p>{t("home.proofAttribution")}</p>
        </div>
        <div className="proof-facts">
          <div>
            <strong>01</strong>
            <span>{t("home.proof1Title")}</span>
            <p>{t("home.proof1Text")}</p>
          </div>
          <div>
            <strong>02</strong>
            <span>{t("home.proof2Title")}</span>
            <p>{t("home.proof2Text")}</p>
          </div>
          <div>
            <strong>03</strong>
            <span>{t("home.proof3Title")}</span>
            <p>{t("home.proof3Text")}</p>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-ornament">✳</div>
        <div className="section-shell contact-layout">
          <div className="contact-copy">
            <p className="eyebrow">{t("home.contactEyebrow")}</p>
            {locale === "en" ? (
              <h2>
                Have a space in mind?
                <br />
                <i>Let&apos;s talk.</i>
              </h2>
            ) : (
              <h2>{t("home.contactTitle")}</h2>
            )}
            <p>{t("home.contactBody")}</p>
            <div className="contact-details">
              <a href={`tel:${contact.phoneTel}`} className="ltr-isolate">
                <Phone size={17} />
                <span className="ltr-isolate">{contact.phoneDisplay}</span>
              </a>
              {contact.email ? (
                <a href={`mailto:${contact.email}`} className="ltr-isolate">
                  <ArrowUpRight size={17} />
                  <span className="ltr-isolate">{contact.email}</span>
                </a>
              ) : null}
              <span>
                <span className="detail-dot" />
                {displayAddress}
              </span>
            </div>
          </div>

          <form className="enquiry-form" onSubmit={handleSubmit}>
            <label className="hp-field" aria-hidden="true">
              Company
              <input
                tabIndex={-1}
                autoComplete="off"
                value={form._gotcha}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    _gotcha: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              {t("home.formName")}
              <input
                required
                placeholder={t("home.formNamePlaceholder")}
                value={form.name}
                maxLength={100}
                disabled={submitting || sent}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
              />
            </label>

            <label>
              {t("home.formEmail")}
              <input
                required
                type="email"
                placeholder={t("home.formEmailPlaceholder")}
                value={form.email}
                maxLength={254}
                disabled={submitting || sent}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
              />
            </label>

            <label>
              {t("home.formService")}
              <select
                required
                value={form.service}
                disabled={submitting || sent}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    service: event.target.value,
                  }))
                }
              >
                <option value="" disabled>
                  {t("home.formServicePlaceholder")}
                </option>
                {ENQUIRY_SERVICES.map((service) => (
                  <option key={service} value={service}>
                    {enquiryDisplayLabel(service, t)}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} />
            </label>

            <label>
              {t("home.formMessage")}
              <textarea
                required
                placeholder={t("home.formMessagePlaceholder")}
                rows={3}
                value={form.message}
                maxLength={5000}
                disabled={submitting || sent}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    message: event.target.value,
                  }))
                }
              />
            </label>

            <button className="button button-light" type="submit" disabled={submitting || sent}>
              {sent ? (
                <>
                  <Check size={17} /> {t("home.formSent")}
                </>
              ) : submitting ? (
                <>{t("home.formSending")}</>
              ) : (
                <>
                  {t("home.formSubmit")} <ArrowUpRight size={17} />
                </>
              )}
            </button>

            {error ? <small className="form-error">{error}</small> : null}
            {sent ? (
              <small>{t("home.formThanks")}</small>
            ) : (
              <small>{t("home.formNote")}</small>
            )}
          </form>
        </div>
      </section>

        <CartDrawer />
        <ReceiptModal />

        <footer className="site-footer">
          <div className="footer-brand">
            <img src={brandMark} alt="" className="brand-mark" />
            <span className="brand-wordmark">
              DESERT <em>BLOOMS</em>
            </span>
          </div>
          <p>{t("footer.tagline")}</p>
          <span>{t("footer.copyright")}</span>
        </footer>
      </main>
    </>
  );
}
```

## client/src/pages/ServiceDetail.tsx

```tsx
import React, { useState } from "react";
import { useParams, Redirect } from "wouter";
import { SERVICES } from "@/data/services";
import { CartDrawer } from "@/components/tools/CartDrawer";
import { ReceiptModal } from "@/components/tools/ReceiptModal";
import { ConsultationModal } from "@/components/ConsultationModal";
import { useCart } from "@/contexts/CartContext";
import { useLocale } from "@/contexts/LocaleContext";
import { getLocalizedService } from "@/i18n/servicesLocalized";
import { contact } from "@/contact";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Check,
  ShoppingBag,
  Leaf,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Phone,
  ChevronRight,
} from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";

export default function ServiceDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const { t, locale, localePath } = useLocale();

  const baseService = SERVICES.find((s) => s.slug === slug);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { totalItems, setIsCartOpen } = useCart();
  const service = baseService ? getLocalizedService(baseService, locale) : undefined;

  if (!service) {
    return <Redirect to="/" />;
  }

  return (
    <div className="service-detail-shell bg-[#f4f0e8] text-[#22352b] min-h-screen flex flex-col">
      <SiteHeader />

      {/* Main Content */}
      <main className="flex-1">
        {/* Back Link & Breadcrumb Strip */}
        <div className="section-shell pt-8 pb-4">
          <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-[#738072]">
            <a href={`${localePath("/")}#services`} className="inline-flex items-center gap-2 hover:text-[#b86745] transition-colors">
              <ArrowLeft size={14} /> {t("serviceDetail.backToServices")}
            </a>
            <span>/</span>
            <span className="text-[#b86745] font-semibold">{service.title}</span>
          </div>
        </div>

        {/* Hero Section: Asymmetric Hero Collage with 3 Images */}
        <section className="section-shell py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Main Featured Hero Image (7 cols) */}
            <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[500px] rounded-lg overflow-hidden border border-[#d8d0c1] bg-[#ebe6da] shadow-sm group">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover min-h-[380px] lg:min-h-[500px] transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white flex justify-between items-end">
                <div>
                  <span className="text-xs tracking-widest uppercase text-[#d8c8ac] font-bold">
                    {t("serviceDetail.serviceFig", { num: service.number })}
                  </span>
                  <h1 className="text-3xl lg:text-5xl font-serif text-[#f4f0e8] mt-1 leading-tight">
                    {service.title}
                  </h1>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#b86745] text-white flex items-center justify-center font-serif text-xl font-normal shadow-md shrink-0">
                  {service.number}
                </div>
              </div>
            </div>

            {/* Asymmetric Side Gallery (5 cols: 2 Stacked Image Cards) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Secondary Image Card 1 */}
              <div className="relative h-[235px] rounded-lg overflow-hidden border border-[#d8d0c1] bg-[#ebe6da] shadow-sm group">
                <img
                  src={service.galleryImages?.[0] || service.image}
                  alt={`${service.title} detail`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white flex justify-between items-center text-xs tracking-wider uppercase font-medium">
                  <span className="text-[#e8dfce]">{t("serviceDetail.fig02")}</span>
                  <span className="bg-[#315842]/80 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] text-[#e8dfce]">
                    {t("serviceDetail.kuwaitSite")}
                  </span>
                </div>
              </div>

              {/* Secondary Image Card 2 */}
              <div className="relative h-[240px] rounded-lg overflow-hidden border border-[#d8d0c1] bg-[#ebe6da] shadow-sm group">
                <img
                  src={service.galleryImages?.[1] || service.image}
                  alt={`${service.title} installation`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white flex justify-between items-center text-xs tracking-wider uppercase font-medium">
                  <span className="text-[#e8dfce]">{t("serviceDetail.fig03")}</span>
                  <span className="bg-[#b86745]/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] text-white font-bold">
                    Desert Blooms
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Intro Paragraph & Title Section */}
        <section className="section-shell py-10">
          <div className="max-w-4xl">
            <p className="eyebrow">
              <span className="eyebrow-line" /> {t("serviceDetail.overviewEyebrow")}
            </p>
            <h2 className="text-3xl lg:text-5xl font-serif text-[#22352b] mb-6">
              {t("serviceDetail.overviewTitle")} <i>{t("serviceDetail.overviewTitleEm")}</i>
            </h2>
            <p className="text-lg lg:text-xl text-[#4a584c] leading-relaxed font-sans font-medium">
              {service.intro}
            </p>
          </div>
        </section>

        {/* What's Included (Bullets) & Why It Matters (Benefits) Grid */}
        <section className="section-shell py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Bullets: What's Included */}
            <div className="p-8 rounded-lg bg-white border border-[#d8d0c1] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#315842] text-[#f4f0e8] flex items-center justify-center">
                    <Leaf size={20} />
                  </div>
                  <div>
                    <span className="text-xs tracking-widest text-[#b86745] uppercase font-bold">{t("serviceDetail.scopeLabel")}</span>
                    <h3 className="text-2xl font-serif text-[#22352b]">{t("serviceDetail.scopeTitle")}</h3>
                  </div>
                </div>

                <ul className="space-y-4">
                  {service.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm lg:text-base text-[#22352b]">
                      <CheckCircle2 size={18} className="text-[#315842] shrink-0 mt-0.5" />
                      <span className="font-medium">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Benefits: Why It Matters */}
            <div className="p-8 rounded-lg bg-[#315842] text-[#f1eadf] border border-[#315842] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#b86745] text-white flex items-center justify-center">
                    <Check size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="text-xs tracking-widest text-[#d37a55] uppercase font-bold">{t("serviceDetail.outcomesLabel")}</span>
                    <h3 className="text-2xl font-serif text-[#f1eadf]">{t("serviceDetail.outcomesTitle")}</h3>
                  </div>
                </div>

                <ul className="space-y-4">
                  {service.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm lg:text-base text-[#e8e2d6]">
                      <span className="w-6 h-6 rounded-full bg-[#4c8b62]/40 text-[#d37a55] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps (if present e.g. for Landscape Design & Installation) */}
        {service.process && service.process.length > 0 && (
          <section className="section-shell py-12">
            <div className="p-8 lg:p-12 rounded-lg bg-[#e6e0d3] border border-[#d8d0c1]">
              <div className="mb-8">
                <p className="eyebrow">{t("serviceDetail.methodology")}</p>
                <h3 className="text-3xl lg:text-4xl font-serif text-[#22352b]">
                  {t("serviceDetail.processTitle")}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {service.process.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-md bg-white border border-[#d8d0c1] flex flex-col justify-between relative group hover:border-[#b86745] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-serif text-2xl text-[#b86745]">0{idx + 1}</span>
                      {idx < (service.process?.length ?? 0) - 1 && (
                        <ChevronRight size={16} className="text-[#879182] hidden lg:block" />
                      )}
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#22352b] leading-snug">
                      {p.step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Highlighted Closing Call to Action (CTA) Section */}
        <section className="section-shell py-14">
          <div className="p-8 lg:p-14 rounded-lg bg-[#315842] text-center text-[#f1eadf] relative overflow-hidden shadow-md">
            <div className="max-w-2xl mx-auto relative z-10">
              <span className="text-xs tracking-widest text-[#d37a55] uppercase font-bold block mb-3">
                {t("serviceDetail.ctaEyebrow")}
              </span>
              <h2 className="text-3xl lg:text-5xl font-serif text-[#f1eadf] mb-6 leading-tight">
                {service.cta}
              </h2>
              <p className="text-sm lg:text-base text-[#b7c1b3] mb-8 max-w-lg mx-auto">
                {t("serviceDetail.ctaBody")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-4 bg-[#b86745] hover:bg-[#a45637] text-white text-xs tracking-widest uppercase font-semibold rounded inline-flex items-center gap-2 transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  {t("serviceDetail.requestConsultation")} <ArrowUpRight size={17} />
                </button>
                <a
                  href={`tel:${contact.phoneTel}`}
                  className="px-8 py-4 bg-[#22352b] hover:bg-[#1a2921] text-white text-xs tracking-widest uppercase font-semibold rounded inline-flex items-center gap-2 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <Phone size={16} /> {t("serviceDetail.call")} {contact.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Cart Drawer, Receipt Modal & Consultation Dialog Modal */}
      <CartDrawer />
      <ReceiptModal />
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultService={service.title}
      />

      {/* Footer */}
      <footer className="site-footer mt-auto">
        <div className="footer-brand">
          <img src="/images/desert-blooms-logo.png" alt="" className="brand-mark" />
          <span className="brand-wordmark">
            DESERT <em>BLOOMS</em>
          </span>
        </div>
        <p>Landscaping & Agricultural Care · Kuwait</p>
        <span>© 2026 Desert Blooms Agricultural Cont. Co.</span>
      </footer>
    </div>
  );
}
```

## client/src/data/services.ts

```ts
import indoor1 from "@/assets/services/indoor_landscaping.jpg";
import indoor2 from "@/assets/services/indoor_landscaping_2.jpg";
import indoor3 from "@/assets/services/indoor_landscaping_3.png";

import outdoor1 from "@/assets/services/outdoor_landscaping.jpg";
import outdoor2 from "@/assets/services/outdoor_landscaping_2.jpg";
import outdoor3 from "@/assets/services/outdoor_landscaping_3.jpg";

import design1 from "@/assets/services/design_installation.jpg";
import design2 from "@/assets/services/design_installation_2.jpg";
import design3 from "@/assets/services/design_installation_3.jpg";

import irrigation1 from "@/assets/services/irrigation_systems.jpg";
import irrigation2 from "@/assets/services/irrigation_systems_2.jpg";
import irrigation3 from "@/assets/services/irrigation_systems_3.jpg";

import maintenance1 from "@/assets/services/landscape_maintenance.jpg";
import maintenance2 from "@/assets/services/landscape_maintenance_2.jpg";
import maintenance3 from "@/assets/services/landscape_maintenance_3.jpg";

import plants1 from "@/assets/services/plants_palms.jpg";
import plants2 from "@/assets/services/plants_palms_2.jpg";
import plants3 from "@/assets/services/plants_palms_3.jpg";

export interface Service {
  id: string;
  slug: string;
  number: string;
  title: string;
  summary: string;
  intro: string; // 2-3 sentence expanded paragraph
  bullets: string[]; // what's included
  benefits: string[]; // why it matters / outcomes
  cta: string; // closing call to action line
  image: string;
  galleryImages?: string[]; // optional additional images for asymmetric hero collage
  process?: { step: string }[];
}

export const SERVICES: Service[] = [
  {
    id: "indoor-landscaping",
    slug: "indoor-landscaping",
    number: "01",
    title: "INDOOR LANDSCAPING",
    summary: "Interior planting solutions designed to refresh commercial and residential spaces.",
    intro:
      "Bringing greenery indoors does more than decorate a space — it changes how a room feels and functions. We design and install indoor plant environments tailored to offices, hotels, and commercial interiors across Kuwait, where the harsh outdoor climate makes indoor green spaces especially valued. From a single statement planter to a full living wall, every installation is chosen for the light, humidity, and traffic of the space it's going into.",
    bullets: [
      "Indoor Plants & Trees",
      "Green Walls & Vertical Gardens",
      "Decorative Planters",
      "Natural Ambience for Offices/Hotels/Commercial Spaces",
      "Low Maintenance Solutions",
    ],
    benefits: [
      "Improves indoor air quality",
      "Softens hard commercial interiors",
      "Creates a calmer, more welcoming space for staff and visitors",
      "Selected for low upkeep in Kuwait's indoor climate",
    ],
    cta: "Have a lobby, office, or interior space that needs life? Get a free indoor landscaping consultation.",
    image: indoor1,
    galleryImages: [indoor2, indoor3],
  },
  {
    id: "outdoor-landscaping",
    slug: "outdoor-landscaping",
    number: "02",
    title: "OUTDOOR LANDSCAPING",
    summary: "Beautiful and functional outdoor spaces built for Kuwait's climate and lifestyle.",
    intro:
      "An outdoor space in Kuwait has to work with the climate, not against it — hardy planting, smart shade, and layouts that stay usable even in peak summer heat. We build residential gardens, villa landscapes, and public and commercial outdoor spaces that balance beauty with practicality, combining softscapes and hardscapes into a cohesive, low-maintenance design.",
    bullets: [
      "Residential Landscaping",
      "Commercial & Public Landscapes",
      "Softscapes & Hardscapes",
      "Palm Trees & Ornamental Plants",
      "Garden Lighting",
      "Water Features",
    ],
    benefits: [
      "Designed specifically for Kuwait's climate and soil",
      "Increases property value and curb appeal",
      "Combines beauty with day-to-day usability",
      "Lighting and water features extend outdoor living into the evening",
    ],
    cta: "Ready to transform your outdoor space? Get a free outdoor landscaping consultation.",
    image: outdoor1,
    galleryImages: [outdoor2, outdoor3],
  },
  {
    id: "landscape-design-installation",
    slug: "landscape-design-installation",
    number: "03",
    title: "LANDSCAPE DESIGN & INSTALLATION",
    summary: "Full-service design and execution for landscapes that are planned and installed with precision.",
    intro:
      "Every great landscape starts as an idea and a site visit. Our design team manages the full journey from first concept to final handover, so you're not coordinating separate designers, suppliers, and installers yourself — one team owns the project end to end, with attention to detail at every stage.",
    bullets: [
      "Custom Landscape Concepts",
      "Site & Soil Assessment",
      "Material Sourcing & Selection",
      "Full Installation Management",
      "Post-Installation Support",
    ],
    benefits: [
      "Single point of accountability from concept to completion",
      "Designs matched to your site's specific conditions",
      "No coordination headaches between separate contractors",
      "Ongoing support after handover",
    ],
    process: [
      { step: "Consultation & Site Assessment" },
      { step: "Concept & Design" },
      { step: "Material Selection" },
      { step: "Installation & Execution" },
      { step: "Final Handover & Support" },
    ],
    cta: "Have a landscape project in mind? Get a free design consultation and site assessment.",
    image: design1,
    galleryImages: [design2, design3],
  },
  {
    id: "irrigation-systems",
    slug: "irrigation-systems",
    number: "04",
    title: "IRRIGATION SYSTEMS",
    summary: "Efficient watering systems that save water while keeping landscapes healthy year-round.",
    intro:
      "Kuwait's climate makes efficient irrigation a necessity, not a luxury — a landscape is only as healthy as its watering system. We design and install irrigation setups that deliver the right amount of water to the right place at the right time, cutting waste while keeping green spaces healthy through the hottest months.",
    bullets: [
      "Automatic Irrigation Systems",
      "Drip Irrigation",
      "Smart Controllers & Timers",
      "Water-Efficient Solutions",
      "Maintenance & Upgrades",
    ],
    benefits: [
      "Reduces water waste and utility costs",
      "Keeps landscapes healthy year-round with minimal manual effort",
      "Smart controllers adjust automatically to weather and season",
      "Extends the life of existing plantings",
    ],
    cta: "Want a landscape that waters itself efficiently? Get a free irrigation system assessment.",
    image: irrigation1,
    galleryImages: [irrigation2, irrigation3],
  },
  {
    id: "landscape-maintenance",
    slug: "landscape-maintenance",
    number: "05",
    title: "LANDSCAPE MAINTENANCE",
    summary: "Reliable upkeep that keeps gardens clean, green, and presentation-ready through every season.",
    intro:
      "A landscape needs consistent care to stay healthy, especially in Kuwait's demanding climate. We offer regular maintenance programs and one-off seasonal services that keep lawns, plants, and gardens looking their best year-round, so your investment in landscaping doesn't fade after the first season.",
    bullets: [
      "Lawn Care & Mowing",
      "Pruning & Trimming",
      "Weed Control & Fertilization",
      "Pest & Disease Management",
      "Seasonal Cleanups",
      "Scheduled Maintenance Contracts",
    ],
    benefits: [
      "Protects your original landscaping investment long-term",
      "Flexible one-off or scheduled contract options",
      "Early pest and disease detection prevents costly damage",
      "Keeps properties looking presentation-ready year-round",
    ],
    cta: "Keep your landscape looking its best. Ask about a maintenance contract.",
    image: maintenance1,
    galleryImages: [maintenance2, maintenance3],
  },
  {
    id: "plants-palms-ground-covers",
    slug: "plants-palms-ground-covers",
    number: "06",
    title: "PLANTS, PALMS & GROUND COVERS",
    summary: "High-quality planting selections chosen specifically to thrive in Kuwait's conditions.",
    intro:
      "The right plant selection makes or breaks a landscape in Kuwait's climate. We supply and plant a wide range of palms, ornamentals, flowering plants, and ground covers chosen specifically for their ability to thrive in the local heat and soil conditions — so what you plant today still looks good years from now.",
    bullets: [
      "Palm Trees",
      "Ornamental Plants & Shrubs",
      "Flowering Plants",
      "Ground Covers",
      "Cacti & Succulents",
      "Plants Supply & Plantation",
    ],
    benefits: [
      "Species selected specifically for Kuwait's climate and soil",
      "Wide range from statement palms to low ground covers",
      "Direct supply and planting in one service",
      "Reduces plant loss and replacement costs long-term",
    ],
    cta: "Need plants that will actually thrive here? Get a free plant selection consultation.",
    image: plants1,
    galleryImages: [plants2, plants3],
  },
];

export const whyChooseUs: string[] = [
  "Experienced & Professional Team",
  "High Quality & Reliable Service",
  "Creative & Customized Solutions",
  "Use of Quality Materials & Plants",
  "Timely Completion & Support",
  "Commitment to Sustainability",
];

```

## client/src/contact.ts

```ts
const phoneDisplay =
  import.meta.env.VITE_CONTACT_PHONE?.trim() || "+965 50410443";
const phoneTel =
  import.meta.env.VITE_CONTACT_PHONE_TEL?.trim() || "+96550410443";
const whatsappNumber =
  import.meta.env.VITE_CONTACT_WHATSAPP?.trim() || "96560096148";
const email =
  import.meta.env.VITE_CONTACT_EMAIL?.trim() || "desertbloooms@gmail.com";

export const contact = {
  phoneDisplay,
  phoneTel,
  whatsappNumber,
  whatsappUrl: `https://wa.me/${whatsappNumber}`,
  address:
    "Al Sharq, Ahmed Al Jabar St., Bldg Al Thimar International Holding Co., - Block 2 - Floor 15, Kuwait",
  email,
} as const;
```

## client/src/i18n/servicesLocalized.ts

```ts
import type { Service } from "@/data/services";
import type { Locale } from "./types";
import { SERVICES_AR } from "./services.ar";

export type LocalizedService = Service;

export function getLocalizedService(
  service: Service,
  locale: Locale,
): LocalizedService {
  if (locale === "en") return service;
  const ar = SERVICES_AR[service.slug];
  if (!ar) return service;
  return { ...service, ...ar };
}
```

## client/src/i18n/services.ar.ts

```ts
import type { Service } from "@/data/services";

type ServiceCopy = Pick<
  Service,
  "title" | "summary" | "intro" | "bullets" | "benefits" | "cta" | "process"
>;

export const SERVICES_AR: Record<string, ServiceCopy> = {
  "indoor-landscaping": {
    title: "تنسيق المناظر الداخلية",
    summary:
      "حلول زراعة داخلية تُنعش المساحات التجارية والسكنية.",
    intro:
      "النباتات داخل المبنى لا تزيّن المكان فحسب — بل تغيّر إحساسه وطريقة استخدامه. نصمّم وننفّذ بيئات نباتية داخلية مخصّصة للمكاتب والفنادق والمساحات التجارية في الكويت، حيث يزداد تقدير المساحات الخضراء الداخلية في ظل المناخ الخارجي القاسي. من planter واحد بارز إلى جدار أخضر كامل، كل تركيب يُختار وفق الإضاءة والرطوبة وحركة المرور في المكان.",
    bullets: [
      "نباتات وأشجار داخلية",
      "جدران خضراء وحدائق عمودية",
      "أواني زينة",
      "أجواء طبيعية للمكاتب والفنادق والمساحات التجارية",
      "حلول منخفضة الصيانة",
    ],
    benefits: [
      "تحسين جودة الهواء الداخلي",
      "تخفيف حدة التصاميم التجارية الصلبة",
      "خلق مساحة أكثر هدوءاً وترحيباً للموظفين والزوار",
      "اختيار نباتات مناسبة للصيانة في المناخ الداخلي بالكويت",
    ],
    cta: "لديك ردهة أو مكتب أو مساحة داخلية تحتاج إلى حياة؟ احصل على استشارة مجانية لتنسيق المناظر الداخلية.",
  },
  "outdoor-landscaping": {
    title: "تنسيق المناظر الخارجية",
    summary:
      "مساحات خارجية جميلة وعملية مبنية لمناخ وأسلوب حياة الكويت.",
    intro:
      "المساحة الخارجية في الكويت يجب أن تعمل مع المناخ لا ضده — نباتات قوية، ظل ذكي، وتخطيط يبقى قابلاً للاستخدام حتى في ذروة حر الصيف. نبني حدائق سكنية ومناظر فلل ومساحات خارجية عامة وتجارية توازن بين الجمال والعملية، بدمج العناصر الناعمة والصلبة في تصميم متماسك سهل الصيانة.",
    bullets: [
      "تنسيق سكني",
      "مناظر تجارية وعامة",
      "عناصر ناعمة وصلبة (softscape & hardscape)",
      "نخيل ونباتات زينة",
      "إضاءة الحدائق",
      "مسطحات مائية",
    ],
    benefits: [
      "مصمم خصيصاً لمناخ وتربة الكويت",
      "يرفع قيمة العقار ومظهره",
      "يجمع الجمال مع قابلية الاستخدام اليومي",
      "الإضاءة والمسطحات المائية تمدّ العيش الخارجي إلى المساء",
    ],
    cta: "مستعد لتحويل مساحتك الخارجية؟ احصل على استشارة مجانية لتنسيق المناظر الخارجية.",
  },
  "landscape-design-installation": {
    title: "تصميم وتنفيذ المناظر",
    summary:
      "تصميم وتنفيذ متكامل لمناظر مخططة ومركّبة بدقة.",
    intro:
      "كل منظر رائع يبدأ بفكرة وزيارة للموقع. فريق التصميم لدينا يدير الرحلة كاملة من المفهوم الأول حتى التسليم النهائي، فلا تحتاج إلى تنسيق مصممين وموردين ومقاولين منفصلين — فريق واحد يمسك المشروع من البداية للنهاية، مع عناية بالتفاصيل في كل مرحلة.",
    bullets: [
      "مفاهيم مناظر مخصّصة",
      "تقييم الموقع والتربة",
      "توريد واختيار المواد",
      "إدارة التركيب الكامل",
      "دعم ما بعد التركيب",
    ],
    benefits: [
      "مسؤولية واحدة من الفكرة حتى الإنجاز",
      "تصاميم مطابقة لظروف موقعك",
      "بدون عناء تنسيق مقاولين متعددين",
      "دعم مستمر بعد التسليم",
    ],
    process: [
      { step: "الاستشارة وتقييم الموقع" },
      { step: "المفهوم والتصميم" },
      { step: "اختيار المواد" },
      { step: "التركيب والتنفيذ" },
      { step: "التسليم النهائي والدعم" },
    ],
    cta: "لديك مشروع منظر؟ احصل على استشارة تصميم مجانية وتقييم للموقع.",
  },
  "irrigation-systems": {
    title: "أنظمة الري",
    summary:
      "أنظمة ري فعّالة توفر الماء وتحافظ على صحة المناظر على مدار العام.",
    intro:
      "مناخ الكويت يجعل الري الكفء ضرورة لا رفاهية — المنظر بصحّته فقط بقدر نظام الري. نصمّم ونركّب أنظمة ري تُوصّل الكمية المناسبة من الماء إلى المكان المناسب في الوقت المناسب، تقلّل الهدر وتحافظ على المساحات الخضراء في أشدّ شهور الحر.",
    bullets: [
      "أنظمة ري أوتوماتيكية",
      "ري بالتنقيط",
      "تحكم ذكي وموقّتات",
      "حلول موفّرة للماء",
      "صيانة وترقيات",
    ],
    benefits: [
      "يقلّل هدر الماء وتكاليف المرافق",
      "يحافظ على صحة المناظر طوال العام بجهد يدوي أقل",
      "التحكم الذكي يتكيّف مع الطقس والموسم",
      "يطيل عمر الزراعات الحالية",
    ],
    cta: "تريد منظراً يروي نفسه بكفاءة؟ احصل على تقييم مجاني لنظام الري.",
  },
  "landscape-maintenance": {
    title: "صيانة المناظر",
    summary:
      "عناية موثوقة تبقي الحدائق نظيفة وخضراء وجاهزة للعرض في كل موسم.",
    intro:
      "المنظر يحتاج عناية مستمرة ليبقى صحياً، خاصة في مناخ الكويت المتطلب. نقدّم برامج صيانة دورية وخدمات موسمية لمرة واحدة تحافظ على العشب والنباتات والحدائق في أفضل مظهر على مدار العام، حتى لا يتلاشى استثمارك في التنسيق بعد الموسم الأول.",
    bullets: [
      "عناية بالعشب والجز",
      "تقليم وتشذيب",
      "مكافحة الأعشاب والتسميد",
      "إدارة الآفات والأمراض",
      "تنظيفات موسمية",
      "عقود صيانة مجدولة",
    ],
    benefits: [
      "يحمي استثمارك في التنسيق على المدى الطويل",
      "خيارات مرنة لمرة واحدة أو بعقد",
      "اكتشاف مبكر للآفات والأمراض يمنع أضراراً مكلفة",
      "يحافظ على مظهر العقار جاهزاً للعرض طوال العام",
    ],
    cta: "حافظ على منظرك في أفضل حالاته. اسأل عن عقد صيانة.",
  },
  "plants-palms-ground-covers": {
    title: "نباتات ونخيل وغطاءات أرضية",
    summary:
      "اختيارات زراعة عالية الجودة مصممة لتزدهر في ظروف الكويت.",
    intro:
      "اختيار النبات المناسب يصنع الفرق في مناخ الكويت. نوفر ونزرع مجموعة واسعة من النخيل والزينة والمزهرات والغطاءات الأرضية المختارة لقدرتها على التأقلم مع الحر والتربة المحلية — ما تزرعه اليوم يبقى جميلاً بعد سنوات.",
    bullets: [
      "نخيل",
      "نباتات زينة وشجيرات",
      "نباتات مزهرة",
      "غطاءات أرضية",
      "صبار وعصاريات",
      "توريد وزراعة",
    ],
    benefits: [
      "أنواع مختارة لمناخ وتربة الكويت",
      "تنوع من النخيل البارز إلى الغطاءات المنخفضة",
      "توريد وزراعة في خدمة واحدة",
      "يقلّل فقدان النباتات وتكلفة الاستبدال",
    ],
    cta: "تحتاج نباتات تزدهر فعلاً هنا؟ احصل على استشارة مجانية لاختيار النباتات.",
  },
};
```

## client/src/i18n/translations/en.ts

```ts
import type { TranslationDict } from "../types";

const en: TranslationDict = {
  meta: {
    title: "Desert Blooms — Landscaping & Agricultural Care in Kuwait",
    description:
      "Desert Blooms creates considered garden landscapes, irrigation systems, lawn maintenance, and agricultural spaces across Kuwait.",
  },
  lang: {
    en: "EN",
    ar: "العربية",
    switchToEn: "Switch to English",
    switchToAr: "Switch to Arabic",
    currentEn: "English, current language",
    currentAr: "Arabic, current language",
  },
  header: {
    announcement:
      "Serving homes, compounds & growing spaces across Kuwait",
    call: "Call",
    home: "Home",
    toolsStore: "Tools Store",
    aboutCompany: "About Company",
    services: "Services",
    landscapingServices: "Landscaping Services",
    ourApproach: "Our approach",
    contact: "Contact",
    cart: "Cart",
    openCart: "Open Shopping Cart",
    planGarden: "Plan a garden",
    getInTouch: "Get In Touch",
    openNav: "Open navigation sidebar",
    closeSidebar: "Close sidebar",
    navMenu: "Navigation Menu",
    chatWhatsApp: "Chat on WhatsApp",
    mainNav: "Main navigation",
    homeAria: "Desert Blooms home",
  },
  footer: {
    tagline: "Landscaping & agricultural care, Kuwait",
    taglineTools: "Landscaping, Agricultural Tools & Equipment · Kuwait",
    taglineService: "Landscaping & Agricultural Care · Kuwait",
    copyright: "© 2026 Desert Blooms Agricultural Cont. Co.",
  },
  home: {
    heroEyebrow:
      "DESERT BLOOMS · Landscaping & Agricultural Care · Kuwait",
    heroTitle: "Make room for a better kind of outdoors.",
    heroTitleEm: "better",
    heroDescription:
      "Thoughtful landscapes for homes and businesses across Kuwait — designed with care, planted with purpose, and made to thrive.",
    shopTools: "Shop Tools Catalog",
    learnAbout: "Learn About Us",
    heroNoteNum: "01",
    heroNoteText: "Rooted in Kuwait\nMade for living",
    heroImgAlt:
      "Lush villa garden with date palms in warm Kuwait light",
    heroCaptionFig: "Fig. 01",
    heroCaptionText: "A considered garden, in its first light",
    heroStampEst: "Est.",
    heroStampKuwait: "KUWAIT",
    fieldNoteLabel: "FIELD NOTE / 01",
    fieldNoteBody:
      "In a place shaped by sun and sand, a garden is more than a view. It is a cooler rhythm, a place to gather, and a little more life brought close.",
    overviewEyebrow: "Official Company Profile",
    overviewTitle: "Desert Blooms Agricultural Cont. Co.",
    overviewTitleEm: "Agricultural Cont. Co.",
    overviewBody:
      "Desert Blooms Agricultural Cont. Co. is a Kuwait-based company specialized in Indoor and Outdoor Landscaping Services. We create and maintain beautiful, sustainable, and functional green spaces for residential, commercial, industrial, and hospitality projects. Our team combines creativity, experience, and horticultural expertise to deliver landscapes that enhance the environment and improve the quality of life.",
    highlight1: "High Quality Services",
    highlight2: "Experienced Team",
    highlight3: "Customer Satisfaction",
    highlight4: "Sustainable Solutions",
    overviewImgAlt: "Desert Blooms Agricultural Cont. Co. Kuwait",
    overviewImgLabel: "KUWAIT LANDSCAPING",
    overviewImgTitle: "Professional Excellence",
    overviewBadge: "EST. KUWAIT",
    visionLabel: "OUR VISION",
    visionTitle: "Leading Landscaping in Kuwait",
    visionQuote:
      "To be the leading landscaping company in Kuwait, recognized for our commitment to quality, innovation, and environmental responsibility.",
    missionLabel: "OUR MISSION",
    missionTitle: "Exceptional Solutions & Care",
    missionQuote:
      "To provide exceptional landscaping solutions through professional service, sustainable practices, and long-term client relationships.",
    servicesRailNum: "02",
    servicesRail: "What we do",
    servicesEyebrow: "The work of growing well",
    servicesTitle: "Landscapes that feel at home.",
    servicesTitleEm: "at home.",
    servicesIntro:
      "From first sketch to regular care, Desert Blooms brings together landscape design, agricultural knowledge, and high-performance equipment.",
    toolsEyebrow: "Online Shopping Catalog",
    toolsTitle: "Commercial Gardening & Agricultural Tools",
    toolsTitleEm1: "Gardening & Agricultural",
    toolsIntro:
      "Explore watermark-free professional tools. Add items to your cart and send a verified order receipt directly to WhatsApp.",
    viewAllTools: "View All {count} Tools",
    approachImgAlt:
      "Layered garden planting with stone path and shaded seating",
    approachCaption: "THE DESERT BOTANICAL EDITORIAL · 2026",
    approachEyebrow: "A way of working",
    approachTitle: "Good gardens begin with attention.",
    approachTitleEm: "attention.",
    approachBody:
      "We look closely before we make recommendations: where the light falls, how water moves, what needs shade, and how the space should feel six months from now.",
    step1Title: "Listen first",
    step1Text:
      "We begin with the site, your routines, and the conditions already present.",
    step2Title: "Shape the plan",
    step2Text:
      "Our recommendations balance atmosphere, function, and long-term care.",
    step3Title: "Bring it to life",
    step3Text:
      "From planting to irrigation, we build carefully and keep the details moving.",
    approachCta: "Tell us about your space",
    proofQuote:
      "There is a particular pleasure in making a place that will keep changing after you leave it.",
    proofAttribution: "— The Desert Blooms field note",
    proof1Title: "Local perspective",
    proof1Text: "Grounded in the conditions and rhythms of Kuwait.",
    proof2Title: "Whole-space thinking",
    proof2Text: "Planting, irrigation, and maintenance in one conversation.",
    proof3Title: "Care over time",
    proof3Text:
      "We design for the garden you will have, not only the day it is finished.",
    contactEyebrow: "Let's put down roots",
    contactTitle: "Have a space in mind?",
    contactTitleEm: "Let's talk.",
    contactBody:
      "Tell us a little about your garden, compound, or agricultural space. We'll get back to you with a thoughtful next step.",
    formName: "Name",
    formEmail: "Email",
    formService: "How can we help?",
    formMessage: "Tell us about the space",
    formNamePlaceholder: "Your name",
    formEmailPlaceholder: "you@example.com",
    formServicePlaceholder: "Select a service",
    formMessagePlaceholder: "A few details about your project…",
    formSubmit: "Send an enquiry",
    formSending: "Sending…",
    formSent: "Message sent",
    formThanks: "Thank you — we'll reply to your email shortly.",
    formNote: "Your enquiry goes straight to the Desert Blooms inbox.",
    formErrorGeneric: "We could not send your enquiry.",
  },
  enquiry: {
    indoorLandscaping: "Indoor Landscaping",
    outdoorLandscaping: "Outdoor Landscaping",
    landscapeDesign: "Landscape Design & Installation",
    irrigation: "Irrigation Systems",
    maintenance: "Landscape Maintenance",
    plantsPalms: "Plants, Palms & Ground Covers",
    toolsStore: "Tools & Equipment Store",
  },
  serviceDetail: {
    backToServices: "Back to Services",
    serviceFig: "SERVICE /{num} · FIG. 01",
    fig02: "Fig. 02 · Project Context",
    fig03: "Fig. 03 · Execution & Detail",
    kuwaitSite: "Kuwait Site",
    overviewEyebrow: "Service Overview",
    overviewTitle: "Thoughtfully planned. Expertly executed.",
    overviewTitleEm: "Expertly executed.",
    scopeLabel: "Scope of Work",
    scopeTitle: "What's Included",
    outcomesLabel: "Outcomes & Value",
    outcomesTitle: "Why It Matters",
    methodology: "Methodology",
    processTitle: "Our Design & Execution Process",
    processTitleEm: "Design & Execution",
    ctaEyebrow: "Let's Put Down Roots",
    ctaBody:
      "Speak directly with our team to discuss your site conditions, layout vision, and specific requirements in Kuwait.",
    requestConsultation: "Request Free Consultation",
    call: "Call",
    whatsappAria: "Contact Desert Blooms on WhatsApp",
  },
  tools: {
    heroEyebrow: "Official Agricultural Equipment · Kuwait",
    heroTitle: "Professional Gardening & Landscaping Tools",
    heroDescription:
      "Selected commercial-grade pruning saws, high-pressure sprayers, lawn mowers, and precision watering fittings. Specify quantities and receive an official WhatsApp order receipt instantly.",
    featureDelivery: "Kuwait Express Delivery",
    featureOriginal: "Watermark-Free Original Tools",
    featureReceipt: "Instant WhatsApp Receipt",
    searchPlaceholder: "Search tools by name or Bin No (e.g. 0405329)...",
    clear: "Clear",
    sortFeatured: "Sort: Featured",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
    sortName: "Name: A to Z",
    showing: "Showing",
    tool: "tool",
    tools: "tools",
    inCategory: ' in "{category}"',
    resultsFor: 'Results for "{term}"',
    noResults: "No tools matched your filter criteria.",
    resetFilters: "Reset All Filters",
    viewCart: "View Tools Cart",
    openCart: "Open Cart",
  },
  toolCard: {
    bin: "BIN",
    each: "each",
    decreaseQty: "Decrease quantity",
    increaseQty: "Increase quantity",
    added: "Added",
    addToCart: "Add to Cart",
    inCart: "In cart:",
    addAnother: "+ Add another",
  },
  cart: {
    aria: "Shopping Cart Drawer",
    continueShopping: "Continue Shopping",
    title: "Your Tools Order",
    item: "item",
    items: "items",
    close: "Close cart",
    emptyTitle: "Your cart is empty",
    emptyBody:
      "Select agricultural & gardening tools from our online store to build your order.",
    browse: "Browse Tools Catalog",
    customerSection: "Customer Details for Order Receipt",
    fullName: "Full Name *",
    namePlaceholder: "e.g. Salem Al-Sabah",
    email: "Email Address *",
    emailPlaceholder: "you@example.com",
    phone: "Phone / WhatsApp Number *",
    countryCode: "Country code",
    phonePlaceholder: "Phone number",
    notes: "Notes / Delivery Address (Optional)",
    notesPlaceholder: "e.g. Shuwaikh Industrial area, Block 2...",
    subtotal: "Subtotal ({count} items)",
    totalAmount: "Total Amount",
    checkoutFail: "Checkout failed ({status}). Please try again.",
    checkoutError: "Error creating order receipt. Please check your inputs.",
    verifying: "Verifying Order...",
    generateReceipt: "Generate Receipt & WhatsApp Order",
    securityNote:
      "Verified server price computation & secure link transmission",
    decreaseQty: "Decrease quantity",
    increaseQty: "Increase quantity",
    remove: "Remove item",
  },
  receipt: {
    aria: "Order received",
    orderReceived: "Order received",
    ref: "Order #{ref}",
    close: "Close order details",
    companyLine: "AGRICULTURAL CONT. CO. · KUWAIT",
    invoiceChip: "ORDER DETAILS",
    confirmationSent: "A confirmation was sent to {email}. Check your spam folder if you don’t see it.",
    agentWillContact: "Our agent will contact you shortly to confirm your order.",
    dateTime: "Date & Time",
    customerName: "Customer Name",
    customerPhone: "Customer Phone",
    orderRef: "Order Ref",
    deliveryNotes: "Delivery / Special Notes:",
    colItem: "Item Name & Bin No",
    colQty: "Qty",
    colUnit: "Unit Price",
    colTotal: "Total",
    binNo: "Bin No:",
    grandTotal: "Grand Total Amount",
    whatsappQuestions: "Questions? Chat with us on WhatsApp",
    preparingPdf: "Preparing PDF…",
    downloadPdf: "Download PDF",
    security:
      "Branded one-page invoice · Amount shown in words · Page 1 of 1",
  },
  consultation: {
    eyebrow: "Desert Blooms Consultation",
    title: "Request a Free Consultation",
    titleEm: "Free Consultation",
    close: "Close dialog",
    name: "NAME",
    email: "EMAIL",
    service: "HOW CAN WE HELP?",
    message: "TELL US ABOUT THE SPACE",
    namePlaceholder: "Your name",
    emailPlaceholder: "you@example.com",
    servicePlaceholder: "Select a service",
    messagePlaceholder: "A few details about your project...",
    submit: "SEND AN ENQUIRY",
    sending: "Sending...",
    sent: "Message Sent",
    thanks: "Thank you — we'll reply to your email shortly.",
    note: "Your enquiry goes straight to the Desert Blooms inbox.",
    errorGeneric: "We could not send your enquiry.",
  },
  notFound: {
    toplineLeft: "DESERT BLOOMS · KUWAIT",
    toplineRight: "FIELD NOTE / 404",
    eyebrow: "A path worth retracing",
    title: "This path hasn't grown here.",
    titleEm: "grown here.",
    body: "The page you're looking for has wandered off the garden map. Let's take you back to the beginning.",
    cta: "Return to the garden",
    footerLeft: "LANDSCAPING & AGRICULTURAL CARE",
    footerRight: "AL SHARQ · KUWAIT",
  },
  contact: {
    addressAr:
      "الشرق، شارع أحمد الجابر، مبنى شركة الثimar الدولية القابضة، قطعة 2، طابق 15، الكويت",
  },
  review: {
    note: "Some marketing phrases may benefit from native speaker review.",
  },
};

export default en;
```

## client/src/i18n/translations/ar.ts

```ts
import type { TranslationDict } from "../types";

const ar: TranslationDict = {
  meta: {
    title: "ديزرت بلومز — تنسيق المناظر والعناية الزراعية في الكويت",
    description:
      "ديزرت بلومز تُنشئ مناظر حدائق مدروسة، أنظمة ري، صيانة العشب، ومساحات زراعية في جميع أنحاء الكويت.",
  },
  lang: {
    en: "EN",
    ar: "العربية",
    switchToEn: "التبديل إلى الإنجليزية",
    switchToAr: "التبديل إلى العربية",
    currentEn: "الإنجليزية، اللغة الحالية",
    currentAr: "العربية، اللغة الحالية",
  },
  header: {
    announcement: "نخدم المنازل والمجمعات والمساحات الخضراء في الكويت",
    call: "اتصل",
    home: "الرئيسية",
    toolsStore: "متجر الأدوات",
    aboutCompany: "عن الشركة",
    services: "الخدمات",
    landscapingServices: "خدمات تنسيق المناظر",
    ourApproach: "منهجنا",
    contact: "تواصل",
    cart: "السلة",
    openCart: "فتح سلة التسوق",
    planGarden: "خطّط لحديقتك",
    getInTouch: "تواصل معنا",
    openNav: "فتح قائمة التنقل",
    closeSidebar: "إغلاق القائمة",
    navMenu: "قائمة التنقل",
    chatWhatsApp: "محادثة عبر واتساب",
    mainNav: "التنقل الرئيسي",
    homeAria: "ديزرت بلومز — الرئيسية",
  },
  footer: {
    tagline: "تنسيق المناظر والعناية الزراعية، الكويت",
    taglineTools: "تنسيق المناظر، أدوات ومعدات زراعية · الكويت",
    taglineService: "تنسيق المناظر والعناية الزراعية · الكويت",
    copyright: "© 2026 شركة ديزرت بلومز الزراعية ذ.م.م.",
  },
  home: {
    heroEyebrow: "ديزرت بلومز · تنسيق المناظر والعناية الزراعية · الكويت",
    heroTitle: "امنح مساحتك الخارجية نوعاً أفضل من العيش.",
    heroTitleEm: "أفضل",
    heroDescription:
      "مناظر مدروسة للمنازل والأعمال في الكويت — مصممة بعناية، مزروعة بقصد، ومبنية لتدوم.",
    shopTools: "تصفّح دليل الأدوات",
    learnAbout: "تعرّف علينا",
    heroNoteNum: "٠١",
    heroNoteText: "جذور في الكويت\nصُنع للحياة",
    heroImgAlt: "حديقة فيلا خضراء مع نخيل في ضوء الكويت الدافئ",
    heroCaptionFig: "شكل ٠١",
    heroCaptionText: "حديقة مدروسة في أول ضوء",
    heroStampEst: "تأس.",
    heroStampKuwait: "الكويت",
    fieldNoteLabel: "مذكرة ميدانية / ٠١",
    fieldNoteBody:
      "في أرض تشكّلها الشمس والرمال، الحديقة أكثر من منظر. هي إيقاع أبرد، ومكان للاجتماع، وحياة أكثر قرباً.",
    overviewEyebrow: "الملف الرسمي للشركة",
    overviewTitle: "شركة ديزرت بلومز الزراعية",
    overviewTitleEm: "الزراعية",
    overviewBody:
      "شركة ديزرت بلومز الزراعية شركة كويتية متخصصة في خدمات تنسيق المناظر الداخلية والخارجية. نُنشئ ونحافظ على مساحات خضراء جميلة ومستدامة وعملية للمشاريع السكنية والتجارية والصناعية والضيافة. يجمع فريقنا بين الإبداع والخبرة والمعرفة البستانية لتقديم مناظر تُحسّن البيئة وترفع جودة الحياة.",
    highlight1: "خدمات عالية الجودة",
    highlight2: "فريق ذو خبرة",
    highlight3: "رضا العملاء",
    highlight4: "حلول مستدامة",
    overviewImgAlt: "شركة ديزرت بلومز الزراعية، الكويت",
    overviewImgLabel: "تنسيق المناظر · الكويت",
    overviewImgTitle: "تميّز مهني",
    overviewBadge: "تأس. الكويت",
    visionLabel: "رؤيتنا",
    visionTitle: "ريادة تنسيق المناظر في الكويت",
    visionQuote:
      "«أن نكون شركة تنسيق المناظر الرائدة في الكويت، المعروفة بالتزامنا بالجودة والابتكار والمسؤولية البيئية.»",
    missionLabel: "رسالتنا",
    missionTitle: "حلول وعناية استثنائية",
    missionQuote:
      "«تقديم حلول تنسيق مناظر متميزة عبر خدمة مهنية وممارسات مستدامة وعلاقات طويلة الأمد مع عملائنا.»",
    servicesRailNum: "٠٢",
    servicesRail: "ما نقدمه",
    servicesEyebrow: "فن النمو بإتقان",
    servicesTitle: "مناظر تشعرك أنك في بيتك.",
    servicesTitleEm: "في بيتك.",
    servicesIntro:
      "من أول رسم إلى العناية الدورية، تجمع ديزرت بلومز تصميم المناظر والمعرفة الزراعية ومعدات الأداء العالي.",
    toolsEyebrow: "التسوق الإلكتروني",
    toolsTitle: "أدوات تجارية للحدائق والزراعة",
    toolsTitleEm1: "للحدائق والزراعة",
    toolsIntro:
      "استكشف أدوات احترافية أصلية. أضف المنتجات إلى سلتك وأرسل إيصال طلب موثّق مباشرة عبر واتساب.",
    viewAllTools: "عرض جميع الأدوات ({count})",
    approachImgAlt: "زراعة متعددة الطبقات مع ممر حجري وجلسة مظللة",
    approachCaption: "THE DESERT BOTANICAL EDITORIAL · 2026",
    approachEyebrow: "أسلوب في العمل",
    approachTitle: "الحدائق الجيدة تبدأ بالانتباه.",
    approachTitleEm: "الانتباه.",
    approachBody:
      "ننظر عن كثب قبل أن نقدّم توصياتنا: أين يسقط الضوء، كيف يتحرك الماء، ما يحتاج ظلاً، وكيف يجب أن تشعر المساحة بعد ستة أشهر.",
    step1Title: "الاستماع أولاً",
    step1Text: "نبدأ بالموقع وروتينك والظروف الموجودة.",
    step2Title: "صياغة الخطة",
    step2Text: "نوازن بين الأجواء والوظيفة والعناية على المدى الطويل.",
    step3Title: "إحياء الفكرة",
    step3Text: "من الزراعة إلى الري، نبني بعناية ونُبقي التفاصيل في مسارها.",
    approachCta: "أخبرنا عن مساحتك",
    proofQuote:
      "«هناك متعة خاصة في صنع مكان سيستمر في التغيّر بعد أن تغادره.»",
    proofAttribution: "— مذكرة ديزرت بلومز الميدانية",
    proof1Title: "منظور محلي",
    proof1Text: "متجذر في ظروف وإيقاع الكويت.",
    proof2Title: "تفكير شامل للمساحة",
    proof2Text: "الزراعة والري والصيانة في حوار واحد.",
    proof3Title: "عناية عبر الزمن",
    proof3Text: "نصمّم للحديقة التي ستكون، لا ليوم الإنجاز فقط.",
    contactEyebrow: "لنضع جذوراً",
    contactTitle: "لديك مساحة في بالك؟",
    contactTitleEm: "لنتحدث.",
    contactBody:
      "أخبرنا قليلاً عن حديقتك أو مجمعك أو مساحتك الزراعية. سنعود إليك بخطوة تالية مدروسة.",
    formName: "الاسم",
    formEmail: "البريد الإلكتروني",
    formService: "كيف يمكننا المساعدة؟",
    formMessage: "أخبرنا عن المساحة",
    formNamePlaceholder: "اسمك",
    formEmailPlaceholder: "you@example.com",
    formServicePlaceholder: "اختر خدمة",
    formMessagePlaceholder: "بعض التفاصيل عن مشروعك…",
    formSubmit: "إرسال استفسار",
    formSending: "جارٍ الإرسال…",
    formSent: "تم إرسال الرسالة",
    formThanks: "شكراً — سنرد على بريدك الإلكتروني قريباً.",
    formNote: "يصل استفسارك مباشرة إلى بريد ديزرت بلومز.",
    formErrorGeneric: "تعذّر إرسال استفسارك.",
  },
  enquiry: {
    indoorLandscaping: "تنسيق المناظر الداخلية",
    outdoorLandscaping: "تنسيق المناظر الخارجية",
    landscapeDesign: "تصميم وتنفيذ المناظر",
    irrigation: "أنظمة الري",
    maintenance: "صيانة المناظر",
    plantsPalms: "نباتات ونخيل وغطاءات أرضية",
    toolsStore: "متجر الأدوات والمعدات",
  },
  serviceDetail: {
    backToServices: "العودة إلى الخدمات",
    serviceFig: "خدمة /{num} · شكل ٠١",
    fig02: "شكل ٠٢ · سياق المشروع",
    fig03: "شكل ٠٣ · التنفيذ والتفاصيل",
    kuwaitSite: "موقع في الكويت",
    overviewEyebrow: "نظرة على الخدمة",
    overviewTitle: "مخطّط بعناية. منفّذ بإتقان.",
    overviewTitleEm: "منفّذ بإتقان.",
    scopeLabel: "نطاق العمل",
    scopeTitle: "ما يشمله العرض",
    outcomesLabel: "النتائج والقيمة",
    outcomesTitle: "لماذا يهم",
    methodology: "المنهجية",
    processTitle: "عملية التصميم والتنفيذ",
    processTitleEm: "التصميم والتنفيذ",
    ctaEyebrow: "لنضع جذوراً",
    ctaBody:
      "تحدّث مباشرة مع فريقنا عن ظروف موقعك ورؤية التخطيط ومتطلباتك في الكويت.",
    requestConsultation: "طلب استشارة مجانية",
    call: "اتصل",
    whatsappAria: "تواصل مع ديزرت بلومز عبر واتساب",
  },
  tools: {
    heroEyebrow: "معدات زراعية رسمية · الكويت",
    heroTitle: "أدوات احترافية للحدائق وتنسيق المناظر",
    heroDescription:
      "مناشير تقليم بمستوى تجاري، رشاشات عالية الضغط، جزّاعات عشب، ووصلات ري دقيقة. حدّد الكميات واستلم إيصال طلب رسمي عبر واتساب فوراً.",
    featureDelivery: "توصيل سريع داخل الكويت",
    featureOriginal: "أدوات أصلية بدون علامة مائية",
    featureReceipt: "إيصال واتساب فوري",
    searchPlaceholder: "ابحث بالاسم أو رقم الصندوق (مثل 0405329)...",
    clear: "مسح",
    sortFeatured: "الترتيب: المميز",
    sortPriceAsc: "السعر: من الأقل للأعلى",
    sortPriceDesc: "السعر: من الأعلى للأقل",
    sortName: "الاسم: أ–ي",
    showing: "عرض",
    tool: "أداة",
    tools: "أدوات",
    inCategory: ' في «{category}»',
    resultsFor: 'نتائج «{term}»',
    noResults: "لا توجد أدوات مطابقة لمعايير التصفية.",
    resetFilters: "إعادة تعيين جميع الفلاتر",
    viewCart: "عرض سلة الأدوات",
    openCart: "فتح السلة",
  },
  toolCard: {
    bin: "رقم الصندوق",
    each: "للقطعة",
    decreaseQty: "تقليل الكمية",
    increaseQty: "زيادة الكمية",
    added: "تمت الإضافة",
    addToCart: "أضف إلى السلة",
    inCart: "في السلة:",
    addAnother: "+ أضف قطعة",
  },
  cart: {
    aria: "لوحة سلة التسوق",
    continueShopping: "متابعة التسوق",
    title: "طلب أدواتك",
    item: "قطعة",
    items: "قطع",
    close: "إغلاق السلة",
    emptyTitle: "سلتك فارغة",
    emptyBody: "اختر أدوات زراعية وحدائق من متجرنا لبناء طلبك.",
    browse: "تصفّح دليل الأدوات",
    customerSection: "بيانات العميل لإيصال الطلب",
    fullName: "الاسم الكامل *",
    namePlaceholder: "مثال: سالم الصباح",
    phone: "رقم الهاتف / واتساب *",
    countryCode: "رمز الدولة",
    phonePlaceholder: "رقم الهاتف",
    notes: "ملاحظات / عنوان التوصيل (اختياري)",
    notesPlaceholder: "مثال: الشويخ الصناعية، قطعة 2...",
    subtotal: "المجموع الفرعي ({count} قطع)",
    totalAmount: "المبلغ الإجمالي",
    checkoutFail: "فشل إتمام الطلب ({status}). يرجى المحاولة مرة أخرى.",
    checkoutError: "خطأ في إنشاء إيصال الطلب. يرجى التحقق من المدخلات.",
    verifying: "جارٍ التحقق من الطلب...",
    generateReceipt: "إنشاء إيصال وطلب واتساب",
    securityNote: "حساب سعر موثّق من الخادم وإرسال رابط آمن",
    decreaseQty: "تقليل الكمية",
    increaseQty: "زيادة الكمية",
    remove: "إزالة القطعة",
  },
  receipt: {
    aria: "تم استلام الطلب",
    orderReceived: "تم استلام الطلب",
    ref: "الطلب #{ref}",
    close: "إغلاق تفاصيل الطلب",
    companyLine: "شركة زراعية · الكويت",
    invoiceChip: "تفاصيل الطلب",
    confirmationSent: "تم إرسال تأكيد إلى {email}. تحقق من مجلد البريد العشوائي إذا لم تجده.",
    agentWillContact: "سيتواصل معك مندوبنا قريباً لتأكيد طلبك.",
    dateTime: "التاريخ والوقت",
    customerName: "اسم العميل",
    customerPhone: "هاتف العميل",
    orderRef: "مرجع الطلب",
    deliveryNotes: "ملاحظات التوصيل / خاصة:",
    colItem: "اسم الصنف ورقم الصندوق",
    colQty: "الكمية",
    colUnit: "سعر الوحدة",
    colTotal: "الإجمالي",
    binNo: "رقم الصندوق:",
    grandTotal: "المبلغ الإجمالي",
    whatsappQuestions: "لديك استفسار؟ تواصل معنا عبر واتساب",
    preparingPdf: "جارٍ تجهيز PDF…",
    downloadPdf: "تنزيل PDF",
    security: "فاتورة بصفحة واحدة · المبلغ بالكلمات · صفحة 1 من 1",
  },
  consultation: {
    eyebrow: "استشارة ديزرت بلومز",
    title: "طلب استشارة مجانية",
    titleEm: "استشارة مجانية",
    close: "إغلاق النافذة",
    name: "الاسم",
    email: "البريد الإلكتروني",
    service: "كيف يمكننا المساعدة؟",
    message: "أخبرنا عن المساحة",
    namePlaceholder: "اسمك",
    emailPlaceholder: "you@example.com",
    servicePlaceholder: "اختر خدمة",
    messagePlaceholder: "بعض التفاصيل عن مشروعك...",
    submit: "إرسال استفسار",
    sending: "جارٍ الإرسال...",
    sent: "تم إرسال الرسالة",
    thanks: "شكراً — سنرد على بريدك الإلكتروني قريباً.",
    note: "يصل استفسارك مباشرة إلى بريد ديزرت بلومز.",
    errorGeneric: "تعذّر إرسال استفسارك.",
  },
  notFound: {
    toplineLeft: "ديزرت بلومز · الكويت",
    toplineRight: "مذكرة ميدانية / 404",
    eyebrow: "مسار يستحق إعادة التتبّع",
    title: "هذا المسار لم ينمو هنا.",
    titleEm: "لم ينمو هنا.",
    body: "الصفحة التي تبحث عنها ابتعدت عن خريطة الحديقة. لنعُد إلى البداية.",
    cta: "العودة إلى الحديقة",
    footerLeft: "تنسيق المناظر والعناية الزراعية",
    footerRight: "الشرق · الكويت",
  },
  contact: {
    addressAr:
      "الشرق، شارع أحمد الجابر، مبنى شركة الثِمار الدولية القابضة، قطعة 2، طابق 15، الكويت",
  },
  review: {
    note: "بعض العبارات التسويقية قد تحتاج مراجعة من متحدث أصلي.",
  },
};

export default ar;
```
