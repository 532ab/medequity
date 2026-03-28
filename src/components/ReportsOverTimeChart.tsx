"use client";

import { ReportsByYear } from "@/lib/openFda";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/lib/LanguageContext";

export default function ReportsOverTimeChart({ data }: { data: ReportsByYear[] }) {
  const { t } = useLanguage();

  if (data.length === 0) {
    return (
      <div className="card animate-slide-up">
        <h3 className="text-lg font-bold text-heading mb-2">{t("chart.reportsOverTime")}</h3>
        <p className="text-sm text-sub">{t("noData.reportsOverTime")}</p>
      </div>
    );
  }

  const tooltipLabel = t("chart.reportsOverTime.tooltipLabel");

  return (
    <div className="card animate-slide-up">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-heading">{t("chart.reportsOverTime")}</h3>
        <p className="text-xs text-sub mt-0.5">{t("chart.reportsOverTime.subtitle")}</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d97757" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#d97757" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="[&>line]:stroke-sand dark:[&>line]:stroke-dark-border" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} className="[&_.recharts-text]:fill-muted dark:[&_.recharts-text]:fill-dark-muted" axisLine={false} />
            <YAxis tick={{ fontSize: 12 }} className="[&_.recharts-text]:fill-muted dark:[&_.recharts-text]:fill-dark-muted" axisLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
            <Tooltip
              contentStyle={{ backgroundColor: "var(--tooltip-bg, #fff)", border: "1px solid var(--tooltip-border, #e8e6dc)", borderRadius: "12px", fontSize: "13px", color: "var(--tooltip-text, #141413)" }}
              labelStyle={{ fontWeight: 600 }}
              formatter={(value) => [Number(value).toLocaleString(), tooltipLabel]}
            />
            <Area type="monotone" dataKey="count" stroke="#d97757" strokeWidth={2} fill="url(#colorReports)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
