/*! Deviens Marrant, La vanne du jour : crée l'iframe à la place de ce script, rien d'autre. */
(function () {
  var s = document.currentScript;
  if (!s || !s.parentNode) return;
  var f = document.createElement("iframe");
  f.src = new URL(s.src).origin + "/embed/vanne-du-jour";
  f.title = "La vanne du jour, Deviens Marrant";
  f.setAttribute("loading", "lazy");
  f.setAttribute("width", "100%");
  f.setAttribute("height", "240");
  f.setAttribute("sandbox", "allow-scripts allow-popups allow-popups-to-escape-sandbox");
  f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
  f.style.cssText = "border:0;display:block;width:100%;max-width:640px;height:240px";
  s.parentNode.insertBefore(f, s);
  window.addEventListener("message", function (e) {
    if (e.source !== f.contentWindow || !e.data || e.data.type !== "dm-vanne-hauteur") return;
    var h = parseInt(e.data.h, 10);
    // Agrandit seulement (jamais de décalage vers le haut chez l'hôte), 900 px au plus.
    if (h > f.offsetHeight && h <= 900) f.style.height = h + "px";
  });
})();
