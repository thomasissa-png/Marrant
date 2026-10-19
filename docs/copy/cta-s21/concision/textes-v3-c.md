# Textes v3 (concision), partie C : /abonnement, /register, carnet, profil, fins de page

> Conventions : `textes-v3-a.md` §0 (comptage, REASS, libellés uniques GRATUIT_ACCUEIL / GRATUIT_P / OUVRIR). Chemins : `apps/web/src/config/textes/`. REASS = « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » GRATUIT_P = « Tester l'étape 1 de {P}, gratuite ».

## 1. /abonnement : budget 120 mots hors FAQ et hors fiche du carnet, REASS et liens compris

Fichiers : `cta-pages.ts` (`ABONNEMENT_HAUT_PAR_PARCOURS`, `ABONNEMENT_CTA`), `offre.ts` (`ABONNEMENT_HAUT_VISITEUR`, `ANNUEL_*`), `entrees-parcours.ts`, `carnet-extrait.ts`, `abonnement-view.tsx`, `plan-selector.tsx`. Ordre : titre, sous-titre, carte (prix, plein, REASS, avantages), extrait du carnet, « Pas encore sûr ? », FAQ. Pas de surtitre.

| Emplacement | Texte exact | Mots |
|---|---|---|
| Titre Répartie / défaut (`.titre`) | Ta réplique en soirée, pas dans le bus du retour | 10 |
| Titre Machine à Café et Boulot | Faire rire au bureau, au bon moment | 7 |
| Titre Confiance | Rire à table, sans monter sur scène | 6 |
| Titre Storytelling | Ton histoire jusqu'à la chute, avant le « et donc ? » | 9 |
| Sous-titre (`ABONNEMENT_HAUT_VISITEUR.sousTitre`) | Tout est accessible d'un coup. Chaque étape tient en 15 à 20 minutes. | 13 |
| Carte : nom + puces | Premium · Mensuel · Annuel | 3 |
| Pastille (état mensuel seulement) | plus de 3 mois offerts | 5 |
| Prix (état mensuel ; état annuel : 24,99 € TTC / an) | 2,99 € TTC / mois | 3 |
| Ligne annuelle, état mensuel | Ou 24,99 €/an, soit 2,08 € par mois. | 6 |
| Ligne annuelle, état annuel (remplace la pastille et la ligne ci-dessus) | Soit 2,08 € par mois, plus de 3 mois offerts. | 9 |
| Bouton plein (`ABONNEMENT_CTA.bouton`, un seul libellé pour tous les parcours d'origine) | Ouvrir les 5 parcours · 2,99 €/mois (annuel : · 24,99 €/an) | bouton |
| `ABONNEMENT_CTA.suite` (visiteur seulement) | Ton compte, puis le paiement sécurisé. | 6 |
| Ligne sous le bouton (compte connecté seulement) | Paiement sécurisé par Stripe | 4 |
| REASS | sous le plein | 11 |
| Avantages (composant unique, §2) | 4 lignes | 22 |
| Extrait du carnet : surtitre + titre | Carnet de novembre · Situation 15, offerte / Le carnet, en vrai | 6 + 4 |
| Extrait : lien | Lire la fiche en entier | 5 |
| « Pas encore sûr ? » + lien (parcours d'origine, sinon Répartie) | Pas encore sûr ? Tester l'étape 1 de Répartie, gratuite | 3 + 6 |

**Totaux exacts** (liens et REASS compris) : visiteur Répartie, état mensuel **103**, état annuel **101** ; visiteur Machine à Café 102 / 100 ; Boulot 100 / 98 ; Confiance 99 / 97 ; Storytelling 102 / 100 ; compte connecté (titre du parcours d'origine, sans `suite`, sans « Pas encore sûr ? », avec la ligne Stripe) **92** au plus. Budget 120 : OK dans tous les cas.

**Disparaît** : tous les surtitres (« Pour toi si… ») ; `ABONNEMENT_CONNECTE.titre` et `.paragraphe` (le compte connecté reprend le titre du parcours d'origine) ; `ABONNEMENT_HAUT_VISITEUR.surtitre` ; l'ancien sous-titre de 24 mots ; « Tout s'ouvre d'un coup. » (juxtaposé au bouton « Ouvrir ») ; « sans te forcer » du titre Confiance ; « Deux étapes : » dans `suite` ; « 10,89 € économisés par an » ; `ABONNEMENT_CONNECTE.pastille` ; la note « Payé en une fois, renouvelé chaque année… » ; la carte « Étape 2 » ; `carnetExtraitIntro` ; les 5 liens et le titre « Pas encore sûr ? Lis d'abord une étape » ; le bloc « Tu annules quand tu veux » (29 mots) ; les boutons « Ouvrir {P} et les 4 autres ». **Avant** : 316 / 311 (visiteur), 314 / 309 (connecté).

## 2. Composant « 4 avantages » (`PremiumBenefits`) : /abonnement seulement

À déplacer en config (`PREMIUM_AVANTAGES`).

| # | Texte exact | Mots |
|---|---|---|
| 1 | Chaque parcours en entier | 4 |
| 2 | Un nouveau carnet de répartie chaque mois | 7 |
| 3 | Tout le catalogue : vannes, conseils, vidéos | 6 |
| 4 | Tes favoris sous la main | 5 |
| **Total** | | **22** |

**Disparaît** : « Les 5 parcours en entier » (le bouton juste au-dessus le dit), noms et durées des parcours, le détail du carnet, les compteurs, « au lieu de 10 vannes, 3 conseils et 3 vidéos sans abonnement… », « Toutes les vannes, tous les conseils, toutes les vidéos ». Retiré de l'accueil, du /carnet et de la fenêtre. **Avant** : 110, sur 3 surfaces.

## 3. FAQ de vente : question sur le prix (accueil et /abonnement)

Fichier : `lib/faqs.ts`. Question : « 2,99 €/mois, c'est vraiment tout ? Pas de frais cachés ? »

| Contexte | Réponse | Mots |
|---|---|---|
| Accueil, et /abonnement quand seule la formule mensuelle est proposée | C'est le prix, point. Ça se renouvelle chaque mois, tant que tu ne résilies pas. | 15 |
| /abonnement avec la formule annuelle | C'est le prix, point. Ça se renouvelle chaque mois ou chaque année, tant que tu ne résilies pas. | 18 |

**Disparaît** : « Oui. Pas de frais cachés. », « pas de reconduction surprise » (faux pour un abonnement qui se reconduit), « Tu annules en 1 clic depuis ton profil, sans avoir à envoyer un email ou appeler un numéro » (faux : la résiliation passe par le portail de paiement), « Paiement sécurisé par Stripe » (dit une fois sur la page), les prix annuels de la réponse (déjà dans le sélecteur). Même correction dans `llms-content.ts` l. 78 et l. 154. Les 4 questions de la FAQ de vente sont les seules affichées sur l'accueil et /abonnement.

## 4. /register (sans champ prénom)

Fichier : `app/(auth)/register/page.tsx` (textes en dur à passer dans `REGISTER_CTA`). Ordre : titre, prix, champs, plein, REASS, Google, CGU, liens. Budget 25 hors champs, hors REASS, hors mention CGU.

| Emplacement | Texte exact | Mots |
|---|---|---|
| H1 | Ton compte | 2 |
| `planReminder(plan)` | Premium, 2,99 € TTC par mois. (annuel : Premium, 24,99 € TTC par an.) | 5 |
| Champs | Email / Mot de passe / Au moins 8 caractères | hors budget |
| `REGISTER_CTA.bouton` (plein) | Créer mon compte et passer au paiement | bouton (7) |
| REASS, collée sous le plein | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | 11 (REASS) |
| Google | Continuer avec Google | bouton |
| CGU (porte le contrat) | En créant ton compte, tu acceptes les CGU. | 8 (hors budget) |
| « Déjà un compte ? » | Déjà un compte ? Connecte-toi | 4 |
| `REGISTER_CTA.lienEtape1` (parcours d'origine, Répartie par défaut ; absent quand on arrive de la fin de l'étape 1) | Tester l'étape 1 de Répartie, gratuite | 6 (8 pour Machine à Café) |
| **Total** | | **17** (19 au plus), budget 25 OK |

**Disparaît** : « Étape 1 sur 2 » ; « puis le paiement » du H1 (le bouton le dit) ; le champ prénom, son libellé et `prenomPlaceholder` ; « annulable à tout moment » du sous-titre ; « Étape 2 : le paiement sécurisé, juste après. » ; `REMBOURSEMENT_PREMIER_PAIEMENT` seul ; « Tu préfères lire d'abord ? L'étape 1 du parcours Répartie, gratuite et sans compte » ; « Retour à l'accueil » ; « S'inscrire avec Google ». **Avant** : 87 / 77.

## 5. Page de retour après paiement

Fichier : `app/(dashboard)/abonnement/success/page.tsx`.

| Emplacement | Texte exact | Mots |
|---|---|---|
| Titre | Paiement reçu ! | 2 |
| Texte | Merci. Ton accès s'active… | 4 |
| Bouton (plein, mène à `/parcours`) | Choisir mon parcours | bouton (3) |

**Disparaît** : « On déroule le tapis rouge, » ; l'émoji 🎉 (`<div aria-hidden>`). **Avant** : 10 / 10.

## 6. /carnet, visiteur : intro et paywall

Fichiers : donnée `docs/copy/carnet/novembre/carnet-2026-11.json` (clé `intro`), `cta-pages.ts` (`CARNET_PAYWALL`), `carnet-page.tsx`. Un seul mot pour la même chose sur la page : « répliques ».

| Emplacement | Texte exact | Mots |
|---|---|---|
| `view.intro` (à refaire chaque mois sur ce moule) | Du premier froid aux préparatifs de Noël, des répliques qui montent d'un cran. | 13 |
| Fiche offerte (donnée, « Le lundi de 9 h 40 ») | | exemptée |
| `CARNET_PAYWALL.titre(n)`, juste après la fiche offerte | Ça, c'était la réplique offerte. Il en reste 14. | 9 |
| `CARNET_PAYWALL.paragraphe` | Un nouveau carnet arrive chaque mois. | 6 |
| `CARNET_PAYWALL.bouton` (plein) | Voir tout le carnet · 2,99 €/mois | bouton |
| REASS | sous le plein | 11 (REASS) |
| Titre de la liste verrouillée | Au programme | 2 |
| Liste verrouillée : 3 titres de fiches (données), puis `CARNET_LISTE_RESTE(n-3)` | Et 11 autres répliques | 4 |
| **Bloc d'achat hors bouton** | | **21** (budget 25 OK) |

Le « 14 » apparaît deux fois dans le bloc (titre, « 14 jours » de la REASS).
**Disparaît** : `PremiumBenefits` du paywall (110 mots) ; l'ancien paragraphe de 33 mots ; `CARNET_PAYWALL.suite` de 24 mots ; les 11 dernières lignes verrouillées ; « Les 14 autres situations du mois » ; « Du plus tranquille au plus tendu » ; « Chaque fiche se lit en une minute… » et « pour que tu progresses au fil du mois » de l'intro ; « situations » de l'intro ; « Voir les {N} autres répliques ». **Avant** : 182 / 176 (paywall), intro 53.

## 7. /profil, compte sans abonnement

Fichier : `cta-pages.ts` → `PROFIL_ABONNEMENT_OFFRE` ; `compte.ts` ; `abonnement-card.tsx`.

| Emplacement | Texte exact | Mots hors bouton |
|---|---|---|
| `phrase` | Chaque mois, un nouveau carnet de répartie s'ajoute aux parcours. | 10 |
| `bouton` (plein) | Ouvrir les 5 parcours · 2,99 €/mois | bouton |
| `ligneDiscrete` devient REASS | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | 11 (REASS) |
| **Total** | | **10** (budget 25 OK) |

**Disparaît** : `ligneXp(xp)` (« Tu as déjà 120 XP. ») ; « Avec Premium, tout s'ouvre d'un coup. » ; « Avec Premium, » en tête de phrase (la REASS commence par « Premium ») ; « Tout ouvrir · 2,99 €/mois » ; l'ancienne phrase d'offre de 33 mots ; « Résiliable quand tu veux depuis ce profil. Tu as 14 jours pour te faire rembourser ce paiement. ». **Avant** : 62 / 59.

## 8. Fins de page : /glossaire et /a-propos

Fichier : `cta-pages.ts` → `GLOSSAIRE_FIN`, `A_PROPOS_FIN`, `FIN_DE_PAGE_COMMUN`.

| Emplacement | /glossaire | /a-propos |
|---|---|---|
| `titre` | Le vocabulaire, c'est fait. Reste à s'en servir. (8) | Tu parles et personne rit. / On va arranger ça. |
| `paragraphe` (1 phrase) | Placer un callback au dîner de samedi, c'est autre chose : ça se travaille. (13) | Observer d'abord, roder ensuite : voilà le programme. (7) |
| Preuve | aucune | Déjà 1 500+ inscrits. (3, retirée si connecté) |
| `bouton` (plein) | Ouvrir les 5 parcours · 2,99 €/mois | idem |
| REASS | sous le plein | idem |
| `lienEtape1` (lien) | Tester l'étape 1 de Répartie, gratuite | idem |
| Corps de page (`page.tsx` l. 84-86) | n/a | « …et des exercices à mettre en pratique. » (le chiffre « 1 500+ » ne figure que dans la preuve de fin) |
| **Hors bouton (titre de page exclu)** | **21** | **10** (budget 25 OK) |

**Disparaît** : « Tu sais ce qu'est un callback. » ; « C'est à ça que servent les 5 parcours… 15 à 20 minutes par semaine. » ; `ETAPE_ET_ESSAI` (30 mots) ; `PROGRAMME_SUITE` ; la ligne discrète de 24 mots ; « Lis d'abord une étape, elle est offerte » ; « et toi ? » ; « Rejoins les 1 500+ membres… La prochaine vanne qui fait rire la pièce ? » (`page.tsx` l. 208-209) ; « 1 500+ membres » du corps de page ; « s'entraîner » et « 5 parcours » dans la phrase de /a-propos ; « c'est tout le programme » ; « concrets que les inscrits mettent en pratique » (affirmation invérifiable). **Avant** : 114 / 109 et 100 / 95.

## 9. Paywall `premium-paywall.tsx` (web ; mobile natif : seul le texte de valeur change)

| Emplacement | Texte exact | Mots |
|---|---|---|
| Titre (en dur) | La suite, avec Premium | 4 |
| `PREMIUM_VALUE_TEXT` | Le carnet du mois, tes favoris, tout le catalogue. | 9 |
| Bouton web (plein) | Ouvrir les 5 parcours · 2,99 €/mois | bouton |
| `FENETRE_GARANTIE` devient REASS (web seulement) | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | 11 (REASS) |

**Disparaît** : l'ancienne phrase de 42 mots ; « les listes complètes » ; « Passe Premium » ; « Les 5 parcours » du texte de valeur (le bouton le dit) ; « S'abonner · 2,99 €/mois ». Natif (Apple 3.1.1) : aucun prix ni lien web. **Avant** : ≥ 42.

## 10. E-mail de confirmation de paiement (une phrase)

`paiement.ts` l. 262 :

| Avant | Après |
|---|---|
| Pour bien démarrer : ouvre un parcours et lance l'étape 2 (la première se lit déjà sans compte) : {url}/parcours. | Tout est ouvert. Pour démarrer, choisis un parcours : {url}/parcours. |

Le reste de l'e-mail (mentions légales) ne bouge pas.
