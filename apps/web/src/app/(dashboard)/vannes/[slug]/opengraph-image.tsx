import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { parseShortIdFromSlug } from "@/lib/catalogue-slug";

export const runtime = "nodejs";
export const alt = "Vanne — deviens-marrant.fr";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: { slug: string } }) {
  const shortId = parseShortIdFromSlug(params.slug);
  let content = "Une vanne à ressortir ce soir";
  let punchline = "";
  let category = "";
  if (shortId) {
    try {
      const joke = await prisma.joke.findFirst({
        where: { id: { startsWith: shortId }, isActive: true },
        select: { content: true, punchline: true, category: true },
      });
      if (joke) {
        content = joke.content.length > 130 ? joke.content.slice(0, 127) + "..." : joke.content;
        punchline = joke.punchline.length > 90 ? joke.punchline.slice(0, 87) + "..." : joke.punchline;
        category = joke.category;
      }
    } catch {
      // fallback plein-texte
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0D0D0D 0%, #1a1a2e 50%, #16213e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {category && (
            <div
              style={{
                background: "rgba(139, 92, 246, 0.25)",
                border: "1px solid rgba(139, 92, 246, 0.5)",
                borderRadius: 8,
                padding: "6px 18px",
                fontSize: 20,
                color: "#c4b5fd",
                alignSelf: "flex-start",
                marginBottom: 24,
              }}
            >
              Vanne · {category.replace(/_/g, " ").toLowerCase()}
            </div>
          )}
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#f0f0f0",
              lineHeight: 1.25,
              maxWidth: 1000,
            }}
          >
            {content}
          </div>
          {punchline && (
            <div
              style={{
                marginTop: 24,
                fontSize: 32,
                fontWeight: 800,
                color: "#c4b5fd",
                lineHeight: 1.25,
                maxWidth: 1000,
              }}
            >
              — {punchline}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              background: "linear-gradient(90deg, #8B5CF6, #EC4899)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            deviens-marrant.fr
          </div>
          <div style={{ fontSize: 20, color: "#a0a0b0" }}>300+ vannes à ressortir</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
