import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyContent } from "@/components/home/daily-content";
import { HeroSection } from "@/components/home/hero-section";
import { PremiumCta } from "@/components/home/premium-cta";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero section */}
      <HeroSection />

      {/* Contenu du jour (dynamique) */}
      <DailyContent />

      {/* Sections principales */}
      <section className="grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Blagues à ressortir</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-text-secondary">
              Des centaines de blagues par catégorie — parfaites à sortir entre
              potes, en soirée ou à la machine à café.
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
            <CardTitle>Conseils &amp; répartie</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-text-secondary">
              Timing, répartie, storytelling — des techniques concrètes avec
              exemples et exercices pour gagner en aisance.
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
              Analyse les techniques des meilleurs humoristes français pour
              comprendre ce qui fait rire.
            </p>
            <Link href="/videos">
              <Button variant="ghost" size="sm">
                Regarder →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parcours guidés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-text-secondary">
              Des programmes pas à pas pour progresser de zéro à l&apos;aise — idéal
              pour ceux qui veulent un cadre structuré.
            </p>
            <Link href="/parcours">
              <Button variant="ghost" size="sm">
                Commencer →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Pourquoi deviensmarrant ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="font-semibold text-accent-primary">Pour les timides</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Tu manques de répartie ? On t&apos;apprend à rebondir avec des
                  techniques simples et des exercices concrets.
                </p>
              </div>
              <div>
                <p className="font-semibold text-accent-primary">Au quotidien</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Pause café, afterwork, dîner — apprends des blagues et
                  anecdotes qui marchent à tous les coups.
                </p>
              </div>
              <div>
                <p className="font-semibold text-accent-primary">Pour progresser</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Tu veux devenir vraiment drôle ? Suis un parcours structuré
                  et mesure ta progression avec les XP.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Premium / Freemium */}
      <PremiumCta />
    </>
  );
}
