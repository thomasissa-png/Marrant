/**
 * Pages thème /vannes/theme/<slug> (lot S3b s14). Module pur (sans Prisma).
 *
 * Textes validés par Thomas, repris mot pour mot de `docs/copy/landings-s14.md`
 * (title sans le suffixe « | deviens-marrant.fr » ajouté par le layout).
 * « ecole » viendra plus tard (moins de 20 vannes actives au 30/09/2026).
 * `label` : libellé court des liens de navigation (vocabulaire des filtres).
 */

export interface VannesTheme {
  slug: string;
  /** Catégorie Prisma `JokeCategory` listée sur la page. */
  category: string;
  label: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
}

export const VANNES_THEMES: readonly VannesTheme[] = [
  {
    slug: "boulot",
    category: "BOULOT",
    label: "Boulot & Collègues",
    title: "Blagues de boulot à sortir au bureau",
    description:
      "Blagues de boulot pour la machine à café, la réunion et l'afterwork. Chaque vanne a sa chute et son décryptage. On rit de la situation.",
    h1: "Blagues de boulot pour sourire entre deux réunions",
    intro:
      "Le mail « Suite à notre échange », la réunion qui déborde, le pot de départ où tout le monde parle boulot : le bureau fournit la matière. Ici, chaque vanne est prête à sortir à la machine à café, avec sa chute et ce qui la fait marcher. Choisis-en une, teste-la demain matin.",
  },
  {
    slug: "couple",
    category: "COUPLE",
    label: "Couple",
    title: "Blagues de couple pour rire à deux",
    description:
      "Des blagues de couple sur les courses, le canapé et le « on mange quoi ? ». Chaque vanne a sa chute et son décryptage.",
    h1: "Blagues de couple : la vie à deux, version drôle",
    intro:
      "La vie à deux, c'est le thermostat, la vaisselle et la télécommande qui change de main. Ces vannes rient de la situation, jamais de l'autre. Envoie-en une à ton partenaire et regarde qui sourit en premier.",
  },
  {
    slug: "dating",
    category: "DATING",
    label: "Dating",
    title: "Blagues de dating : rencards et applis",
    description:
      "Des blagues de dating sur les applis, le premier rencard et le silence après « on se rappelle ». Chaque vanne a sa chute et son décryptage.",
    h1: "Blagues de dating pour survivre au premier rencard",
    intro:
      "Une appli, un premier rencard, un silence de trop : le dating fournit la matière à volonté. Ces vannes rient de la situation, pas de la personne en face. Garde-en une sous le coude, elle détend mieux qu'un « et sinon, tu fais quoi dans la vie ? ».",
  },
  {
    slug: "soirees",
    category: "SOIREES",
    label: "Soirées & Apéro",
    title: "Blagues de soirée pour animer l'apéro",
    description:
      "Des blagues de soirée et d'apéro à sortir entre potes, avec leur chute et leur décryptage. De quoi lancer la conversation sans forcer.",
    h1: "Blagues de soirée à sortir entre potes",
    intro:
      "Dans une soirée, tout le monde attend que quelqu'un lance quelque chose, et personne ne veut être ce quelqu'un. Ces vannes sont faites pour ça : courtes, faciles à replacer, avec une chute qui tombe au bon moment. Lis-en une dans le trajet, tu arrives avec quelque chose à dire.",
  },
  {
    slug: "famille",
    category: "PARENTS",
    label: "Famille",
    title: "Blagues de famille et de parents",
    description:
      "Des blagues de famille sur les parents, les repas du dimanche et les questions de tata. Chaque vanne a sa chute et son décryptage.",
    h1: "Blagues de famille : la table du dimanche, version drôle",
    intro:
      "La famille, c'est le seul public qui a déjà tout entendu et qui rit quand même. Ces vannes partent de situations que tout le monde reconnaît, sans viser personne en particulier. Teste-en une au prochain repas.",
  },
  {
    slug: "gaming",
    category: "GAMING",
    label: "Gaming",
    title: "Blagues de gamer et de jeux vidéo",
    description:
      "Des blagues de gamer sur les lags, les parties du soir et le « juste une dernière ». Chaque vanne a sa chute et son décryptage.",
    h1: "Blagues de gamer : la partie du soir qui finit à l'aube",
    intro:
      "Le « juste une dernière partie » qui finit à l'aube, le lag qui frappe au pire moment, le coéquipier qui joue en solo : les gamers ont leur propre folklore. Ces vannes en font des chutes, chacune avec son décryptage. Envoie-en une à ta team.",
  },
  {
    slug: "autoderision",
    category: "AUTODERISION",
    label: "Auto-dérision",
    title: "Blagues d'autodérision : rire de soi",
    description:
      "Des blagues d'autodérision pour rire de toi sans te rabaisser. Chaque vanne a sa chute et son décryptage. Douce, jamais cruelle.",
    h1: "Blagues d'autodérision : rire de soi, sans se rabaisser",
    intro:
      "Rire de toi avant que quelqu'un d'autre s'en charge, ça détend une pièce. Ces vannes vont dans ce sens : le raté du quotidien devient la chute, jamais une raison de te sentir nul. Chacune vient avec son décryptage, pour que tu saches la refaire avec tes propres histoires.",
  },
];

export function getVannesTheme(slug: string): VannesTheme | null {
  return VANNES_THEMES.find((t) => t.slug === slug) ?? null;
}

export function vannesThemePath(slug: string): string {
  return `/vannes/theme/${slug}`;
}
