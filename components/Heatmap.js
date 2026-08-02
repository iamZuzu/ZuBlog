import Link from "next/link";
import { getPostDateCounts } from "../lib/posts";

function toKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function level(count) {
  if (!count) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function Heatmap() {
  const counts = getPostDateCounts();
  const totalPosts = Object.values(counts).reduce((a, b) => a + b, 0);
  if (totalPosts === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Roughly the last 53 weeks, aligned so each column starts on a Sunday
  // (matches the familiar GitHub-style contribution grid).
  const start = new Date(today);
  start.setDate(start.getDate() - 370);
  start.setDate(start.getDate() - start.getDay());

  const weeks = [];
  let cursor = new Date(start);
  while (cursor <= today) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  // Figure out which columns deserve a month label (first column that
  // enters a new month).
  const monthLabels = weeks.map((week, i) => {
    if (i === 0) return MONTH_LABELS[week[0].getMonth()];
    const prevMonth = weeks[i - 1][0].getMonth();
    const thisMonth = week[0].getMonth();
    return thisMonth !== prevMonth ? MONTH_LABELS[thisMonth] : "";
  });

  return (
    <section className="heatmap" aria-label="Posts per day">
      <h2 className="heatmap-title">Post activity</h2>
      <div className="heatmap-scroll">
        <div className="heatmap-months">
          {monthLabels.map((label, i) => (
            <span key={i} className="heatmap-month-label">
              {label}
            </span>
          ))}
        </div>
        <div className="heatmap-grid">
          {weeks.map((week, wi) => (
            <div className="heatmap-col" key={wi}>
              {week.map((day, di) => {
                const key = toKey(day);
                const count = counts[key] || 0;
                const isFuture = day > today;
                const label = `${key}: ${count} post${count === 1 ? "" : "s"}`;

                if (!isFuture && count > 0) {
                  return (
                    <Link
                      key={di}
                      href={`/day/${key}`}
                      className={`heatmap-cell level-${level(count)}`}
                      title={label}
                      aria-label={label}
                    />
                  );
                }

                return (
                  <span
                    key={di}
                    className={`heatmap-cell level-0${isFuture ? " is-future" : ""}`}
                    title={isFuture ? undefined : label}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        <span className="heatmap-cell level-0" />
        <span className="heatmap-cell level-1" />
        <span className="heatmap-cell level-2" />
        <span className="heatmap-cell level-3" />
        <span className="heatmap-cell level-4" />
        <span>More</span>
      </div>
    </section>
  );
}
