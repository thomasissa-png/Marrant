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
    default: "deviensmarrant.fr — Apprends à être drôle",
    template: "%s | deviensmarrant.fr",
  },
  description:
    "La plateforme francophone pour progresser en humour et en répartie. Blagues, conseils de pros, vidéos stand-up et coaching IA personnalisé.",
  keywords: [
    "devenir drôle",
    "apprendre l'humour",
    "progresser en répartie",
    "blague du jour",
    "stand-up français",
    "conseils humour",
  ],
  authors: [{ name: "deviensmarrant.fr" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://deviensmarrant.fr",
    siteName: "deviensmarrant.fr",
    title: "deviensmarrant.fr — Apprends à être drôle",
    description:
      "La plateforme francophone pour progresser en humour et en répartie.",
  },
  twitter: {
    card: "summary_large_image",
    title: "deviensmarrant.fr — Apprends à être drôle",
    description:
      "La plateforme francophone pour progresser en humour et en répartie.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${syne.variable}`}>
      <body className="min-h-screen bg-background font-sans text-text-primary antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
