# Revue UX v1 du brief s24 (espace client Premium)

Revue de `docs/espace-client/brief-espace-client-s24.md` (v1, @product-manager), par @ux, le 10/11/2026. Le brief n'est pas modifié. Sources : brief, capture de référence, code `apps/web/src` (header, mobile-nav, account-menu, profil-dashboard, parcours-detail, parcours-xp, config/premium, layout du groupe dashboard).

## 1. Vérifications du brief dans le code

| Affirmation du brief | Verdict | Preuve |
|---|---|---|
| En-tête : 6 onglets visiteur, Premium avec Carnet, menu de compte à 3 entrées (Favoris, Mon profil, Déconnexion), barre `h-16` sticky | VRAI | `header.tsx`, `account-menu.tsx` |
| Le profil est un tableau de statistiques + abonnement | VRAI | `profil-dashboard.tsx` : Progression (niveau, XP, barre), Série, Statistiques (4 compteurs), Mes parcours (barres), Prochaine étape, Abonnement, Question à l'équipe, Lettre, Prénom, Suppression |
| « 6 étapes par parcours » (§3.3, Q4 option A et B) | FAUX | `config/premium.ts` : Machine à Café 3, Répartie 4, Confiance 6, Storytelling 6, Boulot 6 |
| « Pas de barre de progression globale en tête de page parcours [À VÉRIFIER] » (§2.6) | FAUX, elle existe | `parcours-detail.tsx` : `ProgressBar` « x/N étapes complétées » pour Premium, état squelette, état échec, XP gagnés et total (`totalParcoursXp`, `xpGagnesParcours`), carte de fin, date conseillée |
| Étapes en liste + « Voir » | Partiellement : c'est déjà un accordéon (`expandedStep`) avec ancre `#etape-N`, validation dans n'importe quel ordre | `parcours-detail.tsx` |
| `getPathXpTotal` et `lib/progression.ts` | Nom inexact : l'XP de parcours est dans `lib/parcours-xp.ts` (`totalParcoursXp`) ; niveaux dans `lib/progression.ts` | |
| L'en-tête Premium dépend de la session côté navigateur | Fait utile non vu par le brief : `isPremium` vient de `useSession`, donc le HTML serveur (celui des robots) est celui du visiteur | `header.tsx` l.83-84 |
| Liens vers `/profil` en dur | Au moins 4 : `account-menu.tsx`, `mobile-nav.tsx`, `buildLoginUrl({callbackUrl:"/profil"})` dans `profil-dashboard.tsx`, `PREMIUM_DEFAULT_RETURN="/parcours"` ; e-mails et retours Stripe à lister au lot 0 | |

## 2. Notes

