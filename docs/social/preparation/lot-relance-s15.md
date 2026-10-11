# Lot social « relance-s15 » (lun. 12/10/2026 au dim. 18/10/2026), DRY-RUN

> Généré par `apps/web/scripts/content/prepare-social-month.ts --lot relance-s15 --debut 2026-10-12 --fin 2026-10-18` (graine « relance-s15 »). **Rien n'est inséré en base, rien n'est publié.**
> Sources : `docs/social/strategie-relance-v5.md` (grille, calendrier §3, R1 à R6, cartes §8), gagnants `duels-resultat-cycle5.md`, 9 posts `validation-thomas-s15.md`, catalogue validé (Joke actives GARDER) et articles programmés (BlogArticle + articles statiques). Aucune génération IA.
> Insertion (plus tard) : `--lot relance-s15 --insert [--driver=neon-http]` lit `lot-relance-s15.json` et insère ces lignes en APPROVED (approvedBy « thomas-s15 »), puis compte par réseau et par semaine. Annulation de cette tranche seulement : `--lot relance-s15 --rollback --debut 2026-10-12 --fin 2026-10-18 --confirmer` (dates obligatoires).

**Total : 12 posts** (X : 5, Instagram : 5, LinkedIn : 2). Heures de Paris (A) : X 12:30, Instagram 19:30, LinkedIn 08:15. Test d'heure alterné par jour, mar. à jeu. : heure B X 09:00 (du lun. 12/10/2026 au lun. 09/11/2026 exclu), Instagram 12:30 (du lun. 12/10/2026 au lun. 09/11/2026 exclu) (réseau sans fenêtre : heure A seule, LinkedIn tant que le test texte / image tourne). Stock éligible du catalogue au J0 : 22 vannes.

**R1 non vérifiable par le script** : aucune note à l'aveugle n'existe pour les vannes du catalogue ni pour la plupart des lignes d'article (v5 §1 : « N exact à compter par @copywriter »). Sont exclues : les 5 vannes connues sous 8 et les 7 perdants des duels du cycle 5. Les vannes tirées restent à confirmer à 8 et plus avant insertion.

**Test LinkedIn texte / image (dès le 13/10/2026) :** image 1, texte 0, hors test 1 (relais avec lien, textes de marque, amorce de plus de 140 caractères ou avant le début du test).

**Test d'heure (marqueur `[heure:A|B]`) :** X A 2, B 1, hors test 2 ; Instagram A 2, B 1, hors test 2 ; LinkedIn A 0, B 0, hors test 2.

Contrôles bloquants passés sur chaque post : zéro tiret cadratin, gros mots, « je » hors « » (R6), longueurs (X 270 comptés par X, lien = 23 ; légende Instagram 80), LinkedIn 3 phrases au plus, cartes (25 / 30 / 35 mots). Sur le lot : anti-répétition 90 jours tous réseaux (posts récents en base compris), « pain » 30 jours, réservées Noël, liens UTM v5, aucun dimanche, 1 relais LinkedIn par semaine au plus. Erreurs bloquantes : **0**.

## Textes NEUFS à faire passer à la relecture à l'aveugle (0)

Ni repris mot pour mot du catalogue ou d'un article, ni validés par Thomas, ni formule écrite dans la v5.


## Posts validés par Thomas placés à leur date (5)

- IG2 : lun. 12/10/2026 19:30, Instagram
- X1 : mar. 13/10/2026 12:30, X
- L3 : mar. 13/10/2026 08:15, LinkedIn
- IG3 : mer. 14/10/2026 12:30, Instagram
- L1 : jeu. 15/10/2026 08:15, LinkedIn

