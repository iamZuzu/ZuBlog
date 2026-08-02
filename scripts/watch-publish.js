#!/usr/bin/env node
/**
 * Auto-publish watcher.
 *
 * Watches content/ and public/images/ for changes. A few seconds after
 * the last change settles, it commits everything and pushes to GitHub —
 * so publishing a post becomes: move the file from Draft to Publish, and
 * wait. No typing git commands.
 *
 * Requires this folder to already be a git repository with a GitHub
 * remote configured (see GETTING-STARTED.md, "Connect to GitHub"). If
 * that hasn't been done yet, this script explains that and exits instead
 * of doing anything unexpected.
 *
 * Run directly:      node scripts/watch-publish.js
 * Run via npm:        npm run auto-publish
 * Run hidden in the background: double-click "Start Auto-Publish.vbs"
 *
 * All activity is written to auto-publish.log in the project root, since
 * this is usually running with no visible window to read output from.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const IMAGES_DIR = path.join(ROOT, "public", "images");
const LOG_FILE = path.join(ROOT, "auto-publish.log");
const PID_FILE = path.join(ROOT, "auto-publish.pid");
const DEBOUNCE_MS = 10 * 1000;

function log(message) {
  const line = `[${new Date().toLocaleString()}] ${message}`;
  console.log(line);
  try {
    fs.appendFileSync(LOG_FILE, line + "\n");
  } catch (e) {
    // If the log can't be written, don't take the whole watcher down over it.
  }
}

function git(cmd) {
  return execSync(`git ${cmd}`, {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  }).toString();
}

function hasStagedChanges() {
  try {
    execSync("git diff --cached --quiet", { cwd: ROOT });
    return false; // exit 0 => nothing staged
  } catch (e) {
    return true; // non-zero exit => there are staged changes
  }
}

let timer = null;
let publishing = false;
let queued = false;

function schedule() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(publish, DEBOUNCE_MS);
}

function publish() {
  if (publishing) {
    queued = true;
    return;
  }
  publishing = true;
  try {
    git("add -A");
    if (!hasStagedChanges()) {
      log("No changes to publish.");
      return;
    }
    const stamp = new Date().toLocaleString();
    git(`commit -m "Auto-publish: ${stamp}"`);
    log("Committed changes.");
    git("push");
    log("Pushed to GitHub. Netlify (or whichever host you connected) will rebuild the site in a minute or two.");
  } catch (err) {
    const detail = (err && (err.stderr || err.message) || String(err)).toString().trim();
    log(`Could not publish automatically: ${detail}`);
    log("Fix the issue above, then either make another change (to trigger a retry) or run 'git push' yourself from a terminal in this folder.");
  } finally {
    publishing = false;
    if (queued) {
      queued = false;
      schedule();
    }
  }
}

function fail(message) {
  log(message);
  process.exit(1);
}

if (!fs.existsSync(path.join(ROOT, ".git"))) {
  fail(
    "This folder isn't connected to git yet. Finish the 'Connect to GitHub' step in GETTING-STARTED.md, then start this again."
  );
}

try {
  const remotes = execSync("git remote", { cwd: ROOT }).toString().trim();
  if (!remotes) {
    fail(
      "No GitHub remote is configured yet. Finish the 'Connect to GitHub' step in GETTING-STARTED.md, then start this again."
    );
  }
} catch (e) {
  fail(`Could not check git configuration: ${e.message}`);
}

try {
  fs.writeFileSync(PID_FILE, String(process.pid));
} catch (e) {
  // Non-fatal — only affects the "Stop Auto-Publish" convenience script.
}

log("Auto-publish watcher started. Watching content/ and public/images/ for changes...");
log(`Activity is being logged to: ${LOG_FILE}`);

function watch(dir, label) {
  if (!fs.existsSync(dir)) return;
  fs.watch(dir, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    log(`Change detected (${label}): ${filename}`);
    schedule();
  });
}

watch(CONTENT_DIR, "content");
watch(IMAGES_DIR, "images");

function cleanup() {
  try {
    if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
  } catch (e) {}
  process.exit(0);
}
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// Keep the process alive — there's nothing else to do but wait for
// fs.watch callbacks.
process.stdin.resume();
