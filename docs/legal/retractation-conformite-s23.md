# Conformité de la fonction de rétractation du site (s23, 04/11/2026)

> Draft de référence, pas un avis juridique : validation par un avocat avant tout texte définitif. Code lu : `(dashboard)/retractation/page.tsx`, `components/retractation/retractation-form.tsx`, `api/retractation/route.ts`, `config/textes/paiement.ts` et `juridique.ts`, CGU, `/abonnement`, carte abonnement du profil, page de retour de paiement, pied de page, `middleware.ts`. Page en ligne non consultée (le code fait foi).

## Limite des sources (à lire d'abord)

Je n'ai pas d'outil de lecture de pages web : seulement la recherche, qui renvoie des extraits. Je n'ai donc **lu aucune page Légifrance ou EUR-Lex en entier**. Les citations de L221-21 et D221-5 viennent d'extraits qui reprennent le texte Légifrance, recoupés avec economie.gouv.fr et deux commentaires d'avocats. Le texte de L221-28 (exceptions) et celui de la directive 2023/2673 (art. 11 bis) n'ont **pas** pu être lus : signalé « incertain » là où ils comptent. Lecture intégrale des 4 URL Légifrance par un humain ou l'avocat = première étape.

## Risques en 5 points

1. **Verdict : NON CONFORME en l'état** (4 écarts sur 9 exigences, aucun n'est lourd à corriger).
2. L'obligation s'applique : le site offre le remboursement 14 jours à tous, sans case de renoncement (founder-preferences 04/10), donc aucune exception de contenu numérique n'est invoquée et le droit de rétractation existe.
3. Le formulaire existant est gratuit, public, sans connexion, ouvert tout le délai et envoie un accusé daté sur e-mail : la base est bonne.
4. Manque : étape de confirmation distincte, libellés de la formule légale, accès visible depuis le compte et la page de retour de paiement, nom et prénom, contenu complet de l'accusé.
5. Sanction citée par un commentaire : amende administrative (L242-13, non relu) ; risque de pratique commerciale trompeuse si l'accès est peu visible.

## Tableau exigence, source, état du site

Sources : L221-21 dernier alinéa [Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053310520) ; D221-5 [Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053303365) ; L221-5 [Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053310511) ; [section L221-18 à L221-28](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032221365/) ; [ordonnance 2026-2](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053298834) ; [directive 2023/2673](https://eur-lex.europa.eu/legal-content/fr/LSU/?uri=oj%3AL_202302673) (non lue) ; [economie.gouv.fr](https://www.economie.gouv.fr/particuliers/mes-droits-conso/bien-consommer/vente-distance-tout-savoir-sur-le-droit-de) ; [Village Justice](https://www.village-justice.com/articles/commerce-droit-retractation-ajout-obligatoire-une-fonctionnalite-retractation,55675.html) (secondaire).

| # | Exigence | Source | État du site (fichier:ligne) | Verdict | Correction minimale |
|---|---|---|---|---|---|
| 1 | Fonction gratuite, sur l'interface en ligne, pour tout contrat à distance conclu en ligne avec droit de rétractation | L221-21 dernier alinéa (extrait) ; ordonnance 2026-2 | Page publique, aucun frais : `page.tsx:27-85`. Exception L221-28 non invoquée (pas de case de renoncement, choix 04/10) | **Conforme** (L221-28 non lu : incertain sur l'interaction, voir avocat) | Aucune |
| 2 | Identifiée par « renoncer au contrat ici » ou formule analogue sans ambiguïté | D221-5 (extrait Légifrance) | Libellés : « Rétractation » dans le pied (`footer.tsx:29`), H1 « Exercer ton droit de rétractation » (`page.tsx:31`), bouton « Envoyer ma demande » (`paiement.ts:168`). Aucun ne reprend la formule | **Non conforme** (analogue : incertain pour le H1, non pour le pied) | Pied et points d'accès : « Renoncer au contrat ici » ; bouton d'étape 1 idem |
| 3 | Visible et directement, facilement accessible depuis l'interface | D221-5 ; economie.gouv.fr | Seul accès permanent : lien du pied de page (`footer.tsx:29`, rendu par `layout.tsx:26`). Rien dans la carte abonnement du profil (`abonnement-card.tsx:100-135`), rien sur la page de retour de paiement (`success/page.tsx:169-190`). Liens existants : e-mail de confirmation (`paiement.ts:263`), texte Stripe (`paiement.ts:119`), CGU art. 6 (`cgu/page.tsx:68`) | **Non conforme** (suffisance du pied : avocat) | Ajouter le lien « Renoncer au contrat ici » dans la carte abonnement (état actif) et sur la page « Paiement reçu » |
| 4 | Disponible pendant toute la durée du délai | D221-5 | Aucune connexion requise (`middleware.ts:24,129`), aucune coupure à J+14, pas de refus automatique (`paiement.ts:372-382`). Limites : 5 envois/h/IP et 3/jour/e-mail (`route.ts:70,72`) | **Conforme** | Aucune (surveiller le 429 si un client réessaie) |
| 5 | Déclaration : nom et prénom, indications détaillées identifiant le contrat, moyen électronique pour l'accusé (à saisir ou confirmer facilement) | D221-5 (formulation Village Justice, texte non lu en entier) | Champs : e-mail du compte, date d'achat (obligatoire côté formulaire, `retractation-form.tsx:103`, facultative côté API `route.ts:34-35`), motif facultatif. **Pas de nom ni prénom**. Pas de pré-remplissage pour un compte connecté | **Non conforme** (champs exacts : incertain) | Ajouter nom et prénom (pré-remplis si connecté, avec e-mail) ; date d'achat facultative (retirer `required`) |
| 6 | Étape de confirmation distincte, intitulée « confirmer la rétractation » ou analogue | D221-5 (extrait Légifrance) | Un seul bouton, envoi immédiat (`retractation-form.tsx:37-57,132-134`) | **Non conforme** | Étape 2 : récapitulatif de la déclaration + bouton « Confirmer la rétractation » ; l'API n'enregistre qu'à ce clic |
| 7 | Accusé de réception, délai raisonnable, support durable, avec contenu de la déclaration et date et heure d'envoi | D221-5 (extrait) | E-mail immédiat (`route.ts:109-110`), date et heure de Paris (`paiement.ts:411`), référence, e-mail, date d'achat (`paiement.ts:413-414`). **Motif et nom absents**. Échec d'envoi : message de repli (`route.ts:122`, `retractation-form.tsx:67`) | **Incertain** (« notamment le contenu » : contenu incomplet) | Reprendre dans l'accusé tous les champs saisis (nom, prénom, motif) ; garder le repli |
| 8 | Information du consommateur sur la fonction avant le contrat | L221-5 modifié par l'ordonnance (selon economie.gouv.fr, texte non lu) | Texte Stripe : 14 jours + lien `/retractation` (`paiement.ts:119`). CGU : « envoie ta demande à contact@ ou passe par la page Rétractation » (`cgu/page.tsx:68`). Modèle de formulaire joint à l'e-mail et à la page (`paiement.ts:206-217`), sans adresse géographique du vendeur (`paiement.ts:204`, « [D3] ») | **Incertain** | CGU art. 6 : citer la fonction « Renoncer au contrat ici » et son emplacement ; adresse : avocat |
| 9 | Formulaire type maintenu en plus de la fonction (elle ne remplace pas les autres modes) | extrait ordonnance (Vogel & Vogel, via recherche) ; annexe R221-1 | Maintenu : page, e-mail, adresse `contact@` (`page.tsx:58-81`) | **Conforme** | Aucune |

