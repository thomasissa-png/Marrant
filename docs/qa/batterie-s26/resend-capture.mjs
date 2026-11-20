// Faux Resend de la batterie : même journal (une ligne par e-mail) + corps complet en JSON dans MAILS_DIR.
import { createServer } from "node:http";
import { appendFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
const PORT = Number(process.env.PORT_RESEND);
const JOURNAL = process.env.JOURNAL;
const DIR = process.env.MAILS_DIR;
const noter = (m) => appendFileSync(JOURNAL, `${new Date().toISOString()} ${m}\n`);
let n = 0;
createServer((req, res) => {
  let corps = "";
  req.on("data", (c) => (corps += c));
  req.on("end", () => {
    let json = null;
    try { json = corps ? JSON.parse(corps) : null; } catch {}
    const lot = Array.isArray(json) ? json : json ? [json] : [];
    if (req.method === "POST" && /\/emails/.test(req.url)) {
      for (const m of lot) {
        noter(`${req.url} à=${[m.to].flat().join(",")} objet=« ${m.subject ?? ""} »`);
        writeFileSync(`${DIR}/${Date.now()}-${PORT}-${++n}.json`, JSON.stringify(m, null, 1));
      }
    } else noter(`${req.method} ${req.url}`);
    res.writeHead(200, { "content-type": "application/json" });
    const id = () => randomUUID();
    res.end(JSON.stringify(/batch/.test(req.url) ? { data: lot.map(() => ({ id: id() })) } : { id: id(), object: "email" }));
  });
}).listen(PORT, "127.0.0.1", () => noter(`faux Resend (capture batterie) à l'écoute sur ${PORT}`));
