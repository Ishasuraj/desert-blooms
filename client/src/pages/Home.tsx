/*
 * Desert Botanical Editorial direction: a calm, tactile Kuwait landscaping experience.
 */
import { contact } from "@/contact";
import { FormEvent, useState } from "react";
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

export default function Home() {
  const { t, locale, localePath } = useLocale();
  const [form, setForm] = useState(initialForm);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useCart();

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

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message ?? t("home.formErrorGeneric"));
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
  );
}
