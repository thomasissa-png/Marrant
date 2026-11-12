# Niveaux et XP, tour 7, relecteur @ux (à l'aveugle) : `docs/espace-client/niveaux-xp-s24.md` (v7, section 5 : contenu débloqué par cap)

> Relu en entier ; attention portée à la section 4 (décisions de Thomas), à la section 5 (nouvelle), à 2.4, 2.6, 3.0, 3.6 et à l'annexe A quater. Références : `founder-preferences.md` l. 168 (décisions du 12/11 sur les niveaux : « Q5 … un cap DÉBLOQUE du contenu (contenu bonus en plus, jamais un contenu existant retiré ou verrouillé ; nature du contenu à concevoir et itérer) »), l. 46 (« offre vraie », 04/10) ; `architecture-contenu-v14.md` (4.4, 6.1, 6.2).
> Question posée : le déblocage se vit-il sans pression, sans « verrouillé » ni cadenas, de façon accessible ? Où apparaît le bonus ? Surprise ou visible à l'avance ? Un abonné qui stagne au cap 1 se sent-il privé ?

## 1. La section 4 suit-elle la décision de Thomas ?

**Oui, fidèlement.** Q1 à Q6 reprennent la ligne 168 de `founder-preferences.md` mot pour mot (retrait des 10 XP pour l'avenir, seuils 0, 100, 300, 700, 2 300, noms et mot « cap », 4 mois, comptes de test, bonus). Q5 est écrit comme Thomas l'a dit : bonus en plus, rien d'existant retiré ou verrouillé, 18/10 rouvert en partie avec accord écrit, nature du contenu laissée à concevoir. Une conséquence à relever en cohérence : la ligne 168 ajoute que la connexion se fait vers « la page d'origine, sinon Aujourd'hui » : la v14 de l'architecture (4.2) la dit encore « non tranchée par Thomas » : à mettre à jour dans la v15.

## 2. Le déblocage sans pression ni culpabilité : parcours simulé (cognitive walkthrough)

Cas d'essai : Yanis, qui valide l'étape 1 gratuite (50 XP) puis ne fait plus que la rafale quotidienne ; il reste au cap 1 (0 à 99 XP).
1. Il lit /abonnement avant de payer : « Premium ouvre tout Deviens Marrant… et des bonus s'ouvrent à mesure que tu pratiques » (Q8 A). Sait-il quoi faire ? Il comprend que des bonus existent, et que « pratiquer » les ouvre.
2. Il pratique chaque jour la rafale. **[FRICTION H2]** : à l'étape de la rafale quotidienne, le first-time user pratique tous les jours et aucun bonus ne s'ouvre, parce que le cap suit les étapes validées et les bonus de fin (5.5), pas la rafale (C4 : la rafale ne compte pour rien). Le mot « pratiques » de l'offre promet davantage que la règle. Solution : la phrase de l'offre dit « à mesure que tu avances dans les parcours » (voir B1).
3. Il ouvre « Parcours » : après les étapes faites, la carte « Tu t'échauffes · cap 1 sur 5 » avec ses cinq repères (un plein, quatre contours) et, dessous, la rubrique « Tes bonus » : « Ton premier bonus arrive avec ton prochain cap. » **[FRICTION H8]** : à cette étape, le first-time user lit qu'une récompense l'attend et qu'il ne l'a pas : c'est la formule d'un « il te manque », que 5.4 interdit dans sa première puce. Solution : voir B2.
4. S'il revient après 30 jours : rien ne baisse, rien ne le relance, la phrase de passage viendra à la prochaine validation. Bon.

**Ce qui est bien vécu** : pas de cadenas, pas de « verrouillé », pas de liste de bonus à venir (Q9 A), pas de cloche ni d'e-mail liés au cap (section 4, « tranché sans question »), un cap qui ne baisse jamais (un bonus ouvert le reste), un cap 1 qui ne débloque rien : pour qui n'a rien fait, rien n'est retiré, l'offre est complète dès le premier jour (5.1, intangible). La règle est bien posée et c'est la bonne.

## 3. Où apparaît le bonus ? Surprise ou visible à l'avance ?

**Où.** Le document place les bonus ouverts dans une rubrique « Tes bonus » de la page « Parcours », après la carte du cap ; chaque bonus ouvert est une fiche ordinaire marquée « Bonus du cap 3 · Tu avances bien ». Rien dans « Aujourd'hui » (le cap n'y est pas, 3.0), rien dit pour « Ton mois ». Mon verdict :
- **Parcours : oui, comme porte de repli, pas comme porte unique.** La reco B est une séance de 20 minutes. Les séances ont leur porte dans « Plus, S'entraîner » (v14 6.2) et la règle de v14 6.1 dit « une porte principale par contenu ». Un bonus-séance qui vit seulement dans « Parcours » sépare 4 séances sur 10 des 6 autres. Recommandation : le bonus ouvert est une séance comme les autres dans « S'entraîner » (marquée « en plus »), et « Tes bonus » dans « Parcours » en est un raccourci vers la même fiche (état « Fait » unique, v14 6.1).
- **Aujourd'hui : jamais comme action principale, jamais avec un badge « nouveau ».** La carte « S'entraîner » d'« Aujourd'hui » (v14 4.4) peut contenir le bonus ouvert avec les autres séances ; le cap, lui, n'y est pas (écart assumé avec le brief) : la phrase de passage suffit pour l'annoncer.
- **Ton mois : les bonus faits comptent comme n'importe quelle fiche faite** (« séances faites »), sans total spécial ; surtout pas « 2 bonus ouverts sur 4 » (ce serait un compteur de ce qui manque).

