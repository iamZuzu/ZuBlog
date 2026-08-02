import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

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

// --- tag helpers, used by the tag cloud and /tags/[tag] pages ---

export function tagSlug(tag) {
  return String(tag)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

// [{ tag, slug, count }], sorted alphabetically (size/weight for the cloud
// comes from `count`). Preserves the casing the tag was first written in.
export function getTagCounts() {
  const bySlug = new Map();

  for (const post of getAllPublishedPosts()) {
    for (const tag of post.tags) {
      const slug = tagSlug(tag);
      if (!slug) continue;
      const existing = bySlug.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        bySlug.set(slug, { tag: String(tag).trim(), slug, count: 1 });
      }
    }
  }

  return Array.from(bySlug.values()).sort((a, b) => a.tag.localeCompare(b.tag));
}

export function getTagSlugs() {
  return getTagCounts().map((t) => t.slug);
}

export function getTagBySlug(slug) {
  return getTagCounts().find((t) => t.slug === slug) || null;
}

export function getPostsByTagSlug(slug) {
  return getAllPublishedPosts().filter((post) =>
    post.tags.some((tag) => tagSlug(tag) === slug)
  );
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

// --- markdown rendering, with heading ids + a table-of-contents tree ---
//
// Headings get an `id` (via rehype-slug) so the table of contents can link
// straight to them. Both the id and the TOC entry come from the exact same
// parsed tree, so they can never end up out of sync with each other.

function textContent(node) {
  if (node.type === "text") return node.value;
  if (node.children) return node.children.map(textContent).join("");
  return "";
}

function collectHeadings(tree, headings) {
  if (!tree) return;
  if (tree.type === "element" && /^h[2-4]$/.test(tree.tagName || "")) {
    const id = tree.properties && tree.properties.id;
    if (id) {
      headings.push({
        level: Number(tree.tagName[1]),
        id,
        text: textContent(tree).trim(),
      });
    }
  }
  if (tree.children) {
    for (const child of tree.children) collectHeadings(child, headings);
  }
}

// Turns a flat, ordered list of { level, id, text } into a nested tree, so
// h3s end up as children of the h2 they follow, etc.
function buildHeadingTree(flatHeadings) {
  const root = [];
  const stack = [{ level: 1, children: root }];

  for (const heading of flatHeadings) {
    while (stack.length > 1 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }
    const node = { ...heading, children: [] };
    stack[stack.length - 1].children.push(node);
    stack.push({ level: heading.level, children: node.children });
  }

  return root;
}

export async function renderMarkdownWithHeadings(markdown) {
  const flatHeadings = [];

  const collectHeadingsPlugin = () => (tree) => {
    collectHeadings(tree, flatHeadings);
  };

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(collectHeadingsPlugin)
    .use(rehypeStringify)
    .process(markdown);

  return { html: file.toString(), headings: buildHeadingTree(flatHeadings) };
}

export async function renderMarkdown(markdown) {
  const { html } = await renderMarkdownWithHeadings(markdown);
  return html;
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
