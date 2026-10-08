/**
 * Repli du mix de formats (s15, [CHOIX UTILISATEUR] du 06/10 : barre Alexa intacte, cadence 5/5/2 tenue
 * par les autres formats). Règles : `docs/social/mix-formats-s15.md` §2 (ordre), §3 (R9), §4 (barres),
 * §6 (plafonds) et `plan-execution-s15.md` §2 et §3. Le générateur ne pioche QUE dans le fichier versionné
 * `docs/social/preparation/textes-formats-valides.json` : aucun texte n'est inventé ; sans texte, erreur.
 */
import { z } from "zod";
import type { PreparedPlatform } from "./social-controls";
import { FORMULES, type TypeCase } from "./social-lot-v5-config";
import { longueurX } from "../../src/lib/social/longueur-x";

export type FormatMix = "conseil" | "ligne" | "carrousel" | "quiz" | "relaisLinkedIn";
export const LIBELLE_FORMAT: Record<FormatMix, string> = {
  conseil: "conseil", ligne: "ligne d'article notée", carrousel: "carrousel R9", quiz: "quiz seul", relaisLinkedIn: "relais LinkedIn à angle travail",
};

/** Plafonds du mix (`mix-formats-s15.md` §2 et §6, `plan-execution-s15.md` §3). Semaine = lundi au dimanche. */
export const PLAFONDS_MIX = {
  /** Conseils : 4 nominaux par semaine (5 si le mercredi X n'est pas un quiz), 8 au plus en repli. */
  conseilsParSemaine: 8,
  /** Quiz seul : 4 au plus sur la fenêtre du mix, 1 mercredi sur 2 (jamais deux mercredis de suite). */
  quizSeulMax: 4,
  /** Fenêtre du mix (§6, 03/11/2026 au 03/01/2027) : plafond du quiz seul. */
  fenetre: { de: "2026-11-03", a: "2027-01-03" },
  /** Carrousel décryptage : 1 par semaine (Instagram, mercredi). */
  carrouselsParSemaine: 1,
  /** LinkedIn : 1 relais nominal, le 2e seulement en repli (« jamais 2 relais » levée dans ce seul cas). */
  relaisLinkedInParSemaine: 2,
  /** R9 : vanne publiée depuis 28 jours au moins [HYPOTHÈSE de mix-formats-s15.md §3]. */
  r9Jours: 28,
  /** Conseil X : 270 caractères au plus (comptés par X), sans lien. */
  conseilXMax: 270,
} as const;

/**
 * Barre de note à l'aveugle (2 relecteurs, chacune au moins égale) : conseil 8 (§4 et `plan-execution-s15.md` §3 :
 * « au moins 8/10 chez les 2 », jamais la barre Alexa), ligne d'article 8,5 (§4, relais d'article), relais LinkedIn 8,5
 * (texte de marque, `aveugle-1b-linkedin-resultat.md`) ; carrousel et quiz : [HYPOTHÈSE : même seuil que les conseils, 8].
 */
export const SEUIL_NOTE: Record<FormatMix, number> = { conseil: 8, ligne: 8.5, carrousel: 8, quiz: 8, relaisLinkedIn: 8.5 };

