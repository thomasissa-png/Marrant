# Clés de tirage : boutons restés hors chantier (ne jamais transmettre aux relecteurs, ni copier dans le pack)

> Pack : `pack-boutons-restants.md` (3 éléments, 6 textes). « A » = ma meilleure version, « B » = un autre angle. Critère unique : l'envie de payer (choix de Thomas du 18/10 : « Faut des CTA qui donnent envie de payer »). Rien de faux, aucune promesse de résultat chiffrée ou garantie, zéro tiret cadratin. Aucun relecteur n'a été lancé par moi : le pack est prêt à être envoyé (3 relecteurs, personas du chantier : neutre, pressé sur téléphone, sceptique).

## Tirage

Pas de générateur aléatoire disponible. Source : les caractères 3 à 8 de l'identifiant de session (`01Ny4UaXcj6i1VwL3T1j7rJZ`), non utilisés aux tours 3 à 5 (qui ont pris 9 à 20, puis 21 à 24 et 1 et 2). Même règle qu'au tour 5 : code ASCII pair = A en Texte 1, impair = A en Texte 2. Tranché avant l'écriture des textes, indépendamment de leur qualité.

| Élément | Caractère | Code | Parité | A est en |
|---|---|---|---|---|
| 1 Carnet | N | 78 | pair | Texte 1 |
| 2 Accueil connecté | y | 121 | impair | Texte 2 |
| 3 /abonnement connecté | 4 | 52 | pair | Texte 1 |

## Qui est A, qui est B

| Élément | A (Texte indiqué ci-dessus) | B |
|---|---|---|
| 1 Carnet (bas de page) | Titre « Et si tu avais la réplique avant la pique ? », paragraphe « Chaque fiche tient en une minute : … Toutes les autres situations d'octobre s'ouvrent d'un coup avec Premium, et un nouveau carnet arrive chaque mois. », bouton **« Voir les autres répliques · 2,99 €/mois »**. Angle : le bouton prolonge le geste de B1 (« Voir la réplique » devient « Voir les autres répliques »), le titre nomme l'usage (avoir la réplique avant la pique). | Titre « Chaque situation vient avec sa sortie de secours », paragraphe « Tu viens de le voir : … », bouton **« Ouvrir le carnet d'octobre en entier · 2,99 €/mois »**. Angle : la méthode complète et la sécurité (quoi dire si ça se tend), même forme que « Ouvrir {P} en entier ». |
| 2 Accueil connecté | Ligne « Ton compte est prêt : il ne reste que le paiement. » (phrase déjà validée en B13) + bouton **« Ouvrir les 5 parcours · 2,99 €/mois »** (`OUVRIR`, identique au visiteur : un seul mot pour tous). Angle : le même geste que le visiteur, la ligne explique ce qui change. | Ligne « Dernière étape : le paiement sécurisé par Stripe. » + bouton **« Je m'abonne et j'ouvre les 5 parcours · 2,99 €/mois »** (forme « Je m'abonne et … » de B11). Angle : première personne, le geste payant est nommé. |
| 3 /abonnement connecté | H1 « Ton compte est prêt. Les 5 parcours aussi. », phrase « Il ne reste que le paiement. Ensuite, tout est ouvert d'un coup … 15 à 20 minutes par étape, avec un défi à tenter. », bouton **« Ouvrir les 5 parcours · 2,99 €/mois »** (« · 24,99 €/an » si l'annuel est choisi). | H1 « La table qui rit, et c'est ta réplique qui l'a lancée. » (scène de B4+B5, validée), phrase « Ton compte est prêt, il ne reste que le paiement. Ensuite, les 5 parcours s'ouvrent … », bouton **« Je m'abonne et j'ouvre les 5 parcours · 2,99 €/mois »**. |

## Éléments identiques dans A et B

- Élément 1 : la liste des 4 avantages (composant commun), la ligne sous le bouton (« 2,99 € TTC par mois. Tu as 14 jours … depuis ton profil quand tu veux. »), le titre de section « Les N autres situations du mois ».
- Élément 2 : tout le reste de la carte (titre, scène, liste, prix, avantages, bouton contour, garantie, « Déjà 1 500+ inscrits, et toi ? »).
- Élément 3 : la pastille « Plus qu'une étape », la carte de l'offre, la réassurance, « Paiement sécurisé par Stripe », les avantages, l'extrait du carnet, « Pas encore sûr ? ».

## Faits vérifiés dans le code (worktree `.claude/worktrees/agent-a6072b0ac19da7774/apps/web/src`)

