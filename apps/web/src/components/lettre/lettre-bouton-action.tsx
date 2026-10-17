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
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-display text-2xl font-bold text-text-primary">{titre}</h1>
      <p className="mt-2 text-text-secondary">{texte}</p>
      <form method="post" action={action} className="mt-6">
        <button type="submit" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}>
          {bouton}
        </button>
      </form>
    </div>
  );
}
