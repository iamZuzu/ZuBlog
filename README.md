# Blog

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
