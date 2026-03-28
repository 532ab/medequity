"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

interface FindNearbyProps {
  drugName: string;
  isOTC: boolean;
}

export default function FindNearby({ drugName, isOTC }: FindNearbyProps) {
  const { locale } = useLanguage();
  const [loading, setLoading] = useState(false);

  const findPharmacies = () => {
    setLoading(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const query = encodeURIComponent(`${drugName} pharmacy`);
          window.open(
            `https://www.google.com/maps/search/${query}/@${latitude},${longitude},14z`,
            "_blank"
          );
          setLoading(false);
        },
        () => {
          // Fallback without location
          const query = encodeURIComponent(`${drugName} pharmacy near me`);
          window.open(`https://www.google.com/maps/search/${query}`, "_blank");
          setLoading(false);
        },
        { timeout: 5000 }
      );
    } else {
      const query = encodeURIComponent(`${drugName} pharmacy near me`);
      window.open(`https://www.google.com/maps/search/${query}`, "_blank");
      setLoading(false);
    }
  };

  return (
    <div className="card animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-heading">
              {locale === "es" ? `Encuentra ${drugName} cerca de ti` : `Find ${drugName} near you`}
            </p>
            <p className="text-xs text-sub mt-0.5">
              {isOTC
                ? (locale === "es"
                    ? "Disponible sin receta en farmacias y tiendas cercanas"
                    : "Available over the counter at nearby pharmacies and stores")
                : (locale === "es"
                    ? "Lleva tu receta a una farmacia cercana"
                    : "Bring your prescription to a nearby pharmacy")}
            </p>
          </div>
        </div>

        <button
          onClick={findPharmacies}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-all active:scale-95 shadow-sm shrink-0"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          )}
          {locale === "es" ? "Buscar farmacias" : "Find pharmacies"}
        </button>
      </div>
    </div>
  );
}
