import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { VANNES_THEMES, vannesThemePath } from "@/lib/vannes-themes";

/**
 * Liens vers les pages thème (lot S3b s14), rendus côté serveur : crawlables et
 * accessibles sans compte (les filtres de la liste client sont réservés aux
 * abonnés). Même apparence que les boutons de filtre de VannesList.
 */
export function VannesThemeNav({ current, className = "mb-6" }: { current?: string; className?: string }) {
  return (
    <nav aria-label="Vannes par thème" className={className}>
      <ul className="flex flex-wrap gap-2">
        {VANNES_THEMES.map((theme) => {
          const isCurrent = theme.slug === current;
          return (
            <li key={theme.slug}>
              <Link
                href={vannesThemePath(theme.slug)}
                aria-current={isCurrent ? "page" : undefined}
                className={buttonVariants({ variant: isCurrent ? "primary" : "ghost", size: "sm" })}
              >
                {theme.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
