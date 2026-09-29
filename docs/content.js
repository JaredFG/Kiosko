/**
 * CONTENIDO DEL KIOSCO — AMESA
 * ---------------------------------------------------
 * Edita este archivo para cambiar los tableros, sus nombres
 * o el orden en que aparecen. No necesitas tocar nada más.
 *
 * El ORDEN de este arreglo es el orden en que salen los botones
 * (y la letra A, B, C... se asigna sola según esa posición) —
 * cuando confirmen el acomodo real de la maqueta, solo reordena
 * estos bloques, no hace falta cambiar nada en app.js.
 *
 * Cada tablero:
 *   id:       identificador único, no lo repitas
 *   label:    nombre que se ve en el botón y en el visor
 *   category: texto corto que sale sobre el nombre en el tile de
 *             inicio (tipo de tablero)
 *   desc:     resumen de 1-2 líneas que solo se ve cuando este tablero
 *             es el "destacado" (el tile grande que rota solo, ver
 *             ROTATE_MS en app.js) — opcional, si falta simplemente no
 *             sale nada extra
 *   homeImg:  foto real del tablero, usada como fondo del botón de
 *             inicio — null si todavía no hay foto (se ve como
 *             tile plano en vez de foto rota)
 *   docs:     documentos que se pueden ver de este tablero. Cada
 *             uno sale como un botón dentro del visor ("Ficha
 *             técnica", "Recomendaciones", etc.) — agrega los que
 *             hagan falta, no hay límite.
 *     key:    identificador único dentro del tablero
 *     label:  texto del botón
 *     images: rutas de las imágenes que se muestran, en orden, una
 *             debajo de otra con scroll (varias imágenes = varias
 *             páginas de un mismo PDF, como en Transformador Hammond)
 *   pending:  true si no hay material todavía (ni foto ni docs) —
 *             avisa "contenido próximamente" en vez de mostrar algo roto
 * ---------------------------------------------------
 */
const CONTENT = {
  tableros: [
    {
      id: "pro-e-power",
      label: "Pro E Power",
      category: "Distribución",
      desc: "Tablero de distribución autosoportado hasta 6300 A y 120 kA de ICC, para centros de datos, plantas industriales y CCM.",
      homeImg: "assets/images/tableros-home/pro-e-power.jpg",
      docs: [
        { key: "ficha", label: "Ficha técnica", images: ["assets/images/tableros/pro-e-power-1.png"] },
        { key: "recomendaciones", label: "Recomendaciones", images: ["assets/images/tableros/pro-e-power-recomendaciones.png"] },
      ],
    },
    {
      id: "tmax-link",
      label: "TMAX Link",
      category: "Distribución",
      desc: "Tablero de distribución con interruptores ABB Tmax, para instalaciones industriales y comerciales de alta capacidad.",
      homeImg: "assets/images/tableros-home/tmax-link.jpg",
      docs: [
        { key: "ficha", label: "Ficha técnica", images: ["assets/images/tableros/tmax-link-1.png"] },
        { key: "recomendaciones", label: "Recomendaciones", images: ["assets/images/tableros/tmax-link-recomendaciones.png"] },
      ],
    },
    {
      id: "protecta",
      label: "Protecta",
      category: "Alumbrado",
      desc: "Gabinete de alumbrado ABB Protecta, montaje en pared, para distribución de cargas y circuitos de iluminación.",
      homeImg: "assets/images/tableros-home/protecta.jpg",
      docs: [
        { key: "ficha", label: "Ficha técnica", images: ["assets/images/tableros/protecta-1.png"] },
        { key: "recomendaciones", label: "Recomendaciones", images: ["assets/images/tableros/protecta-recomendaciones.png"] },
      ],
    },
    {
      id: "facilidades-temporales",
      label: "Facilidades Temporales",
      category: "Temporal",
      desc: "Distribuye energía de forma segura a herramientas, iluminación, grúas y otros equipos en sitios de construcción.",
      homeImg: "assets/images/tableros-home/facilidades-temporales.jpg",
      docs: [
        { key: "ficha", label: "Ficha técnica", images: ["assets/images/tableros/facilidades-temporales-1.png"] },
        { key: "recomendaciones", label: "Recomendaciones", images: ["assets/images/tableros/facilidades-temporales-recomendaciones.png"] },
      ],
    },
    {
      id: "transformador-hammond",
      label: "Transformador Hammond",
      category: "Transformador",
      desc: "Transformadores de distribución Hammond Power Solutions, energéticamente eficientes para baja tensión.",
      homeImg: "assets/images/tableros-home/transformador-hammond.jpg",
      docs: [
        {
          key: "ficha",
          label: "Ficha técnica",
          images: [
            "assets/images/tableros/transformador-hammond-1.png",
            "assets/images/tableros/transformador-hammond-2.png",
            "assets/images/tableros/transformador-hammond-3.png",
            "assets/images/tableros/transformador-hammond-4.png",
          ],
        },
        { key: "recomendaciones", label: "Recomendaciones", images: ["assets/images/tableros/transformador-hammond-recomendaciones.png"] },
      ],
    },
    {
      id: "banco-capacitores",
      label: "Banco de Capacitores",
      category: "Compensación reactiva",
      desc: "Corrige el factor de potencia y reduce pérdidas de energía en la instalación eléctrica.",
      homeImg: "assets/images/tableros-home/banco-capacitores.jpg",
      docs: [
        { key: "ficha", label: "Ficha técnica", images: ["assets/images/tableros/banco-capacitores-1.png"] },
        { key: "recomendaciones", label: "Recomendaciones", images: ["assets/images/tableros/banco-capacitores-recomendaciones.png"] },
      ],
    },
    {
      id: "ccm",
      label: "CCM",
      category: "Control de motores",
      desc: "Centros de control de motores para industria manufacturera, hoteles y data centers.",
      homeImg: "assets/images/tableros-home/ccm.jpg",
      docs: [
        { key: "ficha", label: "Ficha técnica", images: ["assets/images/tableros/ccm-1.png"] },
        { key: "recomendaciones", label: "Recomendaciones", images: ["assets/images/tableros/ccm-recomendaciones.png"] },
      ],
    },
    {
      id: "system-pro-energy",
      label: "System Pro Energy",
      category: "Alumbrado y subdistribución",
      desc: "Tablero de alumbrado y subdistribución System Pro, para instalaciones interiores de mediana capacidad.",
      homeImg: "assets/images/tableros-home/system-pro-energy.jpg",
      docs: [
        { key: "ficha", label: "Ficha técnica", images: ["assets/images/tableros/system-pro-energy-1.png"] },
        { key: "recomendaciones", label: "Recomendaciones", images: ["assets/images/tableros/system-pro-energy-recomendaciones.png"] },
      ],
    },
    {
      id: "seccionador",
      label: "Seccionador",
      category: "Subterráneo y de pedestal",
      desc: "Seccionadores Elastimold subterráneos y de pedestal, hasta 38 kV, para redes de distribución de múltiples vías.",
      homeImg: "assets/images/tableros-home/seccionador.jpg",
      docs: [
        { key: "ficha", label: "Ficha técnica", images: ["assets/images/tableros/seccionador-ficha-1.png"] },
      ],
    },
  ],
};
