/**
 * @jest-environment node
 *
 * Rappel légal de reconduction de l'annuel (L.215-1, s14 04/10/2026) :
 * fenêtre J-40 (cible) à J-32 (rattrapage), jamais à J-31 ; un seul envoi par
 * (abonnement, fin de période), clé insérée AVANT l'envoi ; mensuel, annulation
 * programmée et abonnements inactifs ignorés. Base simulée en mémoire, aucun
 * email réel.
 */
import {
  daysUntil,
  isInReminderWindow,
  runAnnualRenewalReminders,
  type ReminderDeps,
} from "@/lib/billing/annual-renewal-reminders";
import { formatRenewalDate, renderAnnualRenewalReminder } from "@/lib/emails/annual-renewal-reminder";

const DAY = 24 * 60 * 60 * 1000;
const NOW = new Date("2026-10-04T08:00:00Z");
const inDays = (d: number, extraMs = 0) => new Date(NOW.getTime() + d * DAY + extraMs);

interface FakeSub {
  id: string;
  status: string;
  billingInterval: string | null;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: Date | null;
  priceAmountCents: number | null;
  user: { email: string; name: string | null };
}
interface FakeReminder {
  id: string;
  subscriptionId: string;
  periodEnd: Date;
  status: string;
  sentAt?: Date;
  error?: string | null;
}

function makeDb(subs: FakeSub[]) {
  const reminders: FakeReminder[] = [];
  const events: string[] = [];
  const find = (subscriptionId: string, periodEnd: Date) =>
    reminders.find((r) => r.subscriptionId === subscriptionId && r.periodEnd.getTime() === periodEnd.getTime());
  const prisma = {
    subscription: {
      findMany: jest.fn(async ({ where }: { where: { status: string; billingInterval: string; cancelAtPeriodEnd: boolean; currentPeriodEnd: { gte: Date; lt: Date } } }) =>
        subs.filter(
          (s) =>
            s.status === where.status &&
            s.billingInterval === where.billingInterval &&
            s.cancelAtPeriodEnd === where.cancelAtPeriodEnd &&
            s.currentPeriodEnd !== null &&
            s.currentPeriodEnd >= where.currentPeriodEnd.gte &&
            s.currentPeriodEnd < where.currentPeriodEnd.lt,
        ),
      ),
    },
    renewalReminder: {
      create: jest.fn(async ({ data }: { data: { subscriptionId: string; periodEnd: Date; status: string } }) => {
        if (find(data.subscriptionId, data.periodEnd)) throw Object.assign(new Error("Unique constraint"), { code: "P2002" });
        const row = { id: `rem_${reminders.length + 1}`, ...data };
        reminders.push(row);
        events.push(`insert:${data.subscriptionId}`);
        return row;
      }),
      findUnique: jest.fn(async ({ where }: { where: { subscriptionId_periodEnd: { subscriptionId: string; periodEnd: Date } } }) =>
        find(where.subscriptionId_periodEnd.subscriptionId, where.subscriptionId_periodEnd.periodEnd) ?? null,
      ),
      updateMany: jest.fn(async ({ where, data }: { where: { id: string; status: string }; data: Partial<FakeReminder> }) => {
        const row = reminders.find((r) => r.id === where.id && r.status === where.status);
        if (!row) return { count: 0 };
        Object.assign(row, data);
        return { count: 1 };
      }),
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: Partial<FakeReminder> }) => {
        const row = reminders.find((r) => r.id === where.id)!;
        Object.assign(row, data);
        return row;
      }),
    },
  };
  const sendEmail = jest.fn(async (to: string) => {
    events.push(`send:${to}`);
  });
  const deps = { prisma, sendEmail, manageUrl: "https://deviens-marrant.fr/profil" } as unknown as ReminderDeps;
  return { deps, reminders, events, sendEmail, prisma };
}

