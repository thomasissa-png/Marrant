# Textes de la lettre : relevé des accords au masculin et reformulations neutres (s21)

Décision de Thomas (17/10) : des textes qui marchent pour tout le monde quand c'est simple. Pas d'écriture inclusive à points, pas de doublets lourds. Règle suivie : la reformulation la plus légère, rien d'autre ne change dans la phrase.

Périmètre relevé : `apps/web/src/config/textes/lettre-s21.ts` (formulaire, erreurs, succès, drapeau, page, statuts, 4 e-mails automatiques, pied des numéros) et `apps/web/src/data/lettre/numeros.json` (6 numéros : objet, pré-en-tête, corps). Lecture ligne à ligne, plus recherche des formes classiques (inscrit, abonné, prêt, seul, sûr, content, celui, chacun, certains).

Bilan : **2 accords adjectivaux/participiaux au masculin** visant le lecteur, **2 pronoms génériques « celui qui »** visant le lecteur ou l'auditeur dans le numéro 6. Tout le reste est déjà neutre (le tutoiement, « je » de la case, les verbes à l'impératif et les noms féminins ou épicènes font le travail).

## 1. Phrases modifiées (4)

Les 4 passent en duel à l'aveugle (`pack-relecture-neutre.md`) : règle d'or s18, un texte validé à l'aveugle ne change pas sans repasser la relecture.

| # | Emplacement | Texte actuel | Texte neutre |
|---|---|---|---|
| 1 | `lettre-s21.ts` > `statuts.confirmee.titre` (page /lettre?statut=confirmee, après le tap sur « Confirmer mon adresse ») | C'est bon, tu es inscrit. | C'est bon, ton inscription est confirmée. |
| 2 | `lettre-s21.ts` > `EMAILS.piedNumero` (pied de chaque numéro mensuel, texte brut) | Tu reçois cette lettre parce que tu t'es inscrit sur deviens-marrant.fr. | Tu reçois cette lettre parce que tu l'as demandée sur deviens-marrant.fr. |
| 3 | `numeros.json` > n°6 > `corps`, section « Pourquoi ça marche », avant-dernière phrase | Le maillon manquant n'est jamais écrit, et c'est celui qui écoute qui le reconstitue, ce qui fait rire. | Le maillon manquant n'est jamais écrit, et c'est la personne qui écoute qui le reconstitue, ce qui fait rire. |
| 4 | `numeros.json` > n°6 > `corps`, « À toi de jouer », point 3 | N'explique pas le raisonnement : c'est à celui qui lit de le reconstituer. | N'explique pas le raisonnement : c'est à la personne qui lit de le reconstituer. |

Notes par ligne :

- **#1.** Formule proposée par Thomas (« Ton inscription est confirmée »), gardée dans la phrase d'origine. Écho voulu avec le bouton « Confirmer mon adresse » qui précède. « C'est bon » + « confirmée » dit deux fois la même chose de très près : si la relecture le sent, repli à tester ensuite « C'est bon, c'est confirmé. » (non mis en duel : il perd l'idée d'inscription).
- **#2.** Seul cas où la tournure change vraiment (le verbe « s'inscrire » appelle le participe). « l'as demandée » : l'accord se fait avec « la lettre », pas avec la personne. Garde le sens de la preuve de consentement (la personne a demandé la lettre, avec double confirmation). C'est du pied légal L3 : à passer à @legal avant la mise en ligne, même si le sens ne bouge pas. Repli possible : « parce que ton adresse a été inscrite sur deviens-marrant.fr » (plus froid, non retenu).
- **#3 et #4.** « celui qui » est un masculin générique. « la personne qui » est la substitution la plus courte, une syllabe de plus. Ce sont les deux cas les plus discutables (voir §3) : le duel dira si le naturel tient. Repli éventuel pour #3 : « c'est le public qui le reconstitue » (non mis en duel).

## 2. Phrases laissées telles quelles (déjà neutres ou hors lecteur)

