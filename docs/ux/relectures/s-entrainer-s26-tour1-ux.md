# Relecture UX à l'aveugle : S'entraîner, s26 tour 1

Captures ouvertes : visiteur, gratuit, en-cours, nouvel à 375, 1280 et 1920 (768 et 1456 non ouverts). Code lu : `apps/web/src/app/(dashboard)/mon-espace/s-entrainer/page.tsx` (vue abonné). Décisions listées dans le brief : non notées.

## Gate typographique (TAILLES.md, citée)
- Premier écran, 4 comptes : 375 et 768 = 24/20/16/14 ; 1280 et 1920 = 30/20/16/14. **4 tailles distinctes partout** (limite 4 : PASS).
- Combinaisons : 6 sur visiteur, gratuit, en-cours (375, 768, 1280, 1920) ; 5 sur nouvel 375 ; 6 sur nouvel 768/1280/1920 (limite 6 : PASS). Graisses 400 et 600 seulement.
- Aucune faute dure typographique. Aucune taille ajoutée pour combler un vide.

## Cognitive walkthrough

Prospect (visiteur, 375) : 1) il lit « S'entraîner », la promesse « Ici, rien n'est noté : tu t'essaies avant que ça compte » (bonne place, sous le titre) ; 2) le bouton « Premium · 1,99 €/mois » est à y≈345, sous le titre, avant tout contenu ; 3) l'exemple « Quelle réplique ? » avec A, B, C lisibles donne la question « laquelle je dis ? », puis le verrou et les barres de « Ce qu'on aurait pu dire » disent que la réponse est derrière. Il comprend en 3 secondes : un jeu, un coach qui corrige, c'est payant. OUI à chaque étape.

Abonné avancé (en-cours, 1280) : la carte teintée occupe le haut gauche, c'est la prochaine action ; l'échelle des marches à droite montre « Marche 1 Fait », la 2 surlignée. OUI. À 375, voir plus bas.

Nouvel abonné (1280) : carte « Soirée », échelle avec marche 1 surlignée, mission marche 1 en dessous. Pas de page morte. OUI.

[FRICTION H1] À 375, en-cours : le premier bouton d'action (« 10 secondes pour répondre », y≈808-852) coupe le bas du premier écran, les boutons Oui / À moitié / Rien sont à y≈945-975 ; nouvel : Oui / À moitié / Rien à y≈1078 (scène de 8 lignes). L'abonné ne voit que le titre et la scène avant de défiler. Solution : sur mobile, resserrer le haut (`pt-4`, `mt-4`, `gap-4` sous `lg`) ; pour nouvel, accepter la lecture de la scène comme première action (le critère §4.6 de la spec design suppose un bouton visible, impossible avec cette scène).

[FRICTION H4] Quatre pilules de même apparence dans la carte (« 10 secondes pour répondre » puis Oui / À moitié / Rien) : le minuteur ressemble à une réponse. L'ordre vertical aide, pas le poids visuel (le « même poids » des trois réponses est connu ; le minuteur est un cas à part).

## Audit Nielsen (flow : traiter une carte puis la mission)
1 Visibilité de l'état : FAIL partiel, segments sans libellé ni équivalent lecteur d'écran (voir UX3). 2 Vocabulaire du persona : PASS (« Ta réponse d'abord », « Prends ton temps »). 3 Contrôle : PASS (marches cliquables, cartes repliables). 4 Cohérence : PASS (visiteur et gratuit identiques à 1280, seule la ligne d'offre diffère, logique). 5 Prévention d'erreurs : PASS. 6 Reconnaissance : PASS (échelle toujours visible). 7 Raccourcis : PASS (ancre `#carte-N`). 8 Minimalisme : PASS avec réserve (sept pilules de même style au premier écran 1280 en-cours). 9 Erreurs : non testable sur captures. 10 Aide : PASS (« Avant de lire la suite, dis ta réponse… »).

## Notes

