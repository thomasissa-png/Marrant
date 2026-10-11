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
 */
export function buildUmamiBeforeSendScript(previewPath: string): string {
  return [
    "window.marrantUmamiBeforeSend=function(t,p){",
    `var a=${JSON.stringify(previewPath)},l=location.pathname;`,
    'if(l===a||l.indexOf(a+"/")===0)return false;',
    "if(!p)return p;",
    "var c=function(u){",
    'if(typeof u!=="string")return u;',
    'var i=u.indexOf("?");if(i<0)return u;',
    'var b=u.slice(0,i),h=u.slice(i+1),k=h.indexOf("#");if(k>=0)h=h.slice(0,k);',
    "if(/\\/reset-password\\/?$/.test(b))return b;",
    'var q=h.split("&").filter(function(x){return!/^(token|email)=/i.test(x)}).join("&");',
    'return q?b+"?"+q:b};',
    "p.url=c(p.url);p.referrer=c(p.referrer);return p};",
  ].join("");
}
