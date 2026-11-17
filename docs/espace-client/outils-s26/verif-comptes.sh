#!/bin/bash
# Vérification EN LECTURE SEULE de la page de test : connexion + GET des pages, par compte.
set -uo pipefail
URL=https://marrant-preversion.thomas-issa.workers.dev
D=$(dirname "$(readlink -f "$0")")/verif
mkdir -p "$D"
PAGES="/mon-espace /mon-espace/s-entrainer /parcours /favoris /profil /lettre /carnet"
for compte in abonne-en-cours nouvel-abonne inscrit-gratuit; do
  j="$D/$compte.cookies"; rm -f "$j"
  echo "== $compte@preversion.test"
  csrf=$(curl -sS -c "$j" -b "$j" "$URL/api/auth/csrf" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).csrfToken))')
  rep=$(curl -sS -o /dev/null -w '%{http_code}' -c "$j" -b "$j" -X POST "$URL/api/auth/callback/credentials" \
    --data-urlencode "csrfToken=$csrf" --data-urlencode "email=$compte@preversion.test" \
    --data-urlencode "password=preversion-s24" --data-urlencode "callbackUrl=$URL/mon-espace" --data-urlencode "json=true")
  sess=$(curl -sS -b "$j" "$URL/api/auth/session" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const o=JSON.parse(s);console.log(o&&o.user&&o.user.email?"session ouverte ("+o.user.email+")":"AUCUNE session")}catch{console.log("session illisible")}})')
  echo "  connexion : POST $rep ; $sess"
  for p in $PAGES; do
    f="$D/$compte$(echo "$p" | tr '/' '_').html"
    h=$(curl -sS -o "$f" -D - -w 'CODE:%{http_code}' -b "$j" "$URL$p")
    code=${h##*CODE:}
    robots=$(echo "$h" | grep -qi '^x-robots-tag: noindex, nofollow' && echo oui || echo NON)
    bande=$(grep -c 'data-bande-rubriques' "$f")
    loc=$(echo "$h" | grep -i '^location:' | tr -d '\r' | sed 's/^[Ll]ocation: //')
    extra=""
    if [ "$p" = /lettre ]; then
      n=$(grep -o 'data-lettre="[0-9]*"' "$f" | sort -u | wc -l)
      vide=$(grep -c "Tes lettres s.affichent ici" "$f")
      extra=" ; lettres : $n carte(s), état vide : $([ "$vide" -gt 0 ] && echo oui || echo non)"
    fi
    echo "  $p : $code ; bande : $([ "$bande" -gt 0 ] && echo oui || echo NON) ; X-Robots-Tag : $robots${loc:+ ; -> $loc}$extra"
  done
  rm -f "$j"
done
