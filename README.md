# Blog

A markdown-based blog. What gets published is controlled entirely by which folder a file sits in — no CMS, no database, no admin panel.

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
- `date` controls sort order (newest first) and the date shown on the post.
- `description` is optional, shown as a preview on the homepage.
- `tags` is optional, shown on the post page.
- The filename becomes the URL slug, e.g. `hello-world.md` -> `/posts/hello-world`.

The site only ever reads from `content/Publish` (see `lib/posts.js`). Files in `content/Draft` are never scanned, never given a page, and never given a URL — there's nothing to accidentally leak. To publish, move the file. To unpublish, move it back.

### Starting a new post

```
npm run new-draft "My Post Title"
```

This creates a pre-filled file in `content/Draft`.

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

Alternatively, build locally and upload the static output yourself:

```
npm run build
```

This produces a self-contained `/out` folder you can drag into any static host (Netlify drop, GitHub Pages, S3, etc.).

## Notes

- Anyone with a post's link can view it once it's published — there's no login/access control. Don't publish anything you don't want public.
- Deleting a post: delete the `.md` file (from either folder).
- Editing a live post: edit the file in `content/Publish` directly and rebuild/redeploy.
