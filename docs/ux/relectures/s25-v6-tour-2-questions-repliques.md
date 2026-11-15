# Relecture UX à l'aveugle, tour 2 : Mes questions + Mes répliques (navigation v6, s25)

Source : `docs/captures/s25/v6-tour-2/{questions,repliques}/` (4 comptes x 5 largeurs, toutes ouvertes ou échantillonnées sur les 5 largeurs et 4 comptes ; 1456 identique à 1280 et 1920 par construction de la coque `max-w-7xl`, vérifié sur 1280 et 1920). Étalon : accueil 1280. Pages : `apps/web/src/app/(dashboard)/mon-espace/questions/page.tsx` et `.../repliques/page.tsx`.

## Ce qui est conforme
- Bande des rubriques, « … » allumé avec soulignement violet, cadenas pour visiteur et gratuit : conforme à la v6.
- Visiteur et gratuit voient une page d'aperçu avec H1, sous-titre validé, contenu réel, un seul bouton plein (gratuit : bouton seul, sans Connexion, juste).
- Nouvel abonné : Mes questions a un formulaire et un historique d'exemple ; Mes répliques a un état vide avec phrase et bouton unique « Écrire ma première réplique ». Aucune page morte.
- Formulaire : type de demande en 3 cartes radio, « Une question » présélectionné, un seul bouton plein « Envoyer à l'équipe », délai de réponse annoncé. Excellent.
- Cartes `rounded-xl` à filet violet en haut : langue de l'accueil respectée.

## Notes

| Critère | Note | Constat |
|---|---|---|
| D1 Fidélité accueil | 9 | Filet, cartes, titres blancs gras OK. Page abonné sans centrage de titre : acceptable (page d'espace). Imbrication carte dans carte avec deux filets violets (aperçu Questions) : voir D5. |
| D2 Hiérarchie | 9 | H1 puis cartes claires. Texte d'aide 12 px peu contrasté (« Évite les noms : décris la scène. », « Envoyé le 12 novembre ») : lisible, AA à vérifier (piste). |
| D3 Mise en page 5 largeurs | 6 | Voir fautes dures 1 et 2. |
| D4 Cohérence espace | 6 | Voir faute dure 1 : même page, deux gabarits selon le compte. |
| D5 Finition | 8 | Titre « Mes envois » : tantôt dans la carte (visiteur, 1280), tantôt au-dessus (abonné) ; sur abonné 1280 le H2 « Mes envois » (y 248) et le filet de sa carte (y 274) ne s'alignent pas avec le haut de la carte de gauche (y 234) : décalage de 40 px. Aperçu Questions : deux filets violets imbriqués (carte + carte intérieure). |
| U1 Compréhension | 9 | Titres clairs ; page abonné Répliques sans sous-titre mais la carte se lit seule. |
| U2 Action principale unique | 9 | OK partout. Piste : « Modifier » et « Supprimer » de même poids (Répliques en-cours) : Supprimer devrait être sobre, avec confirmation (à vérifier au code, non visible en capture). |
| U3 États vides / nouvel | 9 | OK. Piste : Mes envois du nouvel affiche des exemples « Par exemple... » sous une étiquette discrète : bien, mais sans titre « Tes envois apparaîtront ici ». Texte à valider par Thomas, ne retient pas la note. |
| U4 Aperçu Premium | 7 | Voir faute dure 2 (bloc offre orphelin) ; l'aperçu Questions montre l'historique d'exemple mais pas le formulaire, qui est la valeur de la page (piste) ; aperçu Répliques montre un champ de saisie qui a l'air actif sans dire qu'il ne s'enregistre pas (piste). |
| U5 Accessibilité / cohérence comptes | 6 | Voir faute dure 1. Cibles de boutons >= 44 px OK, focus non visible en capture (non évaluable). |

## Fautes dures

1. **Répliques : gabarit différent selon le compte, titre désaligné.** Abonné et nouvel (`en-cours-repliques-1280.png`, `nouvel-repliques-1280.png`) : colonne étroite centrée (x 256 à 1024) avec le H1 à x=256, alors que logo, bande et pied de page sont à x=32, et que Mes questions (même section « … ») occupe la coque pleine. Visiteur et gratuit (`visiteur-repliques-1280.png`, `-1920.png`) : coque pleine en 2 colonnes, H1 à x=32. Le H1 saute de 224 px entre comptes et entre les deux pages jumelles. Correction : mettre le H1 et le contenu dans la même coque `max-w-7xl` pour tous (comme Questions) ; la carte peut rester étroite mais alignée à gauche de la coque, ou passer en 2 colonnes (liste à gauche, bloc d'aide à droite). Pour 10 : H1 à la même abscisse sur toutes les pages et tous les comptes. Fichier : `apps/web/src/app/(dashboard)/mon-espace/repliques/page.tsx`.
2. **Colonne droite vide et bloc offre orphelin à 1280+.** `visiteur-questions-1280.png`, `visiteur-repliques-1920.png`, `gratuit-*` : la carte d'offre fait 90 px de haut en haut de la colonne droite, sans phrase de valeur ni titre, et laisse environ 340 px de vide dessous ; sur abonné (`en-cours-questions-1280.png`, `-1920.png`) « Mes envois » finit à 465 px quand le formulaire descend à 970 (vide de 500 px à droite, 1000 px à 1920). Correction : (a) offre : passer le bloc sous le contenu en pleine largeur, ou le rendre `lg:sticky lg:top-32` avec une ligne de valeur issue des textes validés (nouveau texte : à valider par Thomas) ; (b) abonné Questions : colonne droite `lg:sticky lg:top-32` pour l'historique, ou carte historique alignée en haut sur le même niveau que la carte formulaire (supprimer le décalage de 40 px, titre « Mes envois » dans la carte comme chez le visiteur). Fichier : `apps/web/src/app/(dashboard)/mon-espace/questions/page.tsx` (et `repliques/page.tsx` pour l'aperçu).

## Pistes (ne retiennent pas la note)
- Aperçu Questions : double carte avec double filet violet (`rounded-xl` imbriqué) ; retirer le filet de la carte intérieure.
- Répliques abonné : la citation « Réplique de test... » est une donnée de test, pas un défaut de page ; ajouter un petit libellé « Ma réplique » au-dessus de la citation pour distinguer titre d'exercice et réponse (texte à valider par Thomas).
- Supprimer : confirmation et poids visuel secondaire.
- Texte d'aide 12 px : vérifier le contraste du token utilisé.

## Mesure
Tour 2 : 2 fautes dures. Pas de validation.

NOTE GLOBALE : 6/10
