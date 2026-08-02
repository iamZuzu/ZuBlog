---
title: "Hello, World"
date: "2026-08-01"
description: "The first post on this blog, and how the Publish/Draft workflow works."
tags: ["firstPost"]
cover: "/images/ss.png"
---

Welcome to the blog. This post lives in `content/Publish`, which is what makes it visible here.

## How this works

Every post is a markdown file with a little bit of metadata (frontmatter) at the top:

```
---
title: "My Post Title"
date: "2026-08-02"
description: "One sentence for the homepage preview."
tags: ["life", "notes"]
---
```

### Writing the body

Below the `---` you just write normal markdown: headings, **bold**, _italics_, lists, links, code blocks, images. Any `##` or `###` heading you add here also shows up in the "On this page" list to the right, automatically.

### The Draft / Publish cycle

- Write and edit inside `content/Draft`
- When it's ready for the world, move the file into `content/Publish`
- Rebuild the site (or let your host rebuild it) and it's live

Move it back to `Draft` at any time to unpublish it.

## Adding images

Drop an image file into `public/images/`, then reference it with a normal markdown image tag:

```
![A description of the image](/images/your-file.jpg)
```

You can also add a `cover: "/images/your-file.jpg"` line to the frontmatter (like this post has) to show a banner image at the top of the post and a thumbnail on the homepage.
