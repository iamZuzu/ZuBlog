import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDateKeysWithPosts,
  getPostsByDateKey,
  formatDate,
} from "../../../lib/posts";

// Only dates that actually have a published post get a page — clicking an
// empty heatmap cell has nothing to link to in the first place.
export function generateStaticParams() {
  return getDateKeysWithPosts().map((date) => ({ date }));
}

export function generateMetadata({ params }) {
  return { title: `Posts from ${formatDate(params.date)}` };
}

export default function DayPage({ params }) {
  const posts = getPostsByDateKey(params.date);
  if (posts.length === 0) notFound();

  return (
    <div className="narrow">
      <Link href="/" className="back-link">
        &larr; All posts
      </Link>
      <h1 className="post-title">{formatDate(params.date)}</h1>
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