function sub(over: Partial<FakeSub> = {}): FakeSub {
  return {
    id: "sub_1",
    status: "ACTIVE",
    billingInterval: "year",
    cancelAtPeriodEnd: false,
    currentPeriodEnd: inDays(40, 3600_000),
    priceAmountCents: 2499,
    user: { email: "lea@example.fr", name: "Léa Martin" },
    ...over,
  };
}

describe("fenêtre d'envoi", () => {
  it.each([
    [45, false],
    [41, false],
    [40, true],
    [36, true],
    [32, true],
    [31, false],
    [10, false],
  ])("J-%i → envoi %s", (days, expected) => {
    const end = inDays(days, 3600_000);
    expect(daysUntil(end, NOW)).toBe(days);
    expect(isInReminderWindow(end, NOW)).toBe(expected);
  });

  it("borne J-32 incluse, J-31 exclue (à la milliseconde)", () => {
    expect(isInReminderWindow(inDays(32), NOW)).toBe(true);
    expect(isInReminderWindow(inDays(32, -1), NOW)).toBe(false);
  });

  it.each([41, 31, 20])("aucun email hors fenêtre (J-%i)", async (days) => {
    const { deps, sendEmail, reminders } = makeDb([sub({ currentPeriodEnd: inDays(days, 3600_000) })]);
    const res = await runAnnualRenewalReminders(NOW, deps);
    expect(res.sent).toBe(0);
    expect(sendEmail).not.toHaveBeenCalled();
    expect(reminders).toHaveLength(0);
  });

  it("rattrapage : un abonnement à J-33 jamais rappelé reçoit l'email", async () => {
    const { deps, sendEmail } = makeDb([sub({ currentPeriodEnd: inDays(33, 3600_000) })]);
    expect((await runAnnualRenewalReminders(NOW, deps)).sent).toBe(1);
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });
});

describe("cibles", () => {
  it("ignore le mensuel, l'annulation programmée et les abonnements non actifs", async () => {
    const { deps, sendEmail, prisma } = makeDb([
      sub({ id: "monthly", billingInterval: "month", priceAmountCents: 299, user: { email: "m@x.fr", name: null } }),
      sub({ id: "launch", billingInterval: "month", priceAmountCents: 99, user: { email: "l@x.fr", name: null } }),
      sub({ id: "legacy", billingInterval: null, priceAmountCents: null, user: { email: "n@x.fr", name: null } }),
      sub({ id: "canceling", cancelAtPeriodEnd: true, user: { email: "c@x.fr", name: null } }),
      sub({ id: "pastdue", status: "PAST_DUE", user: { email: "p@x.fr", name: null } }),
      sub({ id: "annual", user: { email: "a@x.fr", name: "Alex" } }),
    ]);
    const res = await runAnnualRenewalReminders(NOW, deps);
    expect(res).toMatchObject({ candidates: 1, sent: 1, failed: 0 });
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail.mock.calls[0][0]).toBe("a@x.fr");
    expect(prisma.subscription.findMany.mock.calls[0][0].where).toMatchObject({
      status: "ACTIVE",
      billingInterval: "year",
      cancelAtPeriodEnd: false,
    });
  });
});

