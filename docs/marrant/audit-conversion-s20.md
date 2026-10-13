# Audit conversion s20 : visiteur → Premium (13/10/2026)

> Synthèse de la session principale. Rapports : `docs/marrant/audit-conversion-s20/{growth,ux,copywriter,design,data-analyst}.md`. Preuves : `audit-conversion-s20/donnees/` (Umami 15/09 au 12/10, base de prod, textes des pages) et captures réelles de la prod en 375 et 1 280 px. Audit précédent : `audit-note-s15.md` (CONVERTIR 2,8/10).

## 1. Notes

| Agent | Critères (note /10) | **Conversion** |
|---|---|---|
| @growth | Offre 6,5 · Blog → produit 3,5 · Moments de bascule 4 · /abonnement 7 · Preuve 4 · Capture des non-acheteurs 1,5 | **4,3** |
| @ux | 1er écran 6 · Article → produit 3 · Valeur gratuite 5 · Murs 6 · Tunnel 6 · Navigation mobile 5 | **4,0** |
| @copywriter | Promesse accueil 7 · Boutons 5 · Encarts d'articles 5 · /abonnement 7 · Murs 5 · Cohérence 6 | **5,5** |
| @design | 1er écran 7 · Boutons 5 · Encarts Premium 4 · /abonnement 6 · Confiance 7 · Lisibilité 7 | **5,0** |
| @data-analyst | Couverture 7 · Fiabilité 4 · Lisibilité du rapport 5 · Capacité à tester 3 | **4,5** |
| **Moyenne** | | **4,7 / 10** (2,8 en s15) |

Le gain vient de la capacité (tunnel visiteur → Premium refait, parcours, mesure), pas du résultat : sur 28 jours, aucun paiement organique à 2,99 € n'est confirmé. Le seul paiement (07/10) est probablement un test de Thomas, à confirmer.

## 2. Diagnostic commun (5 agents sur 5)

**Le goulot est l'exposition à l'offre, pas la page de paiement.**
- L'article « meilleures blagues drôles 2026 » apporte 397 entrées sur 28 jours (58 %), avec 385 sorties sur 404 vues (97 %) et 0 clic sur son appel à l'action.
- Son premier lien vers le produit arrive à environ 77 % de la page mobile (écran 14 sur 18). Yanis repart avant, une fois ses blagues trouvées.
- Une fois sur `/abonnement`, 5 visiteurs sur 6 cliquent vers le paiement. Le volume est trop faible pour conclure, mais rien n'indique que cette page soit le problème.

**Constats qui convergent (au moins 2 agents) :**
1. **Les encarts envoient Yanis au mauvais parcours** (copywriter, ux, growth) : les deux articles d'entrée renvoient vers Machine à Café (persona Sophie). Répartie, son parcours, n'y apparaît jamais.
2. **Pas de bouton dans l'en-tête mobile** (design, ux), alors que l'ordinateur affiche « Commencer ». 66 % du trafic est sur mobile.
3. **Boutons incohérents** (design, copywriter) : 6 à 7 libellés pour la même destination. Le violet plein sert aussi pour l'étape gratuite, qui ressemble ainsi au bouton payant.
4. **/abonnement mobile** (design, ux) : le bouton d'achat est sous le pli (y ≈ 1 033 pour un écran de 812). Il manque un extrait réel du carnet et la promesse de résultat de Répartie (growth, copywriter).
5. **Les murs vendent un volume (« 10 vannes »), pas un apprentissage** (ux, growth, copywriter).
6. **Aucun moyen de recontacter un visiteur qui n'achète pas** (growth : 1,5/10) : pas de lettre, pas d'e-mail.
7. **La mesure ne dit pas encore où l'on perd les gens** (data-analyst, growth) :
   - on ne sait pas qui voit l'appel de l'article ;
   - le trafic de Thomas et les comptes de test ne sont pas exclus ;
   - les renouvellements sont mélangés aux nouveaux abonnés ;
   - `abonnement-vu` (6 en 28 jours) ne colle pas avec les 15 vues de /abonnement d'une seule semaine.

## 3. Fiabilité et honnêteté (à traiter avant tout gain de conversion)

