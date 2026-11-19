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
export function LigneMesQuestions({ className, nue = false }: { className?: string; nue?: boolean }) {
  // s26 tour 2 (Pr4, « Mon profil » ouvert seulement : `nue` n'est passé que par `ProfilOuvert`) : la ligne sans sa
  // carte, posée dans le cadre `p-6` du profil ; le lien garde sa cible de 44 px, mais ses marges négatives (`-my-3`)
  // l'empêchent de grandir la ligne : le texte part du haut du cadre (au tour 1, 30 px de vide au-dessus et au-dessous).
  const ligne = (
    // s26 finitions (relecture design tour 3, « Mon profil ») : texte courant en gris secondaire comme les autres cartes
    // de la colonne (`nue` : profil ouvert seulement) ; le lien garde sa couleur.
    <p className={cn("text-sm", nue ? "text-text-secondary" : "text-text-primary", nue && className)} data-testid={nue ? "profil-ligne-mes-questions" : undefined}>
      {frTypo(T.avant)}
      <Link
        href={`${ESPACE_ACCUEIL}/questions`}
        className={cn(
          nue ? "-my-3 inline-flex min-h-11 items-center" : "inline-flex min-h-11 items-center",
          "font-medium text-accent-link underline underline-offset-4 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
        )}
      >
        {T.lien}
      </Link>
      {T.apres}
    </p>
  );
  if (nue) return ligne;
  return (
    <Card className={cn(className)} data-testid="profil-ligne-mes-questions">
      <CardContent className="py-3">{ligne}</CardContent>
    </Card>
  );
}
