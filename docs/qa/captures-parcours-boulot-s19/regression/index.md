# Non-régression des 4 parcours en ligne après 508cd96 (s19)

Objet : le commit 508cd96 modifie des composants communs (`parcours-detail.tsx`, `parcours-content.tsx`,
`parcours-step-card.tsx`, `step-blocks.tsx`, `parcours-preview.ts`, `fr-typo.ts`, `parcours-data.ts`).
Ces captures montrent le rendu des 4 parcours déjà en ligne (Machine à Café, Répartie, Confiance, Storytelling)
et du hub, pour relecture par @design et @ux.

## Conditions

- Instance LOCALE jetable : Postgres 16 sur 127.0.0.1:55433 (base `marrant_qa`, supprimée en sortie), app en
  env propre (`scripts/qa-parcours-s17/cleanenv.sh`), Chromium limité à localhost (Umami simulé).
- Build refait à HEAD (508cd96 + scripts QA) avec `BOULOT_PUBLIE = false`, l'état de la prod. Boulot importé
  INACTIF (404, absent du hub, du sitemap et de llms.txt). `STORYTELLING_PUBLIE` non touché (true).
- Commande : `scripts/qa-parcours-boulot-s19/captures.sh --regression` (étapes 1, 2, 3 puis captures
  `QA_REGRESSION=1` ; l'étape 4 qui force Boulot à true n'est pas jouée).
- Comptes : `comptes-regression.sh`. `qa-r2-<slug>-<largeur>` : Premium, étape 1 validée (étape 2, première
  Premium, ouverte). `qa-rfin-<slug>` : Premium, toutes les étapes validées.
- Captures « page » : pleine page. Captures « haut » : première fenêtre (812 px en 375, 900 px en 1280).
  Captures d'étape et de carte : découpe de l'élément, en-tête collant neutralisé.

## Bilan

**120 PASS, 0 FAIL, 52 captures.** Contrôles par parcours et par largeur : HTTP 200, titre H1, aucune erreur JS
(pageerror), étape 1 visiteur avec « Le conseil » et « Exercice pratique » remplis (plus de 20 caractères
chacun), étape 2 Premium avec ses 5 vannes et son quiz, carte de fin « terminé » avec XP et suite proposée, et
aucune chaîne « undefined », « null », « NaN » ou « [object Object] » visible (page, étape 1, étape 2, carte de
fin, hub). Hub : 200, les 4 parcours présents, Boulot absent.

## Captures

