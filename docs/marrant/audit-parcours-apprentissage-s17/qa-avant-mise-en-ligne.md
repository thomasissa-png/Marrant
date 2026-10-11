# QA avant mise en ligne : réserve B3 (contrôle visuel et fonctionnel)

@qa, s17, 07/10/2026. Commit `68124cb`. Instance LOCALE uniquement (`next start` sur un build en environnement propre, Postgres jetable), jamais la prod. Aucun code modifié.

## Verdict B3 : GO (réserve levée)

Aucun bug bloquant. 164 contrôles PASS, 1 FAIL hors périmètre s17 (contraste du profil, défaut antérieur). Deux points à traiter : le bug 1 (à corriger dans le même déploiement si possible) et le bug 2 (OBLIGATOIRE avant le smoke post-déploiement, sinon faux rouge en prod).

## Ce qui a été contrôlé [LIVE, instance locale, Chromium, 375 / 768 / 1280 px]

- **Visiteur** : /parcours ; /parcours/repartie avec l'étape 1 ouverte, des lettres A-D sur les 4 questions, la correction + l'explication « La X : … », la fin de quiz « N sur 4 » + « Valider l'étape fait partie de Premium. ». Aperçu de l'étape 2 : badge « Fait partie de Premium », « Ce que tu vas apprendre », format, bouton « Voir l'offre Premium ». Aucun conseil complet, quiz, vidéo ni vanne des étapes 2-4, ni dans le HTML brut (40 chaînes testées), ni dans le DOM, ni dans les réponses API. Entrées vers `#etape-1` (étape ouverte et à l'écran) depuis l'accueil (« Lire la première étape gratuite »), un article de blog (`?src=blog`) et une fiche vanne (`?src=fiche`).
- **Premium, Répartie (4 étapes), sur 3 comptes (un par largeur)** : 5 vannes par étape, vidéos « Pour aller plus loin, facultatif », 3 boutons « Alors, ce défi ? », +50/+75/+100 puis « +250 XP gagnés, dont 100 de bonus de fin. Parcours terminé ! ». La carte « Parcours Répartie terminé » et le bilan (acquis, « 3 défis essayés, dont 1 qui a marché ») s'affichent sans rechargement. En base : +475 XP (375 + 100), et « 475 XP au total » à l'écran. Rejouer l'étape 1 : HTTP 200, `alreadyCompleted=true`, `xpGained=0`, XP inchangé.
- **Premium, Confiance (6 étapes)** : pas de « Parcours terminé ! » aux étapes 1 à 5, carte de fin à l'étape 6, +800 XP en base.
- **Profil** : « Reprendre ton parcours / Parcours Confiance, étape 3 sur 6 : L'œil de l'observateur / Reprendre l'étape 3 ». Interrupteur du rappel ABSENT pour un compte par mot de passe non vérifié (voulu), PRÉSENT pour le témoin à e-mail vérifié.
- **axe-core (WCAG 2.2 A/AA)** : 0 violation sur les 3 pages détail, en visiteur (375 et 1280) comme en Premium. /profil : voir bug 4.
- **Smoke du repo `@s16` sans `@achat`**, Chromium limité à localhost : 27 PASS, 1 skip, 4 FAIL (2 tests × 2 projets) : bug 2 et limite d'environnement (offre annuelle).
- Lecture visuelle des captures (aperçu, quiz, fins de parcours, profil, vues après validation) : aucun texte tronqué ni chevauchement, hormis le bug 1.

## Bugs

