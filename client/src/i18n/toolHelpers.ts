import type { Tool } from "@/types/tool";
import type { Locale } from "./types";

const CATEGORY_AR: Record<string, string> = {
  "Sprayers & Sprinklers": "رشاشات ومرشات",
  "Pruning & Cutting": "التقليم والقطع",
  "Lawn & Mowing": "العشب والجز",
  "Connectors & Fittings": "وصلات وتجهيزات",
  "Garden Tools": "أدوات الحدائق",
};

export function localizedCategory(category: string, locale: Locale): string {
  if (locale === "en") return category;
  return CATEGORY_AR[category] ?? category;
}

export function localizedToolDescription(tool: Tool, locale: Locale): string {
  if (locale === "en") return tool.description;
  return `${tool.name} — أداة موثوقة لأعمال الحدائق وتنسيق المناظر الطبيعية والزراعة في الكويت.`;
}

export const ALL_TOOLS_CATEGORY_EN = "All Tools";

export function allToolsCategoryLabel(locale: Locale): string {
  return locale === "ar" ? "جميع الأدوات" : ALL_TOOLS_CATEGORY_EN;
}
