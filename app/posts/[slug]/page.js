import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublishedPostBySlug,
  getPublishedPostSlugs,
  renderMarkdown,
  formatDate,
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
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }) {
  const post = getPublishedPostBySlug(params.slug);
  if (!post) notFound();

  const html = await renderMarkdown(post.content);

  return (
    <article className="narrow">
      <Link href="/" className="back-link">
        &larr; All posts
      </Link>
      {post.cover && (
        <img src={post.cover} alt="" className="post-cover" />
      )}
      <header className="post-header">
        <h1 className="post-title">{post.title}</h1>
        {post.date && <p className="post-meta">{formatDate(post.date)}</p>}
        {post.tags.length > 0 && (
          <div className="tags">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      <div className="post-content" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
