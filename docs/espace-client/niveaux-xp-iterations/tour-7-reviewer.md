# Tour 7, relecture à l'aveugle @reviewer : niveaux et XP (s24)

> Relecteur : @reviewer, 12/11/2026. Document noté : `docs/espace-client/niveaux-xp-s24.md` v7 (NX7). Référence : dernière ligne de `docs/founder-preferences.md` (12/11). Même grille qu'aux tours 1 à 6.

## 1. Décisions de Thomas : application fidèle

FP l. 168 (12/11) contre la section 4 (l. 201 à 208) :

| Q | FP l. 168 | NX7 | Statut |
|---|---|---|---|
| Q1 | 10 XP par conseil retirés pour l'avenir, XP gagnés gardés, phrase « … et des XP » à retoucher avec go | Idem, l. 203 ; 3.0 l. 131 ; critère 1 | Fidèle |
| Q2 | Cap selon les XP, 0, 100, 300, 700, 2 300 | l. 204, 3.1 ; règles B et C retirées (l. 158, une ligne « écartées ») | Fidèle, mais voir E1 (Q10 la précise pour tous les abonnés) |
| Q3 | Noms E1, mot « cap », « cap 3 sur 5 », nom avant | l. 205, 3.4 ; E2, E3, « palier » et « sans mot » retirés | Fidèle |
| Q4 | Environ 4 mois, au moins 18 étapes | l. 206 | Fidèle |
| Q5 | Un cap débloque du contenu bonus, rien d'existant retiré ou verrouillé, rouvre en partie le 18/10 avec accord écrit | l. 207, 5.1 (plus strict : rien de promis par l'offre non plus) | Fidèle ; reste « tout reste ouvert (18/10, 19/10) » dans « Déjà décidé, non reposé » l. 210, sans la nuance (E5) |
| Q6 | Aucun abonné touché ; 3 comptes de test ramenés à étapes et bonus | l. 208, 2.6, critère 3 | Fidèle dans le texte ; la reco Q10 A le contredit (E1) |
| Correction 2.5 | Livrée au développement, avant l'ouverture | 2.5, résumé l. 10 | Fidèle |

