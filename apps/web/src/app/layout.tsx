import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { SessionProvider } from "@/components/providers/session-provider";
import {
  JsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/components/seo/json-ld";
import { WebVitalsReporter } from "@/components/seo/web-vitals-reporter";
import { AuthReturnTracker } from "@/components/auth/auth-return-tracker";
import { AttributionCapture } from "@/components/analytics/attribution-capture";
import { BLOG_PREVIEW_PATH } from "@/config/blog-preview";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default:
      "Devenir drôle et avoir de la répartie | deviens-marrant.fr",
    template: "%s | deviens-marrant.fr",
  },
  description:
    "La plateforme pour devenir drôle et avoir de la répartie : des vannes à ressortir, des techniques de pro et des parcours pas à pas pour faire rire tes potes.",
  keywords: [
    "devenir drôle",
    "comment devenir drôle",
    "apprendre à être drôle",
    "devenir marrant",
    "comment devenir marrant",
    "avoir de la répartie",
    "comment avoir de la répartie",
    "devenir plus drôle",
    "comment faire rire",
    "être drôle en société",
    "développer son humour",
    "techniques de répartie",
    "vanne du jour",
    "blague du jour",
    "stand-up français",
    "conseils humour",
    "cours humour en ligne",
    "exercices humour débutant",
    "avoir de la conversation",
    "être drôle à la machine à café",
    "retrouver confiance en soi",
  ],
  authors: [{ name: "deviens-marrant.fr" }],
  // Icons + manifest auto-détectés par Next.js 14 via convention app-router :
  //   app/favicon.ico, app/icon.png, app/icon1.png, app/icon2.png,
  //   app/apple-icon.png, app/manifest.ts (route handler /manifest.webmanifest).
  // Pas de balises manuelles — Next.js génère <link rel="icon">, <link rel="apple-touch-icon">,
  // <link rel="manifest"> automatiquement (cf docs/marrant/playbook.md G31 favicon).
  metadataBase: new URL("https://deviens-marrant.fr"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://deviens-marrant.fr",
    siteName: "deviens-marrant.fr",
    title:
      "Comment devenir drôle et avoir de la répartie | deviens-marrant.fr",
    description:
      "La plateforme francophone pour devenir drôle et avoir de la répartie, avec des vannes, des techniques de pro, du stand-up décortiqué et des parcours.",
    // /opengraph-image est généré dynamiquement par Next.js (opengraph-image.tsx).
    // On l'utilise partout pour éviter le 404 sur /og-image.png qui n'existe pas en prod.
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "deviens-marrant.fr — Apprends à devenir drôle et à avoir de la répartie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Comment devenir drôle et avoir de la répartie | deviens-marrant.fr",
    description:
      "Apprends à devenir drôle et à avoir de la répartie : des vannes à ressortir, des techniques de pro et des parcours pas à pas pour faire rire ton entourage.",
    // Aligné sur l'image OG dynamique — /og-image.png retournait 404 en prod.
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Vérifications propriétaire moteurs de recherche — uniquement rendues
  // si la variable d'environnement correspondante est définie (jamais de
  // valeur inventée : sinon le tag est absent).
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {}),
  },
  other: {
    "bingbot": "index, follow, max-image-preview:large, max-snippet:-1",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <meta name="theme-color" content="#0D0D0D" />
      </head>
      <body className="min-h-screen bg-background font-sans text-text-primary antialiased">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <SessionProvider>{children}</SessionProvider>
        <WebVitalsReporter />
        <AttributionCapture />
        <AuthReturnTracker />
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <>
            {/* Filtre Umami (data-before-send) : rien ne part sous l'aperçu admin
                /blog/apercu (vues et événements). Défini avant le tracker. */}
            <script
              dangerouslySetInnerHTML={{
                __html: `window.marrantUmamiBeforeSend=function(t,p){var a=${JSON.stringify(BLOG_PREVIEW_PATH)},l=location.pathname;return l===a||l.indexOf(a+"/")===0?false:p};`,
              }}
            />
            <Script
              defer
              src="https://cloud.umami.is/script.js"
              data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
              data-before-send="marrantUmamiBeforeSend"
            />
          </>
        )}
      </body>
    </html>
  );
}
