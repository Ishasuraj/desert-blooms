import type { Service } from "@/data/services";
import type { Locale } from "./types";
import { SERVICES_AR } from "./services.ar";

export type LocalizedService = Service;

export function getLocalizedService(
  service: Service,
  locale: Locale,
): LocalizedService {
  if (locale === "en") return service;
  const ar = SERVICES_AR[service.slug];
  if (!ar) return service;
  return { ...service, ...ar };
}
