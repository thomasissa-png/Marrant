# QA d'intégration s21 : la mise à jour casse-t-elle quelque chose ?

> @qa, session 21, 17/10/2026. Branche testée : `claude/marrant-s21-integration` @ `bb64d37` (worktree `agent-a6072b0ac19da7774`, à jour avec origin, rien commité depuis ce worktree).
> Captures : `docs/qa/captures-s21/qa-integration/` (102 PNG, palette 256 couleurs, échelle 1, relues une à une). Marquage : **[LIVE]** = Chromium réel sur l'application construite, sortie observée ; **[STATIQUE]** = lecture du code ou des en-têtes sans exécution.

## Verdict

**1 bloquant, 1 majeur, 4 mineurs.** Aucune régression sur les pages et parcours existants : tout ce qui change par rapport à la version en ligne est voulu (lot 2, lettre, mentions). En revanche, **la confirmation d'inscription à la lettre est impossible** : le bouton « Confirmer mon adresse » renvoie une page d'erreur brute en JSON (403) et l'adresse reste « en attente ». Personne ne peut donc devenir abonné confirmé, et le n°1 du 05/11 ne partirait vers personne. À corriger avant la mise en ligne.

| # | Gravité | Parcours | Défaut |
|---|---|---|---|
| B1 | **Bloquant** | /lettre, confirmation | Bouton « Confirmer mon adresse » : 403 `origine-refusee` affiché en JSON brut, statut resté `PENDING` |
| M1 | **Majeur** | Tests de bout en bout | Suite smoke rouge (17 échecs, dont 2 nouveaux causés par les textes du lot 2) et aucun test de la lettre : le filet n'a pas vu B1 |
| m1 | Mineur | /lettre?statut=invalide | Message « utilise le formulaire de cette page » alors que le formulaire est remplacé par « Il reste à confirmer ton adresse » |
| m2 | Mineur | /lettre?statut=confirmee | Juste après « C'est bon, c'est confirmé. », le formulaire d'inscription complet est réaffiché |
| m3 | Mineur | Formulaire lettre | Anneau de focus du lien « Confidentialité » (44 px de haut) qui chevauche la ligne au-dessus |
| m4 | Mineur (déjà signalé) | /lettre à 375 | H1 « décryptée , » : espace apparent avant la virgule (approche de la police), toujours présent |

## Conditions du test

