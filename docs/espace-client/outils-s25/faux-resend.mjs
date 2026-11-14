// Faux Resend local (préversion s25) : reçoit les appels de l'API Resend sur 127.0.0.1:5401 et note
// seulement date, destinataire et objet dans emails.log. Aucun e-mail ne part.
import { createServer } from "node:http";
import { appendFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.PORT_RESEND || 5401);
const JOURNAL = new URL("./emails.log", import.meta.url).pathname;
const noter = (m) => appendFileSync(JOURNAL, `${new Date().toISOString()} ${m}\n`);

createServer((req, res) => {
  let corps = "";
  req.on("data", (c) => (corps += c));
  req.on("end", () => {
    let json = null;
    try { json = corps ? JSON.parse(corps) : null; } catch { /* corps non JSON */ }
    const lot = Array.isArray(json) ? json : json ? [json] : [];
    if (req.method === "POST" && /\/emails/.test(req.url)) {
      for (const m of lot) noter(`${req.url} à=${[m.to].flat().join(",")} objet=« ${m.subject ?? ""} »`);
    } else {
      noter(`${req.method} ${req.url}`);
    }
    res.writeHead(200, { "content-type": "application/json" });
    const id = () => randomUUID();
    res.end(JSON.stringify(/batch/.test(req.url) ? { data: lot.map(() => ({ id: id() })) } : { id: id(), object: "email" }));
  });
}).listen(PORT, "127.0.0.1", () => noter(`faux Resend à l'écoute sur ${PORT}`));
