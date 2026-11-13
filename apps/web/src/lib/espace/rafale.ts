/**
 * Moteur de la rafale du jour (s24, lot D5 ; architecture v20 2.2 et 2.3, étalon E5 v5 « Ordre de
 * tirage »). Fonctions pures : le catalogue des cartes et la composition du jour, sans base.
 *
 * Cartes : chaque situation neuve (`data/espace/situations.json`) donne DEUX cartes « Quel registre ? »
 * (`<fiche>.c1`, `<fiche>.c2`, un contexte chacune ; forme `premiere-phrase` = « Ta première phrase
 * d'abord ») ; chaque fiche du carnet donne une carte « Et toi ? » (`carnet-<id>`), seulement après la
 * porte G5 (`lib/espace/carnet-cartes.ts`). Jamais tirés : humour noir (3.12) et bonus de cap (3.13),
 * qui ne sont pas des situations : ils n'entrent pas dans ce catalogue.
 *
 * Composition du jour (jour civil de Paris) :
 * - au plus 3 cartes par jour, réponses du jour comprises ; les cartes en trop glissent au lendemain,
 *   aucun arriéré n'est jamais compté ni affiché ;
 * - 1 situation nouvelle au plus (contexte 1 d'une situation jamais vue) : les 5 situations d'entrée
 *   (P1) d'abord, puis les autres P1, puis P2, puis P3 seulement après la semaine 4 de l'abonnement ou
 *   20 cartes avec « Oui » [HYPOTHÈSE de seuil de l'architecture, calée à E5] ; après « pour plaire »
 *   (C9), une situation de rencontre, une fois ; carnet en retard : une nouvelle un jour sur deux ;
 * - puis jusqu'à 2 cartes à revoir (échéance atteinte, la plus ancienne d'abord) ;
 * - places libres et aucune carte à revoir : le second contexte d'une situation déjà vue un autre jour ;
 *   sinon rien (« C'est tout pour aujourd'hui », jamais une carte répétée).
 */
import type { Fiche } from "@/lib/espace/fiches-schema";
import type { CarnetFiche } from "@/lib/carnet";

export const CARTES_PAR_JOUR = 3;
export const REVISIONS_PAR_JOUR = 2;
/** Seuil P3 (2.2) : semaine 4 de l'abonnement ou 20 cartes avec « Oui ». [HYPOTHÈSE] calée à E5. */
export const JOURS_AVANT_P3 = 28;
export const OUI_AVANT_P3 = 20;

type Situation = Extract<Fiche, { type: "situation" }>;
type Registre = "sure" | "joueuse" | "risquee";

export interface CarteRegistre {
  genre: "registre";
  id: string;
  ficheId: string;
  titre: string;
  univers: Situation["univers"];
  palier: Situation["palier"];
  premierePhrase: boolean;
  contexteIndex: 1 | 2;
  scene: { texte: string; onTeDit?: string; suite?: string };
  contexte: string;
  repliques: Record<Registre, string>;
  bonneReponse: Registre;
  pourquoi: string;
  regle: string;
  geste: Situation["geste"] | null;
}

export interface CarteEtToi {
  genre: "et-toi";
  id: string;
  ficheId: string;
  titre: string;
  scene: string;
  onTeDit: string;
  reponse: string;
  siTendu: string;
  pourquoi: string;
  exercice: string | null;
}

export type CarteRafale = CarteRegistre | CarteEtToi;

/** Identifiant d'une carte « Quel registre ? » : `<fiche>.c1` ou `<fiche>.c2`. */
export const idCarteRegistre = (ficheId: string, index: 1 | 2) => `${ficheId}.c${index}`;
export const idCarteCarnet = (carnetId: string) => `carnet-${carnetId}`;
/** Fiche (pour la note « ma réplique à moi » et « Fait ») d'une carte. */
export const ficheDeCarte = (carteId: string) => carteId.replace(/\.c[12]$/, "");

/** Cartes des situations neuves (deux premiers contextes de chacune). */
export function cartesDesSituations(situations: readonly Situation[]): CarteRegistre[] {
  return situations.flatMap((s) =>
    s.contenu.contextesRafale.slice(0, 2).map((c, i) => ({
      genre: "registre" as const,
      id: idCarteRegistre(s.id, (i + 1) as 1 | 2),
      ficheId: s.id,
      titre: s.titre,
      univers: s.univers,
      palier: s.palier,
      premierePhrase: s.contenu.forme === "premiere-phrase",
      contexteIndex: (i + 1) as 1 | 2,
      scene: s.contenu.scene,
      contexte: c.contexte,
      repliques: { sure: s.contenu.repliques.sure.texte, joueuse: s.contenu.repliques.joueuse.texte, risquee: s.contenu.repliques.risquee.texte },
      bonneReponse: c.bonneReponse,
      pourquoi: c.pourquoi,
      regle: s.contenu.quandMonterDUnCran.regle,
      geste: s.geste ?? null,
    })),
  );
}

