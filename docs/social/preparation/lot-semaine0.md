# Lot social « semaine0 » (mar. 06/10/2026 au dim. 11/10/2026), DRY-RUN

> Généré par `apps/web/scripts/content/prepare-social-month.ts --lot semaine0 --debut 2026-10-06 --fin 2026-10-11` (graine « semaine0 »). **Rien n'est inséré en base, rien n'est publié.**
> Sources : `docs/social/strategie-relance-v5.md` (grille, calendrier §3, R1 à R6, cartes §8), gagnants `duels-resultat-cycle5.md`, 9 posts `validation-thomas-s15.md`, catalogue validé (Joke actives GARDER) et articles programmés (BlogArticle + articles statiques). Aucune génération IA.
> **Dry-run d'origine, antérieur aux échanges du 05/10 : `lot-semaine0.json` fait foi** (écarts constatés le 05/10 sur 3 posts : LinkedIn 06/10, LinkedIn 08/10, X 09/10 ; contrôles et exclusion J+90 dans `plan-execution-s15.md` §0).
> Insertion (plus tard) : `--lot semaine0 --insert [--driver=neon-http]` lit `lot-semaine0.json` et insère ces lignes en APPROVED (approvedBy « lot-semaine0 »), puis compte par réseau et par semaine. Annulation : `--lot semaine0 --rollback --confirmer`.

**Total : 10 posts** (X : 4, Instagram : 4, LinkedIn : 2). Heures de Paris : X 12:30, Instagram 19:30, LinkedIn 08:15. Stock éligible du catalogue au J0 : 32 vannes.

**R1 non vérifiable par le script** : aucune note à l'aveugle n'existe pour les vannes du catalogue ni pour la plupart des lignes d'article (v5 §1 : « N exact à compter par @copywriter »). Sont exclues : les 5 vannes connues sous 8 et les 7 perdants des duels du cycle 5. Les vannes tirées restent à confirmer à 8 et plus avant insertion.

Contrôles bloquants passés sur chaque post : zéro tiret cadratin, gros mots, « je » hors « » (R6), longueurs (X 270 comptés par X, lien = 23 ; légende Instagram 80), LinkedIn 3 phrases au plus, cartes (25 / 30 / 35 mots). Sur le lot : anti-répétition 90 jours tous réseaux (posts récents en base compris), « pain » 30 jours, réservées Noël, liens UTM v5, aucun dimanche, 1 relais LinkedIn par semaine au plus. Erreurs bloquantes : **0**.

## Textes NEUFS à faire passer à la relecture à l'aveugle (0)

Ni repris mot pour mot du catalogue ou d'un article, ni validés par Thomas, ni formule écrite dans la v5.


## Posts validés par Thomas placés à leur date (0)


Textes de marque neufs mais déjà validés par Thomas (duels à l'aveugle du cycle 5) : L2, L3.

## Avertissements

- 2026-10-07 INSTAGRAM : aucune fiche de décryptage disponible (article ni @copywriter) : carte vanne à la place du carrousel.

## Calendrier complet

| Date | Heure | Réseau | Type | Texte exact | Lien | Source | Cartes |
|---|---|---|---|---|---|---|---|
| mar. 06/10/2026 | 12:30 | X | VANNE | « Dans le mail de bienvenue, on m'a appelé Nicolas. Je m'appelle Julien. J'ai rien dit. »<br>« Huit mois après, Nicolas est très apprécié. Julien, on ne sait pas. » | aucun | JOKE `cs14jk0c96df8dc97a67e3f6` (catalogue) | aucune (texte seul) |
| mar. 06/10/2026 | 19:30 | Instagram | VANNE | deviens-marrant.fr | aucun | JOKE `cs14jkdf1cef669030ec828a` (catalogue) | 1. Mon copain m'a dit qu'il ne pouvait pas vivre sans moi. Je suis partie trois jours chez ma mère.<br>2. Il a très bien vécu. Il a même trouvé où on range les draps. |
| mar. 06/10/2026 | 08:15 | LinkedIn | VANNE | « Mon copain a dit “je m'en occupe” pour la fuite sous l'évier. C'était en mars. »<br>« Elle a un prénom, maintenant. » | aucun | JOKE `cs14jka3336e7e90a453a9d6` (catalogue) | aucune (texte seul) |
| mer. 07/10/2026 | 12:30 | X | VANNE_QUIZ | « Mon copain a vu sur la carte que j'allais à la salle de sport tous les mardis. Il était fier. »<br>« Il a zoomé. Sur le parking. »<br><br>Et toi, tu es lequel des 5 profils ? Environ 2 minutes, sans inscription : https://deviens-marrant.fr/quiz-humour?utm_source=x&utm_medium=social&utm_campaign=2026-10&utm_content=quiz | https://deviens-marrant.fr/quiz-humour?utm_source=x&utm_medium=social&utm_campaign=2026-10&utm_content=quiz | JOKE `cs14jk34c841ef6e1abadb11` (catalogue + formule v5) | aucune (texte seul) |
| mer. 07/10/2026 | 19:30 | Instagram | VANNE | deviens-marrant.fr | aucun | JOKE `cs14jkdb222991fcbf194845` (catalogue)<br>Décryptage 4 cartes à fournir par @copywriter : carte vanne en attendant. | 1. Pour mon entretien, j'ai emprunté le costume de mon père. Son nom est cousu sur la manche. Le recruteur m'a appelé Robert toute l'heure.<br>2. Robert commence en septembre. |
| jeu. 08/10/2026 | 12:30 | X | VANNE | « Ma copine m'a envoyé son planning de la semaine pour qu'on s'organise. »<br>« Je suis mercredi, de 19 h à 19 h 30. » | aucun | JOKE `cs14jk18882246f6446df2b7` (catalogue)<br>Aucun article le 2026-10-08 : vanne. | aucune (texte seul) |
| jeu. 08/10/2026 | 19:30 | Instagram | VANNE | deviens-marrant.fr | aucun | JOKE `cs14jk2fd7c7c96d7815407d` (catalogue)<br>Aucun article le 2026-10-08 : vanne. | 1. Mon père est retraité depuis un an et me dit toujours qu'il est très pris.<br>2. Hier, il a dû raccrocher : un nuage arrivait. |
| jeu. 08/10/2026 | 08:15 | LinkedIn | VANNE | « Ma copine a fait le tri de printemps. Elle a gardé mon vélo, mes livres, ma guitare. »<br>« Moi, elle a dit qu'elle verrait en juin. » | aucun | JOKE `cmni62ad30005s60yc7qnog31` (catalogue) | aucune (texte seul) |
| ven. 09/10/2026 | 12:30 | X | VANNE | « Mon prof a cru que mon devoir était écrit par une IA. »<br>« Il a relu mes anciennes copies et il s'est excusé. » | aucun | JOKE `cs14jkafa211aede70b92cc8` (catalogue) | aucune (texte seul) |
| ven. 09/10/2026 | 19:30 | Instagram | VANNE | deviens-marrant.fr | aucun | JOKE `cs14jk2ef0aabfbf4784ad82` (catalogue) | 1. Chez le médecin, je ne connaissais pas mon numéro de sécu. J'ai appelé ma mère.<br>2. Elle me l'a dicté de mémoire, avec les espaces. |
