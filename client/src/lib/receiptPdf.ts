import jsPDF from "jspdf";
import { VerifiedOrderReceipt } from "../types/tool";

const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function underThousand(value: number): string {
  if (value < 20) return ONES[value];
  if (value < 100) return TENS[Math.floor(value / 10)] + (value % 10 ? `-${ONES[value % 10]}` : "");
  return `${ONES[Math.floor(value / 100)]} hundred${value % 100 ? ` ${underThousand(value % 100)}` : ""}`;
}

function integerWords(value: number): string {
  if (value < 1000) return underThousand(value);
  if (value < 1_000_000) return `${underThousand(Math.floor(value / 1000))} thousand${value % 1000 ? ` ${underThousand(value % 1000)}` : ""}`;
  return `${underThousand(Math.floor(value / 1_000_000))} million${value % 1_000_000 ? ` ${integerWords(value % 1_000_000)}` : ""}`;
}

export function amountInWords(amount: number): string {
  const whole = Math.floor(amount);
  const fils = Math.round((amount - whole) * 1000);
  const main = `${integerWords(whole)} Kuwaiti dinar${whole === 1 ? "" : "s"}`;
  return fils ? `${main} and ${integerWords(fils)} fils only` : `${main} only`;
}

async function imageDataUrl(path: string): Promise<string | null> {
  try {
    const response = await fetch(path);
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function createReceiptPdf(receipt: VerifiedOrderReceipt): Promise<Blob> {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const logo = await imageDataUrl("/images/desert-blooms-logo.png");
  const left = 16;
  const right = 194;
  let y = 18;

  pdf.setFillColor(49, 88, 66);
  pdf.rect(0, 0, 210, 8, "F");
  if (logo) pdf.addImage(logo, "PNG", left, y - 5, 17, 17);
  pdf.setTextColor(34, 53, 43);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("DESERT BLOOMS", left + 22, y + 2);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 103);
  pdf.text("AGRICULTURAL CONT. CO. · KUWAIT", left + 22, y + 8);
  pdf.setFontSize(18);
  pdf.setTextColor(49, 88, 66);
  pdf.text("INVOICE", right, y + 4, { align: "right" });
  y += 28;

  pdf.setDrawColor(216, 208, 193);
  pdf.line(left, y, right, y);
  y += 9;
  pdf.setFontSize(8);
  pdf.setTextColor(115, 128, 116);
  pdf.text("ORDER REFERENCE", left, y);
  pdf.text("DATE & TIME", 82, y);
  pdf.text("CUSTOMER", 142, y);
  y += 5;
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(34, 53, 43);
  pdf.text(`#${receipt.orderRef}`, left, y);
  pdf.text(receipt.timestamp, 82, y);
  pdf.text(receipt.customer.name.slice(0, 25), 142, y);
  y += 13;

  pdf.setFillColor(238, 234, 224);
  pdf.rect(left, y, right - left, 8, "F");
  pdf.setFontSize(8);
  pdf.setTextColor(49, 88, 66);
  pdf.text("ITEM / BIN", left + 3, y + 5);
  pdf.text("QTY", 124, y + 5, { align: "right" });
  pdf.text("UNIT", 157, y + 5, { align: "right" });
  pdf.text("TOTAL", right - 3, y + 5, { align: "right" });
  y += 13;

  pdf.setFont("helvetica", "normal");
  for (const item of receipt.items) {
    pdf.setFontSize(9);
    pdf.setTextColor(34, 53, 43);
    const name = item.name.length > 54 ? `${item.name.slice(0, 51)}…` : item.name;
    pdf.text(name, left + 3, y);
    pdf.setFontSize(7);
    pdf.setTextColor(115, 128, 116);
    pdf.text(`Bin No: ${item.binNo}`, left + 3, y + 4);
    pdf.setFontSize(9);
    pdf.setTextColor(34, 53, 43);
    pdf.text(String(item.quantity), 124, y + 1, { align: "right" });
    pdf.text(`${item.unitPrice.toFixed(3)}`, 157, y + 1, { align: "right" });
    pdf.setFont("helvetica", "bold");
    pdf.text(`${item.subtotal.toFixed(3)}`, right - 3, y + 1, { align: "right" });
    pdf.setFont("helvetica", "normal");
    pdf.setDrawColor(232, 226, 215);
    pdf.line(left, y + 9, right, y + 9);
    y += 15;
  }

  y += 3;
  pdf.setFillColor(49, 88, 66);
  pdf.roundedRect(112, y, 82, 22, 2, 2, "F");
  pdf.setTextColor(225, 235, 224);
  pdf.setFontSize(8);
  pdf.text("GRAND TOTAL", 117, y + 8);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.text(receipt.formattedTotal, 189, y + 16, { align: "right" });
  y += 34;
  pdf.setTextColor(100, 116, 103);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.text("Amount in words", left, y);
  pdf.setTextColor(34, 53, 43);
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(9);
  pdf.text(amountInWords(receipt.totalAmount), left, y + 6, { maxWidth: 175 });
  y += 18;

  if (receipt.customer.deliveryNotes) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 103);
    pdf.text("DELIVERY / SPECIAL NOTES", left, y);
    pdf.setTextColor(34, 53, 43);
    pdf.text(receipt.customer.deliveryNotes.slice(0, 110), left, y + 6, { maxWidth: 178 });
  }

  pdf.setDrawColor(216, 208, 193);
  pdf.line(left, 278, right, 278);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(125, 135, 122);
  pdf.text("Thank you for choosing Desert Blooms Agricultural Cont. Co.", left, 285);
  pdf.text("Page 1 of 1", right, 285, { align: "right" });
  return pdf.output("blob");
}

export function downloadReceiptPdf(blob: Blob, orderRef: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `desert-blooms-invoice-${orderRef}.pdf`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
