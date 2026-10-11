# Réécriture textes site — Session 11 (29/09/2026)

> Agent @copywriter · Mission C6 · Applique la charte-refonte-copy-s11.md
> Framework : StoryBrand (Character → Problem → Guide → Plan → Action)
> Niveau conscience cible : Problem-Aware
> Étalons appliqués : D (hero) + E (footer)
> Consigne fondateur mid-session (29/09) : rétablir "1 500+" comme chiffre fixe (pas dynamique)

---

## Tableau des modifications — 14 fichiers touchés

| Fichier | Avant | Après | Note |
|---|---|---|---|
| `components/layout/footer.tsx` | "Ton coach humour perso. Vannes, répartie et techniques de pro pour briller en société." | "Deviens drôle, un exercice à la fois. Vannes, répartie et techniques de stand-up pour briller en société." | Étalon E. "coach" → retiré. **TEST BREAKS** footer.test.tsx |
| `components/home/hero-section.tsx` — H1 | "Deviens la personne la plus drôle du groupe." | "Tu parles et personne rit. On va arranger ça." | Étalon D. **TEST BREAKS** hero-section.test.tsx |
| `components/home/hero-section.tsx` — social proof | Conditionnel `members >= MIN ? "${members.toLocaleString()} + membres" : "Rejoins celles et ceux..."` | Texte fixe : "Rejoins 1 500+ membres qui progressent en humour chaque jour" | Consigne fondateur 29/09. **TEST BREAKS** hero-section.test.tsx (tests dynamic/conditional) |
| `components/home/hero-section.tsx` — imports | `import { useContentStats, MEMBERS_SOCIAL_PROOF_MIN }` | Supprimés (devenus inutiles) | — |
| `components/home/premium-cta.tsx` — social proof | Conditionnel `stats.members >= MEMBERS_SOCIAL_PROOF_MIN && ...` | Texte fixe : "Déjà 1 500+ inscrits — et toi ?" | Consigne fondateur 29/09. |
| `components/home/premium-cta.tsx` — import | `import { useContentStats, MEMBERS_SOCIAL_PROOF_MIN }` | `import { useContentStats }` | MEMBERS_SOCIAL_PROOF_MIN supprimé. |
| `components/home/feature-cards.tsx` | "Classées par catégorie, prêtes à mémoriser." | "Classées par catégorie, prêtes à ressortir ce soir." | Audit §6 — "mémoriser" = scolaire. |
| `components/home/home-cta.tsx` | "Ton futur toi drôle te remerciera." | "La seule chose que tu n'as pas encore essayée pour être plus drôle." | Cliché coach interdit. **TEST BREAKS** home-cta.test.tsx |
| `components/home/upcoming-features.tsx` | "Ton coach de poche pour ne plus jamais rester muet" | "3 répliques générées sur mesure. Plus jamais muet." | "coach" retiré. |
| `components/quiz/viral-quiz.tsx` | "Le conseil du coach" | "Le conseil pour progresser" | "coach" retiré. **TEST BREAKS** viral-quiz.test.tsx |
| `components/marketing/premium-paywall.tsx` | "Accès illimité à tout le catalogue." | "Toutes les vannes, tous les conseils, tous les parcours." | Plus concret. |
| `app/(dashboard)/page.tsx` — Sophie card | "blagues courtes et mémorisables. Maintiens ton streak pour ne rien oublier." | "vannes courtes, prêtes à ressortir. Maintiens ton streak pour rester en forme." | "mémoriser" retiré. |
| `app/(dashboard)/page.tsx` — FAQ Q1 | "vannes à mémoriser, techniques de répartie" | "vannes à ressortir, techniques de répartie" | "mémoriser" retiré. |
| `app/(dashboard)/a-propos/page.tsx` — CTA bas | "Ton futur toi drôle t'attend." | "La prochaine vanne qui fait rire la pièce ? Elle peut être la tienne." | Cliché coach retiré. |
| `app/(dashboard)/a-propos/page.tsx` — H2 méthode | "Notre méthode" | "Notre approche" | "méthode" = scolaire (charte). |
| `app/(dashboard)/a-propos/page.tsx` — communauté | "exercices concrets testés par notre communauté." | "exercices concrets testés par notre communauté de 1 500+ membres." | Consigne fondateur 29/09. |
| `app/(dashboard)/a-propos/page.tsx` — CTA | "Rejoins les membres qui progressent en humour chaque jour." | "Rejoins 1 500+ membres qui progressent en humour chaque jour." | Consigne fondateur 29/09. |
| `app/(dashboard)/a-propos/page.tsx` — titre CTA | "Prêt à devenir plus drôle ?" | "Tu parles et personne rit. On va arranger ça." | Cohérence étalon D. |
| `app/(dashboard)/glossaire/page.tsx` | "facile à mémoriser et à ressortir" | "facile à retenir et à ressortir" | "mémoriser" retiré. |
| `lib/faqs.ts` — Q1 | "La science le confirme : des chercheurs ont démontré qu'un entraînement de 8 semaines…" | "Les études sur l'humour comme compétence le montrent : 8 semaines d'entraînement structuré suffisent…" | Reformulation moins flottante. Chiffres INTACTS (8 semaines, 50 XP/sem). |
| `lib/email.ts` — footer reset | "deviens-marrant.fr — L'humour, ça s'apprend." | "deviens-marrant.fr — Deviens drôle, un exercice à la fois." | Cohérence étalon E. |

