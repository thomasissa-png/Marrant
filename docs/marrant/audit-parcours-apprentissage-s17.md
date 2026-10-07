# Audit des parcours d'apprentissage (s17, 07/10/2026)

> Demande de Thomas : « se concentrer sur les parcours ; audit complet : qualité, quantité, parcours, fonctionnement, bugs, expérience utilisateur, tous les critères clés de succès ». Périmètre tranché avec Thomas : les **3 parcours d'apprentissage** (Machine à Café 3 étapes, Répartie 4, Confiance 6) et le chemin autour. Le tunnel connexion / achat / compte a déjà été audité et corrigé en s16 (`docs/marrant/audit-parcours-s16.md`), il n'est pas refait ici.
> 7 audits sur le code à jour (`79b11f3`) et la prod (`712ee919`), en lecture seule : @ux, @qa (prod réelle, desktop et mobile), @fullstack (code + base Neon en lecture), @copywriter, @seo (Umami, Bing), @product-manager, @data-analyst. Rapports : `docs/marrant/audit-parcours-apprentissage-s17/*.md`. Captures : `docs/qa/captures-parcours-apprentissage-s17/` (37).
> Les constats repris ci-dessous ont été trouvés par 2 agents ou plus, ou revérifiés dans le code par l'orchestrateur (blocage de l'étape 2, carte de fin, mauvaise vidéo).

## 1. Note globale : 4,7/10

**Ce qui marche** : le contenu d'une étape est bien construit (un exercice concret « aujourd'hui » à chacune des 13 étapes, voix juste), l'étape 1 est lisible en entier sans compte, les pages sont rapides (moins de 2 s sur ordinateur), le contenu payant ne fuit jamais, l'accès Premium est bien contrôlé, 123 tests automatiques passent, et chaque page du site renvoie vers les parcours.

**Ce qui ne marche pas** : personne ne s'en sert. Depuis mars, la base compte **une seule progression** (une étape 1, le 24/09), **zéro parcours terminé**, et aucun des 2 abonnés n'a commencé un parcours. Trois raisons :
1. **Le visiteur ne voit jamais ce qu'il achète** : le blocage de l'étape 2 lui dit « Termine l'étape 1 pour débloquer », ce qui lui est impossible (valider est réservé à Premium). L'aperçu payant et son bouton ne s'affichent donc jamais.
2. **L'abonné n'a aucune raison de revenir** : tout s'ouvre d'un coup (13 étapes faisables en une soirée), aucun rappel, pas de « reprendre » à l'accueil, un compteur de jours d'affilée qui ne monte jamais.
3. **Presque personne n'arrive** : 23 visites humaines sur 90 jours ont touché une page parcours (moins de 1 % du site), 0 venue de Google.

## 2. Notes par critère

| Critère | Note | En une phrase | Agents |
|---|---|---|---|
| C1 Quantité et couverture | **4,5** | 13 étapes (environ 4 h) pour un abonnement mensuel ; Sophie n'a que 3 étapes ; 3 % des conseils du catalogue utilisés | copywriter 4, PM 5, UX 5 |
| C2 Qualité pédagogique | **5** | Exercices concrets et bonne voix, mais textes des 3 étapes gratuites décalés du conseil affiché, quiz qui ne testent rien | copywriter 5 |
| C3 Découvrabilité | **5** | Liens partout (386 pages sur 386), mais 15 arrivées directes en 90 jours | UX 5, SEO 5 |
| C4 Parcours de bout en bout | **5** | Fluide en visiteur jusqu'au blocage, qui est cassé ; carte de fin absente | UX 4, QA 6 |
| C5 Fonctionnement et bugs | **5,5** | 0 erreur console, accès solide ; 6 bugs de récompense, de blocage et de données | fullstack 5, QA 6 |
| C6 UX/UI, mobile, accessibilité | **6** | Rien ne déborde à 375 px, clavier OK ; quiz corrigé par la couleur seule | UX 5, QA 7 |
| C7 Conversion et valeur Premium | **4,5** | Le visiteur ne voit pas ce qu'il paierait ; contenu fini pour un paiement récurrent | UX 5, PM 5, copywriter 4 |
| C8 Rétention | **2,5** | Rien ne fait revenir la semaine suivante | UX 2, PM 3 |
| C9 Mesure | **2** | 0 événement parcours reçu ; on ne sait pas qui lit, qui bloque, qui finit | fullstack 2, data 2 |
| C10 SEO/GEO | **5** | Technique propre, mais aperçu de partage faux, titres en concurrence avec les articles | SEO 5 |
| C11 Performance et technique | **7** | Rendu serveur, cache, moins de 2 s ; JS un peu lourd, pas de page d'erreur dédiée | SEO, fullstack, QA 7 |
| C12 Promesse et réalité | **4,5** | « Vannes à pratiquer » absentes, « Parcours terminé ! » faux, rythme quotidien contre hebdomadaire | UX 4, copywriter 4, PM 6, fullstack 4 |

