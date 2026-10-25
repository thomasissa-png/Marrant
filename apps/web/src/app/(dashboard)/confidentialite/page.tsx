import type { Metadata } from "next";
import { pageShareMeta } from "@/lib/seo-meta";
import Link from "next/link";
import { LETTRE_CONFIDENTIALITE_ANCRE, LETTRE_HEBDO_INSCRIPTIONS_OUVERTES } from "@/config/lettre";
import { QUESTION_EQUIPE_CONFIDENTIALITE_ANCRE, QUESTION_EQUIPE_OUVERTE } from "@/config/question-equipe";
import { CONFIDENTIALITE_QUESTION_EQUIPE as QUESTION, PRESTATAIRES_QUESTION_EQUIPE } from "@/config/textes/question-equipe-s22";
import { dateTextesJuridiques } from "@/lib/date-textes-juridiques";
import { CONFIDENTIALITE_LETTRE_HEBDO as HEBDO } from "@/config/textes/lettre-hebdo-s21";
import { frTypo } from "@/lib/fr-typo";
import { WIDGET_VANNE_DU_JOUR_PUBLIE } from "@/config/widget-vanne-du-jour";

const PAGE_URL = "https://deviens-marrant.fr/confidentialite";
const PAGE_TITLE = "Politique de confidentialité";
const PAGE_DESCRIPTION =
  "Politique de confidentialité : quelles données on collecte, pourquoi, et comment exercer tes droits RGPD. Mesure d’audience sans cookie ni bandeau.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  // SEO s21 : aperçu de partage propre à la page (og:url), au lieu de celui de l'accueil.
  ...pageShareMeta({ title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: PAGE_URL }),
};

/**
 * Audit parcours s16 (reco 18) : prestataires réels (plus Replit), mesure
 * d'audience Umami sans cookie (donc pas de bandeau, plus de « consentement
 * cookies » qui n'existait pas), suppression du compte en libre-service depuis
 * le profil (lot D : plus de « effacement sous 30 jours »),
 * tutoiement (D6). Identité de l'éditeur inchangée (D3, en attente de Thomas).
 * Lot G (relecture @legal point 11) : données de rétractation, factures 10 ans,
 * comptes inactifs, délai de réponse aux droits (un mois), Stripe responsable
 * de ses propres traitements (fraude). Textes PROVISOIRES lot G.
 */
const PRESTATAIRES: { nom: string; role: string }[] = [
  { nom: "Cloudflare", role: "hébergement et diffusion du site" },
  { nom: "Neon", role: "base de données (compte, progression, abonnement)" },
  { nom: "Stripe", role: "prestataire de paiement : paiement et gestion de l’abonnement (tes données bancaires restent chez Stripe)" },
  // s21 (@legal B7, partie 4) : la lettre passe aussi par Resend.
  { nom: "Resend", role: "envoi des e-mails liés à ton compte et à ton abonnement, et des lettres" },
  { nom: "Umami Cloud", role: "mesure d’audience, sans cookie" },
  { nom: "Google", role: "connexion avec ton compte Google, si tu la choisis, et lecture des vidéos YouTube" },
];

/**
 * s22 (avis @legal du 25/10, point 2 ; C3 : boîte contact@ chez IONOS) : partie 4 telle que
 * publiée à l'ouverture de « Ta question à l'équipe » (Resend étendu, IONOS, outils de
 * rédaction). Interrupteur fermé : liste inchangée.
 */
function prestataires(questionOuverte: boolean = QUESTION_EQUIPE_OUVERTE): { nom: string; role: string }[] {
  if (!questionOuverte) return PRESTATAIRES;
  return [
    ...PRESTATAIRES.map((p) => (p.nom === "Resend" ? { ...p, role: PRESTATAIRES_QUESTION_EQUIPE.resendRole } : p)),
    ...PRESTATAIRES_QUESTION_EQUIPE.ajouts,
  ];
}

