import Link from "next/link";
import Heatmap from "../components/Heatmap";
import SearchBox from "../components/SearchBox";
import { getAllPublishedPosts, getPostDateCounts, getTodayKey, formatDate } from "../lib/posts";

export default function HomePage() {
  const posts = getAllPublishedPosts();
  const counts = getPostDateCounts();
  const todayKey = getTodayKey();
  const searchIndex = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    tags: post.tags,
  }));

  return (
    <div className="home-layout">
      <div className="home-main">
        {posts.length === 0 ? (
          <div className="empty-state">
            No posts published yet. Move a markdown file from{" "}
            <code>content/Draft</code> into <code>content/Publish</code> to
            see it here.
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
      </div>
      <aside className="home-sidebar">
        <SearchBox posts={searchIndex} />
        <Heatmap counts={counts} todayKey={todayKey} />
      </aside>
    </div>
  );
}
