# E5, relecture à l'aveugle, tour 3 : @reviewer (cohérence et exactitude)

> 12/11/2026. v5 relue contre `tour-2-reviewer.md` et la ligne 9 E5 de l'architecture v20. Lus : `etalon-e5-s24.md` §0.00, `succes.html`, `mes-repliques.html`, `mission.html`, `mes-questions.html` (`retire`, `termine`), `paiement.ts`, `abonnement/success/page.tsx`, `abonnement-vente.ts`. Captures : parcours jour 1, cloche 2 réponses (habitué), habitué à 200 %, Aujourd'hui à 200 %, succès 375, Mes questions `termine`, Mes répliques `cat=soiree`, bilan.

## Notes
| Critère | T1 | T2 | T3 |
|---|---|---|---|
| Cohérence | 6 | 8 | 9/10 |
| Exactitude des textes | 8 | 9 | 9/10 |
| Fidélité aux décisions | 8 | 9 | 9/10 |
| Complétude (ligne E5) | 5 | 6 | 8/10 |

## Fautes du tour 2 : toutes levées
N1 (plus de « [on] » sur aucune capture) ; N2 (Répartie, « Tes premières répliques », `parcours-etapes.ts` l. 27, « Commencer l'étape 1 », cap 1) ; N3 (2 réponses sur l'état habitué) ; N4 (« Parcours : facultatif cette semaine. », cohérent avec « Étape conseillée ») ; N5 (« 5 min » détaché du bouton à 200 %) ; N6 (onglets entiers à côté d'« Aujourd'hui »). La faute 17 du tour 1 est levée aussi (lignes de rafale lisibles à 200 %).

## `succes.html` contre `paiement.ts` : mot pour mot
Conforme, apostrophes typographiques comprises : `pretTitre`, `pretTexte`, `pretBouton`, `verification*`, `connexion*` (étalon 5a.2), `nonVerifie*`, `reessayer`, `LIBELLE_RENONCER_CONTRAT`, adresse de contact. L'ordre et les rôles suivent `page.tsx` l. 169-243. Le lien de renonciation passe de 12 px à 14/20 : écart déclaré, accepté.

## Fautes et corrections
| # | Fichier / état | Faute | Correction |
|---|---|---|---|
| T1 | `aujourdhui.html` l. 215, `#etat=apres-paiement` | « Ton favori est ajouté. » [HYPOTHÈSE] alors que le site a déjà ce texte : `abonnement-vente.ts` l. 171-173 (« Ta vanne est dans tes favoris. », conseil, vidéo), testé par `bienvenue-v3-s21.test.tsx` l. 44-46 | Reprendre la phrase du code selon le type (au moins la première phrase), sans marqueur |
| T2 | `succes.html` l. 84, `#etat=nonverifie` | Repli « Voir les parcours » vers `parcours.html` : c'est le libellé du code pour une cible `/parcours` (`page.tsx` l. 66-71). Avec C14 (arrivée sur « Aujourd'hui »), la cible devient « Aujourd'hui » et le code afficherait « Continuer ». La maquette mélange l'ancienne et la nouvelle destination | Repli « Continuer » vers `aujourdhui.html`. Noter dans §0.00 que les variantes « Voir les parcours » et « Reprendre mon parcours » (l. 163) tombent avec C14 |
| T3 | `mes-questions.html#etat=termine` ; `mes-repliques.html#etat=termine` | Rendus dans l'espace (barre, cloche). Or 2.6 et 2.7 disent « lisible depuis « Mon profil », en lecture seule » : un ancien abonné n'a plus l'espace. La ligne « Ton historique de questions et tes répliques sont gardés » appartient à l'état « redirigé vers `/abonnement` » (2.6). Il manque l'adresse de l'équipe pour un problème (2.6) | Rendre ces deux états dans un cadre « Mon profil » sans barre ; ligne d'en-tête [HYPOTHÈSE] ; ajouter l'adresse de l'e-mail de résiliation ; garder la ligne « … sont gardés » pour l'état `/abonnement` |
| T4 | `mission.html`, tous les états | Cadre rendu, mais énoncé de mission, scène, contexte, question de bilan et choix sont tous entre crochets. La ligne E5 demande « une mission avec ses retours, une question de bilan » pour calibrer progression et ton : un cadre vide ne calibre pas le contenu | @copywriter : 1 énoncé de mission (marche 2) et 1 question de bilan avec ses 3 choix, à la barre E1, relus à l'aveugle, puis injectés |
| T5 | Ligne E5 : « accroche testée à l'aveugle » | Les deux accroches restent [HYPOTHÈSE] : le test A/B à l'aveugle exigé n'a pas eu lieu | @copywriter écrit A et B, relecture à l'aveugle, verdict consigné dans `etalon-e5-s24.md` |
| T6 | `succes.html` l. 66, `#etat=pret` | La ligne de la lettre du jeudi (`LETTRE_HEBDO_INFO_PAIEMENT`) n'est pas rendue, alors que son texte existe dans le code | Rendre la variante « reçoit » mot pour mot (mineur, ne bloque pas) |

## Complétude contre la ligne E5
Rendus : les deux cartes, l'ordre, les règles Oui / À moitié / Rien, l'ordre de tirage (tableau §0.00, accepté), « C'est tout pour aujourd'hui », la révision sans note avant la réponse, le contenu du jour et son toucher, « Ton cap » et « Ton mois », la barre et l'en-tête, l'arrivée après paiement, la page de succès, les tests N2 et N4, la cloche et ses états, la note et ses états, « Mes répliques », le retour sous « Ce soir », la mission, le bilan, Mes questions. **Encore bloquants pour 10/10 : T4 et T5** (contenu, pas design). Le contrôle au lecteur d'écran (« rien en double » dans le bloc vanne) n'est pas prouvé par capture : relève de @ux et @qa.

## Verdict
NO-GO tour 3, de peu. Le design est quasi complet. Top 3 : (1) T4 et T5, contenu à écrire et à passer à l'aveugle (@copywriter) ; (2) T3, états « terminé » à replacer dans « Mon profil » (@design) ; (3) T1 et T2, textes déjà présents dans le code à reprendre (@design).
