import type { ReactNode } from "react";

// ───────────────────────────────────────────────────────────────────
// Templates Instagram — Charte visuelle deviens-marrant.fr
//
// 4 templates reconnaissables en < 1 seconde dans un feed :
//   1. Technique du Jour — technique stand-up actionnable
//   2. La Vanne — punchline en italique 1.5x
//   3. Décryptage — structure étapes (carousel)
//   4. Le Défi — call-to-action central
//
// Format : 1080×1080 (carré Instagram standard)
// Fond : noir #0D0D0D | Accent : violet #8B5CF6 | Texte : blanc #FFFFFF
// ───────────────────────────────────────────────────────────────────

/** Couleurs de la charte */
const COLORS = {
  bg: "#0D0D0D",
  bgCard: "#1F1F1F",
  accent: "#8B5CF6",
  accentHover: "#A78BFA",
  accentSecondary: "#6D28D9",
  textPrimary: "#FFFFFF",
  textSecondary: "#B3B3B3",
  textMuted: "#9A9A9A",
} as const;

const BRAND = "deviens-marrant.fr";

// ─── Shared layout wrapper ───────────────────────────────────────

interface SlideWrapperProps {
  children: ReactNode;
  badge?: string;
  showBrand?: boolean;
}

export function SlideWrapper({
  children,
  badge,
  showBrand = true,
}: SlideWrapperProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 1080,
        height: 1080,
        backgroundColor: COLORS.bg,
        padding: 72,
        fontFamily: "Inter, sans-serif",
        position: "relative",
      }}
    >
      {/* Top bar — badge + brand */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 40,
        }}
      >
        {badge ? (
          <div
            style={{
              display: "flex",
              backgroundColor: COLORS.accent,
              color: COLORS.textPrimary,
              fontSize: 24,
              fontWeight: 700,
              padding: "10px 24px",
              borderRadius: 8,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {badge}
          </div>
        ) : (
          <div style={{ display: "flex" }} />
        )}
        {showBrand && (
          <div
            style={{
              display: "flex",
              color: COLORS.textMuted,
              fontSize: 22,
            }}
          >
            {BRAND}
          </div>
        )}
      </div>

      {/* Content area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
        }}
      >
        {children}
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          display: "flex",
          width: "100%",
          height: 4,
          background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentSecondary})`,
          borderRadius: 2,
          marginTop: 40,
        }}
      />
    </div>
  );
}

// ─── Template 1 : Technique du Jour ─────────────────────────────

export interface TechniqueDuJourProps {
  technique: string; // Nom de la technique (ex: "Le callback")
  description: string; // Explication courte
  example?: string; // Exemple concret
  humorist?: string; // Humoriste de référence
}

export function TechniqueDuJour({
  technique,
  description,
  example,
  humorist,
}: TechniqueDuJourProps) {
  return (
    <SlideWrapper badge="Technique du jour">
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Titre technique */}
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 800,
            color: COLORS.textPrimary,
            lineHeight: 1.1,
          }}
        >
          {technique}
        </div>

        {/* Description */}
        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: COLORS.textSecondary,
            lineHeight: 1.4,
          }}
        >
          {description}
        </div>

        {/* Exemple */}
        {example && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              backgroundColor: COLORS.bgCard,
              borderRadius: 16,
              padding: "28px 32px",
              borderLeft: `4px solid ${COLORS.accent}`,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 20,
                color: COLORS.accent,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Exemple
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 30,
                color: COLORS.textPrimary,
                fontStyle: "italic",
                lineHeight: 1.4,
              }}
            >
              &ldquo;{example}&rdquo;
            </div>
          </div>
        )}

        {/* Humoriste ref */}
        {humorist && (
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: COLORS.textMuted,
            }}
          >
            Signature : {humorist}
          </div>
        )}
      </div>
    </SlideWrapper>
  );
}

// ─── Template 2 : La Vanne ───────────────────────────────────────

export interface LaVanneProps {
  setup: string;
  punchline: string;
  category?: string; // ex: "Observation", "Absurde"
}

