import { createOrderSchema, CreateOrderInput } from "../shared/orderSchema.js";
import toolsData from "../shared/tools.json" with { type: "json" };

const TARGET_WHATSAPP_NUMBER =
  process.env.VITE_CONTACT_WHATSAPP?.trim() || "96598855871";

const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function underThousand(value: number): string {
  if (value < 20) return ONES[value];
  if (value < 100) return TENS[Math.floor(value / 10)] + (value % 10 ? `-${ONES[value % 10]}` : "");
  return `${ONES[Math.floor(value / 100)]} hundred${value % 100 ? ` ${underThousand(value % 100)}` : ""}`;
}
function amountInWords(value: number): string {
  const whole = Math.floor(value);
  const fils = Math.round((value - whole) * 1000);
  const main = whole < 1000 ? underThousand(whole) : `${underThousand(Math.floor(whole / 1000))} thousand${whole % 1000 ? ` ${underThousand(whole % 1000)}` : ""}`;
  return `${main} Kuwaiti dinar${whole === 1 ? "" : "s"}${fils ? ` and ${underThousand(fils)} fils` : ""} only`;
}

export interface VerifiedOrderItem {
  id: string;
  binNo: string;
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface VerifiedOrderReceipt {
  orderRef: string;
  timestamp: string;
  customer: {
    name: string;
    phone: string;
    deliveryNotes?: string;
  };
  items: VerifiedOrderItem[];
  totalAmount: number;
  formattedTotal: string;
  amountInWords: string;
  whatsappNumber: string;
  whatsappUrl: string;
  whatsappMessage: string;
}

export async function processOrder(
  body: unknown,
  clientIp: string
): Promise<
  | { ok: true; receipt: VerifiedOrderReceipt }
  | { ok: false; status: number; message: string }
> {
  const parseResult = createOrderSchema.safeParse(body);

  if (!parseResult.success) {
    const issue = parseResult.error.issues[0];
    return {
      ok: false,
      status: 400,
      message: issue ? `${issue.path.join(".")}: ${issue.message}` : "Invalid order payload.",
    };
  }

  const data: CreateOrderInput = parseResult.data;

  // Bot honeypot check
  if (data._gotcha && data._gotcha.trim().length > 0) {
    return { ok: false, status: 400, message: "Invalid request submission." };
  }

  // Map and verify items against canonical tools dataset
  const verifiedItems: VerifiedOrderItem[] = [];
  let grandTotal = 0;

  for (const item of data.items) {
    const catalogItem = toolsData.find((t) => t.id === item.toolId || t.binNo === item.toolId);
    if (!catalogItem) {
      return {
        ok: false,
        status: 404,
        message: `Tool item with ID '${item.toolId}' was not found in our catalog.`,
      };
    }

    const itemSubtotal = catalogItem.price * item.quantity;
    grandTotal += itemSubtotal;

    verifiedItems.push({
      id: catalogItem.id,
      binNo: catalogItem.binNo,
      name: catalogItem.name,
      unitPrice: catalogItem.price,
      quantity: item.quantity,
      subtotal: Number(itemSubtotal.toFixed(3)),
    });
  }

  const formattedGrandTotal = `${grandTotal.toFixed(3)} KWD`;
  const orderRef = `DB-${Math.floor(100000 + Math.random() * 900000)}`;
  const timestamp = new Date().toLocaleString("en-KW", {
    timeZone: "Asia/Kuwait",
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Construct official formatted WhatsApp receipt message
  let messageLines = [
    `🌿 *DESERT BLOOMS - OFFICIAL ORDER RECEIPT*`,
    `----------------------------------------`,
    `📋 *Order Ref:* #${orderRef}`,
    `📅 *Date:* ${timestamp}`,
    ``,
    `👤 *CUSTOMER DETAILS:*`,
    `• *Name:* ${data.customer.name}`,
    `• *Phone:* ${data.customer.phone}`,
  ];

  if (data.customer.deliveryNotes) {
    messageLines.push(`• *Notes:* ${data.customer.deliveryNotes}`);
  }

  messageLines.push(
    ``,
    `🛒 *ORDERED ITEMS (${verifiedItems.reduce((acc, i) => acc + i.quantity, 0)} total):*`
  );

  verifiedItems.forEach((item, index) => {
    messageLines.push(
      `${index + 1}. *${item.name}*`,
      `   └ Bin No: ${item.binNo} | Qty: ${item.quantity} x ${item.unitPrice.toFixed(3)} KWD = *${item.subtotal.toFixed(3)} KWD*`
    );
  });

  messageLines.push(
    ``,
    `----------------------------------------`,
    `💰 *TOTAL AMOUNT: ${formattedGrandTotal}*`,
    `In words: ${amountInWords(grandTotal)}`,
    `----------------------------------------`,
    `Thank you for choosing Desert Blooms Agricultural Cont. Co.!`
  );

  const whatsappMessage = messageLines.join("\n");
  const encodedMsg = encodeURIComponent(whatsappMessage);
  const whatsappUrl = `https://wa.me/${TARGET_WHATSAPP_NUMBER}?text=${encodedMsg}`;

  const receipt: VerifiedOrderReceipt = {
    orderRef,
    timestamp,
    customer: {
      name: data.customer.name,
      phone: data.customer.phone,
      deliveryNotes: data.customer.deliveryNotes,
    },
    items: verifiedItems,
    totalAmount: Number(grandTotal.toFixed(3)),
    formattedTotal: formattedGrandTotal,
    amountInWords: amountInWords(grandTotal),
    whatsappNumber: `+${TARGET_WHATSAPP_NUMBER.startsWith("965") ? "965 " + TARGET_WHATSAPP_NUMBER.slice(3) : TARGET_WHATSAPP_NUMBER}`,
    whatsappUrl,
    whatsappMessage,
  };

  console.log(`[Order Verified] #${orderRef} for ${data.customer.name} - Total: ${formattedGrandTotal} (IP: ${clientIp})`);

  return { ok: true, receipt };
}
