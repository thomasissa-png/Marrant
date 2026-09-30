# Audit des messages du site — session 14 (30/09/2026)

> Périmètre : ce que deviens-marrant.fr dit, promet, à qui, avec quelle cohérence. **Audit uniquement** : aucune copy réécrite, aucun fichier de code modifié.
> Cadre non re-questionnable ([CHOIX UTILISATEUR] du 29/09/2026, `docs/founder-preferences.md`) : chiffres du site jamais retirés sans GO ; « améliorer, pas amputer » ; 1 500+ membres, Stanford 34 %, années dans les titres gardés ; compteurs distincts arrondis (550+ vannes, 350+ conseils) ; prix 0,99 €/mois partout ; témoignages fictifs présentés comme exemples ; identité : aucune photo/mention de Thomas ou d'Issa Capital (auteur affiché inchangé) ; juridique laissé en l'état ; zéro mention d'IA ; signature « L'Équipe Deviens Marrant ».
> Règle P0 projet : aucun brief @copywriter avant calibrage de 3 à 5 étalons avec Thomas (section 4).
> Méthode : lecture des sources (`layout.tsx`, accueil + `components/home/*`, `/abonnement`, `/parcours`, `/vannes`, `/conseils`, `/a-propos`, onboarding, `auth-modal`, `premium-paywall`, `lib/email.ts`, `lib/faqs.ts`, API `jokes`/`favorites`/`daily`/`cron`). Pas de Grep disponible dans cette session : la liste des tirets cadratins est donc **non exhaustive** (voir P1-4). Tout ce qui n'a pas pu être vérifié est marqué `[À VÉRIFIER]`.

## 1. Verdict (5 lignes)