| Emplacement | Texte | Pourquoi on ne touche pas |
|---|---|---|
| `statuts.desinscrit.titre` | C'est fait, tu ne recevras plus la lettre. | Verbe, aucun accord. |
| `statuts.invalide.titre` | Ce lien ne marche plus : il a peut-être expiré ou déjà servi. | « il » = le lien. |
| `erreurs.email` | Cette adresse n'a pas l'air complète. | Accord avec « adresse ». |
| `erreurs.reseau` | Ce que tu as saisi reste dans le champ | « Ce que » est invariable, aucun accord avec la personne. |
| `formulaire.case` | Oui, je veux recevoir… Je peux me désinscrire… | « je » sans participe ni adjectif. Et le texte exact de la case est figé (@legal L1, version de consentement). |
| `succes.changer` | Mauvaise adresse ? La corriger | Accord avec « adresse ». |
| `drapeau.texte` | Il reste à confirmer ton adresse | Aucun accord. |
| E-mail confirmation | Quelqu'un (sûrement toi) a demandé… Ce n'était pas toi ? | « Quelqu'un » et « toi » n'accordent rien. |
| E-mails déjà inscrit, reconfirmation | Tu reçois déjà… Tu veux toujours recevoir… on te désinscrit | Verbes seuls. |
| Numéros 1 à 6, consignes « À toi de jouer » | Pense à…, Choisis…, Pars d'…, Propose…, Réagis… | Impératifs. |
| N1, N2, N5 | Ex. « Il a payé le café », « mon coloc », « mon banquier », « mon frère », « Mon copain m'a rendu », « Mon date… Elle a tenu dix » | Personnages des vannes, pas le lecteur. Les vannes sont validées à l'aveugle (règle d'or s18) : le genre y fait partie de la blague, on n'y touche pas. |
| N3 | « le narrateur relégué au bord du cadre », « le chien est le vrai sociable » | Le narrateur de la vanne et le chien, pas le lecteur. |
| N1 | « une vérité gênante que chacun préfère ne pas dire tout haut » | « chacun » est un générique de tiers, ici l'humanité entière ; la neutralité n'y gagnerait rien et « tout le monde » alourdirait. Laissé. |
| N2 | « un proche pour poser la question » | Nom épicène dans l'usage (un proche, une proche), générique, ne vise pas le lecteur. Laissé. |
| N3 | « certains cherchent un raccourci » | Pronom générique de tiers, usage courant. Laissé. |
| N3 | « l'objet ou la personne censés t'aider » | Accord avec « objet ou personne », pas avec le lecteur. |
| N5 | « devenu rare chez quelqu'un de précis » | Accord avec « comportement ». « quelqu'un » est invariable. |

## 3. Cas limite et option (non mis en duel)

- **N4, exercice point 1 : « Pars d'une attitude que quelqu'un affiche : « je ne suis pas inquiet », « ça ne me dérange pas ».** Le masculin est dans une citation d'une tierce personne, pas dans une adresse au lecteur : hors périmètre strict. Si Thomas veut tout nettoyer, version neutre au même poids : « je ne m'inquiète pas ». À trancher par Thomas ; je ne le propose pas en duel faute de visée sur le lecteur.
- **#3 et #4 (« celui qui »).** Pourquoi les retenir malgré tout : « celui qui lit » désigne littéralement la personne qui lit la vanne, donc une lectrice comme un lecteur. Pourquoi c'est le point faible : « celui qui » est un générique très installé, et « la personne qui » se lit un peu administratif. Si la relecture à l'aveugle préfère l'actuel dans les deux duels, on garde l'actuel et on ne ré-ouvre pas.

## 4. Intégration (@fullstack), après relecture à l'aveugle

À ne faire que sur les duels gagnés par la version neutre (règle d'or s18 : la version retenue sort de la relecture au niveau).

- #1 : `lettre-s21.ts` ligne 122 ; test `__tests__/lib/lettre-textes-valides-s21.test.ts` ligne 111 ; commentaire de `components/lettre/lettre-succes.tsx` (ligne 20, « Jamais « Tu es inscrit » avant le clic ») à aligner. Le test `lettre-inscription-s21.test.tsx` ligne 217 (`queryByText(/inscrit/i)` à l'état succès) n'est pas touché : l'état succès ne montre pas ce titre.
- #2 : `lettre-s21.ts` ligne 237 ; tests `lettre-textes-valides-s21.test.ts` ligne 195 et `lettre-envoi-s21.test.ts` ligne 206. Valider avec @legal (pied L3).
- #3 et #4 : `apps/web/src/data/lettre/numeros.json`, numéro 6, champ `corps`, et le miroir `docs/copy/lettre-mensuelle-s21/numeros-1-a-6.md`. Vérifier qu'aucun numéro n°6 n'est déjà envoyé ou en base (le corps vient de `NewsletterIssue.bodyText` : un numéro déjà importé en base ne se met pas à jour tout seul).
- Documenter dans `REPLIT_ACTIONS.md` si le code change. Mesure du diff réel attendue : 4 phrases, aucune autre.
