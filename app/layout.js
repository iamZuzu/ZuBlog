import "./globals.css";
import Link from "next/link";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { DEFAULT_THEME } from "../lib/themes";

export const metadata = {
  title: "My Blog",
  description: "Thoughts, notes, and posts.",
};

// Applies the visitor's saved theme/mode before the page paints, so there's
// no flash of the default theme on load. Runs as a plain inline script
// because it has to execute before React hydrates.
const noFlashScript = `
(function () {
  try {
    var theme = localStorage.getItem("blog-theme") || "${DEFAULT_THEME}";
    var storedMode = localStorage.getItem("blog-mode");
    var mode = storedMode || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    if (mode === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>
        <div className="site">
          <header className="site-header">
            <div className="site-header-row">
              <Link href="/" className="site-title">
                My Blog
              </Link>
              <ThemeSwitcher />
            </div>
            <nav className="site-nav">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="site-footer">
            <span>Published with a folder called Publish.</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