export function LaVanne({ setup, punchline, category }: LaVanneProps) {
  return (
    <SlideWrapper badge="La Vanne">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 48,
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Category tag */}
        {category && (
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: COLORS.accentHover,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {category}
          </div>
        )}

        {/* Setup */}
        <div
          style={{
            display: "flex",
            fontSize: 40,
            color: COLORS.textSecondary,
            lineHeight: 1.4,
            maxWidth: 860,
          }}
        >
          {setup}
        </div>

        {/* Separator */}
        <div
          style={{
            display: "flex",
            width: 80,
            height: 3,
            backgroundColor: COLORS.accent,
            borderRadius: 2,
          }}
        />

        {/* Punchline — 1.5x size, italic */}
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 700,
            fontStyle: "italic",
            color: COLORS.textPrimary,
            lineHeight: 1.2,
            maxWidth: 860,
          }}
        >
          {punchline}
        </div>
      </div>
    </SlideWrapper>
  );
}

// ─── Template 3 : Décryptage (slide de carousel) ────────────────

export interface DecryptageSlideProps {
  slideNumber: number;
  totalSlides: number;
  title: string;
  content: string;
  isFirstSlide?: boolean; // Slide titre
  isLastSlide?: boolean; // Slide CTA
}

export function DecryptageSlide({
  slideNumber,
  totalSlides,
  title,
  content,
  isFirstSlide,
  isLastSlide,
}: DecryptageSlideProps) {
  if (isFirstSlide) {
    return (
      <SlideWrapper badge="Décryptage">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 800,
              color: COLORS.textPrimary,
              lineHeight: 1.15,
              maxWidth: 860,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: COLORS.textSecondary,
              lineHeight: 1.4,
              maxWidth: 780,
            }}
          >
            {content}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: COLORS.textMuted,
              marginTop: 16,
            }}
          >
            Swipe pour les {totalSlides - 1} étapes →
          </div>
        </div>
      </SlideWrapper>
    );
  }

  if (isLastSlide) {
    return (
      <SlideWrapper badge="Récap">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 48,
              fontWeight: 800,
              color: COLORS.textPrimary,
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: COLORS.textSecondary,
              lineHeight: 1.4,
              maxWidth: 780,
            }}
          >
            {content}
          </div>
          <div
            style={{
              display: "flex",
              backgroundColor: COLORS.accent,
              color: COLORS.textPrimary,
              fontSize: 26,
              fontWeight: 700,
              padding: "16px 40px",
              borderRadius: 12,
              marginTop: 16,
            }}
          >
            50+ techniques → {BRAND}
          </div>
        </div>
      </SlideWrapper>
    );
  }

  // Slide de contenu standard
  return (
    <SlideWrapper>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {/* Step number + total */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: COLORS.accent,
              color: COLORS.textPrimary,
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            {slideNumber}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: COLORS.textMuted,
            }}
          >
            / {totalSlides}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 48,
            fontWeight: 800,
            color: COLORS.textPrimary,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>

        {/* Content */}
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: COLORS.textSecondary,
            lineHeight: 1.5,
          }}
        >
          {content}
        </div>
      </div>
    </SlideWrapper>
  );
}

// ─── Template 4 : Le Défi ────────────────────────────────────────

export interface LeDefiProps {
  challenge: string; // Le défi à relever
  context: string; // Contexte / situation
  persona: "YANIS" | "SOPHIE" | "MARC";
}

const PERSONA_LABELS: Record<string, string> = {
  YANIS: "Pour toi, en soirée",
  SOPHIE: "Pour toi, au bureau",
  MARC: "Pour toi, au quotidien",
};

export function LeDefi({ challenge, context, persona }: LeDefiProps) {
  return (
    <SlideWrapper badge="Le Défi">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 40,
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Persona tag */}
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: COLORS.accentHover,
            fontWeight: 600,
          }}
        >
          {PERSONA_LABELS[persona] || "Pour toi"}
        </div>

        {/* Challenge */}
        <div
          style={{
            display: "flex",
            fontSize: 52,
            fontWeight: 800,
            color: COLORS.textPrimary,
            lineHeight: 1.2,
            maxWidth: 860,
          }}
        >
          {challenge}
        </div>

        {/* Context */}
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: COLORS.textSecondary,
            lineHeight: 1.4,
            maxWidth: 780,
          }}
        >
          {context}
        </div>

        {/* CTA button */}
        <div
          style={{
            display: "flex",
            backgroundColor: COLORS.accent,
            color: COLORS.textPrimary,
            fontSize: 26,
            fontWeight: 700,
            padding: "16px 40px",
            borderRadius: 12,
            marginTop: 8,
          }}
        >
          Relève le défi → {BRAND}
        </div>
      </div>
    </SlideWrapper>
  );
}

export { COLORS, BRAND };
