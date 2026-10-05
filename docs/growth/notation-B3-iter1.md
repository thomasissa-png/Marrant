# Notation : B3 /blog/mot-de-depart-collegue-drole (itération 1, 05/10/2026)

> Revue @reviewer. Base : `docs/copy/articles-forte-frappe/B3-mot-de-depart-collegue.md` (numéros de ligne ci-dessous = ce fichier), `config/blog-cta.ts` l.72-78, `config/blog-forte-frappe.ts` l.24, `config/blog-tracking.ts` l.17, `components/ui/markdown-renderer.tsx` (`JOKE_RE` l.35, `shareText` l.49, `headingId` l.180), S9 `docs/copy/articles-q4/S9-toast-drole-discours-qui-fait-rire.md`, A1 corrigé (`A1-message-anniversaire-drole.md`), notation `notation-A1-iter1.md`.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés. Faits techniques du brief pris comme acquis (import `--update`, `faqs` + JSON-LD, meta = `metaDescription`, CTA, Partager `text-only`, `frTypo`, gabarit 10/10).
> Intouchables respectés par tous les correctifs : texte des 22 lignes (0 caractère modifié), zéro tiret cadratin (Grep `—` : 0 dans B3, 0 dans les textes proposés ici), zéro humoriste (0 nom propre de personne dans B3), slug, title.
> Limites : pas de rendu ni de capture (article programmé au 03/12, non visible), tests non exécutés, pas de git (consigne).

## 1. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **9/10** | « En bref » et 1er paragraphe servent la requête, mais le sommaire arrive au 4e bloc (environ 185 mots), sous le paragraphe sur l'italique : le défaut corrigé par C1 sur A1, reconduit ici. |
| 2 | Sorties vers une 2e page | **9/10** | Couverture complète, mais 3 doublons dans le corps : boulot (l.69 et l.135), soirées (l.89 et l.155, la 2e pour un « déjeuner »), toast S9 (l.47 et l.173, même rôle : renvoyer le discours ailleurs). |
| 3 | CTA d'inscription | **10/10** | Entrée `blog-cta.ts` présente (CTA après le corps), titre lié au pot, promesse = [CHOIX UTILISATEUR] du 04/10, note vraie ; « sans carte bancaire » au lieu de « sans carte » évite la confusion avec la carte de départ : bien vu. |
| 4 | Lisibilité mobile et structure | **10/10** | Format A1 corrigé (numéro, ligne, indication en italique), bouton « Envoyer le message n°N » en `text-only` sur les 22 lignes (aucune ne commence par « », 2e alternative de `JOKE_RE`, indication exclue par `shareText`), règles non capturées, FAQ sortie du corps. |
| 5 | Ton Marrant des textes affichés | **7/10** | Promesse fausse « une ou deux phrases » (3 endroits, 9 lignes en font 3 ou 4), règle 1 contredite par les n°2 et n°19, « les chips » sans objet, 4 indications qui piègent le lecteur s'il les suit (n°6 à 8 postées devant le partant, n°6 « Réponds vite », n°15, n°18 envoyée aux clients), intro section 5 à double sens, et 2 phrases déjà corrigées sur A1 recopiées avant correction (l.155, l.177). |
| 6 | Conformité | **9/10** | Zéro tiret cadratin, zéro humoriste, rien de blessant, rien sur un licenciement, quiz et 20 min vrais ; seul écart client-facing : « parcours Confiance [...] pour oser envoyer le message » (l.155) prête au parcours un objet qu'il n'a pas, écart déjà corrigé sur A1 (C5, A1 l.150). |
| 7 | Sécurité SEO | **9/10** | Title 54 car. avec la requête, 6 H2 en question, ancres justes ; mais « collègue » absent de la meta (144 car.), et H2 carte quasi identique à celui d'A1 (« Quel mot drôle écrire sur la carte collective ... ») sans le mot-clé secondaire « carte de départ collègue ». |
| 8 | Mesure | **10/10** | Slug dans `TRACKED_ARTICLES` (rapport hebdo), partage mesuré par le bouton, paliers de scroll, ancres séparées des sorties, `src=blog-<slug>` via l'entrée CTA : tout est hérité du gabarit. |

**Note globale : 9,1/10** (73/80).
**Après les 11 correctifs ci-dessous : 10/10 sur les 8 critères.** Aucun ne touche le texte d'une des 22 lignes.

## 2. Top 3 (impact le plus fort)

1. **C5 + C6 (cagnotte devant le partant, auto-réponse aux clients)** : les seuls défauts qui peuvent coûter quelque chose au lecteur dans la vraie vie (surprise gâchée, blague envoyée à un client). Ce sont des indications, pas des lignes.
2. **C3 + C4 (promesse et règle 1)** : la page dit « une ou deux phrases » puis montre 4 phrases, et interdit « ce qu'il laisse derrière lui » puis propose le fauteuil et le prénom au tableau. Un lecteur attentif le voit.
3. **C9 + C10 (meta et H2 carte)** : « collègue » dans le snippet, et un H2 qui ne concurrence plus celui d'A1. C'est le trafic de la page.

## 3. Correctifs exacts

Fichier : `docs/copy/articles-forte-frappe/B3-mot-de-depart-collegue.md`, à reporter en base par l'import `--update`. Aucun correctif ne touche le texte d'une des 22 lignes.

(détail en cours d'écriture)
