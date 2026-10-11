# Itération 4, notation UX sur captures (@ux, s17, 07/10/2026)

Brief compris : noter /10 le rendu du tour 4 (`docs/qa/captures-parcours-apprentissage-s17/iter-4/`) et statuer sur UXV-3-01, UXV-3-02 et les preuves demandées. Textes validés et `[CHOIX UTILISATEUR]` non re-questionnés. Aucun fichier touché hors ce rapport, rien de commité.

Captures lues : échec de validation (375 pleine page et vue, 768 vue, 1280 vue), échec de chargement (arrivée 375, 768, 1280 ; « Réessayer » 375, 768, 1280), chargement 375, interrupteur au clavier (coché, jour), survols (option du quiz avec repos, en-tête d'étape avec repos, interrupteur avec repos), focus après valider 1280. Non relues : les captures déjà notées au tour 3 et inchangées.

## 1. Note globale : 9,9 / 10 (tour 3 : 9,7 ; tour 2 : 9,2 ; tour 1 : 7,0 ; audit initial : 4,2)

| Critère | T3 | T4 | Justification courte |
|---|---|---|---|
| Compréhension immédiate | 10 | 10 | Inchangé, rien à corriger |
| Continuité du chemin | 9,7 | 9,9 | `p-375-etape-echec-reessayer` et `p-375-etape-chargement` : barre « 1/4 étapes complétées » en haut de vue, étape 1 cochée, verrous cohérents. Retire 0,1 : à 768, arrivée par ancre, le message est caché sous l'en-tête (en correction) |
| Retour d'action | 9,5 | 10 | Échec de validation prouvé et lisible, annonce « +50 XP gagnés ! Prochaine étape conseillée le mercredi 14 octobre. Tu peux y aller dès maintenant si tu veux. » à l'écran (`p-1280-focus-apres-valider`) |
| Motivation à revenir | 10 | 10 | Inchangé |
| Mobile 375 | 9,8 | 10 | Échec de validation, échec de chargement et chargement tiennent dans une vue, cibles 44 px, aucun débordement |
| Accessibilité perçue | 9,6 | 9,8 | Focus gardé sur l'interrupteur après Espace et sur le sélecteur de jour (anneau violet). Retire 0,2 : survol absent sur l'en-tête d'étape et l'interrupteur (en correction) |
| Cohérence promesse / écran | 9,7 | 10 | « Ta progression est intacte » est dans la carte, la phrase de bilan est l'étalon 3.6 A |

Moyenne 9,96, arrondie vers le bas à 9,9 : deux preuves attendues (ancre 768, survols) ne sont pas encore à l'écran.

## 2. Statut des écarts et preuves

| ID | Statut | Capture / preuve |
|---|---|---|
| UXV-3-01 un seul « Réessayer » | RÉGLÉ | 375, 768, 1280 (`p-*-etape-echec-reessayer`) : un seul bouton, dans la carte de l'étape 2, sous « Ta progression est intacte. / Le contenu de l'étape n'a pas voulu se charger. ». Le haut garde une ligne neutre (« Tes étapes n'ont pas voulu se charger, le souci vient de chez nous. ») sans bouton. Barre « 1/4 » visible dans les trois vues |
| UXV-3-02 survol d'une option du quiz | RÉGLÉ | `p-1280-survol-option-quiz` : contour violet net sur B, face à `-repos` où A à D sont identiques. Le survol est visible sans zoom |
| UXV-2-04 phrase de fin du bilan | RÉGLÉ (Thomas) | Étalon 3.6 A, plus de question ouverte, aucune note retirée |
| UXV-2-06 point 3 échec de validation | RÉGLÉ, une réserve | `p-375-validation-echec-vue`, `p-768-…`, `p-1280-…` : « Quiz bouclé, tu peux valider l'étape », puis bloc rouge « La connexion a lâché en route. Vérifie ton réseau et réessaie. » (`error-text` sur fond teinté, lisible), puis « Valider cette étape » plein largeur. Message dans la carte, juste au-dessus du bouton, sans défilement. Réserve : les options du quiz sont plus haut hors vue, c'est la ligne « Quiz bouclé » qui prouve qu'il est gardé (suffisant : le bouton reste actif, rien à ressaisir) |
| Focus interrupteur et jour | RÉGLÉ | `p-1280-rappel-clavier-coche` : interrupteur allumé, anneau violet, « lundi » actif, « C'est noté. » ; `p-1280-rappel-clavier-jour` : « mardi », anneau sur le sélecteur |
| « Ta progression est intacte » dans la carte | RÉGLÉ | `p-375-etape-echec-arrivee` : message, phrase courte et « Réessayer » dans la carte, vue complète |

## 3. En correction en parallèle (non recomptés)

- Arrivée par ancre à 768 (`p-768-etape-echec-arrivee`) : la vue commence au milieu du bloc rouge, seul « Réessayer » est visible, le message est caché sous l'en-tête de 64 px. À 375 et 1280 c'est correct. Le bouton reste utilisable, donc pas de blocage, mais Yanis sur tablette presse « Réessayer » sans savoir pourquoi. Si le message passe bien sous l'en-tête (`p-768-etape-echec-arrivee-…`), ça suffit pour ce critère.
- Survol de l'en-tête d'étape (`p-1280-survol-entete-etape` identique à `-repos`) et de l'interrupteur (`p-1280-survol-rappel` identique à `-repos`, anneau de focus présent dans les deux) : aucun retour avant le clic sur desktop. Le chevron et l'interrupteur restent lisibles comme cliquables, donc aucun risque de compréhension ; suffit pour le 10 une fois visible.

## 4. Nouveaux écarts

Aucun bloquant, aucun nouveau. Seule observation, sans effet sur la note : le haut et la carte disent chacun « n'a pas voulu se charger » (progression, puis contenu). C'est cohérent, deux informations différentes.

## 5. Passage par persona (375 px)

- **Yanis Premium** : le réseau lâche à la validation, il lit le message, garde son quiz fait, rappuie sur « Valider ». Au chargement, il voit « 1/4 », son étape 1 cochée, un seul « Réessayer ».
- **Sophie** et **Marc** : inchangés depuis le tour 3, validés (bilan étalon, rappel grisé puis « C'est noté. »).
- **Yanis visiteur** : inchangé, validé.

## 6. Verdict

GO mise en ligne côté UX : aucun bloquant, aucun écart ouvert, 9,9 / 10. Pour le 10 plein : (1) capture 768 d'arrivée par ancre avec le message lisible ; (2) captures du survol visible sur l'en-tête d'étape et l'interrupteur, ou preuve que le survol existe. Rien d'autre.

Vérifié : captures listées en tête, à l'œil. Non vérifié : contrastes mesurés (estimation visuelle, rien sous 4,5:1), annonces vocales (relevé @qa repris), code.

Handoff : @fullstack et @qa (deux points de la section 6, noms de capture stables).
