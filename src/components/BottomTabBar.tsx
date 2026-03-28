"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import type { TranslationKey } from "@/lib/i18n";

const tabs: { href: string; labelKey: TranslationKey; icon: string; iconFilled: string }[] = [
  {
    href: "/",
    labelKey: "nav.home",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    iconFilled: "M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a3 3 0 003 3h2a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a3 3 0 003-3v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z",
  },
  {
    href: "/interactions",
    labelKey: "nav.interactions",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    iconFilled: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    href: "/compare",
    labelKey: "nav.compare",
    icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
    iconFilled: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
  },
  {
    href: "/about",
    labelKey: "nav.about",
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    iconFilled: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

export default function BottomTabBar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#f7f9f6]/90 dark:bg-dark-card/90 backdrop-blur-xl border-t border-sand dark:border-dark-border pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 h-14">
        {tabs.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-xl transition-all duration-200 active:scale-90 ${
                active ? "text-coral" : "text-muted dark:text-dark-muted"
              }`}
            >
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${active ? "scale-110" : ""}`}
                fill={active ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={active ? 0 : 1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={active ? tab.iconFilled : tab.icon} />
              </svg>
              <span className={`text-[10px] font-medium ${active ? "font-semibold" : ""}`}>
                {t(tab.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
