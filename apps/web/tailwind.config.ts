import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    /**
     * s24 (espace client, lot D2, revue @design) : points de rupture de l'en-tête et de la barre de
     * l'espace posés UNE fois ici. Écrans par défaut de Tailwind repris tels quels, même ordre
     * (le CSS existant ne change pas) ; ajoutés devant : `e300` (sous 300 px de large = 200 % de
     * texte à 375 : variante `max-e300:`), `e360` et `e400` (repris des marges et du logo de l'en-tête).
     * Seulement des largeurs minimales simples : les variantes `max-*` et `min-[…]` restent permises.
     */
    screens: {
      e300: "300px",
      e360: "360px",
      e400: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      // s24 lot D11b (revue @design D2) : colonne de lecture de l'espace client, largeur de l'étalon E5
      // (`.stack.solo`, `.blocs`, `.col`, `.carte` : 720 px), alignée à gauche dans le conteneur de 1280.
      maxWidth: {
        lecture: "45rem",
      },
      colors: {
        // Palette deviens-marrant — ambiance cinéma/Netflix
        background: {
          DEFAULT: "#0D0D0D",
          light: "#1A1A1A",
          card: "#1F1F1F",
          elevated: "#2A2A2A",
        },
        accent: {
          primary: "#8B5CF6",
          "primary-hover": "#A78BFA",
          secondary: "#6D28D9",
          "secondary-hover": "#7C3AED",
          // Texte violet courant (< 24 px) : AA sur fond page, carte et élevé
          link: "#A78BFA",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#B3B3B3",
          muted: "#9A9A9A",
        },
        border: {
          DEFAULT: "#2A2A2A",
          hover: "#3A3A3A",
          // s22 (revue design C1, WCAG 1.4.11) : bordure des champs de saisie, 3,33:1 sur carte #1F1F1F,
          // 3,51:1 sur fond de champ #1A1A1A, 3,92:1 sur page #0D0D0D (luminance 0,162).
          input: "#707070",
        },
        success: "#22C55E",
        error: "#EF4444",
        // s17 tour 1 (DES-1-02) : texte d'erreur AA (≈ 5,4:1 sur carte, ≈ 5,1:1 sur bg-error/10) ;
        // `error` reste pour bordures et fonds.
        "error-text": "#F87171",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "streak-pulse": "streakPulse 2s ease-in-out infinite",
        shake: "shake 0.5s ease-in-out",
        "stagger-in": "staggerIn 0.4s ease-out both",
        "xp-float": "xpFloat 2s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        streakPulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
        staggerIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        xpFloat: {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "50%": { opacity: "1", transform: "translateY(-20px) scale(1.1)" },
          "100%": { opacity: "0", transform: "translateY(-40px) scale(0.9)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
