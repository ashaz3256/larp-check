"use client";
import { useRef, useState } from "react";
import Result from "@/components/Result";
import { localScore } from "@/lib/score";
import { shrink } from "@/lib/image";

const EX = [
  ["Trader bro", "Self-made 7 figure trader 📈 | Funded 500k | Dubai 🇦🇪 | Teaching 10,000 students financial freedom | DM 'FREEDOM' to escape the matrix 🚀💰"],
  ["LinkedIn guru", "Serial entrepreneur. Visionary founder & CEO of 4 stealth startups. Thought leader. TEDx speaker (pending). I wake up at 4am so you don't have to. Mindset is everything."],
  ["Normal person", "22, Leeds. Work in customer support, studying part time. Play cricket badly on Sundays. Mostly here for memes."],
];

export default function Home() {
  const [text, setText] = useState(EX[0][1]);
  const [img, setImg] = useState(null);
  const [r, setR] = useState(() => localScore(EX[0][1]));
  const [note, setNote] = useState("Example result. Paste your own or add a picture.");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const camRef = useRef(null), fileRef = useRef(null);

  async function run(t = text, image = img) {
    if (!t.trim() && !image) return setNote("Paste a bio or add a picture first.");
    setBusy(true); setNote("");
    try {
      const res = await fetch("/api/check", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: t, image }) });
      const data = await res.json();
      if (!res.ok) setNote(data.error || "Something went wrong. Try again.");
      else { setR(data); setNote(data.note || ""); }
    } catch { setNote("Could not reach the server. Check your connection and try again."); }
    setBusy(false);
  }

  async function pick(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // lets the same picture be chosen again
    if (!file) return;
    try {
      setImg(await shrink(file));
      // Clear a leftover example bio so only the picture gets judged
      if (EX.some(([, t]) => t === text)) setText("");
      setNote("Picture added. Press Check my larp.");
    }
    catch (err) { setNote(err.message || "That picture could not be opened. Try a JPEG or PNG."); }
  }

  async function share() {
    const q = new URLSearchParams({ s: r.score, v: r.verdict, r: r.roast || "" });
    const url = `${location.origin}/r?${q}`;
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); }
    catch { setNote(url); }
  }

  return (
    <main className="wrap">
      <header>
        <span className="brand">Larp Check</span>
        <h1>How hard are you larping?</h1>
        <p className="sub">Paste a bio or post, or add a picture of what you are showing off. Get a score out of 100 and find out what gave you away.</p>
      </header>

      <section className="panel">
        <label htmlFor="bio">Your bio or post</label>
        <textarea id="bio" maxLength={600} placeholder="Paste it here, or just add a picture" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="row">
          <div className="chips" aria-label="Try an example">
            {EX.map(([name, t]) => (
              <button key={name} className="chip" type="button" onClick={() => { setText(t); setImg(null); run(t, null); }}>{name}</button>
            ))}
          </div>
          <span className="count">{text.length} / 600</span>
        </div>

        <div className="photo">
          {/* capture opens the camera on phones; on a computer it opens the file picker */}
          <input ref={camRef} id="cam" type="file" accept="image/*" capture="environment" hidden onChange={pick} />
          <input ref={fileRef} id="file" type="file" accept="image/*" hidden onChange={pick} />
          <button className="ghost" type="button" onClick={() => camRef.current.click()}>Take a picture</button>
          <button className="ghost" type="button" onClick={() => fileRef.current.click()}>Upload a picture</button>
          {img ? (
            <span className="thumb">
              <img src={img} alt="Your picture" />
              <button className="chip" type="button" onClick={() => setImg(null)}>Remove</button>
            </span>
          ) : null}
        </div>

        <button className="go" type="button" disabled={busy} onClick={() => run()}>{busy ? "Checking…" : "Check my larp"}</button>
        <p className="fine">Pictures are sent to the AI judge to be scored and are not saved. Only add pictures you have the right to share.</p>
      </section>

      <Result r={r}>
        <button className="ghost" type="button" onClick={share}>{copied ? "Link copied" : "Copy share link"}</button>
        {note ? <p className="note">{note}</p> : null}
      </Result>

      {/* Replace with your ad network's tag once approved */}
      <div className="ad">Ad space · 320 × 100</div>
    </main>
  );
}
