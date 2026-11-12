# Tour 12, relecture à l'aveugle @reviewer : architecture v12 (décisions de Thomas appliquées)

> Relecteur : @reviewer, 12/11/2026. Document noté : `architecture-contenu-v12.md` (V12). Référence qui fait foi : `founder-preferences.md` l. 167 (FP167). Grille C1 à C11.

## 1. Fidélité aux décisions du 12/11

| Décision (FP167) | Appliquée en V12 | Verdict |
|---|---|---|
| C1 barre, « Vocabulaire » dans la Bibliothèque | §6, section 8 | fidèle ; A et C retirées |
| C2 temps | §4.1, 5.2, section 8 | fidèle |
| C3 carnet inchangé | §2.2, section 8 (« Les carnets suivants gardent deux répliques ») | fidèle |
| C4 aucune nouvelle règle de série ni de points | §2.2, 4.4, 0.2 | fidèle ; mais le fait d'XP qui l'entoure est incomplet (section 3) |
| C5 lettre nouvelle, contenu réutilisable (rouvre le 25/10, marqué) | §2.8 | fidèle ; deux libellés à reprendre (Y3, Y4) |
| C6 tous univers, rupture et deuil exclus | §3.3, 3.12 (« rupture et deuil jamais comme sujet ») | fidèle |
| C7 ordre conseillé, niveaux actuels | section 8 (« pas de sixième parcours ») | fidèle |
| C8 10/10 chez tous, 4 tours, sinon deux versions | §7.1 (carnet compris) | fidèle en §7.1 ; §7.3 bis garde la « méthode d'octobre » (Y2) |
| C9 question unique gardée sur le compte | §4.2 ; « Le rattachement du profil au compte n'est pas retenu » | fidèle ; phrase de @legal prévue (§7.5 d) |
| C10 a rien effacé sauf demande | §2.6, états « Retiré par l'abonné » et « Abonnement terminé » | fidèle |
| C10 b rien d'automatique sur la détresse | §2.6 : « aucune ligne sur le 3114 dans l'espace et aucun mot-clé repéré automatiquement » | fidèle |
| C11 Répartie par défaut | §4.2 (« Cette règle est neutre ») | fidèle |
| C12 humour noir fait bien, étalon d'abord | §3.12, E6, §7.4 ordre 7 | fidèle |
| C13 vanne au même poids, toucher, « une autre » | §4.4 | fidèle ; la levée de la restriction sur les inédits est argumentée (déjà visibles au catalogue, calendrier non consommé) |
| C14 toujours « Aujourd'hui » après paiement | §4.2, 7.3, 7.5 e | fidèle ; deux effets de code à nommer (Y5) |
| Q5b note cadrée (rouvre le 07/10, marqué) | §2.7 | fidèle ; « cadrée » a déjà un sens dans le brief (Y6) |
| Q6 cloche, jamais de relance | §2.9 | fidèle |
| Q9 niveaux à part | §1.1, section 8 | fidèle |
| Déploiement d'un coup | §7.6, 7.7 | fidèle |

Aucune option non retenue ne traîne (recherche faite sur les anciennes options de C1, C9 C, C10 b A et C, C11 B et C) ; aucune décision n'est rouverte.

## 2. Parties neuves

