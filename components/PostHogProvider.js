"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Loads and initializes PostHog only if a project key is configured, and
// sends a pageview on first load plus on every client-side route change
// (App Router navigations don't trigger a normal page load, so PostHog's
// own automatic pageview capture won't see them).
export default function PostHogProvider({ children }) {
  const pathname = usePathname();
  const posthogRef = useRef(null);
  const lastPath = useRef(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    let cancelled = false;

    import("posthog-js").then(({ default: posthog }) => {
      if (cancelled) return;
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        capture_pageview: false,
        person_profiles: "identified_only",
      });
      posthogRef.current = posthog;
      lastPath.current = pathname;
      posthog.capture("$pageview");
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!posthogRef.current || lastPath.current === pathname) return;
    lastPath.current = pathname;
    posthogRef.current.capture("$pageview");
  }, [pathname]);

  return children;
}