describe("anti-doublon (subscriptionId, periodEnd)", () => {
  it("la clé est insérée AVANT l'envoi, puis marquée SENT", async () => {
    const { deps, events, reminders } = makeDb([sub()]);
    await runAnnualRenewalReminders(NOW, deps);
    expect(events).toEqual(["insert:sub_1", "send:lea@example.fr"]);
    expect(reminders[0]).toMatchObject({ subscriptionId: "sub_1", status: "SENT" });
    expect(reminders[0].sentAt).toBeInstanceOf(Date);
  });

  it("passages répétés (ticks, jours suivants) : un seul email par période", async () => {
    const { deps, sendEmail } = makeDb([sub()]);
    await runAnnualRenewalReminders(NOW, deps);
    await runAnnualRenewalReminders(new Date(NOW.getTime() + 15 * 60_000), deps);
    await runAnnualRenewalReminders(new Date(NOW.getTime() + DAY), deps);
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it("nouvelle période (après reconduction) : nouveau rappel", async () => {
    const s = sub();
    const { deps, sendEmail, reminders } = makeDb([s]);
    await runAnnualRenewalReminders(NOW, deps);
    s.currentPeriodEnd = new Date(s.currentPeriodEnd!.getTime() + 365 * DAY);
    await runAnnualRenewalReminders(new Date(NOW.getTime() + 365 * DAY), deps);
    expect(sendEmail).toHaveBeenCalledTimes(2);
    expect(reminders).toHaveLength(2);
  });

  it("échec d'envoi : FAILED, retenté au passage suivant, puis plus rien", async () => {
    const { deps, sendEmail, reminders } = makeDb([sub()]);
    sendEmail.mockRejectedValueOnce(new Error("Resend down"));
    const first = await runAnnualRenewalReminders(NOW, deps);
    expect(first.failed).toBe(1);
    expect(reminders[0]).toMatchObject({ status: "FAILED", error: "Resend down" });

    const second = await runAnnualRenewalReminders(NOW, deps);
    expect(second.sent).toBe(1);
    expect(reminders).toHaveLength(1);
    expect(reminders[0].status).toBe("SENT");

    await runAnnualRenewalReminders(NOW, deps);
    expect(sendEmail).toHaveBeenCalledTimes(2);
  });

  it("ligne PENDING existante (envoi concurrent en cours) : pas de second email", async () => {
    const s = sub();
    const { deps, sendEmail, reminders } = makeDb([s]);
    reminders.push({ id: "rem_x", subscriptionId: s.id, periodEnd: s.currentPeriodEnd!, status: "PENDING" });
    const res = await runAnnualRenewalReminders(NOW, deps);
    expect(res.skipped).toBe(1);
    expect(sendEmail).not.toHaveBeenCalled();
  });
});

describe("contenu de l'email (texte @legal)", () => {
  it("objet et variables : date française Europe/Paris, montant réel, lien de gestion", async () => {
    const { deps, sendEmail } = makeDb([sub({ currentPeriodEnd: new Date("2026-11-12T10:00:00Z"), priceAmountCents: 2499 })]);
    await runAnnualRenewalReminders(new Date("2026-10-03T08:00:00Z"), deps);
    const [, subject, text] = sendEmail.mock.calls[0] as unknown as [string, string, string];
    expect(subject).toBe("Ton abonnement annuel Deviens Marrant se renouvelle le 12 novembre 2026");
    expect(text.startsWith("Salut Léa,\n")).toBe(true);
    expect(text).toContain("Date de renouvellement : 12 novembre 2026");
    expect(text).toContain("Montant : 24,99\u00A0€ TTC pour 12 mois");
    // Lot G (@legal point 14) : « au plus tard la veille », plus « avant le ».
    expect(text).toContain("Pour ne pas renouveler : résilie au plus tard la veille, le 11 novembre 2026");
    expect(text).not.toContain("résilie avant le");
    expect(text).toContain("Pour gérer ou résilier ton abonnement : https://deviens-marrant.fr/profil");
    expect(text).not.toMatch(/\{(prenom|date_renouvellement|montant|lien_gestion)\}|TODO/);
    expect(text).not.toContain("—");
  });

  it("sans prénom : « Salut, » ; 1er du mois ; minuit à Paris compté le bon jour", () => {
    const email = renderAnnualRenewalReminder({
      prenom: null,
      renewalDate: new Date("2026-11-30T23:30:00Z"), // 1er décembre 00h30 à Paris
      amountCents: 2499,
      manageUrl: "https://x/profil",
    });
    expect(email.text.startsWith("Salut,\n")).toBe(true);
    expect(email.subject).toBe("Ton abonnement annuel Deviens Marrant se renouvelle le 1er décembre 2026");
    expect(formatRenewalDate(new Date("2027-03-15T12:00:00Z"))).toBe("15 mars 2027");
  });
});
