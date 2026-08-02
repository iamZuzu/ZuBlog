"use client";

import { useEffect, useRef, useState } from "react";

// `items` is the nested heading tree from lib/posts.js's
// renderMarkdownWithHeadings() — [{ id, text, level, children: [...] }].
function flattenIds(items, out = []) {
  for (const item of items) {
    out.push(item.id);
    if (item.children.length) flattenIds(item.children, out);
  }
  return out;
}

function TocList({ items, activeId }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} className={item.id === activeId ? "is-active" : undefined}>
          <a href={`#${item.id}`}>{item.text}</a>
          {item.children.length > 0 && (
            <TocList items={item.children} activeId={activeId} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function TableOfContents({ items }) {
  const [activeId, setActiveId] = useState(null);
  const idsRef = useRef([]);

  useEffect(() => {
    idsRef.current = flattenIds(items);
  }, [items]);

  useEffect(() => {
    const ids = idsRef.current;
    if (!ids.length) return;

    const headingEls = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!headingEls.length) return;

    // Track which heading is currently nearest the top of the viewport
    // (just under the sticky header) so the matching TOC entry can be
    // highlighted as the reader scrolls through the post.
    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        if (visible.size > 0) {
          const firstVisible = ids.find((id) => visible.has(id));
          if (firstVisible) setActiveId(firstVisible);
        }
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 1.0 }
    );

    headingEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <nav className="toc" aria-label="Table of contents">
      <p className="toc-title">On this page</p>
      <TocList items={items} activeId={activeId} />
    </nav>
  );
}
