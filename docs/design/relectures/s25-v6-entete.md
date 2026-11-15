# Relecture design à l'aveugle : en-tête et bande des rubriques (navigation v6, s25 tour 1)

Périmètre : `docs/captures/s25/v6-tour-1/entete/` (bandeaux visiteur, gratuit, en-cours, 375 / 768 / 1024 / 1280 / 1456 / 1920 ; menus 320 / 375 ; cloche pleine et vide ; compte 768 et 1280 ; recherche ouverte 375 et 1280 ; focus 375). Référence : `docs/espace-client/etalons/nav-v6/variantes/d-*.png`. Code : `apps/web/src/components/layout/bande-rubriques.tsx`, `apps/web/src/components/espace/rubriques.ts`.
Les échecs « menu » du visiteur dès 520 et du gratuit à 768 sont normaux en v6 (pas de bouton Menu) : non comptés.

## Ce qui est conforme (à ne pas toucher)
- Abonné (en-cours, nouvel) : bande complète et propre à 1280, 1456, 1920 (`en-cours-vannes-1280-bandeau.png`), Carnet et « … » entiers, séparateurs 1 px, rubrique active en pastille + soulignement violet.
- 768 : plus de bouton Menu, loupe, offre, compte ; bande défile avec fondu à droite (`visiteur-vannes-768-bandeau.png`). 375 : active centrée, signal de défilement, « … » fixe.
- Menu mobile court (3 à 5 lignes), recherche, offre, Connexion (visiteur), Mon profil, Déconnexion (abonné) : sobre et lisible (`visiteur-menu-vannes-375.png`, `en-cours-menu-vannes-375.png`, 320 identique sans débordement).
- Cloche : panneau avec filet violet, titre, « Fermer », état vide « Rien de nouveau. Reviens quand tu veux. » (`nouvel-cloche-vide-375.png`). Menu du compte 768 et 1280 : filet violet, cibles 44 px, pas de Favoris (retiré comme voulu).
- Focus clavier : anneau violet visible sur le chip (`visiteur-focus-04-375.png`), champ de recherche (`en-cours-recherche-ouverte-1280.png`).
- Langue visuelle : enveloppe `rounded-xl`, filet dégradé violet des panneaux, violet de l'accueil. Cohérent avec l'étalon.

## Défauts

### D1. Faute dure : « Carnet » coupé à 1280, 1456 et 1920 pour le visiteur et l'inscrit gratuit
Fichiers : `visiteur-vannes-1280-bandeau.png`, `visiteur-vannes-1456-bandeau.png`, `visiteur-vannes-1920-bandeau.png`, `gratuit-vannes-1280-bandeau.png` (et leurs pendants accueil, mon-espace, profil). Le dernier chip « Carnet » est rogné et fondu (« Carnet » devient « Carne »), collé au « … », alors que la maquette (`d-visiteur-vannes-1280.png`) et la spec (§6.2 : ≥ 80 px libres, rien de tronqué à 1280+) l'affichent entier. À ces largeurs la bande est plafonnée à 1216 px et ne défile pas visuellement (le masque CSS est en `max-xl`), donc Carnet est inaccessible à l'œil et ressemble à un bug. L'abonné n'est pas touché (pas de cadenas). Cause : le cadenas ajouté à Favoris (`estPremium` dans `rubriques.ts`, arbitrage du 15/11, donc conservé) ajoute 18 px de plus que le budget de la spec, et les graisses réelles dépassent l'estimation.
Correction codable (sans rouvrir l'arbitrage) : dans `bande-rubriques.tsx`, `ZONE`/liens `px-3` devient `px-2.5` dès `xl` pour tous (12 chips x 4 px = 48 px gagnés), à vérifier en capture à 1280 pire cas (visiteur) pour garder ≥ 24 px libres avant « … » ; si insuffisant, `gap-[5px]` devient `gap-1` et séparateurs `mx-1.5` devient `mx-1`. Alternative : n'afficher le cadenas de Favoris qu'au survol. Pour 10 : bande visiteur à 1280, 1456 et 1920 sans aucune coupure, vérifiée au pixel sur les 3 captures.

### D2. Faute dure : suggestions de recherche coupées dans le menu mobile (375)
Fichier : `visiteur-recherche-ouverte-375.png` (idem 375 gratuit, en-cours, nouvel). La liste « Suggestions » s'ouvre sous le champ mais sa seconde rangée (« observation / absurde / jeux de mots ») est tranchée à la limite basse du panneau du menu, sur le voile sombre : puces coupées et assombries, donc probablement non cliquables. Le panneau n'a pas de bord bas qui englobe la liste. À 1280 le panneau est correct (`en-cours-recherche-ouverte-1280.png`).
Correction : dans `menu-mobile-universel.tsx` (et le composant de recherche de l'en-tête), la liste de suggestions en mobile doit être dans le flux du panneau (pas en `absolute` hors du conteneur `overflow-hidden`), le panneau grandit en hauteur ; ou le panneau reçoit `overflow-visible` avec z-index au-dessus du voile. Pour 10 : 2 rangées entières, bord bas du panneau arrondi englobant, puces au même niveau de luminosité que le champ.

### P1. Piste : contraste du cadenas
`bande-rubriques.tsx` : `Cadenas` en `text-text-muted`, alors que la spec §2 demande `text-text-secondary` (« jamais un contraste plus bas »). Visuellement le cadenas est plus pâle que le libellé (`visiteur-vannes-1280-bandeau.png`). Un pictogramme porteur de sens doit tenir 3:1 : à mesurer ; sinon passer en `text-text-secondary`. Ne retient pas la note si 3:1 est tenu.

### P2. Piste : fondu à droite absent à 1280+
`max-xl:[mask-image...]` ne s'applique pas à partir de `xl`, et le masque JS ne laisse qu'un fondu court sur Carnet. Une fois D1 réglé, aucun débordement ne subsiste, donc rien à faire ; si la bande peut encore déborder en 1280 avec des polices plus larges (CI), garder le masque aussi à `xl`.

## Notes
Design : 1 fidélité 9 ; 2 hiérarchie 9 ; 3 mise en page 7 (D1) ; 4 cohérence 9 ; 5 finition 7 (D1, D2, P1).
UX : 1 compréhension 9 ; 2 action unique 9 (un seul bouton plein, `Premium`) ; 3 états vides 9 (cloche vide) ; 4 aperçu Premium 8 (une rubrique est cachée à l'œil pour le visiteur, D1) ; 5 accessibilité et cohérence entre comptes 8 (D2, P1).

NOTE GLOBALE : 7/10 (minimum des critères ; barre 9/10 non atteinte)

## Fautes dures
1. Carnet coupé à 1280 / 1456 / 1920 (visiteur et gratuit) : `apps/web/src/components/layout/bande-rubriques.tsx` (padding des chips, séparateurs).
2. Suggestions de recherche tranchées dans le menu mobile 375 : `apps/web/src/components/layout/menu-mobile-universel.tsx` (et le composant de recherche de l'en-tête).