**UX1 Prospect : 9/10.** Offre en haut (y 178 à 1280, y≈345 à 375), une seule offre, fermé lisible (verrous, barres, mention « Voici un exemple… ouverte avec Premium »), valeur visible (jeu A/B/C, 5 marches, 1 500+ inscrits). Défaut : l'échelle de la mission du visiteur ne marque pas la marche 1 comme ouverte, seule l'absence de verrou la distingue (captures 1280/1920 : marche 1 sans icône) ; les 5 pastilles du hero sont inertes mais ressemblent à des filtres. Pour 10 : un repère visible sur la marche 1 (constante existante, sans texte neuf, ex. icône d'ouverture) dans `components/espace/apercu/apercu-s-entrainer.tsx`.

**UX2 Abonné, clarté : 8/10.** Une zone dominante, prochaine action en haut à gauche, échelle à droite : clair à 1280 et 1920. Défauts : FRICTION H1 et H4 ci-dessus. Pour 10 : en-tête et gouttières resserrés sous `lg` dans `page.tsx` (`mt-8` en `mt-4 lg:mt-8`, `gap-6` en `gap-4 lg:gap-6`) et minuteur distingué des réponses (lien neutre ou contour plus léger, dans `carte/*`).

**UX3 Abonné, envie de continuer : 8/10.** L'échelle (Fait, marche en cours surlignée, signal de niveau) et la mission donnent une suite. Défaut précis : les segments de rafale (`page.tsx` l.96-102) sont un rail gris `h-2` sans texte, `aria-hidden`, donc 0 sur 2 à 1280/375 en-cours et 1 trait plein-largeur sur nouvel : à l'écran ils se lisent comme un séparateur ou un chargement vide, pas comme « 0 carte sur 2 ». Aucune série ni compteur de jours visible (rien n'existe : pas une faute). Pour 10 : masquer les segments quand `segments.total <= 1` (nouvel) et, au-dessus, rendre le segment de la carte en cours distinct (`border border-border-hover`) ; sinon accepter de ne montrer que l'échelle.

**UX4 Nouvel abonné : 9/10.** Jamais une page morte : une carte, la marche 1 surlignée, la mission, les retours. Défaut : colonne gauche vide sous la carte, ≈140 px à 1280 et 1920 (y 916 à 1056) : vide de fin de colonne, permis, donc piste. Pour 10 : rien de codable sans contenu neuf.

**UX5 Accessibilité et cohérence : 8/10.** Cibles de 44 px et plus mesurées sur capture (pilules 808-852 = 44, sommaire replié 50, lignes d'échelle 48) ; contrastes lisibles ; cohérence visiteur/gratuit bonne. Défaut : la progression des segments n'a aucun équivalent texte (`aria-hidden`, valeur seulement en `data-segments-rafale`) ; le minuteur est présent chez en-cours et absent chez nouvel pour une carte du même type (cohérence entre comptes à confirmer côté donnée). Pour 10 : exposer `faites/total` en `role="img"` avec `aria-label` bâti sur un libellé existant, ou `sr-only` si une constante existe.

## Vides (règle 32 px)
Aucun vide > 32 px au milieu d'un bloc (pilule minuteur à « Prends ton temps » ≈ 27 px ; hero 1280 entre « 1 500+ » et « Voici un exemple » ≈ 60 px, hors bloc). Vides de fin de colonne (permis) : tuile mission du visiteur ≈ 167 px sous la marche 5 à 1280/1920 ; colonne cartes abonné ≈ 75 à 140 px.

## Pistes (3)
1. Tuile mission de l'aperçu à 1280/1920 : ≈167 px vides en bas ; `lg:self-start` sur la tuile ou la grille réduirait l'impression de tuile creuse (fonction avant forme : à arbitrer).
2. Minuteur distinct des trois réponses (voir H4).
3. Segments : supprimer, ou donner un état « en cours » (voir UX3).

NOTE GLOBALE : 8/10

Fautes dures : aucune (gate typographique PASS, un seul accent, aucun vide mort mesuré au milieu d'un bloc). Sous la barre de 9 sur UX2, UX3 et UX5 (défauts ci-dessus, corrections codables).
