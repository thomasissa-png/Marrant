# Contrôle d'ensemble de l'espace (s26) : préversion 1a750c0d, 20/11

[LIVE] Playwright (Chromium, dSF 1, `load` + 1,5 s), localhost:5400, 12 adresses × 4 comptes × 375/1280 ; `comptes.sh`
avant chaque série et à la fin ; ni code ni base modifiés. Critères : **C1** HTTP 200 (ou redirection non-abonné), 0 erreur
console/JS/HTTP ≥ 400, 0 débordement · **C2** cartes du 1er écran avec bandeau violet (élément ou `::before`) ET émoji ou
pastille · **C3** ≤ 1 aplat violet par fenêtre d'écran glissante (fixes comptés partout) · **C4** 0 `uppercase` dans `main` ·
**C5** 0 vide > 32 px entre contenus ou sous le dernier (rembourrage déduit, liste collante exclue) · **C6** 1280 : filtre de
liste, clic 4e ligne, même nœud, fiche à droite, retour même URL/filtre/ligne ±24 px ; 375 : liste OU fiche · **C7** 0
« 1 500+ » · **C8** en-tête « Tout ouvrir · 1,99 €/mois » (« Tout ouvrir » < 640), visiteur et gratuit.
Cellule = `375/1280`, - = sans objet (C6 hors liste ; C8 abonnés, et les 10 adresses où l'en-tête masque son bouton,
offre en haut de page, décision du 16/11 `apercu/offre-en-haut.ts`, vérifié masqué ; Profil visiteur renvoyé à /login).

## Tableau (768 cellules : 489 PASS, 107 FAIL, 172 sans objet)

| Page | Compte | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 |
|---|---|---|---|---|---|---|---|---|---|
| Aujourd'hui | abonné | P/P | P/P | P/P | P/P | P/F | -/- | P/P | -/- |
| Aujourd'hui | nouvel ab. | P/P | P/P | P/P | P/P | P/F | -/- | P/P | -/- |
| Aujourd'hui | gratuit | P/P | F/F | P/F | P/P | P/F | -/- | P/P | -/- |
| Aujourd'hui | visiteur | P/P | F/F | P/F | P/P | P/F | -/- | P/P | -/- |
| Parcours | abonné | P/P | F/F | P/P | F/F | P/P | -/- | P/P | -/- |
| Parcours | nouvel ab. | P/P | F/F | P/P | F/F | P/P | -/- | P/P | -/- |
| Parcours | gratuit | P/P | F/F | P/P | F/F | P/P | -/- | P/P | P/P |
| Parcours | visiteur | P/P | F/F | P/P | F/F | P/P | -/- | P/P | P/P |
| Parcours Répartie | abonné | P/P | P/F | P/P | P/P | F/F | -/- | P/P | -/- |
| Parcours Répartie | nouvel ab. | P/P | P/F | P/P | P/P | F/F | -/- | P/P | -/- |
| Parcours Répartie | gratuit | P/P | P/F | P/P | P/P | F/F | -/- | P/P | P/P |
| Parcours Répartie | visiteur | P/P | P/F | P/P | P/P | F/F | -/- | P/P | P/P |
| Quoi répondre | abonné | P/P | F/P | P/P | P/F | P/P | P/P | P/P | -/- |
| Quoi répondre | nouvel ab. | P/P | F/P | P/P | P/F | P/P | P/P | P/P | -/- |
| Quoi répondre | gratuit | P/P | F/F | P/P | P/P | P/P | -/- | P/P | -/- |
| Quoi répondre | visiteur | P/P | F/F | P/P | P/P | P/P | -/- | P/P | -/- |
| Bibliothèque | abonné | P/P | F/P | P/P | P/P | P/P | P/P | P/P | -/- |
| Bibliothèque | nouvel ab. | P/P | F/P | P/P | P/P | P/P | P/P | P/P | -/- |
| Bibliothèque | gratuit | P/P | F/F | P/P | P/P | P/P | -/- | P/P | -/- |
| Bibliothèque | visiteur | P/P | F/F | P/P | P/P | P/P | -/- | P/P | -/- |
| S'entraîner | abonné | P/P | P/P | P/P | F/F | P/P | -/- | P/P | -/- |
| S'entraîner | nouvel ab. | P/P | P/P | P/P | F/F | P/P | -/- | P/P | -/- |
| S'entraîner | gratuit | P/P | F/F | P/P | P/P | P/P | -/- | P/P | -/- |
| S'entraîner | visiteur | P/P | F/F | P/P | P/P | P/P | -/- | P/P | -/- |
| Carnet | abonné | P/P | F/P | P/P | P/P | P/P | P/P | P/P | -/- |
| Carnet | nouvel ab. | P/P | F/P | P/P | P/P | P/P | P/P | P/P | -/- |
| Carnet | gratuit | P/P | F/F | P/P | P/P | P/P | -/- | F/F | -/- |
| Carnet | visiteur | P/P | F/F | P/P | P/P | P/P | -/- | F/F | -/- |
| Favoris | abonné | P/P | P/P | P/P | P/P | P/P | P/P | P/P | -/- |
| Favoris | nouvel ab. | P/P | F/F | P/P | P/P | P/P | -/- | P/P | -/- |
| Favoris | gratuit | P/P | F/F | P/F | P/P | P/P | -/- | P/P | -/- |
| Favoris | visiteur | P/P | F/F | P/F | P/P | P/P | -/- | P/P | -/- |
| Mes questions | abonné | P/P | P/P | P/P | P/P | P/P | P/F | P/P | -/- |
| Mes questions | nouvel ab. | P/P | F/F | P/P | P/P | P/P | -/- | P/P | -/- |
| Mes questions | gratuit | P/P | F/F | P/P | P/P | P/F | -/- | P/P | -/- |
| Mes questions | visiteur | P/P | F/F | P/P | P/P | P/F | -/- | P/P | -/- |
| Mes répliques | abonné | P/P | P/P | P/P | P/P | P/P | -/- | P/P | -/- |
| Mes répliques | nouvel ab. | P/P | F/F | P/P | P/P | P/P | -/- | P/P | -/- |
| Mes répliques | gratuit | P/P | F/F | P/P | P/P | P/P | -/- | P/P | -/- |
| Mes répliques | visiteur | P/P | F/F | P/P | P/P | P/P | -/- | P/P | -/- |
| Profil | abonné | P/P | F/F | P/P | P/P | P/P | -/- | P/P | -/- |
| Profil | nouvel ab. | P/P | F/F | P/P | P/P | P/P | -/- | P/P | -/- |
| Profil | gratuit | P/P | F/F | P/P | P/P | P/P | -/- | P/P | -/- |
| Profil | visiteur | P/P | -/- | P/P | P/P | -/- | -/- | P/P | -/- |
| La lettre | abonné | P/P | F/F | P/P | P/P | P/P | -/- | P/P | -/- |
| La lettre | nouvel ab. | P/P | F/F | P/P | P/P | P/P | -/- | P/P | -/- |
| La lettre | gratuit | P/P | F/F | P/P | P/P | P/P | -/- | P/P | -/- |
| La lettre | visiteur | P/P | F/F | P/P | P/P | P/P | -/- | P/P | -/- |

