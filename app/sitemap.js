import { getAllPublishedPosts, getTagCounts, getDateKeysWithPosts } from "../lib/posts";
import { SITE_URL } from "../lib/site";

// Generates a static sitemap.xml at build time (works fine with
// `output: "export"` since everything here comes from the filesystem, not
// a live request). Update SITE_URL in lib/site.js after deploying so the
// URLs in it are correct.
export default function sitemap() {
  const posts = getAllPublishedPosts();
  const tags = getTagCounts();
  const days = getDateKeysWithPosts();
  const now = new Date();

  const entries = [
    { url: `${SITE_URL}/`, lastModified: now },
    { url: `${SITE_URL}/about`, lastModified: now },
  ];

  for (const post of posts) {
    entries.push({
      url: `${SITE_URL}/posts/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : now,
    });
  }

  for (const tag of tags) {
    entries.push({ url: `${SITE_URL}/tags/${tag.slug}`, lastModified: now });
  }

  for (const day of days) {
    entries.push({ url: `${SITE_URL}/day/${day}`, lastModified: new Date(day) });
  }

  return entries;
}
