import Link from "next/link";
import { notFound } from "next/navigation";
import TableOfContents from "../../../components/TableOfContents";
import Comments from "../../../components/Comments";
import ShareButtons from "../../../components/ShareButtons";
import { getAboutContent } from "../../../lib/about";
import { SITE_URL } from "../../../lib/site";
import {
  getPublishedPostBySlug,
  getPublishedPostSlugs,
  renderMarkdownWithHeadings,
  formatDate,
  tagSlug,
} from "../../../lib/posts";

// Only slugs of posts currently in content/Publish get built as pages.
// Anything still in content/Draft has no page at all, so there is no
// link for it to leak through.
export function generateStaticParams() {
  return getPublishedPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const post = getPublishedPostBySlug(params.slug);
  if (!post) return {};

  const url = `${SITE_URL}/posts/${post.slug}`;
  const images = post.cover ? [{ url: post.cover }] : undefined;

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags.length ? post.tags : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date || undefined,
      tags: post.tags.length ? post.tags : undefined,
      images,
    },
    twitter: {
      card: post.cover ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function PostPage({ params }) {
  const post = getPublishedPostBySlug(params.slug);
  if (!post) notFound();

  const { html, headings } = await renderMarkdownWithHeadings(post.content);
  const about = await getAboutContent();
  const url = `${SITE_URL}/posts/${post.slug}`;

  // Structured data so search engines can show the published date, author,
  // and headline directly in results. Purely additive — invisible on the
  // page itself.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || undefined,
    datePublished: post.date || undefined,
    dateModified: post.date || undefined,
    image: post.cover ? `${SITE_URL}${post.cover}` : undefined,
    author: { "@type": "Person", name: about.name },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <div className="post-layout">
      <article className="post-main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Link href="/" className="back-link">
          &larr; All posts
        </Link>
        {post.cover && (
          <img src={post.cover} alt="" className="post-cover" />
        )}
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          {post.date && (
            <p className="post-meta">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="tags">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/tags/${tagSlug(tag)}`} className="tag">
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>
        <div className="post-content" dangerouslySetInnerHTML={{ __html: html }} />
        <ShareButtons url={url} title={post.title} />
        <Comments />
      </article>

      {headings.length > 0 && (
        <aside className="post-toc-sidebar">
          <TableOfContents items={headings} />
        </aside>
      )}
    </div>
  );
}
