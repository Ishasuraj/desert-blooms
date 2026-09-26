import type { EnquiryService } from "@shared/enquirySchema";
import { ENQUIRY_SERVICES } from "@shared/enquirySchema";

const ENQUIRY_I18N_KEY: Record<EnquiryService, string> = {
  "Indoor Landscaping": "enquiry.indoorLandscaping",
  "Outdoor Landscaping": "enquiry.outdoorLandscaping",
  "Landscape Design & Installation": "enquiry.landscapeDesign",
  "Irrigation Systems": "enquiry.irrigation",
  "Landscape Maintenance": "enquiry.maintenance",
  "Plants, Palms & Ground Covers": "enquiry.plantsPalms",
  "Tools & Equipment Store": "enquiry.toolsStore",
};

export function enquiryDisplayLabel(
  service: EnquiryService,
  t: (key: string) => string,
): string {
  return t(ENQUIRY_I18N_KEY[service]);
}

export { ENQUIRY_SERVICES };
