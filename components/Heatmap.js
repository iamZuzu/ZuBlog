"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function level(count) {
  if (!count) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

// `counts` is the full { "YYYY-MM-DD": count } map from getPostDateCounts()
// (computed server-side, since it reads the filesystem) and `todayKey` is
// today's date in the same format, also computed server-side so the
// initial render matches exactly between server and client.
export default function Heatmap({ counts, todayKey }) {
  const todayYear = Number(todayKey.slice(0, 4));
  const todayMonthIdx = Number(todayKey.slice(5, 7)) - 1;

  const [year, setYear] = useState(todayYear);
  const [monthIdx, setMonthIdx] = useState(todayMonthIdx);

  const years = useMemo(() => {
    const postYears = Object.keys(counts).map((k) => Number(k.slice(0, 4)));
    const min = Math.min(todayYear - 3, ...(postYears.length ? postYears : [todayYear]));
    const max = Math.max(todayYear, ...(postYears.length ? postYears : [todayYear]));
    const list = [];
    for (let y = max; y >= min; y--) list.push(y);
    return list;
  }, [counts, todayYear]);

  const totalPosts = useMemo(
    () => Object.values(counts).reduce((a, b) => a + b, 0),
    [counts]
  );

  const cells = useMemo(() => {
    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const firstWeekday = new Date(year, monthIdx, 1).getDay();

    const list = [];
    for (let i = 0; i < firstWeekday; i++) list.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${year}-${pad(monthIdx + 1)}-${pad(day)}`;
      list.push({ day, key, count: counts[key] || 0, isFuture: key > todayKey });
    }
    while (list.length % 7 !== 0) list.push(null);
    return list;
  }, [year, monthIdx, counts, todayKey]);

  return (
    <section className="heatmap" aria-label="Posts per day">
      <h2 className="heatmap-title">Post activity</h2>

      <div className="month-controls">
        <select
          className="theme-select"
          value={monthIdx}
          onChange={(e) => setMonthIdx(Number(e.target.value))}
          aria-label="Month"
        >
          {MONTH_NAMES.map((name, i) => (
            <option key={name} value={i}>
              {name}
            </option>
          ))}
        </select>
        <select
          className="theme-select"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          aria-label="Year"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="month-weekdays">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="month-grid">
        {cells.map((cell, i) => {
          if (!cell) return <span key={i} className="month-cell is-empty" />;

          const lvl = level(cell.count);
          const label = `${cell.key}: ${cell.count} post${cell.count === 1 ? "" : "s"}`;

          if (!cell.isFuture && cell.count > 0) {
            return (
              <Link
                key={i}
                href={`/day/${cell.key}`}
                className={`month-cell level-${lvl}`}
                title={label}
                aria-label={label}
              >
                {cell.day}
              </Link>
            );
          }

          return (
            <span
              key={i}
              className={`month-cell level-${lvl}${cell.isFuture ? " is-future" : ""}`}
              title={cell.isFuture ? undefined : label}
            >
              {cell.day}
            </span>
          );
        })}
      </div>

      {totalPosts > 0 && (
        <div className="heatmap-legend">
          <span>Less</span>
          <span className="heatmap-cell level-0" />
          <span className="heatmap-cell level-1" />
          <span className="heatmap-cell level-2" />
          <span className="heatmap-cell level-3" />
          <span className="heatmap-cell level-4" />
          <span>More</span>
        </div>
      )}
    </section>
  );
}
