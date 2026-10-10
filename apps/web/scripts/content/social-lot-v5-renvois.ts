/**
 * Renvois de relais sans formule exacte de la v5, tranchés à l'aveugle (lot 1b, révision 7 :
 * `aveugle-1b-r7-resultat.md`, textes de `aveugle-1b-r7.md` par numéro M, clé `aveugle-1b-r7-CLE-ne-pas-ouvrir.json`).
 * Aucun texte n'est écrit ici : chaque renvoi est recopié mot pour mot, avec sa source.
 *
 * Clé : `réseau|slug|vanne montrée` (id catalogue ou `slug#rang`). Le renvoi suit la vanne : vrai pour cette
 * ligne (« 4 autres moments » quand la ligne montrée est le 1er), il ne l'est pas forcément pour une autre.
 * Servi seulement quand la v5 n'a pas de formule exacte (`renvoi` de `social-lot-v5.ts`).
 * X : renvoi avant le lien, terminé par « : ». Instagram : après la légende retenue, « lien en bio » une seule fois.
 */
import type { PreparedPlatform } from "./social-controls";

export const cleRenvoi = (pf: PreparedPlatform, slug: string, vanne: string): string => `${pf}|${slug}|${vanne}`;

export const RENVOIS_RELUS: Record<string, string> = {
  // 3a (M20, 8,8 / 8,5) : X lun. 19/10, colocation, ligne n°1 (la poêle).
  [cleRenvoi("TWITTER", "humour-en-colocation-desamorcer-tensions", "humour-en-colocation-desamorcer-tensions#1")]:
    "Les 5 situations de coloc, avec la phrase qui détend et celle qui envenime :",
  // 4b (M18, 8,8 / 8,5) : X lun. 02/11, visio, ressort 1 (« dix minutes seul avec mon visage »).
  [cleRenvoi("TWITTER", "humour-en-visio-reunion-en-ligne", "humour-en-visio-reunion-en-ligne#3")]:
    "4 autres moments de visio, et que faire si la chute tombe à plat :",
  // 6b (M16, 8,5 / 8,5) : IG jeu. 29/10, appli de rencontre, vanne du TGV (hors article), après L24.
  [cleRenvoi("INSTAGRAM", "premier-message-drole-appli-de-rencontre", "cs14jk76ca7ad32cce9041ce")]:
    "Écrire à un match : lien en bio.",
  // 7a (M12, 8,5 / 8,5) : IG lun. 02/11, visio, vanne du théâtre (hors article), après L19.
  [cleRenvoi("INSTAGRAM", "humour-en-visio-reunion-en-ligne", "cs14jkbc3334e2de46753dcf")]:
    "Le silence en visio : lien en bio.",
};

/**
 * Relais Instagram dont aucun renvoi n'a passé la barre : repli prévu par la clé r7 (« Instagram légende retenue
 * seule »). Le post part avec la seule légende « À envoyer à... », sans renvoi, et le dry-run ne lève pas
 * « renvoi manquant ». La légende reste exigée (« légende manquante » sinon).
 */
export const RELAIS_IG_SANS_RENVOI: ReadonlySet<string> = new Set([
  // IG lun. 19/10, colocation, vanne du concert : 5c 7,5 / 8, 5a 7 / 7, 5b 6,5 / 6,5 ; L38 seule.
  cleRenvoi("INSTAGRAM", "humour-en-colocation-desamorcer-tensions", "cs14jkd9058d03e24961004a"),
]);
