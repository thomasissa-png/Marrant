# Revue du contenu seed — session 11 (29/09/2026)

> Mission C3 — Refonte copy complète des 3 fichiers seed : `conseils-seed.json`, `videos-seed.json`, `parcours-seed.json`.
> Référence : `docs/copy/charte-refonte-copy-s11.md`. Étalons validés §2.

---

## 1. Statistiques générales

| Fichier | Entrées totales | Modifiées | Nature principale des modifications |
|---|---|---|---|
| `conseils-seed.json` | 65 | 25+ | Vouvoiement, "blague" → "vanne", caps bugs, titre id 6 |
| `videos-seed.json` | 89 | 60+ | Descriptions (formule scolaire), noms minuscules, "blague" → "vanne", caps bugs |
| `parcours-seed.json` | 13 étapes | 13 | Suppression noms personas internes (Sophie/Yanis/Marc) |

---

## 2. Avant/après : conseils-seed.json

### Exemple 1 — Correction vouvoiement + vocabulaire (id 1)

**AVANT**
> exercise : "DÉFI ANALYSE VIDÉO : regardez comment les 3 humoristes que vous regardez le plus construisent leurs vannes…"

**APRÈS**
> exercise : "DÉFI ANALYSE VIDÉO : regarde comment les 3 humoristes que tu regardes le plus construisent leurs vannes…"

Correction : tutoiement, "blague" → "vanne".

---

### Exemple 2 — Vocabulaire brand + majuscules (id 54)

**AVANT**
> exercise : "aRSENAL DE POCHE : …mémoriser 3 blagues courtes…"

**APRÈS**
> exercise : "ARSENAL DE POCHE : …ressortir 3 vannes courtes…"

Correction : caps bug "aRSENAL", "mémoriser" → "ressortir", "blague" → "vanne".

---

### Exemple 3 — Titre + previousTitle (id 6)

**AVANT**
> title : "Le callback : faire revenir une blague au bon moment"

**APRÈS**
> title : "Le callback : faire revenir une vanne au bon moment"
> previousTitle : "Le callback : faire revenir une blague au bon moment"

`previousTitle` ajouté pour la migration des favoris et parcours.

---

## 3. Avant/après : videos-seed.json

### Exemple 1 — Suppression formule scolaire (id 4, Élodie Poux)

**AVANT**
> "Regarde pour apprendre la TECHNIQUE DE L'ETHNOLOGUE. Élodie Poux observe l'école maternelle comme une anthropologue étudierait une tribu — avec distance et faux sérieux. Elle montre comment transformer un lieu familier en terrain d'observation comique."

**APRÈS**
> "Élodie Poux observe l'école maternelle comme une anthropologue étudierait une tribu — avec distance et faux sérieux. Résultat : chaque détail (le pipi de sieste, la guerre pour le scooter) devient comique. Sa technique : prendre du recul sur ce qu'on connaît trop bien pour encore le voir."

Gain : suppression de la formule scolaire "Regarde pour apprendre la TECHNIQUE DU X" (présente sur les ids 4-30), remplacement par une description qui met l'humoriste au centre et donne envie de regarder.

---

### Exemple 2 — Nom minuscule dans les learnings (id 38, François Guédon)

**AVANT**
> "TECHNIQUE DE L'ENGAGEMENT TOTAL : français Guédon montre que les jeunes talents peuvent percer en osant des sujets que les installés évitent"

**APRÈS**
> "TECHNIQUE DE L'ENGAGEMENT TOTAL : François Guédon montre que les jeunes talents peuvent percer en osant des sujets que les installés évitent"

28 corrections de ce type sur les ids 38-85. Cause probable : génération automatique avec bug de capitalisation.

---

### Exemple 3 — Description avec valeur pédagogique ajoutée (id 25, Jason Brokerss)

**AVANT**
> "Regarde pour apprendre la TECHNIQUE DE LA PAUSE MILLIMÉTRÉE. Jason Brokerss place ses pauses avec une précision chirurgicale — chaque silence a une fonction (suspense, impact, respiration). Ce sketch montre que le timing n'est pas du talent inné mais une mécanique apprenante."

**APRÈS**
> "Jason Brokerss place ses pauses avec une précision chirurgicale — chaque silence a une fonction. Suspense, impact, respiration. Sa thèse : le timing n'est pas du talent inné, c'est une mécanique qui s'apprend. Ce sketch te permet d'observer comment il utilise le silence comme un instrument."

Gain : même information, ton plus proche du pote (fragments courts, "te permet"), sans la formule scolaire.

---

## 4. Avant/après : parcours-seed.json

### Exemple 1 — Persona interne supprimé (parcours machine-a-cafe, étape 1)

**AVANT**
> why : "Le terrain de jeu de Sophie : la pause café"

