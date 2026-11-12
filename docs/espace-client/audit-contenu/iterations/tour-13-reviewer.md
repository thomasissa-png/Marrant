# Tour 13, relecture à l'aveugle @reviewer : architecture v13

> Relecteur : @reviewer, 12/11/2026. Document noté : `architecture-contenu-v13.md` (V13). Référence : `founder-preferences.md` l. 167. Grille C1 à C11.

## 1. Statut de mes corrections du tour 12

| T12 | Objet | Statut | Commentaire |
|---|---|---|---|
| Y1 | XP des conseils | appliqué, mais **ma propre formulation était fausse** et la v13 l'a reprise | Voir B1 : mon rapport du tour 12 affirmait que « le conseil du jour d'« Aujourd'hui » et les conseils devenus fiches (1.1 de chaque étape, Bibliothèque) entrent dans ce cas ». Le code dit autre chose. |
| Y2 | Carnet et départage | ok | §7.3 bis : relecteurs indépendants jusqu'à 10/10, au plus 4 tours, sans départage de l'orchestrateur. |
| Y3 | « visible que le jour de l'envoi » | ok | « n'est visible nulle part avant le jour de son envoi » (§2.8). |
| Y4 | « lettres déjà reçues » | ok | « l'archive des lettres du jeudi pour tous les abonnés » ; le point est devenu une proposition (B3). |
| Y5 | Effets de code de C14 | ok | §4.2, §7.3, §1.1, section 8 : interrupteur de la lettre, retour à l'intention du 03/10, favori confirmé dans « Aujourd'hui ». |
| Y6 | « Note cadrée » | ok | « une note d'une phrase », brief Q5b cité ; seul le nombre de caractères reste ouvert. |

## 2. Passages modifiés, décisions, mot « palier »

- **Décisions de Thomas** : aucune n'est rouverte. C14 (connexion) est honnêtement dit « non tranché par Thomas, à lui montrer » ; C6 reste intacte en §3.12, qui définit seulement les mots « deuil » et « rupture » et soumet « la mort comme idée » à Thomas à E6.
- **§2.7** (note) : états complets, jamais de « Fait » ni de points, gardée après la résiliation, retour sur la carte de révision. Au niveau.
- **§2.8** (lettres) : reprise immédiate, scène et répliques approuvées telles quelles, archive ouverte aux lettres d'avant l'abonnement. C'est compatible avec la décision C5 (« rien n'empêche après d'utiliser le contenu », « une section lettre »), écrit comme proposition, mais disparu du résumé (B3). Le [À VÉRIFIER : versions de la lettre] se lève (B2).
- **§2.9** (cloche) : pastille réservée aux réponses de l'équipe (argument : une pastille de nouveautés agirait comme une relance), accessibilité complète, plafond de regroupement. Au niveau.
- **§3.12** : périmètre positif, entrée volontaire « Entrer », promesse exacte (catalogue public hors promesse, dit). Au niveau.
- **§4.2, §7.3 bis, §7.6** : au niveau.
- **Mot « palier »** : la v13 ne l'emploie **pas** pour l'échelle d'XP. Elle l'emploie, comme depuis la v6, pour les trois paliers de lecture internes (« Paliers : P1 premier pas, P2 prendre le pli, P3 aller plus loin », §3.2 ; « palier 2 », « palier 3 » en §3.11 et §7.3), jamais à l'écran. Rien à corriger ici. Si le document des niveaux reprenait « palier » pour l'XP, la collision serait double : l'article public sur la timidité (`lib/blog-articles.ts` l. 2466) et ces paliers internes.
- **Totaux** : inchangés (163, 293, 108, 58) ; la note, l'archive et la cloche n'ajoutent aucune fiche.

## 3. Notes et corrections

| # | Critère | T12 | T13 | Justification |
|---|---|---|---|---|
| C1 | Valeur persona | 10 | 10 | La note qui revient sur la carte de révision est un vrai gain. |
| C2 | Respect des décisions | 9 | 10 | Rien de rouvert ; C8 appliquée au carnet sans départage. |
| C3 | Zéro donnée inventée | 9 | 8 | Les 10 XP sont attribués au conseil du jour et au conseil d'étape, qui n'en rapportent pas (B1). |
| C4 | Rubriques | 10 | 10 | Cloche hors des 6, confirmée. |
| C5 | Ambition | 10 | 10 | |
| C6 | Cohérence | 9 | 9 | Le résumé tait la proposition « Lettres » à relire (B3). |
| C7 | Faisabilité | 9 | 10 | Effets de code nommés et au chantier. |
| C8 | Décisions et reste à trancher | 10 | 10 | |
| C9 | Exemples | 10 | 10 | |
| C10 | Progression | 10 | 10 | |
| C11 | Pertinence pour l'audience | 10 | 10 | |

**Note globale : 9,7 / 10** (107 / 110 ; T12 : 9,6).

1. **B1. §1.1 (« le conseil du jour d'« Aujourd'hui », la fiche 1.1 de chaque étape et la Bibliothèque entrent dans ce cas ») ; §4.4 (« Le conseil du jour rapporte déjà 10 XP à son ouverture ») ; §5.2 (« Le conseil 1.1 rapporte en plus les 10 XP d'ouverture de conseil existants »).** Problème : faux, et l'erreur vient de ma formulation du tour 12. Seul le composant de la liste du catalogue appelle `addXp(10, "tip_read")` : `ConseilsList`, utilisé uniquement par `app/(dashboard)/conseils/page.tsx` l. 7 et 126. Aucun autre composant n'appelle `/api/user/xp` (recherche dans `apps/` : `conseils-list.tsx`, `user-store.ts` et les tests seulement). Le contenu du jour et le conseil d'une étape de parcours ne rapportent donc rien aujourd'hui. C'est ce que dit l'annexe B du document des niveaux (point 5 : « le conseil de chaque étape […] ne rapporte pas d'XP à part »). Correction : « Aujourd'hui, seuls les conseils ouverts depuis la liste du catalogue (`/conseils`) rapportent 10 XP ; le conseil du jour et le conseil d'une étape n'en rapportent pas. Dans l'espace, le bloc « Vannes, conseils, vidéos » de la Bibliothèque mène à cette liste et en hérite ; pour le reste, cela dépend de la réutilisation du composant, à trancher avec `niveaux-xp-s24.md` (décision Q9). » Retirer les deux affirmations de §4.4 et §5.2. **Bloquant : oui** (fait faux dans le document présenté à Thomas).
2. **B2. §2.8 « c'est la version destinée aux abonnés, sans l'invitation Premium [À VÉRIFIER : versions de la lettre] » ; annexe A, ligne des lettres.** Problème : vérifiable. FP l. 143 (25/10) : le prix et l'invitation Premium figurent « dans le bloc `[[invitation-premium]]` seulement (jamais dans les versions abonnés et comptes gratuits) ». Correction : remplacer le [À VÉRIFIER] par cette source. **Bloquant : non.**
3. **B3. Résumé, « Ce qui reste à trancher » (l. 38).** Problème : les lettres ont disparu de la liste, alors que §2.8 dit « toute la proposition est à relire avec Thomas » et contient deux choix neufs : l'archive ouverte aux lettres d'avant l'abonnement, et la reprise immédiate de la scène et des trois répliques telles quelles. Thomas doit les voir dans la page qu'il lira. Correction : une ligne « C5 : la proposition des lettres (archive complète, reprise tout de suite, telles quelles) est à relire avec toi (2.8) ». **Bloquant : non.**

**Conditions du 10/10** : B1 (corriger la phrase sur l'XP en trois endroits), B2, B3, puis un contrôle par recherche de ces passages.
