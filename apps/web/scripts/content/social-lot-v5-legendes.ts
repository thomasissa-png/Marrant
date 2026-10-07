/**
 * Légendes Instagram « À envoyer à... » rattachées à la VANNE (clé : id catalogue ou `slug#rang`),
 * jamais au créneau : le lot est régénéré, la légende suit la vanne (`corrections-cycle7-copy.md` §3).
 * [CHOIX UTILISATEUR] 06/10 (`founder-preferences.md` l.67) : légendes SANS « deviens-marrant.fr ».
 *
 * Aucun texte n'est écrit ici : chaque ligne est recopiée des livrables @copywriter, avec sa source.
 * Rattachement vérifié vanne par vanne (texte des cartes de `lot-relance-s15.json` contre la colonne
 * « Vanne » des tableaux). Une vanne absente de cette table = erreur bloquante du dry-run (légende
 * à fournir par @copywriter, puis ajoutée ici).
 *
 * Relais : la légende est « À envoyer à... » + espace + renvoi généré (« Les N autres ... : lien en bio. »).
 */
export const LEGENDES_IG: Record<string, string> = {
  // complements-lot-s15.md §3 (cartes vanne, cycle 7)
  cmmnsqn15007xth63p3dzv6pc: "À envoyer à ton pote qui s'enflamme à chaque morceau.",
  cmmw0tois0002mw62b7bkcvj7: "À envoyer à qui dit encore cinq minutes.",
  cs14jk7911857c4ff09eb025: "À envoyer à ton homonyme.",
  cs14jk0761c9f2d885762bb5: "À envoyer à ton voisin de palier.",
  cs14jk9de039def971586501: "À envoyer à celui qui paie un loyer trop cher.",
  cs14jk0ae967eb481a4ecc4f: "À envoyer à ton coéquipier de jeu en ligne.",
  cs14jk360d10ea650e662770: "À envoyer à qui a prévu une soirée série ce soir.",
  cs14jk45ee75c68d340d52f2: "À envoyer à qui visite un musée ce week-end.",
  cs14jk8c54311509a1108b0a: "À envoyer à qui a une boulangerie attitrée.",
  cs14jk90226d6abb90287724: "À envoyer à ta mère, juste pour voir.",
  // §3, 20/11 : ligne visio après permutation ; la vanne du lit garde la légende du « repli si refus ».
  "humour-en-visio-reunion-en-ligne#5": "À envoyer à qui blague dans le chat de la réunion.",
  cs14jkbe6b6bc15755d06863: "À envoyer à qui dort toujours du même côté du lit.",
  cmmnsqn130038th63fxn1wvhn: "À envoyer à qui rassure sa mère le dimanche.",
  cs14jk2ef0aabfbf4784ad82: "À envoyer à qui garde sa mère en favoris.",
  cs14jkdbc8310a260d111f1d: "À envoyer à qui a un premier rendez-vous cet hiver.",
  cs14jk4e0348d6f06a41d826: "À envoyer à celui qui doit faire un discours.",
  cmmnsqn12000hth63y5wqmb9d: "À envoyer à ton chat, avec ménagement.",
  cmnz0jqsx000rs60xrbrqm8kk: "À envoyer à qui ne sait jamais où dîner.",
  cmmnsqn14004nth638k89q5ig: "À envoyer à ton oncle, avant qu'il commence.",
  cs14jkfc1715f1d4c7509f3b: "À envoyer à celui qui reporte tout à demain.",
  cs14jk5828aab353759ef4d5: "À envoyer à qui n'appelle ses parents qu'en cas de souci.",
  cmmnsqn150074th63m5g2yqip: "À envoyer à qui a un contact à bloquer.",
  cs14jk4fe660e7238281ce47: "À envoyer à ta grand-mère, avant le repas.",
  cs14jkffeab1620070f2263e: "À envoyer à qui s'éclipse des repas de famille.",
  "blagues-de-couple-drole#13": "À envoyer à qui partage son frigo avec quelqu'un.",
  cs14jk72ac436450535a3c29: "À envoyer à qui passe le réveillon en famille.",
  "blagues-de-gamer-jeux-video#23": "À envoyer à celui qui a pris de bonnes résolutions.",
  // §3, bonus (carrousels du lot long)
  "blagues-halloween-soiree-deguisee#7": "À envoyer à qui a un neveu qui l'imite.",
  cmmw0togs0001mw62152nl589: "À envoyer à qui suit son GPS sans réfléchir.",
  // complements-lot-s15.md §2 (relais Instagram, partie « À envoyer à... »)
  cs14jkb03209d55cbfc17448: "À envoyer à celui qui s'excuse d'avance.",
  cs14jkd11f7913f8177df395: "À envoyer à celui qui adore les gadgets.",
  cs14jk177b62432b07f5d17a: "À envoyer à celui qui a un oral bientôt.",
  cmozb1ocr006ws60yraru87yn: "À envoyer à celui qui est au régime.",
  cs14jkbe889a47471bf8cbeb: "À envoyer à celui qui apporte les crudités.",
  "repas-de-famille-questions-genantes-humour#8": "À envoyer à ton conseiller bancaire.",
  "toast-drole-discours-qui-fait-rire#3": "À envoyer à celui qui fera le toast.",
  cs14jk626438b67f197925d2: "À envoyer à ton petit frère.",
  cmmnsqn130033th63b54ux45o: "À envoyer à celui qui vient d'emménager.", // V028, réservée au carrousel du 21/10
  cmnz37u510010s60xj40i8lqu: "À envoyer à ceux qui se disputent pour dîner.",
  "humour-en-visio-reunion-en-ligne#3": "À envoyer à celui qui se connecte en avance.",
  // complements-lot-s15.md §1 (carrousels, colonne « Vanne (JOKE) » du 1er tableau)
  cs14jkb81aae613b293f204b: "À envoyer à celui qui se dit gamer.",
  cs14jk20142f9a641e8ea80f: "À envoyer à celui qui a le sommeil léger.",
  cs14jkbdb9858fdd496e962a: "À envoyer à ton voisin de table.",
  cs14jk577fa779cb48fa9b55: "À envoyer à qui ment un peu à son médecin.", // V060, réservée au carrousel du 09/12
  cmp9fpyd4006ys60xwsegez9e: "À envoyer à qui part en festival cette année.",
  // corrections-cycle7-copy.md §2 (V083, fuite sous l'évier)
  cs14jka3336e7e90a453a9d6: "À envoyer à celui qui répare tout, bientôt.",
};

