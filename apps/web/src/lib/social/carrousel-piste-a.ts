import { createElement, type ReactElement } from "react";
import {
  VanneAmorce,
  VanneChute,
  ArticleCouverture,
  ArticleExtrait,
  ArticleFin,
  ConseilSituation,
  ConseilReplique,
} from "./templates/cartes-piste-a";
import { FORMATS, type FormatCarte } from "./templates/carte-marque";

// ───────────────────────────────────────────────────────────────────
// Composition des carrousels « piste A » (audit visuels s15, §4)
//
// Fonctions pures : elles renvoient les slides (élément + dimensions),
// le rendu PNG est fait par image-generator (renderSlides). Aucune
// logique de publication ici : le branchement sur Buffer reste à faire
// après validation des modèles par Thomas.
// ───────────────────────────────────────────────────────────────────

export interface Slide {
  element: ReactElement;
  width: number;
  height: number;
}

/** Indice de swipe en pied de la slide 1 (audit : « Glisse »). */
export const INDICE_SWIPE = "Glisse →";

function slide(format: FormatCarte, element: ReactElement): Slide {
  return { element, width: FORMATS[format].width, height: FORMATS[format].height };
}

/** « Blagues d'Halloween : 8 vannes pour… » → { nombre: 8, nom: "vannes" }. */
export function extraireListe(titre: string): { nombre: number; nom: string } | null {
  const m = titre.match(/(\d+)\s+([A-Za-zÀ-ÖØ-öø-ÿŒœ-]+)/);
  if (!m) return null;
  return { nombre: Number(m[1]), nom: m[2] };
}

// ─── Instagram (4:5) ─────────────────────────────────────────────

export function carrouselVanne(v: { amorce: string; chute: string[] }): Slide[] {
  return [
    slide("instagram", createElement(VanneAmorce, {
      amorce: v.amorce,
      page: { n: 1, total: 2 },
      indice: INDICE_SWIPE,
    })),
    slide("instagram", createElement(VanneChute, { chute: v.chute, page: { n: 2, total: 2 } })),
  ];
}

export function carrouselArticle(a: {
  titre: string;
  extrait?: { amorce: string; chute?: string; rang: number };
}): Slide[] {
  const liste = extraireListe(a.titre);
  const total = a.extrait ? 3 : 2;
  const slides: Slide[] = [
    slide("instagram", createElement(ArticleCouverture, {
      titre: a.titre,
      nombre: liste?.nombre,
      page: { n: 1, total },
      indice: INDICE_SWIPE,
    })),
  ];
  if (a.extrait && liste) {
    slides.push(slide("instagram", createElement(ArticleExtrait, {
      ...a.extrait,
      total: liste.nombre,
      page: { n: 2, total },
    })));
  }
  const fin = liste && a.extrait
    ? `Les ${liste.nombre - 1} autres ${liste.nom}`
    : "L'article complet";
  slides.push(slide("instagram", createElement(ArticleFin, { texte: fin, page: { n: total, total } })));
  return slides;
}

export function carrouselConseil(c: {
  titreConseil: string;
  situation: string;
  replique: string[];
}): Slide[] {
  return [
    slide("instagram", createElement(ConseilSituation, {
      titreConseil: c.titreConseil,
      situation: c.situation,
      page: { n: 1, total: 2 },
      indice: INDICE_SWIPE,
    })),
    slide("instagram", createElement(ConseilReplique, { replique: c.replique, page: { n: 2, total: 2 } })),
  ];
}

// ─── X (16:9) et LinkedIn (lien 1200×627) ────────────────────────

/** Vanne sur X ou LinkedIn : la chute seule, le texte du post porte l'amorce. */
export function carteVanneUnique(format: "x" | "linkedin", chute: string[]): Slide {
  return slide(format, createElement(VanneChute, { chute, format }));
}

/** Article sur X (couverture sans pagination) ou LinkedIn (sans étiquette). */
export function carteArticleUnique(format: "x" | "linkedin", titre: string): Slide {
  return slide(format, createElement(ArticleCouverture, {
    titre,
    nombre: extraireListe(titre)?.nombre,
    format,
    sansEtiquette: format === "linkedin",
  }));
}
