# Relecture UX à l'aveugle, s25 navigation v6, tour 6, groupe « parcours »

Périmètre : /parcours et /parcours/repartie, comptes visiteur, gratuit, en-cours, nouvel. Captures : `docs/captures/s25/v6-tour-6/parcours/` (40 images ouvertes : 375, 768, 1280, 1920 des quatre comptes pour /parcours et /parcours/repartie, plus les 1280 de chaque compte ; 1456 identique à 1280 d'après l'INDEX, hauteurs égales).
Lu : brief v6, project-context (Identité, Cible, Positionnement), nav v6, étalon accueil (375, 1280), tailwind.config.ts, cta-forme-place-s21 §1.3. Code consulté pour vérifier les cibles et la logique d'affichage : `parcours-content.tsx`, `parcours-detail.tsx`, `sommaire-parcours.tsx`, `lignes-fiches.tsx`, `parcours-espace.tsx`, `button.tsx`.

Limite de preuve : les pleines pages à 375 (5 800 à 7 700 px de haut) sont réduites à 100-130 px de large à l'ouverture ; j'y juge la structure (ordre, empilement, une colonne, absence de débordement), pas le détail typographique. Le détail 375 est vérifié par le code (classes citées plus bas).

## 1. Ce que je vois

/parcours visiteur et gratuit (identiques, sauf la ligne frontière) : H1 centré, sous-titre centré, quiz d'orientation en colonne centrée de 768, puis 5 cartes `rounded-xl` à filet violet, grille 2 colonnes dès 1024, cinq cartes dont la dernière centrée à la largeur d'une jumelle (1280 et 1920 : même mise en page, coque plafonnée). Chaque carte : badges, titre, accroche violette, description, témoignage en italique, « Programme » replié, un plein « Tester l'étape 1 de X, gratuite », ligne « Sans compte. La suite : Premium. » (visiteur) ou « La suite : Premium. » (gratuit : bonne adaptation). Puis « Explore aussi » (3 cartes dont Abonnement 1,99 €/mois), FAQ. Conforme à cta-forme-place §1.3 (B15) : un plein par carte, jamais deux par carte, aucun Premium sur la carte.

/parcours en-cours : H1 « Parcours », carte « Tes 4 premières semaines » avec l'étape à reprendre et un plein « Reprendre », carte « Ton cap », puis « Les parcours » : Machine à Café (2/3, barre, plein « Continuer ce parcours »), Répartie (2/4, contour), trois autres en contour « Commencer ce parcours », quiz d'orientation SOUS la liste, « Explore aussi » (2 cartes, sans Abonnement : juste), FAQ.
/parcours nouvel : même ossature, carte « Étape conseillée : Répartie » avec plein « Commencer l'étape 1 », « Ton cap 1 sur 5 », Répartie en plein, les quatre autres en contour.

