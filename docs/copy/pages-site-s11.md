# Pages du site — réécriture copy s11 (passe finale) — 29/09/2026

> Agent : @copywriter. Worktree : `/home/user/wt-site` (code : `apps/web/src`).
> Brief : `docs/copy/contenus-s11/_brief.md`. Audit traité : `docs/copy/audit-independant-site-s11.md` (tous les P1/P2).
> Références : charte `charte-refonte-copy-s11.md`, `founder-preferences.md` ([CHOIX UTILISATEUR] 29/09), étalons A-E.

## Cadre

- [Framework : AIDA] pour home / abonnement ; [Framework : PAS] pour /parcours, /vannes, /videos ; microcopy = UX writing (clarté > esprit, humour seulement là où il ne gêne pas l'action).
- [Conscience : Problem-Aware → Solution-Aware] (arrivée SEO sur « devenir drôle / avoir de la répartie »).
- Intouchables respectés : hero (étalon D) et footer (étalon E) mot pour mot, `lib/faqs.ts` inchangé, « 1 500+ membres », tous chiffres/prix/durées/XP, persona fondateur « Alex », exports `metadata` et JSON-LD, logique/props/imports.
- Méthode : inventaire exhaustif par zone → verdict GARDER / RÉÉCRIRE → Edit.

## Inventaire et réécritures par zone

### Zone 1 — Homepage [Framework : AIDA] [Conscience : Problem-Aware]

| Fichier | Élément | Verdict | Avant | Après | Motif |
|---|---|---|---|---|---|
| `components/home/hero-section.tsx` | H1 étalon D | GARDER | « Tu parles et personne rit. On va arranger ça. » | — | Étalon D, intouchable |
| idem | Sous-titre | GARDER | « Tu restes muet quand on te chambre ?… Toi, tu ramènes ta motivation. » | — | 3 personas + chute honnête (audit 4,5) |
| idem | Social proof | GARDER | « Rejoins 1 500+ membres… » | — | Chiffre validé fondateur |
| idem | Chip 3 | RÉÉCRIRE | « Retrouver confiance en soi » | « Reprendre confiance en toi » | Impersonnel → tutoiement |
| idem | Chip 4 | RÉÉCRIRE | « Progresser chaque jour » | « Un petit exercice par jour » | Cliché motivationnel → promesse concrète (écho étalon E) |
| idem | Chips 1, 2, 5 + boutons | GARDER | « Avoir de la répartie », « Briller à la machine à café », « Vannes prêtes à ressortir », « Explorer les vannes », « Voir les conseils », « Commencer à 0,99 €/mois » | — | Mots-clés + clairs |
| `app/(dashboard)/page.tsx` | Carte Sophie (corps) | RÉÉCRIRE | « Pause café, afterwork, dîner entre amis... tu voudrais avoir la vanne qui fait mouche au bon moment ? On te donne des vannes courtes, prêtes à ressortir. Maintiens ton streak pour rester en forme. » | « Pause café, afterwork, dîner entre amis : la bonne vanne te vient toujours, mais dans le métro du retour. On te donne des vannes courtes à ressortir sur le moment, et un streak pour garder le rythme. » | Question rhétorique générique → observation relatable avec retournement ; « rester en forme » = remplissage |
| idem | Carte Yanis (corps) | RÉÉCRIRE | « Tu aimerais avoir de la répartie avec tes potes sans rester planté là ? On t'apprend les bases avec des exercices simples et encourageants. Gagne des XP chaque jour et suis ta progression. » | « Tes potes se chambrent, tu cherches quoi répondre, et quand tu trouves, la conversation est passée à autre chose. On t'apprend les réflexes de base avec des exercices simples, et tes XP te montrent que tu avances. » | Nommer la douleur avec ses mots (PAS) ; « encourageants » = ton scolaire ; liste de features répétée 3 fois |
| idem | Carte Marc (corps) | RÉÉCRIRE | « Après une période difficile, tu veux retrouver ton humour et ta confiance dans tes interactions ? Blagues, techniques de storytelling et auto-dérision. Suis ta progression avec les XP et les streaks. » | « Après une période compliquée, ton humour n'est pas parti, il est juste rouillé. Blagues, storytelling et auto-dérision pour le remettre en route à ton rythme, avec tes XP et ton streak pour mesurer le chemin parcouru. » | « interactions » = jargon ; fragment nominal ; recadrage bienveillant |
| idem | H2 « Tu te reconnais ? », titres des cartes, liens parcours (3/4/6 semaines) | GARDER | — | — | Verbatims persona + durées intouchables |
| `components/home/feature-cards.tsx` | H2 | RÉÉCRIRE | « Tout ce qu'il te faut pour progresser » | « Trois outils pour arrêter de rire par politesse » | Audit P1 (titre scolaire vague) |
| idem | Carte vannes | RÉÉCRIRE | « École, boulot, couple, soirées — trouve la vanne parfaite pour chaque situation. Classées par catégorie, prêtes à ressortir ce soir. » | « École, boulot, couple, soirées : les vannes sont rangées par situation, pour que tu trouves la bonne avant que le moment soit passé. » | « vanne parfaite » = cliché ; redite avec /vannes |
| idem | Carte conseils | RÉÉCRIRE | « …chaque conseil avec un exemple concret et un exercice à tester aujourd'hui. » | « …chaque technique arrive avec un exemple concret et un exercice à tester dès ce midi, à table. » | Phrase sans verbe → fluide et situé |
| idem | Carte vidéos | RÉÉCRIRE | « …analysés technique par technique. Regarde les pros. Vole leurs techniques. » | « …démontés technique par technique pour que tu repartes avec leur mécanique, pas seulement avec le fou rire. » | Audit P1 staccato (G-S21) + répétition « techniques » |
| idem | CTA (Voir les vannes / Découvrir les techniques / Regarder les vidéos) + titres dynamiques | GARDER | — | — | Courts, verbe d'action, compteurs intouchables |
| `components/home/daily-content.tsx` | H2 « Ton contenu du jour », badges, « Révéler la chute », « Pourquoi ça marche », « À toi de jouer », « Exemple concret », « Exercice du jour », « Ce que tu vas apprendre », « Exercice pratique » | GARDER | — | — | Libellés fonctionnels, clairs |
| idem | Empty state vanne | GARDER | « Même l'humour prend un jour off. Reviens demain pour ta dose ! » | — | Audit : très bon |
| idem | Empty state conseil | RÉÉCRIRE | « Le prof d'humour est en pause café. Ça revient demain. » | « Le conseil du jour s'est attardé à la machine à café. Il revient demain, avec des anecdotes. » | « prof » = registre scolaire interdit (§5) ; clin d'œil au parcours Machine à Café |
| idem | Empty state vidéo | GARDER | « L'humoriste du jour est en coulisses. À demain ! » | — | Bon |
| idem | Lien anatomie | RÉÉCRIRE | « Envie de comprendre la mécanique en profondeur ? » | « Tu veux voir comment une vanne se construit, pièce par pièce ? » | Formule creuse → promesse concrète de la page |
| `components/home/home-cta.tsx` | H2 | RÉÉCRIRE | « Prêt à devenir plus drôle ? » | « Et si la prochaine vanne du groupe, c'était la tienne ? » | Question-CTA générique → projection concrète |
| idem | Corps + boutons | GARDER | « …pour moins qu'un café par mois. La seule chose que tu n'as pas encore essayée… » | — | Audit : excellent claim |
| `components/home/premium-cta.tsx` | H2 | RÉÉCRIRE | « Choisis ta formule » | « Deux façons de t'y mettre » | Registre corporate/abonnement |
| idem | Sous-titre | RÉÉCRIRE | « Que tu sois étudiant, jeune actif ou en pleine reconstruction, on a ce qu'il te faut pour devenir vraiment drôle. » | « Étudiant, jeune actif ou en train de tourner une page : tu trouves ici de quoi devenir drôle pour de bon, pas seulement le temps d'un apéro. » | « en pleine reconstruction » lourd ; « on a ce qu'il te faut » = formule vendeuse |
| idem | Mention coaching | RÉÉCRIRE | « Idéal si tu veux progresser vite avec un accompagnement humain » | « Pour toi si tu préfères qu'on regarde ensemble, en direct, ce qui coince » | « accompagnement humain » sous-entend que le reste ne l'est pas (lisière mention IA) |
| idem | Bouton en chargement | RÉÉCRIRE | « Redirection... » | « On t'emmène au paiement… » | Microcopy froide → rassurante |
| idem | Toast erreur | RÉÉCRIRE | « Erreur lors de la création du paiement » | « Le paiement n'a pas pu démarrer. Réessaie dans un instant. » | Message d'erreur technique → action claire |
| idem | Listes d'offres, « Coaching individuel », 99 €, 45 min, « Déjà 1 500+ inscrits — et toi ? », « Prix de lancement », « Populaire » | GARDER | — | — | Chiffres/prix intouchables, nom d'offre acceptable (audit) |
| `components/home/upcoming-features.tsx` | WhatsApp | RÉÉCRIRE | « Reçois chaque jour ta dose d'humour directement sur WhatsApp » | « La vanne, le conseil et la vidéo du jour dans tes messages, coincés entre le groupe de la famille et celui du foot. » | Redite du titre → image relatable |
| idem | Nouveaux parcours | RÉÉCRIRE | « …pour maîtriser l'art de la répartie et du storytelling » | « Des parcours plus poussés sur la répartie et le storytelling, pour le jour où les bases ne te suffiront plus. » | Audit P2 « l'art de » |
| idem | Communauté | RÉÉCRIRE | « Échange avec d'autres passionnés d'humour, partage tes meilleures vannes et progresse ensemble » | « Un coin pour tester tes vannes sur des gens qui ne sont pas obligés de rire, contrairement à ta famille. » | Formule marketing creuse → humour dans la copy |
| idem | Titre + description « Générateur de répartie » | RÉÉCRIRE | « Générateur de répartie » / « …on te génère 3 répliques possibles. Plus jamais muet. » | « Répliques à la demande » / « …on te propose 3 répliques possibles. La prochaine fois, le dernier mot, c'est toi. » | « générateur / génère » = lisière mention IA (audit) ; slug `surprises` inchangé |
| idem | Consigne de vote | RÉÉCRIRE | « Vote pour la fonctionnalité que tu veux voir arriver en premier ! » | « Vote pour ce que tu veux voir arriver en premier : ça nous aide à choisir par quoi commencer. » | « fonctionnalité » = jargon produit |
| idem | Toast erreur vote | RÉÉCRIRE | « Erreur lors du vote, réessaie » | « Ton vote s'est perdu en route, réessaie. » | Voix |
| idem | « Prochainement », « On prépare la suite pour te rendre encore plus redoutable en société. », « Je veux ça ! », « Voté ! », « Connecte-toi pour voter », « Bientôt » | GARDER | — | — | Bons |
| `components/home/faq-section.tsx` + `lib/faqs.ts` | FAQ home | GARDER | — | — | Choix fondateur (inchangée) |
| `app/(dashboard)/page.tsx` | `homepageFaqs` | GARDER | — | — | Utilisées uniquement dans le JSON-LD (hors périmètre) |

### Zone 2 — Header / Footer / 404 / erreurs

| Fichier | Élément | Verdict | Avant | Après | Motif |
|---|---|---|---|---|---|
| `components/layout/header.tsx` | Nav, « Commencer », « Déconnexion », « Mon profil », « Favoris », aria-labels | GARDER | — | — | Nav : clarté > esprit |
| `components/layout/footer.tsx` | Tout | GARDER | « Deviens drôle, un exercice à la fois. … » / « Fait avec humour (et un peu de café) » | — | Étalon E, intouchable |
| `app/not-found.tsx` | H1 | GARDER | « Oups, cette page a oublié sa punchline » | — | Bon |
| idem | Sous-texte | RÉÉCRIRE | « On dirait que cette page n'existe pas... Un peu comme mes talents de danse. » | « Soit elle n'a jamais existé, soit elle est partie avant la chute. Dans les deux cas, le reste du site est plus drôle qu'elle. » | « je » narratif de la marque (charte règle 3) + structure « …comme ma vie sociale » déjà vue partout ([CHOIX UTILISATEUR] vanne connue = faible). Voir points à trancher |
| `app/(dashboard)/parcours/[slug]/error.tsx` | Titre + texte | RÉÉCRIRE | « Impossible de charger ce parcours » / « Une erreur est survenue. Tu peux réessayer ou retourner à la liste des parcours. » | « Ce parcours a raté son entrée en scène » / « Le souci vient de chez nous, pas de toi. Réessaie, ou retourne à la liste des parcours. » | Message système froid → voix + déculpabilisant |

### Zone 3 — /vannes [Framework : PAS]

| Fichier | Élément | Verdict | Avant | Après | Motif |
|---|---|---|---|---|---|
| `app/(dashboard)/vannes/page.tsx` | H1 | RÉÉCRIRE | « Vannes drôles à ressortir en toute occasion » | « Vannes drôles à ressortir ce soir, pas trois jours plus tard » | « en toute occasion » plat ; mot-clé « vannes drôles à ressortir » conservé en tête |
| idem | Intro | RÉÉCRIRE | « …trouve la vanne parfaite pour chaque situation. Clique pour révéler la chute, sauvegarde tes préférées, et ressors-les ce soir. La théorie, c'est bien. Avoir une vanne prête, c'est mieux. » | « …choisis ta situation, clique pour révéler la chute et garde tes préférées sous le coude. La théorie, c'est bien. Avoir une vanne prête au moment où tout le monde te regarde, c'est mieux. » | « vanne parfaite » cliché ; chute gardée et rendue situationnelle |
| idem | FAQ 1 (réponse) | RÉÉCRIRE | « Utilise les filtres… Sauvegarde tes préférées dans tes favoris pour les avoir sous la main. » | « Passe par les filtres… plutôt que celle qui jette un froid. Mets tes préférées en favoris : tu les auras sous la main le jour J. » | Voix ; « 3 secondes » conservé |
| idem | FAQ 2 (réponse) | RÉÉCRIRE | « Le secret, c'est la répétition espacée… En 3-4 répétitions, elle est gravée. » | « Le truc, c'est la répétition espacée… Au bout de 3-4 répétitions, elle sort toute seule, et de préférence au bon moment. » | « gravée » = registre mémorisation scolaire (§5) ; « 3-4 » conservé |
| idem | FAQ 3 (réponse) | RÉÉCRIRE | « Chaque vanne est catégorisée… Du contenu sortable en société, entre potes ou au boulot. » | « Chaque vanne est rangée par catégorie et passe le Test Stand-Up… sans que la pièce se refroidisse. » | « catégorisée », « contenu sortable » = jargon |
| idem | Questions FAQ | GARDER | — | — | Charte règle 6 |
| idem | « Pourquoi ces vannes sont différentes » (3 §) | GARDER | « …doctorat en linguistique. » | — | Audit : excellent ; liens internes intacts |
| idem | H2 maillage | RÉÉCRIRE | « Continue ta progression » | « La suite, si tu as pris goût » | Formule appli générique |
| idem | Carte timing | RÉÉCRIRE | « Timing : le secret des pros » / « Le silence avant la punchline vaut de l'or. Maîtrise le timing. » | « Timing : bide ou carton, même vanne » / « Le silence juste avant la chute fait la moitié du travail. Encore faut-il savoir combien de temps le tenir. » | Cliché (« vaut de l'or », « secret des pros ») + staccato impératif |
| idem | Cartes conseils / vidéos | GARDER | — | — | Concrètes |
| idem | Coquille « resortir » (audit P2) | DÉJÀ CORRIGÉE | — | — | Présente « ressortir » dans le worktree |
| idem | Formule « tennis » (audit P1) | DÉJÀ ABSENTE | — | — | N'apparaît plus sur /vannes dans le worktree |

