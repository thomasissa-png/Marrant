/**
 * Réplique citée entre « » (carte « Et toi ? », carte « Quel registre ? », fiche de situation). Une
 * citation intérieure passe au second niveau : « » devient “ ”, sans espace intérieure (correctif de
 * 11-29, `docs/copy/espace/g5-corrections-carnet.md` section F). Le texte source n'est pas modifié : sur
 * la page du carnet, `onTeDit` n'est pas mis entre « » et garde ses « ».
 */
export function entreGuillemets(texte: string): string {
  return `« ${texte.replace(/«\s*/g, "“").replace(/\s*»/g, "”")} »`;
}
