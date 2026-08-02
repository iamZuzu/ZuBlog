import "./globals.css";

export const metadata = {
  title: "My Blog",
  description: "Thoughts, notes, and posts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="site">
          <header className="site-header">
            <a href="/" className="site-title">
              My Blog
            </a>
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
