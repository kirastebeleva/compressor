import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="card">
        <h1>Image Compressor</h1>
        <p className="muted">Browser-only MVP compression playground.</p>
        <Link href="/compress-image">Open /compress-image</Link>
      </section>
    </main>
  );
}