const RESEAU = z.enum(["TWITTER", "INSTAGRAM", "LINKEDIN"]);
const texteFormatSchema = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9-]{2,60}$/, "id en minuscules, chiffres et tirets"),
  /**
   * Créneau tranché à l'aveugle (AAAA-MM-JJ) : le texte sert d'abord SA case. Une vanne au niveau sur ce créneau le
   * garde (mix §2 : la vanne passe avant le conseil) ; le texte est alors rendu au repli (case libre suivante du même
   * réseau, avertissement). Créneau après la fin du lot : texte réservé, jamais pris par ce lot.
   */
  creneau: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "créneau AAAA-MM-JJ").optional(),
  format: z.enum(["conseil", "ligne", "carrousel", "quiz", "relaisLinkedIn"]),
  reseau: RESEAU,
  /** Notes à l'aveugle des 2 relecteurs. */
  notes: z.tuple([z.number().min(0).max(10), z.number().min(0).max(10)]),
  /** Document de la notation (traçabilité). */
  source: z.string().min(3),
  /** X et LinkedIn : texte exact du post, sans lien (le script ajoute le lien des relais et du quiz). */
  texte: z.string().min(1).optional(),
  /** Instagram : cartes exactes (2 ; carrousel : 5 parties = 4 cartes). */
  cartes: z.array(z.string().min(1)).optional(),
  /** Instagram : légende « À envoyer à... » (80 caractères, sans lien ni pied). */
  legende: z.string().min(1).optional(),
  /** Conseil Instagram : technique nommée de la carte 1 (« surtitre », 4 mots au plus, plan §3), hors texte de la carte. */
  surtitre: z.string().min(1).optional(),
  /** Ligne d'article et relais LinkedIn : slug de l'article. */
  article: z.string().min(1).optional(),
  /** Ligne d'article : rang `**N.**` dans l'article (clé anti-répétition `slug#rang`). */
  rang: z.number().int().positive().optional(),
  /** Carrousel R9 : id catalogue de la vanne déjà publiée (cartes 1 et 2). */
  jokeId: z.string().min(1).optional(),
  /** Quiz seul : profils nommés (jamais 2 fois le même profil de suite). */
  profils: z.array(z.string().min(1)).optional(),
  persona: z.enum(["YANIS", "SOPHIE", "MARC"]).optional(),
  /**
   * Relais LinkedIn : l'angle travail est porté par le texte (validé par @copywriter) sur un article qui n'est pas
   * de thème bureau (ex. « relais vœux [angle à vérifier] », mix §6). Sans ce champ : article de thème bureau exigé.
   */
  angleTravail: z.literal(true).optional(),
}).strict();
export type TexteFormat = z.infer<typeof texteFormatSchema>;

/** Champs exigés par format et réseau (contrôle du fichier, avant tout tirage). */
function ecartsEntree(t: TexteFormat): string[] {
  const e: string[] = [];
  const ig = t.reseau === "INSTAGRAM";
  if (t.format === "conseil" && t.reseau === "LINKEDIN") e.push("conseil sur LinkedIn interdit (jamais de conseil sur LinkedIn)");
  if (t.format === "carrousel" && !ig) e.push("carrousel : réseau INSTAGRAM seulement");
  if (t.format === "quiz" && t.reseau !== "TWITTER") e.push("quiz seul : réseau TWITTER seulement");
  if (t.format === "relaisLinkedIn" && t.reseau !== "LINKEDIN") e.push("relais LinkedIn : réseau LINKEDIN seulement");
  if (ig) {
    const n = t.format === "carrousel" ? 5 : 2;
    if (t.cartes?.length !== n) e.push(`Instagram : ${n} cartes exactes attendues`);
    if (!t.legende) e.push("Instagram : légende « À envoyer à... » manquante");
    if (t.texte) e.push("Instagram : « cartes » et « legende », pas de « texte »");
  } else {
    if (!t.texte) e.push("texte exact manquant");
    if (t.cartes || t.legende) e.push("« cartes » et « legende » réservées à Instagram");
    if (t.texte && /https?:\/\/|www\.|\[lien\]/i.test(t.texte)) e.push("lien dans le texte (le script ajoute lui-même le lien des relais et du quiz)");
  }
  if (t.format === "conseil" && t.reseau === "TWITTER" && t.texte && longueurX(t.texte) > PLAFONDS_MIX.conseilXMax) e.push(`conseil X de ${longueurX(t.texte)} caractères (plafond ${PLAFONDS_MIX.conseilXMax})`);
  if (t.surtitre && !(t.format === "conseil" && ig)) e.push("« surtitre » réservé au conseil Instagram");
  if (t.surtitre && t.surtitre.split(/\s+/).length > 4) e.push(`surtitre de ${t.surtitre.split(/\s+/).length} mots (4 au plus)`);
  if (t.format === "quiz" && t.texte?.includes(FORMULES.quizCourt)) e.push("quiz seul : texte sans la formule du quiz (ajoutée par le script, FORMULES.quizCourt)");
  if ((t.format === "ligne" || t.format === "relaisLinkedIn") && !t.article) e.push("slug de l'article manquant");
  if (t.format === "carrousel" && !t.jokeId) e.push("carrousel R9 : jokeId de la vanne déjà publiée manquant");
  const seuil = SEUIL_NOTE[t.format];
  if (t.notes.some((n) => n < seuil)) e.push(`notes ${t.notes.join(" / ")} sous la barre du format (${seuil} chez les 2 relecteurs)`);
  return e;
}

