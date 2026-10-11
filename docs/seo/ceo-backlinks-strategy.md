# Stratégie backlinks — Module CEO autonome

> Livrable @seo — 2026-05-05
> Contexte : migration haro-agent.ts → CEO module + stratégie backlinks complète exécutable en autonomie.
> Complémente `backlink-strategy.md` (@growth, 2026-04-03) — ne pas dupliquer les canaux déjà documentés, aller plus loin sur l'exécution CEO.

---

## 1. Audit migration haro-agent.ts

### Ce qui marche — à conserver

| Composant | Valeur | Migrer vers |
|---|---|---|
| `RELEVANT_TOPICS` (50 mots-clés, EN + FR) | Filtre robuste, couvre humour + soft skills + dating | `ceo-agent.ts` module backlinks, constante `BACKLINK_RELEVANT_TOPICS` |
| `filterRelevantOpportunities()` | Logique de filtrage textuel, zéro faux positifs sur les tests | `ceo-agent.ts` fonction `filterBacklinkOpportunities()` |
| `generateHaroResponse()` | Génération hook drôle + réponse expert 3-4 phrases + score pertinence | `ceo-agent.ts` fonction `generatePressResponse()` |
| `buildHaroSystemPrompt()` | System prompt calibré voix Marrant + refs humoristes modernes | Intégrer au system prompt global CEO (section backlinks) |
| `ALEX_BIO` (string) | Bio courte réutilisable dans tous les pitchs | `ceo-agent.ts` constante `EXPERT_BIO` |
| `sendHaroDraftForReview()` + template HTML email | Infrastructure Resend opérationnelle, template lisible | Adapter pour Phase 4 (envoi direct journaliste) — garder le template |
| `buildEmail()` | Assemblage email complet avec greeting personnalisé | `ceo-agent.ts` fonction `buildBacklinkEmail()` |
| `processHaroOpportunities()` | Pipeline complet filtre→génère→score→envoie | `ceo-agent.ts` fonction `processBacklinkOpportunities()` |
| Types `HaroOpportunity` + `HaroResponse` + `HaroFilterResult` | Interfaces propres et extensibles | Renommer `BacklinkOpportunity`, `BacklinkResponse`, `BacklinkFilterResult` |

### Ce qui ne marche pas — à corriger dans le CEO

1. **Source manuelle** : pas de scraper/RSS pour Connectively — les opportunités arrivent uniquement via input manuel d'Alex. Le CEO doit intégrer une source automatisée (Zapier webhook ou SourceBottle RSS — voir section 6).
2. **Relais email Alex** : l'agent envoie un draft à alex@deviens-marrant.fr pour copier-coller. En Phase 4 (S3+), le CEO envoie directement au journaliste via Resend (intérêt légitime presse CNIL — validé @legal).
3. **Scope limité HARO** : l'agent ne couvre que le canal presse. Le CEO doit couvrir 5 canaux (presse, blogueurs, podcasts, annuaires, échanges éditoriaux) avec un pipeline unifié.
4. **Pas de tracking DB** : aucun enregistrement de l'historique des pitchs envoyés. Le CEO doit persister dans `CeoBacklink` (voir section 5).
5. **Score pertinence non utilisé pour le tracking** : le score 1-10 est calculé mais perdu après envoi. À stocker en DB.

### Fichiers à migrer (Phase 5 @fullstack)

- `apps/web/src/lib/ai/agents/haro-agent.ts` → contenu migré dans `ceo-agent.ts` (module backlinks)
- `apps/web/src/app/api/cron/haro/route.ts` → supprimé, remplacé par endpoints CEO

### Fichiers à supprimer

- `apps/web/src/lib/ai/agents/haro-agent.ts`
- `apps/web/src/app/api/cron/haro/route.ts`
- Section "Agent HARO" dans `CLAUDE.md` → remplacer par section "Module backlinks CEO"

### Tests à migrer / supprimer

