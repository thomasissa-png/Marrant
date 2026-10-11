# Audit de conversion : /blog/meilleures-blagues-droles-2026 (s14, 05/10/2026)

> Base : code lu (blog-articles.ts, blog/[slug]/page.tsx, article-cta.tsx, blog-article-parcours-maillage.tsx, markdown-renderer.tsx) et chiffres Umami fournis. Aucun fichier de code modifié. Non consultés : SERP réelle, Search Console, rebond et scroll de CETTE page (manques listés en §3).
> Chiffres : 392 vues sur 1 014 pour le site en 30 j (39 %) ; 115 sur 260 la semaine du 28/09 (44 %), 193 visiteurs (+43 %). Site : rebond environ 88 %, 39 s, Google environ 70 %. 1 inscription cette semaine, 0 Premium.
> Unit economics : acquisition 100 % organique, CAC cash 0 €. LTV = 2,99 € x (1 / churn mensuel) : churn inconnu (0 Premium), LTV non calculée, aucune hypothèse posée. À recalculer après 30 jours. Environ 115 vues/semaine : pas de A/B possible, mesure en avant/après.

## 1. Diagnostic
**Intention** : « blagues drôles » est une requête utilitaire. Le visiteur (Sophie : machine à café, afterwork ; Yanis : soirées) veut une vanne à lire, copier, envoyer ou sortir ce soir. Il ne cherche ni à apprendre ni à s'inscrire.
**Ce qu'il trouve** : H1 « 50 blagues drôles à ressortir en 2026 », environ 200 mots (4 blocs dont la Définition) avant la 1re vanne, puis 50 vannes en 6 sections, 8 min de lecture. Il a ce qu'il cherche, c'est la force de la page.
**Pourquoi il part sans cliquer** :
- Besoin comblé sur place : 39 s et 88 % de rebond collent à « lire quelques vannes et repartir ». Le défaut n'est pas le rebond, c'est l'absence de suite au même besoin.
- Aucune sortie avant le bas : les liens du corps mènent à des articles de pédagogie, 1 seul lien /vannes noyé dans le 3e paragraphe, pas de navigation par situation (les H2 n'ont pas d'ancre).
- Après la vanne n°50 : une section pédagogique, 3 lignes « → » en texte (« vannes du jour » pointe vers /vannes, pas vers /blague-du-jour), puis FAQ, navigation cluster, 3 articles, parcours : 6 blocs avant le 1er appel à s'inscrire.
- CTA de fin décalé : exercices, XP et prix Premium (2,99 €) proposés à quelqu'un qui voulait une vanne ; « Essaie gratuitement » ne dit pas quoi ; un seul point d'inscription, au bout de 8 min de scroll.
- Mobile (constat code, pas de test réel) : 50 paragraphes au même gabarit, sans bouton Copier/Partager alors que l'usage est d'envoyer la vanne par message ; liens du corps en texte courant, sans zone de tap de 44 px.
- Conformité : humoristes nommés (7 endroits) malgré le [CHOIX UTILISATEUR] du 30/09, et promesse « catalogue renouvelé chaque jour » inexacte (c'est la vanne du jour qui change).

## 2. Recommandations (valeur visiteur d'abord, puis visite -> 2e page -> inscription)
**R1. Sommaire par situation (valeur, 2e page).** Gabarit : `markdown-renderer.tsx` ajoute un `id` à chaque H2 (slug auto : minuscules, sans accents, tirets), sans changer le texte des H2. Contenu : remplacer le 3e paragraphe (l. 1378) par :
« L'humour, c'est pas un don, c'est un muscle, et cet article est ta salle de sport. Tu cherches pour une situation précise ? Va direct : [Soirée](#quelles-blagues-sortir-en-soiree-celles-qui-marchent-a-partir-de-22h) · [Bureau](#quelles-blagues-au-bureau-le-lundi-matin-est-un-sport-de-combat) · [Date](#comment-faire-rire-en-date-detendre-un-moment-genant) · [Famille](#les-vannes-en-famille-niveau-expert) · [Potes](#les-vannes-entre-potes-le-labo-d-essai) · [WhatsApp](#les-vannes-whatsapp-reseaux). La [blague du jour](/blague-du-jour) change chaque jour, et le [catalogue de vannes](/vannes) range le reste par situation. »
**R2. Une sortie à la fin de chaque grande section (valeur, 2e page).** Insérer un paragraphe seul, juste avant le `---` de fin de section (lien sur sa propre ligne : bonne zone de tap) :
- après la vanne 8 : « Plus de vannes de soirée, avec leur chute et leur décryptage : [les blagues de soirée](/vannes/theme/soirees). »
- après la 16 : « Plus de vannes pour la machine à café : [les blagues de boulot](/vannes/theme/boulot). »
- après la 24 : « Plus de vannes de date : [les blagues de dating](/vannes/theme/dating). »
- après la 30 : « Plus de vannes de famille : [les blagues de famille](/vannes/theme/famille). »
Pages thème lisibles sans compte (choix 04/10), donc aucune barrière entre le visiteur et sa 2e page.
**R3. Bloc de sortie après la vanne n°50 (valeur, 2e page, quiz).** Insérer avant le `---` précédant « Comment bien raconter une blague drôle ? » :
« **Tu as fait le tour ?** Une nouvelle vanne arrive chaque jour : [la blague du jour](/blague-du-jour), avec sa chute et son décryptage. »
« Tu préfères choisir ta situation ? [Boulot](/vannes/theme/boulot), [couple](/vannes/theme/couple), [dating](/vannes/theme/dating), [soirées](/vannes/theme/soirees), [famille](/vannes/theme/famille), [gaming](/vannes/theme/gaming), [autodérision](/vannes/theme/autoderision). »
« Pas sûr de ton style ? [Le quiz « quel type d'humour es-tu ? »](/quiz-humour) prend environ 2 minutes, sans inscription. »
Et corriger la ligne finale l. 1554 : `[Découvrir nos vannes du jour](/vannes)` devient `[La blague du jour](/blague-du-jour) : une vanne neuve chaque jour, avec sa chute et son décryptage.`
**R4. CTA de fin aligné sur l'intention (conversion, inscription).** `article-cta.tsx` : props optionnelles `title`, `text`, `primaryLabel` (défauts inchangés pour les autres articles), valeurs passées par `page.tsx` pour ce slug :
- titre : « Tu les as lues. Reste à les sortir pour de vrai. »
- texte : « Un compte gratuit te donne chaque jour une vanne décryptée et la première étape de chaque parcours, pour passer de la lecture à l'oral. Sans carte. »
- bouton primaire : « Créer mon compte gratuit » (au lieu de « Essaie gratuitement »). Bouton « Tout débloquer à 2,99 €/mois » laissé tel quel : le retirer demanderait le GO de Thomas (choix 29/09 sur les chiffres). Aucun pop-up, aucune bannière.
**R5. Conformité des textes (choix 30/09, non négociable).** 7 réécritures sans changer le sens ni les liens : l. 1378 (voir R1), l. 1412 « Les pros du stand-up font exactement ça. », l. 1446 « La drague, c'est du stand-up devant une seule personne qui peut partir. », l. 1468 « La famille, c'est un groupe WhatsApp qu'on n'a pas choisi de rejoindre. », l. 1486 « C'est là que tout commence : faire rire sa bande avant de faire rire un public. », l. 1544 « Un silence de 3 secondes peut faire rire à lui tout seul. Toi aussi. », FAQ l. 1564 : retirer « comme [deux noms] » (garder « Les humoristes ne font que mettre en mots ce qu'on pense tout bas. »). Passer `updatedAt` à la date du déploiement (fraîcheur honnête).
**R6. Copier / Partager par vanne (valeur mobile, à instruire après mesure).** Bouton discret sur chaque vanne numérotée (Web Share API, repli copie). Demande du code côté renderer : à lancer seulement si E1 montre un 2e clic faible malgré R1 à R4.

## 3. Mesure Umami (3 événements, 1 seul déploiement)
Un seul wrapper client autour de `MarkdownRenderer` (écoute des clics sur les liens, aucun changement de contenu) et `data-umami-event` sur les CTA. À confirmer par @fullstack : aucun événement personnalisé repéré dans les fichiers lus, et la propagation des attributs par `AuthCta`/`Button`.
- **E1 `blog-sortie-clic`** {slug, zone : sommaire | section | fin-50 | related | parcours, cible : chemin}. KPI : clics par visiteur de la page (visite -> 2e page).
- **E2 `blog-cta-clic`** {slug, bouton : inscription | premium | parcours}. KPI : clics CTA / visiteurs. Les inscriptions réelles (compte admin, source par `callbackUrl`) restent la mesure de vérité : avec 1 à 3 par semaine, jugement à 90 jours, pas à 30.
- **E3 `blog-scroll`** {slug, palier : 25 | 50 | 75 | 100}. Comble le manque : où partent les 88 %.
Baseline : relever 14 jours avant mise en ligne (rebond et durée de la page via Umami, filtre « page d'entrée »). Lecture à 30 jours (E1, E2, E3, rebond de page) puis 90 jours (inscriptions). Aucun objectif chiffré fixé : pas de donnée de départ.

## 4. À ne pas bouger (classement Google)
- **Slug, canonical, H1/title** « 50 blagues drôles à ressortir en 2026 » (titre = H1 via `fitTitle`), année « 2026 » comprise (choix 29/09), page n°1 SEO (choix 28/09).
- **Meta description** (excerpt) : inchangée. Aucune donnée Search Console (CTR, position) ne justifie d'y toucher ; le problème est après le clic. Si le CTR s'avère faible plus tard, test dédié.
- **Les 50 vannes** (texte, numérotation, notes de jeu en italique), les 7 H2 (texte exact), les blocs Définition et CLEF (cibles GEO), la FAQ et son JSON-LD (questions identiques), les liens internes existants. Les ajouts R1 à R3 sont des liens et environ 150 mots, sans image (pas de CLS).
- « 1 500+ membres » : absent de l'article, ne pas l'y ajouter ; s'il apparaît un jour, intouchable.
- Hors périmètre : relecture à l'aveugle des 50 vannes contre la barre « Alexa » (choix 30/09), à traiter à part, vanne par vanne, numéros et H2 conservés.

**Handoff -> @fullstack (R1, R4, wrapper E1 à E3, R6) puis @copywriter (relecture R1 à R5 contre la charte) puis @data-analyst (baseline et tableau E1 à E3)**
- Fichiers produits : /home/user/Marrant/docs/growth/audit-article-blagues-2026-s14.md
- Décisions : sorties naturelles = blague du jour, thèmes /vannes/theme/*, quiz, inscription douce ; pas de pop-up ; PLG organique, budget 0 €.
- Points d'attention : déploiement à documenter dans `REPLIT_ACTIONS.md` ; GO Thomas si le bouton 2,99 € bouge ; R5 applique un choix déjà acté.
