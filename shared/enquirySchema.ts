import { z } from "zod";

export const ENQUIRY_SERVICES = [
  "Garden landscaping",
  "Irrigation systems",
  "Agricultural services",
  "Lawn maintenance",
  "Plant supply & online store",
] as const;

export type EnquiryService = (typeof ENQUIRY_SERVICES)[number];

export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(254, "Email must be 254 characters or fewer"),
  service: z.enum(ENQUIRY_SERVICES),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more about your project")
    .max(5000, "Message must be 5000 characters or fewer"),
  _gotcha: z
    .string()
    .max(0, "Invalid submission")
    .optional()
    .or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