const SECTION_TITLE = "mb-2 text-lg font-semibold text-text-primary";
const LIST = "mt-2 list-disc space-y-1 pl-6";

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Politique <span className="whitespace-nowrap">de confidentialité</span></h1>
      <p className="mt-2 text-sm text-text-muted">Dernière mise à jour : {dateTextesJuridiques()}</p>
      <div className="mt-8 space-y-6 text-text-secondary">
        <section>
          <h2 className={SECTION_TITLE}>1. Responsable du traitement</h2>
          <p>Le responsable du traitement des données est deviens-marrant SAS, joignable à l’adresse contact@deviens-marrant.fr.</p>
        </section>
        <section>
          <h2 className={SECTION_TITLE}>2. Données collectées</h2>
          <ul className={LIST}>
            <li>Identification : prénom, adresse e-⁠mail, mot de passe (jamais stocké en clair) ou identifiant de ton compte Google si tu te connectes avec Google</li>
            <li>Connexion : adresse IP, type de navigateur, date et heure de connexion (sécurité du compte)</li>
            <li>Progression : XP, niveau, série, étapes de parcours validées avec la date de chaque validation, et tes retours sur les exercices («&nbsp;pas encore essayé&nbsp;», «&nbsp;bof&nbsp;» ou «&nbsp;ça a marché&nbsp;») si tu choisis d’en donner</li>
            {/* P2, legal s17 §4 */}
            <li>Rappel de parcours, si tu l’actives : le jour de la semaine que tu as choisi, la date d’activation et, si tu l’arrêtes, la date d’arrêt</li>
            <li>Préférences : favoris, réactions, résultats du quiz</li>
            <li>Abonnement : formule, statut, dates de période. Tes données bancaires sont traitées par Stripe et ne passent jamais par nos serveurs</li>
            <li>Rétractation, si tu envoies une demande : adresse e-⁠mail, date d’achat indiquée, motif (facultatif) et une empreinte de ton adresse IP (pour limiter les abus, sans garder l’adresse elle-⁠même)</li>
          </ul>
        </section>
        <section>
          <h2 className={SECTION_TITLE}>3. Pourquoi on les utilise, et sur quelle base</h2>
          <ul className={LIST}>
            <li>Gérer ton compte, ta connexion, ton abonnement et t’envoyer les e-⁠mails qui s’y rapportent : exécution du contrat</li>
            <li>Facturation, rappel avant renouvellement de la formule annuelle et traitement de ta demande de rétractation : obligation légale</li>
            <li>Sécuriser le site (limitation des tentatives de connexion, prévention des abus) : intérêt légitime</li>
            <li>Mesurer l’audience de façon agrégée pour améliorer le site : intérêt légitime, sans cookie (article 5)</li>
            {/* P3 à P5, legal s17 §4 */}
            <li>Afficher ta progression, calculer ta série et ta prochaine étape conseillée, et garder tes retours sur les exercices : exécution du contrat</li>
            <li>Comprendre, de façon globale, où les membres avancent ou bloquent dans les parcours pour les améliorer : intérêt légitime (tu peux t’y opposer, voir la partie 7)</li>
            <li>T’envoyer chaque semaine un rappel de ton parcours, uniquement si tu l’as demandé : ton consentement, que tu peux retirer à tout moment en un clic</li>
          </ul>
        </section>
        <section>
          <h2 className={SECTION_TITLE}>4. Prestataires (sous-traitants)</h2>
          <p>On confie certaines opérations techniques à des prestataires, qui traitent tes données pour notre compte :</p>
          <ul className={LIST}>
            {prestataires().map((p) => (
              <li key={p.nom}>
                <strong>{p.nom}</strong> : {frTypo(p.role)}
              </li>
            ))}
          </ul>
          <p className="mt-2">Stripe, notre prestataire de paiement, traite aussi certaines données pour son propre compte (prévention de la fraude, obligations légales liées au paiement) : sa politique de confidentialité s’applique alors.</p>
          <p className="mt-2">Certains de ces prestataires sont établis hors de l’Union européenne, notamment aux États-⁠Unis. Ces transferts sont encadrés par les garanties prévues par le RGPD : décision d’adéquation de la Commission européenne pour les entreprises certifiées au cadre de protection des données UE-États-Unis, ou clauses contractuelles types de la Commission européenne.</p>
        </section>
        <section>
          <h2 className={SECTION_TITLE}>5. Cookies et mesure d’audience</h2>
          <ul className={LIST}>
            <li><strong>Cookies essentiels</strong> : ta session de connexion. Ils sont nécessaires au fonctionnement du site.</li>
            <li><strong>Mesure d’audience</strong> : Umami Cloud, sans cookie. On compte les pages vues et quelques actions (par exemple un clic sur un bouton d’abonnement, l’ouverture d’une étape de parcours ou le score d’un quiz), sans y associer ton nom, ton e-⁠mail ni ton compte, et on ne lit que des statistiques globales. Ces mesures ne sont ni croisées avec les données de ton compte, ni utilisées pour de la publicité.</li>
            <li><strong>Provenance de ta visite</strong> (réseau social, campagne) : gardée dans le stockage de session de ton navigateur, effacé à la fermeture de l’onglet.</li>
            {/* s22 (go Thomas 24/10, visa @legal N8) : affichée seulement quand le widget est ouvert. */}
            {WIDGET_VANNE_DU_JOUR_PUBLIE && (
              <li><strong>Widget La vanne du jour</strong> : il ne dépose aucun cookie. Seules les données techniques de la requête sont traitées pour l’afficher, et chaque affichage est compté avec le seul domaine du site qui l’affiche (rien sur le visiteur), conservé 3&nbsp;mois chez Cloudflare.</li>
            )}
          </ul>
          <p className="mt-2">Comme aucun cookie de mesure ni de publicité n’est déposé, le site n’affiche pas de bandeau cookies.</p>
          <p className="mt-2">Deux services tiers peuvent déposer leurs propres traceurs quand tu les utilises : Stripe sur sa page de paiement (sécurité du paiement), et YouTube (Google) quand tu lances une vidéo. Le lecteur YouTube n’est chargé qu’à ce moment-⁠là, en mode de confidentialité renforcée (youtube-nocookie.com). Leurs politiques de confidentialité s’appliquent alors.</p>
        </section>
        <section>
          <h2 className={SECTION_TITLE}>6. Durée de conservation</h2>
          {/* PROVISOIRE s16 (lot D), à relire par @legal : suppression en libre-service (lib/account.ts#deleteAccount). */}
          <p>Tes données sont conservées tant que ton compte existe. Tu peux supprimer ton compte toi-⁠même, à tout moment, depuis ton profil (voir la partie 7) : ton compte, ta progression, tes favoris et ton inscription à la lettre faite avec l’adresse de ton compte sont effacés tout de suite, et ton abonnement s’arrête aussitôt.</p>
          {/* [À FIXER PAR THOMAS] durée de conservation des comptes inactifs (11 anciens comptes FREE compris) :
              aucune purge automatique n'existe ; texte neutre sans durée chiffrée en attendant (@legal point 11 c). */}
          <p className="mt-2">Un compte inactif n’est pas supprimé automatiquement : il reste en place jusqu’à ce que tu le supprimes depuis ton profil.</p>
          <p className="mt-2">Tes factures restent chez Stripe, notre prestataire de paiement, pendant 10 ans : la loi nous oblige à conserver les pièces comptables.</p>
          {/* [À FIXER PAR THOMAS] durée de conservation des demandes de rétractation (prescription, avis d'avocat,
              @legal point 11 a) : texte neutre sans durée chiffrée en attendant. */}
          {/* P7, legal s17 §4. Phrase « Les statistiques de mesure d'audience sont conservées 25 mois au plus. »
              à ajouter seulement une fois la purge Umami réglée (C12, Thomas). */}
          <p className="mt-2">La date de chaque étape validée et tes retours sur les exercices sont gardés tant que ton compte existe, et effacés avec lui. Ton rappel de parcours s’arrête dès que tu le désactives, que ton abonnement Premium prend fin ou que tu supprimes ton compte.</p>
          <p className="mt-2">Si tu nous as envoyé une demande de rétractation, elle est gardée comme preuve de son traitement, le temps nécessaire pour répondre à une éventuelle contestation.</p>
        </section>
        <section>
          <h2 className={SECTION_TITLE}>7. Tes droits (RGPD)</h2>
          <p>Tu disposes des droits suivants sur tes données :</p>
          <ul className={LIST}>
            <li><strong>Accès</strong> : obtenir une copie de tes données</li>
            <li><strong>Rectification</strong> : corriger des données inexactes</li>
            <li><strong>Effacement</strong> : supprimer tes données</li>
            <li><strong>Portabilité</strong> : recevoir tes données dans un format structuré</li>
            <li><strong>Opposition et limitation</strong> : t’opposer à un traitement fondé sur l’intérêt légitime ou en demander la limitation</li>
          </ul>
          <p className="mt-2">
            Tu peux supprimer ton compte à tout moment depuis ton{" "}
            <Link href="/profil" className="underline underline-offset-2 hover:text-text-primary">profil</Link>
            {" "}: la suppression arrête aussi ton abonnement. Pour les autres droits, écris à contact@deviens-marrant.fr : on te répond sous un mois. Tu peux aussi adresser une réclamation à la CNIL (cnil.fr).
          </p>
          {/* P8, legal s17 §4 */}
          <p className="mt-2">Si tu as activé le rappel de parcours, tu peux l’arrêter à tout moment depuis ton profil ou avec le lien au bas de chaque e-⁠mail : ce que tu as reçu avant reste valable.</p>
          {/* s21, @legal « Textes publiés à l'ouverture, 17/10 », texte 1 : lettre seule (rien sur les questions). */}
          <p className="mt-2">Tu peux retirer ton consentement à la lettre à tout moment, avec le lien en bas de chaque e-⁠mail : ce que tu as reçu avant reste valable.</p>
          {/* s21, avis @legal lettre hebdo §4.2 (droits) : publié avec l'ouverture des inscriptions. */}
          {LETTRE_HEBDO_INSCRIPTIONS_OUVERTES && <p className="mt-2" data-testid="confidentialite-lettre-hebdo">{frTypo(HEBDO.droits)}</p>}
        </section>
        {/* s21, bloquant @legal B7 : section lettre, mot pour mot (docs/legal/lettre-et-questions-s21.md,
            parties 1, 2, 3 et 6 ; seules les phrases sur la lettre mensuelle). Ancre visée par le lien
            « Confidentialité » du formulaire (LETTRE_CONFIDENTIALITE_HREF). Les phrases sur « Ta question
            à l'équipe » et la lettre hebdomadaire Premium attendent l'ouverture de ces services. */}
        <section id={LETTRE_CONFIDENTIALITE_ANCRE} className="scroll-mt-24">
          <h2 className={SECTION_TITLE}>8. La lettre</h2>
          <p>La lettre et le site s’adressent aux personnes de 15 ans et plus.</p>
          <ul className={LIST}>
            <li>Lettre par e-⁠mail, si tu t’y inscris : ton adresse e-⁠mail, la page où tu t’es inscrit, la date et la version du texte que tu as accepté, la date de ta confirmation et une empreinte non réversible de ton adresse IP, pour prouver ton accord et limiter les abus. Aucun compte n’est créé.</li>
            {/* s21, avis @legal lettre hebdo §4.2 : ajouts mot pour mot, publiés avec l'ouverture des inscriptions. */}
            {LETTRE_HEBDO_INSCRIPTIONS_OUVERTES && <li data-testid="confidentialite-lettre-hebdo">{frTypo(HEBDO.donnees)}</li>}
          </ul>
          <ul className={LIST}>
            <li>T’envoyer la lettre mensuelle : ton consentement (case à cocher puis confirmation par e-⁠mail), que tu peux retirer en un clic</li>
            {LETTRE_HEBDO_INSCRIPTIONS_OUVERTES && <li data-testid="confidentialite-lettre-hebdo">{frTypo(HEBDO.finalite)}</li>}
            <li>Respecter tes choix et prouver ton accord : intérêt légitime</li>
          </ul>
          {LETTRE_HEBDO_INSCRIPTIONS_OUVERTES && <p className="mt-2" data-testid="confidentialite-lettre-hebdo">{frTypo(HEBDO.destinataires)}</p>}
          <p className="mt-2">Lettre : tu restes inscrit tant que tu ne te désinscris pas. Tous les 2 ans, on te demande par e-⁠mail si tu veux la garder ; sans clic de ta part, on te désinscrit. Une adresse jamais confirmée est effacée après 7 jours. Quand tu te désinscris, on efface l’empreinte de ton IP et on garde 3 ans ton adresse, la date et la version de ton accord et la date de ta désinscription : c’est la preuve de ton choix et la liste qui nous empêche de t’écrire de nouveau. Si tu supprimes ensuite ton compte avec cette même adresse, cette trace est effacée avec lui.</p>
          {LETTRE_HEBDO_INSCRIPTIONS_OUVERTES && <p className="mt-2" data-testid="confidentialite-lettre-hebdo">{frTypo(HEBDO.duree)}</p>}
        </section>
        {/* s22, avis @legal du 25/10 (point 2), mot pour mot : publiée avec l'ouverture de « Ta question
            à l'équipe » (jamais avant). Ancre visée par le lien « Confidentialité » de l'encadré du profil. */}
        {QUESTION_EQUIPE_OUVERTE && (
          <section id={QUESTION_EQUIPE_CONFIDENTIALITE_ANCRE} className="scroll-mt-24" data-testid="confidentialite-question-equipe">
            <h2 className={SECTION_TITLE}>{frTypo(QUESTION.titre)}</h2>
            <ul className={LIST}>
              {QUESTION.puces.map((texte) => (
                <li key={texte.slice(0, 24)}>{frTypo(texte)}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
