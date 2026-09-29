# Décisions à trancher par Thomas — fin de session 11 (29/09/2026)

> Consolidé depuis les rapports de la refonte réelle (blog, catalogue, conseils, vidéos, parcours, pages, SEO). Tout ce qui est listé ici a été **gardé tel quel** en attendant ta décision (règle : aucun chiffre retiré sans GO, on ne supprime pas sur un doute).

## P0 — juridique (à faire relire par @legal)
1. **Mentions légales** : le directeur de publication affiché est « Alex Durand », un persona. La loi (LCEN) exige une personne réelle identifiable. Le RCS est « en cours d'immatriculation » depuis mars.
2. **CGU** : disent qu'un abonnement est nécessaire pour accéder au contenu (alors qu'il existe un accès gratuit) ; acceptent les plus de 15 ans (le contexte projet exclut les mineurs) ; clause des tribunaux de Paris en principe inopposable à un consommateur ; rétractation 14 jours sans mention du renoncement exprès pour le contenu numérique.
3. **Confidentialité** : sous-traitants et jetons de notification push non mentionnés.

## P1 — chiffres et promesses incohérents (un GO par ligne)
4. **Prix mobile** : le paywall de l'app affiche 4,99 €/mois, le site et les CGU 0,99 €/mois.
5. **Durée du parcours Répartie** : « 4 semaines » presque partout, « 30 jours » dans `rester-muet-en-groupe`.
6. **Rythme des parcours** : « 15 à 20 min/semaine » (/parcours) vs « un exercice par jour, 10 min max » (encart blog) vs « 5 minutes par jour » (FAQ /conseils) ; « résultats visibles sous 2-3 semaines » (encart blog, invérifiable).
7. **Taille du catalogue** : « 300+ vannes » dans la description des pages /vannes/[slug] ; le compteur prod affiche 600+. Proposition : compteur dynamique.
8. **`phrases-droles-conversations`** : titre et corps = 30 phrases, ancien excerpt = 33.
9. **Coaching individuel 99 €/séance** (llms, tarifs) : l'offre existe-t-elle vraiment ?
10. **Compte gratuit** : confirmer qu'il garde ses XP et accède à l'étape 1 des parcours (les nouveaux CTA le disent).
11. **Notification push** : l'onboarding annonce 9h, la tâche tourne à 8h UTC (10h Paris en été).

## P2 — sources à fournir (sinon on garde, mais c'est un risque de crédibilité)
12. **Études et stats sans source** : 76 % (Université du Colorado), Frayssinet « 70 % de réussite », Stanford 23 % / 25 % / 40 % / « 15 mots, 3 fois », étude UPenn, 65 % de « blancs conversationnels », 50 % / 80 % / 90 % dans les conseils, « 10 fois plus », Journal of Positive Psychology « 8 semaines », Université du Nouveau-Mexique, Mark Leary (Duke) « hyper-monitoring ».
13. **Citations attribuées gardées** : Fary « cow-boys et Indiens », Blanche Gardin (psy), Paul Mirabel « 10 % de talent, 90 % de préparation », Waly Dia (ponctuation). Toutes les autres citations incertaines ont été désattribuées.

## P3 — choix éditoriaux / produit
14. **FAQ cachée de la home** (`homepageFaqs`, 4 questions non affichées, sorties du JSON-LD par la passe SEO) : les afficher ou les supprimer.
15. **Meta description de la page n°1** (135 caractères, sous la cible 140-160) : la rallonger (sans toucher titre/slug) — uniquement sur GO.
16. **Références d'humoristes hors du pool habituel** : Pierre Croce, Florence Foresti, Jamel (conseils) — OK ?
17. **App mobile** : l'onboarding et le paywall ne sont affichés nulle part ; identifiant différent entre `app.json` et Capacitor.
18. **Détails comiques chiffrés** modifiés dans des vannes réécrites (ex. « 1 274 couchers de soleil », « 22h15 ») : même traitement que ta page n°1 — listés dans chaque rapport de `docs/copy/`.

## Hors contenu
19. **Mise à jour Gradient** : lancer `bash update.sh --all` puis `rm -f .claude/agents/moi.md .claude/agents/orchestrator-reference.md` (les modèles des agents sont déjà passés en 5.5 à la main).

---

## Réponses de Thomas (29/09/2026) et suites données
- **1-3 (juridique)** : on laisse en l'état ([CHOIX UTILISATEUR]).
- **4 (prix mobile)** : 0,99 €/mois appliqué (sera revu plus tard).
- **5-11 (chiffres)** : « que ce soit juste » → corrigés sur les faits : Répartie = 4 semaines partout ; rythme = une étape par semaine (15-20 min) ; « résultats sous 2-3 semaines » retiré ; « 600+ vannes » (602 actives) ; 33 phrases ; push « chaque matin ». Coaching 99 € : offre bien présente sur la home → gardé. Compte gratuit (XP + étape 1) : à vérifier en prod.
- **12-13 (études, citations)** : on laisse.
- **19 (Gradient)** : fait — dernière version installée (le script local visait la branche `master` au lieu de `main`).
