import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Quiz : Quel type d'humour es-tu ? — deviens-marrant.fr";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const profiles = [
  { emoji: "🔍", label: "Observateur", color: "#22C55E" },
  { emoji: "📖", label: "Storyteller", color: "#8B5CF6" },
  { emoji: "🌀", label: "Absurde", color: "#EC4899" },
  { emoji: "💥", label: "Punchlineur", color: "#EF4444" },
  { emoji: "😏", label: "Taquin", color: "#F59E0B" },
];

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #0D0D0D 0%, #1a1a2e 50%, #16213e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        {/* Badge */}
        <div
          style={{
            background: "rgba(139, 92, 246, 0.25)",
            border: "1px solid rgba(139, 92, 246, 0.5)",
            borderRadius: 8,
            padding: "6px 18px",
            fontSize: 18,
            color: "#c4b5fd",
            marginBottom: 24,
          }}
        >
          QUIZ GRATUIT — 2 MINUTES
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#f0f0f0",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: 32,
          }}
        >
          Quel type d&apos;humour es-tu ?
        </div>

        {/* Profiles row */}
        <div
          style={{
            display: "flex",
            gap: 24,
            marginBottom: 40,
          }}
        >
          {profiles.map((p) => (
            <div
              key={p.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 40,
                  background: `${p.color}20`,
                  borderRadius: 16,
                  width: 72,
                  height: 72,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `2px solid ${p.color}60`,
                }}
              >
                {p.emoji}
              </div>
              <div style={{ fontSize: 14, color: p.color, fontWeight: 600 }}>
                {p.label}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              background: "linear-gradient(90deg, #8B5CF6, #EC4899)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            deviens-marrant.fr
          </div>
          <div style={{ fontSize: 16, color: "#a0a0b0" }}>
            /quiz-humour
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
