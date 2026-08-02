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
    photo: data.photo || null,
    links: Array.isArray(data.links) ? data.links : [],
    html,
  };
}
