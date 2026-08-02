import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getTagSlugs,
  getTagBySlug,
  getPostsByTagSlug,
  formatDate,
} from "../../../lib/posts";

// Only tags actually used by a published post get a page.
export function generateStaticParams() {
  return getTagSlugs().map((tag) => ({ tag }));
}

export function generateMetadata({ params }) {
  const tag = getTagBySlug(params.tag);
  return { title: tag ? `Posts tagged "${tag.tag}"` : "Tag" };
}

export default function TagPage({ params }) {
  const tag = getTagBySlug(params.tag);
  const posts = getPostsByTagSlug(params.tag);
  if (!tag || posts.length === 0) notFound();

  return (
    <div className="narrow">
      <Link href="/" className="back-link">
        &larr; All posts
      </Link>
      <h1 className="post-title">Tagged &ldquo;{tag.tag}&rdquo;</h1>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.slug} className="post-list-item">
            {post.cover && (
              <Link href={`/posts/${post.slug}`} className="post-list-cover-link">
                <img src={post.cover} alt="" className="post-list-cover" />
              </Link>
            )}
            <div className="post-list-body">
              <h2 className="post-list-title">
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.date && <p className="post-meta">{formatDate(post.date)}</p>}
              {post.description && (
                <p className="post-description">{post.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