## 3. Le tunnel réel (90 jours)

| Marche | Chiffre |
|---|---|
| Visites du site | 2 471 |
| Visites qui touchent une page parcours | 37 (dont 7 tests du 07/10 et 7 robots probables, 23 humaines) |
| Ouvrent la page d'un parcours précis | 13 humaines |
| Lisent l'étape 1, font le quiz | non mesuré |
| Voient le blocage de l'étape 2 | 0 (impossible aujourd'hui) |
| Passent ensuite par l'offre | 2 humaines |
| Paient après un parcours | 0 |
| Abonné qui valide une étape / termine un parcours | 0 / 0 |

Volume : environ **1 visite humaine par semaine** sur une page de parcours. Un taux ne veut rien dire en dessous de 30 cas ; au rythme actuel il faut 30 semaines pour en avoir 30. **Le premier levier est le nombre de personnes qui arrivent, pas l'optimisation du blocage.**

## 4. Recommandations, sans jargon, par valeur pour l'utilisateur

Format : problème → effet pour l'utilisateur → ce qu'on fait. Les identifiants renvoient aux rapports détaillés.

### A. Réparer ce que voit le visiteur (rapide, le plus rentable)

1. **Montrer le blocage de l'étape 2** (UX-01, FS-01, QA-01, COP-07, PM-03). Le visiteur lit « Termine l'étape 1 pour débloquer », ce qu'il ne peut pas faire, puis « Tu peux valider l'étape », puis « Valider fait partie de Premium » : trois messages contradictoires, et il ne voit jamais l'aperçu ni le prix. → Laisser le visiteur ouvrir les étapes 2 et suivantes **en aperçu** (ce qu'on apprend, durée, texte du blocage validé en s16, bouton d'abonnement), sans ordre imposé pour lui ; textes de fin de quiz rendus vrais. Rien n'est ouvert ni retiré (choix du 05/10 respecté). *(Décision D1)*
2. **Arrêter les fausses récompenses** (FS-02, QA-02, COP-08, UX-05, UX-02). « Parcours terminé ! » s'affiche au milieu de 4 étapes ; le total d'XP annoncé oublie le bonus de fin ; la carte « Bravo » n'apparaît pas quand on termine vraiment (il faut recharger, revérifié dans le code : `progress/route.ts:159-196` renvoie la fiche sans la date de fin). → Corriger les trois, avec un test sur un parcours de 4 à 6 étapes.
3. **Remplacer la mauvaise vidéo** (COP-03, FS-03). Machine à Café, étape 3 : la carte annonce Djimo, la vidéo est une chronique Bitcoin de Thomas VDB. → Bon identifiant : `tpIOLzv11qo` (vérifié dans `videos-seed.json`).

### B. Savoir ce qui se passe (avant tout le reste)

