# Points à trancher par Thomas (passes design + UX s12)

Tout le reste des deux passes est appliqué et déployé sur https://marrant.thomas-issa.workers.dev (branche `claude/marrant-s10-session-recovery-CtZyw`). Détail : `docs/design/passe-visuelle-s12.md`, `docs/ux/passe-ux-s12.md`.

## Choix pris par les agents, à confirmer ou corriger
- Onboarding → parcours conseillé : « Avoir de la répartie » → Répartie ; « Être plus à l'aise socialement » → Confiance ; « Faire rire les gens » → Répartie (entre potes / soirée) sinon Machine à Café ; « Tout ça à la fois » : la question 2 tranche.
- Après inscription : vers `/onboarding`, sauf intention explicite (`/abonnement`, `/parcours/<slug>`) où l'on va en direct.
- Sortie de l'onboarding : texte existant « Plus tard, laisse-moi explorer » → `/parcours`.
- Ponctuation remplaçant des tirets cadratins : « Déjà 1 500+ inscrits, et toi ? », « S'abonner · 0,99 €/mois », « Active mon accès · 0,99 €/mois ».

## Nouveaux textes proposés (non appliqués, texte actuel conservé)
- [x] CTA hero : « Créer mon compte gratuit » + « Puis 0,99 €/mois pour tout débloquer, sans engagement » : **appliqué** (reco validée par Thomas) au hero, au CTA de bas d'accueil et au CTA d'à-propos (les 3 ouvrent l'inscription gratuite). Inchangés car ils mènent à l'offre : carte d'offre de l'accueil, /abonnement, glossaire (lien /abonnement).
- [x] Parcours : « Crée ton compte gratuit pour valider l'étape » : **appliqué**.
- /conseils : annonce de la limite gratuite avant les cartes verrouillées (T20) et /blog : « Voir plus » après 9 articles (T32) : textes à écrire, non appliqués.
- Modale d'offre : lien « Voir l'offre » vers /abonnement (T18) : non ajouté.
- Encart de milieu d'article « Passe à l'exercice » (T35) et « 0,99 EUR/mois » → « 0,99 €/mois » dans les articles (T36) : contenu d'article, non modifié.
- Quiz d'humour : profil → parcours nommé (T44) : aucune correspondance profil/parcours n'existe, à décider.
- /vannes : bandeau court ; accueil : « Lire la suite » ; header : lien « Offres » ; FAQ propres à chaque page.

## Décisions ouvertes
- [x] Badge « Populaire » sur l'offre unique : **retiré**. Encore ouverts : badge « Abonnés » sur la section de vote ; bouton d'inscription collant en bas d'écran sur mobile.
- Tirets cadratins (—) dans le texte des 34 articles : les remplacer (ponctuation seulement, mots/titres/liens inchangés) ?
- [x] Guillemets droits "…" → « … » dans le corps des articles : **appliqué au rendu** (paires équilibrées, liens et code intacts), texte stocké inchangé.
- [x] CGU §2 : phrase remplacée par « Un compte gratuit donne accès à une partie du contenu ; l'accès à l'ensemble du contenu nécessite un abonnement actif. » (seule phrase modifiée). La date « Dernière mise à jour : 8 mars 2026 » n'a pas été changée : à décider.

## Hors périmètre restant (petits correctifs, passe @fullstack du 29/09)
- [x] T06 liens des cartes « Tu te reconnais ? » vers `/parcours/machine-a-cafe`, `/parcours/repartie`, `/parcours/confiance`
- [x] Titre du CTA d'à-propos en 2 blocs (mots inchangés)
- [x] T14/T17/T18 sur conseils et vidéos (ligne cadenas, cibles 44 px, bannière → modale) ; T17 favori/partage (44 px, pastille 32 px)
- [x] T20 conseil replié à 4 lignes (annonce de la limite gratuite : texte à écrire) ; T21 blocs repliables sur mobile ; T22 vignette prioritaire + repli si erreur
- [x] Blog T32 (pastilles sur une rangée 44 px ; « Voir plus » non fait, texte à écrire), T34 (déjà fait : fil d'Ariane tronqué, dates FR ; date de publication gardée à côté de « Mis à jour le »), T35 (ordre FAQ, navigation, À lire ensuite, parcours, CTA, newsletter ; aucun bloc retiré), T37 ; T36 non fait (contenu d'article)
- [x] T44 viral-quiz vérifié : « Crée ton compte gratuit et commence un parcours » présent ; lien sans bouton imbriqué. Parcours nommé par profil : à décider
- [x] T48 footer 44 px ; T49 glossaire index collant des 12 termes
- [x] Vannes liées dédoublonnées sur `vannes/[slug]` (au rendu)
- [x] « eN GROUPE » corrigé au rendu (`fixInvertedCase`), base inchangée
- [ ] Doublon `docs/content/parcours-seed.json` : donnée, non traité dans cette passe