- `apps/web/src/__tests__/lib/haro-agent.test.ts` : 1 test existant (`filterRelevantOpportunities`). Migrer sous `__tests__/lib/ceo-backlinks.test.ts`. Renommer l'import et la fonction. Ajouter des tests pour les 4 nouvelles fonctions (`generatePressResponse`, `processBacklinkOpportunities`, `filterBacklinkOpportunities` multi-canaux, `buildBacklinkEmail`).
- Grep obligatoire avant suppression : `grep -r "haro-agent\|runHaroPipeline\|processHaroOpportunities\|HaroOpportunity" apps/web/src/ --include="*.ts" --include="*.tsx"` — aucun appel externe détecté à ce jour hormis le cron route.

---

## 2. Cibles backlinks prioritaires FR humour/EdTech

### Catégorie A — Médias FR généralistes humour (impact : très élevé)

| Cible | DA estimé | Pertinence | Angle de pitch |
|---|---|---|---|
| Topito.com | [HYPOTHÈSE : DA ~65] | Haute | "La science des blagues : pourquoi certains font toujours rire" — listicle avec Marrant cité comme source |
| Madmoizelle.com | [HYPOTHÈSE : DA ~60] | Haute | "Apps pour reprendre confiance en soi après une rupture" — angle Marc/Sophie |
| Konbini Humour | [HYPOTHÈSE : DA ~70] | Haute | Interview fondateur "Comment décortiquer les techniques de Paul Mirabel" |
| Slate.fr | [HYPOTHÈSE : DA ~75] | Haute | "Peut-on apprendre à être drôle ?" — sujet sociétal, Marrant = preuve que oui |
| Le Bonbon | [HYPOTHÈSE : DA ~45] | Moyenne | "Apps et sites qui changent ta vie de sortie en 2026" |
| L'Étudiant.fr | [HYPOTHÈSE : DA ~60] | Haute | "Briser la glace à la fac : les techniques des étudiants qui font rire" |
| Psychologies.com | [HYPOTHÈSE : DA ~65] | Haute | "L'humour comme outil de résilience — la science derrière le rire" |
| Numerama.com | [HYPOTHÈSE : DA ~70] | Moyenne | "Les start-up EdTech qui réinventent les soft skills" |

### Catégorie B — Blogueurs FR humour/comédie (impact : moyen, faisabilité : très haute)

| Cible | DA estimé | Pertinence | Angle de pitch |
|---|---|---|---|
| Blog Cours Florent (coursflorent.fr/blog) | [HYPOTHÈSE : DA ~40] | Haute | Échange éditorial — "apprendre le stand-up" : Marrant linkable dans un article techniques scène |
| Blog École de comédie de Paris | [HYPOTHÈSE : DA ~25] | Haute | Suggestion de mention dans ressources pour débutants |
| RonRonDesBlagues.fr | [HYPOTHÈSE : DA ~15] | Moyenne | Échange de liens — niche humour FR, audience alignée |
| Blog Jamel Comedy Club (jamelcomedyclub.com) | [HYPOTHÈSE : DA ~35] | Haute | Mention dans "ressources pour apprendre le stand-up" |
| Blog Les Ogres (impro Paris) | [HYPOTHÈSE : DA ~20] | Haute | "Resources pour les débutants en impro" — Marrant comme complément théorique |
| LePetitJournal.com (humour) | [HYPOTHÈSE : DA ~50] | Moyenne | Tribune d'expertise sur "les techniques de stand-up appliquées au quotidien" |

### Catégorie C — Podcasts FR humour/business créatif (impact : élevé, faisabilité : moyenne)

| Cible | DA estimé | Pertinence | Angle de pitch |
|---|---|---|---|
| Sans Permission (Yomi + Oussama) | [HYPOTHÈSE : DA ~55] | Haute | Fondateur EdTech humour — angle "niche absurde devenue vraie business" |
| Génération Do It Yourself (Matthieu Stefani) | [HYPOTHÈSE : DA ~60] | Haute | "Automatiser la création de contenu éditorial avec des agents IA" |
| Bonne Gueule Podcast | [HYPOTHÈSE : DA ~40] | Moyenne | "Comment le style passe aussi par l'humour — confiance sociale" |
| Kult Podcast (culture FR) | [HYPOTHÈSE : DA ~30] | Haute | Interview sur "apprendre l'humour comme un art" |
| Vlan! (Gregory Pouy) | [HYPOTHÈSE : DA ~50] | Moyenne | "Les nouvelles EdTech qui digitalisent les soft skills humains" |
| Podcast de l'École des Managers | [HYPOTHÈSE : DA ~35] | Haute | "Humour et leadership : les vrais chiffres" — crédibilité Marrant |
| Oh My Pod (podcasts recommandés) | [HYPOTHÈSE : DA ~30] | Moyenne | Soumission dans leur annuaire de podcasts recommandés |

