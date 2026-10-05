import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import type { ReactNode } from "react";
import {
  TechniqueDuJour,
  LaVanne,
  DecryptageSlide,
  LeDefi,
  type TechniqueDuJourProps,
  type LaVanneProps,
  type DecryptageSlideProps,
  type LeDefiProps,
} from "./templates/instagram-templates";
import { createElement } from "react";
import { readFile } from "fs/promises";
import { join } from "path";
import { isCloudflareWorkers } from "@/lib/runtime-env";
import type { Slide } from "./carrousel-piste-a";
import { enregistrerPolice } from "./mesure-texte";

// ───────────────────────────────────────────────────────────────────
// Image Generator — satori JSX → SVG → PNG
//
// Génère des images 1080×1080 pour Instagram à partir des templates
// JSX. Utilise satori (SVG) + resvg-js (PNG).
//
// Fonts : Inter (Regular + Bold + ExtraBold) et Plus Jakarta Sans
// (Bold + ExtraBold, police de titre du site et des cartes piste A)
// chargées depuis le
// filesystem local (public/fonts/) au premier appel, avec fallback
// CDN si les fichiers locaux sont absents. Cache mémoire après
// premier chargement.
// ───────────────────────────────────────────────────────────────────

const SIZE = 1080;

/** Font buffers (cached in memory after first load) */
let fontsLoaded: Awaited<ReturnType<typeof loadFonts>> | null = null;

/** CDN fallback URLs — one per weight (correct per-weight URLs) */
const CDN_URLS: Record<number, string> = {
  400: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKv0.woff",
  700: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50ujIw2boKoduKv0.woff",
  800: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50tjIw2boKoduKv0.woff",
};

/** Lit une police de public/fonts/ via le binding ASSETS (Workers uniquement). */
async function fetchFontFromAssets(file: string): Promise<ArrayBuffer> {
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const assets = (getCloudflareContext().env as unknown as Record<string, unknown>).ASSETS as
    | { fetch: (req: Request) => Promise<Response> }
    | undefined;
  if (!assets) throw new Error("Binding ASSETS absent");
  const res = await assets.fetch(new Request(`https://assets.local/fonts/${file}`));
  if (!res.ok) throw new Error(`ASSETS ${res.status}`);
  return res.arrayBuffer();
}

/** Polices des cartes : Inter (texte) + Plus Jakarta Sans (titres, comme le site). */
const FONT_FILES = [
  { family: "Inter", weight: 400, file: "Inter-Regular.ttf", cdn: CDN_URLS[400] },
  { family: "Inter", weight: 700, file: "Inter-Bold.ttf", cdn: CDN_URLS[700] },
  { family: "Inter", weight: 800, file: "Inter-ExtraBold.ttf", cdn: CDN_URLS[800] },
  {
    family: "Plus Jakarta Sans",
    weight: 700,
    file: "PlusJakartaSans-Bold.ttf",
    cdn: "https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_TknNSg.ttf",
  },
  {
    family: "Plus Jakarta Sans",
    weight: 800,
    file: "PlusJakartaSans-ExtraBold.ttf",
    cdn: "https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_KUnNSg.ttf",
  },
] as const;

type FontWeight = 400 | 700 | 800;

