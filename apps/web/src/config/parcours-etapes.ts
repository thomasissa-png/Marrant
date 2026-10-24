/**
 * Titres d'étapes (`moduleTitle`) et ligne de carte (`personaTagline`) des parcours, pour les
 * blocs d'appel s21 (B3, B12, B13).
 *
 * Copie légère de `docs/content/parcours-*.json` (même règle que `PREMIUM_PARCOURS` dans
 * `config/premium.ts`) : le JSON complet ne doit pas partir dans le bundle client (accueil,
 * quiz). Un test compare cette copie au seed publié (`src/__tests__/lib/parcours-etapes.test.ts`) :
 * si un titre ou une ligne de carte change dans la donnée, le test casse et la copie suit.
 * Aucun texte de bloc d'appel ne cite un titre d'étape autrement que par cette table.
 */
import type { ParcoursSlug } from "@/lib/entrees-parcours";

export interface ParcoursEtapesPubliques {
  /** `moduleTitle` des étapes, dans l'ordre (index 0 = étape 1). */
  titres: readonly string[];
  /** `personaTagline` de la carte du parcours (« Pour toi si … »). */
  personaTagline: string;
}

export const PARCOURS_ETAPES: Readonly<Record<ParcoursSlug, ParcoursEtapesPubliques>> = {
  "machine-a-cafe": {
    titres: ["Des vannes courtes, faciles à ressortir", "Sentir le bon moment", "Raconter une anecdote qu'on écoute jusqu'au bout"],
    personaTagline:
      "Pour toi si tu bosses en équipe et que tu veux faire rire à la pause, en réunion ou à l'afterwork, sans devenir le collègue qui force",
  },
  repartie: {
    titres: ["Tes premières répliques", "Le rythme et les silences", "Retourner les piques avec le sourire", "Improviser sur l'inattendu"],
    personaTagline: "Pour toi si on te chambre en soirée, en coloc ou en TD et que tu cherches encore quoi répondre",
  },
  confiance: {
    titres: [
      "Redécouvrir ce qui te fait rire",
      "Rire de toi sans te rabaisser",
      "L'œil de l'observateur",
      "Être à l'aise en groupe",
      "Jouer avec les registres",
      "Affirmer ton style personnel",
    ],
    personaTagline: "Pour toi si tu sors d'une période compliquée et que tu as envie de retrouver ta légèreté, sans te forcer",
  },
  storytelling: {
    titres: [
      "Ton anecdote, coupée au plus court",
      "Des personnages qu'on entend",
      "Faire le bilan de ton raté",
      "Une chute qui se lit de deux façons",
      "Un détour qui ne perd personne",
      "Un détail qui revient à la fin",
    ],
    personaTagline:
      "Pour toi si tu as de quoi tenir une table, mais que ta chute arrive quand tout le monde est passé au dessert",
  },
  boulot: {
    titres: [
      "La salle de réunion, sans un mot",
      "Un PS drôle, sans finir en capture d'écran",
      "Le couloir : quinze secondes",
      "L'afterwork : ta semaine en trente secondes",
      "« Tu fais quoi dans la vie ? » en deux phrases",
      "Un toast de soixante secondes, une seule vanne",
    ],
    personaTagline:
      "Pour toi si tu fais rire tes amis le samedi et que, le lundi à 9 h, tu prends un ton de compte rendu",
  },
};

/** Titre de l'étape `rang` (1 = première) d'un parcours, ou `null` si l'étape n'existe pas. */
export function titreEtape(slug: ParcoursSlug, rang: number): string | null {
  return PARCOURS_ETAPES[slug]?.titres[rang - 1] ?? null;
}

/** Ligne de carte sans « Pour toi si » (B13 `{LIGNE_CARTE}`). */
export function ligneCarte(slug: ParcoursSlug): string {
  return PARCOURS_ETAPES[slug].personaTagline.replace(/^Pour toi si\s+/u, "");
}

/** Première lettre en minuscule (titres cités dans une phrase). */
export function minusculeInitiale(texte: string): string {
  return texte.charAt(0).toLocaleLowerCase("fr-FR") + texte.slice(1);
}
