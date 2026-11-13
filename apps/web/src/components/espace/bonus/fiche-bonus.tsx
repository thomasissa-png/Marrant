import { TEXTES_CAPS as T } from "@/config/textes/espace-caps";
import type { FicheBonus } from "@/lib/espace/fiches-schema";
import type { NumeroCap } from "@/lib/espace/caps";
import { GrilleOuiNon } from "@/components/espace/bonus/grille-oui-non";

const SECTION = "space-y-2";
const TITRE = "text-base font-semibold text-text-primary";
const CORPS = "text-sm leading-6 text-text-secondary";

const minSec = (t: { minute: number; seconde: number }) => `${t.minute}:${String(t.seconde).padStart(2, "0")}`;

function Section({ id, titre, children }: { id: string; titre: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className={SECTION}>
      <h2 id={id} className={TITRE}>
        {titre}
      </h2>
      {children}
    </section>
  );
}

/**
 * Fiche d'un bonus ouvert (s24, lot D4 ; niveaux-xp-s24.md 5.3, 5.4 ; maquette `bonus.html`).
 * Marquée « Bonus du cap N · {nom} » et « {durée} min · Facultatif » (jamais comptée dans la promesse
 * de temps, C2). Caps 2 à 4 : format « Écouter, repérer » de l'étalon E4 ; cap 5 : « les coulisses de
 * la maison » (blocs). Tout le texte vient de la fiche (fichier des bonus, lot C8, 10/10 à
 * l'aveugle avant mise en base). L'état « Fait » arrive avec le lot D5 (`FicheFait`).
 */
export function FicheBonusVue({ bonus }: { bonus: FicheBonus }) {
  const cap = bonus.cap as NumeroCap;
  return (
    <article className="max-w-lecture space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold text-text-muted">{T.bonus.marque(cap)}</p>
        <h1 className="font-display text-2xl font-bold text-text-primary [overflow-wrap:anywhere] md:text-3xl">
          {bonus.nature === "passage" ? T.fiche.titrePassage(bonus.titre) : bonus.titre}
        </h1>
        <p className="text-sm text-text-secondary">{T.bonus.duree(bonus.dureeMinutes)}</p>
      </div>
      <div className="space-y-6 rounded-lg border border-border bg-background-card p-4 md:p-6">
        {bonus.nature === "passage" ? (
          <>
            {bonus.contenu.avantDeLancer && (
              <Section id="b-avant" titre={T.fiche.avantDeLancer}>
                <p className={CORPS}>{bonus.contenu.avantDeLancer}</p>
              </Section>
            )}
            <Section id="b-passage" titre={T.fiche.lePassage}>
              <p className={CORPS}>
                {bonus.contenu.humoriste} :{" "}
                <a href={bonus.contenu.passage.url} className="text-accent-link underline underline-offset-2" rel="noopener noreferrer" target="_blank">
                  {bonus.contenu.passage.titre}
                </a>
                , {bonus.contenu.passage.chaine}, {minSec(bonus.contenu.passage.debut)} à {minSec(bonus.contenu.passage.fin)}
              </p>
            </Section>
            <Section id="b-reperes" titre={T.fiche.reperes}>
              <ol className={`list-decimal space-y-2 pl-5 ${CORPS}`}>
                {bonus.contenu.observations.map((o) => (
                  <li key={o.titre}>
                    <span className="font-semibold text-text-primary">{o.titre}</span> {o.texte}
                  </li>
                ))}
              </ol>
            </Section>
            <Section id="b-mecanisme" titre={T.fiche.mecanisme}>
              <p className={CORPS}>{bonus.contenu.mecanisme}</p>
            </Section>
            <Section id="b-chez-toi" titre={T.fiche.chezToi}>
              <p className={CORPS}>{bonus.contenu.chezToi}</p>
            </Section>
            {bonus.geste && (
              <Section id="b-geste" titre={T.fiche.apresEcoute}>
                <p className={CORPS}>{bonus.geste.consigne}</p>
              </Section>
            )}
            <Section id="b-citations" titre={T.fiche.citations}>
              <ul className={`space-y-2 ${CORPS}`}>
                {bonus.contenu.citations.map((c) => (
                  <li key={c.texte}>« {c.texte} »</li>
                ))}
              </ul>
            </Section>
          </>
        ) : (
          <>
            {bonus.contenu.blocs.map((b, i) => (
              <Section key={b.titre} id={`b-bloc-${i}`} titre={b.titre}>
                <p className={CORPS}>{b.texte}</p>
              </Section>
            ))}
            {bonus.geste && <p className={CORPS}>{bonus.geste.consigne}</p>}
          </>
        )}
        {bonus.geste?.grille && bonus.geste.grille.length > 0 && (
          <Section id="b-grille" titre={T.fiche.grille}>
            <p className="text-xs text-text-muted">{T.fiche.grilleAide}</p>
            <GrilleOuiNon questions={bonus.geste.grille} />
          </Section>
        )}
      </div>
    </article>
  );
}
