import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { websiteOpenGraph, websiteTwitter } from "@/lib/seo-meta";
import { JsonLd } from "@/components/seo/json-ld";
import {
  PAGE_TITLE,
  PAGE_DESCRIPTION,
  H1,
  H2_ENDPOINT,
  H2_EXEMPLE,
  H2_CHAMPS,
  H2_CORS_CACHE,
  H2_LIMITE,
  H2_ERREURS,
  H2_VIE_PRIVEE,
  H2_LICENCE,
  H2_WIDGET,
  TEXTE_INTRO,
  TEXTE_ENDPOINT,
  TEXTE_EXEMPLE,
  EXEMPLE_REPONSE,
  CHAMPS,
  TEXTE_CORS_CACHE,
  TEXTE_LIMITE,
  ERREURS,
  TEXTE_VIE_PRIVEE,
  TEXTE_LICENCE_USAGE,
  TEXTE_LICENCE_CONDITIONS,
  TEXTE_LICENCE_FOI,
  TEXTE_WIDGET,
} from "@/config/textes/developers";
import {
  DEVELOPERS_PATH,
  WIDGET_API_PATH,
  WIDGET_LICENCE_URL,
  WIDGET_ORIGIN,
  WIDGET_PROGRAMME_PATH,
  WIDGET_VANNE_DU_JOUR_PUBLIE,
} from "@/config/widget-vanne-du-jour";

// Stratégie de rendu : SSG (documentation statique, aucun contenu par visiteur).
// Page en anglais (annuaires d'API publiques) : textes de config/textes/developers.ts
// posés tels quels, SANS frTypo (pas de typographie française sur de l'anglais).
// Même interrupteur que le programme : widget fermé = 404 et absente du sitemap.

const PAGE_URL = `${WIDGET_ORIGIN}${DEVELOPERS_PATH}`;
const API_URL = `${WIDGET_ORIGIN}${WIDGET_API_PATH}`;
const SHARE = { title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: PAGE_URL };

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  // Relatif (metadataBase du layout) : les liens d'annuaire (?ref=...) pointent tous vers l'URL nue.
  alternates: { canonical: DEVELOPERS_PATH },
  robots: WIDGET_VANNE_DU_JOUR_PUBLIE ? undefined : { index: false, follow: false },
  openGraph: { ...websiteOpenGraph(SHARE), locale: "en_US" },
  twitter: websiteTwitter({ title: PAGE_TITLE, description: PAGE_DESCRIPTION }),
};

const PROVIDER = { "@type": "Organization", name: "Deviens Marrant", url: WIDGET_ORIGIN };
const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: PAGE_URL,
  inLanguage: "en",
  isPartOf: { "@type": "WebSite", name: "Deviens Marrant", url: WIDGET_ORIGIN },
};
const webApiJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebAPI",
  name: H1,
  description: PAGE_DESCRIPTION,
  documentation: PAGE_URL,
  termsOfService: WIDGET_LICENCE_URL,
  isAccessibleForFree: true,
  provider: PROVIDER,
};

const EXEMPLE_JSON = JSON.stringify(JSON.parse(EXEMPLE_REPONSE), null, 2);
// -i : le dev voit tout de suite les en-têtes CORS et cache documentés.
const EXEMPLE_CURL = `curl -i ${API_URL}`;
// await de premier niveau : valide seulement dans un <script type="module"> (dit en commentaire).
const EXEMPLE_FETCH = [
  '// <div id="joke"></div> then, in a <script type="module">:',
  `const res = await fetch("${API_URL}");`,
  "if (res.ok) {",
  "  const joke = await res.json();",
  '  const link = document.createElement("a");',
  "  link.href = joke.attribution.url;",
  "  link.textContent = joke.attribution.name;",
  '  document.getElementById("joke").append(joke.amorce, " ", joke.chute, " ", link);',
  "}",
].join("\n");

