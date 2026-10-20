import type { ReactNode } from "react";
import { contenuAffiche } from "@/lib/tip-prose";
import { fixInvertedCase, splitLearning } from "@/lib/learning-format";

/*
 * Mise en forme d'affichage des cartes du jour (docs/design/cartes-du-jour/diagnostic-et-spec.md, v2 et v3).
 * Tout est rendu seulement : aucun mot changé, base et `contenuAffiche` intacts.
 */

const ESPACES_INTERIEURS = new Set([" ", String.fromCharCode(0xa0), String.fromCharCode(0x202f)]);

/**
 * Guillemets imbriqués au rendu (V2.5) : un « … » dans un « … » s'affiche en “…”, sans les espaces
 * insécables que `frTypo` pose à l'intérieur. Compteur de profondeur borné à 0 ; donnée intacte.
 */
export function guillemetsImbriques(texte: string): string {
  if (!texte.includes("«")) return texte;
  let profondeur = 0;
  let sortie = "";
  for (let i = 0; i < texte.length; i++) {
    const c = texte[i];
    if (c === "«") {
      profondeur++;
      if (profondeur >= 2) {
        sortie += "“";
        while (i + 1 < texte.length && ESPACES_INTERIEURS.has(texte[i + 1])) i++;
        continue;
      }
    } else if (c === "»") {
      if (profondeur >= 2) {
        while (sortie.length > 0 && ESPACES_INTERIEURS.has(sortie[sortie.length - 1])) sortie = sortie.slice(0, -1);
        sortie += "”";
        profondeur--;
        continue;
      }
      profondeur = Math.max(0, profondeur - 1);
    }
    sortie += c;
  }
  return sortie;
}

/** Texte d'une donnée de la section : rendu typographique commun, puis guillemets imbriqués. */
export function affiche(texte: string): string {
  return guillemetsImbriques(contenuAffiche(texte));
}

/**
 * Taille de l'énoncé selon sa longueur affichée ; classes complètes écrites en dur pour le JIT.
 * Sous 1024 px : 20 puis 24 px dès 768 (v3). Dès 1024 px, bandeau plafonné à 40/48, paliers pour les
 * vannes longues (tour 4.1).
 */
export function tailleEnonce(texte: string): string {
  const base = "text-xl leading-7 md:text-2xl md:leading-8";
  if (texte.length <= 50) return `${base} lg:text-[2.5rem] lg:leading-[3rem]`;
  if (texte.length <= 120) return `${base} lg:text-[2rem] lg:leading-10`;
  return `${base} lg:text-[1.75rem] lg:leading-9`;
}

/**
 * Taille de la chute, indépendante de l'énoncé : v3 sous 1024 px ; dès 1024 px, 32/40 puis paliers pour les
 * chutes longues, de sorte qu'elle ne retombe jamais sous les trois quarts de l'énoncé sur le catalogue (tour 4.1).
 */
export function tailleChute(texte: string): string {
  const base = texte.length <= 100 ? "text-xl leading-7 md:text-2xl md:leading-8" : "text-xl leading-7";
  if (texte.length <= 110) return `${base} lg:text-[2rem] lg:leading-10`;
  if (texte.length <= 180) return `${base} lg:text-[1.75rem] lg:leading-9`;
  return `${base} lg:text-2xl lg:leading-8`;
}

/** Citation « … » de premier niveau de 60 caractères ou moins : jamais coupée en fin de ligne (V3.2). */
export function citationsEnBloc(texte: string): ReactNode {
  const morceaux: ReactNode[] = [];
  let profondeur = 0;
  let debut = 0;
  let ouverture = -1;
  for (let i = 0; i < texte.length; i++) {
    if (texte[i] === "«") {
      if (profondeur === 0) ouverture = i;
      profondeur++;
    } else if (texte[i] === "»" && profondeur > 0) {
      profondeur--;
      if (profondeur === 0 && i + 1 - ouverture <= 60) {
        if (ouverture > debut) morceaux.push(texte.slice(debut, ouverture));
        morceaux.push(
          <span key={ouverture} className="inline-block max-w-full">
            {texte.slice(ouverture, i + 1)}
          </span>,
        );
        debut = i + 1;
      }
    }
  }
  if (debut === 0) return texte;
  if (debut < texte.length) morceaux.push(texte.slice(debut));
  return morceaux;
}