| Fichier | Parcours | Largeur | État | Ce qu'on doit y voir |
|---|---|---|---|---|
| hub-375-visiteur-haut.png | hub /parcours | 375 | visiteur | Titre, intro « 4 parcours », début du quiz d'orientation |
| hub-375-visiteur-page.png | hub /parcours | 375 | visiteur | 4 cartes (Machine à Café, Répartie, Confiance, Storytelling), pas de Boulot, FAQ |
| hub-1280-visiteur-haut.png | hub /parcours | 1280 | visiteur | Idem en desktop, quiz sur 3 colonnes |
| hub-1280-visiteur-page.png | hub /parcours | 1280 | visiteur | 4 cartes avec XP à gagner (325, 475, 800, 800), « Programme » replié |
| machine-a-cafe-375-visiteur-page-haut.png | Machine à Café | 375 | visiteur | H1, badge Débutant, 3 semaines, Pour qui, Léa, bandeau « Étape 1 offerte » |
| machine-a-cafe-375-visiteur-page.png | Machine à Café | 375 | visiteur | Page entière : étape 1 ouverte, étapes 2 et 3 « Fait partie de Premium », lien parcours suivant |
| machine-a-cafe-375-visiteur-etape1.png | Machine à Café | 375 | visiteur, étape 1 dépliée | « Des vannes courtes, faciles à ressortir » : conseil, exemple, défi FAUX SECRET, « Alors, ce défi ? », encart vannes Premium, 2 vidéos, quiz, « Voir l'offre Premium » |
| machine-a-cafe-375-premium-etape2.png | Machine à Café | 375 | Premium, étape 2 dépliée | « Sentir le bon moment » : conseil, défi, 5 vannes, vidéos, quiz |
| machine-a-cafe-375-premium-fin.png | Machine à Café | 375 | Premium, parcours fini | Haut de page avec carte de fin à la place du programme |
| machine-a-cafe-375-premium-fin-carte.png | Machine à Café | 375 | Premium, parcours fini | « terminé », 3 étapes, 325 XP bonus compris, acquis, « Passer au parcours Storytelling » |
| machine-a-cafe-1280-visiteur-page-haut.png | Machine à Café | 1280 | visiteur | Haut de page desktop |
| machine-a-cafe-1280-visiteur-page.png | Machine à Café | 1280 | visiteur | Page entière desktop, vidéos sur 2 colonnes |
| machine-a-cafe-1280-visiteur-etape1.png | Machine à Café | 1280 | visiteur, étape 1 dépliée | Comme en 375, boutons du défi en ligne |
| machine-a-cafe-1280-premium-etape2.png | Machine à Café | 1280 | Premium, étape 2 dépliée | « Sentir le bon moment » complète |
| machine-a-cafe-1280-premium-fin.png | Machine à Café | 1280 | Premium, parcours fini | Première fenêtre avec carte de fin |
| machine-a-cafe-1280-premium-fin-carte.png | Machine à Café | 1280 | Premium, parcours fini | Carte de fin desktop |
| repartie-375-visiteur-page-haut.png | Répartie | 375 | visiteur | H1, Débutant → Intermédiaire, 4 semaines, Tom, « étapes 2 à 4 avec Premium » |
| repartie-375-visiteur-page.png | Répartie | 375 | visiteur | Page entière, étapes 2 à 4 verrouillées |
| repartie-375-visiteur-etape1.png | Répartie | 375 | visiteur, étape 1 dépliée | « Tes premières répliques » : conseil, défi, encart vannes, vidéos, quiz |
| repartie-375-premium-etape2.png | Répartie | 375 | Premium, étape 2 dépliée | « Le rythme et les silences » : 5 vannes, 2 vidéos, quiz, « Termine le quiz pour valider » |
| repartie-375-premium-fin.png | Répartie | 375 | Premium, parcours fini | Haut de page avec carte de fin |
| repartie-375-premium-fin-carte.png | Répartie | 375 | Premium, parcours fini | 4 étapes, 475 XP, suite Storytelling (classement s18, Boulot inactif sauté) |
| repartie-1280-visiteur-page-haut.png | Répartie | 1280 | visiteur | Haut de page desktop |
| repartie-1280-visiteur-page.png | Répartie | 1280 | visiteur | Page entière desktop |
| repartie-1280-visiteur-etape1.png | Répartie | 1280 | visiteur, étape 1 dépliée | Étape 1 complète desktop |
| repartie-1280-premium-etape2.png | Répartie | 1280 | Premium, étape 2 dépliée | Étape 2 complète desktop |
| repartie-1280-premium-fin.png | Répartie | 1280 | Premium, parcours fini | Première fenêtre avec carte de fin |
| repartie-1280-premium-fin-carte.png | Répartie | 1280 | Premium, parcours fini | Carte de fin desktop |
| confiance-375-visiteur-page-haut.png | Confiance | 375 | visiteur | H1, 6 semaines, Julien, « étapes 2 à 6 avec Premium » |
| confiance-375-visiteur-page.png | Confiance | 375 | visiteur | Page entière, étapes 2 à 6 verrouillées |
| confiance-375-visiteur-etape1.png | Confiance | 375 | visiteur, étape 1 dépliée | « Redécouvrir ce qui te fait rire » : conseil, exemple, défi RÈGLE NON ÉCRITE, vidéos, quiz |
| confiance-375-premium-etape2.png | Confiance | 375 | Premium, étape 2 dépliée | « Rire de toi sans te rabaisser » complète |
| confiance-375-premium-fin.png | Confiance | 375 | Premium, parcours fini | Haut de page avec carte de fin |
| confiance-375-premium-fin-carte.png | Confiance | 375 | Premium, parcours fini | 6 étapes, 800 XP, suite Storytelling |
| confiance-1280-visiteur-page-haut.png | Confiance | 1280 | visiteur | Haut de page desktop |
| confiance-1280-visiteur-page.png | Confiance | 1280 | visiteur | Page entière desktop |
| confiance-1280-visiteur-etape1.png | Confiance | 1280 | visiteur, étape 1 dépliée | Étape 1 complète desktop, miniatures Frayssinet et Croce |
| confiance-1280-premium-etape2.png | Confiance | 1280 | Premium, étape 2 dépliée | Étape 2 complète desktop |
| confiance-1280-premium-fin.png | Confiance | 1280 | Premium, parcours fini | Première fenêtre avec carte de fin |
| confiance-1280-premium-fin-carte.png | Confiance | 1280 | Premium, parcours fini | Carte de fin desktop |
| storytelling-375-visiteur-page-haut.png | Storytelling | 375 | visiteur | H1, 📖, 6 semaines, Samir |
| storytelling-375-visiteur-page.png | Storytelling | 375 | visiteur | Page entière, étapes 2 à 6 verrouillées |
| storytelling-375-visiteur-etape1.png | Storytelling | 375 | visiteur, étape 1 dépliée | « Ton anecdote, coupée au plus court » : exemple Avant / Après, défi COUPE, vidéos, quiz |
| storytelling-375-premium-etape2.png | Storytelling | 375 | Premium, étape 2 dépliée | « Des personnages qu'on entend » : défi PERSONNAGE EN DUO, 5 vannes, 2 vidéos, quiz |
| storytelling-375-premium-fin.png | Storytelling | 375 | Premium, parcours fini | Haut de page avec carte de fin |
| storytelling-375-premium-fin-carte.png | Storytelling | 375 | Premium, parcours fini | 6 étapes, 800 XP, phrase du parcours conseillé, « Passer au parcours Machine à Café » |
| storytelling-1280-visiteur-page-haut.png | Storytelling | 1280 | visiteur | Haut de page desktop |
| storytelling-1280-visiteur-page.png | Storytelling | 1280 | visiteur | Page entière desktop |
| storytelling-1280-visiteur-etape1.png | Storytelling | 1280 | visiteur, étape 1 dépliée | Étape 1 complète desktop (Pascot, Ngijol) |
| storytelling-1280-premium-etape2.png | Storytelling | 1280 | Premium, étape 2 dépliée | Étape 2 complète desktop |
| storytelling-1280-premium-fin.png | Storytelling | 1280 | Premium, parcours fini | Première fenêtre avec carte de fin |
| storytelling-1280-premium-fin-carte.png | Storytelling | 1280 | Premium, parcours fini | Carte de fin desktop |

