# Widget « La vanne du jour » : volet growth (contenu, distribution, mesure), s22

> @growth, 24/10/2026. SPEC, aucun code. Le volet SEO et technique est dans le document de @seo. `[HYPOTHÈSE]` = à recalculer avec les données réelles à J+30. Sources lues : project-context, founder-preferences, ton-alex, `daily-joke-pool.ts`, dossiers des articles invités BRH et L'Épopée Ludique.

## 0. Cadrage (ce que le widget est, et n'est pas)

- **Valeur réelle** : notoriété, trafic référent, recherches de marque, visibilité IA. Pas des backlinks SEO : on ne vend JAMAIS le widget aux hôtes comme un cadeau SEO. Leur bénéfice, c'est un contenu frais chaque jour, gratuit, sur un blog qui publie peu (BRH : 5 articles en 2026).
- **Écart persona** : Yanis, Sophie et Marc ne sont pas sur les blogs parentaux. Ces blogs donnent de la marque et des liens, peu d'abonnés. Les abonnés viendront des sites étudiants, bureau et lifestyle 20-35 ans.
- **Unit economics** : CAC en cash = 0 € (budget acquisition 0 €, outreach par agents IA, envoi des brouillons par Thomas). LTV `[HYPOTHÈSE : churn 10 %/mois, aucune donnée réelle]` = 2,99 € TTC × 10 = environ 30 € TTC par abonné. Un canal à CAC nul ne se juge pas au ratio mais au coût de maintenance : visé 0 intervention manuelle récurrente.
- **Règle du canal composé** : jugé à 90 jours sur les indicateurs avancés (domaines actifs, affichages, clics, recherches de marque), pas sur le MRR du premier mois.

## 1. Nom et contenu

**Reco : V1 = « La vanne du jour ». « La réplique du jour » = V1.1, activée par un champ `type` prévu dès l'API.**
- **Pourquoi** : le stock de vannes validées à l'aveugle existe (`/api/health` : 123 jours de vannes inédites au 19/10) ; la réplique (situation + réplique) n'a aucun stock. Les 90 situations à écrire passent par la relecture à l'aveugle (règle d'or P0), où les verdicts s'inversent souvent (s19). Ce n'est pas une coupe « par manque de temps » : on n'allume pas un contenu qui n'a pas passé la barre.
- **Réplique en parallèle** : @copywriter produit le stock pendant que le widget vanne tourne. Activation de `type=replique` quand 90 situations sont validées 2 relecteurs sur 3. Elle mène vers le parcours Répartie (le persona Yanis), donc c'est la V1.1 la plus utile à la conversion.
- **Filtre tout public** (blogs parentaux, RH) : le filtre automatique ne suffit pas, une vanne SITUATION peut parler d'alcool. Le pool du widget est une **liste d'IDs relue à la main** (@reviewer, avec le regard d'un parent et d'un RH) à partir de `VALIDATED_JOKE_WHERE` (isActive, copyVerdict GARDER, comedyTechnique non null).
  - Catégories exclues d'office : DATING, SOIREES, COUPLE.
  - Admises après relecture : AUTODERISION, SITUATION, ABSURDE, OBSERVATIONNEL, JEUX_DE_MOTS, CULTUREL, ECOLE, GAMING, RESEAUX_SOCIAUX, PARENTS, BOULOT.
  - `maturityLevel` ≤ 2. La définition des niveaux n'est pas dans mes sources : `[À VÉRIFIER dans le schéma Prisma]` ; si le pool tombe sous 90, passer à ≤ 3 vanne par vanne, jamais en bloc.
  - Interdits quel que soit le niveau : sexe, alcool, drogue, politique, religion, violence, insulte, rupture, deuil, santé mentale (BRH est un site de thérapie), vanne attribuée à un humoriste tiers (droit d'auteur, voir § 5).
- **Stock au lancement** : 90 jours distincts minimum, cible 120. Tant que le pool relu est sous 90, on ne lance pas. Calendrier préparé à l'avance en base (comme la vanne du jour, choix du 30/09), même date pour tous les hôtes (jour Paris). Alerte à 30 jours de stock restant (plus tôt que les 14 jours du site : un widget tiers ne se rattrape pas). Fin de stock : rotation depuis le jour 1, jamais de widget vide.
- **Jamais de Premium** : l'API et le widget ne renvoient que amorce + chute + URL de la fiche publique. Ni décryptage, ni exercice, ni carnet, ni parcours, ni archive, ni liste, ni « vanne au hasard ». Seule la vanne du jour est servie : l'API ne permet pas de reconstituer le catalogue, qui reste l'argument payant (« les listes ne s'arrêtent plus à la dixième vanne »).

