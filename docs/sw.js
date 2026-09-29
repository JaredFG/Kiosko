// Service worker: guarda toda la app para que funcione sin internet.
// Al cambiar cualquier archivo, sube el número de VERSION para que las tablets se actualicen.
const VERSION = "v1";
const CACHE = "amesa-" + VERSION;
const ARCHIVOS = [
  "./",
  "app.js",
  "assets/images/amesa-logo.png",
  "assets/images/placeholder-1-1.svg",
  "assets/images/placeholder-1-2.svg",
  "assets/images/placeholder-1-3.svg",
  "assets/images/placeholder-2-1.svg",
  "assets/images/placeholder-2-2.svg",
  "assets/images/placeholder-2-3.svg",
  "assets/images/placeholder-3-1.svg",
  "assets/images/placeholder-3-2.svg",
  "assets/images/placeholder-3-3.svg",
  "assets/images/qr-amesa-abb.png",
  "assets/images/tableros-home/banco-capacitores.jpg",
  "assets/images/tableros-home/ccm.jpg",
  "assets/images/tableros-home/facilidades-temporales.jpg",
  "assets/images/tableros-home/pro-e-power.jpg",
  "assets/images/tableros-home/protecta.jpg",
  "assets/images/tableros-home/seccionador.jpg",
  "assets/images/tableros-home/system-pro-energy.jpg",
  "assets/images/tableros-home/tmax-link.jpg",
  "assets/images/tableros-home/transformador-hammond.jpg",
  "assets/images/tableros/banco-capacitores-1.png",
  "assets/images/tableros/banco-capacitores-recomendaciones.png",
  "assets/images/tableros/ccm-1.png",
  "assets/images/tableros/ccm-recomendaciones.png",
  "assets/images/tableros/facilidades-temporales-1.png",
  "assets/images/tableros/facilidades-temporales-recomendaciones.png",
  "assets/images/tableros/pro-e-power-1.png",
  "assets/images/tableros/pro-e-power-recomendaciones.png",
  "assets/images/tableros/protecta-1.png",
  "assets/images/tableros/protecta-recomendaciones.png",
  "assets/images/tableros/seccionador-ficha-1.png",
  "assets/images/tableros/system-pro-energy-1.png",
  "assets/images/tableros/system-pro-energy-recomendaciones.png",
  "assets/images/tableros/tmax-link-1.png",
  "assets/images/tableros/tmax-link-recomendaciones.png",
  "assets/images/tableros/transformador-hammond-1.png",
  "assets/images/tableros/transformador-hammond-2.png",
  "assets/images/tableros/transformador-hammond-3.png",
  "assets/images/tableros/transformador-hammond-4.png",
  "assets/images/tableros/transformador-hammond-recomendaciones.png",
  "content.js",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "index.html",
  "manifest.webmanifest",
  "styles.css",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((r) => r || fetch(e.request)));
});
