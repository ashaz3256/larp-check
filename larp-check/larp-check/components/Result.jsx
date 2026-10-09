import { tone } from "@/lib/score";

export default function Result({ r, children }) {
  const list = (items, empty) => (items?.length ? items : [empty]).map((x, i) => <li key={i}>{x}</li>);
  return (
    <section className="panel result" data-tone={tone(r.score)} aria-live="polite">
      <div className="dial">
        <svg viewBox="0 0 320 185" role="img" aria-label={`Larp meter: ${r.score} out of 100`}>
          <path className="track" d="M30 160 A130 130 0 0 1 290 160" fill="none" strokeWidth="18" strokeLinecap="round" />
          <path className="fill" d="M30 160 A130 130 0 0 1 290 160" fill="none" strokeWidth="18" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - r.score} />
          <line className="needle" x1="160" y1="160" x2="160" y2="52" strokeWidth="4" strokeLinecap="round" style={{ transform: `rotate(${-90 + r.score * 1.8}deg)` }} />
          <circle className="hub" cx="160" cy="160" r="8" />
          <text className="tick" x="22" y="182">REAL</text>
          <text className="tick" x="262" y="182">LARP</text>
        </svg>
        <div className="score">{r.score}<small>/100</small></div>
      </div>
      <p className="verdict">{r.verdict}</p>
      {r.roast ? <p className="roast">{r.roast}</p> : null}
      {r.tells || r.legit ? (
        <div className="cols">
          <div><h2>What gave you away</h2><ul>{list(r.tells, "Nothing. Annoyingly honest.")}</ul></div>
          <div><h2>What we believe</h2><ul>{list(r.legit, "Not a lot, to be fair.")}</ul></div>
        </div>
      ) : null}
      {children}
    </section>
  );
}