| Point | Constat vérifié par la session | Statut |
|---|---|---|
| Compteurs « Je veux ça ! » de l'accueil | `api/features/vote/route.ts` l.17 : `BASE_VOTES` ajoute 47 / 34 / 62 / 21 aux votes réels. Votes réels en base : **0**. | Preuve sociale inventée ; aucune décision fondateur ne la couvre. **À corriger.** |
| « 1 500+ membres » / « 1 500+ inscrits » | Écrit en dur (`hero-section.tsx` l.54, `premium-cta.tsx`). Base : 14 comptes depuis mars. Déjà noté « non confirmé en base » en s11. | Formulation validée par Thomas le 03/10 ([CHOIX UTILISATEUR]) : **la décision lui revient**, avec la source du chiffre. |
| Mur de /vannes « 10 vannes accessibles » | Pagination de 12 pages et une fiche par vanne visibles (copywriter). | À vérifier avant de réécrire le mur. |
| « remboursé sous 14 jours » sur /abonnement | La règle du fondateur limite le remboursement au premier paiement. | Relecture @legal. |
| Fiche vidéo Haroun | Tag « Technique principale : Répartie » sur une fiche AUTODERISION. | Petite correction de données. |

## 4. Plan d'action (classé par valeur pour Yanis et effet sur la conversion)

Méthode (data-analyst) : à 680 visiteurs par mois, un test A/B n'est pas faisable. On procède par **avant / après sur 4 semaines, un lot à la fois**, avec un seuil écrit à l'avance. Tout nouveau texte passe la relecture à l'aveugle (règle d'or).

**Lot 0 : honnêteté et mesure (préalable, livré avec le lot 1)**
- Retirer `BASE_VOTES` : n'afficher que les vrais votes (le code masque déjà un compteur sous 10).
- Mesure : `blog-cta-vu`, exclusion du trafic interne et des comptes de test (`emailsExclus()`), `checkout-ouvert` / `checkout-echec`, nouveaux abonnés séparés des renouvellements, source de chaque paiement, dénominateurs dans le rapport du lundi.

**Lot 1 : exposition à l'offre (le plus gros levier, consensus 5 sur 5)**
- Article n°1 : deux passerelles au fil du texte (vers l'étape 1 gratuite de Répartie, et vers Boulot), plus un bloc de fin unique, toujours dans le même ordre.
- Article « phrases drôles » : la carte parcours passe à Répartie et remonte avant la FAQ.
- Bouton dans l'en-tête mobile, comme sur ordinateur.
- Ensuite, généraliser les passerelles aux 34 articles par thème.
- Seuil de réussite : `blog-cta-clic` sur l'article n°1 passe de 0 à au moins 3 % des vues, et `abonnement-vu` double sur 4 semaines.

**Lot 2 : cohérence des boutons et de /abonnement**
- Un seul composant bouton à deux niveaux : violet plein pour Premium, contour pour le gratuit.
- Libellés unifiés, propositions du copywriter à faire passer à l'aveugle.
- /abonnement : bouton d'achat au premier écran, économie annuelle visible, extrait réel du carnet, ligne « pour toi si tu restes muet quand on te chambre ».

**Lot 3 : murs et fin de l'étape 1**
- Les murs de /vannes et des fiches vendent le décryptage et la progression, avec une sortie douce.
- La fin de l'étape 1 gratuite montre l'étape 2 et un seul appel à Premium.

**Lot 4 : recontacter les non-acheteurs (décision de Thomas)**
- Une lettre mensuelle sur simple adresse e-mail, sans compte gratuit (nouveau canal e-mail).

## 5. Décisions pour Thomas

1. Go lots 0 et 1 (recommandé, un seul déploiement), puis 4 semaines de mesure avant le lot 2.
2. Compteurs de votes inventés : les retirer (recommandé).
3. « 1 500+ » : d'où vient le chiffre ? Sans source, le remplacer par un chiffre vérifiable (ou le retirer).
4. Lettre mensuelle par e-mail : go ou non.
5. Paiement à 2,99 € du 07/10 : est-ce ton test ? Et confirmer tes adresses à exclure de la mesure.
6. Accueil : fusionner les deux blocs Premium empilés en bas de page (proposition @design).

## 6. Limites

- Pas de capture de la page Stripe, du menu mobile ouvert, d'une étape 1 de parcours ni du choix annuel : ces points ne sont pas notés.
- Contrastes estimés à l'œil, non mesurés.
- Volumes trop faibles pour chiffrer un gain attendu ; les seuils ci-dessus sont des cibles à valider, pas des prévisions.
