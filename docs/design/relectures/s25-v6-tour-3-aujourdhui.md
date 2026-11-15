# Relecture DESIGN à l'aveugle, tour 3, groupe « aujourdhui » (/mon-espace), navigation v6

Captures lues : les 20 de `docs/captures/s25/v6-tour-3/aujourdhui/` (visiteur, gratuit, en-cours, nouvel x 375/768/1280/1456/1920) + l'étalon `etalon-accueil/visiteur-accueil-1280.png`. Les captures sont des pleines pages ; les 1280, 1456 et 1920 d'un même compte ont la même composition (conteneur centré, max ~1216 px).

## Constat visuel

- **Visiteur et gratuit (aperçu Premium)** : H1 « Aujourd'hui » centré + sous-titre centré, une carte d'exemple (filet dégradé violet, `rounded-xl`, titre, « LA SCÈNE », trois pastilles Oui / À moitié / Rien), puis une carte d'offre unique. Visiteur : bouton « Premium · 1,99 €/mois » + lien « Connexion » ; gratuit : bouton seul (cohérent, le gratuit est déjà connecté). Colonne centrée de 768 px à 1280/1456/1920, aucun vide parasite, aucun débordement à 375 (bouton + lien tiennent sur une ligne). Très proche de la langue de l'accueil (titre centré, filet violet, aération).
- **En-cours (abonné avancé)** : H1 aligné à gauche + « 4 cartes cette semaine » ; carte héros « Si tu as 5 minutes » (bouton « Les cartes du jour » + deux lignes Nouvelle / À revoir) ; rangée Mission + « Où veux-tu être plus à l'aise ? » (pastilles) ; « Contenu du jour » en 3 cartes (Vanne, Conseil, Vidéo) à 1280+, 2+1 à 768, empilées à 375.
- **Nouvel** : H1 + une seule carte héros « Ton premier pas » avec UNE action « Commencer » (à droite à 1280+, pleine largeur à 375) + Contenu du jour. Jamais une page morte.
- Bande des rubriques : cadenas visibles pour visiteur/gratuit, absents pour les abonnés, onglet actif souligné ; coupée avec fondu à 375/768 (hors périmètre, non cassée par la page).

## Notes Design

| Critère | Note | Justification |
|---|---|---|
| 1 Fidélité à la langue de l'accueil | 9 | Filet dégradé violet en haut de TOUTES les cartes, `rounded-xl`, pastilles rondes, CTA violet plein, fond sombre et rythme aéré : c'est la langue de l'accueil. Écart : les titres de l'abonné sont alignés à gauche alors que l'étalon (et l'aperçu visiteur) centre (voir piste P1). Le visuel de la vidéo du jour est un dégradé violet uni avec un bouton lecture, sans vignette (`en-cours-aujourdhui-1280.png`, `nouvel-aujourdhui-768.png`) : l'accueil, lui, montre une vraie vignette (voir P2). |
| 2 Hiérarchie et lisibilité | 9 | Plissé des yeux : H1, carte héros, CTA violet ressortent ; un seul bouton plein par bloc (Commencer / Les cartes du jour / Premium). Contrastes : texte blanc et gris clair sur #1f1f1f, liens violet clair soulignés, tous lisibles AA. Léger bémol : dans la carte héros de l'en-cours, une phrase de 14 px gris précède le titre « Si tu as 5 minutes » (ordre phrase puis titre), lecture un peu à l'envers ; texte validé, non retouché. |
| 3 Mise en page aux 5 largeurs | 9 | Aucun débordement, aucune colonne collée, grille 3 colonnes puis 2+1 puis 1 propre. Conteneur centré à 1920 (marges égales). Défauts mineurs : (a) carte Mission à 1280+ et 768 : le contenu occupe le haut, ~70 px vides en bas car la carte est étirée à la hauteur de sa voisine (`en-cours-aujourdhui-1280.png`) ; (b) Conseil du jour et Vanne du jour : 90 à 130 px vides en bas pour la même raison ; (c) le texte de la vanne passe à la ligne à ~260 px alors que la carte fait ~390 px (vide à droite dans la carte) ; (d) carte héros en-cours à 1280+ : toute la partie haute (phrase, titre, bouton) est à gauche, ~600 px vides à droite. |
| 4 Cohérence avec les autres pages de l'espace | 9 | Même enveloppe d'un compte à l'autre : H1, cartes à filet, pastilles, pied de page. Je ne vois dans mon groupe que cette page, donc je ne peux pas confirmer la cohérence de rythme avec les autres rubriques ; dans la page, les espacements verticaux (24 px entre cartes, 48 px avant « Contenu du jour ») sont réguliers. Piste P1 sur l'alignement du H1 entre aperçu (centré) et abonné (à gauche). |
| 5 Finition au pixel | 9 | Alignements corrects (bords des cartes alignés sur le conteneur et sur le logo, 32 px de marge à 1280, 16 px à 375). Cibles : boutons, pastilles Oui/À moitié/Rien, « Une autre », pastilles de situation et CTA à ~44 px. Écarts : le lien isolé « Connexion » de la carte d'offre (visiteur, `visiteur-aujourdhui-1280.png`) fait ~16 px de haut, sous la cible de 44 px ; le placeholder vidéo à 768 occupe 365 px de dégradé uni (`nouvel-aujourdhui-768.png`, `en-cours-aujourdhui-768.png`). |

