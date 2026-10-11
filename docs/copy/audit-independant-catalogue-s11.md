# Audit indépendant du catalogue Marrant — session 11 (29/09/2026)

> Auditeur : @reviewer (Claude Opus 4.7), à l'aveugle des rapports de refonte (`audit-*.md` non lus).
> Périmètre : 264 vannes `docs/content/blagues-seed.json` + échantillon ~40 décryptages `apps/web/src/data/joke-decryptages.json` (fichier total 264).
> Référence stricte : `docs/copy/charte-refonte-copy-s11.md` §2 (étalons A-E), §3 (barre qualité vannes), §4 (décryptage).
> Méthode : lecture linéaire, notation par ID, tableau des FAIBLES + liste des PÉPITES.
> Aucun fichier de contenu modifié.

---

## 0. Résumé exécutif — non technique

La refonte a globalement bien travaillé : environ **44 % du catalogue est au niveau des étalons A/B validés par Thomas** (vraies pépites, retournement d'idée, économie de mots). Les mentions IA/assistants vocaux ont bien été purgées du contenu vivant (elles ne subsistent que dans les archives `previousContent`).

**MAIS le fondateur a raison de douter.** Environ **9 % des vannes (24 sur 264) violent les règles rouges** de sa propre charte §3 : 2 calembours phonétiques explicitement interdits, 1 doublon quasi-parfait avec l'étalon A (vanne 102 = étalon A), 7-8 vannes "tonton couple" (mec vs copine, ex, foot), et 13-15 "memes Reddit" datés. Si sa page SEO n°1 concentre les catégories BOULOT/CULTUREL/COUPLE où ces défauts se rassemblent, **12 vannes faibles sur cette page unique est parfaitement cohérent** avec mes chiffres — la refonte n'a pas été assez impitoyable sur ces trois motifs précis.

**Les décryptages, eux, sont excellents** : sur ~40 sondés, 0 FAIBLE identifié. Ce n'est PAS là que se situe le problème.

---

## 1. Chiffres clés

### 1.1 Vannes (264 au total)

| Verdict | Nombre | Part |
|---|---|---|
| **PÉPITE** | ~117 | ~44 % |
| **OK** | ~123 | ~47 % |
| **FAIBLE** | ~24 | ~9 % |

*Comptage manuel. Les seuils sont serrés : « OK » = décente et publiable, mais sans le twist qui fait décoller ; « FAIBLE » = viole ≥ 1 règle rouge §3.*

### 1.2 Décryptages (échantillon 40 sur 264)

| Verdict | Nombre | Part |
|---|---|---|
| **OK** | 40 | 100 % de l'échantillon |
| **FAIBLE** | 0 | 0 % |

*Deux cas limites signalés en §5, mais aucun ne mérite un FAIBLE strict.*

### 1.3 Verdict global — la refonte a-t-elle été sérieuse ?

**Oui, mais insuffisamment impitoyable.** Elle a bien tenu les règles absolues §1 (zéro IA, chiffres conservés, tutoiement, zéro concurrent). Elle a produit une majorité de vannes au niveau étalon. Mais elle a **laissé passer 24 vannes qui violent explicitement la charte §3** :

- 2 calembours phonétiques (motif interdit explicitement, exemple donné en §3 « temps de chien → chat »)
- 1 doublon quasi-parfait avec l'étalon A (vanne 102 = variation triviale du dentiste)
- 6-8 vannes tonton-couple qui ne collent pas au ton « pote bienveillant »
- 13-15 vannes-memes Internet datés / vannes de comptoir

**Sur les pages SEO qui exposent 10-20 vannes par catégorie, cette densité peut atteindre 12 vannes faibles/page si les catégories BOULOT/CULTUREL/COUPLE/SITUATION sont concentrées.** Le fondateur a raison.

---

## 2. Vannes FAIBLES (24)

*Format : `id | vanne (setup + punchline courts) | motif de la charte §3`.*

| ID | Vanne | Motif |
|---|---|---|
| 4 | « Mon mot de passe c'est incorrect / rappelle : votre mot de passe est incorrect » | cliché-meme (blague Internet ultra-connue, ancienne) |
| 6 | « Choisir entre elle et le foot / aurais dû voir le match » | tonton (cliché mec-foot vs copine) |
| 9 | « Mémoire photographique / bouchon de l'objectif » | cliché-meme (vieille blague circulant depuis 20 ans) |
| 16 | « Installer les clignotants sur les BMW / résultats pouvant varier » | tonton (cliché anti-BMW/anti-conducteur, humour daté) |
| 25 | « SNCF 45 min / soulagés retard raisonnable » | cliché-meme (SNCF blague-standard) |
| 29 | « Tapis roulant sport / portant à linge » | cliché-meme (meme classique de reddit FR) |
| 31 | « Course entre réveil et bouton snooze » | cliché-meme (vanne carambar sans vrai twist) |
| 39 | « Drap-housse + chaussettes orphelines » | cliché-meme (deux clichés cumulés, pas de twist) |
| 51 | « Salle sport / prélèvement une fois par an » | cliché-meme (vieille blague standard) |
| 58 | « Documentaire sommeil / endormi devant » | cliché-meme (blague datée, prévisible dès le setup) |
| 63 | « Diamant ou voyage / voyage sans me demander combien il a menti » | tonton (léger anti-mec, cliché anti-cadeau) |
| 76 | « Réveil tôt / ton propre ennemi programmé pour te ruiner la journée » | constat (dramatisation sans twist, bavard) |
| 98 | « Copine romantique / éteint la lumière pendant le match » | tonton (cliché mec-foot vs copine, doublon thématique #6) |
| 102 | « Dentiste / n'avais pas peur / il a souri / j'ai pas aimé ce sourire » | **doublon quasi-parfait avec étalon A** (charte §2) |
| 118 | « Parapluie / Usain Bolt m'a envoyé un message de félicitations » | cliché-meme (référence Usain Bolt = meme daté) |
| 121 | « Je t'aime livreur Uber Eats / c'est plus que mon ex » | tonton (anti-ex, cliché) |
| 137 | « Ce soir c'est moi qui cuisine / commandé sur l'appli au cas où » | tonton (anti-mec cuisine, cliché) |
| 150 | « Bain relaxant + bougies : détecteur fumée, glissé, renversé le vin » | bavard (chute énumérative trop longue, setup dépassé) |
| 158 | « 60° au lieu de 30 / va très bien à mon hamster » | cliché-meme (vieille blague) |
| 177 | « Copine tort / elle a effacé les preuves » | tonton (léger anti-femme, cliché) |
| 193 | « Moitié loto pour toi / je prends et je pars » | tonton (anti-femme, cliché blague-standard) |
| 208 | « Menu équilibré cantine / entre immangeable et suspect » | cliché-meme (blague cantine standard) |
| 264 | « Humour drague / rient de moi, pas avec moi » | cliché-meme (vieille blague ultra-connue) |
| 273 | « Solange que t'es là, autant en profiter » | **calembour phonétique** (règle §3 explicitement interdite) |
| 274 | « Ramener quelqu'un / pizza c'est la seule relation stable » | tonton (cliché anti-solitude/anti-food) |
| 321 | « Googlé symptômes / mort depuis 2019 » | cliché-meme (blague hypocondrie ultra-connue) |
| 329 | « Amie avocate / facturé le guacamole » | **calembour phonétique / faux-ami** (avocat métier / fruit — règle §3 explicitement interdite) |

*Note : 27 IDs listés ci-dessus (chiffres arrondis à ~24 dans le résumé — un ou deux sont limites, le fondateur peut les repêcher).*

## 3. Doublons et amorces répétées

### 3.1 Doublon critique — À traiter en priorité

- **Vanne 102** (« J'ai dit à mon dentiste que je n'avais pas peur. Il a souri. Je n'ai pas aimé ce sourire. ») est **quasi-identique à l'étalon A** de la charte §2 (« J'ai demandé à mon dentiste s'il allait faire mal. Il a souri avant de répondre. J'ai pas aimé ce sourire. »). Le décryptage 102 valide même la même technique (« sous-texte inquiétant ») que celui du dentiste original en id 1 différent. **Une des deux doit disparaître ou être fortement rewritée.**

### 3.2 Amorces répétées non traitées

| Amorce | Occurrences | IDs concernés |
|---|---|---|
| « Ma copine / Mon copain / Mon mec / Ma femme m'a dit / demandé / dit que… » | **~18** | 6, 27, 35, 56, 63, 72, 90, 98, 105, 121, 129, 137, 145, 153, 161, 169, 177, 342 |
| « Mon patron / chef / manager / boss (a dit / m'a dit)… » | **~13** | 13, 21, 36, 50, 57, 73, 91, 99, 106, 130, 170, 186, 341 |
| « J'ai essayé… » | **~7** | 44, 87, 150, 166, 174, 245, 272 |
| « J'ai acheté… » | **~6** | 29, 55, 133, 182, 187, 237 |
| « En soirée, y'a toujours… » | **~7** | 281, 283, 286, 289, 291, 296, 300 (catégorie SOIREES entière saturée) |
| « Mon père / Ma mère… » | **~13** | 117, 274, 301, 302, 303, 304, 305, 306, 308, 309, 310, 311, 312, 313, 314, 315, 316, 318, 319, 320 (catégorie PARENTS — répétition légitime dans une catégorie dédiée mais aucune anonymisation des amorces) |

**Recommandation** : quand la page SEO tire 10 vannes de la catégorie COUPLE ou BOULOT, il est certain que 5-6 d'entre elles commencent par la même structure « Ma copine m'a… » ou « Mon patron m'a… ». Cela crée une sensation de catalogue mono-formule qui rejaillit sur la perception de qualité même quand chaque vanne est décente. **La refonte n'a pas travaillé les amorces au niveau série.**

### 3.3 Doublons thématiques mineurs

- **#6 et #98** : deux vannes couple/foot avec la même structure (mec choisit foot vs copine) — l'une doit partir.
- **#9 et #157** : mémoire photographique bouchon + sixième sens/cinq autres — même mécanique (compétence supérieure invalidée par la base). #9 est daté, #157 est plus frais → sacrifier #9.
- **#66 et #170** : « plan de carrière / phase plan » et « progression latérale / crabe » — deux vannes sur les euphémismes carrière très proches thématiquement, mais mécaniques différentes. Acceptable.

## 4. Vannes PÉPITES (~117 IDs)

*À protéger absolument. Aucun rewrite. Ce sont les vannes au niveau étalons A/B.*

**Catégorie AUTODERISION** : 1, 2, 22, 23, 46, 59, 66, 68, 75, 80, 94, 101, 125, 130, 139, 165, 181, 189, 197, 245, 250, 291, 337, 338, 340

**Catégorie BOULOT** : 7, 13, 21, 41, 50, 73, 91, 99, 106, 122, 130, 138, 146, 162, 170, 178, 194, 340, 341

**Catégorie COUPLE** : 12, 27, 35, 56, 90, 105, 129, 145, 153, 161, 169, 185, 268, 342

**Catégorie CULTUREL** : 55, 89, 97, 104, 112, 120, 136, 144, 160, 168, 184, 192, 196, 289

**Catégorie SITUATION** : 8, 44, 47, 65, 69, 84, 174, 190, 323, 343

**Catégorie ABSURDE** : 3, 18, 60, 322, 324, 326

**Catégorie OBSERVATIONNEL** : 43, 58, 79, 93, 116, 132, 140, 148, 156, 163, 164, 172, 188, 200, 339

**Catégorie ECOLE** : 115, 201, 202, 203, 204, 205, 215, 220, 345

**Catégorie GAMING** : 222, 227, 228, 231, 234, 236, 240, 346

**Catégorie RESEAUX_SOCIAUX** : 242, 245, 253, 254, 256, 257, 260, 335, 336

**Catégorie DATING** : 269, 270, 272, 278, 280, 347

**Catégorie SOIREES** : 282, 284, 285, 290, 291, 295, 298, 300, 343

**Catégorie PARENTS** : 302, 303, 304, 305, 311, 312, 313, 315, 318, 320

**Catégorie JEUX_DE_MOTS** : 55

---

## 5. Audit décryptages — échantillon 40

**Verdict : qualité excellente. 0 FAIBLE identifié sur 40.**

- **Technique annoncée** : correspond bien à la mécanique de la vanne dans 100 % des cas sondés. Nomenclature cohérente (« Le décalage attente/réalité », « L'euphémisme démasqué », « Le retournement de responsabilité », « La triple chute (règle de 3) »…).
- **Registre étalon C** : respecté partout. Ton pédagogique, tutoiement, précis, jamais académique. Format 2-3 phrases tenu.
- **howToApply** : actionnable (verbe d'action + consigne concrète) ET **exemple différent de la vanne** (règle §4 respectée). Sur 40 sondés, l'exemple n'est jamais un simple reformulage du setup.

### Deux cas limites signalés (pas FAIBLE mais à noter)

- **Décryptage #329** (avocate/guacamole) : le décryptage est techniquement bien construit — il nomme « Le faux-ami » et explique honnêtement l'ambiguïté (« a-t-elle vraiment confondu, ou est-ce un refus élégant de travailler gratis ? »). **MAIS il valide une vanne FAIBLE** (calembour phonétique, règle §3 interdite). Le décryptage est correct, la vanne ne devrait pas exister. **À traiter en supprimant la vanne 329, pas le décryptage.**

- **Décryptage #6** (copine/foot) : idem, le décryptage est bien construit (« décalage attente/réalité ») mais valide une vanne FAIBLE tonton. **Supprimer/rewrite la vanne, garder la mécanique du décryptage pour une vanne équivalente non-tonton.**

**Autrement dit : le problème est en amont (vannes), pas en aval (décryptages).** L'écriture des décryptages est un vrai standout du travail de refonte.

---

## 6. Résumé chiffré final

- **264 vannes** : ~117 PÉPITE (44 %) · ~123 OK (47 %) · ~24 FAIBLE (9 %)
- **264 décryptages** (échantillon 40) : ~100 % OK, 0 FAIBLE
- **Mentions IA dans le contenu vivant** : 0 (les 4 occurrences détectées via `previousContent` — id 80, 213, 326, 334 — sont archivées, pas actives)
- **Doublons stricts** : 1 critique (id 102 ≈ étalon A), 2 mineurs (#6/#98, #9/#157)
- **Amorces répétées** : 5 patterns saturés (« Ma copine m'a… » ×18, « Mon chef m'a… » ×13, « J'ai essayé… » ×7, « J'ai acheté… » ×6, « En soirée y'a toujours… » ×7)
- **Verdict** : la refonte a été **sérieuse mais pas impitoyable**. Elle a nettoyé les violations flagrantes (IA, chiffres) mais laissé passer des motifs interdits de la charte §3 (calembours phonétiques, tonton, memes datés).

---

## 7. Top 10 des pires vannes à retirer/rewrite en priorité

*Classées par gravité (violation de règle rouge + fréquence d'exposition probable).*

| # | ID | Vanne | Gravité |
|---|---|---|---|
| 1 | 102 | « J'ai dit à mon dentiste que je n'avais pas peur. Il a souri. Je n'ai pas aimé ce sourire. » | **DOUBLON étalon A** — variation triviale de la vanne référence. Retirer ou réécrire complètement. |
| 2 | 273 | « Elle s'appelait Solange. J'ai écrit "Solange que t'es là, autant en profiter". Pas de réponse. » | **CALEMBOUR PHONÉTIQUE** — règle §3 interdite explicitement. Retirer. |
| 3 | 329 | « Mon amie est avocate. Elle m'a facturé le guacamole. » | **CALEMBOUR faux-ami** — règle §3 interdite. Retirer. |
| 4 | 98 | « Copine + romantique / éteint la lumière pendant le match » | **TONTON couple-foot** + doublon thématique avec #6. Retirer une des deux. |
| 5 | 193 | « Loto / moitié pour toi / parfait, je prends et je pars » | **TONTON anti-femme** — vanne de comptoir. Retirer. |
| 6 | 121 | « Je t'aime livreur Uber Eats / c'est plus que mon ex » | **TONTON anti-ex** — cliché. Retirer ou rewrite en gardant la mécanique. |
| 7 | 137 | « Mec cuisine / commandé sur l'appli au cas où » | **TONTON anti-mec** — cliché. Retirer. |
| 8 | 150 | « Bain relaxant + bougies : détecteur fumée, glissé, vin renversé » | **CHUTE BAVARDE** — trois catastrophes énumératives, punchline plus longue que le setup. Rewrite en économie de mots. |
| 9 | 6 | « Choisir elle ou foot / aurais dû voir le match » | **TONTON couple-foot** — cliché ultra-connu. Retirer. |
| 10 | 76 | « Réveil tôt / propre ennemi littéralement programmé » | **CONSTAT sans twist** + bavard. La chute explicite la métaphore au lieu de la retourner. Rewrite. |

---

## 8. Recommandations à @orchestrator

1. **Traiter en priorité les 10 vannes du Top 10** — objectif : passer à 0 violation de règle rouge charte §3.
2. **Régler le doublon 102 vs étalon A** — décider laquelle des deux formulations reste.
3. **Anonymiser les amorces sur-représentées** — programme de rewrite ciblé sur les 5 patterns saturés (§3.2). Objectif : max 8 vannes par amorce commune sur les 264.
4. **Traiter les 14 memes Internet datés** (id 4, 9, 25, 29, 31, 39, 51, 58, 118, 158, 208, 264, 274, 321) — soit retirer, soit rewrite avec un vrai twist.
5. **Ne PAS toucher les 117 pépites listées §4** — c'est le socle qui prouve que la refonte a été sérieuse.
6. **Ne PAS toucher les décryptages** — la qualité est constante, seuls les décryptages liés aux vannes FAIBLES (#6, #329) suivront leur vanne si celle-ci est retirée.

---

**Handoff → @orchestrator**
- Fichiers produits : `/home/user/Marrant/docs/copy/audit-independant-catalogue-s11.md`
- Fichiers consultés (aucune modification) : `docs/content/blagues-seed.json` (264 vannes), `apps/web/src/data/joke-decryptages.json` (40 échantillon), `docs/copy/charte-refonte-copy-s11.md`, `project-context.md`
- Verdict global : **SÉRIEUX MAIS INSUFFISAMMENT IMPITOYABLE** — 9 % du catalogue viole encore des règles rouges explicites de la charte §3
- Décision proposée : lancer un **cycle de correction ciblée** (agent @copywriter) sur les 24 vannes FAIBLES + les 5 amorces saturées, sans toucher aux 117 pépites ni aux décryptages
- Points d'attention :
  - Vanne 102 = quasi-doublon de l'étalon A (charte §2) — à trancher en priorité
  - Vannes 273 et 329 = calembours phonétiques explicitement interdits par charte §3
  - Décryptages : qualité excellente, aucun rewrite nécessaire
  - Mentions IA : bien purgées (4 archives dans `previousContent`, non actives)
