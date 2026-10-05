import { createElement, type ReactElement } from "react";
import {
  VanneAmorce,
  VanneChute,
  VanneComplete,
  ArticleCouverture,
  ArticleExtraitAmorce,
  CarteFin,
  ConseilSituation,
  ConseilReplique,
  ConseilPrincipe,
} from "./templates/cartes-piste-a";
import { FORMATS, type FormatCarte } from "./templates/carte-marque";

// ───────────────────────────────────────────────────────────────────
// Composition des carrousels « piste A », v3 (notations cycle 2)
//
// Fonctions pures : slides (élément, dimensions, texte alternatif). Le
// rendu PNG est fait par image-generator (renderSlides). Règles :
//   - une slide = un temps (jamais amorce et chute ensemble en carrousel) ;
//   - pas de pagination « n/N » (compteur natif), « Glisse → » en slide 1 ;
//   - chaque image porte son texte alternatif ; une image qui montre la
//     chute porte amorce + chute (lisible seule, accessible).
// ───────────────────────────────────────────────────────────────────

export interface Slide {
  element: ReactElement;
  width: number;
  height: number;
  /** Texte alternatif à envoyer avec l'image (Buffer `altText`). */
  alt: string;
}

/** Réseau de destination d'un carrousel 4:5 (seul l'appel à l'action change). */
export type ReseauCarrousel = "instagram" | "linkedin";

/** Indice de swipe en pied de la slide 1 (audit : « Glisse »). */
export const INDICE_SWIPE = "Glisse →";

/** Appel à l'action de la dernière slide (LinkedIn : lien en 1er commentaire). */
export const CTA_FIN: Record<ReseauCarrousel, string> = {
  instagram: "Lien en bio",
  linkedin: "Lien en commentaire",
};

/** Longueur visible d'un post LinkedIn avant « voir plus ». */
export const LINKEDIN_AVANT_VOIR_PLUS = 140;

function slide(format: FormatCarte, element: ReactElement, alt: string): Slide {
  return { element, width: FORMATS[format].width, height: FORMATS[format].height, alt };
}

function joindre(...parts: string[]): string {
  return parts.map((p) => p.trim()).filter(Boolean).join(" ");
}

/** « Blagues d'Halloween : 8 vannes pour… » → { nombre: 8, nom: "vannes" }. */
export function extraireListe(titre: string): { nombre: number; nom: string } | null {
  const m = titre.match(/(\d+)\s+([A-Za-zÀ-ÖØ-öø-ÿŒœ-]+)/);
  if (!m) return null;
  return { nombre: Number(m[1]), nom: m[2] };
}

/** « vannes », 2, 8 → « Vanne n° 2 sur 8 » (nom repris du titre). */
export function surtitreExtrait(nom: string, rang: number, total: number): string {
  const singulier = nom.endsWith("s") ? nom.slice(0, -1) : nom;
  return `${singulier.charAt(0).toUpperCase()}${singulier.slice(1)} n° ${rang} sur ${total}`;
}

// ─── Instagram (4:5) ─────────────────────────────────────────────

export function carrouselVanne(v: { amorce: string; chute: string[] }): Slide[] {
  const complet = joindre(v.amorce, ...v.chute);
  return [
    slide("instagram", createElement(VanneAmorce, { amorce: v.amorce, indice: INDICE_SWIPE }), v.amorce),
    slide("instagram", createElement(VanneChute, { chute: v.chute }), complet),
  ];
}

export function carrouselArticle(
  a: { titre: string; extrait?: { amorce: string; chute: string; rang: number } },
  reseau: ReseauCarrousel = "instagram",
): Slide[] {
  const liste = extraireListe(a.titre);
  const slides: Slide[] = [
    slide("instagram", createElement(ArticleCouverture, {
      titre: a.titre,
      nombre: liste?.nombre,
      indice: INDICE_SWIPE,
    }), a.titre),
  ];
  if (a.extrait && liste) {
    const surtitre = surtitreExtrait(liste.nom, a.extrait.rang, liste.nombre);
    slides.push(
      slide("instagram", createElement(ArticleExtraitAmorce, { amorce: a.extrait.amorce, surtitre }),
        joindre(`${surtitre} :`, a.extrait.amorce)),
      slide("instagram", createElement(VanneChute, { chute: [a.extrait.chute] }),
        joindre(a.extrait.amorce, a.extrait.chute)),
    );
  }
  const fin = liste && a.extrait ? `Les ${liste.nombre - 1} autres ${liste.nom}` : "L'article complet";
  const cta = CTA_FIN[reseau];
  slides.push(slide("instagram", createElement(CarteFin, { texte: fin, cta }), joindre(`${fin}.`, `${cta}.`)));
  return slides;
}

export function carrouselConseil(
  c: { titreConseil: string; situation: string; replique: string[]; principe: string },
  reseau: ReseauCarrousel = "instagram",
): Slide[] {
  const cta = CTA_FIN[reseau];
  const surtitrePrincipe = "Pourquoi ça marche";
  return [
    slide("instagram", createElement(ConseilSituation, {
      titreConseil: c.titreConseil,
      situation: c.situation,
      indice: INDICE_SWIPE,
    }), joindre(`${c.titreConseil} :`, c.situation)),
    slide("instagram", createElement(ConseilReplique, { replique: c.replique }),
      joindre(c.situation, ...c.replique)),
    slide("instagram", createElement(ConseilPrincipe, { surtitre: surtitrePrincipe, principe: c.principe, cta }),
      joindre(`${surtitrePrincipe} :`, c.principe, `${cta}.`)),
  ];
}

// ─── X (16:9) et LinkedIn (lien 1200×627) ────────────────────────

/**
 * Vanne sur X ou LinkedIn : la chute seule, le texte du post porte
 * l'amorce. Sur LinkedIn, si l'amorce dépasse 140 caractères (coupée par
 * « voir plus »), repli sur une carte amorce + chute.
 */
export function carteVanneUnique(format: "x" | "linkedin", v: { amorce: string; chute: string[] }): Slide {
  if (format === "linkedin" && v.amorce.length > LINKEDIN_AVANT_VOIR_PLUS) return carteVanneRepli(format, v);
  return slide(format, createElement(VanneChute, { chute: v.chute, format }), joindre(v.amorce, ...v.chute));
}

/** Carte de repli : amorce et chute sur la même image (amorce trop longue pour le post). */
export function carteVanneRepli(format: "x" | "linkedin", v: { amorce: string; chute: string[] }): Slide {
  return slide(format, createElement(VanneComplete, { amorce: v.amorce, chute: v.chute, format }), joindre(v.amorce, ...v.chute));
}

/** Article sur X (couverture, sans pagination) ou LinkedIn (sans étiquette). */
export function carteArticleUnique(format: "x" | "linkedin", titre: string): Slide {
  return slide(format, createElement(ArticleCouverture, {
    titre,
    nombre: extraireListe(titre)?.nombre,
    format,
    sansEtiquette: format === "linkedin",
  }), titre);
}

/** Texte du post qui accompagne une carte « chute seule » : l'amorce, mot pour mot. */
export function texteAccompagnement(v: { amorce: string }): string {
  return v.amorce.trim();
}
