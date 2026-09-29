# Rapport — réécriture des fiches vidéo (s11, passe finale) — 29/09/2026

Périmètre : les 89 fiches de `docs/content/videos-seed.json`.
Livrable : `docs/copy/contenus-s11/videos.jsonl` (une ligne par fiche : `id`, `motif`, `description`, `technique`, `learnings`, `exercise`).
Méthode : `_brief.md` (inventaire exhaustif, réécriture réelle, barres §3 et §5 de la charte).
Intouchables respectés : `id`, `youtubeId`, `title`, `channelName`, `duration`, `category`, `difficulty` absents du JSONL (donc non modifiés). Le champ `technique` est repris tel quel (vérifié pour 82 à 89 ; pour 1 à 81, les 89 valeurs restent dans la taxonomie du seed, mais je ne les ai pas recomparées une à une). Aucun chiffre retiré ni modifié. Le seed n'a pas été touché : l'intégration reste à faire.

## 1. Inventaire synthétique (89/89)

**Verdict : 89 RÉÉCRIRE, 0 GARDER.** Aucune fiche ne passait la barre telle quelle. Même les meilleures descriptions avaient des learnings mal étiquetés ou un exercice sans exemple.

| Défaut relevé (dans le champ `motif`) | Fiches concernées | Traitement |
|---|---|---|
| Learnings génériques, avec des étiquettes interchangeables qui ne correspondent pas à leur contenu (séries ŒIL NEUF/SPÉCIFICITÉ/CONTRASTE/ANCRAGE, REBOND/REDIRECTION/RETOURNEMENT/NEUTRALITÉ, DÉTAIL/ESCALADE/PERSONNAGE/TWIST, RETOURNEMENT/VULNÉRABILITÉ/ASSOMPTION/EXAGÉRATION DE SOI, PAUSE/RYTHME/SILENCE/CALLBACK) | 31 à 89 (en bloc), et ponctuellement 17, 26 | Chaque learning renommé d'après ce qu'il enseigne vraiment, puis réécrit en consigne actionnable |
| Learnings incomplets (« que… ») ou sans technique (carrière, diffusion, viralité, « codes YouTube », généralisation sur l'humour d'un pays) | 34, 38, 42, 43, 48, 53, 55, 56, 60, 62, 66, 71, 72, 73, 75, 76, 77, 80, 81, 84, 86, 89 | Remplacés par une technique observable annoncée par le titre ou la fiche |
| Contenu précis du sketch affirmé sans pouvoir le vérifier (répliques, passages, scènes) | 3, 4, 5, 9, 10, 16, 18, 21, 23, 24, 27, 29, 30, 31, 36, 57 | Retiré. On ne garde que la technique annoncée par le titre et la fiche |
| Exemple de vanne faible : déjà connu ailleurs, sans retournement ou calembour | 6, 9, 11, 12, 15, 20, 22, 24, 28, 41, 49, 56, 65, 82 | Remplacé par un exemple original qui passe la barre §3 |
| Mention d'IA | 6 | Supprimée (exemple et liste de sujets) |
| Risque de viser un groupe (ethnie, genre, nationalité, opposition de groupes) | 7, 12, 21, 61, 67, 71, 76, 77, 88 | Recadré sur un comportement ou une situation vécue ; garde-fou ajouté en 21 |
| CAPITALES d'insistance | 3, 4, 8, 9, 11, 13, 14, 18, 19, 20, 21, 25, 27, 29, 30, 36, 39, 48, 54, 55, 61, 65, 67, 76, 78, 79, 80, 84, 87 | Supprimées. Seules les étiquettes `TECHNIQUE DE… :` et `DÉFI… :` restent en capitales (format de la fiche) |
| Jargon, anglicismes, hyperboles (« masterclass », « craft », « buildup », « deadpan », « viral », « hilarant », « révolutionné ») | 7, 17, 19, 25, 48, 49, 50, 53, 55, 66, 68, 70, 73, 74, 75, 77, 79, 80, 81, 84, 85, 88 | Reformulés dans la voix du pote drôle |
| Exercice mal étiqueté, hors sujet, sans exemple ou sans critère de réussite | la grande majorité (voir chaque `motif`) | Étiquette alignée sur la technique, exemple concret et critère ajoutés quand ils manquaient |
| Staccato, ton scolaire (« Mémorise »), clichés de chute | 1, 14, 25, 47, 78, 82, 83, 87, 89 | Phrases fluides, « ressortir » plutôt que « mémoriser » |

## 2. Les 5 meilleurs avant / après

**Fiche 6 — Anne Roumanoff (exercice)**
- Avant : « Prends le premier sujet sérieux (inflation, IA, climat). […] Ex : 'L'inflation, c'est quand ton kebab coûte le prix d'un restaurant.' »
- Après : « …prends le premier sujet sérieux (inflation, logement, climat). […] Par exemple : « Mon banquier m'a conseillé de diversifier. J'ai maintenant deux découverts. » »
- Pourquoi : l'IA disparaît, et un constat sans chute devient un vrai retournement (le conseil financier appliqué à la dette).

