import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="text-8xl" role="img" aria-label="confused face">
        🤔
      </span>
      <h1 className="mt-6 font-display text-4xl font-bold md:text-5xl">
        Oups, cette page a oublié sa{" "}
        <span className="text-gradient">punchline</span>
      </h1>
      <p className="mt-4 max-w-md text-lg text-text-secondary">
        On dirait que cette page n&apos;existe pas... Un peu comme mes talents de danse.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button variant="primary" size="lg">
            Retour à l&apos;accueil
          </Button>
        </Link>
        <Link href="/blagues">
          <Button variant="outline" size="lg">
            Voir les blagues
          </Button>
        </Link>
      </div>
    </main>
  );
}
