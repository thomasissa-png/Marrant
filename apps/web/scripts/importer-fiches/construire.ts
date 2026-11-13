/**
 * Construction du contenu importé, sans rien écrire : partagée par le script et par le test Jest
 * `import-contenu-s24.test.ts` (les JSON servis doivent être exactement la sortie de l'import).
 */
import { FICHIERS_ESPACE, ficheSchema, validerFichier, type Fiche, type TypeFiche } from "../../src/lib/espace/fiches-schema";
import { lireTousLesLots, type Refus } from "./lots";
import { verifierBilans, verifierJeux, type Controle } from "./verifier";

/** Fichiers que l'import remplit ; `ecouter` et `bonus` ne sont jamais touchés (hors import). */
export const IMPORTES = ["situations", "constructions", "vocabulaire", "formules", "a-plat", "jeux", "bilans", "seances", "humour-noir"] as const;
export type NomImporte = (typeof IMPORTES)[number];

export interface Import {
  parFichier: Map<NomImporte, Fiche[]>;
  refus: Refus[];
  controles: Controle[];
}

export function construireImport(): Import {
  const { brutes, refus } = lireTousLesLots();
  const fiches: Fiche[] = [];
  for (const b of brutes) {
    const r = ficheSchema.safeParse(b.fiche);
    if (r.success) {
      fiches.push(r.data);
      continue;
    }
    const raison = r.error.issues.map((i) => `${i.path.join(".") || "fiche"} : ${i.message}`).join(" ; ");
    refus.push({ lot: b.lot, ref: b.ref, type: String(b.fiche.type), raison: `schéma : ${raison}` });
  }
  const parFichier = new Map<NomImporte, Fiche[]>();
  for (const nom of IMPORTES) {
    const type: TypeFiche = FICHIERS_ESPACE[nom];
    parFichier.set(nom, validerFichier(type, fiches.filter((f) => f.type === type)));
  }
  const ids = fiches.map((f) => f.id);
  const doublons = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (doublons.length) throw new Error(`id en double entre fichiers : ${doublons.join(", ")}`);
  const pourControle = fiches as unknown as Parameters<typeof verifierJeux>[0];
  return { parFichier, refus, controles: [...verifierJeux(pourControle), ...verifierBilans(pourControle)] };
}

/** Texte exact d'un fichier JSON servi (2 espaces, fin de ligne finale). */
export const enJson = (fiches: unknown[]) => `${JSON.stringify(fiches, null, 2)}\n`;
