import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LettreBoutonActionProps {
  titre: string;
  texte: string;
  bouton: string;
  /** Route POST (jeton dans le chemin). */
  action: string;
}

/**
 * Page intermédiaire « un bouton, un POST » (@legal L5) : un scanner de liens qui
 * ouvre la page (GET) ne confirme ni ne désinscrit rien. Formulaire HTML natif :
 * fonctionne sans JavaScript.
 */
export function LettreBoutonAction({ titre, texte, bouton, action }: LettreBoutonActionProps) {
  return (
    // Même colonne et même titre que /lettre (revue design s21 tour 2, N2) ; le texte
    // garde sa longueur de ligne.
    <div className="mx-auto max-w-3xl py-10">
      <h1 className="text-balance font-display text-2xl font-bold text-text-primary sm:text-3xl">{titre}</h1>
      <p className="mt-2 max-w-lg text-text-secondary">{texte}</p>
      <form method="post" action={action} className="mt-6">
        <button type="submit" className={cn(buttonVariants({ variant: "outline-accent", size: "lg" }), "w-full sm:w-auto")}>
          {bouton}
        </button>
      </form>
    </div>
  );
}
