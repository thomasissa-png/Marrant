# Cartes sociales « piste A », v4 (s15, 05/10/2026, cycle 4 des visuels)

Rendu réel `next/og` (même moteur que la production), Plus Jakarta Sans 800/700 + Inter. Script : `cd apps/web && npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/render-visuels-piste-a.ts`. Contenu figé : `strategie-relance-v5.md` §8 et gagnants de `duels-resultat-cycle5.md` (textes de `duels-aveugle-cycle5.md`). Chaque PNG a été ouvert et corrigé. Rien n'est publié. Textes alternatifs : `alt.json`.

## Posts modèles et cartes

| Post | Carte(s) | Texte affiché | Format | Légende (caractères) |
|---|---|---|---|---|
| X1 Alexa, mar. 13/10 | aucune | X : texte seul (v5 §8) | | |
| X2 parents (duel : C), 22/10 | aucune | X : texte seul | | |
| X3 train (duel : A), mer. 21/10 | aucune | X : texte seul | | |
| IG1 tuteur, mar. 27/10 | `ig1-tuteur-1.png` | « Mon tuteur a lu mon rapport de stage. Il m'a dit “les remerciements sont très bien”. » | 1080×1350, noir | À envoyer à ton tuteur de stage. deviens-marrant.fr (51) |
| | `ig1-tuteur-2.png` | « Ils sont en page 2. Le rapport commence page 3. » | 1080×1350, aplat | |
| IG2 mimes (duel : A), lun. 12/10, relais `se-presenter-avec-humour` | `ig2-mimes-1.png` | « Au jeu de mimes, ma carte disait “la timidité”. » | 1080×1350, noir | À envoyer à qui a un tour de table demain. Les 4 autres exemples : lien en bio. (79, sans pied) |
| | `ig2-mimes-2.png` | « J'avais à peine bougé qu'ils avaient trouvé. » | 1080×1350, aplat | |
| IG3 Anniv de Léa (duel : A), mer. 14/10, décryptage | `ig3-anniv-de-lea-1.png` | « J'ai découvert que mes potes avaient un groupe sans moi. J'ai boudé trois jours. » | 1080×1350, noir, « Glisse → » | À envoyer à celui qui n'est jamais sûr d'être invité. deviens-marrant.fr (72) |
| | `ig3-anniv-de-lea-2.png` | « Il s'appelait “Anniv de Léa”. Léa, c'est moi. » | 1080×1350, aplat | |
| | `ig3-anniv-de-lea-3.png` | Pourquoi ça fait rire : celui qui boude trois jours est l'invité d'honneur, et la preuve se trouvait dans le titre du groupe. | 1080×1350, noir, surtitre intégré lilas | |
| | `ig3-anniv-de-lea-4.png` | À toi de jouer : repense à un moment où tu t'es cru mis de côté, puis cherche le détail qui prouvait le contraire. Le quiz est dans le lien de la bio. | 1080×1350, aplat, sans bouton | |
| L1 canapé, jeu. 15/10 | aucune | LinkedIn : texte seul (v5 §8) | | |
| L2 « dossier jamais ouvert » (duel : C), 29/10 | aucune | LinkedIn : texte seul | | |
| L3 tour de table (duel : C), 13/10 | aucune | LinkedIn : texte seul ; couverture en option ci-dessous | | |

## Relais et couverture

| Post | Carte(s) | Texte affiché | Format | Légende |
|---|---|---|---|---|
| Relais Instagram, lun. 26/10, `blagues-sur-l-ia-assistants-vocaux`, n°4 `cs14jke6736001250d3a940d` | `ig-relais-blagues-ia-1.png` | « J'ai demandé à l'IA un avis honnête sur mon manuscrit. Elle a répondu “passionnant”. » | 1080×1350, noir, « Glisse → » | « À envoyer à qui t’a fait lire son roman. Les 5 autres vannes : lien en bio. » (75) |
| | `ig-relais-blagues-ia-2.png` | « C'est le mot de ma mère. Je cherche quelqu'un qui me déteste. » | 1080×1350, aplat | |
| Couverture d'article LinkedIn (option du relais L3) | `linkedin-article-se-presenter.png` | Se présenter avec humour : 5 accroches qui passent | 1200×627, sans étiquette | |

## Actions 10/10 appliquées (notations cycle 3)

- **R6** : une paire « » par ligne de vanne (carte 1 = ligne 1, carte 2 = ligne 2), “ ” imbriqués, guillemets Plus Jakarta au même corps, lilas `#A78BFA` sur noir et `#DDD6FE` sur l'aplat, espace fine à l'intérieur, « suspendu dans la marge (bord gauche ≥ 48 px, testé à 80, 88 et 100 px), » collé au dernier mot et compté dans la mesure. Alt avec « ». Cartes 3 et 4, surtitres, pied : sans guillemets. Détection 1re personne automatique, forçable (`citation`).
- **Guillemet géant du conseil** retiré : une paire autour de la réplique entière (`charge/ig-conseil-2.png`).
- **Trait d'union** rendu en Inter (`charge/x-titre-stand-upper.png`).
- **Couvertures** : chiffre géant supprimé (il répétait le nombre du titre), nombre du titre en lilas ; écart titre/pied de 64 px garanti par le code (corps réduit sinon) : titre de 95 caractères en X à 4 lignes, environ 120 px au-dessus du pied (`charge/x-titre-95-car.png`). LinkedIn : titre 64 px.
- **Gabarits manquants** : carrousel décryptage 4 cartes (`carrouselDecryptage`), relais Instagram 2 cartes (`carrouselRelais`).
- **Invitation à envoyer** : par la légende « À envoyer à... » (v5 §8 : pas sur la carte), contrôlée par `defautsLegende` (80 caractères, « lien en bio » une fois) avant chaque rendu.
- **LinkedIn** : bouton « Lien dans le post », aucun « Glisse » ni pagination (`charge/ig-conseil-3.png`, rendu LinkedIn).
- **Amorce** à 88 px si elle tient en 4 lignes (sinon 80), bloc centré à 40 % de la hauteur.

## Reste ouvert

- Test Buffer d'un brouillon carrousel Instagram 2 et 4 images et d'un post LinkedIn multi-images (v5 §2.6) : non fait ici.
- Légende du relais du 26/10 : fournie par @social (75 caractères), reportée ici et dans la v5 §8.
