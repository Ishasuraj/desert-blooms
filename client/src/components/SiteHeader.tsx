import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useLocale } from "@/contexts/LocaleContext";
import { contact } from "@/contact";
import { LocalizedLink } from "@/components/LocalizedLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { isHomePath, isToolsPath } from "@/i18n/routing";
import {
  ShoppingBag,
  ArrowUpRight,
  Menu,
  X,
  Phone,
  MessageCircle,
  ChevronRight,
  Home as HomeIcon,
  Wrench,
  Building2,
  Sparkles,
  Compass,
} from "lucide-react";

interface SiteHeaderProps {
  activeTab?: "home" | "tools" | "services" | "contact" | "overview";
  onNavigateSection?: (sectionId: string) => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  onNavigateSection,
}) => {
  const [location] = useLocation();
  const { t, localePath } = useLocale();
  const { totalItems, setIsCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHiddenOnScroll, setIsHiddenOnScroll] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const onHome = isHomePath(location);
  const onTools = isToolsPath(location);
  const homeHash = (id: string) => `${localePath("/")}#${id}`;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100 && currentScrollY > lastScrollY + 5) {
        setIsHiddenOnScroll(true);
      } else if (currentScrollY < lastScrollY - 5) {
        setIsHiddenOnScroll(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (!menuOpen) return;

    window.history.pushState({ sidebarOpen: true }, "");

    const handlePopState = () => {
      setMenuOpen(false);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [menuOpen]);

  const closeSidebar = () => {
    setMenuOpen(false);
  };

  const handleNavClick = (sectionId?: string) => {
    closeSidebar();
    if (sectionId && onNavigateSection) {
      onNavigateSection(sectionId);
    }
  };

  return (
    <>
      <div
        className={`sticky top-0 z-40 transition-transform duration-300 ease-out bg-[#f4f0e8] ${
          isHiddenOnScroll && !menuOpen ? "-translate-y-full shadow-none" : "translate-y-0 shadow-sm"
        }`}
      >
        <div className="announcement-bar">
          <span className="truncate">{t("header.announcement")}</span>
          <a href={`tel:${contact.phoneTel}`} className="shrink-0 ltr-isolate">
            {t("header.call")}{" "}
            <span className="ltr-isolate">{contact.phoneDisplay}</span>{" "}
            <ArrowUpRight size={13} />
          </a>
        </div>

        <header className="site-header relative">
          <LocalizedLink href="/" className="brand-lockup" aria-label={t("header.homeAria")}>
            <img src="/images/desert-blooms-logo.png" alt="" className="brand-mark" />
            <span className="brand-wordmark" aria-label="Desert Blooms">
              DESERT <em>BLOOMS</em>
            </span>
          </LocalizedLink>

          <nav className="main-nav hidden md:flex" aria-label={t("header.mainNav")}>
            {!onHome ? (
              <LocalizedLink href="/" className={onHome ? "active" : ""}>
                {t("header.home")}
              </LocalizedLink>
            ) : null}
            <LocalizedLink href="/tools" className={onTools ? "active" : ""}>
              {t("header.toolsStore")}
            </LocalizedLink>
            {onHome ? (
              <>
                <button type="button" onClick={() => handleNavClick("overview")}>
                  {t("header.aboutCompany")}
                </button>
                <button type="button" onClick={() => handleNavClick("services")}>
                  {t("header.services")}
                </button>
                <button type="button" onClick={() => handleNavClick("approach")}>
                  {t("header.ourApproach")}
                </button>
                <button type="button" onClick={() => handleNavClick("contact")}>
                  {t("header.contact")}
                </button>
              </>
            ) : (
              <>
                <LocalizedLink href="/#services">{t("header.services")}</LocalizedLink>
                <LocalizedLink href="/#contact">{t("header.contact")}</LocalizedLink>
              </>
            )}
          </nav>

          <div className="header-actions-group">
            <LanguageSwitcher className="hidden md:inline-flex" />

            {onHome ? (
              <button
                type="button"
                className="header-cta hidden sm:inline-flex"
                onClick={() => handleNavClick("contact")}
              >
                {t("header.planGarden")} <ArrowUpRight size={16} />
              </button>
            ) : (
              <LocalizedLink href="/#contact" className="header-cta hidden sm:inline-flex">
                {t("header.getInTouch")} <ArrowUpRight size={16} />
              </LocalizedLink>
            )}

            <button
              type="button"
              className="md:hidden p-2 text-[#22352b] hover:text-[#b86745] transition-colors cursor-pointer"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={t("header.openNav")}
            >
              <Menu size={24} strokeWidth={2} />
            </button>
          </div>
        </header>
      </div>

      <button
        type="button"
        className="mobile-cart-fab sm:hidden"
        onClick={() => setIsCartOpen(true)}
        aria-label={t("header.openCart")}
      >
        <ShoppingBag size={18} />
        {totalItems > 0 ? <span className="mobile-cart-fab-count">{totalItems}</span> : null}
      </button>

      {menuOpen ? (
        <div
          className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-xs flex justify-end animate-fadeIn md:hidden mobile-nav-overlay"
          onClick={closeSidebar}
        >
          <aside
            className="w-[310px] max-w-[85vw] h-full bg-[#22352b] text-[#f1eadf] shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-slideLeft mobile-nav-drawer"
            onClick={(e) => e.stopPropagation()}
            aria-label={t("header.openNav")}
          >
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-white/15">
                <div className="flex items-center gap-3">
                  <img src="/images/desert-blooms-logo.png" alt="" className="w-9 h-9 rounded-full object-contain" />
                  <span className="font-bold text-xs tracking-widest text-[#f1eadf]">
                    DESERT <em className="font-serif font-normal not-italic text-[#d37a55]">BLOOMS</em>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeSidebar}
                  className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label={t("header.closeSidebar")}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="py-4">
                <LanguageSwitcher className="lang-switcher--mobile w-full justify-center mt-1" />
              </div>

              <div className="py-4 flex flex-col gap-2">
                <p className="text-[10px] tracking-widest text-[#d37a55] font-bold uppercase mb-2">
                  {t("header.navMenu")}
                </p>

                {!onHome ? (
                  <LocalizedLink
                    href="/"
                    onClick={closeSidebar}
                    className={`flex items-center justify-between p-3 rounded-md transition-colors ${
                      onHome ? "bg-[#315842] text-white font-bold" : "text-[#d8e0d5] hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-sm">
                      <HomeIcon size={18} className="text-[#d37a55]" />
                      <span>{t("header.home")}</span>
                    </div>
                    <ChevronRight size={16} className="opacity-50 nav-chevron" />
                  </LocalizedLink>
                ) : null}

                <LocalizedLink
                  href="/tools"
                  onClick={closeSidebar}
                  className={`flex items-center justify-between p-3 rounded-md transition-colors ${
                    onTools ? "bg-[#315842] text-white font-bold" : "text-[#d8e0d5] hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3 text-sm">
                    <Wrench size={18} className="text-[#d37a55]" />
                    <span>{t("header.toolsStore")}</span>
                  </div>
                  <ChevronRight size={16} className="opacity-50 nav-chevron" />
                </LocalizedLink>

                {onHome ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleNavClick("overview")}
                      className="flex items-center justify-between p-3 rounded-md text-[#d8e0d5] hover:bg-white/5 transition-colors text-start"
                    >
                      <div className="flex items-center gap-3 text-sm">
                        <Building2 size={18} className="text-[#d37a55]" />
                        <span>{t("header.aboutCompany")}</span>
                      </div>
                      <ChevronRight size={16} className="opacity-50 nav-chevron" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavClick("services")}
                      className="flex items-center justify-between p-3 rounded-md text-[#d8e0d5] hover:bg-white/5 transition-colors text-start"
                    >
                      <div className="flex items-center gap-3 text-sm">
                        <Sparkles size={18} className="text-[#d37a55]" />
                        <span>{t("header.landscapingServices")}</span>
                      </div>
                      <ChevronRight size={16} className="opacity-50 nav-chevron" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavClick("approach")}
                      className="flex items-center justify-between p-3 rounded-md text-[#d8e0d5] hover:bg-white/5 transition-colors text-start"
                    >
                      <div className="flex items-center gap-3 text-sm">
                        <Compass size={18} className="text-[#d37a55]" />
                        <span>{t("header.ourApproach")}</span>
                      </div>
                      <ChevronRight size={16} className="opacity-50 nav-chevron" />
                    </button>
                  </>
                ) : (
                  <LocalizedLink
                    href="/#services"
                    onClick={closeSidebar}
                    className="flex items-center justify-between p-3 rounded-md text-[#d8e0d5] hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 text-sm">
                      <Sparkles size={18} className="text-[#d37a55]" />
                      <span>{t("header.services")}</span>
                    </div>
                    <ChevronRight size={16} className="opacity-50 nav-chevron" />
                  </LocalizedLink>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-white/15 space-y-4">
              {onHome ? (
                <button
                  type="button"
                  onClick={() => handleNavClick("contact")}
                  className="w-full py-3.5 bg-[#b86745] hover:bg-[#a45637] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  {t("header.planGarden")} <ArrowUpRight size={16} />
                </button>
              ) : (
                <LocalizedLink
                  href="/#contact"
                  onClick={closeSidebar}
                  className="w-full py-3.5 bg-[#b86745] hover:bg-[#a45637] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  {t("header.getInTouch")} <ArrowUpRight size={16} />
                </LocalizedLink>
              )}

              <div className="space-y-2 text-xs text-[#b7c1b3] pt-1">
                <a href={`tel:${contact.phoneTel}`} className="flex items-center gap-2 hover:text-white transition-colors ltr-isolate">
                  <Phone size={14} className="text-[#d37a55]" />
                  <span>
                    {t("header.call")} {contact.phoneDisplay}
                  </span>
                </a>
                <a href={contact.whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <MessageCircle size={14} className="text-[#25d366]" />
                  <span>{t("header.chatWhatsApp")}</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
};
