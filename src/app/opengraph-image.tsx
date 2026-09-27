import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0F1012",
          padding: 72,
          color: "#E6E6E1",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#C5A880",
            }}
          />
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#8A8A85" }}>
            CREATIVE ENGINEERING — BENGALURU, IN
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 148,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -4,
            }}
          >
            {site.name.toUpperCase()}
          </div>
          <div style={{ fontSize: 40, color: "#8A8A85", marginTop: 18 }}>
            {site.role}
          </div>
          <div style={{ fontSize: 28, color: "#C5A880", marginTop: 12 }}>
            {site.tagline}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#8A8A85" }}>
          {site.email} · {site.seo.url.replace("https://", "")}
        </div>
      </div>
    ),
    size
  );
}
