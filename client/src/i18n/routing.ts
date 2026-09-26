import type { Locale } from "./types";
import { DEFAULT_LOCALE } from "./types";

export function parseLocaleFromPath(pathname: string): Locale {
  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    return "ar";
  }
  return "en";
}

/** Path without `/ar` prefix (always starts with `/`). */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/ar") return "/";
  if (pathname.startsWith("/ar/")) {
    return pathname.slice(3) || "/";
  }
  return pathname;
}

export function withLocalePath(locale: Locale, logicalPath: string): string {
  const normalized = logicalPath.startsWith("/") ? logicalPath : `/${logicalPath}`;
  if (locale === DEFAULT_LOCALE) {
    return normalized === "/" ? "/" : normalized;
  }
  if (normalized === "/") return "/ar";
  return `/ar${normalized}`;
}

export function switchLocalePath(
  pathname: string,
  target: Locale,
  search = "",
  hash = "",
): string {
  const logical = stripLocalePrefix(pathname);
  return `${withLocalePath(target, logical)}${search}${hash}`;
}

export function isHomePath(pathname: string): boolean {
  const logical = stripLocalePrefix(pathname);
  return logical === "/";
}

export function isToolsPath(pathname: string): boolean {
  return stripLocalePrefix(pathname) === "/tools";
}

export function isServicePath(pathname: string): boolean {
  return stripLocalePrefix(pathname).startsWith("/services/");
}