1. **La surface tient** : hero (étalon D), tutoiement partout, zéro mention d'IA, zéro concurrent commercial nommé, prix 0,99 € identique sur toutes les surfaces web lues, durées 3/4/6 semaines cohérentes, compteurs 550+/350+/80+ dynamiques donc alignés entre pages.
2. **La promesse de fond n'est pas unique** : 4 formulations différentes pour la seule URL d'accueil (title, meta, Open Graph, Twitter) et 3 discours de positionnement en concurrence (project-context « meilleur ratio qualité/prix », ceo-voice « éditeur, pas un coach, pas une communauté », site « plateforme pour apprendre à être drôle »).
3. **Deux promesses payantes sont fausses ou non tenues** : « contenu quotidien / nouveaux contenus chaque semaine » (génération arrêtée depuis mi-juin d'après l'audit s11) et « parcours : la suite fait partie de l'accès complet » (le code ne verrouille que les visiteurs anonymes, un compte gratuit voit tout).
4. **La frontière gratuit/payant est racontée différemment sur 5 surfaces** (XP, contenu du jour, filtres, favoris, parcours) et deux murs n'apparaissent qu'au clic (favoris, filtres par situation, alors que « classées par situation » est l'argument central des vannes).
5. **Hygiène** : tirets cadratins client-facing bien au-delà de l'objet de reset (au moins 7 emplacements, plus les 3 étalons canoniques eux-mêmes), newsletter « 1 technique par semaine » sans envoi trouvé dans le code, « communauté » annoncée « Bientôt » alors que l'à-propos parle déjà de « notre communauté de 1 500+ membres ».
**Verdict : cohérent en surface, fragile sur 2 promesses payantes. Calibrage étalons possible, mais Q1 à Q3 (section 4) doivent être tranchées AVANT tout brief @copywriter.**

## 2. Carte des messages

Positionnement de référence : `project-context.md:29` (« meilleur ratio qualité/prix de l'éducation stand-up, parcours structuré, contenu quotidien renouvelé, progression mesurable »), pivot fondateur s8 (« produit qui s'apprend, pas qui se vend », `founder-preferences.md:20`), persona principal Yanis (`project-context.md:20`).

| Surface (fichier:ligne) | Promesse dite | Écart vs positionnement |
|---|---|---|
| Title/description globaux (`layout.tsx:28-33`) | « Devenir drôle et avoir de la répartie » ; « plateforme pour devenir drôle… des techniques de pro et des parcours pas à pas pour faire rire tes potes » | Promesse SEO (résultat), pas de méthode ni de prix. « techniques de pro » : non sourcé |
| Open Graph / Twitter (`layout.tsx:69-72, 86-89`) | « Comment devenir drôle… », « plateforme francophone… du stand-up décortiqué » ; « Apprends à devenir drôle… faire rire ton entourage » | 2 formulations de plus. L'accueil ne les surcharge pas : elles s'appliquent à `/` |
| Meta accueil (`page.tsx:53-54`) | « Devenir drôle, ça s'apprend : 550+ vannes à ressortir, 350+ conseils de répartie et 80+ vidéos de stand-up décortiquées pour sortir la bonne réplique à temps » | Seule version qui porte « ça s'apprend » (cohérente avec s8) |
| Hero (`hero-section.tsx:28-38`) | « Tu parles et personne rit. On va arranger ça. » puis 3 douleurs (muet quand on te chambre / machine à café / légèreté perdue) et « les vannes, les techniques et les exercices. Toi, tu ramènes ta motivation. » | Problème > méthode. Ouvre bien sur Yanis, mais mélange 3 personas dans un seul paragraphe |
| Pastilles hero (`hero-section.tsx:17`) | « Un petit exercice par jour » | Contredit « une étape par semaine, 15 à 20 min » (`/parcours`) |
| CTA bas d'accueil (`home-cta.tsx:25-28`) | « Tu crois avoir tout essayé pour être drôle ? … moins qu'un café par mois. La seule chose que tu n'as pas encore essayée » | Présuppose des essais antérieurs (Yanis n'a rien essayé). Seule trace du levier prix, sans l'alternative (impro, livres) |
| Offre accueil (`premium-cta.tsx:45-50, 79-108`) | « Deux façons de t'y mettre » ; liste : vannes, conseils, vidéos, contenu du jour, **nouveaux contenus chaque semaine**, **streaks et XP**, **parcours structurés**, favoris | Voir P0-1, P0-2, P1-3 |
| `/abonnement` (`abonnement/page.tsx:30-33, 76, 114-154`) | « Crée ton compte, deviens drôle » ; gratuit = « 10 vannes, 3 conseils, 3 vidéos, contenu du jour » ; payant = idem + **contenu quotidien**, filtres avancés, favoris | Liste payante différente de celle de l'accueil. « contenu du jour » des deux côtés |
| Modale d'offre (`premium-modal.tsx:48-95`) | « Débloque tout le contenu » ; 5 puces, **sans favoris** | Ouverte au clic sur l'étoile favoris (`favorite-button.tsx:32-35`) sans nommer la raison |
| Paywall natif/web (`premium-paywall.tsx:109-111, 154-155, 161`) | « Passe Premium », « tous les parcours » ; bouton « S'abonner — 0,99 €/mois » | 3e vocabulaire (« Premium »). Composant non affiché (`a-valider-s12.md`, point 17) |
| `/parcours` (`parcours/page.tsx:16-17, 84-85`) | « 3 parcours… 15 à 20 min/semaine, exercices concrets, XP » | Rythme hebdo, correct vs décision s11 |
| `/vannes` (`vannes/page.tsx:20, 84-91`) | « classées par situation… chacune avec sa chute et son décryptage » ; « choisis ta situation… garde tes préférées sous le coude » | Argument central verrouillé pour les non-abonnés (P1-2) |
| `/conseils` (`conseils/page.tsx:20, 44`) | « techniques… exemple, dialogue, défi » ; « 5-10 minutes par jour… 2 à 4 semaines » | Rythme quotidien, autre que `/parcours` |
| `/a-propos` (`a-propos/page.tsx:14, 66-71, 86, 161`) | « L'humour s'apprend » ; « première plateforme francophone dédiée à l'apprentissage » ; « notre communauté de 1 500+ membres » ; « fondé par Alex Durand » | « communauté » vs vote « Bientôt » ; « première » non sourcé. Alex Durand : cadre [CHOIX UTILISATEUR], non re-questionné |
| Onboarding (`onboarding/page.tsx:21-26`, `humor-quiz.tsx:67,77,212`) | « Découvre ton profil humour, 3 questions, et on te trouve un point de départ à ta taille » ; résultats « Le blagueur affûté », « La future star » ; lien « Tout débloquer à 0,99 €/mois » | Registre « star » vs persona timide. CTA payant dans un flux de valeur (s8 : conversion = conséquence) |
| E-mails (`email.ts:53,67`, `newsletter/route.ts:46,56`, `newsletter.ts:20`) | Reset : « Deviens drôle, un exercice à la fois. » ; confirmation newsletter : « une technique d'humour par semaine » | Pas d'e-mail de bienvenue dans `src/lib/email*` (l'étalon 2 existe seulement en doc). Envoi hebdo non trouvé |
| Footer (`footer.tsx:65-66`) | « Deviens drôle, un exercice à la fois. Vannes, répartie et techniques de stand-up pour briller en société. » | Étalon E OK ; « briller en société » = registre performance |

**Lecture** : 6 promesses coexistent (résultat SEO « devenir drôle » / méthode « ça s'apprend » / usage « vannes à ressortir » / émotion « on va arranger ça » / progression « un exercice à la fois » / statut « briller en société »). Aucune n'est fausse en soi, mais aucune n'est désignée comme LA promesse, et le levier prix/alternative du positionnement de référence n'est porté nulle part sauf « moins qu'un café ».

**Vérifié conforme** (pas de constat) : tutoiement sur toutes les surfaces lues ; zéro mention d'IA (le « générés par IA » de l'audit s11 a disparu de `premium-cta.tsx:95`) ; zéro nom de concurrent commercial ; 0,99 € identique dans 14 emplacements web ; « Sans engagement, annulable » identique (accueil, `/abonnement`, FAQ, modale) ; compteurs issus de `getContentStatsRounded` / `useContentStats` (89 vidéos donne « 80+ » par la règle d'arrondi `content-stats-server.ts:38-42`).

## 3. Constats

Échelle : **P0** = message faux ou non tenu avant paiement, ou contradiction avec le cadre fondateur ; **P1** = incohérence visible entre surfaces ; **P2** = finition, ton, hygiène. Les corrections de chiffres exigent un GO de Thomas (règle du 29/09).

### P0

**P0-1. « Contenu quotidien » et « nouveaux contenus chaque semaine » vendus dans l'offre payante alors que la génération est arrêtée.**
- Dit : `premium-cta.tsx:91` « Contenu du jour : vanne + conseil + vidéo quotidiens », `:95` « Nouveaux contenus chaque semaine » ; `abonnement/page.tsx:138-139` « Contenu quotidien… chaque jour » ; `premium-modal.tsx:92-93` idem ; `upcoming-features.tsx:25-27` (WhatsApp « du jour ») ; `project-context.md:82` « contenu quotidien renouvelé automatiquement ».
- Réel : `docs/marrant/audit-global-s11.md:12-15, 38` : dernière vanne et dernier conseil au 15/06/2026, dernier article au 09/06, « promesse "nouveaux contenus chaque semaine" fausse », vanne du jour du 29/09 créée le 26/03. Sans nouvelle génération, `/api/daily` retombe sur un choix déterministe dans le stock (`api/daily/route.ts:60-61`) : le « du jour » est une rotation, pas un renouvellement. [À VÉRIFIER : état de la génération depuis le 29/09, non mesurable ici.]
- Aggravant à vérifier : le scheduler et le verrou `isGenerating` sont conçus pour un process Node persistant (« parfait pour Replit », `api/daily/route.ts:9-12`). Le site est sur Cloudflare depuis ce matin : [À VÉRIFIER par @infrastructure : les crons `daily-content`, `daily-push` et toute newsletter tournent-ils encore ?].
- Aggravant de message : le contenu du jour est **public** (`daily-content.tsx`, `/api/daily` sans auth) ET listé dans le gratuit (`abonnement/page.tsx:76`) ET dans le payant (`:138`). Il ne peut pas être un argument d'abonnement.

**P0-2. Parcours : le message dit « la suite fait partie de l'accès complet », le code ne verrouille que les anonymes.**
- Dit : `parcours-detail.tsx:591-592` « Cette étape fait partie de l'accès complet : la première est offerte, la suite coûte moins qu'un café par mois » ; `premium-cta.tsx:101-104` « Parcours structurés » dans la liste payante ; `parcours/page.tsx:129-130` « Accès complet à tous les parcours » ; `premium-paywall.tsx:111`.
- Réel : `parcours-detail.tsx:480-481` `isPremiumLocked = status !== "authenticated" && step.order > 1`. Aucun test du plan. `api/parcours/by-slug/[slug]/route.ts:168-181` renvoie tout ; `api/parcours/[id]/progress/route.ts:53-90` exige seulement une session (rate-limit, pas de contrôle `plan`) [À VÉRIFIER : suite du fichier après la ligne 90]. Un compte gratuit voit et valide toutes les étapes.
- Donc : soit le modèle économique fuit (le parcours est la valeur pédagogique la plus forte), soit le message est faux. C'est aussi le point 10 de `decisions-a-trancher-s11.md` (« compte gratuit : XP + étape 1, à vérifier en prod ») : la vérification donne « plus généreux que dit ». → Q2.

**P0-3. Murs qui n'apparaissent qu'au clic (favoris, filtres) alors que la page les encourage.**
- Favoris : `vannes/page.tsx:39-40` (FAQ) « Mets tes préférées en favoris » et `:88-89` « garde tes préférées sous le coude » ; l'étoile est affichée sans cadenas à tout le monde (`favorite-button.tsx:44-63`), le clic ouvre `PremiumModal` dont la liste ne cite pas les favoris (`premium-modal.tsx:58-96`) ; l'API répond 403 « réservés aux membres Premium » (`api/favorites/route.ts:48-58`). Seuls l'accueil (`premium-cta.tsx:107`), `/abonnement:151` et le bandeau anonyme de `/vannes` (`vannes-list.tsx:185`) le disent, et ce bandeau ne s'affiche pas pour un compte gratuit connecté.
- Filtres : voir P1-2.

### P1

**P1-1. Trois discours de positionnement (à trancher, pas à réécrire).** `project-context.md:29,34` (prix/qualité, alternative impro/livres/YouTube, dernière mise à jour 24/03, donc antérieur aux pivots s8-s11) ; `docs/strategy/ceo-voice-unified.md:54-58` (« éditeur stand-up en ligne. Pas une appli de bien-être. Pas un coach. Pas une communauté ») ; site (« plateforme », « communauté de 1 500+ membres », « Coaching individuel » à 99 €, vote « Une communauté »). L'alternative actuelle du persona (impro cher et intimidant, livres, YouTube passif) n'apparaît qu'en une FAQ (`faqs.ts:33-36`, YouTube). → Q1.

**P1-2. L'argument central des vannes (« classées par situation ») est payant, sans que l'appel « Voir les vannes gratuites » le dise.** Dit : `page.tsx:54`, `feature-cards.tsx:14`, `vannes/page.tsx:20, 39, 88` (« choisis ta situation », « Passe par les filtres »). Réel : `vannes-list.tsx:201-210` « Filtres par catégorie disponibles avec l'abonnement Premium » ; les 10 vannes gratuites sont les 10 plus récentes (`api/jokes/route.ts:66, 76`), toutes catégories confondues. Le bandeau anonyme (`vannes-list.tsx:182-186`) dit « 10 vannes accessibles sans compte » : le compte gratuit n'en débloque **aucune de plus** (même limite FREE = anonyme), ce que la formule laisse croire.

**P1-3. Le gratuit et le payant ne se recoupent pas d'une surface à l'autre.**

| Élément | Accueil offre | `/abonnement` | Modale | Bandeau `/vannes` | Réel (code) |
|---|---|---|---|---|---|
| Contenu du jour | payant | gratuit ET payant | payant | (non cité) | public |
| Streaks et XP | payant (`premium-cta.tsx:99`) | (non cité) | (non cité) | gratuit avec compte (« garder tes XP ») | session requise, pas de plan |
| Parcours | payant | (non cité) | (non cité) | gratuit (« commencer un parcours ») | tout compte voit tout (P0-2) |
| Filtres | (non cité) | payant | payant | payant | verrou UI seulement : `api/jokes/route.ts:45-49` filtre pour tout le monde |
| Favoris | payant | payant | (non cité) | payant | 403 si non Premium |
| « À toi de jouer » | non dit | non dit | non dit | non dit | visible pour tous dans la liste (`vannes-list.tsx:306-310`) et l'accueil (`daily-content.tsx:204-208`), réservé aux connectés sur la page vanne (`how-to-apply-gate.tsx:31-36`) |
| Nouveaux contenus chaque semaine | payant | (non cité) | (non cité) | (non cité) | faux (P0-1) |

**P1-4. Rythme d'entraînement : 5 versions.** « Un petit exercice par jour » (`hero-section.tsx:17`) ; « 5-10 minutes par jour » et « 5 minutes chaque jour » (`faqs.ts:15-16`, `conseils/page.tsx:44`, FAQ affichée sur accueil, `/abonnement`, `/parcours`) ; « voient une vraie différence en quelques jours » (`faqs.ts:5`) vs « 2 à 4 semaines » (`faqs.ts:15`) dans la même FAQ ; « 15 à 20 min/semaine » (`parcours/page.tsx:17,84`) ; « environ 30 minutes par semaine » pour Machine à Café dans l'étalon 2 (`ceo-voice-unified.md:25`), alors que `/parcours` annonce 15 min pour ce parcours. La décision s11 (« une étape par semaine, 15-20 min ») n'a pas été propagée à la FAQ ni au hero. Les chiffres de la FAQ protégés par [CHOIX UTILISATEUR] (« 8 semaines », « 50 XP par semaine », introvertis) ne sont pas concernés ; « quelques jours » et « 5-10 minutes par jour » ne le sont pas : GO requis avant tout changement.

**P1-5. « 1 500+ membres » : 4 occurrences, aucune source dans le repo.** `hero-section.tsx:42`, `premium-cta.tsx:133` (« inscrits »), `a-propos/page.tsx:86, 208`. `project-context.md:80,83` : comptes sociaux à 0 abonné, « trafic inconnu (pas d'analytics) ». Gardé par [CHOIX UTILISATEUR] : on ne le touche pas. Mais la même journée Thomas a posé « que ce soit juste, alignés sur les faits (compteurs prod) » : le seul moyen de concilier les deux est de relever le nombre réel de comptes (`/admin` stats, [À VÉRIFIER], non accessible ici) et de décider en connaissance de cause. « Membres » (comptes ?), « inscrits », « communauté » : 3 mots pour 1 chiffre. → Q4.

**P1-6. Promesses de récurrence sans preuve d'exécution.** (a) Newsletter : consentement « une technique d'humour par semaine » (`newsletter.ts:20`, `newsletter-inline.tsx:29-30, 150-152`, e-mail de confirmation `newsletter/route.ts:56`) ; aucune route cron ne l'envoie (liste des crons : daily-push, monthly-videos, social-analytics, seo-audit, daily-social, daily-content, weekly-seo, seo-report, publish-social, ceo-kpis-snapshot, startup-tasks, scheduler-tick, ceo-tick, monthly-plan) [À VÉRIFIER : l'agent CEO l'envoie-t-il via `ceo-tick` ?]. (b) Push « chaque matin » (décision s11 n°11) dépend du contenu du jour (P0-1). (c) « Vidéo du jour » etc. → Q3.

**P1-7. Messages « Bientôt » et fonctions fantômes.** `upcoming-features.tsx:22-82` : 4 fonctions « Bientôt » sans date, dont « Une communauté » (`:52-55`) alors que `a-propos:86` parle de « notre communauté de 1 500+ membres » (contradiction directe) ; badge « Abonnés » (`:160`) sur une section où le vote s'ouvre à un simple compte [À VÉRIFIER : `api/features/vote`]. `parcours-detail.tsx:738-741` « Le suivi de ta progression arrive bientôt sur ce parcours » s'affiche si le parcours vient du seed hors base : le suivi XP est pourtant une promesse cœur. `premium-paywall.tsx` (mobile) : jamais affiché (a-valider s12, point 17).

**P1-8. « Chacune avec son décryptage » (`vannes/page.tsx:20`, JSON-LD `:69`) : pas garanti.** Le rendu est conditionnel (`vannes-list.tsx:293` `joke.comedyTechnique &&`) ; `audit-global-s11.md:93` note le stock ancien non rempli, `project-context.md:82` « complété au boot, 15/jour ». [À VÉRIFIER : part des 550+ vannes avec décryptage en prod.] Même famille : témoignages de parcours affichés bruts (`parcours-detail.tsx:437-441`) : [À VÉRIFIER dans `docs/content/parcours-seed.json` qu'ils sont cadrés « Imagine… » comme l'impose le [CHOIX UTILISATEUR] du 29/09].

**P1-9. Cible : ce qui brouille.** (a) Le hero réunit 3 personas en un paragraphe et les cartes « Tu te reconnais ? » placent Sophie avant Yanis (`page.tsx:90` « parcours le plus court en premier ») alors que les pastilles hero placent la répartie en tête : ordre incohérent avec le persona principal. (b) Vocabulaire de performance, à contre-emploi d'un introverti qui veut « ne plus rester muet » : « briller en société » (`footer.tsx:66`), « redoutable en société » (`upcoming-features.tsx:167`), « La future star » (`humor-quiz.tsx:77`), « Le comique naturel » (`:71`). (c) « Tu crois avoir tout essayé ? » (`home-cta.tsx:25`) présuppose des échecs antérieurs. (d) Surreprésentation du monde du travail (« machine à café », « afterwork », « boulot » sur 8 surfaces) et absence des mots de Yanis (« coloc », « fac », « soirée étudiante » n'apparaît que dans le quiz Q2, `humor-quiz.tsx:42`). (e) Jargon : « streak » (`page.tsx:99`), « XP », « one-liner », « open mic » : acceptable pour 20 ans, moins pour Marc (34) ; brand-voice interdit le jargon.

**P1-10. Vocabulaire de l'offre : 6 noms.** « Accès complet » (accueil, `/abonnement`), « Premium » (`vannes-list.tsx:208`, `premium-paywall.tsx:109`, erreur API favoris, `abonnement/page.tsx:87` « passes premium »), « offre complète » (`premium-cta.tsx:119`, `premium-modal.tsx:106`), « abonnement », « Abonnés » (`upcoming-features.tsx:160`), « membres » (`how-to-apply-gate.tsx:32` = compte connecté, vs 1 500+ = ?). Un visiteur ne sait pas si « membre » = gratuit ou payant. → Q5.

### P2

**P2-1. Tirets cadratins (—) client-facing : au-delà de l'objet de reset déjà connu.** Liste non exhaustive (pas de Grep disponible ici).

| Emplacement | Nature | Statut |
|---|---|---|
| `lib/email.ts:53` | objet « Réinitialise ton mot de passe — Deviens Marrant » | connu |
| `lib/email.ts:67` | pied de l'e-mail de reset « deviens-marrant.fr — Deviens drôle… » | nouveau |
| `api/newsletter/route.ts:46` | objet « Confirme ton inscription — Deviens Marrant » | nouveau |
| `a-propos/page.tsx:14` | balise title (SERP) « L'humour s'apprend — notre mission » | nouveau (titre : GO explicite requis) |
| `a-propos/page.tsx:35, 53` | réponse FAQ : nettoyée à l'écran (`stripEmDashes`, `:182`) mais pas dans le JSON-LD | nouveau |
| `parcours/page.tsx:41, 52, 63` | noms JSON-LD `Course` (« Parcours Répartie — Aie toujours… ») | nouveau |
| `layout.tsx:80` | alt de l'image Open Graph | nouveau |
| `premium-paywall.tsx:161` | bouton « S'abonner — 0,99 €/mois » (s12 avait acté « · », fichier non mis à jour) | nouveau |
| `ceo-voice-unified.md:17, 23, 25, 34` | les 3 étalons canoniques contiennent des « — » | interne (permis), mais **modèle des e-mails** : à nettoyer avant calibrage, sinon @copywriter les reproduira |
| 34 articles de blog | décision ouverte `a-valider-s12.md` | non audité ici |

Non lus, donc non couverts : blog, glossaire, quiz-humour, vidéos, `conseils-list`, `parcours-content`, header, `manifest`, `opengraph-image`, routes `llms*` (juridique laissé en l'état). → @qa : Grep `—` hors commentaires sur `apps/web/src`.

**P2-2. Concurrents et références.** Aucun concurrent commercial nommé dans les textes lus (Cours Florent, Poisson Fécond, Charisma on Command restent dans `project-context.md`, interne). Deux nuances : « YouTube » dans la question FAQ `faqs.ts:33` (plateforme et alternative, question de FAQ intouchable) ; « Carambar » (`vannes/page.tsx:110`) est un repoussoir de style, pas un concurrent. Humoristes hors pool (Pierre Croce, Foresti, Jamel) : décision s11 n°16 toujours ouverte.

**P2-3. Ton et registre.** Conforme dans l'ensemble (tutoiement, fluide, auto-dérision, pas de staccato hors étalon D). Écarts : (a) liste du coaching au registre corporate (`premium-cta.tsx:162-174` « Diagnostic personnalisé », « Plan d'action sur mesure », « Suivi post-appel ») et mot « Coaching » que la charte s11 §5 demande de couper pour la marque (l'offre elle-même est gardée, s11 n°9) ; (b) « conseils de pros », « techniques de pro », « un professionnel de l'humour » (`home-cta.tsx:28`, `layout.tsx:33, 72`, `premium-cta.tsx:152`) non sourcés : garder, mais qui sont ces pros ? ; (c) titres de partage incohérents (`vannes-list.tsx:277` « Vanne - deviens-marrant.fr » vs `daily-content.tsx:224` « Vanne du jour · … ») ; (d) e-mail de reset sans la signature « L'Équipe Deviens Marrant » (présente dans la confirmation newsletter, `route.ts:67`) ; (e) « Prix de lancement » ×4 (`premium-cta.tsx:67`, `abonnement/page.tsx:100`, `premium-modal.tsx:45`, `faqs.ts:30`) sans échéance : engagement implicite d'un changement de prix ; (f) `brand-voice.md` obsolète (« Signature : Alex » vs « L'Équipe Deviens Marrant » ; « progresser, pas apprendre » vs « L'humour s'apprend » ; « jamais cours/formation » vs title « Cours humour en ligne », SEO gardé) : mise à jour de doc interne, sans impact client.

**P2-4. Autres non-vérifiables ici.** « première plateforme francophone » (`a-propos:66`, `project-context.md:33` = [HYPOTHÈSE] à confirmer par veille) ; « La majorité de nos membres n'avaient aucune expérience » (`a-propos:30`, cousin de la phrase « introvertis » protégée) ; prix mobile 0,99 € appliqué en s11 [À VÉRIFIER dans RevenueCat et les stores, le libellé vient du store]. Aucun de ces points n'est à retirer (cadre « améliorer, pas amputer »).

## 4. Questions / validations pour Thomas

Six décisions. Pour chacune : options, ma recommandation. Rien n'est appliqué.

**Q1. Quelle est LA promesse de fond, et qui la porte en premier ?** (P1-1, carte des messages)
- A. « Ça s'apprend » (méthode : technique, exemple, exercice). B. « La bonne réplique à temps » (résultat situationnel, Yanis). C. « Le meilleur rapport qualité/prix de l'entraînement stand-up » (`project-context.md:29`).
- **Reco : B comme promesse d'usage (hero étalon D, déjà validé), A comme raison de croire, C rétrogradé en preuve** (« moins qu'un café »), en cohérence avec s8 (« produit qui s'apprend, pas qui se vend »). Une seule phrase, reprise à l'identique dans meta accueil, Open Graph et Twitter. Yanis en premier partout (hero, cartes « Tu te reconnais ? », quiz). Mise à jour de la ligne « Promesse unique » de `project-context.md` (datée du 24/03) à faire après ton choix.

**Q2. Où passe la frontière gratuit / payant ?** (P0-2, P0-3, P1-2, P1-3)
- a) Parcours : étape 1 gratuite, étapes 2+ payantes ; les messages sont justes, **le code doit suivre** (contrôle du plan côté écran et API). b) Parcours gratuits avec compte ; on retire « parcours », « streaks et XP » des listes payantes, le payant devient catalogue complet + filtres + favoris. c) Un parcours entier gratuit, les deux autres payants.
- **Reco : a).** C'est ce que tu pensais déjà (s11 n°10), ce que disent 4 surfaces, et le parcours est la seule valeur qui justifie 0,99 €. Dans tous les cas : une seule liste payante, écrite une fois et reprise partout ; « contenu du jour » sort de la liste payante (il est public) ; les favoris sont nommés dans la modale qu'ils déclenchent ; une phrase unique dit ce que donne le compte gratuit (aujourd'hui il ne débloque aucune vanne de plus que l'anonyme).

