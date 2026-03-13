import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import Script from "next/script";
import { SessionProvider } from "@/components/providers/session-provider";
import {
  JsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/components/seo/json-ld";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "Comment devenir drôle et avoir de la répartie | deviens-marrant.fr",
    template: "%s | deviens-marrant.fr",
  },
  description:
    "Apprends à devenir drôle, à avoir de la répartie et à faire rire ton entourage. Blagues, techniques de répartie, conseils de pros, vidéos stand-up et parcours personnalisés. Que tu sois timide, en manque de conversation au bureau ou en reconstruction, progresse en humour à ton rythme.",
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
  manifest: "/manifest.json",
  metadataBase: new URL("https://deviens-marrant.fr"),
  alternates: {
    canonical: "https://deviens-marrant.fr",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://deviens-marrant.fr",
    siteName: "deviens-marrant.fr",
    title:
      "Comment devenir drôle et avoir de la répartie | deviens-marrant.fr",
    description:
      "La plateforme francophone pour apprendre à devenir drôle, avoir de la répartie et progresser en humour. Blagues, techniques de pro, vidéos stand-up analysées et parcours pas à pas.",
    images: [
      {
        url: "/og-image.png",
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
      "Apprends à devenir drôle, à avoir de la répartie et à faire rire. Blagues, techniques de pro et parcours personnalisés.",
    images: ["/og-image.png"],
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
  other: {
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
    <html lang="fr" className={`${inter.variable} ${syne.variable}`}>
      <head>
        <meta name="theme-color" content="#0D0D0D" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      </head>
      <body className="min-h-screen bg-background font-sans text-text-primary antialiased">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <SessionProvider>{children}</SessionProvider>
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
      </body>
    </html>
  );
}