/** Durée ISO 8601 (« PT8M12S ») en libellé court (« 8 min », « 1 h 05 », « 45 s ») ; sinon `null`. */
export function dureeAffichee(iso: string | null | undefined): string | null {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso ?? "");
  if (!m || (!m[1] && !m[2] && !m[3])) return null;
  const total = Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
  if (total <= 0) return null;
  if (total < 60) return `${total} s`;
  const minutes = Math.round(total / 60);
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, "0")}`;
}

/** Nom de chaîne masqué (affichage seul) quand le titre commence déjà par lui (§2.5, m11). */
export function chaineRedondante(title: string, channelName: string): boolean {
  return title.trim().toLowerCase().startsWith(channelName.trim().toLowerCase());
}

/** Section d'un accordéon (V3.5) : intertitre sur sa ligne, texte dessous ; filet si ce n'est pas la première. */
export function Section({ titre, separee = false, children }: { titre?: ReactNode; separee?: boolean; children?: ReactNode }) {
  return (
    <div className={separee ? "mt-4 border-t border-border-hover pt-4" : undefined}>
      {titre && <p className="mb-1 text-sm font-semibold text-accent-link">{titre}</p>}
      {children}
    </div>
  );
}

const DEFI_RE = /^DÉFI [^:]{2,40} ?:\s*/;

/** « DÉFI MIROIR : choisis… » → intertitre « Défi miroir » + reste (V3.5) ; `null` sans préfixe de défi. */
export function decouperDefi(texte: string): { titre: string; reste: string } | null {
  const m = DEFI_RE.exec(texte);
  if (!m) return null;
  // `\s` couvre aussi les espaces insécables posées par `frTypo`.
  const brut = m[0].replace(/\s*:\s*$/, "").trim();
  return { titre: brut.charAt(0) + brut.slice(1).toLowerCase(), reste: texte.slice(m[0].length) };
}

/** Exercice (conseil ou vidéo) : défi en intertitre s'il y en a un, sinon texte seul. */
export function Exercice({ texte }: { texte: string }) {
  const affichage = affiche(texte);
  const defi = decouperDefi(affichage);
  if (!defi) return <p>{affichage}</p>;
  return (
    <Section titre={defi.titre}>
      <p>{defi.reste}</p>
    </Section>
  );
}

const DIDASCALIE_RE = /»\s(\([^)]{8,}\))/g;

/** Exemple concret : une didascalie « (…) » qui suit une réplique passe sur sa propre ligne, en italique (V3.5). */
export function Exemple({ texte }: { texte: string }) {
  const affichage = affiche(texte);
  const lignes: ReactNode[] = [];
  let debut = 0;
  for (const m of Array.from(affichage.matchAll(DIDASCALIE_RE))) {
    const fin = (m.index ?? 0) + 1;
    lignes.push(<p key={`t${debut}`}>{affichage.slice(debut, fin).trim()}</p>);
    lignes.push(
      <p key={`d${fin}`} className="italic text-text-secondary">
        {m[1]}
      </p>,
    );
    debut = (m.index ?? 0) + m[0].length;
  }
  if (debut === 0) return <p>{affichage}</p>;
  const reste = affichage.slice(debut).trim();
  if (reste) lignes.push(<p key={`t${debut}`}>{reste}</p>);
  return <>{lignes}</>;
}

/** « Ce que tu vas apprendre » : chaque apprentissage est une section, sans puce (V3.5). */
export function Apprentissages({ items }: { items: string[] }) {
  return (
    <>
      {items.map((raw, i) => {
        const learning = fixInvertedCase(raw);
        const parts = splitLearning(learning);
        return (
          <Section key={i} separee={i > 0} titre={parts ? affiche(parts.title) : undefined}>
            <p>{affiche(parts ? parts.rest.replace(/^\s*:\s*/, "") : learning)}</p>
          </Section>
        );
      })}
    </>
  );
}