/parcours/repartie visiteur et gratuit : fil d'Ariane, ⚡, H1, badges, intro centrée, « Pour qui ? », témoignage, bande « Étape 1 gratuite, la suite avec Premium », « Le programme », étape 1 ouverte (pourquoi, ce que tu vas apprendre, conseil, exemple, exercice, retour d'exercice, vannes, 2 vidéos, quiz), plein unique « Passer à l'étape 2 · 1,99 €/mois » avec « D'abord ton compte, puis le paiement. » (visiteur seulement) et la garantie, trois étapes verrouillées repliées, lien « parcours suivant ». Le visiteur a un seul plein de contenu, le gratuit aussi : « Passer à l'étape 2 » n'a pas la ligne de compte (juste).
/parcours/repartie en-cours : carte sommaire (2 sur 4, « Fait », « Voir », un plein « Reprendre » sur l'étape 3), programme avec étapes faites repliées et étape 3 ouverte (sous-liste 3.1 à 3.5), argumentaire APRÈS le programme (décision s19, non discutée), pas de bloc Premium. nouvel : « 0 sur 4 étapes », un plein « Commencer », étape 1 ouverte avec sous-liste 1.1 à 1.5, quiz et bouton désactivé « Termine le quiz pour valider cette étape » (état expliqué, jamais une page morte).

## 2. Cognitive walkthrough (first-time user, Yanis)

| Étape | Sait-il quoi faire ? | Verdict |
|---|---|---|
| Visiteur arrive sur /parcours | H1 + 5 cartes + un bouton « gratuite » par carte, quiz en haut pour qui hésite | OK |
| Choisit Répartie | « Tester l'étape 1 de Répartie, gratuite » + « Sans compte. La suite : Premium. » dit ce qui est gratuit et ce qui ne l'est pas | OK |
| Lit l'étape 1 | contenu complet visible, quiz en fin | OK |
| Veut valider | plein Premium avec prix et garantie à côté, ligne « D'abord ton compte, puis le paiement. » | OK |
| Nouvel abonné arrive | carte « Étape conseillée » + plein unique, étapes 2 à 4 repliées, quiz désactivé avec raison | OK |
| Abonné en cours (375) | le plein « Reprendre » est sous le premier écran (voir piste P1) | friction légère |

## 3. Audit heuristique Nielsen (sur les deux flux critiques : choisir un parcours, reprendre un parcours)

| H | Verdict | Évidence |
|---|---|---|
| 1 Visibilité de l'état | PASS | « 2 sur 4 étapes », barres 2/3 et 2/4, « Fait », chip Parcours allumé |
| 2 Vocabulaire du persona | PASS | « Tester l'étape 1 », « Sans compte », tutoiement |
| 3 Contrôle | PASS | Programme repliable, étapes repliables, lien parcours suivant |
| 4 Cohérence | PASS | un plein par carte, contours pour le reste, même gabarit entre comptes |
| 5 Prévention d'erreurs | PASS | bouton de validation désactivé avec sa raison |
| 6 Reconnaissance | PASS | sous-liste numérotée 3.1 à 3.5 avec « Voir » |
| 7 Raccourcis | PASS | « Reprendre » direct, ancres `#etape-N` |
| 8 Minimalisme | PASS avec réserve | P2 (XP dit deux fois sur les cartes en cours) |
| 9 Messages d'erreur | non capturé | pas d'état d'erreur dans les captures |
| 10 Aide contextuelle | PASS | « Pourquoi cette étape ? », frontière gratuit/Premium sous le bouton |

## 4. Notes

### Design
| Critère | Note | Justification |
|---|---|---|
| 1 Fidélité à l'accueil | 9 | Hero centré, titres de section centrés, cartes `rounded-xl` à filet violet : conforme. Réserve : les cartes d'étape de la page détail n'ont pas de filet (la bande « Étape 1 gratuite » et le sommaire en ont un) : lecture de deux familles de cartes sur une page. Piste P3, non bloquante. |
| 2 Hiérarchie et lisibilité | 9 | Un plein par écran sur la page détail, titres clairs. Réserve : dans l'étape ouverte, les paragraphes de prose (« Ce que tu vas apprendre », « Le conseil ») s'arrêtent à environ 85 % de la largeur des encarts voisins (« Pourquoi cette étape », quiz) et laissent un dernier mot seul (« phrase suffit. » sur Répartie), 1280 et 1920 (`visiteur-parcours-repartie-1280.png`). Piste P4. |
| 3 Mise en page aux 5 largeurs | 10 | 1280, 1456, 1920 identiques (coque plafonnée, comme l'accueil et la nav v6), aucun vide à droite, aucune colonne collée à gauche, aucun débordement à 375/768. Dernière carte centrée à largeur de jumelle : décision tour 4. |
| 4 Cohérence avec l'espace | 9 | Rythme, titres centrés, cartes alignés sur Aujourd'hui et l'accueil. Réserve : P2. |
| 5 Finition au pixel | 9 | Cibles vérifiées au code : « Programme » `min-h-[44px]`, boutons `size="lg"` `min-h-12`, sommaire `min-h-11`, « Voir » des fiches `min-h-11`, liens du fil d'Ariane `max-md:py-3.5`. Contrastes AA (violet `accent-link` #A78BFA, `text-muted` #9A9A9A sur #1F1F1F). Réserve : P2 et P5. |

### UX
| Critère | Note | Justification |
|---|---|---|
| 1 Compréhension | 10 | Où je suis (chip allumé, H1, fil d'Ariane) et quoi faire (un bouton par carte, un plein par étape) lisibles en 3 secondes sur les quatre comptes. |
| 2 Action principale unique | 9 | Visiteur, gratuit, nouvel : une seule. En cours : « Reprendre » (carte semaines) et « Continuer ce parcours » (carte Machine à Café) sont deux pleins vers la même cible, et à 375 le premier est sous le pli (P1, P6). |
| 3 États vides et nouvel abonné | 10 | Nouvel : étape conseillée, « Ton cap 1 sur 5 », « 0 sur 4 », « Commencer », quiz désactivé avec phrase d'explication. Aucune page morte. |
| 4 Aperçu Premium non abonné | 10 | /parcours EST l'aperçu (nav v6 §2) : contenu réel, étape 1 en entier, une seule offre (plein « Passer à l'étape 2 » avec prix, garantie, ligne de compte), aucun mur ni fenêtre. |
| 5 Accessibilité et cohérence entre comptes | 10 | Même gabarit des quatre comptes, ligne frontière adaptée au gratuit, sommaire avec statut en texte (« Fait » + coche, pas la couleur seule), listes et `aria-label` présents au code. |

**Globale (minimum) : 9/10. Aucune faute dure.**

## 5. Pistes (ne retiennent pas la note)

- **P1** (UX2, en-cours 375) : « Reprendre » est environ à 890 px du haut de `en-cours-parcours-375.png` (estimation sur vignette réduite), donc sous le premier écran (812 moins 114 de bande). Cause : la carte « Tes 4 premières semaines » s'ouvre avec ses 4 lignes avant l'étape à reprendre. Correction codable : `components/espace/quatre-semaines.tsx`, placer le bloc « Étape en cours + Reprendre » avant la liste des 4 semaines, ou replier la liste quand une étape est en cours. Ferait 10 : le plein visible au premier écran à 375.
- **P2** (Design 4/5, en-cours) : « 325 XP à gagner » apparaît deux fois sur la carte Machine à Café (rangée de badges, puis sous la barre ; `en-cours-parcours-1280.png`), idem Répartie (475). Code : `parcours-content.tsx` ligne 344 et ligne 371 ; supprimer la ligne 371 (`<p className="mt-2 text-right text-xs ...">`) ou ne montrer l'XP qu'une fois.
- **P3** : cartes d'étape sans filet violet sur la page détail, alors que le sommaire et la bande d'état en ont. Subjectif, conforme à l'accordéon voulu ; laisser sauf si Thomas veut l'unité complète.
- **P4** : `ParcoursStepCard` (`components/parcours/parcours-step-card.tsx`) : élargir la mesure de la prose à la largeur de l'encart (retirer le `max-w` de mesure) ou poser `text-pretty` pour éviter le dernier mot seul. Aucun texte modifié.
- **P5** : `parcours-content.tsx` ligne 127-132 : résultat du quiz d'orientation, `Button size="sm"` = `h-8` (32 px) dès 768 (`max-md:h-11` ne couvre que sous 768). Non visible sur les captures (état après réponse), AA 2.5.8 respecté, convention du projet pour `sm`. Passer en `size="md"` avec `min-h-11` si Thomas veut 44 px partout.
- **P6** : en-cours, quiz d'orientation « Quel parcours est fait pour toi ? » sous la liste, utile à un abonné qui a déjà deux parcours entamés ? Bruit léger ; décision s17 (UXV-2-05) documentée, je ne la discute pas.
- **P7** : visiteur et gratuit, bloc « Vannes à pratiquer / 5 vannes dans cette étape » sans action ni lien : encart sans geste. Toute proposition de texte est à valider par Thomas (ex. lien vers les vannes gratuites) : non retenu.
- **P8** : le plein « Passer à l'étape 2 » est affiché dès l'arrivée, avant que le quiz soit fait (la carte « Étape 2 » n'arrive qu'après le quiz, `parcours-detail.tsx` `carteFinEtape1`). Cohérent avec « valider fait partie de Premium », donc pas une faute.

## 6. Hors périmètre signalé

Bande des rubriques : à 375 elle montre « Aujourd'hui / Parcours / Quoi répondre » (+ début de la suivante), « Parcours » allumé avec cadenas pour visiteur et gratuit, sans cadenas pour les abonnés. Rien ne la casse dans ma section.

## 7. Verdict

NOTE GLOBALE : 9/10. Barre de validation (9 sans faute dure) atteinte. Fautes dures : aucune.

---
**Handoff → @orchestrator (puis @fullstack si les pistes sont retenues)**
- Fichier : `/home/user/Marrant/docs/ux/relectures/s25-v6-tour-6-parcours.md`
- Pistes codables : P1 `components/espace/quatre-semaines.tsx`, P2 `components/parcours/parcours-content.tsx`, P4 `components/parcours/parcours-step-card.tsx`, P5 `parcours-content.tsx`.
- Point d'attention : détail 375 jugé sur le code, les pleines pages 375 sont trop réduites pour une lecture typographique.
---
