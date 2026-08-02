"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PostHogProvider({ children }) {
  const pathname = usePathname();
  const posthogRef = useRef(null);
  const lastPath = useRef(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!key || !host) {
      if (process.env.NODE_ENV !== "production") {
        const missing = !key
          ? "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN"
          : "NEXT_PUBLIC_POSTHOG_HOST";
        throw new Error(
          `${missing} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missing} is configured`
        );
      }
      return;
    }

    let cancelled = false;

    import("posthog-js").then(({ default: posthog }) => {
      if (cancelled) return;
      posthog.init(key, {
        api_host: host,
        capture_pageview: false,
        capture_exceptions: true,
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
