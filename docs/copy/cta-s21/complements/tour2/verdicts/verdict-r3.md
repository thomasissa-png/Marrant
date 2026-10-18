# Verdict R3 : boutons restés hors chantier (relecture à l'aveugle, envie de payer)

Lecture faite dans la peau de chaque visiteur décrit, sceptique et pas pressé de sortir sa carte. Seules sources lues : le pack et `docs/copy/ton-alex.md`.

---

## Élément 1 : page du carnet, sous les 14 situations verrouillées

`Envie de payer : 10/10 | Écriture : 9/10 | Manque pour 10 : une seule phrase un peu raide, le reste est publiable tel quel | Alertes : aucune`

Pourquoi ça marche : le visiteur vient de cliquer « Voir la réplique », et le bouton « Voir les 14 autres répliques » continue exactement ce geste. Le prix dans le libellé dit honnêtement que c'est payant, ce qui évite la sensation de piège en arrivant sur la page d'abonnement. Le titre « Ça, c'était la réplique offerte. Il en reste 14. » se dit à voix haute, il compte ce que le visiteur a sous les yeux (14 cadenas) et ne promet rien. Le classement « de la moins tendue à la plus tendue » donne une raison de payer même à celui que la réplique offerte n'a pas emballé : la suite est différente. « Un nouveau carnet arrive chaque mois » répond d'avance au sceptique qui pense « 2,99 € pour 14 fiches ». Je ne vois pas comment donner plus envie de payer dans ce bloc.

Écriture : « ces situations sont rangées de la moins tendue à la plus tendue, donc tu peux commencer doux » sonne un peu explicatif (« sont rangées », « donc tu peux »). Ma version de la deuxième phrase :

> Boulot, soirée, famille, couple : elles vont de la moins tendue à la plus tendue, alors tu commences doux et tu montes d'un cran. Avec Premium, elles s'ouvrent toutes d'un coup, et un nouveau carnet arrive chaque mois.

Le titre, le bouton et la ligne de prix ne bougent pas.

---

## Élément 2 : carte Premium de l'accueil, membre connecté sans abonnement

`Envie de payer : 9/10 | Écriture : 9/10 | Manque pour 10 : « ton compte est déjà fait » sonne bizarre pour un ancien abonné, et la phrase ne dit pas que c'est CE bouton qui mène au paiement | Alertes : aucune`

Ce qui est bien : la ligne au-dessus du bouton est honnête. Le libellé « Ouvrir les 5 parcours » ne dit pas « payer », donc prévenir que le clic mène tout de suite à Stripe évite la mauvaise surprise, et « sécurisé par Stripe » rassure au bon moment. Le bouton reprend la promesse centrale de la carte (« Un seul prix ouvre les 5 parcours »), et le bouton contour gratuit juste dessous laisse une porte de sortie sans pression.

Ce qui manque : « Ton compte est déjà fait » est un peu plat (« fait » pour un compte), et lu par un ancien abonné, on dirait qu'on vient de lui créer un compte. « Existe déjà » marche pour les deux profils. Et en nommant le bouton, la phrase lève le doute « où ce clic m'envoie-t-il ? » :

> Ton compte existe déjà : ce bouton t'emmène direct au paiement, sécurisé par Stripe.
>
> [ Ouvrir les 5 parcours · 2,99 €/mois ]

Mobile : environ 35 caractères. Ça passe sur une ligne dans un bouton pleine largeur, mais c'est la limite sur un petit téléphone (320 px). À vérifier sur une capture, sans réécrire.

---

## Élément 3 : page d'abonnement, membre connecté sans abonnement

`Envie de payer : 7/10 | Écriture : 7/10 | Manque pour 10 : la pastille parle de payer alors que le visiteur veut savoir si ça vaut le prix, et le paragraphe ne vend que les parcours | Alertes : pastille ambiguë et un peu pressante`

Le problème principal, c'est la pastille « Plus que le paiement ». Elle pose deux soucis :
1. **Ambiguïté** : lue seule, en majuscules ou en petit, « Plus que le paiement » peut se comprendre « plus que (au-delà de) le paiement ». Le sens voulu, « il ne reste plus que le paiement », oblige à relire.
2. **Mauvais moment** : la fiche dit que cette page EST la présentation et que le visiteur vient « confirmer que ça vaut le prix ». Une pastille qui parle d'abord de l'étape de paiement le traite comme s'il était déjà en train de payer. Pour un sceptique arrivé depuis le bouton de l'en-tête juste pour voir, c'est de la pression : il se crispe.

