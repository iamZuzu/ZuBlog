"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";

// `posts` is a small array of { slug, title, description, tags } — passed
// down from the homepage (a server component that already has the full
// list from content/Publish). Filtering happens entirely in the browser;
// there's no server to query.
export default function SearchBox({ posts }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return posts
      .filter((post) => {
        const haystack = [post.title, post.description, ...(post.tags || [])]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 6);
  }, [query, posts]);

  const showResults = query.trim().length > 0;

  function selectSearchResult(post, position) {
    posthog.capture("search_result_selected", {
      result_position: position,
      result_count: results.length,
      has_tags: post.tags.length > 0,
    });
    setQuery("");
  }

  return (
    <div className="search-box">
      <input
        type="search"
        className="search-input"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search posts"
      />
      {showResults && (
        <div className="search-results">
          {results.length === 0 ? (
            <p className="search-empty">No matches.</p>
          ) : (
            <ul>
              {results.map((post, index) => (
                <li key={post.slug}>
                  <Link
                    href={`/posts/${post.slug}`}
                    onClick={() => selectSearchResult(post, index + 1)}
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
