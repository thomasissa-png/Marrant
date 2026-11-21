# Vérifications d'après ouverture de l'espace client en production (s26, 21/11/2026)

> Demande du fondateur : faire à sa place les vérifications d'après ouverture faisables SANS compte et SANS écriture
> en production (ouverture : 21/11/2026, 09:06 UTC). Agent : @qa. Site : https://deviens-marrant.fr.
> Règles tenues : lecture seule (GET de pages, navigation par liens), toute requête non-GET du navigateur bloquée et
> journalisée, aucun formulaire soumis, aucun bouton de paiement cliqué, budget ≈ 150 requêtes.
> Scripts et captures : `docs/captures/s26/prod-ouverture/`.

## Verdict

**GO, rien de bloquant.** Passage du 21/11/2026, 09:50 à 10:05 UTC (≈ 45 min après la bascule de 09:06:30), toutes
validations **[LIVE]** (vrai Chromium sur la production, navigation privée sans session) sauf le sitemap (requête GET
brute, **[LIVE]** aussi). 34 contrôles : 33 PASS, 1 FAIL mineur (sitemap encore aux anciens slugs de 3 vidéos renommées
ce matin, probablement résolu seul par le cache d'une heure du sitemap). Trajet visiteur complet conforme, 9 aperçus
propres à 375 et sans donnée de compte, 7 vidéos remplacées en ligne, intégrables et lisibles, pages légales conformes,
0 lien interne cassé sur 77, 0 erreur JavaScript.

**Écriture en production : aucune.** Toute requête non-GET du navigateur a été bloquée avant de partir (5 types vus,
tous des mesures d'audience ou des journaux de YouTube : `POST gateway.umami.is/api/send`,
`POST youtube-nocookie.com/youtubei/v1/log_event`, `POST jnn-pa.googleapis.com/…`). Seules actions de page : clics sur
des liens et sur une tuile fermée d'aperçu (aucun effet serveur). Aucun formulaire rempli ni soumis, aucun bouton de
paiement, aucun appel `/api/*` de l'application en écriture. Budget : ≈ 121 requêtes de premier niveau (≈ 50 chargements
de page, 68 GET de contrôle de liens, d'anciennes adresses et d'oEmbed, 5 `curl` du sitemap et de /videos), hors
ressources chargées par les pages elles-mêmes (JS, CSS, images).

## Résultats