const URL_FOI = TEXTE_LICENCE_FOI.slice(TEXTE_LICENCE_FOI.indexOf("https://"));
const AVANT_URL_FOI = TEXTE_LICENCE_FOI.slice(0, TEXTE_LICENCE_FOI.length - URL_FOI.length);
const [AVANT_LIEN_WIDGET, APRES_LIEN_WIDGET] = TEXTE_WIDGET.split(WIDGET_PROGRAMME_PATH);

const H2 = "font-display mt-10 text-2xl font-bold";
const P = "mt-3 text-text-secondary";
const CODE = "rounded bg-background-elevated px-1.5 py-0.5 text-sm text-text-primary [overflow-wrap:anywhere]";
const PRE =
  "mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-background-card p-4 [overflow-wrap:anywhere] text-sm leading-6 text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary";
const LIEN = "text-accent-link underline hover:text-text-primary";

function Bloc({ label, code }: { label: string; code: string }) {
  return (
    <pre tabIndex={0} aria-label={label} className={PRE}>
      <code>{code}</code>
    </pre>
  );
}

export default function DevelopersPage() {
  if (!WIDGET_VANNE_DU_JOUR_PUBLIE) notFound();

  return (
    <>
      <JsonLd data={webPageJsonLd} />
      <JsonLd data={webApiJsonLd} />
      <div lang="en" className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold md:text-4xl">{H1}</h1>
        <p className="mt-4 text-lg text-text-secondary">{TEXTE_INTRO}</p>

        <h2 className={H2}>{H2_ENDPOINT}</h2>
        <p className={P}>{TEXTE_ENDPOINT}</p>
        <Bloc label="Endpoint" code={`GET ${API_URL}`} />
        <Bloc label="curl" code={EXEMPLE_CURL} />
        <Bloc label="JavaScript" code={EXEMPLE_FETCH} />

        <h2 className={H2}>{H2_EXEMPLE}</h2>
        <p className={P}>{TEXTE_EXEMPLE}</p>
        <Bloc label="JSON" code={EXEMPLE_JSON} />

        <h2 className={H2}>{H2_CHAMPS}</h2>
        <dl className="mt-3 space-y-3">
          {CHAMPS.map((champ) => (
            <div key={champ.nom}>
              <dt>
                <code className={CODE}>{champ.nom}</code>
              </dt>
              <dd className="mt-1 text-text-secondary">{champ.description}</dd>
            </div>
          ))}
        </dl>

        <h2 className={H2}>{H2_CORS_CACHE}</h2>
        <p className={P}>{TEXTE_CORS_CACHE}</p>

        <h2 className={H2}>{H2_LIMITE}</h2>
        <p className={P}>{TEXTE_LIMITE}</p>

        <h2 className={H2}>{H2_ERREURS}</h2>
        <dl className="mt-3 space-y-3">
          {ERREURS.map((erreur) => (
            <div key={erreur.code}>
              <dt>
                <code className={CODE}>{erreur.code}</code>
              </dt>
              <dd className="mt-1 text-text-secondary [overflow-wrap:anywhere]">{erreur.description}</dd>
            </div>
          ))}
        </dl>

        <h2 className={H2}>{H2_VIE_PRIVEE}</h2>
        <p className={P}>{TEXTE_VIE_PRIVEE}</p>

        <h2 id="license" className={`${H2} scroll-mt-24`}>{H2_LICENCE}</h2>
        <p className={P}>{TEXTE_LICENCE_USAGE}</p>
        <p className={P}>{TEXTE_LICENCE_CONDITIONS}</p>
        <p className={P}>
          {AVANT_URL_FOI}
          <a href={URL_FOI} hrefLang="fr" className={`${LIEN} [overflow-wrap:anywhere]`}>
            {URL_FOI}
          </a>
        </p>

        <h2 className={H2}>{H2_WIDGET}</h2>
        <p className={P}>
          {AVANT_LIEN_WIDGET}
          <Link href={WIDGET_PROGRAMME_PATH} hrefLang="fr" className={`${LIEN} [overflow-wrap:anywhere]`}>
            {WIDGET_PROGRAMME_PATH}
          </Link>
          {APRES_LIEN_WIDGET}
        </p>
      </div>
    </>
  );
}
