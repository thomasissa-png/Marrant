# Reprise s26 : refonte de l'espace client, page par page (fait foi)

Clôture s25 le 17/11/2026. Lire ce fichier EN ENTIER avant toute action, puis `project-context.md`, puis les lignes du 14/11 au 16/11 de `docs/founder-preferences.md`.

## 1. État exact au départ de s26
- Branche `claude/ouverture-session-nzwj0w`, tout poussé, CI à vérifier verte sur le dernier commit. **Rien en production** (Worker `marrant` inchangé). Interrupteur `ESPACE_CLIENT_PUBLIE = false` dans le dépôt (`apps/web/src/config/espace-client.ts`), `true` seulement dans les copies de préversion.
- Page de test en ligne https://marrant-preversion.thomas-issa.workers.dev (comptes `abonne-en-cours@`, `nouvel-abonne@`, `inscrit-gratuit@preversion.test`, mot de passe `preversion-s24`) = **version `7253ffce`, Aujourd'hui tour 12**. Le tour 13 (répliques verrouillées) n'y est PAS encore.
- Préversion locale : port 5400, base `marrant_preview_s25`, faux Resend 5401 (`docs/espace-client/outils-s25/`). Outils de mesure et de capture : `docs/espace-client/outils-s26/README.md`.

## 2. Ce que Thomas a décidé et attend (16/11, fait foi)
- « Chaque section : pour les prospects, doit donner **super envie de joindre et de s'inscrire** ; pour les autres, doit être **claire et donner envie de continuer**. »
- L'aperçu d'une rubrique Premium doit se lire **FERMÉ** au premier coup d'œil, avec le bouton d'offre **en haut**. Fini « le gros bloc de texte centré » : utiliser la largeur.
- **Élégance et harmonie** : il a refusé une version jugée « gros, agressif, petit ici, moyen là » (8 tailles de police au premier écran). Règle en place : échelle de 4 tailles au plus (`apps/web/src/components/espace/typo.ts`, spec `docs/design/typo-harmonie-espace-s25.md`), 2 graisses, aucune capitale, un seul APLAT violet par écran (le bouton plein).
- Direction de l'aperçu validée le 16/11 (« vas-y je te fais confiance », puis « OK ça ») : **montrer la situation en clair et verrouiller les réponses** (titres des répliques visibles, texte non envoyé au navigateur). Promesse d'Aujourd'hui validée : « Cinq minutes par jour pour oser répondre au lieu de te taire. »
- Ses 9 décisions du 16/11 sont dans `docs/founder-preferences.md` (bilan, /lettre, carnet, prix 1,99 €, vannes, etc.).

## 3. À finir sur « Aujourd'hui » (page n°1, en premier)
1. Barres des répliques verrouillées un peu plus visibles (`bg-border-hover` au lieu de `bg-border`, `apercu/tableau-verrouille.tsx`), sans taille ni texte nouveau.
2. Captures (4 comptes, 375/768/1280/1456/1920, pleine page + premier écran, `TAILLES.md`) puis UNE relecture design + UX à l'aveugle (brief `docs/espace-client/travail-en-cours/brief-relecture-v7.md`). Corriger les fautes dures seulement.
3. Mettre la page de test à jour (`bash docs/espace-client/outils-s25/page-de-test.sh` puis `--envoyer` puis `--controles`, par @infrastructure, dépôt propre) et montrer à Thomas les captures + le lien.
4. Textes encore à faire valider par Thomas : « La suite est dans Premium » (fin d'extrait) ; série et cap visibles dès le premier jour (remplace une règle de l'architecture v17) ; étiquette « S'entraîner » au-dessus de « Si tu as 5 minutes ».

## 4. Pages suivantes, dans cet ordre
Quoi répondre, Bibliothèque, S'entraîner (rubriques Premium à aperçu), puis Parcours, Questions et Répliques, Lettre et Carnet, Favoris et Profil, Vannes.
Pour chaque page :
- **Aperçu (visiteur, gratuit)** : réutiliser le modèle d'Aujourd'hui : `apercu/{badge-premium,offre-apercu,hero-apercu,extrait-coupe,tuile-fermee,apercu-verrouille}.tsx` ; offre en haut ; une promesse de BÉNÉFICE (3 propositions par @copywriter dans le ton `docs/copy/ton-alex.md`, choix de Thomas) ; un vrai extrait où ce qui donne envie est visible mais verrouillé (ex. Quoi répondre : la situation en clair, les 3 répliques fermées). Ajouter la page à la liste d'`apercu/offre-en-haut.ts` (masque le bouton de l'en-tête quand l'offre est en haut).
- **Abonné** : clair, la prochaine action évidente, la progression visible ; utiliser la largeur (grilles 12 colonnes, pas de colonne centrée seule) ; échelle `typo.ts`.
- Spec UX courte (@ux) puis spec visuelle (@design) seulement si la page change de structure ; sinon directement @fullstack avec les règles ci-dessous.

## 5. Méthode (leçons de s25, obligatoires)
- **Gate mesurée** avant toute relecture : `tailles-comptes.mjs` (≤ 4 tailles, ≤ 6 combinaisons au premier écran, 4 comptes, 375 et 1280), un seul aplat violet, aucun vide de plus de 32 px AU MILIEU d'un bloc (le vide de fin de carte ou de colonne est permis). Un vide ne se comble JAMAIS en grossissant un texte.
- L'orchestrateur porte la DIRECTION (envie, élégance) et regarde lui-même les captures ; les relecteurs à l'aveugle servent à trouver des fautes chiffrables. En s25, 13 tours sur Aujourd'hui : les notes oscillaient (6 à 9) car chaque relecteur trouvait un détail nouveau. **Au plus 3 tours de relecture par page**, puis montrer à Thomas avec les notes réelles (sans jamais présenter comme validé ce qui ne l'est pas).
- Toujours : régime ouvert seulement, inertie `inertie-espace.test.tsx` 47/47 sans mise à jour, `env -i HOME=$HOME PATH=$PATH` pour tout build/serveur, aucun texte nouveau sans validation de Thomas, zéro tiret cadratin, contrôles complets (tsc build et complet, lint, Jest, build, Playwright ouvert ET fermé avant chaque push de code), CI verte en clôture, ligne dans `REPLIT_ACTIONS.md`.
- Disque limité (~250 Go mais quota) : une seule copie de build à la fois, la supprimer ensuite.

## 6. En attente de Thomas
- Charger les lettres envoyées dans la base de TEST en ligne (branche Neon `preversion-s24`) pour que « La lettre » de l'abonné ne soit pas vide sur la page de test : il faut son accord écrit (aucune écriture en base sans lui).
- Points du §3.4.
- Aucun déploiement en production sans son go écrit ; le correctif /lettre 375 du site actuel attend son go (entrée « À DÉPLOYER » de `REPLIT_ACTIONS.md`).

## 7. Prompt d'ouverture conseillé pour s26
« Session s26 : refonte de l'espace client page par page. Lis project-context.md, puis docs/espace-client/reprise-s26.md en entier (il fait foi), docs/founder-preferences.md (lignes du 14 au 16/11) et docs/design/typo-harmonie-espace-s25.md. Termine Aujourd'hui (§3), montre-le-moi sur la page de test, puis enchaîne Quoi répondre, Bibliothèque et S'entraîner avec le modèle d'aperçu verrouillé (§4), en appliquant la méthode du §5. Rien en production sans mon go écrit ; interrupteur commité à false ; env -i et ANTI-TIMEOUT inchangés. »