| # | Vérification | Attendu | Constaté | Statut |
|---|---|---|---|---|
| 1.1 | Accueil, 375, navigation privée | 200, rendu propre | 200, `index, follow`, H1 « Tu parles et personne rit. On va arranger ça. », scrollWidth 375 ; « 1 500+ » présent (autorisé) ; boutons « Tout ouvrir » et « Tout ouvrir · 1,99 €/mois » (`01-accueil-375.png`) | PASS |
| 1.2 | Accueil → menu « Quoi répondre » | aperçu verrouillé | clic sur le lien de la barre → `/mon-espace/quoi-repondre`, 6 tuiles fermées affichées en 0,8 s, `noindex, follow`, `no-store` ; aucun « 1 500+ » (`02-quoi-repondre-apercu-375.png`) | PASS |
| 1.3 | Clic sur une tuile fermée | signal sur l'offre, focus sur « Tout ouvrir · 1,99 €/mois » | défilement vers la carte d'offre, contour, focus sur le lien « Tout ouvrir · 1,99 €/mois » (nom accessible « Tout ouvrir, 1,99 € par mois : voir l'offre Premium ») (`03-tuile-signal-offre-375.png`) | PASS |
| 1.4 | Offre → /abonnement | 1,99 € affiché | `/abonnement?returnTo=%2Fmon-espace%2Fquoi-repondre&src=apercu-quoi-repondre`, H1 « Premium ouvre tout Deviens Marrant », 1,99 € et 16,99 € affichés, « 1 500+ » présent (autorisé) (`04-abonnement-375.png`) | PASS |
| 1.5 | /abonnement → « S'abonner · 1,99 €/mois » (lien) → /register | retour conservé | `/register?callbackUrl=/abonnement?returnTo=/mon-espace/quoi-repondre…`, H1 « Ton compte, puis le paiement », « Premium, 1,99 €/mois », `noindex` | PASS |
| 2.1 | Aperçu /mon-espace (Aujourd'hui) | 200, propre, Premium, aucune donnée de compte, noindex | 200, H1 « Aujourd'hui », pastille Premium, carte « Tout ouvrir · 1,99 €/mois », 5 tuiles fermées, scrollWidth 375, `noindex, follow`, `no-store`, aucun e-mail ni « Déconnexion », lien « Connexion » (`07-mon-espace-375.png`) | PASS |
| 2.2 | Aperçu Quoi répondre (accès direct) | idem | 200, 6 tuiles, offre en haut, `noindex`, `no-store`, sw 375 | PASS |
| 2.3 | Aperçu Bibliothèque | idem | 200, H1 « Bibliothèque », pastille Premium à droite du H1, offre, 4 tuiles, `noindex`, sw 375 (`08-bibliotheque-375.png`) | PASS |
| 2.4 | Aperçu S'entraîner | idem | 200, H1 « S'entraîner », offre, 4 tuiles, `noindex`, sw 375 (`09-s-entrainer-375.png`) | PASS |
| 2.5 | Aperçu Mes questions | idem | 200, H1 « Mes questions », offre, 3 tuiles, `noindex`, sw 375 (`10-questions-375.png`) | PASS |
| 2.6 | Aperçu Mes répliques | idem | 200, H1 « Mes répliques », offre, 3 tuiles, `noindex`, sw 375 (`11-repliques-375.png`) | PASS |
| 2.7 | Aperçu Carnet (/carnet) | idem | 200, H1 « Carnet de novembre », offre, programme verrouillé, `noindex, nofollow`, sw 375 (`12-carnet-375.png`) | PASS |
| 2.8 | Parcours (/parcours) | 200, propre | 200, page publique (catalogue des parcours, `index, follow`, en cache public, voulu), sw 375 | PASS |
| 2.9 | Aperçu Favoris (/favoris) | idem | 200, H1 « Favoris », offre, exemples verrouillés, `noindex`, sw 375 (`13-favoris-375.png`) | PASS |
| 2.10 | « 1 500+ » dans les aperçus | absent | absent des 9 aperçus (présent seulement sur l'accueil et /abonnement, autorisé) | PASS |
| 2.11 | Autres adresses de l'espace | info | `/mon-espace/lettres` → `/lettre` (200, `noindex`) ; `/mon-espace/bonus` 404 (bonus vide, porte G2 ; aucun lien interne vers elle) | PASS (info) |
| 3.1 | Fiche Laura Domenge | 200, iframe `W7i0KRn_GLY`, anciennes adresses 308, oEmbed 200 | `/videos/laura-domenge-se-remettre-avec-son-ex-cmmp8p0zu0` 200, iframe `youtube-nocookie.com/embed/W7i0KRn_GLY`, bloc « Dans un parcours » ; `…jamel-comedy-club-…` et `…la-vie-de-couple-…` → 308 vers la nouvelle ; oEmbed 200 (Topito) (`15-video-domenge-375.png`) | PASS |
| 3.2 | Fiche Gad Elmaleh « La visite d'appartement » | idem, `BY8kpWBf57M` | `/videos/gad-elmaleh-la-visite-dappartement-la-vie-normale-cmmp8p3dw0` 200, iframe `BY8kpWBf57M` ; `…decalages-spectacle-complet-1997-…` → 308 ; oEmbed 200 (Comédie+) | PASS |
| 3.3 | Fiche Kev Adams « Le tennis » | idem, `fSMhy3-7Xpk` | `/videos/kev-adams-le-tennis-cmmp8p0fd0` 200, iframe `fSMhy3-7Xpk`, bloc « Dans un parcours » ; `…du-cote-de-chez-vous-…` → 308 ; oEmbed 200 (Montreux Comedy) | PASS |
| 3.4 | Fiche Thomas Ngijol « Superman » | idem, `l__Xirj2N6c` | `/videos/thomas-ngijol-superman-jamel-comedy-club-cmmp8p0xs0` 200, iframe `l__Xirj2N6c` ; `…au-jamel-comedy-club-…` et `…le-voisin-…` → 308 ; oEmbed 200 (Jamel Comedy Club - CANAL+) ; pas encore de bloc « Dans un parcours » (correctif Ngijol en cours de déploiement, attendu) | PASS |
| 3.5 | Fiche Fabrice Éboué (`gBILqA2eVrk`, selon `remplacements-videos-s26.md` et `video-remplacements-s26.json`) | idem | `/videos/fabrice-eboue-les-vegans-plus-rien-a-perdre-cmmp8p3hw0` 200, iframe `gBILqA2eVrk` ; `…plus-rien-a-perdre-spectacle-complet-…` → 308 ; oEmbed 200 (CHEYENNE PROD) | PASS |
| 3.6 | Bonus : Bun Hay Mean et Fellag (titre gardé) | 200, nouvel id | `PaF0YbHim2E` et `z563EqfnqQE` dans l'iframe, oEmbed 200 (Montreux Comedy, Fellag) | PASS |
| 4.1 | /cgu | 200, datée « 20 novembre 2026 » | 200, « 20 novembre 2026 » | PASS |
| 4.2 | /confidentialite | 200, datée « 20 novembre 2026 » | 200, « 20 novembre 2026 » | PASS |
| 4.3 | /retractation | 200 | 200, H1 « Renoncer au contrat ici » (page datée du 7 octobre 2026, non concernée) | PASS |
| 4.4 | /resiliation | 404 (voulu) | 404, page « Oups, cette page a oublié sa punchline », `noindex` | PASS |
| 5.1 | /login | s'affiche, sans soumettre | 200, H1 « Content de te revoir », champs e-mail et mot de passe, « Se connecter », « Continuer avec Google », lien « /forgot-password » ; `noindex` (`14-login-375.png`) | PASS |
| 5.2 | /forgot-password | s'affiche, sans soumettre | 200, H1 « Mot de passe oublié », champ e-mail, « Envoyer le lien » (non cliqué), `noindex` | PASS |
| 1.6 | /register : renonciation | « Renoncer au contrat ici » → /retractation sous la mention des CGU | « En créant ton compte, tu acceptes les CGU. » puis, juste dessous, « Renoncer au contrat ici » → `/retractation` (`05-register-375.png`) | PASS |
| 1.7 | Liens internes des pages visitées | aucun lien cassé | 77 chemins distincts (accueil, aperçus, /abonnement, /register, légales, /login, fiches vidéo, à 375 et 1280) : 77 en 2xx/3xx, 0 en 4xx/5xx (`res-4-1280-liens.json`) | PASS |
| 1.8 | Passage 1280 : accueil, /mon-espace, Quoi répondre (+ tuile), /abonnement, /register | rendu propre, mêmes attendus | 5 pages en 200, scrollWidth 1280 ; tuile → focus « Tout ouvrir · 1,99 €/mois » ; « Renoncer au contrat ici » sur /register (`16-accueil-1280.png`, `17-quoi-repondre-1280.png`, `18-register-1280.png`) | PASS |
| 3.7 | Lecteur YouTube intégré (7 fiches, 1280) | pas d'écran d'erreur | les 7 lecteurs chargent le bon titre, aucun `.ytp-error` (`19-video-gad-1280.png`). Réseau du test hors de France : la lecture en France reste à confirmer sur téléphone | PASS |
| 3.8 | Sitemap à jour des titres changés | nouveaux slugs, 0 `mon-espace` | 434 URL, 0 `mon-espace` ; Ngijol et Éboué au nouveau slug ; **Domenge, Gad, Kev Adams encore à l'ancien slug** (10:05 UTC), qui répond 308 | FAIL (mineur, voir A1) |
| 6.1 | Console navigateur, toutes les pages visitées (375 et 1280) | 0 erreur JS | 0 `pageerror` ; erreurs console : seulement « 404 » sur /resiliation et /mon-espace/bonus (attendu) et une alerte « Permissions policy violation: compute-pressure » émise par le cadre YouTube sur une fiche (tiers, sans effet) | PASS |

## Anomalies

**Bloquant** : aucune.

**À corriger**

- **A1. Sitemap : 3 fiches vidéo encore à l'ancienne adresse** (constaté à 09:58 et 10:05 UTC). `/sitemap.xml` liste
  `laura-domenge-jamel-comedy-club-cmmp8p0zu0`, `gad-elmaleh-decalages-spectacle-complet-1997-cmmp8p3dw0` et
  `kev-adams-du-cote-de-chez-vous-cmmp8p0fd0` : ces adresses répondent bien 308 vers la nouvelle fiche (aucune page
  cassée), mais Google reçoit une adresse redirigée. Cause probable : le sitemap est régénéré au plus toutes les heures
  (`revalidate = 3600`, `apps/web/src/app/sitemap.ts`, données lues en base) et sa dernière version date d'avant la
  tâche de démarrage de 09:06 qui a renommé les 3 vidéos (Ngijol et Éboué, renommés la veille, y sont déjà au nouveau
  slug). À vérifier après 11:10 UTC :
  `curl -s https://deviens-marrant.fr/sitemap.xml | grep -c -E "se-remettre-avec-son-ex|la-visite-dappartement|kev-adams-le-tennis"`
  doit donner 3. Si c'est le cas : rien à corriger, puis IndexNow des 3 nouvelles adresses (comme en s20). Sinon :
  @fullstack. Pas de capture (fichier XML).

**Cosmétique** : aucune.

**Remarques (pas des anomalies)**

- Au premier passage, la capture de Quoi répondre prise juste après le clic du menu montrait le squelette de
  chargement ; aux passages suivants, les tuiles étaient là en 0,8 s (clic du menu) et 0,07 s (adresse directe). Non
  reproduit, rien à corriger.
- Une tuile fermée se touche à travers l'extrait de l'aperçu (extrait `inert`, clic lu par position) : c'est voulu
  (`signal-offre.tsx`) ; un outil d'automatisation doit cliquer « par position », un vrai doigt n'a aucun souci.
- `/mon-espace/bonus` répond 404 (bonus vides, porte G2) et aucun lien interne n'y mène : conforme au runbook.
- Fiche Ngijol sans bloc « Dans un parcours » pendant le passage : correctif en cours de déploiement, attendu.
- Le lecteur YouTube a été chargé depuis un réseau hors de France : l'absence d'écran d'erreur ne prouve pas la lecture
  en France (cas de la revendication TF1 sur l'ancienne vidéo de Gad).

## Impossible sans compte abonné (ou sans écrire en production)

À faire par Thomas (runbook §4, « Vérifications de Thomas ») :

1. Achat Stripe réel (Checkout, retour dans l'espace, e-mail de bienvenue Premium, « Gérer mon abonnement »), puis renonciation via `/retractation` si achat de test.
2. Espace abonné réel à 375 : Aujourd'hui, Quoi répondre (une fiche, « Fait », Situation suivante), Favoris (ajout et retrait), cloche, question à l'équipe puis réponse depuis `/admin/questions` et e-mail reçu.
3. Contenu ouvert des rubriques (fiches, Bibliothèque, S'entraîner, Mes répliques, Carnet, Parcours au-delà de l'étape 1) : seuls les aperçus verrouillés sont visibles sans compte.
4. Inscription, connexion, mot de passe oublié, lettre : arrivée des e-mails en boîte de réception et liens vers https://deviens-marrant.fr (les pages ont été seulement affichées, rien n'a été soumis).
5. Connexion Google.
6. Lecture des 7 vidéos remplacées depuis la France, sur téléphone en 4G (au moins Gad Elmaleh).
7. Journaux Cloudflare sans 500 pendant 1 h (`wrangler tail`), relevé de lecture admin, santé `ok`.

## Fichiers

- Scripts (lecture seule, non-GET bloqué) : `docs/captures/s26/prod-ouverture/lib.js`, `1-trajet-375.js`,
  `2-espace-legal-auth-375.js`, `3-videos.js`, `4-1280-liens.js`, `diag-qr.js` (diagnostic du squelette).
- Résultats bruts : `res-1-trajet-375.json`, `res-2-espace-legal-auth-375.json`, `res-3-videos.json`, `res-4-1280-liens.json`.
- Captures (18, deviceScaleFactor 1) : `01` à `05` (trajet 375), `07` à `14` (aperçus et /login 375), `15` (fiche Domenge 375), `16` à `19` (1280).

## Suivi A1 (21/11, 11:17 UTC)

Résolue sans intervention : le sitemap (434 adresses) liste les 3 nouvelles adresses (Domenge, Gad, Kev Adams) et Ngijol, et plus aucune des anciennes. IndexNow des 3 nouvelles adresses : proposé à Thomas, non lancé.
