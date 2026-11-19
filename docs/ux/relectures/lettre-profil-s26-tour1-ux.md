# Relecture UX à l'aveugle : La lettre et Profil, s26 lot 2 tour 1 (interrupteur ouvert)

Lu : brief v7, spec UX s26 §3 et §4, TAILLES-lettre / TAILLES-mon-espace_lettres / TAILLES-profil, captures 375, 768 (partiel), 1280, 1920 (partiel) des 4 comptes (lettre : visiteur, en-cours ; profil : visiteur, gratuit, en-cours, nouvel), code `archive-lettres.tsx`, `profil-ouvert.tsx`, `profil-cartes.tsx`, `cap-profil.tsx`, `ligne-mes-questions.tsx`. Non ouvert : 1456, gratuit 375/768, nouvel 768 (pas de verdict dessus).
Décisions tenues non notées : titre blanc, un aplat par écran (sur /lettre l'inscription), colonne de lecture d'une lettre ouverte, textes validés.

## Gate typographique (citée)
- `TAILLES-lettre.md` et `TAILLES-mon-espace_lettres.md` (les deux sorties sont identiques) : visiteur et gratuit = 4 tailles (24 ou 30, 20, 16, 14) et 6 combinaisons à 375, 768, 1280, 1920 ; en-cours et nouvel = 4 tailles, 5 combinaisons. Limite (4 / 6) respectée : PASS.
- `TAILLES-profil.md` : gratuit 375 = 4 tailles / 5 combinaisons, 768 à 1920 = 4 / 6 ; en-cours = 4 / 6 à 375 et 1280 ; nouvel 375 = 4 / 5, 1280 = 4 / 6 ; visiteur = page de connexion (3 tailles / 4). Limite respectée : PASS. Aucune taille hors échelle visible (le 30 contre 24 est le palier de largeur du titre).

## LA LETTRE

### Cognitive walkthrough
- Visiteur 1280 : titre et promesse en haut à gauche, champ e-mail à y 212, bouton plein à y 293 (< 450), case de consentement lisible, aperçu « dernier numéro » à droite (5 col). Il sait quoi faire, le bouton est visible, le feedback est l'état `?statut=`. OK.
- Visiteur 375 : formulaire d'abord, bouton à y ≈ 490 (< 700), aperçu dessous, pas de débordement horizontal visible. OK.
- Abonné 1280/375 : titre, compteur « 2 », tuile de la dernière lettre pleine largeur (teinte violette douce, filet violet), carte de la précédente. Pas de bouton « Lire » (la spec en prévoyait un) : rien ne dit « cliquable » à part le survol. [FRICTION H6] à l'étape « ouvrir la dernière lettre », le first-time user voit un titre dans un cadre teinté sans signe d'action. Solution : chevron SVG `aria-hidden` à droite de la tuile et des cartes (aucun texte neuf, voir pistes).
- Nouvel abonné : les captures montrent 2 lettres (identique à en-cours), donc l'état vide (8/4 dans le code, `ArchiveLettres`) n'est pas jugé sur capture ; le code est conforme à la spec (texte + sortie « Aller à Aujourd'hui », cibles via `LIEN_NEUTRE`).

### Nielsen (flows inscription et archive)
H1 état : PASS (statuts conservés). H2 vocabulaire : PASS. H3 contrôle : PASS (désinscription dans le texte). H4 cohérence : PASS (cartes neutres comme les autres rubriques). H5 prévention : PASS (case de consentement, erreurs conservées). H6 reconnaissance : FAIL léger (tuiles sans cue d'action). H7 raccourcis : PASS. H8 minimalisme : PASS. H9 erreurs : PASS (non rejoué). H10 aide : PASS (ligne « Gratuit, sans compte »).

### Mesures et vides (règle : > 32 px au milieu d'un bloc = faute)
- Visiteur 1280 et 1920 : colonne gauche (formulaire) finit à y ≈ 560 (original), colonne droite à y ≈ 2590 : environ 2 000 px de vide en fin de colonne. Permis par la règle (fin de colonne), mais c'est le défaut visuel majeur de la page : à 1280 la moitié gauche est noire sous le formulaire. Piste 1 ci-dessous.
- Abonné 1280 : une seule carte « précédentes » en 1/3 de largeur, 2/3 vides à droite : fin de rangée, permis. Intervalle tuile / carte 48 px, entre deux blocs : permis.
- Compteur « 2 » seul, à 1 216 px du titre (extrémité droite) : lu comme un résidu, sans libellé visible.
- Aplat violet : 1 par écran (visiteur : « Envoie-moi la lettre »). Abonné : 0 aplat (tuile teintée uniquement) : conforme à « au plus un ».
- Cibles : cartes `min-h-14` (56 px), voisines `min-h-11` (44 px), focus `ring-2` : PASS. Tailles : PASS.

### Notes UX
1 Prospect, envie en 3 s : 9/10 (promesse, champ et bouton au premier écran, preuve à côté ; manque : colonne gauche vide sous le formulaire).
2 Abonné, clarté : 8/10 (tuile de tête évidente par la position, pas de cue d'action).
3 Abonné, envie de continuer : 8/10 (compteur sans repère, aucune notion « n'a pas lu » ; la spec l'autorise à rester ainsi tant qu'aucun état de lecture n'existe).
4 Nouvel abonné : 9/10 (code conforme, capture non représentative).
5 Accessibilité et cohérence : 9/10.
**Minimum : 8/10. Pas de faute dure sur La lettre.**

### Pistes (3 max, aucune ne crée de texte)
1. Colonne d'inscription collante : sur la colonne gauche de `/lettre` (composant de page `LettrePageInscription`, conteneur 7 col), ajouter `lg:sticky lg:top-36 lg:self-start` (même `top-36` que le rail de `LettreVue`) : le formulaire reste visible pendant la lecture du numéro et le vide gauche disparaît. Ferait gagner 1 point.
2. Cue d'action sur les tuiles de `archive-lettres.tsx` / page archive : icône chevron SVG `aria-hidden` à droite, `text-text-secondary`, `group-hover:text-text-primary` ; la tuile de tête garde son filet. Un libellé « Lire » est un texte : à valider par Thomas.
3. Compteur : le coller au titre (`flex items-baseline gap-3` au lieu de `justify-between`), ainsi « La lettre 2 » se lit d'un bloc.

## PROFIL

### Cognitive walkthrough
- Gratuit 1280 : « Prochaine étape » à gauche (3 tuiles liens), carte Abonnement à droite avec le seul aplat « S'abonner · 1,99 €/mois » à y ≈ 392 (< 450) ; il comprend qu'il n'a pas d'abonnement (pastille « Aucun abonnement »). OK. Piste : la 3e tuile laisse une case vide à droite (fin de grille, permis).
- Abonné en cours 1280 : « Reprendre ton parcours » en tête, bouton plein, puis cap, statistiques, parcours à gauche ; abonnement et réglages à droite. Clair. À 1280 la colonne droite finit 225 px plus bas que la gauche : fin de colonne, permis.
- Nouvel 1280/1920 : cap 1, série à zéro, statistiques à 0, « Mes parcours » vide avec « Découvrir les parcours ». Jamais morte : OK. Mais le seul aplat violet visible est l'interrupteur « La lettre de la semaine » (voir faute 3) : l'oeil va à un réglage, pas à la prochaine étape.
- Sous 1024 (en-cours 375 et 768, nouvel 375) : la carte « Ton cap » est étirée (440 px à 375, 326 px à 768 ; 185 à 231 px de vide sous « 250 XP gagnés ») pendant que « Statistiques » et « Mes parcours » sont écrasés : labels des 4 compteurs coupés à 768, 2e parcours (Répartie) absent à 768, phrase du parcours vide coupée et bouton « Découvrir les parcours » invisible à 375 nouvel. Le first-time user ne peut ni lire ses stats ni voir l'action. Cause probable : `h-full` posé par `CapProfil` (`apps/web/src/components/espace/cap-profil.tsx` l.37) dans la colonne `data-profil-zone="progression"`, qui devient une hauteur définie dès qu'elle est item de grille (< 1024) ; à 1280 `items-start` l'évite.

### Ordre de tabulation sous 1024 (connu, à juger)
Le DOM est : action, abonnement, réglages, progression (`profil-ouvert.tsx`, le bloc `contents` précède la zone progression ; `order-3` / `order-4` ne changent que l'affichage). Le visuel est : action, abonnement, progression, réglages. En clavier, Tab passe de « Renoncer au contrat ici » au bouton du rappel (plus bas), puis lettre, prénom, « Mes questions » (environ 5 arrêts, 700 px plus bas à 375), puis revient en haut à « Voir tout » et aux cartes parcours. Ça gêne : saut visuel du focus vers le bas puis retour, et c'est un échec de WCAG 2.4.3 (ordre du focus, niveau A). Correction codable : DOM en deux enveloppes `lg:flex lg:flex-col lg:gap-6` (gauche : action puis progression ; droite : abonnement puis réglages), toutes deux `contents` sous 1024, avec l'ordre DOM action, progression, abonnement, réglages et `order` supprimé ; la grille `lg:grid-rows-[auto_1fr]` devient inutile. Effet sous 1024 : pour l'abonné, l'abonnement (pas d'action dedans) passe après la progression, écart assumé avec la spec ; pour le gratuit rien ne change (pas de progression, l'offre reste 2e).

### Nielsen (flow Profil)
H1 état : FAIL (cartes écrasées sous 1024, contenu masqué). H2 vocabulaire : PASS. H3 contrôle : PASS (interrupteurs, suppression confirmée). H4 cohérence : FAIL léger (Cap étiré seul de la pile ; interrupteur violet contre « un seul accent »). H5 prévention : PASS (encadré de suppression avec les conséquences). H6 reconnaissance : PASS. H7 raccourcis : FAIL (ordre du focus). H8 minimalisme : PASS à 1280, FAIL sous 1024 (vides). H9 erreurs : non rejoué. H10 aide : PASS.

### Vides et mesures (captures)
- Cap étiré : 185 px (768 en-cours), 231 px (375 en-cours), 207 px (375 nouvel) de vide sous le dernier texte de la carte. Fin de carte donc toléré en soi, mais la carte est le symptôme du défaut ci-dessus.
- « Ta question à l'équipe » 1280 en-cours/nouvel : carte de 103 px pour une ligne de 20 px, soit environ 41 px au-dessus et au-dessous du texte (`LigneMesQuestions`, `CardContent py-3` + lien `min-h-11` dans une `Card` à marge propre). C'est un vide de début de bloc > 32 px.
- Supprimer mon compte 1280 : le bouton rouge est à 370 px du texte (justify-between), lecture et action séparées ; discret comme voulu, voir piste.
- Aplats : en-cours = 2 (bouton « Reprendre l'étape 3 » et interrupteur « La lettre de la semaine » rempli en violet). Gratuit = 1 (S'abonner). Nouvel = 1 (l'interrupteur, sans bouton plein). Visiteur : page de connexion, 1 aplat.
- Cibles 44 px : boutons plein (`buttonVariants lg`) et lien « Mes questions » 44 px ; interrupteurs non mesurés (graphiques 38 × 24 visibles, zone cliquable à vérifier).

### Notes UX
1 Prospect (gratuit) : 9/10 (offre à droite, en haut, une seule).
2 Abonné, clarté : 8/10 à 1280, 5/10 sous 1024 (cartes écrasées).
3 Abonné, envie de continuer : 7/10 (cap, série, parcours présents à 1280 ; stats et parcours illisibles sous 1024).
4 Nouvel abonné : 7/10 (pas de page morte, mais l'accent est sur un réglage).
5 Accessibilité et cohérence : 5/10 (ordre du focus, second aplat).
**Minimum : 5/10, fautes dures ci-dessous.** Les notes de design ne sont pas dans ce document.

### Pistes (3 max)
1. Connexion : le visiteur sur /profil arrive sur une page pleine sans en-tête ni pied (capture 1280), alors que la préférence fondateur est l'auth en fenêtre avec repères ; la carte `ConnexionProfil` existante n'est jamais vue. Hors périmètre de la page, à arbitrer par Thomas.
2. Tuile impaire : dans `ProchaineEtape` (`profil-cartes.tsx` l.72-73), la 3e tuile prend toute la ligne (`sm:[&>li:last-child:nth-child(odd)]:col-span-2`) : plus de case vide à droite à 768 et 1280 (gratuit, nouvel).
3. Suppression : dans `SupprimerCompteCard`, le bouton rouge sous le texte, aligné à gauche (`justify-start`), plutôt que seul à 370 px.

## NOTE GLOBALE La lettre : 8/10

## NOTE GLOBALE Profil : 5/10

## Fautes dures (chiffrées)
La lettre : aucune.
Profil :
1. Contenu masqué sous 1024 (labels des 4 compteurs coupés et 2e parcours absent à 768 en-cours ; bouton « Découvrir les parcours » invisible à 375 nouvel), carte « Ton cap » étirée de 185 à 231 px de vide : `apps/web/src/components/espace/cap-profil.tsx` (retirer `h-full`, l.37), vérifier `profil-ouvert.tsx` (zone progression).
2. Ordre de tabulation sous 1024 : 5 arrêts de réglages avant la progression, WCAG 2.4.3 : `apps/web/src/components/espace/profil/profil-ouvert.tsx` (DOM en deux enveloppes, voir plus haut).
3. Second aplat violet à 1280 en-cours (bouton « Reprendre » + interrupteur « La lettre de la semaine » rempli) et unique aplat sur le réglage chez le nouvel : neutraliser l'état actif de l'interrupteur dans `profil-ouvert.tsx` (même méthode que `NEUTRE_CAP` : `[&_[role=switch][aria-checked=true]]:bg-text-secondary` sur `GRILLE`, sans toucher `LettreHebdoReglage`).
4. Carte « Ta question à l'équipe » : 103 px pour une ligne, environ 41 px de vide au-dessus du texte : `apps/web/src/components/espace/profil/ligne-mes-questions.tsx` (retirer la marge de la `Card` dans `CardContent`, `py-3` seul, ou lien sans `min-h-11` hors du paragraphe en `inline-flex`).
