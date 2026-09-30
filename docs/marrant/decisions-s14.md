# Décisions à trancher : s14 (30/09/2026), après bascule Cloudflare

Sources : `docs/seo/audit-post-bascule-s14.md` (60/100), `docs/geo/audit-post-bascule-s14.md` (63/100),
`docs/strategy/audit-messages-s14.md`, `docs/copy/audit-vannes-s14/lot-A.md` + `lot-B.md`.
Barre vannes validée : étalon Alexa (`docs/founder-preferences.md`, 30/09).

## Vannes (638 actives)

Bilan audit : GARDER 205, REECRIRE 143, RETIRER 290 (dont ~200 variantes redondantes, doublons, calembours, blessantes ; ~80 « sous l'étalon »).
Nettement au niveau : environ 1 sur 3. Compteur du site après retraits : de « 550+ » vers ~« 300+ » (calcul automatique, contenus distincts).

| # | Décision | Reco |
|---|---|---|
| V1 | Vague 1 de retraits (réversible, `isActive=false`) : variantes redondantes, doublons, calembours, blessantes (~200) | GO |
| V2 | Vague 2 : les ~80 « sous l'étalon », après ta relecture de 10 exemples | GO après échantillon |
| V3 | Vanne du jour fleurs / pollen : retirée + sortie de la rotation | GO |
| V4 | Relecture automatique de cette nuit : sa règle « doute = garder » contredit ta barre et elle réécrirait des vannes que l'audit retire | la COUPER jusqu'au calibrage (change ma reco d'avant) |
| V5 | Étalons pour lancer les réécritures (règle P0) : valider 3 à 5 parmi la liste ci-dessous | à choisir |
| V6 | Vannes qui parlent d'IA / assistants (Alexa, ChatGPT, Siri) : la charte s11 les retirait. Ton étalon en est une | autoriser comme sujet si drôle |
| V7 | Générateur quotidien : lui interdire les amorces déjà en base (source des séries ×18) avant sa reprise | GO (@ia) |

Étalons candidats (texte en base) :
1. Alexa : « J'ai dit à Alexa de me raconter une blague. / Elle m'a lu mon historique de recherches. » (validé)
2. « Elle m'a demandé ce que je faisais dans la vie. / J'ai dit "des erreurs, principalement". Elle a ri. Puis elle est partie. »
3. « J'ai mis mon réveil en face du lit pour être obligé de me lever. / Maintenant je dors par terre, à côté du réveil. »
4. « Mon GPS m'a dit de tourner à droite. Y'avait un fleuve. / J'ai hésité. Il avait l'air sûr de lui. »
5. « "N'hésite pas si tu as des questions", a dit mon chef le premier jour. / Six mois plus tard, j'ai appris que c'était une expression, pas une invitation. »
6. « Hier soir, Netflix m'a demandé : "Vous êtes toujours là ?" / Personne ne m'avait posé cette question avec autant de sincérité depuis longtemps. »

## Technique (régressions de la bascule, mon périmètre)

| # | Décision | Reco |
|---|---|---|
| T1 | Always Use HTTPS (http reste en 200) : interrupteur Cloudflare, token sans droit | Thomas, 1 clic |
| T2 | Clé IndexNow : le fichier statique `public/indexnow-key.txt` masque la route sous Workers, les soumissions Bing échouent. Retirer le fichier + cache long sur `/_next/static` + HSTS 6 mois (sans preload) : 1 build + déploiement | GO |

## SEO / GEO / messages

| # | Décision | Reco |
|---|---|---|
| S1 | Listes `/vannes`, `/conseils`, `/videos`, `/blog` rendues côté serveur avec de vrais liens (aujourd'hui ~1 000 fiches sans lien entrant, `/blog` affiche « Chargement… » aux robots) | GO (@fullstack), gros gain |
| S2 | Fiches des vannes retirées : redirection 301 vers `/vannes` plutôt que 404 | GO |
| S3 | Créer `/blague-du-jour` + 6 à 8 pages catégorie (nouveaux slugs, aucun existant touché) | GO |
| S4 | `sameAs` (JSON-LD) : donner les URL des comptes de marque (Instagram, X, LinkedIn…) | URL à fournir |
| S5 | Vérification Google / Bing par TXT DNS dans Cloudflare + soumission du sitemap | GO |
| M1 | Premium promet « contenu quotidien » / « nouveaux contenus chaque semaine » : génération relancée demain sous Cloudflare, contrôle à J+7 avant de reformuler | GO |
| M2 | Parcours : le site dit « la suite fait partie de l'accès complet », le code laisse tout voir aux comptes gratuits. Aligner le code : étape 1 gratuite, 2+ payantes | à trancher |
| M3 | Chiffres (étude « 8 semaines », timing 1-2 s vs 2-3 s) : ajouter la référence, corriger l'incohérence, ne rien retirer | GO chiffre par chiffre |

Détail, preuves et questions secondaires : dans chaque rapport source.
