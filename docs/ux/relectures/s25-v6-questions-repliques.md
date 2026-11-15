# Relecture UX à l'aveugle s25 v6 tour 1 : Mes questions et Mes répliques

Périmètre : `/mon-espace/questions` et `/mon-espace/repliques`, 4 comptes (visiteur et gratuit voient le même aperçu), 5 largeurs. Captures vues : visiteur 375 et 1280 (questions), 1280 (répliques) ; en-cours 375, 768, 1280, 1920 (questions) et 1280 (répliques) ; nouvel 375 et 1280 (questions), 1280 (répliques). Les autres largeurs sont des déclinaisons des mêmes composants (lecture du code). Étalon : accueil 1280. Aucun texte réécrit ; toute proposition de texte serait « à valider par Thomas » (aucune ici).

## Notes

| Critère | Note | Raison courte |
|---|---|---|
| Design 1 fidélité à l'accueil | 7 | Les cartes réelles n'ont ni `rounded-xl` ni filet dégradé (voir D1) |
| Design 2 hiérarchie | 8 | H1 / H2 nets ; deux titres de colonne non alignés (D5) |
| Design 3 mise en page 5 largeurs | 6 | Aperçu : vide de 480 px à droite à 1280, 1456, 1920 (FAUTE DURE F1) |
| Design 4 cohérence espace | 8 | Aperçu avec filet, page réelle sans ; état vide Répliques en colonne 768, liste en pleine largeur |
| Design 5 finition | 8 | Désalignement des colonnes, étiquettes mal groupées, aide en 12 px |
| UX 1 compréhension | 8 | Titre et libellés clairs ; réponse reçue non repérable (F2) |
| UX 2 action principale | 7 | Lire la réponse est cachée sans signe (F2) ; l'unique action de l'état vide est un bouton contour |
| UX 3 états vides, nouvel abonné | 9 | Jamais une page morte ; exemples + délai (Questions), sortie vers Quoi répondre (Répliques) |
| UX 4 aperçu Premium | 7 | Une seule offre, pas de mur : bon. Mais Questions montre un état vide sans le formulaire, Répliques un faux champ |
| UX 5 accessibilité, cohérence | 8 | Cibles 44 px, focus, radios réelles : bon. `details` sans indice visuel |

**NOTE GLOBALE : 6/10 (minimum). Sous la barre de 9/10 : 2 fautes dures.**

## Fautes dures

