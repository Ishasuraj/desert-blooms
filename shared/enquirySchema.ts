import { z } from "zod";

export const ENQUIRY_SERVICES = [
  "Indoor Landscaping",
  "Outdoor Landscaping",
  "Landscape Design & Installation",
  "Irrigation Systems",
  "Landscape Maintenance",
  "Plants, Palms & Ground Covers",
  "Tools & Equipment Store",
] as const;

export type EnquiryService = (typeof ENQUIRY_SERVICES)[number];

const normalizeService = (value: unknown) => {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (!trimmed) return value;

  const matchedService = ENQUIRY_SERVICES.find(
    (service) => service.toLowerCase() === trimmed.toLowerCase(),
  );

  return matchedService ?? trimmed;
};

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
  service: z.preprocess(normalizeService, z.enum(ENQUIRY_SERVICES)),
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
