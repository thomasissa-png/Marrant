import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DailyContent } from "@/components/home/daily-content";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Hero section */}
        <section className="py-12 text-center md:py-20">
          <Badge variant="yellow" className="mb-4">
            Nouveau : coaching IA personnalisé
          </Badge>
          <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
            Deviens{" "}
            <span className="text-gradient">drôle</span>
            <br />
            pour de vrai.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary md:text-xl">
            Blagues, conseils de pros, vidéos stand-up et coaching IA — tout ce
            qu&apos;il faut pour maîtriser l&apos;humour et la répartie.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="primary" size="lg">
                Commencer gratuitement
              </Button>
            </Link>
            <Link href="/blagues">
              <Button variant="outline" size="lg">
                Voir les blagues
              </Button>
            </Link>
          </div>
        </section>

        {/* Contenu du jour (dynamique) */}
        <DailyContent />

        {/* Sections */}
        <section className="grid gap-6 py-12 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Blagues</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-text-secondary">
                Des centaines de blagues triées par catégorie. Révèle la chute
                d&apos;un clic.
              </p>
              <Link href="/blagues">
                <Button variant="ghost" size="sm">
                  Explorer →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conseils de pros</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-text-secondary">
                Timing, répartie, storytelling — progresse avec des conseils
                actionnables.
              </p>
              <Link href="/conseils">
                <Button variant="ghost" size="sm">
                  Progresser →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vidéos stand-up</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-text-secondary">
                Apprends des meilleurs avec des extraits annotés de stand-up
                français.
              </p>
              <Link href="/videos">
                <Button variant="ghost" size="sm">
                  Regarder →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}
