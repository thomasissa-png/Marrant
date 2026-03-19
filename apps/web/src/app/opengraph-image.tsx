import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "deviens-marrant.fr — Apprends à être drôle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0D0D0D 0%, #1a1a2e 50%, #16213e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            background: "linear-gradient(90deg, #8B5CF6, #EC4899)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: 24,
          }}
        >
          deviens-marrant.fr
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#a0a0b0",
            maxWidth: 800,
            textAlign: "center",
          }}
        >
          Blagues, conseils et parcours pour devenir plus drôle au quotidien
        </div>
      </div>
    ),
    { ...size }
  );
}
