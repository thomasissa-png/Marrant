/**
 * Catégories de /vannes : la rangée de filtres (groupes de catégories de la base, par contexte puis par style).
 * Module sans dépendance : importable par la liste (client) et par l'API (serveur). Jusqu'à s25, la rangée vivait
 * dans `components/vannes/vannes-list.tsx` ; déplacée ici sans changement (mêmes valeurs, mêmes libellés, même
 * ordre) pour que la sélection des vannes gratuites (interrupteur de l'espace ouvert) se répartisse sur ces groupes.
 */
export const CATEGORIES_VANNES: readonly { value: string; label: string }[] = [
  { value: "", label: "Toutes" },
  // Par contexte : où tu la sors
  { value: "SITUATION,OBSERVATIONNEL,CULTUREL", label: "Vie quotidienne" },
  { value: "BOULOT", label: "Boulot & Collègues" },
  { value: "COUPLE,DATING", label: "Couple & Dating" },
  { value: "SOIREES", label: "Soirées & Apéro" },
  { value: "ECOLE", label: "École & Études" },
  { value: "PARENTS", label: "Famille" },
  { value: "RESEAUX_SOCIAUX,GAMING", label: "Digital & Gaming" },
  // Par style : comment elle marche
  { value: "AUTODERISION", label: "Autodérision" },
  { value: "ABSURDE", label: "Absurde" },
  { value: "JEUX_DE_MOTS", label: "Jeux de mots" },
];

/** Groupe de la rangée d'une catégorie de la base (sa valeur de filtre) ; catégorie inconnue : elle-même. */
export function groupeDeCategorie(categorie: string): string {
  return CATEGORIES_VANNES.find((c) => c.value !== "" && c.value.split(",").includes(categorie))?.value ?? categorie;
}

/**
 * Vannes gratuites, interrupteur de l'espace ouvert (décision de Thomas du 14/11, `docs/founder-preferences.md`) :
 * `limite` vannes du catalogue réparties sur les groupes de la rangée, à tour de rôle. Entrée : le catalogue dans
 * l'ordre de la liste (plus récentes d'abord) ; tour 1 : la plus récente de chaque groupe, groupes dans l'ordre où
 * ils apparaissent ; tour 2 : la suivante de chacun, etc. Avec au moins 5 groupes présents, les 10 vannes en
 * couvrent au moins 5 (10 groupes présents : une par groupe). Sortie dans l'ordre du catalogue. Déterministe,
 * aucune vanne créée ni modifiée, aucune écriture en base.
 */
export function selectionGratuite<T extends { id: string; category: string }>(catalogue: readonly T[], limite: number): T[] {
  const parGroupe = new Map<string, T[]>();
  for (const vanne of catalogue) {
    const groupe = groupeDeCategorie(vanne.category);
    parGroupe.set(groupe, [...(parGroupe.get(groupe) ?? []), vanne]);
  }
  const files = Array.from(parGroupe.values());
  const choisies = new Set<string>();
  for (let tour = 0; choisies.size < limite && files.some((f) => f.length > tour); tour++) {
    for (const file of files) {
      if (choisies.size >= limite) break;
      if (file[tour]) choisies.add(file[tour].id);
    }
  }
  return catalogue.filter((vanne) => choisies.has(vanne.id));
}

/**
 * « Toutes » chez l'abonné, interrupteur de l'espace ouvert (décision de Thomas du 16/11) : le catalogue entier,
 * catégories mélangées par alternance entre les groupes de la rangée. Entrée dans l'ordre de la liste (plus récentes
 * d'abord) ; sortie : la plus récente de chaque groupe (groupes dans l'ordre où ils apparaissent), puis la suivante
 * de chacun, etc. ; un groupe épuisé laisse la place aux autres. Même ensemble, aucune vanne retirée ni ajoutée.
 */
export function alternerParGroupe<T extends { category: string }>(catalogue: readonly T[]): T[] {
  const parGroupe = new Map<string, T[]>();
  for (const vanne of catalogue) {
    const groupe = groupeDeCategorie(vanne.category);
    parGroupe.set(groupe, [...(parGroupe.get(groupe) ?? []), vanne]);
  }
  const files = Array.from(parGroupe.values());
  const sortie: T[] = [];
  for (let tour = 0; sortie.length < catalogue.length; tour++) {
    for (const file of files) if (file[tour]) sortie.push(file[tour]);
  }
  return sortie;
}
