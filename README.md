# Blog

[![Netlify Status](https://api.netlify.com/api/v1/badges/13553b7d-5040-4bf7-ac17-e0f511b2a1ed/deploy-status)](https://app.netlify.com/projects/zublog/deploys)

A markdown-based blog. What gets published is controlled entirely by which folder a file sits in — no CMS, no database, no admin panel.

**New to this and not a developer?** Double-click **`GETTING-STARTED.html`** to read the full walkthrough in your browser (or open `GETTING-STARTED.md` in a text editor — same content, plain text). Assumes no prior technical experience. This file is a more compact technical reference.

## How it works

```
content/
  Draft/     <- write and edit here, nothing here is public
  Publish/   <- move a file here when it's ready, and it goes live
```

Each post is a single `.md` file with frontmatter at the top:

```markdown
---
title: "My Post Title"
date: "2026-08-02"
description: "One sentence shown on the homepage."
tags: ["life", "notes"]
---

Regular markdown content goes here.
```

- `title` is used as the page title and the link text on the homepage.
- `date` controls sort order (newest first), the date shown on the post, and which day it lands on in the heatmap calendar (see below).
- `description` is optional, shown as a preview on the homepage.
- `tags` is optional, shown on the post page.
- `cover` is optional — a path to an image (e.g. `/images/my-photo.jpg`) shown as a banner on the post and a thumbnail on the homepage.
- The filename becomes the URL slug, e.g. `hello-world.md` -> `/posts/hello-world`.

The site only ever reads from `content/Publish` (see `lib/posts.js`). Files in `content/Draft` are never scanned, never given a page, and never given a URL — there's nothing to accidentally leak. To publish, move the file. To unpublish, move it back.

### Starting a new post

```
npm run new-draft "My Post Title"
```

This creates a pre-filled file in `content/Draft`.

### Adding images

Drop image files into `public/images/`, then reference them in a post's markdown body:

```
![A description of the image](/images/your-file.jpg)
```

Add `cover: "/images/your-file.jpg"` to the frontmatter to also use it as the post's banner/thumbnail image.

## Themes and dark mode

Visitors get a theme picker (Classic, Warm, Ocean, Forest) and a light/dark toggle in the header — both are remembered per-device. To add your own theme, copy one of the `[data-theme="..."]` blocks near the top of `app/globals.css`, give it a new name, and add it to the list in `lib/themes.js`.

## About page

Edit `content/about.md` to change your name, tagline, photo, and links (email, GitHub, etc. — any URL works). It uses the same frontmatter + markdown format as posts. A placeholder avatar is included at `public/images/avatar.svg` until you add a real photo.

## Post activity heatmap

The homepage sidebar shows a GitHub-style calendar heatmap (last ~4 months) of how many posts were published on each day, built from the `date` field in each post's frontmatter. Clicking a day takes you to a page listing that day's posts. Days with no posts aren't clickable — there's nothing to show.

## Table of contents

Any `##` or `###` heading in a post's body automatically shows up in an "On this page" list to the right of the post (nested to match your heading levels), with the current section highlighted as you scroll. It disappears entirely on posts with no headings, and on narrow/mobile screens. Nothing to configure — just write headings.

## Tags and the tag cloud

Whatever you put in a post's `tags:` list is collected into a weighted tag cloud in the homepage sidebar (more posts with a tag = bigger text) and each tag links to a page listing every post that uses it. Tags shown on the post page itself are also clickable, for the same result. Nothing to configure — just use `tags:` in your frontmatter.

## Comments

Off by default; turn it on by connecting [giscus](https://giscus.app), which stores visitor comments as GitHub Discussions on your repo — no separate account, database, or moderation dashboard needed.

1. On your GitHub repo: **Settings → General → Features → Discussions** → enable it.
2. Go to **giscus.app**, enter your repo, and follow its setup (pick a Discussion category — "General" or "Comments" both work fine).
3. It generates four values (`data-repo`, `data-repo-id`, `data-category`, `data-category-id`). Copy them into `.env.local` (see `.env.example`) as `NEXT_PUBLIC_GISCUS_REPO`, `NEXT_PUBLIC_GISCUS_REPO_ID`, `NEXT_PUBLIC_GISCUS_CATEGORY`, `NEXT_PUBLIC_GISCUS_CATEGORY_ID`.
4. Set the same four in Netlify's environment variables and redeploy.

Comments thread themselves per-post automatically (matched by URL path), and follow your site's light/dark toggle.

## Sharing and SEO

Every post ships with:

- **A published date**, shown on the page (`<time>` element) and embedded as machine-readable metadata (Open Graph `article:published_time` and a `BlogPosting` JSON-LD block) so search engines and link previews can read it directly, not just visitors.
- **Share buttons** (X, Facebook, LinkedIn, copy-link, and a native share button on devices that support it) rendered under every post — nothing to configure.
- **Open Graph and Twitter Card tags** per post (title, description, cover image if set), so links look right when pasted into X, Slack, iMessage, etc.
- **`sitemap.xml` and `robots.txt`**, generated automatically at build time from whatever's in `content/Publish` (`app/sitemap.js` / `app/robots.js`).
- **A canonical link** on every page, pointing at its one true URL.

All of the above depend on `SITE_URL` in `lib/site.js` being set to your real deployed address (no trailing slash) — it defaults to a placeholder (`https://example.com`) so the build always works, but update it once you have a real domain (Netlify gives you one in Step 6d of `GETTING-STARTED.md`) so previews, the sitemap, and canonical links point at the right place.

## Footer tagline

The footer shows one line from `lib/taglines.js`, rotating to the next one every 10 minutes (same line for everyone during that window, so it doesn't feel random). Edit that file to change the lines — add, remove, or reorder them; the rotation just steps through the array in order.

## Renaming the blog

Edit the two lines in `lib/site.js` (`SITE_NAME`, `SITE_DESCRIPTION`). That's the only place the name lives — it updates the header and the browser tab title.

## Browser tab icon (favicon)

`app/icon.svg` is the icon shown in the browser tab. Replace it with your own SVG (same filename) to change it — Next.js picks it up automatically, no code changes needed. Restart `npm run dev` (or rebuild) to see the change.

## Analytics (PostHog)

Analytics is off unless you configure it. To turn it on:

1. Create a free project at [posthog.com](https://posthog.com) and grab its **Project API Key** from Project Settings.
2. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_POSTHOG_KEY` (and `NEXT_PUBLIC_POSTHOG_HOST` if you're not on PostHog's US cloud).
3. For the live site, set those same two variables in Netlify: Site settings → Environment variables. Redeploy after adding them (they're baked in at build time).

Pageviews are tracked automatically, including client-side navigations between pages (About, posts, day pages), since this is a single-page app after the first load.

## Running it locally

```
npm install
npm run dev
```

Visit http://localhost:3000. The homepage lists everything in `content/Publish`; each post is at `/posts/<filename-without-.md>`.

## Publishing to the web

This is a static site (`next build` outputs plain HTML/CSS/JS into `/out`), so it can be hosted anywhere that serves static files, at no cost:

1. Push this folder to a GitHub repository.
2. Connect the repo to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) (both have a generous free tier and auto-detect Next.js).
3. Every time you push a commit — e.g. after moving a file from `Draft` to `Publish` — the host rebuilds automatically and the live site updates.

### Auto-publish (optional)

Instead of running `git add`/`commit`/`push` by hand every time you move a post to `Publish`, you can have it happen automatically:

- **Windows, no terminal:** double-click `Install Auto-Publish (start automatically).bat` once. It starts a background watcher and sets it to relaunch quietly every time you log in. Check `auto-publish.log` in this folder to see what it's done. Use `Stop Auto-Publish.bat` or `Uninstall Auto-Publish.bat` to turn it off.
- **Any OS, from a terminal:** `npm run auto-publish` (leave the terminal window open).

Either way, it watches `content/` and `public/images/`, waits about 10 seconds after the last change (so it doesn't commit mid-edit), then commits and pushes. It requires the GitHub remote to already be set up (see above) — it'll say so clearly in the log if that step isn't done yet.

Alternatively, build locally and upload the static output yourself:

```
npm run build
```

This produces a self-contained `/out` folder you can drag into any static host (Netlify drop, GitHub Pages, S3, etc.).

## Notes

- Anyone with a post's link can view it once it's published — there's no login/access control. Don't publish anything you don't want public.
- Deleting a post: delete the `.md` file (from either folder).
- Editing a live post: edit the file in `content/Publish` directly and rebuild/redeploy.
