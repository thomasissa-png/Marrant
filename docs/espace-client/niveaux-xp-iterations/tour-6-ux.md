# Niveaux et XP, tour 6 (confirmation), relecteur @ux (à l'aveugle) : `docs/espace-client/niveaux-xp-s24.md` (v6)

> Relu en entier et comparé à la v5 lue au tour 5 (résumé, 1 à 5, annexes A, A bis, A ter, B). Diff annoncé : +44 / -29 lignes. Je n'ai pas de commande de diff : j'ai comparé section par section. Limites : code et seeds non relus ; `config/parcours-publication.ts` non relu par moi (je m'appuie sur le fait donné par la session : `STORYTELLING_PUBLIE = true` l. 12, `BOULOT_PUBLIE = true` l. 25).

## 1. Statut de mes corrections du tour 5

| # | Sujet | Statut | Preuve dans la v6 |
|---|---|---|---|
| M1 | Comptes de test : « zéro » contre étapes validées | **OK** | « ramener l'XP à la somme des étapes validées et des bonus de fin acquis (zéro seulement s'ils n'en ont aucune) » : résumé, 2.4, 2.6, 3.0, 3.5, critère 3, Q6, section 5 (le mot « remise à niveau » remplace « remise à zéro » partout où j'ai regardé) |
| M2 | « Écart nul » sans définition | **OK** | Phrase supprimée en 3.0 ; critère 11 inchangé et suffisant (« gagnés depuis ton arrivée ») |
| M3 | Recalcul unique silencieux ; noms vrais pour qui | **OK** | 3.0 : « Le recalcul est silencieux : ni phrase de passage ni événement « cap atteint » » ; critère 10 (« jamais émis par le recalcul unique ») ; 3.4 : « Portée du test de vérité » (vaut pour un compte qui progresse par les étapes, pas pour les comptes gonflés avant la correction) |
| M4 | Storytelling publié ; variante ; recompte | **OK** | 1.1 et 3.0 : `STORYTELLING_PUBLIE = true` ; le test lit les parcours publiés ; variante écrite (sans Storytelling, total 2 300, dernier seuil 1 600 = 70 %, calcul juste : 1 600 / 2 300 = 69,6 %) ; « 18 au minimum » valable seulement si les cinq parcours sont publiés ; test sur les seeds maintenu en 3.1 et section 5 |
| M5 | Option sans mot : texte lu et voisinage | **OK** | 3.4 : « Où tu en es : Tu avances bien, 3 sur 5 », intitulé toujours au-dessus, jamais adjacent à « étape n sur 6 » ; critère 7 couvre l'option |
| M6 | Correction 2.5 : livrée seule, rejeu, « au catalogue » | **OK** | 2.5 : « livrée seule et en premier » ; critère 1 : « des requêtes simultanées et le rejeu du même identifiant » ; résumé : « tout conseil qui n'est pas au catalogue » |
| M7 | E2 cap 5 : « presque tout » à 72 % | **OK** | « Tu as fait la plus grande part » (3.4, Q3 B) avec sa justification ; test (5) mis à jour (avoir : participe invariable) |

