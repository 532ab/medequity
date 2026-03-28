"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-themed py-5 sm:py-6 transition-colors duration-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 flex items-center justify-between text-xs text-sub">
        <span>&copy; {new Date().getFullYear()} {t("footer.copyright")}</span>
        <span>{t("footer.poweredBy")}</span>
      </div>
    </footer>
  );
}
