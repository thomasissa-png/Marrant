/**
 * s21 (QA m4) : rend un fichier de test indépendant de variables d'environnement posées
 * par certains jobs (e2e-local : `STRIPE_PREMIUM_ANNUAL_PRICE_ID`, `NEXTAUTH_URL`).
 * Retire les variables pendant le fichier, puis remet les valeurs d'origine.
 * Les valeurs sont lues au moment de l'appel par le code testé (aucune n'est figée à l'import).
 */
export function envNeutre(...noms: string[]): void {
  const avant = new Map<string, string | undefined>();
  beforeAll(() => {
    for (const nom of noms) {
      avant.set(nom, process.env[nom]);
      delete process.env[nom];
    }
  });
  afterAll(() => {
    for (const [nom, valeur] of avant) {
      if (valeur === undefined) delete process.env[nom];
      else process.env[nom] = valeur;
    }
  });
}
