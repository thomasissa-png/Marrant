# Revue D3 s24 : vide de la carte « Ton premier pas » sous 640 px

> @design, 12/11/2026. Sources lues : `docs/captures/s24-d3/espace-aujourdhui-jour1-375-page.png`, `docs/captures/s24-e5/aujourdhui-375-premier-ecran.png`, `docs/design/etalon-e5-s24.md` (v4 §0.1 point 2, §0.5), `premier-pas.tsx`.

**Verdict : GO. Aucune correction.**

1. **Conforme à l'étalon.** D3 et E5 à 375 px montrent la même carte : titre en haut, environ 150 px de vide, puis « 5 min » et « Commencer » collés au bas (bouton plein largeur de 48 px). Le vide est un choix documenté de l'étalon (v4 §0.1 point 2 : « environ 150 px d'espace réparti entre titre et bas de carte à 812 »), validé et non re-questionnable.
2. **Raison fonctionnelle.** Il sert le test N4 : « Commencer » reste le seul élément interactif du premier écran, le contenu du jour (vanne, « Une autre ») descend hors de la vue. Le code (`max-sm:min-h-[calc(100svh-22.75rem)]`, `mt-auto` sur le bloc du bas) reprend la formule de l'étalon (`100svh - 361px`, soit 22,56 rem, plus 3 px d'écart négligeable).
3. **Garde-fous tenus.** Pas d'étirement à partir de 640 px ni sous 300 px (`max-e300:min-h-0`), donc rien de vide à 200 % ni sur grand écran. Avec bandeau, `29.5rem` correspond au `- 471px` de l'étalon.
4. **Réserve (non bloquante).** L'étalon se contredit : §0.5 demande « aucun grand vide au milieu de la carte » alors que §0.1 point 2 l'assume. v4 prime en cas de conflit ; je tiens donc le vide pour voulu. Si Thomas le juge laid à l'usage, l'alternative est une hauteur naturelle (v3, `min-height` supprimé), au prix du test N4 : c'est un arbitrage @ux, pas une erreur de D3.
5. **Écart mineur à noter, non corrigé.** Sur la capture D3 (page entière), le titre « Contenu du jour » apparaît vers y = 690 sur 812 : comme dans la capture E5 (y = 685). Seule la première carte du contenu (vanne) dépasse. Identique à l'étalon.
