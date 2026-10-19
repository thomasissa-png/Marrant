/**
 * Calendrier des lettres (s21) : heure de Paris, jour d'envoi, semaine ISO.
 * Sans base, sans dépendance : partagé par la mensuelle (`envoi.ts`) et la lettre
 * de la semaine (`envoi-hebdo.ts`). Constantes réexportées par `envoi.ts`.
 */

/** Jour d'envoi : jeudi (`getUTCDay`), à 8 h heure de Paris (décision de Thomas, 17/10, reprise le 19/10 pour l'hebdo). */
export const LETTRE_JOUR_ENVOI = 4;
export const LETTRE_HEURE_ENVOI_PARIS = 8;

const JOUR_MS = 86_400_000;
const heureParisFormat = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", hour: "2-digit", hourCycle: "h23" });
const jourParisFormat = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" });

/** Instant « jour à HH:00, heure de Paris » (heure d'hiver UTC+1 ou d'été UTC+2). */
export function aHeureParis(an: number, mois: number, jour: number, heure: number): Date {
  for (const decalage of [1, 2]) {
    const essai = new Date(Date.UTC(an, mois - 1, jour, heure - decalage));
    if (Number(heureParisFormat.format(essai)) === heure) return essai;
  }
  throw new Error(`Heure de Paris introuvable pour ${an}-${mois}-${jour} ${heure} h`);
}

/** Jour civil de Paris à `now`, en minuit UTC (pour les calculs de jours). */
function jourParisUtc(now: Date): Date {
  const [an, mois, jour] = jourParisFormat.format(now).split("-").map(Number);
  return new Date(Date.UTC(an, mois - 1, jour));
}

/** Lundi (minuit UTC) de la semaine ISO `semaine` de `annee`. */
function lundiSemaineIso(annee: number, semaine: number): Date {
  const quatreJanvier = new Date(Date.UTC(annee, 0, 4));
  const jourIso = quatreJanvier.getUTCDay() || 7;
  return new Date(quatreJanvier.getTime() - (jourIso - 1) * JOUR_MS + (semaine - 1) * 7 * JOUR_MS);
}

/** Semaine ISO « AAAA-Www » d'un jour (minuit UTC). L'année est celle du jeudi de la semaine. */
function cleSemaine(jour: Date): string {
  const jourIso = jour.getUTCDay() || 7;
  const jeudi = new Date(jour.getTime() + (4 - jourIso) * JOUR_MS);
  const annee = jeudi.getUTCFullYear();
  const semaine = Math.floor((jeudi.getTime() - Date.UTC(annee, 0, 1)) / (7 * JOUR_MS)) + 1;
  return `${annee}-W${String(semaine).padStart(2, "0")}`;
}

/** Semaine ISO de Paris à `now` (« 2026-W46 »). Numéro d'un numéro hebdo (`periodKey`). */
export function semaineIsoParis(now: Date): string {
  return cleSemaine(jourParisUtc(now));
}

const FORMAT_SEMAINE = /^(\d{4})-W(0[1-9]|[1-4]\d|5[0-3])$/;

/** Clé de semaine bien formée ET existante (une 53e semaine n'existe que certaines années). */
export function semaineValide(cle: string): boolean {
  const m = FORMAT_SEMAINE.exec(cle);
  if (!m) return false;
  return cleSemaine(lundiSemaineIso(Number(m[1]), Number(m[2]))) === cle;
}

/** Envoi d'une semaine : son jeudi à 8 h, heure de Paris. `null` si la clé est invalide. */
export function envoiSemaine(cle: string): Date | null {
  if (!semaineValide(cle)) return null;
  const [annee, semaine] = cle.split("-W").map(Number);
  const jeudi = new Date(lundiSemaineIso(annee, semaine).getTime() + 3 * JOUR_MS);
  return aHeureParis(jeudi.getUTCFullYear(), jeudi.getUTCMonth() + 1, jeudi.getUTCDate(), LETTRE_HEURE_ENVOI_PARIS);
}

/** Fin d'une semaine : lundi suivant à 0 h, heure de Paris (pas de rattrapage après). */
export function finSemaine(cle: string): Date | null {
  if (!semaineValide(cle)) return null;
  const [annee, semaine] = cle.split("-W").map(Number);
  const lundi = new Date(lundiSemaineIso(annee, semaine).getTime() + 7 * JOUR_MS);
  return aHeureParis(lundi.getUTCFullYear(), lundi.getUTCMonth() + 1, lundi.getUTCDate(), 0);
}

/** Mois « AAAA-MM » du jeudi d'une semaine, au calendrier de Paris. */
export function moisDeSemaine(cle: string): string | null {
  const envoi = envoiSemaine(cle);
  return envoi ? jourParisFormat.format(envoi).slice(0, 7) : null;
}
