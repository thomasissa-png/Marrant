import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
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
    default: "deviensmarrant.fr | Apprends à être drôle",
    template: "%s | deviensmarrant.fr",
  },
  description:
    "La plateforme francophone pour progresser en humour et en répartie. Blagues, conseils de pros, vidéos stand-up et progression personnalisée.",
  keywords: [
    "devenir drôle",
    "apprendre l'humour",
    "progresser en répartie",
    "blague du jour",
    "stand-up français",
    "conseils humour",
    "cours humour en ligne",
    "apprendre le stand-up",
  ],
  authors: [{ name: "deviensmarrant.fr" }],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://deviensmarrant.fr",
    siteName: "deviensmarrant.fr",
    title: "deviensmarrant.fr | Apprends à être drôle",
    description:
      "La plateforme francophone pour progresser en humour et en répartie.",
  },
  twitter: {
    card: "summary_large_image",
    title: "deviensmarrant.fr | Apprends à être drôle",
    description:
      "La plateforme francophone pour progresser en humour et en répartie.",
  },
  robots: {
    index: true,
    follow: true,
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
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
