import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyContent } from "@/components/home/daily-content";
import { HeroSection } from "@/components/home/hero-section";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero section */}
      <HeroSection />

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
    </>
  );
}
