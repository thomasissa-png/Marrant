# Lot C (s25) : décisions de Thomas du 14/11 et du 15/11, entrée à reporter dans `REPLIT_ACTIONS.md`

**Aucune action de déploiement requise.** Tout est derrière l'interrupteur `ESPACE_CLIENT_PUBLIE`, qui reste à
`false` dans le dépôt : interrupteur fermé, le site en ligne ne change pas (Jest d'inertie, 47 instantanés,
identiques sans mise à jour ; vannes servies au visiteur et au compte gratuit identiques : les 10 plus récentes).
Pas de migration, pas de variable d'environnement, pas de paquet, aucune écriture en base.

Effet le jour de l'ouverture de l'espace :

- **/vannes** : une seule rangée de catégories pour tous (visiteur, compte gratuit, abonné), « Toutes » active par
  défaut ; les liens « Vannes par thème » au-dessus de la liste et le fil d'Ariane visible ne sont plus affichés
  (données structurées BreadcrumbList gardées ; pages thème toujours dans le sitemap, les articles et leurs propres
  pages). Sans abonnement, les 10 vannes ouvertes sont réparties sur les catégories (une par catégorie avec le
  catalogue actuel), règle dans le code (`config/vannes-categories.ts`, `selectionGratuite`) ; un filtre montre
  celles de ces 10 qui y répondent. L'API `/api/jokes` lit alors une fois de plus la liste des vannes actives
  (identifiants, contenu, catégorie) pour un visiteur ou un compte gratuit.
- **/lettre** : une seule section. Visiteur, compte gratuit, ancien abonné : l'inscription d'aujourd'hui. Abonné
  actif : l'archive de toutes les lettres envoyées (même liste et même compteur anonyme que l'ex-« Mon espace ›
  Lettres »). Les adresses de statut (`?statut=…`, confirmation, désinscription) gardent leur écran pour tous.
- **/mon-espace/lettres** : redirection permanente (308) vers `/lettre`, après la garde de l'espace (comme toute
  adresse `/mon-espace`). Les fiches `/mon-espace/lettres/<numéro>` gardent leur adresse et leur contenu ; leur
  lien de retour mène à `/lettre`.
- **FAQ de /parcours** : la question « 1,99 €/mois, c'est vraiment tout ? » n'est plus montrée à l'abonné (masquée
  dans le navigateur ; HTML serveur et données structurées FAQ inchangés).
- **Mes répliques** (vide) : bouton « Écrire ma première réplique », déjà en place, libellé validé le 14/11.

Contrôles faits avant commit : voir le rapport du lot C (tsc build et complet, lint, build, Jest complet en
environnement vide, Playwright `decisions-14-11-s25.spec.ts` contre un serveur ouvert local, port 5430).
