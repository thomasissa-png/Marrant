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
  DecryptageMecanisme,
  DecryptageConsigne,
  estPremierePersonne,
} from "./templates/cartes-piste-a";
import { NNBSP } from "./typo";
import { FORMATS, type FormatCarte } from "./templates/carte-marque";

// ───────────────────────────────────────────────────────────────────
// Composition des carrousels « piste A », v4 (stratégie v5 §8)
//
// Fonctions pures : slides (élément, dimensions, texte alternatif). Le
// rendu PNG est fait par image-generator (renderSlides). Règles :
//   - une slide = un temps (jamais amorce et chute ensemble en carrousel) ;
//   - pas de pagination « n/N » (compteur natif), « Glisse → » en carte 1
//     des carrousels Instagram seulement (LinkedIn : mosaïque, jamais) ;
//   - R6 : vanne à la 1re personne entre « », alt compris ;
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

/** Appel à l'action de la dernière slide (LinkedIn : lien dans le corps du post, v5 R5). */
export const CTA_FIN: Record<ReseauCarrousel, string> = {
  instagram: "Lien en bio",
  linkedin: "Lien dans le post",
};

/** « Glisse → » : carte 1 d'un carrousel Instagram seulement. */
function indice(reseau: ReseauCarrousel): string | undefined {
  return reseau === "instagram" ? INDICE_SWIPE : undefined;
}

/** Légende Instagram : 80 caractères au plus (pied compris), « À envoyer à... » (v5 R3). */
export const LEGENDE_MAX = 80;

/** Défauts d'une légende Instagram (liste vide = conforme). */
export function defautsLegende(legende: string): string[] {
  const d: string[] = [];
  if ([...legende].length > LEGENDE_MAX) d.push(`${[...legende].length} caractères (max ${LEGENDE_MAX})`);
  if (!/^À envoyer (à|au|aux) /.test(legende)) d.push("ne commence pas par « À envoyer à »");
  if ((legende.match(/lien en bio/gi) ?? []).length > 1) d.push("« lien en bio » plus d'une fois");
  return d;
}

/** Texte sans coupe forcée (« \n » de mise en lignes), pour le texte alternatif. */
function sansCoupe(texte: string): string {
  return texte.replace(/\s*\n\s*/g, " ").trim();
}

/** Ligne de vanne citée pour le texte alternatif (R6) : « … », “ ” imbriqués. */
export function citer(ligne: string): string {
  const t = sansCoupe(ligne).replace(/«\s*/g, "“").replace(/\s*»/g, "”");
  return `«${NNBSP}${t}${NNBSP}»`;
}

/** Longueur visible d'un post LinkedIn avant « voir plus ». */
export const LINKEDIN_AVANT_VOIR_PLUS = 140;

function slide(format: FormatCarte, element: ReactElement, alt: string): Slide {
  return { element, width: FORMATS[format].width, height: FORMATS[format].height, alt };
}

