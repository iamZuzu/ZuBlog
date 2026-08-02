#!/usr/bin/env node
// Creates a new markdown file in content/Draft with frontmatter pre-filled.
// Usage: npm run new-draft "My Post Title"
const fs = require("fs");
const path = require("path");

const title = process.argv.slice(2).join(" ") || "Untitled Post";
const slug =
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "untitled-post";

const date = new Date().toISOString().slice(0, 10);
const draftDir = path.join(process.cwd(), "content", "Draft");
const filePath = path.join(draftDir, `${slug}.md`);

if (!fs.existsSync(draftDir)) fs.mkdirSync(draftDir, { recursive: true });

if (fs.existsSync(filePath)) {
  console.error(`A draft already exists at content/Draft/${slug}.md`);
  process.exit(1);
}

const contents = `---
title: "${title}"
date: "${date}"
description: ""
tags: []
---

Start writing here.
`;

fs.writeFileSync(filePath, contents);
console.log(`Created content/Draft/${slug}.md`);
