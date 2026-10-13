/**
 * Filtre `data-before-send` du tracker Umami (`window.marrantUmamiBeforeSend`),
 * injecté tel quel dans le <head> par app/layout.tsx (script inline, ES5).
 *
 * - /blog/apercu : aucun envoi (vues et événements) ;
 * - s16 reco 15 : jamais de jeton de réinitialisation chez Umami. Sur
 *   /reset-password la query string est retirée entière ; ailleurs, les
 *   paramètres `token` et `email` sont retirés. Appliqué à `url` ET à
 *   `referrer` (Umami réutilise l'URL précédente, query comprise, comme
 *   référent de la vue suivante).
 * - s20 (audit conversion, lot 0) : exclusion du trafic interne. `?ne-pas-compter=1`
 *   pose `localStorage["umami.disabled"] = "1"` (respecté nativement par le tracker
 *   Umami et vérifié ici), `?compter=1` l'enlève. Exécuté à la définition du filtre,
 *   donc AVANT le tracker (chargé en defer) : la vue de la page elle-même n'est pas
 *   comptée. Stockage indisponible (navigation privée stricte) : ignoré, rien ne casse.
 *   Les deux paramètres sont retirés des URL envoyées.
 */
export function buildUmamiBeforeSendScript(previewPath: string): string {
  return [
    "(function(){try{var s=location.search;",
    'if(/[?&]ne-pas-compter=1(&|$)/.test(s))localStorage.setItem("umami.disabled","1");',
    'else if(/[?&]compter=1(&|$)/.test(s))localStorage.removeItem("umami.disabled")}catch(e){}})();',
    "window.marrantUmamiBeforeSend=function(t,p){",
    `var a=${JSON.stringify(previewPath)},l=location.pathname;`,
    'if(l===a||l.indexOf(a+"/")===0)return false;',
    'try{if(localStorage.getItem("umami.disabled"))return false}catch(e){}',
    "if(!p)return p;",
    "var c=function(u){",
    'if(typeof u!=="string")return u;',
    'var i=u.indexOf("?");if(i<0)return u;',
    'var b=u.slice(0,i),h=u.slice(i+1),k=h.indexOf("#");if(k>=0)h=h.slice(0,k);',
    "if(/\\/reset-password\\/?$/.test(b))return b;",
    'var q=h.split("&").filter(function(x){return!/^(token|email|ne-pas-compter|compter)=/i.test(x)}).join("&");',
    'return q?b+"?"+q:b};',
    "p.url=c(p.url);p.referrer=c(p.referrer);return p};",
  ].join("");
}
