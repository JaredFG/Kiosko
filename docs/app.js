/**
 * APP DEL KIOSCO — navegación, modo pantalla completa y reproducción.
 * No necesitas editar este archivo para cambiar contenido: eso va en content.js
 */
(function () {
  "use strict";

  const IDLE_TIMEOUT_MS = 2 * 60 * 1000; // vuelve sola al inicio tras 2 min sin toques (feria, sin staff pendiente)
  const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // el destacado del inicio es fijo: siempre el primer tablero de content.js
  // (antes rotaba solo cada rato; el cliente pidió quitarlo y dejarlo fijo)
  const FEATURED_INDEX = 0;
  const state = { view: "home", tableroId: null, activeDocKey: null };
  let idleTimer = null;

  const els = {
    screens: {
      home: document.getElementById("screenHome"),
      viewer: document.getElementById("screenViewer"),
    },
    tableroGrid: document.getElementById("tableroGrid"),
    viewerTabs: document.getElementById("viewerTabs"),
    viewerStage: document.getElementById("viewerStage"),
    viewerFooter: document.getElementById("viewerFooter"),
    railPath: document.getElementById("railPath"),
    railGlow: document.getElementById("railGlow"),
    railClock: document.getElementById("railClock"),
    railClose: document.getElementById("railClose"),
  };

  /* ---------------- Render: inicio ---------------- */
  // El primer tablero de content.js sale como "destacado" (más grande) —
  // fijo, no rota. La foto va en una <img> real (no background-image por
  // CSS) porque en el WebView del kiosco real un background-image puesto
  // por JS dentro de un <button> no se pintaba (aunque los <img> del visor
  // sí funcionan bien) — con <img> se comporta igual en todos lados.
  function renderHome() {
    const tableros = CONTENT.tableros;

    els.tableroGrid.innerHTML = "";
    // va primero en el DOM a propósito: así se pinta ANTES que las
    // tarjetas y sus líneas solo se alcanzan a ver en los huecos reales
    // entre ellas (ver renderGridDividers).
    const dividers = document.createElement("div");
    dividers.className = "grid-dividers";
    els.tableroGrid.appendChild(dividers);

    tableros.forEach((tablero, i) => {
      const isFeatured = i === FEATURED_INDEX;
      const tile = document.createElement("div");
      tile.className =
        "tile--tablero" + (isFeatured ? " tile--feature" : "") + (tablero.pending ? " tile--pending" : "");
      tile.setAttribute("role", "button");
      tile.setAttribute("tabindex", "0");

      if (tablero.pending) {
        tile.innerHTML = `
          <div class="tile-letter">${LETTERS[i] || "•"}</div>
          <div class="tile-body"><p class="tile-label">${tablero.label}</p></div>
          <div class="tile-tag">Próximamente</div>
        `;
      } else {
        tile.innerHTML = `
          <img class="tile-photo" src="${tablero.homeImg}" alt="" aria-hidden="true">
          <div class="tile-shade"></div>
          <div class="tile-letter">${LETTERS[i] || "•"}</div>
          <div class="tile-body">
            <p class="tile-eyebrow">${tablero.category || ""}</p>
            <p class="tile-label">${tablero.label}</p>
            ${isFeatured && tablero.desc ? `<p class="tile-desc">${tablero.desc}</p>` : ""}
          </div>
        `;
      }
      tile.addEventListener("click", () => goToTablero(tablero.id));
      tile.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goToTablero(tablero.id); }
      });
      els.tableroGrid.appendChild(tile);
    });

    // se pide en el siguiente frame: hace falta que el navegador ya haya
    // calculado el tamaño real de columnas/filas antes de medirlas
    requestAnimationFrame(renderGridDividers);
  }

  // Coloca las líneas divisorias del pasillo justo al centro del hueco
  // real entre columnas/filas — mide los tamaños de columna y fila que
  // el navegador YA calculó (getComputedStyle resuelve el 1fr a píxeles
  // reales), así siempre queda centrado sin importar cuántas columnas/
  // filas haya o si el tamaño de alguna cambia (ej. el destacado 2x2).
  function renderGridDividers() {
    const grid = els.tableroGrid;
    const dividers = grid.querySelector(".grid-dividers");
    if (!dividers) return;
    dividers.innerHTML = "";

    const cs = getComputedStyle(grid);
    const cols = cs.gridTemplateColumns.split(" ").map(parseFloat).filter((n) => !isNaN(n));
    const rows = cs.gridTemplateRows.split(" ").map(parseFloat).filter((n) => !isNaN(n));
    const gapX = parseFloat(cs.columnGap) || 0;
    const gapY = parseFloat(cs.rowGap) || 0;

    let x = 0;
    for (let i = 0; i < cols.length - 1; i++) {
      x += cols[i];
      const line = document.createElement("div");
      line.className = "grid-divider grid-divider--v";
      line.style.left = `${x + gapX / 2}px`;
      dividers.appendChild(line);
      x += gapX;
    }

    let y = 0;
    for (let i = 0; i < rows.length - 1; i++) {
      y += rows[i];
      const line = document.createElement("div");
      line.className = "grid-divider grid-divider--h";
      line.style.top = `${y + gapY / 2}px`;
      dividers.appendChild(line);
      y += gapY;
    }
  }

  // si la ventana cambia de tamaño (o gira de orientación), las líneas
  // hay que recalcularlas — están en píxeles fijos, no son relativas
  let dividersResizeTimer = null;
  window.addEventListener("resize", () => {
    if (state.view !== "home") return;
    clearTimeout(dividersResizeTimer);
    dividersResizeTimer = setTimeout(renderGridDividers, 150);
  });

  /* ---------------- Render: visor ---------------- */
  // Un tablero puede traer varios documentos (ficha técnica,
  // recomendaciones...) — se arma un botón por cada uno en viewer-tabs
  // y el que esté activo se pinta en viewer-stage, apilando todas sus
  // imágenes con scroll propio (si no caben completas en pantalla).
  function renderViewer(tablero) {
    const docs = tablero.docs || [];

    if (tablero.pending || docs.length === 0) {
      els.viewerTabs.innerHTML = "";
      els.viewerTabs.classList.add("is-hidden");
      els.viewerStage.innerHTML = `<div class="viewer-error">Contenido próximamente</div>`;
      els.viewerFooter.classList.add("is-hidden");
      return;
    }

    if (!state.activeDocKey || !docs.some((d) => d.key === state.activeDocKey)) {
      state.activeDocKey = docs[0].key;
    }

    els.viewerTabs.classList.toggle("is-hidden", docs.length < 2);
    els.viewerTabs.innerHTML = docs
      .map(
        (d) =>
          `<button class="viewer-tab${d.key === state.activeDocKey ? " is-active" : ""}" data-doc="${d.key}">${d.label}</button>`
      )
      .join("");

    renderActiveDoc(tablero);
    els.viewerFooter.classList.remove("is-hidden");
  }

  function renderActiveDoc(tablero) {
    const doc = (tablero.docs || []).find((d) => d.key === state.activeDocKey);
    els.viewerStage.innerHTML = "";
    els.viewerStage.scrollTop = 0;
    if (!doc) {
      els.viewerStage.innerHTML = `<div class="viewer-error">Contenido próximamente</div>`;
      return;
    }
    const wrap = document.createElement("div");
    wrap.className = "viewer-doc";
    doc.images.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `${tablero.label} — ${doc.label}`;
      img.onerror = () => {
        wrap.innerHTML = `<div class="viewer-error">No se pudo cargar la imagen</div>`;
      };
      wrap.appendChild(img);
    });
    els.viewerStage.appendChild(wrap);
  }

  els.viewerTabs.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-doc]");
    if (!btn) return;
    const t = getTablero(state.tableroId);
    if (!t) return;
    state.activeDocKey = btn.dataset.doc;
    renderViewer(t);
  });

  /* ---------------- Rail (breadcrumb) ---------------- */
  function renderRail() {
    const crumbs = [{ key: "home", label: "INICIO" }];
    if (state.tableroId) {
      const t = getTablero(state.tableroId);
      if (t) crumbs.push({ key: "viewer", label: t.label.toUpperCase() });
    }
    els.railPath.innerHTML = crumbs
      .map((c, i) => {
        const isActive = i === crumbs.length - 1 ? "is-active" : "";
        return `<span class="rail-crumb ${isActive}" data-crumb="${c.key}">${c.label}</span>`;
      })
      .join("");
  }

  /* ---------------- Navegación ---------------- */
  function getTablero(id) {
    return CONTENT.tableros.find((t) => t.id === id);
  }

  function showScreen(name) {
    Object.entries(els.screens).forEach(([key, el]) => {
      el.classList.toggle("is-active", key === name);
    });
    els.railClose.classList.toggle("show", name === "viewer");
  }

  function goHome(pushHistory = true) {
    state.view = "home";
    state.tableroId = null;
    els.railGlow.style.background =
      "linear-gradient(90deg, var(--accent) 0%, transparent 60%)";
    renderHome();
    renderRail();
    showScreen("home");
    if (pushHistory) history.pushState({ view: "home" }, "");
  }

  function goToTablero(id, pushHistory = true) {
    const t = getTablero(id);
    if (!t) return;
    state.view = "viewer";
    state.tableroId = id;
    state.activeDocKey = null; // siempre abre en el primer documento
    renderViewer(t);
    renderRail();
    showScreen("viewer");
    els.railGlow.style.background =
      "linear-gradient(90deg, var(--accent-hi) 0%, transparent 60%)";
    if (pushHistory) history.pushState({ view: "viewer", tableroId: id }, "");
  }

  function goBack() {
    goHome();
  }

  // Botón físico "Atrás" de Android (y gesto atrás en WebView/Capacitor)
  window.addEventListener("popstate", (e) => {
    const s = e.state;
    if (!s || s.view === "home") goHome(false);
    else if (s.view === "viewer") goToTablero(s.tableroId, false);
  });

  document.body.addEventListener("click", (e) => {
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;
    if (action === "go-home") goHome();
    if (action === "go-back") goBack();
  });

  /* ---------------- Reloj ---------------- */
  function tickClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    els.railClock.textContent = `${hh}:${mm}`;
  }
  setInterval(tickClock, 1000 * 10);

  /* ---------------- Modo reposo (idle) ----------------
     Pensado para feria sin encargado fijo: no pide confirmación,
     simplemente regresa sola al inicio tras IDLE_TIMEOUT_MS quieta. */
  function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (state.view !== "home") goHome();
    }, IDLE_TIMEOUT_MS);
  }
  // OJO: "mousemove" se quitó a propósito — en la pantalla táctil real del
  // kiosco el driver del panel dispara eventos mousemove fantasma sin que
  // nadie toque nada, lo que reseteaba el timer para siempre y el kiosco
  // nunca volvía sola al inicio. "scroll" va con capture:true porque no
  // burbujea solo (hace falta para detectar scroll dentro de una ficha).
  ["touchstart", "touchmove", "click", "scroll"].forEach((evt) =>
    document.addEventListener(evt, resetIdleTimer, { passive: true, capture: true })
  );

  /* ---------------- Modo kiosco: pantalla completa ---------------- */
  function requestKioskFullscreen() {
    const el = document.documentElement;
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;
    if (req) {
      req.call(el).catch(() => {
        /* algunos WebView bloquean la API; se resuelve a nivel nativo, ver README */
      });
    }
  }
  // La API de fullscreen normalmente requiere un gesto del usuario.
  document.addEventListener(
    "click",
    function onFirstTap() {
      requestKioskFullscreen();
      document.removeEventListener("click", onFirstTap);
    },
    { once: true }
  );

  document.addEventListener("contextmenu", (e) => e.preventDefault());

  /* ---------------- Arranque ---------------- */
  history.replaceState({ view: "home" }, "");
  tickClock();
  resetIdleTimer();
  goHome(false);
})();
