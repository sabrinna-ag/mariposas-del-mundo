// form.js
// Validacion del formulario de contacto (contacto.html) y armado
// del envio de mail mediante un enlace "mailto" con los datos completados.

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("form-contacto");
  if (!formulario) return;

  const mensajeExito = document.getElementById("mensaje-exito");
  const mensajeError = document.getElementById("mensaje-error");

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const errores = validarFormulario(formulario);
    limpiarErrores(formulario);

    if (errores.length > 0) {
      mostrarErrores(errores);
      mensajeExito.classList.remove("mostrar");
      mensajeError.classList.add("mostrar");
      return;
    }

    mensajeError.classList.remove("mostrar");
    enviarPorMail(formulario);
    mensajeExito.classList.add("mostrar");
    formulario.reset();
    formulario.classList.remove("was-validated");
  });
});

// Valida los campos obligatorios del formulario y devuelve
// un arreglo con los mensajes de error encontrados.
function validarFormulario(formulario) {
  const errores = [];

  const nombre = formulario.nombre.value.trim();
  const apellido = formulario.apellido.value.trim();
  const email = formulario.email.value.trim();
  const asunto = formulario.asunto.value;
  const mensaje = formulario.mensaje.value.trim();

  if (nombre.length < 2) {
    errores.push({ campo: "nombre", texto: "El nombre debe tener al menos 2 caracteres." });
  }
  if (apellido.length < 2) {
    errores.push({ campo: "apellido", texto: "El apellido debe tener al menos 2 caracteres." });
  }
  if (!validarEmail(email)) {
    errores.push({ campo: "email", texto: "Ingresa un correo electronico valido." });
  }
  if (asunto === "") {
    errores.push({ campo: "asunto", texto: "Selecciona un motivo de contacto." });
  }
  if (mensaje.length < 20) {
    errores.push({ campo: "mensaje", texto: "El mensaje debe tener al menos 20 caracteres." });
  }

  return errores;
}

// Formato de correo simple: algo@algo.algo
function validarEmail(valor) {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(valor);
}

// Marca visualmente los campos invalidos y muestra el texto de error
// debajo de cada uno usando las clases de validacion de Bootstrap.
function mostrarErrores(errores) {
  errores.forEach(function (error) {
    const campo = document.getElementById(error.campo);
    if (!campo) return;
    campo.classList.add("is-invalid");

    const contenedorError = campo.parentElement.querySelector(".invalid-feedback");
    if (contenedorError) {
      contenedorError.textContent = error.texto;
    }
  });
}

function limpiarErrores(formulario) {
  const campos = formulario.querySelectorAll(".is-invalid");
  campos.forEach(function (campo) {
    campo.classList.remove("is-invalid");
  });
}

// Arma un enlace mailto con el asunto y el cuerpo del mensaje
// y lo abre para que el usuario complete el envio con su propio cliente de correo.
function enviarPorMail(formulario) {
  const nombre = formulario.nombre.value.trim();
  const apellido = formulario.apellido.value.trim();
  const email = formulario.email.value.trim();
  const asuntoSeleccionado = formulario.asunto.options[formulario.asunto.selectedIndex].text;
  const mensaje = formulario.mensaje.value.trim();

  const destinatario = "contacto.trabajofinal.mariposas@example.com";
  const asunto = "Contacto sitio Mariposas: " + asuntoSeleccionado;
  const cuerpo =
    "Nombre: " + nombre + " " + apellido + "\n" +
    "Email: " + email + "\n" +
    "Motivo: " + asuntoSeleccionado + "\n\n" +
    "Mensaje:\n" + mensaje;

  const enlaceMailto =
    "mailto:" + destinatario +
    "?subject=" + encodeURIComponent(asunto) +
    "&body=" + encodeURIComponent(cuerpo);

  window.location.href = enlaceMailto;
}
