import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { renderMarkdown } from "./posts";

const ABOUT_PATH = path.join(process.cwd(), "content", "about.md");

export async function getAboutContent() {
  if (!fs.existsSync(ABOUT_PATH)) {
    return {
      name: "About",
      tagline: "",
      photo: null,
      avatar: null,
      links: [],
      html: "<p>Create <code>content/about.md</code> to fill in this page.</p>",
    };
  }

  const raw = fs.readFileSync(ABOUT_PATH, "utf8");
  const { data, content } = matter(raw);
  const html = await renderMarkdown(content);

  return {
    name: data.name || "About",
    tagline: data.tagline || "",
    // `photo` shows on the About page itself. `avatar` is the small DP used
    // in the site header — falls back to `photo` if not set separately, so
    // existing about.md files without an `avatar` field keep working.
    photo: data.photo || null,
    avatar: data.avatar || data.photo || null,
    links: Array.isArray(data.links) ? data.links : [],
    html,
  };
}
