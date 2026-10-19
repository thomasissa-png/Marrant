# Textes v1 (concision), partie A : articles, accueil, en-tête

> Statut : PROPOSITION pour relecture à l'aveugle puis branchement. Règles : `inventaire-et-etalons.md` §4, étalons §5 repris tels quels (marqués ÉTALON). Aucun code touché. Chemins : `apps/web/src/config/textes/` sauf mention. Parties suivantes : `textes-v1-b.md` (fiches, murs, fenêtre, quiz, parcours), `textes-v1-c.md` (/abonnement, /register, carnet, profil, fins de page). Contrôle : `controle-v1.md`.

## 0. Conventions communes (à lire une fois)

- **Comptage** : mots séparés par un espace ; les signes seuls (« » : ? · !) ne comptent pas ; un montant (« 2,99 € », « 2,99 €/mois », « 24,99 €/an ») et « 1 500+ » = 1 mot ; « 14 jours » = 2 mots.
- **Hors bouton** = tout ce qui n'est pas le libellé d'un bouton plein ou d'un lien d'action (lien payant ou lien « Lire l'étape 1 », 4 à 7 mots). **La réassurance fixe (11 mots) est comptée à part** : sans cette lecture, les étalons 4 et 5 validés par Thomas dépasseraient eux-mêmes le budget (32 et 41 mots hors bouton). **Point à confirmer par Thomas** (une phrase).
- **Plein / lien** : sur les surfaces « froides » (haut d'accueil, fin d'article) le plein est le gratuit et le payant est un lien (ÉTALONS 1 et 2) ; sur les surfaces « chaudes » (carte d'accueil, fiches, murs, carnet, profil, fenêtre) le plein est le payant et le gratuit est un lien.
- **REASS** (réassurance unique, 11 mots, partout identique) : « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » Placée sous tout bouton plein qui porte un prix, jamais sous un lien ni sous un bouton gratuit. Constante unique à créer : `offre.ts` → `REASSURANCE_UNIQUE`.
- **OUVRIR** = « Ouvrir les 5 parcours · 2,99 €/mois » (inchangé, 5 mots, `libelleOuvrirParcours()`).
- **LIEN_ETAPE1** = « Lire l'étape 1 de {P}, gratuite » (6 mots avec Répartie, Confiance, Storytelling, Boulot ; 9 mots avec Machine à Café, seule exception assumée). Remplace tous les contours « Gratuit : 5 vannes et un défi, étape 1 de {P} », « Étape 1 de {P}, gratuite : … » et « Lire la première étape gratuite de {P} ».
- Le « 5 » des parcours reste `PARCOURS_COUNT`, les prix restent lus dans `config/premium.ts`.

## 1. B3 : haut de l'accueil (visiteur), titre gardé, intro à 1 phrase, 1 plein, plus de lien payant

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `hero-section.tsx` H1 (en dur) | Tu parles et personne rit. / On va arranger ça. | gardé (Thomas 18/10) | n/a |
| `hero-section.tsx` paragraphe (en dur, à passer dans la config : `ACCUEIL_HAUT.intro`) | Des vannes, des techniques et des exercices pour répondre quand on te chambre. | 13 | |
| `hero-section.tsx` preuve sociale (en dur) | 1 500+ membres bossent leur humour. Rejoins-les. | 6 | |
| `ACCUEIL_HAUT.bouton` (plein, gratuit) | Tester mes premières répliques, gratuit | bouton | |
| `ACCUEIL_HAUT.note` / `noteAccueilHaut()` | Sans compte. | 2 | |
| **Total** | | **21** | **40 OK** |

**Disparaît** : `ACCUEIL_HAUT.lien` / `libelleOuvrirAccueil()` (lien payant souligné du premier écran : décision validée 18/10, le chip « 2,99 €/mois » du header porte le payant) et `OUVRIR_ACCUEIL` ; l'ancienne note de 30 mots (liste de l'étape, nom de l'étape payante, résiliation) ; les 3 questions d'accroche du paragraphe (« Tu restes muet… », « Tu galères… », « Tu voudrais… ») ; `HERO_EXTRA_TAGS` (« Un petit exercice par jour », « Vannes prêtes à ressortir », desktop seulement, redit l'intro). Les 3 pastilles de situation restent (navigation, inchangées).

**Écart signalé** : l'ÉTALON 1 gardait un lien payant « Ouvrir les 5 parcours · 2,99 €/mois » sous le plein. La règle validée dans la même séance retire ce lien du haut de l'accueil ; j'ai suivi la règle. Si Thomas préfère l'étalon à la lettre, la ligne est prête : lien `OUVRIR` sous « Sans compte. » (+5 mots, total 26, toujours sous 40).

**Avant** (hors bouton) : intro 36 + preuve 6 + note 30 + lien 10 = 82 (hors pastilles) ; total 87 avec le bouton.

## 2. B6 : bouton Premium de l'en-tête (inchangé)

| Emplacement | Texte exact | Mots | Budget |
|---|---|---|---|
| `EN_TETE.bouton` | 2,99 €/mois | 1 | 0 |
| `EN_TETE.nomAccessible` | 2,99 € par mois : voir l'offre Premium | (a11y) | |

Aucun changement (B6 de l'inventaire, déjà 1 mot).

## 3. B2 : fin d'article (ÉTALON 2, repris tel quel pour l'article n°1)

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `BLOC_FIN.parArticle["meilleures-blagues-droles-2026"].titre` | La vanne dans ta bouche, pas dans ton téléphone | 9 | |
| `.texte` | Quand on te chambre, tu as une seconde, et ça s'entraîne. | 11 | |
| `BLOC_FIN.boutonEtape1.repartie` (plein, gratuit) | Tester mes premières répliques, gratuit | bouton | |
| note (à créer : `BLOC_FIN.noteSansCompte`) | Sans compte. | 2 | |
| `BLOC_FIN.lienAbonnement` (lien payant) | Ouvrir les 5 parcours · 2,99 €/mois | lien | |
| **Total** | | **22** | **25 OK** |

**Déclinaisons par parcours** (articles qui n'ont pas de surcharge ; `encarts-blog-s20.ts` → `TEXTES_PARCOURS_BLOG[slug]`) : même gabarit (titre, 1 phrase, plein gratuit, « Sans compte. », lien `OUVRIR`).

| Parcours | `finTitre` | `finTexte` | `finBoutonEtape1` (plein) | Hors bouton |
|---|---|---|---|---|
| Répartie | Ces techniques, travaille-les dans un parcours guidé | Quand on te chambre, tu as une seconde, et ça s'entraîne. | Tester mes premières répliques, gratuit | 7+11+2 = 20 |
| Machine à Café | Sois drôle au bureau sans avoir l'air d'essayer | Des vannes courtes et le bon moment pour les placer, sans forcer. | Tester mes premières vannes, gratuit | 8+12+2 = 22 |
| Confiance | Reprends confiance, une conversation à la fois | Trouver ta place dans un groupe qui rit, sans personne pour te pousser sur scène. | Tester l'étape 1 de Confiance, gratuite | 7+15+2 = 24 |
| Storytelling | Une anecdote, travaillée jusqu'à ce qu'on te la redemande | Une seule anecdote vraie, retravaillée d'étape en étape. | Tester l'étape 1 de Storytelling, gratuite | 9+8+2 = 19 |
| Boulot | Ta vanne du lundi, sans te griller | De la salle de réunion au toast, un cran à la fois. | Tester l'étape 1 de Boulot, gratuite | 7+12+2 = 21 |

Abonné Premium : `TEXTES_BLOC_FIN.boutonAbonne` « Continuer mon parcours » inchangé (3 mots).

**Disparaît** : `TEXTES_BLOC_FIN.surtitre` « Parcours {parcours} · {semaines} semaines » (durée) ; le paragraphe de 85 mots (programme, 4 titres d'étapes, défi) ; `BLOC_FIN.note` / `[S9]` (prix mensuel et annuel TTC, 14 jours, résiliation : le lien mène à /abonnement qui les dit) ; `prixPremiumTtc()` n'a plus d'usage ici ; les durées « 15 min par semaine » des `finTexte` ; la 2e phrase de Boulot (« Chaque exercice a une version sans risque »).
**Avant** : 145 / 140 hors bouton (article n°1).

## 4. Carte Premium de l'accueil B4+B5 (ÉTALON 5, repris tel quel)

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `CARTE_PREMIUM.titre` | Et si ton « j'aurais dû dire » devenait un « j'ai dit » ? | 10 | |
| `CARTE_PREMIUM.intro.scene` (devient la phrase unique) | Premium : 5 parcours, de la coloc à l'afterwork, et l'étape 1 de chacun est gratuite. | 15 | |
| `CARTE_PREMIUM.bouton` (plein payant) | Ouvrir les 5 parcours · 2,99 €/mois | bouton | |
| `CARTE_PREMIUM.contour` (devient LIEN, plus un bouton) | Tester mes premières répliques, gratuit | lien | |
| `CARTE_PREMIUM.reassurance` | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | 11 (REASS) | |
| `CARTE_PREMIUM.inscrits` | Déjà 1 500+ inscrits, et toi ? | 5 | |
| **Total** | | **30 + REASS 11 = 41** | **40 OK hors REASS** |

**Disparaît** : `intro.listeIntro`, `intro.liste` et `listeParties` (liste de 5 parcours), `intro.fin` (durée, « défi à tenter »), l'en-tête « Premium · 2,99 €/mois » (le prix est dans le bouton), `ligneTarif()` (prix annuel : seulement sur /abonnement), la liste `LIGNES_PARCOURS`, le composant `PremiumBenefits` sur l'accueil (les 4 avantages), l'ancienne `reassurance` (« Tu as 14 jours… et tu résilies depuis ton profil quand tu veux »).
**Avant** : 260 / 250 hors bouton. **Option stricte** (si Thomas veut un fait une seule fois sur la page, le haut disant déjà « gratuit ») : phrase = « Premium : 5 parcours, de la coloc à l'afterwork. » (8 mots).

## 5. E2 : carte d'accueil, compte connecté sans abonnement

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| titre + bouton + REASS | comme §4 (le bouton ouvre directement le paiement) | | |
| `CARTE_PREMIUM.connecte.ligne` (remplace la phrase de §4 ou s'y ajoute avant le bouton) | Tu as déjà ton compte : le bouton t'emmène au paiement. | 10 | |
| Preuve sociale | retirée pour un compte connecté (comme aujourd'hui) | 0 | |
| **Total** | titre 10 + phrase 15 + ligne 10 = **35 + REASS 11** | | **40 OK hors REASS** |

**Disparaît** : « …, sécurisé par Stripe » (dit sur la page Stripe elle-même). **Avant** : 19 / 14.

## 6. B1 : encart de démonstration au milieu de l'article (la scène est le produit)

| Emplacement | Texte exact | Mots | Budget |
|---|---|---|---|
| `DEMO_VANNE.surtitre` | Situation offerte ce mois-ci | 4 | |
| `DEMO_VANNE.situation()` (donnée du carnet, inchangée) | {accroche}, et on te lance : « {onTeDit} » | 26 (scène, exemptée) | |
| `DEMO_VANNE.question` | Tu réponds quoi ? | 3 | |
| `DEMO_VANNE.bouton` (plein, gratuit) | Voir la réplique | bouton | |
| `DEMO_VANNE.note()` (sans paramètre, une seule phrase) | Gratuit, sans compte. | 3 | |
| **Total hors scène et bouton** | | **10** | **25 OK** |

**Disparaît** : « la réplique, pourquoi elle marche et quoi dire si ça se tend » ; « Chaque mois, de nouvelles situations arrivent dans Premium, l'abonnement du site » (le carnet est vendu sur /carnet et /abonnement ; un encart de démonstration ne doit pas vendre). La condition de publication reste (scène = fiche offerte du mois ET chambrage).
**Avant** : 60 / 57. Total après avec la scène : 39.

## 7. B18 : la lettre en bas d'article (Thomas : pas au milieu de l'article, pas de ligne repliée)

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `LETTRE_ARTICLE.titre` | Une vanne décryptée, chaque mois | 5 | |
| `LETTRE_ARTICLE.phrase` (une seule phrase) | Par e-mail, avec un exercice pour t'entraîner : gratuit, sans compte. | 11 | |
| Bouton du formulaire (inchangé, `lettre-s21.ts` `formulaire.bouton`) | Envoie-moi la lettre | bouton | |
| Case de consentement et mention sous le bouton | inchangées (texte légal exact, `formulaire.case` et `formulaire.mention`) | hors budget | |
| **Total** | | **16** | **25 OK** |

**Disparaît** : `LETTRE_ARTICLE.reassurance` (« La lettre est gratuite, sans compte. En fin de message, une lecture à suivre et un mot sur Premium… Désinscription en un clic. » : la case dit déjà la mention de Premium et la désinscription) ; la vanne d'exemple « J'ai pris un chien… » (peut revenir comme titre si Thomas la veut) ; `LETTRE_ARTICLE.ligneRepliee` (non posée, refusée). Le bloc se place APRÈS le bloc de fin B2, jamais avant.
**Avant** : 84 / 81 (hors case et mention).