## 2. Ce que voit le visiteur du site hôte

| Élément | Décision | Pourquoi |
|---|---|---|
| Amorce | Visible d'emblée, sous le titre « La vanne du jour » | Lisible sans interaction, utile même sans JS |
| Chute | **Bouton « Révéler la chute »** (même libellé que les cartes du site), repli sans JS : texte complet visible | L'interaction se mesure (`révélations`), donne un mini jeu (« devine la chute ») aux familles, évite de divulguer la chute dans un aperçu |
| Lien | Après la révélation : « Pourquoi ça marche ? » vers la fiche publique de CETTE vanne. En pied, petit : « Deviens Marrant » | Le lien arrive quand la curiosité est maximale. Il est discret car il n'y en a qu'un seul visible avant le rire |
| Ton | Tutoiement, voix du site (pas de « je »), jamais de prix, d'abonnement, de pop-up, d'émoji, de mention IA | Règle du 06/10 : jamais de prix dans le social ; produit éducatif avant produit vendu (P0 s8) |
| Données | Aucun cookie, aucun traceur côté visiteur | Argument d'adoption auprès des blogs parentaux |

- Microcopy (titre, bouton, lien, pied, page `/widget`) : écrite par @copywriter sur 3 étalons validés par Thomas avant le brief (P0 s8).
- Une vanne qui déplairait à un hôte : formulaire « Une vanne déplacée ? » sur `/widget`, et remplacement du jour côté serveur en moins de 5 minutes (le calendrier est en base, pas dans le code des hôtes).

## 3. Sites cibles, démarchage, premiers hôtes

**Ordre de priorité (solo : 2 vagues, pas 5 canaux)**

