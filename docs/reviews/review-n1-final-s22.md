# Relecture à l'aveugle finale : lettre du mois n°1 (jeudi 05/11/2026), candidate (a)

> Texte jugé : premier bloc de `docs/copy/n1-candidates-s22.md` (l. 23-71), tel qu'il est. Les relectures précédentes n'ont pas été lues.
> Lecteur type : 20 à 30 ans, introverti, reste muet quand on le chambre. Ton : `docs/copy/ton-alex.md`. Barre : 9/10.

## Verdict

**Note : 8,7/10. NO-GO en l'état.** Deux bloquants, tous les deux en une ligne et sans rien toucher aux répliques. Avec ces deux retouches, la lettre passe à 9,1 et elle est GO, à condition de repasser cette relecture (règle d'or).

À la lecture du jeudi matin, la lettre tient. La scène se voit tout de suite et elle est juste pour ce persona : le silence que quelqu'un remarque à voix haute. La joueuse est la meilleure réplique : la chute « Je repasse lundi » dit en plus que tu ne parleras pas avant lundi, ce qui en fait une deuxième chute. L'erreur (s'expliquer) touche juste, et « Une sûre dite tout de suite vaut mieux qu'une risquée dite trop tard » est une phrase qui reste en tête. Deux phrases cassent la lecture d'un éditeur : une incohérence de calendrier dans la scène et la phrase qui mène à l'article.

## Bloquants

**B1. « Samedi soir » et « raconte son week-end » ne vont pas ensemble (l. 32).**
Le samedi soir, le week-end est à moitié passé, et on est en train de le vivre ensemble dans ce salon. On raconte son week-end le lundi, pas au milieu. L'incohérence porte sur le jour de la semaine, alors que tout le reste de la lettre est réglé sur le samedi : la pluie, et les objets trouvés fermés le dimanche, d'où « Je repasse lundi ». La scène se passe le 07/11, au retour des vacances de la Toussaint (en-tête du fichier, l. 5), donc des vacances racontées pendant vingt minutes sont vraies et donnent une image plus drôle.
- Avant : « Hugo, qui raconte son week-end depuis vingt minutes, a fini par le remarquer : »
- Après : « Hugo, qui raconte ses vacances depuis vingt minutes, a fini par le remarquer : »

**B2. La phrase qui mène à l'article est fausse à la lettre et maladroite (l. 59).**
1. Dans « avant qu'un Hugo le remarque », le seul nom que « le » peut reprendre est « un mot ». Lu tel quel, ça veut dire « avant qu'un Hugo remarque le mot », soit l'inverse de ce qu'on veut dire.
2. « 7 techniques [...] en donne sept » répète le chiffre du titre, et « en » ne renvoie à rien dans la phrase.
3. Le contenu annoncé est vrai, il faut juste le dire précisément. La Technique 1 de l'article (`apps/web/src/lib/blog-articles.ts:3668-3670`) donne « trois phrases d'entrée passe-partout » avec le verbe « garde en poche ». Il ne faut pas écrire « commence par » : l'article s'ouvre sur « 3 mécanismes psychologiques » (l. 3646), pas sur les phrases d'entrée.
- Avant : « Et pour placer un mot avant qu'un Hugo le remarque, notre article « Rester muet en groupe : 7 techniques pour reprendre la parole » en donne sept, dont des phrases d'entrée à garder en poche. Il est en lecture libre. »
- Après : « Et pour placer un mot avant qu'un Hugo remarque ton silence, notre article « Rester muet en groupe : 7 techniques pour reprendre la parole » propose, dès sa première technique, trois phrases d'entrée à garder en poche. Il est en lecture libre. »

## Contrôles demandés

| Point | Verdict | Preuve |
|---|---|---|
| Nombre de personnes | OK | « Vous êtes huit » puis « Sept visages » (les sept autres, Hugo compris) |
| Jours de la semaine | **FAIL** (B1) | « Samedi soir » contre « raconte son week-end » ; « Je repasse lundi » est juste (samedi après 18 h, fermé le dimanche) |
| Chaque commentaire décrit sa réplique | OK | sûre : « elle reste au chaud » ; joueuse : heure de fermeture, pause avant « Je repasse lundi » ; risquée : seule à viser Hugo. La scène montre déjà Hugo qui parle beaucoup, et la condition « le sait, et rit quand c'est lui qu'on chambre » garde son utilité |
| Répliques drôles et dicibles d'un trait | OK | sûre : douce, comme il faut pour une sûre ; joueuse « objets trouvés » : au niveau, se comprend sans mode d'emploi, et « J'ai essayé » ne marque pas le genre (contrairement à « Je suis passé ») ; risquée : « J'ai pris ma journée » se comprend tout de suite |
| Règle de choix et erreur | OK (mineur 2) | la progression toi, ailleurs, l'autre tient ; « S'expliquer » est préparé dès l'intro (« aucune ne s'explique ») |
| Exercice faisable | OK (mineur 1) | deux piques, six phrases, la sûre dite à voix haute deux fois |
| Lien d'article | OK sur le fond, **FAIL** sur la phrase (B2) | slug `rester-muet-en-groupe` présent (`blog-articles.ts:3634`), titre identique (l. 3635), 7 techniques (l. 3668-3720), trois phrases d'entrée à garder en poche (l. 3670) |
| Lien d'étape | OK | `parcours-etapes.ts:27` : Répartie, 3e titre « Retourner les piques avec le sourire » ; ancre `etape-${step.order}` (`parcours-step-card.tsx:206`) |
| Lettre complète sans le PS | OK | l'étape, puis « À bientôt, », la lettre se termine normalement |
| PS vrai | OK (mineur 3) | 1,99 € (`premium.ts:32`) ; lettre chaque jeudi, incluse et envoyée d'office (`lettre-hebdo-s21.ts:158`) ; cinq parcours (`parcours-publication.ts:12,25`) ; carnet et catalogue (`premium.ts:8-10`) ; résiliable en ligne (`paiement.ts:119`) ; étape 1 lisible sans compte (`parcours-content.tsx:234`) |
| Rien de commercial hors du PS | OK | prix et `/abonnement` seulement entre les marqueurs ; « en lecture libre » est une information, pas un argument de vente |
| Objet ≤ 45 caractères | OK | 29 caractères |
| Zéro tiret cadratin | OK | aucun tiret cadratin ni demi-cadratin dans l'objet, le pré-en-tête ou le corps |

