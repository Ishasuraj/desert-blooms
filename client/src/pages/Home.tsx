/*
 * Desert Botanical Editorial direction: a calm, tactile Kuwait landscaping experience.
 * This page uses asymmetric editorial sections, Oasis Green, terracotta accents, and
 * short physical-feeling interactions.
 */
import { contact } from "@/contact";
import { ENQUIRY_SERVICES } from "@shared/enquirySchema";
import { FormEvent, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/tools/CartDrawer";
import { ReceiptModal } from "@/components/tools/ReceiptModal";
import { TOOLS } from "@/data/tools";
import { ToolCard } from "@/components/tools/ToolCard";
import { Link } from "wouter";
import { SERVICES } from "@/data/services";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Compass,
  Droplets,
  Leaf,
  Menu,
  Phone,
  ShoppingBag,
  Sparkles,
  Sprout,
  SunMedium,
  Trees,
  Wrench,
  X,
} from "lucide-react";

import companyOverviewImage from "@/assets/services/company_overview.png";

import { SiteHeader } from "@/components/SiteHeader";

const heroImage = "/images/desert-blooms-hero.webp";
const gardenImage = "/images/desert-blooms-garden.webp";
const brandMark = "/images/desert-blooms-logo.png";

const SERVICE_ICONS: Record<string, any> = {
  "indoor-landscaping": Leaf,
  "outdoor-landscaping": SunMedium,
  "landscape-design-installation": Compass,
  "irrigation-systems": Droplets,
  "landscape-maintenance": Sprout,
  "plants-palms-ground-covers": Trees,
};

const steps = [
  ["01", "Listen first", "We begin with the site, your routines, and the conditions already present."],
  ["02", "Shape the plan", "Our recommendations balance atmosphere, function, and long-term care."],
  ["03", "Bring it to life", "From planting to irrigation, we build carefully and keep the details moving."],
];

