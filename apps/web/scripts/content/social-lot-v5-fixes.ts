/**
 * Posts placés à leur date dans le lot de relance v5 (s15). Sources :
 *  - VALIDE : les 9 posts validés par Thomas (`validation-thomas-s15.md`, gagnants
 *    des duels `duels-resultat-cycle5.md`) ;
 *  - V5 : cases nommées du calendrier v5 (§3) et spec des cartes (§8).
 * Les vannes sont relues dans le catalogue (jokeId) ou dans l'article (slug + rang,
 * ou texte exact vérifié dans le contenu) au moment du plan : un écart = erreur.
 */
import type { PreparedPlatform } from "./social-controls";

export type OrigineFixe = "VALIDE" | "V5";
export type TypePost = "VANNE" | "VANNE_QUIZ" | "RELAIS" | "PIVOT" | "DECRYPTAGE" | "SITUATION";

export interface VanneFixe {
  jokeId?: string;
  /** Ligne d'article par rang (`LigneArticle.rang`). */
  article?: { slug: string; rang: number };
  /** Ligne d'article par texte exact (vérifié dans le contenu de l'article). */
  articleTexte?: { slug: string; texte: string };
}

export interface Fixe {
  cle: string;
  date: string;
  platform: PreparedPlatform;
  type: TypePost;
  origine: OrigineFixe;
  vanne?: VanneFixe;
  /** Texte de marque complet au « tu » (L2, L3), repris tel que validé. */
  texteMarque?: string;
  /** Renvoi après la vanne (X, LinkedIn), suivi du lien. */
  renvoi?: string;
  lien?: { chemin: string; content: string };
  /** Instagram : légende telle que validée. */
  legende?: string;
  /** Instagram : cartes imposées (sinon amorce et chute de la vanne). */
  cartes?: string[];
  /** Relais sans lien dont la vanne vient du catalogue (Instagram) : slug relayé, marqueur `[article:]` lu par la garde. */
  article?: string;
  note?: string;
}

/** Relais imposé dont la ligne est tirée dans l'article (v5 §3 : 31/12, 01/01). */
export interface RelaisForce {
  date: string;
  platform: PreparedPlatform;
  slug: string;
  utmContent: string;
  note: string;
}

const SE_PRESENTER = "/blog/se-presenter-avec-humour";

