import Link from "next/link";
import { TEXTES_FICHE } from "@/config/textes/espace-bibliotheque";
import type { FicheDeType } from "@/lib/espace/fiches";
import { LIEN } from "@/components/espace/carte/styles";
import { NBSP, FINE, frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_FICHE);

const H2 = "text-base font-semibold text-text-primary";
// Import 2 : retours à la ligne des textes à plusieurs paragraphes conservés (`\n` du lot).
const P = "whitespace-pre-line text-base text-text-primary";

export function Bloc({ id, titre, children }: { id: string; titre: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="space-y-2">
      <h2 id={id} className={H2}>
        {titre}
      </h2>
      {children}
    </section>
  );
}

/**
 * « Comment c'est construit » (étalon E2.1) : schéma, exemple, comment c'est fait, trois essais, règle, erreur.
 * Import 2 : forme « récit » (C1b fiche 7), exemple et essais affichés tels qu'écrits, guillemets compris.
 */
export function CorpsConstruction({ c }: { c: FicheDeType<"construction">["contenu"] }) {
  const cite = (t: string) => (c.forme === "recit" ? t : `«${FINE}${t}${FINE}»`);
  return (
    <>
      <Bloc id="f-schema" titre={T.schema}>
        <p className={P}>{c.schemaEnUneLigne}</p>
      </Bloc>
      <Bloc id="f-exemple" titre={T.exemple}>
        <p className={P}>{cite(c.exemple)}</p>
      </Bloc>
      <Bloc id="f-fait" titre={T.commentCestFait}>
        <ul className="list-disc space-y-1 pl-5 text-base text-text-primary">
          {c.commentCestFait.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Bloc>
      <Bloc id="f-essais" titre={T.essais}>
        <ol className="list-decimal space-y-2 pl-5 text-base text-text-primary">
          {c.essais.map((e, i) => (
            <li key={i}>
              {e.texte !== null && <span>{cite(e.texte)} </span>}
              <span className="text-text-secondary">{e.verdict}</span>
            </li>
          ))}
        </ol>
      </Bloc>
      <Bloc id="f-regle" titre={T.regle}>
        <p className={P}>{c.regle}</p>
      </Bloc>
      <Bloc id="f-erreur" titre={T.erreur}>
        <p className={P}>{c.erreur}</p>
      </Bloc>
    </>
  );
}

/** « Formules à détourner » (étalon E2.2) : la règle, deux déjà faites, trois à toi d'abord, piège, limite. */
export function CorpsFormule({ c }: { c: FicheDeType<"formule">["contenu"] }) {
  const faites = c.detournements.slice(0, 2);
  const aToi = c.detournements.slice(2);
  return (
    <>
      <Bloc id="f-regle" titre={T.regle}>
        <p className={P}>{c.regle}</p>
      </Bloc>
      <Bloc id="f-faites" titre={T.dejaFaites}>
        {faites.map((d) => (
          <p key={d.expression} className={P}>
            «{FINE}{d.expression}{FINE}»{NBSP}<span aria-hidden="true">→</span> «{FINE}{d.detournement}{FINE}»
          </p>
        ))}
      </Bloc>
      <Bloc id="f-a-toi" titre={T.aToiDabord}>
        <ol className="list-decimal space-y-3 pl-5 text-base text-text-primary">
          {aToi.map((d) => (
            <li key={d.expression} className="space-y-1">
              <p>«{FINE}{d.expression}{FINE}»</p>
              <details>
                <summary className="inline-flex min-h-11 cursor-pointer items-center text-sm text-accent-link underline underline-offset-2">{T.versionPossible}</summary>
                <p className="text-base text-text-primary">«{FINE}{d.detournement}{FINE}»</p>
              </details>
            </li>
          ))}
        </ol>
      </Bloc>
      <Bloc id="f-piege" titre={T.piege}>
        <p className={P}>{c.piege}</p>
      </Bloc>
      <Bloc id="f-limite" titre={T.limite}>
        <p className={P}>{c.limite}</p>
      </Bloc>
      {c.contreExemple && (
        <Bloc id="f-contre" titre={T.suiteSansDetour}>
          <p className={P}>«{FINE}{c.contreExemple.texte}{FINE}»</p>
          <p className="text-sm text-text-secondary">{c.contreExemple.pourquoi}</p>
        </Bloc>
      )}
    </>
  );
}

/**
 * « Vocabulaire » (étalon E3) : cinq mots, en clair, en deux temps, à ne pas confondre, définition complète.
 * Import 2 : « Définition complète » seulement pour un mot qui a sa page (les mots neufs n'en ont pas).
 */
export function CorpsVocabulaire({ c }: { c: FicheDeType<"vocabulaire">["contenu"] }) {
  return (
    <>
      <p className={P}>{c.theme}</p>
      {c.mots.map((m, i) => (
        <Bloc key={m.mot} id={`f-mot-${i}`} titre={m.mot}>
          <p className={P}>{m.enClair}</p>
          <p className="text-sm text-text-primary">
            {m.libelleEnDeuxTemps ? `${m.libelleEnDeuxTemps} ` : T.enDeuxTemps}
            {m.exempleEnDeuxTemps}
          </p>
          <p className="text-sm text-text-secondary">
            {T.aNePasConfondre}
            {m.aNePasConfondreAvec}
          </p>
          {m.definitionComplete && (
            <Link href={m.definitionComplete} className={LIEN}>
              {T.definitionComplete}
            </Link>
          )}
        </Bloc>
      ))}
    </>
  );
}
