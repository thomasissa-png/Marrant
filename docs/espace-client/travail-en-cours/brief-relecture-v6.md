# Brief commun : relecture à l'aveugle des sections de l'espace, navigation v6 (s25)

Tu relis UN groupe de sections de l'espace client de Deviens-marrant.fr, à l'aveugle : ne lis aucune relecture existante (`docs/design/relectures`, `docs/ux/relectures`), aucun message de commit, ni `REPLIT_ACTIONS.md`.

## À lire (dans cet ordre, sans plus)
- `project-context.md` : sections Identité, Cible, Positionnement.
- `docs/founder-preferences.md` : les lignes datées du 12/11 au 15/11 (elles font foi ; un [CHOIX UTILISATEUR] ne se rediscute pas).
- `docs/ux/navigation-v6-menu-rubriques.md` : la navigation v6 (bande des rubriques toujours affichée, pages d'aperçu Premium pour le visiteur et l'inscrit gratuit, pas de bande sur /abonnement, bande repliée dans le Menu sous 500 px de haut).
- Étalon visuel imposé par Thomas : la page d'accueil, `docs/captures/s25/etalon-accueil/visiteur-accueil-{375,768,1280,1456,1920}.png` (hero centré, titres de section centrés, cartes `rounded-xl` à filet dégradé violet en haut, pastilles, rythme aéré). L'espace doit parler cette langue, pas ressembler à un tableau de bord gris à part.
- Thème : `apps/web/tailwind.config.ts` (attention : `rounded-md` = 8 px, `rounded-lg` = 12 px ; vérifie toute valeur avant de la citer).

## Captures réelles
`docs/captures/s25/v6-tour-1/<section>/` (et son `INDEX.md`). Comptes : `visiteur`, `gratuit` (inscrit sans abonnement : voit les pages d'aperçu), `en-cours` (abonné avancé), `nouvel` (nouvel abonné : états vides). Largeurs 375, 768, 1280, 1456, 1920, pleine page. Ouvre-les avec Read : TOUTES celles de ton groupe.

## Hors périmètre
- La bande des rubriques et l'en-tête (groupe dédié), sauf si ta section les casse.
- Le contenu éditorial validé (textes des fiches, libellés validés) : tu ne réécris aucun texte ; un texte qui te paraît faux est signalé, et toute proposition de texte nouveau est marquée « à valider par Thomas » et ne retient pas la note.

## Grille
Note /10 par critère, puis globale = le minimum.
- **Design** : 1 fidélité à la langue visuelle de l'accueil ; 2 hiérarchie et lisibilité ; 3 mise en page aux 5 largeurs (aucun vide à droite à 1280+, aucune colonne collée à gauche, aucun débordement) ; 4 cohérence avec les autres pages de l'espace (rythme, cartes, titres) ; 5 finition au pixel (alignements, contrastes AA, cibles 44 px).
- **UX** : 1 compréhension (je sais où je suis et quoi faire en 3 secondes) ; 2 action principale évidente et unique ; 3 états vides et nouvel abonné (jamais une page morte) ; 4 aperçu Premium pour le non-abonné (valeur visible, une seule offre, pas de mur) ; 5 accessibilité visible et cohérence entre comptes.

Barre de validation (décision de Thomas du 15/11) : 9/10 au moins, sans faute dure.

Pour toute note < 10 : défaut précis (fichier de capture), correction CODABLE (fichier du code, classes du thème), et ce qui ferait 10. Distingue « faute dure » (bloque la validation) et « piste ». N'invente rien que tu ne vois pas ; 10 est permis si c'est vrai. Une piste purement subjective ne retient pas la note si l'existant est conforme à l'étalon, à la spec et aux décisions.

Écris ta relecture dans le fichier indiqué par ton prompt et termine ta réponse par `NOTE GLOBALE : x/10` puis la liste numérotée de tes fautes dures (une ligne chacune, avec le fichier de code à toucher).
