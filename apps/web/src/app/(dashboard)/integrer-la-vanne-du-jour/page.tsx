import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageShareMeta } from "@/lib/seo-meta";
import { frTypo } from "@/lib/fr-typo";
import { JsonLd, buildBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { BlocCode } from "@/components/widget/bloc-code";
import {
  PAGE_TITLE,
  PAGE_DESCRIPTION,
  TEXTE_CHAPEAU,
  TEXTE_OPTION_IFRAME,
  TEXTE_WORDPRESS,
  TEXTE_OPTION_SCRIPT,
  TEXTE_AFFICHAGE,
  TEXTE_LIGNE_BACKLINK,
} from "@/config/textes/widget-programme";
import {
  WIDGET_API_PATH,
  WIDGET_EMBED_PATH,
  WIDGET_IFRAME_HEIGHT,
  WIDGET_IFRAME_HEIGHT_CSS,
  WIDGET_IFRAME_SANDBOX,
  WIDGET_IFRAME_TITLE,
  WIDGET_ORIGIN,
  WIDGET_PROGRAMME_PATH,
  WIDGET_VANNE_DU_JOUR_PUBLIE,
  widgetIframeSnippet,
  widgetScriptSnippet,
} from "@/config/widget-vanne-du-jour";

// Stratégie de rendu : SSG (page marketing, aucun contenu par visiteur). L'aperçu
// est l'iframe réelle du widget, chargée à part (CSP de la page : frame-src 'self').
// Tant que WIDGET_VANNE_DU_JOUR_PUBLIE vaut false : 404 et absente du sitemap.

const PAGE_URL = `${WIDGET_ORIGIN}${WIDGET_PROGRAMME_PATH}`;
export const metadata: Metadata = {
  // Sans le suffixe « | deviens-marrant.fr » du layout : <title> de 54 caractères (60 au plus).
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: WIDGET_VANNE_DU_JOUR_PUBLIE ? undefined : { index: false, follow: false },
  ...pageShareMeta({ title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: PAGE_URL }),
};

/**
 * Paragraphe de @legal (docs/legal/widget-vanne-du-jour-s22.md, section 1), mot pour mot,
 * avec la demi-phrase du visa « ligne de backlink » du 24/10 et les retouches des visas « appli, bot,
 * newsletter » puis « corrections de la revue à l'aveugle » du 24/10 (deux dernières sections du même fichier).
 * Cette section (ancre #licence) porte toutes les règles, car c'est elle que cite le champ `license` de l'API.
 */
const CONDITIONS_UTILISATION =
  "La vanne du jour est gratuite : tu peux l'afficher sur ton site, dans une appli, un bot (Discord, Slack, Telegram…), une extension ou une newsletter, sans nous demander. Elle est fournie telle quelle, sans garantie de disponibilité, et elle peut évoluer. Le lien « Deviens Marrant » dans le cadre fait partie du widget : laisse-le en place et visible (la ligne sous le cadre, elle, est facultative). Si tu affiches la vanne sans le widget (avec l'API sur ton propre site, dans une appli, un bot, une newsletter…), mets le lien « Deviens Marrant » bien visible à côté. Ne modifie pas le texte de la vanne et ne la présente pas comme la tienne. Tu peux afficher la vanne même si ton site, ton appli, ton bot, ton extension ou ta newsletter a de la publicité. En revanche, tu ne peux ni revendre la vanne, ni la copier en masse, ni l'archiver, ni la reprendre dans un recueil ou une base de vannes, ni t'en servir pour entraîner une IA. Les messages de bot et les newsletters déjà envoyés peuvent rester où ils sont : ce qui est interdit, c'est de garder les vannes de côté pour les ressortir ou les rassembler. Si tu passes par l'API, tu peux garder la vanne en cache de ton côté (serveur ou navigateur) 24 h au plus. Le widget et l'API ne posent aucun cookie et ne suivent pas tes visiteurs. On peut changer ou arrêter le service, et te couper l'accès (contenu inapproprié là où tu affiches la vanne, abus), à tout moment.";

/** Ligne de licence de l'API (@legal s22, section 2, reprise par les visas du 24/10 : appli/bot/newsletter, puis revue à l'aveugle). */
const LICENCE_API =
  "Licence d'usage, en bref : tu peux afficher la vanne gratuitement, sans la modifier ni la présenter comme la tienne, sur un site, dans une appli, un bot, une extension ou une newsletter, avec le lien d'attribution « Deviens Marrant » bien visible à côté. Tu peux la garder en cache de ton côté (serveur ou navigateur) 24 h au plus. Tu ne peux pas l'archiver, la copier en masse, la revendre, la mettre dans un recueil ou une base de vannes, ni t'en servir pour entraîner une IA. Les messages de bot et les newsletters déjà envoyés peuvent rester où ils sont. Le service est fourni sans garantie, et on peut te couper l'accès.";

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: PAGE_URL,
  inLanguage: "fr-FR",
  isPartOf: { "@type": "WebSite", name: "Deviens Marrant", url: WIDGET_ORIGIN },
};

