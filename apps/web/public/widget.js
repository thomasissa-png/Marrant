/*! Deviens Marrant, La vanne du jour : crée l'iframe à la place de ce script, rien d'autre. */
(function () {
  var s = document.currentScript;
  if (!s || !s.parentNode) return;
  var t = s.getAttribute("data-theme");
  var f = document.createElement("iframe");
  f.src = new URL(s.src).origin + "/embed/vanne-du-jour" + (t === "clair" || t === "sombre" ? "?theme=" + t : "");
  f.title = "La vanne du jour, Deviens Marrant";
  f.setAttribute("loading", "lazy");
  f.setAttribute("width", "100%");
  f.setAttribute("height", "504");
  f.setAttribute("sandbox", "allow-scripts allow-popups allow-popups-to-escape-sandbox");
  f.style.cssText = "border:0;border-radius:12px;color-scheme:light dark;display:block;width:100%;max-width:640px;height:504px";
  s.parentNode.insertBefore(f, s);
  // Message envoyé seulement après le clic sur « Révéler la chute », si la chute dépasse
  // (texte agrandi) : agrandit seulement, jamais au chargement, plafonné à 900 px.
  window.addEventListener("message", function (e) {
    if (e.source !== f.contentWindow || !e.data || e.data.type !== "dm-vanne-hauteur") return;
    var h = parseInt(e.data.h, 10);
    if (h > f.offsetHeight) f.style.height = (h <= 900 ? h : 900) + "px";
  });
})();
