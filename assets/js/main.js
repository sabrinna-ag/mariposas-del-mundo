// main.js
// Comportamientos generales del sitio: marcar el enlace activo del menu
// y mostrar el boton "volver arriba".

document.addEventListener("DOMContentLoaded", function () {
  marcarEnlaceActivo();
  activarBotonVolverArriba();
  cerrarMenuMovilAlNavegar();
});

// Cada subpagina pertenece a una seccion principal del menu. Se usa este
// mapa para que, por ejemplo, estando en "ciclo-de-vida.html" se resalte
// el enlace "Conocer" (y no se quede el menu sin ningun item marcado).
const SECCION_DE_LA_PAGINA = {
  "conocer.html": "conocer.html",
  "ciclo-de-vida.html": "conocer.html",
  "anatomia.html": "conocer.html",
  "especies.html": "especies.html",
  "mariposa-monarca.html": "especies.html",
  "mariposas-de-jardin.html": "especies.html",
  "habitat-jardines.html": "habitat-jardines.html",
  "plantas-nutricias.html": "habitat-jardines.html",
  "observacion-responsable.html": "habitat-jardines.html",
  "galeria.html": "galeria.html",
  "conservacion.html": "conservacion.html",
  "recursos.html": "recursos.html",
  "juego.html": "recursos.html"
};

// Recorre los enlaces del navbar y le agrega la clase "active" al que
// corresponda con la seccion de la pagina actual (aunque sea una subpagina).
function marcarEnlaceActivo() {
  const paginaActual = window.location.pathname.split("/").pop() || "index.html";
  const seccionActual = SECCION_DE_LA_PAGINA[paginaActual] || paginaActual;
  const enlaces = document.querySelectorAll(".navbar-mariposas .nav-link");

  enlaces.forEach(function (enlace) {
    const destino = enlace.getAttribute("href");
    if (destino === seccionActual) {
      enlace.classList.add("active");
    }
  });
}

// Muestra un boton flotante para volver al inicio de la pagina
// cuando el usuario baja mas de 400px.
function activarBotonVolverArriba() {
  const boton = document.getElementById("btn-volver-arriba");
  if (!boton) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      boton.classList.remove("d-none");
    } else {
      boton.classList.add("d-none");
    }
  });

  boton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// En celular, el menu principal queda desplegado (clase "show") hasta que
// se lo vuelve a tocar. Esto cierra el menu automaticamente al elegir un
// enlace, para que la navegacion se sienta mas fluida.
function cerrarMenuMovilAlNavegar() {
  const menu = document.getElementById("navbarPrincipal");
  if (!menu) return;

  const enlaces = menu.querySelectorAll("a");
  enlaces.forEach(function (enlace) {
    enlace.addEventListener("click", function () {
      if (menu.classList.contains("show")) {
        const menuBootstrap = bootstrap.Collapse.getOrCreateInstance(menu);
        menuBootstrap.hide();
      }
    });
  });
}