- **Local uniquement.** Build de production (`npm run build` de la racine, puis `node .next/standalone/server.js`) sur le port 5100, avec un environnement vide (`env -i`) : aucun secret réel (ni Stripe, ni Resend, ni Anthropic), secret NextAuth factice, identifiants de prix Stripe factices (`price_qa_local_…`). Aucun paiement tenté, **aucun e-mail envoyé** (sans clé Resend, l'API locale répond 500 : c'est attendu).
- **Base PostgreSQL 16 jetable** : `/var/lib/postgresql/qa-integ`, port 5498, 127.0.0.1, schéma poussé puis seed du dépôt (80 vannes, 38 conseils, 89 vidéos, 3 parcours en base). **Supprimée à la fin.** Aucune connexion à la production ni à Neon.
- **Référence « avant »** : le commit en ligne `75a809b` (version Cloudflare `5ea46dd8`, d'après `REPLIT_ACTIONS.md`) construit de la même façon sur le port 5200, même base. Chaque parcours a été joué sur les deux versions et les résultats comparés automatiquement (textes, liens, hauteurs de boutons, console, axe).
- **Production** : lecture seule, en `GET` sans JavaScript (aucune mesure d'audience déclenchée), avec `?ne-pas-compter=1`, aucun formulaire soumis : titre, description, H1, H2 et code HTTP de 22 pages comparés à la référence et à l'intégration.
- Largeurs : 375×812 (mobile tactile) et 1280×800 ; menu aussi à 1024 et 1440.
- Artefacts de l'environnement local, **pas des défauts** : `/_next/image` en 500 sur les miniatures YouTube (le serveur local n'a pas d'accès sortant), `/api/health` en 503 (pas de secrets), description de `/` avec « des vannes, des dizaines de conseils » (page ISR générée au build quand la base était encore vide ; la production affiche « 140+ vannes »), « Failed to fetch RSC payload for /lettre » (préchargement interrompu par la navigation du script ; refait sans interruption : 200, aucune erreur).

## B1. Confirmation de la lettre impossible : BLOQUANT [LIVE]

**Captures** : `08-lettre-confirmer-page-375.png` (page « Dernière étape. », correcte), `08-lettre-confirmee-375.png` et `-1280.png` (résultat du clic : texte JSON brut sur fond blanc), `08-lettre-statut-confirmee-apres-curl-375.png` (ce qu'on devrait voir).

**Reproduction** (les deux largeurs) : inscription réelle sur `/lettre` (ligne créée en base, `PENDING`), ouverture de `/lettre/confirmer?token=<jeton lu en base>`, clic sur « Confirmer mon adresse ». Réponse `403` : `{"error":"Cette action ne peut se faire que depuis deviens-marrant.fr. Recharge la page et réessaie.","code":"origine-refusee"}`. Statut en base après le clic : **`PENDING`**. Journal serveur : `[same-site] newsletter/confirm refusée : origin=null, sec-fetch-site=same-origin`.

**Cause (prouvée)** : `next.config.js` pose `Referrer-Policy: no-referrer` sur `/lettre/:path*` (et la page déclare aussi `referrer: "no-referrer"` dans ses métadonnées), pour que le jeton ne parte jamais en Referer (@legal L5). Avec cette politique, le navigateur envoie **`Origin: null`** sur un POST de formulaire, même vers le même site. Or `isSameSiteRequest` (`lib/same-site.ts`) refuse toute requête `Origin: null`. Contre-épreuve par curl, même jeton, même serveur : `Origin: null` + `Sec-Fetch-Site: same-origin` → 403, reste `PENDING` ; `Origin: http://localhost:5100` → 303 vers `/lettre?statut=confirmee…`, passe à `CONFIRMED`.

La désinscription par bouton fonctionne (`UNSUBSCRIBED`, page « C'est fait, tu ne recevras plus la lettre. ») parce que sa route ne vérifie pas l'origine.

**Pourquoi les tests ne l'ont pas vu** : `lettre-confirmation-desinscription-s21.test.ts` teste une origine pirate et une origine du site, jamais `Origin: null` + `Sec-Fetch-Site: same-origin`, et aucun test de bout en bout ne clique le bouton dans un vrai navigateur.

**Correction proposée** (non codée) :
1. Passer la politique des pages `/lettre/*` de `no-referrer` à **`same-origin`** (en-tête de `next.config.js` et `metadata.referrer` des pages `/lettre/confirmer` et `/lettre/desinscrire`). Le jeton ne part toujours jamais vers un autre site (L5 respecté), et le navigateur envoie la vraie origine sur un POST interne. À faire valider d'une ligne par @legal.
2. En complément, si la route refuse quand même un POST de formulaire, rediriger (303) vers `/lettre?statut=erreur` plutôt que renvoyer du JSON à un humain.
3. Tests de non-régression : Jest `Origin: null` + `Sec-Fetch-Site: same-origin` sur la confirmation ; Playwright local « inscription → jeton en base → clic Confirmer → `CONFIRMED` » (voir M1).
4. Navigateurs : constaté sur Chromium **[LIVE]**. Safari et Firefox appliquent la même règle de la norme Fetch (origine sérialisée à `null` sous `no-referrer`) **[STATIQUE : non joué, WebKit et Firefox non installés]**.

## M1. Tests de bout en bout du dépôt : MAJEUR [LIVE]

Suite `playwright/tests/smoke` (projets `desktop` 1440 et `iphone-13`), jouée sur l'intégration **et** sur la version en ligne construite en local, mêmes données. Projet `achat` ignoré (pas de clé Stripe de test, voulu). Jest en complément, sans secrets : **318 suites, 4 841 tests OK** (5 ignorés).

| | Version en ligne `75a809b` | Intégration `bb64d37` |
|---|---|---|
| Réussis | 96 | 95 |
| Échoués | 16 | 17 |
| Ignorés | 2 | 2 |

- **Nouveaux échecs dus à l'intégration (2)** : `murs-premium.spec.ts:111` (ordinateur et iPhone) cherche le lien « Voir l'offre Premium » de l'étape 2 de `/parcours/machine-a-cafe`, renommé « Voir ce que contient Premium » par le lot 2 (texte validé à l'aveugle). C'est le test qui est périmé, pas le site.
- **Échecs déjà présents sur la version en ligne (15)**, tous dus à des tests pas mis à jour : phrase « 2,99 € TTC par mois, remboursé sous 14 jours… » (remplacée le 17/10 par « Tu as 14 jours pour te faire rembourser ton premier paiement… », 8 tests), « 24,99 €/an » sur /register (devenu « 24,99 € TTC par an », 2), « Termine l'étape 1 pour débloquer » (2), « Connexion » visible sans ouvrir le menu sur iPhone (1), contraste axe `.max-md:sr-only` des cartes verrouillées sur `/conseils` et `/videos` (2, même cible des deux côtés). `/vannes` axe échouait sur la version en ligne et passe sur l'intégration.
- **Gravité majeure** : le workflow `e2e-parcours.yml` tourne chaque jour contre la production ; il est déjà rouge, il le restera après la mise en ligne, et une vraie casse passerait inaperçue dans le bruit. Surtout, **aucun test ne couvre la lettre**, ce qui a laissé passer B1.
- **Correction proposée** : mettre à jour les 17 assertions périmées sur les textes validés (`REASSURANCE_PAIEMENT`, `REMBOURSEMENT_PREMIER_PAIEMENT`, libellés lot 2 de `config/textes/offre.ts`, en important les constantes plutôt qu'en recopiant les phrases) ; ajouter un spec `lettre` : en production, lecture seule (bloc d'accueil, lien de pied de page, formulaire présent aux 3 emplacements, `/lettre` en 200, `/confidentialite#lettre`) ; en local, le parcours complet inscription → confirmation → désinscription décrit en B1 ; décider pour le contraste axe préexistant (corriger ou exclure explicitement la cible, avec un commentaire).

## Parcours de non-régression

Comparaison automatique intégration ↔ version en ligne locale : toutes les différences relevées sont des changements voulus. Aucune page en erreur, aucune erreur JavaScript nouvelle (`pageerror` : 0 sur les deux versions), aucune requête en échec nouvelle hors artefacts listés plus haut.

| Parcours | 375 | 1280 | Résultat | Captures (préfixe) |
|---|---|---|---|---|
| Accueil | OK | OK | Nouveau bloc « Une vanne décryptée, chaque mois » + « Voir la lettre → » entre la FAQ et « Prochainement », un seul H1, axe 0 sur la page et sur le bloc. Le bouton Premium reste la seule action pleine. | `01-` |
| Article (`comment-devenir-drole`) | OK | OK | Encart du milieu et bloc de fin : « Lire la première étape gratuite de Répartie » (contour) puis « Accéder aux parcours complets » (plein). Formulaire de la lettre sous un filet, une seule colonne (champ, case, bouton : ordre visuel = ordre clavier, défaut de la vérification précédente corrigé), « Détails et droits : Confidentialité » ne se coupe plus. Envoi sans case : « Coche la case… ». axe 0 sur le formulaire. | `02-` |
| Quiz jusqu'au résultat | OK | OK | 12 réponses, résultat affiché, « Lire la première étape gratuite » (contour) + « Accéder aux parcours complets » (plein), formulaire de la lettre sous la carte du résultat. axe 0. | `03-` |
| /vannes, fiche vanne | OK | OK | 10 vannes libres puis « Tout débloquer » ; fiche : bouton « Voir ce que contient Premium » (était « Voir Premium »), passé de 40 à 44 px. | `04-vannes-`, `04-fiche-vanne-` |
| Conseil, vidéo (murs Premium) | OK | OK | « Voir ce que contient Premium » en 44 px (était 38 px), même ligne que « Voir tous les conseils » (44 px). 3 cartes verrouillées par liste, la modale s'ouvre avec la phrase « premier paiement ». | `04-fiche-conseil-`, `04-fiche-video-`, `04-videos-modale-premium-` |
| /parcours, étape 1 (`machine-a-cafe`) | OK | OK | « Lecture libre » sur l'étape 1, étape 2 en aperçu avec « Voir ce que contient Premium » (était « Voir l'offre Premium », voir M1). | `05-` |
| /abonnement mensuel et annuel | OK | OK | H1 « Ta réplique pendant la soirée, pas dans le bus du retour », pastille « plus de 3 mois offerts », ligne annuelle dès le mensuel. Bouton d'achat au premier écran : bas à 739 px (mensuel) et 757 px (annuel) sur 812 à 375 (était 1 057 et 1 101 : sous la ligne de flottaison) ; 651 et 649 px sur 800 à 1280. Clic annuel → `/register?callbackUrl=/abonnement?plan=annual`, qui affiche « Premium, 24,99 € TTC par an ». Rien payé. axe 0. | `06-` |
| /register, /login | OK | OK | Identiques à la version en ligne sauf la méta de /register (« pour 2,99 €/mois », voulu). axe 0 sur les deux. | `07-` |
| /lettre : vide, erreur, envoi | OK | OK | Erreur `yanis@gmail` : « ! Cette adresse n'a pas l'air complète. Un exemple : toi@exemple.fr » en `role="alert"`, sans coupure avant les deux-points. Envoi réel sans Resend : ligne créée (`PENDING`, source `page`), message « L'envoi n'a pas abouti, et c'est de notre côté. Ce que tu as saisi reste dans le champ… » et saisie conservée (bon comportement d'erreur). axe 0. | `08-lettre-vide-`, `08-lettre-erreur-adresse-`, `08-lettre-envoi-reel-sans-resend-` |
| /lettre : succès | OK | OK | Réponse 200 simulée : « Regarde ta boîte mail. », compte à rebours de renvoi, « Mauvaise adresse ? La corriger ». | `08-lettre-succes-simule-` |
| /lettre : confirmation par bouton | **B1** | **B1** | Voir B1. | `08-lettre-confirmer-page-`, `08-lettre-confirmee-` |
| /lettre : désinscription par bouton | OK | OK | « Arrêter la lettre ? » puis « C'est fait, tu ne recevras plus la lettre. », statut `UNSUBSCRIBED` en base. | `08-lettre-desinscrire-page-`, `08-lettre-desinscrite-` |
| /lettre : jeton invalide | m1 | m1 | Redirection `/lettre?statut=invalide` correcte, voir m1. | `08-lettre-jeton-invalide-` |
| Menu ordinateur 1024 / 1280 / 1440 | | OK | « La lettre » absent à 1024 (voulu), présent à 1280 et 1440 après « Blog », aucun débordement (largeur de défilement = largeur d'écran aux 3 tailles), recherche à 192 px en visiteur. Onglet actif sur `/lettre`. | `09-menu-1024.png`, `-1280`, `-1440` |
| Menu mobile ouvert | OK | | « La lettre » dernier après « Blog », 44 px de haut, ferme le menu et ouvre `/lettre`. Absent de la barre mobile (voulu). | `09-menu-mobile-` |
| Pied de page | OK | OK | « La lettre du mois » → `/lettre` entre « Quiz humour » et « Anatomie d'une vanne », même style que les autres liens. | `09-pied-de-page-` |
| /confidentialite#lettre, /cgu | OK | OK | Section « 8. La lettre » (ancre `#lettre` présente, titre visible sous l'en-tête fixe) ; CGU « 10. La lettre ». Les autres sections sont identiques à la production. | `10-confidentialite-`, `10-cgu-` |
| Page 404 | OK | OK | Identique à la version en ligne (« Oups, cette page a oublié sa punchline », code 404). | `10-page-404-` |

## Défauts mineurs

**m1. Jeton invalide après une inscription dans le même navigateur** (`08-lettre-jeton-invalide-1280.png`) [LIVE]. Le bandeau dit « Pour t'inscrire, utilise le formulaire de cette page », mais le formulaire est remplacé par « Il reste à confirmer ton adresse : regarde ta boîte mail. Renvoyer l'e-mail » (mémoire locale d'une inscription en attente). Cause probable : le statut `invalide` et le drapeau « en attente » sont gérés séparément. Correction : sur `?statut=invalide` (et `erreur`), afficher le formulaire et ignorer le drapeau, ou adapter la phrase du bandeau quand le drapeau est présent (texte à faire relire).

**m2. Formulaire réaffiché après la confirmation** (`08-lettre-statut-confirmee-apres-curl-375.png`) [LIVE]. Sous « C'est bon, c'est confirmé. », toute la page d'inscription revient (titre, champ, case, bouton), ce qui invite à s'inscrire une seconde fois ; après la désinscription, au contraire, seul le message reste. Correction : sur `?statut=confirmee`, masquer le formulaire comme sur `desinscrit` (à arbitrer par @ux si la spec prévoit l'inverse).

**m3. Anneau de focus du lien « Confidentialité »** (`11-focus-lien-confidentialite-1280.png`) [LIVE]. Visible et contrasté (blanc), mais le lien en `inline-flex min-h-11` fait 44 px de haut dans une ligne de 12 px : l'anneau chevauche « adresse ne sert qu'à » sur la ligne au-dessus. Correction : zone tactile agrandie par un pseudo-élément ou un `padding` vertical avec marge négative, sans changer la boîte dessinée par le focus.

**m4. H1 de /lettre à 375** (`08-lettre-vide-375.png`) [LIVE]. « décryptée , » montre toujours un espace apparent avant la virgule (le HTML est correct, police d'affichage). Déjà signalé dans `verification-visuelle-s21.md`, à confirmer sur iPhone réel avant toute correction.

## Accessibilité et console des nouveaux éléments

- **axe-core (WCAG 2.0/2.1/2.2 A et AA), 0 violation** [LIVE] aux deux largeurs sur : accueil (page et bloc lettre), formulaire de fin d'article, résultat du quiz, `/lettre`, `/lettre/confirmer`, `/abonnement`, `/register`, `/login`. Les textes gris de la mention et de « Gratuit, sans compte. » passent donc le contraste 4,5:1.
- **Clavier** [LIVE] : formulaire = champ, case, bouton, lien « Confidentialité » (ordre visuel identique). Focus visible partout : anneau violet de 2 px sur le champ, l'onglet « La lettre » (9e tabulation depuis le haut de l'accueil), « Voir la lettre → » (44 px) et le bouton « Confirmer mon adresse » ; contour violet sur la case ; anneau blanc sur « Confidentialité » et « La lettre du mois ». Captures `11-focus-*`.
- **Libellés** : champ lié à « Ton adresse e-mail », case nommée par son texte, erreurs en `role="alert"`, piège à robots `aria-hidden` et `tabindex=-1` (invisible aux lecteurs d'écran).
- **Console** : aucune erreur JavaScript nouvelle. Seules erreurs nouvelles : le 403 de B1 et le 500 attendu de l'envoi sans Resend.

## Comparaison avec la production (lecture seule)

22 pages comparées (titre, description, H1, H2, canonique, code HTTP) entre la production, la version en ligne construite en local et l'intégration :
- **Production = version en ligne locale** partout, aux données près (production : « 140+ vannes, 120+ conseils », articles publiés en base ; local : contenu du seed). L'environnement de comparaison est donc fiable.
- **Différences de l'intégration, toutes voulues** : H1 et bloc carnet de `/abonnement`, bloc lettre de l'accueil, méta de `/register`, « 8. La lettre » et « 10. La lettre », `/lettre` (404 en production, 200 en intégration). Pages non touchées identiques : `/login`, `/mentions-legales`, `/retractation`, `/a-propos`, `/anatomie-vanne`, `/glossaire`, `/blog`, deux articles, `/quiz-humour`, `/parcours`, `/parcours/machine-a-cafe`, `/vannes`, `/conseils`, `/videos`, 404.

## Défauts préexistants (pas des régressions, déjà en ligne)

Vus en passant, identiques sur la version en ligne, hors périmètre de la mise à jour : le texte du bouton « Créer mon compte et m'abonner » de la modale Premium sur 375 (deux lignes alignées à gauche avec peu de marge verticale, `04-videos-modale-premium-375.png`) ; « Connexion » absent de la barre mobile (test qui échoue aussi en production) ; contraste axe des cartes verrouillées de `/conseils` et `/videos` ; barre ordinateur connecté sans abonnement qui déborde à 1024 (déjà noté par @fullstack, non rejoué ici : aucun compte créé).

## Nettoyage

Serveurs locaux arrêtés, base `/var/lib/postgresql/qa-integ` supprimée, worktree temporaire de la version en ligne supprimé, worktree d'intégration non modifié (seuls les fichiers de build ignorés par git).
