import { SITE_URL } from "../lib/site";

// Generates a static robots.txt at build time, pointing crawlers at the
// sitemap. Allows everything — there's nothing private on this site once
// it's built (Draft posts never get a page in the first place).
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
