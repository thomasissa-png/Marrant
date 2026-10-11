# Textes de parcours finalisés (s17)

Fichiers modifiés (chaînes et marqueurs uniquement, aucun nom, aucune signature, aucun placeholder, aucun type) : `apps/web/src/config/textes/parcours.ts`, `entrees-parcours.ts`, `parcours-emails.ts`. Aucun test modifié, aucun commit.
Les 26 constantes marquées `PROVISOIRE s17` ont été traitées : plus aucun marqueur PROVISOIRE ni tiret cadratin dans les 3 fichiers. Principe « améliorer, pas amputer » : 7 textes réellement changés, les autres relus et conservés parce qu'ils sont déjà dans la voix (marqueur `s17, aligné sur les étalons`) ou protégés par un test ou une règle.

## Textes changés (7, plus les commentaires d'en-tête)

| Clé | Ancien | Nouveau | Source |
|---|---|---|---|
| `ACCUEIL_LIEN_ETAPE_1` | Lire gratuitement l'étape 1 | Lire la première étape gratuite | Étalon 3.9 A (bouton secondaire de l'accueil) |
| `QUIZ_HUMOUR_PARCOURS.bouton` | Lire gratuitement l'étape 1 | Lire la première étape gratuite | Étalon 3.9 A |
| `FICHE_PARCOURS.lien` | Lire gratuitement l'étape 1 du parcours {X} | Lire la première étape gratuite du parcours {X} | Étalon 3.9 A (lien de fin de fiche) |
| `ABONNEMENT_ETAPE_1.texte` | La première étape de chaque parcours est en lecture libre, sans compte. | La première étape de chaque parcours est gratuite : tu la lis et tu testes le quiz sans t'abonner. | Étalons 3.2 (le visiteur fait le quiz) et 3.9 (formule « première étape gratuite », plus de compte gratuit) |
| `dureeEtapeTexte` | Durée estimée : 15 min environ | Environ 15 min (« Environ 15 à 20 min » selon le parcours) | Alignée sur les étalons (« Durée estimée » sonnait fiche de cours, charte §5). Rythme inchangé |
| `rappelParcoursEmail`, objet | Ton parcours {P} : l'étape {N} t'attend | {Prénom}, ta prochaine étape t'attend / sans prénom : Ta prochaine étape t'attend | Étalon 3.7, objet 7.2 (≤ 50 car.) |
| `rappelParcoursEmail`, corps | Tu en es au parcours {P}. Prochaine étape : {N}, « {titre} ». / Ta prochaine étape est conseillée à partir du {date}. Rien ne presse… / Reprendre ici : {lien} | Tu as demandé un rappel chaque semaine : le voici. / Ta prochaine étape dans le parcours {P} : l'étape {N}, « {titre} ». Un conseil, un défi et un petit quiz, de quoi remplir tes 15 à 20 minutes de la semaine. / (si date) Prochaine étape conseillée le {date}. Tu peux y aller dès maintenant si tu veux. / Reprendre mon parcours : {lien} / Plus envie de ce rappel ? Un clic suffit, le lien d'arrêt est tout en bas. | Étalon 3.7 corps A (reco validée), date : étalon 3.3 A. Pied de l'e-mail conservé tel quel (preuve de la demande, arrêt, changer de jour, contact : texte de service @legal C6) |
| Marqueurs d'en-tête (commentaires) | « les étalons remplaceront ces valeurs » / « ces versions sont provisoires » | Mention des textes finalisés s17 | Cohérence |

Contrainte juridique tenue pour l'e-mail : aucun mot offre, prix, Premium, blog ni réseau (le test `rappel-parcours-s17.test.ts` filtre `€|prix|offre|premium|/blog|instagram|linkedin|twitter|x.com|—`).

## Textes conservés, marqueur remplacé

