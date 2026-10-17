/**
 * @jest-environment node
 *
 * Intégration s21 : les tâches de la lettre sont déclarées dans le planificateur
 * du site, par le même mécanisme que les autres tâches : Cron Trigger Cloudflare
 * toutes les 15 min (`wrangler.jsonc`) → `/api/cron/scheduler-tick` (appel en
 * processus, `cloudflare/worker.ts`) → `runAllJobs` (`lib/scheduler/jobs.ts`).
 * Les numéros préparés sont synchronisés par les tâches de démarrage (cron 1 h UTC).
 */
import { readFileSync } from "fs";
import { join } from "path";

const racine = join(__dirname, "..", "..", "..");
const lire = (chemin: string) => readFileSync(join(racine, chemin), "utf8");

describe("Planificateur : tâches de la lettre", () => {
  it("runAllJobs lance l'envoi mensuel et l'entretien (purge à 7 jours, reconfirmation, traces à 3 ans)", () => {
    const jobs = lire("src/lib/scheduler/jobs.ts");
    const corps = jobs.slice(jobs.indexOf("const runAllJobs = async"), jobs.indexOf("};", jobs.indexOf("const runAllJobs = async")));
    expect(corps).toContain("await runLettreMensuelleJob();");
    expect(corps).toContain("await runLettreEntretienJob();");
  });

  it("le tick toutes les 15 min est déclaré dans wrangler et relié au handler du planificateur", () => {
    expect(lire("wrangler.jsonc")).toMatch(/"crons":\s*\[[^\]]*"\*\/15 \* \* \* \*"/);
    expect(lire("cloudflare/worker.ts")).toContain('"*/15 * * * *": "/api/cron/scheduler-tick"');
    expect(lire("src/app/api/cron/scheduler-tick/route.ts")).toContain("await runAllJobs();");
  });

  it("les numéros préparés sont synchronisés par les tâches de démarrage", () => {
    expect(lire("cloudflare/worker.ts")).toContain('"0 1 * * *": "/api/cron/startup-tasks"');
    expect(lire("src/lib/startup-tasks.ts")).toContain("applyLettreNumerosTask");
  });

  it("l'envoi suit LETTRE_ENVOIS_OUVERTS, l'entretien LETTRE_INSCRIPTIONS_OUVERTES (purge faite dans tous les cas)", () => {
    const jobs = lire("src/lib/scheduler/jobs.ts");
    const envoi = jobs.slice(jobs.indexOf("const runLettreMensuelleJob"), jobs.indexOf("const runLettreEntretienJob"));
    expect(envoi).toContain("if (!LETTRE_ENVOIS_OUVERTS) return;");
    const entretien = jobs.slice(jobs.indexOf("const runLettreEntretienJob"), jobs.indexOf("const runWeeklyVisitsReportJob"));
    expect(entretien).toContain("if (!LETTRE_INSCRIPTIONS_OUVERTES && (await prisma.newsletterSubscriber.count()) === 0) return;");
    expect(jobs).not.toContain("LETTRE_OUVERTE");
  });

  it("garde-fou s21 : un numéro reporté (article cité pas en ligne) laisse une alerte dans le journal de la tâche, verrou relâché", () => {
    const jobs = lire("src/lib/scheduler/jobs.ts");
    const envoi = jobs.slice(jobs.indexOf("const runLettreMensuelleJob"), jobs.indexOf("const runLettreEntretienJob"));
    expect(envoi).toMatch(/if \(res\.reporte\) \{\s*console\.warn\(\s*`\[scheduler:lettre-mensuelle\] ALERTE \$\{res\.numero\} reporté au passage suivant/);
    expect(envoi).toContain("res.articlesNonPublies.join");
    // Verrou relâché en fin de passage : le passage suivant (15 min) revérifie la base.
    expect(envoi).toContain("await releaseLock(lockKey);");
  });
});