/** Cartes « Et toi ? » du carnet (aucun texte neuf, aucun texte du carnet modifié). */
export function cartesDuCarnet(fiches: readonly CarnetFiche[]): CarteEtToi[] {
  return fiches.map((f) => ({
    genre: "et-toi" as const,
    id: idCarteCarnet(f.id),
    ficheId: idCarteCarnet(f.id),
    titre: f.titre,
    scene: f.situation,
    onTeDit: f.onTeDit,
    reponse: f.reponse,
    siTendu: f.siTendu,
    pourquoi: f.pourquoi,
    exercice: f.exercice ?? null,
  }));
}

export interface SuiviLu {
  carteId: string;
  dueLe: Date | null;
  premiereVueLe: Date;
}

export interface ReponseDuJour {
  carteId: string;
  nouvelle: boolean;
}

export interface EntreeRafale {
  catalogue: readonly CarteRafale[];
  /** Ids des 5 situations d'entrée (P1), dans leur ordre. */
  entrees: readonly string[];
  suivis: readonly SuiviLu[];
  reponsesDuJour: readonly ReponseDuJour[];
  debutAbonnement: Date | null;
  nbOui: number;
  aisePlaire: boolean;
  rencontreServie: boolean;
  carnetEnRetard: boolean;
  maintenant: Date;
}

export interface CarteDuJourMoteur {
  carteId: string;
  nouvelle: boolean;
}

export interface RafaleDuJour {
  cartes: CarteDuJourMoteur[];
  /** Cartes déjà jouées aujourd'hui. */
  faites: string[];
  fini: boolean;
}

/** Jour civil de Paris (AAAA-MM-JJ). */
export function jourParis(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

const RANG_PALIER = { P1: 1, P2: 2, P3: 3 } as const;

function rangNouvelle(c: CarteRafale, entrees: readonly string[]): number {
  if (c.genre === "et-toi") return 2.5; // carnet : après les P2 neuves [HYPOTHÈSE d'ordre, sans effet avant G5]
  const e = entrees.indexOf(c.ficheId);
  if (e >= 0) return e / 10; // les 5 entrées, dans leur ordre, avant tout autre P1
  return RANG_PALIER[c.palier];
}

/** Situation nouvelle du jour, ou null. */
export function choisirNouvelle(e: EntreeRafale, vues: ReadonlySet<string>): CarteRafale | null {
  const fichesVues = new Set(Array.from(vues, (id) => ficheDeCarte(id)));
  const jours = e.debutAbonnement ? (e.maintenant.getTime() - e.debutAbonnement.getTime()) / 86_400_000 : 0;
  const p3Ouvert = jours >= JOURS_AVANT_P3 || e.nbOui >= OUI_AVANT_P3;
  const candidates = e.catalogue.filter(
    (c) => !fichesVues.has(c.ficheId) && (c.genre === "et-toi" || (c.contexteIndex === 1 && (c.palier !== "P3" || p3Ouvert))),
  );
  if (e.aisePlaire && !e.rencontreServie) {
    const rencontre = candidates.find((c) => c.genre === "registre" && c.univers === "rencontre");
    if (rencontre) return rencontre;
  }
  return (
    candidates
      .map((c, i) => ({ c, i, r: rangNouvelle(c, e.entrees) }))
      .sort((a, b) => a.r - b.r || a.i - b.i)[0]?.c ?? null
  );
}

/** Rafale du jour (règles en tête de fichier). */
export function composerRafale(e: EntreeRafale): RafaleDuJour {
  const jour = jourParis(e.maintenant);
  const faites = Array.from(new Set(e.reponsesDuJour.map((r) => r.carteId)));
  const dejaFaites = new Set(faites);
  const vues = new Set(e.suivis.map((s) => s.carteId));
  const parId = new Map(e.catalogue.map((c) => [c.id, c]));
  let places = Math.max(0, CARTES_PAR_JOUR - faites.length);
  const cartes: CarteDuJourMoteur[] = [];

  const jourNumero = Math.floor(Date.parse(`${jour}T00:00:00Z`) / 86_400_000);
  const nouvelleAutorisee = !e.reponsesDuJour.some((r) => r.nouvelle) && (!e.carnetEnRetard || jourNumero % 2 === 0);
  if (places > 0 && nouvelleAutorisee) {
    const n = choisirNouvelle(e, vues);
    if (n) {
      cartes.push({ carteId: n.id, nouvelle: true });
      places -= 1;
    }
  }

  const dues = e.suivis
    .filter((s) => s.dueLe && jourParis(s.dueLe) <= jour && !dejaFaites.has(s.carteId) && parId.has(s.carteId))
    .sort((a, b) => (a.dueLe as Date).getTime() - (b.dueLe as Date).getTime());
  for (const s of dues.slice(0, Math.min(places, REVISIONS_PAR_JOUR))) {
    cartes.push({ carteId: s.carteId, nouvelle: false });
    places -= 1;
  }

  if (dues.length === 0) {
    const premiereVue = new Map(e.suivis.map((s) => [s.carteId, s.premiereVueLe]));
    for (const c of e.catalogue) {
      if (places <= 0) break;
      if (c.genre !== "registre" || c.contexteIndex !== 2 || vues.has(c.id)) continue;
      const vu1 = premiereVue.get(idCarteRegistre(c.ficheId, 1));
      if (!vu1 || jourParis(vu1) === jour) continue;
      cartes.push({ carteId: c.id, nouvelle: false });
      places -= 1;
    }
  }

  return { cartes, faites, fini: cartes.length === 0 };
}
