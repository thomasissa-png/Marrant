# Textes v5 (concision), partie A : articles, accueil, en-tête

> Statut : PROPOSITION pour relecture à l'aveugle puis branchement. Aucun code touché. Chemins : `apps/web/src/config/textes/` sauf mention. Parties suivantes : `textes-v3-b.md` (murs, fiches, fenêtre, quiz, parcours), `textes-v3-c.md` (/abonnement, /register, carnet, profil, fins de page). Contrôle : `controle-v3.md`.

## 0. Conventions communes (à lire une fois)

- **Comptage** : mots séparés par un espace ; les signes seuls (« » : ? · !) ne comptent pas ; un montant (« 2,99 € », « 2,99 €/mois », « 24,99 €/an ») et « 1 500+ » = 1 mot ; « 14 jours » = 2 mots.
- **Hors bouton** = tout ce qui n'est pas le libellé d'un bouton plein ou d'un lien d'action. **REASS** (réassurance fixe, 11 mots) est comptée à part, sauf sur /abonnement où elle est comptée.
- **Libellés uniques**
  - GRATUIT_ACCUEIL = « Tester mes premières répliques, gratuit » (haut d'accueil, carte d'accueil, fin d'article générique).
  - GRATUIT_P = « Tester l'étape 1 de {P}, gratuite » (partout ailleurs où le parcours est connu ; Répartie par défaut sinon).
  - OUVRIR = « Ouvrir les 5 parcours · 2,99 €/mois » (action payante générique ; le « 5 » reste `PARCOURS_COUNT`). Le libellé ne change jamais : c'est le texte voisin qu'on ajuste.
  - Les libellés liés à un geste précis gardent leur forme (fiches, murs, fin d'étape 1, carnet, fenêtre Premium).
- **REASS** : « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » Sous tout bouton plein qui porte un prix, jamais sous un lien ni un bouton gratuit.
- **Plein / lien** : sur les surfaces « froides » (haut d'accueil, fin d'article) le plein est le gratuit et le payant est un lien ; sur les surfaces « chaudes » (carte d'accueil, fiches, murs, carnet, profil, fenêtre) le plein est le payant et le gratuit est un lien.
- **« d'un coup »** : deux emplacements dans tout le parcours d'achat, le sous-titre de /abonnement et la phrase de fin d'étape 1.

## 1. Haut de l'accueil (visiteur) : titre, 1 phrase, 1 preuve, 1 plein

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `hero-section.tsx` H1 (en dur) | Tu parles et personne rit. / On va arranger ça. | titre de la page | n/a |
| `hero-section.tsx` paragraphe (à passer dans la config : `ACCUEIL_HAUT.intro`) | Des vannes et des exercices pour répondre quand on te chambre. | 11 | |
| `hero-section.tsx` preuve sociale | 1 500+ inscrits bossent leur humour. | 5 | |
| `ACCUEIL_HAUT.bouton` (plein, gratuit) | Tester mes premières répliques, gratuit | bouton | |
| `ACCUEIL_HAUT.note` | Sans compte. | 2 | |
| **Total** | | **18** | **40 OK** |

**Disparaît** : « Rejoins-les. » ; « techniques » dans la phrase ; `ACCUEIL_HAUT.lien` / `libelleOuvrirAccueil()` / `OUVRIR_ACCUEIL` (lien payant du premier écran) ; l'ancienne note de 30 mots ; les 3 questions d'accroche du paragraphe ; `HERO_EXTRA_TAGS`. Les 3 pastilles de situation restent (navigation). **Avant** : 87 mots avec le bouton.

## 2. Bouton Premium de l'en-tête

| Emplacement | Texte exact | Mots | Budget |
|---|---|---|---|
| `EN_TETE.bouton` | Premium · 2,99 €/mois | 2 | 0 levé |
| `EN_TETE.nomAccessible` | 2,99 € par mois : voir l'offre Premium | (a11y) | |

## 3. Fin d'article (article n°1, puis déclinaisons par parcours)

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `BLOC_FIN.parArticle["meilleures-blagues-droles-2026"].titre` | La vanne dans ta bouche, pas dans ton téléphone | 9 | |
| `.texte` | La placer à voix haute, ça s'entraîne. | 7 | |
| `BLOC_FIN.boutonEtape1.repartie` (plein, gratuit) | Tester mes premières répliques, gratuit | bouton | |
| `BLOC_FIN.noteSansCompte` (à créer) | Sans compte. | 2 | |
| `BLOC_FIN.lienAbonnement` (lien payant) | Ouvrir les 5 parcours · 2,99 €/mois | lien | |
| **Total** | | **18** | **25 OK** |

**Déclinaisons** (`encarts-blog-s20.ts` → `TEXTES_PARCOURS_BLOG[slug]`) : même gabarit (titre, 1 phrase, plein gratuit, « Sans compte. », lien OUVRIR).

| Parcours | `finTitre` | `finTexte` | `finBoutonEtape1` (plein) | Hors bouton |
|---|---|---|---|---|
| Répartie | Ces techniques, rode-les avant la prochaine pique | Quand on te chambre, tu as une seconde, et ça s'entraîne. | Tester l'étape 1 de Répartie, gratuite | 7+11+2 = 20 |
| Machine à Café | Sois drôle au bureau sans avoir l'air d'essayer | Des vannes courtes, et le bon moment pour les placer. | Tester l'étape 1 de Machine à Café, gratuite | 8+10+2 = 20 |
| Confiance | Ta place dans un groupe qui rit | Personne ne te pousse sur scène : ça se joue entre amis. | Tester l'étape 1 de Confiance, gratuite | 7+11+2 = 20 |
| Storytelling | Une anecdote, travaillée jusqu'à ce qu'on te la redemande | Ton histoire vraie, resserrée étape après étape. | Tester l'étape 1 de Storytelling, gratuite | 9+7+2 = 18 |
| Boulot | Ta vanne du lundi, sans te griller | De la salle de réunion au pot de départ. | Tester l'étape 1 de Boulot, gratuite | 7+9+2 = 18 |

Abonné Premium : `TEXTES_BLOC_FIN.boutonAbonne` « Continuer mon parcours » (3 mots).

**Disparaît** : `TEXTES_BLOC_FIN.surtitre` (durée) ; le paragraphe de 85 mots (programme, titres d'étapes, défi) ; `BLOC_FIN.note` (prix, 14 jours, résiliation : le lien mène à /abonnement) ; « parcours guidé », « une conversation à la fois », « un cran à la fois », « sans forcer » des déclinaisons ; la 2e phrase de Boulot ; « Quand on te chambre, tu as une seconde » du texte de l'article n°1 (le titre parle de vannes, le texte reste sur la vanne). **Avant** : 145 / 140 hors bouton.

## 4. Carte Premium de l'accueil (visiteur)

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `CARTE_PREMIUM.titre` | Et si ton « j'aurais dû dire » devenait un « j'ai dit » ? | 10 | |
| `CARTE_PREMIUM.intro.scene` (phrase unique) | De la coloc à l'afterwork, de quoi répondre partout. | 9 | |
| `CARTE_PREMIUM.bouton` (plein payant) | Ouvrir les 5 parcours · 2,99 €/mois | bouton | |
| REASS | sous le plein | 11 (REASS) | |
| `CARTE_PREMIUM.contour` (lien) | Tester mes premières répliques, gratuit | lien | |
| **Total** | | **19 + REASS 11 = 30** | **40 OK** |

Pas de preuve sociale dans cette carte (elle vit sous le titre du haut de page).
**Disparaît** : `intro.listeIntro`, `intro.liste`, `listeParties`, `intro.fin` ; l'en-tête « Premium · 2,99 €/mois » de la carte ; `ligneTarif()` ; `LIGNES_PARCOURS` ; `PremiumBenefits` sur l'accueil ; `CARTE_PREMIUM.inscrits` (« Déjà 1 500+ inscrits, et toi ? ») ; « l'étape 1 de chacun est gratuite » et « Premium : » en tête de phrase ; « tout s'ouvre d'un coup » (juxtaposé au bouton « Ouvrir »). **Avant** : 260 / 250.

## 5. Carte d'accueil, compte connecté sans abonnement

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `CARTE_PREMIUM.titre` | Et si ton « j'aurais dû dire » devenait un « j'ai dit » ? | 10 | |
| `CARTE_PREMIUM.connecte.ligne` (REMPLACE la phrase du §4, une seule phrase avant le bouton) | De la coloc à l'afterwork, de quoi répondre partout. | 9 | |
| Bouton plein, REASS, lien gratuit | comme §4 (le bouton ouvre directement le paiement) | REASS 11 | |
| **Total** | | **19 + REASS 11 = 30** | **40 OK** |

**Disparaît** : « …, sécurisé par Stripe » ; « le bouton t'emmène au paiement » ; « Ton compte est prêt : ». **Avant** : 19 / 14.

## 6. Encart de démonstration au milieu de l'article

| Emplacement | Texte exact | Mots | Budget |
|---|---|---|---|
| `DEMO_VANNE.surtitre` | Situation offerte ce mois-ci | 4 | |
| `DEMO_VANNE.situation()` (donnée du carnet) | {accroche}, et on te lance : « {onTeDit} » | 26 (scène, exemptée) | |
| `DEMO_VANNE.question` | Tu réponds quoi ? | 3 | |
| `DEMO_VANNE.bouton` (plein, gratuit) | Voir la réplique | bouton | |
| **Total hors scène et bouton** | | **7** | **25 OK** |

**Disparaît** : `DEMO_VANNE.note()` (« Gratuit, sans compte. » : « offerte » le dit, « Sans compte. » vit sous le bouton de fin d'article) ; « la réplique, pourquoi elle marche et quoi dire si ça se tend » ; « Chaque mois, de nouvelles situations arrivent dans Premium… ». La condition de publication reste (scène = fiche offerte du mois ET chambrage). **Avant** : 60 / 57.

## 7. Lettre en bas d'article (après le bloc de fin, jamais avant)

| Emplacement | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `LETTRE_ARTICLE.titre` | Une vanne décryptée, chaque mois | 5 | |
| `LETTRE_ARTICLE.phrase` | Gratuite, par e-mail, avec un exercice. | 6 | |
| Bouton du formulaire (`lettre-s21.ts` `formulaire.bouton`), style discret (pas un plein : le plein du bas d'article est celui du bloc de fin) | Envoie-moi la lettre | bouton | |
| Case de consentement et mention sous le bouton | texte légal exact (`formulaire.case`, `formulaire.mention`) | hors budget | |
| **Total** | | **11** | **25 OK** |

**Disparaît** : `LETTRE_ARTICLE.reassurance` ; « sans compte » de la phrase (déjà sous le bouton de fin d'article) ; « pour t'entraîner » ; la vanne d'exemple « J'ai pris un chien… » ; `LETTRE_ARTICLE.ligneRepliee`. **Avant** : 84 / 81.