Options non retenues : bien retirées (Q-options, règles B et C, jeux E2 et E3, mots écartés). Restes mineurs : 3.0 l. 140 garde « Nouveau cap : {nom}. … Aucune promesse », alors que 5.4 l. 245 ajoute « Un bonus s'ouvre : {titre} » (E6) ; l. 141, retour à la ligne perdu (« (ou « voir le détail »).- **Place dans l'espace** ») et « était placée ni dans v11 » (il manque « n' »).

## 2. Nouvelle section 5 : contenu débloqué par cap

**Ce qui est au niveau.** La règle intangible de 5.1 : bonus en plus, rien d'existant ni de promis verrouillé, aucun mot « avancé » ou « difficile », pas de cadenas. Le risque P0 s18 de l'option A (répliques écartées remises en ligne) est bien vu. La reco B (séance) est la moins chère et la plus cohérente avec la pratique. L'ordre de 5.5 (correction, vérification, recalcul, puis bonus) et le déblocage côté serveur sont justes. Q8 voit le problème du mot « tout ».

**Faits contrôlés.**
- `UserPathStepCompletion` (une ligne unique par abonné, parcours et étape) et `UserPathProgress.completedAt` existent (`api/parcours/[id]/progress/route.ts` l. 24 à 26, 157 à 174). La somme étapes plus bonus est donc calculable sans la colonne `xp` : 5.5 est exact sur ce point.
- **Mais une étape se valide par simple déclaration** : `POST` avec `stepOrder`, réservé à Premium, limité à 10 par minute (l. 100), sans contrôle de quiz ni de durée (l. 113 à 177). Valider les 25 étapes prend environ 3 minutes, et ouvre le cap 5 et les quatre bonus (E3).
- v15 : **163 fiches neuves**, et non « 155 (v11) » (`architecture-contenu-v15.md` l. 15, 417) ; 6 séances, rangées dans « S'entraîner » sous « Plus » (l. 415, 519, 804) ; format 3/5/8/4 minutes (l. 535).
- Offre : FP l. 124 et 125 (19/10) citées exactement. Le texte « tout » du code ne se limite pas au titre : `abonnement-vente.ts` l. 44 `PHRASE_OBJET_CONNECTE` (« Premium ouvre tout : le catalogue, les 5 parcours, un carnet de répartie par mois. », profil et paiement d'après les tests), l. 67 (titre), l. 69 (`titreAvantNom`, « Premium ouvre tout ») ; et l'écran d'offre de l'app mobile, « Premium ouvre tout Deviens Marrant » (FP l. 149). E0, « liste généraliste de tout ce que Premium ouvre » : FP l. 156, exact.

## 3. Notes, corrections et verdict

| # | Critère | T6 | T7 | Raison |
|---|---|---|---|---|
| 1 | Exactitude des faits | 10 | 8 | 155 au lieu de 163 ; volumes de C faux ; calendrier contre cas de Marc ; textes « tout » incomplets |
| 2 | Valeur pour Yanis, Sophie, Marc | 10 | 9 | Lignes persona de B recopiées des 6 séances existantes ; état vide qui annonce les bonus à venir |
| 3 | Ton maison des noms | 10 | 10 | Inchangé |
| 4 | Respect des [CHOIX UTILISATEUR] | 10 | 8 | Q10 A étend aux abonnés le traitement que Q6 réservait aux comptes de test ; calendrier échelonné contre « tout part d'un coup » |
| 5 | Qualité des questions à Thomas | 10 | 9 | Q10 tait l'effet sur Q6 ; Q9 A contredite par 5.4 |
| 6 | Honnêteté des risques | 10 | 8 | 5.5 « rien ne dépend d'une triche possible » : faux, la validation est déclarative |
| 7 | Cohérence avec l'architecture | 10 | 8 | Renvois v11, place des séances bonus, aucune ligne pour la v15 en annexe B |

**Global : 8,6 / 10** (60 / 70). Deux bloquants.

1. **E1 (bloquant). Q10 l. 276 à 279, 3.0 l. 142, 3.1 l. 156, critère 3 l. 186, Q6 l. 208.** Problème : le document décrit deux caps à la fois. 3.0 et 3.1 parlent d'un cap affiché sur le total (« peut afficher un cap plus haut… c'est pourquoi le cap de déblocage se calcule sur les étapes ») : c'est l'option C de Q10, qu'elle-même juge confuse. La reco A (« le garde dans son total mais pas dans son cap ») calcule au contraire le cap affiché de **tous** les abonnés sur leurs étapes et bonus. C'est le traitement que Thomas a réservé aux 3 comptes de test (Q6 « aucun abonné touché »), et un abonné honnête qui a lu des conseils peut afficher un cap plus bas que son niveau actuel, contre le critère 3 (« ne diminue jamais ») et « vers le haut seulement » (l. 142). Correction : choisir une seule écriture dans 3.0, 3.1 et 3.4, conforme à la reco, et dire dans Q10 A : « cela applique à tous les abonnés, pour le cap, ce que ta décision Q6 réservait à tes comptes de test : un abonné qui a lu beaucoup de conseils peut voir un cap plus bas que son niveau actuel ; ses XP restent ». Récrire le critère 3 en conséquence (ou proposer en A : cap affiché = le plus haut des deux au recalcul, bonus sur les étapes seulement). **Bloquant : oui** (une décision de Thomas rouverte sans le dire).
2. **E2 (bloquant). 5.3 l. 226, « cap 2 … (à l'ouverture), cap 3 vers la semaine 3 ou 4, cap 4 vers la semaine 7 à 12, cap 5 après au moins 18 semaines : les bonus se produisent dans cet ordre, cap 5 en dernier ».** Problème : tout est ouvert (18/10), et une étape se valide en un clic (10 par minute). Un abonné peut atteindre le cap 5 dès le premier jour. Les abonnés actuels qui ont déjà validé des étapes sont recalculés à l'ouverture, et 5.4 range alors leurs bonus dans « Tes bonus ». La décision « tout part d'un coup » (FP l. 167) exclut aussi une ouverture échelonnée. Enfin, « cap 4 vers la semaine 7 à 12 » contredit le cas de Marc en 3.1 (cap 4 à la semaine 6). Correction : **les quatre bonus sont produits et validés avant l'ouverture** (avec B : 4 séances, coût faible), et la phrase de calendrier est supprimée (ou gardée comme rythme typique, sans effet sur la production). **Bloquant : oui** (un cap atteint ouvrirait un bonus inexistant).
3. **E3. 5.5, titre « Rien de débloqué ne dépend d'une triche possible » et l. 253 « non falsifiables ».** Problème : les étapes ne sont pas falsifiables par l'API d'XP, mais elles sont déclaratives (voir section 2). Le test « total gonflé sans étape » ne couvre que l'ancienne faille. Correction : titre « Les bonus ne dépendent pas de l'ancienne faille d'XP » et une phrase : « une étape se valide sur déclaration (tout est ouvert depuis le 18/10) : qui valide sans pratiquer ouvre les bonus sans les avoir gagnés ; c'est accepté, puisqu'un bonus n'est vu de personne d'autre et ne retire rien à personne ». **Bloquant : non.**
4. **E4. 5.1 l. 216 « aucune des 155 fiches neuves de l'architecture (v11) » ; renvois « v11 § » en 5.3, 5.4, 3.6 (critère 10).** Problème : l'architecture courante est la v15 (163 fiches neuves). Correction : « 163 fiches neuves (v15) » et renvois vers la v15. **Bloquant : non.**
5. **E5. Section 4 l. 210, « Déjà décidé, non reposé : … tout reste ouvert (18/10, 19/10) ».** Problème : Q5 rouvre en partie le 18/10. Correction : « tout reste ouvert (18/10, 19/10), sauf les bonus de cap, ajoutés par Q5 ». **Bloquant : non.**
6. **E6. 3.0 l. 140, « Nouveau cap : {nom}. » … « Aucune promesse ».** Problème : la phrase diffère de celle de 5.4 l. 245. Correction : aligner 3.0 sur 5.4. Corriger aussi le retour à la ligne de l. 141 et « n'était placée ». **Bloquant : non.**
7. **E7. 5.3 tableau, colonne C, « environ 380 à 1 250 répliques candidates [… 1 150 à 3 750 pour 60 situations] ».** Problème : 1 150 et 3 750 sont les totaux de **tous** les types de la v15 §7.3. Pour les 60 situations, il faut compter 540 à 2 160 répliques plus 240 contextes, donc pour 20 situations : 180 à 720 répliques plus 80 contextes. Correction : ces chiffres. **Bloquant : non.**
8. **E8. 5.4 l. 246, état vide « Ton premier bonus arrive avec ton prochain cap. ».** Problème : cet état annonce les bonus à venir, alors que la reco Q9 A en fait une surprise (« aucune liste de bonus à venir, aucun « il te manque » »). Correction : avec Q9 A, « Tes bonus » n'apparaît qu'au premier bonus ouvert ; la phrase ne vaut qu'avec Q9 B. **Bloquant : non.**
9. **E9. 5.4 « Où vivent les bonus » (rubrique de « Parcours ») ; annexe B.** Problème : avec B, les séances bonus vivraient loin des 6 séances de « S'entraîner » (v15 l. 519, 804). L'annexe B ne dit rien à la v15 (bonus à compter en §3.2, §5.3 et §7.3, place, chantier), et la v15 écrit encore « Cette architecture n'y touche pas » (l. 989). Correction : séance bonus aussi listée dans « S'entraîner », marquée « Bonus du cap n » ; annexe B, point 7 pour la v15 (4 fiches de plus si Q7 = B, place, chantier de déblocage côté serveur). **Bloquant : non.**
10. **E10. 5.2 l. 221, « Textes touchés [À VÉRIFIER @fullstack] ».** Problème : la recherche est faisable (section 2). Correction : lister `abonnement-vente.ts` l. 44, 67 et 69 (la phrase « ouvre tout : … » du profil et du paiement comprise), l'écran d'offre de l'app mobile (FP l. 149) et E0 (FP l. 156) ; garder le [À VÉRIFIER] pour J5 et llms. **Bloquant : non.**

**Conditions du 10/10** : E1 et E2, puis E3 à E10, puis contrôle par Grep (« 155 », « v11 § », « semaine 7 à 12 », « non falsifiables », « Ton premier bonus »). **Verdict : pas encore prêt à présenter**, la section 5 doit repasser un tour.
