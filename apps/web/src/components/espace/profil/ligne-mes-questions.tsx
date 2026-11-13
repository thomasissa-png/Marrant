import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ESPACE_ACCUEIL } from "@/config/espace-client";
import { PROFIL_LIGNE_QUESTIONS as T } from "@/config/textes/espace-textes-en-ligne";
import { frTypo } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";

/**
 * « Mon profil », espace ouvert (s24, lot D10 ; plan §6 T8) : l'encadré « Ta question à l'équipe »
 * devient une ligne de lien vers « Mes questions » (lot D10b : « écris-la dans », relecture @elon ; la phrase de l'e-mail E0 « écris-nous depuis ton
 * profil » reste vraie). Cible de 44 px, focus visible. Fermé : jamais rendue (l'encadré s22 reste).
 */
export function LigneMesQuestions({ className }: { className?: string }) {
  return (
    <Card className={cn(className)} data-testid="profil-ligne-mes-questions">
      <CardContent className="py-3">
        <p className="text-sm text-text-primary">
          {frTypo(T.avant)}
          <Link
            href={`${ESPACE_ACCUEIL}/questions`}
            className="inline-flex min-h-11 items-center font-medium text-accent-link underline underline-offset-4 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          >
            {T.lien}
          </Link>
          {T.apres}
        </p>
      </CardContent>
    </Card>
  );
}