Par critère (P/F/-) : C1 96/0/0 · C2 24/70/2 · C3 92/4/0 · C4 82/14/0 · C5 80/14/2 · C6 15/1/80 · C7 92/4/0 · C8 8/0/88.

C1 : 12 PASS sous réserve (Aujourd'hui abonnés, Parcours Répartie) : vignettes YouTube `/_next/image` en 500, sans réseau.

## FAIL (mesures ; captures dans ce dossier, pleine page)

**C2 : DA de l'accueil absente (70 cellules)**
- **Aperçus du visiteur et du gratuit (9 rubriques, 375 et 1280)** : carte d'offre (« Premium ouvre tout… ») et cartes
  d'exemple verrouillées sans bandeau ; 0 bandeau sur Aujourd'hui, S'entraîner, Favoris, Mes questions, Mes répliques,
  Profil (gratuit). 1280 : 6/6 cartes sans bandeau sur Aujourd'hui, 4/4 sur S'entraîner, Mes questions, Mes répliques,
  5/5 sur Favoris. `aujourdhui-inscrit-gratuit-375.png`, `aujourdhui-inscrit-gratuit-1280.png`, `s-entrainer-inscrit-gratuit-375.png`, `favoris-inscrit-gratuit-1280.png`.
- **La lettre (4 comptes)** : 2/2 cartes sans bandeau, 0 émoji, 0 pastille (archive de l'abonné, inscription du
  visiteur). `lettre-abonne-en-cours-1280.png`, `lettre-abonne-en-cours-375.png`.
- **Profil (abonnés et gratuit)** : « Reprendre ton parcours », « Statistiques » (abonné), « Prochaine étape »,
  « Abonnement » (gratuit) sans bandeau ; 0 émoji, 0 pastille. `profil-abonne-en-cours-1280.png`, `profil-abonne-en-cours-375.png`.
- **Parcours (4 comptes)** : « Tes 4 premières semaines » sans bandeau (abonnés) ; cartes de parcours « ☕ Débutant… »
  sans bandeau (visiteur, gratuit). `parcours-abonne-en-cours-1280.png`, `parcours-abonne-en-cours-375.png`.
- **Parcours Répartie, 1280 (4 comptes)** : carte de tête « Parcours Répartie » de la colonne de gauche sans bandeau
  (1/3). `parcours-repartie-abonne-en-cours-1280.png`.
- **Quoi répondre, 375 (abonnés)** : carte « prochaine » « Coloc : « C'est quoi, cette odeur ? » » à liseré violet,
  sans bandeau ; 0 émoji, 0 pastille au premier écran. `quoi-repondre-abonne-en-cours-375.png`.
- **Bibliothèque, 375 (abonnés)** : vue liste, bandeau présent mais 0 émoji, 0 pastille. `bibliotheque-abonne-en-cours-375.png`.
- **Carnet, 375 (abonnés)** : vue liste seule, carte de liste neutre : 0 bandeau, 0 émoji. `carnet-abonne-en-cours-375.png`.
- **Mes questions, Mes répliques, Favoris du nouvel abonné (état vide)** : bandeaux présents (questions, répliques)
  mais 0 émoji, 0 pastille ; Favoris vide : carte « Aucun favori pour l'instant » sans bandeau.
  `questions-nouvel-abonne-375.png`, `repliques-nouvel-abonne-375.png`, `favoris-nouvel-abonne-375.png`.

**C3 : deux aplats violets dans un même écran (gratuit et visiteur, 1280)** : « Tout ouvrir · 1,99 €/mois » du haut et
celui de « La suite est dans Premium », fenêtre 120 → 1020 (Aujourd'hui) et 80 → 980 (Favoris). `aujourdhui-inscrit-gratuit-1280.png`, `favoris-inscrit-gratuit-1280.png`.

**C4 : capitales dans `main` (14 cellules)**
- Parcours (4 comptes × 2 largeurs) : « Programme » ×5. `parcours-abonne-en-cours-375.png`.
- S'entraîner (abonnés, 375 et 1280) : « La scène », « Le contexte ». `s-entrainer-abonne-en-cours-375.png`.
- Quoi répondre (abonnés, 1280) : « La scène », « À toi » (voir `quoi-repondre-abonne-en-cours-1280.png`).

**C5 : vide > 32 px dans une carte (14 cellules)**
- Aujourd'hui 1280 : « Vidéo du jour » 81 px sous le titre de la vidéo (abonnés, carte étirée à la hauteur de la
  colonne voisine) ; aperçu « Vanne du jour » 76 px en fin de carte (gratuit, visiteur). `aujourdhui-abonne-en-cours-1280.png`.
- Parcours Répartie (4 comptes, 2 largeurs) : 37 à 41 px dans la carte de l'étape ouverte (abonné 1280 : sous
  « +100 XP », y 473 → 513 ; abonné 375 : entre « Lire la fiche du conseil » et « Exemple concret » ; autres comptes :
  carte « Étape 1 : Tes premières répliques »). `parcours-repartie-abonne-en-cours-375.png`.