## Compatibilité avec les choix fondateur

- 04/10 (remboursement 14 jours pour tous, sans renoncement) : **aucun conflit**, il est même la raison pour laquelle la fonction est exigible.
- 07/10 (remboursement seulement sur le premier paiement) : pas de conflit avec L221-18 (délai à compter de la conclusion, `juridique.ts:17-18`). Point de reconduction annuelle laissé à l'avocat.
- 29/09 « juridique laissé en l'état » : pris sans ce constat ; une obligation légale en vigueur depuis le 19/06 ne se lève pas par un choix éditorial. **À signaler à Thomas, pas à rouvrir** : les corrections ci-dessous ne touchent aucun bouton de conversion (choix 18/10 et 19/10) et ajoutent le moins de mentions possible.

## Corrections par priorité

**P0, avant tout autre chantier (code, petit)**
1. Parcours en deux étapes : « Renoncer au contrat ici » (saisie) puis « Confirmer la rétractation » (envoi). Lignes 5, 6.
2. Libellés de la formule légale sur le pied de page et le titre de la page. Ligne 2.
3. Lien « Renoncer au contrat ici » dans la carte abonnement du profil et sur la page « Paiement reçu ». Ligne 3.
4. Champs nom et prénom (pré-remplis si connecté), date d'achat facultative. Ligne 5.
5. Accusé complet (tous les champs, motif compris). Ligne 7.

**P1**
6. CGU art. 6 et texte Stripe : nommer la fonction et son emplacement (une phrase). Ligne 8.
7. Tests à adapter (libellé du bouton, nouveaux champs, e-mails) : fichiers de test non recherchés, à vérifier par @fullstack.
8. `REPLIT_ACTIONS.md` : consigner la modification (règle Marrant), CI verte sur le dernier commit.

**P2**
9. App iPhone (cadrage s23) : D221-5 vise toute interface en ligne ; l'achat Apple suit un autre flux, à faire trancher avec le lot 4.
10. Adresse géographique de l'éditeur dans le modèle (`paiement.ts:204`) : conflit possible avec la règle « aucune identité sur le site » (29/09), à arbitrer par Thomas avec l'avocat (mentions légales).
11. Plafond de 3 envois/jour/e-mail (`route.ts:72`) : prévoir une réponse humaine si un consommateur est bloqué dans le délai.

## À faire valider par un avocat

- Lecture intégrale de L221-21, D221-5, L221-5, L221-28 (version en vigueur) et de l'article 11 bis de la directive : mon relevé repose sur des extraits.
- Libellés « analogues » acceptables (« Exercer ton droit de rétractation », « Me rétracter ») et pied de page seul comme emplacement suffisant.
- Liste exacte des champs de la déclaration (nom, prénom, identification du contrat) et ce qu'on peut rendre obligatoire.
- Interaction de la fonction avec l'exception du contenu numérique (L221-28) et les articles L224-25-1 et suivants, si Thomas veut un jour réintroduire un renoncement.
- Reconduction annuelle tacite : nouveau droit ou non ; règle « premier paiement seulement » pour un abonnement mensuel.
- Sanction applicable (L242-13, non relu) et date de départ des contrôles.
