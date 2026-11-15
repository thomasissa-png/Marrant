# Pages d'aperçu Premium : fiches montrées, à confirmer par Thomas

Nav v6, lot B (s25). Décision du 15/11 (recommandation 2) : « page d'aperçu = la première fiche réelle de chaque rubrique, liste à confirmer par Thomas, rien d'inventé ». Interrupteur `ESPACE_CLIENT_PUBLIE` ouvert seulement ; fermé, rien ne change.

Identifiants figés dans `apps/web/src/components/espace/apercu/exemples.ts` (une fiche ajoutée en tête d'un fichier ne change pas l'aperçu sans ton accord) ; test `apps/web/src/__tests__/espace/apercu-fiches.test.ts`.

| Rubrique (adresse) | Fiche montrée en entier | Identifiant | Pourquoi celle-ci |
|---|---|---|---|
| Aujourd'hui (`/mon-espace`) | Amis : « Tu as changé quelque chose, non ? » (situation, 5 min) | `amis-tu-as-change-quelque-chose` | Première fiche que voit un nouvel abonné : la carte « Ton premier pas » par défaut (`ENTREE_PAR_DEFAUT`). |
| Quoi répondre (`/mon-espace/quoi-repondre`) | Coloc : la poêle (situation, 5 min) | `coloc-la-poele` | Première de `situations.json` ; c'est aussi la fiche de la maquette D validée. |
| Bibliothèque (`/mon-espace/bibliotheque`) | Le faux secret (« Comment c'est construit », 5 min) | `le-faux-secret` | Première fiche listée : « Écouter, repérer » est vide, le coin « Humour noir » demande une entrée ; première de `constructions.json`. |
| S'entraîner (`/mon-espace/s-entrainer`) | Quelle réplique ? (jeu, 5 min) | `quelle-replique-1` | Première fiche des types de la rubrique (jeux, séances) : première de `jeux.json`. Les cartes de la rafale sont interactives et enregistrent en base : pas montrables dans un aperçu. |
| Mes questions (`/mon-espace/questions`) | Aucune fiche : l'état « Mes envois » déjà validé (un exemple de message par type, puis le délai) | (pas de fiche) | Le contenu de la rubrique est écrit par l'abonné : aucune vraie question n'est montrée ni inventée. Composant existant `EtatVideQuestions`. |
| Mes répliques (`/mon-espace/repliques`) | Coloc : la poêle : la consigne « À toi » et le champ « Ma réplique à moi » (lecture seule) | `coloc-la-poele` | Même raison : aucune réplique d'abonné n'est montrée ni inventée ; l'exemple est l'endroit où une réplique s'écrit. |

| Favoris (`/favoris`) | Aucune fiche : l'état vide existant de la page (« Aucun favori pour l’instant » et sa phrase, onglet « Tout »), sans l'émoji ni le bouton « Explorer les vannes » | (pas de fiche) | Contenu propre à l'abonné ; consigne du coordinateur (15/11) : l'état vide existant avec l'offre, rien d'inventé. |

Parcours (`/parcours`) : la page publique EST déjà l'aperçu, inchangée.

## Points à trancher (défaut appliqué entre crochets)

1. **Aujourd'hui et S'entraîner parlent de la même scène** (« Tu as changé quelque chose, non ? » : la situation, puis le jeu qui la reprend). [Défaut : gardé, c'est la règle « première fiche ».] Alternative : S'entraîner montre la première séance, « Dix chambrages, dix secondes » (`seance-dix-chambrages-dix-secondes`).
2. **Mes répliques montre la même fiche que Quoi répondre** (Coloc : la poêle). [Défaut : gardé.] Alternative : la consigne « À toi » d'une autre fiche, que tu choisis.
3. **Mes questions, Mes répliques et Favoris n'ont pas de « fiche »** : le sous-titre « Voici un exemple de cette rubrique » y reste. [Défaut : gardé.] Alternative : une vraie question et sa réponse, que tu écris ou approuves.

Textes : aucun texte neuf hors le sous-titre validé le 15/11 ; titres, bouton d'offre (« Premium · 1,99 €/mois », prix lu dans `config/premium.ts`), « Connexion » (visiteur seulement), libellés des fiches : repris tels quels.