| Partie | Verdict | Remarque |
|---|---|---|
| 2.6 Mes questions | au niveau | « rien n'est effacé sauf suppression du compte demandée par l'abonné » ; détresse : lecture humaine au cas par cas, playbook l. 595, aucune détection ; les phrases de @legal à demander sont listées une par une. |
| 2.7 « Ma réplique à moi » | au niveau | Visible par l'abonné seul, jamais lue ni notée ; distincte de « Mes questions ». Y6 pour la longueur. |
| 2.8 Lettres | au niveau, deux libellés | Règle d'or claire (rien avant l'envoi, archive telle qu'envoyée, reprise retravaillée, la lettre ne dit jamais qu'elle a été reprise). Y3, Y4. |
| 2.9 Cloche | au niveau | Naît d'un contenu ou d'une réponse, jamais d'une absence ; aucune pastille d'onglet ; aucun canal en plus. |
| 3.12 Humour noir | au niveau | Opt-in, hors rafale et hors vanne du jour, garde-fous écrits ; aucun texte écrit avant E6 ; [À VÉRIFIER] honnête sur le repérage des vannes en base. |
| 4.2 Arrivée | au niveau | Le `returnTo` choisit le premier pas, plus la page d'arrivée. Y5 pour deux effets de code. |
| 7.6 et 7.7 | au niveau | Absence de mesure « avant » dite ; lecture par cohortes (arrivés avant, arrivés après, par semaine) au-delà d'un effectif minimal ; aucune cohorte ne vaut [MESURÉ A] seule. |

## 3. Totaux et XP

**Totaux justes** (recomptés) :
- §3.2 : 60 + 12 + 8 + 12 + 12 + 10 + 30 + 5 + 6 + 8 = **163** ; palier 3 : 34 + 8 = 42.
- §5.3 : 125 + 5 + 163 = **293** ; 108 hors parcours (35 + 17 + 56).
- §7.2 : 58 fiches lues (54 + 3 + 1).
- §7.3 : 1 150 + 45 ≈ 1 200 et 3 750 + 180 = 3 930 candidates.
- Les 185 emplacements et les 60 situations sont inchangés.

**XP : fait faux par omission.**
- §1.1 décrit les gains d'XP du code comme « XP d'étape (`moduleXp`, 20 par défaut), bonus de fin 100 ». Or `components/conseils/conseils-list.tsx` l. 175 à 178 donne `addXp(10, "tip_read")` à l'ouverture d'un conseil par un abonné.
- L'anti-doublon n'est qu'un état de page (l. 111), remis à zéro à chaque chargement.
- L'appel passe par `stores/user-store.ts` l. 57, vers `POST /api/user/xp`, qui accepte un montant choisi par le navigateur (`amount: z.number().min(1).max(500)`, l. 12) jusqu'à 30 fois par minute (l. 26).
- Le conseil du jour d'« Aujourd'hui » et les conseils devenus fiches (1.1 de chaque étape, Bibliothèque) entrent dans ce cas.

C'est une règle de points existante, pas nouvelle, donc C4 ne l'abolit pas : il faut la dire, et renvoyer son sort au document des niveaux (Y1).

## 4. Notes

| # | Critère | Note | Justification |
|---|---|---|---|
| C1 | Valeur persona | 10 | Les ajouts (lettres, note, cloche, humour noir en opt-in) servent les abonnés sans pression. |
| C2 | Respect des décisions | 9 | Fidèle partout, sauf §7.3 bis qui garde un « départage » contraire à C8 (Y2). |
| C3 | Zéro donnée inventée | 9 | Totaux justes ; sources d'XP incomplètes (Y1). |
| C4 | Rubriques | 10 | Barre décidée, cloche hors des 6 à confirmer, archive « Lettres » dans « Plus ». |
| C5 | Ambition | 10 | Rien à redire. |
| C6 | Cohérence | 9 | §2.8 (a) contredit l'archive ; le résumé tranche un point ouvert (Y3, Y4). |
| C7 | Faisabilité | 9 | Le chantier de C14 omet deux effets de code (Y5). |
| C8 | Décisions et reste à trancher | 10 | Section 8 en règles, une ligne « reste à trancher » par sujet, rien de rouvert. |
| C9 | Exemples | 10 | Aucun texte d'humour noir avant E6 : juste. |
| C10 | Progression | 10 | Inchangée. |
| C11 | Pertinence pour l'audience | 10 | C12 appuyé sur la seule demande mesurée hors blagues, traité en opt-in ; mesure par cohortes. |

**Note globale : 9,6 / 10** (106 / 110).