/** Plafond R3 (`corrections-cycle6-copy.md` §3) : 80 caractères, relais renvoi compris. */
export const LEGENDE_MAX = 80;

/** Légende Instagram conforme : « À envoyer à », 80 caractères au plus, ni lien ni « deviens-marrant ». Vide = conforme. */
export function ecartsLegende(legende: string): string[] {
  const e: string[] = [];
  if (!legende.startsWith("À envoyer à ")) e.push("légende sans « À envoyer à » en tête");
  if (legende.length > LEGENDE_MAX) e.push(`légende de ${legende.length} caractères (plafond ${LEGENDE_MAX})`);
  if (/https?:\/\/|www\./i.test(legende)) e.push("lien dans la légende");
  if (/deviens-marrant/i.test(legende)) e.push("« deviens-marrant » dans la légende ([CHOIX UTILISATEUR] du 06/10)");
  return e;
}

/** Tournure de la légende (« celui qui », « ceux qui », « qui », « ton / ta / tes ») : jamais 2 fois de suite sur Instagram. */
export function tournure(legende: string): string {
  const suite = legende.replace(/^À envoyer à /, "");
  const m = suite.match(/^(celui qui|celle qui|ceux qui|qui|ton|ta|tes)\b/);
  return m ? (["ton", "ta", "tes"].includes(m[1]) ? "ton/ta" : m[1]) : "autre";
}