### Catégorie D — Annuaires / comparateurs SaaS FR (impact : faible à moyen, faisabilité : très haute)

Ces cibles génèrent des liens rapidement, sans pitch éditorial, et posent les fondations d'autorité de domaine.

| Cible | Type de lien | Action |
|---|---|---|
| Product Hunt (producthunt.com) | dofollow [HYPOTHÈSE : DA ~90] | Lancement officiel avec description optimisée |
| Uneed.be | dofollow [HYPOTHÈSE : DA ~40] | Soumission produit — agrégateur SaaS FR |
| BetaList.com | dofollow [HYPOTHÈSE : DA ~65] | Early-stage startups — Marrant éligible |
| Indie Hackers (indiehackers.com) | nofollow [HYPOTHÈSE : DA ~80] | Post "I built..." — trafic qualifié fondateurs |
| AlternativeTo.net | dofollow [HYPOTHÈSE : DA ~80] | Créer la fiche Marrant comme alternative aux apps développement perso |
| Capterra.fr | dofollow [HYPOTHÈSE : DA ~85] | Catégorie "Logiciels éducatifs" — soumettre fiche gratuite |
| G2.com | dofollow [HYPOTHÈSE : DA ~90] | Catégorie EdTech — soumettre fiche + demander 3 premiers avis |
| FuturePedia.io | dofollow [HYPOTHÈSE : DA ~50] | Répertoire outils IA — Marrant éligible (agents IA génèrent le contenu) |
| There's An AI For That (theresanaiforthat.com) | dofollow [HYPOTHÈSE : DA ~65] | Soumettre Marrant comme outil IA pour apprendre l'humour |

### Catégorie E — Échanges éditoriaux (impact : moyen, faisabilité : haute)

Articles existants où Marrant peut être mentionné en suggestion naturelle — pas de nouveau contenu à créer.

| Article cible | Site | Suggestion de mention |
|---|---|---|
| "Comment parler en public" / "Prise de parole" | Futura-Sciences, WikiHow FR | Ressource complémentaire "apprendre à mettre son auditoire à l'aise" |
| "Développement personnel 2026" listicles | Blog Pratique.fr, Cosmopolitan.fr | Marrant dans "apps de soft skills à tester" |
| "Briser la glace" / "ice breaker" | Cadremploi, Welcome to the Jungle | Ressource "techniques d'humour pour entretiens/networking" |
| "Confiance en soi" guides | Psychomedia.qc.ca | Mention parmi outils francophones de développement social |
| "Apprendre le stand-up" | Divers blogs culturels FR | Lien direct vers /parcours comme "ressource pour débutants" |

---

## 3. Templates de pitch par catégorie

**Règle absolue** : chaque pitch a 1 chute. Ton complice, jamais corporate. Tutoiement systématique.
Note : ces templates seront affinés en Phase 2 (5 exemples canoniques — handoff @copywriter).

### Template A — Médias presse / journalistes

**Subject** : Expert humour FR pour ton article sur [sujet]

**Corps** :
> Salut [Prénom],
> Je dirige deviens-marrant.fr — la seule plateforme FR qui enseigne l'humour avec les techniques du stand-up pro (pas de "sois toi-même", promis).
> Si ton article aborde [angle spécifique], je peux te donner le point de vue d'un fondateur qui a décortiqué 290+ vannes et 80 vidéos de Mirabel/Fary/Frayssinet. Citation courte, bio dispo, deadline respectée.
> Une seule chose à éviter : si tu me cites, mes potes vont penser que je suis devenu sérieux.

**CTA** : "Dis-moi si ça colle, je te prépare 3 angles en 24h."
**Anti-patterns** : pas de "backlink", pas de "SEO", pas de pièce jointe non sollicitée, pas de relance avant 5 jours.

### Template B — Blogueurs humour/comédie

