import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageShareMeta } from "@/lib/seo-meta";
import { frTypo } from "@/lib/fr-typo";
import { JsonLd, buildBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { BlocCode } from "@/components/widget/bloc-code";
import {
  WIDGET_API_PATH,
  WIDGET_EMBED_PATH,
  WIDGET_IFRAME_HEIGHT,
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
// BROUILLON s22 : title, description, H1 et textes de la page (étalons Thomas, puis @copywriter).
const PAGE_TITLE = "Intègre la vanne du jour sur ton site";
const PAGE_DESCRIPTION =
  "La vanne du jour sur ton site, gratuitement : un widget à coller en une ligne, sans cookie et sans pub. Une nouvelle vanne chaque jour.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: WIDGET_VANNE_DU_JOUR_PUBLIE ? undefined : { index: false, follow: false },
  ...pageShareMeta({ title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: PAGE_URL }),
};

/** Paragraphe de @legal (docs/legal/widget-vanne-du-jour-s22.md, section 1), mot pour mot. */
const CONDITIONS_UTILISATION =
  "La vanne du jour est gratuite : tu peux l'installer sur ton site sans nous demander. Elle est fournie telle quelle, sans garantie de disponibilité, et elle peut évoluer. Le lien « Deviens Marrant » fait partie du widget : laisse-le en place et visible. Ne modifie pas le texte de la vanne et ne la présente pas comme la tienne. Tu peux l'afficher sur un site qui a de la publicité, mais pas la revendre, ni la copier en masse, ni la reprendre dans un recueil ou un autre produit. Le widget ne pose aucun cookie et ne suit pas tes visiteurs. On peut changer ou arrêter le service, et couper l'accès à un site (contenu inapproprié, abus), à tout moment.";

/** Ligne de licence de l'API (@legal s22, section 2), mot pour mot. */
const LICENCE_API =
  "Licence d'usage : affichage gratuit et non modifié de la vanne avec le lien d'attribution « Deviens Marrant » visible ; cache côté client 24 h maximum ; interdit d'archiver, republier en masse, revendre ou entraîner un modèle avec ces textes ; service fourni sans garantie, accès révocable.";

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
const IFRAME_STYLE = { border: 0, borderRadius: 12, colorScheme: "light dark", display: "block", width: "100%", maxWidth: 640 } as const;
const APERCUS = [
  // BROUILLON s22 : titres des aperçus.
  { theme: "clair", titre: "Sur fond clair", cadre: "bg-[#FAF7F2]" },
  { theme: "sombre", titre: "Sur fond sombre", cadre: "bg-background-light" },
] as const;
const P = "mt-3 text-text-secondary";
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
        {/* BROUILLON s22 */}
        <p className="mt-4 text-lg text-text-secondary">
          {frTypo(
            "La vanne du jour, c'est un widget gratuit : chaque jour, une nouvelle vanne s'affiche sur ton site. Tu colles une ligne de code, on s'occupe du reste.",
          )}
        </p>

        <h2 className={H2}>Aperçu</h2>
        {/* Revue @design M4 : deux aperçus réels, dans un cadre qui simule le site hôte.
            Le site lui-même n'est jamais compté (WIDGET_DOMAINES_NON_COMPTES). */}
        <div className="mt-4 grid gap-6">
          {APERCUS.map((a) => (
            <div key={a.theme}>
              {/* BROUILLON s22 */}
              <h3 className="text-base font-semibold text-text-primary">{a.titre}</h3>
              <div className={`mt-2 rounded-xl p-4 ${a.cadre}`}>
                <iframe
                  src={`${WIDGET_EMBED_PATH}?theme=${a.theme}`}
                  title={`${WIDGET_IFRAME_TITLE} (${a.titre.toLowerCase()})`}
                  loading="lazy"
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
        {/* BROUILLON s22 */}
        <p className={P}>
          {frTypo(
            `Option 1 : l'iframe. Rien ne s'exécute sur ton site. Sa hauteur est fixe (${WIDGET_IFRAME_HEIGHT} px), prévue pour la vanne la plus longue.`,
          )}
        </p>
        <BlocCode id="code-iframe" label="Iframe" code={widgetIframeSnippet()} />
        {/* BROUILLON s22 */}
        <p className={`${P} mt-6`}>
          {frTypo(
            "Option 2 : le script. Il crée la même iframe à l'endroit où tu le colles, et l'agrandit si la chute en a besoin.",
          )}
        </p>
        <BlocCode id="code-script" label="Script" code={widgetScriptSnippet()} />
        {/* BROUILLON s22 */}
        <p className={P}>
          {frTypo("Ton site a une politique de sécurité (CSP) ? Ajoute ")}
          <code className={CODE}>frame-src {WIDGET_ORIGIN}</code>
          {frTypo(", et pour l'option 2 ")}
          <code className={CODE}>script-src {WIDGET_ORIGIN}</code>.
        </p>

        <h2 className={H2}>Thème</h2>
        {/* BROUILLON s22 */}
        <p className={P}>
          {frTypo("Par défaut, le widget suit le mode clair ou sombre de ton visiteur. Pour le fixer, ajoute ")}
          <code className={CODE}>?theme=clair</code> ou <code className={CODE}>?theme=sombre</code>
          {frTypo(" à l'adresse de l'iframe, ou ")}
          <code className={CODE}>data-theme=&quot;sombre&quot;</code>
          {frTypo(" sur le script.")}
        </p>
        <BlocCode id="code-theme-iframe" label="Iframe, fond sombre" code={widgetIframeSnippet(WIDGET_ORIGIN, "sombre")} />
        <BlocCode id="code-theme-script" label="Script, fond sombre" code={widgetScriptSnippet(WIDGET_ORIGIN, "sombre")} />

        <h2 className={H2}>Ce que le widget affiche</h2>
        {/* BROUILLON s22 */}
        <p className={P}>
          {frTypo(
            "Une vanne par jour, la même sur tous les sites : l'amorce, un bouton pour révéler la chute, un lien pour comprendre pourquoi elle marche, et notre nom. Pas de pub, pas de cookie.",
          )}
        </p>

        <h2 className={H2}>Pour les développeurs</h2>
        {/* BROUILLON s22 */}
        <p className={P}>
          {frTypo("Une API en lecture seule renvoie la vanne du jour en JSON : ")}
          <code className={`${CODE} break-all`}>GET {WIDGET_ORIGIN}{WIDGET_API_PATH}</code>
          {frTypo(". Champs : type, date, amorce, chute, url, attribution, license.")}
        </p>
        <p className={P}>{frTypo(LICENCE_API)}</p>

        <h2 id="licence" className={`${H2} scroll-mt-24`}>Conditions d’utilisation</h2>
        <p className={P}>{frTypo(CONDITIONS_UTILISATION)}</p>
      </div>
    </>
  );
}
