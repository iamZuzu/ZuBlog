import Link from "next/link";

// Buckets tag counts into 5 discrete size levels (rather than continuous
// inline font-sizes), matching how the heatmap does its color levels
// elsewhere in this project — keeps everything theme-driven via CSS
// classes instead of one-off inline styles.
function level(count, min, max) {
  if (max === min) return 3;
  const ratio = (count - min) / (max - min);
  return 1 + Math.round(ratio * 4);
}

export default function TagCloud({ tags }) {
  if (!tags || tags.length === 0) return null;

  const counts = tags.map((t) => t.count);
  const min = Math.min(...counts);
  const max = Math.max(...counts);

  return (
    <section className="tag-cloud" aria-label="Tags">
      <p className="tag-cloud-title">Tags</p>
      <div className="tag-cloud-list">
        {tags.map((t) => (
          <Link
            key={t.slug}
            href={`/tags/${t.slug}`}
            className={`tag-cloud-item level-${level(t.count, min, max)}`}
            title={`${t.count} post${t.count === 1 ? "" : "s"} tagged "${t.tag}"`}
          >
            {t.tag}
          </Link>
        ))}
      </div>
    </section>
  );
}
