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

export async function renderMarkdown(markdown) {
  const result = await remark().use(remarkGfm).use(remarkHtml).process(markdown);
  return result.toString();
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
