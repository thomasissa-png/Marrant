# Audit noté du volet réseaux sociaux (s15, 05/10/2026)

Sources : `docs/social/donnees-audit-s15.md` (base de prod et Umami du 05/10, abrégé D:ligne), préférences fondateur, `mesure.md`, files `preparation/2026-10.md` et `2026-11.md`, code de la chaîne. **Abonnés, impressions, enregistrements, partages et clics de bio : inconnus** (D:29). Aucun choix fondateur n'est re-questionné. Les notes de qualité d'humour sont un jugement d'auditeur `[HYPOTHÈSE : à croiser avec la relecture à l'aveugle]`.

## 1. Tableau des notes

| Critère | Note /10 | Fait clé | Action n°1 |
|---|---|---|---|
| C1 Stratégie et réseaux | 7 | Instagram prioritaire + X relais, LinkedIn en pause : cohérent avec Yanis (20) et Sophie (26). Aucune preuve par les chiffres que ces réseaux touchent Marc (34) ni que X touche les moins de 25 ans | Mesurer par plateforme (tranche d'âge des statistiques natives) dès le relevé du 12/10 |
| C2 Croissance audience | 3 | 0 abonné au 24/03, aucun relevé depuis (D:29). Social = 1 visite en 28 j contre 455 pour la recherche organique (D:23-25). Régime de publication actif depuis 4 jours seulement | Relevé de départ des abonnés X et IG avant le 06/10 |
| C3 Qualité éditoriale | 7 | Sur 16 posts de `2026-10.md` : 14 vannes à 8,0 en moyenne (Alexa #5, « alternant1 » #7, « Léa, c'est moi » #23, « Je suis devenu un endroit » #38 à 9), 2 posts d'article titre + lien à 4 (#3, #12). Voix de marque respectée | Remplacer le titre nu des posts d'article par une accroche tirée de l'article |
| C4 Formats par plateforme | 6 | Tweets simples de 82 à 172 caractères, cartes « amorce // chute » conformes. Mais carte d'article = titre seul sur le gabarit « La Vanne », 0 hashtag, cartes fixes uniquement (`prepare-social-month.ts:152`) | Accroche + carte distincte pour l'article (voir C3), test de 3 hashtags sur la moitié des cartes |
| C5 Fiabilité de la chaîne | 7 | 4 posts dus du 02 au 05/10 : 3 publiés à l'heure, le 4e programmé après l'extraction, 0 FAILED, 0 en retard, tous avec `externalId` (D:14-16). Contrôle bloquant sans IA (`social-controls.ts:61-75`). Limites structurelles en §3 | Remplacer automatiquement un post FAILED par une vanne de réserve (§3) |
| C6 Calendrier et saisonnalité | 5 | Les articles du jeudi (P0 du 05/10 : 22/10, 29/10, 05/11...) ne sont jamais relayés : le plan ne lit que les lundis (`social-month-plan.ts:150`) et Instagram n'a pas de créneau jeudi (`:54`). Vannes tirées au hasard avec graine, aucune vanne d'Halloween le 30/10 | Relayer les articles du jeudi (X le jeudi, IG le vendredi à la place d'une carte vanne) |
| C7 Engagement et communauté | 2 | Aucun protocole de réponse dans `mesure.md`, 0 réponse comptée en base (D:18), pas de veille de mentions | Protocole : réponse sous 24 h, banque de réponses préparée en lot |
| C8 Retour en trafic | 3 | UTM bien posés (`mesure.md:5-19`) et page `/liens` bien construite (`liens/page.tsx:24-35`), mais 0 visite `utm_source=x` ou `instagram`, `/liens` absente des 89 chemins sur 180 j (D:23-24) | Confirmer que la bio IG pointe vers `/liens` et tester le clic |
| C9 Conversion | 3 | Aucun événement d'inscription relié à une source sociale dans les données ; 1 visite sociale en 28 j rend toute conversion improbable (D:23) | Entonnoir Umami `/liens` > parcours Répartie > inscription |
| C10 Mesure et pilotage | 4 | Lignes du 05/10 vides (`mesure.md:51-52`), métriques en base à 0 sur 140 posts (D:18). Critères de sortie sans chiffre et un critère impossible (§2) | Réécrire les critères de sortie du test avant le 19/10 |
| C11 Profils et identité | 5 | Lien de bio unique automatique (dernier article, vanne du jour, UTM `bio`), pied de carte `deviens-marrant.fr`. Bios, avatars, compte pro IG et `sameAs` : non vérifiés dans les fichiers lus | Thomas confirme les bios ; @seo vérifie `sameAs` |
| C12 Conformité aux choix fondateur | 9 | Marque = compte (lignes de marque sans « je », `social-controls.ts:69-70`), X ≤ 270, LinkedIn exclu (`publish-social/route.ts:68`), 100 % catalogue GARDER, 5 X + 4 IG (D:16), zéro tiret cadratin. Seul écart : validation de l'échantillon non tracée (cases vides, `2026-10.md:22`) | Thomas confirme la validation des échantillons d'octobre et de novembre |

## 2. Note globale

**5,0 / 10** (moyenne pondérée : C3 14 %, C2 12 %, C5 et C8 10 %, C1, C4, C7, C9, C10 8 % chacun, C6 6 %, C11 et C12 4 %). Moyenne simple : 5,1. Lecture : l'amont (contenu, chaîne, conformité) est solide ; l'aval (audience, trafic, conversion, pilotage) est aveugle ou vide, en partie parce que le régime n'a que 4 jours.

## 3. Lecture de la chaîne (C5, code lu)

- Un post en échec n'est jamais remplacé : 429 = FAILED + blocage de la plateforme 24 h (`publish-social/route.ts:347-371`), et la génération quotidienne qui « en générait un nouveau demain » est coupée (commentaire L348 périmé). Résultat : un trou au calendrier, sans relais.
- Rattrapage non borné : `scheduledAt <= now` sans borne basse (L173), 1 post par plateforme et par passage (L234-241). Après une panne, rafale d'un post toutes les 15 min, ou posts passés en FAILED au bout de 48 h (`diagnostic-publication.md:23`). Dans les deux cas, la règle « jamais deux posts à moins de 3 h » saute.
- `PUBLISHED` = accepté par Buffer, pas confirmé sur le réseau (L300-307).
- Pas d'alerte « 0 publication depuis 48 h » constatée dans les fichiers lus (recommandée en s14) `[À VÉRIFIER : route social-analytics non relue]`.
- Filet de sécurité : un tweet > 270 est encore découpé en thread (L277). Bloqué en amont par `checkPost`, mais à neutraliser pour les posts ajoutés à la main.
- Anti-répétition : `alreadyUsed` ne lit que le mois en cours (`prepare-social-month.ts:68-73`). Rien n'empêche qu'une vanne de X en octobre revienne sur X en novembre `[HYPOTHÈSE : pool d'environ 125 vannes GARDER, environ 30 posts de vanne par mois, soit environ 12 % de reprise attendue par post si le tirage ne mémorise rien]`.

## 4. Actions pour les critères ≤ 5

| Critère | Action précise | Qui | Métrique de succès | Délai |
|---|---|---|---|---|
| C2 | Relevé de départ : abonnés X et IG, impressions des 4 posts publiés, dans les lignes du 05/10 de `mesure.md` §4 | Thomas | 2 lignes remplies | 06/10 |
| C2 | Fixer l'objectif chiffré : (10 000 abonnés combinés à 12 mois, `project-context.md`, moins le total relevé) / 12 par mois, puis seuil intermédiaire à la semaine 5 | @social | Objectif mensuel écrit dans `mesure.md` | 02/11 |
| C2 | Test A/B de 4 semaines : 3 hashtags thématiques sur la moitié des cartes IG, comparer partages + enregistrements `[HYPOTHÈSE : les hashtags aident la découverte hors abonnés]` | @social | Médiane des deux moitiés relevée | 02/11 |
| C6 | Relayer chaque article du jeudi : X le jeudi (remplace la vanne), IG le vendredi (remplace une carte vanne, reste à 4 par semaine). Modifier `social-month-plan.ts:150` et patcher la file déjà approuvée à partir du 22/10 | @fullstack | 100 % des articles jeudis relayés sur les 2 plateformes dans les 48 h | 15/10 |
| C6 | Table de dates pivots (Halloween posé le vendredi 30/10 car le 31 est un samedi, Toussaint, vœux, Noël) avec vannes choisies dans le pool GARDER, contrôlées par `checkPost` | @social | 1 post saisonnier par date pivot dans le lot de décembre | 20/11 |
| C6 | Mémoire anti-répétition sur 90 jours par plateforme (étendre `alreadyUsed`), registre `registre-posts.md` | @fullstack | 0 vanne répétée sur une même plateforme en 90 j | 20/11 |
| C7 | Protocole : réponse à 100 % des commentaires et messages sous 24 h, pattern d'invitation du 06/05, doctrine troll du 06/05 ; 15 réponses-types préparées en lot (aucune génération au fil de l'eau) | @copywriter (banque), Thomas (envoi) | Taux de réponse 100 % sous 24 h sur le relevé | 19/10 |
| C7 | Ajouter au relevé du lundi : commentaires reçus, réponses, messages, mentions | @social | 3 colonnes ajoutées | 12/10 |
| C7 | Veille à coût 0 : alerte de mentions « deviens-marrant » + 3 requêtes sur les situations des personas, 10 min le lundi | @social | Journal de veille hebdomadaire | 19/10 |
| C8 | Vérifier que la bio IG pointe vers `/liens`, cliquer depuis un mobile et contrôler une visite `utm_campaign=bio` dans Umami | Thomas | ≥ 1 visite `/liens` visible | 06/10 |
| C8 | Ajouter à l'e-mail du lundi une ligne « visites sociales par `utm_source` et `utm_campaign` » `[HYPOTHÈSE : l'e-mail du lundi admin existe, d'après le choix du 05/10]` | @fullstack | Ligne présente chaque lundi | 12/10 |
| C8 | Posts d'article : une accroche tirée de l'article (vanne déjà validée) avant le lien X et sur la carte IG | @social, @copywriter | Clics lien X par post d'article, comparés aux 4 premières semaines | 12/10 |
| C9 | Entonnoir Umami `/liens` > `/parcours/repartie` > inscription, filtré par `utm_source` | @data-analyst | Entonnoir visible et alimenté | 12/10 |
| C9 | Libellé du premier bouton de `/liens` : tester une variante honnête sur l'offre (« première étape gratuite », cohérente avec le choix du 04/10) via `utm_content` | @ux | Taux de clic `/liens` > parcours comparé entre variantes | 02/11 |
| C10 | Réécrire `mesure.md` §5 : critère « deux mois de suite » impossible sur 8 semaines (seuil posé en semaine 5, 3 relevés restent) remplacé par « 3 semaines consécutives sous le seuil en S6 à S8 » ; ajouter des critères de sortie par plateforme (abonnés nets, partages + enregistrements, visites UTM, taux de réponse) et la règle de maintien de X | @social | Critères GO/NO-GO écrits, validés par Thomas | 19/10 |
| C10 | Préremplir le relevé du lundi depuis la base (prévu contre publié, liens) et envoyer un rappel : Thomas ne saisit que les chiffres natifs | @fullstack | Relevé complet 8 lundis sur 8 | 12/10 |
| C11 | Vérifier et noter dans `docs/social/profils.md` : bio (promesse en une ligne, ton marque), avatar, lien `/liens`, compte pro IG actif | Thomas | Checklist complète | 07/10 |
| C11 | Contrôler que `sameAs` (JSON-LD Organization) liste X, Instagram et la page LinkedIn | @seo | `sameAs` conforme | 12/10 |

