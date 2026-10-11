/**
 * Couverture de la file sociale (s15, QA cycles 1 et 2, plan v2 §5 et §8) : lu par
 * le job horaire du scheduler (`runCouvertureSocialeJob`). Aucun LLM, aucun appel Buffer.
 *
 * Réseaux NON en pause :
 *  1. pause automatique après 2 FAILED consécutifs depuis la dernière reprise ;
 *  2. file basse : la file APPROVED future couvre moins de 10 jours ;
 *  3. tranche en retard : à sa date de prêt (J-14), posts insérés < posts prévus
 *     par la grille v5 pour ce réseau (9 tranches du plan v2, hors silences).
 *  4. stock éligible < 14 vannes du POOL STRICT (`config/social-pool.ts`, plan v3 §2) :
 *     hors exclusions v5, hors vannes postées à ±90 jours (tous réseaux), hors vannes
 *     dont la 1re diffusion était sur ce réseau (retour à 90 jours sur un autre réseau).
 * Démarrages de session (plan v3 §8), tous réseaux :
 *  5. e-mail de lancement de tranche à sa date de lancement, et rappel si la file
 *     d'un réseau actif passe sous 21 jours alors que la tranche suivante est incomplète ;
 *  6. vagues V1 à V4 : e-mail au démarrage et à la livraison ;
 *  7. jalons J+14 à J+112 : e-mail le dimanche d'avant (fiche d'une page).
 * Alertes séparées par réseau et par type, un enregistrement par jour chacune
 * (`sendDailyPublishFailureAlert` → `lib/admin-alerts.ts`). Depuis s15 (06/10),
 * aucune ne part par e-mail : classe B, lue par la session (`GET /api/admin/alertes`).
 */
import { POOL_STRICT } from "@/config/social-pool";
import {
  ANTI_REPETITION_JOURS,
  CONSIGNE_JALON,
  CONSIGNE_RELANCE_LOT,
  CONSIGNE_VAGUE,
  COUVERTURE_LANCEMENT_JOURS,
  COUVERTURE_MIN_JOURS,
  ECHECS_AVANT_PAUSE,
  J0_SOCIAL,
  JALONS_JOURS,
  JOURS_GRILLE,
  LI_DEPLACE,
  NOEL_DES,
  PAIN_IDS,
  RESERVEES_NOEL,
  SILENCES_SOCIAL,
  SOUS_HUIT,
  STOCK_MIN_VANNES,
  TRANCHES_SOCIALES,
  VAGUES_VANNES,
  type TrancheSociale,
} from "@/config/social-calendrier";
import type { BufferPlatform } from "./buffer-client";
import { ajouterJours, dateParis, jourSemaine, parisVersUtc } from "./heure-paris";
import {
  alerterPausesAutomatiques,
  lireInterrupteurs,
  MOTIF_PAUSE_ECHECS,
  pauserAutomatiquement,
  RESEAU_LABEL,
  type EnvoiAlerte,
  type PostFile,
  type SwitchDb,
} from "./platform-switch";
import { PUBLISH_ERROR_PREFIX } from "./publish-failure";

export interface CouvertureDb extends SwitchDb {
  socialPost: SwitchDb["socialPost"] & { count(args: unknown): Promise<number> };
}

const JOUR_MS = 24 * 60 * 60 * 1000;
const jj = (d: string) => d.split("-").reverse().join("/");

/** Jours couverts par la file : du moment présent au dernier post APPROVED à venir. */
export function joursCouverts(dernier: Date | null, now: Date): number {
  if (!dernier) return 0;
  return Math.max(0, (dernier.getTime() - now.getTime()) / JOUR_MS);
}

/** Échec de publication réel (remise refusée, relu en erreur chez Buffer), pas un nettoyage. */
export function estEchecDePublication(p: Pick<PostFile, "status" | "directorNote">): boolean {
  return p.status === "FAILED" && !!p.directorNote?.includes(PUBLISH_ERROR_PREFIX);
}