- Mes questions, aperçu 1280 (gratuit, visiteur) : « Mes envois » 71 px vides en bas (carte étirée). `questions-inscrit-gratuit-1280.png`.

**C6 : liste + détail**
- Mes questions, abonné 1280 : le clic sur l'envoi charge `/mon-espace/questions/prev-fil-1`, la liste « Mes envois »
  est démontée puis remplacée par un rail (autre nœud) ; titre de page « Une question ». `questions-abonne-en-cours-1280.png`,
  `questions-detail-abonne-en-cours-1280.png`. Les 15 autres essais passent (Quoi répondre avec filtre « Coloc »,
  Carnet avec « quotidien », Bibliothèque et Favoris sans filtre dans la liste ; ligne retrouvée au pixel près).

**C7 : « 1 500+ » (gratuit, visiteur, 375 et 1280)**
- Carnet : « 1 500+ inscrits bossent leur humour. » sous l'intro (`components/espace/carnet/carnet-ouvert.tsx:74`,
  `<Preuve place="hero" />`, gardée volontairement selon le commentaire l. 78 : arbitrage à faire). `carnet-inscrit-gratuit-375.png`.

Écarté (faux positif) : champ factice « Écris ta version » de l'aperçu Mes répliques (zone de saisie, pas un vide).
Limites : C2 et C5 = détecteurs DOM [LIVE] ; 30 captures, dont `<page>-abonne-en-cours-1280.png` pour les 12 pages.
