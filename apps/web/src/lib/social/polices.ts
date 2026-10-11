import { readFile } from "fs/promises";
import { join } from "path";
import { isCloudflareWorkers } from "@/lib/runtime-env";
import { enregistrerPolice } from "./mesure-texte";

// ───────────────────────────────────────────────────────────────────
// Polices des cartes sociales et des images Open Graph
//
// Déplacé tel quel depuis image-generator.ts (spec @design cycle 8 §1.4) :
// image-generator importe satori et @resvg/resvg-js (binaire natif), à ne
// pas tirer dans les routes `opengraph-image`. Inter (Regular, Bold,
// ExtraBold) et Plus Jakarta Sans (Bold, ExtraBold), lues en TTF par `fs`
// (build, Node), puis par le binding ASSETS (Workers), puis en repli CDN.
// Cache mémoire après le premier chargement.
//
// Ordre obligatoire dans un appelant : `await getFonts()` AVANT toute
// composition, car loadFonts enregistre les métriques utilisées par la
// mise en lignes mesurée (mesure-texte.ts).
// ───────────────────────────────────────────────────────────────────

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
export const FONT_FILES = [
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

/** Polices pour satori / next/og (chargées une fois, enregistrées pour la mesure). */
export async function getFonts() {
  if (!fontsLoaded) {
    fontsLoaded = await loadFonts();
  }
  return fontsLoaded;
}
