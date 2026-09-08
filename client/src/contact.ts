const phoneDisplay =
  import.meta.env.VITE_CONTACT_PHONE?.trim() || "+965 50410443";
const phoneTel =
  import.meta.env.VITE_CONTACT_PHONE_TEL?.trim() || "+96550410443";
const whatsappNumber =
  import.meta.env.VITE_CONTACT_WHATSAPP?.trim() || "96598855871";
const email =
  import.meta.env.VITE_CONTACT_EMAIL?.trim() || "desertbloooms@gmail.com";

export const contact = {
  phoneDisplay,
  phoneTel,
  whatsappNumber,
  whatsappUrl: `https://wa.me/${whatsappNumber}`,
  address:
    "Al Sharq, Ahmed Al Jabar St., Bldg Al Thimar International Holding Co., - Block 2 - Floor 15, Kuwait",
  email,
} as const;
