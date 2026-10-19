# Trajets de conversion s21, v3.1 : recaptures de la passe de finition

Branche `claude/marrant-conversion`, build de production local (base jetable, variables factices de la CI). Seuls les écrans touchés par la finition du tour 3 sont refaits, **en 375 × 700 et 320 × 640** ; le reste du trajet est celui de `../trajets-v3/`. Régénérer : `CAPTURES_TRAJETS=1 npm run test:e2e:local -- captures-finition` (script `playwright/tests/local/captures-finition-v3-1.spec.ts`).

| Dossier | Écrans | Ce qui change |
|---|---|---|
| `T1-en-tete/` | /abonnement premier écran, mensuel puis annuel | Avantage 3 « Chaque mois, un carnet de situations et leurs répliques », lien pointillé vers « Le carnet, en vrai » ; carte Annuel : « soit 2,08 € par mois · plus de 3 mois offerts » sur une ligne (séparateur sous 400 px), renouvellement au même corps et à la même couleur ; ligne compte « D'abord ton compte, puis le paiement sur Stripe. » sur une ligne |
| `T2-mur-vannes/` | idem, depuis le mur (accroche) | Idem ; à 320 × 640, « 1 500+ inscrits bossent leur humour. » passe sous la garantie et la ligne compte (texte inchangé) : bouton à 546 px, garantie à 610 px, ligne compte à 628 px, en mensuel comme en annuel |
| `T4-fenetre-premium/` | fenêtre de l'étoile | « Premium ouvre aussi tout le catalogue et les 5 parcours. » |
| `T3-fin-etape-1/` | 01a carte « Étape 2 sur 4 » · 01b sous le bouton | L'étape 2 n'est plus répétée dans la liste tant que la carte est affichée ; la lettre gratuite passe sous la liste des étapes |
| `FAQ-et-si-j-arrete/` | réponse ouverte | « Si tu résilies, tu gardes Premium jusqu'à la fin de la période déjà payée. Ensuite, ton compte continue avec l'accès gratuit. Tes favoris et ta progression restent enregistrés. » |
| `desktop-1280/` | premier écran · page complète | Cases à la hauteur de leur contenu (plus de vide sous le prix Mensuel), prix alignés en haut ; FAQ à 560 px comme la carte, le carnet et le tableau ; titre de la fiche du carnet centré |

Mesures à 320 × 640 depuis l'en-tête : bouton 518 px, garantie 582 px, ligne compte 600 px. À 375 × 700 depuis le mur : garantie 656 px, ligne compte 678 px (une ligne).
