import "./globals.css";
import Link from "next/link";
import ThemeSwitcher from "../components/ThemeSwitcher";
import PostHogProvider from "../components/PostHogProvider";
import { DEFAULT_THEME } from "../lib/themes";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "../lib/site";
import { getAllPublishedPosts } from "../lib/posts";
import { getAboutContent } from "../lib/about";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary",
  },
  robots: {
    index: true,
    follow: true,
  },
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

export default async function RootLayout({ children }) {
  const postCount = getAllPublishedPosts().length;
  const about = await getAboutContent();
  const avatar = about.avatar || "/images/avatar.svg";

  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>
        <PostHogProvider>
          <div className="site">
            <header className="site-header">
              <div className="profile-row">
                <img src={avatar} alt={SITE_NAME} className="profile-avatar" />
                <div className="profile-info">
                  <div className="profile-top">
                    <Link href="/" className="site-title">
                      {SITE_NAME}
                    </Link>
                    <ThemeSwitcher />
                  </div>
                  <p className="profile-stat">
                    <strong>{postCount}</strong> post{postCount === 1 ? "" : "s"}
                  </p>
                  {about.tagline && (
                    <p className="profile-tagline">{about.tagline}</p>
                  )}
                </div>
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
        </PostHogProvider>
      </body>
    </html>
  );
}
