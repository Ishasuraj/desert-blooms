import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { contact } from "@/contact";
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
  const { totalItems, setIsCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHiddenOnScroll, setIsHiddenOnScroll] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide header on scroll down on mobile/tablet, reveal when scrolling up
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

  // Trap Mobile OS Back button / Backspace gesture when mobile sidebar is open
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
    if (window.history.state?.sidebarOpen) {
      window.history.back();
    }
  };

  const handleNavClick = (sectionId?: string) => {
    closeSidebar();
    if (sectionId && onNavigateSection) {
      onNavigateSection(sectionId);
    }
  };

  return (
    <>
      {/* Sticky Header Container */}
      <div
        className={`sticky top-0 z-40 transition-transform duration-300 ease-out bg-[#f4f0e8] ${
          isHiddenOnScroll && !menuOpen ? "-translate-y-full shadow-none" : "translate-y-0 shadow-sm"
        }`}
      >
        {/* Announcement Bar */}
        <div className="announcement-bar">
          <span className="truncate">Serving homes, compounds & growing spaces across Kuwait</span>
          <a href={`tel:${contact.phoneTel}`} className="shrink-0">
            Call {contact.phoneDisplay} <ArrowUpRight size={13} />
          </a>
        </div>

        {/* Site Header */}
        <header className="site-header relative">
          <Link href="/" className="brand-lockup" aria-label="Desert Blooms home">
            <img src="/images/desert-blooms-logo.png" alt="" className="brand-mark" />
            <span className="brand-wordmark">
              DESERT <em>BLOOMS</em>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="main-nav hidden md:flex" aria-label="Main navigation">
            <Link href="/" className={location === "/" ? "active" : ""}>
              Home
            </Link>
            <Link href="/tools" className={location === "/tools" ? "active" : ""}>
              Tools Store
            </Link>
            {location === "/" ? (
              <>
                <button onClick={() => handleNavClick("overview")}>About Company</button>
                <button onClick={() => handleNavClick("services")}>Services</button>
                <button onClick={() => handleNavClick("approach")}>Our approach</button>
                <button onClick={() => handleNavClick("contact")}>Contact</button>
              </>
            ) : (
              <>
                <a href="/#services">Services</a>
                <a href="/#contact">Contact</a>
              </>
            )}
          </nav>

          {/* Header Action Buttons */}
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

            {location === "/" ? (
              <button
                className="header-cta hidden sm:inline-flex"
                onClick={() => handleNavClick("contact")}
              >
                Plan a garden <ArrowUpRight size={16} />
              </button>
            ) : (
              <a href="/#contact" className="header-cta hidden sm:inline-flex">
                Get In Touch <ArrowUpRight size={16} />
              </a>
            )}

            {/* 3 Lines Hamburger Button (Opens Mobile Sidebar) */}
            <button
              className="md:hidden p-2 text-[#22352b] hover:text-[#b86745] transition-colors cursor-pointer"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Open navigation sidebar"
            >
              <Menu size={24} strokeWidth={2} />
            </button>
          </div>
        </header>
      </div>

      {/* Slide-Over Mobile Navigation Sidebar & Backdrop Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-xs flex justify-end animate-fadeIn md:hidden"
          onClick={closeSidebar}
        >
          <aside
            className="w-[310px] max-w-[85vw] h-full bg-[#22352b] text-[#f1eadf] shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-slideLeft"
            onClick={(e) => e.stopPropagation()}
            aria-label="Mobile Navigation Sidebar"
          >
            {/* Sidebar Top Header */}
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-white/15">
                <div className="flex items-center gap-3">
                  <img src="/images/desert-blooms-logo.png" alt="" className="w-9 h-9 rounded-full object-contain" />
                  <span className="font-bold text-xs tracking-widest text-[#f1eadf]">
                    DESERT <em className="font-serif font-normal not-italic text-[#d37a55]">BLOOMS</em>
                  </span>
                </div>
                <button
                  onClick={closeSidebar}
                  className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Close sidebar"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sidebar Navigation Items */}
              <div className="py-6 flex flex-col gap-2">
                <p className="text-[10px] tracking-widest text-[#d37a55] font-bold uppercase mb-2">
                  Navigation Menu
                </p>

                <Link
                  href="/"
                  onClick={closeSidebar}
                  className={`flex items-center justify-between p-3 rounded-md transition-colors ${
                    location === "/" ? "bg-[#315842] text-white font-bold" : "text-[#d8e0d5] hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3 text-sm">
                    <HomeIcon size={18} className="text-[#d37a55]" />
                    <span>Home</span>
                  </div>
                  <ChevronRight size={16} className="opacity-50" />
                </Link>

                <Link
                  href="/tools"
                  onClick={closeSidebar}
                  className={`flex items-center justify-between p-3 rounded-md transition-colors ${
                    location === "/tools" ? "bg-[#315842] text-white font-bold" : "text-[#d8e0d5] hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3 text-sm">
                    <Wrench size={18} className="text-[#d37a55]" />
                    <span>Tools Store</span>
                  </div>
                  <ChevronRight size={16} className="opacity-50" />
                </Link>

                {location === "/" ? (
                  <>
                    <button
                      onClick={() => handleNavClick("overview")}
                      className="flex items-center justify-between p-3 rounded-md text-[#d8e0d5] hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 text-sm">
                        <Building2 size={18} className="text-[#d37a55]" />
                        <span>About Company</span>
                      </div>
                      <ChevronRight size={16} className="opacity-50" />
                    </button>

                    <button
                      onClick={() => handleNavClick("services")}
                      className="flex items-center justify-between p-3 rounded-md text-[#d8e0d5] hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 text-sm">
                        <Sparkles size={18} className="text-[#d37a55]" />
                        <span>Landscaping Services</span>
                      </div>
                      <ChevronRight size={16} className="opacity-50" />
                    </button>

                    <button
                      onClick={() => handleNavClick("approach")}
                      className="flex items-center justify-between p-3 rounded-md text-[#d8e0d5] hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 text-sm">
                        <Compass size={18} className="text-[#d37a55]" />
                        <span>Our Approach</span>
                      </div>
                      <ChevronRight size={16} className="opacity-50" />
                    </button>
                  </>
                ) : (
                  <a
                    href="/#services"
                    onClick={closeSidebar}
                    className="flex items-center justify-between p-3 rounded-md text-[#d8e0d5] hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 text-sm">
                      <Sparkles size={18} className="text-[#d37a55]" />
                      <span>Services</span>
                    </div>
                    <ChevronRight size={16} className="opacity-50" />
                  </a>
                )}
              </div>
            </div>

            {/* Sidebar Footer Actions */}
            <div className="pt-6 border-t border-white/15 space-y-4">
              {location === "/" ? (
                <button
                  onClick={() => handleNavClick("contact")}
                  className="w-full py-3.5 bg-[#b86745] hover:bg-[#a45637] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  Plan a Garden <ArrowUpRight size={16} />
                </button>
              ) : (
                <a
                  href="/#contact"
                  onClick={closeSidebar}
                  className="w-full py-3.5 bg-[#b86745] hover:bg-[#a45637] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  Get In Touch <ArrowUpRight size={16} />
                </a>
              )}

              <div className="space-y-2 text-xs text-[#b7c1b3] pt-1">
                <a href={`tel:${contact.phoneTel}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone size={14} className="text-[#d37a55]" />
                  <span>Call {contact.phoneDisplay}</span>
                </a>
                <a href={contact.whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <MessageCircle size={14} className="text-[#25d366]" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

