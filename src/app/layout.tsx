import type { Metadata } from "next";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileNav from "@/components/MobileNav";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedEquity — AI Medication Safety Companion",
  description: "Understand your medications in plain language with population-level insights and safety assessments.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){try{var t=localStorage.getItem('theme'),d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()
        `}} />
      </head>
      <body className="min-h-screen flex flex-col">
        <LanguageProvider>
          {/* Skip to main content — accessibility */}
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-coral focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg">
            Skip to main content
          </a>

          <nav className="bg-[#f7f9f6]/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-sand dark:border-dark-border sticky top-0 z-50 transition-colors duration-200" role="navigation" aria-label="Main navigation">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group" aria-label="MedEquity home">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-lilly-red to-coral rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow" aria-hidden="true">
                  <span className="text-white font-bold text-xs sm:text-sm">M</span>
                </div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-lilly-red to-coral bg-clip-text text-transparent">
                  MedEquity
                </span>
              </Link>
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Desktop nav */}
                <DesktopNav />
                <div className="flex items-center gap-1">
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>
                <MobileNav />
              </div>
            </div>
          </nav>
          <main id="main-content" className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full" tabIndex={-1}>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
