import React from "react";
import { useCart } from "../../contexts/CartContext";
import { useLocale } from "../../contexts/LocaleContext";
import { createReceiptPdf, downloadReceiptPdf, amountInWords } from "../../lib/receiptPdf";
import { X, MessageCircle, FileDown, CheckCircle, ShieldCheck, Copy, Check } from "lucide-react";

export const ReceiptModal: React.FC = () => {
  const { activeReceipt, setActiveReceipt } = useCart();
  const { t } = useLocale();
  const [copied, setCopied] = React.useState(false);
  const [pdfBusy, setPdfBusy] = React.useState(false);

  React.useEffect(() => {
    if (!activeReceipt) return;

    window.history.pushState({ receiptModalOpen: true }, "");

    const handlePopState = () => {
      setActiveReceipt(null);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [activeReceipt, setActiveReceipt]);

  const closeReceipt = () => {
    setActiveReceipt(null);
    if (window.history.state?.receiptModalOpen) {
      window.history.back();
    }
  };

  if (!activeReceipt) return null;
  const words = activeReceipt.amountInWords || amountInWords(activeReceipt.totalAmount);

  const handleCopySummary = async () => {
    await navigator.clipboard.writeText(activeReceipt.whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPdf = async () => {
    setPdfBusy(true);
    try {
      const blob = await createReceiptPdf(activeReceipt);
      return blob;
    } finally {
      setPdfBusy(false);
    }
  };

  const handleDownload = async () => {
    const blob = await getPdf();
    downloadReceiptPdf(blob, activeReceipt.orderRef);
  };

  return (
    <div className="receipt-modal-overlay" onClick={closeReceipt}>
      <div className="receipt-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={t("receipt.aria")}>
        <header className="receipt-modal-header">
          <div className="receipt-header-left"><CheckCircle className="success-icon" size={28} /><div><h2>{t("receipt.invoiceReady")}</h2><span className="order-ref-tag">{t("receipt.ref", { ref: activeReceipt.orderRef })}</span></div></div>
          <button className="receipt-close-btn" onClick={closeReceipt} aria-label={t("receipt.close")}><X size={20} /></button>
        </header>
        <div className="receipt-modal-body printable-area">
          <div className="receipt-brand-row"><img src="/images/desert-blooms-logo.png" alt="Desert Blooms" /><div><strong>DESERT BLOOMS</strong><small>{t("receipt.companyLine")}</small></div><span className="invoice-chip">{t("receipt.invoiceChip")}</span></div>
          <div className="receipt-meta-grid">
            <div><span className="meta-label">{t("receipt.dateTime")}</span><strong className="meta-val">{activeReceipt.timestamp}</strong></div>
            <div><span className="meta-label">{t("receipt.customerName")}</span><strong className="meta-val">{activeReceipt.customer.name}</strong></div>
            <div><span className="meta-label">{t("receipt.customerPhone")}</span><strong className="meta-val">{activeReceipt.customer.phone}</strong></div>
            <div><span className="meta-label">{t("receipt.orderRef")}</span><strong className="meta-val">#{activeReceipt.orderRef}</strong></div>
          </div>
          {activeReceipt.customer.deliveryNotes ? <div className="receipt-notes-box"><span className="meta-label">{t("receipt.deliveryNotes")}</span><p>{activeReceipt.customer.deliveryNotes}</p></div> : null}
          <div className="receipt-table-wrapper"><table className="receipt-table"><thead><tr><th>{t("receipt.colItem")}</th><th className="text-center">{t("receipt.colQty")}</th><th className="text-right">{t("receipt.colUnit")}</th><th className="text-right">{t("receipt.colTotal")}</th></tr></thead><tbody>{activeReceipt.items.map((item) => <tr key={item.id}><td><div className="item-table-name">{item.name}</div><small className="item-table-bin">{t("receipt.binNo")} {item.binNo}</small></td><td className="text-center"><strong>{item.quantity}</strong></td><td className="text-right">{item.unitPrice.toFixed(3)} KWD</td><td className="text-right"><strong>{item.subtotal.toFixed(3)} KWD</strong></td></tr>)}</tbody></table></div>
          <div className="receipt-total-banner"><div><div className="total-label">{t("receipt.grandTotal")}</div><div className="amount-words">{words}</div></div><div className="total-value">{activeReceipt.formattedTotal}</div></div>
        </div>
        <footer className="receipt-modal-footer">
          <a href={activeReceipt.whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-primary-btn"><MessageCircle size={20} /><span>{t("receipt.whatsapp")}</span></a>
          <div className="receipt-secondary-actions"><button className="button button-outline" onClick={handleDownload} disabled={pdfBusy}><FileDown size={16} />{pdfBusy ? t("receipt.preparingPdf") : t("receipt.downloadPdf")}</button><button className="button button-outline" onClick={handleCopySummary}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? t("receipt.copied") : t("receipt.copyText")}</button></div>
          <div className="security-notice"><ShieldCheck size={14} /><span>{t("receipt.security")}</span></div>
        </footer>
      </div>
    </div>
  );
};
