# Relecture DESIGN à l'aveugle, « Aujourd'hui », tour 14 (s26)

Captures ouvertes : visiteur 375/1280/1920, gratuit 1920, en-cours 375/1280, nouvel 1280. Les autres (768, 1456, comptes restants) : lues via `TAILLES.md` et `INDEX.md` seulement, non vues en image. Code lu : `hero-apercu.tsx`, `tableau.tsx`, `repliques-fermees.tsx`.

## Gate typographique (mesurée, `TAILLES.md`)
4 comptes x 375/768/1280/1920 : **4 tailles et 6 combinaisons sur les 16 lignes** (24 ou 30 / 20 / 16 / 14 ; 30/600, 20/600, 16/400, 16/600, 14/400, 14/600). Seuil (<= 4 et <= 6) respecté partout, graisses 400/600, aucune capitale. PASS, pas de faute automatique.

## Barres grises des répliques verrouillées (`bg-border-hover`)
Visibles à 1280 et 1920 : deux barres (pleine, 2/3) lisibles comme du texte masqué, sous « La sûre / La joueuse / La risquée » en 14/600 blanc. À 375 elles restent nettes. Elles ne ressemblent pas à un bouton ni à un chargement, la tuile se lit fermée (verrou par réplique). PASS. Piste : aucune.

## Notes par critère (Design)
1. Élégance et fidélité à l'accueil : **9**. Retenue, rayons et bords uniformes, rythme de 8 px visible, H1 en dégradé (décision de Thomas du 16/11, non re-questionnable) cohérent avec l'accueil.
2. Hiérarchie : **9**. Un seul aplat violet (bouton), offre en haut à droite, Z1 dominante en 8 colonnes. Piste : Z1 abonné (`CARTE_ACTION`, `bg-gradient-to-br from-accent-primary/10` + `border-accent-primary/40`) est un second violet, mais teinte à 10 % décidée par l'orchestrateur au tour 8, et le bouton reste le seul accent fort : piste, pas faute dure.
3. Usage de la largeur : **9**. Grilles 8/4, 3 colonnes, 2 colonnes, plus de bloc centré aux 5 largeurs vus (1280 et 1920 sont plafonnés et centrés comme l'en-tête). Pistes : (a) carte d'offre visiteur étirée (`etiree`), environ 55 px vides sous « Connexion » à 1280 et 1920 ; (b) tuile « Ton cap » du visiteur et du nouvel, environ 50 px vides sous la ligne de série ; (c) vide d'environ 60 px dans le hero entre « 1 500+ » et « Voici un exemple ». Aucun n'est une tuile creuse.
4. Cohérence entre comptes : **9**. Mêmes cadres, mêmes tuiles, mêmes titres entre aperçu et abonné. Seule différence : H1 en dégradé (prospect) contre blanc (abonné), assumée (décision Thomas, hero d'aperçu seulement).
5. Finition au pixel : **9**. Alignements nets sur la grille du header, contrastes de texte dans l'échelle (#FFF / #B3B3B3), pieds de tuile à 48 px (`min-h-12`), boutons 48 px. Piste : le texte de l'extrait atténué (`opacity-75`) tronqué par le fondu à 1280 (« les deux regretté. ») se lit comme coupé exprès, pas comme un bug.

Ce qui ferait 10 (pistes, non bloquantes) : retirer `etiree` de `offre-apercu` pour que la carte épouse son contenu et que le hero se cale sur la carte ; retirer le dégradé de `CARTE_ACTION` si Thomas veut le « un seul violet » au sens strict ; caler la tuile « Ton cap » en `justify-between` pour supprimer son bas vide.

## Fautes dures
Aucune.

NOTE GLOBALE : 9/10

Liste numérotée des fautes dures : (aucune)
