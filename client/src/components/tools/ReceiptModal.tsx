import React from "react";
import { useCart } from "../../contexts/CartContext";
import { createReceiptPdf, downloadReceiptPdf, amountInWords } from "../../lib/receiptPdf";
import { X, MessageCircle, FileDown, CheckCircle, ShieldCheck, Copy, Check } from "lucide-react";

export const ReceiptModal: React.FC = () => {
  const { activeReceipt, setActiveReceipt } = useCart();
  const [copied, setCopied] = React.useState(false);
  const [pdfBusy, setPdfBusy] = React.useState(false);

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
    <div className="receipt-modal-overlay" onClick={() => setActiveReceipt(null)}>
      <div className="receipt-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Order Receipt Confirmation">
        <header className="receipt-modal-header">
          <div className="receipt-header-left"><CheckCircle className="success-icon" size={28} /><div><h2>Invoice ready</h2><span className="order-ref-tag">Ref: #{activeReceipt.orderRef}</span></div></div>
          <button className="receipt-close-btn" onClick={() => setActiveReceipt(null)} aria-label="Close receipt"><X size={20} /></button>
        </header>
        <div className="receipt-modal-body printable-area">
          <div className="receipt-brand-row"><img src="/images/desert-blooms-logo.png" alt="Desert Blooms" /><div><strong>DESERT BLOOMS</strong><small>AGRICULTURAL CONT. CO. · KUWAIT</small></div><span className="invoice-chip">INVOICE · 1/1</span></div>
          <div className="receipt-meta-grid">
            <div><span className="meta-label">Date & Time</span><strong className="meta-val">{activeReceipt.timestamp}</strong></div>
            <div><span className="meta-label">Customer Name</span><strong className="meta-val">{activeReceipt.customer.name}</strong></div>
            <div><span className="meta-label">Customer Phone</span><strong className="meta-val">{activeReceipt.customer.phone}</strong></div>
            <div><span className="meta-label">Order Ref</span><strong className="meta-val">#{activeReceipt.orderRef}</strong></div>
          </div>
          {activeReceipt.customer.deliveryNotes ? <div className="receipt-notes-box"><span className="meta-label">Delivery / Special Notes:</span><p>{activeReceipt.customer.deliveryNotes}</p></div> : null}
          <div className="receipt-table-wrapper"><table className="receipt-table"><thead><tr><th>Item Name & Bin No</th><th className="text-center">Qty</th><th className="text-right">Unit Price</th><th className="text-right">Total</th></tr></thead><tbody>{activeReceipt.items.map((item) => <tr key={item.id}><td><div className="item-table-name">{item.name}</div><small className="item-table-bin">Bin No: {item.binNo}</small></td><td className="text-center"><strong>{item.quantity}</strong></td><td className="text-right">{item.unitPrice.toFixed(3)} KWD</td><td className="text-right"><strong>{item.subtotal.toFixed(3)} KWD</strong></td></tr>)}</tbody></table></div>
          <div className="receipt-total-banner"><div><div className="total-label">Grand Total Amount</div><div className="amount-words">{words}</div></div><div className="total-value">{activeReceipt.formattedTotal}</div></div>
        </div>
        <footer className="receipt-modal-footer">
          <a href={activeReceipt.whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-primary-btn"><MessageCircle size={20} /><span>Send order details via WhatsApp</span></a>
          <div className="receipt-secondary-actions"><button className="button button-outline" onClick={handleDownload} disabled={pdfBusy}><FileDown size={16} />{pdfBusy ? "Preparing PDF…" : "Download PDF"}</button><button className="button button-outline" onClick={handleCopySummary}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copied" : "Copy text"}</button></div>
          <div className="security-notice"><ShieldCheck size={14} /><span>Branded one-page invoice · Amount shown in words · Page 1 of 1</span></div>
        </footer>
      </div>
    </div>
  );
};
