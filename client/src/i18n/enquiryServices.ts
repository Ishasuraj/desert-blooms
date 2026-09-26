import type { EnquiryService } from "@shared/enquirySchema";
import { ENQUIRY_SERVICES } from "@shared/enquirySchema";

/** Maps service page slugs to canonical enquiry API values. */
export const SLUG_TO_ENQUIRY_SERVICE: Record<string, EnquiryService> = {
  "indoor-landscaping": "Indoor Landscaping",
  "outdoor-landscaping": "Outdoor Landscaping",
  "landscape-design-installation": "Landscape Design & Installation",
  "irrigation-systems": "Irrigation Systems",
  "landscape-maintenance": "Landscape Maintenance",
  "plants-palms-ground-covers": "Plants, Palms & Ground Covers",
};

export function enquiryServiceFromSlug(slug: string): EnquiryService | undefined {
  return SLUG_TO_ENQUIRY_SERVICE[slug];
}

export function isEnquiryService(value: string): value is EnquiryService {
  return (ENQUIRY_SERVICES as readonly string[]).includes(value);
}
