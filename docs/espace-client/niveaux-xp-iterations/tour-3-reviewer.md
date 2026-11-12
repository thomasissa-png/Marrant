# Tour 3, relecture à l'aveugle @reviewer : niveaux et XP (s24)

> Relecteur : @reviewer, 12/11/2026. Document noté : `docs/espace-client/niveaux-xp-s24.md` v3 (NX3). Même grille qu'aux tours 1 et 2.

## 1. Statut de mes corrections du tour 2

| T2 | Objet | Statut | Commentaire |
|---|---|---|---|
| Z1 | Inventaire et page des conseils | ok | §1.4 complété ; Q1 B dit « la phrase en ligne de la page des conseils […] est à retoucher, avec ton go ». |
| Z2 | Q4 dépend de Q1 | ok | « chiffres pour Q1 = B : si tu gardes les conseils, l'option A devient 3 000 ». |
| Z3 | [À VÉRIFIER] levables | ok | §1.4 « Faits levés », écart avec le brief cité. Reste un [À VÉRIFIER] sur « palier » : levé ici, et il contredit la reco (A1). |
| Z4 | Table des conseils seulement si A ou C | ok | §2.5 points 1 et 2 ; route supprimée si Q1 = B. Vérifié : aucun autre appelant de `/api/user/xp` dans `apps/` (`apps/mobile` compris), hors tests. |

**Bilan : 4 ok sur 4.**

## 2. Ce qui est nouveau

- **Bon** :
  - noms « du chemin parcouru » avec un test de vérité écrit et passé honnêtement (le palier 3 « Tu as pris ton rythme » est signalé fragile) ;
  - règle C réécrite sur la marche **tentée** (« ça a marché » ne rapporte rien de plus que « bof ») ;
  - « A et C toutes deux déclaratives » ;
  - audit des comptes avant recalcul, avec la liste jamais commitée.
- **Faux** : le mot « palier » n'est pas libre dans les textes client. Le fait transmis par la session (« n'apparaît dans aucun texte client ») est inexact : une recherche sans tenir compte de la casse dans `apps/web/src` le trouve dans des textes en ligne (A1).
- **Fragile** : la Q6 (audit) recommande de baisser l'XP de comptes repérés par un seuil qui ne distingue pas la triche d'un comportement que le site permettait (A2) ; collision de numérotation « Q6 » (A3).

## 3. Notes et corrections

| # | Critère | T1 | T2 | T3 | Justification |
|---|---|---|---|---|---|
| 1 | Exactitude des faits | 5 | 9 | 9 | Sources, totaux et appelant unique justes. « Palier » laissé en [À VÉRIFIER] alors qu'il est employé dans des textes en ligne (A1). |
| 2 | Valeur pour les personas | 8 | 9 | 10 | Noms de chemin, test de vérité, règle C sur l'acte tenté, courbe jamais récompensée : rien à redire. |
| 3 | Ton maison des noms | 7 | 9 | 9 | E1 juste ; palier 3 à trancher entre « Tu as pris ton rythme » et « Tu es bien parti » à l'aveugle (déjà prévu). |
| 4 | Respect des [CHOIX UTILISATEUR] | 6 | 10 | 10 | C4 non reposée, règle C marquée, FAQ intacte. |
| 5 | Qualité des questions | 7 | 9 | 8 | La reco du mot repose sur un fait faux (A1) ; Q6 B fragile (A2) ; deux « Q6 » dans le même document (A3). |
| 6 | Honnêteté des risques | 6 | 9 | 9 | L'audit est bien posé, mais sa limite principale (on ne sait pas d'où vient un écart) n'est pas dite (A2). |
| 7 | Cohérence avec l'architecture | 7 | 10 | 9 | Le [À VÉRIFIER dans v12] sur la série se lève : la v12 ne place pas la série (A4). |

**Note globale : 9,1 / 10** (64 / 70 ; T2 : 9,3). La baisse vient de faits nouveaux, pas d'un recul de l'auteur.

