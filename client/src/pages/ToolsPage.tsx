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

import { SiteHeader } from "../components/SiteHeader";
import { useLocale } from "../contexts/LocaleContext";

export default function ToolsPage() {
  const { totalItems, subtotal, setIsCartOpen } = useCart();
  const { t } = useLocale();
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
      <SiteHeader />

      {/* Hero Banner */}
      <section className="tools-hero-banner section-shell">
        <div className="tools-hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-line" /> {t("tools.heroEyebrow")}
          </p>
          <h1>{t("tools.heroTitle")}</h1>
          <p className="hero-description">{t("tools.heroDescription")}</p>

          <div className="tools-features-strip">
            <div className="feature-item">
              <Truck size={17} />
              <span>{t("tools.featureDelivery")}</span>
            </div>
            <div className="feature-item">
              <ShieldCheck size={17} />
              <span>{t("tools.featureOriginal")}</span>
            </div>
            <div className="feature-item">
              <MessageCircle size={17} />
              <span>{t("tools.featureReceipt")}</span>
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
              placeholder={t("tools.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm ? (
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm("")}
              >
                {t("tools.clear")}
              </button>
            ) : null}
          </div>

          <div className="sort-box">
            <SlidersHorizontal size={16} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="featured">{t("tools.sortFeatured")}</option>
              <option value="price-asc">{t("tools.sortPriceAsc")}</option>
              <option value="price-desc">{t("tools.sortPriceDesc")}</option>
              <option value="name">{t("tools.sortName")}</option>
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
            {t("tools.showing")} <strong>{filteredTools.length}</strong>{" "}
            {filteredTools.length === 1 ? t("tools.tool") : t("tools.tools")}
            {selectedCategory !== "All Tools" ? t("tools.inCategory", { category: selectedCategory }) : ""}
          </span>
          {searchTerm ? <span>{t("tools.resultsFor", { term: searchTerm })}</span> : null}
        </div>

        {filteredTools.length === 0 ? (
          <div className="no-results-card">
            <p>{t("tools.noResults")}</p>
            <button
              className="button button-dark"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All Tools");
              }}
            >
              {t("tools.resetFilters")}
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
          aria-label={t("tools.openCart")}
        >
          <div className="floating-cart-left">
            <ShoppingBag size={20} />
            <span className="floating-cart-badge">{totalItems}</span>
            <span>{t("tools.viewCart")}</span>
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
        <p>{t("footer.taglineTools")}</p>
        <span>{t("footer.copyright")}</span>
      </footer>
    </div>
  );
}
