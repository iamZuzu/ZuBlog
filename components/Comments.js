"use client";

import { useEffect, useRef } from "react";

// Visitor comments via giscus (https://giscus.app), which stores comments
// as GitHub Discussions on your repo — no database or backend of our own
// needed, so this still works on a fully static export. Renders nothing
// if it isn't configured (see .env.example / GETTING-STARTED.md).
export default function Comments() {
  const containerRef = useRef(null);

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;
  const configured = Boolean(repo && repoId && category && categoryId);

  useEffect(() => {
    if (!configured || !containerRef.current) return;

    const initialTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", initialTheme);
    script.setAttribute("data-lang", "en");

    containerRef.current.appendChild(script);

    // Keep giscus's own theme in sync if the visitor flips the site's
    // light/dark toggle after comments have already loaded — giscus
    // supports this via postMessage rather than reloading the widget.
    function syncTheme() {
      const iframe = document.querySelector("iframe.giscus-frame");
      if (!iframe || !iframe.contentWindow) return;
      const mode = document.documentElement.classList.contains("dark") ? "dark" : "light";
      iframe.contentWindow.postMessage(
        { giscus: { setConfig: { theme: mode } } },
        "https://giscus.app"
      );
    }

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured]);

  if (!configured) return null;

  return (
    <div className="comments">
      <p className="comments-title">Comments</p>
      <div ref={containerRef} />
    </div>
  );
}
