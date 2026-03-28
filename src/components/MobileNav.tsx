"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import type { TranslationKey } from "@/lib/i18n";

const links: { href: string; labelKey: TranslationKey }[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/interactions", labelKey: "nav.interactions" },
  { href: "/compare", labelKey: "nav.compare" },
  { href: "/about", labelKey: "nav.about" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-sub hover:text-heading hover:bg-sand/60 dark:hover:bg-dark-border transition-colors"
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 top-[53px] z-40">
          <div className="absolute inset-0 bg-charcoal/20 dark:bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-[#f7f9f6] dark:bg-dark-card border-b border-sand dark:border-dark-border shadow-lg animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-coral/10 text-coral"
                      : "text-heading hover:bg-sand/60 dark:hover:bg-dark-border"
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
