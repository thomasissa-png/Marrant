# Widget « La vanne du jour » : minimum juridique (s22, 24/10/2026)

> @legal. Draft de référence, pas un avis formel. Principe : un paragraphe publié sur la page, pas de contrat, pas de nouvelle page. Sources : synthèse s22, volet SEO §4 à §6, `mentions-legales/page.tsx` (existante, non relue ici), founder-preferences.

## 1. Paragraphe à publier sur `/integrer-la-vanne-du-jour` (ancre `#licence`, titre « Conditions d'utilisation »)

La vanne du jour est gratuite : tu peux l'installer sur ton site sans nous demander. Elle est fournie telle quelle, sans garantie de disponibilité, et elle peut évoluer. Le lien « Deviens Marrant » fait partie du widget : laisse-le en place et visible. Ne modifie pas le texte de la vanne et ne la présente pas comme la tienne. Tu peux l'afficher sur un site qui a de la publicité, mais pas la revendre, ni la copier en masse, ni la reprendre dans un recueil ou un autre produit. Le widget ne pose aucun cookie et ne suit pas tes visiteurs. On peut changer ou arrêter le service, et couper l'accès à un site (contenu inapproprié, abus), à tout moment.

(7 phrases, tutoiement, zéro tiret cadratin. Le point « usage commercial » est tranché ainsi : affichage sur un site monétisé autorisé, conforme à la licence du volet SEO §4 ; revente et recueil interdits. À corriger si Thomas veut plus strict.)

## 2. Une ligne pour la documentation de l'API

Licence d'usage : affichage gratuit et non modifié de la vanne avec le lien d'attribution « Deviens Marrant » visible ; cache côté client 24 h maximum ; interdit d'archiver, republier en masse, revendre ou entraîner un modèle avec ces textes ; service fourni sans garantie, accès révocable.

## 3. Ce qui n'est PAS nécessaire (pour ne rien alourdir)

- Bandeau cookies chez l'hôte ou dans l'iframe : aucun cookie, aucun Umami dans `/embed/*`, rien à consentir (argument de vente à garder).
- Contrat signé, inscription, clé d'API, acceptation par case à cocher : les conditions publiées sur la page suffisent pour un contenu gratuit et révocable. Pas de CGU dédiées.
- Politique de confidentialité séparée pour le widget : une phrase dans la page de confidentialité existante suffit (voir §4).
- Mention IA : aucune (règle du fondateur, 06/05).
- Registre des traitements ou analyse d'impact : traitement technique minimal (requête d'affichage), pas de profilage.
- Mention de l'éditeur dans l'iframe : le lien « Deviens Marrant » mène au site, qui porte les mentions légales (pied de page). Ne rien ajouter dans le widget.
- Garantie ou SLA : la phrase « sans garantie » couvre.

## 4. Points à vérifier (par ordre d'importance)

