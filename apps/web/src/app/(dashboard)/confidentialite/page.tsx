import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de deviens-marrant.fr : données collectées, finalités, base légale, prestataires, mesure d'audience sans cookie, durée de conservation et exercice de tes droits RGPD.",
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
  { nom: "Stripe", role: "prestataire de paiement : paiement et gestion de l'abonnement (tes données bancaires restent chez Stripe)" },
  { nom: "Resend", role: "envoi des e-mails liés à ton compte et à ton abonnement" },
  { nom: "Umami Cloud", role: "mesure d'audience, sans cookie" },
  { nom: "Google", role: "connexion avec ton compte Google, si tu la choisis, et lecture des vidéos YouTube" },
];

const SECTION_TITLE = "mb-2 text-lg font-semibold text-text-primary";
const LIST = "mt-2 list-disc space-y-1 pl-6";

export default function ConfidentialitePage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Politique <span className="whitespace-nowrap">de confidentialité</span></h1>
      <p className="mt-2 text-sm text-text-muted">Dernière mise à jour : 7 octobre 2026</p>
      <div className="mt-8 space-y-6 text-text-secondary">
        <section>
          <h2 className={SECTION_TITLE}>1. Responsable du traitement</h2>
          <p>Le responsable du traitement des données est deviens-marrant SAS, joignable à l&apos;adresse contact@deviens-marrant.fr.</p>
        </section>
        <section>
          <h2 className={SECTION_TITLE}>2. Données collectées</h2>
          <ul className={LIST}>
            <li>Identification : prénom, adresse e-mail, mot de passe (jamais stocké en clair) ou identifiant de ton compte Google si tu te connectes avec Google</li>
            <li>Connexion : adresse IP, type de navigateur, date et heure de connexion (sécurité du compte)</li>
            <li>Progression : XP, niveau, série, étapes de parcours validées</li>
            <li>Préférences : favoris, réactions, résultats du quiz</li>
            <li>Abonnement : formule, statut, dates de période. Tes données bancaires sont traitées par Stripe et ne passent jamais par nos serveurs</li>
            <li>Rétractation, si tu envoies une demande : adresse e-mail, date d&apos;achat indiquée, motif (facultatif) et une empreinte de ton adresse IP (pour limiter les abus, sans garder l&apos;adresse elle-même)</li>
          </ul>
        </section>
        <section>
          <h2 className={SECTION_TITLE}>3. Pourquoi on les utilise, et sur quelle base</h2>
          <ul className={LIST}>
            <li>Gérer ton compte, ta connexion, ton abonnement et t&apos;envoyer les e-mails qui s&apos;y rapportent : exécution du contrat</li>
            <li>Facturation, rappel avant renouvellement de la formule annuelle et traitement de ta demande de rétractation : obligation légale</li>
            <li>Sécuriser le site (limitation des tentatives de connexion, prévention des abus) : intérêt légitime</li>
            <li>Mesurer l&apos;audience de façon agrégée pour améliorer le site : intérêt légitime, sans cookie (article 5)</li>
          </ul>
        </section>
        <section>
          <h2 className={SECTION_TITLE}>4. Prestataires (sous-traitants)</h2>
          <p>On confie certaines opérations techniques à des prestataires, qui traitent tes données pour notre compte :</p>
          <ul className={LIST}>
            {PRESTATAIRES.map((p) => (
              <li key={p.nom}>
                <strong>{p.nom}</strong> : {p.role}
              </li>
            ))}
          </ul>
          <p className="mt-2">Stripe, notre prestataire de paiement, traite aussi certaines données pour son propre compte (prévention de la fraude, obligations légales liées au paiement) : sa politique de confidentialité s&apos;applique alors.</p>
          <p className="mt-2">Certains de ces prestataires sont établis hors de l&apos;Union européenne, notamment aux États-Unis. Ces transferts sont encadrés par les garanties prévues par le RGPD : décision d&apos;adéquation de la Commission européenne pour les entreprises certifiées au cadre de protection des données UE-États-Unis, ou clauses contractuelles types de la Commission européenne.</p>
        </section>
        <section>
          <h2 className={SECTION_TITLE}>5. Cookies et mesure d&apos;audience</h2>
          <ul className={LIST}>
            <li><strong>Cookies essentiels</strong> : ta session de connexion. Ils sont nécessaires au fonctionnement du site.</li>
            <li><strong>Mesure d&apos;audience</strong> : Umami Cloud, sans cookie. On compte les pages vues et quelques actions (par exemple un clic sur un bouton d&apos;abonnement), sans y associer ton nom ni ton e-mail, et on ne lit que des statistiques globales.</li>
            <li><strong>Provenance de ta visite</strong> (réseau social, campagne) : gardée dans le stockage de session de ton navigateur, effacé à la fermeture de l&apos;onglet.</li>
          </ul>
          <p className="mt-2">Comme aucun cookie de mesure ni de publicité n&apos;est déposé, le site n&apos;affiche pas de bandeau cookies.</p>
          <p className="mt-2">Deux services tiers peuvent déposer leurs propres traceurs quand tu les utilises : Stripe sur sa page de paiement (sécurité du paiement), et YouTube (Google) quand tu lances une vidéo. Le lecteur YouTube n&apos;est chargé qu&apos;à ce moment-là, en mode de confidentialité renforcée (youtube-nocookie.com). Leurs politiques de confidentialité s&apos;appliquent alors.</p>
        </section>
        <section>
          <h2 className={SECTION_TITLE}>6. Durée de conservation</h2>
          {/* PROVISOIRE s16 (lot D), à relire par @legal : suppression en libre-service (lib/account.ts#deleteAccount). */}
          <p>Tes données sont conservées tant que ton compte existe. Tu peux supprimer ton compte toi-même, à tout moment, depuis ton profil (voir la partie 7) : ton compte, ta progression, tes favoris et ton inscription à la newsletter sont effacés tout de suite, et ton abonnement s&apos;arrête aussitôt.</p>
          {/* [À FIXER PAR THOMAS] durée de conservation des comptes inactifs (11 anciens comptes FREE compris) :
              aucune purge automatique n'existe ; texte neutre sans durée chiffrée en attendant (@legal point 11 c). */}
          <p className="mt-2">Un compte inactif n&apos;est pas supprimé automatiquement : il reste en place jusqu&apos;à ce que tu le supprimes depuis ton profil.</p>
          <p className="mt-2">Tes factures restent chez Stripe, notre prestataire de paiement, pendant 10 ans : la loi nous oblige à conserver les pièces comptables.</p>
          {/* [À FIXER PAR THOMAS] durée de conservation des demandes de rétractation (prescription, avis d'avocat,
              @legal point 11 a) : texte neutre sans durée chiffrée en attendant. */}
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
            <li><strong>Opposition et limitation</strong> : t&apos;opposer à un traitement fondé sur l&apos;intérêt légitime ou en demander la limitation</li>
          </ul>
          <p className="mt-2">
            Tu peux supprimer ton compte à tout moment depuis ton{" "}
            <Link href="/profil" className="underline underline-offset-2 hover:text-text-primary">profil</Link>
            {" "}: la suppression arrête aussi ton abonnement. Pour les autres droits, écris à contact@deviens-marrant.fr : on te répond sous un mois. Tu peux aussi adresser une réclamation à la CNIL (cnil.fr).
          </p>
        </section>
      </div>
    </div>
  );
}
