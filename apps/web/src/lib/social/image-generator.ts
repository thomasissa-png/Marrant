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

// ───────────────────────────────────────────────────────────────────
// Image Generator — satori JSX → SVG → PNG
//
// Génère des images 1080×1080 pour Instagram à partir des templates
// JSX. Utilise satori (SVG) + resvg-js (PNG).
//
// Fonts : Inter (Regular + Bold + ExtraBold) chargées depuis Google
// Fonts CDN au premier appel, puis mises en cache en mémoire.
// ───────────────────────────────────────────────────────────────────

const SIZE = 1080;

/** Font buffers (cached in memory after first load) */
let fontsLoaded: Awaited<ReturnType<typeof loadFonts>> | null = null;

async function loadFonts() {
  const weights = [
    { weight: 400, name: "Inter Regular" },
    { weight: 700, name: "Inter Bold" },
    { weight: 800, name: "Inter ExtraBold" },
  ] as const;

  const fonts = await Promise.all(
    weights.map(async ({ weight, name }) => {
      const url = `https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKv0.woff`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`);
        const buffer = await res.arrayBuffer();
        return {
          name: "Inter",
          data: buffer,
          weight: weight as 400 | 700 | 800,
          style: "normal" as const,
        };
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
 * Rend un élément JSX en buffer PNG 1080×1080.
 */
async function renderToPng(element: ReactNode): Promise<Buffer> {
  const fonts = await getFonts();

  const svg = await satori(element as React.ReactElement, {
    width: SIZE,
    height: SIZE,
    fonts,
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: SIZE },
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

export { SIZE };
