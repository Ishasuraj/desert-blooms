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
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Droplets,
  Leaf,
  Menu,
  MessageCircle,
  Phone,
  ShoppingBag,
  Sprout,
  SunMedium,
  Wrench,
  X,
} from "lucide-react";

const heroImage = "/images/desert-blooms-hero.webp";
const gardenImage = "/images/desert-blooms-garden.webp";
const irrigationImage = "/images/desert-blooms-irrigation.webp";
const brandMark = "/images/desert-blooms-logo.png";

const services = [
  {
    number: "01",
    title: "Garden Landscaping",
    text: "Outdoor spaces shaped around shade, movement, planting, and the way your home is actually lived in.",
    icon: Leaf,
    link: "#contact",
  },
  {
    number: "02",
    title: "Irrigation Systems",
    text: "Quietly efficient watering systems that help every planted space perform in Kuwait’s climate.",
    icon: Droplets,
    link: "#contact",
  },
  {
    number: "03",
    title: "Agricultural Services",
    text: "Practical cultivation and ongoing care for productive, healthy planting environments.",
    icon: Sprout,
    link: "#contact",
  },
  {
    number: "04",
    title: "Lawn Maintenance",
    text: "Consistent, attentive maintenance that keeps gardens looking considered through every season.",
    icon: SunMedium,
    link: "#contact",
  },
  {
    number: "05",
    title: "Tools & Equipment Store",
    text: "Browse a carefully organised range of commercial-grade pruning, mowing, spraying, watering, and garden equipment.",
    icon: Wrench,
    link: "/tools",
  },
];

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
      <div className="announcement-bar">
        <span>Serving homes, compounds & growing spaces across Kuwait</span>
        <a href={`tel:${contact.phoneTel}`}>
          Call {contact.phoneDisplay} <ArrowUpRight size={13} />
        </a>
      </div>

      <header className="site-header">
        <button className="brand-lockup" onClick={() => scrollTo("top")} aria-label="Desert Blooms home">
          <img src={brandMark} alt="" className="brand-mark" />
          <span className="brand-wordmark">DESERT <em>BLOOMS</em></span>
        </button>

        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          <a href="/tools">Tools Store</a>
          <button onClick={() => scrollTo("services")}>Services</button>
          <button onClick={() => scrollTo("approach")}>Our approach</button>
          <button onClick={() => scrollTo("projects")}>Projects</button>
          <button onClick={() => scrollTo("contact")}>Contact</button>
        </nav>

        <div className="header-actions-group">
          <button
            className="header-cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag size={18} />
            <span>Cart</span>
            {totalItems > 0 ? (
              <span className="header-cart-badge">{totalItems}</span>
            ) : null}
          </button>

          <button className="header-cta" onClick={() => scrollTo("contact")}>
            Plan a garden <ArrowUpRight size={16} />
          </button>
        </div>

        <button className="mobile-menu" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <section id="top" className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> Landscaping & agricultural care · Kuwait</p>
          <h1>Make room for a <i>better</i> kind of outdoors.</h1>
          <p className="hero-description">Thoughtful landscapes for homes and businesses across Kuwait — designed with care, planted with purpose, and made to thrive.</p>
          <div className="hero-actions">
            <a href="/tools" className="button button-dark">
              Shop Tools Catalog <ArrowUpRight size={17} />
            </a>
            <button className="text-link" onClick={() => scrollTo("services")}>
              Explore our services <ArrowDownRight size={16} />
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

      <section id="services" className="services-section section-shell">
        <div className="section-rail"><span>02</span><span>What we do</span></div>
        <div className="services-content">
          <div className="section-heading-row">
            <div><p className="eyebrow">The work of growing well</p><h2>Landscapes that feel <i>at home.</i></h2></div>
            <p className="section-intro">From first sketch to regular care, Desert Blooms brings together landscape design, agricultural knowledge, and high-performance equipment.</p>
          </div>
          <div className="services-list">
            {services.map(({ number, title, text, icon: Icon, link }) => (
              <a
                className="service-row"
                key={number}
                href={link}
                onClick={(e) => {
                  if (link.startsWith("#")) {
                    e.preventDefault();
                    scrollTo(link.slice(1));
                  }
                }}
              >
                <span className="service-number">{number}</span>
                <span className="service-icon"><Icon size={22} strokeWidth={1.4} /></span>
                <span className="service-copy"><strong>{title}</strong><small>{text}</small></span>
                <ArrowUpRight className="service-arrow" size={20} />
              </a>
            ))}
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

      <section id="projects" className="projects-section">
        <div className="project-heading section-shell"><div className="section-rail"><span>03</span><span>Selected moments</span></div><div><p className="eyebrow">A glimpse of the work</p><h2>Spaces with a little more <i>life.</i></h2></div><p className="section-intro">A selection of private gardens, compounds, and agricultural spaces designed and cultivated across Kuwait.</p></div>
        <div className="project-collage section-shell"><figure className="project-card project-large"><img src={gardenImage} alt="Desert Blooms residential garden project in Kuwait" /><figcaption><span>Residential garden</span><strong>Shade / planting / pause</strong></figcaption></figure><figure className="project-card project-small"><img src={irrigationImage} alt="Desert Blooms agricultural irrigation system" /><figcaption><span>Agricultural care</span><strong>Water / growth / rhythm</strong></figcaption></figure><div className="project-callout"><span className="callout-mark">✳</span><p>Every project starts with the same question: <i>what should this place make possible?</i></p><button className="text-link" onClick={() => scrollTo("contact")}>Discuss your project <ArrowUpRight size={16} /></button></div></div>
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
              <a href={contact.whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle size={17} />
                WhatsApp us (+965 98855871)
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
      <a
        className="whatsapp-float"
        href={contact.whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Contact Desert Blooms on WhatsApp"
      >
        <MessageCircle size={21} />
      </a>
    </main>
  );
}
