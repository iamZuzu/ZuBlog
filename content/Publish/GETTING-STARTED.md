# Getting Started

This is a personal blog you run yourself — your posts are plain text files on your own computer, and "publishing" just means moving a file from one folder to another. No monthly fees, no third-party platform that can change its rules on you, no ads.

This guide assumes you've never used a terminal, Git, or written code before. It's long because it explains everything — you won't need all of it every time, just the first time.

A quick glossary, since a few of these words come up a lot below:

- **Terminal** — a window where you type commands instead of clicking things. On Windows, this is PowerShell or Command Prompt.
- **Repository (repo)** — a folder that Git is keeping track of the history of. This blog folder becomes one in Step 4.
- **Git** — a program that saves snapshots of your files over time and can send them to GitHub.
- **GitHub** — a website that stores a copy of your repo online, so it can hand it to Netlify.
- **Netlify** — a service that takes your files and turns them into a real website with a public address.
- **Deploy** — the process of Netlify building your site and putting it online.

---

## What you need before you start

- A Windows computer (this guide is written for Windows; the blog itself also runs on Mac/Linux).
- A free [GitHub](https://github.com) account.
- A free [Netlify](https://netlify.com) account.
- About 30–45 minutes for the one-time setup. After that, publishing a post takes seconds.

---

## Step 1: Install Node.js

This blog is built with Node.js, which you need installed once.

1. Go to **https://nodejs.org** and download the version labeled **LTS**.
2. Run the installer, clicking through with the default options.
3. Close and reopen any terminal windows you have open (this matters — it won't work in a window that was already open before installing).
4. Open PowerShell (click Start, type `powershell`, press Enter) and type:
   ```
   node -v
   npm -v
   ```
   You should see two version numbers. If instead you see "not recognized", the install didn't finish correctly — try reinstalling and restarting your computer.

### If PowerShell blocks npm with a "running scripts is disabled" error

Windows sometimes blocks npm from running the first time. Fix it once with:

```
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Type `Y` and press Enter when asked. This only allows scripts for your own user account — it doesn't turn off security for the whole computer. If you'd rather not change this setting, you can use Command Prompt (`cmd.exe`) instead of PowerShell for everything below; it doesn't have this restriction.

---

## Step 2: Get the blog running on your computer

1. Unzip this project folder somewhere easy to find, like `Documents\Blog`.
2. Open a terminal and navigate into that folder. The easiest way: open the folder in File Explorer, click the address bar, type `powershell`, and press Enter — this opens a terminal already inside the right folder.
3. Install the project's dependencies (one-time, and again any time you see a new one added to the project):
   ```
   npm install
   ```
   This downloads everything the blog needs to run. It can take a minute or two.
4. Start it:
   ```
   npm run dev
   ```
5. Open a browser and go to **http://localhost:3000**. You should see the sample blog. Leave the terminal window open while you're working — closing it stops the site. Press `Ctrl+C` in the terminal when you want to stop it.

---

## Step 3: Write your first post

Every post is a text file that lives in the `content` folder:

```
content/
  Draft/     <- write and edit here; nothing here is public
  Publish/   <- move a file here when it's ready, and it's live
```

To start a new post, run this in your terminal (with the dev server still running, open a second terminal window the same way as Step 2):

```
npm run new-draft "My First Post"
```

This creates a file in `content/Draft` that looks like this:

```markdown
---
title: "My First Post"
date: "2026-08-02"
description: ""
tags: []
---

Start writing here.
```

Open it in any text editor (Notepad works, though something like [VS Code](https://code.visualstudio.com) or [Notepad++](https://notepad-plus-plus.org) is more comfortable for this). Everything above the second `---` is metadata:

- `title` — shows as the post's heading and link text.
- `date` — controls sort order and which day it lands on in the activity calendar.
- `description` — a one-sentence summary shown on the homepage. Optional.
- `tags` — a list like `["life", "notes"]`. Optional.
- `cover` — path to an image to use as a banner (see Step 5). Optional, not included by default.

Below the second `---`, write in **Markdown** — plain text with light formatting:

```markdown
# A heading
## A smaller heading

Regular paragraph. **bold text**, _italic text_.

- a bullet point
- another one

[a link](https://example.com)

![a photo](/images/my-photo.jpg)
```

Save the file, and refresh `content/Draft` in your file browser — nothing shows on the live site yet, because it's still in `Draft`.

---

## Step 4: Publish it

Move the file from `content/Draft` to `content/Publish` (cut and paste, or drag it in File Explorer). While your dev server (`npm run dev`) is running, refresh **http://localhost:3000** — your post is now on the homepage.

That's the entire publishing model: **Draft = private, Publish = public.** To take a post down again, move it back to `Draft`.

---

## Step 5: Make it yours

- **Rename the blog:** open `lib/site.js` in a text editor and change the two lines there (`SITE_NAME`, `SITE_DESCRIPTION`).
- **About page:** open `content/about.md` and replace the name, tagline, photo path, and links with your own. `photo` is the picture on the About page; `avatar` is the small circular picture in the header (they can be the same file or different ones).
- **Add photos:** drop image files into the `public/images` folder, then reference them in a post as `![description](/images/your-file.jpg)`.
- **Themes:** visitors can pick a color theme and light/dark mode from the header — nothing to configure, it just works.
- **Browser tab icon:** replace `app/icon.svg` with your own SVG file (same name) to change the little icon shown in the browser tab.
- **Tags:** add a `tags: ["life", "notes"]` line to a post's frontmatter. They automatically show up in a tag cloud on the homepage and become clickable — nothing else to set up.

---

## Step 6: Put it on the internet

Right now the blog only exists on your computer. These steps make it a real website anyone can visit.

### 6a. Install Git

1. Download Git from **https://git-scm.com/download/win** and install it with the default options.
2. Create a GitHub account at **https://github.com** if you don't have one.

### 6b. Create a GitHub repository

1. On github.com, click the **+** icon (top right) → **New repository**.
2. Give it a name, like `my-blog`. Leave everything else as-is (don't check "Add a README").
3. Click **Create repository**. Keep this page open — it shows the URL you'll need next.

### 6c. Push your blog to GitHub

In a terminal, inside your blog folder, run these one at a time:

```
git init
git add .
git commit -m "Initial blog"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/my-blog.git
git push -u origin main
```

Replace `YOUR-USERNAME` and `my-blog` with your actual GitHub username and repository name. The first push may open a browser window asking you to sign in to GitHub — that's expected, just follow it.

### 6d. Connect Netlify

1. Go to **https://app.netlify.com** and sign up (using "Sign up with GitHub" is the fastest option).
2. Click **Add new site** → **Import an existing project** → **Deploy with GitHub**.
3. Choose the repository you just pushed.
4. Set these two fields exactly:
   - **Build command:** `npm run build`
   - **Publish directory:** `out`
5. Click **Deploy site**. After a minute or two, Netlify gives you a working address like `random-name-123.netlify.app`. You can rename this or add your own domain later under Site settings.

From now on, whenever you push a change to GitHub, Netlify automatically rebuilds the live site — usually within a minute.

---

## Step 7: Publish without typing git commands (optional)

Steps 6c onward involve typing `git add`/`commit`/`push` every time you want to publish something new. If you'd rather skip that:

1. Double-click **`Install Auto-Publish (start automatically).bat`** in the blog folder, once.
2. It starts a small background helper that watches `content/` and `public/images/`, and automatically runs the git commands for you about 10 seconds after you make a change — and sets itself to start quietly every time you log into Windows.
3. To check it's working, open **`auto-publish.log`** in the blog folder (a plain text file) after making a change.
4. To turn it off, double-click **`Uninstall Auto-Publish.bat`**.

With this running, publishing a post really is just: move the file to `Publish`, and wait about a minute.

---

## Step 8: Let visitors comment (optional)

Comments are off by default. Turning them on uses a free tool called giscus, which stores comments as GitHub Discussions on your repo — no extra account or database.

1. On your GitHub repo page: **Settings → General → scroll to Features → check "Discussions"**.
2. Go to **https://giscus.app**, enter your repo name where asked, and follow its on-page instructions (choose any Discussion category — "General" is fine).
3. Giscus shows you four values on that page (repo, repo ID, category, category ID). Open `.env.example` in your blog folder, copy it to a new file named `.env.local`, and paste those four values in next to the matching `NEXT_PUBLIC_GISCUS_...` lines.
4. For the live site, add those same four values in Netlify: **Site settings → Environment variables**, then trigger a new deploy (push any small change, or use "Trigger deploy" in Netlify).

Visitors comment using their own GitHub account. You moderate through GitHub's normal Discussions tools (delete, lock, etc.) — nothing blog-specific to manage.

---

## Step 9: Set your site's address (for search engines and share previews)

Every post already shows its publish date, has share buttons (X, Facebook, LinkedIn, and a copy-link button) underneath it, and is set up for search engines out of the box — none of that needs any setup. One thing is worth doing once you're live, though:

Once your site has a real web address (from Netlify in Step 6d, or your own domain), open `lib/site.js` and set `SITE_URL` to it, e.g. `"https://my-blog.netlify.app"` (no trailing slash, no `.env` file involved — it's a plain line in this one file). This is used for:

- the preview card shown when someone shares a post link on X, Facebook, LinkedIn, iMessage, Slack, and so on (title, description, and cover image, if the post has one)
- `sitemap.xml`, a file that helps Google and other search engines discover every post
- the "canonical" link on each page, which tells search engines where the official copy of a page lives

Nothing breaks if you skip this step — it just means share previews and the sitemap point at the placeholder `example.com` instead of your real site until you fill it in.

---

## Troubleshooting

**`npm` is not recognized as a command.** Node.js isn't installed, or you opened your terminal before installing it. Reinstall from nodejs.org, then open a brand-new terminal window.

**PowerShell says "running scripts is disabled".** See the fix in Step 1.

**The site won't load / "port already in use".** Something else is already running on port 3000. Close other terminal windows running `npm run dev`, or restart your computer.

**I moved a post to `Publish` but it's not showing on the live site.** Local changes only affect `localhost:3000`. For the real site, you need to `git add`/`commit`/`push` (Step 6c) or have auto-publish running (Step 7).

**An image isn't showing up.** Check that the file is actually inside `public/images/`, and that the path in your post starts with `/images/` (not `public/images/`).

**Auto-publish isn't doing anything.** Open `auto-publish.log` in the blog folder — it explains what happened, including if GitHub isn't connected yet (finish Step 6 first).

**I want to stop using the site / take it offline.** Delete the site in Netlify's dashboard (Site settings → General → Delete site). Your files stay safe on your computer either way.