**Subject** : Un lien pour tes lecteurs qui veulent apprendre à être drôles

**Corps** :
> Salut [Prénom],
> J'ai lu ton article sur [sujet] — tu décris exactement ce que vivent nos utilisateurs avant de s'inscrire sur deviens-marrant.fr.
> On a [article pillar pertinent] qui creuse le même sujet avec des exercices concrets. Si ça t'intéresse de le mentionner à tes lecteurs, je te rends la pareille sur notre blog (5 000+ visites/mois en croissance).
> Et si tu veux une vanne gratuite pour ta prochaine soirée, j'en ai 290 de stock.

**CTA** : "Dis-moi si tu veux qu'on en parle — 10 min en visio ou par email, au choix."
**Anti-patterns** : pas d'échange de liens proposé d'emblée, pas de "partenariat rémunéré", ne pas proposer si DA < 10.

### Template C — Podcasts

**Subject** : Episode sur l'humour comme soft skill — je connais le sujet par cœur (et j'ai les stats)

**Corps** :
> Salut [Prénom],
> Je suis Alex, fondateur de deviens-marrant.fr — j'ai passé 2026 à construire une plateforme qui apprend aux gens à devenir drôles avec les techniques du stand-up pro.
> Ça fait un angle d'épisode un peu différent : pas un coach en développement perso, pas un humoriste professionnel — quelqu'un qui a construit des agents IA pour analyser les vannes de Fary et les rendre applicables au quotidien.
> Si ça t'intéresse, je suis dispo pour 30-45 min. Je ne mâche pas mes mots et j'arrive avec des exemples drôles.

**CTA** : "Dis-moi si tu veux un brief de 5 lignes sur les angles possibles."
**Anti-patterns** : pas de "on pourrait collaborer", pas de proposition de rémunération, ne pas envoyer si l'épisode n'est pas dans le scope du podcast.

### Template D — Annuaires SaaS (soumission directe, pas de pitch humain)

**Description standard** (réutilisable partout) :
> Deviens-marrant.fr — Plateforme d'apprentissage de l'humour et de la répartie par les techniques du stand-up professionnel. 290+ vannes analysées, 80+ vidéos décortiquées, 3 parcours structurés, contenu quotidien généré par IA. Pour les 18-40 ans qui veulent maîtriser l'humour du quotidien — machine à café, soirées, dates, réunions.
> Catégories : EdTech, Personal Development, Humor, Social Skills.

**Anti-patterns** : pas de description identique copiée à l'identique si la plateforme détecte les doublons (variante légère par plateforme). Pas de soumission sur des annuaires avec DA = 0 ou avec mentions de "link farms".

### Template E — Échanges éditoriaux

**Subject** : Une ressource pour compléter ton article sur [sujet]

**Corps** :
> Salut [Prénom],
> Ton article sur [sujet] tombe pile sur une question que mes utilisateurs posent tout le temps.
> On a publié [lien article pillar] qui va plus loin sur le volet pratique — exercices concrets, techniques de stand-up appliquées. Si tu penses que ça apporte de la valeur à tes lecteurs, je serais ravi que tu le mentionnes.
> Pas d'échange obligatoire — juste une suggestion si c'est pertinent.

**CTA** : pas de CTA agressif. La proposition se suffit.
**Anti-patterns** : ne jamais proposer un échange de liens dans ce template — c'est un risque Google Penguin. La réciprocité vient naturellement ou pas.

---

## 4. Glossaire DA/DR/UR pour le système prompt CEO

> Ce bloc est conçu pour être injecté dans le system prompt CEO (module backlinks) en cache. ~800 tokens stables.

**Domain Authority (DA)** — Métrique Moz (0-100) qui prédit la capacité d'un domaine à ranker sur Google. Calculée sur la qualité et la quantité des backlinks entrants. DA > 40 = site établi, DA > 70 = site très autoritaire. Non utilisée directement par Google — indicateur proxy.

**Domain Rating (DR)** — Métrique Ahrefs (0-100), équivalent du DA mais basée uniquement sur le profil de backlinks. Plus précise que le DA selon les SEOs. Indisponible sans abonnement Ahrefs — utiliser DA Moz (API gratuite limitée) ou estimation GSC.

