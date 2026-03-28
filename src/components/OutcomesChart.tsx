"use client";

import { OutcomeData } from "@/lib/openFda";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useLanguage } from "@/lib/LanguageContext";

const COLORS: Record<string, string> = {
  "Recovered": "#4ade80",
  "Recovering": "#86efac",
  "Not Recovered": "#E21836",
  "Resolved with Effects": "#d97757",
  "Fatal": "#991b1b",
  "Unknown": "#b0aea5",
};

const DEFAULT_COLOR = "#D4A27F";

export default function OutcomesChart({ data }: { data: OutcomeData[] }) {
  const { t } = useLanguage();

  if (data.length === 0) {
    return (
      <div className="card animate-slide-up">
        <h3 className="text-lg font-bold text-heading mb-2">{t("chart.patientOutcomes")}</h3>
        <p className="text-sm text-sub">{t("noData.patientOutcomes")}</p>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="card animate-slide-up">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-heading">{t("chart.patientOutcomes")}</h3>
        <p className="text-xs text-sub mt-0.5">{t("chart.patientOutcomes.subtitle")}</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="outcome"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.outcome} fill={COLORS[entry.outcome] || DEFAULT_COLOR} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "var(--tooltip-bg, #fff)", border: "1px solid var(--tooltip-border, #e8e6dc)", borderRadius: "12px", fontSize: "13px", color: "var(--tooltip-text, #141413)" }}
              formatter={(value, name) => [`${Number(value).toLocaleString()} (${((Number(value) / total) * 100).toFixed(1)}%)`, name]}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className="text-heading text-xs">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
