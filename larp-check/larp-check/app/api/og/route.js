import { ImageResponse } from "next/og";

// The share card: 1200x630 image shown when a result link is posted anywhere.
export async function GET(req) {
  const p = new URL(req.url).searchParams;
  const s = Math.max(0, Math.min(100, parseInt(p.get("s") || "0", 10) || 0));
  const v = (p.get("v") || "Larp Check").slice(0, 40);
  const color = s < 35 ? "#3fd6ac" : s < 65 ? "#f2b63c" : "#ff5aa8";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#131022", color: "#f1eeff", padding: 64 }}>
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, color: "#ff5aa8" }}>LARP CHECK</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "flex-end", color }}>
            <span style={{ fontSize: 240, fontWeight: 800, lineHeight: 1 }}>{s}</span>
            <span style={{ fontSize: 64, color: "#a39dc4", marginBottom: 28, marginLeft: 12 }}>/100</span>
          </div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800 }}>{v}</div>
        </div>
        <div style={{ display: "flex", height: 22, borderRadius: 11, background: "#353058" }}>
          <div style={{ display: "flex", width: `${s}%`, borderRadius: 11, background: color }} />
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#a39dc4" }}>How hard are you larping? Check yours.</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
