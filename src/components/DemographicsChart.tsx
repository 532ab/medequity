"use client";

import { SexData, AgeData } from "@/lib/openFda";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/lib/LanguageContext";

const SEX_COLORS: Record<string, string> = {
  Male: "#6a9bcc",
  Female: "#d97757",
  Unknown: "#b0aea5",
};

export default function DemographicsChart({ sexData, ageData }: { sexData: SexData[]; ageData: AgeData[] }) {
  const { t } = useLanguage();

  if (sexData.length === 0 && ageData.length === 0) {
    return (
      <div className="card animate-slide-up">
        <h3 className="text-lg font-bold text-heading mb-2">{t("chart.demographics")}</h3>
        <p className="text-sm text-sub">{t("noData.demographics")}</p>
      </div>
    );
  }

  const sexTotal = sexData.reduce((s, d) => s + d.count, 0);
  const ageTotal = ageData.reduce((s, d) => s + d.count, 0);

  return (
    <div className="card animate-slide-up space-y-6">
      <div>
        <h3 className="text-lg font-bold text-heading">{t("chart.demographics")}</h3>
        <p className="text-xs text-sub mt-0.5">{t("chart.demographics.subtitle")}</p>
      </div>

      {sexData.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-body mb-3">{t("chart.bySex")}</h4>
          <div className="flex gap-3 items-end h-20">
            {sexData.map((d) => {
              const pct = (d.count / sexTotal) * 100;
              return (
                <div key={d.sex} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-body">{pct.toFixed(0)}%</span>
                  <div className="w-full rounded-t-lg transition-all duration-500" style={{
                    height: `${Math.max(pct * 0.6, 8)}px`,
                    backgroundColor: SEX_COLORS[d.sex] || "#b0aea5",
                  }} />
                  <span className="text-xs text-sub">{d.sex}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {ageData.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-body mb-3">{t("chart.byAgeGroup")}</h4>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="[&>line]:stroke-sand dark:[&>line]:stroke-dark-border" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  className="[&_.recharts-text]:fill-muted dark:[&_.recharts-text]:fill-dark-muted"
                  axisLine={false}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                />
                <YAxis dataKey="group" type="category" tick={{ fontSize: 12 }} width={80} className="[&_.recharts-text]:fill-muted dark:[&_.recharts-text]:fill-dark-muted" axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--tooltip-bg, #fff)", border: "1px solid var(--tooltip-border, #e8e6dc)", borderRadius: "12px", fontSize: "13px", color: "var(--tooltip-text, #141413)" }}
                  formatter={(value) => [`${Number(value).toLocaleString()} (${((Number(value) / ageTotal) * 100).toFixed(1)}%)`, t("chart.reportsOverTime.tooltipLabel")]}
                />
                <Bar dataKey="count" fill="#D4A27F" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
