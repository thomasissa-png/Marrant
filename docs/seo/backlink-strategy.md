# Stratégie backlinks — deviens-marrant.fr

> Livrable produit par @growth — 2026-04-03
> Budget acquisition : 0€. Tout est organique et automatisable.
> Contexte : site jeune (début 2026), domaine avec peu ou pas de backlinks, fondateur solo + agents IA.

---

## Sommaire

1. [Diagnostic — état actuel](#1-diagnostic--état-actuel)
2. [Canaux de backlinks](#2-canaux-de-backlinks)
3. [Quick wins — 30 jours](#3-quick-wins--30-jours)
4. [Pipeline automatisé](#4-pipeline-automatisé)
5. [Contenu existant comme aimant à backlinks](#5-contenu-existant-comme-aimant-à-backlinks)
6. [Métriques et tracking](#6-métriques-et-tracking)
7. [Ce qu'on ne fait pas et pourquoi](#7-ce-quon-ne-fait-pas-et-pourquoi)
8. [Hypothèses à valider](#8-hypothèses-à-valider)

---

## 1. Diagnostic — état actuel

### Contexte backlinks

- **Domaine** : deviens-marrant.fr, enregistré et en production depuis début 2026
- **Backlinks actuels** : [HYPOTHÈSE : proche de zéro — aucune donnée Ahrefs/Majestic disponible. À vérifier via Ahrefs Webmaster Tools (gratuit) ou Google Search Console section "Liens".]
- **Indexation** : Bing signale explicitement le manque de backlinks comme problème. Google Search Console montre ~30+ pages en production mais indexation partielle.
- **Autorité de domaine** : [HYPOTHÈSE : DR/DA probablement 0-5 pour un domaine neuf sans backlinks.]
- **Contenu existant** : 27+ articles blog SEO, 290+ vannes, 60+ conseils, 80+ vidéos analysées, 3 parcours, 1 quiz humour — richesse de contenu disponible pour appâter des liens.
- **Pipeline social** : Twitter, LinkedIn, Instagram en production (Buffer) — canaux pour promouvoir le contenu linkable.
- **Agent HARO existant** : `lib/ai/agents/haro-agent.ts` opérationnel, mais la source d'opportunités HARO/Connectively n'est pas automatisée (manque le scraper).

### Pourquoi les backlinks sont critiques pour deviens-marrant.fr maintenant

1. **Signal de confiance pour les domaines jeunes.** Google et Bing accordent un bonus d'autorité aux sites avec backlinks de qualité. Sans backlinks, même un contenu excellent peut rester invisible 6-12 mois (sandbox effect).
2. **Bing le dit explicitement.** D'après le diagnostic d'indexation du 01/04/2026, Bing indique que le manque de backlinks est une raison directe de la sous-indexation.
3. **Cercle vertueux.** Les premiers backlinks amènent les premiers visiteurs organiques, qui génèrent des signaux comportementaux (temps sur site, retours), qui renforcent le positionnement, qui attirent de nouveaux liens.
4. **Niche sans concurrent direct.** Il n'existe pas de plateforme équivalente en français — les journalistes et créateurs de contenu qui cherchent une source sur "apprendre l'humour" n'ont pas d'alternative sérieuse à citer. C'est une fenêtre d'opportunité à exploiter maintenant.
5. **Le contenu est prêt.** Avec 27 articles SEO en ligne, il y a déjà de la matière à linker. La priorité est de faire connaître ce contenu aux bonnes personnes.

---

## 2. Canaux de backlinks

### Canal A — Annuaires thématiques francophones (impact : moyen, faisabilité : très haute)

**Comment ça marche.** Les annuaires web français (WebRankInfo, 2en1, Keldirectory, Faitesvousconnaitre, etc.) acceptent la soumission gratuite de sites. La plupart ont une section "Humour / Loisirs" directement pertinente. Ces liens ont un DA/DR faible (5-20), mais leur valeur principale est de signaler au bot Google/Bing qu'un domaine existe, a une thématique cohérente, et est cité sur d'autres sites.

**Cibles prioritaires (Humour + Loisirs + EdTech FR) :**

| Annuaire | Catégorie cible | Validation | Notes |
|---|---|---|---|
| WebRankInfo (webrankinfo.net) | Humour | Manuelle, gratuite | 80 000+ sites — le plus connu en FR |
| 2en1 (cbcreations.fr) | Humour et blagues | Gratuite | Section exacte "Humour et blagues" |
| Keldirectory.com | Loisir et culture | Gratuite | |
| Faitesvousconnaitre.com | Loisirs / Humour | Gratuite | |
| Phortail.org | Humour | Manuelle | |
| Webfr.org | Éducation / Loisirs | Gratuite | Liste 35 annuaires actifs en 2026 |
| Ebullition-communication.fr/annuaires | Éducation | Gratuite | |

**Comment automatiser.** Action one-shot : créer un script qui soumet le profil du site (nom, URL, description, catégorie) aux 7-10 annuaires en une seule session. La soumission est manuelle sur chaque site, mais le contenu (description, catégories) est préparé à l'avance par un agent IA. Durée estimée : 45-90 minutes pour Alex. Action non répétable (sauf nouveaux annuaires).

**Volume estimé.** 8-12 liens en 30 jours (1 par annuaire accepté).

**Qualité estimée.** DA 5-20. Faible autorité individuelle, mais signal collectif utile pour un domaine neuf.

**Effort humain.** 3/5 — Alex doit copier-coller et valider chaque soumission manuellement. L'agent prépare le texte, Alex exécute.

**Texte de description à préparer une fois (réutilisé partout) :**
> Deviens-marrant.fr — La première plateforme française pour apprendre à devenir drôle. 290+ vannes, 60+ conseils de stand-up, parcours structurés, contenu quotidien renouvelé. Pour les 20-35 ans qui veulent maîtriser l'humour du quotidien.

→ **Action** : @growth prépare le texte, Alex exécute les soumissions en une session (< 2h).

### Canal B — Digital PR / Expertise presse francophone (impact : élevé, faisabilité : moyenne)

**Comment ça marche.** Les journalistes et blogueurs francophones cherchent des experts à citer dans leurs articles. En se positionnant comme "l'expert francophone de l'humour et de la répartie", Alex peut obtenir des mentions et backlinks sur des médias avec DA 40-80 (Numerama, Slate.fr, Madmoizelle, L'Obs, 20minutes, etc.).

**L'agent HARO existant est le point de départ.** Le pipeline est déjà codé dans `lib/ai/agents/haro-agent.ts`. Il manque uniquement la source d'opportunités (le scraper). Deux options :

**Option 1 — Zapier/Make + SourceBottle (le plus simple, ~15$/mois ou gratuit avec limite)**
SourceBottle accepte les inscriptions gratuites d'experts et envoie des requêtes journalistes par email. Filtre "Humour / Art de vivre / Développement personnel". L'agent HARO existant peut traiter ces emails automatiquement.

**Option 2 — Scraper Connectively manuellement (0€, mais action hebdomadaire d'Alex)**
Connectively (ex-HARO, racheté par Featured.com en 2025) envoie des digests par email. Alex s'inscrit → reçoit les digests → l'agent HARO génère une réponse → Alex copie-colle. Effort : 2x/semaine, 10 minutes par session.

**Option 3 — JournalRequest + ProfNet (en anglais, pour les médias franco-anglais)**
Pour des backlinks sur des médias internationaux couvrant la France. Moins pertinent pour un site 100% FR.

**Médias cibles francophones prioritaires (par angle) :**

| Angle article | Média cible | Section cible | DA estimé |
|---|---|---|---|
| "Apps pour retrouver confiance en soi" | Madmoizelle.com | Bien-être / Lifestyle | ~60 |
| "Start-up EdTech françaises innovantes" | Maddyness.com | EdTech | ~65 |
| "Apprendre à être drôle : mythe ou réalité ?" | Slate.fr | Culture / Société | ~75 |
| "Le rire, outil de management ?" | LesEchos.fr | Management | ~80 |
| "Comment améliorer sa confiance en soirée" | L'Etudiant.fr | Vie étudiante | ~60 |
| "Développement personnel : les nouvelles apps" | Numerama.com | Lifestyle tech | ~70 |
| "Humour et santé mentale" | Psychologies.com | Bien-être | ~65 |
| "Startup IA française originale" | FrenchWeb.fr | Tech/startups | ~65 |

**Contenu d'expertise à préparer pour Alex (utilisable dans toute réponse presse) :**
- "Je suis Alex, fondateur de deviens-marrant.fr, la première plateforme française de formation à l'humour et à la répartie. Notre approche s'inspire des techniques de stand-up (Paul Mirabel, Fary, Roman Frayssinet) pour les rendre accessibles au quotidien."
- 3 stats utilisables : "290+ vannes dans le catalogue", "80+ vidéos de stand-up analysées pédagogiquement", "3 parcours structurés de 3 à 6 semaines"
- Bio courte (50 mots) + bio longue (150 mots) → à rédiger par @copywriter

**Comment automatiser.** L'agent HARO existant gère déjà la génération de réponse et l'envoi par email. Ce qu'il manque : un trigger qui alerte Alex quand une opportunité pertinente arrive (Zapier/Make + SourceBottle, ou digest email hebdo). Coût : 0€ avec SourceBottle gratuit.

**Volume estimé.** 1-3 mentions presse/mois si Alex consacre 20 min/semaine aux digests.

**Qualité estimée.** DA 40-80 selon le média. Ce sont les liens les plus précieux de la stratégie.

**Effort humain.** 2/5 — L'agent génère le texte, Alex valide et envoie en < 5 min par réponse.

→ **Action** : s'inscrire sur SourceBottle.com (gratuit) + vérifier que l'agent HARO reçoit bien les emails + préparer la bio Alex (déléguer à @copywriter).

### Canal C — Communautés et forums francophones (impact : moyen, faisabilité : haute)

**Comment ça marche.** Participer à des communautés en ligne où les personas (Yanis, Sophie, Marc) posent leurs vraies questions, et répondre en apportant une valeur réelle (pas juste un lien). Un lien Reddit en nofollow ne passe pas de jus SEO direct, mais il génère du trafic qualifié, des signaux comportementaux positifs (temps sur site, retours), et parfois des citations sur d'autres sites.

**Communautés cibles prioritaires :**

| Communauté | Persona servi | Type de lien | Sujets cibles |
|---|---|---|---|
| r/france (Reddit) | Tous | nofollow | "comment être plus drôle", "répartie", "confiance en soi" |
| r/developpementpersonnel (Reddit) | Marc + Sophie | nofollow | "humour et confiance", "techniques sociales" |
| r/etudiantsenFrance (Reddit) | Yanis | nofollow | "vie étudiante", "chambrages", "faire rire" |
| Quora.fr | Sophie + Marc | dofollow possible | Questions "comment devenir drôle", "avoir de la répartie" |
| Forum Hardware.fr (section détente) | Yanis | nofollow | |
| Discord francophone stand-up/impro | Tous | — | Présence de marque, pas de lien SEO direct |
| LinkedIn (articles + commentaires) | Sophie + Marc | nofollow | "humour en entreprise", "confiance management" |

**Règle absolue — ne pas spammer.** Un commentaire qui commence par "viens voir mon site" = banni. La stratégie : répondre à une vraie question avec une vraie réponse complète (200-300 mots), puis mentionner deviens-marrant.fr comme ressource complémentaire en fin de message. Ratio : 80% de valeur, 20% de promotion.

**Comment automatiser.** Veille automatique : configurer des alertes Google sur les termes-clés ("comment devenir drôle", "avoir de la répartie", "manque de confiance humour", "blague machine à café"). Quand une alerte arrive, l'agent social génère un brouillon de réponse que Alex valide en < 3 min.

Implémentation concrète :
1. Configurer 8 alertes Google Alerts sur les termes cibles
2. Les alertes arrivent par email à Alex
3. Alex transfère à un webhook → l'agent génère une réponse pertinente
4. Alex copie-colle sur la plateforme concernée (ne peut pas être 100% auto — chaque plateforme exige un compte humain)

**Volume estimé.** 3-8 liens nofollow/mois si Alex consacre 15 min/semaine.

**Qualité estimée.** DA 30-70 (Reddit FR = DA ~94, Quora = DA ~90 — mais nofollow). Impact SEO direct faible, mais trafic et signaux comportementaux réels.

**Effort humain.** 2/5 — L'agent prépare les réponses, Alex poste (5-10 min/semaine).

→ **Action** : créer 8 alertes Google Alerts + s'inscrire sur Quora.fr + rédiger un profil Alex sur ces plateformes.

### Canal D — Lancement sur plateformes produit (impact : moyen-élevé, faisabilité : haute)

**Comment ça marche.** Les plateformes de lancement de produits (Product Hunt, Indie Hackers, BetaList, etc.) génèrent des backlinks dofollow sur des domaines à fort DA, un pic de trafic qualifié (fondateurs, early adopters), et parfois des reprises dans des newsletters tech.

**Plateformes cibles :**

| Plateforme | DA estimé | Type de lien | Effort | Timing |
|---|---|---|---|---|
| Product Hunt (producthunt.com) | ~90 | dofollow profil | Moyen — 1 journée de lancement | Planifier avec communauté |
| Indie Hackers (indiehackers.com) | ~85 | dofollow posts | Faible — post d'intro produit | Immédiatement |
| BetaList (betalist.com) | ~70 | dofollow listing | Très faible — formulaire 10 min | Immédiatement |
| Microlaunch (microlaunch.net) | ~55 | dofollow | Très faible | Immédiatement |
| Uneed.best | ~50 | dofollow | Très faible | Immédiatement |
| StartupBase (startupbase.io) | ~45 | dofollow | Très faible | Immédiatement |
| There's An AI For That (theresanaiforthat.com) | ~70 | dofollow | Faible — outil IA francophone rare | Immédiatement |
| FuturePedia (futurepedia.io) | ~65 | dofollow | Faible | Immédiatement |

**Angle unique pour Product Hunt.** "Apprendre à être drôle avec l'IA — la première plateforme francophone de formation au stand-up." Le fait d'être un outil IA + EdTech + niche humour = combinaison rare qui génère de la curiosité. La langue française est aussi un différenciant sur PH (audience internationale curieuse des produits non anglophones).

**Indie Hackers en priorité.** La communauté IH est constituée de fondateurs qui partagent leurs histoires. Un post "How I automated humor coaching with AI" (en anglais pour toucher l'audience IH) avec le lien vers deviens-marrant.fr = backlink DA 85 garanti + trafic qualifié de fondateurs curieux.

**There's An AI For That — opportunité immédiate.** Ce répertoire indexe les outils IA. Deviens-marrant.fr est une IA pour apprendre l'humour — catégorie quasiment vide en français. Soumission en 10 minutes, backlink DA ~70.

**Comment automatiser.** Action one-shot pour les petites plateformes (BetaList, Microlaunch, Uneed, StartupBase, FuturePedia, TAAFT) : l'agent prépare le pitch en anglais et français + screenshots → Alex soumet en une session de 2h.

Product Hunt et Indie Hackers nécessitent une préparation plus longue (page PH, engagement communauté) — à planifier pour mois 2 une fois les quick wins one-shot épuisés.

**Volume estimé.** 6-10 liens dofollow DA 40-90 en une session unique.

**Qualité estimée.** DA 40-90. Ce sont parmi les meilleurs liens gratuits disponibles pour un site neuf.

**Effort humain.** 1/5 pour les petites plateformes (soumission 10 min par plateforme). 3/5 pour Product Hunt (préparation page + engagement).

→ **Action immédiate** : soumettre sur BetaList, Microlaunch, Uneed, StartupBase, TAAFT, FuturePedia (< 3h total, Alex). Puis planifier Product Hunt + Indie Hackers pour le mois 2.

### Canal E — Partenariats contenu avec créateurs FR humour/stand-up (impact : élevé, faisabilité : moyenne)

**Comment ça marche.** Les créateurs YouTube, Twitch, et blogueurs francophones dans les niches humour, développement personnel, vie étudiante et stand-up ont des audiences qui correspondent exactement aux personas (Yanis, Sophie, Marc). Un échange de valeur (ils mentionnent deviens-marrant.fr en échange de quelque chose d'utile pour eux) génère des backlinks sur des domaines thématiquement pertinents + du trafic direct qualifié.

**Ce qu'on peut offrir sans budget :**
- Accès premium gratuit à vie (coût marginal zéro)
- Une analyse personnalisée de leur technique stand-up (rapport PDF automatisé par l'agent)
- La création d'un contenu exclusif pour leur audience (un "top 10 vannes de [leur univers]" signé deviens-marrant.fr)
- Une mention croisée sur les réseaux sociaux (audience zéro actuellement, valeur limitée — à faire en mois 3-4)

**Cibles de partenariat prioritaires :**

| Type de créateur | Exemple de profil | Plateforme | DA potentiel |
|---|---|---|---|
| Chaîne YouTube stand-up pédagogique | Chaînes analysant les techniques des humoristes | YouTube (DA ~100 nofollow + site web dofollow possible) | 20-50 (site perso) |
| Blogueur développement personnel FR | Blog vie étudiante, confiance en soi | WordPress blog FR | 20-40 |
| Prof en ligne / e-learning | Udemy FR, OpenClassrooms communauté | Forums e-learning | 30-60 |
| Podcasteur humour/culture FR | Podcast Spotify + show notes avec liens | podcasteur.fr type | 20-40 |
| Journaliste étudiant / magazine fac | Sites journaux étudiants (DA 20-40) | .edu FR ou sites fac | 20-40 |

**Angle d'approche (email froid automatisé) :**
Sujet : "Un outil gratuit pour toi + tes abonnés adoreraient ça"
Corps : "Je suis Alex, j'ai construit la première plateforme en ligne pour apprendre l'humour du quotidien. J'offre un accès premium gratuit à vie en échange d'une mention dans un de tes prochains contenus. Aucune obligation de faire une review — juste mentionner que ça existe si tu penses que ça peut servir tes abonnés."

**Comment automatiser.** L'agent outreach génère des emails personnalisés à partir d'une liste de créateurs (scraping éthique de chaînes YouTube + blogs + podcasts FR via leurs pages "contact" ou email public). Séquence : email d'intro → relance J+7 → stop.

Pipeline :
1. Agent scrape les contacts de 50 créateurs cibles (chaînes YouTube FR humour, blogs dev perso, podcasters)
2. Agent génère un email personnalisé par créateur (mentionne leur contenu récent)
3. Alex valide le batch en une fois
4. Envoi via Resend (déjà en place)

Limites : scraping éthique uniquement (emails publics sur leurs sites). Pas d'achat de listes.

**Volume estimé.** 3-8 liens de qualité/mois si 50 emails envoyés → taux de réponse ~10-15% [HYPOTHÈSE — à mesurer sur les premiers envois].

**Qualité estimée.** DA 20-50 (sites personnels de créateurs). Plus précieux que les annuaires car thématiquement pertinents.

**Effort humain.** 2/5 — Alex valide le batch d'emails (15 min), l'agent fait le reste.

→ **Action** : construire la liste de 50 créateurs cibles + créer le template email + lancer le premier batch (mois 1).

### Canal F — Réutilisation du contenu existant (link bait natif)

**Comment ça marche.** Certains formats de contenu sont "naturellement linkables" — des journalistes, blogueurs et créateurs les citent spontanément parce que c'est utile pour leur propre audience. L'objectif est de transformer le contenu existant de deviens-marrant.fr en ressources que d'autres veulent citer.

**Actifs linkables existants à valoriser :**

**1. Le quiz d'humour ("Quel type d'humouristez-vous ?")**
→ Format test = très partageable. Les blogueurs lifestyle, développement personnel et magazine fac adorent citer des tests. Angle : "Découvrez votre style d'humour" + résultats personnalisés. Action : s'assurer que le quiz a une URL partageable + une image OG attractive. Citer proactivement dans les réponses presse et forums.

**2. Les articles pillar SEO (candidats au lien naturel)**
Les articles avec des données ou frameworks uniques sont les plus linkables :
- `comment-devenir-drole` — le guide de référence FR sur le sujet. Cible les sites dev perso et humour.
- `storytelling-drole-5-structures` — framework unique (5 techniques nommées sur humoristes). Les profs de communication adorent citer des frameworks.
- `timidite-et-humour` — angle santé mentale + humour = cible les médias bien-être (Psychologies.com, Doctissimo).
- `blagues-travail-faire-rire-pro` — cible les médias RH et management.

**3. Le catalogue de vannes (290+)**
→ Les sites de blagues FR sont nombreux mais peu pédagogiques. Proposer à des blogs "fun" ou "culture geek" FR de citer le catalogue. Format : "Pour trouver des blagues classées par situation, essayez deviens-marrant.fr".

**4. Les analyses vidéo stand-up**
→ 80+ vidéos analysées pédagogiquement = ressource unique. Les enseignants de rhétorique, les coachs de prise de parole, les formateurs en communication peuvent citer ces analyses. Angle : "Les meilleures vidéos pour apprendre les techniques de stand-up".

**Création d'un asset spécifiquement conçu pour le link bait :**

**"L'Étude Humour FR 2026" — mini-rapport de 1-2 pages**
Concept : analyser les 290 vannes du catalogue pour extraire des patterns. Exemple : "Les 5 thèmes les plus drôles en France en 2026", "Le timing moyen d'une vanne qui marche (X mots)", "Quelles catégories font le plus rire les 20-35 ans". Format PDF + page web. C'est le type de contenu que les journalistes citent avec un lien.
Automatisation : l'agent analyse le catalogue → génère un rapport → @copywriter rédige le format publiable.

**Comment promouvoir les assets linkables.** Chaque fois qu'Alex répond à une question journaliste (Canal B), il envoie un lien vers l'article pillar le plus pertinent. Chaque post LinkedIn cite un article avec "Lire la suite". Les partenaires créateurs (Canal E) reçoivent les articles en avant-première.

→ **Action** : vérifier que le quiz a une URL partageable + préparer "L'Étude Humour FR 2026" (déléguer analyse catalogue à un agent).

### Tableau de synthèse des canaux

| Canal | Impact SEO | Facilité | DA typique | Liens/mois | Effort Alex | Automatisable ? |
|---|---|---|---|---|---|---|
| A — Annuaires FR | Faible-moyen | Très haute | 5-20 | 8-12 (one-shot) | 3/5 | Partiellement (texte préparé par agent) |
| B — Digital PR presse | Élevé | Moyenne | 40-80 | 1-3 | 2/5 | Oui (agent HARO existant) |
| C — Forums/Reddit | Moyen | Haute | 30-94 (nofollow) | 3-8 | 2/5 | Partiellement (alertes + agent brouillon) |
| D — Plateformes lancement | Élevé | Haute | 40-90 | 6-10 (one-shot) | 1-3/5 | Partiellement (agent prépare les pitches) |
| E — Partenariats créateurs | Élevé | Moyenne | 20-50 | 3-8 | 2/5 | Oui (agent outreach) |
| F — Link bait natif | Élevé (long terme) | Haute | Variable | Organique | 1/5 | Oui (contenu déjà en place) |

**Priorisation recommandée :**
1. **Mois 1** : Canal D (quick wins 6-10 liens dofollow DA 40-90) + Canal A (one-shot annuaires)
2. **Mois 1-2** : Canal B (activer SourceBottle + digests HARO) + Canal E (premier batch outreach)
3. **Mois 2-3** : Canal C (veille forums, 15 min/semaine) + Canal F (Étude Humour FR 2026)
4. **Mois 3+** : Product Hunt (préparation + lancement communauté)

---

## 3. Quick wins — 30 jours

Les 5 actions qui peuvent générer des backlinks dans les 30 prochains jours, sans pipeline complexe.

### QW1 — Soumettre sur 6 plateformes produit (< 3h, DA 40-90)

**Priorité absolue.** Six soumissions en une demi-journée, 6 à 10 liens dofollow garantis sur des domaines à haute autorité.

Liste des 6 plateformes (par ordre de priorité) :
1. **BetaList.com** — formulaire simple, lien dofollow DA ~70 → https://betalist.com/submit
2. **Uneed.best** — répertoire produits, gratuit, DA ~50 → https://www.uneed.best/submit-tool
3. **There's An AI For That (theresanaiforthat.com)** — outil IA unique en humour FR → https://theresanaiforthat.com/submit/
4. **FuturePedia.io** — répertoire outils IA → https://www.futurepedia.io/submit
5. **Microlaunch.net** — communauté indie hackers → https://microlaunch.net
6. **StartupBase.io** — annuaire startups → https://startupbase.io/submit

Contenu à préparer en 30 minutes (une fois, réutilisé partout) :
- Nom : "Deviens Marrant"
- URL : https://deviens-marrant.fr
- Tagline (en français) : "Apprendre à être drôle avec l'IA — 290+ vannes, parcours stand-up, contenu quotidien"
- Tagline (en anglais pour PH/BetaList) : "Learn to be funny with AI — France's first structured humor coaching platform"
- Description courte (100 mots) : réutilisable sur toutes les plateformes
- Screenshot ou logo : déjà disponible (voir `public/`)
- Catégories : EdTech, AI Tools, Productivity, Entertainment

→ **Déléguer la préparation du contenu à un agent (30 min). Alex soumet (~2h30).**

### QW2 — S'inscrire sur SourceBottle + activer l'agent HARO (< 30 min)

SourceBottle.com permet de s'inscrire gratuitement comme "source experte" dans la catégorie "Arts & Entertainment" ou "Education". Les journalistes envoient des requêtes par email, l'agent HARO existant génère la réponse.

Actions :
1. S'inscrire sur https://www.sourcebottle.com (gratuit)
2. Créer le profil "expert humour / stand-up FR"
3. Vérifier que l'agent HARO reçoit bien les emails sur l'adresse d'Alex
4. Tester le pipeline avec une vraie requête

→ **30 minutes. 0€. Premier lien presse possible dans les 2-4 semaines.**

### QW3 — Soumettre sur 8 annuaires FR (2h en une session)

Utiliser la description préparée pour QW1 et soumettre sur : WebRankInfo, 2en1, Keldirectory, Faitesvousconnaitre, Phortail, et 3 autres de la liste Webfr.org. 8-12 liens faible DA mais signaux de confiance pour domaine neuf.

→ **Alex exécute en 1-2h. Agent prépare les textes.**

### QW4 — Créer le profil Alex sur Indie Hackers (< 1h, DA ~85)

Indie Hackers accepte les posts de fondateurs sur leurs produits. Un post "Building France's first AI-powered humor coaching platform" avec le lien = backlink DA 85 quasi-garanti. Bonus : trafic qualifié de fondateurs curieux.

Structure du post (500-800 mots, en anglais pour l'audience IH) :
- Contexte : "French people learning stand-up comedy online, powered by AI"
- Le problème : pas de ressource structurée pour apprendre l'humour en français
- La solution : catalog de 290+ jokes, daily content, 3 learning paths
- Les métriques actuelles (honnêtes — site jeune)
- Le lien

→ **Agent rédige le post. Alex publie (< 15 min). Backlink DA 85 dans la journée.**

### QW5 — Répondre à 3 questions sur Quora.fr (1h/semaine pendant 4 semaines)

Quora.fr contient des questions comme "Comment avoir de la répartie ?", "Comment devenir drôle ?" avec 0 à 3 réponses existantes. Répondre avec une vraie expertise (300-400 mots) + lien en fin de réponse.

Requêtes à rechercher sur Quora.fr :
- "comment avoir de la répartie"
- "devenir drôle"
- "manque de confiance humour"
- "blagues machine à café"
- "répartie travail"

→ **Agent génère les brouillons de réponses. Alex poste (10-15 min par réponse). Liens nofollow DA ~90 avec trafic réel.**

### Résumé quick wins — ROI attendu en 30 jours

| Action | Temps Alex | Liens obtenus | DA typique | Priorité |
|---|---|---|---|---|
| QW1 — Plateformes produit | 3h (one-shot) | 6-10 dofollow | 40-90 | 1 — cette semaine |
| QW4 — Indie Hackers | 1h (one-shot) | 1 dofollow | 85 | 2 — cette semaine |
| QW2 — SourceBottle activation | 30 min | Premiers liens presse J+14 | 40-80 | 3 — cette semaine |
| QW3 — Annuaires FR | 2h (one-shot) | 8-12 dofollow faible DA | 5-20 | 4 — semaine 2 |
| QW5 — Quora FR | 1h/semaine | 3-6 nofollow | 90 (nofollow) | 5 — continu |

**Total mois 1 :** ~20-30 nouveaux backlinks. DA moyen estimé 30-40 sur le profil. Suffisant pour sortir de la zone "domaine neuf" aux yeux de Google/Bing.

---

## 4. Pipeline automatisé

### Architecture globale

L'objectif est de faire tourner 3 pipelines en parallèle, similaires aux pipelines social et SEO déjà en production.

```
PIPELINE BACKLINKS (mensuel)
│
├── Pipeline A — Digital PR (hebdomadaire, ~30 min/semaine Alex)
│   SourceBottle digest email
│   → haro-agent.ts (filtrage + génération réponse)
│   → Email à alex@deviens-marrant.fr (draft prêt à copier-coller)
│   → Alex envoie au journaliste (5 min max)
│
├── Pipeline B — Outreach créateurs (mensuel, ~15 min/mois Alex)
│   Agent scrape 50 créateurs FR (humour, dev perso, vie étudiante)
│   → Agent génère emails personnalisés (ton + référence contenu récent créateur)
│   → DB OutreachLog (créateur, statut, date, réponse)
│   → Alex valide le batch (15 min)
│   → Resend envoie les emails
│   → Relance automatique J+7 si pas de réponse
│
└── Pipeline C — Surveillance mentions (quotidien, 0 effort Alex)
    Google Alerts sur "deviens-marrant" + "deviens marrant" + "apprendre humour fr"
    → Si mention sans lien détectée → email à Alex (pour convertir mention en lien)
    → DB MentionLog (source, URL, statut lien)
```

### Pipeline A — Agent HARO v2 (mise à jour SourceBottle)

**État actuel.** L'agent `lib/ai/agents/haro-agent.ts` est opérationnel. Il reçoit des opportunités via webhook POST sur `/api/cron/haro`. Le manque : la source d'opportunités n'est pas automatisée.

**Solution immédiate sans code.** SourceBottle envoie des digests par email gratuits. Alex s'inscrit, reçoit les emails, transfère manuellement les requêtes pertinentes à l'agent (copier-coller dans un formulaire ou via un webhook). Coût : 0€.

**Solution automatisée (optionnelle, effort dev ~2h).** Configurer un forwarding d'email (Gmail → webhook) qui envoie automatiquement les digests SourceBottle à `/api/cron/haro`. L'agent filtre les opportunités pertinentes. Si score ≥ 5, envoie un draft à Alex. 0 effort hebdo pour Alex.

**Fichiers à modifier pour la mise à jour.**
- `lib/ai/agents/haro-agent.ts` — ajouter les catégories SourceBottle dans `filterRelevantOpportunities()`
- `app/api/cron/haro/route.ts` — aucun changement nécessaire, le webhook fonctionne déjà

**Topics à ajouter dans le filtre (96 existants + nouveaux) :**
- "humour", "stand-up", "comédie", "coaching humour"
- "répartie", "confiance en soi", "timidité"
- "EdTech", "e-learning", "formation en ligne"
- "intelligence artificielle + éducation"
- "développement personnel", "compétences sociales"

### Pipeline B — Outreach créateurs (nouveau — à développer)

**Spécifications techniques.**

Nouveau cron : `/api/cron/monthly-outreach` (1er du mois, après le cron monthly-videos)

```typescript
// Structure de la DB à ajouter dans schema.prisma
model OutreachContact {
  id          String   @id @default(cuid())
  name        String
  url         String
  email       String
  platform    String   // "youtube" | "blog" | "podcast" | "linkedin"
  niche       String   // "humour" | "devperso" | "etudiant" | "rh"
  contactedAt DateTime?
  replied     Boolean  @default(false)
  linkedBack  Boolean  @default(false)
  notes       String?
  createdAt   DateTime @default(now())
}
```

Workflow :
1. Agent scrape les pages "contact" des 50 créateurs de la liste cible (emails publics uniquement)
2. Agent génère un email personnalisé par créateur (mentionne leur dernier contenu public)
3. Resend envoie en batch (max 20/mois pour rester dans les bonnes pratiques)
4. Relance automatique J+7 si pas de réponse + pas de linkedBack
5. Si réponse positive → email à Alex avec instructions (envoyer l'accès premium)

**Note importante.** Cet agent nécessite ~2-3h de développement par @fullstack. Il peut être mutualisé avec des futurs besoins outreach (partenariats premium, guest posts).

### Pipeline C — Surveillance mentions (Google Alerts, 0 code)

**Sans développement.**
1. Créer 5 alertes Google Alerts :
   - "deviens-marrant.fr"
   - "deviens marrant" (site:* -site:deviens-marrant.fr)
   - "apprendre l'humour" (nouveau site)
   - "plateforme humour français"
   - "cours stand-up en ligne"
2. Alertes envoyées par email à Alex
3. Si mention sans lien : Alex contacte le site pour demander l'ajout du lien (stratégie "unlinked mentions" — taux de conversion ~20-30% selon les benchmarks du secteur [HYPOTHÈSE])

Automatisation possible (optionnelle) : un webhook peut parser les alertes et notifier dans un channel Slack ou Discord.

---

## 5. Contenu existant comme aimant à backlinks

### Actifs existants par potentiel de lien

**Tier 1 — Actifs immédiatement linkables (à promouvoir activement)**

| Contenu | URL | Pourquoi ça attire des liens | Audiences cibles |
|---|---|---|---|
| Quiz humour (type de profil) | /quiz ou similaire | Tests = très partagés sur blogs lifestyle et dev perso | Madmoizelle, blogs bien-être |
| Article "comment-devenir-drole" | /blog/comment-devenir-drole | Guide de référence FR — journalistes le citent quand ils traitent le sujet | Presse généraliste, blogs |
| Article "storytelling-drole-5-structures" | /blog/storytelling-drole-5-structures | Framework nommé sur 5 humoristes = citeable dans articles pédagogie | Profs de communication, coachs |
| Article "timidite-et-humour" | /blog/timidite-et-humour | Angle santé mentale + humour = cible médias bien-être | Psychologies.com, Doctissimo |
| Article "blagues-travail-faire-rire-pro" | /blog/blagues-travail-faire-rire-pro | Très ciblé RH/management | LesEchos, RH info, blogs RH |
| Catalogue 290+ vannes | /vannes | Ressource unique en FR avec catégories | Blogs "fun", sites humour |

**Tier 2 — Actifs à développer en link bait (effort modéré)**

**"L'Étude Humour FR 2026" (priorité haute)**

Concept : analyser les 290 vannes pour produire des insights statistiques inédits.
Angles possibles :
- "Les 5 catégories de blagues les plus efficaces en soirée selon 290 vannes analysées"
- "Combien de mots fait une vanne parfaite ? (analyse de notre catalogue)"
- "Les situations où l'humour marche le mieux en France (données terrain)"

Format : page web + PDF téléchargeable + infographie partageable.
Automatisation : l'agent analyse le JSON du catalogue → @copywriter rédige le format publiable → publié sur `/etude-humour-2026`.
Valeur pour les backlinks : les journalistes adorent citer des "études" avec des chiffres. "Selon une étude de deviens-marrant.fr, [stat]" = backlink assuré si la stat est originale.

**"Glossaire du stand-up français" (priorité moyenne)**

Si une page `/glossaire` n'existe pas encore : créer un glossaire de 50 termes du stand-up (callback, setup, punchline, beat, tags, crowd work...) avec définitions et exemples. Ce type de contenu est régulièrement cité par les articles sur le stand-up.

**"Ressources gratuites pour apprendre l'humour" (page de liens)**

Une page qui liste les meilleures ressources FR pour apprendre l'humour (vidéos YouTube, livres, podcasts, ateliers). Si vous listez d'autres créateurs, ils ont tendance à partager/lier en retour (stratégie de réciprocité).

### Comment promouvoir ces actifs pour générer des liens

1. **Dans chaque réponse presse (Canal B)** : envoyer le lien vers l'article ou l'étude pertinent. "J'ai aussi publié un guide complet sur ce sujet : [lien]"
2. **Dans les posts LinkedIn/Twitter** : chaque article pillar mérite 1-2 posts de promotion par mois
3. **Dans les emails outreach (Canal E)** : "Voici un de nos articles qui pourrait intéresser ton audience : [lien]"
4. **Dans les profils annuaires** : inclure l'URL directe du quiz ou de l'étude comme "ressource phare"

---

## 6. Métriques et tracking

### KPIs backlinks (à mesurer mensuellement)

| KPI | Formule | Objectif M1 | Objectif M3 | Objectif M6 | Source de mesure |
|---|---|---|---|---|---|
| Nombre total de domaines référents | Comptage unique domaines avec ≥ 1 lien | 15 | 40 | 80 | Google Search Console + Ahrefs Webmaster Tools |
| DR / DA moyen du profil | Moyenne pondérée DA des domaines référents | >10 | >20 | >35 | Ahrefs Webmaster Tools (gratuit) |
| Nouveaux domaines référents/mois | Délta domaines référents vs mois précédent | 10 | 15 | 10 | Google Search Console |
| Liens en attente (pipeline) | Somme des contacts outreach sans réponse | — | — | — | DB OutreachLog |
| Taux de réponse outreach | Réponses / Emails envoyés | — | [HYPOTHÈSE : 10-15%] | — | DB OutreachLog |
| Pages indexées Google | Comptage pages indexées | 30 | 60 | 100+ | Google Search Console |
| Pages indexées Bing | Comptage pages indexées | 15 | 40 | 80+ | Bing Webmaster Tools |

### Outils gratuits à utiliser

**Google Search Console (GSC) — outil principal, 0€**
- Section "Liens" → "Principaux sites avec liens" : liste tous les domaines qui font un lien vers le site
- Données disponibles : nombre de liens par domaine, pages les plus linkées, textes d'ancrage
- Limitation : délai de 2-3 semaines pour afficher les nouveaux liens
- URL : https://search.google.com/search-console/

**Ahrefs Webmaster Tools — version gratuite, 0€**
- Monitoring des backlinks + santé technique du site
- Plus rapide que GSC pour détecter les nouveaux liens
- Limitation gratuite : données partielles (pas de recherche de mots-clés concurrents)
- URL : https://ahrefs.com/webmaster-tools (vérification de domaine obligatoire)

**Bing Webmaster Tools — 0€**
- Monitoring indexation Bing + backlinks détectés par Bing
- URL : https://www.bing.com/webmasters/

**Google Alerts — 0€**
- Surveillance mentions de marque (avec et sans lien)
- Setup : 5 alertes sur les termes listés en section 4 Pipeline C
- URL : https://alerts.google.com/

**Umami (déjà en place) — 0€**
- Tracking du trafic entrant par source : identifier quels backlinks envoient du trafic réel
- Filtrer par referrer pour voir les domaines qui génèrent des visites

### Tableau de bord mensuel (format recommandé)

À produire le 1er de chaque mois en 15 minutes (agent analyse les données) :

```
## Rapport backlinks — [Mois YYYY]

Domaines référents totaux : X (delta : +Y vs mois précédent)
DA moyen : X
Nouveaux liens ce mois : X (dont X dofollow, X nofollow)
Top 3 nouveaux domaines par DA : [domaine] (DA X), [domaine] (DA X), [domaine] (DA X)

Pipelines actifs :
- Digital PR : X réponses envoyées, X mentions obtenues
- Outreach : X emails envoyés, X réponses positives, X backlinks obtenus
- Annuaires : X soumissions acceptées

Mentions sans lien détectées ce mois : X (X converties en lien)

Indexation :
- Google : X pages indexées
- Bing : X pages indexées

Prochain mois : actions prioritaires
```

---

## 7. Ce qu'on ne fait pas et pourquoi

### Achat de liens — NON

Les algorithmes Google et Bing 2025-2026 pénalisent les profils de liens artificiels. Pour un site jeune comme deviens-marrant.fr, un penalty (manual action ou algorithme) peut effacer des mois de travail SEO en une nuit. Budget 0€ de toute façon — mais c'est aussi la bonne décision qualitative.

### PBN (Private Blog Networks) — NON

Même logique. Risque élevé, valeur nulle pour un site B2C francophone de niche.

### Spam de forums (posting à la chaîne) — NON

Poster 50 liens Reddit en une semaine = bannissement immédiat. La règle est 1-2 liens pertinents par semaine, dans des threads où la valeur ajoutée est réelle.

### Guest posting sur des sites génériques faible qualité — NON

Un article publié sur un blog générique "top10-outils.fr" qui accepte tout le monde n'apporte rien (DA < 10, pas de trafic). Le guest posting est pertinent uniquement sur des sites thématiquement cohérents avec DA > 30 et vrai trafic organique. Ces opportunités arrivent naturellement via le Canal B (Digital PR) ou le Canal E (partenariats) — pas en achetant des emplacements.

### TikTok comme canal backlinks — NON

Les liens TikTok sont en nofollow, l'URL en bio n'est accessible qu'aux comptes avec 1K+ followers, et le contenu vidéo natif ne s'automatise pas facilement. Le pipeline social existant (Twitter/LinkedIn/Instagram) est la priorité. TikTok peut être envisagé si deviens-marrant.fr atteint une base d'audience, pas au stade actuel.

### Échanges de liens (link exchanges) — NON

Google traite les échanges de liens comme une manipulation. La règle de 2026 est claire : les liens doivent être éditoriaux (un site cite l'autre parce que c'est utile pour ses lecteurs, pas parce qu'il y a un accord réciproque).

---

## 8. Hypothèses à valider

- [HYPOTHÈSE : Profil de backlinks actuel proche de zéro — à vérifier via Ahrefs Webmaster Tools + Google Search Console section "Liens" dès que les outils sont configurés]
- [HYPOTHÈSE : Taux de réponse outreach estimé à 10-15% — à mesurer sur le premier batch de 20-50 emails]
- [HYPOTHÈSE : Conversion mentions-sans-lien → lien estimée à 20-30% — benchmark général du secteur. À mesurer sur les premières mentions détectées]
- [HYPOTHÈSE : Product Hunt FR est une opportunité viable — à évaluer selon l'audience PH pour les produits non anglophones. Si taux de votes < 50 en 24h, l'impact backlinks est limité]
- [HYPOTHÈSE : L'agent outreach (Pipeline B) peut scraper éthiquement 50 contacts créateurs FR/mois — à valider que les emails sont accessibles publiquement sur leurs sites]
- [HYPOTHÈSE : SourceBottle génère des requêtes en français ou sur des sujets pertinents pour un site FR — à vérifier lors de l'inscription. Si les requêtes sont 100% anglaises, l'impact est limité]

---

---

**Handoff → @orchestrator**

- Fichiers produits : `docs/seo/backlink-strategy.md`
- Décisions prises :
  - Stratégie 100% organique, 6 canaux, priorisés par ROI immédiat
  - Quick wins mois 1 : plateformes produit (Canal D) + Indie Hackers + SourceBottle activation + annuaires FR + Quora FR → objectif 20-30 backlinks en 30 jours
  - Pipeline HARO v2 : brancher sur SourceBottle (gratuit) plutôt que Connectively (nécessite un scraper plus complexe)
  - Pipeline outreach créateurs : nouveau cron mensuel `/api/cron/monthly-outreach` à développer par @fullstack (~2-3h effort)
  - Asset link bait prioritaire : "L'Étude Humour FR 2026" (analyse catalogue 290 vannes → stats inédites → page + PDF)
  - Outils de tracking : GSC (déjà configuré) + Ahrefs Webmaster Tools (gratuit) + Bing Webmaster Tools + Google Alerts
  - Aucun achat de lien, PBN, spam de forums ni échange de liens
- Points d'attention :
  - L'action la plus urgente pour Alex : session de soumissions plateformes produit (3h, cette semaine) → 6-10 liens dofollow DA 40-90
  - L'agent HARO existant est prêt — il manque uniquement l'inscription SourceBottle (30 min)
  - Le pipeline outreach créateurs nécessite un développement @fullstack — à planifier
  - Ahrefs Webmaster Tools doit être activé dès que possible pour avoir une baseline du profil de backlinks actuel
  - L'Étude Humour FR 2026 est le meilleur asset link bait à produire (analyse automatique du catalogue JSON → @copywriter rédige)
  - Les articles pillar existants (comment-devenir-drole, storytelling-drole-5-structures, timidite-et-humour) sont déjà linkables — les promouvoir dans chaque réponse presse et email outreach
