# Corrections cycle 8, copy sociale (@copywriter, 07/10/2026, reprise après redémarrage)

> Sources : `notation-relance-cycle8-social.md` §4 (S7, S8, C4 à C7, D5) et `notation-relance-cycle8-reviewer.md` §3 (points 2, 3, 5, 6). Rien codé, rien publié. Limite : pas de shell dans cette session, donc pas de `git pull`, de dry-run, de SELECT ni de commande de comptage ; tout ce qui demande l'un d'eux est `[À VÉRIFIER @fullstack]`. Choix de Thomas respectés, aucun rejoué : formule X3 signée (« lequel des 5 profils d'humour est le tien »), barre Alexa, humoristes et IA comme sujet autorisés, bios signées.
> **Règle de statut** : un texte neuf n'est publiable qu'avec 8,5 ou plus chez les 2 relecteurs (`preparation/aveugle-textes-neufs-cycle8.md`, 25 textes nus ; clé séparée `-CLE-ne-pas-ouvrir.json`).

## 1. Statut point par point

| Point | Statut | Fichier |
|---|---|---|
| S7 pieds des légendes IG | **Fait dans le code** (relu : IG3 l.75, IG1 l.96, Halloween l.103 sans pied ; relais 22/10 l.85 avec « À envoyer à ton hôte d'anniversaire. »). Reste le contrôle automatique (§3, point 2) | `scripts/content/social-lot-v5-fixes.ts` |
| S8 garde de pose du lien de bio | **Fait côté docs** (banque règle 9, situations 5 et 6, fiche 21/10). **Reste côté code** : IG3 partie 5 (§3, point 3) | `banque-reponses.md`, `preparation/fiche-ig-21-10.md` |
| C4 relecture à l'aveugle des légendes 08/10, 09/10, 21/10 | **Préparée** : T24, T04, T15 (plus T19, T10, T23 des pieds corrigés). Notes des 2 relecteurs attendues | `aveugle-textes-neufs-cycle8.md` |
| C5 LinkedIn sans vanne de bureau | **6 situations neuves préparées** (T01, T05, T09, T12, T17, T20), toutes à l'aveugle. Décision après notes (§2) | idem |
| C6 fiche du 21/10 | **Fait** : mécanisme lu dans `vannes-actives-s17.json` l.382-391 (« La litote prise au sérieux »), cartes 3 et 4 réécrites sur la fiche, une paire « » sur la carte 1, légende de 48 caractères sans pied, renvoi sous garde. Reste le SELECT de la base | `fiche-ig-21-10.md` |
| C7 monotonie « copain / copine » | **Spécifié** pour @fullstack (§3, point 4). Aucune vanne publiée ou validée n'est retouchée | ce fichier |
| Variété des tournures (banque, légendes) | **Fait** : 6 variantes 3 s'ouvrant chacune autrement, 1 version « sans bio » ; tournures de légende contrôlées sur la séquence 20 au 23/10 | `banque-reponses.md` |
| Renvoi du X du 12/10 (reviewer K5 b) | **À l'aveugle** : T08 (en code) contre T16 (alternative) | `aveugle-textes-neufs-cycle8.md` |
| Renvoi de X3 du 21/10 (formule signée intacte) | **À l'aveugle** : T21 (en code, « Humour d'Observateur. ») contre T03 (« C'est un Observateur. ») | idem |
| Reviewer K5 c : V083 au 23/12 dans CL:18 et REC:48/58 | **Fait** dans cette session (§4) | `preparation/complements-lot-s15.md`, `preparation/recoupements-07-10.md` |
| Reviewer K5 résidu : stock 22 contre 23 (D1a:66) | **Non résolu sans shell** (§4) | ce fichier |
| Reviewer K5 résidu : PE:45 `[À VÉRIFIER]` bureau | Texte prêt, à poser par la session (fichier interdit pour moi) (§5) | ce fichier |

## 2. Décisions à prendre après les notes de l'aveugle

Règle : au niveau = 8,5 ou plus chez les 2. Entre variantes d'un même emplacement, la meilleure somme gagne ; à égalité, celle déjà en code reste.

| Groupe | Textes | Si échec |
|---|---|---|
| Renvoi X 12/10 | T08 (en code) / T16 | T16 si T08 échoue, sinon renvoi PRATIQUE de la v5 l.32 |
| X3 21/10 | T21 (en code) / T03 | T21 reste si T03 échoue ; formule signée dans les deux |
| Carrousel 21/10 cartes 3 et 4 | T06 (fiche, E2) / T13 (cycle 7, E1) | E1 sans pied si au niveau, sinon vanne libre qui a une fiche écrite |
| Légende 21/10 | T15 | réécrire avant le 14/10 |
| Légendes 08/10 et 09/10 | T24, T04 | réécrire avant 17:30Z le jour même |
| Légendes 14/10, 27/10, 30/10 | T19, T23, T10 | réécrire avant l'insertion du 09/10 (T19) ou le lot 2a |
| LinkedIn bureau | T01, T05, T09, T12, T17, T20 | retirer ceux sous 8,5 ; il faut au moins 2 survivants pour remplir les 2 bras du test image. S'il en reste moins de 2 : deuxième tour de 6 situations neuves sur les remarques des relecteurs. **Ne pas** passer à des vannes domestiques en changeant bio et couverture (bios signées) |
| Réponses | T22, T11, T02, T25, T18, T07, T14 | la variante échouée est retirée, les variantes 1 et 2 restent |

## 3. À appliquer par @fullstack (textes exacts)

Fichier : `apps/web/scripts/content/social-lot-v5-fixes.ts` sauf mention. Les entrées ci-dessous n'entrent qu'après les notes de l'aveugle (§2).

**1. Fiche du mer. 21/10 19:30 (lot 1b), à ajouter dans `FIXES` après `X3`** (V028 `cmmnsqn130033th63b54ux45o`, `[À VÉRIFIER]` le SELECT de la technique en base, voir `fiche-ig-21-10.md`) :

```ts
{ cle: "IG-21-10", date: "2026-10-21", platform: "INSTAGRAM", type: "DECRYPTAGE", origine: "V5",
  vanne: { jokeId: "cmmnsqn130033th63b54ux45o" },
  cartes: [
    "Mon père a vu mon appart.\nIl a dit “c'est pas mal”.",
    "Je lui ai demandé de me le mettre par écrit.",
    "Pourquoi ça fait rire : dire pas mal est un compliment minuscule, que le narrateur traite comme un éloge assez rare pour être encadré, donc à confirmer par écrit.",
    "À toi de jouer : repense à un compliment tiède que tu as reçu, puis traite-le comme un éloge rare, avec la solennité qui va avec.",
    "Le quiz est dans le lien de la bio.",
  ],
  legende: "À envoyer à celui qui attend un vrai compliment." },
```
Cartes 1 et 2 : une seule paire « » autour des deux phrases de la ligne 1, césure après « appart. », “c'est pas mal” en “ ” imbriqués (R6) ; `[À VÉRIFIER]` sur la capture `slide=0` (la saisie ci-dessus suit le modèle IG3, le rendu ajoute les « »). Si E1 (T13) l'emporte à l'aveugle, remplacer les deux cartes 3 et 4 par le texte de T13 (carte 3 « Pourquoi ça fait rire : un père qui dit pas mal a atteint son maximum d'éloge, et le fils exige ce compliment par écrit, comme un diplôme. », carte 4 « À toi de jouer : repense à un compliment tiède que tu as reçu, puis demande poliment qu'on te le confirme par écrit. »), la légende restant sans pied.
Exclure du tirage du pool V028 et V060 (`cs14jk577fa779cb48fa9b55`, 09/12) : liste lue par `libre()` (reviewer K5 d), pas de reprise de V028 sur X avant le 18/11 ni sur Instagram avant le 19/01.

**2. Contrôle par légende IG au dry-run** (S7) : commence par « À envoyer à », au plus 80 caractères (relais : renvoi compris), ni lien ni « deviens-marrant », et tournure différente de celle de la légende Instagram précédente.

**3. Garde du renvoi à la bio (S8)** : la partie « Le quiz est dans le lien de la bio. » (IG3 l.73, carte 5 de `IG-21-10` ci-dessus) ne part que si `mesure.md` §3 porte une date dans « Posé le » pour Instagram, relue la veille. Sinon, le post a 4 parties et la carte 4 garde sa consigne sans la phrase du quiz. Aucune lecture de `mesure.md` dans le code : contrôle manuel le 13/10 et le 20/10. Même garde pour les relais dont la légende finit par « lien en bio » (22/10, 26/10, IG2 déjà validé par Thomas : ne pas toucher). Version sans bio, par troncature seule : relais 22/10 « À envoyer à ton hôte d'anniversaire. » ; relais 26/10 « À envoyer à qui t'a fait lire son roman. ».

**4. Plafond « copain / copine » (C7)** `[HYPOTHÈSE : seuil de 2 par semaine, à valider]`, sur le modèle de « pain » (`social-lot-v5-config.ts:48-51`) :
```ts
export const COPAIN_RE = /(^|[^\p{L}])(copain|copine|copains|copines)(?=[^\p{L}]|$)/iu;
export const PLAFOND_COPAIN_PAR_SEMAINE = 2; // lundi au dimanche, tous réseaux, replis exclus
```
Posts concernés dans le dry-run 1a : IG 13/10 (V083 « Mon copain a dit… »), X 14/10 (« Ma copine a fait le tri… »), X 15/10 (« Mon copain : Choisis le resto… »), soit 3 pour un plafond de 2. Au dry-run S5, tout dépassement est remplacé par la suivante de la liste libre sans le motif. Aucune vanne publiée, validée (X1, IG2, L1, IG3) ou de la semaine 0 n'est retouchée.

**5. Renvois à reprendre si l'aveugle les retient** : relais X 12/10, `renvoi: "Comment trouver la tienne, avec 5 exemples avant/après :"` (T16, environ 218 caractères comptés X) ; X3 21/10, `renvoi: "C'est un Observateur. Et toi, lequel des 5 profils d'humour est le tien ? Environ 2 minutes, sans inscription :"` (T03, 268 comptés X, sous 270 mais serré : relancer `longueurX`).

**6. Banque de réponses** : aucun code ; copier les variantes retenues dans l'outil de réponse s'il existe, sinon rien à faire (les réponses sont manuelles, règle 24 h).

## 4. Corrections de fichiers faites dans cette session

- `preparation/complements-lot-s15.md` l.18 : cellule V083 remplacée (le lot 1a tire V083 le 13/10, 71 jours avant le 23/12).
- `preparation/recoupements-07-10.md` l.48 et l.58 : « aucune vanne à changer » devient « V083 à changer au 23/12 ».
- **Contradiction S6 (@social) contre K5 c (@reviewer), tranchée** : S6 exclurait V083 du tirage du 13/10 pour la garder au 23/12 ; K5 c la laisse sortir le 13/10 et change le 23/12. Retenu : K5 c (le contrôle de clôture du reviewer est un Grep sur ces deux fichiers), donc **V083 n'est pas exclue du tirage**, et le carrousel du 23/12 attend une autre vanne du pool avec fiche neuve, à livrer avec le lot 2b (23/11) et à passer à l'aveugle. Les deux exclusions de S6 qui restent : V060 et V028. Le choix inverse (garder V083 au 23/12) coûte moins et reste possible tant que le lot 1a n'est pas inséré (09/10) : @fullstack l'exclut alors du tirage et ces deux cellules reviennent à leur texte d'origine.
- **Stock 22 contre 23** : l'arithmétique des fichiers est 40 (pool strict) moins 3 exemptées moins 10 de la semaine 0 moins 4 de Noël = 23, puis 21 avec V060 et V083, donc 20 avec V028 (liste libre `recoupements-07-10.md` l.67). Le script annonce 22 sans détailler. Je ne peux pas rejouer `--pool strict` sans shell : `[À RECOMPTER @fullstack]`, avec le détail des exclusions imprimé par le script.

## 5. Pour la session (fichiers que je ne modifie pas)

- `plan-execution-s15.md` l.45, remplacer « `[À VÉRIFIER]` : 48 posts, vannes de bureau au niveau à compter le 07/10 » par « 0 vanne de bureau libre au niveau au 12/10 (`recoupements-07-10.md` §3) : repli du mix (V5:31, 2e relais à angle travail) jusqu'à V1, plus 6 situations LinkedIn à l'aveugle (`aveugle-textes-neufs-cycle8.md`, C5) ».
- `mesure.md` l.154 et l.160, `strategie-relance-v5.md` l.19 : points D5 et K1 de @growth, hors périmètre copy.

## 6. Constat hors liste

`preparation/lignes-articles-notes.json` l.21 : la ligne n°13 de `message-anniversaire-drole-par-situation`, qui sert de relais Instagram le 22/10 (`relais-ig-22-10`, rang 13), est notée « = » puis « < » (`auNiveau: false`). Sous la barre chez un des 2 relecteurs : à remplacer par une des lignes au niveau de l'article (rangs 1, 3, 4, 9, 11, 18 selon `recoupements-07-10.md` l.130) ou à relire. La légende « À envoyer à ton hôte d'anniversaire. » reste valable pour une ligne au niveau.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/social/corrections-cycle8-copy.md`
- Décisions : tout texte neuf passe par `aveugle-textes-neufs-cycle8.md` (25 textes nus, clé à part) ; C5 par 6 situations neuves et jamais par des vannes domestiques ; plafond « copain / copine » à 2 par semaine `[HYPOTHÈSE]`
- Points d'attention : relais IG du 22/10 (rang 13) sous la barre ; stock 22 contre 23 non résolu sans shell ; garde de bio à contrôler à la main les 13/10 et 20/10
---
