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
import { isCloudflareWorkers } from "@/lib/runtime-env";
import type { Slide } from "./carrousel-piste-a";
import { getFonts } from "./polices";

// ───────────────────────────────────────────────────────────────────
// Image Generator — satori JSX → SVG → PNG
//
// Génère des images 1080×1080 pour Instagram à partir des templates
// JSX. Utilise satori (SVG) + resvg-js (PNG).
//
// Fonts : Inter (Regular + Bold + ExtraBold) et Plus Jakarta Sans
// (Bold + ExtraBold, police de titre du site et des cartes piste A)
// chargées par polices.ts (TTF local, puis ASSETS sous Workers, puis
// CDN), cache mémoire après premier chargement.
// ───────────────────────────────────────────────────────────────────

const SIZE = 1080;

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

  // Import dynamique, JAMAIS en tête de fichier : à son chargement, le paquet
  // `satori` compile aussitôt son yoga.wasm embarqué (base64) via
  // WebAssembly.instantiate(octets), ce que workerd refuse (« Wasm code generation
  // disallowed by embedder » au cron social de 20:00, s17). Sous Workers on ne
  // passe jamais ici : next/og utilise les .wasm précompilés fournis par OpenNext.
  const { default: satori } = await import("satori");
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