**F1. Aperçu : vide à droite à 1280 et plus** (`visiteur-questions-1280.png`, `visiteur-repliques-1280.png`, idem 1456 et 1920, comptes visiteur et gratuit). La carte fait 768 px (`max-w-3xl`), collée à gauche ; de x=800 à x=1248 il ne reste rien, sur toute la hauteur. Le critère 3 du brief l'interdit explicitement. Cause : `apps/web/src/components/espace/apercu/apercu-rubrique.tsx` ligne 49, `max-w-3xl` sur l'`article`, et sous-titre `max-w-2xl`. Correction codable (deux options, au choix de @design) :
- (a) dès `lg:`, grille `lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-6` : la carte d'exemple à gauche, le bloc d'offre (bouton + Connexion, aujourd'hui dans la carte) sorti en carte voisine `rounded-xl border border-border bg-background-card p-6 lg:sticky lg:top-32`. Un seul bouton plein par page reste vrai ;
- (b) retirer `max-w-3xl` et laisser la carte pleine coque (1216) comme la page réelle de l'abonné. Plus simple, mais la ligne de texte atteint 1100 px : à éviter pour la lisibilité (une réplique de fiche ferait 150 caractères).
Ce que ferait 10 : aucune zone vide de plus de 80 px à droite aux 3 grandes largeurs, offre visible sans défilement à 1280 x 800.
Note : le composant est partagé par toutes les rubriques ; la correction profite aux autres groupes, à coordonner.

**F2. Mes questions : la réponse de l'équipe est invisible et rien n'invite à l'ouvrir** (`en-cours-questions-1280.png`, `en-cours-questions-375.png`). Un envoi répondu affiche seulement « Répondu le 14 novembre » en violet gras, puis « Retirer de mon historique ». Ce texte est le `summary` d'un `details` (`apps/web/src/components/espace/questions/fil.tsx` lignes 107 à 116) : `flex` supprime le marqueur natif, il n'y a ni chevron, ni soulignement, ni bouton. Un premier venu lit « statut » et voit à la place le seul bouton cliquable, « Retirer de mon historique », qui est destructeur (effacement définitif). La raison d'être de la page (lire la réponse, puis « Continuer ») n'est pas l'action la plus évidente : [FRICTION H6] à l'étape « je vois que l'équipe a répondu », le first-time user ne sait pas où est la réponse. Solution : dans le `summary`, ajouter un chevron `aria-hidden` (par exemple une flèche SVG 16 px après le texte, `ml-2 transition-transform group-open:rotate-180`), `underline underline-offset-2` sur le texte fermé, et basculer `summary` en `rounded-lg border border-border-input px-3` pour qu'il ait la forme d'un bouton secondaire de 44 px. Piste associée (non bloquante) : quand `fil.nonLu` est vrai, ouvrir le premier envoi non lu par défaut, ou le placer avant le formulaire sur mobile. Ce que ferait 10 : le point de contact vers la réponse a une forme de contrôle, et « Retirer » est visuellement en retrait.

## Défauts non bloquants (pistes) avec correction

**D1. Langue visuelle : cartes de la page réelle plates** (`en-cours-questions-1280.png`, `en-cours-repliques-1280.png`, `nouvel-questions-1280.png`). `CARTE` (`apps/web/src/components/espace/carte/styles.ts` ligne 11) = `rounded-lg` sans filet, alors que l'étalon accueil et l'aperçu (`apercu-rubrique.tsx` ligne 49, `rounded-xl` + filet `h-0.5` dégradé) ont `rounded-xl` et le filet. Le même visiteur qui passe de l'aperçu à la page abonnée voit la carte changer de forme. Correction : `rounded-xl` dans `CARTE`, et un filet `before:` (`relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-accent-primary-hover before:to-accent-secondary-hover`) sur les cartes principales (formulaire, envoi, réplique). Attention : `CARTE` est partagé par tout l'espace, à traiter globalement (hors de mon groupe seul). Les H1 restent à gauche comme les autres pages de l'espace, pas de reproche.

**D2. Étiquettes de l'état vide Questions mal groupées** (`nouvel-questions-1280.png`, `visiteur-questions-1280.png`). La pastille « Un problème » est à 8 px de la citation du dessus et à 8 px de la sienne (`!space-y-2`, `etat-vide.tsx` lignes 17 à 28) : elle se lit comme titre de la citation précédente. Le premier exemple n'a pas de pastille mais une phrase d'intro, les deux suivants une pastille : trois exemples, deux structures. Correction : envelopper chaque couple pastille + citation dans `<div className="space-y-1">` et espacer les couples de `space-y-4` ; conserver les libellés validés.

**D3. Aperçu Répliques : faux champ** (`visiteur-repliques-1280.png`). Un `<p>` stylé comme un champ (`exemple.tsx` ligne 88) reçoit un geste de clic qui ne fait rien. Correction : `select-none` plus `aria-hidden` sur le faux champ n'aide pas le sens ; préférer le marquer comme exemple par un fond `bg-background-light/50` sans bordure `border-input` et `cursor-default`, pour qu'il ne mime pas un champ actif. Pas de texte neuf.

**D4. Aperçu Questions : il montre l'état vide de l'historique, pas le geste d'écrire** (`visiteur-questions-1280.png`). Le visiteur ne voit jamais le formulaire à trois types, qui est la valeur de la rubrique. Correction codable sans texte neuf : dans `ExempleQuestions` (`exemple.tsx` ligne 98), afficher en lecture seule les trois cartes de type (nom + description validés) au-dessus des exemples, `aria-hidden` sur les radios. À valider par Thomas pour la mise en page seulement.

**D5. Alignement des colonnes Questions à 1280+** (`en-cours-questions-1280.png`). La carte du formulaire commence à y=233 ; « Mes envois » à y=247 (titre hors carte), la carte des envois à y=273. Correction : `lg:mt-[...]` à éviter ; passer le H2 « Mes envois » dans un bloc de même padding que le titre du formulaire, ou mettre `ListeEnvois` dans une `CARTE` quand elle est vide ou pleine (`liste-envois.tsx` ligne 34).

**D6. Cohérence Répliques** : l'état vide est en colonne de 768 centrée (`nouvel-repliques-1280.png`) alors que la liste est pleine coque (`en-cours-repliques-1280.png`) ; la liste à une réplique est une carte de 1216 px presque vide à droite. Correction : `ul` en `grid gap-3 lg:grid-cols-2`, ou colonne de lecture dans les deux cas (`repliques/page.tsx` ligne 43 : toujours `COLONNE_LECTURE`).

**D7. Bouton unique de l'état vide Répliques en contour** (`nouvel-repliques-1280.png`). « Écrire ma première réplique » (libellé validé) est la seule action de la page et reste un `BOUTON_SECONDAIRE`. Correction : `BOUTON_PRINCIPAL` dans `liste-repliques.tsx` ligne 69.

**D8. Confirmation de suppression** (`liste-repliques.tsx` lignes 129 à 136) : « Supprimer » et « Annuler » ont le même style. Piste : « Annuler » en `BOUTON_PRINCIPAL`, focus déjà sur lui (bien).

**D9. Aide du champ en 12 px** (`formulaire.tsx` ligne 112, `text-xs text-text-muted`) : contraste correct (environ 5,9:1) mais petit pour la consigne la plus utile (« Évite les noms… »). Piste : `text-sm text-text-secondary`.

**D10. Hors périmètre, signalé** : à 1280 en visiteur la rubrique « Carnet » est rognée sous le bouton « … » (`visiteur-questions-1280.png`, `visiteur-repliques-1280.png`), contraire au plancher de 80 px libres de la spec v6 ; à traiter par le groupe de la bande.

## Points conformes (10 sur ces points)
- États vides jamais morts : Questions (exemples + délai), Répliques (phrase validée + sortie vers Quoi répondre).
- Aperçu : un seul bouton plein, Connexion en lien, pas de mur, pas de redirection, sous-titre validé.
- Formulaire : radios réelles, 44 px, focus visible, « Une question » par défaut, saisie conservée en cas d'erreur, clé d'idempotence, état d'envoi.
- Mobile 375 : aucune débordement, formulaire pleine largeur, bouton lisible.
- Aucune différence parasite entre gratuit et visiteur.

## Parcours rapide (first-time user, abonné neuf)
1. J'arrive sur Mes questions : titre clair, formulaire à gauche : sait quoi faire. OK.
2. Envoi : états prévus (en cours, succès, erreur sans perte). OK.
3. Retour après réponse : voir F2.
4. Mes répliques vide : comprend d'où viennent les répliques via le bouton, mais le lien avec le champ « Ma réplique à moi » des fiches n'est pas dit (texte validé, piste seulement).

## HEART
Task success : envois aboutis / formulaires commencés, cible 90 % ; Adoption : part des abonnés qui ouvrent une réponse reçue (F2 en dépend), cible 80 % sous 7 jours ; Engagement : répliques écrites par abonné et par mois, mesure par événements @data-analyst.