/** true si les N derniers posts tentés (plus récents d'abord) sont tous des échecs. */
export function echecsConsecutifs(recents: PostFile[], n = ECHECS_AVANT_PAUSE): boolean {
  return recents.length >= n && recents.slice(0, n).every(estEchecDePublication);
}

/** Posts prévus par la grille v5 pour un réseau entre deux dates incluses (silences et 24/12 LinkedIn compris). */
export function postsPrevus(platform: BufferPlatform, debut: string, fin: string): number {
  let n = 0;
  for (let d = debut; d <= fin; d = ajouterJours(d, 1)) {
    if (SILENCES_SOCIAL.has(d)) continue;
    if (platform === "LINKEDIN" && LI_DEPLACE[d]) continue;
    const deplace = platform === "LINKEDIN" && Object.values(LI_DEPLACE).includes(d);
    if (deplace || JOURS_GRILLE[platform].includes(jourSemaine(d))) n++;
  }
  return n;
}

/** Tranches dont la date de prêt est atteinte mais qui n'ont pas commencé (dates de Paris). */
export function tranchesAVerifier(now: Date): TrancheSociale[] {
  const j = dateParis(now);
  return TRANCHES_SOCIALES.filter((t) => t.pret <= j && j < t.debut);
}

/**
 * Stock éligible d'un réseau dans le pool strict : hors exclusions v5 (sous 8, « pain »,
 * Noël avant le 24/12), hors vannes postées à ±90 jours (registre commun), hors vannes
 * dont la 1re diffusion était sur ce réseau (retour sur un autre réseau). Fonction pure.
 */
export function stockEligible(
  pool: string[],
  diffusions: Array<{ sourceId: string; platform: string; scheduledAt: Date }>,
  platform: BufferPlatform,
  now: Date,
): number {
  const aujourdhui = dateParis(now);
  const exclues = new Set([...SOUS_HUIT, ...PAIN_IDS, ...(aujourdhui < NOEL_DES ? RESERVEES_NOEL : [])]);
  const fenetre = ANTI_REPETITION_JOURS * JOUR_MS;
  const recentes = new Set(diffusions.filter((d) => Math.abs(d.scheduledAt.getTime() - now.getTime()) < fenetre).map((d) => d.sourceId));
  const premiere = new Map<string, { platform: string; t: number }>();
  for (const d of diffusions) {
    const p = premiere.get(d.sourceId);
    if (!p || d.scheduledAt.getTime() < p.t) premiere.set(d.sourceId, { platform: d.platform, t: d.scheduledAt.getTime() });
  }
  return pool.filter((id) => !exclues.has(id) && !recentes.has(id) && premiere.get(id)?.platform !== platform).length;
}

/** Jalons de mesure dont la fiche se prépare aujourd'hui (dimanche d'avant, date de Paris). */
export function jalonsDuJour(now: Date): Array<{ jours: number; date: string }> {
  const j = dateParis(now);
  return JALONS_JOURS.map((n) => ({ jours: n, date: ajouterJours(J0_SOCIAL, n) })).filter((x) => ajouterJours(x.date, -1) === j);
}

export interface ResultatCouverture {
  pauses: BufferPlatform[];
  fileBasse: Array<{ platform: BufferPlatform; jours: number }>;
  tranchesEnRetard: Array<{ platform: BufferPlatform; tranche: string; inseres: number; prevus: number }>;
  stock: Partial<Record<BufferPlatform, number>>;
  lancement: string | null;
  alertes: string[];
}

async function inseres(db: CouvertureDb, platform: BufferPlatform, t: TrancheSociale): Promise<number> {
  return db.socialPost.count({
    where: {
      platform, status: { notIn: ["REJECTED"] },
      scheduledAt: { gte: parisVersUtc(t.debut, 0, 0), lt: parisVersUtc(ajouterJours(t.fin, 1), 0, 0) },
    },
  });
}

