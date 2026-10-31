"""Search Console en lecture seule (compte de service search-console@deviens-marrant).

Clé : fichier JSON « deviens-marrant-011ea7ef705a.json » du Drive de Thomas, à télécharger
hors du dépôt (ex. /tmp/gsc/key.json, chmod 600), chemin dans GSC_KEY_FILE. Jamais commitée,
jamais affichée. Usage : python3 -I scripts/seo/gsc.py (liste les propriétés) ou import de sa()/api()."""
import base64, json, sys, time, urllib.request
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

import os
KEY = os.environ.get("GSC_KEY_FILE", "/tmp/gsc/key.json")
SITE = "sc-domain:deviens-marrant.fr"


def b64(b):
    return base64.urlsafe_b64encode(b).rstrip(b"=").decode()


def token():
    d = json.load(open(KEY))
    now = int(time.time())
    head = b64(json.dumps({"alg": "RS256", "typ": "JWT"}).encode())
    claim = b64(json.dumps({
        "iss": d["client_email"], "scope": "https://www.googleapis.com/auth/webmasters.readonly",
        "aud": d["token_uri"], "iat": now, "exp": now + 3600}).encode())
    k = serialization.load_pem_private_key(d["private_key"].encode(), None)
    sig = b64(k.sign(f"{head}.{claim}".encode(), padding.PKCS1v15(), hashes.SHA256()))
    body = f"grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion={head}.{claim}.{sig}".encode()
    r = urllib.request.urlopen(urllib.request.Request(d["token_uri"], data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"}))
    return json.load(r)["access_token"]


TOK = None


def api(path, payload=None):
    global TOK
    TOK = TOK or token()
    url = "https://searchconsole.googleapis.com/" + path if path.startswith("v1") else \
        "https://www.googleapis.com/webmasters/v3/" + path
    req = urllib.request.Request(url, data=json.dumps(payload).encode() if payload else None,
        headers={"Authorization": "Bearer " + TOK, "Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req))


def sa(start, end, dims, limit=1000, filters=None):
    p = {"startDate": start, "endDate": end, "dimensions": dims, "rowLimit": limit}
    if filters:
        p["dimensionFilterGroups"] = [{"filters": filters}]
    site = urllib.parse.quote(SITE, safe="")
    return api(f"sites/{site}/searchAnalytics/query", p).get("rows", [])


import urllib.parse  # noqa: E402

if __name__ == "__main__":
    print(json.dumps(api("sites"), ensure_ascii=False)[:500])
