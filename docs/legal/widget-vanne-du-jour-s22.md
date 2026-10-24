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
