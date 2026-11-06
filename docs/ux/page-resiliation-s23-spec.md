# Page intermédiaire de résiliation : spec UX (s23, 06/11/2026)

Source : demande de Thomas (06/11), `docs/analytics/resiliations-s23-analyse.md` (H1 à H4, §4), personas, code lu (`footer.tsx`, `abonnement-card.tsx`, `use-subscription-summary.ts`, `api/user/subscription/portal/route.ts`). Cadre légal : `docs/legal/resiliation-onboarding-cadre-s23.md` (@legal, absent à l'écriture). Contraintes retenues en attendant, **à confirmer** : question FACULTATIVE, jamais bloquante ni retardante, zéro dark pattern, zéro culpabilisation, étapes minimales.
Audience : Yanis (introverti, mobile le soir), Sophie (mobile, trajet), Marc (sobre, veut du concret). Ton : `docs/copy/ton-alex.md` (tu, pote bienveillant, pas de vanne ici : une vanne moyenne vaut moins que pas de vanne). Textes ci-dessous = PROVISOIRES, à valider par Thomas (règle étalons P0 s8).

## 1. Placement

**Chaîne actuelle** : clic « Résilier ton contrat » -> `openPortal("resilier")` -> portail Stripe sur l'écran de confirmation (2 écrans). **Chaîne cible** : clic -> **`/resiliation`** (notre page, 1 écran) -> « Continuer la résiliation » -> portail Stripe (confirmation). Soit 1 écran de plus, jamais plus.

- **URL** : `/resiliation` (+ `?source=pied|profil|email`, uniquement pour la mesure, aucune donnée perso dans l'URL). `noindex`, hors sitemap, en-tête et pied de page visibles (pas de page nue), pas de modal.
- **Pied de page** : le lien « Résilier ton contrat » pointe vers `/resiliation?source=pied` (au lieu de `/profil#abonnement`).
- **Profil** : le bouton « Résilier ton contrat » de la carte abonnement devient un lien-bouton vers `/resiliation?source=profil` (au lieu d'appeler le portail). « Gérer mon abonnement » reste direct vers le portail (changer carte, formule) et ne passe PAS par la page.
- **E-mails** (confirmation, rappels) : le mot « Résilier » pointe vers `/resiliation?source=email`. Aucun lien ne contourne la page vers le portail de résiliation, SAUF « Gérer mon abonnement ».
- **Sans session** : le middleware renvoie vers `/login?callbackUrl=/resiliation` (comportement actuel du pied de page, conservé). Après connexion, retour sur la page, état déjà résilié / sans abonnement géré (§4). [À CONFIRMER @legal : un détour par la connexion avant de résilier est déjà le cas aujourd'hui ; si @legal le juge trop lourd, c'est un chantier distinct.]
- **Retour** de Stripe : `return_url` inchangé (`/profil`), où la carte affiche « Premium jusqu'au {date} ».
- **Doublon à supprimer** : si les motifs de résiliation du portail Stripe sont activés (analyse §4), ne pas les activer en plus : on ne pose jamais la question deux fois. Notre page est la source unique.
- **Mobile d'abord** : 375 px de référence, une colonne, bouton principal collé en bas du viewport.
- **Variante B (repli si @legal refuse une étape avant Stripe)** : page `/resiliation/merci` après le portail (`return_url` du flux résiliation), même question, déjà résilié, rien ne bloque. Moins de réponses (le visiteur est parti) mais zéro risque.

## 2. Fond

**Titre (H1)** : « Résilier ton contrat » (libellé unique validé s16, identique au lien qui y mène).
**Chapeau** : « Une question avant de continuer, si tu veux bien : qu'est-ce qui n'a pas collé ? »
**Rappel factuel** (bloc, toujours visible, au-dessus de la question, calculé depuis le résumé d'abonnement) :
- mensuel : « Tu gardes Premium jusqu'au {date}. Aucun nouveau prélèvement. »
- annuel : « Tu gardes Premium jusqu'au {date}. Le renouvellement de {prix} n'aura pas lieu. » (prix = `priceCents` lu, jamais écrit en dur ; [À CONFIRMER @legal : mention du non-remboursement du prorata])
- date inconnue : « Tu gardes Premium jusqu'à la fin de la période déjà payée. » (repli existant `resilierDetailSansDate`).

**Question (une seule)** : « Qu'est-ce qui n'a pas collé ? » + sous-titre « Facultatif. Tu peux ne rien cocher. » Cases à cocher (plusieurs possibles), ordre fixe, jamais aléatoire ni pré-cochées :
1. Je voulais juste essayer (H1, H3)
2. Je n'ai pas trouvé ce que je cherchais (H4)
3. Je ne savais pas par où commencer (H2 : zéro usage enregistré chez A, B, C)
4. C'est trop cher pour moi
5. Je n'ai pas le temps
6. Le contenu ne me correspond pas (persona : trop jeune pour Marc, trop étudiant pour Sophie)
7. Autre (ouvre rien de plus : le champ libre est déjà là)

**Champ libre** : « Un mot de plus ? (facultatif) », 500 caractères max, compteur discret, placeholder « Ce qui t'aurait fait rester, ce qui manquait… ». Jamais obligatoire, même pour « Autre ».

**Main tendue** (une ligne sous la liste, **apparaît seulement** si la raison est cochée, jamais en pop-up, lien en nouvel onglet pour ne pas faire quitter la page, texte « Si ça te dit », jamais de réduction ni d'offre inventée, jamais de relance e-mail automatique) :
- Pas trouvé : « Si ça te dit, la recherche est ici : {Vannes} · {Conseils} · {Parcours} » (liens vers `/vannes`, `/conseils`, `/parcours`).
- Par où commencer : « Si ça te dit, on te conseille la première étape du parcours qui correspond à ton profil : {voir les parcours} » (`/parcours`, [HYPOTHÈSE : le quiz `/quiz-humour` peut recommander un parcours, à vérifier avec @fullstack]).
- Pas le temps : « Les parcours se font en 15 à 20 min par semaine, à ton rythme, rien n'est bloqué. » (chiffre validé, pas de lien).
- Trop cher / juste essayer / ne me correspond pas : aucune main tendue, remerciement seulement : « Merci, c'est utile. » Pas de contre-offre : la page ne vend pas.
- Chaque main tendue est une aide, pas un obstacle : le bouton ne bouge pas, ne se désactive pas.

**Actions (3 maximum)** :
1. **« Continuer la résiliation »** : bouton principal plein, TOUJOURS visible (sticky bas en mobile), actif même pendant le chargement du résumé, envoie la réponse en arrière-plan puis ouvre le portail. Libellé identique avec ou sans réponse. La mention « Facultatif » fait office de « Passer » : décision de cette spec de ne PAS créer un second bouton « Passer » (même destination que « Continuer » = deux boutons identiques, ambigus). Si Thomas veut « Passer » quand même : lien texte « Passer la question » dans le bloc question, même effet, même clic.
2. Lien discret : « Finalement non, retour au profil » (aucune culpabilisation, pas de « tu vas nous manquer »).
3. Cases/champ (optionnels).

**Interdits** (dark patterns) : case pré-cochée, bouton « Garder Premium » plus gros que « Continuer », libellé inversé, compte à rebours, rareté, « tu perds X », timer, confirmation supplémentaire, réponse obligatoire, désactivation du bouton, effacement des réponses en cas d'erreur.

## 3. Données

Table dédiée `CancellationFeedback` (Prisma), une ligne par clic sur « Continuer » :
`id`, `userId` (nullable, `onDelete: SetNull` : la ligne survit à la suppression du compte sans identifiant), `reasons` (`String[]`, codes : `essai`, `introuvable`, `depart`, `prix`, `temps`, `inadapte`, `autre`), `comment` (texte ≤ 500, nullable), `formule` (`monthly|annual`), `tenureDays` (jours entre `Subscription.createdAt` et le clic), `source` (`pied|profil|email`), `createdAt`. Ligne écrite même sans raison (`reasons` vide) : c'est le dénominateur « a passé la question ». Rien d'autre : ni e-mail, ni IP, ni user-agent, ni prix. Ancienneté = `tenureDays`, la date = `createdAt`. [À CONFIRMER @legal : champ libre = donnée potentiellement personnelle ; durée de conservation, mention dans la politique de confidentialité, finalité = amélioration du service.]
- Écriture : `POST /api/user/subscription/resiliation-motif`, appelé en parallèle de l'ouverture du portail (`fetch` avec `keepalive`), **jamais attendu** : un échec est ignoré silencieusement, ne retarde ni ne bloque Stripe. Même protection que le portail (`refuserSiAutreSite`, session obligatoire, validation zod, limite de débit).
- Rapprochement : `cancel_scheduled` (webhook, analyse §4) permet de calculer « a continué » vs « a abandonné chez Stripe ».
- Lecture par Thomas : (a) `/admin`, carte « Résiliations » : total, répartition par raison, mensuel/annuel, ancienneté médiane, 50 dernières réponses libres brutes (sans e-mail) ; (b) rapport du lundi : bloc « Résiliations de la semaine » (nombre, % ayant répondu, top 3 raisons, 3 citations libres brutes, délai achat-résiliation). Emplacement exact du rapport du lundi à localiser par @fullstack. Lecture hebdomadaire, jamais d'alerte par e-mail (au plus un e-mail par jour, préférence Thomas).
- Mesure Umami (complément, aveugle aux acheteurs d'après l'analyse §5) : `resiliation-page-vue`, `resiliation-continuer`. La vérité est la base.

## 4. Wireframes (textuels) et états

**PC (>= 1024)** : en-tête / `main` centré, carte unique `max-w-xl` (576 px), padding 32 / pied de page.
```
[En-tête du site]
        Résilier ton contrat                         (H1)
        Une question avant de continuer, si tu veux bien.
  +------------------------------------------------+
  | Tu gardes Premium jusqu'au 24 novembre 2026.    |  (bloc rappel, fond neutre, icône coche)
  | Aucun nouveau prélèvement.                      |
  +------------------------------------------------+
  Qu'est-ce qui n'a pas collé ?   Facultatif
  [ ] Je voulais juste essayer
  [ ] Je n'ai pas trouvé ce que je cherchais
  [ ] Je ne savais pas par où commencer
  [ ] C'est trop cher pour moi
  [ ] Je n'ai pas le temps
  [ ] Le contenu ne me correspond pas
  [ ] Autre
  (main tendue ici, 1 ligne, si raison cochée)
  Un mot de plus ? (facultatif)  [ zone de texte 3 lignes ]   0/500
  [ Continuer la résiliation ]   Finalement non, retour au profil
[Pied de page]
```
**Mobile (< 768, référence 375)** : même ordre, une colonne, cases = lignes de 48 px de haut (zone entière cliquable), le bouton « Continuer la résiliation » en barre sticky bas (hauteur 56 px, `safe-area` iPhone), le lien « Finalement non » juste au-dessus de la barre dans le flux (pas dans la barre). Le clavier ouvert ne masque jamais le bouton (la barre reste au-dessus du clavier). Hors du viewport : le pied de page défile normalement sous le contenu.

**États** :
- **Chargement du résumé** : bloc rappel en squelette (comme la carte profil), bouton ACTIF dès le début. Jamais d'écran blanc.
- **Clic sur Continuer** : bouton « On t'emmène chez Stripe… » + `aria-busy`, cases et texte conservés. Si le portail tarde (> 3 s) : « Ça prend un peu de temps, on y est presque. »
- **Erreur du portail** (500/réseau) : message en ligne sous le bouton (pas un toast qui disparaît), `role="alert"` : « La page de résiliation ne répond pas. Réessaie dans un instant. Si ça persiste, écris-nous à contact@deviens-marrant.fr. » Bouton redevient « Continuer la résiliation », réponses conservées, aucune saisie perdue. [À CONFIRMER @legal : engagement « on résilie pour toi » en cas de panne.]
- **Déjà résilié** (`cancelAtPeriodEnd`) : pas de question. « Tu as déjà résilié. Premium reste ouvert jusqu'au {date}, aucun nouveau prélèvement. » + « Gérer mon abonnement » (portail) + « Retour au profil ».
- **Sans abonnement** (plan gratuit, pas d'abonnement) : « Tu n'as pas d'abonnement Premium, il n'y a rien à résilier. » + « Retour à l'accueil ».
- **Premium sans client Stripe (404)** : texte existant `aucunAbonnementCarte` (contact par e-mail), jamais de bouton mort.
- **Impayé** : page affichée normalement, rappel sans date promise (repli sans date).
- **Retour après 30 jours / page rouverte** : l'état est relu à chaque ouverture, aucune réponse mémorisée.
- **Accessibilité** : `fieldset` + `legend` pour les cases, focus visible, tout au clavier, cibles >= 44 px, contraste AA, état d'erreur annoncé, `prefers-reduced-motion` respecté (pas d'animation sur la main tendue sauf fondu discret).

## 5. Critères de notation 10/10 (relecteurs : @ux, @design, @reviewer, @legal)

Chaque critère vaut 1 point par pilier ; 10/10 = tous OK, bloquant si un critère « Légal » échoue.
**Placement (10)** : 1 une seule page entre le clic et Stripe ; 2 aucun chemin ne contourne la page sauf « Gérer » ; 3 les 3 entrées (pied, profil, e-mail) arrivent au même endroit ; 4 sans session : retour sur la page après connexion ; 5 mobile d'abord (bouton sticky) ; 6 clics profil -> portail = 2 maximum ; 7 libellé « Résilier ton contrat » identique partout ; 8 noindex, hors sitemap ; 9 aucun doublon avec une question Stripe ; 10 page de repli B documentée.
**Fond (10)** : 1 une seule question ; 2 7 raisons max, issues de l'analyse, ordre fixe ; 3 rien d'obligatoire ; 4 rappel factuel exact (date, mensuel/annuel) ; 5 main tendue pertinente, non bloquante, sans offre inventée ; 6 aucun dark pattern de la liste §2 ; 7 ton Alex (tu, sans corporate, sans culpabilisation, aucun tiret cadratin, aucun concurrent) ; 8 aucune donnée inventée (chiffres déjà validés seulement) ; 9 données minimales, table dédiée, lisibles par Thomas (admin + rapport du lundi) ; 10 chaque raison exploitable (une action produit possible par raison).
**Design (10)** : 1 hiérarchie : H1, rappel, question, bouton ; 2 <= 3 actions par écran ; 3 « Continuer » toujours visible, à 375 px sans défilement pour l'atteindre ; 4 aucun bouton plus saillant que « Continuer » ; 5 cases de 44 px au moins, zone entière cliquable ; 6 chargement, erreur, déjà résilié, sans abonnement, 404 : tous conçus ; 7 saisie conservée en cas d'erreur ; 8 WCAG 2.2 AA (clavier, focus, contraste, `aria-live`) ; 9 cohérence avec les tokens du site (cartes du profil, boutons existants) ; 10 captures 375 / 768 / 1280 relues et notées, états inclus.
Échec bloquant (note plafonnée à 5) : réponse obligatoire, bouton retardé, dark pattern, texte légal modifié, tiret cadratin, ou donnée inventée.

## Handoff @design puis @fullstack
Points d'attention : l'étape ajoutée est la seule vraie question légale (avis @legal en attente) ; décision proposée « un seul bouton » à confirmer par Thomas ; tous les textes sont PROVISOIRES (étalons à calibrer avec Thomas) ; mettre à jour `REPLIT_ACTIONS.md` à l'implémentation.