## 5. Corrections

1. **Y1. §1.1, ligne « XP, niveaux, série (code) » : « XP d'étape (`moduleXp`, 20 par défaut), bonus de fin 100 […] cette architecture n'y touche pas ».** Problème : la liste des gains est incomplète (section 3). Un lecteur, Thomas compris, conclut que les fiches ne rapportent rien, alors que les conseils (conseil du jour, fiche 1.1 de chaque étape, Bibliothèque) rapportent déjà 10 XP. Et la route accepte n'importe quel montant de 1 à 500. Correction : ajouter à la ligne « et 10 XP à l'ouverture d'un conseil (`conseils-list.tsx` l. 177, via `POST /api/user/xp`, montant fixé par le navigateur, dédoublonnage limité à la page) : règle existante, que C4 ne crée ni n'abolit ; son sort et la fermeture de la faille sont traités dans `docs/espace-client/niveaux-xp-s24.md` (décision Q9) ». Même renvoi d'une ligne en §4.4, au conseil du jour. **Bloquant : oui** (fait faux dans un document présenté à Thomas).
2. **Y2. §7.3 bis, ligne Carnet : « Décision C8 : 10/10 chez tous, au plus 4 tours par fiche. Plancher : 3 lots de 10, soit 3 x (2 critiques + départage) = 9 passes (méthode d'octobre) par tour ».** Problème : la méthode d'octobre se règle par un départage (l'orchestrateur), ce que C8 remplace (« 10/10 chez tous les relecteurs »). Correction : « relecteurs indépendants à l'aveugle, jusqu'à 10/10 chez tous, au plus 4 tours ; sans accord, Thomas voit les deux versions », et le coût en passes recalculé sur cette règle. **Bloquant : non.**
3. **Y3. §2.8 (a) « la lettre n'est visible que le jour de l'envoi ».** Problème : contredit l'archive (« Chaque lettre entre dans l'archive dès son envoi »). Correction : « la lettre n'est visible nulle part avant le jour de son envoi ». **Bloquant : non.**
4. **Y4. Résumé, puce « Plus » : « les lettres du jeudi déjà reçues ».** Problème : tranche le point ouvert « si l'archive remonte avant le jour d'abonnement » (§2.8, section 8). Correction : « l'archive des lettres du jeudi ». **Bloquant : non.**
5. **Y5. §4.2 et §7.3, destination après paiement (C14).** Problème : deux effets du code ne sont pas nommés pour @fullstack.
   - (a) Aujourd'hui, « sans redirection automatique » n'est vrai que parce que `LETTRE_HEBDO_INSCRIPTIONS_OUVERTES = true` (`config/lettre.ts` l. 150 ; `abonnement/success/page.tsx` l. 139 à 142, sinon `router.push`). Le bouton « Continuer » doit devenir indépendant de cet interrupteur.
   - (b) C14 remplace le retour à l'intention d'origine (« décision Thomas, 03/10/2026 », `lib/premium-return.ts` l. 1 et 2) et change l'arrivée du favori ajouté après paiement (`lib/favori-apres-paiement.ts` : page d'arrivée « avec l'étoile pleine »). Le favori doit rester ajouté et la fiche devenir le premier pas.

   Correction : deux lignes dans le chantier de §7.3 et dans l'essai §7.5 e. **Bloquant : non.**
6. **Y6. §2.7 « [RESTE À TRANCHER : […] sa longueur maximale] ».** Problème : la note « cadrée » a déjà un sens dans le brief (Q5b, option B : « Notes cadrées (une phrase par fiche : « ma réplique à moi ») »). Correction : proposer « une phrase » comme défaut, en citant le brief ; ne laisser ouvert que le nombre de caractères. **Bloquant : non.**

**Conditions du 10/10** : lever Y1, traiter Y2 à Y6 (libellés et deux lignes de chantier), puis un tour à l'aveugle limité à ces passages.
