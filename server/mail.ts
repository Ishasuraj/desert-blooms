import type { EnquiryInput } from "../shared/enquirySchema.js";
import nodemailer from "nodemailer";

type EnquiryPayload = Omit<EnquiryInput, "_gotcha">;

function getMailConfig() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.trim();
  const to = process.env.ENQUIRY_TO_EMAIL?.trim() || user;

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
