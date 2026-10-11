// Génère index.md dans le dossier de captures : une ligne par capture (écran, largeur, état).
// Usage : node gen-index.js <dossier>
const fs = require('fs');
const path = require('path');
const dir = process.argv[2];
const NOMS = { repartie: 'Répartie', confiance: 'Confiance', 'machine-a-cafe': 'Machine à Café' };
const ECRANS = {
  'parcours-liste': '/parcours (liste des 3 parcours)',
  'parcours-liste-premium': '/parcours en Premium (Répartie terminé, Confiance 2/6)',
  'repartie-arrivee': '/parcours/repartie à l\'arrivée (étape 1 ouverte)',
  'repartie-quiz-explication': 'Répartie étape 1 : quiz, 1re réponse (lettres A-D, correction, explication)',
  'repartie-quiz-fin-visiteur': 'Répartie étape 1 : fin de quiz visiteur + mur « Valider fait partie de Premium »',
  'repartie-apercu-etape2': 'Répartie étape 2 : aperçu verrouillé (badge, texte, bouton Premium)',
  'apercu-verrouille-zoom': 'Aperçu verrouillé de l\'étape 2 de près (carte seule, densité x2)',
  'accueil': 'Accueil visiteur (lien « Lire la première étape gratuite »)',
  'accueil-premium': 'Accueil Premium (bloc « Reprendre ton parcours », Confiance étape 3 sur 6)',
  'accueil-vers-etape1': 'Arrivée sur #etape-1 depuis l\'accueil',
  'entree-blog': 'Article de blog : lien vers l\'étape 1',
  'entree-blog-arrivee': 'Arrivée sur #etape-1 depuis le blog',
  'entree-fiche-vanne': 'Fiche vanne : bloc « Dans un parcours »',
  'entree-fiche-vanne-arrivee': 'Arrivée sur #etape-1 depuis la fiche vanne',
  'arrivee-reprendre': 'Arrivée par « Reprendre l\'étape 3 » depuis le profil (Confiance)',
  'profil-non-verifie': '/profil, compte mot de passe non vérifié (Reprendre ton parcours, pas d\'interrupteur de rappel)',
  'profil-verifie': '/profil, compte e-mail vérifié (témoin : interrupteur de rappel présent)',
  'rappel-decoche': 'Interrupteur du rappel, décoché (compte e-mail vérifié)',
  'rappel-coche': 'Interrupteur du rappel, coché avec un jour choisi (« C\'est noté »)',
  'rappel-decoche-apres': 'Interrupteur du rappel, décoché après avoir été coché',
  'focus-rappel': 'Focus clavier (Tab) sur l\'interrupteur du rappel',
  'rappel-clavier-choisir-jour': 'Interrupteur activé à l\'Espace sans jour enregistré : invitation à choisir le jour',
  'rappel-clavier-jour': 'Jour du rappel changé au clavier (Tab + Flèche bas), focus resté sur le sélecteur',
  'rappel-clavier-coche': 'Interrupteur du rappel activé au clavier (Tab + Espace)',
  'rappel-arrivee-ancre': 'Arrivée sur /profil#rappel-parcours (section à l\'écran)',
  'resultat-carte-validee': 'Carte de l\'étape 2 juste validée : gain d\'XP + date conseillée dans la carte',
  'focus-entete-etape': 'Focus clavier (Tab) sur l\'en-tête de l\'étape 1',
  'focus-reponse-quiz': 'Focus clavier (Tab) sur la réponse A du quiz',
  'focus-question-suivante': 'Focus clavier sur « Question suivante »',
  'focus-retour-exercice': 'Focus clavier sur « Essayé, ça a marché »',
  'retour-exercice-ca-a-marche': '« Alors, ce défi ? » avec « Essayé, ça a marché » sélectionné',
  'focus-valider': 'Focus clavier sur « Valider cette étape »',
  'survol-valider': 'Survol de « Valider cette étape »',
  'survol-voir-offre': 'Survol de « Voir l\'offre Premium »',
  'bouton-desactive-quiz-a-finir': 'Bouton désactivé « Termine le quiz pour valider cette étape »',
  'on-valide': 'Bouton « On valide… » pendant l\'envoi (désactivé)',
  'etape-chargement': 'Chargement lent de l\'étape 2 (requête retenue 6 s), cadré sur la progression et la carte',
  'etape-echec-reessayer': 'Échec du chargement (requête bloquée) : message role="alert" et « Réessayer » à l\'écran',
  'etape-apres-reessayer': 'Étape 2 chargée après « Réessayer »',
  'survol-entete-etape': 'Survol de l\'en-tête de l\'étape 1',
  'survol-option-quiz': 'Survol d\'une option du quiz (réponse B)',
  'survol-rappel': 'Survol de l\'interrupteur du rappel',
  'focus-apres-valider': 'Juste après « Valider » au clavier : focus sur l\'étape suivante (annonce aria-live au journal)',
  'etape-chargement-inconnue': 'Chargement lent avec progression inconnue (stockage du navigateur vidé) : barre grise neutre, aucun verrou',
  'etape-chargement-carte': 'Carte de l\'étape 2 pendant le chargement (requête retenue 6 s) : squelette, aria-busy',
  'etape-echec-arrivee': 'Échec du chargement, arrivée par #etape-2 : ce que voit l\'abonné sans défiler',
  'etape-echec-carte': 'Carte de l\'étape 2 après échec du chargement',
  'validation-echec': 'Échec de la validation (requête bloquée) : message, bouton « Valider » et quiz conservé (si tout tient en une vue ; sinon message seul)',
  'validation-echec-vue': 'Échec de la validation : ce que voit l\'abonné juste après le clic, sans défiler',
  'validation-echec-bouton': 'Échec de la validation : bouton « Valider » et quiz conservé (quand le message est trop loin pour une seule vue)',
  'trois-parcours-fin-bilan': 'Fin du 3e parcours (les 3 terminés) : carte de fin avec le carnet',
};
function ecran(key) {
  let vue = '';
  if (/-repos$/.test(key)) { return ecran(key.replace(/-repos$/, '')).replace(/^Survol (de |d')?/, 'Sans survol, même cadrage : ') ; }
  if (ECRANS[key]) return ECRANS[key];
  if (!/apres-validation-vue$/.test(key) && /-vue$/.test(key)) { vue = ' (fenêtre visible)'; key = key.replace(/-vue$/, ''); }
  if (ECRANS[key]) return ECRANS[key] + vue;
  const P = '(repartie|confiance|machine-a-cafe)';
  let m;
  if ((m = key.match(new RegExp(`^${P}-etape(\\d)-avant-validation$`)))) return `${NOMS[m[1]]} étape ${m[2]} ouverte, quiz fait, avant « Valider cette étape » (page entière)${vue}`;
  if ((m = key.match(new RegExp(`^${P}-etape(\\d)-apres-validation-vue$`)))) return `${NOMS[m[1]]} étape ${m[2]} : ce que voit l'utilisateur juste après « Valider » (sans défiler)`;
  if ((m = key.match(new RegExp(`^${P}-etape(\\d)-apres-validation$`)))) return `${NOMS[m[1]]} étape ${m[2]} juste validée (zone du gain d'XP et de la date conseillée)`;
  if ((m = key.match(new RegExp(`^${P}-quiz-mauvaise-reponse$`)))) return `${NOMS[m[1]]} étape 1 : mauvaise réponse au quiz (correction)`;
  if ((m = key.match(new RegExp(`^${P}-fin-bilan$`)))) return `${NOMS[m[1]]} terminé : carte de fin + bilan, sans rechargement`;
  if ((m = key.match(new RegExp(`^${P}-fin-pleine-page$`)))) return `${NOMS[m[1]]} terminé, page entière, sans rechargement${vue}`;
  if ((m = key.match(new RegExp(`^${P}-termine-apres-rechargement$`)))) return `${NOMS[m[1]]} terminé, page rechargée${vue}`;
  return key + vue;
}
const files = fs.readdirSync(dir).filter((f) => /^[vp]-\d+-.*\.png$/.test(f)).sort((a, b) => {
  const pa = a.match(/^([vp])-(\d+)-(.*)\.png$/);
  const pb = b.match(/^([vp])-(\d+)-(.*)\.png$/);
  return pb[1].localeCompare(pa[1]) || pa[3].localeCompare(pb[3]) || Number(pa[2]) - Number(pb[2]);
});
const lignes = ['# Captures parcours d\'apprentissage (instance locale)', '',
  `Générées le ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC par scratchpad/qa-local/refaire-captures.sh. Noms stables d'un tour à l'autre (même nom = même écran, même cadrage, même état).`,
  'Préfixe `v-` = visiteur non connecté, `p-` = compte Premium (abonnement simulé en base locale). Suffixe `-vue` = fenêtre visible d\'une capture pleine page à 375 px.', '',
  '| Capture | Écran / état | Largeur | Compte |', '|---|---|---|---|'];
for (const f of files) {
  const m = f.match(/^([vp])-(\d+)-(.*)\.png$/);
  lignes.push(`| [${f}](${f}) | ${ecran(m[3]).replace(' (page entière) (fenêtre visible)', ' (fenêtre visible)')} | ${m[2]} px | ${m[1] === 'v' ? 'visiteur' : 'Premium'} |`);
}
fs.writeFileSync(path.join(dir, 'index.md'), lignes.join('\n') + '\n');
console.log(`index.md : ${files.length} captures`);
