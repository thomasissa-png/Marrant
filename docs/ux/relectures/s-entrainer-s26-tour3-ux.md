# Relecture UX à l'aveugle : S'entraîner, s26, tour 3

Périmètre : captures `docs/captures/s26/rubriques-tour-3/s-entrainer/` (visiteur, gratuit, en-cours, nouvel ; 375, 1280 et 1920 ouverts ; INDEX.md : toutes HTTP 200). Brief v7 et spec `docs/ux/rubriques-premium-s26.md` §3 lus. Aucune relecture existante consultée. Exclusions du prompt respectées (verrouillage réel, titre en dégradé, promesse jugée sur sa place, filet violet, « La suite est dans Premium », pas de bouton plein sur la carte du jour, segments de progression cachés, pas de texte neuf).

## Gate typographique (TAILLES.md, citée)
- Visiteur et gratuit, 375/768 : 4 tailles (24, 20, 16, 14), 6 combinaisons. 1280/1920 : 4 tailles (30, 20, 16, 14), 6 combinaisons.
- En-cours : idem, 4 tailles, 6 combinaisons à toutes les largeurs.
- Nouvel : 375 = 4 tailles, 5 combinaisons ; 768/1280/1920 = 4 tailles, 6 combinaisons.
- Verdict : PASS (limite 4 / 6). Les 6 combinaisons sont au plafond : toute correction ajoutant un style la ferait basculer en faute dure. Tailles toutes dans l'échelle 30/24, 20, 16, 14 (600/400).

## Lecture par compte

