# Audit indépendant — Site Deviens-marrant.fr — s11 (29/09/2026)

> Auditeur : @reviewer (indépendant, aucune lecture des rapports d'audit produits par la refonte s11).
> Persona-cible d'évaluation : Yanis, 20 ans, étudiant introverti (persona principal `project-context.md`).
> Méthode : lecture directe des fichiers source des pages visibles + FAQs + emails + seeds ; notation zone par zone ; texte exact → problème → proposition.
> Cadre : charte `docs/copy/charte-refonte-copy-s11.md` (règles 1 à 6) + préférences fondateur (voix, staccato interdit, mention IA interdite, chiffres à conserver).

---

## Verdict (3 lignes)

**La refonte tient globalement la promesse sur les pages centrales** (hero, feature cards, /vannes, /conseils, /videos, /blog, 404, footer) : voix « pote drôle » présente, tutoiement 100 %, étalons D et E respectés à l'identique. **Trois angles morts sérieux subsistent** : (1) le mot **« Coach d'humour »** figure toujours dans le schema.org de la marque (angle mort de la refonte) ; (2) la promesse **« 15 min/semaine »** en /parcours contredit les seeds (20 min pour Répartie et Confiance) — c'est un chiffre-promesse trompeur ; (3) le personnage **« Alex Durand »** est présenté comme fondateur réel dans /a-propos, mentions-légales, JSON-LD auteur et signature blog, sans que ni le contexte ni la charte s11 ne l'aient tranché. **GO conditionnel** : la refonte de la voix est solide, mais les trois points ci-dessus doivent être arbitrés par Thomas avant de considérer la refonte comme terminée.

---

## Notes par zone /5

| # | Zone | Fichier(s) | Note /5 | Commentaire |
|---|---|---|---|---|
| 1 | Hero + subhero home | `components/home/hero-section.tsx` | 4,5 | Étalon D repris tel quel, subhero couvre les 3 personas, tutoiement, chute honnête (« Toi, tu ramènes ta motivation »). |
| 2 | « Tu te reconnais ? » (3 personas) | `app/(dashboard)/page.tsx` L83-131 | 4 | Bien ciblé Yanis/Sophie/Marc, verbatims persona (« Je reste muet quand on me chambre »). |
| 3 | Feature cards (3 sections) | `components/home/feature-cards.tsx` | 3,5 | Voix OK MAIS staccato P1 sur la carte vidéos (« Regarde les pros. Vole leurs techniques. ») et titre section vague (« pour progresser »). |
| 4 | Daily content (vanne, conseil, vidéo du jour) | `components/home/daily-content.tsx` | 4,5 | Empty states très bien écrits, section « Pourquoi ça marche / À toi de jouer » colle à l'étalon C. |
| 5 | Home CTA | `components/home/home-cta.tsx` | 4 | « moins qu'un café par mois. La seule chose que tu n'as pas encore essayée pour être plus drôle » = très bon claim. |
| 6 | Premium CTA + offres | `components/home/premium-cta.tsx` | 4 | Pricing cohérent (0,99 €/mois + 99 €/séance). « Coaching individuel » est un nom d'offre acceptable ; mais voir P0-1 (schema.org). |
| 7 | Upcoming features | `components/home/upcoming-features.tsx` | 4 | Bonne voix (« te rendre encore plus redoutable en société »). « L'art de » = léger reflex scolaire. |
| 8 | FAQ home | `lib/faqs.ts` | 4 | Chiffres validés fondateur (8 semaines, 50 XP/sem, majorité introvertis) présents et cohérents. Ton correct, parfois un peu propre (« La science le confirme »). |
| 9 | /vannes | `app/(dashboard)/vannes/page.tsx` | 4,5 | Excellente promesse (« Test Stand-Up… blagues Carambar, doctorat en linguistique »). 1 typo. |
| 10 | /conseils | `app/(dashboard)/conseils/page.tsx` | 4,5 | « expliquées comme si on était à la même table », dense, dans la voix. |
| 11 | /videos | `app/(dashboard)/videos/page.tsx` | 4 | Titre H1 générique (« Apprends à être drôle avec les meilleurs humoristes »), redite « tennis vs cours de tennis » avec /vannes et FAQ. |
| 12 | /parcours | `app/(dashboard)/parcours/page.tsx` | 3 | Promesse « 15 min/semaine » incohérente avec le seed (20 min sur 2 parcours sur 3). P1. |
| 13 | /abonnement | `app/(dashboard)/abonnement/page.tsx` | 4 | Cohérent, tutoiement, prix uniformes. « Compte gratuit d'abord » clair. |
| 14 | /a-propos | `app/(dashboard)/a-propos/page.tsx` | 2 | Persona fondateur « Alex Durand » non tranché par le contexte, claim « première plateforme francophone » à assumer ou nuancer, sinon voix OK. |
| 15 | /blog (index) | `app/(dashboard)/blog/page.tsx` | 4,5 | « Si tu lis un article et que tu ne souris pas au moins une fois, on a raté notre job » = dans la voix. |
| 16 | Header | `components/layout/header.tsx` | 4,5 | CTA « Commencer », tutoiement, sobre. |
| 17 | Footer | `components/layout/footer.tsx` | 5 | Étalon E textuel, tagline « Fait avec humour (et un peu de café) » parfait. |
| 18 | /register | `app/(auth)/register/page.tsx` | 3,5 | Placeholders et messages OK ; « Créer un compte » = neutre. Aucun humour de bienvenue. |
| 19 | /login | `app/(auth)/login/page.tsx` | 3,5 | Idem, correct mais froid pour un site « pote drôle ». |
| 20 | /onboarding + quiz | `components/onboarding/humor-quiz.tsx` | 4,5 | Résultats de quiz bien tapés (« T'as le potentiel, il te manque juste les techniques »). |
| 21 | 404 | `app/not-found.tsx` | 5 | « cette page a oublié sa punchline » + « Un peu comme mes talents de danse » — modèle du genre. |
| 22 | Email transactionnel (reset mot de passe) | `lib/email.ts` | 3 | Fonctionnel, mais style « support » (Salut / Tu as demandé / ignore cet email). Zéro humour, signature étalon E OK. |
| 23 | Seed conseils (65 conseils) | `docs/content/conseils-seed.json` | 4,5 | Voix cohérente, humoristes français cités, exemples concrets, exercices actionnables. Détail : voir §« Conseils FAIBLES ». |
| 24 | Seed parcours (3 parcours) | `docs/content/parcours-seed.json` | 4 | Tone et découpage bien pensés ; **incohérence timePerWeek** (20 min) vs page /parcours (15 min) — P1. |
| 25 | Seed videos (échantillon IDs 1-25) | `docs/content/videos-seed.json` | 4,5 | Descriptions denses, learnings structurés (`TECHNIQUE DE …`), exercices testables. Rien à corriger sur l'échantillon. |

---

## Résumé par gravité

- **P0 (visible partout / brand-critical) : 3**
- **P1 (page importante, gêne compréhension ou voix) : 5**
- **P2 (détail, microcopy, coquille) : 8**

---

## Top 10 des problèmes (à traiter en priorité)

1. **P0 — Schema.org auteur : « Coach d'humour »** — `apps/web/src/components/seo/json-ld.tsx:21` — `jobTitle: "Fondateur & Coach d'humour"`. Charte s11 règle 3 (« couper le mot coach pour la marque ») → viole. Ce champ est repris dans le rich snippet Google et lu par les LLM (E-E-A-T). **Proposition** : `jobTitle: "Fondateur"` (garder l'expertise via `knowsAbout` inchangé).
2. **P0 — Persona fondateur non tranché : « Alex Durand »** — 6 occurrences (`a-propos/page.tsx:159`, `mentions-legales/page.tsx:21`, `json-ld.tsx:19,102,173`, `blog/[slug]/page.tsx:213`, email admin `lib/email.ts:7` alex@…). Le fondateur réel est Thomas Issa. La charte s11 ne traite pas ce point ; c'est un choix éditorial qui doit être **acté par Thomas**. Deux options : (a) assumer le pseudonyme (aucune action) ; (b) remplacer partout par « L'équipe Deviens Marrant » (ou par Thomas) et retirer `authorPersonJsonLd` du /a-propos. **Décision fondateur requise avant tout changement.**
3. **P0 — Promesse « 15 min/semaine » contredit par les seeds** — `apps/web/src/app/(dashboard)/parcours/page.tsx:17` et L82-85 : « 3 parcours structurés… 15 min/semaine ». Le seed `docs/content/parcours-seed.json` déclare `timePerWeek: "15 min/semaine"` uniquement pour Machine à Café ; Répartie et Confiance sont à `20 min/semaine`. **Proposition** : reformuler « **15 à 20 min/semaine selon le parcours** » (aucune stat effacée, cohérence rétablie). Signalement conforme charte règle 1 (aucun chiffre modifié sans GO).
4. **P1 — Staccato en homepage** — `components/home/feature-cards.tsx:35` : « Regarde les pros. Vole leurs techniques. » = 2 phrases de 3 mots enchaînées, viole G-S21 (préférences fondateur 06/05/2026 : « style fluide, pas haché »). **Proposition** : « Regarde les pros et vole-leur leurs techniques. » ou « Ils font marrer 3 000 personnes en salle — voilà comment ils s'y prennent. »
5. **P1 — Redite « regarder du tennis vs prendre des cours de tennis »** — 3 endroits : `vannes/page.tsx:37`, `videos/page.tsx:37`, `lib/faqs.ts:36`. Chaque instance est bonne, mais l'usure de la formule saute aux yeux quand on parcourt le site. **Proposition** : garder la formule uniquement dans la FAQ home (à visibilité maximale) et remplacer par une variante sur /vannes et /videos (ex. « YouTube te montre ; ici on te montre comment ils font »).
6. **P1 — H1 /videos générique** — `videos/page.tsx:83` : « Apprends à être drôle avec les meilleurs humoristes ». Colle SEO mais pas la voix. **Proposition** : « Regarde Fary, Mirabel, Blanche Gardin — puis vole-leur leur mécanique. » (verbatim déjà cité en dessous, cohérent).
7. **P1 — Titre feature cards vague** — `components/home/feature-cards.tsx:50-52` : « Tout ce qu'il te faut pour progresser ». Cliché scolaire. **Proposition** : « Trois briques pour arrêter d'être celui qui rit poliment ». Cohérent avec le hero.
8. **P1 — Emails transactionnels sans voix** — `lib/email.ts` (reset mot de passe) : ton support neutre, hors voix « pote drôle ». **Proposition** minimaliste (une phrase suffit) : après « Clique sur le bouton », ajouter en bas « P.S. : ton mot de passe précédent a rejoint la liste des choses qu'on oublie tous. Aucun jugement. » (garder « Ce lien expire dans 1 heure. »).
9. **P2 — Coquille /vannes** — `vannes/page.tsx:43` (FAQ vannes) : « essaie de la **resortir** » → **ressortir** (double s).
10. **P2 — « L'art de » en upcoming features** — `components/home/upcoming-features.tsx:40` : « De nouveaux parcours pour maîtriser **l'art de la répartie et du storytelling** » = léger réflexe scolaire. **Proposition** : « De nouveaux parcours plus poussés sur la répartie et le storytelling » (chiffre 0 retiré, aucune stat touchée).

---

## Détail des problèmes (par zone)

### Zone 1 — Homepage

| Fichier:ligne | Texte exact | Problème | Proposition |
|---|---|---|---|
| `components/home/hero-section.tsx:16-19` | « Tu parles et personne rit. On va arranger ça. » | Étalon D validé. **PAS DE CHANGEMENT.** | — |
| `components/home/hero-section.tsx:22-25` | « Tu restes muet quand on te chambre ? Tu galères à faire rire à la machine à café ? Tu voudrais retrouver ta légèreté ? On a les vannes, les techniques et les exercices. Toi, tu ramènes ta motivation. » | 3 questions calibrées Yanis/Sophie/Marc + chute honnête. Très bon. | — |
| `components/home/hero-section.tsx:29` | « Rejoins 1 500+ membres qui progressent en humour chaque jour » | **Chiffre validé fondateur (29/09/2026)** — ne pas retirer. Signalement : chiffre à vérifier (nombre réel d'inscrits vs 1 500+). Charte règle 1 → **GARDER** tant que Thomas ne tranche pas. | Aucun changement sans GO Thomas. |
| `components/home/feature-cards.tsx:34-35` | « …analysés technique par technique. **Regarde les pros. Vole leurs techniques.** » | **P1 STACCATO** — 2 phrases de 3 mots. Viole G-S21. | « …analysés technique par technique. Tu regardes les pros et tu leur voles leur mécanique. » |
| `components/home/feature-cards.tsx:50-52` | « Tout ce qu'il te faut pour **progresser** » | **P1** — Titre scolaire vague. | « Trois briques pour arrêter d'être celui qui rit poliment » |
| `components/home/home-cta.tsx:28` | « …**pour moins qu'un café par mois**. La seule chose que tu n'as pas encore essayée pour être plus drôle. » | Excellent. Garder. | — |
| `components/home/daily-content.tsx:203` | « Même l'humour prend un jour off. Reviens demain pour ta dose ! » | Très bon empty state. | — |
| `components/home/daily-content.tsx:255` | « Le prof d'humour est en pause café. Ça revient demain. » | Léger flag « prof » → tolérable (le contenu s'appelle « conseil du jour », c'est cohérent). | — |
| `components/home/daily-content.tsx:318` | « L'humoriste du jour est en coulisses. À demain ! » | Bon. | — |
| `components/home/upcoming-features.tsx:40` | « Des parcours encore plus poussés pour maîtriser **l'art de la répartie et du storytelling** » | **P2** — « l'art de » = tic scolaire. | « Des parcours plus poussés sur la répartie et le storytelling » |
| `components/home/upcoming-features.tsx:71` | « Décris la situation, on te génère 3 répliques possibles. Plus jamais muet. » | « on te génère » = OK (ce n'est pas une mention IA explicite). « Plus jamais muet » = chute punchée acceptable. | — |
| `components/home/premium-cta.tsx:52-54` | « Que tu sois étudiant, jeune actif ou en pleine reconstruction, on a ce qu'il te faut pour devenir vraiment drôle. » | Rappelle les 3 personas. Bon. | — |
| `components/home/premium-cta.tsx:168` | Titre de la 2ᵉ offre : « **Coaching individuel** » | Nom d'une **offre**, pas de la marque → acceptable (voir charte règle 3 : « couper le mot *coach* pour la marque »). À laisser tel quel. | — |
| `components/home/premium-cta.tsx:218` | « Déjà 1 500+ inscrits — et toi ? » | Cohérent avec le hero. Chiffre validé fondateur. | — |

### Zone 2 — /vannes

| Fichier:ligne | Texte exact | Problème | Proposition |
|---|---|---|---|
| `app/(dashboard)/vannes/page.tsx:19` | « …**Si ça fait pas rire, c'est pas sur le site.** » | Excellent claim (metadata description). | — |
| `app/(dashboard)/vannes/page.tsx:43` | « Lis une vanne le matin, essaie de la **resortir** dans la journée. » | **P2** — Typo : « resortir » → « ressortir ». | ressortir |
| `app/(dashboard)/vannes/page.tsx:88-92` | « Boulot, couple, soirées… La théorie, c'est bien. Avoir une vanne prête, c'est mieux. » | Chute dans la voix. Garder. | — |
| `app/(dashboard)/vannes/page.tsx:117` | « …**Test Stand-Up** : « est-ce que je peux la sortir ce soir en soirée et faire rire ? » Si la réponse est non, elle n'est pas sur le site. Pas de blagues Carambar, pas d'objets qui parlent, pas de jeux de mots qui nécessitent un doctorat en linguistique. » | Excellent. | — |

### Zone 3 — /conseils

| Fichier:ligne | Texte exact | Problème | Proposition |
|---|---|---|---|
| `app/(dashboard)/conseils/page.tsx:87-93` | « …expliquées comme si on était à la même table… Pas de théorie creuse : tu lis, tu testes, tu progresses. » | Excellent. Dense et actionnable. | — |
| `app/(dashboard)/conseils/page.tsx:118` | « c'est un **muscle** qui se travaille » | Cohérent avec /a-propos, /faqs, /parcours. | — |

### Zone 4 — /videos

| Fichier:ligne | Texte exact | Problème | Proposition |
|---|---|---|---|
| `app/(dashboard)/videos/page.tsx:37` | « C'est la différence entre regarder du tennis et prendre des cours de tennis. » | **P1** — Formule répétée 3 fois sur le site (voir aussi `vannes/page.tsx:37` et `lib/faqs.ts:36`). | Garder dans la FAQ home. Sur /videos, remplacer par : « YouTube te montre. Nous, on te montre comment ils font. » |
| `app/(dashboard)/videos/page.tsx:83` | « **Apprends à être drôle avec les meilleurs humoristes** » | **P1** — H1 générique, hors voix. | « Regarde Fary, Mirabel, Blanche Gardin — puis vole-leur leur mécanique. » |
| `app/(dashboard)/videos/page.tsx:86-90` | « Fary, Paul Mirabel, Blanche Gardin, Roman Frayssinet, Waly Dia… Tu regardes, tu comprends le mécanisme, tu le reproduis. » | Chute rythmée mais courte, à la limite du staccato. Tolérable car ce sont 3 verbes en action, pas 3 phrases. | — |

### Zone 5 — /parcours

| Fichier:ligne | Texte exact | Problème | Proposition |
|---|---|---|---|
| `app/(dashboard)/parcours/page.tsx:17` | « 3 parcours pour devenir drôle : Machine à Café, Répartie, Confiance. **15 min/semaine**, exercices concrets, XP à gagner. » | **P0** — Contredit `docs/content/parcours-seed.json` : Répartie et Confiance à **20 min/semaine**. Fausse promesse. | « 3 parcours pour devenir drôle : Machine à Café, Répartie, Confiance. **15 à 20 min/semaine selon le parcours**, exercices concrets, XP à gagner. » |
| `app/(dashboard)/parcours/page.tsx:82-85` | « 3 parcours structurés pour progresser en humour : machine à café, répartie et confiance. **15 min/semaine**, des exercices concrets et des XP à gagner. » | **P0** — Même incohérence, en visible page. | « 15 à 20 min/semaine selon le parcours, des exercices concrets et des XP à gagner. » |
| `app/(dashboard)/parcours/[slug]/page.tsx:30` (extrait grep) | « 3 semaines, 15 min/semaine » (pour Machine à Café) | Cohérent (Machine à Café = 15 min/sem). Garder. | — |

### Zone 6 — /abonnement

| Fichier:ligne | Texte exact | Problème | Proposition |
|---|---|---|---|
| `app/(dashboard)/abonnement/page.tsx:26-27` | « Compte gratuit d'abord (10 vannes, 3 conseils, 3 vidéos). Tu passes à l'accès complet quand tu veux, à 0,99 €/mois. » | Chiffres du gratuit à vérifier avec la logique freemium (paywall). Vraisemblables. Pas d'action requise. | — |
| `app/(dashboard)/abonnement/page.tsx:167-174` | « Tu annules quand tu veux. Ton accès reste actif jusqu'à la fin de ta période en cours. Pas de frais cachés, pas de piège. » | Rassurant, dans la voix. Bon. | — |

### Zone 7 — /a-propos

| Fichier:ligne | Texte exact | Problème | Proposition |
|---|---|---|---|
| `app/(dashboard)/a-propos/page.tsx:65-70` | « deviens-marrant.fr est la **première plateforme francophone** dédiée à l'apprentissage de l'humour, de la répartie et du storytelling. » | **P1** — Claim fort. `project-context.md` indique [HYPOTHÈSE : absence de concurrent direct en ligne FR à confirmer par veille trimestrielle]. Tant que la veille n'est pas faite, il faut nuancer ou assumer. | Option A (assumer) : garder tel quel + ajouter une phrase de justification (« On a cherché, on n'a trouvé personne. Signale-nous si on rate quelqu'un. »). Option B (nuancer) : « la plateforme francophone dédiée à l'apprentissage de l'humour ». **Décision fondateur.** |
| `app/(dashboard)/a-propos/page.tsx:159-163` | « deviens-marrant.fr est fondé par **Alex Durand**… » | **P0** — Persona fondateur non tranché par la charte s11. Le fondateur réel est Thomas Issa. Voir Top 10 #2. | Décision fondateur requise. |
| `app/(dashboard)/a-propos/page.tsx:82-85` | « notre communauté de **1 500+ membres** » | Cohérent avec hero et premium-cta. Chiffre validé fondateur. | — |
| `app/(dashboard)/a-propos/page.tsx:84` | « les **principes de la psychologie positive** » | **P2** — Claim vague. Toléré (contexte à-propos). Voir P1 : la psychologie positive est-elle réellement une source méthodologique du site ou une caution marketing ? | À arbitrer. Si non-vérifiable → « et les principes qui marchent en pédagogie du stand-up » (suffit). |

### Zone 8 — Header / Footer

| Fichier:ligne | Texte exact | Problème | Proposition |
|---|---|---|---|
| `components/layout/header.tsx` | « Accueil / Vannes / Conseils / Vidéos / Parcours / Blog » + bouton « Commencer » | Nav minimaliste, correct. | — |
| `components/layout/footer.tsx:65` | « **Deviens drôle, un exercice à la fois.** Vannes, répartie et techniques de stand-up pour briller en société. » | Étalon E respecté. | — |
| `components/layout/footer.tsx:130` | « Fait avec humour (et un peu de café) » | Signature dans la voix. | — |

### Zone 9 — Auth (register / login / forgot password)

| Fichier:ligne | Texte exact | Problème | Proposition |
|---|---|---|---|
| `app/(auth)/register/page.tsx:140` | « Créer un compte » | **P2** — Titre neutre. Tolérable mais on peut rendre l'inscription mémorable. | « Bienvenue. C'est ici qu'on t'apprend à faire rire. » |
| `app/(auth)/register/page.tsx:161` | placeholder « Ton prénom » | Bon. Tutoiement. | — |
| `app/(auth)/register/page.tsx:228` | « Au moins 8 caractères » (password hint) | Neutre. Acceptable. | — |
| `app/(auth)/login/page.tsx:104` | « Connexion » | Neutre. Tolérable. | — |

### Zone 10 — Onboarding

| Fichier:ligne | Texte exact | Problème | Proposition |
|---|---|---|---|
| `app/(auth)/onboarding/page.tsx:14-19` | « Découvre ton profil humour / 3 questions rapides pour personnaliser ton expérience » | Correct, léger accent marketing (« personnaliser ton expérience »). | Optionnel : « 3 questions. On te trouve un point de départ. » |
| `components/onboarding/humor-quiz.tsx:47` | « Mes vannes tombent à plat » | Excellent verbatim persona. | — |
| `components/onboarding/humor-quiz.tsx:57-58` | « T'as le potentiel, il te manque juste les techniques ! On va t'apprendre à rebondir, à placer tes vannes et à gagner en confiance, étape par étape. » | Dans la voix. Garder. | — |
| `components/onboarding/humor-quiz.tsx:75-76` | « Tu vises haut et c'est ce qu'on aime. Analyse les meilleurs, peaufine tes techniques et prépare-toi à briller. » | **P2** — Un peu générique / motivationnel. | « Tu vises haut et c'est bien. On te met les meilleurs sous les yeux, à toi de leur voler leur truc. » |

### Zone 11 — 404

| Fichier:ligne | Texte exact | Problème | Proposition |
|---|---|---|---|
| `app/not-found.tsx:11-16` | « Oups, cette page a oublié sa **punchline**. On dirait que cette page n'existe pas… Un peu comme mes talents de danse. » | **Modèle du genre.** Étalon parfait pour une 404. | — |

### Zone 12 — Emails transactionnels

| Fichier:ligne | Texte exact | Problème | Proposition |
|---|---|---|---|
| `lib/email.ts:53` | Objet : « Réinitialise ton mot de passe — Deviens Marrant » | Tutoiement, sobre. Bon. | — |
| `lib/email.ts:59-66` | « Deviens Marrant 🎤 / Salut, Tu as demandé à réinitialiser… Ce lien expire dans 1 heure. Si tu n'as pas fait cette demande, ignore cet email. » | **P1** — Zéro voix « pote drôle » (support corporate neutre). | Ajouter après « ignore cet email » : « P.S. : ton mot de passe précédent a rejoint la liste des choses qu'on oublie tous. Aucun jugement. » (une phrase, ne casse pas la sécurité UX). |
| `lib/email.ts:67` | signature « Deviens drôle, un exercice à la fois. » | Étalon E. Garder. | — |
| `lib/email.ts:7` (FROM admin) | `alex@deviens-marrant.fr` | Cohérent avec le persona Alex Durand. **À arbitrer avec P0 #2.** | — |

### Zone 13 — Metadata (title / description)

Vérification faite sur les `generateMetadata` des pages principales :

| Page | Title | Description | Verdict |
|---|---|---|---|
| Home | « Deviens drôle et améliore ta répartie » | « Tu veux être la personne la plus drôle du groupe ? Vannes à ressortir, techniques de répartie et parcours pour progresser. » | Bon, direct. |
| /vannes | « X+ vannes drôles à ressortir ce soir » | « …Tape pour la chute. Si ça fait pas rire, c'est pas sur le site. » | Excellent. |
| /conseils | « X+ techniques de répartie + exercices » | « …tu lis, tu testes, tu progresses. » | Bon. |
| /videos | « Stand-up analysé : Fary, Mirabel & co. » | « …Tu regardes, tu comprends, tu reproduis. » | Bon, dans la voix. |
| /parcours | « Cours humour en ligne : deviens drôle » | « 3 parcours… **15 min/semaine**… Tu t'inscris, tu progresses. » | **P0** — Contient l'incohérence 15 min/semaine (voir Top 10 #3). |
| /a-propos | « L'humour s'apprend — notre mission » | Bon. | — |
| /blog | « Blog humour — guides et techniques » | « Si tu souris pas, on a raté notre job. » | Bon. |

---

## Vérifications transverses

### Mentions d'IA dans les copy visibles

Aucune mention d'IA détectée dans les textes visibles (hero, feature cards, cards personas, upcoming features, FAQ, /vannes, /conseils, /videos, /parcours, /abonnement, /a-propos, /blog, footer, header, auth, onboarding, 404, emails). La règle 2 de la charte s11 est **respectée** sur la partie site.

Note : « on te génère 3 répliques possibles » sur `upcoming-features.tsx:71` est à la lisière (le mot « génère » évoque un moteur), mais la formulation ne mentionne pas explicitement l'IA — **acceptable**.

### Concurrents nommés

Aucun concurrent nommé dans les copy visibles. Règle 5 charte s11 → **respectée**.

### Tutoiement

100 % tutoiement sur toutes les zones auditées. Aucun vouvoiement. Règle 3 charte s11 → **respectée**.

### Cohérence des chiffres et prix (sans altérer aucune valeur)

| Chiffre / prix | Endroits | Cohérence |
|---|---|---|
| **0,99 €/mois** | Hero, Home CTA, Feature list, Premium CTA (2 fois), /abonnement, Onboarding quiz, Onboarding existant profile, /parcours cross-links | **Cohérent partout** ✓ |
| **99 €/séance** (coaching) | Premium CTA uniquement | Cohérent (offre unique) ✓ |
| **1 500+ membres** | Hero, Premium CTA, /a-propos | **Cohérent 3/3** ✓ — chiffre validé fondateur, à ne PAS retirer |
| **8 semaines** (étude) | FAQ, /a-propos | Cohérent 2/2 ✓ |
| **50 XP/semaine** | FAQ home | 1 seul endroit, cohérent avec seed parcours (`moduleXp` 50-200 selon semaine) ✓ |
| **majorité introvertis** | FAQ, /a-propos (« aucune expérience ») | 2 formulations différentes mais compatibles ✓ |
| **10 vannes / 3 conseils / 3 vidéos** (free) | /abonnement, Premium CTA (« au lieu de 10 / 3 / 3 ») | Cohérent 2/2 ✓ |
| **3 sem / 4 sem / 6 sem** (parcours) | Home cards personas, /parcours, /a-propos, FAQ | Cohérent 4/4 ✓ |
| **15 min/semaine** | /parcours (2 fois), meta /parcours | **INCOHÉRENT** avec seed parcours-seed.json (20 min pour Répartie et Confiance) ❌ **P0** |

### Voix « pote drôle » — pré-requis persona

- Nom persona « Yanis » : présent implicitement dans les 3 cartes personas et dans les seeds parcours (`persona: "Yanis (20 ans, étudiant)"`). Pas cité nommément dans les copy visibles → acceptable (le persona est représenté, pas nommé au client).
- Vocabulaire secteur (« vanne », « répartie », « chambrer », « stand-up », « punchline », « callback ») : présent partout ✓
- Objections adressées : prix (« 0,99 € »), timidité (FAQ « Comment devenir drôle quand on est timide »), difficulté (« introverti est un avantage »), efficacité (« 2 à 4 semaines »), annulation (« 1 clic sans email ») → **couvertes** ✓

---

## Conseils FAIBLES (audit conseils-seed.json, 65 conseils)

**Taux FAIBLES : 3/65 (4,6 %)** — seuil qualité élevé, refonte s11 tient globalement.

| ID | Titre | Verdict | Motif |
|---|---|---|---|
| 3 | L'observation du quotidien | **FAIBLE** | Cite Seinfeld en exemple d'ouverture — la charte s11 favorise les humoristes **français**. L'exemple « Pourquoi on dit 'allô' au téléphone ? » est daté (référence Seinfeld années 90). **Proposition** : remplacer Seinfeld par Vérino ou Roman Frayssinet (déjà présents ailleurs) et rafraîchir l'exemple. |
| 8 | L'absurde assumé | **FAIBLE** | L'exemple « Wifi le poisson rouge » est un one-liner internet daté (déjà vu partout). Contradiction avec charte règle 2 § anti-cliché. **Proposition** : réécrire avec un exemple original (ex. « J'ai appelé ma plante Décision. Comme ça quand je la regarde crever, je peux dire que j'ai pris la mienne. »). |
| 42 | L'ironie bienveillante | **FAIBLE** | Le contenu est correct mais l'exemple « on avait juste prévu de manger ensemble, pas de vieillir ensemble » est **très déjà-vu** (formule de tweets viraux). Manque d'originalité pour un site qui se vante de vannes qui « ne sont pas sur le site si elles font pas rire ». **Proposition** : garder la technique, remplacer l'exemple par une observation calibrée site (ex. « On a mangé sans toi. Ta portion s'appelle maintenant les restes. »). |

Les 62 autres conseils tiennent le niveau : humoristes français correctement cités (Blanche Gardin, Fary, Paul Mirabel, Roman Frayssinet, Jamel Debbouze, Karim Duval, Panayotis Pascot, Florence Foresti, Marina Rollman, Pierre Croce, Lilia Benchabane, Fanny Ruwet, Élodie Poux, Waly Dia, Tania Dutel, Fadily Camara, Anne Roumanoff, Baptiste Lecaplain, Kev Adams, Constance, Kyan Khojandi, Vérino), exercices concrets et testables, tutoiement 100 %, aucun jargon corporate, un ton pédagogique dans la voix « pote qui explique ».

---

## Vérifications parcours-seed.json (3 parcours)

| Parcours | Slug | Persona | timePerWeek | Cohérence page /parcours | Verdict |
|---|---|---|---|---|---|
| Machine à Café | machine-a-cafe | Sophie (26 ans, jeune active) | 15 min/semaine | ✓ | OK |
| Répartie | repartie | Yanis (20 ans, étudiant) | **20 min/semaine** | ✗ (page dit 15 min) | **P0 incohérence** |
| Confiance | confiance | Marc (34 ans, récemment séparé) | **20 min/semaine** | ✗ (page dit 15 min) | **P0 incohérence** |

Cohérence des personas avec `project-context.md` : Yanis/Sophie/Marc = triplet identique ✓.

Testimonials présents dans chaque parcours (« Avant je restais muette à la machine à café… », « Mes potes n'en reviennent pas… », « Après ma séparation, j'avais perdu mon humour… »). **Non signalés dans la refonte s11** ; techniquement ce sont des citations de membres non vérifiables. **À arbitrer avec Thomas** — si ce sont des témoignages réels, garder tels quels ; sinon, retirer ou marquer clairement « exemple ».

Contenu pédagogique (quiz, videos, jokeIds) : dense, bien pensé, cohérent avec les conseils cités.

---

## Vérifications échantillon videos-seed.json (IDs 1-25 examinés sur 80+)

| Point | Verdict |
|---|---|
| Descriptions denses et pédagogiques | ✓ |
| Learnings structurés (`TECHNIQUE DE …`) | ✓ (4 techniques par vidéo, format cohérent) |
| Exercices testables (défi précis + critère de succès) | ✓ |
| Humoristes français uniquement | ✓ (Roman Frayssinet, Vérino, Fary, Élodie Poux, Kev Adams, Anne Roumanoff, Blanche Gardin, Paul Mirabel, Baptiste Lecaplain, Fadily Camara, Djimo, Thomas Ngijol, Laura Domenge, Nordine Ganso, Haroun, Artus, Max Bird, Bun Hay Mean, Alex Ramirès, Paul Taylor, Karim Duval, Jason Brokerss) |
| Tutoiement | ✓ |
| Mentions IA | Aucune ✓ |
| Voix « pote drôle » | ✓ (« Fary utilise Neymar et le foot comme porte d'entrée… ») |

**Aucun problème détecté sur l'échantillon.** À vérifier sur les 55+ vidéos restantes lors d'une passe complémentaire si nécessaire.

---

## Angles morts identifiés

1. **Champ `authorPersonJsonLd` non couvert par la refonte s11** — le JSON-LD est un canal visible (Google, LLM) qui contient encore « Coach d'humour ». La refonte s'est concentrée sur les copy React ; le JSON-LD schema.org a été oublié.
2. **Emails transactionnels non refondus** — la refonte s'est concentrée sur les pages du site. Les emails (reset password) restent en voix support. Impact : chaque nouveau membre qui perd son mot de passe reçoit un email hors-voix.
3. **Cohérence page ↔ seed non vérifiée** — la refonte a réécrit la page /parcours indépendamment des seeds. L'incohérence 15/20 min n'a été catchée par aucun agent.
4. **Persona fondateur** — le contexte projet mentionne Thomas Issa comme fondateur réel. Aucun agent n'a arbitré si « Alex Durand » est un pseudonyme assumé ou un choix éditorial obsolète (à trancher, pas à corriger unilatéralement).

---

## Décisions à confirmer par Thomas

1. **Garder ou retirer « Alex Durand »** comme fondateur affiché (a-propos, mentions-légales, JSON-LD, signature blog, from admin email).
2. **Confirmer ou nuancer** le claim « première plateforme francophone » dans /a-propos.
3. **Valider ou refuser** le remplacement de « 15 min/semaine » par « 15 à 20 min/semaine selon le parcours » sur /parcours (aucune stat effacée, cohérence rétablie).
4. **Valider ou refuser** la suppression de « Coach d'humour » dans `authorPersonJsonLd` (charte règle 3).
5. **Confirmer** que le chiffre « 1 500+ membres » reste tel quel (charte règle 1, choix fondateur 29/09/2026 déjà tranché → aucune action agent).
6. **Valider ou refuser** l'ajout d'un P.S. humoristique dans l'email de reset mot de passe.

---

## Recommandation

**GO CONDITIONNEL.**

Conditions du GO plein :
- P0 #1 (schema.org Coach d'humour) → traité (5 min).
- P0 #3 (15 min/semaine /parcours) → traité (2 min, 2 fichiers).
- P0 #2 (Alex Durand) → **arbitrage Thomas**, pas de correction unilatérale.
- P1 #4 (staccato feature-cards) et P2 #9 (typo « resortir ») → traités (2 min).

La refonte tient sur les zones à plus fort trafic (hero, /vannes, /conseils, footer, 404). Le travail sur la voix est solide et documenté par les 5 étalons. Les points à traiter sont ciblés, chiffrables et corrigeables en < 30 minutes une fois les décisions fondateur prises.

---

**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/copy/audit-independant-site-s11.md`
- Décisions prises : **GO CONDITIONNEL** — la refonte s11 tient la voix sur les pages à fort trafic mais 3 angles morts subsistent (JSON-LD « Coach d'humour », incohérence 15/20 min sur /parcours, statut du persona « Alex Durand »).
- Points d'attention pour Thomas : (1) arbitrer le persona « Alex Durand », (2) valider la reformulation « 15 à 20 min/semaine selon le parcours » sur /parcours, (3) valider la suppression de « Coach d'humour » dans `authorPersonJsonLd`.
- Agents à réinvoquer : @copywriter pour appliquer les corrections P0/P1 une fois arbitrages faits ; @seo pour valider la ré-écriture des metadata /parcours ; @qa pour vérifier le rendu des rich snippets Google après retrait de « Coach d'humour ».