**Q3. Que promet-on en récurrence tant que la génération est arrêtée ?** (P0-1, P1-6)
- a) Relancer la génération d'abord (crédits Anthropic, crons sur Cloudflare) et garder les promesses. b) Reformuler en promesse vraie (« chaque jour, une vanne, un conseil, une vidéo du catalogue »), retirer « nouveaux contenus chaque semaine », suspendre WhatsApp et la newsletter hebdo tant que rien ne part. c) Ne rien changer.
- **Reco : a), avec contrôle à J+7 ; sans relance à J+7, b).** c) est déconseillé : promesse payante fausse, et le texte de consentement newsletter (« par semaine ») est conservé comme preuve. Le vrai blocage est probablement infra (@infrastructure), pas copy.

**Q4. Preuves chiffrées : que fait-on, ligne par ligne ?** (P1-4, P1-5, P1-8, P2-4)
- « 1 500+ » : relever d'abord le nombre réel de comptes ; ≥ 1 500 = on garde (et on peut le rendre dynamique comme les vannes) ; < 1 500 = ta décision, jamais la mienne. Rythme : aligner « 5-10 min par jour », « quelques jours », « Un petit exercice par jour » sur ton arbitrage s11 (« une étape par semaine, 15-20 min »), et l'étalon 2 (« 30 minutes ») sur `/parcours`. « Première plateforme », « techniques de pro », « chacune avec son décryptage » : garder, vérifier ce qui se vérifie.
- **Reco : GO pour le rythme (c'est déjà ta décision, mal propagée) ; pour « 1 500+ », relevé du compteur avant tout ; rien n'est retiré.**

**Q5. Un seul vocabulaire pour l'offre et la communauté ?** (P1-7, P1-10, P2-3)
- A. « compte gratuit » / « accès complet » partout (dominant sur accueil, `/abonnement`, hero). B. « gratuit » / « Premium » (dominant dans le code et l'API). C. Statu quo.
- **Reco : A.** « Abonné » réservé aux payants, « membre » = tout compte. Badge « Abonnés » du vote à retirer si le vote est ouvert aux comptes gratuits. « Une communauté » : la sortir de « Prochainement » ou faire cesser « notre communauté » dans l'à-propos. « Coaching individuel » : offre gardée (s11 n°9), on tranche seulement le mot vs charte §5 : je garde « Coaching » (produit précis, 99 €) et j'adoucis la liste au registre pote lors du calibrage.

**Q6. GO « ponctuation seulement » pour les tirets cadratins client-facing ?** (P2-1)
- a) GO complet : objets d'e-mail, pied, title à-propos, JSON-LD, alt OG, bouton paywall + les 34 articles (`lib/em-dash.ts` existe déjà) + nettoyage des 3 étalons. b) E-mails et metadata seulement, articles plus tard. c) Statu quo.
- **Reco : a).** Aucun mot, titre, slug ou lien ne change ; seul le title de l'à-propos demande ton accord explicite (SERP).