export const FIXES: Fixe[] = [
  { cle: "relais-x-12-10", date: "2026-10-12", platform: "TWITTER", type: "RELAIS", origine: "V5",
    vanne: { jokeId: "cs14jkd6b11e811ffbf7f301" }, renvoi: "Les 4 autres exemples, et comment trouver le tien :",
    lien: { chemin: SE_PRESENTER, content: "lundi" }, note: "v5 §3 S1 : accroche 2 de l'article (catalogue)." },
  { cle: "IG2", date: "2026-10-12", platform: "INSTAGRAM", type: "RELAIS", origine: "VALIDE",
    vanne: { jokeId: "cs14jk8f28ff20e1cf82f3a8" }, article: "se-presenter-avec-humour",
    legende: "À envoyer à qui a un tour de table demain. Les 4 autres exemples : lien en bio." },
  { cle: "X1", date: "2026-10-13", platform: "TWITTER", type: "VANNE", origine: "VALIDE", vanne: { jokeId: "cmmnsqn130027th63at2ene9i" } },
  { cle: "L3", date: "2026-10-13", platform: "LINKEDIN", type: "RELAIS", origine: "VALIDE",
    texteMarque: "Au tour de table, tu es le suivant, et celui d'avant vient d'évoquer sa boîte montée à 19 ans. Ta présentation commence par « Bonjour, moi c'est » et se termine au même endroit. Voici 5 accroches pour la prolonger, et comment trouver la tienne :",
    lien: { chemin: SE_PRESENTER, content: "relais" } },
  { cle: "IG3", date: "2026-10-14", platform: "INSTAGRAM", type: "DECRYPTAGE", origine: "VALIDE",
    vanne: { jokeId: "cs14jk04b4bc8bbf8a2d8a05" },
    cartes: [
      "J'ai découvert que\nmes potes avaient\nun groupe sans moi.\nJ'ai boudé trois jours.",
      "Il s'appelait “Anniv de Léa”. Léa, c'est moi.",
      "Pourquoi ça fait rire : celui qui boude trois jours est l'invité d'honneur, et la preuve se trouvait dans le titre du groupe.",
      "À toi de jouer : repense à un moment où tu t'es cru mis de côté, puis cherche le détail qui prouvait le contraire.",
      "Le quiz est dans le lien de la bio.",
    ],
    legende: "À envoyer à celui qui n'est jamais sûr d'être invité. deviens-marrant.fr" },
  { cle: "L1", date: "2026-10-15", platform: "LINKEDIN", type: "VANNE", origine: "VALIDE", vanne: { jokeId: "cs14jka89abf28d3769b05fe" } },
  { cle: "X3", date: "2026-10-21", platform: "TWITTER", type: "VANNE_QUIZ", origine: "VALIDE", vanne: { jokeId: "cs14jk50c85bb0d73deaebaf" },
    renvoi: "Ça, c'est de l'humour d'Observateur. Et toi, lequel des 5 profils d'humour est le tien ? Environ 2 minutes, sans inscription :",
    lien: { chemin: "/quiz-humour", content: "quiz" } },
  { cle: "X2", date: "2026-10-22", platform: "TWITTER", type: "RELAIS", origine: "VALIDE", vanne: { jokeId: "cs14jk0e4fedaac1a91fddf1" },
    renvoi: "Les 21 messages de l'article sont prêts à copier :",
    lien: { chemin: "/blog/message-anniversaire-drole-par-situation", content: "jeudi" } },
  { cle: "relais-ig-22-10", date: "2026-10-22", platform: "INSTAGRAM", type: "RELAIS", origine: "V5",
    vanne: { article: { slug: "message-anniversaire-drole-par-situation", rang: 13 } },
    legende: "Les 20 autres textes : lien en bio.", note: "v5 §3 S2 : IG n°13 de l'article." },
  { cle: "li-22-10", date: "2026-10-22", platform: "LINKEDIN", type: "VANNE", origine: "V5", vanne: { jokeId: "cs14jk69eb578cce484b6f87" },
    note: "v5 §3 S2 : repli de la n°6 de l'article (aucune note à l'aveugle de la n°6 seule n'est connue)." },
  { cle: "relais-x-26-10", date: "2026-10-26", platform: "TWITTER", type: "RELAIS", origine: "V5", vanne: { jokeId: "cs14jkf0a20e0837fa95c784" },
    renvoi: "Les 5 autres sont prêtes à copier :", lien: { chemin: "/blog/blagues-sur-l-ia-assistants-vocaux", content: "lundi" },
    note: "v5 §3 S3 : n°5 de l'article." },
  { cle: "relais-ig-26-10", date: "2026-10-26", platform: "INSTAGRAM", type: "RELAIS", origine: "V5", vanne: { jokeId: "cs14jke6736001250d3a940d" },
    article: "blagues-sur-l-ia-assistants-vocaux",
    legende: "À envoyer à qui t'a fait lire son roman. Les 5 autres vannes : lien en bio.", note: "v5 §8 : n°4 de l'article." },
  { cle: "IG1", date: "2026-10-27", platform: "INSTAGRAM", type: "VANNE", origine: "VALIDE", vanne: { jokeId: "cs14jke5d015b07714055538" },
    legende: "À envoyer à ton tuteur de stage. deviens-marrant.fr" },
  { cle: "L2", date: "2026-10-29", platform: "LINKEDIN", type: "SITUATION", origine: "VALIDE",
    texteMarque: "Ton manager t'écrit « t'as deux minutes ? » et rien d'autre. Tu passes les quatre minutes suivantes à t'inventer trois fautes graves, dont une dans un dossier que tu n'as jamais ouvert. Il voulait le code du photocopieur." },
  { cle: "halloween-x", date: "2026-10-30", platform: "TWITTER", type: "PIVOT", origine: "V5",
    vanne: { article: { slug: "blagues-halloween-soiree-deguisee", rang: 3 } }, renvoi: "Les 7 autres sont prêtes à copier :",
    lien: { chemin: "/blog/blagues-halloween-soiree-deguisee", content: "saison" }, note: "v5 §3 S3 : pivot Halloween, ligne n°3." },
  { cle: "halloween-ig", date: "2026-10-30", platform: "INSTAGRAM", type: "VANNE", origine: "V5", vanne: { jokeId: "cs14jk1bc86d3502a2cef27b" },
    legende: "À envoyer à qui a un date pour Halloween. deviens-marrant.fr" },
  { cle: "toast-x", date: "2026-11-30", platform: "TWITTER", type: "RELAIS", origine: "V5",
    vanne: { articleTexte: { slug: "toast-drole-discours-qui-fait-rire", texte: "J'ai tapé sur mon verre pour demander le silence. Quelqu'un a demandé « c'est pour un mariage ? ». J'ai dit non. Il y a eu de la déception." } },
    note: "v5 §3 S8 : vanne neuve de l'article validée à l'aveugle (« c'est pour un mariage ? »)." },
  { cle: "toast-ig", date: "2026-11-30", platform: "INSTAGRAM", type: "RELAIS", origine: "V5",
    vanne: { articleTexte: { slug: "toast-drole-discours-qui-fait-rire", texte: "J'ai préparé mon toast sur une fiche, avec mes meilleures phrases soulignées. Dans le trac, j'ai tout lu, sauf les phrases soulignées." } },
    note: "v5 §3 S8 : vanne neuve de l'article validée à l'aveugle (« tout lu, sauf les phrases soulignées »)." },
  { cle: "noel-x-24", date: "2026-12-24", platform: "TWITTER", type: "VANNE", origine: "V5", vanne: { jokeId: "cs14jkee5c537f7286c1da98" } },
  { cle: "noel-ig-24", date: "2026-12-24", platform: "INSTAGRAM", type: "VANNE", origine: "V5", vanne: { jokeId: "cs14jk4fe660e7238281ce47" } },
  { cle: "noel-x-25", date: "2026-12-25", platform: "TWITTER", type: "VANNE", origine: "V5", vanne: { jokeId: "cs14jkc4a2c545e132b38a92" } },
  { cle: "noel-ig-25", date: "2026-12-25", platform: "INSTAGRAM", type: "VANNE", origine: "V5", vanne: { jokeId: "cs14jkffeab1620070f2263e" },
    note: "Motif « pain » : seul du lot (fenêtre de 30 jours)." },
];

export const RELAIS_FORCES: RelaisForce[] = [
  { date: "2026-12-31", platform: "TWITTER", slug: "voeux-drole-nouvelle-annee", utmContent: "saison", note: "v5 §3 S12 : relais vœux, pivot saisonnier." },
  { date: "2026-12-31", platform: "LINKEDIN", slug: "voeux-drole-nouvelle-annee", utmContent: "saison", note: "v5 §3 S12 : relais vœux LinkedIn." },
  { date: "2027-01-01", platform: "TWITTER", slug: "voeux-drole-nouvelle-annee", utmContent: "saison", note: "v5 §3 S12 : message de vœux." },
];

/** Carrousels « avec citation d'humoriste » (v5 §1) : citation à fournir, repli sans citation. */
export const CARROUSELS_CITATION = ["2026-10-28", "2026-11-04", "2026-12-02"];
/** 17/12 : lien `saison` seulement si la refonte 2027 est en ligne la veille, sinon vanne simple. */
export const REFONTE_17_12 = "2026-12-17";
