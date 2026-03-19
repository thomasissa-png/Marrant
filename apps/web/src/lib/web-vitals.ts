"use client";

import { useEffect } from "react";

/**
 * Core Web Vitals reporter — logs CWV metrics to console and optionally to an endpoint.
 * Uses the web-vitals library pattern with native PerformanceObserver fallback.
 */
export function useReportWebVitals() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // LCP (Largest Contentful Paint)
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          const value = lastEntry.startTime;
          reportMetric("LCP", value);
        }
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {}

    // FID (First Input Delay)
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        for (const entry of entries) {
          const fidEntry = entry as PerformanceEventTiming;
          if (fidEntry.processingStart) {
            const value = fidEntry.processingStart - fidEntry.startTime;
            reportMetric("FID", value);
          }
        }
      });
      fidObserver.observe({ type: "first-input", buffered: true });
    } catch {}

    // CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const layoutShift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
          if (!layoutShift.hadRecentInput && layoutShift.value) {
            clsValue += layoutShift.value;
          }
        }
        reportMetric("CLS", clsValue);
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });
    } catch {}

    // TTFB (Time to First Byte)
    try {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        const nav = navEntries[0] as PerformanceNavigationTiming;
        reportMetric("TTFB", nav.responseStart - nav.requestStart);
      }
    } catch {}
  }, []);
}

function reportMetric(name: string, value: number) {
  const rounded = Math.round(name === "CLS" ? value * 1000 : value);
  const rating = getRating(name, value);

  if (process.env.NODE_ENV === "development") {
    console.log(`[CWV] ${name}: ${rounded}${name === "CLS" ? "" : "ms"} (${rating})`);
  }

  // Send to analytics endpoint if configured
  if (typeof navigator.sendBeacon === "function" && process.env.NEXT_PUBLIC_CWV_ENDPOINT) {
    navigator.sendBeacon(
      process.env.NEXT_PUBLIC_CWV_ENDPOINT,
      JSON.stringify({ name, value: rounded, rating, page: window.location.pathname }),
    );
  }
}

function getRating(name: string, value: number): "good" | "needs-improvement" | "poor" {
  switch (name) {
    case "LCP":
      return value <= 2500 ? "good" : value <= 4000 ? "needs-improvement" : "poor";
    case "FID":
      return value <= 100 ? "good" : value <= 300 ? "needs-improvement" : "poor";
    case "CLS":
      return value <= 0.1 ? "good" : value <= 0.25 ? "needs-improvement" : "poor";
    case "TTFB":
      return value <= 800 ? "good" : value <= 1800 ? "needs-improvement" : "poor";
    default:
      return "good";
  }
}
