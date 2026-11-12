# Tour 11, confirmation finale @reviewer : « sections de contenu » (s24)

> Relecteur : @reviewer, 12/11/2026. Document noté : `architecture-contenu-v11.md` (V11), comparé à `architecture-contenu-v10.md` (V10). Grille C1 à C11.

## 1. Statut de mes corrections du tour 10

| T10 | Objet | Statut | Commentaire |
|---|---|---|---|
| W1 | Jargon dans C14 et C10 a | ok | C14 : « la page d'où il vient », « le lien obligatoire pour renoncer au contrat », « la page des parcours » ; C10 a : « Les phrases […] sont prêtes ». Bonus : C2 B et C7 nettoyés aussi. Aucun `returnTo`, chemin ou article de loi dans la section 8. |
| W2 | Conséquence de C11 B, « presque tous » | ok, avec réserve | C11 B et C disent leur conséquence ; l'en-tête (l. 40) et §4.2 disent « six clusters sur neuf ». Mais C9 (l. 913) et C11 (l. 930), les deux phrases lues par Thomas, sont devenues « six fois sur neuf Répartie » : une fréquence qui n'existe pas (X1). |
| W3 | Ligne « rencontre » de §0.2 | ok | « aujourd'hui, ces pages mènent à Confiance, pas à une situation de rencontre » (l. 68). |

## 2. Résumé pour Thomas : fidélité et clarté

- **Fidèle** :
  - les chiffres (60 + 45 situations, 40 mots, 12 mécanismes, 12 formules, 155 et 285 fiches) ;
  - les 14 questions et leurs recos (vérifiées une à une contre la section 8 : C1 B, C2 A, C3 A, C4 A, C5 A, C6 A, C7 A, C8 A, C9 B, C10 a A et b C, C11 A, C12 B, C13 B, C14 C) ;
  - la règle sur l'audience (« Elle ne décide jamais de ce que voient les abonnés ») ;
  - les étalons.
- **Sans jargon** : oui, à un mot près. « un toucher « Ce soir, c'est plutôt ? » » est un terme interne ; « un choix rapide » ou « trois boutons » se lit tout seul. Facultatif.
- **Un manque de fidélité** : la ligne C1 (« « Bibliothèque » à un clic, fidèle à ta décision du 12/11 ») tait le prix que la question elle-même affiche en gras : « Elle ne met plus le mot « Vocabulaire » en haut de la barre (ta demande du 10/11) ». C'est la seule reco qui va contre une demande écrite de Thomas, et le résumé est ce qu'il lira d'abord (X2).
- Zéro tiret cadratin dans le document.

## 3. Rien d'autre n'a bougé ?

**Méthode** (pas d'outil de diff dans ma session) :
- position de chaque titre de la v10 et de la v11, avec les 2 lignes « REMPLACÉ » ajoutées en tête de la v10 ;
- lecture des quatre jonctions où l'écart bouge ;
- comparaison des questions C2 à C8, C12 et C13.

| Zone | Écart de lignes v10 → v11 | Explication |
|---|---|---|
| Tête et résumé | + 31 | Résumé ajouté, en-tête réécrit (« six clusters sur neuf »). |
| 0 bis | − 4 | Liste « Ce qui change » remplacée (9 lignes au lieu de 13). |
| Sections 1, 2, 3 | 0 | Inchangées en longueur. |
| Fin de §3.11, fin de §4.5, fin de §6.4, fin de §7.7 | + 1 chacune | Une ligne vide en double avant le titre suivant (lu : l. 491 et 492, 628 et 629, 752 et 753, 863 et 864) : mise en forme seulement. |
| §4.2, §4.4, §7.5, C2 B, C7, C9, C10 a, C11, C13 B, C14 | 0 en longueur | Retouches de texte toutes annoncées en §0 bis et en annexe A. |
| Annexe A | − 2 | Traitement du tour 10. |

Questions C3, C4, C5, C6, C8, C12 : texte identique à la v10. C13 B : seul « discrets » est devenu « compacts » (annoncé). **Rien d'autre n'a bougé.**

Vérification au passage (§4.2, C14) : « la page de succès reste affichée avec un bouton « Continuer », sans redirection automatique » est vrai aujourd'hui. Mais c'est seulement parce que `LETTRE_HEBDO_INSCRIPTIONS_OUVERTES = true` (`config/lettre.ts` l. 150 ; `abonnement/success/page.tsx` l. 139 à 142 : sinon `router.push`). À dire au développement : l'espace doit rendre ce comportement indépendant de l'interrupteur de la lettre. C'est une note pour le chantier, pas une correction de ce document.

## 4. Notes et verdict

| # | Critère | T10 | T11 | Justification |
|---|---|---|---|---|
| C1 | Valeur persona | 10 | 10 | Inchangé. |
| C2 | Respect des décisions | 10 | 10 | Inchangé ; « Renoncer au contrat ici » et E0 garantis. |
| C3 | Zéro donnée inventée | 9 | 9 | « six fois sur neuf Répartie » (C9, C11) présente un compte de clusters comme une fréquence (X1). |
| C4 | Rubriques | 10 | 10 | Inchangé. |
| C5 | Ambition | 10 | 10 | Inchangé. |
| C6 | Cohérence | 10 | 9 | Le résumé tait le prix de la reco C1, que la section 8 affiche (X2). |
| C7 | Faisabilité | 10 | 10 | Inchangé. |
| C8 | Questions | 9 | 10 | Jargon retiré, conséquences de C11 dites : les 14 questions se lisent telles quelles. |
| C9 | Exemples | 10 | 10 | Inchangé. |
| C10 | Progression | 10 | 10 | Inchangé. |
| C11 | Pertinence pour l'audience réelle | 10 | 10 | Inchangé. |

**Note globale : 9,8 / 10** (108 / 110). Aucun bloquant.

**Corrections, toutes non bloquantes, une ligne chacune :**
1. **X1.** C9 (« six fois sur neuf Répartie, donc pas un signal ») et C11 (« son parcours associé est Répartie six fois sur neuf ») : écrire « le plus souvent Répartie (six familles d'articles sur neuf, dont l'article de blagues, le plus lu) ».
2. **X2.** Résumé, ligne C1 : ajouter « ; le mot « Vocabulaire » n'est plus sur la barre, il est dans « Bibliothèque » ».

**Verdict : PRÊT À PRÉSENTER : OUI**, après X1 et X2 : deux retouches de libellé d'une ligne, sans effet sur la structure, les chiffres ou les recos. Elles ne demandent pas de nouveau tour de relecture. Un contrôle par recherche des deux phrases suffit.