## Défauts et remarques vus à la relecture (non corrigés)

Aucun défaut de rendu bloquant : pas de bloc vide, pas de texte cassé, pas de débordement vu sur les captures
relues (hub 375 et 1280, les 4 étapes 1, étapes 2 Répartie et Storytelling en 375, les 4 cartes de fin).

1. **Hub, texte d'intro qui oublie Storytelling (antérieur à 508cd96).** `hub-375-visiteur-haut.png`,
   `hub-1280-visiteur-page.png` : « 4 parcours pour progresser en humour, chacun taillé pour une situation : la
   machine à café, la répartie et la confiance. » Trois situations pour quatre parcours. Source :
   `apps/web/src/app/(dashboard)/parcours/(liste)/page.tsx` l. 68, fichier non modifié par 508cd96.
2. **« étapes 2 à 3 » sur Machine à Café (antérieur à 508cd96, mineur).** `machine-a-cafe-375-visiteur-page-haut.png`,
   `machine-a-cafe-1280-visiteur-page.png` : bandeau « Étape 1 offerte, étapes 2 à 3 avec Premium ». Pour deux
   étapes, « étapes 2 et 3 » se lit mieux. Source : `apps/web/src/config/textes/parcours.ts` l. 31, figé par un
   test (`parcours-user-simulation.test.tsx` l. 510).
3. **Artefact de capture, pas un défaut du site.** `confiance-375-visiteur-page.png` (et les autres pleines pages
   en 375) : les miniatures vidéo apparaissent grises avec le seul bouton lecture. Elles sont chargées en différé
   et la pleine page est prise sans défilement. Les captures d'étape (`*-visiteur-etape1.png`) les montrent bien.
4. **À confirmer par @ux (comportement voulu, spec s17 §5.5 et s18).** Les cartes de fin de Machine à Café,
   Répartie et Confiance proposent toutes Storytelling (premier du classement `nextParcoursRanking` une fois
   Boulot inactif sauté), avec l'accroche persona de Storytelling. Celle de Storytelling propose Machine à Café
   avec la phrase du parcours conseillé.

Journaux du passage : dossier de travail de la session (non versionné), `captures-regression.txt`.
