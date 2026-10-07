/**
 * Données d'affichage de la liste `/parcours`, construites CÔTÉ SERVEUR.
 *
 * Avant le 03/10/2026, `components/parcours/parcours-content.tsx` (client)
 * importait tout `parcours-seed.json` : quiz (réponses comprises), vidéos,
 * vannes et « pourquoi » de chaque étape partaient dans le bundle JS public.
 * Seuls les champs du programme sont désormais transmis au composant client.
 */
import parcoursSeed from "../../../../docs/content/parcours-seed.json";
import { formatDifficulty, withEmojiPresentation } from "@/lib/parcours-labels";
import { etapeLibelle } from "@/config/textes/parcours";

export interface ParcoursCatalogueModule {
  week: string;
  title: string;
  detail: string;
  format: string;
  xp: number;
  free: boolean;
}

export interface ParcoursCatalogueItem {
  emoji: string;
  slug: string;
  title: string;
  duration: string;
  timePerWeek: string;
  difficulty: string;
  persona: string;
  description: string;
  testimonial: string;
  modules: ParcoursCatalogueModule[];
}

export function getParcoursCatalogue(): ParcoursCatalogueItem[] {
  return parcoursSeed.map((p) => ({
    emoji: withEmojiPresentation(p.icon),
    slug: p.slug,
    title: p.title,
    duration: p.duration,
    timePerWeek: p.timePerWeek,
    difficulty: formatDifficulty(p.difficultyLabel),
    persona: p.personaTagline,
    description: p.description,
    testimonial: p.testimonial,
    modules: p.steps.map((s) => ({
      // « Étape N », jamais « Semaine N » (COP-10 b, lot D s17) : le rythme reste libre.
      week: etapeLibelle(s.week),
      title: s.moduleTitle,
      detail: s.moduleDetail,
      format: s.moduleFormat,
      xp: s.moduleXp,
      free: s.free,
    })),
  }));
}