**Surprise ou visible (Q9).** Je confirme la reco A (surprise), avec une honnêteté de plus : la surprise porte sur **le contenu**, pas sur **l'existence**. L'offre dit que des bonus existent (Q8 A), la carte montre cinq repères, et « un bonus par cap, du cap 2 au cap 5 » se déduit : l'abonné sait qu'il y en a quatre, pas lesquels. C'est acceptable (rien n'est listé comme fermé) à une condition : que l'espace ne reparle pas de ce qui n'est pas ouvert (voir B2). L'option B (titre du prochain bonus) créerait l'attente que 5.4 veut éviter ; l'option C est une liste de choses fermées.

## 4. Notes (même grille)

| Critère | T4 | T5 | T6 | T7 | Justification courte |
|---|---|---|---|---|---|
| Lisibilité (3 secondes) | 9 | 9 | 9 | 9 | Section 5 claire : règle intangible, trois natures comparées, reco, questions Q7 à Q10 |
| Motivation sans pression | 9 | 9 | 9 | 8 | Pas de cadenas ni de liste à venir ; mais une phrase d'attente en rubrique vide (B2) et une offre qui promet « tu pratiques » pour un cap qui suit les étapes (B1) |
| Affichage dans l'espace | 8 | 9 | 9 | 8 | Place de « Tes bonus » dite ; mais porte des séances scindée en deux, rien dit pour « Aujourd'hui » et « Ton mois » (N3) |
| Noms au ton maison | 8 | 9 | 9 | 9 | Noms inchangés ; « Bonus du cap 3 · Tu avances bien » s'y accorde ; « à débloquer » (option B de Q8) contredit le « sans verrouillé » |
| Accessibilité | 9 | 9 | 10 | 9 | Même spécification, pas de cadenas ; la phrase de passage porte maintenant du contenu actionnable en 5 secondes (N4) |
| Cohérence avec l'architecture et les décisions | 8 | 9 | 9 | 8 | Section 4 fidèle ; B1 et B2 contredisent « offre vraie » et la première puce de 5.4 ; chiffres de la v13 (N6), cloche (N5) |
| Qualité des questions | 9 | 9 | 9 | 9 | Q7 à Q10 : trois options chacune, reco argumentée, Q10 bien vue (sécurité du déblocage) |

**Note globale : 8,6 / 10** (60 sur 70). T6 : 9,1.

## 5. Corrections

### Bloquantes

