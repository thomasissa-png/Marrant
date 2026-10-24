/**
 * Script en ligne de la page d'iframe /embed/vanne-du-jour (s22).
 *
 * Format CommonJS : next.config.js en calcule l'empreinte SHA-256 pour la CSP
 * de /embed/vanne-du-jour (`script-src 'sha256-…'`), la route l'insère tel
 * quel. Toute modification de ce texte change l'empreinte automatiquement.
 *
 * Rôle :
 * - masquer la chute derrière le bouton (sans JavaScript, tout reste visible) ;
 * - compléter `utm_content` avec le domaine hôte (document.referrer, origine
 *   seule) ; sur le site lui-même (aperçu de la page du programme), retirer les
 *   UTM : un lien interne ne doit pas compter comme un clic de widget ;
 * - APRÈS le clic seulement, si la chute ne tient pas dans la hauteur réservée
 *   (texte agrandi), envoyer la hauteur nécessaire au script chargeur (un
 *   entier). Jamais au chargement : aucun décalage de la page hôte sans action.
 */
const EMBED_INLINE_SCRIPT =
  '(function(){var d=document,r=d.documentElement,b=d.getElementById("b"),c=d.getElementById("c"),' +
  'k=d.getElementById("k"),m=d.querySelector("main");r.className+=" js";var h=null;' +
  'try{h=new URL(d.referrer).hostname.toLowerCase().replace(/^www\\./,"").replace(/\\.$/,"")}catch(e){}' +
  'var l=d.querySelectorAll("a[data-utm]");for(var i=0;i<l.length;i++){var u=new URL(l[i].href);' +
  'if(h==="deviens-marrant.fr")u.search="";else if(h)u.searchParams.set("utm_content",h);l[i].href=u.toString()}' +
  'if(b&&c&&k&&m){b.addEventListener("click",function(){r.className+=" ouvert";b.setAttribute("aria-expanded","true");c.focus();' +
  'var n=Math.ceil(m.offsetHeight-k.clientHeight+k.scrollHeight);' +
  'if(n>m.offsetHeight){try{parent.postMessage({type:"dm-vanne-hauteur",h:n},"*")}catch(e){}}})}})();';

module.exports = { EMBED_INLINE_SCRIPT };
