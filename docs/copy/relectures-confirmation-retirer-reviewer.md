# Confirmation « Retirer de mon historique », reco A, relecture à l'aveugle : @reviewer, 13/11/2026

- Question et boutons (10/10) : « Retirer » reprend le verbe du bouton d'origine (`espace-questions.ts` l. 54, libellés E5 n° 22), et « Annuler » suit le motif validé du n° 19. Ce qui part est nommé (« les réponses de l'équipe ») et « c'est définitif » est dit sans dramatiser. Accord genré, tiret cadratin, emoji : 0.
- Statut lu par le lecteur d'écran (9/10). Faute (cohérence) : « Question retirée de ton historique. » coexisterait avec la constante en place « Retiré de ton historique » (l. 55), soit deux textes pour le même événement. La version A est la meilleure, car elle nomme l'objet et tient lue seule, en `role="status"`. Réécriture : remplacer la valeur de `retire` (l. 55) par « Question retirée de ton historique. » (à faire par @fullstack).
- À vérifier avant intégration : que l'effacement est réellement définitif côté serveur ; sinon « c'est définitif » serait faux.
