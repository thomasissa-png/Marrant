import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de deviens-marrant.fr : données collectées, finalités, base légale, prestataires, mesure d'audience sans cookie, durée de conservation et exercice de tes droits RGPD.",
};

/**
 * Audit parcours s16 (reco 18) : prestataires réels (plus Replit), mesure
 * d'audience Umami sans cookie (donc pas de bandeau, plus de « consentement
 * cookies » qui n'existait pas), suppression du compte depuis le profil,
 * tutoiement (D6). Identité de l'éditeur inchangée (D3, en attente de Thomas).
 */
const PRESTATAIRES: { nom: string; role: string }[] = [
  { nom: "Cloudflare", role: "hébergement et diffusion du site" },
  { nom: "Neon", role: "base de données (compte, progression, abonnement)" },
  { nom: "Stripe", role: "paiement et gestion de l'abonnement (tes données bancaires restent chez Stripe)" },
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
          </ul>
        </section>
        <section>
          <h2 className={SECTION_TITLE}>3. Pourquoi on les utilise, et sur quelle base</h2>
          <ul className={LIST}>
            <li>Gérer ton compte, ta connexion, ton abonnement et t&apos;envoyer les e-mails qui s&apos;y rapportent : exécution du contrat</li>
            <li>Facturation et rappel avant renouvellement de la formule annuelle : obligation légale</li>
            <li>Sécuriser le site (limitation des tentatives de connexion, prévention des abus) : intérêt légitime</li>
            <li>Mesurer l&apos;audience de façon agrégée pour améliorer le site : intérêt légitime, sans cookie (article 5)</li>
          </ul>
        </section>
        <section>
          <h2 className={SECTION_TITLE}>4. Prestataires (sous-traitants)</h2>
          <p>On confie certaines opérations techniques à des prestataires, qui traitent tes données uniquement pour notre compte :</p>
          <ul className={LIST}>
            {PRESTATAIRES.map((p) => (
              <li key={p.nom}>
                <strong>{p.nom}</strong> : {p.role}
              </li>
            ))}
          </ul>
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
          <p className="mt-2">Deux services tiers déposent leurs propres traceurs quand tu les utilises : Stripe sur sa page de paiement (sécurité du paiement), et YouTube (Google) quand tu lances une vidéo. Leurs politiques de confidentialité s&apos;appliquent alors.</p>
        </section>
        <section>
          <h2 className={SECTION_TITLE}>6. Durée de conservation</h2>
          <p>Tes données sont conservées tant que ton compte existe. Quand tu supprimes ton compte, elles sont effacées dans un délai de 30 jours, sauf celles qu&apos;une obligation légale nous impose de garder (par exemple les pièces comptables liées à tes paiements).</p>
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
            {" "}: la suppression arrête aussi ton abonnement. Pour les autres droits, écris à contact@deviens-marrant.fr. Tu peux aussi adresser une réclamation à la CNIL (cnil.fr).
          </p>
        </section>
      </div>
    </div>
  );
}
