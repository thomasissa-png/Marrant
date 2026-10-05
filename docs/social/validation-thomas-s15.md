# Relance des réseaux : dossier de validation (05/10/2026)

> Issu de 5 cycles de notation par des agents indépendants (plan : `plan-relance-s15.md`). Rien n'est publié, rien n'est en file, les 3 réseaux démarreront en pause après déploiement. Thomas valide, corrige ou refuse chaque point ci-dessous.

## 1. Les notes finales

| Critère | Note | Notateurs |
|---|---|---|
| Stratégie 3 réseaux | 9 | @reviewer, @growth |
| Posts : justesse, voix, adaptation | 9,9 | @reviewer |
| Posts : drôlerie à l'aveugle | 3 posts au niveau Alexa, 6 à 7,5 ou 8 (Alexa = 9) | 2 relecteurs à l'aveugle |
| Calendrier | 8,5 (défauts du cycle 4 corrigés en v5, non renotés) | @reviewer |
| Trafic et conversion | 8,5 (idem) | @growth |
| Mesure | 8,5 (idem) | @growth |
| Visuels | 9,9 et 9 | @design, @reviewer |
| Formats | Instagram 9, LinkedIn 10, X texte seul | @design |
| Fiabilité de la publication | code complet et testé (2 928 tests), non déployé | @qa (cycle 1 : 3/10), @fullstack |
| Respect des choix fondateur | 10 | @reviewer |

**Écart assumé** : 6 posts sur 9 restent un peu sous la barre Alexa selon les 2 relecteurs. Choix possibles : valider tels quels, ou demander un nouveau tirage dans le catalogue pour ces 6.

## 2. Les 9 posts modèles

**X** (texte seul, 12:30)
- **X1**, mar. 13/10 : « J'ai dit à Alexa de me raconter une blague. » « Elle m'a lu mon historique de recherches. »
- **X2**, jeu. 22/10, relais de l'article des messages d'anniversaire : « Mes parents m'ont dit qu'ils étaient fiers de moi. J'ai demandé pourquoi. » « Ils ont cherché un moment. » Puis : « Les 21 messages de l'article sont prêts à copier : lien ».
- **X3**, mer. 21/10, vanne + quiz : « Dans le train, la place à côté de moi était réservée. Personne n'est venu. » « Je me suis senti attendu pendant tout le trajet. » Puis : « Ça, c'est de l'humour d'Observateur. Et toi, tu es lequel des 5 profils ? Environ 2 minutes, sans inscription : lien ».

**Instagram** (cartes 4:5, 18:30 ; cartes dans `visuels-s15/v4/`)
- **IG1**, mar. 27/10, 2 cartes : « Mon tuteur a lu mon rapport de stage. Il m'a dit “les remerciements sont très bien”. » puis « Ils sont en page 2. Le rapport commence page 3. » Légende : « À envoyer à ton tuteur de stage. »
- **IG2**, lun. 12/10, relais de l'article « se présenter avec humour », 2 cartes : « Au jeu de mimes, ma carte disait “la timidité”. » puis « J'avais à peine bougé qu'ils avaient trouvé. » Légende : « À envoyer à qui a un tour de table demain. » + renvoi à l'article.
- **IG3**, mer. 14/10, carrousel décryptage 4 cartes : « J'ai découvert que mes potes avaient un groupe sans moi. J'ai boudé trois jours. » puis « Il s'appelait “Anniv de Léa”. Léa, c'est moi. » ; carte 3 « Pourquoi ça fait rire : celui qui boude trois jours est l'invité d'honneur, et la preuve se trouvait dans le titre du groupe. » ; carte 4 « À toi de jouer : repense à un moment où tu t'es cru mis de côté, puis cherche le détail qui prouvait le contraire. Le quiz est dans le lien de la bio. » Légende : « À envoyer à celui qui n'est jamais sûr d'être invité. »

**LinkedIn** (08:15, 3 phrases au plus)
- **L1**, jeu. 15/10 : « Il y a un canapé dans l'espace détente de mon bureau. Personne ne s'y est jamais assis. » « Il est là pour prouver qu'on pourrait. »
- **L2**, situation de bureau (texte de marque, au « tu ») : Ton manager t'écrit « t'as deux minutes ? » et rien d'autre. Tu passes les quatre minutes suivantes à t'inventer trois fautes graves, dont une dans un dossier que tu n'as jamais ouvert. Il voulait le code du photocopieur.
- **L3**, mar. 13/10, relais de « se présenter avec humour » (texte de marque, au « tu ») : Au tour de table, tu es le suivant, et celui d'avant vient d'évoquer sa boîte montée à 19 ans. Ta présentation commence par « Bonjour, moi c'est » et se termine au même endroit. Voici 5 accroches pour la prolonger, et comment trouver la tienne : lien

## 3. Ce que Thomas valide

1. Les 9 posts ci-dessus (ou nouveau tirage pour les 6 sous Alexa).
2. Les cartes visuelles (`visuels-s15/v4/`).
3. **R6** : une vanne à la 1re personne est publiée entre « » (application de ton choix du 05/05 « pas de 1re personne hors citation explicite »). Les posts X déjà publiés depuis le 02/10 ne l'avaient pas.
4. Cadence : Instagram 5, X 5, LinkedIn 2 par semaine (heures à tester) ; le social ne parle jamais de prix ni d'abonnement.
5. Les seuils de mesure (`mesure.md`, marqués `[HYPOTHÈSE]`) et le relevé de départ des abonnés (à faire par Thomas).
6. Choix techniques à revoir si besoin : X en texte seul ; relais Instagram en 2 cartes ; sur mobile, inscription par e-mail proposée avant Google.

## 4. Après validation

Déploiement (avec migration de la base), réglage de l'interrupteur par réseau depuis l'admin, préparation du lot complet octobre-décembre noté à 10/10, puis vérification chez Buffer que chaque post est réellement publié.