const H2 = "font-display mt-10 text-2xl font-bold";
/** Même style que les gabarits (revue @design B1) : rayon de la carte, schéma de couleurs déclaré. */
const IFRAME_STYLE = {
  border: 0,
  borderRadius: 12,
  colorScheme: "light dark",
  display: "block",
  width: "100%",
  maxWidth: 640,
  height: WIDGET_IFRAME_HEIGHT_CSS,
} as const;
const APERCUS = [
  // Bloc 4 : titres des aperçus.
  { theme: "clair", titre: "Sur fond clair", cadre: "bg-[#FAF7F2]" },
  { theme: "sombre", titre: "Sur fond sombre", cadre: "bg-background-light" },
] as const;
const P = "mt-3 text-text-secondary";
/** Champs de la réponse de l'API, dans l'ordre du texte R10. */
const CHAMPS_API = ["type", "date", "amorce", "chute", "url", "attribution", "license"] as const;
const CODE = "rounded bg-background-elevated px-1.5 py-0.5 text-sm text-text-primary";

export default function IntegrerLaVanneDuJourPage() {
  if (!WIDGET_VANNE_DU_JOUR_PUBLIE) notFound();

  return (
    <>
      <JsonLd data={webPageJsonLd} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: WIDGET_ORIGIN },
          { name: "Intégrer la vanne du jour", url: PAGE_URL },
        ])}
      />
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Fil d’Ariane" className="mb-4 text-sm text-text-muted">
          <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">Intégrer la vanne du jour</span>
        </nav>

        <h1 className="font-display text-3xl font-bold md:text-4xl">{PAGE_TITLE}</h1>
        <p className="mt-4 text-lg text-text-secondary">{frTypo(TEXTE_CHAPEAU)}</p>

        <h2 className={H2}>Aperçu</h2>
        {/* Revue @design M4 : deux aperçus réels, dans un cadre qui simule le site hôte.
            Le site lui-même n'est jamais compté (WIDGET_DOMAINES_NON_COMPTES). */}
        <div className="mt-4 grid gap-6">
          {APERCUS.map((a) => (
            <div key={a.theme}>
              <h3 className="text-base font-semibold text-text-primary">{a.titre}</h3>
              {/* Revue @design N5 : carte centrée dans son cadre. */}
              <div className={`mt-2 flex justify-center rounded-xl p-4 ${a.cadre}`}>
                <iframe
                  src={`${WIDGET_EMBED_PATH}?theme=${a.theme}`}
                  title={`${WIDGET_IFRAME_TITLE} (${a.titre.toLowerCase()})`}
                  /* Revue @design v3 (M1) : chargement immédiat, page de documentation à deux iframes légères. */
                  loading="eager"
                  width="100%"
                  height={WIDGET_IFRAME_HEIGHT}
                  style={IFRAME_STYLE}
                  sandbox={WIDGET_IFRAME_SANDBOX}
                />
              </div>
            </div>
          ))}
        </div>

        <h2 className={H2}>Le code à copier</h2>
        <p className={P}>{frTypo(TEXTE_OPTION_IFRAME)}</p>
        <BlocCode id="code-iframe" label="Iframe" code={widgetIframeSnippet()} />
        <p className={P}>{frTypo(TEXTE_WORDPRESS)}</p>
        <p className={`${P} mt-6`}>{frTypo(TEXTE_OPTION_SCRIPT)}</p>
        <BlocCode id="code-script" label="Script" code={widgetScriptSnippet()} />
        {/* s22 : ligne de backlink facultative (validée à l'aveugle). */}
        <p className={P}>{frTypo(TEXTE_LIGNE_BACKLINK)}</p>
        {/* Bloc 7 */}
        <p className={P}>
          {frTypo("Si ton site limite ce qu'il peut charger (une CSP), ajoute ")}
          <code className={`${CODE} [overflow-wrap:anywhere] min-[360px]:whitespace-nowrap`}>frame-src {WIDGET_ORIGIN}</code>
          {frTypo(" et, si tu as pris le script, ")}
          <code className={`${CODE} [overflow-wrap:anywhere] min-[360px]:whitespace-nowrap`}>script-src {WIDGET_ORIGIN}</code>
          {frTypo(". Sinon le navigateur bloquera la vanne. Tu ne sais pas ce qu'est une CSP ? Tu n'as sans doute rien à faire.")}
        </p>

        <h2 className={H2}>Thème</h2>
        {/* R8 */}
        <p className={P}>
          {frTypo("Rien à faire : le widget s'adapte au mode clair ou sombre de ton visiteur. Ton site garde toujours le même fond ? Impose le thème en ajoutant ")}
          <code className={CODE}>?theme=clair</code> ou <code className={CODE}>?theme=sombre</code>
          {frTypo(" à la fin de l'adresse qui suit src= dans le code de l'iframe, ou avec ")}
          <code className={CODE}>data-theme=&quot;clair&quot;</code> ou <code className={CODE}>data-theme=&quot;sombre&quot;</code>
          {frTypo(" sur le script.")}
        </p>
        <BlocCode id="code-theme-iframe" label="Iframe, fond sombre" code={widgetIframeSnippet(WIDGET_ORIGIN, "sombre")} />
        <BlocCode id="code-theme-script" label="Script, fond sombre" code={widgetScriptSnippet(WIDGET_ORIGIN, "sombre")} />

        <h2 className={H2}>Ce que le widget affiche</h2>
        <p className={P}>{frTypo(TEXTE_AFFICHAGE)}</p>

        <h2 className={H2}>Pour les développeurs</h2>
        {/* R10 */}
        <p className={P}>
          {frTypo("Tu préfères afficher la vanne avec ton propre code ? Une API en lecture seule renvoie la vanne du jour en JSON : ")}
          <code className={`${CODE} break-all`}>GET {WIDGET_ORIGIN}{WIDGET_API_PATH}</code>
          {frTypo(". Champs : ")}
          {CHAMPS_API.map((champ, i) => (
            <span key={champ}>
              <code className={CODE}>{champ}</code>
              {i < CHAMPS_API.length - 2 ? ", " : i === CHAMPS_API.length - 2 ? " et " : ""}
            </span>
          ))}
          {frTypo(". Les règles d'usage sont résumées juste en dessous, et détaillées dans les conditions d'utilisation.")}
        </p>
        <p className={P}>
          {frTypo("Toute la documentation est sur la page ")}
          <a href="/developers" hrefLang="en" className="text-accent-link underline hover:text-text-primary">
            {frTypo("Documentation de l'API (en anglais)")}
          </a>
          .
        </p>
        <p className={P}>{frTypo(LICENCE_API)}</p>

        <h2 id="licence" className={`${H2} scroll-mt-24`}>Conditions d’utilisation</h2>
        <p className={P}>{frTypo(CONDITIONS_UTILISATION)}</p>
      </div>
    </>
  );
}