**URL Rating (UR)** — Métrique Ahrefs pour une URL spécifique (pas le domaine entier). Utile pour évaluer la force d'une page source, pas seulement du domaine. Proxy : compter le nombre de domaines référents sur la page cible.

**Anchor text** — Texte cliquable du lien. Trois types : exact-match ("devenir drôle"), branded ("deviens-marrant.fr"), générique ("ce site"). Un profil sain mélange les trois — un profil avec 80%+ d'anchors exact-match est un signal Penguin.

**Dofollow** — Lien qui passe du "link juice" (autorité) au domaine cible. Par défaut, tous les liens sont dofollow. Valeur SEO directe.

**Nofollow** — Attribut `rel="nofollow"` qui indique à Google de ne pas suivre le lien. Pas de link juice direct, mais trafic réel et signal de diversité naturelle. Reddit, Wikipedia, la plupart des forums = nofollow. À ne pas rejeter — un profil 100% dofollow est suspect.

**White-hat** — Techniques approuvées par Google : contenu de qualité, pitchs éditoriaux légitimes, annuaires de qualité, relations presse. Résultats lents mais durables.

**Black-hat** — Techniques interdites par Google : achat de liens, PBN, cloaking, spammy comments en masse. Résultats rapides mais risque de pénalité manuelle (déindexation) irréversible.

**Link velocity** — Vitesse d'acquisition de nouveaux backlinks. Une montée brutale (100 liens en 1 semaine pour un site jeune) est un signal de manipulation. Objectif CEO : croissance linéaire et progressive.

**Referring domains** — Nombre de domaines uniques qui pointent vers le site (différent du nombre brut de backlinks). 10 liens de 10 domaines différents > 10 liens du même domaine. Métrique principale dans GSC (section "Liens").

---

## 5. Workflow tracking via DB CeoBacklink + GSC

### Schéma Prisma proposé

```prisma
model CeoBacklink {
  id            String   @id @default(cuid())
  source        BacklinkSource
  domain        String
  url           String?
  pageTitle     String?
  anchorText    String?
  da            Int?
  daReportedBy  String?  // "moz_free" | "hypothese" | "gsc"
  linkType      String?  // "dofollow" | "nofollow" | "unknown"
  status        BacklinkStatus @default(PITCHED)
  pitchedAt     DateTime @default(now())
  repliedAt     DateTime?
  acquiredAt    DateTime?
  verifiedAt    DateTime?
  notes         String?
  relevanceScore Int?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum BacklinkSource {
  HARO
  BLOGGER
  PODCAST
  DIRECTORY
  EXCHANGE
  ORGANIC
}

enum BacklinkStatus {
  PITCHED
  REPLIED
  ACQUIRED
  REJECTED
  EXPIRED
}
```

### Workflow opérationnel

1. **Pitch envoyé** → INSERT `CeoBacklink` avec `status: PITCHED`, `source`, `domain`, `pitchedAt`, `relevanceScore`
2. **Réponse reçue** → UPDATE `status: REPLIED`, `repliedAt`. Si négatif → `status: REJECTED`
3. **Lien confirmé** → UPDATE `status: ACQUIRED`, `acquiredAt`, `url`, `anchorText`, `linkType`
4. **Vérification acquisition** : le CEO fait un WebFetch sur l'URL cible, cherche `deviens-marrant.fr` dans le HTML. Si trouvé → `verifiedAt = now()`. Si absent après 30 jours → re-vérification × 1 → sinon `notes: "lien retiré"`
5. **Estimation DA** : en l'absence d'Ahrefs/Semrush, utiliser l'API Moz Free (10 requêtes/mois) pour les acquisitions confirmées uniquement. Pour les pitchs : `daReportedBy: "hypothese"`

### Reporting hebdomadaire automatique (chaque lundi, injecté dans le brief CEO)

- Pitchs envoyés semaine N : count(`status: PITCHED`, `pitchedAt > -7j`)
- Taux de réponse : count(`REPLIED`) / count(`PITCHED`) × 100
- Backlinks acquis semaine N : count(`ACQUIRED`, `acquiredAt > -7j`)
- DA moyen acquis (cumulé) : avg(`da`) WHERE `status: ACQUIRED`
- Top 3 acquisitions : domaines avec DA le plus élevé acquis en N-4 semaines

