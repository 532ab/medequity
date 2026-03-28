"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";

interface BarcodeScannerProps {
  onScan: (drugName: string) => void;
}

export default function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const { locale } = useLanguage();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scannerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const lookupNDC = async (code: string) => {
    setLoading(true);
    setError("");
    try {
      // Try NDC lookup
      const res = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.package_ndc:"${encodeURIComponent(code)}"+openfda.product_ndc:"${encodeURIComponent(code)}"&limit=1`
      );
      if (res.ok) {
        const data = await res.json();
        const result = data.results?.[0];
        const name = result?.openfda?.brand_name?.[0] || result?.openfda?.generic_name?.[0];
        if (name) {
          stopScanning();
          onScan(name);
          return;
        }
      }

      // Try UPC lookup (strip leading zero for NDC)
      if (code.length >= 10) {
        const ndc = code.length === 12 ? code.slice(1, 11) : code;
        const formatted = `${ndc.slice(0,4)}-${ndc.slice(4,8)}-${ndc.slice(8)}`;
        const res2 = await fetch(
          `https://api.fda.gov/drug/label.json?search=openfda.package_ndc:"${encodeURIComponent(formatted)}"&limit=1`
        );
        if (res2.ok) {
          const data2 = await res2.json();
          const result2 = data2.results?.[0];
          const name2 = result2?.openfda?.brand_name?.[0] || result2?.openfda?.generic_name?.[0];
          if (name2) {
            stopScanning();
            onScan(name2);
            return;
          }
        }
      }

      setError(locale === "es" ? "No se encontró medicamento para este código" : "No medication found for this barcode");
    } catch {
      setError(locale === "es" ? "Error al buscar el código" : "Failed to look up barcode");
    }
    setLoading(false);
  };

  const startScanning = async () => {
    setError("");
    setScanning(true);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("barcode-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 100 } },
        (decodedText: string) => {
          lookupNDC(decodedText);
        },
        () => {}
      );
    } catch (err) {
      console.error("Scanner error:", err);
      setError(locale === "es" ? "No se pudo acceder a la cámara" : "Could not access camera. Make sure you allow camera permissions.");
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    setScanning(false);
    setLoading(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  if (!scanning) {
    return (
      <button
        type="button"
        onClick={startScanning}
        className="w-10 h-[46px] flex items-center justify-center rounded-2xl border border-sand dark:border-dark-border text-sub hover:text-coral hover:border-coral/40 transition-colors active:scale-95"
        aria-label={locale === "es" ? "Escanear código de barras" : "Scan barcode"}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="card animate-fade-in space-y-3" ref={containerRef}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-heading">
            {loading
              ? (locale === "es" ? "Buscando..." : "Looking up...")
              : (locale === "es" ? "Escanea el código de barras" : "Scan the barcode on your label")}
          </span>
        </div>
        <button
          onClick={stopScanning}
          className="text-xs font-medium text-sub hover:text-heading transition-colors"
        >
          {locale === "es" ? "Cancelar" : "Cancel"}
        </button>
      </div>

      <div id="barcode-reader" className="rounded-xl overflow-hidden" style={{ minHeight: "200px" }} />

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      <p className="text-[11px] text-sub text-center">
        {locale === "es"
          ? "Apunta la cámara al código de barras de tu receta o frasco"
          : "Point your camera at the barcode on your prescription or bottle"}
      </p>
    </div>
  );
}
