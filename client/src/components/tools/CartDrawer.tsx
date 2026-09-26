import React, { useState, useEffect, FormEvent } from "react";
import { useCart } from "../../contexts/CartContext";
import { useLocale } from "../../contexts/LocaleContext";
import { VerifiedOrderReceipt } from "../../types/tool";
import { X, Trash2, Plus, Minus, MessageCircle, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const { t } = useLocale();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
    clearCart,
    setActiveReceipt,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [countryCode, setCountryCode] = useState("+44");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [gotcha, setGotcha] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Trap Mobile OS / Physical Back gesture or Backspace navigation
  useEffect(() => {
    if (!isCartOpen) return;

    window.history.pushState({ cartModalOpen: true }, "");

    const handlePopState = () => {
      setIsCartOpen(false);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isCartOpen, setIsCartOpen]);

  const closeCart = () => {
    setIsCartOpen(false);
    if (window.history.state?.cartModalOpen) {
      window.history.back();
    }
  };

  if (!isCartOpen) return null;

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        customer: {
          name: customerName,
          phone: `${countryCode} ${customerPhone.trim().replace(/^0+/, "")}`,
          deliveryNotes: deliveryNotes || undefined,
        },
        items: cartItems.map((item) => ({
          toolId: item.tool.id,
          quantity: item.quantity,
        })),
        _gotcha: gotcha || undefined,
      };

      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let data: { message?: string } & Record<string, unknown> = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText) as typeof data;
        } catch {
          throw new Error(`Checkout failed (${response.status}). Please try again.`);
        }
      }

      if (!response.ok) {
        throw new Error(data.message || `Checkout failed (${response.status}).`);
      }

      // Order created successfully! Open receipt modal and close drawer
      setActiveReceipt(data as unknown as VerifiedOrderReceipt);
      closeCart();
      clearCart();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error creating order receipt. Please check your inputs."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cart-drawer-overlay" onClick={closeCart}>
      <div
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t("cart.aria")}
      >
        <header className="cart-drawer-header">
          <div className="cart-drawer-title">
            <button
              onClick={closeCart}
              className="inline-flex items-center gap-1.5 text-xs text-[#b86745] font-bold uppercase tracking-wider mb-1"
            >
              <ArrowLeft size={14} /> {t("cart.continueShopping")}
            </button>
            <h2>{t("cart.title")}</h2>
            <span className="cart-count-badge">{totalItems} {totalItems === 1 ? t("cart.item") : t("cart.items")}</span>
          </div>
          <button
            className="cart-close-btn"
            onClick={closeCart}
            aria-label={t("cart.close")}
          >
            <X size={22} />
          </button>
        </header>

        {cartItems.length === 0 ? (
          <div className="cart-empty-state">
            <div className="empty-icon-wrap">🌿</div>
            <h3>{t("cart.emptyTitle")}</h3>
            <p>{t("cart.emptyBody")}</p>
            <button
              className="button button-dark"
              onClick={closeCart}
            >
              {t("cart.browse")}
            </button>
          </div>
        ) : (
          <div className="cart-drawer-content">
            <div className="cart-items-list">
              {cartItems.map(({ tool, quantity }) => (
                <div key={tool.id} className="cart-item-row">
                  <img src={tool.image} alt={tool.name} className="cart-item-thumb" />
                  <div className="cart-item-info">
                    <span className="cart-item-bin">BIN: {tool.binNo}</span>
                    <h4 className="cart-item-title">{tool.name}</h4>
                    <div className="cart-item-price">
                      {tool.price.toFixed(3)} KWD <small>each</small>
                    </div>
                  </div>

                  <div className="cart-item-controls">
                    <div className="qty-picker compact">
                      <button
                        onClick={() => updateQuantity(tool.id, quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span>{quantity}</span>
                      <button
                        onClick={() => updateQuantity(tool.id, quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="cart-item-subtotal">
                      {(tool.price * quantity).toFixed(3)} KWD
                    </div>

                    <button
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(tool.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleCheckout} className="cart-checkout-form">
              <div className="customer-info-section">
                <h3>{t("cart.customerSection")}</h3>

                <label className="hp-field" aria-hidden="true">
                  Company
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={gotcha}
                    onChange={(e) => setGotcha(e.target.value)}
                  />
                </label>

                <div className="form-group">
                  <label htmlFor="customerName">{t("cart.fullName")}</label>
                  <input
                    id="customerName"
                    type="text"
                    required
                    placeholder={t("cart.namePlaceholder")}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    disabled={submitting}
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customerPhone">{t("cart.phone")}</label>
                  <div className="phone-input-row">
                    <select
                      id="countryCode"
                      aria-label={t("cart.countryCode")}
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      disabled={submitting}
                    >
                      <option value="+965">KW +965</option>
                      <option value="+966">SA +966</option>
                      <option value="+971">AE +971</option>
                      <option value="+974">QA +974</option>
                      <option value="+973">BH +973</option>
                      <option value="+968">OM +968</option>
                      <option value="+91">IN +91</option>
                      <option value="+44">GB +44</option>
                      <option value="+1">US +1</option>
                    </select>
                    <input
                      id="customerPhone"
                      type="tel"
                      required
                      placeholder={t("cart.phonePlaceholder")}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      disabled={submitting}
                      maxLength={15}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="deliveryNotes">{t("cart.notes")}</label>
                  <textarea
                    id="deliveryNotes"
                    rows={2}
                    placeholder={t("cart.notesPlaceholder")}
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    disabled={submitting}
                    maxLength={500}
                  />
                </div>
              </div>

              <div className="cart-summary-footer">
                <div className="summary-row">
                  <span>{t("cart.subtotal", { count: totalItems })}</span>
                  <strong>{subtotal.toFixed(3)} KWD</strong>
                </div>
                <div className="summary-row total-row">
                  <span>{t("cart.totalAmount")}</span>
                  <strong className="grand-total">{subtotal.toFixed(3)} KWD</strong>
                </div>

                {error ? (
                  <div className="form-error-banner">
                    <AlertCircle size={16} /> {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="whatsapp-checkout-btn"
                  disabled={submitting}
                >
                  <MessageCircle size={19} />
                  <span>
                    {submitting ? t("cart.verifying") : t("cart.generateReceipt")}
                  </span>
                  <ArrowRight size={18} />
                </button>

                <div className="security-badge-note">
                  <ShieldCheck size={14} />
                  <span>{t("cart.securityNote")}</span>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
