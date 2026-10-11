# Rendu itération 1 : notation visuelle @design, Parcours Boulot (s19, 11/10/2026)

Base : `docs/qa/captures-parcours-boulot-s19/` (index lu). Rendu réel lu sur 28 captures des 75 : 375 (hub, carte hub, page visiteur haut et pleine, étape 1 visiteur, aperçus 3 et 6, page Premium haut et pleine, étapes 1 à 6 Premium, fin de parcours et carte), 768 (aperçu 4, étape 5, carte de fin), 1280 (hub, carte hub, page visiteur haut, étape 1 visiteur et Premium, étape 6, fin de parcours). Non lues : les variantes 768/1280 des aperçus 2 à 6 et des étapes 2 à 4, qui n'ont pas d'état différent de leur version 375. Aucun outil de recadrage ici : les captures très longues ont été lues réduites (texte de 14 px lisible seulement sur les 768/1280 et les captures d'élément 343 px de large).

Référence : notation s18 Storytelling (`docs/marrant/parcours-storytelling-s18/iterations/rendu-iter-1-design.md`, 9,3/10) et captures `docs/qa/captures-parcours-storytelling-s18/`. Composants lus : `parcours-detail.tsx`, `parcours-step-card.tsx`, `step-blocks.tsx`, `path-completion-card.tsx`, `parcours-content.tsx`, `parcours-data.ts`, `parcours-preview.ts`. Textes validés non jugés, non réécrits.

## Note : 8,6 / 10

| Critère | Note | Pourquoi (rendu vu) |
|---|---|---|
| Hiérarchie | 9 | Titre, accroche violette, étape 1 ouverte : lisible en plissant les yeux. Une seule offre pleine par vue chez le visiteur, « Valider » neutralisé tant que le quiz n'est pas fait (Premium). Retrait : étape 1 visiteur amputée de ses blocs centraux (B1) |
| Lisibilité mobile 375 | 8,5 | Aucun débordement, cibles 44 px, quiz et vannes propres. Retraits : défis de 900 à 2 200 caractères en 14 px / interligne 20 px (N2), aperçus 2 à 6 en 14 px quand l'étape 1 est en 16 px (N4) |
| Rythme des blocs | 9 | Scène, conseil, exemple, défi, retour, vannes (encadré violet), vidéos (après un filet), quiz (après un filet) : l'enchaînement est le même que Storytelling et se lit. Retrait : exemple de l'étape 6 en 4 lignes serrées (N3) |
| Sauts de ligne (`whitespace-pre-line`) | 9,5 | Le saut de paragraphe de la scène (« Un seul test pour toute la suite… ») est rendu partout (étape ouverte, aperçu verrouillé), 1 ligne blanche, jamais deux. Exemples à lignes multiples (étapes 1, 5, 6) rendus ligne à ligne. À prouver : la 3e occurrence (« Programme » du hub) n'est capturée nulle part (B2) |
| Typographie française | 8,5 | Dans les étapes : `9 h 50`, `12 h 52`, `17 h 30`, `« … »` collés, aucun guillemet orphelin vu. Hors étapes (description, « Pour qui ? », témoignage de la page et de la carte hub) : « En 6 / semaines », guillemet ouvrant en fin de ligne, « À » seul en fin de ligne (N1) |
| Cohérence avec les autres parcours | 9,5 | Mêmes composants : kicker violet, XP, pastille « Lecture libre » / « Fait partie de Premium », cadenas, encart « Étape 1 offerte… », cartes de hub identiques. Corrections s18 (CTA de fin sur une ligne, `text-balance`, vidéo seule en horizontal dès `sm`, coche « Étape validée ») bien présentes. Aucune valeur hors système vue |
| Carte du hub | 9 | Badge, durée, XP (700 = 600 + 100 de bonus, cohérent avec la fin), accroche, persona, « Programme » replié, un seul CTA : même gabarit que les 4 autres. Retrait : N1 |
| État verrouillé des aperçus | 9 | Cadenas, XP, pastille Premium, scène, format, texte du verrou, un seul bouton plein + prix : propre à 375 et 768, aucun contenu payant. Retrait : N4 |
| Fin de parcours | 9,5 à 10 | Pastille, titre, sous-titre équilibré sur 2 lignes, XP, 6 acquis, phrase d'orientation, CTA « Passer au parcours Storytelling » sur une seule ligne à 375, 768 et 1280, aucun orphelin. Meilleur que Storytelling s18 |

Note globale : **8,6/10**, plafonnée par le bloquant B1 (écart entre ce que l'index annonce et ce que la capture montre) et par la preuve manquante B2. B1 et B2 résolus et prouvés : 9,4. Avec N1 : 9,6. Avec N2 à N4 : 10.

## Icône retenue : 💼 (U+1F4BC), confirmée

Les 4 autres : ☕ (Machine à Café), ⚡ (Répartie), 🌱 (Confiance), 📖 (Storytelling) : chacun un objet unique, coloré, lisible à 40 px sur fond sombre (vérifié sur le hub 1280 et 375).

Raisons :
- **Lecture immédiate** : le hub se parcourt en balayant les icônes. « Boulot » est le seul nom de parcours qui se dit en un objet universel : la mallette. C'est le critère qui compte à côté d'un titre déjà explicite.
- **Distinct des 4 autres** : silhouette rectangulaire horizontale, aucune forme commune avec la tasse, l'éclair, la pousse ou le livre. Teinte brune proche de ☕ mais formes et tailles de détail différentes, aucune confusion possible quand les deux cartes sont à 2 écrans d'écart.
- **Rendu vérifié** : bien centré à côté du titre, aux 3 devices, hub et page de parcours, pas de pixel flou.
- **Technique** : même famille que 📖 (au-dessus de U+1F000, présentation emoji par défaut), donc aucun traitement `withEmojiPresentation` particulier à ajouter. À confirmer au build par le test existant sur les icônes.
- **Marque** : « Corporate » est un des 3 mots qui ne définissent PAS la marque. La mallette est la plus « bureau » des options, mais elle désigne ici le lieu (le boulot), pas un ton : l'accroche, les vannes et la scène d'Anouk portent déjà le registre « pote ». L'emoji coloré reste ludique, pas un pictogramme noir.

Écartées : 🥂 (toast : 1 étape sur 6, et alcool en icône de parcours, ça réduit le contenu au pot), 🎤 (promesse stand-up et scène : l'inverse de « sans risque au boulot », et c'est le registre de Répartie), 🖨️ (gag d'une seule vanne), 📎 (gris métal, contraste faible sur fond noir), 🗂️ et 📊 (corporate, aucune chaleur), 🪑 (trop ambigu seul).

Action : aucun changement de caractère. Retirer seulement les mentions `[PROVISOIRE]` : `docs/content/parcours-boulot-s19.json` (`_meta.icone`), `scripts/content/boulot-s19-extraire.py` (la source de ce champ), `docs/marrant/parcours-boulot-s19/import-boulot.md` §1 et `implementation.md` point 4. Si Thomas préfère s'éloigner de « corporate » : repli 🥂, mais la perte de sens est plus grave que le gain de ton.

## Corrections

### Bloquantes

**B1. Étape 1 visiteur sans « Le conseil », « Exemple concret », « Exercice pratique », « Alors, ce défi ? »** (`visiteur-375-etape1.png`, `visiteur-375-page.png`, `visiteur-1280-etape1.png`, confirmé aussi au 1280 pleine page)
- Constat : chez le visiteur, l'étape 1 passe de la scène (« Ce que tu vas apprendre ») directement à « Vannes à pratiquer ». Le même écran en Premium (`premium-375-etape1.png`, `premium-1280-etape1.png`) a les 4 blocs. L'index annonce pourtant : « Étape 1 dépliée, en lecture libre : pourquoi, scène, conseil, exemple, défi TRACE et retour d'exercice ». Storytelling visiteur (`visiteur-375-etape1.png` s18) les montre. Conséquences : la ligne « Format : Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz » promet ce que l'écran ne montre pas, le quiz « Tu as choisi ta trace… » renvoie à un conseil que le visiteur n'a pas lu, et l'étape « offerte » est justement celle qui doit convaincre.
- Cause très probable, lue dans le code : la page visiteur est le HTML ISR (le visiteur ne refait jamais d'appel API). Ici il est construit par le repli seed : `buildPathFromSeed` (`apps/web/src/lib/parcours-data.ts` l. 147-160) met `tip.content = moduleDetail` (donc masqué par la règle T28 de `parcours-step-card.tsx` l. 300), `example: ""`, `exercise: ""`. Indices concordants : pas de lien « Lire la fiche du conseil » (id `seed-tip-1`), alors que les liens vidéo (lus en base) sont présents. Le repli est pris quand `findActivePath` ne trouve pas le parcours actif au moment du rendu : exactement le cas du build suivant l'interrupteur (parcours créé inactif, activé seulement au démarrage de l'appli). Risque en production : au premier déploiement `BOULOT_PUBLIE = true`, la page préconstruite peut rester en repli jusqu'à la première régénération (`revalidate = 3600`). Les étapes 1 et 6 ont `id: null` (conseils créés au démarrage), donc ce repli est le seul filet.
- Correction proposée (fichier `apps/web/src/lib/parcours-data.ts`) : dans `buildPathFromSeed`, pour le slug `boulot`, alimenter `tip` depuis `BOULOT_IMPORT.conseils` (exporté par `parcours-seed.ts`, entrée dont `etape === i + 1`) : `content`, `example`, `exercise` du conseil validé, au lieu de `moduleDetail` / `""`. Même logique pour tout parcours dont le seed porte ses conseils. Aucun texte nouveau : lecture du JSON existant.
- Preuve attendue : (1) dire quelle des deux causes est la bonne (ouvrir la page locale et lire l'identifiant du parcours : `seed-boulot` = repli) ; (2) recapturer `visiteur-375-etape1`, `visiteur-768-etape1`, `visiteur-1280-etape1` avec « Le conseil », « Exemple concret », « Exercice pratique », « Alors, ce défi ? » visibles, et le bouton « Voir l'offre Premium » en bas. Si la cause est seulement l'ordre des opérations de capture (page préconstruite avant l'activation), recapturer après régénération de la page et le noter dans l'index, mais garder la correction du repli (sans elle le risque de la première heure subsiste).
- Si la correction ne passe pas : écrire dans `REPLIT_ACTIONS.md` d'attendre la régénération (≤ 1 h) avant d'annoncer le parcours.

**B2. « Programme » déplié du hub jamais capturé** (index : « Programme » replié dans toutes les captures hub)
- Constat : le correctif s19 touche 3 rendus du `moduleDetail` (`implementation.md` point 7). Deux sont capturés (étape ouverte, aperçu verrouillé). Le troisième, le bloc « Programme » de la carte du hub (`parcours-content.tsx` l. 337-339 : `whitespace-pre-line` + `frTypo`), n'apparaît dans aucune image. Il porte les 6 scènes de 700 à 950 caractères, avec le saut de paragraphe, dans des cartes imbriquées de 375 px. Je ne note pas un état que je n'ai pas vu.
- Correction : ajouter à `scripts/qa-parcours-boulot-s19/captures.js` `visiteur-<w>-hub-programme-boulot.png` (clic sur le `summary` de la carte Boulot, capture de la carte dépliée, 375 / 768 / 1280), puis relire. Attendu : badge « Semaine N », titre, `Format :`, `+N XP`, scène sans débordement horizontal, 1 ligne blanche avant « Un seul test… ». Si l'image montre un défaut, il sera listé en itération 2.

### Non bloquantes (nécessaires pour le 10)

**N1. Typographie française de la description, de « Pour qui ? » et du témoignage (page et carte hub)** (`visiteur-375-page-haut.png`, `visiteur-375-hub-carte-boulot.png`, `premium-375-page-haut.png`)
- Constat à 375 : « En 6 / semaines » coupé entre le chiffre et le nom ; « … lui demander : « / Redis-moi celle de ce matin… » avec le guillemet ouvrant seul en fin de ligne ; « À / midi » et « passée à / autre chose » (mot d'une lettre en fin de ligne). À 1280 la coupe tombe bien, c'est donc un défaut mobile.
- Cause : `frTypo` n'est appliqué qu'aux étapes et au « Programme » (slug `boulot`), pas à `path.description`, `path.personaTagline`, `path.testimonial`.
- Correction : `apps/web/src/components/parcours/parcours-detail.tsx` (bloc `argumentaire`, l. 484-495) : `const typo = (t: string) => (slug === "boulot" ? frTypo(stripEmDashes(t)) : stripEmDashes(t));` appliqué à `path.description` et `path.testimonial` (et `frTypo(path.personaTagline)` pour boulot). `apps/web/src/components/parcours/parcours-content.tsx` l. 285-295 : même chose pour `p.persona`, `p.description`, `p.testimonial` quand `p.slug === "boulot"`. `frTypo` lie déjà « 6 semaines », « 9 h », et rattache le guillemet ouvrant au mot suivant. Les mots d'une lettre (« à », « À ») ne sont pas couverts par `frTypo` : ajouter `text-pretty` aux deux `<p>` si la version de Tailwind du projet le gère (à vérifier dans `apps/web/package.json`), sinon laisser. Étendre ensuite à Storytelling le jour où Thomas le valide (les captures s18 n'ont pas montré le défaut, il n'a pas été cherché).
- Preuve attendue : recapture `visiteur-375-page-haut` et `visiteur-375-hub-carte-boulot` : « En 6 semaines » insécable, « « Redis-moi… » jamais coupé après le guillemet.

**N2. Défis longs en 14 px / interligne 20 px, mot-clé « DÉFI X : » noyé** (`premium-375-etape6.png`, `premium-375-etape2.png`, `premium-1280-etape6.png`, `premium-375-etape1.png`)
- Constat : l'étape 6 a un défi d'environ 2 200 caractères, soit une quarantaine de lignes à 375 dans un seul encadré, avec l'interligne serré (`text-sm`, 20 px) alors que le conseil au-dessus est en 28 px. Étape 2 : 1 100 caractères. Le mot-clé « DÉFI SOIXANTE SECONDES : » est de la même couleur et du même poids que le reste, donc l'objet du bloc n'est pas repérable. Texte : longueur à signaler à @copywriter, rien à toucher ici.
- Correction (`apps/web/src/components/parcours/parcours-step-card.tsx`, l. 323, uniquement quand `typoFr`, Storytelling et Boulot, pour rester cohérent entre eux) : (a) `leading-6` à la place de l'interligne par défaut ; (b) mettre en `font-semibold text-text-primary` le libellé initial : `const m = prose(defi).match(/^(DÉFI [^:]{1,40}?)(\s:[\s\S]*)$/)` puis `<><strong className="font-semibold text-text-primary">{m[1]}</strong>{m[2]}</>`, texte inchangé caractère pour caractère. (c) laisser le reste. Ne rien changer pour les 3 parcours antérieurs.
- Preuve attendue : recapture `premium-375-etape6`, `premium-1280-etape1`.

**N3. Exemple de l'étape 6 : 4 lignes étiquetées indiscernables** (`premium-375-etape6.png`, `premium-1280-etape6.png`)
- Constat : « Sincère (83 mots…) : », « Humour (16 mots…) : », « Fermeture (8 mots…) : », « Total : … » sont rendus en `pre-line` serré, en italique 14 px, sans respiration entre les lignes. Les étapes 1 et 5 ont aussi un exemple à plusieurs lignes (dialogue) dans le même cas.
- Correction (`parcours-step-card.tsx` l. 311-315, uniquement `typoFr`) : remplacer le `whitespace-pre-line` unique par une ligne par paragraphe : `prose(step.tip.example).split("\n").map((l, i) => <p key={i} className={i > 0 ? "mt-1.5" : undefined}>{l}</p>)` dans le même cadre `rounded-lg bg-background-elevated p-3 text-sm italic`. Pas d'étiquette mise en gras par motif (trop fragile : « Salle du deuxième, 14 h. Trace relevée : » ferait un faux libellé).
- Preuve attendue : recapture `premium-375-etape6`.

**N4. Aperçus 2 à 6 : corps de la scène en 14 px alors que la même scène est en 16 px à l'étape 1** (`visiteur-375-page.png`, `visiteur-375-etape3-apercu.png`, `visiteur-375-etape6-apercu.png`)
- Constat : les scènes de Boulot font 700 à 950 caractères. Dans l'aperçu (carte dans la carte, `step-blocks.tsx` l. 40 : `text-sm`, interligne 20 px) c'est un bloc dense de 14 lignes, alors que l'étape 1 juste au-dessus, même type de texte, est en 16 px / 28 px. Sur la page visiteur à 375 on lit donc deux tailles pour la même sorte de contenu.
- Correction : `step-blocks.tsx` l. 40, remplacer `text-sm` par `text-sm leading-6 sm:leading-6` au minimum ; option plus nette : réutiliser les classes de `CORPS_LECTURE` (`text-base leading-7 sm:text-[15px]`). Effet de bord : touche aussi les aperçus des 4 autres parcours, uniquement plus aéré. Si Thomas ne veut pas toucher les parcours en ligne, conditionner à `slug === "boulot" || slug === "storytelling"`.
- Preuve attendue : recapture `visiteur-375-etape3-apercu` et `visiteur-375-etape6-apercu`.

### Constaté, hors périmètre, non compté

- Texte, signalé sans réécriture : la phrase « Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait… » revient dans les 6 scènes ; en lecture linéaire à 375 c'est un refrain. À confirmer par @copywriter que c'est voulu. Défis très longs aux étapes 2 et 6 (voir N2).
- Hérité des autres parcours : « 700 XP au total, dont 100 de bonus à la dernière étape » aligné à droite sur 2 lignes à 375 (`premium-375-page-haut.png`) ; bandeau « Parcours terminé ! » au-dessus de la carte « Parcours Boulot terminé » (deux « terminé » superposés) ; liens « Voir la fiche » d'environ 44 px mais d'allure fine à 375 (cible respectée).
- Déjà au dossier : quiz d'orientation qui n'oriente pas vers Boulot (index point 2) ; durée absente des aperçus (RC8, décision @product-manager) ; vidéos à visionner par une personne avant feu vert.
- Contrôle de capture : les images d'élément sont découpées de la pleine page (index point 4), le bouton « Voir l'offre Premium » des aperçus 2, 3 et 6 est bien visible sur `visiteur-375-etape3-apercu.png` et `visiteur-375-etape6-apercu.png`.

## Pour le 10

1. B1 : corriger `buildPathFromSeed` (ou prouver la cause), recapturer les 3 étapes 1 visiteur.
2. B2 : capturer et relire le « Programme » déplié du hub (3 largeurs).
3. N1 : `frTypo` sur description, accroche et témoignage (page et hub) pour `boulot`, recapturer 2 vues 375.
4. N2, N3, N4 : trois modifications de style localisées, 4 recaptures 375.
5. Icône : 💼 retenue, retirer les `[PROVISOIRE]`.
6. Consigner dans `REPLIT_ACTIONS.md` : fichiers `parcours-data.ts`, `parcours-detail.tsx`, `parcours-content.tsx`, `parcours-step-card.tsx`, `step-blocks.tsx`.

---
**Handoff → @orchestrator (puis @fullstack pour les corrections)**
- Fichier produit : `/home/user/Marrant/docs/marrant/parcours-boulot-s19/iterations/rendu-iter-1-design.md`
- Décisions : note 8,6/10, 2 bloquants (B1 étape 1 visiteur sans conseil/exemple/défi, B2 « Programme » déplié non capturé), 4 non bloquants (N1 à N4), icône 💼 confirmée (repli 🥂)
- Points d'attention : aucun token modifié ; modifs `parcours-data.ts`, `parcours-detail.tsx`, `parcours-content.tsx`, `parcours-step-card.tsx`, `step-blocks.tsx` ; recapturer 375 / 768 / 1280 les vues citées ; aucun texte validé touché ; N2, N3, N4 conditionnés à `typoFr` pour ne pas modifier les 3 parcours en ligne
---
