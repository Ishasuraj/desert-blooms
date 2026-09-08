import React, { useState, useMemo } from "react";
import { TOOLS, Tool } from "../data/tools";
import { ToolCard } from "../components/tools/ToolCard";
import { CartDrawer } from "../components/tools/CartDrawer";
import { ReceiptModal } from "../components/tools/ReceiptModal";
import { useCart } from "../contexts/CartContext";
import { contact } from "../contact";
import {
  Search,
  ShoppingBag,
  SlidersHorizontal,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Phone,
  MessageCircle,
} from "lucide-react";

const CATEGORIES = ["All Tools", ...Array.from(new Set(TOOLS.map((tool) => tool.category)))];

export default function ToolsPage() {
  const { totalItems, subtotal, setIsCartOpen } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Tools");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory =
        selectedCategory === "All Tools" || tool.category === selectedCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.binNo.includes(searchTerm) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0; // featured order
    });
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="tools-page-shell bg-[#f4f0e8] text-[#22352b] min-h-screen">
      <div className="announcement-bar">
        <span>Tools & Equipment Store · Express Delivery Across Kuwait</span>
        <a href={`tel:${contact.phoneTel}`}>
          Call {contact.phoneDisplay} <ArrowUpRight size={13} />
        </a>
      </div>

      <header className="site-header">
        <a href="/" className="brand-lockup" aria-label="Desert Blooms home">
          <img src="/images/desert-blooms-logo.png" alt="" className="brand-mark" />
          <span className="brand-wordmark">
            DESERT <em>BLOOMS</em>
          </span>
        </a>

        <nav className="main-nav is-open" aria-label="Tools navigation">
          <a href="/">Home</a>
          <a href="/tools" className="active">Tools Store</a>
          <a href="/#services">Services</a>
          <a href="/#contact">Contact</a>
        </nav>

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
      </header>

      {/* Hero Banner */}
      <section className="tools-hero-banner section-shell">
        <div className="tools-hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-line" /> Official Agricultural Equipment · Kuwait
          </p>
          <h1>Professional Gardening & Landscaping Tools</h1>
          <p className="hero-description">
            Selected commercial-grade pruning saws, high-pressure sprayers, lawn mowers, and precision watering fittings. Specify quantities and receive an official WhatsApp order receipt instantly.
          </p>

          <div className="tools-features-strip">
            <div className="feature-item">
              <Truck size={17} />
              <span>Kuwait Express Delivery</span>
            </div>
            <div className="feature-item">
              <ShieldCheck size={17} />
              <span>Watermark-Free Original Tools</span>
            </div>
            <div className="feature-item">
              <MessageCircle size={17} />
            <span>Instant WhatsApp Receipt</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="tools-controls-section section-shell">
        <div className="tools-controls-bar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search tools by name or Bin No (e.g. 0405329)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm ? (
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </button>
            ) : null}
          </div>

          <div className="sort-box">
            <SlidersHorizontal size={16} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-pills-row">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? "is-active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="tools-grid-section section-shell">
        <div className="catalog-status-bar">
          <span>
            Showing <strong>{filteredTools.length}</strong> {filteredTools.length === 1 ? "tool" : "tools"}
            {selectedCategory !== "All Tools" ? ` in "${selectedCategory}"` : ""}
          </span>
          {searchTerm ? (
            <span>Results for "{searchTerm}"</span>
          ) : null}
        </div>

        {filteredTools.length === 0 ? (
          <div className="no-results-card">
            <p>No tools matched your filter criteria.</p>
            <button
              className="button button-dark"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All Tools");
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="tools-grid">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </section>

      {/* Floating Cart Launcher Button */}
      {totalItems > 0 ? (
        <button
          className="floating-cart-launcher"
          onClick={() => setIsCartOpen(true)}
          aria-label="Open Cart"
        >
          <div className="floating-cart-left">
            <ShoppingBag size={20} />
            <span className="floating-cart-badge">{totalItems}</span>
            <span>View Tools Cart</span>
          </div>
          <strong className="floating-cart-subtotal">{subtotal.toFixed(3)} KWD</strong>
        </button>
      ) : null}

      <CartDrawer />
      <ReceiptModal />

      <footer className="site-footer">
        <div className="footer-brand">
          <img src="/images/desert-blooms-logo.png" alt="" className="brand-mark" />
          <span className="brand-wordmark">
            DESERT <em>BLOOMS</em>
          </span>
        </div>
        <p>Landscaping, Agricultural Tools & Equipment · Kuwait</p>
        <span>© 2026 Desert Blooms Agricultural Cont. Co.</span>
      </footer>
    </div>
  );
}