| Clé | Texte | Nouveau marqueur | Pourquoi inchangé |
|---|---|---|---|
| `etapeOrdreTexte` | Termine l'étape N pour débloquer | aligné | Abonné seulement (le visiteur a l'aperçu 3.1) : l'API impose l'ordre de validation |
| `progressionVisiteurTexte` | Étape 1 offerte, étapes 2 à N avec Premium | aligné (« offerte ») | « Offerte » est la formule validée s15/s16 (paywall, /abonnement), à ne pas contredire ; 5 tests l'attendent |
| `QUIZ_CORRECTION` | Bonne réponse / Pas tout à fait / La bonne réponse : … | validé (étalon 2) | « Pas tout à fait » plutôt que « Faux » est dans les règles du format |
| `XP_GAIN`, `totalXpTexte` | +N XP gagnés ! … | aligné | XP et bonus intouchables (charte §1) |
| `RAPPEL_LIEN` | Envie d'un rappel par e-mail le jour de ton choix ? / Règle-le dans ton profil | aligné (3.7 A) | Déjà conforme (consentement, jour choisi) |
| `CHARGEMENT_ETAPE`, `LIENS_FICHES`, `PAGES_ETAT` | (inchangés) | aligné | Déjà dans la voix |
| `VANNES_ETAPE` | Vannes à pratiquer / Voir la fiche / N vannes choisies… | aligné | Libellés de page d'étape renvoyés à un futur étalon (étalons section 5, COP-10), 4 tests l'attendent |
| `TITRES_SECTIONS` | Pour qui ? / Le programme | aligné | H2 de page, SEO |
| `FIN_PARCOURS` (suite, carnet) | Passer au parcours {X} ; phrase du carnet | validé (étalon 3.6) | La phrase du carnet est mot pour mot celle de l'étalon |
| `LISTE_PARCOURS` (termine, revoir) | Terminé / Revoir ce parcours | aligné (3.4) | Jamais « Reprendre » sur un parcours fini |
| `REPRENDRE` | titre, ligne, bouton « Reprendre l'étape N » | validé (3.4 A) pour le titre ; reste aligné | Le titre est l'étalon ; la ligne n'a pas le titre d'étape en donnée (signature figée), le bouton garde l'étape précise ; un test exact attend la ligne |
| `FAQ_SERIE_XP` | … ta série compte les jours où tu pratiques… | validé (3.8 A) | Règle déjà conforme, test faq-section l'exige |
| `FAQ_REGULARITE` | … 5 minutes | aligné | Chiffre intouchable |
| `RAPPEL_PARCOURS_UI` | Rappel de parcours / Jour du rappel / C'est noté. | validé (3.7 A) | « Jour du rappel » = étalon ; « C'est noté : prochain rappel {date} » exige une donnée absente, repli « C'est noté. » |
| `RAPPEL_PARCOURS_CONSENTEMENT` | Reçois chaque semaine un e-mail pour reprendre ton parcours. Tu peux l'arrêter à tout moment. | validé (texte @legal C1) | Texte de consentement : le modifier impose de changer la version. Même contenu que l'étalon 3.7 A |
| `TEXTES_PROGRESSION_API`, `TEXTES_ARRET_RAPPEL`, `TEXTES_RAPPEL_API` | (inchangés) | aligné | Déjà tutoyés, sans reproche, sans offre |

## Tests : non exécutés par moi (Bash indisponible dans cette session)

`tsc` et `jest` n'ont PAS pu être lancés. Analyse par grep des tests qui vérifient un texte modifié, à confirmer en lançant les deux commandes :

| Test (apps/web/src/__tests__) | Attend | Nouveau texte |
|---|---|---|
| `dashboard/hero-section.test.tsx` l.89 | Lire gratuitement l'étape 1 | Lire la première étape gratuite |
| `feature/entrees-parcours-s17-ui.test.tsx` l.118 | lien « Lire gratuitement l'étape 1 » (quiz humour) | Lire la première étape gratuite |
| `feature/viral-quiz.test.tsx` l.136 | Lire gratuitement l'étape 1 | Lire la première étape gratuite |

Ces 3 échecs attendus viennent du texte validé 3.9 A. Les tests ne sont pas modifiés ; une ligne chacun à changer par @fullstack ou @qa. Aucun autre test ne cite les chaînes modifiées (e-mail : le test de gabarit vérifie le pied, conservé, l'absence d'offre et « Salut, » sans prénom, tous préservés). Risque tsc nul : seules des chaînes de gabarit ont changé, tous les paramètres des fonctions restent utilisés (`rappelParcoursEmail` utilise toujours `etapeNumero`, `lienChangerJour`, etc.).

## Points d'attention pour @fullstack

- Le corps de l'e-mail écrit « 15 à 20 minutes » en dur : l'étalon 3.7 demande la durée du parcours (15 pour Machine à Café, 20 pour Répartie et Confiance), mais `RappelParcoursContenu` n'a pas ce champ et la signature est figée. À ajouter si Thomas veut la valeur exacte par parcours `[À VÉRIFIER @fullstack]`.
- `REPRENDRE.ligne` n'affiche pas le titre de l'étape après les deux-points (étalon 3.4 A) faute de donnée dans la signature.
- « Tu testes le quiz » (ABONNEMENT_ETAPE_1) suppose que le visiteur peut faire le quiz de l'étape 1, ce que dit l'étalon 3.2 ; à confirmer côté code.
- Libellé des vidéos facultatives : non traité, comme demandé.

## Handoff

**Handoff → @orchestrator (puis @fullstack pour mettre à jour les 3 tests et lancer tsc/jest)**
- Fichiers produits : `/home/user/Marrant/docs/copy/textes-parcours-finalises-s17.md` ; modifiés : les 3 fichiers de textes ci-dessus.
- Décisions : étalons appliqués mot pour mot (3.9 A, 3.7 objet 7.2 + corps A, 3.3 A) ; le reste conservé quand déjà dans la voix. Frameworks : service pour l'e-mail [Conscience : Most-Aware], porte d'entrée pour les liens [Conscience : Problem-Aware].
- Objections traitées : « je vais être relancé sans fin » (e-mail : arrêt en un clic annoncé), « je paie sans savoir ce que j'achète » (texte de /abonnement).