Les retouches D1 à D4 de @reviewer (« la règle actuelle repaie… jusqu'à la livraison de la correction », « au moins 18 étapes », réserve sur les XP de conseils d'avant la correction, annexe) sont bien dans le texte (Q6, 2.6, 3.1, 3.4, Q4 A, note de l'annexe A).

## 2. Rien d'autre n'a bougé ?

**Oui, à une exception de forme près.** Toutes les différences que j'ai relevées entre v5 et v6 se rattachent à D1 à D4 et M1 à M7 (en-tête, résumé puces 2 et 3, 1.1 ligne Storytelling, 2.4 ligne « XP déjà gagnés », 2.5 introduction, 2.6, 3.0 (XP, caps existants, garde-fou), 3.1 ligne « Cas », 3.4 (test 5, table E2, test de vérité, portée, option sans mot), 3.5, critères 1, 3, 7, 10, Q3, Q4 A, Q6, section 5, annexes A et A ter). Sections inchangées et identiques à la v5 : 1.2 à 1.4, 2.1 à 2.3, 3.2, 3.3, Q1, Q2, Q5, Annexe A bis, Annexe B. Pas de modification des seuils, des noms E1, de la reco, des questions ni de la spécification d'accessibilité en dehors de ce qui est cité. **Les sections de la v5 que j'avais jugées solides n'ont pas été touchées.** L'exception : trois points de forme ou de fait non annoncés (voir 3).

## 3. Notes et points restants (tous non bloquants)

| Critère | T1 | T2 | T3 | T4 | T5 | T6 |
|---|---|---|---|---|---|---|
| Lisibilité (3 secondes) | 7 | 8 | 9 | 9 | 9 | 9 |
| Motivation sans pression | 7 | 8 | 9 | 9 | 9 | 9 |
| Affichage dans l'espace | 6 | 8 | 8 | 8 | 9 | 9 |
| Noms au ton maison | 6 | 7 | 8 | 8 | 9 | 9 |
| Accessibilité | 5 | 9 | 9 | 9 | 9 | 10 |
| Cohérence avec l'architecture et les décisions | 6 | 9 | 7 | 8 | 9 | 9 |
| Qualité des questions | 7 | 8 | 8 | 9 | 9 | 9 |

**Note globale : 9,1 / 10** (64 sur 70). T5 : 9,0.

Points de forme ou de fait, à passer en une relecture avant la présentation (aucun ne change une reco, un seuil ou un nom) :

**Q1. En-tête de la v6.** « Remplace la v4 » : c'est la v5 ; « tour 5 limité aux passages modifiés » : c'est le tour 6 ; « Annexe A : traitement des tours 3 et 4 » oublie les annexes A bis et A ter.

**Q2. Boulot « publié depuis le 11/10 (historique du projet) » (1.1).** Date et source ne sont pas établies (le 11/10 de la v13 concerne les places validées de Boulot, pas sa publication). Remplacer par le fait vérifié : `BOULOT_PUBLIE = true` (`parcours-publication.ts` l. 25, vérifié par la session), et ajouter Boulot au texte du test de 3.0 (« le test lit les parcours publiés »).

**Q3. Q6, « Avec A ou B ».** Dans Q6 dont les options s'appellent A, B, C, « Avec A ou B, un abonné qui a lu beaucoup de conseils peut afficher un cap élevé… » désigne Q1. Écrire « Avec Q1 A ou B ». Dans l'option B de Q6, déplacer « seulement tes comptes de test » avant « ramener » (« ne toucher à aucun abonné ; ramener à la somme de leurs étapes validées et bonus seulement tes comptes de test » se lit de travers).

**Q4. L'architecture a avancé depuis l'écriture de la v6 (v14).** La série est maintenant placée par la v14 (4.4 : ligne « salutation et série » dans « Aujourd'hui », et « Ton mois ») ; la v14 a corrigé la phrase fausse sur les conseils (1.1, 4.4, 5.2). Donc : en 3.0 (« Place dans l'espace ») la phrase « n'est placée ni dans v11, ni dans v12, ni dans v13 » est périmée (écrire : « placée par la v14 dans “Aujourd'hui” et “Ton mois”, hors du cap ») ; dans l'Annexe B, les points 1, 5 et 6 sont faits en v14 (le dire, garder les points 2 à 4 s'ils ne sont pas encore portés). À vérifier : la v14 écrit « Ton mois » sans le cap ; 3.0 de ce document met le cap dans « Parcours » et « Ton mois » : une ligne de renvoi suffit.

**Q5. Critère 6.** « Le cap s'écrit toujours “cap n sur 5” avec le nom avant » ne couvre pas l'option sans mot (3.4 l'étend en prose, pas le critère) : écrire « {mot} n sur 5 (ou “n sur 5” seul pour l'option sans mot) ».

## 4. Verdict

**Prêt à présenter à Thomas.** Aucun bloquant, aucune correction de fond : M1 à M7 sont tous traités, rien d'autre n'a changé que ce qui était annoncé, les sections solides sont intactes. Les cinq points de forme ci-dessus (Q1 à Q5) se traitent en une passe de relecture, sans nouveau tour de notation si elle ne touche que ces lignes.
