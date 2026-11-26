# Système hebdomadaire Claude / Grok : TikTok, Instagram, LinkedIn, X (s27, 26/11/2026)

> **Principe (Thomas, 26/11/2026).** « non surtout pas d'auto promo. Je veux qu'on parte de l'existant et qu'on améliore progressivement. On est juste là pour partager [du fun : le message d'origine dit « des fans », faute de frappe corrigée] et quelques explications. Encore une fois, ne réinvente pas la roue. »
> On part de ce que Grok publie déjà : améliorer progressivement, 3 améliorations au plus par semaine, ne rien changer à ce qui marche.
> Aucune autopromotion (ni offre, ni Premium, ni prix, ni lettre, ni « va sur le site », critère G8) : du fun et des explications. Le juge est le résultat réel, sans test humain.

> Décision de Thomas du 25-26/11/2026 : publier sur TikTok, Instagram, LinkedIn et X, 2 à 3 posts par semaine, trois sortes de contenu (explication tirée d'un article, extrait du catalogue, actu de l'humour ; la « nouveauté du produit » de la décision d'origine est retirée par la décision du 26/11 sur l'autopromotion). Claude (la session) écrit les textes chaque samedi ; Grok bot fait visuels et vidéos, publie, modère et rend compte. Thomas valide chaque post pendant les 3 premières semaines (programmes S49, S50, S51), puis publication automatique ; **avant de lui présenter un programme, chaque post passe la boucle de qualité du §2bis** (grille `grille-qualite-posts.md`).
> Périmètre (précisions de Thomas du 26/11/2026) : uniquement Deviens Marrant ; Instagram, TikTok, LinkedIn et X ; **les 4 comptes existent déjà et fonctionnent** (aucune création). Lieu de travail : `00. Me/02. Projets/02. Pro/Projets Web/Deviens Marrant/` (dossier `Social/` à l'intérieur). On ne part pas de zéro : voir §0.
> Ce document remplace pour la cadence l'ancien mix 5/5/2 de `mix-formats-s15.md` (jamais repris tel quel : la préparation mensuelle et Buffer sont éteints, voir §6). Les seuils chiffrés de `mesure.md` (X, Instagram, LinkedIn) restent la référence de lecture ; TikTok n'en a pas encore `[À DÉFINIR après 4 semaines de relevés]`.
> Faits de départ : 7 visites venues des réseaux en 30 jours (Umami : t.co 3, linkedin 2, facebook 2). Le point de départ est quasi nul : on mesure donc d'abord les statistiques natives rapportées par Grok (vues terminées, partages, enregistrements, abonnés) contre la médiane de l'état initial, et les visites par UTM à titre de repère seulement, jamais les « j'aime ».

## 0. État des lieux : on ne part pas de zéro (26/11/2026)

Construit sur ce qui existe, rien d'inventé. Ce que la session n'a pas pu lire est écrit comme tel.

### 0.1 Dans le dépôt (`docs/social/`, `docs/copy/`)

| Source | Ce qu'on y trouve | Leçon retenue |
|---|---|---|
| `audit-note-s15.md`, `donnees-audit-s15.md` (05/10) | Note globale 4/10. « PUBLISHED » en base voulait dire « remis à Buffer », pas publié ; Instagram avait perdu son autorisation Buffer (0 publication visible) ; LinkedIn muet depuis août ; social = 1 visite en 28 jours contre 455 en recherche organique | Ne jamais croire un statut sans le relire chez la plateforme : la mesure vient du rapport Grok et d'Umami, pas de la base |
| `audit-qualite-12-10.md`, `duels-resultat-cycle5.md`, `relecture-aveugle-cycle4.md` | Sur 21 vannes publiées du 06 au 16/10 : 3 au niveau de l'étalon (Alexa, canapé, prof IA), 4 limites, 14 sous la barre. Défauts récurrents : clichés (mère, couple et resto, retraité, anniversaire surprise), setup qui livre la chute, moule unique « amorce // chute », tic « À envoyer à » (8 posts Instagram sur 9), « je » qui change de genre, blague connue (détecteur de fumée, attestée depuis 1983, passée faute de recherche réelle). Bruit de notation d'environ un point : la barre « 8,5 chez 2 relecteurs » tourne presque à pile ou face, et l'auteur et le juge sont du même type de modèle | Une vanne médiocre fait plus de tort qu'un post sans vanne. Recherche web obligatoire pour « connue ». Varier les moules. Le juge final reste le résultat réel des posts (statistiques natives), pas un test humain. Origine de la grille v1 |
| `banque-reponses.md` (15 situations, cycles 7 et 8) | Réponses types aux commentaires : brèves, tutoiement, jamais d'émoji, de hashtag, de prix, de « je », troll sans riposte, spam sans réponse, « c'est une IA ? » et plaintes remontées à Thomas | Base de la charte §3.3 de Grok. **Écart tranché le 26/11/2026** : aucune autopromotion (ni prix, ni « gratuit », ni lettre) ; le §2.6 règle 6 et la charte §3.3 sont alignés sur G8 |
| `content-templates.md` (24/03, ancien) | Templates X, LinkedIn, Instagram par format, hook de 5 mots, jamais les prénoms de persona en public, barre « un humoriste peut l'envoyer à un pote » | Garder le hook de 5 mots et l'interdit des prénoms de persona ; il n'y a aucun template TikTok ni vidéo : à écrire dans la semaine S49 |
| `etalons-formats-sociaux-s15.md` (+ `docs/copy/`) | Étalons validés par Thomas le 06/10 : conseils E4 (remarque chirurgicale), E7 (ironie bienveillante), E2 (détails spécifiques), quiz seul, relais LinkedIn (visio, soirée de Noël), carrousels Nicolas/Julien et parking. Barre : technique nommée en 4 mots, situation concrète, chute non annoncée, un seul critère faisable | Garder comme étalons de FORME des contenus B et A, scène d'abord, une seule consigne |
| `mix-formats-s15.md` | Cadence 5 X / 5 Instagram / 2 LinkedIn, stock de vannes « au niveau » très court (22 au 12/10, plancher au 03/11 non recompté), rendement des vagues de production d'environ 0,56 % | Le stock de vannes au niveau est le vrai goulot : confirme le choix « pas de vanne plutôt qu'une vanne moyenne » et 3 contenus maîtres par semaine |
| `mesure.md` | UTM `utm_campaign=AAAA-MM`, seuils J+28 à J+112 par réseau (X, Instagram, LinkedIn), fiabilité, relevé du lundi, limite d'attribution (session d'arrivée) | Garder les seuils comme repères (étiquetés hypothèse) ; changer le format d'UTM (§2.5) ; TikTok absent de la liste blanche `origine` |
| `horaires-sources-s15.md` | Créneaux X 12:30, Instagram 19:30, LinkedIn 08:15 adossés à des études mondiales ; divergence LinkedIn matin ou soir ; plan d'un test A/B | Les créneaux restent des hypothèses ; résultats du test A/B inconnus de la session. Point de départ des créneaux du §2.3, à ajuster après 4 semaines de relevés |
| `file-instagram-retenue-s15.json`, `file-x-retenue-s15.json` | Files de posts préparés en s15 (X : posts jusqu'au 30/11 à valeur `preparation-mensuelle`) | Stock de textes à repasser par la grille avant tout réemploi : plusieurs posts X sont à la 1re personne sans guillemets, contre la règle R6 ; ils ne sont plus en base en attente (voir 0.2) |
| `validation-thomas-s15.md` | 9 posts modèles soumis à Thomas le 05/10 (X1 Alexa, IG1 tuteur, L1 canapé au niveau) | Les 3 posts au niveau servent d'étalons d'humour |
| `social-editorial-plan.json` | **Non relu par moi** (chemin non trouvé dans `docs/social/`) `[À FAIRE par la session : le lire et ajouter ses leçons ici]` | Inconnue |

Fichiers d'audit lus par titre seulement (non relus ligne à ligne) : les séries `notation-*`, `corrections-*`, `strategie-relance-v2` à `v5`, `plan-relance-s15`, `plan-execution-s15`, `social-reform-s7`, `audit-buffer-calendar-openai-s7`. Les verdicts qu'ils portent ne sont pas repris ici.

### 0.2 En base de production (constat de la session du 26/11, lecture seule)

- `SocialPost` : 577 PUBLISHED, 130 FAILED, 75 REJECTED, aucun APPROVED ni PENDING. Publication automatique en pause depuis le 15/10 sur les 3 lignes de `SocialPlatformSetting` (TWITTER, LINKEDIN, INSTAGRAM). **Le réseau TikTok n'existe pas dans l'application** (enum `SocialPlatform` : TWITTER, THREADS, LINKEDIN, INSTAGRAM) : tout ce qui est sur TikTok vient d'ailleurs.
- Colonnes de performance de `SocialPost` (schéma Prisma lu) : `impressions`, `likes`, `retweets`, `replies`, `clicks` (entiers, défaut 0), plus `bufferStatus` (dernier statut relu chez Buffer : sent, error, scheduled, sending, draft, introuvable, non_confirme), `bufferCheckedAt`, `externalId`, `directorScore`, `sourceType` et `sourceId`. **Il n'y a ni vues vidéo, ni enregistrements, ni partages, ni abonnés gagnés.** Le commentaire du schéma dit « remplies par le cron social-analytics », mais l'export du 05/10 les montrait toutes à 0 sur 140 posts publiés.
- Pour retrouver ce qui a marché, la session peut : (a) compter les PUBLISHED par `bufferStatus = sent` (vraiment publiés) contre les autres ; (b) lire `impressions`, `likes`, `replies`, `clicks` par `platform`, `format` et `sourceType` et vérifier qu'ils ne sont pas tous nuls aujourd'hui ; (c) lire les motifs des 130 FAILED dans `directorNote` ; (d) lire les 75 REJECTED (ce que Thomas a écarté et pourquoi). `[À FAIRE par la session avant le programme S49 ; si les colonnes sont à 0, les chiffres d'audience de cette période n'existent que dans les statistiques natives, que seul Grok ou Thomas peut lire.]`

### 0.3 Dans le Drive (vu par la session, non lu par moi)

Dossier `03. Autres/Deviens Marrant/` :
- 6 vidéos TikTok datées du 19 au 25/10 (salle de sport, coiffeur, boulangerie, train, souvenir, pote en retard, mot de passe) `[À VÉRIFIER : la liste donne 7 sujets pour 6 vidéos]` ;
- 14 visuels Instagram du 19 au 25/10 ;
- 4 vidéos « v4 » du 15/10 (je te laisse, mamie, panier, réveil) ;
- kit LinkedIn / Instagram / X du 27/10 : message « La bonne réplique. Au bon moment. » (corrigé de « Au bout moment »), signature « Vannes. Répartie. Exercices. », avatar « dm. » ;
- un set de portraits imaginés « Alex Durand » du 28/10 (identité publique d'Alex, images de synthèse, non publiées) ;
- « Deviens Marrant - Ton d'Alex » v3 (court et long).
Le dossier `02. Pro/Projets Web/Deviens Marrant` paraît vide (créé le 26/11).
Inconnu de la session : si ces vidéos et visuels ont été publiés, sur quel compte, avec quels résultats.

### 0.4 Ce que fait Grok bot aujourd'hui sur Marrant (fait de Thomas, 26/11/2026)

Thomas : « Grok publie déjà les posts sur toutes les plateformes, avec des vidéos et tout. » Grok publie donc déjà sur Instagram, TikTok, LinkedIn et X, vidéos comprises. Ce qui n'est pas connu de la session (consigne actuelle, fréquence, formats, résultats par post) est demandé à Grok par le **bilan initial** du prompt `docs/social/prompt-grok-bilan-initial.md` ; fichier attendu : `Social/bilan-grok-initial-2026-11.md`. Tant qu'il n'est pas arrivé, rien n'est supposé sur ces points. La consigne du §7 s'ajoute à l'existant et ne le remplace que sur ce qu'elle dit : on ne change pas ce qui marche.

### 0.5 Ce qu'on garde / ce qu'on change / ce qu'on arrête

| | Élément | Justification dans l'existant |
|---|---|---|
| **Garde** | Les 4 comptes et leurs bios | Ils existent et fonctionnent (Thomas, 26/11) ; ne pas repartir de zéro |
| **Garde** | Barre d'humour (étalons Alexa, canapé, tuteur) et règle « pas de vanne plutôt qu'une vanne moyenne » | 3 vannes sur 21 au niveau : la barre est le goulot, pas la cadence |
| **Garde** | Étalons de forme du 06/10 (conseils, quiz, relais, carrousels) | Validés par Thomas ; scène d'abord, une consigne |
| **Garde** | Charte de réponses aux commentaires (`banque-reponses.md`) | 15 situations déjà travaillées en 2 cycles |
| **Garde** | Règles de marque : compte = marque, tutoiement, « je » seulement entre « », zéro tiret cadratin, zéro émoji, humoristes cités autorisés | Choix du fondateur, non re-questionnables |
| **Garde** | Seuils de `mesure.md` comme repères et attribution par UTM | Seule chaîne qui relie un post à une visite |
| **Garde** | Kit de marque du 27/10 (« La bonne réplique. Au bon moment. », « Vannes. Répartie. Exercices. », avatar) | Déjà corrigé ; à confirmer par Thomas avant d'être imposé aux briefs |
| **Change** | Cadence : 3 contenus maîtres déclinés en 11 publications au plus au lieu de la préparation mensuelle 5 / 5 / 2 par semaine | La préparation mensuelle a produit un stock sous la barre ; un contenu maître par jour fixe est plus tenable |
| **Change** | Auteur et publication : Claude écrit, Grok publie et rend compte ; fin du cron Buffer de génération | Génération coupée depuis s14 ; la publication n'a plus de statut relu à la main |
| **Change** | UTM : `utm_campaign=AAAA-Sxx`, `utm_content` = id du bloc (au lieu de `AAAA-MM` et `lundi`/`quiz`) | Mesurer par post et par semaine |
| **Change** | Chaque post passe la boucle de qualité avant Thomas (§2bis) | Les cycles s15 ont noté après coup, pas avant |
| **Change** | Un format vidéo vertical par contenu maître (TikTok et Reels) | Les posts d'octobre étaient des cartes ; les vidéos du Drive montrent que le format est déjà essayé `[À VÉRIFIER : résultats inconnus]` |
| **Arrête** | Préparation mensuelle, files `file-*-retenue-s15.json` en l'état, cadence 5/5/2 | Cadence non tenable au niveau (stock), remplacée par ce document |
| **Arrête** | Le moule unique « amorce // chute » sur tous les posts, et « À envoyer à » en légende systématique | Tic observé sur 8 posts sur 9 |
| **Arrête** | Les vannes à clichés connus (liste G10 de la grille) et toute vanne sans recherche « connue » | Faute objective du 16/10 |
| **Arrête (progressivement)** | Toute publication de Grok hors programme déposé, **à partir du premier programme `VALIDE_THOMAS` seulement** ; d'ici là son flux actuel continue et rien n'est retiré (grille §3bis, T7) | Un seul auteur des textes ; on part de l'existant |

## 1. Stratégie courte par réseau (pour Yanis, 20 ans, étudiant, muet quand ça chambre)

### 1.1 Cadence retenue : 3 contenus maîtres par semaine, déclinés par réseau (11 publications au plus)

| Contenu maître | Jour | Type | Rôle |
|---|---|---|---|
| A | lundi | blog : explication tirée d'un article publié (le lien vers l'article seulement s'il prolonge l'explication, jamais en appel à l'action) | partager une explication utile |
| B | mercredi | extrait du catalogue validé (technique, réplique) ; **une nouveauté du produit n'est plus un sujet** (autopromotion, G8) | du fun et une technique à garder |
| C | vendredi | actu : humoristes, saisons, événements | rester dans la conversation de Yanis, être partageable |

| Réseau | Publications / semaine | Lesquelles | Format |
|---|---|---|---|
| TikTok | 3 | A, B, C | vidéo verticale scénarisée 20 à 35 s (accroche dans les 3 premières secondes) |
| Instagram | 3 | A et C en Reels (même montage que TikTok, légende propre) ; B en carrousel 4 à 6 cartes | Reels + carrousel |
| X | 3 | A, B, C | post court (270 signes max, lien compté pour 23) ; image ou vidéo courte si le brief l'exige |
| LinkedIn | 2 | A et B (angle travail et conversation pro : machine à café, réunion) | post texte, 3 phrases, lien en dernière ligne |

Justification : Yanis vit sur TikTok et Instagram, donc la vidéo verticale porte la découverte (2 vidéos par contenu maître suffisent, un seul montage par Grok). X et LinkedIn restent des relais peu coûteux en texte : X pour l'actu et les humoristes, LinkedIn pour Sophie (persona secondaire) et pour la crédibilité de la marque. Total 11 publications mais 3 productions : un volume tenable par Grok sans baisser la barre. Si la qualité fléchit, on retire d'abord LinkedIn C (déjà absent), puis X B, jamais une vidéo TikTok de A. `[HYPOTHÈSE : 3 contenus par semaine, à réviser après 4 semaines de relevés]`

Barre de qualité : l'humour reste au niveau d'Alexa (`docs/copy/ton-alex.md`). Pas de vanne plutôt qu'une vanne moyenne : un post d'actu ou de nouveauté sans blague mais juste est publiable. Une vanne vient du catalogue validé ou est relue à l'aveugle avant le programme.

### 1.2 Rôle et mesure par réseau

| Réseau | Rôle pour Yanis | Lien cliquable | Ce qu'on mesure (objectif : visites et inscriptions à la lettre) |
|---|---|---|---|
| TikTok | découverte : une situation de chambrage reconnue en 3 secondes | non : lien du profil, une seule fois | visites `utm_source=tiktok` (via la page de bio), vues terminées, partages ; 0 seuil avant S53 |
| Instagram | découverte + sauvegarde (Reels, carrousel) | non en légende : lien de bio `/liens` | clics sur le lien de bio, visites `instagram`, partages + enregistrements (seuils `mesure.md` §4) |
| X | actu, humoristes, relais d'articles | oui, dans le texte | visites `x` (et référent `t.co`), clics du lien, réponses + citations |
| LinkedIn | crédibilité, public pro (Sophie) | oui, dernière ligne | visites `linkedin` (et `lnkd.in`), clics, commentaires |

Chaîne de mesure, chaque samedi : visites par `utm_source` et `utm_campaign` (Umami), puis `blog-lettre-envoi` et `lettre-envoi` par `origine`, puis `inscription-reussie` et `abonnement-reussi`. Les « j'aime » et abonnés se relèvent, ne se jugent pas. Attribution à la session d'arrivée seulement (limite de `mesure.md` §1).

Réglages à faire avant la 1re publication (hors de ce document, pas de code modifié ici) :
- **TikTok n'existe pas dans la liste blanche d'`origine`** (`x|instagram|linkedin`, `mesure.md` §1) : sans ajout de `tiktok`, ses visites seront comptées en visites mais pas dans l'entonnoir par origine. À confier à @fullstack.
- **Pas de page `/liens/tt`** (seulement `/liens`, `/liens/x`, `/liens/li`) : en attendant, lien de profil TikTok = `https://deviens-marrant.fr/liens?utm_source=tiktok&utm_medium=social&utm_campaign=bio&utm_content=bio-tiktok` `[À VÉRIFIER : la page /liens pose-t-elle ses propres UTM par-dessus ceux-ci ?]`.

## 2. CONTRAT Claude vers Grok : le programme hebdomadaire

### 2.1 Fichier
- Chemin : `00. Me/02. Projets/02. Pro/Projets Web/Deviens Marrant/Social/programme-AAAA-Sxx.md` (dossier existant, créé le 26/11, précisions de Thomas du 26/11 ; abrégé `Social/` ci-dessous). **Un fichier neuf chaque samedi, jamais d'édition d'un ancien.** Exemple : `programme-2026-S49.md` (semaine du lundi 30/11 au dimanche 06/12, déposé le samedi 28/11).
- Numérotation : semaine ISO. `utm_campaign` = `AAAA-Sxx` (ex. `2026-S49`).
- Statut en tête de fichier : `statut: A_VALIDER` (semaines 1 à 3) puis `statut: VALIDE_THOMAS`. **Grok ne publie que les blocs d'un fichier `VALIDE_THOMAS`** pendant les 3 premières semaines. Après : `statut: AUTO` (publication sans validation, Claude reste seul auteur des textes).
- Un post modifié après dépôt = nouveau fichier `programme-AAAA-Sxx-v2.md` avec la liste des blocs changés. Grok n'applique que la dernière version.

### 2.2 En-tête du fichier
```
# Programme AAAA-Sxx
statut: A_VALIDER | VALIDE_THOMAS | AUTO
grille: <version de grille-qualite-posts.md appliquée, ex. v1.2>
semaine: du <lundi JJ/MM> au <dimanche JJ/MM>
déposé: <samedi JJ/MM> 15h (heure de Paris)
contenus maîtres: A=<titre court>, B=<titre court>, C=<titre court>
silences: <jours sans publication, ou "aucun">
```

### 2.3 Un bloc par publication (un bloc = un réseau = une date)
```
## POST <id>   (id = AAAA-Sxx-<A|B|C>-<tt|ig|x|li>, ex. 2026-S49-A-tt)
- réseau: TikTok | Instagram | X | LinkedIn
- date_heure: <AAAA-MM-JJ HH:MM> (Paris)
- type: blog | développement | actu
- pilier: <éduquer | divertir | engager>
- format: reel | carrousel | post texte | post texte + image
- source: <slug d'article, ligne du journal des nouveautés, ou lien de l'actu avec date>
- texte_final:
  <légende / post prêt à publier, caractère pour caractère, hashtags compris>
- hashtags: <liste, 3 à 5 maximum, ou "aucun">
- lien: <URL complète avec UTM, ou "aucun">
- visuel_ou_video: voir §2.4
- commentaires: <règles propres au post, ou "charte standard (§3.3)">
- alt_text: <description de l'image, une phrase>
- fin_de_validité: <date après laquelle le post ne doit plus partir, ou "aucune">
```

### 2.4 Brief visuel (images, carrousels) et script vidéo (TikTok, Reels)
Vidéo :
```
- durée: <20 à 35 s>
- plan 1 (0-3 s): <image + texte à l'écran EXACT + voix ou sous-titre EXACT>
- plan 2 (...): ...
- dernier plan: <cadre de fermeture : nom du site, rien d'autre>
- texte_à_l'écran: <chaque texte exact, dans l'ordre>
- ton: <ex. complice, sec, jamais criard>
- son: <musique libre de droits ou "sans musique" ; pas d'extrait d'humoriste enregistré sans accord>
- sous-titres: oui (obligatoires)
- interdits: <visage de personne réelle, logo tiers, ...>
```
Carrousel : une ligne par carte (numéro, texte exact, consigne visuelle). Image seule : texte exact + consigne visuelle + format (1080x1350 IG, 1200x675 X).
Si un visuel généré par IA est réaliste (visage, voix, lieu réel) : étiqueter « contenu IA » selon l'option de la plateforme. Pas de ressemblance avec un humoriste ou une personne réelle.

### 2.5 Format du lien et UTM
`https://deviens-marrant.fr/<chemin>?utm_source=<tiktok|instagram|x|linkedin>&utm_medium=social&utm_campaign=<AAAA-Sxx>&utm_content=<id>`
- `utm_content` = l'id du bloc en minuscules (ex. `2026-s49-a-x`). Aucun lien sans UTM, même ajouté à la main (règle `mesure.md` §1).
- TikTok et Instagram : le bloc écrit `lien: aucun` en légende et le texte ne dit pas « lien dans la bio » (G8, aucun appel) ; le lien de bio existant n'est pas modifié.
- X : lien dans le texte. LinkedIn : lien en dernière ligne, jamais en premier commentaire.

### 2.6 Règles fixes (Grok les applique sans discussion)
1. **Grok ne réécrit jamais un texte** : pas de reformulation, pas de raccourci, pas d'ajout de hashtag ou d'émoji. S'il pense qu'un texte est faux, trop long, ou dépassé : il **signale dans son rapport (§3) et ne publie pas ce bloc**.
2. Ton d'Alex (`docs/copy/ton-alex.md`) : tutoiement, guillemets « », le pote drôle et bienveillant, une observation plutôt qu'une leçon. Les posts de marque gardent la voix du site (pas de « je »). Les réponses aux commentaires suivent la charte §3.3.
3. **Zéro tiret cadratin (—)** et zéro émoji, dans les textes comme dans les réponses.
4. **Aucune donnée inventée** : pas de chiffre, prix, témoignage, citation ou date qui ne soit pas dans le bloc. Question hors bloc = « je vérifie » et remontée.
5. Humoristes nommés et cités : autorisés. Chaque citation du bloc est vérifiée par Claude avec sa source (dans la ligne `source`). Grok ne cite jamais un humoriste de mémoire dans une réponse.
6. Aucun concurrent nommé. **Aucune autopromotion (G8)** : ni offre, ni Premium, ni prix, ni abonnement, ni lettre, ni appel à s'inscrire ou à « aller sur le site ». Un lien vers un article du blog n'est permis que si le post explique quelque chose et que l'article prolonge l'explication. Si un abonné pose une question directe sur l'offre, Grok remonte (rapport §6) et ne promeut pas.
7. Créneau manqué de plus de 3 heures sans raison technique : ne pas publier, noter au rapport.
8. Un sujet d'actu sensible (deuil, drame, procès) : ne pas publier la vanne, signaler.

## 2bis. Boucle de qualité avant validation (décision de Thomas du 26/11/2026)

Thomas valide toujours les programmes S49 à S51, mais **un programme ne lui est présenté qu'après que chaque post a passé la boucle ci-dessous**. Le but : lui montrer des posts déjà au niveau, pas lui servir de premier relecteur.

### 2bis.1 La grille
`docs/social/grille-qualite-posts.md` (v1.2 au 26/11/2026) : 17 critères communs G1 à G17 (accroche, une seule idée, ton, source, zéro donnée inventée, lien UTM, format natif, **aucune autopromotion (G8, protégé)**, typographie, humour au niveau ou pas d'humour, variété, brief exécutable, visuels et droits, date et sujet, rattachement et valeur, style fluide, aucun tag), 6 critères vidéo V1 à V6 et 7 critères par réseau (TT1, IG1, IG2, X1, X2, LI1, LI2), soit 30 critères. Chaque critère porte une colonne « Qui » : **C** = contrôle mécanique par la session, **L** = lecteur à l'aveugle. Tous binaires, avec une preuve d'une ligne. La qualité des vidéos est jugée par la session sur le fichier réel (grille §2.1 bis : `ffprobe`, images à 0 s, 1 s, 3 s, milieu et fin).

### 2bis.2 La procédure, par post
1. **Rédaction** : Claude écrit le bloc complet (§2.3) et la fiche de grille (PASS/FAIL et preuve par critère).
2. **Relecture à l'aveugle par 2 lecteurs** : (a) le lecteur « Yanis » (20 ans, étudiant, muet quand ça chambre : il dit s'il garderait ou enverrait le post) ; (b) le lecteur de plateforme (connaissance native de TikTok, Instagram, X ou LinkedIn : format, longueur, accroche, lien). Chaque lecteur reçoit uniquement le post et la grille, jamais la fiche de l'auteur, ni les notes précédentes, ni la source de la vanne. Il rend PASS ou FAIL par critère et une phrase de motif. Les 2 lectures se font dans des sous-sessions séparées.
3. **Correction** : l'auteur corrige les seuls critères en FAIL, sans réécrire le reste.
4. **Nouveau tour** : le post corrigé repasse en entier devant 2 lecteurs (les mêmes, ou d'autres si la correction est profonde).
5. **Seuil de sortie** : tous les critères applicables à PASS chez les 2 lecteurs. Un seul FAIL suffit à renvoyer en correction.
6. **Maximum 3 tours par post.** Au 3e tour encore en FAIL, **le post est écarté** (règle d'or P0 s18 : jamais sous la barre) : le créneau passe au repli (post factuel sans vanne du même contenu maître, ou silence). Le motif de l'écart va dans la note de session et alimente la grille (§2bis.3).
7. **Contrôles mécaniques avant les lecteurs** (sans interprétation) : recherche du tiret cadratin et des émojis, comptage des signes, ouverture de l'URL et de la source, lecture de l'UTM.
8. **Présentation à Thomas** : le programme porte, pour chaque post, « tours : n, critères corrigés : liste » et la liste des posts écartés. Thomas ne reçoit que des posts à PASS complet.

### 2bis.3 Itération de la grille elle-même
- Chaque samedi, étape 9 bis de la routine (§4), avant d'écrire le programme : la session compare les verdicts de la semaine, les signalements de Grok (section 10 du rapport), les clics UTM et les statistiques par post aux critères. Cinq écarts déclenchent une action : post à PASS sans résultat pendant 4 semaines, post à FAIL qui aurait marché, critère toujours PASS depuis 6 semaines, critère qui fait échouer plus de 30 % des posts ou sur lequel les lecteurs divergent, faute objective découverte (blague connue, fait faux).
- Règles : 3 changements au plus par samedi ; un critère d'audience ne bouge qu'après 4 semaines de relevés et 2 posts concordants (à environ 7 visites sociales par mois au départ, une semaine isolée ne prouve rien) ; un critère ajouté est « à l'essai » 2 semaines ; un critère retiré reste dans le journal avec sa raison.
- Versionnage : `docs/social/grille-qualite-posts.md`, v1.2 aujourd'hui, un journal des changements en pied de fichier (version, date, changement, donnée source). La version appliquée est écrite en tête de chaque programme (`grille: v1.2`).

### 2bis.4 Limite de la session
Les relecteurs sont des sous-sessions du même type de modèle que l'auteur : même biais, bruit d'environ un point (`audit-qualite-12-10.md` §3). La boucle réduit les fautes objectives (format, lien, fait, cliché, blague connue) mais **ne remplace pas un rire humain**. Compensations : la validation de Thomas pendant 3 semaines et, surtout, le résultat réel des posts (statistiques natives rapportées par Grok, comparées à la médiane de l'état initial). Thomas, 26/11 : « pas de vrais tests ou autres, juste on regarde si ça fonctionne et on fait ça intelligemment. »

## 3. CONTRAT Grok vers Claude : le rapport hebdomadaire

### 3.1 Fichier
`Social/rapport-grok-AAAA-Sxx.md`, **neuf chaque semaine**, déposé le vendredi soir ou le samedi avant 12h (Paris), pour la semaine du programme du même numéro. Si rien n'est publié : le fichier existe quand même, avec la raison.

### 3.2 Contenu (dans cet ordre, aucune section omise : « néant » si vide)
```
# Rapport Grok AAAA-Sxx
programme lu: <nom du fichier + statut + version>
publié: <n> sur <n> prévus

## 1. Posts partis
| id | réseau | lien du post | heure réelle (Paris) | écart avec le programme |

## 2. Posts non publiés
| id | raison (technique, texte signalé, sujet sensible, validation absente) | action attendue de Claude |

## 3. Statistiques par post (relevées au plus tôt 48 h après publication, date du relevé indiquée)
| id | vues / impressions | vues terminées ou taux de rétention (vidéo) | j'aime | commentaires | partages | enregistrements | clics sur lien (si l'outil le donne) | abonnés gagnés |
Chiffres lus dans les outils natifs, recopiés tels quels. Aucun chiffre estimé. Case vide = « non disponible », jamais 0 par défaut.

## 4. Comptes (relevé du vendredi)
| réseau | abonnés | variation sur la semaine |

## 5. Commentaires notables et réponses données
Pour chaque : réseau, post (id), texte du commentaire (copié), ta réponse (copiée), pourquoi notable.

## 6. Commentaires remontés (non traités par Grok, voir 3.3)
Pour chaque : lien, texte, catégorie (critique de fond, question sur l'offre, résiliation ou paiement, presse ou humoriste cité, harcèlement, droit à l'image).

## 7. Questions récurrentes des abonnés
Liste : question, nombre de fois, réseaux. (Alimente articles et prochains programmes.)

## 8. Incidents
Panne de publication, compte restreint ou signalé, vidéo refusée, droit musical, faux compte, avertissement de la plateforme. Heure, capture ou lien.

## 9. Volet SEO / GEO (s'il en a eu, sinon « néant »)
Actions faites (page, outil, date), constats (indexation, mentions dans des réponses d'IA, sources), actions proposées. Chaque constat porte sa source (URL, capture, date). Jamais de chiffre sans source.

## 10. Signalements de texte
Blocs que Grok a jugés faux ou problématiques : id, phrase, motif. (Grok n'a rien corrigé.)
```

### 3.3 Charte de modération des commentaires

Grok répond seul à :
- remerciement, compliment, émoji seul : un merci court (« Merci, content que ça t'ait fait sourire. »), sans émoji, jamais deux fois la même formule dans la journée ;
- question simple sur le contenu d'un post (la technique, l'humoriste cité, l'explication) dont la réponse est dans le programme ou dans l'article source : réponse d'une ou deux phrases, ton d'Alex ; un lien vers l'article du blog seulement si la personne le demande (UTM `utm_content=reponse`). Aucune promotion (G8) ;
- demande de conseil d'humour en une ligne : un apport utile court, puis « Je peux te partager un article si tu as envie d'en savoir plus. » (modèle de `ton-alex.md`) ;
- troll ou moquerie sans insulte grave : « Pas de problème. Le catalogue est là si tu reviens. » ou ne pas répondre. Jamais de joute, jamais de moquerie de la personne ;
- critique d'une vanne : « Merci d'avoir relevé ça. » + rien d'autre ; la critique est notée au §5 du rapport (la qualité est un sujet de fond pour Claude et Thomas).

Grok ne répond pas, remonte dans le rapport (§6) et, si urgent, prévient Thomas le jour même :
- toute question directe d'un abonné sur l'offre, un prix, un remboursement, une résiliation, un paiement, un compte, une donnée personnelle (RGPD) : Grok ne promeut pas et ne donne ni prix ni conditions ; réponse type permise uniquement « On te répond par e-mail, écris-nous via le site. » `[À VÉRIFIER : adresse de contact à donner, absente de ce document]` ;
- une critique de fond sur le produit, une accusation de plagiat de vanne ou de copie d'un humoriste, une demande d'humoriste ou de son entourage, toute presse ;
- toute personne qui se dit mal (détresse, harcèlement subi) : ne pas plaisanter, ne pas répondre sur le fond, remonter immédiatement ;
- insultes, propos haineux, menaces : masquer ou supprimer selon l'outil, capturer d'abord, remonter ;
- toute demande de droit à l'image, de retrait, de collaboration, de concours ou de partenariat ;
- toute question dont la réponse n'est pas dans les fichiers du vault : « je vérifie » est interdit s'il n'y a pas de suivi ; on remonte.

Jamais : faire de l'autopromotion (offre, Premium, prix, lettre, « va sur le site ») ; promettre une fonction, une date, un prix ; confirmer ou démentir une rumeur ; parler d'un concurrent ; mettre en relation avec un humoriste ; envoyer un message privé non sollicité ; envoyer un lien payant en premier. Délai visé : réponse sous 24 h (jours ouvrés), sans heure fixe (`founder-preferences.md`, 05/10).

## 4. La routine du samedi 15h (heure de Paris), pour la session Claude

Rappel : les 3 premières semaines, le dépôt (étape 11) se fait en `A_VALIDER` après la boucle de qualité (étape 10 bis), puis le statut passe à `VALIDE_THOMAS` seulement sur validation de Thomas. L'ordre est : analyse (9), grille (9 bis), rédaction (10), boucle de qualité (10 bis), dépôt (11), résumé (12). Chaque étape produit une ligne dans la note de session (`Social/routine-AAAA-Sxx.md`) : OK, PAS OK, ou NON FAIT avec la raison. Une étape PAS OK ne bloque pas les suivantes, elle est listée dans le résumé final.

**Première revue, samedi 28/11/2026.** Elle part du bilan de Grok (`Social/bilan-grok-initial-2026-11.md`) s'il est arrivé : état initial par réseau, médianes, étalons de forme, grille passée sur le haut et le bas du classement (grille §3bis), puis programme S49. Sinon, **elle ne produit pas de programme complet** : la session évalue ce qui est visible sur les 4 comptes (textes, vidéos téléchargées et jugées selon la grille §2.1 bis), et propose à Grok **3 améliorations au plus**, sans toucher à ce qui marche. Ensuite, chaque samedi : 3 améliorations au plus.

| N° | Étape | Source | Outil | Critère OK / pas OK |
|---|---|---|---|---|
| 1 | Pages clés du site | `/`, `/blog`, `/vannes`, `/abonnement`, `/register`, `/resiliation`, `/sitemap.xml`, `/robots.txt`, `/llms.txt` | WebFetch ou WebSearch (pas de shell dans la session de rédaction : si un shell existe, `curl -I`) | OK : toutes en 200 (`/resiliation` sans session : redirection vers `/login` attendue, 307). Pas OK : un 4xx ou 5xx, une redirection inattendue. |
| 2 | Articles du blog | `/blog` et le sitemap | lecture de la page et du sitemap | OK : les articles de la semaine sont listés, leur URL répond 200, ils figurent dans le sitemap avec `lastmod` de la semaine. Pas OK : article annoncé absent, ou dans le sitemap mais en 404. |
| 3 | Santé applicative | point de santé de l'application (santé `ok`, base `up`, Stripe `live`, relevé le 25/11 dans `REPLIT_ACTIONS.md`) `[À VÉRIFIER : chemin exact, probablement /api/health]` | WebFetch | OK : `ok` et base `up`. Pas OK : autre valeur, alerter Thomas le jour même. |
| 4 | Google (Search Console) | propriété `deviens-marrant.fr`, 7 derniers jours contre les 7 précédents | accès Search Console du projet `[À VÉRIFIER : outil d'accès dans la session, par exemple l'API Search Console ou l'export de Thomas]` | OK : clics et impressions lus pour les 20 premières pages et les 20 premières requêtes, avec pages en baisse de plus de 30 % identifiées. Pas OK : accès impossible (le dire, ne pas inventer). |
| 5 | Bing (Webmaster Tools) | clé `BING_WEBMASTER_API_KEY` (secret du projet, jamais écrite dans le vault) | test de la clé par un appel de lecture (ex. liste des sites de l'API Bing Webmaster) `[À TESTER : la clé n'a pas été testée à ce jour]` | OK : réponse 200 avec la propriété du site, puis requêtes et clics lus. Pas OK : 401/403 ou clé absente : noter « clé à régénérer » et le demander à Thomas ; ne pas poursuivre en devinant. |
| 6 | Visibilité dans les IA (méthode honnête) | liste fixe de 10 questions (ex. « comment devenir drôle », « comment avoir de la répartie », « exercices pour développer son humour », 3 autres tirées des requêtes Search Console) | WebSearch, et si disponibles les réponses de ChatGPT, Perplexity, Gemini posées à la main par Thomas ou par Grok (consigne : question exacte, capture datée) ; Umami : référents `chatgpt.com`, `perplexity.ai`, `gemini.google.com` | OK : tableau question x moteur x « le site est cité : oui/non, lien, position », sur les mêmes 10 questions chaque semaine, plus les visites venues de ces référents. **Limites écrites** : les réponses varient d'un essai à l'autre, dépendent du compte, de la date et de la zone ; 10 questions ne font pas une statistique ; l'absence d'une citation n'est pas une preuve de non-visibilité. On lit une tendance sur 4 semaines, jamais une semaine isolée. Chaque recommandation cite la ligne qui la justifie. |
| 7 | Rapport de Grok | `Social/rapport-grok-AAAA-Sxx.md` de la semaine écoulée | lecture du fichier du vault | OK : fichier présent, 10 sections remplies, tous les posts prévus listés (partis ou expliqués). Pas OK : fichier absent ou incomplet (le noter, demander à Thomas de relancer Grok). |
| 8 | Clics UTM de la semaine passée | Umami, site `deviens-marrant.fr`, lundi à dimanche écoulés | API ou export Umami | OK : visites par `utm_source` et `utm_content` (id de bloc), événements `blog-lettre-envoi`, `lettre-envoi`, `inscription-reussie`, `abonnement-reussi` par `origine`, rapprochés des clics de bio natifs. Écart entre vues natives et visites noté. Pas OK : aucune donnée, ou propriété d'événement manquante. |
| 9 | Analyse et leçons | étapes 4 à 8 | session Claude | OK : 3 constats au plus (ce qui a amené une visite ou une inscription, ce qui n'a rien amené, une question récurrente), chacun avec le chiffre source ; recommandations numérotées, chacune rattachée à un constat. Aucune recommandation sans donnée. |
| 9 bis | Mise à jour de la grille | verdicts de la semaine (fiches de grille, tours, posts écartés), rapport Grok (sections 3 et 10), clics UTM, remarques de Thomas, `docs/social/grille-qualite-posts.md` §4 | session Claude | OK : tableau des écarts rempli (voir les 5 écarts du §2bis.3), 3 changements au plus appliqués au fichier, nouvelle version et ligne ajoutée au journal des changements (ou « aucun changement » avec la raison), version écrite dans `Social/routine-AAAA-Sxx.md`. Pas OK : une règle de changement non respectée (plus de 3, ou critère d'audience modifié avant 4 semaines). |
| 10 | Programme de la semaine suivante | journal des nouveautés (§5), derniers articles du blog, calendrier d'actu (humoristes, saisons, événements vérifiés par WebSearch), rapport Grok | rédaction par la session, les textes d'humour passés à l'aveugle comme pour tout contenu public | OK : 3 contenus maîtres A/B/C, 11 blocs au plus, chaque bloc complet selon §2.3, chaque lien avec UTM, chaque citation d'humoriste vérifiée avec sa source, 0 tiret cadratin, 0 émoji, jamais le même sujet avec le même angle qu'un post déjà parti (registre : liste des `source` des 8 derniers programmes). Contrôle de la barre d'humour. Pas OK : un seul bloc incomplet : on ne dépose pas ce bloc. |
| 10 bis | Boucle de qualité | brouillon de l'étape 10, grille de la version écrite à l'étape 9 bis | session Claude : fiche de grille par post, 2 sous-sessions de relecture à l'aveugle par post (Yanis, relecteur de plateforme), contrôles mécaniques (tiret, émojis, signes, URL, source) | OK : chaque post déposé a tous ses critères applicables à PASS chez les 2 lecteurs en 3 tours au plus ; les posts non conformes au 3e tour sont écartés et remplacés par le repli (§2bis.2) ; la note de session liste, par post : tours, critères corrigés, écartés. Pas OK : un post déposé sans fiche, ou avec un FAIL non traité : on le retire du programme. |
| 11 | Dépôt dans le vault | dossier `00. Me/02. Projets/02. Pro/Projets Web/Deviens Marrant/Social/` | outil du vault (Obsidian ou Drive selon l'accès de la session) | OK : `programme-AAAA-Sxx.md` (nouveau, statut `A_VALIDER` ou `AUTO`, ligne `grille: vN`), `routine-AAAA-Sxx.md`, relevé SEO/GEO ; relecture du fichier déposé. Pas OK : écriture impossible : coller le contenu dans le résumé à Thomas. |
| 12 | Résumé à Thomas | message de fin de session | session | OK : 10 lignes au plus : ce qui est OK, ce qui est PAS OK, **ce qui demande sa décision** (validation du programme les 3 premières semaines, clé Bing, un réglage, un post sensible), 1 chiffre clé (statistique native du meilleur post de la semaine contre la médiane de l'état initial). |

## 5. Le journal des nouveautés

- Fichier : `docs/marrant/journal-nouveautes.md` (créé avec ce document). **Une ligne par mise en ligne visible par l'utilisateur** : `JJ/MM/AAAA | phrase simple, en français courant, sans jargon ni nom de version | où le voir`. Les entrées les plus récentes en haut. Rien d'interne (migration, test, refactor) : seulement ce qu'un visiteur ou un abonné peut voir ou faire.
- **Où l'écrire dans le processus** : dans la section « DÉPLOYÉ » de `REPLIT_ACTIONS.md`, chaque entrée destinée au site public (« SITE PUBLIC ») porte une ligne finale `Journal des nouveautés : <phrase>` ou `Journal des nouveautés : aucune (invisible)`. Celui qui déploie (@infrastructure) ajoute la ligne au journal dans le **même commit** que la mise à jour de `REPLIT_ACTIONS.md`, avec la date du passage à 100 %. Pas de ligne dans le journal = la nouveauté n'existe pas pour les réseaux.
- Contrôle du samedi (étape 10) : toute entrée « DÉPLOYÉ » de la semaine marquée « SITE PUBLIC » sans ligne au journal est signalée à Thomas, puis ajoutée.
- Usage : le contenu maître B de chaque semaine vient du journal ; sans nouveauté de la semaine, B reprend une nouveauté récente non encore racontée (registre anti-répétition), sinon un extrait du catalogue validé.
- `[À FAIRE par la session, à valider : ajouter cette ligne finale au gabarit d'entrée de REPLIT_ACTIONS.md et au protocole de déploiement d'@infrastructure ; ce document n'y touche pas.]`

## 6. Risques et garde-fous

### 6.1 Ancien cron Buffer : état exact (lu dans le code, rien modifié)

| Élément | Où | État lu |
|---|---|---|
| Génération quotidienne des posts | route `apps/web/src/app/api/cron/daily-social/route.ts` | **Éteinte dans le code, définitivement** (s14, décision du 01/10) : renvoie `disabled: true, generated: 0`, aucun appel LLM, aucune écriture. L'agent `social-media-agent.ts` porte l'en-tête « ARCHIVÉ : NE PLUS APPELER ». Ce n'est pas elle qui publiait vers Buffer. |
| Planification | `apps/web/vercel.json` | Ne contient **aucun** cron social (seulement `daily-content` x2 et `monthly-plan`). Sans objet en prod : l'hébergement est Cloudflare. |
| Planificateur de prod | `apps/web/wrangler.jsonc`, `triggers.crons` = `*/15 * * * *` et `0 1 * * *`, `vars.CRON_ENABLED = "true"` | **Actif.** Le tick de 15 min exécute les jobs de `src/lib/scheduler/jobs.ts`. `[À VÉRIFIER : que l'un de ces jobs appelle /api/cron/publish-social (lu seulement les 140 premières lignes du fichier, la route annonce « Tourne toutes les 30 minutes »)]` |
| Remise des posts à Buffer | route `apps/web/src/app/api/cron/publish-social/route.ts` | Elle lit l'interrupteur par réseau avant d'envoyer (`reseauxEnPause`) et publie les posts `APPROVED` dont `scheduledAt <= now`. |
| **Interrupteur** | table `SocialPlatformSetting` (colonne `paused`, une ligne par réseau : TWITTER, INSTAGRAM, LINKEDIN), `apps/web/src/lib/social/platform-switch.ts`, changé depuis l'écran admin « social » | Règle de code : **ligne absente ou base illisible = en pause**. État initial de la migration 11 : les 3 réseaux en pause. **État réel de la base : non lu** (pas d'accès base dans cette session). Selon Thomas, la publication automatique est en pause depuis le 15/10 (dernière mise à jour des 3 lignes, constatée en base le 26/11) : cela devrait correspondre à `paused = true` sur les 3 lignes. `[À VÉRIFIER par Thomas ou @infrastructure : écran admin social, 3 réseaux sur « Pause »]` |
| Secret | `BUFFER_ACCESS_TOKEN`, `BUFFER_ORGANIZATION_ID` (secrets du Worker) | Présence non vérifiable ici. Tant qu'ils existent, un « Reprise » dans l'admin relancerait l'envoi. |

Pas de nouveau cron à créer pour le système Claude/Grok : la publication se fait par Grok, hors du dépôt, sans passer par l'application.

### 6.2 Garde-fous

1. **Pas de double publication** : tant que Grok publie, les 3 réseaux restent en **Pause** dans l'admin social, et personne ne clique « Reprise ». Au démarrage (avant la 1re publication de Grok) : Thomas ouvre l'admin social et confirme 3 pauses ; la session note la date dans `Social/routine-AAAA-Sxx.md`. À la reprise, le code rattrape les posts `APPROVED` en retard de moins de 24 h et replanifie le reste à 1 par jour : un clic accidentel enverrait donc d'anciens posts.
2. **Nettoyage proposé (décision Thomas, non fait)** : passer en `REJECTED` les posts `APPROVED` ou `PENDING` restants en base, vider la file Buffer, puis retirer `BUFFER_ACCESS_TOKEN` du Worker. Aucun de ces gestes n'est fait par ce document.
3. **Doublons de sujet** : registre des `source` des 8 derniers programmes ; jamais le même sujet avec le même angle.
4. **Pas de double compte** : Buffer et Grok ne gèrent pas le même compte au même moment (canaux Buffer déconnectés ou en pause).
5. **Aucune autopromotion (G8)** : aucun post ne cite l'offre, Premium, un prix, la lettre ou le site comme destination. Un chiffre de catalogue cité dans une explication (`project-context.md` du 24/03 : 290+ vannes, 60+ conseils, 80+ vidéos) est **daté et à revérifier**. Aucun post ne promet une fonction. Le journal des nouveautés (§5) ne sert plus de sujet de post.
6. **Humour sous la barre** : une vanne n'entre dans un programme qu'après relecture à l'aveugle ; sinon bloc sans blague (règle d'or P0 s18 : jamais remettre en ligne un contenu sous la barre).
7. **Validation des 3 premières semaines** : Grok publie seulement un fichier `VALIDE_THOMAS`. Le passage à `AUTO` est une décision écrite de Thomas, datée dans `Social/routine-AAAA-Sxx.md`.
8. **Dérive d'attribution** : TikTok non reconnu dans `origine` et pas de page de bio dédiée (§1.2) tant que @fullstack n'a pas livré.
9. **Droits** : musique libre de droits uniquement ; aucune capture de spectacle d'un humoriste sans accord ; concours, partenariat, UGC et droit à l'image : @legal avant tout.

## 7. Consigne à donner à Grok bot (à copier tel quel)

```
Tu es l'agent opérationnel de Deviens Marrant (deviens-marrant.fr), un site qui apprend à devenir drôle et à avoir de la répartie, sur le modèle du stand-up français. Public principal : Yanis, 20 ans, étudiant, qui reste muet quand ça chambre. Tu travailles avec Claude, qui écrit tous les textes. Tu ne rédiges aucun texte de publication.

DOSSIER : 00. Me/02. Projets/02. Pro/Projets Web/Deviens Marrant/Social/
- Tu LIS : programme-AAAA-Sxx.md (un fichier neuf chaque samedi, déposé vers 15h Paris). Lis le plus récent, vérifie sa ligne "statut".
- Tu ÉCRIS : rapport-grok-AAAA-Sxx.md (un fichier neuf par semaine, déposé au plus tard le samedi 12h Paris). N'édite jamais un fichier existant, crée-en un nouveau.

TON TRAVAIL
1. Pour chaque bloc "POST" du programme : produis le visuel ou la vidéo exactement selon le brief (plans, texte à l'écran, durée, ton), puis publie à la date et à l'heure indiquées avec le texte_final copié caractère pour caractère (légende, hashtags, lien avec UTM compris).
2. Statut A_VALIDER : ne publie rien, tu attends VALIDE_THOMAS. Statut VALIDE_THOMAS ou AUTO : tu publies. Si deux versions existent (-v2), applique la plus récente.
3. Tu ne réécris JAMAIS un texte : ni reformulation, ni raccourci, ni émoji, ni hashtag ajouté. Si un texte te semble faux, trop long, dépassé ou sensible, tu NE PUBLIES PAS ce bloc et tu le signales dans le rapport (section 10).
4. N'invente aucune donnée : pas de chiffre, prix, date, témoignage ni citation qui ne soit pas dans le bloc. Zéro tiret cadratin, zéro émoji, aucun concurrent nommé. Les humoristes nommés dans les textes sont autorisés ; n'en cite jamais un de mémoire.
5. Visuels : pas de visage de personne réelle, pas de ressemblance avec un humoriste, musique libre de droits uniquement. Étiquette "contenu IA" sur tout visuel réaliste généré.
6. Commentaires : réponds seul aux remerciements, aux questions simples dont la réponse est dans le programme ou sur le site, aux trolls (sobrement : "Pas de problème. Le catalogue est là si tu reviens."). Ton d'Alex : tutoiement, le pote drôle et bienveillant, court, sans leçon. REMONTE sans répondre : prix, paiement, remboursement, résiliation, compte, données personnelles, critique de fond, presse, humoriste ou entourage, droit à l'image, détresse, harcèlement, insultes graves (capture d'abord), toute question dont tu n'as pas la réponse dans le dossier. Ne promets jamais une fonction, une date, un prix. Aucune autopromotion, ni dans les réponses ni dans les posts : si un abonné te pose une question directe sur l'offre, tu remontes sans promouvoir. Pars de ce que tu fais déjà : ne change rien à ce qui marche, applique seulement les améliorations demandées par le programme.
7. Chaque vendredi, relève les statistiques natives par post (48 h après la publication au plus tôt) et les abonnés par réseau. Recopie les chiffres tels quels. Case vide = "non disponible". Jamais d'estimation.
8. Rapport hebdomadaire : suis le format du contrat (10 sections : posts partis, non publiés, statistiques, comptes, commentaires notables, commentaires remontés, questions récurrentes, incidents, volet SEO/GEO si tu en as fait, signalements de texte). Une section vide s'écrit "néant".
9. SEO/GEO (optionnel) : si tu as fait des constats ou des actions, indique la source (URL, date, capture). Jamais de chiffre sans source.

TES LIMITES
- Tu ne touches ni au site, ni au code, ni aux paiements, ni à la base, ni aux autres fichiers du vault. Tu ne contactes pas la presse, les humoristes ni les abonnés en message privé. Tu ne lances ni concours ni partenariat.
- Tu publies avec ton outil habituel (Buffer compris). L'ancienne publication automatique du site (écran admin « social » de deviens-marrant.fr) est coupée : n'y touche pas et ne la rallume pas.
- En cas de doute, tu ne publies pas et tu l'écris dans le rapport.
```

## 8. Reste à décider ou à faire (hors périmètre de ce document)

- **Tranché le 26/11 par Thomas** : Grok publie déjà sur les 4 réseaux, vidéos comprises (§0.4) ; aucune autopromotion, donc ni « lettre gratuite » ni prix dans les posts (ancienne question n°3, résolue par G8) ; pas de test humain (ancienne question n°6, retirée). T2 à T7 de la grille : la session applique les recos de @reviewer.
- **Questions ouvertes pour Thomas** : (1) où Grok écrit ses comptes rendus et sa consigne actuelle (réponse attendue dans le bilan initial, §0.4) ; (2) les 6 vidéos TikTok, 14 visuels Instagram et 4 vidéos « v4 » du Drive ont-ils été publiés, et avec quels résultats (le bilan initial doit le dire) ; (4) les posts restent à la voix du site sans « je » (`ton-alex.md` l.6) ; mais `ton-alex.md` fait dire « je » à Alex en commentaire alors que `banque-reponses.md` l'interdit : quelle règle pour les réponses de Grok ? Et les portraits « Alex Durand » (images de synthèse) : usage prévu ou non ? Étiquette « contenu IA » exigée si utilisés ; (5) le kit du 27/10 (« La bonne réplique. Au bon moment. », avatar « dm. ») est-il à imposer ; (7) accès de Grok au dossier Drive en lecture et écriture.
- Thomas : confirmer 3 pauses dans l'admin social ; décider du nettoyage Buffer (§6.2, point 2) ; dire comment Grok accède au vault (lecture/écriture du dossier) ; valider le programme S49 le samedi 28/11.
- @fullstack : ajouter `tiktok` aux origines reconnues, page de bio dédiée.
- @infrastructure : ajouter la ligne « Journal des nouveautés » au gabarit de déploiement.
- Session : tester `BING_WEBMASTER_API_KEY`, confirmer le chemin de santé (`/api/health`), vérifier le job du scheduler qui appelle `publish-social`.

Handoff : fichiers `docs/social/systeme-hebdo-claude-grok-s27.md`, `docs/marrant/journal-nouveautes.md`. Décisions : 3 contenus maîtres, 11 publications au plus, TikTok 3 / Instagram 3 / X 3 / LinkedIn 2. Points d'attention : TikTok hors liste blanche d'origine, état réel de l'interrupteur non lu, clé Bing non testée.

## Constat vérifié par la session (26/11/2026, lecture seule de la base de production)

- `SocialPlatformSetting` : TWITTER, LINKEDIN et INSTAGRAM à `paused = true` (dernière mise à jour 15/10/2026).
- `SocialPost` : 577 PUBLISHED, 130 FAILED, 75 REJECTED, aucun post en attente ou approuvé : une reprise accidentelle ne renverrait rien d'ancien.
- Le planificateur (`src/lib/scheduler/jobs.ts`, l. 293-300) appelle bien `/api/cron/publish-social`, qui respecte cet interrupteur. Pas de double publication possible avec Grok tant que les trois lignes restent en pause.