**NOTE GLOBALE Design = minimum = 9/10. Aucune faute dure.**

## Pistes (non bloquantes), avec correction codable et ce qui ferait 10

- **P1 (critères 1 et 4) Alignement du H1 abonné.** Aperçu visiteur/gratuit : H1 centré ; abonné : H1 à gauche. Si Thomas veut l'étalon à la lettre, centrer H1 + sous-titre de l'en-tête de page abonné (`text-center` sur le bloc titre) ; sinon documenter que « aperçu = centré, espace = à gauche ». Piste subjective : aucune décision n'est enfreinte, elle ne retient pas la note.
- **P2 (critères 1 et 5) Vignette vidéo.** Le visuel de la « Vidéo du jour » est un dégradé uni + bouton lecture. À vérifier : si la vignette YouTube n'est qu'absente en capture locale (réseau), RAS ; sinon afficher la vignette réelle (`<Image>` 16:9 `rounded-lg` avec voile + bouton lecture), et si elle est indisponible, masquer le visuel plutôt qu'un aplat. À 768, borner le bloc (`max-h-64 sm:max-h-72`, ou carte vidéo en 2 colonnes image/texte `md:grid md:grid-cols-2`) pour éviter 365 px de vide. Ferait 10.
- **P3 (critère 3) Cartes étirées.** Mission : `self-start` ou contenu en `justify-between` (CTA/texte d'étape en bas) pour supprimer le vide ; Vanne/Conseil : `max-w-none` sur le paragraphe de la vanne (au lieu de ~260 px) et un lien « Le décalage de registre » ancré en bas (`mt-auto`). Ferait 10.
- **P3 bis (critère 3) Carte héros en-cours à 1280+.** Passer en 2 colonnes `lg:grid-cols-[1fr_auto]` (phrase + titre + bouton à gauche, bloc « 1 situation nouvelle, 1 carte à revoir » à droite) ou limiter la phrase à `max-w-prose`, pour équilibrer. Ferait 10.
- **P4 (critère 5) Cible « Connexion ».** Lien seul de la carte d'offre visiteur : `inline-flex min-h-11 items-center px-2`. Ferait 10.
- **P5 (critère 2) Lien de la vanne/conseil.** Liens violets soulignés (`underline`) alors que l'accueil utilise des liens violets sans soulignement avec flèche (« Parcours Machine à Café · 3 semaines → ») : harmoniser (`no-underline hover:underline` + flèche) si Thomas le souhaite. Subjectif.

## Cohérence entre comptes
Visiteur et gratuit : même composition, seule différence justifiée (Connexion absent chez gratuit). En-cours et nouvel : même enveloppe, héros adapté à l'état (nouvel = une seule action, pas de bloc Mission/préférence). Rien de cassé.

Textes : aucun texte réécrit ; rien de faux repéré.