**Fiche 82 — Lilia Benchabane (exercice)**
- Avant : « 'T'es toujours célibataire ?' → 'Oui, par choix. Pas le mien, mais par choix quand même.' Mémorise ta meilleure. »
- Après : « « T'es encore en retard. » → « Oui, mais toujours du même quart d'heure. Tu peux régler ta montre sur moi. » Garde la meilleure en poche : la prochaine fois qu'on te chambre, elle sera prête. »
- Pourquoi : on remplace une blague qui circule depuis longtemps par une réplique originale qui applique la technique annoncée (accepter, puis retourner). « Mémorise » disparaît aussi.

**Fiche 83 — Fanny Ruwet (exercice)**
- Avant : « Pour chacune, écris la version 'et j'ai raison' avec un argument absurde mais logique. » (sans exemple)
- Après : « …par exemple : « Je n'ai pas de CDI. Je préfère qu'on regrette mon départ plutôt que ma présence. » »
- Pourquoi : la consigne abstraite devient un modèle réutilisable, avec une chute plus courte que son setup.

**Fiche 87 — Quentin Ratieuville (exercice)**
- Avant : « …mais UNIQUEMENT en mode comique. Règle : tu as le droit de rire de ce que tu as RESSENTI, pas de minimiser ce qui s'est passé. »
- Après : « Règle : tu peux rire de ce que tu as ressenti, jamais minimiser ce qui s'est passé. Par exemple, pas « c'était rien », mais « j'ai passé la soirée à rassurer ceux qui venaient me rassurer ». »
- Pourquoi : les capitales disparaissent, et l'exemple fait comprendre la frontière entre rire de sa réaction et minimiser les faits.

**Fiche 86 — Karim Duval (learning et exercice)**
- Avant : « TECHNIQUE DU CONTRASTE : que l'humour 'vie pro' est un terrain sous-exploité en stand-up français »
- Après : « TECHNIQUE DU SÉRIEUX TOTAL : emploie le jargon avec la conviction d'un vrai manager. Au moindre clin d'œil, la parodie tombe ; si tu y crois, c'est la logique du jargon qui devient ridicule. » L'exercice gagne aussi un exemple : « Pour les courses de samedi, j'ai revu le périmètre : les chips passent en V2. »
- Pourquoi : une affirmation invérifiable et sans technique devient une consigne de jeu applicable dès aujourd'hui.

## 3. Points signalés (Thomas tranche)

**Chiffres douteux, conservés tels quels :**
- 85 (Blanche Gardin) : « un numéro de 15 minutes » pour une vidéo de 8 min 45 (`PT8M45S`).
- 19 : « 8 minutes » pour une vidéo de 5 min, et « million de vues » à vérifier.
- 75 : « 10 vannes en 5 minutes » pour une vidéo de 2 min 30.
- 87 (Quentin Ratieuville) : « 800 000 spectateurs sur YouTube », invérifiable. S'il s'agit de vues, il faudrait écrire « vues ».
- 38 : « million de vues en quelques jours » ; 58 : « 50 ans d'expérience » ; 18 : « 50% » ; 74 : « 90% » ; 13 : « 200 ans ».
- 6 et 88 : « 100% » (du public, du personnage). C'est une hyperbole, gardée par règle.
- Années et durées gardées : 41 « 30 ans », 57 « 1997 », 76 « 2017 », 34 « 45 minutes ».

**Faits biographiques sensibles :**
- 52 : « viré de France Inter » a été adouci dans la formulation, sans retrait. À vérifier.
- 82 et 87 : le handicap est mentionné comme dans la fiche d'origine (« albinos et malvoyante », « son handicap »). Rien n'a été ajouté.

**Descriptions qui restent déclaratives (reprises de la fiche d'origine, non vérifiables sans visionnage) :** 83 (« liste méthodiquement… »), 84 (« un rendez-vous coquin qui dérape »), 88 (« joue les deux rôles »). Elles restent au niveau de la technique annoncée, sans aucune réplique inventée.

**Hors périmètre, à traiter :**
- Intégration du JSONL dans `docs/content/videos-seed.json` puis dans la base (seed). Aucun fichier de code ni de seed n'a été modifié.
- Le champ `technique` reste inchangé sur les 89 fiches, alors qu'il est parfois plus pauvre que les learnings (ex. « Observation » en 86, où le vrai sujet est le transfert de vocabulaire). À faire évoluer seulement si la taxonomie le permet.
- Anti-doublon : les exemples ajoutés en 82 à 89 ont été vérifiés contre `docs/copy/catalogue-s11/lot-1.jsonl` (pas de recoupement). La vérification contre le blog n'a pas été refaite pour ce lot.