async function loadFonts() {
  const fonts = await Promise.all(
    FONT_FILES.map(async ({ family, weight, file, cdn }) => {
      const name = `${family} ${weight}`;
      const font = (data: ArrayBuffer) => {
        // Même police pour la mise en lignes mesurée (mise-en-lignes.ts).
        enregistrerPolice(family, weight, data);
        return { name: family, data, weight: weight as FontWeight, style: "normal" as const };
      };

      // 1. TTF local (WOFF2 non supporté par satori)
      try {
        const fontPath = join(process.cwd(), "public", "fonts", file);
        const buffer = await readFile(fontPath);
        return font(
          buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer,
        );
      } catch {
        // TTF local absent, on passe à la suite
      }

      // 1b. Cloudflare Workers : pas de filesystem → même TTF lu dans les
      // assets statiques du Worker (binding ASSETS, public/fonts/).
      if (isCloudflareWorkers()) {
        try {
          const data = await fetchFontFromAssets(file);
          console.log(`[image-gen] ${name} chargée depuis ASSETS`);
          return font(data);
        } catch (err) {
          console.warn(`[image-gen] ${name} absente des ASSETS:`, err);
        }
      }

      // 2. Repli CDN (WOFF Inter / TTF Plus Jakarta Sans, formats lus par satori)
      try {
        console.warn(`[image-gen] ${name} introuvable localement, repli CDN...`);
        const res = await fetch(cdn);
        if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`);
        return font(await res.arrayBuffer());
      } catch (err) {
        console.warn(`[image-gen] Impossible de charger ${name}:`, err);
        return null;
      }
    }),
  );

  return fonts.filter(Boolean) as NonNullable<(typeof fonts)[number]>[];
}

async function getFonts() {
  if (!fontsLoaded) {
    fontsLoaded = await loadFonts();
  }
  return fontsLoaded;
}

/**
 * Rend un élément JSX en buffer PNG (1080×1080 par défaut).
 */
async function renderToPng(
  element: ReactNode,
  width: number = SIZE,
  height: number = SIZE,
): Promise<Buffer> {
  const fonts = await getFonts();

  // Cloudflare Workers : resvg-js (binaire natif) est indisponible sous
  // workerd → rendu via `next/og` (satori + resvg en WebAssembly, pris en
  // charge par OpenNext). Même JSX, mêmes polices, mêmes dimensions.
  // Sur Replit, le chemin satori + resvg-js ci-dessous est inchangé.
  if (isCloudflareWorkers()) {
    const { ImageResponse } = await import("next/og");
    const response = new ImageResponse(element as React.ReactElement, {
      width,
      height,
      fonts,
    });
    return Buffer.from(await response.arrayBuffer());
  }

  const svg = await satori(element as React.ReactElement, {
    width,
    height,
    fonts,
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
  });

  const pngData = resvg.render();
  return Buffer.from(pngData.asPng());
}

// ─── Public API ──────────────────────────────────────────────────

/**
 * Génère une image "Technique du Jour".
 */
export async function generateTechniqueDuJour(
  props: TechniqueDuJourProps,
): Promise<Buffer> {
  return renderToPng(createElement(TechniqueDuJour, props));
}

/**
 * Génère une image "La Vanne".
 */
export async function generateLaVanne(props: LaVanneProps): Promise<Buffer> {
  return renderToPng(createElement(LaVanne, props));
}

/**
 * Génère une slide de "Décryptage" (carousel).
 * Appeler une fois par slide, retourne un Buffer PNG par slide.
 */
export async function generateDecryptageSlide(
  props: DecryptageSlideProps,
): Promise<Buffer> {
  return renderToPng(createElement(DecryptageSlide, props));
}

/**
 * Génère toutes les slides d'un carousel Décryptage.
 * @param slides Array de { title, content } pour chaque slide
 * @returns Array de Buffer PNG
 */
export async function generateDecryptageCarousel(
  slides: Array<{ title: string; content: string }>,
): Promise<Buffer[]> {
  const total = slides.length;
  const buffers: Buffer[] = [];

  for (let i = 0; i < slides.length; i++) {
    const isFirst = i === 0;
    const isLast = i === slides.length - 1;
    const buf = await generateDecryptageSlide({
      slideNumber: i + 1,
      totalSlides: total,
      title: slides[i].title,
      content: slides[i].content,
      isFirstSlide: isFirst,
      isLastSlide: isLast,
    });
    buffers.push(buf);
  }

  return buffers;
}

/**
 * Génère une image "Le Défi".
 */
export async function generateLeDefi(props: LeDefiProps): Promise<Buffer> {
  return renderToPng(createElement(LeDefi, props));
}

/**
 * Génère une image générique depuis un élément JSX custom.
 */
export async function generateCustomImage(
  element: ReactNode,
): Promise<Buffer> {
  return renderToPng(element);
}

/**
 * Rend les slides d'un carrousel « piste A » (4:5, 16:9, LinkedIn),
 * une image PNG par slide, dans l'ordre.
 */
export async function renderSlides(slides: Slide[]): Promise<Buffer[]> {
  const buffers: Buffer[] = [];
  for (const s of slides) {
    buffers.push(await renderToPng(s.element, s.width, s.height));
  }
  return buffers;
}

export { SIZE };
