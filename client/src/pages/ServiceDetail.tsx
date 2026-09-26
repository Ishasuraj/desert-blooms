import React, { useState } from "react";
import { useParams, Redirect } from "wouter";
import { SERVICES } from "@/data/services";
import { CartDrawer } from "@/components/tools/CartDrawer";
import { ReceiptModal } from "@/components/tools/ReceiptModal";
import { ConsultationModal } from "@/components/ConsultationModal";
import { useCart } from "@/contexts/CartContext";
import { useLocale } from "@/contexts/LocaleContext";
import { LocalizedLink } from "@/components/LocalizedLink";
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
  const { t, locale } = useLocale();

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
            <LocalizedLink href="/#services" className="inline-flex items-center gap-2 hover:text-[#b86745] transition-colors">
              <ArrowLeft size={14} /> {t("serviceDetail.backToServices")}
            </LocalizedLink>
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
