import { TEXTES_FICHE as T, TEXTES_FICHE_LIGNE as L } from "@/config/textes/espace-bibliotheque";
import { TEXTES_CAPS } from "@/config/textes/espace-caps";
import type { FicheDeType } from "@/lib/espace/fiches";
import { Bloc } from "@/components/espace/fiche/corps-technique";

// Import 2 : retours à la ligne des textes à plusieurs paragraphes conservés (`\n` du lot).
const P = "whitespace-pre-line text-base text-text-primary";
const F = TEXTES_CAPS.fiche;
const minSec = (t: { minute: number; seconde: number }) => `${t.minute}:${String(t.seconde).padStart(2, "0")}`;

/** « Écouter, repérer » (étalon E4, mêmes sections que la fiche bonus d'un passage, maquette `bonus.html`). */
export function CorpsEcouter({ c }: { c: FicheDeType<"ecouter">["contenu"] }) {
  return (
    <>
      {c.avantDeLancer && (
        <Bloc id="f-avant" titre={F.avantDeLancer}>
          <p className={P}>{c.avantDeLancer}</p>
        </Bloc>
      )}
      <Bloc id="f-passage" titre={F.lePassage}>
        <p className={P}>
          {c.humoriste} :{" "}
          <a href={c.passage.url} className="text-accent-link underline underline-offset-2" rel="noopener noreferrer" target="_blank">
            {c.passage.titre}
          </a>
          , {c.passage.chaine}, {minSec(c.passage.debut)} à {minSec(c.passage.fin)}
        </p>
      </Bloc>
      <Bloc id="f-reperes" titre={F.reperes}>
        <ol className="list-decimal space-y-2 pl-5 text-base text-text-primary">
          {c.observations.map((o) => (
            <li key={o.titre}>
              <span className="font-semibold">{o.titre}</span> {o.texte}
            </li>
          ))}
        </ol>
      </Bloc>
      <Bloc id="f-mecanisme" titre={F.mecanisme}>
        <p className={P}>{c.mecanisme}</p>
      </Bloc>
      <Bloc id="f-chez-toi" titre={F.chezToi}>
        <p className={P}>{c.chezToi}</p>
      </Bloc>
      <Bloc id="f-citations" titre={F.citations}>
        <ul className="space-y-2 text-base text-text-primary">
          {c.citations.map((x) => (
            <li key={x.texte}>« {x.texte} »</li>
          ))}
        </ul>
      </Bloc>
    </>
  );
}

/**
 * « Jeux » (3.9) : consigne, matière, « Ce qu'on aurait pu dire » à ouvrir. Les lignes sont affichées
 * telles qu'écrites dans le lot (guillemets compris) : l'écran n'en ajoute aucun.
 */
export function CorpsJeu({ c }: { c: FicheDeType<"jeu">["contenu"] }) {
  return (
    <>
      <p className={P}>{c.consigne}</p>
      {c.matiere && (
        <ul className="list-disc space-y-1 pl-5 text-base text-text-primary">
          {c.matiere.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      )}
      <details className="space-y-2">
        <summary className="inline-flex min-h-11 cursor-pointer items-center text-base font-semibold text-text-primary">{T.ceQuOnAuraitPuDire}</summary>
        <ul className="space-y-1 text-base text-text-primary">
          {c.ceQuOnAuraitPuDire.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        {c.explication && <p className="whitespace-pre-line text-sm text-text-secondary">{c.explication}</p>}
      </details>
    </>
  );
}

/**
 * « Séance de 20 minutes » (3.11) : échauffement, observation, essai, bilan, chacun avec sa durée.
 * Import 2 (C6c) : « Pour qui, quand », « Il te faut » avant les étapes ; la grille du bilan en liste ;
 * « Tu produis », « Une version possible », « Renvois » après (ordre du lot).
 */
export function CorpsSeance({ c }: { c: FicheDeType<"seance">["contenu"] }) {
  const S = T.seance;
  const version = c.versionPossible.precision ? `${S.versionPossible} (${c.versionPossible.precision})` : S.versionPossible;
  return (
    <>
      <Bloc id="f-pour-qui" titre={S.pourQuiQuand}>
        <p className={P}>{c.pourQuiQuand}</p>
      </Bloc>
      <Bloc id="f-il-te-faut" titre={S.ilTeFaut}>
        <p className={P}>{c.ilTeFaut}</p>
      </Bloc>
      <ol className="space-y-4">
        {c.etapes.map((e) => (
          <li key={e.nom}>
            <Bloc id={`f-${e.nom}`} titre={`${T.etapesSeance[e.nom]} · ${L.minutes(e.minutes)}`}>
              <p className={P}>{e.consigne}</p>
              {e.grille && (
                <ol className="list-decimal space-y-1 pl-5 text-base text-text-primary" data-testid="seance-grille">
                  {e.grille.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ol>
              )}
            </Bloc>
          </li>
        ))}
      </ol>
      <Bloc id="f-tu-produis" titre={S.tuProduis}>
        <p className={P}>{c.tuProduis}</p>
      </Bloc>
      <Bloc id="f-version" titre={version}>
        <p className={P}>{c.versionPossible.texte}</p>
      </Bloc>
      <Bloc id="f-renvois" titre={S.renvois}>
        <p className={P}>{c.renvois}</p>
      </Bloc>
    </>
  );
}

/** Fiche « limite » du coin (étalon E6 §3) : le principe, ses blocs, « Si ça ne prend pas ». */
export function CorpsLimite({ c }: { c: Extract<FicheDeType<"humour-noir">["contenu"], { forme: "limite" }> }) {
  return (
    <>
      <Bloc id="f-principe" titre={T.principe}>
        <p className={P}>{c.principe}</p>
      </Bloc>
      {c.blocs.map((b, i) => (
        <Bloc key={b.titre} id={`f-bloc-${i}`} titre={b.titre}>
          <p className={P}>{b.texte}</p>
        </Bloc>
      ))}
      {c.siCaNePrendPas && (
        <Bloc id="f-plat" titre={T.siCaNePrendPas}>
          <p className={P}>{c.siCaNePrendPas}</p>
        </Bloc>
      )}
    </>
  );
}