Textes de marque neufs mais déjà validés par Thomas (duels à l'aveugle du cycle 5) : L2, L3.

## Avertissements

- 2026-10-13 LINKEDIN L3 : amorce LinkedIn de plus de 140 caractères (coupée par « voir plus » sur mobile), texte validé par Thomas conservé.
- Semaine du 2026-10-12 : « copain / copine » 3 fois (2026-10-13 INSTAGRAM, 2026-10-14 TWITTER, 2026-10-15 TWITTER), plafond 2 [HYPOTHÈSE] (corrections-cycle8-copy.md §3 point 4).
- 2026-10-12 INSTAGRAM IG2 : légende « … lien en bio » : ne part telle quelle que si les liens de bio sont posés le 2026-10-11 (sinon la tronquer à sa 1re phrase).
- 2026-10-14 INSTAGRAM IG3 : « Le quiz est dans le lien de la bio. » ne part que si les liens de bio sont posés le 2026-10-13 (sinon retirer la 5e partie avant l'envoi).
- 2026-10-12 et 2026-10-13 INSTAGRAM : même tournure « qui » deux fois de suite (corrections-cycle7-copy.md §3).
- 2026-10-15 et 2026-10-16 INSTAGRAM : même tournure « ton/ta » deux fois de suite (corrections-cycle7-copy.md §3).

## Calendrier complet

| Date | Heure | Réseau | Type | Texte exact | Lien | Source | Cartes |
|---|---|---|---|---|---|---|---|
| lun. 12/10/2026 | 12:30 | X | VANNE | « Ma mère m'appelle chaque dimanche pour savoir si je mange bien. Je réponds oui. »<br>« Elle entend le papier alu. Elle insiste pas. » | aucun | JOKE `cmmnsqn130038th63fxn1wvhn` (catalogue)<br>Relais X du 12/10 abandonné : aucune version avec renvoi au niveau à l'aveugle (aveugle-remplacements-cycle8-resultat.md, si_echec) ; vanne du pool strict sans renvoi (repli du mix, v5 l.31). L'article est relayé par IG2 et L3. | aucune (texte seul) |
| lun. 12/10/2026 | 19:30 | Instagram | RELAIS (IG2) | À envoyer à qui a un tour de table demain. Les 4 autres exemples : lien en bio. | lien de bio `/liens` | JOKE `cs14jk8f28ff20e1cf82f3a8` (validé Thomas)<br>Post validé par Thomas (s15). | 1. Au jeu de mimes, ma carte disait « la timidité ».<br>2. J'avais à peine bougé qu'ils avaient trouvé. |
| mar. 13/10/2026 | 12:30 | X | VANNE (X1) | « J'ai dit à Alexa de me raconter une blague. »<br>« Elle m'a lu mon historique de recherches. » | aucun | JOKE `cmmnsqn130027th63at2ene9i` (validé Thomas)<br>Post validé par Thomas (s15). | aucune (texte seul) |
| mar. 13/10/2026 | 19:30 | Instagram | VANNE | À envoyer à qui devait monter ton étagère avant l'été. | aucun | JOKE `cs14jka3336e7e90a453a9d6` (catalogue + formule v5) | 1. Mon copain a dit « je m'en occupe » pour la fuite sous l'évier. C'était en mars.<br>2. Elle a un prénom, maintenant. |
| mar. 13/10/2026 | 08:15 | LinkedIn | RELAIS (L3) | Au tour de table, tu es le suivant, et celui d'avant vient d'évoquer sa boîte montée à 19 ans. Ta présentation commence par « Bonjour, moi c'est » et se termine au même endroit. Voici 5 accroches pour la prolonger, et comment trouver la tienne :<br>https://deviens-marrant.fr/blog/se-presenter-avec-humour?utm_source=linkedin&utm_medium=social&utm_campaign=2026-10&utm_content=relais | https://deviens-marrant.fr/blog/se-presenter-avec-humour?utm_source=linkedin&utm_medium=social&utm_campaign=2026-10&utm_content=relais | BLOG `se-presenter-avec-humour` (validé Thomas)<br>Post validé par Thomas (s15). | aucune (texte seul) |
| mer. 14/10/2026 | 09:00 | X | VANNE_QUIZ | « Ma copine a fait le tri de printemps. Elle a gardé mon vélo, mes livres, ma guitare. »<br>« Moi, elle a dit qu'elle verrait en juin. »<br><br>Et toi, lequel des 5 profils d'humour est le tien ? Environ 2 minutes, sans inscription : https://deviens-marrant.fr/quiz-humour?utm_source=x&utm_medium=social&utm_campaign=2026-10&utm_content=quiz | https://deviens-marrant.fr/quiz-humour?utm_source=x&utm_medium=social&utm_campaign=2026-10&utm_content=quiz | JOKE `cmni62ad30005s60yc7qnog31` (catalogue + formule v5) | aucune (texte seul) |
| mer. 14/10/2026 | 12:30 | Instagram | DECRYPTAGE (IG3) | À envoyer à celui qui n'est jamais sûr d'être invité. | aucun | JOKE `cs14jk04b4bc8bbf8a2d8a05` (validé Thomas)<br>Post validé par Thomas (s15). | 1. J'ai découvert que<br>mes potes avaient<br>un groupe sans moi.<br>J'ai boudé trois jours.<br>2. Il s'appelait “Anniv de Léa”. Léa, c'est moi.<br>3. Pourquoi ça fait rire : celui qui boude trois jours est l'invité d'honneur, et la preuve se trouvait dans le titre du groupe.<br>4. À toi de jouer : repense à un moment où tu t'es cru mis de côté, puis cherche le détail qui prouvait le contraire. Le quiz est dans le lien de la bio. |
| jeu. 15/10/2026 | 12:30 | X | VANNE | « Mon copain : 'Choisis le resto, ça m'est égal.' »<br>« J'ai réservé chez son ex. Ça lui était égal aussi. » | aucun | JOKE `cmnz0jqsx000rs60xrbrqm8kk` (catalogue)<br>Aucun article le 2026-10-15 : vanne. | aucune (texte seul) |
| jeu. 15/10/2026 | 19:30 | Instagram | VANNE | À envoyer à ton oncle, qui demande si c'est un vrai travail. | aucun | JOKE `cs14jk9a9e7a1b8e0e16264e` (catalogue + formule v5)<br>Aucun article le 2026-10-15 : vanne. | 1. Au jeu « deux vérités et un mensonge », j'ai dit trois vérités.<br>2. Elle a désigné celle où j'ai un CDI. |
| jeu. 15/10/2026 | 08:15 | LinkedIn | VANNE (L1) | « Il y a un canapé dans l'espace détente de mon bureau. Personne ne s'y est jamais assis. »<br>« Il est là pour prouver qu'on pourrait. » | aucun | JOKE `cs14jka89abf28d3769b05fe` (validé Thomas)<br>Post validé par Thomas (s15). | [variante:image] carte 4:5 : Il est là pour prouver qu'on pourrait. (texte envoyé : la ligne 1 seule) |
| ven. 16/10/2026 | 12:30 | X | VANNE | « J'ai installé un jeu de 120 Go. J'y ai joué 20 minutes. C'était nul. »<br>« Je l'ai pas désinstallé. On a fait le téléchargement ensemble. » | aucun | JOKE `cmmnsqn15006kth63res9rqp9` (catalogue) | aucune (texte seul) |
| ven. 16/10/2026 | 19:30 | Instagram | VANNE | À envoyer à ta mère, qui t'avait dit de surveiller le four. | aucun | JOKE `cmmnsqn120000th63o435xsb0` (catalogue + formule v5) | 1. Mon détecteur de fumée me sert de minuteur. La dernière fois, les pompiers sont venus.<br>2. Ils m'ont laissé un avis Google : une étoile. |

## Replis en réserve (2), envoyés seulement si l'article relayé n'est pas publié à l'heure

| Date | Réseau | Relais remplacé | Texte exact | Cartes |
|---|---|---|---|---|
| lun. 12/10/2026 19:30 | Instagram | c6e52995eba1e146c490136bc | À envoyer à qui a ton chargeur depuis la fac. | Mon copain m'a rendu le chargeur qu'il m'avait pris il y a un an.<br>Je lui ai demandé s'il partait. |
| mar. 13/10/2026 08:15 | LinkedIn | cb5b2e6d676daa501a23e71ec | « Pendant que j'étais aux toilettes, mon date a remonté tout mon Instagram. »<br>« Elle m'a demandé pourquoi j'avais eu un bouc. » | aucune |
