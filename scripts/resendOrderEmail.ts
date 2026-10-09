import "dotenv/config";
import { supabase } from "../server/db.js";
import { sendCustomerOrderConfirmationEmail, sendOrderNotificationEmail } from "../server/mail.js";

const ORDER_SELECT =
  "id, order_ref, status, total_amount, customer_name, customer_phone, customer_email, created_at, order_items(tool_name, quantity, unit_price, subtotal)";

async function listFailedEmails() {
  const { data, error } = await supabase
    .from("notifications")
    .select("id, order_id, channel, error_message, sent_at, orders(order_ref, created_at)")
    .in("channel", ["email", "customer_email"])
    .eq("status", "failed")
    .order("sent_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(`Could not list failed emails: ${error.message}`);

  if (!data?.length) {
    console.log("No failed order emails found.");
    return;
  }

  for (const notification of data) {
    const relatedOrder = Array.isArray(notification.orders)
      ? notification.orders[0]
      : notification.orders;
    console.log(
      `${relatedOrder?.order_ref ?? notification.order_id} | ${notification.channel} | ${relatedOrder?.created_at ?? notification.sent_at} | ${notification.error_message ?? "No error details"}`
    );
  }
}

async function resendOrderEmail(orderReference: string, channel: "email" | "customer_email") {
  const isOrderRef = /^DB-\d+$/i.test(orderReference);
  const isOrderId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderReference);

  if (!isOrderRef && !isOrderId) {
    throw new Error("Pass an order reference like DB-100001 or a valid order UUID.");
  }

  let orderQuery = supabase.from("orders").select(ORDER_SELECT);
  orderQuery = isOrderRef
    ? orderQuery.eq("order_ref", orderReference.toUpperCase())
    : orderQuery.eq("id", orderReference);

  const { data: order, error: orderError } = await orderQuery.maybeSingle();
  if (orderError) throw new Error(`Could not load order: ${orderError.message}`);
  if (!order) throw new Error(`Order '${orderReference}' was not found.`);
  if (!order.order_ref || !order.customer_name || !order.customer_phone || !order.customer_email) {
    throw new Error("Order is missing its reference or customer contact details.");
  }
  if (!order.order_items?.length) throw new Error("Order has no saved line items.");

  const { data: notifications, error: notificationError } = await supabase
    .from("notifications")
    .select("id, status")
    .eq("order_id", order.id)
    .eq("channel", channel)
    .order("sent_at", { ascending: false })
    .limit(1);

  if (notificationError) {
    throw new Error(`Could not check email history: ${notificationError.message}`);
  }

  const latestNotification = notifications?.[0];
  if (latestNotification?.status === "sent") {
    throw new Error(`The latest email for ${order.order_ref} is already marked sent.`);
  }

  const notificationTimestamp = new Date(order.created_at).toLocaleString("en-GB", {
    timeZone: "Asia/Kuwait",
    dateStyle: "full",
    timeStyle: "short",
  });

  try {
    const items = order.order_items.map((item) => ({
      name: item.tool_name,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unit_price),
      subtotal: Number(item.subtotal),
    }));

    if (channel === "customer_email") {
      await sendCustomerOrderConfirmationEmail({
        orderRef: order.order_ref,
        customer: { name: order.customer_name, email: order.customer_email },
        items,
        totalAmount: Number(order.total_amount),
        timestamp: notificationTimestamp,
      });
    } else {
      await sendOrderNotificationEmail({
        orderId: order.id,
        orderRef: order.order_ref,
        status: order.status,
        customer: {
          name: order.customer_name,
          phone: order.customer_phone,
          email: order.customer_email,
        },
        items,
        totalAmount: Number(order.total_amount),
        timestamp: notificationTimestamp,
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (latestNotification) {
      await supabase
        .from("notifications")
        .update({ status: "failed", error_message: message, sent_at: new Date().toISOString() })
        .eq("id", latestNotification.id);
    }
    throw new Error(`Resend failed for ${order.order_ref} (${channel}): ${message}`);
  }

  if (latestNotification) {
    const { error } = await supabase
      .from("notifications")
      .update({ status: "sent", error_message: null, sent_at: new Date().toISOString() })
      .eq("id", latestNotification.id);
    if (error) {
      throw new Error(`Email sent for ${order.order_ref}, but notification status could not be updated: ${error.message}`);
    }
  } else {
    const { error } = await supabase.from("notifications").insert({
      order_id: order.id,
      channel: "email",
      status: "sent",
      error_message: null,
    });
    if (error) {
      throw new Error(`Email sent for ${order.order_ref}, but notification status could not be recorded: ${error.message}`);
    }
  }

  console.log(`Order email resent successfully for ${order.order_ref} (${channel}).`);
}

async function main() {
  const argument = process.argv[2];
  if (argument === "--list-failed") {
    await listFailedEmails();
    return;
  }
  if (!argument) {
    throw new Error("Usage: pnpm run resend:order-email -- --list-failed | [--customer] DB-100001");
  }
  const resendCustomerEmail = argument === "--customer";
  const orderReference = resendCustomerEmail ? process.argv[3] : argument;
  if (!orderReference) {
    throw new Error("Pass an order reference after --customer.");
  }
  await resendOrderEmail(orderReference, resendCustomerEmail ? "customer_email" : "email");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