export async function runCouvertureSociale(db: CouvertureDb, envoyer: EnvoiAlerte, now: Date): Promise<ResultatCouverture> {
  const res: ResultatCouverture = { pauses: [], fileBasse: [], tranchesEnRetard: [], stock: {}, lancement: null, alertes: [] };
  const aujourdhui = dateParis(now);
  const prochaine = TRANCHES_SOCIALES.find((t) => t.debut > aujourdhui) ?? null;
  const alerter = async (sujet: string, html: string, job: string) => {
    if (await envoyer(sujet, html, now, job)) res.alertes.push(job);
  };
  const consigne = `<p><strong>Consigne à coller dans une session :</strong></p><pre>${CONSIGNE_RELANCE_LOT}</pre>`;
  let rappelLancement: string | null = null;

  for (const etat of await lireInterrupteurs(db)) {
    if (etat.paused) continue;
    const { platform } = etat;
    const label = RESEAU_LABEL[platform];
    const cle = platform.toLowerCase();

    // 1. Échecs consécutifs depuis la dernière reprise.
    const recents = await db.socialPost.findMany({
      where: {
        platform, status: { in: ["PUBLISHED", "FAILED"] }, scheduledAt: { lte: now },
        ...(etat.depuis ? { updatedAt: { gte: etat.depuis } } : {}),
      },
      orderBy: { scheduledAt: "desc" },
      take: ECHECS_AVANT_PAUSE,
      select: { id: true, scheduledAt: true, status: true, directorNote: true },
    });
    if (echecsConsecutifs(recents)) {
      const motif = `${MOTIF_PAUSE_ECHECS} : ${ECHECS_AVANT_PAUSE} derniers posts ${label} en FAILED (${recents.map((p) => p.id).join(", ")}).`;
      if (await pauserAutomatiquement(db, platform, motif, now)) res.pauses.push(platform);
      continue;
    }

    // 2. File basse (et rappel de lancement sous 21 jours).
    const [dernier] = await db.socialPost.findMany({
      where: { platform, status: "APPROVED", scheduledAt: { gte: now } },
      orderBy: { scheduledAt: "desc" },
      take: 1,
      select: { id: true, scheduledAt: true },
    });
    const jours = joursCouverts(dernier?.scheduledAt ?? null, now);
    if (jours < COUVERTURE_MIN_JOURS) {
      res.fileBasse.push({ platform, jours });
      const fin = dernier ? `le dernier post prévu est le ${jj(dateParis(dernier.scheduledAt))}` : "aucun post APPROVED à venir";
      await alerter(`File ${label} basse : ${Math.floor(jours)} jour(s) de posts devant`,
        `<p>La file <strong>${label}</strong> couvre moins de ${COUVERTURE_MIN_JOURS} jours : ${fin}.</p>${consigne}`,
        `social-file-basse-${cle}`);
    }
    if (jours < COUVERTURE_LANCEMENT_JOURS && prochaine && (await inseres(db, platform, prochaine)) < postsPrevus(platform, prochaine.debut, prochaine.fin)) {
      rappelLancement ??= `${prochaine.id} (file ${label} : ${Math.floor(jours)} jour(s))`;
    }

    // 3. Tranche en retard à sa date de prêt : insérés < prévus pour ce réseau.
    for (const t of tranchesAVerifier(now)) {
      const prevus = postsPrevus(platform, t.debut, t.fin);
      const n = await inseres(db, platform, t);
      if (n >= prevus) continue;
      res.tranchesEnRetard.push({ platform, tranche: t.id, inseres: n, prevus });
      await alerter(`Tranche ${t.id} ${label} en retard : ${n} post(s) inséré(s) sur ${prevus}`,
        `<p>La tranche ${t.id} (${jj(t.debut)} au ${jj(t.fin)}) devait être prête le ${jj(t.pret)} :
        <strong>${n} post(s) ${label}</strong> en base pour ${prevus} prévus par la grille.</p>${consigne}`,
        `social-lot-retard-${cle}`);
    }
  }

  // 4. Stock éligible par réseau actif, dans le pool strict.
  const actifs = (await lireInterrupteurs(db)).filter((e) => !e.paused).map((e) => e.platform);
  if (actifs.length > 0) {
    const diffusions = (await db.socialPost.findMany({
      where: { sourceId: { in: POOL_STRICT }, status: { notIn: ["REJECTED", "FAILED"] } },
      select: { id: true, scheduledAt: true, sourceId: true, platform: true },
    })).map((p) => ({ sourceId: p.sourceId ?? "", platform: p.platform ?? "", scheduledAt: p.scheduledAt }));
    for (const platform of actifs) {
      const n = stockEligible(POOL_STRICT, diffusions, platform, now);
      res.stock[platform] = n;
      if (n >= STOCK_MIN_VANNES) continue;
      const label = RESEAU_LABEL[platform];
      await alerter(`Stock de vannes ${label} bas : ${n} vanne(s) éligible(s) (seuil ${STOCK_MIN_VANNES})`,
        `<p>Le pool strict (${POOL_STRICT.length} vannes au niveau, <code>config/social-pool.ts</code>) ne compte plus que
        <strong>${n} vanne(s)</strong> utilisables sur ${label} : libres à ±${ANTI_REPETITION_JOURS} jours, hors vannes
        connues sous 8, « pain », réservées à Noël, et hors retours sur leur réseau de 1re diffusion.</p>
        <p><strong>Action :</strong> secours S1 du plan (§3), vague de vannes neuves, mise à jour du pool.</p>${consigne}`,
        `social-stock-${platform.toLowerCase()}`);
    }
  }

  // 5. Lancement de tranche : à sa date (Paris), ou rappel si une file passe sous 21 jours.
  const duJour = TRANCHES_SOCIALES.filter((t) => t.lancement === aujourdhui).map((t) => t.id);
  const motifLancement = duJour.length ? `date de lancement de la tranche ${duJour.join(" et ")}` : rappelLancement ? `rappel : tranche ${rappelLancement}` : null;
  if (motifLancement) {
    const ids = duJour.length ? duJour : [prochaine!.id];
    const lignes = TRANCHES_SOCIALES.filter((t) => ids.includes(t.id))
      .map((t) => `<li>Tranche ${t.id} : posts du ${jj(t.debut)} au ${jj(t.fin)}, prête (insérée) le ${jj(t.pret)}.</li>`).join("");
    res.lancement = ids.join(", ");
    await alerter(`Lancement de la tranche sociale ${ids.join(" et ")}`,
      `<p>Motif : ${motifLancement}.</p><ul>${lignes}</ul>${consigne}`,
      "social-lancement-lot");
  }

  // 6. Vagues de vannes V1 à V4 : démarrage et livraison.
  for (const v of VAGUES_VANNES) {
    const moment = v.demarrage === aujourdhui ? "démarrage" : v.livraison === aujourdhui ? "livraison" : null;
    if (!moment) continue;
    await alerter(`Vague ${v.id} : ${moment} (${v.cible} vannes neuves pour la tranche ${v.tranche})`,
      `<p>Vague <strong>${v.id}</strong> : production du ${jj(v.demarrage)}, livraison le ${jj(v.livraison)}, tranche ${v.tranche} prête le ${jj(v.pret)}.
      ${moment === "livraison" ? "Vérifier que la cible est livrée (déclencheur S1 sous 90 %) et que le pool strict est à jour." : ""}</p>
      <p><strong>Consigne à coller dans une session :</strong></p><pre>${CONSIGNE_VAGUE}</pre>`,
      "social-vague");
  }

  // 7. Jalons de mesure : fiche d'une page le dimanche d'avant.
  for (const jl of jalonsDuJour(now)) {
    await alerter(`Jalon J+${jl.jours} demain (${jj(jl.date)}) : fiche de décision`,
      `<p>Jalon <strong>J+${jl.jours}</strong> des réseaux (J0 ${jj(J0_SOCIAL)}) le lundi ${jj(jl.date)}.</p>
      <p><strong>Consigne à coller dans une session :</strong></p><pre>${CONSIGNE_JALON}</pre>`,
      "social-jalon");
  }

  if (res.pauses.length > 0) {
    for (const p of await alerterPausesAutomatiques(db, envoyer, now)) res.alertes.push(`pause-${p}`);
  }
  return res;
}
