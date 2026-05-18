import { useEffect, useState } from "react";

/** Load Vercel Analytics + Speed Insights after idle to protect INP / first paint. */
export default function DeferredVitals() {
  const [Vitals, setVitals] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let idleId;
    let timeoutId;

    const load = () => {
      Promise.all([import("@vercel/analytics/react"), import("@vercel/speed-insights/react")]).then(
        ([analytics, speed]) => {
          if (!cancelled) {
            setVitals({
              Analytics: analytics.Analytics,
              SpeedInsights: speed.SpeedInsights,
            });
          }
        }
      );
    };

    if ("requestIdleCallback" in window) {
      idleId = requestIdleCallback(load, { timeout: 4000 });
    } else {
      timeoutId = window.setTimeout(load, 2500);
    }

    return () => {
      cancelled = true;
      if (idleId != null && "cancelIdleCallback" in window) {
        cancelIdleCallback(idleId);
      }
      if (timeoutId != null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  if (!Vitals) return null;

  const { Analytics, SpeedInsights } = Vitals;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
