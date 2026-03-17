import { ImageResponse } from "next/og";
import { blogArticles, getArticleBySlug } from "@/lib/blog-articles";

export const runtime = "edge";
export const alt = "Article blog — deviens-marrant.fr";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export default function OgImage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  const title = article?.title ?? "Article introuvable";
  const category = article?.category ?? "";

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
                fontSize: 18,
                color: "#c4b5fd",
                alignSelf: "flex-start",
                marginBottom: 24,
              }}
            >
              {category}
            </div>
          )}
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#f0f0f0",
              lineHeight: 1.2,
              maxWidth: 900,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
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
          <div style={{ fontSize: 20, color: "#a0a0b0" }}>
            Blog humour & répartie
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