### Zone 4 — /conseils

| Fichier | Élément | Verdict | Avant | Après | Motif |
|---|---|---|---|---|---|
| `app/(dashboard)/conseils/page.tsx` | H1 + intro | GARDER | « Comment avoir de la répartie et devenir plus drôle » / « …comme si on était à la même table… tu lis, tu testes, tu progresses. » | — | Mot-clé SEO ; intro jugée excellente |
| idem | FAQ 1 (réponse) | RÉÉCRIRE | « La répartie, c'est la capacité à répondre rapidement et avec à-propos… Ces techniques s'apprennent et se perfectionnent avec la pratique. » | « La répartie, c'est trouver la bonne réponse pendant que la conversation est encore là, pas le soir en te brossant les dents. Souvent drôle, toujours rapide… ça s'apprend et ça s'affûte en pratiquant. » | Définition de dictionnaire = ton scolaire |
| idem | FAQ 2 (réponse) | RÉÉCRIRE (fin) | « L'important, c'est la régularité : 5 minutes par jour valent mieux qu'une heure une fois par semaine. » | « Le vrai secret, c'est la régularité : 5 minutes par jour valent mieux qu'une heure une fois par semaine, la veille d'un repas de famille. » | Humour dans la copy ; chiffres (5-10 min, 2 à 4 semaines, 4 semaines, 5 min, 1 h) intacts |
| idem | FAQ 3 (réponse) | RÉÉCRIRE | « …Des techniques comme l'autodérision ou le redirect absurde permettent de désamorcer sans blesser. » | « …c'est transformer une pique en moment drôle pour tout le monde, y compris pour celui qui l'a lancée. L'autodérision ou le détour par l'absurde permettent de désamorcer sans blesser. Tu gagnes l'échange, et personne n'a besoin de le perdre. » | Anglicisme « redirect » ; chute |
| idem | § « Approfondir » 1 | RÉÉCRIRE (début) | « La répartie n'est pas un talent inné — c'est un muscle qui se travaille. » | « La répartie ne se reçoit pas à la naissance avec la couleur des yeux : c'est un muscle qui se travaille. » | « talent inné » = formule usée ; « muscle » gardé (cohérence site) |
| idem | § « Approfondir » 3 | RÉÉCRIRE | « Et pour maîtriser le silence qui fait exploser une punchline, plonge dans notre article… » | « Et pour savoir combien de temps tenir le silence avant la chute, lis notre article… » | Clichés « exploser », « plonge dans » ; lien intact |
| idem | Carte autodérision | RÉÉCRIRE | « Rire de soi sans se démolir — le guide pour transformer tes interactions. » | « Rire de toi sans te démolir : ce qui fait sourire les autres, et ce qui les met mal à l'aise. » | « transformer tes interactions » = jargon coaching |
| idem | § 2, « Explore aussi », autres cartes | GARDER | — | — | Liens + « 30 jours » intacts |