| Critère | Note | Constat |
|---|---|---|
| Architecture de l'information (rubriques, sous-barre, accueil) | 6 | Sous-barre (Q3 A) = bon choix : le budget de largeur de l'en-tête est protégé. Mais : (1) un abonné verrait deux rangées avec les mêmes mots (Vannes, Conseils, Vidéos, Carnet, Parcours dans l'en-tête ET la sous-barre) ; (2) le brief ne dit pas si « Vannes » mène à `/vannes` (public, indexable) ou à une copie noindex dans l'espace (contenu dupliqué) ; (3) 12 rubriques, dont « Exercices et jeux » dont la page d'agrégation n'a pas de contenu défini ; (4) empilement sticky 64 px + sous-barre = environ 110 px perdus sur mobile, et le calcul `max-h-[calc(100dvh-4rem-1px)]` du menu mobile et les ancres `#etape-N` doivent suivre. |
| Tableau de bord « Aujourd'hui » | 7 | Principe juste (coaching, état vide avec action, pas de culpabilisation). 6 blocs sans hiérarchie : rien n'impose ce qui est visible sans défiler à 375 px. Le « premier pas nommé » n'est jamais défini (quel contenu ? choisi comment ?). |
| Parcours abonné du premier jour | 6 | Bon diagnostic (H1, H2) et bonne prudence (hypothèse, mesure en base d'abord). Mais aucun critère ne vérifie le jour 1 : le brief ne mesure pas « paiement vers première étape ouverte en 2 clics ». La cloche n'aide pas le jour 1 (aucune notification à ce moment). Page de succès : Q8 la cite mais sans contenu. |
| Page parcours (progression, découpage, Voir/Fait) | 5 | Le brief reconstruit en partie ce qui existe (barre, XP, liste dépliable). Il ne dit pas si la page abonné garde l'URL publique ISR `/parcours/[slug]` (reco : oui). Q4 raisonne sur 6 étapes alors que 2 parcours en ont 3 et 4 : l'option B « 3 + 3 » est impossible. « Fait » en bouton : dans le brief (Q5 A) il valide via exercice ou quiz, donc un bouton « Fait » sur la ligne promet un clic qui ne valide pas, ou qui contourne la preuve. |
| Mobile d'abord | 5 | Cité dans les risques, absent de la conception. Le code mesure 66 % de trafic mobile (audit s20). Aucun ordre de blocs mobile, aucune règle de sous-barre à 375 px à part « défilement avec fondu ». Un défilement horizontal sans repère cache les rubriques au-delà de la 4e. Point favorable : l'abonné n'a plus le bouton prix, il y a de la place pour une cloche. |
| Cohérence site public et SEO | 7 | Parades solides (groupe de routes, diff HTML, noindex, critère 11). Fait non exploité : l'en-tête Premium est déjà rendu côté navigateur, donc une sous-barre Premium rendue de la même façon sur les URL publiques ne change pas le HTML indexé. Cela évite toute URL `/mon-espace/vannes` en double. Reste à écrire la règle. |
| Questions posées à Thomas | 7 | Format (3 options, reco) et ordre (Q1 à Q3 d'abord) bons. Q4 mal calibrée (étapes), Q5 : l'option « Fait manuel » défendue par la capture n'est pas évaluée sur l'effet rétention. Questions structurantes absentes : le premier pas du jour 1, l'en-tête de l'abonné, l'URL de la page parcours abonné, le contenu de « Exercices et jeux ». |
| Critères d'acceptation | 6 | 14 critères, presque tous binaires et testables. Manquent : jour 1, accessibilité clavier/focus/aria de la sous-barre, rubrique active visible et ramenée dans l'écran, hauteur d'empilement et ancres, redirection `/profil` (liens entrants, paramètres), ordre mobile du tableau de bord. Le critère 4 (cibles >= 44 px) est bon ; le critère 8 (5 états) est trop vague pour tester sans liste d'écrans. |

**Note globale : 6 / 10.** Base saine et prudente, mais elle ignore une partie de l'existant (page parcours déjà riche), contient une erreur de fait (6 étapes) qui fausse Q4, et laisse ouvertes trois décisions qui conditionnent le lot 1 (doublon de navigation, URL des rubriques, mobile). Avec les corrections obligatoires ci-dessous : 8 / 10 attendu.

## 3. Corrections OBLIGATOIRES (texte exact à insérer)

**C1. §2.6, ligne « XP total + progression globale » : remplacer la colonne « Écart » par :**
`La page parcours abonné affiche déjà une barre « x/N étapes complétées », les XP gagnés et le total avec bonus (parcours-detail.tsx, parcours-xp.ts). Écart réel : pas de rappel XP et niveau global en tête, pas de vue regroupant les 5 parcours.`

**C2. §3.3 et Q4 : remplacer toute mention « 6 étapes par parcours » par :**
`Les parcours comptent 3 étapes (Machine à Café), 4 (Répartie), 6 (Confiance, Storytelling, Boulot), source config/premium.ts. Aucune règle de découpage ne doit supposer 6 étapes.`
Et dans Q4, option B, remplacer « (ex. 3 + 3) » par « (seulement pour les parcours à 6 étapes ; les parcours de 3 et 4 étapes restent d'un bloc) ».

**C3. §3.3, après la première puce, insérer :**
`- URL et réutilisation : la page abonné reste /parcours/[slug] (ISR inchangée pour le visiteur). On ENRICHIT parcours-detail.tsx (déjà : barre, XP, accordéon, ancre #etape-N, états chargement et échec) au lieu de le reconstruire. Aucune seconde page de parcours sous /mon-espace.`

**C4. §3.3, remplacer la puce « Liste numérotée des étapes… » par :**
`- Liste numérotée des étapes : numéro, titre, format et durée, statut en texte (« À faire », « Conseillée le {date} », « Fait ») et UN seul bouton par ligne : « Voir » (devient « Reprendre » si commencée). « Fait » est un statut affiché (coche et texte, jamais une couleur seule), pas un bouton, tant que Q5 = A : la validation reste celle de l'exercice ou du quiz dans l'étape ouverte. Voir ouvre l'étape à la même page (ancre #etape-N).`

**C5. §3.1, après le tableau, insérer :**
`Règle de navigation : les rubriques de contenu (Parcours, Carnet, Vannes, Conseils, Vidéos, Vocabulaire, Favoris) pointent vers les URL EXISTANTES. Aucune copie sous /mon-espace (pas de contenu dupliqué, pas de canonical à gérer). La sous-barre est rendue côté navigateur, pour une session Premium seulement, sur ces URL et sur les nouvelles pages de /mon-espace ; le HTML serveur reste celui du visiteur (même mécanisme que premiumNavItems dans header.tsx). Seules sont créées sous /mon-espace : Aujourd'hui, Ma progression, Mes notes, Mon compte, Écrire à l'équipe.`

**C6. §3.1, remplacer la dernière phrase (« Dix à douze rubriques… (Q3) ») par :**
`Maximum 6 entrées visibles dans la sous-barre : Aujourd'hui, Parcours, Carnet, Favoris et notes, Écrire à l'équipe, Plus (Vannes, Conseils, Vidéos, Vocabulaire, Quiz, Lettre, Mon compte). Ordre par fréquence d'usage attendue, validé par étalons. Rubrique « Exercices et jeux » : retirée de V1 sauf décision Thomas (Q12).`

**C7. Q3, remplacer la colonne « Reco » par :**
`A, avec trois précisions obligatoires. (1) Pour l'abonné, l'en-tête garde logo, recherche, cloche (si Q6 ≠ C) et menu de compte, et ses 7 onglets passent dans la sous-barre : aucune rubrique n'apparaît deux fois (voir Q11). (2) Mobile : sous-barre de 44 px de haut, rubrique active ramenée dans l'écran au chargement, fondu de bord, jamais plus de 6 entrées ; empilement total en-tête + sous-barre <= 112 px ; le calcul de hauteur du menu mobile et les ancres (scroll-padding-top) en tiennent compte. (3) header-budget.spec.ts étendu à l'état « abonné avec sous-barre ».`

**C8. §3.2, remplacer la liste de blocs par un ordre de priorité, en ajoutant avant le bloc 1 :**
`Priorité d'affichage à 375 px, sans défiler : (a) salutation et série sur une ligne, (b) UNE action principale : « Reprendre {étape} » ou, au jour 1, « Commencer {premier pas} » (règle : Q10), (c) le contenu du jour. Tout le reste (progression, nouveautés, raccourcis) passe sous la ligne de flottaison, en cartes repliables ou empilées. Maximum 3 actions principales visibles par écran.`

**C9. §4, ajouter 3 lignes au tableau des questions :**
`| Q10 | Quel est le « premier pas » du premier jour ? | Toujours la première étape de Machine à Café (3 étapes, 15 min/semaine, la plus courte) | La première étape du parcours désigné par le quiz d'humour s'il a été fait, sinon option A | Une vanne et un conseil à essayer aujourd'hui, sans parcours | B : le plus pertinent sans question à l'inscription ; texte validé par étalons |`
`| Q11 | En-tête de l'abonné : quoi faire des 7 onglets déjà présents ? | Ils migrent dans la sous-barre, l'en-tête garde logo, recherche, cloche, compte | On garde l'en-tête tel quel et la sous-barre ne porte que les rubriques neuves | Sous-barre seule, en-tête minimal | A : un seul jeu de mots à l'écran, budget de largeur libéré |`
`| Q12 | « Exercices et jeux » : que contient cette rubrique ? | Quiz d'humour et exercices des parcours seulement | A + exercices des fiches agrégés (vannes, conseils, vidéos) | Pas de rubrique en V1 | C si l'agrégation des exercices n'est pas chiffrée ; A sinon (rien d'inventé) |`

**C10. §5.1, ajouter les critères :**
`15. Jour 1 : après un paiement réussi, un abonné sans historique atteint la première étape ouverte en 2 clics depuis la page de succès, et cette page affiche le premier pas nommé (Q10). Test E2E sur compte neuf.`
`16. Sous-barre : lien actif porteur de aria-current="page", visible sans défiler à 320 et 375 px, focus clavier visible, ordre de tabulation logique, aucun libellé coupé ; aucune rubrique n'apparaît dans l'en-tête ET la sous-barre.`
`17. Empilement en-tête + sous-barre <= 112 px à 375 px ; une ancre #etape-N ou #main-content n'est jamais masquée par les barres collantes.`
`18. /profil répond 308 vers la nouvelle adresse en conservant les paramètres de requête ; tous les liens internes (menu de compte, menu mobile, e-mails, retours Stripe, callbackUrl) sont listés au lot 0 et testés.`
`19. Page parcours : pour 3, 4 et 6 étapes, la liste, la barre et le pourcentage sont corrects (test sur les 3 tailles) ; un parcours à 0 étape faite affiche « 0 sur N » et un bouton « Commencer ».`
`20. Un visiteur et un compte sans abonnement ne reçoivent ni sous-barre, ni cloche, ni donnée personnelle dans le HTML (déjà critère 2 et 3, vérifié aussi sur les URL publiques enrichies).`

**C11. §5.1 critère 8, remplacer par :**
`8. Chaque écran de la liste fournie au lot 0 (Aujourd'hui, Ma progression, Mes notes, Mon compte, page parcours, Plus) a ses 5 états testés (défaut, chargement, vide avec une action, erreur avec bouton Réessayer, succès) ; aucun écran vide sans bouton.`

## 4. Souhaitables (une ligne chacun)

- Cloche : si les sources (lettre du jeudi, carnet mensuel, étape conseillée) donnent moins d'un événement par semaine, la cloche reste vide presque tout le temps : préférer un bloc « Nouveautés » dans Aujourd'hui en V1 (Q6 option C défendable).
- Tester le tableau de bord avec 3 profils d'état : jour 1 sans rien, semaine 2 avec un parcours commencé, retour après 30 jours (pas de message de reproche).
- Barre de progression : toujours doublée d'un texte (« 2 sur 6 »), jamais le seul pourcentage.
- Ajouter à la cible HEART du brief : activation = au moins un contenu ouvert dans l'espace sous 24 h ; tâche réussie = étape validée à 7 jours (déjà §5.2, à rattacher aux événements Umami).
- Aide contextuelle : une phrase sous « Fait » qui explique ce qui valide une étape, au premier passage seulement.
- Vérifier au lot 0 si la page `/parcours` (liste) affiche déjà la progression par carte pour un abonné avant de créer une synthèse.
- Reprendre dans l'espace le libellé « Écrire à l'équipe » (et non « Écrire au coach » de la capture) pour rester sur le vocabulaire validé.
- Agents spécialisés : un testeur-persona (Yanis, Sophie, Marc) pour le parcours jour 1 serait utile au lot 7, à demander à @agent-factory seulement si les corrections C8 à C10 ne suffisent pas.

## 5. Statut

GO sous réserve de C1 à C11 intégrées dans le brief v2. Non bloquant pour Thomas : Q10 à Q12 ajoutées à la liste de questions du lot 0.

---
**Handoff : @product-manager (brief v2) puis @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/espace-client/revues/ux-v1.md`
- Décisions prises : sous-barre rendue côté navigateur sur les URL publiques existantes (zéro copie noindex), max 6 entrées, page parcours abonné enrichie à la même URL
- Points d'attention : erreur « 6 étapes » (3, 4, 6), existant sous-estimé (barre, XP, accordéon), liens `/profil` à recenser, empilement sticky à 375 px