### Frequency cap (obligatoire — anti-spam)

- **Max 50 pitchs/semaine** toutes catégories confondues (cap dur dans le cron)
- **Max 3 pitchs/domaine/an** : vérification `CeoBacklink WHERE domain = X AND pitchedAt > -365j AND count > 2` → skip
- **Délai minimum entre pitchs** : 72h après le dernier pitch d'un même domaine
- **Cap par catégorie/semaine** : 10 presse, 15 blogueurs, 10 podcasts, 10 annuaires, 5 échanges

---

## 6. KPI cibles 6 mois

| Métrique | M1 | M3 | M6 |
|---|---|---|---|
| Pitchs envoyés cumulés | 50 | 200 | 500 |
| Taux de réponse [HYPOTHÈSE] | 5-10% | 8-15% | 10-20% |
| Backlinks acquis cumulés [HYPOTHÈSE] | 5-10 | 20-40 | 60-100 |
| DA moyen acquis [HYPOTHÈSE] | 15-25 | 25-40 | 35-55 |
| Referring domains uniques [HYPOTHÈSE] | 5 | 20 | 50+ |
| Mentions organiques (sans pitch) [HYPOTHÈSE] | 0-2 | 3-8 | 10-20 |

**Impact SEO estimé** [HYPOTHÈSE] : 50 referring domains avec DA moyen 35 en 6 mois → gain estimé de 20-40% de trafic organique supplémentaire (basé sur corrélations secteur EdTech FR, source : études Moz 2025). Variable principale : qualité des domaines, pas le volume brut.

**Coût par backlink acquis** [HYPOTHÈSE] : ~500-1 000 tokens Sonnet par pitch complet (filtrage + génération + email). Avec un taux d'acquisition de 15%, coût ≈ 0,05-0,10€ par backlink acquis. Negligeable vs valeur SEO long terme.

**Mentions naturelles** : l'objectif M6 (10-20 mentions organiques) dépend principalement de la qualité du contenu et de la notoriété du catalogue. Les articles piliers ("comment devenir drôle", "avoir de la répartie") sont déjà positionnés pour générer des citations naturelles dès qu'ils atteignent le Top 5 Google.

---

## 7. Anti-patterns SEO — Red lines CEO

### PBN (Private Blog Networks)
Réseau de sites bidons créés pour se linker mutuellement. Détection Google : empreinte IP, WHOIS, similarité de contenu, hosting commun. Pénalité : déindexation manuelle irréversible. **Détection auto CEO** : tout domaine avec `daReportedBy = "gsc"` et `da < 5` ET `url` contenant des patterns suspects → flag manuel.

### Achat de liens
Tout lien échangé contre paiement (direct ou indirect) viole les Google Webmaster Guidelines. En France, le droit de la publicité impose également une mention "lien sponsorisé" — le non-respect cumule une pénalité Google + un risque DGCCRF. **Règle CEO** : zéro transaction financière liée à un backlink, même masquée en "partenariat éditorial".

### Spammy comments à grande échelle
Poster des liens en commentaires de blogs de façon non contextualisée. Liens nofollow depuis 2005, détectés par Google Penguin, ban probable par les modérateurs. **Cap CEO** : 0 commentaire automatisé — les commentaires sont réservés à la gestion des inbound (DMs, réponses posts).

### Pitch identique en masse (anti-personnalisation)
Envoyer le même email à 100 journalistes sans adaptation = spam presse. Taux d'ouverture < 5%, risque de signalement spam Resend (bounce rate + spam reports → suspension compte). **Règle CEO** : chaque pitch inclut au minimum [Prénom] + [titre article/podcast cible] + [angle spécifique au sujet de la cible].

### Cibles douteuses
Domaines avec `da = 0`, sites de spam connus (répertoriés dans des spam lists), sites dont le seul contenu est des annuaires de liens. **Détection auto** : avant tout pitch, le CEO vérifie `CeoBacklink WHERE domain = X AND status = REJECTED AND notes LIKE "%spam%"` → skip automatique.