### Zone 5 — /videos [Framework : PAS]

| Fichier | Élément | Verdict | Avant | Après | Motif |
|---|---|---|---|---|---|
| `app/(dashboard)/videos/page.tsx` | H1 | RÉÉCRIRE | « Apprends à être drôle avec les meilleurs humoristes » | « Apprends à être drôle en piquant leur mécanique aux meilleurs humoristes » | Audit P1 (générique) ; mot-clé « apprendre à être drôle » gardé en tête |
| idem | FAQ 1 (réponse) | RÉÉCRIRE | « …C'est la différence entre regarder du tennis et prendre des cours de tennis. » | « …À la fin, tu ne sais plus seulement que c'était drôle : tu sais pourquoi. » | Audit P1 : formule « tennis » réservée à la FAQ home |
| idem | FAQ 3 (réponse) | RÉÉCRIRE | « YouTube te montre des humoristes. Nous, on t'apprend leurs techniques. … (learnings) … (DÉFI). Avec le système de streaks et d'XP, tu gardes la motivation sur la durée. » | « YouTube te montre des humoristes ; ici, on te montre comment ils s'y prennent. … points clés à retenir et un défi concret… tu tiens sur la durée, y compris les semaines où tu as moins envie. » | Jargon interne (learnings), CAPITALES, « système de » |
| idem | § méthode 1 | RÉÉCRIRE (début) | « La différence entre regarder du stand-up sur YouTube et apprendre le stand-up, c'est l'analyse technique. » | « Entre regarder du stand-up sur YouTube et apprendre le stand-up, il y a une étape : l'analyse technique. » | Redite de « différence » avec la FAQ |
| idem | § méthode 2 | RÉÉCRIRE | « un DÉFI concret » | « un défi concret » | CAPITALES interdites (§5) |
| idem | H2 maillage | RÉÉCRIRE | « Continue ta progression » | « Et maintenant, à toi de jouer » | Formule générique (idem /vannes) |
| idem | 3 cartes maillage | RÉÉCRIRE | « Mets en pratique ce que tu apprends — des vannes prêtes à ressortir. » / « Les techniques des pros, adaptées à ta vie quotidienne. » / « Les erreurs classiques et comment les éviter pour faire mouche. » | « Passe à la pratique avec des vannes prêtes à ressortir dès ce soir. » / « Les techniques des pros, ramenées à la taille d'une pause café. » / « Les erreurs qui plombent une vanne avant même la chute, et comment les éviter. » | Clichés (« faire mouche », « vie quotidienne ») |
| idem | Intro, FAQ 2, H2 méthode, § 3 | GARDER | — | — | Dans la voix ; noms d'humoristes et liens intacts |

### Zone 6 — /parcours (page + composants) [Framework : PAS]