1. **Vannes citant un humoriste réel (risque moyen).** L'API ne sert que le pool validé (125 vannes, barre Alexa, jamais de contenu hors catalogue), donc pas de droit tiers sur les vannes originales de l'équipe. Mais une vanne qui attribue un mot ou un sketch à un humoriste réel, une fois sortie de son contexte et affichée sur un site tiers sans la source, perd le cadre de la citation (nom de l'auteur et source obligatoires, courte citation). Ce n'est PAS une raison de retirer ces vannes du site (P0 du 05/10) : seulement de les laisser hors de la liste d'identifiants du widget, ou de vérifier qu'elles portent nom et source dans le texte servi. À faire au moment de la relecture manuelle des 90 jours.
2. **Hôte inapproprié.** Le droit de couper l'accès est dans le paragraphe. Pour qu'il serve à quelque chose : @fullstack prévoit une liste de domaines bloqués (origine du Referer) qui renvoie une iframe vide ou un 403 sur `/embed/*` et l'API. Limite connue : Referer absent = non bloquable par domaine, seul le blocage par IP ou par limite de débit reste.
3. **Phrase « aucune donnée »** : ne pas écrire « aucune donnée personnelle collectée » (inexact : l'adresse IP arrive forcément au serveur et à Cloudflare). La formulation retenue (« aucun cookie, ne suit pas tes visiteurs ») est exacte. Ajouter à la page de confidentialité : « Le widget La vanne du jour ne dépose aucun cookie ; seules les données techniques de la requête sont traitées pour l'afficher. » Reprendre cette phrase dans la section « External services » du `readme.txt` WordPress.
4. **Mention éditeur** : la page `/mentions-legales` existe et reste « en l'état » (choix du 29/09, pas d'identité réelle sur le site). Rien à créer ; vérifier seulement que la page programme a le pied de page habituel avec le lien.
5. **Attribution non retirable** : l'iframe empêche techniquement de retirer le lien, donc rien à contrôler côté hôte. Un hôte qui masque l'iframe par CSS ne se détecte pas ; on ne s'en préoccupe pas.
6. **Avocat** : non requis pour ce texte. Reporté avec les autres points juridiques (décision du 07/10).

## Handoff -> @copywriter puis @fullstack
Fichier : `/home/user/Marrant/docs/legal/widget-vanne-du-jour-s22.md`. Texte §1 à passer au filtre étalons (ton-alex) sans rien ajouter ; §2 dans la doc API et le champ `license`. @fullstack : liste de blocage par domaine, ancre `#licence`, phrase de confidentialité.

## Visa N8 (24/10) : comptage des affichages par domaine hôte

**Constat.** Le paragraphe publié sur `/integrer-la-vanne-du-jour` (section 1, constante `CONDITIONS_UTILISATION`) ne contient ni « domaine » ni « pour l'afficher » : il dit seulement « Le widget ne pose aucun cookie et ne suit pas tes visiteurs. », ce qui reste exact (un domaine hôte par affichage, rien sur le visiteur). **Section 1 : aucun changement, rien à remplacer.**

La formule « pour l'afficher » est celle du §4.3 ci-dessus, destinée à la page de confidentialité et au `readme.txt` WordPress. Elle n'est plus exacte avec le comptage. Ancienne phrase, exacte :

> Le widget La vanne du jour ne dépose aucun cookie ; seules les données techniques de la requête sont traitées pour l'afficher.

Phrase corrigée, à la place, mot pour mot :

> Le widget La vanne du jour ne dépose aucun cookie. Seules les données techniques de la requête sont traitées pour l'afficher, et chaque affichage est compté avec le seul domaine du site qui l'affiche (rien sur le visiteur), conservé 3 mois chez Cloudflare.

**Page de confidentialité (`confidentialite/page.tsx`) : oui, ajouter cette seule phrase.** La page ne mentionne pas encore le widget (la phrase du §4.3 n'y est pas posée) : la mettre en puce dans la partie 5 « Cookies et mesure d'audience ». Cloudflare est déjà listé en partie 4 (aucun nouveau prestataire) ; rien d'autre à changer (base légale : intérêt légitime, déjà citée pour la mesure d'audience ; le domaine d'un site n'identifie pas un visiteur). Reprendre la même phrase dans le `readme.txt` WordPress. Pas d'avocat.

## Visa ligne de backlink (24/10)

> @legal. Contexte : décision du fondateur du 24/10 (dernière ligne de `founder-preferences.md`). Sous le cadre, dans les deux codes à copier, une ligne HTML « La vanne du jour par Deviens Marrant » avec lien suivi vers l'accueil, facultative pour l'hôte. Le lien « Deviens Marrant » dans le cadre reste obligatoire.

**Section 1 (paragraphe publié) : un seul changement, une demi-phrase.** Le texte dit que le lien « fait partie du widget » et qu'il faut le laisser « en place et visible ». Avec la ligne sous le cadre, qui est copiée avec le code mais n'est pas dans l'iframe, deux lectures deviennent possibles : l'hôte croit que la ligne est obligatoire (plus strict que voulu), ou croit qu'on lui interdit de retirer quoi que ce soit. Il faut dire une fois que seule la ligne du cadre est obligatoire.

Phrase à remplacer, citée mot pour mot (page `/integrer-la-vanne-du-jour`, constante `CONDITIONS_UTILISATION` dans `page.tsx`, et section 1 ci-dessus) :

> Le lien « Deviens Marrant » fait partie du widget : laisse-le en place et visible.

Nouvelle phrase :

> Le lien « Deviens Marrant » dans le cadre fait partie du widget : laisse-le en place et visible (la ligne sous le cadre, elle, est facultative).

Le reste du paragraphe ne bouge pas : « Ne modifie pas le texte de la vanne » ne couvre pas la ligne (ce n'est pas le texte de la vanne), et « ne suit pas tes visiteurs » reste exact (le lien « suivi » est un lien sans `nofollow`, pas un traceur ; un paramètre UTM éventuel ne collecte rien sur la page de l'hôte).

**Section 2 (ligne de licence de l'API) : aucun changement.** Elle impose l'attribution « Deviens Marrant » visible à qui construit son propre affichage ; la ligne facultative n'existe que dans les codes à copier, pas dans l'API (le champ `attribution` suffit). Rien à ajouter.

**Aussi sans changement** : page de confidentialité et `readme.txt` (un lien HTML vers notre accueil ne traite aucune donnée de l'hôte ou de ses visiteurs) ; `TEXTE_CHAPEAU` et `TEXTE_AFFICHAGE` (« lien toujours présent dans le widget » reste vrai, c'est le lien du cadre). Pas d'avocat.

**Hors juridique, pour mémoire** : un lien suivi posé par des tiers en échange d'un widget gratuit peut être jugé « schéma de liens » par Google. Risque réduit ici par l'ancre de marque seule et le caractère facultatif ; le choix reste celui du fondateur (déjà tranché), à surveiller côté @seo.

**Handoff -> @copywriter puis @fullstack.** La phrase corrigée repasse le filtre ton-alex (relecture à l'aveugle, règle P0 du 05/10) avant d'être posée dans `page.tsx` ; @fullstack la remplace mot pour mot dans `CONDITIONS_UTILISATION` et note le changement dans `REPLIT_ACTIONS.md`.

## Visa licence élargie : appli, bot, newsletter (24/10, décision du fondateur)

> @legal. Les §1 et §2 ci-dessus sont remplacés par les versions de `CONDITIONS_UTILISATION` et `LICENCE_API` (`page.tsx`) et de `TEXTE_LICENCE_USAGE` / `TEXTE_LICENCE_CONDITIONS` (`developers.ts`, EN). La phrase de la ligne facultative sous le cadre est inchangée.

- **Permis** : afficher la vanne du jour (widget ou API) sur un site, dans une appli, un bot (Discord, Slack, Telegram…), une extension ou une newsletter, y compris dans un produit avec publicité, à condition que le lien « Deviens Marrant » soit bien visible à côté de la vanne. Le lien dans le cadre reste obligatoire pour le widget ; sans le widget, c'est au porteur de l'affichage de le poser.
- **Toujours interdit** : modifier le texte, se l'attribuer, revendre, copier en masse, reprendre dans un recueil ou une base de vannes, archiver, entraîner un modèle. « Ou un autre produit » est retiré de la phrase du recueil, car il contredisait l'appli et le bot ; la frontière devient : on affiche la vanne du jour au fil des jours (permis), on la collectionne ou on la revend (interdit).
- **Risques (faible à moyen)** : (1) un bot qui poste chaque jour dans un salon crée de fait un historique public ; toléré tant que ce n'est pas une base ou une page d'archive proposée comme telle ; (2) l'attribution « visible » ne se contrôle pas hors iframe ; la révocation d'accès par domaine ou IP reste le seul levier ; (3) le cache de 24 h maximum vaut aussi pour les applis. Pas d'avocat. Sans changement : confidentialité, `readme.txt`.
- **Handoff -> @fullstack** : noter le changement dans `REPLIT_ACTIONS.md` ; vérifier qu'aucun test ni autre texte de la page (chapeau, FAQ, « sur ton site ») ne reprend l'ancienne formulation.
- **24/10/2026, corrections après relecture à l'aveugle** (`docs/reviews/review-licence-elargie-s22.md`, B1 à B3, C1 à C5 et optionnels O1 à O4, O6) : la section sous `#licence` porte désormais toutes les règles (archiver, entraînement d'une IA, cache de 24 h côté serveur ou navigateur) ; bots et newsletters déjà envoyés peuvent rester où ils sont, seul le fait de garder les vannes de côté pour les ressortir ou les rassembler reste interdit ; la coupure d'accès vise « te » et non plus « un site ». Portée inchangée.
- **24/10/2026, décision de l'orchestrateur** (cohérente avec le choix de Thomas : sites avec publicité déjà permis) : la publicité est permise aussi dans une appli, un bot, une extension ou une newsletter ; « sur un site ou dans une appli qui a de la publicité » est remplacé dans `CONDITIONS_UTILISATION` et `TEXTE_LICENCE_CONDITIONS`. L'extension est citée avec les autres pour ne pas recréer l'ambiguïté ; à défaut, la retirer des deux textes. Pas d'avocat.