### Ratio dofollow/nofollow déséquilibré
Un profil 100% dofollow est anormal (les liens naturels incluent Reddit, Wikipedia, forums = nofollow). Google le détecte. **Objectif sain** : 60-70% dofollow, 30-40% nofollow. Les annuaires et communautés nofollow ont leur rôle dans l'équilibre.

### Anchor text suroptimisé (anti-Penguin)
Plus de 30% d'anchors exact-match ("comment devenir drôle") = signal de manipulation. **Règle CEO** : dans tous les pitchs, demander un anchor branded ("deviens-marrant.fr") ou générique ("cette ressource") — ne jamais dicter un anchor exact-match à un journaliste.

### Source automatisée RSS Connectively / scraping

[HYPOTHÈSE à vérifier @legal] : le scraping de Connectively (ex-HARO) est soumis aux CGU de la plateforme. L'option Zapier webhook (si Connectively expose un flux officiel) est préférable juridiquement. À valider avant implémentation en Phase 5.

---

## Handoffs

**Pour @copywriter Phase 2 — 5 pitchs canoniques (1 par catégorie)**

Produire 5 pitchs réels (pas templates) avec : voix complice + tutoiement + 1 chute obligatoire + CTA précis. Cibles exactes suggérées :
- A (presse) : Slate.fr — angle "Peut-on apprendre à être drôle ?"
- B (blogueur) : Blog Cours Florent — angle ressources stand-up débutant
- C (podcast) : Sans Permission — angle "EdTech niche absurde devenue sérieuse"
- D (annuaire) : Product Hunt — description + tagline pour le lancement
- E (échange éditorial) : Welcome to the Jungle — article "briser la glace en entretien"

**Pour @fullstack Phase 5 — Checklist migration haro-agent.ts**

- [ ] Créer `apps/web/src/lib/ai/agents/ceo-backlinks.ts` avec les 9 fonctions/constantes migrées (voir section 1)
- [ ] Renommer les types : `HaroOpportunity` → `BacklinkOpportunity`, `HaroResponse` → `BacklinkResponse`, `HaroFilterResult` → `BacklinkFilterResult`
- [ ] Ajouter le modèle `CeoBacklink` + enums `BacklinkSource` + `BacklinkStatus` dans `prisma/schema.prisma`
- [ ] Lancer `npx prisma migrate dev --name add_ceo_backlink`
- [ ] Créer `apps/web/src/app/api/cron/ceo-backlinks/route.ts` (remplace haro/route.ts)
- [ ] Supprimer `apps/web/src/lib/ai/agents/haro-agent.ts`
- [ ] Supprimer `apps/web/src/app/api/cron/haro/route.ts`
- [ ] Migrer `apps/web/src/__tests__/lib/haro-agent.test.ts` → `ceo-backlinks.test.ts`
- [ ] Grep `haro-agent|runHaroPipeline|processHaroOpportunities|HaroOpportunity` dans tout le repo → corriger les imports résiduels
- [ ] Mettre à jour `CLAUDE.md` : supprimer section "Agent HARO", ajouter section "Module backlinks CEO"
- [ ] Ajouter le cron `ceo-backlinks` dans le tableau de référence `CLAUDE.md` section Crons

**Pour @legal (en parallèle)**

Points à valider avant Phase 5 :
1. **Envoi direct journaliste** (Phase 4) : l'envoi d'emails non sollicités à des journalistes est-il couvert par l'intérêt légitime presse (art. 6(1)(f) RGPD) sans opt-in explicite ? Préciser si une mention "ne plus recevoir d'emails" est obligatoire.
2. **Scraping Connectively/SourceBottle** : vérifier les CGU de chaque plateforme — scraping autorisé ou non ? L'option Zapier webhook officiel est-elle disponible et légalement propre ?
3. **Frequency cap CNIL** : le cap de 50 pitchs/semaine est-il suffisant pour ne pas tomber sous la définition de "prospection commerciale" soumise à opt-in (L34-5 CPCE) ? Les journalistes/blogueurs sont-ils une catégorie exemptée ?
4. **Mentions dans annuaires** : la soumission automatisée sur des annuaires nécessite-t-elle une acceptation des CGU par un humain ? Risque contractuel si un agent IA coche une case d'acceptation.