/** Lit et contrôle le fichier des textes validés. Toute entrée non conforme bloque (erreur par entrée). */
export function lireTextesFormats(contenu: string, chemin: string): { textes: TexteFormat[]; erreurs: string[] } {
  let brut: unknown;
  try { brut = JSON.parse(contenu); } catch (e) { return { textes: [], erreurs: [`${chemin} : JSON illisible (${(e as Error).message}).`] }; }
  const fichier = z.object({ textes: z.array(z.unknown()) }).passthrough().safeParse(brut);
  if (!fichier.success) return { textes: [], erreurs: [`${chemin} : objet { "textes": [...] } attendu.`] };
  const textes: TexteFormat[] = [];
  const erreurs: string[] = [];
  const ids = new Set<string>();
  fichier.data.textes.forEach((x, i) => {
    const r = texteFormatSchema.safeParse(x);
    if (!r.success) { erreurs.push(`${chemin}, entrée ${i + 1} : ${r.error.issues.map((q) => `${q.path.join(".") || "entrée"} ${q.message}`).join(" ; ")}.`); return; }
    const e = ecartsEntree(r.data);
    if (ids.has(r.data.id)) e.push("id en double");
    ids.add(r.data.id);
    if (e.length) erreurs.push(`${chemin}, ${r.data.id} : ${e.join(" ; ")}.`);
    else textes.push(r.data);
  });
  return { textes, erreurs };
}

/**
 * Ordre du repli pour une case sans vanne au niveau (`mix-formats-s15.md` §2) : conseil (X et Instagram, jamais
 * LinkedIn), ligne d'article notée, carrousel R9 (Instagram, case du mercredi), quiz seul (X, case du mercredi :
 * « vanne + quiz si vanne, sinon quiz seul, sinon conseil »), relais LinkedIn à angle travail (LinkedIn seul).
 */
export function ordreRepli(pf: PreparedPlatform, t: TypeCase): FormatMix[] {
  if (pf === "LINKEDIN") return ["relaisLinkedIn"];
  if (pf === "TWITTER" && t === "VANNE_QUIZ") return ["quiz", "conseil", "ligne"];
  if (pf === "INSTAGRAM" && t === "DECRYPTAGE") return ["carrousel", "conseil", "ligne"];
  return ["conseil", "ligne"];
}

/** Conseils « mardi et vendredi d'abord » : ces cases sont servies avant les autres (0 avant 1), puis par date. */
export function prioriteRepli(jourSemaine: number): number {
  return jourSemaine === 2 || jourSemaine === 5 ? 0 : 1;
}

export const jjmm = (date: string) => `${date.slice(8, 10)}/${date.slice(5, 7)}`;
const RESEAU_FR: Record<PreparedPlatform, string> = { TWITTER: "X", INSTAGRAM: "Instagram", LINKEDIN: "LinkedIn" };

/** Erreur de créneau sans texte validé : par créneau et par format (commande de textes pour @copywriter). */
export function erreurSansTexte(date: string, pf: PreparedPlatform, attendu: FormatMix, autres: FormatMix[], detail?: string): string {
  const suite = autres.length ? ` ; à défaut : ${autres.map((f) => LIBELLE_FORMAT[f]).join(", ")}` : "";
  return `${date} ${pf} : créneau du ${jjmm(date)} (${RESEAU_FR[pf]}) : repli du mix sans texte validé (format attendu : ${LIBELLE_FORMAT[attendu]}${suite})${detail ? ` ; ${detail}` : ""}.`;
}