const initialForm = {
  name: "",
  email: "",
  service: "",
  message: "",
  _gotcha: "",
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { totalItems, setIsCartOpen } = useCart();

  const featuredTools = TOOLS.slice(0, 6);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

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
        throw new Error(data.message ?? "We could not send your enquiry.");
      }

      setSent(true);
      setForm(initialForm);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not send your enquiry."
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
            <span className="eyebrow-line" /> <strong className="text-[#b86745] font-bold">DESERT BLOOMS</strong> · Landscaping & Agricultural Care · Kuwait
          </p>
          <h1>Make room for a <i>better</i> kind of outdoors.</h1>
          <p className="hero-description">Thoughtful landscapes for homes and businesses across Kuwait — designed with care, planted with purpose, and made to thrive.</p>
          <div className="hero-actions">
            <a href="/tools" className="button button-dark">
              Shop Tools Catalog <ArrowUpRight size={17} />
            </a>
            <button className="text-link" onClick={() => scrollTo("overview")}>
              Learn About Us <ArrowDownRight size={16} />
            </button>
          </div>
          <div className="hero-note"><span>01</span><span className="note-rule" /><span>Rooted in Kuwait<br />Made for living</span></div>
        </div>
        <div className="hero-image-wrap">
          <img src={heroImage} alt="Lush villa garden with date palms in warm Kuwait light" className="hero-image" />
          <div className="hero-image-caption"><span>Fig. 01</span><span>A considered garden, in its first light</span></div>
          <div className="hero-stamp"><span>Est.</span><strong>DB</strong><span>KUWAIT</span></div>
        </div>
      </section>

      <section className="field-note-strip">
        <div className="field-note-label">FIELD NOTE / 01</div>
        <p>In a place shaped by sun and sand, a garden is more than a view. It is a cooler rhythm, a place to gather, and a little more life brought close.</p>
        <div className="field-note-symbol">✳</div>
      </section>

      {/* Company Overview Section (Who We Are / Mission / Vision) */}
      <section id="overview" className="company-overview-section section-shell py-20 border-b border-[#d8d0c1]">
        <div className="max-w-6xl mx-auto">
          {/* Header & Overview Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
            <div className="lg:col-span-7">
              <p className="eyebrow">
                <span className="eyebrow-line" /> Official Company Profile
              </p>
              <h2 className="text-4xl lg:text-6xl font-serif text-[#22352b] mb-6 leading-tight">
                Desert Blooms <i>Agricultural Cont. Co.</i>
              </h2>
              <p className="text-base lg:text-lg text-[#4a584c] leading-relaxed font-sans mb-8">
                Desert Blooms Agricultural Cont. Co. is a Kuwait-based company specialized in Indoor and Outdoor Landscaping Services. We create and maintain beautiful, sustainable, and functional green spaces for residential, commercial, industrial, and hospitality projects. Our team combines creativity, experience, and horticultural expertise to deliver landscapes that enhance the environment and improve the quality of life.
              </p>

              {/* Highlights 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "High Quality Services",
                  "Experienced Team",
                  "Customer Satisfaction",
                  "Sustainable Solutions",
                ].map((highlight) => (
                  <div key={highlight} className="flex items-center gap-3 p-3.5 rounded bg-white border border-[#d8d0c1] shadow-sm">
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

            {/* Supporting Image Frame */}
            <div className="lg:col-span-5">
              <div className="relative rounded-lg overflow-hidden border border-[#d8d0c1] bg-white shadow-md group">
                <img
                  src={companyOverviewImage}
                  alt="Desert Blooms Agricultural Cont. Co. Kuwait"
                  className="w-full h-[380px] lg:h-[440px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white flex justify-between items-end">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-[#d8c8ac] font-bold">
                      KUWAIT LANDSCAPING
                    </span>
                    <h4 className="text-xl font-serif text-[#f4f0e8] mt-0.5">
                      Professional Excellence
                    </h4>
                  </div>
                  <div className="px-3 py-1.5 rounded bg-[#b86745] text-white text-[10px] font-mono font-bold tracking-wider">
                    EST. KUWAIT
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Side-by-Side Cards (Vision & Mission) on Dark Green Background */}
          <div className="p-8 lg:p-12 rounded-xl bg-[#22352b] text-[#f1eadf] border border-[#22352b] shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
              {/* Vision Card */}
              <div className="p-8 rounded-lg bg-[#2a4236] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 text-xs tracking-widest text-[#d37a55] font-bold uppercase mb-4">
                    <Sparkles size={16} /> OUR VISION
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-serif text-[#f1eadf] mb-4 leading-snug">
                    Leading Landscaping in Kuwait
                  </h3>
                  <p className="text-sm lg:text-base text-[#c7d1c5] leading-relaxed">
                    "To be the leading landscaping company in Kuwait, recognized for our commitment to quality, innovation, and environmental responsibility."
                  </p>
                </div>
              </div>

              {/* Mission Card */}
              <div className="p-8 rounded-lg bg-[#2a4236] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 text-xs tracking-widest text-[#d37a55] font-bold uppercase mb-4">
                    <Leaf size={16} /> OUR MISSION
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-serif text-[#f1eadf] mb-4 leading-snug">
                    Exceptional Solutions & Care
                  </h3>
                  <p className="text-sm lg:text-base text-[#c7d1c5] leading-relaxed">
                    "To provide exceptional landscaping solutions through professional service, sustainable practices, and long-term client relationships."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section section-shell">
        <div className="section-rail"><span>02</span><span>What we do</span></div>
        <div className="services-content">
          <div className="section-heading-row">
            <div><p className="eyebrow">The work of growing well</p><h2>Landscapes that feel <i>at home.</i></h2></div>
            <p className="section-intro">From first sketch to regular care, Desert Blooms brings together landscape design, agricultural knowledge, and high-performance equipment.</p>
          </div>
          <div className="services-list">
            {SERVICES.map((service) => {
              const Icon = SERVICE_ICONS[service.slug] || Leaf;
              return (
                <Link
                  className="service-row"
                  key={service.id}
                  href={`/services/${service.slug}`}
                >
                  <span className="service-number">{service.number}</span>
                  <span className="service-icon"><Icon size={22} strokeWidth={1.4} /></span>
                  <span className="service-copy"><strong>{service.title}</strong><small>{service.summary}</small></span>
                  <ArrowUpRight className="service-arrow" size={20} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Tools Showcase Section */}
      <section className="featured-tools-section section-shell">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Online Shopping Catalog</p>
            <h2>Commercial <i>Gardening & Agricultural</i> Tools</h2>
          </div>
          <div>
            <p className="section-intro">
              Explore watermark-free professional tools. Add items to your cart and send a verified order receipt directly to WhatsApp.
            </p>
            <a href="/tools" className="button button-dark" style={{ marginTop: "1rem" }}>
              View All {TOOLS.length} Tools <ArrowUpRight size={17} />
            </a>
          </div>
        </div>

        <div className="tools-grid" style={{ marginTop: "2rem" }}>
          {featuredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section id="approach" className="approach-section section-shell">
        <div className="approach-image-wrap"><img src={gardenImage} alt="Layered garden planting with stone path and shaded seating" className="approach-image" /><span className="vertical-caption">THE DESERT BOTANICAL EDITORIAL · 2026</span></div>
        <div className="approach-copy"><p className="eyebrow">A way of working</p><h2>Good gardens begin with <i>attention.</i></h2><p>We look closely before we make recommendations: where the light falls, how water moves, what needs shade, and how the space should feel six months from now.</p><div className="steps-list">{steps.map(([number, title, text]) => <div className="step" key={number}><span>{number}</span><div><strong>{title}</strong><p>{text}</p></div></div>)}</div><button className="text-link" onClick={() => scrollTo("contact")}>Tell us about your space <ArrowUpRight size={16} /></button></div>
      </section>

      <section className="proof-section section-shell"><div className="proof-quote"><span className="quote-mark">“</span><blockquote>There is a particular pleasure in making a place that will keep changing after you leave it.</blockquote><p>— The Desert Blooms field note</p></div><div className="proof-facts"><div><strong>01</strong><span>Local perspective</span><p>Grounded in the conditions and rhythms of Kuwait.</p></div><div><strong>02</strong><span>Whole-space thinking</span><p>Planting, irrigation, and maintenance in one conversation.</p></div><div><strong>03</strong><span>Care over time</span><p>We design for the garden you will have, not only the day it is finished.</p></div></div></section>

      <section id="contact" className="contact-section">
        <div className="contact-ornament">✳</div>
        <div className="section-shell contact-layout">
          <div className="contact-copy">
            <p className="eyebrow">Let’s put down roots</p>
            <h2>
              Have a space in mind?
              <br />
              <i>Let’s talk.</i>
            </h2>
            <p>
              Tell us a little about your garden, compound, or agricultural space.
              We’ll get back to you with a thoughtful next step.
            </p>
            <div className="contact-details">
              <a href={`tel:${contact.phoneTel}`}>
                <Phone size={17} />
                {contact.phoneDisplay}
              </a>
              {contact.email ? (
                <a href={`mailto:${contact.email}`}>
                  <ArrowUpRight size={17} />
                  {contact.email}
                </a>
              ) : null}
              <span>
                <span className="detail-dot" />
                {contact.address}
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
              Name
              <input
                required
                placeholder="Your name"
                value={form.name}
                maxLength={100}
                disabled={submitting || sent}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
              />
            </label>

            <label>
              Email
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={form.email}
                maxLength={254}
                disabled={submitting || sent}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
              />
            </label>

            <label>
              How can we help?
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
                  Select a service
                </option>
                {ENQUIRY_SERVICES.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} />
            </label>

            <label>
              Tell us about the space
              <textarea
                required
                placeholder="A few details about your project…"
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

            <button
              className="button button-light"
              type="submit"
              disabled={submitting || sent}
            >
              {sent ? (
                <>
                  <Check size={17} /> Message sent
                </>
              ) : submitting ? (
                <>Sending…</>
              ) : (
                <>
                  Send an enquiry <ArrowUpRight size={17} />
                </>
              )}
            </button>

            {error ? <small className="form-error">{error}</small> : null}
            {sent ? (
              <small>Thank you — we’ll reply to your email shortly.</small>
            ) : (
              <small>Your enquiry goes straight to the Desert Blooms inbox.</small>
            )}
          </form>
        </div>
      </section>

      <CartDrawer />
      <ReceiptModal />

      <footer className="site-footer"><div className="footer-brand"><img src={brandMark} alt="" className="brand-mark" /><span className="brand-wordmark">DESERT <em>BLOOMS</em></span></div><p>Landscaping & agricultural care, Kuwait</p><span>© 2026 Desert Blooms Agricultural Cont. Co.</span></footer>
    </main>
  );
}