| Fichier | Élément | Verdict | Avant | Après | Motif |
|---|---|---|---|---|---|
| `app/(dashboard)/parcours/page.tsx` | « 15 à 20 min/semaine selon le parcours » (audit P0) | DÉJÀ CORRIGÉ | — | — | Conforme [CHOIX UTILISATEUR] 29/09 (metadata + intro) |
| idem | Intro | RÉÉCRIRE | « 3 parcours structurés pour progresser en humour : machine à café, répartie et confiance. 15 à 20 min/semaine selon le parcours, des exercices concrets et des XP à gagner. » | « 3 parcours pour progresser en humour, chacun taillé pour une situation : la machine à café, la répartie et la confiance. Compte 15 à 20 min/semaine selon le parcours, soit moins qu'un épisode de série, avec des exercices concrets et des XP à gagner. » | Liste sèche → promesse + ancrage concret du temps (chiffre intact) |
| idem | Carte Machine à Café | RÉÉCRIRE | « 3 semaines pour avoir des blagues à ressortir au bureau et en afterwork. » | « 3 semaines pour avoir enfin quelque chose à raconter entre deux gorgées de café, au bureau comme en afterwork. » | Voix |
| idem | Carte Répartie | RÉÉCRIRE | « 4 semaines pour développer ta répartie et ne plus jamais rester muet. » | « 4 semaines pour trouver ta réplique pendant qu'elle sert encore à quelque chose. » | « ne plus jamais » = sur-promesse |
| idem | Carte Confiance | RÉÉCRIRE | « 6 semaines pour retrouver confiance grâce à l'humour après une période difficile. » | « 6 semaines pour dérouiller ton humour après une période difficile, et la confiance qui va avec. » | Voix, écho carte home |
| idem | Carte glossaire | RÉÉCRIRE | « Les termes clés pour comprendre les techniques des pros. » | « Le vocabulaire des humoristes, expliqué sans jargon. » | Scolaire |
| idem | H1 « Parcours humour : deviens drôle pas à pas », « Explore aussi », cartes abonnement/conseils, JSON-LD Course | GARDER | — | — | SEO / JSON-LD hors périmètre |
| `components/parcours/parcours-content.tsx` | Question 2 quiz | RÉÉCRIRE | « Quel est ton plus gros frein ? » | « Qu'est-ce qui coince le plus ? » | « frein » = jargon coaching |
| idem | Option « content » | RÉÉCRIRE | « Je manque de blagues à ressortir » | « Je n'ai jamais rien de drôle à raconter » | Verbatim persona (cf. carte home) |
| idem | Résultat Confiance | RÉÉCRIRE | « Tu cherches un parcours complet et bienveillant pour retrouver ta légèreté. » | « Tu veux retrouver ta légèreté sans te forcer : ce parcours prend son temps, et il a raison. » | Adjectifs creux |
| idem | Résultat Répartie | RÉÉCRIRE | « Tu veux avoir la bonne réplique au bon moment — on va t'y aider. » | « Tu veux la bonne réplique pendant qu'elle sert encore : c'est exactement le programme. » | Formule support |
| idem | Résultat Machine à Café | RÉÉCRIRE | « Tu veux un arsenal de vannes et d'anecdotes à ressortir au quotidien. » | « Tu veux avoir de quoi raconter à la pause, autre chose que la météo. » | « arsenal » = cliché ; clin d'œil étalon B |
| idem | Libellé résultat | RÉÉCRIRE | « On te recommande : » | « Ton point de départ : » | Moins vendeur |
| idem | Autres libellés (« Quel parcours est fait pour toi ? », « Programme », « Essai gratuit », « XP à gagner », CTA) + badge « Semaine N » | GARDER | — | — | Clairs ; « Semaine N » = vraie durée hebdo (voir points à trancher) |
| `components/parcours/parcours-list.tsx` | État vide | RÉÉCRIRE | « Aucun parcours trouvé. Découvre nos parcours structurés sur la page Parcours. » | « Les parcours s'échauffent encore en coulisses. Recharge la page dans un instant. » | L'ancien texte renvoyait vers la page où l'on est déjà ; lien conservé |
| `components/parcours/parcours-detail.tsx` | Fin de quiz | RÉÉCRIRE | « Parfait ! » / « Tu maîtrises ce module… » / « Pas grave, l'important c'est de pratiquer… » | « Sans faute ! » / « Tu as tout compris… » / « Pas de souci, ce quiz ne compte pas : la vraie épreuve, c'est ta prochaine conversation… » | Ton scolaire (« module », « maîtrises ») |
| idem | Erreurs de validation | RÉÉCRIRE | « Trop de tentatives. Attends un moment. » / « Impossible de valider cette étape. Réessaie. » / « Erreur réseau. Vérifie ta connexion et réessaie. » | « Doucement, tu cliques plus vite que ton ombre. Attends un instant et réessaie. » / « L'étape n'a pas voulu se valider. Réessaie. » / « La connexion a lâché en route. Vérifie ton réseau et réessaie. » | Staccato système → voix, action claire conservée |
| idem | Erreur de chargement | RÉÉCRIRE | « Impossible de charger ce parcours. Réessaie plus tard. » / « Parcours introuvable. » | « Ce parcours ne veut pas se charger pour l'instant. Réessaie un peu plus tard. » / « Ce parcours n'existe pas, ou plus. » | Voix |
| idem | Paywall étape | RÉÉCRIRE | « Abonne-toi pour accéder à cette étape. » | « Cette étape fait partie de l'accès complet : la première est offerte, la suite coûte moins qu'un café par mois. » | Injonction → valeur (produit qui s'apprend) ; bouton « S'abonner — 0,99 €/mois » gardé |
| idem | Titres de blocs | RÉÉCRIRE | « Pourquoi ce module ? » / « Teste tes connaissances » / « Quiz terminé — tu peux valider l'étape » | « Pourquoi cette étape ? » / « Petit quiz avant de valider » / « Quiz bouclé, tu peux valider l'étape » | Registre scolaire |
| idem | Bouton validation | RÉÉCRIRE | « Validation... » / « Marquer comme terminé » | « On valide… » / « Valider cette étape » | Cohérence avec les autres libellés |
| idem | Seed fallback / étape faite | RÉÉCRIRE | « La progression sera disponible prochainement. » / « Étape complétée » | « Le suivi de ta progression arrive bientôt sur ce parcours. » / « Étape validée » | Voix / cohérence |
| idem | Fin de parcours | RÉÉCRIRE | « {XP} XP gagnés. Tu as développé de nouvelles compétences. Continue sur ta lancée ! » | « {XP} XP gagnés. Le plus dur, maintenant, c'est de ne pas le raconter à tout le monde. Quoique, c'était un peu l'idée. » | Cliché motivationnel (§5) |
| idem | Reco parcours suivant | RÉÉCRIRE | « Envie d'aller plus loin ? Découvre le parcours suivant » | « Tu y prends goût ? Jette un œil au parcours suivant » | Formule générique |
| idem | « Vannes à pratiquer », « Le conseil », « Exemple concret », « Exercice pratique », « Vidéos à regarder », « Termine l'étape N pour débloquer », « Connecte-toi pour valider cette étape », « Bravo, tu as terminé le … ! », « Passer au parcours suivant », aria-labels | GARDER | — | — | Clairs |
| `app/(dashboard)/parcours/[slug]/error.tsx` | voir zone 2 | — | — | — | — |

### Zone 7 — /abonnement + success [Framework : AIDA] [Conscience : Product-Aware]

| Fichier | Élément | Verdict | Avant | Après | Motif |
|---|---|---|---|---|---|
| `app/(dashboard)/abonnement/page.tsx` | Sous-titre (connecté) | RÉÉCRIRE | « Ton compte est créé ! Plus qu'un clic pour accéder à tout le catalogue et commencer à devenir la personne la plus drôle du groupe. » | « Ton compte est prêt. Encore un clic et tout le catalogue est à toi, de la première vanne à la dernière vidéo. » | Sur-promesse (« la plus drôle du groupe ») + ton vendeur |
| idem | Toast erreur fallback | RÉÉCRIRE | « Erreur lors de la création du paiement » | « Le paiement n'a pas pu démarrer. Réessaie dans un instant. » | Cohérence avec premium-cta |
| idem | Bouton chargement | RÉÉCRIRE | « Redirection vers le paiement... » | « On t'emmène au paiement… » | Voix |
| idem | Badges, titres, sous-titre non connecté (10/3/3, 0,99 €), liste, « Crée ton compte gratuit », « Tu annules quand tu veux… Pas de frais cachés, pas de piège. », Stripe | GARDER | — | — | Clairs, chiffres intouchables, rassurance déjà dans la voix |
| `app/(dashboard)/abonnement/success/page.tsx` | Attente | RÉÉCRIRE | « Activation de ton abonnement en cours... » | « On déroule le tapis rouge, ton accès s'active… » | Voix |
| idem | Délai dépassé | RÉÉCRIRE | « L'activation prend plus de temps que prévu. Ton paiement a bien été reçu — ton accès sera activé dans quelques instants. » | « L'activation traîne un peu, comme une vanne qui cherche sa chute. Ton paiement est bien reçu : ton accès arrive dans quelques instants. » | Rassurer avec le sourire, info conservée |
| idem | Bouton secondaire | RÉÉCRIRE | « Continuer vers le site » | « Aller voir les vannes » | Le bouton mène à /vannes : libellé exact |
| idem | « Paiement reçu ! », « Réessayer » | GARDER | — | — | — |

### Zone 8 — /a-propos [Framework : StoryBrand]

| Fichier | Élément | Verdict | Avant | Après | Motif |
|---|---|---|---|---|---|
| `app/(dashboard)/a-propos/page.tsx` | Intro | RÉÉCRIRE (fin) | « …prouver que l'humour n'est pas un don réservé à quelques élus, mais un muscle que tout le monde peut entraîner. » | « …prouver que l'humour n'est pas un don tombé du ciel sur quelques chanceux, mais un muscle que tout le monde peut entraîner, toi compris. » | Cliché « quelques élus » ; « première plateforme francophone » GARDÉ (voir points à trancher) |
| idem | Mission § 1 | RÉÉCRIRE | « Tout le monde a le droit d'être drôle. Que tu sois étudiant timide…, jeune actif en quête de conversation…, ou en reconstruction et en quête de légèreté — on a conçu des parcours pour toi. » | « Tout le monde a le droit d'être drôle, y compris ceux qui répètent leur blague trois fois dans leur tête avant de renoncer à la dire. Étudiant timide qui veut de la répartie, jeune actif qui sèche à la machine à café, ou en train de tourner une page… : il y a un parcours pensé pour toi. » | Double « en quête de » ; ajout d'une observation relatable |
| idem | Mission § 2 | GARDER | « …les principes de la psychologie positive… 1 500+ membres. » | — | Chiffre intouchable ; « psychologie positive » signalé (points à trancher) |
| idem | Approche, point 3 | RÉÉCRIRE | « Progresser par itération — comme un humoriste qui rode son set en open mic, on ajuste grâce au feedback et à la répétition. » | « Roder, comme en open mic — un humoriste teste son set soir après soir : ce qui fait rire reste, ce qui fait un blanc saute. Tu avances de la même façon, essai après essai. » | Jargon produit (« itération », « feedback ») |
| idem | Équipe § 2 | RÉÉCRIRE (début) | « L'équipe combine culture stand-up, pédagogie et technologie pour créer la meilleure expérience d'apprentissage de l'humour en ligne. » | « L'équipe mélange culture stand-up et pédagogie, avec une obsession : que ce que tu lis ici te serve dès ce soir. » | Corporate (« meilleure expérience ») ; « technologie » = lisière mention IA |
| idem | Équipe § 1 (« Alex Durand ») | GARDER | — | — | Persona fondateur, consigne : tel quel |
| idem | FAQ 1 (réponse) | RÉÉCRIRE | « Oui. La majorité de nos membres… Nos parcours commencent au niveau zéro et progressent étape par étape. » | « Oui, c'est même pour eux qu'on l'a construit. La majorité de nos membres… Les parcours partent du niveau zéro et avancent étape par étape, sans jamais te pousser sur scène. » | Voix ; « la majorité » conservé |
| idem | FAQ 2, FAQ 3 (étude 8 semaines, 2 à 4 sem., 3/6 sem.), liste « Pourquoi », Approche 1-2, Contact, bloc final (étalon D + « 1 500+ ») | GARDER | — | — | Chiffres/étude intouchables ; déjà dans la voix |

### Zone 9 — /blog (index)

| Fichier | Élément | Verdict | Avant | Après | Motif |
|---|---|---|---|---|---|
| `app/(dashboard)/blog/page.tsx` | H1 + intro | GARDER | « …Si tu lis un article et que tu ne souris pas au moins une fois, on a raté notre job. » | — | Audit 4,5 ; mot-clé H1 |
| idem | Carte parcours | RÉÉCRIRE | « Progresse semaine après semaine avec des exercices concrets. » | « Tu as lu la théorie ? Les parcours te font passer à la pratique, une semaine à la fois. » | Doublon mot pour mot avec la carte de /conseils ; contexte blog → pratique |
| idem | Cartes glossaire / à propos, « Chargement des articles… » | GARDER | — | — | — |

### Zone 10 — Emails transactionnels

| Fichier | Élément | Verdict | Avant | Après | Motif |
|---|---|---|---|---|---|
| `lib/email.ts` (reset) | Corps | RÉÉCRIRE | « Tu as demandé à réinitialiser ton mot de passe. Clique sur le bouton ci-dessous : » | « Tu as demandé à changer ton mot de passe. Un clic sur le bouton ci-dessous et tu en choisis un nouveau : » | « réinitialiser » = jargon support |
| idem | Sécurité | RÉÉCRIRE | « Si tu n'as pas fait cette demande, ignore cet email. » | « Si tu n'as pas fait cette demande, ignore cet email : ton mot de passe actuel reste valable. » | Rassurance explicite |
| idem | P.S. (ajouté, même balisage `<p>`) | AJOUT | — | « P.S. : oublier un mot de passe, ça arrive à tout le monde. Oublier la chute d'une blague aussi, mais ça, on s'en occupe. » | Audit P1 (email sans voix) ; « Ce lien expire dans 1 heure » intact |
| idem | Objet, bouton, signature étalon E | GARDER | — | — | — |
| idem | `sendAdminAlert`, `ADMIN_EMAIL` alex@ | HORS PÉRIMÈTRE | — | — | Email interne admin |
| `app/api/newsletter/route.ts` (double opt-in) | Corps email | RÉÉCRIRE | « On a besoin d'un dernier clic pour t'envoyer une technique d'humour par semaine. » | « Il nous manque juste un clic pour t'envoyer une technique d'humour par semaine. Promis, c'est la dernière fois qu'on te fait cliquer sans te faire rire. » | Humour dans la copy ; « une par semaine » intact |
| idem | Message succès | RÉÉCRIRE | « Regarde ta boîte mail pour confirmer. » | « Jette un œil à ta boîte mail pour confirmer (et aux spams, on ne se vexe pas). » | Utile (spams) + voix |
| idem | Erreur 500 | RÉÉCRIRE | « Erreur serveur. Réessaie plus tard. » | « Petit souci de notre côté. Réessaie un peu plus tard. » | Jargon technique |
| idem | Objet, bouton, « ignore-le simplement », signature, consentement, « Trop de tentatives. Réessaie dans une heure. », « Tu es déjà inscrit… » | GARDER | — | — | Légal/RGPD ou déjà bon |
| `lib/email/ceo-email-footer.ts` | Footer légal | GARDER | — | — | Conformité CPCE/RGPD |

### Zone 11 — Inscription / connexion / mot de passe

| Fichier | Élément | Verdict | Avant | Après | Motif |
|---|---|---|---|---|---|
| `app/(auth)/register/page.tsx` | H1 | RÉÉCRIRE | « Créer un compte » | « Crée ton compte, ta première vanne t'attend » | Audit P2 (titre neutre) |
| idem | Erreurs Google | RÉÉCRIRE | « Tu as déjà un compte ! Utilise 'Continuer avec Google' sur la page connexion. » / « Erreur lors de l'inscription avec Google. Réessaie. » / « Impossible de lancer la connexion Google. Réessaie. » / « Une erreur est survenue. Réessaie. » | « Tu as déjà un compte. Passe par « Continuer avec Google » sur la page de connexion. » / « L'inscription avec Google a calé en route. Réessaie. » / « Google ne répond pas pour l'instant. Réessaie. » / « Quelque chose a coincé de notre côté. Réessaie. » | Voix + guillemets français |
| idem | Validation champs | RÉÉCRIRE | « Le prénom est requis. » / « Le prénom doit faire au moins 2 caractères. » / « L'adresse email n'est pas valide. » / « Le mot de passe doit contenir au moins 8 caractères. » | « Il nous manque ton prénom. » / « Ton prénom doit faire au moins 2 caractères. » / « Cette adresse email a l'air bizarre. Tu peux vérifier ? » / « Ton mot de passe doit faire au moins 8 caractères. » | Ton formulaire administratif → tutoiement ; règles (2, 8) intactes |
| idem | Erreurs serveur | RÉÉCRIRE | « Erreur lors de l'inscription. » / « Une erreur est survenue. Réessaie. » | « L'inscription n'a pas abouti. Réessaie. » / « Quelque chose a coincé de notre côté. Réessaie. » | Voix, action claire |
| idem | Bouton chargement | RÉÉCRIRE | « Création... » | « On prépare ton compte… » | Voix |
| idem | Labels, placeholders, « Au moins 8 caractères », « Créer mon compte », « S'inscrire avec Google », « Déjà un compte ? Connecte-toi » | GARDER | — | — | Clarté formulaire |
| `app/(auth)/login/page.tsx` | H1 | RÉÉCRIRE | « Connexion » | « Content de te revoir » | Audit : froid |
| idem | Erreurs Google + catch | RÉÉCRIRE | « …Clique 'Continuer avec Google' ci-dessous. » / « Erreur lors de la connexion avec Google. Réessaie. » / « Impossible de lancer la connexion Google. Réessaie. » / « Une erreur est survenue lors de la connexion. » / « Une erreur est survenue. Réessaie. » | « …Clique sur « Continuer avec Google » juste en dessous. » / « La connexion avec Google a calé en route. Réessaie. » / « Google ne répond pas pour l'instant. Réessaie. » / « La connexion a coincé de notre côté. Réessaie. » / « Quelque chose a coincé de notre côté. Réessaie. » | Voix |
| idem | Bouton chargement | RÉÉCRIRE | « Connexion... » | « On t'ouvre… » | Voix |
| idem | « Email ou mot de passe incorrect. », labels, « Se connecter », « Continuer avec Google », « Mot de passe oublié ? », « Pas de compte ? Inscris-toi » | GARDER | — | — | Message sécurité : neutre volontairement |
| `app/(auth)/forgot-password/page.tsx` | Descriptions | RÉÉCRIRE | « Vérifie ta boîte mail pour le lien de réinitialisation. » / « Entre ton email et on t'envoie un lien de réinitialisation. » | « Jette un œil à ta boîte mail, le lien est en route. » / « Donne-nous ton email, on t'envoie un lien pour en choisir un nouveau. Ça arrive aux meilleurs. » | Jargon + déculpabiliser |
| idem | Erreur / chargement | RÉÉCRIRE | « Une erreur est survenue » / « Envoi en cours... » | « Quelque chose a coincé de notre côté. Réessaie. » / « On t'envoie ça… » | Voix |
| idem | « Si un compte existe avec cet email… », « Connexion perdue, réessaie », « Retour à la connexion » | GARDER | — | — | Sécurité (anti-énumération) |
| `app/(auth)/reset-password/page.tsx` | Validations | RÉÉCRIRE | « Le mot de passe doit contenir au moins 8 caractères » / « Les mots de passe ne correspondent pas » / « Une erreur est survenue » | « Ton mot de passe doit faire au moins 8 caractères. » / « Les deux mots de passe ne sont pas identiques. Retape-les ? » / « Quelque chose a coincé de notre côté. Réessaie. » | Tutoiement, action |
| idem | Lien invalide | RÉÉCRIRE | « Lien invalide ou incomplet. » | « Ce lien est cassé ou incomplet. Pas de panique, on t'en renvoie un. » | Voix + transition vers le lien « Demander un nouveau lien » |
| idem | Succès | RÉÉCRIRE | « Mot de passe mis à jour avec succès ! » / « Tu peux maintenant te connecter avec ton nouveau mot de passe. » | « C'est bon, ton nouveau mot de passe est en place. » / « Tu peux te connecter avec. Essaie de t'en souvenir plus longtemps que le précédent. » | Voix (taquin bienveillant) |
| idem | Bouton | RÉÉCRIRE | « Réinitialisation... » / « Réinitialiser le mot de passe » | « On enregistre… » / « Enregistrer mon nouveau mot de passe » | Jargon |
| `components/auth/auth-modal.tsx` | Erreurs, chargements, mot de passe oublié | RÉÉCRIRE | « Une erreur est survenue… » ×3, « Erreur lors de l'inscription. », « Compte créé. Connecte-toi. », « Entre ton email et on t'envoie un lien de réinitialisation. », « Envoi en cours... », « Connexion... », « Création... » | Mêmes formulations que les pages (cohérence) ; « Ton compte est prêt. Il ne reste qu'à te connecter. » | Alignement modale ↔ pages |
| idem | Onglets « Connexion / Inscription », labels, « Mot de passe oublié » | GARDER | — | — | Navigation |

### Zone 12 — Onboarding

| Fichier | Élément | Verdict | Avant | Après | Motif |
|---|---|---|---|---|---|
| `app/(auth)/onboarding/page.tsx` | Sous-titre | RÉÉCRIRE | « 3 questions rapides pour personnaliser ton expérience » | « 3 questions, et on te trouve un point de départ à ta taille » | Audit P2 (jargon marketing) |
| `components/onboarding/humor-quiz.tsx` | Résultat INTERMÉDIAIRE | RÉÉCRIRE | « T'as déjà le sens de l'humour, on va l'affûter. … tu vas devenir celui qu'on écoute. » | « T'as déjà le sens de l'humour, il lui manque juste du réglage. … de quoi devenir celui qu'on écoute quand il prend la parole. » | Redite « affûté/affûter » avec le titre |
| idem | Résultat AVANCÉ | RÉÉCRIRE | « T'es déjà bon ! On va te donner les techniques avancées pour être inoubliable… » | « T'es déjà bon, alors on passe aux réglages fins : les techniques qui font la différence entre une salle qui sourit et une salle qui rit. » | « inoubliable » = hype |
| idem | Résultat EXPERT | RÉÉCRIRE | « Tu vises haut et c'est ce qu'on aime. Analyse les meilleurs, peaufine tes techniques et prépare-toi à briller. » | « Tu vises haut, et on aime ça. On te met les meilleurs humoristes sous les yeux, démontés pièce par pièce : à toi de leur piquer leur mécanique. » | Audit P2 (motivationnel générique) |
| idem | Bouton résultat | RÉÉCRIRE | « Voir mon parcours » | « Voir par où commencer » | Le bouton mène à /conseils ou /videos, pas à un parcours : fausse promesse |
| idem | Résultat DÉBUTANT, verbatims d'options, « Refaire le quiz », « Tout débloquer à 0,99 €/mois » | GARDER | — | — | Audit : dans la voix |
| idem | Questions, options, titres de résultats | GARDER (verrouillé) | — | — | Verrouillés par les tests + titre stocké en localStorage : voir points à trancher |

### Zone 13 — Profil, favoris, listes, microcopy UI

| Fichier | Élément | Verdict | Avant | Après | Motif |
|---|---|---|---|---|---|
| `components/profil/profil-dashboard.tsx` | Messages de progression XP | RÉÉCRIRE | « Tu as atteint le sommet, légende ! » / « Tu y es presque, dernier effort ! » / « Bien joué, continue comme ça ! » / « Tu démarres fort, continue ! » | « Niveau maximum. Il ne te reste plus qu'à faire rire les autres. » / « Le niveau suivant est à portée de vanne. » / « Ça avance, et ça commence à s'entendre. » / « Premiers XP au compteur : le reste vient en pratiquant. » | Clichés motivationnels (§5) |
| idem | Toasts | RÉÉCRIRE | « Erreur lors de l'accès au portail » / « Erreur lors de la création du paiement » | « La gestion de ton abonnement ne répond pas. Réessaie dans un instant. » / « Le paiement n'a pas pu démarrer. Réessaie dans un instant. » | Jargon (« portail ») |
| idem | Chargements | RÉÉCRIRE | « Redirection... » ×2 | « On t'emmène… » / « On t'emmène au paiement… » | Voix |
| idem | État vide parcours | RÉÉCRIRE (ajout) | « Tu n'as pas encore commencé de parcours. » | « … Le plus court dure 3 semaines, à peine le temps de t'y habituer. » | Donner une raison d'agir (durée existante) |
| idem | 5 recommandations (descriptions) | RÉÉCRIRE | « …les fondamentaux pour être à l'aise. » / « Lis des vannes par catégorie et sauvegarde… » / « Tu as les bases ! Choisis un parcours structuré… » / « …pour affiner ton humour. » / « Analyse les techniques… pour t'en inspirer. » | « Commence par la répartie et le timing : les deux réflexes qui changent le plus vite une conversation. » / « Pioche des vannes par situation et garde de côté celles que tu te vois déjà ressortir. » / « Tu as les bases. Un parcours te donne un fil à suivre, une étape après l'autre. » / « …ceux qui font la différence entre drôle et vraiment drôle. » / « Décortique les techniques des meilleurs humoristes, puis pique-leur ce qui te va. » | Ton scolaire/générique ; titres gardés |
| idem | Titres de cartes, stats, badges, « Connecte-toi pour voir ton profil », textes abonnement | GARDER | — | — | Clairs |
| `components/profil/upgrade-toast.tsx` | Toast succès | RÉÉCRIRE | « Bienvenue en Premium ! Accès illimité débloqué. » | « Bienvenue dans l'accès complet : tout le catalogue est à toi. » | Ton jeu vidéo générique |
| `components/vannes/vannes-list.tsx` | Bandeau anonyme | RÉÉCRIRE | « Crée ton compte gratuit pour débloquer les filtres et sauvegarder tes préférées, ou passe à l'accès complet à 0,99 €/mois. » | « Crée ton compte gratuit pour garder tes XP et commencer un parcours, ou passe à l'accès complet à 0,99 €/mois : tout le catalogue, les filtres et les favoris. » | **Fausse promesse** : filtres et favoris sont Premium (code l. 185 + `favoris-list.tsx` + notes project-context) |
| idem | Teasers de chute (3 sur 8) | RÉÉCRIRE | « La chute va te surprendre » / « Le meilleur arrive... » / « Ça pique, prépare-toi » | « Parie sur la chute, puis vérifie » / « La chute est juste derrière » / « Devine d'abord, clique ensuite » | Clickbait / promesse fausse (toutes les vannes ne « piquent » pas) → réflexe d'apprentissage (deviner la chute) |
| idem | État vide | RÉÉCRIRE | « Rien ici... c'est aussi vide que mon frigo un dimanche soir » | « Rien dans cette catégorie pour l'instant, même pas un jeu de mots » | « je » narratif de la marque + blague du frigo vide = déjà vue partout |
| idem | Lien anatomie | RÉÉCRIRE | « Envie de comprendre la mécanique en profondeur ? » | « Tu veux voir comment une vanne se construit, pièce par pièce ? » | Cohérence avec la home |
| idem | Filtres, erreur « Les vannes se sont perdues en chemin. », verrous, pagination | GARDER | — | — | Bons |
| `components/conseils/conseils-list.tsx` | État vide | RÉÉCRIRE | « Aucun conseil ici... on a cherché partout » | « Aucun conseil ne colle à ces filtres, et pourtant on a cherché sous le canapé » | Voix, points de suspension |
| idem | Teasers, erreur « …comme une bonne chute. » | GARDER | — | — | Bons |
| `components/videos/videos-grid.tsx` | États vide/erreur | GARDER | « …même les humoristes font des pauses » / « Les vidéos ont pris un jour de congé. » | — | Bons |
| `components/premium/premium-modal.tsx` | Toast + chargement | RÉÉCRIRE | « Erreur lors de la création du paiement » / « Redirection... » | Formulations communes | Cohérence |
| `components/newsletter/newsletter-inline.tsx` | Erreurs, succès, chargement | RÉÉCRIRE | « Erreur, réessaie plus tard. » / « Regarde ta boîte mail pour confirmer ton inscription. » / « Erreur réseau, réessaie plus tard. » / « Envoi... » | « Petit souci de notre côté. Réessaie un peu plus tard. » / « Jette un œil à ta boîte mail pour confirmer (et aux spams, on ne se vexe pas). » / « La connexion a lâché en route. Réessaie un peu plus tard. » / « On t'inscrit… » | Voix ; texte de consentement RGPD inchangé |
| `components/ui/reaction-buttons.tsx` | Toast | RÉÉCRIRE | « Erreur lors de la réaction » | « Ta réaction s'est perdue en route, réessaie. » | Voix |
| `components/ui/search-bar.tsx` | Aucun résultat | RÉÉCRIRE (ajout) | « Rien trouvé pour « … » » | « Rien trouvé pour « … ». Essaie une de ces pistes : » | Transition vers les suggestions affichées dessous |
| `components/ui/*` (error-state « Oups, on a raté notre entrée. », streak « de suite », share « Copié ! », favoris, placeholder « Rechercher... ») | GARDER | — | — | — | Bons ou verrouillés par tests |
| `components/favoris/favoris-list.tsx`, `app/(dashboard)/favoris/page.tsx` | Tout | GARDER | « …tu nous remercieras en soirée. » | — | Déjà dans la voix |

### Zone 14 — Tests mis à jour (chaînes attendues uniquement)

Aucune logique de test modifiée : seules les chaînes attendues ont été alignées sur la nouvelle copy. 16 fichiers sous `apps/web/src/__tests__/` : `dashboard/hero-section`, `dashboard/daily-content`, `dashboard/home-cta`, `dashboard/profil-dashboard`, `feature/upcoming-features`, `feature/parcours-list`, `feature/parcours-detail`, `feature/parcours-user-simulation`, `feature/vannes-list`, `feature/conseils-list`, `feature/humor-quiz`, `auth/login`, `auth/register`, `auth/forgot-password`, `auth/subscription-success`, `ui/reaction-buttons`. **Tests et build NON exécutés dans cette session** (pas d'outil d'exécution) : à lancer avant commit (`npx tsc --noEmit && npx next lint && npm run build` + jest).

## Suivi des problèmes de l'audit indépendant

| Audit | Problème | Statut |
|---|---|---|
| P0-1 | `jobTitle: "Fondateur & Coach d'humour"` (JSON-LD) | **Non traité ici** : JSON-LD hors périmètre (agent SEO). À lui transmettre : la charte règle 3 interdit « coach » pour la marque |
| P0-2 | « Alex Durand » | Gardé tel quel (consigne : persona fondateur documenté) |
| P0-3 | « 15 min/semaine » | Déjà corrigé dans le worktree (« 15 à 20 min/semaine selon le parcours ») |
| P1-4 | Staccato feature-cards | Traité |
| P1-5 | Formule « tennis » ×3 | Traitée : il ne reste que la FAQ home (inchangée) ; absente de /vannes, retirée de /videos |
| P1-6 | H1 /videos générique | Traité |
| P1-7 | Titre feature-cards vague | Traité |
| P1-8 | Email reset sans voix | Traité (+ email newsletter) |
| P1 | « première plateforme francophone » (/a-propos) | Gardé + signalé (point 2) |
| P2-9 | Coquille « resortir » | Déjà corrigée dans le worktree |
| P2-10 | « l'art de » (upcoming) | Traité |
| P2 | Titre /register neutre, /login froid | Traités |
| P2 | Sous-titre onboarding, résultat quiz EXPERT | Traités |
| P2 | « psychologie positive » (/a-propos) | Gardé + signalé (point 3) |

## Points à trancher (Thomas)

1. **JSON-LD « Coach d'humour »** (`components/seo/json-ld.tsx`) : hors de mon périmètre, à confier à l'agent SEO (proposition audit : `jobTitle: "Fondateur"`). Note : `project-context.md` décrit aussi Alex comme « coach d'humour ».
2. **« deviens-marrant.fr est la première plateforme francophone… »** (/a-propos) : gardé. Option A : assumer tel quel. Option B : « la plateforme francophone dédiée à… ». Le contexte projet marque l'absence de concurrent comme [HYPOTHÈSE].
3. **« principes de la psychologie positive »** (/a-propos, 2 occurrences) + étude « Journal of Positive Psychology, 8 semaines » (FAQ /a-propos) : gardés (chiffres intouchables). Leur source est-elle vérifiable ?
4. **404** : j'ai remplacé « Un peu comme mes talents de danse » (l'audit la trouvait excellente) parce que la marque y dit « je » (charte règle 3) et que la structure « …comme ma vie sociale » est déjà vue partout. Si tu préfères l'ancienne, c'est une ligne à remettre.
5. **Quiz d'onboarding, textes verrouillés par les tests** : titres en Title Case (« En Route Vers la Répartie », « Le Blagueur Affûté », « Le Comique Naturel », « La Future Star ») et options de la question 2 qui se recoupent (« Entre potes / en soirée étudiante » vs « En soirée / rendez-vous »). Proposition : casse de phrase (« En route vers la répartie »…), Q1 « Tu viens chercher quoi, ici ? », Q3 « Aujourd'hui, tes vannes, ça donne quoi ? », Q2 « Entre potes, en coloc » / « Au boulot, à la machine à café » / « En soirée ou en rencard » / « Partout ». Non appliqué : le titre est aussi stocké dans le profil (localStorage), donc les anciens profils garderaient l'ancien libellé. Il faudra aussi mettre à jour `humor-quiz.test.tsx`.
6. **Témoignages des parcours** (seed, affichés en italique entre guillemets sur /parcours et /parcours/[slug]) : hors périmètre (seed parcours), mais visibles. D'après le [CHOIX UTILISATEUR] du 29/09, un témoignage fictif doit être présenté comme un exemple. À traiter par l'agent chargé du seed.
7. **Badge « Semaine N »** (`parcours-content.tsx`, gabarit de code) : gardé, parce qu'il reflète la vraie durée en semaines. La charte §5 recommande « Étape » pour les articles. À toi de voir.
8. **Promesses du compte gratuit** : le bandeau /vannes promettait « filtres + favoris » avec un compte gratuit, alors que les deux sont Premium dans le code. Je l'ai corrigé en « garder tes XP et commencer un parcours ». Il faut confirmer que ces deux points sont bien vrais en gratuit (XP pour les utilisateurs connectés, étape 1 des parcours en « Essai gratuit »).
9. **Prix mobile** : `components/marketing/premium-paywall.tsx` affiche « 4,99€/mois » alors que le web affiche 0,99 €. Hors périmètre (mobile), je n'y ai pas touché. C'est peut-être voulu (commission IAP).
10. **Badge « Populaire »** sur la seule offre d'abonnement et **coaching 99 €** (déjà en attente dans le mémo s11) : gardés.
11. **Hors périmètre, non audités** : pages légales (CGU, mentions, confidentialité, rétractation), /glossaire, /anatomie-vanne, /quiz-humour (`components/quiz/viral-quiz.tsx`), onboarding mobile (`components/mobile/OnboardingFlow.tsx`), CTA d'articles (`components/blog/*`), exports `metadata`, JSON-LD, FAQ home (`lib/faqs.ts`).

