"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
    useReportWebVitals((metric) => {
        // Log to console in development, send to analytics in production
        if (process.env.NODE_ENV === "development") {
            console.log(`[Web Vital] ${metric.name}: ${metric.value.toFixed(1)}ms (${metric.rating})`);
            return;
        }

        // In production, send to your analytics endpoint
        // Example: navigator.sendBeacon("/api/vitals", JSON.stringify(metric));
    });

    return null;
}
