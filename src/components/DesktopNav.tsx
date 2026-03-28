"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import type { TranslationKey } from "@/lib/i18n";

const links: { href: string; labelKey: TranslationKey }[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/interactions", labelKey: "nav.interactions" },
  { href: "/compare", labelKey: "nav.compare" },
  { href: "/about", labelKey: "nav.about" },
];

export default function DesktopNav() {
  const { t } = useLanguage();

  return (
    <div className="hidden sm:flex gap-5 text-sm font-medium" role="menubar">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sub hover:text-heading transition-colors"
          role="menuitem"
        >
          {t(link.labelKey)}
        </Link>
      ))}
    </div>
  );
}
