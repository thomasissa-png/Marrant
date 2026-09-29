# Audit contenus — Deviens-marrant.fr — Session 11 (2026-09-29)

> Périmètre : blog (21 articles visibles + index), pages clés (home, abonnement, à-propos, vannes, parcours), catalogue visible en prod.
> Sources : instantanés .txt du répertoire scratchpad/live/ + project-context.md + brand-voice.md.
> Tous les trous cités incluent une preuve verbatim.

---

## 1. Verdicts par bloc

| Bloc | Note s11 | Note s10 (ref) | Delta | Résumé |
|---|---|---|---|---|
| Pages clés | 7/10 | n.d. | premier audit | Promesse claire, CTA cohérent, mais chiffre vannes périmé + mention IA en prod |
| Blog | 6/10 | n.d. | premier audit | Doublon grave, FAQ en vouvoiement, témoignages fictifs nommés, formules IA résiduelles |
| Catalogue | 7/10 | n.d. | premier audit | Richesse réelle ; pivot décryptage s10 invisible en prod (branche non mergée) |
| Fraîcheur / prod | 5/10 | n.d. | premier audit | s9+s10 non déployées ; contenu quotidien visible via scraping statique seulement |
| **Global** | **6.5/10** | — | — | Fondations solides ; 3 P0 bloquants avant toute communication externe |

---

## 2. Tableau des trous P0 / P1 / P2

### P0 — Bloquants (à corriger avant toute campagne / communication externe)

| ID | Trou | Preuve verbatim + source | Impact persona | Fix recommandé | Agent |
|---|---|---|---|---|---|
| T01 | Chiffre vannes périmé en prod | Page vannes (vannes.txt l.1) : **"290+ vannes drôles à ressortir ce soir"** — or project-context.md l.81 : **"265 vannes actives (289 seedées dont 24 vannes faibles désactivées en soft delete s10)"** | Tous — perte de confiance si le membre voit 265 vannes après avoir lu 290+ | Passer à "265+ vannes" OU attendre merge s10+s10 qui revalide le chiffre ; court terme : "des centaines de vannes" déjà utilisé ailleurs | @fullstack |
| T02 | Mention IA explicite dans les features premium | Page home (home.txt) : **"✓ Nouveaux contenus chaque semaine générés par IA"** — règle fondateur (founder-preferences.md l.21) : **"Mention IA = JAMAIS dans le contenu, JAMAIS en signature — règle PERMANENTE"** | Tous — contredit la posture "pote naturel", fragilise la confiance sur la qualité | Reformuler : "✓ Nouveaux contenus chaque semaine" ou "✓ Catalogue enrichi chaque semaine" | @fullstack + @copywriter |
| T03 | Doublon éditorial grave : deux articles sur "rester muet en groupe" publiés consécutivement | Article 1 : **"Rester muet en groupe : 7 techniques pour reprendre la parole"** (2026-05-05) ; Article 2 : **"Ne plus rester muet en groupe : 6 réflexes qui changent tout"** (2026-05-04) — même problème, mêmes techniques (rebond, timing, piggyback), mêmes personas (étudiant, jeune active, homme en reconstruction). Violation règle CLAUDE.md : **"Ne JAMAIS rédiger un contenu qui couvre le même sujet avec le même angle qu'un contenu existant"** | Yanis + Marc — cannibalisation SEO, signal de qualité rédactionnelle dégradé | Fusionner les deux articles en un pillar unique ou rediriger l'un vers l'autre (301) | @seo + @copywriter |
| T04 | Témoignages fictifs avec prénoms-personas dans un article | Article "Ne plus rester muet en groupe" (ne-plus-rester-muet-en-groupe.txt) : **"Lucas, 21 ans, étudiant en école de commerce"**, **"Marine, 28 ans, chargée de communication"**, **"Thomas, 35 ans, en reconstruction après séparation"** — ces profils sont des copies exactes des personas internes (Yanis/Sophie/Marc). Règle brand-voice.md : **"Zéro témoignage fictif utilisant le nom d'un persona du projet — anonymiser (métier + ville) ou utiliser des chiffres factuels"** | Tous — si un lecteur reconnaît le schéma, la crédibilité du site s'effondre | Anonymiser : "un étudiant en commerce, Paris", "une chargée de com, Lyon" OU remplacer par des chiffres agrégés | @copywriter |