| Fait du pack | Source |
|---|---|
| Un non-abonné lit en entier **une seule** fiche (l'offerte) ; les autres : titre et contexte | `lib/carnet.ts` `carnetViewForPlan` l.170-186 ; `components/carnet/carnet-page.tsx` l.47-69 (`offerte={!view.premium}`, `CarnetFicheLocked`) |
| La fiche offerte montre « Si ça se tend » et « À toi de jouer » (seul l'extrait de /abonnement les cache) | `components/carnet/carnet-fiche-card.tsx` l.26-54 (`extrait` faux sur /carnet) |
| Titre de section « Les N autres situations du mois », N = `apercus.length` | `carnet-page.tsx` l.60 |
| L'encart d'article mène à `/carnet?src=blog-demo-…#fiche-{id}` | `components/blog/demo-vanne.tsx` l.33 |
| Le bouton du carnet mène à `buildAbonnementUrl(returnTo)` ; `returnTo` = `/carnet` ou `/carnet/{mois}` | `carnet-page.tsx` l.105 ; `app/(dashboard)/carnet/page.tsx` l.44 et `[mois]/page.tsx` l.36 |
| `returnTo` est relayé jusqu'à la page de confirmation, qui renvoie à l'intention d'origine | `components/premium/abonnement-view.tsx` l.47-55 (commentaire), `abonnement/success/page.tsx` l.43 |
| « Chaque fiche se lit en une minute … » est la phrase de l'introduction du carnet | `data/carnet/2026-10.json` `intro` |
| 4 avantages exacts (dont carnet « nouveau chaque mois ») | `components/premium/premium-benefits.tsx` l.29-59 |
| Membre connecté : le bouton **ouvre directement** `/api/stripe/checkout` (pas de page intermédiaire), libellé de chargement « On t'emmène au paiement… » | `components/home/premium-cta.tsx` l.46-69 et l.113-122 ; `abonnement-view.tsx` l.168-203 et l.287-297 |
| Visiteur anonyme : lien vers `/abonnement` (accueil) ou `/register` (page d'abonnement) | `premium-cta.tsx` l.123-137 ; `abonnement-view.tsx` l.298-313 |
| /abonnement connecté : pastille « Plus qu'une étape », H1 « Active ton accès pour commencer », phrase « Ton compte est prêt. Encore un clic et les 5 parcours sont à toi en entier, de la première à la dernière étape. » | `abonnement-view.tsx` l.158-166 et l.231-255 |
| Libellé du bouton /abonnement connecté : `Active mon accès · {priceLabel}`, `priceLabel` = 2,99 €/mois ou 24,99 €/an selon la formule | `abonnement-view.tsx` l.143 et l.296 |
| Réassurance sous le bouton : « Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux. » + « Paiement sécurisé par Stripe » (connecté seulement) | `config/textes/offre.ts` l.40-41 ; `abonnement-view.tsx` l.324-334 |
| Carte d'accueil : textes `CARTE_PREMIUM` (titre, scène, liste, `prixUnite`, `ligneTarif`, contour, garantie, inscrits) | `config/textes/cta-articles-accueil.ts` l.212-240 ; `premium-cta.tsx` l.74-153 |
| Étapes et durées des parcours | `docs/content/parcours-*.json` via `textes-finaux-valides.md` (inchangé) |

## Si un texte gagne : ce qui se branche

Éléments variables à lire dans la donnée, jamais en dur :

- **Élément 1** : « d'octobre » = `deMoisSeul(carnet.mois)` de `lib/carnet.ts` (« de novembre » le mois suivant). `CarnetPaywall` ne reçoit aujourd'hui que `returnTo` : lui passer le mois (et le nombre d'apercus si A est retenu avec un chiffre). Le prix = `PREMIUM_PRICE_LABEL` (« 2,99 €/mois »). Tailles (comptage manuel, espaces compris) : A fait 39 caractères dans le bouton, B 50 : prévoir `h-auto min-h-12 whitespace-normal px-4 py-2 text-center [text-wrap:balance]` (mêmes classes que le bouton du visiteur sur /abonnement), sinon coupe à 375 px.
- **Éléments 2 et 3** : « 5 » = `PARCOURS_COUNT` ; les boutons suivent `libelleOuvrirParcours()` (A) ou une nouvelle constante `JE_M_ABONNE_PARCOURS` (B) ; le repli `PARCOURS_COUNT` à 1 ou 0 reste celui d'`OUVRIR` (« Ouvrir tous les parcours · … »). « 15 à 20 minutes » (élément 3 A) suit le min et le max de `{D}` (`DUREE_ETAPES`). Sur /abonnement, le bouton `Button` du compte connecté n'a pas les classes de retour à la ligne du bouton visiteur : à ajouter si B est retenu (52 caractères avec le prix, comptage manuel).
- **Phrase « Encore un clic … »** (élément 3) : les deux textes la remplacent par « Il ne reste que le paiement ». Raison : « un clic » est inexact (clic, puis page de paiement et saisie de la carte). Si le pack n'est pas retenu, remplacer au moins cette phrase.

## Règle de lecture

- Pour chaque élément : noter chaque texte seul (3 relecteurs). Objectif 10/10 chez les trois. Règle d'or P0 s18 : un texte qui n'atteint pas 10 chez les trois repart en correction, il n'est pas mis en ligne.
- Si les deux textes d'un élément ont 10/10/10 : A gagne (c'est ma reco, la plus proche des libellés déjà validés). Si seul B atteint 10, B se branche tel quel.
- Si aucun texte n'atteint 10 : appliquer les « manque pour 10 » au texte le mieux noté, un tour de plus (comme au tour 5).
- **Éléments 2 et 3 sont liés** : un compte connecté voit les deux. Brancher le même libellé de bouton sur les deux (A avec A, B avec B), même si les notes diffèrent d'un point, pour ne pas montrer deux mots différents au même membre. Le gagnant de l'élément 2 impose son libellé à l'élément 3 sauf écart de 2 points ou plus en sa défaveur.

## Sources des faits nouveaux de ce tour

Faits issus de `docs/copy/cta-s21/textes-finaux-valides.md` (prix, 14 jours, résiliation « depuis ton profil », B11, B13, B4+B5, B16, `OUVRIR`), des fichiers de code listés ci-dessus, et de `docs/qa/qa-cta-s21.md` (constat m1 : ces boutons gardaient « Active mon accès », arbitrage demandé). Décision de Thomas du 18/10 : « Ok pour tes reco, faisons propre ». Aucun fait inventé.
