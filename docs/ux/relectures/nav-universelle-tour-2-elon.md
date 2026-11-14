# Relecture à l'aveugle, tour 2 (elon) : `docs/ux/navigation-universelle-s24.md` v2

AVIS CONSULTATIF : validation requise avant exécution.

## Note : 9,2 / 10 (tour 1 : 7,6)

La v2 a fait ce qu'il fallait : elle a supprimé du contenu. Le menu déroulant, les groupes, les 4 cartes à phrase et le libellé d'aide ont disparu, et l'arborescence de l'espace tient maintenant en un lien et un index. Il reste une seule faute dure, et elle touche le mouvement le plus fréquent dans l'espace : liste, puis fiche, puis retour.

## Contrôle des fautes du tour 1

| Faute | Statut | Preuve dans la v2 |
|---|---|---|
| FD1, Aujourd'hui à 2 clics, logo vers la vente | Corrigée | §1 l. 20-21 (logo de l'abonné vers `/mon-espace`, « Mon espace » en lien direct), §4.1-4.2 (index de 8 lignes de 44 px), menu mobile sans groupe (l. 34), écart déclaré (§6 l. 113) |
| FD2, quiz contradictoire | Corrigée | §2 l. 61, §6 l. 112 ; plus aucune mention du quiz dans l'espace |
| FD3, pied non lu, critère 5 faux | Corrigée | §2 l. 59 conforme à `footer.tsx` l. 12-37 (vérifié), « Quiz humour », Blague du jour ajoutée (ROUVRE), critère 5 « en-tête ou pied » |

Pistes du tour 1 : P1 (libellé d'aide) supprimée, P3 (carte du jour limitée à 768 px, §3) et P4 (critère 2) appliquées. P2 est traitée honnêtement : `[HYPOTHÈSE]`, avec le constat que ce n'est « pas mesurable » (5 clics en 28 jours).
J'ai aussi vérifié que la suppression de `maxWidth.lecture` ne touche aucune page publique : `max-w-lecture` n'apparaît que dans les 14 fichiers de `mon-espace` et `espace/`.

## Faute dure (bloque le 10)

**FD4. « Retour : Mon espace » sur toutes les pages A de l'espace fait sortir l'abonné de sa liste.**
Faute : §4.3 (l. 89) et l. 72 fixent comme parent de toute page A de l'espace « Mon espace ». Or le §3 (l. 70) dit « Retour : {parent} ». Conséquences :
- l'abonné qui parcourt Quoi répondre, ouvre une situation puis clique sur « Retour » atterrit sur Aujourd'hui. Il perd sa liste et doit recliquer, et refaire ses filtres ;
- c'est pareil pour une lettre (vers Lettres) et pour un fil de question (vers Mes questions) ;
- la fiche « bilan » allume « Parcours » (§1 l. 43) mais renvoie vers « Mon espace » : deux parents pour une même page.
C'est l'« innavigable » de Thomas, déplacé de la barre vers le bas de page.
Correction exacte : remplacer §4.3 par une table de parents fixée par le type de page, sans état ni paramètre :
- `/mon-espace/fiche/situation/*` : Retour, Quoi répondre ;
- les autres `/mon-espace/fiche/*` et `/mon-espace/bonus/*` : Retour, Bibliothèque ;
- `/mon-espace/fiche/bilan/*` : Retour, Parcours, à l'étape d'origine (cohérent avec l'état actif) ;
- `/mon-espace/lettres/[numero]` : Lettres ;
- `/mon-espace/questions/[id]` : Mes questions ;
- les pages B et C de l'espace : Mon espace.
Ensuite, l. 72 devient « parent = rubrique parente (table §4.3) ; la racine se nomme Mon espace », et un critère 13 s'ajoute : « chaque page A de l'espace renvoie à sa rubrique selon la table §4.3 ».

## Pistes (ne bloquent pas le 10)

- P5. État actif l. 44 : `/lettre*` « le lien du même nom (abonné compris) » est impossible, puisque l'abonné n'a pas le lien « La lettre ». Écrire « La lettre (visiteur, inscrit) ; aucun pour l'abonné ». Sinon le critère 8 ne peut pas être tenu.
- P6. `/favoris` pour l'inscrit gratuit n'est pas dans la table d'état actif. Ajouter « l'icône du compte », comme pour `/profil`.
- P7. Le point violet de « Mes questions » dans l'index signale le même événement que la cloche (réponse de l'équipe). Ce n'est pas faux, mais c'est deux signaux pour un seul fait. Garder les deux seulement si la cloche n'est pas visible à 375 px (elle l'est) ; sinon, retirer celui de l'index.
- P8. L'abonné qui tape l'adresse du site tombe sur la page de vente (risque « voulu », l. 137). À vérifier sur une capture : aucun bouton de l'accueil ne doit lui proposer de payer une deuxième fois.

## Réponse de fond

C'est maintenant la navigation la plus simple qui tienne. Le visiteur a 6 liens et un bouton. L'abonné a « Mon espace » et 5 liens, retrouve Aujourd'hui en 1 clic (le logo compris) et chaque rubrique en 2. Avec FD4 corrigée, plus aucun mouvement dans l'espace ne fait repasser par Aujourd'hui sans raison, et la spec atteint 10.

---
Handoff → auteur de la spec, puis session principale. Ce sont des avis : Thomas décide des 9 écarts ROUVRE du §6.