1. **A1. §3.4, tableau du mot, ligne « Collision » : « « palier » […] textes client non recherchés [À VÉRIFIER] » ; reco « palier », « sous réserve d'un contrôle des textes client par @fullstack ; repli : « cap » ».** Problème : le contrôle échoue. « palier » est employé dans des textes en ligne, et dans deux sens qui heurtent la proposition.
   - **Sens « échelle d'exposition »**, dans l'article sur la timidité (`lib/blog-articles.ts`) :
     - l. 2455 : « Clé 5 : La progression par paliers, du petit groupe au grand groupe » ;
     - l. 2466 : « Chaque palier est un niveau à débloquer : tu ne passes au suivant que quand le précédent… » ;
     - l. 2472 : « Le palier 1, c'est maintenant » ;
     - l. 2529 : « Commence par le palier 1 : envoie une vanne par message à un seul ami de confiance ».

     C'est exactement l'échelle des marches de mission de la règle C. « Palier » y veut dire « marche », pas « points ».
   - **Sens « progression des parcours »**, l. 2499 : « Nos parcours structurés sont conçus pour progresser à ton rythme : palier par palier » (et l. 215).
   - « Chaque palier est un niveau à débloquer » contredit en plus « un palier ne débloque rien » (Q5 A).
   - Ailleurs, sens courant sans collision : `joke-decryptages.json` (« La chute par paliers », « sur le palier »), `hebdo-premium.json` l. 91 (« les poubelles du palier »), `anatomie-vanne/page.tsx` l. 84.
   - « cap » reste libre : aucune occurrence dans `config/`, `components/`, les pages, `lib/blog-articles.ts`, `lib/faqs.ts`, `lib/llms-content.ts` ni `data/`.

   Correction : appliquer le repli prévu (« cap ») et remplacer le [À VÉRIFIER] par ces faits. Option à proposer à Thomas : garder « palier » pour la règle C seulement, puisque l'article public appelle déjà ainsi l'échelle d'exposition (« palier 1 : une vanne par message à un ami »). **Bloquant : oui** (la reco du mot soumise à Thomas repose sur un fait faux).
2. **A2. §2.6 « Irrégulier = écart supérieur à 10 × le nombre de conseils actifs (… signature de l'API libre ou des conseils repayés) » et Q6 B (reco) « ramener l'XP à ce que les étapes et bonus justifient ».** Problème : la route ne garde ni l'action ni l'historique des gains (`user/xp/route.ts` l. 48 à 55 : seul le total est incrémenté). L'audit ne peut donc pas distinguer la triche par l'API d'un abonné honnête qui a rouvert des conseils, comportement que le site payait de lui-même à chaque visite. La reco B peut baisser les points d'un abonné pour un défaut du site.

   Un indice partiel existe : toutes les sources honnêtes sont des multiples de 5 (étapes de 50 à 200 par pas de 25, bonus 100, conseil 10). Un XP actuel qui n'est pas multiple de 5 prouve l'usage de l'API ; un multiple de 5 ne prouve rien.

   Correction : dire cette limite ; recommander A (laisser) par défaut ; réserver B aux comptes de test et aux comptes où l'API est prouvée, compte par compte avec Thomas. **Bloquant : non.**
3. **A3. Numérotation : la Q6 de ce document (audit des comptes) et « la cloche […] (Q6 du 12/11) » en §2.4 et en « Déjà décidé ».** Problème : deux « Q6 » différentes dans le même document lu par Thomas. Correction : numéroter les questions de ce document N1 à N6 (ou écrire « la question de la cloche du 12/11 »). **Bloquant : non.**
4. **A4. §3.0 « La série […] v11 ne la place ni dans « Parcours » ni dans « Aujourd'hui » : ce document ne la place pas [À VÉRIFIER dans v12] ».** Problème : vérifié, la v12 ne place pas la série. §4.4 n'a que le « repère neutre « 12 cartes cette semaine » (ni série ni points) ». Or le brief §3.2 (bloc 1) met dans « Aujourd'hui » la « série « {n} jours de pratique d'affilée » (texte validé s17) ». Correction : remplacer le [À VÉRIFIER] par ce fait et ajouter un point 6 à l'annexe B : « l'architecture doit placer la série (brief §3.2 bloc 1, texte validé s17) ». **Bloquant : non.**

**Conditions du 10/10** : A1 (passer à « cap », ou soumettre « palier » pour la règle C), A2 à A4, puis un tour à l'aveugle limité à ces passages.