### Phrases-étalons candidates à calibrer avec toi (à ne PAS appliquer)

Base déjà validée : étalons A à E de la charte s11 et les 3 étalons canoniques de `ceo-voice-unified.md` (dont les « — » sont à nettoyer, Q6). Les 5 candidates ci-dessous couvrent ce qui n'a jamais été calibré. Pour chacune : 2 directions, tu choisis ou tu corriges. Contraintes tenues : tutoiement, aucun tiret cadratin, aucune mention d'IA, aucun concurrent, aucun chiffre nouveau.

| # | Ce que ça teste | Direction A | Direction B |
|---|---|---|---|
| E1 | Promesse sous le hero (Q1) | « Devenir drôle, ça s'apprend : une technique, un exemple, un exercice à tester ce soir. » | « Trouve la bonne réplique pendant que la conversation est encore là, pas le soir en te brossant les dents. » |
| E2 | Frontière gratuit/payant, une ligne sous le CTA (Q2, conditionnelle à Q2 a) | « Compte gratuit : le contenu du jour, un échantillon du catalogue et l'étape 1 de chaque parcours. L'accès complet, c'est 0,99 €/mois, sans engagement. » | « Commence gratuitement, et passe à l'accès complet le jour où tu en veux plus. » |
| E3 | Mur des favoris, texte de la modale (P0-3) | « Les favoris font partie de l'accès complet. Garde tes vannes sous la main pour le jour J. » | « Tu veux la garder pour plus tard ? C'est dans l'accès complet, à 0,99 €/mois. » |
| E4 | « Du jour » honnête (Q3) | « Chaque jour, une vanne, un conseil et une vidéo choisis dans le catalogue. » (vrai avec ou sans génération) | « Du nouveau chaque semaine. » (uniquement si la génération est relancée) |
| E5 | Objet d'e-mail de reset et pied, sans tiret (P2-1) | Objet : « Ton lien pour choisir un nouveau mot de passe » ; pied : « deviens-marrant.fr · Deviens drôle, un exercice à la fois. » | Objet : « Réinitialise ton mot de passe : Deviens Marrant » ; même pied |