## 5. Les 3 actions qui feraient gagner le plus (par valeur pour Yanis, Sophie, Marc)

1. **Relayer les articles du jeudi avec une accroche tirée de l'article** (C6, C3, C4, C8) : ce sont les seuls contenus qui répondent à une situation précise du persona à son pic (anniversaire, appli de rencontre, couple, voeux) et les seuls porteurs d'un lien. Aujourd'hui 20 à 25 % des créneaux portent un titre nu.
2. **Mesure de départ et boucle de trafic vérifiée** (C2, C8, C10, C11) : 30 minutes de Thomas (abonnés, bio vers `/liens`, test de clic) rendent le test de 8 semaines lisible ; sans cela le chemin Instagram vers le site, utilisé par Yanis et Sophie, reste invérifié.
3. **Protocole de réponse et banque de réponses** (C7) : la note la plus basse. Yanis (introverti) partage et écrit en message privé plus qu'il ne commente en public `[HYPOTHÈSE]` ; répondre vite aux messages construit la communauté sans nouvelle production.

## 6. Points à porter à Thomas (effets, sans remise en cause)

- **Pas d'API de métriques (01/10)** : le relevé manuel devient l'unique source. Effet : deux lundis manqués rendent le test inexploitable. À porter : confirmer que 15 minutes par lundi sont tenables avec le préremplissage proposé en C10.
- **Lien de bio unique et légendes non cliquables** : tout le trafic Instagram passe par un clic de bio, en général peu fréquent. Effet probable : trafic IG faible même avec une bonne portée. Le test dira ; critère à fixer en C10.
- **Pas de TikTok, vidéo non produite avant la semaine 9** : la découverte hors abonnés se fait surtout en vidéo courte `[HYPOTHÈSE : à confirmer par les statistiques natives]`, et des cartes fixes sans hashtag portent peu hors abonnés. À porter : trancher à la semaine 8 le Reel sans visage (vanne à l'écran), déjà posé en s14 (décision 5).
- **100 % catalogue** : à environ 30 posts de vanne par mois, le stock (environ 125 vannes GARDER `[HYPOTHÈSE]`) se recycle en 4 à 5 mois. À porter : le rythme de production de vannes neuves doit suivre.
- **Critère de réussite du test** : la lecture « au-dessus de la médiane des 4 premières semaines » mesure un progrès relatif, pas un résultat. À porter : dire ce qu'est un succès (abonnés, visites, inscrits) pour pouvoir décider du maintien de X à la semaine 8.
- **Validation de l'échantillon** : le drapeau `--echantillon-valide` est déclaratif et les cases des fichiers `preparation/` sont vides. À porter : confirmer que les échantillons d'octobre et de novembre ont bien été relus.

## Handoff

**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/social/audit-note-s15.md`
- Décisions prises : note globale 5,0/10 ; aucun choix fondateur remis en cause ; 3 actions prioritaires (relais jeudi + accroche, mesure de départ + bio, protocole de réponse).
- Points d'attention : code à modifier par @fullstack (`social-month-plan.ts`, `prepare-social-month.ts`), toute modification à consigner dans `REPLIT_ACTIONS.md` ; relevé de départ et vérification de la bio à faire par Thomas.
