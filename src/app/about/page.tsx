"use client";

import Disclaimer from "@/components/Disclaimer";
import { useLanguage } from "@/lib/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  const approaches = [
    { titleKey: "about.approach.plainLanguage" as const, descKey: "about.approach.plainLanguage.desc" as const, color: "from-coral to-tan" },
    { titleKey: "about.approach.realData" as const, descKey: "about.approach.realData.desc" as const, color: "from-lilly-red to-coral" },
    { titleKey: "about.approach.safetyFirst" as const, descKey: "about.approach.safetyFirst.desc" as const, color: "from-lilly-red to-lilly-dark" },
    { titleKey: "about.approach.empowerment" as const, descKey: "about.approach.empowerment.desc" as const, color: "from-tan to-coral" },
  ];

  const ethicsKeys = [
    "about.ethics.item1",
    "about.ethics.item2",
    "about.ethics.item3",
    "about.ethics.item4",
    "about.ethics.item5",
  ] as const;

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 badge bg-lilly-red/10 text-lilly-red dark:bg-lilly-red/20">
          {t("about.badge")}
        </div>
        <h1 className="text-4xl font-extrabold text-heading">
          {t("about.title")} <span className="bg-gradient-to-r from-lilly-red to-coral bg-clip-text text-transparent">MedEquity</span>
        </h1>
        <p className="text-sub text-lg leading-relaxed max-w-2xl">
          {t("about.subtitle")}
        </p>
      </div>

      <div className="grid gap-6">
        <div className="card">
          <h2 className="text-lg font-bold text-heading mb-2">{t("about.problem.title")}</h2>
          <p className="text-body leading-relaxed">
            {t("about.problem.body")}
          </p>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-heading mb-3">{t("about.approach.title")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {approaches.map((item) => (
              <div key={item.titleKey} className="flex gap-3">
                <div className={`w-1 rounded-full bg-gradient-to-b ${item.color} flex-shrink-0`} />
                <div>
                  <h3 className="text-sm font-semibold text-heading">{t(item.titleKey)}</h3>
                  <p className="text-sm text-body mt-0.5">{t(item.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-bold text-heading mb-2">{t("about.dataSources.title")}</h2>
            <p className="text-body text-sm leading-relaxed">
              {t("about.dataSources.body")}{" "}
              <a href="https://open.fda.gov/" target="_blank" rel="noopener noreferrer" className="text-coral hover:text-lilly-red font-medium transition-colors">
                {t("about.dataSources.linkText")}
              </a>{t("about.dataSources.suffix")}
            </p>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold text-heading mb-2">{t("about.privacy.title")}</h2>
            <p className="text-body text-sm leading-relaxed">
              {t("about.privacy.body")}
            </p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-heading mb-3">{t("about.ethics.title")}</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {ethicsKeys.map((key) => (
              <div key={key} className="flex items-start gap-2 text-sm text-body">
                <svg className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t(key)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
