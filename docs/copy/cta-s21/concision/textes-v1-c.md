# Textes v1 (concision), partie C : /abonnement, /register, carnet, profil, fins de page

> Conventions : `textes-v1-a.md` §0. Chemins : `apps/web/src/config/textes/`. REASS = « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. »

## 1. /abonnement, visiteur : budget 120 mots hors FAQ et hors fiche du carnet (donnée)

Fichiers : `cta-pages.ts` (`ABONNEMENT_HAUT_PAR_PARCOURS`, `ABONNEMENT_CTA`), `offre.ts` (`ABONNEMENT_HAUT_VISITEUR`, `ANNUEL_*`, `REASSURANCE_PAIEMENT`), `entrees-parcours.ts` (`ABONNEMENT_ETAPE_1`), `carnet-extrait.ts`, `abonnement-view.tsx`, `plan-selector.tsx`. Ordre de la page : surtitre, titre, sous-titre, carte (prix, plein, étapes, REASS, avantages), extrait du carnet, « Pas encore sûr ? », FAQ.

| Emplacement | Texte exact | Mots |
|---|---|---|
| Surtitre Répartie et adresse directe (`ABONNEMENT_HAUT_PAR_PARCOURS.defaut/repartie.surtitre`) | Pour toi si ta bonne réponse arrive avec un temps de retard | 12 |
| Surtitre Machine à Café et Boulot | Pour toi si tu veux faire rire au boulot sans forcer | 11 |
| Surtitre Confiance | Pour toi si le rire te manque après une période compliquée | 11 |
| Surtitre Storytelling | Pour toi si ta chute arrive quand le dessert est servi | 11 |
| Titre Répartie / défaut (`.titre`) | Ta réplique en soirée, pas dans le bus du retour | 10 (la version validée « pendant la soirée » en faisait 11) |
| Titre Machine à Café et Boulot | Ta réplique pendant la réunion, pas dans l'ascenseur d'après | 9 |
| Titre Confiance | Retrouver le rire à table, sans te forcer | 8 |
| Titre Storytelling | Ton histoire jusqu'à la chute, avant le « et donc ? » | 9 |
| Sous-titre (`ABONNEMENT_HAUT_VISITEUR.sousTitre`, durée = `DUREE_ETAPES`) | Chaque étape tient en 15 à 20 minutes. | 8 |
| Carte : nom (`OFFRE_NOM`) + puces Mensuel, Annuel | Premium · Mensuel · Annuel | 3 |
| Pastille (`ANNUEL_MOIS_OFFERTS_LABEL`, état mensuel) | plus de 3 mois offerts | 5 |
| Prix (état mensuel) | 2,99 € TTC / mois | 3 |
| Ligne annuelle (`ANNUEL_LIGNE_MENSUEL`, état mensuel) | Ou 24,99 €/an, soit 2,08 € par mois. | 6 |
| Ligne annuelle, état annuel choisi (remplace la ligne ci-dessus ; la pastille s'efface) | Soit 2,08 € par mois, plus de 3 mois offerts, 10,89 € économisés par an. | 13 |
| Bouton plein (`ABONNEMENT_CTA.bouton`, un seul libellé pour tous les parcours d'origine) | Ouvrir les 5 parcours · 2,99 €/mois (annuel : · 24,99 €/an) | bouton |
| `ABONNEMENT_CTA.suite` | Deux étapes : ton compte, puis le paiement sécurisé. | 8 |
| `REASSURANCE_PAIEMENT` devient REASS | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | 11 |
| Avantages (composant unique, ÉTALON 6, §2) | 4 lignes | 30 |
| Extrait du carnet : surtitre (`carnetExtraitSurtitre`, inchangé) + titre (`CARNET_EXTRAIT_TITRE`, inchangé) | Carnet de novembre · Situation 15, offerte / Le carnet, en vrai | 6 + 4 |
| Extrait : lien (`CARNET_EXTRAIT_LIEN`, inchangé) | Lire la fiche en entier | lien |
| « Pas encore sûr ? » (`ABONNEMENT_ETAPE_1.texte` + un seul lien, parcours d'origine sinon Répartie) | Pas encore sûr ? Lire l'étape 1 de Répartie, gratuite | 9 |
| **Total (état mensuel, parcours Répartie)** | | **115** (119 avec le lien de l'extrait) ; état annuel : 117 |

Compte connecté sans abonnement (E3, ÉTALON 3 repris tel quel) :

| Emplacement | Texte exact | Mots |
|---|---|---|
| `ABONNEMENT_CONNECTE.titre` | Les 5 parcours, et un carnet de répartie chaque mois | 10 |
| `ABONNEMENT_CONNECTE.paragraphe` | Tout s'ouvre d'un coup, vannes, conseils et vidéos du site compris. | 11 |
| Carte, bouton, REASS, avantages, extrait | comme le visiteur (sans surtitre, sans `suite`, sans « Pas encore sûr ? ») ; ligne « Paiement sécurisé par Stripe » gardée (`abonnement-view.tsx`) | 3+5+3+6+11+4+30+10 |
| **Total** | | **93** (budget 120 OK) |

**Disparaît** : `ABONNEMENT_HAUT_VISITEUR.surtitre` (obsolète) et l'ancien sous-titre « 5 parcours pour t'entraîner, une étape par semaine, 15 à 20 minutes selon le parcours. La première étape de chacun reste en lecture libre. » (24 mots, rythme en calendrier, étape 1 gratuite déjà dite plus bas) ; les boutons « Ouvrir {P} et les 4 autres » (8 à 9 mots) ; « …sécurisé par Stripe » dans `suite` (dit dans la FAQ) ; `ABONNEMENT_CONNECTE.pastille` « Un abonnement, tout ouvert » et l'ancien paragraphe de 57 mots ; la note « Payé en une fois, renouvelé chaque année, résiliable depuis ton profil » ; `10,89 € économisés par an` de la ligne en état mensuel (dit en état annuel) ; la carte « Étape 2 » (`etapeSuivante`) sur /abonnement : elle vit en fin d'étape 1 ; l'intro de l'extrait (`carnetExtraitIntro` « Les 14 autres situations du mois sont dans Premium. ») ; les 5 liens et le titre « Pas encore sûr ? Lis d'abord une étape » avec son texte de 17 mots ; le bloc « Tu annules quand tu veux » (« Ton accès reste actif jusqu'à la fin de ta période en cours… Pas de frais cachés, pas de piège. », 29 mots, dit par REASS) ; l'espace vide sous le prix. **Avant** : 316 / 311 (visiteur), 314 / 309 (connecté).

## 2. Composant « 4 avantages » (`PremiumBenefits`, ÉTALON 6 repris tel quel) : /abonnement seulement

À déplacer en config (`PREMIUM_AVANTAGES`) ; `useContentStats` n'est plus appelé.

| # | Texte exact | Mots |
|---|---|---|
| 1 | Les 5 parcours en entier | 5 |
| 2 | Un nouveau carnet de répartie chaque mois | 7 |
| 3 | Tes favoris : vannes, conseils et vidéos sous la main | 9 |
| 4 | Toutes les vannes, tous les conseils, toutes les vidéos | 9 |
| **Total** | | **30** |

**Disparaît** : les noms et durées des 5 parcours, « Chaque étape avec son conseil, ses vannes, ses vidéos et son quiz. La première étape de chaque parcours est offerte. », le détail du carnet, les compteurs (« 80+ vannes… »), « au lieu de 10 vannes, 3 conseils et 3 vidéos sans abonnement, avec le filtre par catégorie des vannes ». Le composant est **retiré** de l'accueil, du /carnet, de la fenêtre. **Avant** : 110, sur 3 surfaces.

## 3. FAQ de vente : 4 questions (accueil et /abonnement, JSON-LD identique)

Fichier : `lib/faqs.ts`. Les 4 qui lèvent le plus de freins à l'achat : le prix et les frais cachés, « puis-je apprendre ? », « et si je suis timide ? » (le persona), « pourquoi payer alors que YouTube existe ? ». Textes **tels quels**, sauf la réponse prix.

| # | Question | Réponse |
|---|---|---|
| 1 | Est-ce que je peux vraiment apprendre à être drôle ? | inchangée (« 8 semaines », « 50 XP par semaine » protégés par le choix du 29/09) |
| 2 | Comment devenir drôle quand on est timide ou introverti ? | inchangée (« introvertis » protégé). **Point à arbitrer par Thomas** : « progresser à ton rythme » contredit la règle B16 (aucune formule de rythme libre) |
| 3 | 2,99 €/mois, c'est vraiment tout ? Pas de frais cachés ? | **Mensuel (accueil)** : C'est le prix, point. Pas de frais cachés, pas de reconduction surprise. Paiement sécurisé par Stripe. **Annuel disponible (/abonnement)** : C'est le prix, point. Pas de frais cachés. L'abonnement se renouvelle à la fin de chaque période (mois ou année) tant que tu ne résilies pas. Paiement sécurisé par Stripe. |
| 4 | C'est quoi la différence avec juste regarder des vidéos YouTube ? | inchangée |

Correction de fond : « Tu annules en 1 clic depuis ton profil, sans avoir à envoyer un email ou appeler un numéro » est **faux** (on confirme dans le portail Stripe) et redit REASS : retiré. Les prix annuels de la réponse (« 24,99 € en une fois, 2,08 € par mois, 10,89 € économisés ») sont déjà dans le sélecteur juste au-dessus : retirés de la réponse (**à confirmer par Thomas : règle de non-suppression de chiffres en FAQ**). Repli si refus : garder l'ancienne réponse en remplaçant seulement « tu annules en 1 clic » par « tu résilies depuis ton profil ». Même correction à faire dans `llms-content.ts` l. 78 et 154.
**Ne pas supprimer** les 4 autres questions (répartie, sans être méchant, combien de temps, sens de l'humour) : elles restent dans `faqs` (page /parcours, SEO) ; seuls l'accueil et /abonnement affichent les 4 ci-dessus. L'accueil appelle la version mensuelle (le prix annuel n'y vit pas).

## 4. /register (sans champ prénom)

Fichier : `app/(auth)/register/page.tsx` (textes en dur à passer dans `REGISTER_CTA`), `offre.ts`. Ordre : étape, titre, prix, champs, plein, REASS, Google, CGU, liens. Budget 25 hors champs, hors REASS, hors mention CGU.

| Emplacement | Texte exact | Mots |
|---|---|---|
| Étape (inchangé) | Étape 1 sur 2 | 4 |
| H1 (inchangé) | Ton compte | 2 |
| `planReminder(plan)` | Premium, 2,99 € TTC par mois. (annuel : Premium, 24,99 € TTC par an.) | 5 |
| Champs (inchangés) | Email / Mot de passe / Au moins 8 caractères | hors budget |
| `REGISTER_CTA.bouton` (plein, inchangé) | Créer mon compte et passer au paiement | bouton (7) |
| `REMBOURSEMENT_PREMIER_PAIEMENT` devient REASS, collée sous le plein | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | 11 (REASS) |
| Google (inchangé) | S'inscrire avec Google | bouton |
| CGU (inchangé, porte le contrat) | En créant ton compte, tu acceptes les CGU. | 8 (hors budget) |
| « Déjà un compte ? » (inchangé) | Déjà un compte ? Connecte-toi | 4 |
| `REGISTER_CTA.lienEtape1` (fusionne « Tu préfères lire d'abord ? » et « Retour à l'accueil ») | Lire l'étape 1, sans compte | 5 |
| **Total** | | **20** (budget 25 OK) |

**Disparaît** : le champ prénom, son libellé « Prénom (facultatif, pour te saluer dans nos e-mails) » et `prenomPlaceholder` (le prénom se demande ensuite dans /profil, champ existant `compte.ts` l. 149, texte inchangé ; les e-mails ont déjà le repli « Salut, ») ; « annulable à tout moment » du sous-titre (6e formulation de la garantie) ; la ligne « Étape 2 : le paiement sécurisé, juste après. » (redit « Étape 1 sur 2 ») ; `REMBOURSEMENT_PREMIER_PAIEMENT` seul (« Tu as 14 jours pour te faire rembourser ton premier paiement. ») ; « Tu préfères lire d'abord ? L'étape 1 du parcours Répartie, gratuite et sans compte » (14 mots) ; le lien « Retour à l'accueil » (le logo y mène). **Non touché, à décider** : placer Google avant le formulaire (reco audit 1.11, non validée le 18/10). **Avant** : 87 / 77.

## 5. Page de retour après paiement

Fichier : `app/(dashboard)/abonnement/success/page.tsx`.

| Emplacement | Texte exact | Mots |
|---|---|---|
| Titre (inchangé) | Paiement reçu ! | 2 |
| Texte (inchangé) | On déroule le tapis rouge, ton accès s'active… | 8 |
| **Disparaît** | l'émoji 🎉 (`<div aria-hidden>`), interdit par la règle de marque | |

**Avant** : 10 / 10. Les autres états (vérification, connexion, non vérifié) ne sont pas touchés.

## 6. /carnet, visiteur : intro et paywall (E1, ÉTALON 4 repris tel quel)

Fichiers : donnée `docs/copy/carnet/novembre/carnet-2026-11.json` (clé `intro`), `cta-pages.ts` (`CARNET_PAYWALL`), `carnet-page.tsx`.

| Emplacement | Texte exact | Mots |
|---|---|---|
| `view.intro` (carnet de novembre ; à refaire chaque mois sur ce moule) | Du premier froid aux préparatifs de Noël, des situations qui montent d'un cran. | 13 |
| Fiche offerte (donnée, « Le lundi de 9 h 40 », intacte) | | exemptée |
| `CARNET_PAYWALL.titre(n)`, placé juste après la fiche offerte | Ça, c'était la réplique offerte. Il en reste 14. | 9 |
| `CARNET_PAYWALL.paragraphe` | Du plus tranquille au plus tendu, et un nouveau carnet chaque mois. | 12 |
| `CARNET_PAYWALL.bouton(n)` (plein) | Voir les 14 autres répliques · 2,99 €/mois | bouton |
| `CARNET_PAYWALL.suite` devient REASS | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | 11 (REASS) |
| Titre de la liste verrouillée (remplace « Les 14 autres situations du mois ») | Au programme | 2 |
| Liste verrouillée : 3 titres de fiches (données), puis `CARNET_LISTE_RESTE(n-3)` | Et 11 autres situations | 4 |
| **Bloc d'achat hors bouton** | | **21** (budget 25 OK) |

**Disparaît** : `PremiumBenefits` du paywall (110 mots), l'ancien paragraphe de 33 mots (« Elles vont de la moins tendue… Avec Premium, elles s'ouvrent toutes d'un coup »), `CARNET_PAYWALL.suite` de 24 mots (prix TTC, 14 jours, résiliation), les 11 dernières lignes verrouillées, « Les 14 autres situations du mois » (redit « Il en reste 14 »), « Chaque fiche se lit en une minute : la phrase qu'on te dit… » et « pour que tu progresses au fil du mois » de l'intro (durée et promesse). **Avant** : 182 / 176 (paywall), intro 53.

## 7. /profil, compte sans abonnement (E4) et abonné

Fichier : `cta-pages.ts` → `PROFIL_ABONNEMENT_OFFRE` ; `compte.ts` ; `abonnement-card.tsx`.

| Emplacement | Texte exact | Mots hors bouton |
|---|---|---|
| `ligneXp(xp)` (inchangé, si XP > 0 ; placée en premier) | Tu as déjà 120 XP. | 4 |
| `phrase` | Avec Premium, tout s'ouvre d'un coup. | 7 |
| `bouton` (plein, inchangé) | Tout ouvrir · 2,99 €/mois | bouton |
| `ligneDiscrete` devient REASS | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | 11 (REASS) |
| **Total** | | **11** (budget 25 OK) |

**Disparaît** : l'ancienne phrase d'offre (« Avec Premium, tout est ouvert : les 5 parcours en entier, un nouveau carnet de répartie chaque mois, toutes les vannes… Et tu gardes en favori… », 33 mots), la ligne « Résiliable quand tu veux depuis ce profil. Tu as 14 jours pour te faire rembourser ce paiement. ». **Avant** : 62 / 59. Abonné mensuel (upsell `T.versAnnuel`, 12 mots) : inchangé, c'est une ligne unique qui ne cite pas le prix annuel. **Point pour Thomas** : pour un ancien abonné qui revient, « premier paiement remboursable » est vrai pour le premier paiement du nouvel abonnement (`paiement.ts` l. 425) mais le calcul de délai de rétractation compare à la toute première souscription ; pas de promesse fausse dans le texte, à garder en tête côté support.

## 8. Fins de page : /glossaire (E5) et /a-propos (E6)

Fichier : `cta-pages.ts` → `GLOSSAIRE_FIN`, `A_PROPOS_FIN`, `FIN_DE_PAGE_COMMUN`.

| Emplacement | /glossaire (E5) | /a-propos (E6) |
|---|---|---|
| `titre` | Le vocabulaire, c'est fait. Reste à s'en servir. (9, inchangé) | Tu parles et personne rit. / On va arranger ça. (inchangé) |
| `paragraphe` (1 phrase) | Placer un callback au dîner de samedi, c'est autre chose : ça s'entraîne. (12) | Observer, s'entraîner, roder : c'est le programme des 5 parcours. (9) |
| Preuve | aucune | Déjà 1 500+ inscrits, et toi ? (5, retirée si connecté) |
| `bouton` (plein) | Ouvrir les 5 parcours · 2,99 €/mois | idem |
| `ligneDiscrete` devient REASS | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | idem |
| `lienEtape1` (lien, remplace « Lis d'abord une étape, elle est offerte ») | Lire l'étape 1 de Répartie, gratuite | idem |
| **Hors bouton** | **21** | **14** (budget 25 OK) |

**Disparaît** : « Tu sais ce qu'est un callback. » (le titre le dit), « C'est à ça que servent les 5 parcours, de la répartie au storytelling, 15 à 20 minutes par semaine. », `ETAPE_ET_ESSAI` (« Chaque étape : un conseil, un défi, 5 vannes, 2 vidéos, un quiz. La première étape de chaque parcours se lit sans compte, pour juger sur pièce, et le reste s'ouvre d'un coup quand tu t'abonnes », 30 mots), `PROGRAMME_SUITE`, la ligne discrète de 24 mots. **Avant** : 114 / 109 et 100 / 95. Note : /a-propos dit déjà « 1 500+ membres » dans son corps (`page.tsx` l. 91) ; la preuve de E6 est gardée (P0 du 03/10) et doublonne volontairement le pied de page.

## 9. Paywall `premium-paywall.tsx` (web ; mobile natif inchangé hors texte de valeur)

| Emplacement | Texte exact | Mots |
|---|---|---|
| Titre (en dur) | Passe Premium | 2 |
| `PREMIUM_VALUE_TEXT` | Les 5 parcours en entier, le carnet du mois, tes favoris et les listes complètes. | 15 |
| Bouton web (plein) | S'abonner · 2,99 €/mois | bouton |
| `FENETRE_GARANTIE` devient REASS (web seulement) | Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. | 11 (REASS) |

**Disparaît** : l'ancienne phrase de 42 mots (liste des 5 noms, « la première étape de chaque parcours restant offerte »). Natif (Apple 3.1.1) : aucun prix ni lien web, texte de bas de page du store inchangé. **Avant** : ≥ 42.

## 10. E-mail de confirmation : signalement (non réécrit)

`paiement.ts` l. 262 : « Pour bien démarrer : ouvre un parcours et lance l'étape 2 (la première se lit déjà sans compte) : {url}/parcours. » La parenthèse s'adresse à quelqu'un qui vient de payer. **Correction minimale** : « Pour bien démarrer : ouvre un parcours et lance l'étape 2 : {url}/parcours. » Le reste de l'e-mail (légal, validé le 07/10) ne bouge. Option, si Thomas le veut : remonter cette phrase avant le bloc « Résilier ».
