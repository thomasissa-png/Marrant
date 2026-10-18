# Concision du tunnel : version validée (18/10)

**Textes à brancher : `textes-v5-a.md`, `textes-v5-b.md`, `textes-v5-c.md`** (règles : `inventaire-et-etalons.md` §4, choix de Thomas du 18/10 dans `docs/founder-preferences.md`).

Relecture à l'aveugle, 3 relecteurs constants (visiteur pressé, sceptique, cohérence), grille « envie + lisibilité en 5 secondes sur téléphone », budget de mots plafonnant à 7, ajout = retrait :
- tour 1 (v1) : notes 5 à 9, 1 surface à 10 ; tour 2 (v2) : ~10 surfaces à 10 ; tour 3 (v3) : 22 sur ~25 à 10 ; tour 4 (confirmation des 6 retouches) : 5/6 à 10 chez le relecteur pressé, retouches convergentes appliquées en v5 :
  - /abonnement sous-titre « Pas d'attente entre les étapes, de 15 à 20 minutes chacune. » (proposé mot pour mot par 2 relecteurs) ;
  - /vannes limite « Les 10 gratuites, c'est fait. » (répétition de « vannes » relevée par les 3) ;
  - ligne de la lettre en fin d'étape 1 « Lettre gratuite : une vanne décryptée par mois. » (alignée sur le bas d'article).
- Arrêts motivés (non retouchés) : fenêtre « voter » (le relecteur sceptique bute sur le geste payer-pour-voter, pas sur le texte, 10/10 chez les 2 autres) ; titre du paywall « Le reste, avec Premium » (10/10 chez 2, « Passe Premium » refusé au tour 2 comme ordre de pub) ; cartes d'accueil (10/10 chez 2) ; ordre de /abonnement (bouton avant les avantages, choix de mise en page : bouton visible sans défiler) ; titre de /a-propos (signature, choix de Thomas).
- Volume : ≈ 2 400 mots hors bouton avant le chantier → ≈ 460 en v5 ; /abonnement ≤ 101 mots (budget 120). Zéro tiret cadratin. Faits vérifiés dans le code : vote réservé à Premium, 15 à 20 minutes par étape.
- À vérifier au rendu (@qa) : « Tester l'étape 1 de Machine à Café, gratuite » à 375 px ; « Premium · 2,99 €/mois » dans l'en-tête à 320 px ; fin d'étape 1 : deux formulaires empilés (paiement puis lettre), lettre repliable derrière un lien si besoin (@design).