### P1 — Prioritaires (à traiter dans la session ou la suivante)

| ID | Trou | Preuve verbatim + source | Impact persona | Fix recommandé | Agent |
|---|---|---|---|---|---|
| T05 | FAQ article "comment devenir drôle" en vouvoiement | blog_comment-devenir-drole.txt : **"Comment devenir drôle rapidement ? Commencez par observer les absurdités du quotidien (1 par jour), mémorisez 5 vannes courtes"** — règle brand-voice.md : **"Tutoiement systématique — on parle comme un ami, jamais de vouvoiement"** | Yanis (débutant) — rupture de ton brutale entre l'article (tutoiement) et la FAQ (vouvoiement) | Corriger les réponses FAQ : "commence par observer…", "mémorise 5 vannes" | @copywriter |
| T06 | Citations mal attribuées à des humoristes vivants | blog_citation-drole.txt : **"Comme le dit Fary : 'L'humour, c'est la politesse du désespoir.'"** (citation de Boris Vian / mal attribuée) et **"Comme dit Fary : 'L'humour, c'est la seule chose sérieuse dans la vie.'"** (auteur inconnu — pas de Fary) | Tous — risque d'image si Fary ou ses fans corrigent publiquement | Retirer les attributions directes ou reformuler en "comme dirait un standupper..." | @copywriter |
| T07 | Staccato et formules IA résiduelles dans les articles | blog_ne-plus-rester-muet-en-groupe.txt : **"Boom, connexion créée."** (fragment 3 mots) ; **"Plot twist : ton silence peut devenir ton super-pouvoir."** (tic d'IA reconnaissable) ; blog_jeu-de-mots.txt : **"STOP."** (fragment 1 mot) — gate G-S21 anti-staccato, préférence fondateur 06/05/2026 : **"phrases construites avec transitions logiques, pas fragments staccato"** | Tous — rupture voix "pote fluide" | Patch seo-blog-agent.ts + révision manuelle des 2-3 articles concernés | @copywriter + @fullstack |
| T08 | Page parcours_repartie vide en prod | parcours_repartie.txt : seul le footer est affiché, zéro contenu de parcours | Marc + Yanis — le parcours répartie est le plus mis en avant sur la home et le blog | Déploiement s10 résoudra (dépend du merge) ; documenter comme bloqueur de conversion | @fullstack |
| T09 | Structure "Réflexe #1 / #2 / #3 + Semaine 1 : Maîtriser les bases" dans un article = ton scolaire | blog_ne-plus-rester-muet-en-groupe.txt : sections titrées **"Semaine 1 : Maîtriser les bases (Réflexes #1 et #2)"**, **"Jours 1-3 : Le Rebond"**, **"Jours 4-7 : Les Questions Magiques"** — brand-voice.md : **"Jamais scolaire — on est un atelier, pas un amphi"** | Yanis (débutant) — la structure plan de cours intimide | Reformater vers une progression narrative avec transitions humoristiques | @copywriter |
| T10 | Décrytages vannes (pivot s10) absents en prod | project-context.md l.185 : **"UI catalogue 'Pourquoi ça marche'+'À toi de jouer'. Script back-fill 289 vannes."** → non visible dans vannes.txt (page catalogue vide de ces éléments) — branche s10 non mergée | Tous — la proposition de valeur centrale du pivot s10 est invisible | Merge s10 dans master + déploiement Replit (action Thomas) | @fullstack |
| T11 | Parcours : 3 seulement, aucun pour les situations pro (Sophie) | parcours snapshot + project-context.md l.81 : 3 parcours (Machine à Café, Répartie, Confiance) — aucun parcours "Humour au boulot" ni "Storytelling" alors que la home met en avant Sophie (machine à café) et Marc | Sophie + Marc — frustration : le persona est identifié mais le parcours dédié manque | Planifier 2 nouveaux parcours : "Humour au boulot" (Sophie, 4 sem) + "Storytelling" (Marc, 5 sem) | @product-manager + @copywriter |

### P2 — Améliorations (backlog)

| ID | Trou | Preuve verbatim + source | Impact | Fix |
|---|---|---|---|---|
| T12 | Article "citations drôles" : 40 "citations" majoritairement synthétiques IA, non attribuables | blog_citation-drole.txt citation 39 : **"2024 m'a appris que j'étais plus résistant que prévu. Et plus créatif pour les excuses."** — inventée, non attribuable à personne | Crédibilité marque | Reformuler : "À sortir en situation X" sans attribution fictive |
| T13 | Blog index avec "Chargement des articles…" visible dans la capture | blog.txt l.4 : **"Chargement des articles…"** — rendu côté client lent ou JS désactivé dans la capture | SEO (pas de contenu HTML visible) | Vérifier si les articles sont rendus côté serveur (SSR/SSG) |
| T14 | Page coaching 99€/séance : feature en prod sans parcours visible | home.txt : **"Coaching individuel 99 € / séance — Appel individuel 45 min en visio"** — aucun agenda/booking visible, pas de lien Calendly ou équivalent | Conversion — CTA sans destination | Vérifier si le lien "Réserver un appel" est actif ; si non → "bientôt" ou retirer |
| T15 | Absence de contenu pour les contextes romantiques / dating | 0 article sur l'humour dans la séduction, le premier date, les apps de rencontre — alors que Marc (reconstruction) est un persona clé | Marc | Planifier : "Humour et séduction : être drôle sur Tinder et en date" |

---

## 3. Carte des doublons / cannibalisation + trous éditoriaux

### 3.1 Doublons et cannibalisation (à résoudre)

| Paire | Slugs | Nature | Recommandation |
|---|---|---|---|
| **GRAVE** | `rester-muet-en-groupe` + `ne-plus-rester-muet-en-groupe` | Même problème, mêmes techniques, publiés J-1/J | Fusionner — conserver `rester-muet-en-groupe` (plus structuré, meilleur fond), rediriger l'autre |
| **POTENTIELLE** | `comment-avoir-de-la-repartie` + `apprendre-la-repartie-methode-30-jours` (non lu ici) | À vérifier — tous deux portent sur "apprendre la répartie" | Audit du second slug avant décision |
| **POTENTIELLE** | `comment-devenir-drole` + `jeu-de-mots-drole-techniques-creer` | Overlap sur la section "comment devenir drôle en pratiquant" | Liens croisés suffisent si angles distincts |

### 3.2 Trous éditoriaux par persona (priorités)

| Priorité | Sujet | Persona | Intention | Cluster |
|---|---|---|---|---|
| P0 | Humour en soirée étudiante / BDE | Yanis | Situation précise | humour-contexte |
| P0 | Comment mémoriser une vanne sans avoir l'air de la réciter | Yanis | Débutant pratique | techniques-delivery |
| P1 | Humour au travail : faire rire sans déraper (lien interne vu dans citation-drole mais article non audité) | Sophie | Situation pro | humour-contexte |
| P1 | Anecdotes professionnelles : structure et timing | Sophie | Avancé pro | storytelling |
| P1 | Retrouver son humour après une période difficile | Marc | Reconstruction | confiance |
| P1 | Humour et séduction : premier date, Tinder, messages | Marc | Situation précise | humour-contexte |
| P1 | Humour introversion : les silencieux qui cartonnent | Yanis + Marc | Psychologie | confiance |
| P2 | Comment écrire des légendes Instagram drôles | Sophie + Yanis | Canal numérique | humour-contexte |
| P2 | Storytelling : transformer une anecdote nulle en histoire drôle | Marc + Sophie | Avancé | storytelling |
| P2 | Humour en réunion / prise de parole en public | Sophie + Marc | Pro | humour-contexte |
| P2 | Les 5 types d'humour : lequel te correspond ? (article mentionné en lien interne mais non vu) | Tous | Découverte | humour-theorie |
| P2 | Autodérision avancée : jusqu'où aller sans se dévaloriser | Marc | Avancé | confiance |
| P2 | Humor en couple : taquiner sans blesser | Marc + Sophie | Relation | humour-contexte |
| P2 | Blagues courtes vs longues : quand utiliser quoi | Tous | Technique | techniques-delivery |

---

## 4. Bilan brand voice — tics d'IA et registre

### Ce qui fonctionne bien
- Les deux articles pillar (`comment-devenir-drole`, `comment-avoir-de-la-repartie`) sont fluides, bien structurés, tutoiement cohérent, humour intégré naturellement (oncle qui "est né drôle", GPS qui recalcule)
- Références humoristes correctement réparties (Mirabel, Fary, Gardin, Frayssinet, Pascot, Waly Dia, Inès Reg) dans les pillar
- Article `rester-muet-en-groupe` (7 techniques) est de qualité supérieure : psychologie crédible, exemples en situation, progression logique, zéro staccato

### Tics d'IA identifiés (à patcher dans seo-blog-agent.ts)
1. **"Boom, [résultat]."** — 3 occurrences dans le corpus
2. **"Plot twist"** en milieu de texte — 2 occurrences
3. **Faux titre-section "Semaine X : Maîtriser les Y (Réflexes #A et #B)"** — structure plan-de-cours qui tue le ton atelier
4. **Citations attribuées à des humoristes sans vérification** — risque réputationnel
5. **FAQ en vouvoiement** — rupture automatisée non corrigée par le Director

---

## 5. Cohérence des chiffres en prod (récapitulatif)

| Donnée | Affiché en prod | Réalité projet-context.md | Statut |
|---|---|---|---|
| Nombre de vannes | "290+ vannes" (page vannes) / "des centaines" (home/abonnement) | 265 actives (post-s10) | **PÉRIMÉ** — T01 |
| Membres | "1 500+ membres" (home × 3, à-propos) | Non confirmé en base | Cohérent entre pages, chiffre à valider |
| Conseils | "60+ techniques" (page vannes) | 66 (project-context.md) | OK (arrondi intentionnel) |
| Vidéos | "des dizaines" / "80+" | 89 (project-context.md) | OK |
| Parcours | 3 mentionnés (home + parcours) | 3 (parcours-seed.json) | OK |
| Décryptages vannes | Absents en prod | Développés en s10, non déployés | **MANQUANT** — T10 |

---

## 6. Handoff

**Handoff → @orchestrator**

Fichiers produits :
- `/home/user/Marrant/docs/copy/audit-contenus-s11.md`

Décisions prises :
- 4 P0 identifiés : chiffre vannes périmé (T01), mention IA en prod (T02), doublon éditorial rester-muet (T03), témoignages fictifs nommés (T04)
- Progression éditoriale réelle mais bridée par non-déploiement s9+s10
- Le pivot s10 (décryptages "Pourquoi ça marche") est la feature différenciante la plus attendue — invisible en prod

Points d'attention :
- T02 (mention IA) et T04 (témoignages) peuvent être fixés en @fullstack sans attendre le merge
- T01 (chiffre) est lié au merge s10 — solution court terme : remplacer "290+" par "265+" ou "des centaines"
- T03 (doublon) nécessite une décision @copywriter + redirect @fullstack
- Le blog index (T13) affiche "Chargement des articles..." dans la capture — vérifier si SSG est en place
- Aucun audit contenus avec note précédente n'existe ; cette session établit la baseline à 6.5/10

---

## Résumé P0/P1 — 15 lignes

**4 P0 à corriger immédiatement :**
(T01) La page vannes affiche "290+ vannes" alors que 24 ont été retirées en s10 — 265 actives.
(T02) "Nouveaux contenus générés par IA" figure dans les features premium de la home — violation règle absolue fondateur.
(T03) Deux articles sur "rester muet en groupe" publiés J et J+1 (04-05 mai 2026) — cannibalisation SEO et signal qualité dégradé.
(T04) L'article "Ne plus rester muet" liste des témoignages "Lucas 21 ans", "Marine 28 ans", "Thomas 35 ans séparé" — copies transparentes des personas internes Yanis/Sophie/Marc.

**7 P1 à traiter en session 11 ou 12 :**
(T05) FAQ de l'article pillar "comment devenir drôle" en vouvoiement — rupture de ton automatisée.
(T06) Deux citations attribuées à Fary dans l'article "citation drôle" sont fausses (Boris Vian / anonyme).
(T07) Staccato résiduel : "Boom, connexion créée.", "Plot twist", "STOP." dans 3 articles.
(T08) Page parcours répartie vide en prod — bloqueur de conversion direct.
(T09) Article "Ne plus rester muet" structuré comme un programme scolaire (Semaine 1 / Jours 1-3) — contre le ton atelier.
(T10) Les décryptages vannes "Pourquoi ça marche" + "À toi de jouer" (pivot s10) sont invisibles en prod — proposition de valeur centrale non diffusée.
(T11) Zéro parcours pour les situations professionnelles (Sophie) ni pour le storytelling (Marc).