**B1. [BLOQUANT] L'offre recommandée promet « à mesure que tu pratiques », le cap suit les étapes.**
Passages : 5.2 et Q8 A (« …et des bonus s'ouvrent à mesure que tu pratiques ») ; 5.5 (cap de déblocage calculé sur « étapes validées et bonus de fin ») ; 3.0 et section 4 « Rafale, jeux, fiches, Ton mois : rien (C4) » ; reco B de Q7 (« elle récompense la pratique, comme le cap »).
Problème : « pratiquer » désigne, pour l'abonné, tout ce qu'il fait dans l'espace : la rafale, les jeux, les fiches. Aucun de ces gestes n'ouvre de bonus, seules les étapes de parcours le font. Un abonné qui joue la rafale tous les jours et qui lit « à mesure que tu pratiques » a été trompé par la phrase que nous recommandons, ce que Thomas a refusé le 04/10 (« offre vraie »). Même défaut dans la justification de la reco B : le cap ne récompense pas « la pratique », il récompense les étapes de parcours validées.
Correction : écrire « à mesure que tu avances dans les parcours » dans Q8 A, dans tous les textes de l'offre cités en 5.2, et dans l'argument de la reco de Q7 ; dire à Thomas, dans le résumé de 5, que la rafale et les jeux n'ouvrent aucun bonus (conséquence de C4, qu'il peut rouvrir s'il le veut, sans que ce document le fasse).

**B2. [BLOQUANT] Un abonné au cap 1 voit une rubrique vide et une phrase d'attente : le « il te manque » que 5.4 interdit.**
Passages : 5.4 première puce (« aucune liste de bonus à venir, aucun compte à rebours, aucun “il te manque” ») et troisième puce (« Si aucun bonus n'est ouvert : “Ton premier bonus arrive avec ton prochain cap.” (jamais un tableau vide) ») ; v14 6.1 (« aucune rubrique vide à l'ouverture »).
Problème : la phrase d'attente dit à l'abonné qu'une récompense existe et que ce n'est pas encore pour lui : c'est le teaser exact que la première puce écarte, sous une autre forme, et il reste affiché aussi longtemps qu'il stagne au cap 1 (donc plus longtemps pour ceux qui en ont le plus besoin). La rubrique « Tes bonus » vide contredit aussi la règle de la barre.
Correction : tant qu'aucun bonus n'est ouvert, **la rubrique « Tes bonus » n'existe pas** (rien d'écrit, comme la règle C de la v6 : « rien d'affiché tant qu'aucune marche n'est tentée ») ; elle apparaît avec le premier bonus. Retirer la phrase d'attente. La carte du cap garde son rôle de repère, rien de plus.

### Non bloquantes (pour 10/10)

**N3. Place des bonus.** Voir section 3 : porte unique des séances (« S'entraîner ») avec « Tes bonus » en raccourci ; rien d'affiché pour le cap dans « Aujourd'hui » ; « Ton mois » compte les bonus faits comme des séances ordinaires, sans total de bonus ouverts.

**N4. Phrase de passage.** « Nouveau cap : {nom}. Un bonus s'ouvre : {titre}. » en `aria-live` poli, 5 secondes au moins : (a) elle n'indique pas où trouver le bonus (écrire « dans Tes bonus » ou « dans S'entraîner ») ; (b) 15 à 20 mots demandent plus de 5 secondes de lecture (compter environ 8 à 10 secondes) : la laisser jusqu'à ce qu'on la ferme, ou au moins 10 secondes ; (c) si elle contient un lien, il ne doit pas disparaître seul (WCAG 2.2.1) : un lien « Ouvrir » reste dans « Tes bonus ». Aussi : « Un bonus s'ouvre » seulement si ce bonus existe (voir N9).

**N5. Cloche.** Un bonus produit après coup est une nouvelle fiche : la cloche liste les nouveautés pour tous les abonnés (v14 2.9), y compris ceux qui ne peuvent pas encore l'ouvrir : une notification sur du contenu fermé. Écrire : un bonus n'est jamais listé dans la cloche (il s'annonce par la phrase de passage et par « Tes bonus »), ou seulement pour ceux qui ont atteint son cap ; dans les deux cas, jamais de pastille.

**N6. Chiffres périmés.** 5.1 écrit « aucune des 155 fiches neuves de l'architecture (v11) » : la v14 compte 163 fiches neuves (155 + 8 du coin humour noir). « Version courante : v14 » aussi dans 5.3 (« séances de v11 §3.11 », « 6 séances de v11 »).

**N7. Critères de réussite de la section 5.** 3.6 n'en a qu'un (critère 9, mis à jour). Ajouter des critères binaires : 13. aucun texte client de la section 5 ne contient « verrouillé », « cadenas », « débloquer » (ni l'option B de Q8 : « à débloquer » → « qui s'ouvrent ») ; 14. aucune rubrique « Tes bonus » ni phrase d'attente avant le premier bonus ; 15. aucun bonus listé dans la cloche, aucune pastille, aucun e-mail ; 16. un compte à total gonflé sans étape n'ouvre aucun bonus (5.5, déjà un test) ; 17. la phrase de passage nomme l'endroit du bonus et reste au moins 10 secondes ou jusqu'à fermeture.

**N8. Q10 : un cap qui peut baisser pour les comptes anciens.** Avec la base « étapes validées et bonus » (Q10 A), un abonné qui avait 640 XP de conseils d'avant la correction et aucune étape afficherait « cap 1 » à côté de « 640 XP gagnés depuis ton arrivée », alors que son ancien niveau (Farceur) était plus haut. 3.0 et le critère 3 disent « jamais de baisse », 2.6 « les caps se recalculent vers le haut » : à préciser (baisse de rang visible pour au plus les quelques comptes anciens ? « vers le haut » par rapport à quoi ?). Option simple à soumettre à Thomas dans Q10 : le cap affiché d'un compte ancien ne tombe pas sous l'ancien niveau converti, et seule la règle de déblocage utilise les étapes ; ou accepter la baisse pour ces comptes, dite à Thomas.

**N9. Calendrier de production contre la phrase de passage.** 5.3 prévoit les bonus dans l'ordre des caps (cap 2 à l'ouverture, cap 5 après au moins 18 semaines). Écrire : un cap dont le bonus n'est pas encore produit passe sans mention de bonus et sans promesse ; quand le bonus existe, il apparaît dans « Tes bonus » et dans « S'entraîner » (N5 pour la cloche).

**N10. Durée et cohérence avec C2.** Chaque séance bonus fait 20 minutes en plus des 79 minutes maximales de la semaine la plus chargée (v14 4.1) : dire que le bonus est facultatif, sa durée affichée, jamais compté dans la promesse « 15 à 20 minutes par semaine » (C2).

**N11. Résumé pour Thomas (5).** Une puce de plus : ce que la rafale et les jeux n'ouvrent pas (B1), et qu'un abonné qui ne fait que la rafale ne verra jamais « Tes bonus ».

## 6. Ce qui est solide

- 5.1 : règle intangible (un bonus s'ajoute, rien d'existant ou promis n'est retiré, retardé ou verrouillé ; neutre, jamais « avancé » ou « pour les meilleurs »).
- 5.4 : pas de cadenas, cap silencieux avant d'être atteint, aucune liste à venir, recalcul silencieux à l'ouverture, mesure sans identifiant.
- 5.5 : base de déblocage non falsifiable (étapes validées et bonus), ouverture côté serveur, test « compte gonflé sans étape : aucun bonus » : c'est exactement la bonne protection.
- Q9 reco A (surprise) et Q10 reco A, bien argumentées ; Q7 reco B (séance en plus, hors écran, moins chère à bien produire).

## 7. Verdict

**Pas encore « prêt à présenter » : deux bloquants courts, tous deux de formulation.** B1 : l'offre ne doit pas promettre « à mesure que tu pratiques » (écrire « à mesure que tu avances dans les parcours »). B2 : pas de rubrique « Tes bonus » ni de phrase d'attente avant le premier bonus, sinon l'abonné qui stagne au cap 1 lit en permanence ce qu'il n'a pas. Avec ces deux corrections et les précisions N3 à N11, la section 5 passe : le déblocage se vit sans pression, sans cadenas et de façon accessible, et l'abonné au cap 1 ne perd rien de ce que l'offre lui promet.
