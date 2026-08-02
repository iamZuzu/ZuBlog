---
title: "How I Built This Blog (and Why It's Just a Folder)"
date: "2026-08-03"
description: "No CMS, no database, no dashboard — just markdown files and two folders. Here's how it works and how you can run it yourself."
tags: ["meta", "showcase", "webdev"]
---

Here's a radical idea for a blogging platform: what if writing a blog post felt like writing a text file, and publishing it felt like... moving a text file?

That's the entire premise of this blog. No login screen. No "New Post" button buried three menus deep. No database quietly accumulating cruft in the background. Just two folders — `Draft` and `Publish` — and one rule: if a file's in `Publish`, it's live. If it's in `Draft`, it doesn't exist to the outside world. That's the whole publishing model, and it's the first thing I wanted to get right, because the fastest way to kill the urge to write is to put friction between you and the page.

## The itch that started it

I didn't want another platform with a login, a subscription tier, or an editor that fights me over formatting. I wanted to open a text file, write in plain markdown, and have it show up on a real website — nothing more standing between the thought and the page. So I built exactly that: a statically-generated blog where the entire "backend" is a folder on my own computer.

## Writing is the only step that matters

A new post starts as a single command that drops a pre-filled template into `Draft`:

```
npm run new-draft "My Post Title"
```

That's a markdown file with a little frontmatter up top (title, date, a one-line description, optional tags) and blank space below it for the actual writing. Everything below the frontmatter is just markdown — headings, bold, links, images, code blocks — the same stuff you'd use anywhere else. Write it, save it, and it still doesn't exist publicly. It's just a file on disk until I decide otherwise.

When it's ready: drag it from `Draft` into `Publish`. Rebuild (or let the host rebuild it automatically), and it's live. Change my mind? Drag it back. There's no "unpublish" button because there's nothing to click — the folder *is* the state.

## What happens after you hit publish

Once a post is public, the app quietly does a lot of the boring parts for you:

- **It shows up everywhere it should** — the homepage feed, a tag page for each of its tags, and a day on an activity heatmap showing when you've been writing.
- **It gets a table of contents** automatically generated from your `##` and `###` headings, pinned to the side of the post and highlighting your spot as you scroll.
- **It's dressed for sharing** — proper Open Graph and Twitter Card previews, a canonical link, and structured data so search engines can read the published date directly, not just guess at it.
- **It has share buttons and comments** baked in — X, Facebook, LinkedIn, copy-link, and (if you want them) visitor comments powered by GitHub Discussions, so there's no separate comments database to manage either.
- **It's themeable** — four color themes plus light/dark mode, remembered per visitor, with zero configuration required.

None of that required touching a CMS settings panel, because there isn't one. It's all just... how the app behaves when you put a file in a folder.

## The part I'm most stubborn about: no lock-in

Everything here is a static site — plain HTML, CSS, and JS generated at build time from markdown files that live on my own computer, in my own GitHub repo. There's no vendor holding my content hostage, no database export to wrangle if I ever want to leave. If I stopped paying for hosting tomorrow, I'd still have every post, in plain text, in a folder. That's not a small thing. It's the whole point.

## Try it yourself

If any of this sounds like what you actually want from a blog — write in a text editor, publish by moving a file, own every byte of it — the whole thing is open on GitHub:

**[github.com/iamZuzu/ZuBlog](https://github.com/iamZuzu/ZuBlog)**

Clone it, follow the setup guide in the repo (it assumes zero prior experience with git or the command line), and you'll have your own version running locally in under an hour — themes, comments, SEO, and all. Fork it, break it, make it yours. If you get it running, I'd genuinely like to hear about it — drop a comment below.
