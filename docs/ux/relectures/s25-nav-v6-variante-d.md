# Relecture UX à l'aveugle : navigation v6, variante d (s25)

Périmètre : 24 captures `docs/espace-client/etalons/nav-v6/variantes/d-*.png` (375, 768, 1280, 1920), référence de Thomas, spec v6, persona (Yanis, 20 ans, introverti), code de la maquette (`docs/espace-client/etalons/nav-v6/maquette.html`) pour vérifier cibles et attributs. Aucune relecture existante consultée. Tout texte nouveau (sous-titre d'aperçu, « rubrique Premium », « Plus ») est « à valider par Thomas » et ne retient aucune note.

Décisions respectées, non re-questionnées : menu toujours affiché, un seul niveau, cadenas discret, aperçu sans mur, recherche 176 px (mesurée 175 à 768), cibles 44 px, 12 entrées visibles dès 1280 (arbitré dans la spec).

## Notes

| # | Critère | Note |
|---|---|---|
| 1 | Orientation | 10/10 |
| 2 | Découvrabilité | 9/10 |
| 3 | Compréhension du Premium sans agresser | 10/10 |
| 4 | Charge cognitive | 10/10 |
| 5 | Accessibilité visible | 9/10 |
| | **Globale (minimum)** | **9/10** |

## 1. Orientation : 10/10

- Rubrique active toujours lisible sans la teinte : pastille `#2A2A2A`, texte blanc contre gris, soulignement violet (code l.62-81, `aria-current="page"`). Constaté sur vannes (3 états x 4 largeurs), aujourd'hui, aperçu.
- Active centrée à l'arrivée à 375 et 768 (Vannes au centre, Quoi répondre au centre sur l'aperçu), cas bornes respecté (Aujourd'hui collé à gauche).
- `visiteur-aujourdhui` : aucune rubrique allumée, cohérent avec le cas accueil ; le fil d'Ariane et le H1 prennent le relais sur Vannes.
- Piste (ne retient pas la note) : la capture « accueil » reprend le H1 « Aujourd'hui » de la page abonné alors qu'aucun chip n'est allumé. C'est un artefact de maquette ; à vérifier sur la vraie page d'accueil.

## 2. Découvrabilité : 9/10

Constaté : les 12 rubriques et « … » tiennent à 1280 et 1920 sans défilement ; à 375 et 768 la bande défile, fondu de 24 px, rubrique coupée à gauche sur les captures `vannes` (« oondre », « ue »).

**Faute dure 1 (768, visiteur, gratuit, abonné sur Vannes)** : `d-visiteur-vannes-768.png`, `d-abonne-vannes-768.png`. Le bord droit tombe pile après « La lettre » et son séparateur, sans aucun chip entamé. Favoris, Carnet et « … » (donc Mes questions et Mes répliques) sont invisibles et le seul signal est un masque de 24 px qui rend le séparateur terminal. Un séparateur en bout de ligne se lit comme une fin de liste. À 375 le même cas est évité par hasard (« Vidéo » coupé). Défaut : `centrer()` de `maquette.html` (l.221-229) centre sans garantir un chip entamé à droite quand il reste du contenu.

Retouche codable (fin de `centrer()`, avant `fondu()`) :
```js
var max = rub.scrollWidth - rub.clientWidth;
if (rub.scrollLeft < max - 4) {
  var bord = rub.getBoundingClientRect().right - 24;
  var coupe = [].some.call(rub.querySelectorAll(".chip"), function(c){
    var r = c.getBoundingClientRect(); return r.left < bord && r.right > bord; });
  if (!coupe) rub.scrollLeft = Math.min(max, rub.scrollLeft + 40);
}
```
Principe : si aucun chip n'est entamé au bord droit, décaler de 40 px (borné) pour qu'un chip dépasse ; l'active reste visible.

**Capture manquante, à refaire (pas une note)** : `d-visiteur-aujourdhui-menu-1280.png` et `-1920.png` montrent « … » fermé alors que le nom annonce « ouvert ». Le code ouvre le panneau après 150 ms avec `?menu=1` ; la capture est partie trop tôt. On ne voit donc pas les 2 lignes avec cadenas du visiteur (le code les prévoit, l. 269-271). Refaire avec une attente > 300 ms.

## 3. Compréhension du Premium sans agresser : 10/10

- Cadenas 12 px gris `#9A9A9A` sur `#1A1A1A`, groupés à gauche d'un séparateur : « à gauche verrouillé, à droite libre » se lit seul à 1280 et 1920 sans badge.
- L'aperçu (Quoi répondre, 3 largeurs) ne mure rien : H1, sous-titre, vraie fiche lisible, chip allumé avec son cadenas. Rien de criard.
- Pistes sans effet sur la note : à 375 le visiteur arrivé sur Vannes ne voit qu'un seul cadenas (S'entraîner) tant qu'il ne défile pas, le bouton « Premium » du bandeau portant le reste du sens ; le cadenas fait 12 px dans le code contre 14 px dans la spec (§2).

## 4. Charge cognitive : 10/10

- 12 chips en 3 groupes de 5, 5, 2, séparés par des filets : lisible en blocs. Un seul bouton plein dans l'en-tête, pas d'autre appel à l'action sur Vannes. Recherche, Connexion et offre ne se chevauchent pas, à aucune largeur.
- 12 entrées visibles dès 1280 : arbitré par la spec ; ne retient pas la note.

## 5. Accessibilité visible : 9/10

Constaté et conforme : zones de 44 px (chips `height:44px`, boutons `h-11 w-11`, recherche 44 px) ; la pastille visible fait 36 px dans la zone de 44 px, cible conforme ; contrastes AA (texte `#B3B3B3` et cadenas `#9A9A9A` sur `#1A1A1A` au-delà de 4,5:1) ; actif sans la teinte ; cadenas porté par un `aria-label` (« {rubrique}, rubrique Premium »).

**Faute dure 2 (focus clavier du bouton « … », WCAG 2.4.7 et 2.4.11)** : `maquette.html` l.67 corrige l'anneau des `.chip` (`outline-offset:-2px`) mais pas `.plusbtn`. L'anneau global (l.59, décalé de +2 px) du bouton « … » est dans `#rub`, qui a `overflow-x:auto` (donc `overflow-y` clippé) et une hauteur de 44 px égale à celle du bouton : l'anneau est tronqué en haut et en bas. Retouche : `.plusbtn:focus-visible{outline-offset:-2px;border-radius:8px}`.

Autres points (ne retiennent pas la note, à reprendre au code final) :
- Panneau `role="menu"` / `role="menuitem"` sans flèches clavier : le patron ARIA « menu » promet une navigation que le code ne tient pas. La spec décrit un bouton `aria-expanded` avec liste : retirer les rôles `menu` et `menuitem` ou ajouter les flèches.
- Pas de fermeture au clic dehors du panneau (spec : « fermable » ; seul Échap et un second clic sur « … » ferment).
- Séparateurs `#3A3A3A` (contraste faible) : décoratifs (`aria-hidden`), le groupement tient aussi par les cadenas.

## Synthèse

Deux fautes dures, toutes deux de quelques lignes : bord droit sans chip entamé à 768 (découvrabilité) et anneau de focus tronqué sur « … » (accessibilité). Une capture à refaire (menu visiteur ouvert). Le reste de la variante d tient : orientation, Premium discret, charge maîtrisée.

NOTE GLOBALE : 9/10
