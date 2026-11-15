# Plan de corrections, navigation v6, tour 2 (s25)

Source : les 20 relectures `docs/{design,ux}/relectures/s25-v6-tour-2-*.md`. Toutes les corrections sont **interrupteur ouvert seulement** (fermé : site identique, inertie 47 instantanés sans mise à jour). Aucun texte nouveau : on retire, on déplace, on reprend un libellé existant.

## Notes du tour 2 (design / ux)
En-tête 9 / 9 (**validé**, pistes non bloquantes seulement) · Aujourd'hui 6 / 6 · Quoi répondre 7 / 6 · Bibliothèque 6 / 8 · S'entraîner 7 / 8 · Questions-Répliques 6 / 6 · Lettre-Carnet 6 / 6 · Favoris-Profil 7 / 7 · Parcours 8 / 8 · Vannes 7 / 7.

## Arbitrages (pilote automatique, décision de Thomas du 15/11)
1. **Pages d'aperçu (faute commune à 6 groupes)** : on abandonne les deux colonnes. À toutes les largeurs, une colonne centrée `mx-auto max-w-3xl` : H1 et sous-titre centrés (langue de l'accueil), l'exemple, puis la carte d'offre pleine largeur de la colonne, contenu centré (bouton + « Connexion »). Plus de `sticky`. Favoris : les deux contenus réels côte à côte en `sm:grid-cols-2 items-start` dans la même colonne, l'offre dessous. Aperçu de Mes questions : pas de carte à filet imbriquée dans une carte à filet (un seul filet).
2. **Boutons « Oui / À moitié / Rien » des fiches** : même style que les puces « Ton retour » de la même fiche : bordure contrastée ≥ 3:1, texte `text-text-primary`, `min-h-11`, `focus-visible`, état choisi visible. « Prends ton temps » au contraste AA.
3. **Champ « Ma réplique à moi »** (fiche situation) : `min-h-[96px]`, rien de coupé à 375.
4. **Séance, étape « Observation »** : les 10 phrases rendues en `<ol>`, texte inchangé (découpe du contenu existant, `seances.json` non réécrit).
5. **S'entraîner** : mesure de ligne des cartes pleine largeur limitée (`max-w-prose` sur le texte) ; cartes jumelles `items-stretch` sans vide flagrant ou `items-start` cohérent.
6. **Mes répliques (abonné, nouvel)** : même coque et même gabarit que Mes questions (H1 aligné sur le logo, plus de colonne étroite centrée).
7. **Mes questions (abonné)** : titres des deux colonnes au même niveau (« Mes envois » dans sa carte comme chez le visiteur, ou les deux titres hors carte).
8. **/lettre** : à 375, plus de débordement (`[overflow-wrap:anywhere] min-w-0` sur le corps du dernier numéro) ; les adresses brutes du corps rendues en liens dont le texte est l'adresse sans paramètres (`deviens-marrant.fr/...`), rien d'inventé. Interrupteur ouvert seulement ; le même défaut existe sur le site fermé : **à soumettre à Thomas** (correctif d'une ligne, change le rendu fermé).
9. **Archive des lettres (abonné)** : colonne `mx-auto max-w-3xl`, H1 centré, cartes en `sm:grid-cols-2`, hauteur minimale pour éviter le trou avant le pied de page.
10. **/mon-espace/lettres** : 308 vers /lettre pour TOUS les comptes (visiteur et gratuit compris : le middleware ne doit plus l'intercepter).
11. **/vannes** : la carte fantôme floutée sous l'offre (visiteur, gratuit) est retirée ; le bloc d'offre a son contenu centré ; en-tête de page et titres de section centrés comme l'accueil (page publique à hero) ; réponse FAQ validée par Thomas intégrée (`docs/copy/faq-vannes-filtres-v6-a-valider.md`).
12. **Favoris (abonné)** : onglets, « Partager » et « Retirer » en cible de 44 px.
13. **Profil** : carte « Ta question à l'équipe » avec le cadre à filet des autres cartes ; nouvel abonné : « Prochaine étape » en tête (même ordre que le gratuit).
14. **Parcours** : pastilles du défi et liens « Voir » en cible de 44 px ; inscrit gratuit connecté : les phrases fausses pour lui (« D'abord ton compte, puis le paiement. », « Sans compte. ») masquées pour un compte connecté, rien d'écrit à la place.

## Lots (worktrees, carte de propriété stricte)
- **Lot 1, espace** : `components/espace/**`, `components/favoris/**`, `app/(dashboard)/mon-espace/**`, `app/(dashboard)/favoris/**`, `middleware.ts`. Points 1 à 7, 10, 12.
- **Lot 2, public** : `components/lettre/**`, `components/vannes/**`, `components/profil/**`, `components/parcours/**`, `app/(dashboard)/{vannes,lettre,profil,parcours}/**`. Points 8, 9, 11, 13, 14.
- Chaque lot : Jest et Playwright de ses fichiers ; `inertie-espace.test.tsx` et `REPLIT_ACTIONS.md` NON touchés (liste blanche à demander dans le rapport).
