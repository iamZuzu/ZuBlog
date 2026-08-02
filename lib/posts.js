import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLISH_DIR = path.join(CONTENT_DIR, "Publish");

function slugify(filename) {
  return filename.replace(/\.md$/, "");
}

function readMarkdownFile(dir, filename) {
  const fullPath = path.join(dir, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const slug = data.slug || slugify(filename);

  return {
    slug,
    title: data.title || slug,
    date: data.date || null,
    description: data.description || "",
    tags: data.tags || [],
    cover: data.cover || null,
    content,
  };
}

// Only ever reads from content/Publish. Files in content/Draft are
// intentionally never touched here, so drafts can never leak into the
// built site or get a public URL.
export function getAllPublishedPosts() {
  if (!fs.existsSync(PUBLISH_DIR)) return [];

  const files = fs.readdirSync(PUBLISH_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((filename) => readMarkdownFile(PUBLISH_DIR, filename));

  // newest first; posts without a date sort to the bottom
  return posts.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });
}

export function getPublishedPostSlugs() {
  return getAllPublishedPosts().map((post) => post.slug);
}

export function getPublishedPostBySlug(slug) {
  const post = getAllPublishedPosts().find((p) => p.slug === slug);
  return post || null;
}

// --- date helpers, used by the heatmap calendar on the homepage ---

function dateKey(dateInput) {
  const raw = String(dateInput).trim();

  // If the frontmatter already gives us a plain YYYY-MM-DD (the common
  // case), use it as-is. Parsing it through Date/timezone conversion can
  // shift it to the previous or next day depending on the server's
  // timezone, which would put a post in the wrong heatmap cell.
  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return isoMatch[0];

  const d = new Date(raw);
  if (isNaN(d)) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// { "2026-08-01": 2, "2026-08-02": 1, ... }
export function getPostDateCounts() {
  const counts = {};
  for (const post of getAllPublishedPosts()) {
    if (!post.date) continue;
    const key = dateKey(post.date);
    if (!key) continue;
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

export function getDateKeysWithPosts() {
  return Object.keys(getPostDateCounts());
}

export function getPostsByDateKey(key) {
  return getAllPublishedPosts().filter((post) => post.date && dateKey(post.date) === key);
}

// "Today" as of build time, in the same YYYY-MM-DD format as everything
// else here. Passed down to the client-side calendar so its default month
// matches the server-rendered markup exactly (no hydration mismatch).
export function getTodayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function renderMarkdown(markdown) {
  const result = await remark().use(remarkGfm).use(remarkHtml).process(markdown);
  return result.toString();
}

export function formatDate(dateString) {
  if (!dateString) return "";

  const isoMatch = String(dateString).match(/^(\d{4})-(\d{2})-(\d{2})/);
  const d = isoMatch
    ? new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]))
    : new Date(dateString);

  if (isNaN(d)) return dateString;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