**Visiteur / gratuit (aperçu).** 1280 : hero (badge Premium, titre, ligne « Ici, rien n'est noté », 5 pastilles, « 1 500+ ») à gauche, carte d'offre à droite avec bouton plein à y = 202 (< 450). Extrait 7/5 : jeu « Quelle réplique ? » avec consigne et propositions A, B, C lisibles, bloc « Ce qu'on aurait pu dire » fermé (verrou + barres) ; à droite échelle des 5 marches (1 ouverte, 4 verrouillées) puis « Quand ça tombe à plat ». Les deux colonnes finissent à la même ligne (y = 968). « Raconte-nous… » passe sous le fondu. Bouton de fin à y = 1235 (> 900) : jamais deux boutons pleins ensemble au premier écran. 375 : bouton d'offre y ≈ 345 (< 700), titre de la tuile y ≈ 625 et 2 lignes de corps avant 760, bouton de fin y ≈ 2010 (> 812). 1920 : même mise en page contenue dans la grille 12 col, aucun débordement. Le gratuit ajoute une ligne de bénéfices dans la carte d'offre ; le visiteur y a le lien « Connexion » : écart de contenu explicable (compte différent), pas d'incohérence.

**En-cours (abonné avancé).** Titre blanc aligné à gauche, carte du jour dépliée en haut à gauche (7 col) avec scène, contexte, « Ta réponse d'abord », puis Oui / À moitié / Rien ; 2e carte repliée en une ligne avec chevron ; à droite (5 col) mission : échelle des 5 marches avec « Fait » sur la 1, marche 2 surlignée, puis le détail de la marche 2 avec 5 barres de niveau et le retour. Aucun aplat violet (voulu, soumis à Thomas). Colonne gauche finit à y = 927, droite à 1032 : 105 px de vide en fin de colonne, permis.

**Nouvel (premier jour).** Même structure, une seule carte (pas de ligne repliée), marche 1 surlignée sans « Fait », barres à 1 sur 5. Colonne gauche finit à y = 885, droite à 1056 : 171 px de vide en fin de colonne, permis. Page jamais morte : une carte à faire et une mission lisibles dès l'arrivée.

Vides au milieu d'un bloc > 32 px : aucun relevé dans les 12 captures ouvertes. Aplats violets : un seul par écran d'aperçu (bouton hero) au premier écran ; les deux boutons Premium (haut, fin) ne sont jamais visibles ensemble à 1280 ni à 375.

## Notes UX par critère

**UX1 Prospect, envie en 3 secondes : 9/10.** Fermé lisible (verrous, barres, fondu, phrase « Voici un exemple… elle est ouverte avec Premium »), valeur visible (le dilemme « Laquelle dis-tu ? » donne envie de connaître la réponse, la mission montre l'escalier), offre en haut et unique. Défaut : les propositions A, B, C sont des rangées bordurées de la taille de boutons, inertes ; un first-time user peut tenter de cliquer (aria-hidden, rien ne se passe, pas de feedback). Pour 10 : donner aux rangées un aspect non interactif (sans bordure pleine, fond `bg-surface` seul, `cursor-default`) dans le composant d'extrait de `components/espace/apercu/` ; la bordure actuelle imite un choix.

**UX2 Abonné, clarté : 9/10.** Carte du jour dépliée en haut à gauche, 2e carte repliée, la mission à droite : l'ordre de lecture est évident à 375 comme à 1280. Défaut : dans la carte dépliée, trois éléments en pilule contour de même poids (« 10 secondes pour répondre », puis Oui / À moitié / Rien) avec un texte « Prends ton temps » entre les deux ; l'élément à valeur de départ de chrono et le trio de réponse se ressemblent. Pour 10 : distinguer visuellement le chrono (texte seul ou icône, sans contour) des 3 réponses, mêmes constantes, aucune taille ajoutée.

**UX3 Abonné, envie de continuer : 9/10.** Échelle des 5 marches avec « Fait », marche en cours surlignée, 5 barres de niveau, compte à rebours « 10 secondes ». Défaut : la progression est doublée (liste des marches et barres du détail disent la même chose) pendant que la 2e carte repliée ne porte pas la durée prévue par la spec §3.2 (« titre + durée »). Pour 10 : afficher `TEXTES_FICHE_LIGNE.minutes` sur la ligne repliée (constante existante, pas de texte neuf) dans le composant de la carte repliée. Note : à 375 l'échelle des marches est sous le pli (y ≈ 1125) alors que la spec §4 critère 6 la veut au premier écran ; la spec §3.2 impose aussi « carte à faire d'abord » : contradiction de spec, pas de faute de l'implémentation.

**UX4 Nouvel abonné : 9/10.** Jamais de page morte : une carte entière, une mission, marche 1 mise en avant. Défaut : le vide de 171 px sous la carte à 1280/1920 laisse la colonne gauche creuse à côté d'une colonne droite haute ; permis par la règle (fin de colonne) mais visible à l'œil. Pour 10 : rendre la colonne droite `lg:sticky lg:top-24 self-start` n'aide pas ; ce qui aiderait est de plafonner la hauteur de la mission (marche détaillée repliable) pour que les deux colonnes finissent ensemble.

**UX5 Accessibilité visible et cohérence entre comptes : 9/10.** Cibles lues sur capture : lignes repliées 50 px, pilules 44 px ou plus, rangées de marches 49 px. Contrastes des gris secondaires (« Prends ton temps », « Facultative », marches non courantes) lisibles mais non mesurés ici. Chips « Marche 1..5 » à 375 : hauteur estimée ≈ 41 px sur capture réduite, à vérifier au code (`min-h-11`). Titre violet de l'aperçu contre blanc de l'abonné : voulu. Pour 10 : confirmer 44 px des chips de marche à 375 et le contraste AA des gris 14 px.

## Pistes (non bloquantes)
1. Rangées A, B, C de l'aperçu : aspect clairement inerte (composant d'extrait, `components/espace/apercu/`).
2. Abonné : durée sur la carte repliée (`TEXTES_FICHE_LIGNE.minutes`) et chrono distinct des réponses.
3. Aperçu 1280/1920 : la rangée 2 débarque dans la colonne droite et à gauche (7/5 prolongé) au lieu des 6/6 de la spec ; « Quand ça tombe à plat » est visible entier hors fondu. Vérifier avec Thomas que ce n'est pas voulu.

NOTE GLOBALE : 9/10

Fautes dures (aucune) :
1. Aucune faute dure chiffrable relevée (gate typographique PASS à 4 tailles / 6 combinaisons ; 1 aplat violet par écran ; aucun vide > 32 px au milieu d'un bloc ; offre haute à y < 450 / < 700 ; bouton de fin sous le pli).
