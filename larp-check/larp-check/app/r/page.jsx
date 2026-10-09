import Link from "next/link";
import Result from "@/components/Result";

// Shared result page. The result lives in the link itself, so no database is needed.
function read(sp) {
  const score = Math.max(0, Math.min(100, parseInt(sp.s || "0", 10) || 0));
  return { score, verdict: String(sp.v || "Larp Check").slice(0, 40), roast: String(sp.r || "").slice(0, 300) };
}

export async function generateMetadata({ searchParams }) {
  const r = read(await searchParams);
  const title = `${r.score}/100: ${r.verdict}`;
  const image = `/api/og?${new URLSearchParams({ s: r.score, v: r.verdict })}`;
  return {
    title,
    description: "How hard are you larping? Check yours.",
    openGraph: { title, images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, images: [image] },
  };
}

export default async function Shared({ searchParams }) {
  const r = read(await searchParams);
  return (
    <main className="wrap">
      <header>
        <span className="brand">Larp Check</span>
        <h1>Someone got checked.</h1>
      </header>
      <Result r={r}>
        <Link className="go link" href="/">Check your own larp</Link>
      </Result>
    </main>
  );
}
