// gallery.js
// Funcionamiento de la galeria interactiva (galeria.html):
// filtro por categoria y vista ampliada en un modal de Bootstrap.

document.addEventListener("DOMContentLoaded", function () {
  activarFiltros();
  activarModalAmpliado();
});

// Al hacer clic en un boton de categoria, muestra solo los items
// de esa categoria (o todos si se elige "Todas").
function activarFiltros() {
  const botones = document.querySelectorAll(".filtro-galeria button");
  const items = document.querySelectorAll(".item-galeria");

  botones.forEach(function (boton) {
    boton.addEventListener("click", function () {
      botones.forEach(function (b) { b.classList.remove("activo"); });
      boton.classList.add("activo");

      const categoria = boton.getAttribute("data-categoria");

      items.forEach(function (item) {
        const coincide = categoria === "todas" || item.getAttribute("data-categoria") === categoria;
        item.classList.toggle("oculto", !coincide);
      });
    });
  });
}

// Al hacer clic sobre una miniatura, carga la imagen ampliada,
// el titulo, la descripcion y el credito dentro del modal.
function activarModalAmpliado() {
  const items = document.querySelectorAll(".item-galeria");
  const modalImagen = document.getElementById("modal-imagen-ampliada");
  const modalTitulo = document.getElementById("modal-titulo-imagen");
  const modalDescripcion = document.getElementById("modal-descripcion-imagen");
  const modalCredito = document.getElementById("modal-credito-imagen");

  if (!modalImagen) return;

  items.forEach(function (item) {
    item.addEventListener("click", function () {
      const img = item.querySelector("img");
      modalImagen.src = img.getAttribute("src");
      modalImagen.alt = img.getAttribute("alt");
      modalTitulo.textContent = item.getAttribute("data-titulo") || "";
      modalDescripcion.textContent = item.getAttribute("data-descripcion") || "";
      modalCredito.textContent = item.getAttribute("data-credito") || "";
    });
  });
}
