# Points à trancher par Thomas (passes design + UX s12)

Tout le reste des deux passes est appliqué et déployé sur https://marrant.thomas-issa.workers.dev (branche `claude/marrant-s10-session-recovery-CtZyw`). Détail : `docs/design/passe-visuelle-s12.md`, `docs/ux/passe-ux-s12.md`.

## Choix pris par les agents, à confirmer ou corriger
- Onboarding → parcours conseillé : « Avoir de la répartie » → Répartie ; « Être plus à l'aise socialement » → Confiance ; « Faire rire les gens » → Répartie (entre potes / soirée) sinon Machine à Café ; « Tout ça à la fois » : la question 2 tranche.
- Après inscription : vers `/onboarding`, sauf intention explicite (`/abonnement`, `/parcours/<slug>`) où l'on va en direct.
- Sortie de l'onboarding : texte existant « Plus tard, laisse-moi explorer » → `/parcours`.
- Ponctuation remplaçant des tirets cadratins : « Déjà 1 500+ inscrits, et toi ? », « S'abonner · 0,99 €/mois », « Active mon accès · 0,99 €/mois ».

## Nouveaux textes proposés (non appliqués, texte actuel conservé)
- CTA hero : « Créer mon compte gratuit » + « Puis 0,99 €/mois pour tout débloquer, sans engagement ».
- Parcours : « Crée ton compte gratuit pour valider l'étape ».
- /vannes : bandeau court ; accueil : « Lire la suite » ; header : lien « Offres » ; FAQ propres à chaque page.

## Décisions ouvertes
- Retirer le badge « Populaire » sur l'offre unique ; badge « Abonnés » sur la section de vote ; bouton d'inscription collant en bas d'écran sur mobile.
- Tirets cadratins (—) dans le texte des 34 articles : les remplacer (ponctuation seulement, mots/titres/liens inchangés) ?
- Guillemets droits "…" → « … » dans le corps des articles.
- CGU §2 dit que le contenu exige un abonnement alors qu'une offre gratuite existe (juridique laissé en l'état, choix fondateur).

## Hors périmètre restant (petits correctifs, prochaine passe @fullstack)
T06 liens des cartes « Tu te reconnais ? » vers le parcours nommé ; H1 en 2 blocs dans le CTA d'à-propos ; T14/T17/T18 sur conseils et vidéos ; blog T32/T34-T37 ; T44 viral-quiz ; T48 footer ; T49 glossaire ; vannes liées non dédoublonnées sur `vannes/[slug]` ; données : « eN GROUPE » (vidéos), doublon `parcours-seed.json`.
