import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1 className="post-title">Not found</h1>
      <p>This post doesn&apos;t exist or hasn&apos;t been published yet.</p>
      <Link href="/" className="back-link">
        &larr; Back home
      </Link>
    </div>
  );
}