1. **MOYEN, UX : le gain d'XP et la date conseillée se valident hors écran.** Après « Valider cette étape », la page défile jusqu'à l'étape suivante (`parcours-detail.tsx:240`), mais le message vit au-dessus de la liste (`:450`) et reste caché sous l'en-tête collant. Il disparaît ensuite en 6 s : seul le lecteur d'écran l'entend. C'est le cas à 375 px dès l'étape 2, à 768 et 1280 dès l'étape 3 (21 validations mesurées, voir les lignes `VUE` du journal). Captures : `p-375-repartie-etape2-apres-validation-vue.png`, `p-1280-repartie-etape3-apres-validation-vue.png`. Le XP est bien crédité, avec le total visible dans le bloc de progression et la carte de fin. → @fullstack + @ux (par exemple, afficher le message dans la carte qui vient d'être validée, ou décaler le défilement).
2. **MOYEN, test : un smoke prod devenu faux.** `playwright/tests/smoke/murs-premium.spec.ts:115` attend un aria-label « Étape 2 : …, verrouillée », retiré exprès en s17 (QA-05, `parcours-step-card.tsx:95`). Le nom vocal est désormais « Étape 2 : Le rythme et les silences +75 XP Fait partie de Premium ». À aligner AVANT le smoke post-déploiement. → @fullstack.
3. **FAIBLE : la minuterie du message d'XP n'est jamais annulée** (`parcours-detail.tsx:300`). Deux validations à moins de 6 s d'écart effacent le 2e message après moins de 6 s (observé au 1er passage automatisé, Confiance étapes 4 et 5). C'est peu probable pour un humain, puisqu'il y a un quiz entre deux validations.
4. **ANTÉRIEUR À S17 (commit `4f65c2a` ou avant), hors périmètre : axe /profil, 3 contrastes « serious ».** « 1 jour » de la série : 2,2:1 (`streak-counter.tsx:26`). « Regarde les pros » : 2,31:1 (`profil-dashboard.tsx:336`). Bouton « Supprimer mon compte » : 4,38:1. Le titre « Streak » est en anglais (`profil-dashboard.tsx:179`). → @design.

## Limites de l'environnement

- L'offre annuelle est absente en local (pas de `STRIPE_PREMIUM_ANNUAL_PRICE_ID`), ce qui fait échouer `offre-abonnement.spec.ts:53` : pas un bug.
- Les 65 vannes des parcours ne sont pas dans le seed. Elles sont insérées comme données de test depuis l'export en lecture seule du lot A (contenus identiques à `parcours-seed.json`). La base locale n'est pas la prod (statistiques, articles en base).
- Pas de WebKit. L'envoi de l'e-mail de rappel n'est pas testé (pas de Resend). Les miniatures YouTube sont chargées par le serveur local.
- Postgres tourne dans `/var/lib/postgresql/…` et non dans le scratchpad : le bac à sable remet `/tmp/claude-0` en 700, ce qui a coupé la base une fois. L'app est lancée avec `env -i`. Contrôle : aucune variable NEON, Stripe, Resend, Umami, Cloudflare, Anthropic ou mot de passe admin dans `/proc/<next-server>/environ`. Les navigateurs interceptent Umami et bloquent toute requête vers deviens-marrant.fr.

## Refaire les captures (tours @design / @ux)

```bash
/tmp/claude-0/-home-user-Marrant/bd072092-6ee5-586f-8f47-6fd05fa5f334/scratchpad/qa-local/refaire-captures.sh docs/qa/captures-parcours-apprentissage-s17/iter-2/ [--sans-build] [--smoke]
```
Le script, en une commande :
- refuse de démarrer si le port 5000 ou 55433 est occupé ;
- crée le Postgres jetable, puis le schéma, le seed, les vannes de test et les 6 comptes (mot de passe `QaLocal-2026!`) ;
- refait le build en environnement propre (sauf `--sans-build`) ;
- lance l'app et l'arrête si une variable sensible est présente dans son environnement ;
- refait les 86 captures (`v-<largeur>-<écran>` pour le visiteur, `p-<largeur>-<écran>` pour Premium : noms, cadrages et états stables), plus axe et `index.md` (une ligne par capture : écran, largeur, compte) ;
- avec `--smoke`, lance la suite `@s16` contre localhost ;
- puis arrête l'app et supprime la base (même en cas d'erreur).

Comptez environ 12 min avec le build. Journaux dans `qa-local/run-HHMMSS/`. Captures de ce tour : `docs/qa/captures-parcours-apprentissage-s17/apres/` (+ `index.md`).
