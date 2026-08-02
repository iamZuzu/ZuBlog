import Link from "next/link";
import Heatmap from "../components/Heatmap";
import { getAllPublishedPosts, formatDate } from "../lib/posts";

export default function HomePage() {
  const posts = getAllPublishedPosts();

  return (
    <>
      <Heatmap />

      {posts.length === 0 ? (
        <div className="empty-state">
          No posts published yet. Move a markdown file from{" "}
          <code>content/Draft</code> into <code>content/Publish</code> to see
          it here.
        </div>
      ) : (
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
                {post.date && (
                  <p className="post-meta">{formatDate(post.date)}</p>
                )}
                {post.description && (
                  <p className="post-description">{post.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