| Rang | Type | Fit persona | Rôle | Remarque |
|---|---|---|---|---|
| 1 | Partenaires existants (BRH, L'Épopée Ludique) | moyen | Preuves d'usage + 2 domaines actifs | Relation déjà là, 0 prospection |
| 2 | Blogs lifestyle, vie de bureau, RH, QVT, pause café | **fort (Sophie)** | Abonnés | « Blague du jour » = rituel de pause |
| 3 | Sites et newsletters étudiants, vie de campus | **fort (Yanis)** | Abonnés | Moins de sites qui intègrent du code tiers |
| 4 | Blogs parentaux et familles | faible | Marque, liens, tolérance humour tout public | Pool strict obligatoire |
| 5 | Enseignants | moyen | Reportés : public mineur, sites peu liants | Pas en V1 |
| 6 | Communautés (Discord, forums) | | Hors périmètre : pas d'embed | L'API publique peut les servir plus tard |

**Premiers hôtes**
- **BRH (Le Blog des Rapports Humains, WordPress/Divi, Christophe Peiffer)** : blog qui vit d'articles invités, rythme faible (5 articles en 2026), il a déjà publié un article sur l'humour dans le couple. Un widget quotidien lui apporte du frais sans effort. Il est sur WordPress : c'est le cobaye naturel de l'extension (phase 2). Attention au ton : site de thérapie, vannes les plus neutres du pool (voir exclusions).
- **L'Épopée Ludique (Helena, blog parental)** : premier hôte du rang 4, après publication de l'article invité.
- **Règle de séquence : une demande à la fois.** L'article invité d'abord (envoi par Thomas, promis pour le 25/10 pour Helena). Le widget est proposé au plus tôt 7 jours après la publication de l'article, une fois le widget en ligne. Jamais les deux demandes dans le même e-mail.

**Démarchage (e-mails en brouillon Gmail, jamais d'envoi direct, règle 10)**
- Voix d'Alex (`ton-alex.md`) : « je », tutoiement même avec des blogueurs (décision du 14/10), signature « Alex, Deviens Marrant », zéro émoji, zéro tiret cadratin.
- Structure en 5 à 6 lignes : (1) pourquoi eux, avec un fait réel et vérifié sur leur dernier article (jamais inventé) ; (2) ce que c'est : une vanne par jour, gratuite, une ligne de code ; (3) la vanne du jour en exemple, tirée du pool tout public ; (4) l'honnêteté : « il y a un petit lien vers nous, rien d'autre » ; (5) « je te l'installe si tu préfères ». Aucun mot SEO ni « backlink ».
- Séquence : 1 e-mail + 1 relance à J+7, puis arrêt. Volume cadré : 25 brouillons personnalisés sur les 30 premiers jours, validés par Thomas par lots de 5.
- Calibrage de départ `[HYPOTHÈSE : réponse 10-15 %, installation 30-50 % des réponses ; à recalculer sur les 25 premiers]`.
- Levier activable en < 24 h une fois le widget en ligne : les 2 brouillons partenaires et la liste des 25 cibles, produits par les agents. Avant la mise en ligne, test de demande gratuit : Thomas montre une capture au 2 partenaires (« tu l'afficherais ? »).
- **Pipeline earned media 6 (Dev.to, 100 % automatisable, 0 €)** : un article « Une API de blagues en français, gratuite » au lancement de l'API, publié au nom d'Alex Durand (accord de Thomas requis). **Pipeline 7 (monitoring)** : Google Alerts sur `deviens-marrant.fr` + le tableau de domaines référents de § 4.

## 4. Mesure

**Comptage** : affichages et révélations côté API, agrégés par domaine et par jour (Origin/Referer ou attribut `data-site`), sans IP stockée, bots et domaines de test exclus. Clics : paramètres UTM `utm_source=widget&utm_medium=embed&utm_campaign=vanne-du-jour&utm_content=<domaine hôte>` lus dans Umami. Aval : `src=widget` conservé jusqu'à `abonnement-clic`, `checkout-ouvert` et l'inscription à la lettre (mécanique `src` du tunnel s15/s21). Sous-estimation connue si la personne revient plus tard (@data-analyst documente).

| Indicateur | Définition | J+30 | J+90 |
|---|---|---|---|
| Intégrations actives | domaines distincts, ≥ 1 affichage sur 7 jours, hors nos domaines | ≥ 3 (dont BRH ou Épopée) | ≥ 10, dont ≥ 4 sans lien préalable avec Thomas |
| Affichages | cumul mensuel | ≥ 3 000 | ≥ 30 000/mois `[HYPOTHÈSE : 100 affichages/jour/petit blog]` |
| Clics vers le site | sessions UTM Umami | ≥ 30 (1 % des affichages) | ≥ 300/mois ; référence : 713 visites/28 j au 05/10 |
| Inscrits lettre `src=widget` | formulaire de la lettre | ≥ 3 | ≥ 20 |
| Abonnements `src=widget` | Stripe, par `checkout-ouvert` puis paiement | 0 attendu, ce n'est pas un échec | ≥ 1 |
| Recherches de marque | Search Console + Bing, requêtes « deviens marrant » | baseline relevée AVANT le lancement `[À MESURER]` | impressions ≥ +50 % vs baseline |
| Domaines référents | Bing GetLinkCounts (0 lien entrant au 05/10) + Search Console | relevé | ≥ 3, aucun seuil sur leur valeur SEO |

- **Rapport** : un bloc « Widget » dans le rapport du lundi existant (domaines actifs, affichages, clics, inscrits, stock restant). Aucun nouvel e-mail (P0 du 06/10 : un e-mail par jour maximum).
- **Arrêt de la prospection** : 25 brouillons envoyés et 0 installation hors partenaires à J+45 → on stoppe la prospection, on garde les hôtes acquis. J+90 sous 5 domaines actifs ET sous 100 clics/mois → widget en maintenance minimale, pas d'extension.
- **Déclencheur de l'extension WordPress (phase 2)**, 4 conditions réunies : (a) ≥ 8 domaines actifs ; (b) au moins la moitié sur WordPress ; (c) ≥ 3 hôtes ou prospects qui disent ne pas savoir coller le code ; (d) taux de clic ≥ 1 % stable 4 semaines. Sinon on reste sur le copier-coller.

## 5. Juridique (une ligne chacun, à faire valider par @legal)

- **Licence d'usage** : licence gratuite, non exclusive, révocable, d'affichage de la vanne du jour sur le site de l'hôte, sans modification du texte ni du lien, sans extraction, copie ou revente du contenu.
- **Attribution** : le lien et le nom « Deviens Marrant » font partie du widget et ne se retirent pas ; exception du plugin listé sur WordPress.org, qui impose un lien désactivé par défaut (voir handoff).
- **Droit de retrait** : l'hôte peut retirer le widget quand il veut ; Deviens Marrant peut suspendre un domaine ou arrêter le service avec un préavis court, et remplacer une vanne à tout moment.
- **Droits sur le contenu** : seules les vannes originales du site entrent au pool, aucune vanne attribuée à un humoriste tiers (à confirmer).
- **Données** : aucun cookie, aucune donnée personnelle des visiteurs, statistiques agrégées par domaine (à reprendre dans la page `/widget`).

## 6. Automatisation (CLAUDE.md n°5)

- **Contenu** : calendrier de 90 à 120 vannes préparé en base, alerte de stock, aucune génération au fil de l'eau (choix du 01/10).
- **Outreach** : agent de veille (WebSearch, pages de contact publiques uniquement) → fiche par site (dernier article réel, plateforme, public) → brouillon Gmail Alex → Thomas valide et envoie → relance à J+7 en brouillon → tableau de suivi. Aucune plateforme de requêtes journalistes.
- **Mesure** : bloc automatique dans le rapport du lundi. **Maintenance humaine visée : 0 minute par semaine**, hors envoi des brouillons.

## 7. Handoff

**Risques**
1. Une vanne mal choisie sur un blog parental ou un site de thérapie : curation à la main, remplacement serveur, formulaire de signalement.
2. Hôtes à trafic faible : les seuils du § 4 le disent, ils sont des hypothèses à corriger à J+30.
3. Attendre des abonnés des blogs parentaux : non, ils servent la marque. Les abonnés viennent des rangs 2 et 3.
4. Extension WordPress listée sur WordPress.org : le lien de crédit doit être **désactivé par défaut et demandé explicitement** (règle 10 des guidelines du répertoire, rappel Plugin Team 2017 : pas de crédit par défaut, ni opt-out, ni masqué), avec conseil `nofollow`. Moins de liens par installation, mais plus de distribution. Alternative : plugin hors répertoire, lien actif, distribution limitée.
5. Stock du pool tout public inconnu à ce jour (le chiffre de 123 jours concerne tout le catalogue) : à compter avant toute promesse de date.

**Décisions pour Thomas (questions fermées)**
1. Valides-tu « La vanne du jour » en V1, avec « La réplique du jour » activée seulement quand 90 situations passent la relecture à l'aveugle ?
2. Valides-tu l'exclusion des catégories DATING, SOIREES et COUPLE et du `maturityLevel` > 2 pour le pool du widget ?
3. Acceptes-tu que le lien de crédit soit obligatoire pour le code copier-coller et facultatif (case décochée) dans le futur plugin WordPress.org ?
4. Acceptes-tu d'envoyer les propositions de widget à BRH et L'Épopée Ludique au plus tôt 7 jours après la publication de leurs articles invités ?
5. Autorises-tu la publication d'un article Dev.to sur l'API publique au nom d'Alex Durand ?

**@fullstack** : endpoint public `GET` en lecture seule, vanne du jour uniquement, `type` réservé pour `replique`, cache jusqu'à minuit Paris, CORS, limitation de débit ; calendrier en base (liste d'IDs, remplacement à chaud) ; comptage par domaine sans IP ni cookie ; repli sans JS ; URL UTM prête ; blocage par domaine ; alerte de stock à 30 jours ; page `/widget` (générateur de code, signalement) ; entrée dans `REPLIT_ACTIONS.md` ; chiffrage du pool tout public.
**@copywriter** : 3 étalons validés par Thomas avant tout brief ; microcopy du widget et de `/widget` ; e-mail type + relance + brouillons des 2 partenaires ; stock « réplique » (90 situations) en relecture à l'aveugle ; article Dev.to.
**@reviewer** : relecture tout public du pool (regard d'un parent et d'un RH).
**@legal** : les 5 lignes du § 5, plus règle 10 de WordPress.org pour la phase 2.
**@data-analyst** : événements, `src=widget`, baseline des recherches de marque avant lancement, bloc du rapport du lundi.