## Mineurs (non bloquants)

1. **Exercice contre modèles (l. 57).** « une phrase chacune », alors que les trois répliques données en exemple font deux phrases chacune et que l'intro annonce « Aucune ne dure plus de deux phrases ». Retouche : « une ou deux phrases chacune ».
2. **Règle de choix (l. 51).** « Regarde vers qui ta phrase pointe » puis « la joueuse t'emmène ailleurs » : « vers qui » appelle une personne et « ailleurs » est un lieu. Et une phrase qui « t'emmène » ne « s'éloigne » pas de toi, alors que c'est ce que dit la phrase suivante. Retouche : « Regarde où ta phrase pointe : la sûre reste sur toi, la joueuse part ailleurs, la risquée vise l'autre. »
3. **PS, « une lettre comme celle-ci chaque jeudi » (l. 66).** C'est vrai sur le rythme et l'accès. Mais toutes les lettres réservées n'ont pas cette forme : W47 annonce « Cette semaine, pas de réplique prête à l'emploi » (`apps/web/src/data/lettre/hebdo-premium.json:14`). Retouche possible : « une lettre de ce genre chaque jeudi ». Simple précision, aucune phrase n'est fausse.

---
**Handoff → @orchestrator**
- Fichier produit : `docs/reviews/review-n1-final-s22.md` (aucun autre fichier modifié, rien commité)
- Décision : 8,7/10, NO-GO. B1 (l. 32) et B2 (l. 59) à appliquer mot pour mot par @copywriter, puis nouvelle relecture à l'aveugle de la version corrigée avant l'envoi du 05/11
- Points d'attention : ne pas toucher aux trois répliques ; la signature et le lien d'étape sans mention « réservée » n'ont pas été rouverts (choix du fondateur)
---

## Confirmation (relecture de la version corrigée)

> Texte relu d'un bout à l'autre : `docs/copy/n1-candidates-s22.md` l. 23-71, après correction. Signature et lien d'étape sans mention « réservée » non rouverts (choix du fondateur).

**Note : 9,1/10. GO. Aucun bloquant.**

### Les corrections

