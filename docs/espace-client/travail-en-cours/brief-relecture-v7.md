# Brief commun : relecture à l'aveugle, refonte page par page de l'espace (s25, v7)

Tu relis UNE page de l'espace client de Deviens-marrant.fr, à l'aveugle : ne lis aucune relecture existante (`docs/design/relectures`, `docs/ux/relectures`), aucun message de commit, ni `REPLIT_ACTIONS.md`.

## Ce que Thomas attend (16/11, fait foi)
- « Chaque section : pour les prospects, doit donner **super envie de joindre et de s'inscrire** ; pour les autres, doit être **claire et donner envie de continuer**. »
- L'aperçu d'une rubrique Premium doit se lire **FERMÉ** au premier coup d'œil (jamais l'impression d'être dedans), avec le bouton d'offre **en haut**.
- Fini « le gros bloc de texte centré » : la page **utilise la largeur** (grilles, zones de poids différents).
- Élégance, pas « PowerPoint » : retenue, alignements, un seul accent fort, finition au niveau de l'accueil.

## À lire (dans cet ordre, sans plus)
- `project-context.md` : Identité, Cible, Positionnement.
- La spec UX et la spec design de la page (chemins donnés par ton prompt).
- Étalon visuel : `docs/captures/s25/etalon-accueil/visiteur-accueil-{375,1280,1920}.png`.
- Thème : `apps/web/tailwind.config.ts` (`rounded-md` = 8 px, `rounded-lg` = 12 px).

## Captures
Dossier donné par ton prompt (et son `INDEX.md`). Comptes : `visiteur`, `gratuit` (aperçu Premium), `en-cours` (abonné avancé), `nouvel` (nouvel abonné, premier jour). Largeurs 375, 768, 1280, 1456, 1920. Ouvre au moins 375, 1280 et 1920 de chaque compte.

## Hors périmètre
- La bande des rubriques et l'en-tête global (validés).
- Les textes : tu n'en réécris aucun. Les textes marqués « à valider par Thomas » (T1 promesse, T2 « La suite est dans Premium ») sont jugés sur leur place, pas sur leur formulation. Un texte qui te paraît faux est signalé.
- Les vignettes vidéo en dégradé uni (préversion locale sans YouTube).

## Gate typographique MESURÉE (bloquante, retour de Thomas du 16/11 : « combien de tailles de police différentes ? »)
- Ton prompt te donne la sortie du script `tailles.mjs` (premier écran, 4 comptes, 375 et 1280). Tu la CITES dans ta relecture.
- **Plus de 4 tailles de police distinctes OU plus de 6 combinaisons taille/graisse/casse dans un premier écran = faute dure automatique**, quelle que soit ton impression visuelle. Pas de note d'élégance ≥ 9 sans ce comptage.
- Échelle de référence : `docs/design/typo-harmonie-espace-s25.md` (tout élément hors échelle = faute dure).
- Un vide ne se comble JAMAIS en grossissant un texte : propose contenu ou mise en page. Une correction qui ajoute une taille de police est refusée.
- Un seul accent violet fort par écran (le bouton plein) ; tout second accent est une faute dure.

## Grille
Note /10 par critère, globale = le minimum.
- **Design** : 1 élégance et fidélité à l'accueil ; 2 hiérarchie (une zone dominante, un seul accent fort) ; 3 usage de la largeur aux 5 largeurs (aucun vide mort, aucune tuile creuse, aucun débordement) ; 4 cohérence entre comptes ; 5 finition au pixel (alignements, contrastes AA, cibles 44 px vérifiées au code).
- **UX** : 1 prospect : envie de s'inscrire en 3 secondes (fermé lisible, valeur visible, offre en haut, une seule offre) ; 2 abonné : clarté (je sais quoi faire maintenant) ; 3 abonné : envie de continuer (progression, série, prochaine étape) ; 4 nouvel abonné (jamais une page morte) ; 5 accessibilité visible et cohérence entre comptes.

Barre de validation : 9/10 au moins, sans faute dure. Pour toute note < 10 : défaut précis (capture), correction CODABLE (fichier, classes du thème), ce qui ferait 10. Distingue « faute dure » et « piste ». N'invente rien ; 10 est permis si c'est vrai.

Écris ta relecture dans le fichier indiqué et termine par `NOTE GLOBALE : x/10` puis la liste numérotée de tes fautes dures (une ligne chacune, fichier de code à toucher).
