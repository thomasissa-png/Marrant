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
      <section className="grid gap-6 py-12 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Blagues prêtes à sortir</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-text-secondary">
              Plus de 500 blagues classées par catégorie — école, boulot, couple,
              soirées. Tu trouveras toujours la bonne blague au bon moment.
            </p>
            <Link href="/blagues">
              <Button variant="ghost" size="sm">
                Explorer les blagues →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Techniques de répartie</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-text-secondary">
              Timing, répartie, storytelling — chaque conseil vient avec un
              exemple concret et un exercice à tester dans la journée.
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
            <CardTitle>Vidéos stand-up analysées</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-text-secondary">
              Comprends ce qui fait rire chez les meilleurs humoristes français.
              Chaque vidéo est décryptée avec la technique utilisée.
            </p>
            <Link href="/videos">
              <Button variant="ghost" size="sm">
                Regarder →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Section "Tu te reconnais ?" — les 3 personas */}
      <section className="py-12">
        <h2 className="font-display mb-8 text-center text-3xl font-bold md:text-4xl">
          Tu te reconnais ?
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Yanis */}
          <div className="rounded-xl border border-border bg-background-card p-6">
            <p className="text-2xl">🎒</p>
            <h3 className="mt-3 text-lg font-bold text-text-primary">
              &quot;Je reste muet quand on me chambre&quot;
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Tu as 16-20 ans et tu aimerais avoir de la répartie avec tes potes
              sans rester planté là ? On t&apos;apprend les bases avec des
              exercices simples et encourageants. Zéro pression, 100% progression.
            </p>
            <Link href="/conseils" className="mt-4 inline-block text-sm font-medium text-accent-primary hover:underline">
              Commencer à progresser →
            </Link>
          </div>

          {/* Sophie */}
          <div className="rounded-xl border border-border bg-background-card p-6">
            <p className="text-2xl">☕</p>
            <h3 className="mt-3 text-lg font-bold text-text-primary">
              &quot;Je n&apos;ai jamais rien de drôle à dire&quot;
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Pause café, afterwork, dîner entre amis — tu voudrais avoir la
              blague qui fait mouche au bon moment ? On te donne des blagues
              courtes et mémorisables, et le timing pour les placer.
            </p>
            <Link href="/blagues" className="mt-4 inline-block text-sm font-medium text-accent-primary hover:underline">
              Découvrir les blagues →
            </Link>
          </div>

          {/* Marc */}
          <div className="rounded-xl border border-border bg-background-card p-6">
            <p className="text-2xl">🔄</p>
            <h3 className="mt-3 text-lg font-bold text-text-primary">
              &quot;J&apos;ai perdu ma légèreté&quot;
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Après une période difficile, tu veux retrouver ton humour et ta
              confiance dans tes interactions ? Blagues, techniques de
              storytelling et auto-dérision — progresse à ton rythme,
              sans pression.
            </p>
            <Link href="/register" className="mt-4 inline-block text-sm font-medium text-accent-primary hover:underline">
              Rejoindre pour 0,99 €/mois →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Offres */}
      <PremiumCta />
    </>
  );
}