Lecture attendue : E1 dit si la promesse est méthode ou situation ; E2 et E3 disent jusqu'où on nomme le mur ; E4 dit si on accepte une promesse plus modeste mais vraie ; E5 fixe la voix des e-mails transactionnels (signature « L'Équipe Deviens Marrant » ajoutée au reset).

## 5. Handoff

**Handoff → Thomas (validation Q1 à Q6 + calibrage E1 à E5), puis @copywriter**
- Fichier produit : `/home/user/Marrant/docs/strategy/audit-messages-s14.md` (aucun autre fichier créé ou modifié).
- Décisions prises : aucune (audit). Cadre respecté sans re-question : [CHOIX UTILISATEUR] du 29/09 (chiffres, « améliorer pas amputer », 1 500+, compteurs 550+/350+, prix 0,99 €, identité Alex Durand/aucun fondateur affiché, juridique en l'état, zéro IA, témoignages fictifs comme exemples).
- Points d'attention :
  - **@copywriter ne démarre qu'après** : réponses Q1 à Q3 (sinon on réécrit une promesse fausse) et calibrage de 3 à 5 étalons avec Thomas (règle P0 s8/s11). Intouchables : slugs, H2, FAQ (questions), liens, chiffres protégés, prix, titres SEO sauf GO.
  - **@fullstack** (après Q2) : contrôle du plan sur les étapes de parcours (écran + `api/parcours`), liste payante en source unique (aujourd'hui 4 listes), limites 10/3/3 dupliquées en dur dans la copy (`abonnement/page.tsx:33, 76`, `premium-cta.tsx:79-87`, `vannes-list.tsx:101`), modale favoris, JSON-LD sans tirets.
  - **@infrastructure** (Q3) : génération arrêtée depuis mi-juin, crons `daily-content` / `daily-push` / envoi newsletter après passage sur Cloudflare (scheduler et verrou pensés pour un process persistant).
  - **@qa** : Grep exhaustif des « — » et des variantes Premium / Accès complet / membres sur `apps/web/src` ; vérifier dans `docs/content/parcours-seed.json` le cadrage « Imagine… » des témoignages ; part des vannes avec décryptage en prod.
  - **@creative-strategy** (après Q1) : mettre à jour `project-context.md` (Promesse unique), `brand-voice.md` (signature, vocabulaire) et nettoyer les étalons de `ceo-voice-unified.md`.
  - Mesure du diff obligatoire après toute réécriture (règle P0 s11) : taux de changement et intouchables vérifiés avant validation.
  - Agents spécialisés : aucun à créer à ce stade (pas d'angle mort vérifiable au-delà de @qa/@infrastructure ci-dessus).