function joindre(...parts: string[]): string {
  return parts.map(sansCoupe).filter(Boolean).join(" ");
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

export interface Vanne {
  amorce: string;
  chute: string[];
  /** R6 : forcer ou retirer les « » (défaut : vanne à la 1re personne). */
  citation?: boolean;
}

function estCitee(v: Vanne): boolean {
  return v.citation ?? estPremierePersonne(v.amorce, ...v.chute);
}

/** Texte alternatif d'une vanne : chaque ligne entre « » si elle est citée. */
function altVanne(v: Vanne, lignes: string[]): string {
  return joindre(...(estCitee(v) ? lignes.map(citer) : lignes));
}

/** Vanne : 2 cartes 4:5, amorce sur noir puis chute sur aplat. */
export function carrouselVanne(v: Vanne): Slide[] {
  const citation = estCitee(v);
  return [
    slide("instagram", createElement(VanneAmorce, { amorce: v.amorce, indice: INDICE_SWIPE, citation }), altVanne(v, [v.amorce])),
    slide("instagram", createElement(VanneChute, { chute: v.chute, citation }), altVanne(v, [v.amorce, joindre(...v.chute)])),
  ];
}

/** Relais d'article Instagram : 2 cartes vanne (ni couverture ni slides d'article, v5 §8). */
export function carrouselRelais(v: Vanne): Slide[] {
  return carrouselVanne(v);
}

/**
 * Décryptage : 4 cartes. 1 et 2 = la vanne ; 3 = mécanisme (surtitre
 * intégré « Pourquoi ça fait rire : ») ; 4 = consigne « À toi de jouer : »
 * et renvoi au quiz, sans bouton. Cartes 3 et 4 sans guillemets.
 */
export function carrouselDecryptage(d: Vanne & { mecanisme: string; consigne: string; renvoi: string }): Slide[] {
  return [
    ...carrouselVanne(d),
    slide("instagram", createElement(DecryptageMecanisme, { texte: d.mecanisme }), d.mecanisme),
    slide("instagram", createElement(DecryptageConsigne, { consigne: d.consigne, renvoi: d.renvoi }), joindre(d.consigne, d.renvoi)),
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
      indice: indice(reseau),
    }), a.titre),
  ];
  if (a.extrait && liste) {
    const surtitre = surtitreExtrait(liste.nom, a.extrait.rang, liste.nombre);
    const v: Vanne = { amorce: a.extrait.amorce, chute: [a.extrait.chute] };
    const citation = estCitee(v);
    slides.push(
      slide("instagram", createElement(ArticleExtraitAmorce, { amorce: a.extrait.amorce, surtitre, citation }),
        joindre(`${surtitre} :`, altVanne(v, [a.extrait.amorce]))),
      slide("instagram", createElement(VanneChute, { chute: [a.extrait.chute], citation }),
        altVanne(v, [a.extrait.amorce, a.extrait.chute])),
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
      indice: indice(reseau),
    }), joindre(`${c.titreConseil} :`, c.situation)),
    slide("instagram", createElement(ConseilReplique, { replique: c.replique }),
      joindre(c.situation, citer(joindre(...c.replique)))),
    slide("instagram", createElement(ConseilPrincipe, { surtitre: surtitrePrincipe, principe: c.principe, cta }),
      joindre(`${surtitrePrincipe} :`, c.principe, `${cta}.`)),
  ];
}

// ─── X (16:9) et LinkedIn (4:5, carte chute d'Instagram) ─────────

/**
 * Vanne sur X ou LinkedIn : la chute seule, le texte du post porte
 * l'amorce. LinkedIn (v5 §8, décision du 05/10) : exactement la carte
 * chute d'Instagram, 4:5 1080×1350 ; amorce de plus de 140 caractères
 * (coupée par « voir plus ») refusée, sans repli : le post reste en texte.
 */
export function carteVanneUnique(format: "x" | "linkedin", v: Vanne): Slide {
  const alt = altVanne(v, [v.amorce, joindre(...v.chute)]);
  if (format === "linkedin") {
    if (!amorceLinkedInEligible(v.amorce)) {
      throw new Error(`Amorce LinkedIn de ${v.amorce.trim().length} caractères (max ${LINKEDIN_AVANT_VOIR_PLUS}) : texte seul.`);
    }
    return slide("instagram", createElement(VanneChute, { chute: v.chute, citation: estCitee(v) }), alt);
  }
  return slide(format, createElement(VanneChute, { chute: v.chute, format, citation: estCitee(v) }), alt);
}

/** LinkedIn : la carte n'est permise que si l'amorce tient avant « voir plus ». */
export function amorceLinkedInEligible(amorce: string): boolean {
  const t = amorce.trim();
  return t.length > 0 && t.length <= LINKEDIN_AVANT_VOIR_PLUS;
}

/** Carte de repli : amorce et chute sur la même image (amorce trop longue pour le post). */
export function carteVanneRepli(format: "x" | "linkedin", v: Vanne): Slide {
  return slide(format, createElement(VanneComplete, { amorce: v.amorce, chute: v.chute, format, citation: estCitee(v) }),
    altVanne(v, [v.amorce, joindre(...v.chute)]));
}

/** Article sur X (couverture, sans pagination) ou LinkedIn (sans étiquette). */
export function carteArticleUnique(format: "x" | "linkedin", titre: string): Slide {
  return slide(format, createElement(ArticleCouverture, {
    titre,
    format,
    sansEtiquette: format === "linkedin",
  }), titre);
}

/** Texte du post qui accompagne une carte « chute seule » : l'amorce, mot pour mot. */
export function texteAccompagnement(v: { amorce: string }): string {
  return v.amorce.trim();
}
