import { createOrderSchema, CreateOrderInput } from "../shared/orderSchema.js";
import { createHash } from "node:crypto";
import toolsData from "../shared/tools.json" with { type: "json" };
import { supabase } from "./db.js";
import { sendCustomerOrderConfirmationEmail, sendOrderNotificationEmail } from "./mail.js";

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
  orderId: string;
  orderRef: string;
  timestamp: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    deliveryNotes?: string;
  };
  items: VerifiedOrderItem[];
  totalAmount: number;
  formattedTotal: string;
  amountInWords: string;
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
  const requestFingerprint = createHash("sha256")
    .update(JSON.stringify({
      customer: data.customer,
      items: verifiedItems.map((item) => ({ id: item.id, quantity: item.quantity, unitPrice: item.unitPrice })),
    }))
    .digest("hex");

  const { data: insertedOrder, error: orderError } = await supabase
    .from("orders")
    .insert({
      idempotency_key: data.idempotencyKey,
      request_fingerprint: requestFingerprint,
      status: "pending",
      currency: "KWD",
      total_amount: grandTotal.toFixed(3),
      customer_name: data.customer.name,
      customer_phone: data.customer.phone,
      customer_email: data.customer.email,
    })
    .select("id, order_ref, created_at")
    .single();

  let order = insertedOrder;
  let isExistingOrder = false;

  if (orderError?.code === "23505") {
    const { data: existingOrder, error: existingOrderError } = await supabase
      .from("orders")
      .select("id, order_ref, created_at, request_fingerprint")
      .eq("idempotency_key", data.idempotencyKey)
      .maybeSingle();

    if (existingOrderError) {
      throw new Error(`Could not check the previous order attempt: ${existingOrderError.message}`);
    }
    if (!existingOrder) {
      throw new Error(`Failed to save order: ${orderError.message}`);
    }
    if (existingOrder.request_fingerprint !== requestFingerprint) {
      return {
        ok: false,
        status: 409,
        message: "This checkout attempt was already used with different details. Refresh the cart and submit again.",
      };
    }

    const { data: existingItems, error: existingItemsError } = await supabase
      .from("order_items")
      .select("id")
      .eq("order_id", existingOrder.id)
      .limit(1);

    if (existingItemsError) {
      throw new Error(`Could not check the previous order items: ${existingItemsError.message}`);
    }
    if (!existingItems?.length) {
      return {
        ok: false,
        status: 409,
        message: "Your order is still being processed. Wait briefly, then retry with the same details.",
      };
    }

    order = existingOrder;
    isExistingOrder = true;
  } else if (orderError || !order) {
    throw new Error(`Failed to save order: ${orderError?.message ?? "No order ID returned."}`);
  }

  if (!order) {
    throw new Error("Failed to save order: No order ID returned.");
  }

  if (!isExistingOrder) {
    const { error: itemsError } = await supabase.from("order_items").insert(
      verifiedItems.map((item) => ({
        order_id: order.id,
        tool_id: item.id,
        tool_name: item.name,
        quantity: item.quantity,
        unit_price: item.unitPrice.toFixed(3),
        subtotal: item.subtotal.toFixed(3),
      }))
    );

    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id);
      throw new Error(`Failed to save order items: ${itemsError.message}`);
    }
  }

  const notificationTimestamp = new Date(order.created_at).toLocaleString("en-GB", {
    timeZone: "Asia/Kuwait",
    dateStyle: "full",
    timeStyle: "short",
  });
  if (!isExistingOrder) {
  let emailStatus: "sent" | "failed" = "sent";
  let emailErrorMessage: string | null = null;

  try {
    await sendOrderNotificationEmail({
      orderId: order.id,
      orderRef: order.order_ref,
      status: "pending",
      customer: data.customer,
      items: verifiedItems,
      totalAmount: grandTotal,
      timestamp: notificationTimestamp,
    });
  } catch (error) {
    emailStatus = "failed";
    emailErrorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Order notification email failed] Order ${order.id}:`, error);
  }

  try {
    const { error: notificationError } = await supabase.from("notifications").insert({
      order_id: order.id,
      channel: "email",
      status: emailStatus,
      error_message: emailErrorMessage,
    });

    if (notificationError) {
      console.error(`[Order notification record failed] Order ${order.id}:`, notificationError);
    }
  } catch (error) {
    console.error(`[Order notification record failed] Order ${order.id}:`, error);
  }

  let customerEmailStatus: "sent" | "failed" = "sent";
  let customerEmailErrorMessage: string | null = null;

  try {
    await sendCustomerOrderConfirmationEmail({
      orderRef: order.order_ref,
      customer: data.customer,
      items: verifiedItems,
      totalAmount: grandTotal,
      timestamp: notificationTimestamp,
    });
  } catch (error) {
    customerEmailStatus = "failed";
    customerEmailErrorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Customer order confirmation email failed] Order ${order.id}:`, error);
  }

  try {
    const { error: notificationError } = await supabase.from("notifications").insert({
      order_id: order.id,
      channel: "customer_email",
      status: customerEmailStatus,
      error_message: customerEmailErrorMessage,
    });

    if (notificationError) {
      console.error(`[Customer email notification record failed] Order ${order.id}:`, notificationError);
    }
  } catch (error) {
    console.error(`[Customer email notification record failed] Order ${order.id}:`, error);
  }
  }

  const orderRef = order.order_ref;
  const timestamp = new Date(order.created_at).toLocaleString("en-KW", {
    timeZone: "Asia/Kuwait",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const receipt: VerifiedOrderReceipt = {
    orderId: order.id,
    orderRef,
    timestamp,
    customer: {
      name: data.customer.name,
      email: data.customer.email,
      phone: data.customer.phone,
      deliveryNotes: data.customer.deliveryNotes,
    },
    items: verifiedItems,
    totalAmount: Number(grandTotal.toFixed(3)),
    formattedTotal: formattedGrandTotal,
    amountInWords: amountInWords(grandTotal),
  };

  console.log(`[Order Verified] #${orderRef} for ${data.customer.name} - Total: ${formattedGrandTotal} (IP: ${clientIp})`);

  return { ok: true, receipt };
}
