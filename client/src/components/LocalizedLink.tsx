import type { ReactNode, CSSProperties, MouseEventHandler } from "react";
import { Link } from "wouter";
import { useLocale } from "@/contexts/LocaleContext";

type LocalizedLinkProps = {
  href: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  replace?: boolean;
  state?: unknown;
  [key: string]: unknown;
};

/** Prefixes internal paths with `/ar` when the active locale is Arabic. */
export function LocalizedLink({ href, ...rest }: LocalizedLinkProps) {
  const { localePath } = useLocale();

  const resolved =
    href.startsWith("http") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:") ||
    href.startsWith("#")
      ? href
      : href.includes("#")
        ? (() => {
            const [path, hash] = href.split("#");
            const base = path || "/";
            return `${localePath(base === "" ? "/" : base)}#${hash}`;
          })()
        : localePath(href);

  return <Link href={resolved} {...(rest as Record<string, unknown>)} />;
}