Le titre « Ton compte est là. Les 5 parcours aussi. » tient : court, en écho, et vrai. Le paragraphe est exact et clair (« rien n'est bloqué » désamorce bien la peur d'une ouverture au compte-gouttes), mais il ne parle que des parcours. Or la page montre plus bas la fiche offerte du carnet du mois : la relier dès le paragraphe donne une deuxième raison de payer, alors que la carte des avantages arrive seulement après le bouton.

Ma version :

> **Un prix, tout ouvert**  *(pastille)*
>
> # Ton compte est là. Les 5 parcours aussi.
>
> Une fois abonné, tout s'ouvre d'un coup : les 5 parcours en entier, avec dans chaque étape un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz, plus le carnet de situations du mois. Une étape par semaine, c'est le rythme conseillé, mais rien n'est bloqué.
>
> [ Ouvrir les 5 parcours · 2,99 €/mois ]  *(« · 24,99 €/an » si l'annuel est choisi)*

---

## Élément 4 : carte « Abonnement » du profil, membre connecté sans abonnement

`Envie de payer : 8/10 | Écriture : 7/10 | Manque pour 10 : la phrase est une liste de brochure qui commence par ce qui manque au membre, le carnet n'y figure pas, et le bouton promet les parcours alors que la phrase vend surtout le catalogue | Alertes : libellé trop long pour un petit bouton`

Phrase d'offre : « Premium, c'est tout le catalogue au lieu de 10 vannes, 3 conseils et 3 vidéos, avec tes favoris, le filtre par catégorie et les 5 parcours en entier. » Tout est vrai, mais ça se lit comme une fiche produit (« Premium, c'est… ») et l'élément le plus désirable, les 5 parcours, arrive en dernier, après le filtre par catégorie. Le carnet mensuel n'y est pas, alors que c'est le seul avantage qui se renouvelle et qui justifie de payer tous les mois.

Bouton : la fiche demande un libellé court pour un petit bouton secondaire. Avec environ 35 caractères, « Ouvrir les 5 parcours · 2,99 €/mois » risque de passer sur deux lignes, et il ne reprend qu'un des avantages de la phrase. « Tout ouvrir » couvre tout ce que la phrase annonce, en deux mots.

Ma version :

> Premium ouvre tout : les 5 parcours en entier, le carnet du mois, tes favoris et le catalogue complet (sans abonnement, c'est 10 vannes, 3 conseils et 3 vidéos).
>
> *(ligne XP inchangée)*
>
> *(ligne discrète inchangée)*
>
> [ Tout ouvrir · 2,99 €/mois ]  *(petit bouton, environ 25 caractères)*

La ligne XP reste le meilleur argument pour un ancien abonné (rien n'est perdu), il ne faut surtout pas y toucher.

---

## Le plus faible des quatre

L'élément 3 : c'est la page où le visiteur décide, et sa pastille lui parle de payer au lieu de lui montrer ce qu'il gagne, en plus d'être ambiguë.

## Tableau récapitulatif

| # | Élément | Envie de payer | Écriture | Verdict | Retouche principale |
|---|---|---|---|---|---|
| 1 | Page du carnet, sous les situations verrouillées | 10/10 | 9/10 | Publiable, retouche d'écriture facultative | Deuxième phrase resserrée (« elles vont de… alors tu commences doux ») |
| 2 | Carte Premium de l'accueil (connecté sans abo) | 9/10 | 9/10 | Quasi publiable | « Ton compte existe déjà : ce bouton t'emmène direct au paiement » |
| 3 | Page d'abonnement (connecté sans abo) | 7/10 | 7/10 | À reprendre | Pastille « Plus que le paiement » remplacée (« Un prix, tout ouvert »), carnet ajouté au paragraphe |
| 4 | Carte « Abonnement » du profil (connecté sans abo) | 8/10 | 7/10 | À reprendre | Phrase réordonnée avec le carnet, bouton court « Tout ouvrir · 2,99 €/mois » |

Plus faible : élément 3.
