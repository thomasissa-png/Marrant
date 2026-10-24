/**
 * Script en ligne de la page d'iframe /embed/vanne-du-jour (s22).
 *
 * Format CommonJS : next.config.js en calcule l'empreinte SHA-256 pour la CSP
 * de /embed/* (`script-src 'sha256-…'`), la route l'insère tel quel. Toute
 * modification de ce texte change l'empreinte automatiquement (même source).
 *
 * Rôle : masquer la chute derrière le bouton (sans JavaScript, tout reste
 * visible), compléter `utm_content` avec le domaine hôte (document.referrer,
 * origine seule), envoyer la hauteur au script chargeur (un entier, rien d'autre).
 */
const EMBED_INLINE_SCRIPT =
  '(function(){var d=document,r=d.documentElement,b=d.getElementById("b"),c=d.getElementById("c");' +
  'r.className+=" js";var h=null;' +
  'try{h=new URL(d.referrer).hostname.toLowerCase().replace(/^www\\./,"")}catch(e){}' +
  'if(h){var l=d.querySelectorAll("a[data-utm]");for(var i=0;i<l.length;i++){' +
  'var u=new URL(l[i].href);u.searchParams.set("utm_content",h);l[i].href=u.toString()}}' +
  'function p(){try{parent.postMessage({type:"dm-vanne-hauteur",h:Math.ceil(d.body.getBoundingClientRect().height)},"*")}catch(e){}}' +
  'if(b&&c){b.addEventListener("click",function(){r.className+=" ouvert";b.setAttribute("aria-expanded","true");c.focus();p()})}' +
  'p();window.addEventListener("resize",p)})();';

module.exports = { EMBED_INLINE_SCRIPT };