4. **Compter chaque marche** (FS-06, QA-12, SEO-09, DA). Aujourd'hui on ne sait pas qui lit l'étape 1, qui fait le quiz, qui bloque, qui finit. → 6 événements (ouverture d'un parcours, d'une étape, quiz terminé, résultat d'orientation, parcours terminé, erreur), le blocage réellement vu par le visiteur compté, un bloc « Parcours » dans le rapport du lundi et 3 alertes dans l'e-mail quotidien unique (abonné sans démarrage à 3 jours, erreur de validation, suivi muet). Plan complet : `data-analyst.md` §5 à §7. Exclure les visites de test (liste des e-mails de test à fournir par Thomas).

### C. Faire revenir la semaine suivante

5. **Donner un rythme** (UX-03, PM-01). Les 13 étapes se font en une soirée, puis plus rien. → Rythme conseillé : « prochaine étape conseillée le … » affichée, rien de bloqué *(Décision D2)* ; « Reprendre ton parcours » en tête de l'accueil abonné et du profil ; rappel par e-mail **seulement sur demande**, jour choisi par la personne *(Décision D7, avis @legal)*.
6. **Rendre le compteur de jours d'affilée honnête** (UX-04, FS-05). Il compte les connexions, qui durent 30 jours, donc il reste à 1 (maximum observé : 1 sur 14 comptes). → Le faire monter quand on pratique (étape, quiz), ou le retirer des textes *(Décision D3)*. Recalculer aussi le niveau quand on valide une étape (FS-07).
7. **Une vraie fin et une vraie suite** (UX-06, PM-07). Confiance renvoie vers Machine à Café même si on l'a déjà fini. → Suite choisie selon ce qui reste à faire, lien vers le carnet ; petit bilan de fin (ce que tu as appris, ce que tu as essayé).

### D. Rendre le contenu digne d'un abonnement

8. **Réaligner les 3 étapes gratuites** (COP-01). Leur texte décrit un autre conseil que celui affiché (5 conseils remplacés en base le 30/09 sans réécrire les étapes). C'est la vitrine : à corriger en premier.
9. **Afficher les vannes de l'étape** (COP-02, FS-04, PM-04). La page Premium promet « ses vannes », l'étape montre un lien vers le catalogue général ; 3 vannes prévues n'existent pas. → Afficher les 5 vannes dans l'étape (vérifier qu'elles sont actives) ou retirer la promesse *(Décision D4)*.
10. **Des quiz qui apprennent** (COP-05). 70 % des bonnes réponses sont la 2e option, les mauvaises sont des caricatures, certaines questions portent sur des notions absentes. → Réécrire avec explication de la bonne réponse.
11. **Retour sur l'exercice** (PM-06). La « progression mesurable » se résume à des étapes cliquées. → 3 boutons après l'exercice (« pas encore essayé / essayé, bof / essayé, ça a marché »), qui nourrissent le bilan. Pas de certificat (aucune persona n'en veut, ça fait scolaire).
12. **Tenir les 15-20 min/semaine** (COP-04, FS-10). Confiance étape 6 impose un spectacle de 72 min. → Extrait ou passage minuté, sans toucher au chiffre (choix fondateur).
13. **Allonger l'offre** (COP-06, PM-02, PM-10). 13 étapes finies en un mois pour un paiement mensuel ; Sophie n'a que 3 étapes ; des conseils réunion, afterwork, coloc, séparation dorment dans le catalogue. → Parcours **Storytelling** d'abord (meilleure valeur pour les 3 personas), puis **Pro** ; réutiliser les conseils existants *(Décision D6)*.
> Toute réécriture (8, 10, 12, 13) passe d'abord par 3 à 5 étalons calibrés avec Thomas (règle P0 s8) *(Décision D5)*.

### E. Faire venir du monde

14. **Faire de l'étape 1 gratuite la porte d'entrée** (PM-09, SEO-06). → Chaque article renvoie vers l'étape 1 du bon parcours (pas vers la liste), les 332 fiches vannes, conseils et vidéos aussi ; le bouton secondaire de l'accueil propose « Lire gratuitement l'étape 1 » (UX-08).
15. **Corriger l'aperçu de partage et la structure** (SEO-02, SEO-05). L'aperçu sur les réseaux pointe vers l'accueil avec un titre générique ; pas de sous-titres ; vidéos et conseils cités sans lien. → Corrections rapides.
16. **Titres sans concurrence avec les articles** (SEO-03). → 4 titres proposés (`seo.md` §6), et « première étape gratuite », jamais « cours gratuit » *(Décision D8)*.

### F. Finitions techniques et accessibilité

17. Quiz corrigé par la couleur seule et sans annonce vocale ; nom vocal de l'en-tête d'étape différent du texte (QA-05, QA-06, UX-09).
18. Double validation simultanée qui compte l'XP deux fois ; limite d'essais en mémoire (inefficace sous Workers) ; chargement bloqué sans bouton « réessayer » ; niveaux « Comique » et « Légende » absents du code (plante à 1 500 XP) ; pas de page d'erreur dédiée ; 404 avec deux consignes robots contradictoires (FS-07 à FS-13, QA-08, QA-11).
19. Textes des conseils en base différents du fichier source : relancer l'import remettrait les anciens textes (FS-12, COP-09). → Réaligner le fichier sur la base.

## 5. Décisions à prendre ensemble

| # | Question | Reco des agents |
|---|---|---|
| D1 | Le visiteur peut-il ouvrir les étapes 2+ en **aperçu** (sans le contenu payant) pour voir ce qu'il achète ? | Oui (rien n'est ouvert ni retiré, choix du 05/10 respecté) |
| D2 | Rythme : **doux** (date conseillée affichée, rien bloqué) ou **1 étape débloquée par semaine** ? | Doux |
| D3 | Compteur de jours d'affilée : le rendre juste (pratique) ou le retirer des textes ? | Le rendre juste |
| D4 | Vannes de l'étape : les afficher dans l'étape ou retirer la promesse ? | Les afficher |
| D5 | Réécriture des textes, quiz et exercices des 13 étapes : calibrer 3 à 5 étalons ensemble d'abord | Oui, en commençant par les 3 étapes gratuites |
| D6 | Nouveaux parcours : Storytelling puis Pro ? | Oui (Storytelling 12/15 en valeur persona) |
| D7 | Rappel e-mail des parcours, uniquement sur demande ? | Oui |
| D8 | 4 nouveaux titres des pages parcours (`seo.md` §6) | À signer |
| — | Données : liste des e-mails de test à exclure ; confirmer que les 7 sessions du 07/10 sont tes tests ; accord pour une petite table de dates par étape (mesure du rythme) | — |

## 6. Ordre proposé (par dépendances)

1. **Lot 1, rapide, sans décision lourde** : A3 (vidéo), A2 (fausses récompenses, carte de fin), B4 (mesure + exclusion des tests), E15 (aperçu de partage, structure), F17 (accessibilité du quiz).
2. **Lot 2, après D1, D2, D3, D7** : A1 (aperçu des étapes 2+), C5 à C7 (rythme, reprendre, compteur, fin).
3. **Lot 3, après étalons (D5) et D4, D6** : D8 à D13 (contenu), puis Storytelling et Pro.
4. **Lot 4** : E14, E16 (porte d'entrée, titres signés), F18, F19.

## 7. Vérifié / non vérifié

- **Vérifié en prod** (visiteur, 1280 et 375 px) : pages, étape 1, quiz, vidéos (26 en ligne), blocage, liens d'entrée, 0 erreur console, aucune fuite de contenu payant. 123 tests Jest et 112 tests de bout en bout du repo passent.
- **Vérifié en base (lecture)** : 3 parcours actifs, 13 étapes identiques au fichier source, 1 progression, 0 fin, 14 comptes, streak max 1.
- **Non vérifié** : tout le côté abonné en prod (validation, XP, fin), faute de compte de test ; les constats A2 et F18 sont déduits du code. Mesures Core Web Vitals (quota PageSpeed épuisé), Search Console (pas de clé en session), lecteur d'écran réel.
- **Effets de bord de l'audit à connaître** : les tests de bout en bout du repo, lancés par @qa contre la prod, ont soumis 4 connexions sur un compte inexistant, 1 « mot de passe oublié » sur une adresse `@example.invalid` et 2 réinitialisations à faux jeton (aucun compte, abonnement ni e-mail créé ; quelques verrous temporaires auto-expirants en base). 10 pages vues de test sont parties vers Umami le 07/10 vers 13h43 UTC : à exclure des chiffres. À l'avenir, ces tests doivent tourner sur un environnement de test (déjà prévu au mémo s16).

## 8. Handoff

- **@fullstack** : lot 1 (A2, A3, B4 selon `data-analyst.md` §5, E15, F17), puis lots 2 et 4 après décisions. Pre-commit obligatoire.
- **@copywriter** : étalons des 3 étapes gratuites et des quiz (D5), textes du blocage visiteur (D1).
- **@product-manager** : spec Storytelling et Pro, rythme doux, retour d'exercice.
- **@data-analyst** : bloc du lundi et alertes une fois les événements en ligne.
- **@seo** : titres signés (D8), liens fiches → étape 1.
- **@qa** : environnement de test Premium pour rejouer A2 et F18 ; ne plus lancer la suite d'authentification contre la prod.