---

## Tests Jest impactés — À METTRE À JOUR

| Test | Fichier | Texte testé (avant) | Comportement après |
|---|---|---|---|
| `HeroSection — shows main heading` | `__tests__/dashboard/hero-section.test.tsx` l.26 | `getByText("la plus drôle")` | FAIL — H1 est maintenant "Tu parles et personne rit. On va arranger ça." → chercher `getByText(/personne rit/)` |
| `HeroSection — shows main heading` | `__tests__/dashboard/hero-section.test.tsx` l.28 | `getByText(/du groupe/)` | FAIL → supprimer ce test ou remplacer par `/On va arranger/` |
| `HeroSection — affiche inscrits ≥ 100` | `__tests__/dashboard/hero-section.test.tsx` l.40 | `getByText(/Rejoins 1\s200\+ membres/)` | FAIL — le chiffre est maintenant fixe "1 500+" (plus de logique dynamique) → adapter le test pour chercher `getByText(/1.500\+ membres/)` |
| `HeroSection — pas de chiffre sous le seuil` | `__tests__/dashboard/hero-section.test.tsx` l.47-48 | `getByText(/Rejoins celles et ceux/)` | FAIL — remplacé par texte fixe 1 500+ → adapter test |
| `Footer — renders brand description` | `__tests__/layout/footer.test.tsx` l.13 | `getByText(/coach humour perso/)` | FAIL → remplacer par `getByText(/Deviens drôle, un exercice/)` |
| `HomeCta — mentions the value proposition` | `__tests__/dashboard/home-cta.test.tsx` l.39 | `getByText(/ton futur toi drôle/i)` | FAIL → remplacer par `getByText(/La seule chose/i)` ou `getByText(/encore essayée/)` |
| `ViralQuiz — shows result` | `__tests__/feature/viral-quiz.test.tsx` l.187 | `getByText("Le conseil du coach")` | FAIL → remplacer par `getByText("Le conseil pour progresser")` |

---

## Chiffres signalés — NON modifiés (règle absolue)

| Source | Chiffre | Statut |
|---|---|---|
| `faqs.ts` Q1 | "8 semaines d'entraînement structuré" | INTACT |
| `faqs.ts` Q1 | "50 XP par semaine" | INTACT |
| `faqs.ts` Q2 | "la majorité de nos membres se décrivent comme introvertis" | INTACT [CHOIX UTILISATEUR fondateur 29/09] |
| `faqs.ts` Q3 | "5-10 minutes par jour" / "2 à 4 semaines" / "3 semaines / 4 semaines / 6 semaines" | INTACT |
| `faqs.ts` Q6 | "0,99 €/mois" / "1 clic" | INTACT |
| `premium-cta.tsx` | "0,99 €/mois" / "99 € / séance" | INTACT |
| `abonnement/page.tsx` | "0,99 €/mois" | INTACT |
| `a-propos/page.tsx` FAQ | "en 2 à 4 semaines" / "3 semaines / 6 semaines / 8 semaines" | INTACT |
| `hero-section.tsx` | "1 500+ membres" (fixe, fondateur 29/09) | INTACT (texte fixe) |

---

## [HYPOTHÈSE] Chiffres à vérifier avec Thomas

- "Coaching individuel 99€/séance" dans `premium-cta.tsx` : service réellement disponible ? (audit §6 — @fullstack à confirmer)
- "50 XP par semaine" : source analytics ? Si ce n'est pas une donnée réelle, marquer [HYPOTHÈSE] dans le texte ou sourcer.
- "8 semaines" dans FAQs : source citée dans `a-propos/page.tsx` comme "Journal of Positive Psychology" — vérifier si la référence est correcte.

---

## Ce qui N'A PAS été modifié (hors périmètre ou voix déjà correcte)

- `lib/blog-articles.ts` : hors périmètre (instructions mission)
- `src/data/**` : hors périmètre
- `lib/ai/**` : hors périmètre
- `app/(dashboard)/cgu/page.tsx`, `confidentialite/page.tsx`, `mentions-legales/page.tsx`, `retractation/page.tsx` : fond juridique non touché (instructions mission)
- `app/(auth)/register/page.tsx`, `login/page.tsx` : voix déjà correcte, tutoiement OK
- `app/(dashboard)/vannes/page.tsx` : voix déjà excellente, "Test Stand-Up" OK
- `app/(dashboard)/parcours/page.tsx` : voix correcte, chiffres intacts
- `app/(dashboard)/quiz-humour/page.tsx` : voix correcte
- `app/(dashboard)/profil/page.tsx` : voix correcte ("ta progression, ton parcours vers la légende")
- `components/newsletter/newsletter-inline.tsx` : voix déjà correcte
- `components/blog/article-cta.tsx` : voix déjà correcte
- `components/onboarding/humor-quiz.tsx` : voix déjà correcte
- `app/(dashboard)/abonnement/success/page.tsx` : voix correcte, minimal et fonctionnel