**APRÈS**
> why : "Ton terrain de jeu : la pause café"

Persona "Sophie" jamais visible par les utilisateurs — le "why" s'adresse directement à l'utilisateur.

---

### Exemple 2 — Persona interne supprimé (parcours repartie, étape 2)

**AVANT**
> why : "Yanis a tendance à combler les silences par panique. Ce conseil lui apprend à utiliser le silence comme outil comique plutôt que comme ennemi à fuir."

**APRÈS**
> why : "Tu as tendance à combler les silences par réflexe. Ce conseil t'apprend à utiliser le silence comme outil comique plutôt que comme ennemi à fuir."

13 corrections de ce type. Toutes les références à Sophie, Yanis, Marc dans les champs `why` ont été remplacées par "Tu/ton/tes".

---

### Exemple 3 — Persona interne + scolaire (parcours confiance, étape 6)

**AVANT**
> why : "Le sommet du parcours : Marc identifie ce qui marche pour LUI, crée son répertoire personnel et ancre ses nouvelles habitudes. Il repart avec son propre style."

**APRÈS**
> why : "Le sommet du parcours : identifier ce qui marche pour TOI, créer ton répertoire personnel et ancrer tes nouvelles habitudes. Tu repars avec ton propre style."

---

## 5. Points signalés (conservés en l'état — décision Thomas)

### [SIGNALEMENT 1] — "La blague à tiroirs" (conseil id 39)

Le titre "La blague à tiroirs" et son contenu utilisent l'expression "blague à tiroirs" — expression technique consacrée en comédie française. Changer en "vanne à tiroirs" risquerait de perdre la reconnaissance du terme.

**Recommandation** : conserver "La blague à tiroirs" comme exception au mot "vanne" (terme technique établi). Si Thomas veut moderniser, la formulation serait "La vanne gigogne" ou "La structure en tiroirs".

---

### [SIGNALEMENT 2] — Learnings génériques répétés (videos ids 31-89)

Les learnings des vidéos 31-89 utilisent souvent les mêmes 4 noms de techniques (TECHNIQUE DU DÉTAIL SPÉCIFIQUE / DE L'ESCALADE / DU PERSONNAGE / DU TWIST — ou TECHNIQUE DE L'ŒIL NEUF / DE LA SPÉCIFICITÉ / DU CONTRASTE / DE L'ANCRAGE) quel que soit le contenu réel de la vidéo.

Exemples détectés :
- id 32 (Samia Orosemane) : learnings DÉTAIL SPÉCIFIQUE / ESCALADE / PERSONNAGE / TWIST — les explications ne correspondent pas au vrai contenu du sketch
- id 36 (Yacine Belhousse) : learnings ŒIL NEUF / SPÉCIFICITÉ / CONTRASTE / ANCRAGE — explications génériques
- id 41 (Astier & Rollin) : DOUBLE SENS / DÉTOURNEMENT / SONORITÉ / AMBIGUÏTÉ — manque de précision

**Recommandation** : ces learnings mériteraient une réécriture pour coller au contenu réel de chaque vidéo. Conservés en l'état par principe "améliorer pas amputer". Une session dédiée à la réécriture des learnings 31-89 serait utile.

---

### [SIGNALEMENT 3] — Potentiel chevauchement conseils 55 et 68

Les conseils 55 et 68 semblent traiter un sujet proche (répondre aux questions gênantes et utiliser l'humour en situations difficiles). Vérifier si leur angle est suffisamment différencié pour justifier deux entrées.

**Recommandation** : conserver les deux en l'état (principe "garde et signale"). Thomas vérifie si l'angle est distinct.

---

### [SIGNALEMENT 4] — Mot "mémoriser" résiduel

Le mot "mémoriser" a été remplacé par "ressortir" dans les endroits identifiés. Si d'autres occurrences subsistent dans des sections non auditées, elles peuvent être traitées lors d'une passe ultérieure.

---

## 6. Règles charte respectées

| Règle | Statut |
|---|---|
| Aucun chiffre modifié | ✓ — 0 stat/chiffre touché |
| Zéro mention d'IA | ✓ — aucune mention ajoutée |
| Tutoiement partout | ✓ — tous les "vous/votre" corrigés en "tu/ton" |
| Améliorer pas amputer | ✓ — 0 conseil/vidéo/étape supprimé |
| Zéro invention | ✓ — 0 chiffre/témoignage/étude ajouté |
| Zéro concurrent nommé | ✓ |
| Slugs/URLs préservés | ✓ — 0 slug touché |
| JSON valide | ✓ — structure préservée |
| previousTitle ajouté si titre modifié | ✓ — id 6 (conseils) |

---

*Rapport généré session 11 — @copywriter — 29/09/2026*