| Correction | Appliquée | Juste | Défaut introduit |
|---|---|---|---|
| B1 « raconte ses vacances » (l. 32) | oui, mot pour mot | oui : le samedi tient avec tout le reste, et « vingt minutes » reste sous la « demi-heure » de silence | aucun. Bonus : la risquée « J'ai pris ma journée » répond maintenant aux vacances de Hugo, l'écho renforce la chute |
| B2 pont vers l'article (l. 59) | oui, mot pour mot | oui : « ton silence » lève l'ambiguïté du « le », le chiffre n'est plus répété | aucun. Contenu vérifié : Technique 1 (`blog-articles.ts:3668-3674`) donne bien trois phrases d'entrée numérotées, avec « garde en poche » (l. 3670) ; « dès sa première technique » est exact |
| Mineur 1 « une ou deux phrases chacune » (l. 57) | oui | oui : l'exercice colle aux modèles et à l'intro | aucun (la répétition « Pour chacune [...] chacune » existait déjà, voir R1) |
| Mineur 2 « Regarde où ta phrase pointe [...] part ailleurs » (l. 51) | oui | oui : « où » va avec « ailleurs », « part » va avec « s'éloigne » de la phrase suivante | aucun |
| Mineur 3 « une lettre de ce genre chaque jeudi » (l. 66) | oui | oui : couvre W47 et ses semblables | aucun |

### Contrôles de la lettre entière

| Point | Verdict | Preuve |
|---|---|---|
| Cohérence interne | OK | huit personnes, sept visages ; samedi, pluie, objets trouvés fermés le dimanche d'où « lundi » ; vacances de Hugo vingt minutes dans une demi-heure de silence |
| Répliques dicibles d'un trait | OK | 10, 15 et 9 mots, chacune en deux phrases courtes, aucune ne s'explique |
| Règle et erreur justes | OK | toi, ailleurs, l'autre ; « s'expliquer » préparé par l'intro et rattaché à la sûre (« même mollement ») |
| Exercice faisable | OK | deux piques, six phrases, la sûre dite deux fois à voix haute, seul |
| Article | OK | slug `rester-muet-en-groupe` (`blog-articles.ts:3634`), titre identique (l. 3635), trois phrases d'entrée en Technique 1 |
| Lien d'étape | OK | `parcours-etapes.ts:27`, 3e titre « Retourner les piques avec le sourire » ; ancre `etape-${step.order}` (`parcours-step-card.tsx:206`) ; Répartie est un parcours de base, sans interrupteur de publication |
| PS vrai | OK | 1,99 € (`premium.ts:32`) ; le reste inchangé depuis la relecture précédente et déjà prouvé |
| Rien de commercial hors PS | OK | prix et `/abonnement` seulement entre les marqueurs |
| Zéro tiret cadratin | OK | Grep `[—–]` sur tout le fichier : aucune occurrence |

### Retouches facultatives (non bloquantes, aucune n'empêche l'envoi)

Aucune n'est nécessaire au 9/10. Si l'une est appliquée, la version modifiée repasse une relecture à l'aveugle (règle d'or) : le plus simple est d'envoyer en l'état.
- **R1 (l. 57)**, « chacune » deux fois dans la phrase. Avant : « écris une version sûre, une joueuse et une risquée, une ou deux phrases chacune. » Après : « écris une version sûre, une joueuse et une risquée, en une ou deux phrases. »
- **R2 (l. 44)**, « Elle demande » suit « c'est elle qui fait sourire » (l'heure de fermeture), le lecteur rétablit tout seul. Avant : « Elle demande une seconde de pause » Après : « Dis-la avec une seconde de pause » (et « et un visage qui ne bouge pas » reste tel quel).
- **R3 (l. 40)**, « dans ce salon » puis « la moitié du salon » à une phrase d'écart. Après possible : « quand tu connais mal la moitié des gens ».
- **R4 (l. 66)**, « Répondre en une phrase » alors que les modèles font deux phrases ; lu comme « répondre court », ça passe.

### Note interne (hors lettre)
`n1-candidates-s22.md` l. 75 décrit encore la retouche (2) comme « la joueuse t'emmène ailleurs », et l. 3 la note « 8,8/10 » : notes de travail périmées, sans effet sur l'envoi, à mettre à jour par @copywriter au passage dans `numeros.json`.

---
**Handoff → @orchestrator**
- Fichier modifié : `docs/reviews/review-n1-final-s22.md` (section Confirmation ajoutée ; aucun autre fichier touché, rien commité)
- Décision : 9,1/10, GO pour l'envoi du jeudi 05/11/2026 de la candidate (a) en l'état
- Points d'attention : R1 à R4 facultatives (si appliquées, nouvelle relecture à l'aveugle) ; si (a) part, retirer la réservée W46 de `lettre/hebdo-premium.json` comme prévu
---