## Auto-évaluation

- Étalons D (hero) et E (footer) : intacts mot pour mot. FAQ home : intacte. « 1 500+ » et tous les chiffres/prix/durées/XP : intacts (seuls ajouts : des durées déjà existantes, « 3 semaines » et « 15 à 20 min/semaine », réutilisées).
- Zéro mention d'IA ajoutée ; deux lisières retirées (« Générateur / on te génère », « technologie », « accompagnement humain »).
- Zéro concurrent nommé, tutoiement partout, aucun « coach » ajouté, pas de « je » de marque (le 404 et l'état vide /vannes ont été corrigés sur ce point).
- CTA : tous de moins de 8 mots, avec un verbe d'action.
- Aucune vanne du catalogue réutilisée. Les traits d'humour ajoutés sont des observations de situation (métro du retour, groupe de la famille, repas de famille, canapé), pas des blagues connues.
- Seulement des chaînes modifiées : pas de logique, de props, d'imports, de metadata ni de JSON-LD.

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/wt-site/docs/copy/pages-site-s11.md` (ce rapport). Code modifié (chaînes uniquement) dans `/home/user/wt-site/apps/web/src/` : voir les zones 1 à 13 ; tests alignés : zone 14.
- Décisions prises : registre « pote drôle » appliqué à toute la microcopy (erreurs = « ça a coincé de notre côté » + action) ; CTA inchangés quand ils étaient déjà clairs ; fausses promesses corrigées (bandeau /vannes, bouton du quiz, « ne plus jamais rester muet »).
- Points d'attention : lancer tsc + lint + build + jest avant commit (rien n'a été exécuté ici) ; transmettre le point 1 (JSON-LD) à @seo et le point 6 (témoignages du seed) à l'agent chargé des parcours ; points 2 à 5 et 7 à 10 à arbitrer par Thomas.
---
