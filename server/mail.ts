import type { EnquiryInput } from "../shared/enquirySchema.js";
import nodemailer from "nodemailer";

type EnquiryPayload = Omit<EnquiryInput, "_gotcha">;

export interface OrderNotificationEmail {
  orderId: string;
  orderRef: string;
  status: string;
  customer: { name: string; phone: string; email: string; deliveryNotes?: string };
  items: Array<{ name: string; quantity: number; unitPrice: number; subtotal: number }>;
  totalAmount: number;
  timestamp: string;
}

export interface CustomerOrderConfirmationEmail {
  orderRef: string;
  customer: { name: string; email: string; deliveryNotes?: string };
  items: Array<{ name: string; quantity: number; unitPrice: number; subtotal: number }>;
  totalAmount: number;
  timestamp: string;
}

function getMailConfig() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.trim();
  const to = process.env.ENQUIRY_TO_EMAIL?.trim() || user || "desertbloooms@gmail.com";

  if (!user || !pass || !to) {
    return null;
  }

  return { user, pass, to };
}

export function isMailConfigured() {
  return getMailConfig() !== null;
}

export async function sendEnquiryEmail(
  enquiry: EnquiryPayload,
  clientIp: string,
) {
  const config = getMailConfig();
  if (!config) {
    throw new Error("Mail is not configured");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  const submittedAt = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Kuwait",
    dateStyle: "full",
    timeStyle: "short",
  });

  const text = [
    "New enquiry from the Desert Blooms website",
    "",
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Service: ${enquiry.service}`,
    "",
    "Message:",
    enquiry.message,
    "",
    `Submitted: ${submittedAt}`,
    `IP: ${clientIp}`,
  ].join("\n");

  await transporter.sendMail({
    from: `"Desert Blooms Website" <${config.user}>`,
    to: config.to,
    replyTo: enquiry.email,
    subject: `Website enquiry — ${enquiry.service}`,
    text,
  });
}

export async function sendOrderNotificationEmail(order: OrderNotificationEmail) {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.trim();
  const to = process.env.ORDER_NOTIFY_EMAIL?.trim();

  if (!user || !pass || !to) {
    throw new Error("Order email is not configured. Set GMAIL_USER, GMAIL_APP_PASSWORD, and ORDER_NOTIFY_EMAIL.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
    auth: { user, pass },
  });

  const lineItems = order.items.map(
    (item) => `${item.name} | Qty: ${item.quantity} | Unit: ${item.unitPrice.toFixed(3)} KWD | Subtotal: ${item.subtotal.toFixed(3)} KWD`
  );
  const text = [
    "A new order was received on the Desert Blooms website.",
    "",
    `Order ID: ${order.orderId}`,
    `Order reference: ${order.orderRef}`,
    `Status: ${order.status}`,
    `Customer name: ${order.customer.name}`,
    `Customer phone: ${order.customer.phone}`,
    `Customer email: ${order.customer.email}`,
    ...(order.customer.deliveryNotes ? [`Delivery notes: ${order.customer.deliveryNotes}`] : []),
    "",
    "Items:",
    ...lineItems,
    "",
    `Total: ${order.totalAmount.toFixed(3)} KWD`,
    `Timestamp: ${order.timestamp}`,
  ].join("\n");

  await transporter.sendMail({
    from: `"Desert Blooms Website" <${user}>`,
    to,
    replyTo: order.customer.email,
    subject: `New Order Received — #${order.orderRef}`,
    text,
  });
}

export async function sendCustomerOrderConfirmationEmail(order: CustomerOrderConfirmationEmail) {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.trim();
  const phone = process.env.VITE_CONTACT_PHONE?.trim();

  if (!user || !pass) {
    throw new Error("Customer order email is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
    auth: { user, pass },
  });

  const lineItems = order.items.map(
    (item) => `${item.name} | Qty: ${item.quantity} | Unit: ${item.unitPrice.toFixed(3)} KWD | Subtotal: ${item.subtotal.toFixed(3)} KWD`
  );
  const text = [
    `Hello ${order.customer.name},`,
    "",
    "We have received your order with Desert Blooms. Our agent will contact you soon regarding your order.",
    "",
    `Order ID: #${order.orderRef}`,
    "Status: Order received",
    `Date: ${order.timestamp}`,
    "",
    "Order details:",
    ...lineItems,
    ...(order.customer.deliveryNotes ? ["", `Delivery notes: ${order.customer.deliveryNotes}`] : []),
    "",
    `Total: ${order.totalAmount.toFixed(3)} KWD`,
    "",
    "For any order-related questions, please contact the Desert Blooms team:",
    `Email: ${user}`,
    ...(phone ? [`Telephone: ${phone}`] : []),
    "",
    "Thank you for choosing Desert Blooms Agricultural Cont. Co.!",
  ].join("\n");

  await transporter.sendMail({
    from: `"Desert Blooms Website" <${user}>`,
    to: order.customer.email,
    replyTo: user,
    subject: `We received your Desert Blooms order — #${order.orderRef}`,
    text,
  });
}
