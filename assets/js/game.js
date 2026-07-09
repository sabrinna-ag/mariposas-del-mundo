// game.js
// Juego "Ruta de la mariposa" (juego.html)
// El jugador mueve una mariposa para recolectar flores con nectar
// y evitar obstaculos (pesticida y rafagas de viento).
// Desarrollado con apoyo de una herramienta de IA: el proceso de
// prompts, correcciones y pruebas esta documentado en registro-desarrollo.md

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("canvas-juego");
  if (!canvas) return;
  const contexto = canvas.getContext("2d");

  const ANCHO = canvas.width;
  const ALTO = canvas.height;

  // ---------- Estado general del juego ----------
  // Estas variables cambian durante la partida, por eso son "let" y no "const".
  let estadoJuego = "inicio"; // "inicio" | "jugando" | "fin"
  let idAnimacion = null;

  // El objeto en si nunca se reemplaza (solo se modifican sus propiedades
  // x/y), por eso puede ser "const".
  const mariposa = { x: ANCHO / 2, y: ALTO / 2, radio: 16, velocidad: 4.2 };
  const teclas = { arriba: false, abajo: false, izquierda: false, derecha: false };

  let flores = [];
  let obstaculos = [];

  let puntaje = 0;
  let vidas = 3;
  let nivel = 1;
  const puntosParaSubirNivel = 60;
  let contadorObstaculos = 0;
  let frecuenciaObstaculos = 90; // cada cuantos frames aparece un obstaculo nuevo
  let mariposaInvulnerableHasta = 0;

  const mensajesEducativos = [
    "Las mariposas polinizan flores mientras se alimentan de nectar.",
    "Evitar el uso de pesticidas ayuda a proteger a las mariposas.",
    "Plantar flores nativas atrae mariposas y otros polinizadores.",
    "El viento fuerte y la perdida de habitat dificultan la vida de las mariposas."
  ];

  // ---------- Elementos de la interfaz ----------
  const elementoPuntaje = document.getElementById("juego-puntaje");
  const elementoVidas = document.getElementById("juego-vidas");
  const elementoNivel = document.getElementById("juego-nivel");
  const pantallaInicio = document.getElementById("pantalla-inicio-juego");
  const pantallaFin = document.getElementById("pantalla-fin-juego");
  const textoResultadoFinal = document.getElementById("resultado-final-juego");
  const textoMensajeEducativo = document.getElementById("mensaje-educativo-juego");
  const botonComenzar = document.getElementById("btn-comenzar-juego");
  const botonReiniciar = document.getElementById("btn-reiniciar-juego");

  botonComenzar.addEventListener("click", comenzarJuego);
  botonReiniciar.addEventListener("click", comenzarJuego);

  // ---------- Controles de teclado ----------
  document.addEventListener("keydown", function (evento) {
    actualizarTecla(evento.key, true);
  });
  document.addEventListener("keyup", function (evento) {
    actualizarTecla(evento.key, false);
  });

  function actualizarTecla(tecla, valor) {
    if (tecla === "ArrowUp" || tecla === "w" || tecla === "W") teclas.arriba = valor;
    if (tecla === "ArrowDown" || tecla === "s" || tecla === "S") teclas.abajo = valor;
    if (tecla === "ArrowLeft" || tecla === "a" || tecla === "A") teclas.izquierda = valor;
    if (tecla === "ArrowRight" || tecla === "d" || tecla === "D") teclas.derecha = valor;
  }

  // ---------- Controles tactiles (mobile) ----------
  configurarBotonTactil("btn-arriba", "arriba");
  configurarBotonTactil("btn-abajo", "abajo");
  configurarBotonTactil("btn-izquierda", "izquierda");
  configurarBotonTactil("btn-derecha", "derecha");

  function configurarBotonTactil(idBoton, direccion) {
    const boton = document.getElementById(idBoton);
    if (!boton) return;
    const activar = function (evento) { evento.preventDefault(); teclas[direccion] = true; };
    const desactivar = function (evento) { evento.preventDefault(); teclas[direccion] = false; };
    boton.addEventListener("touchstart", activar);
    boton.addEventListener("touchend", desactivar);
    boton.addEventListener("mousedown", activar);
    boton.addEventListener("mouseup", desactivar);
    boton.addEventListener("mouseleave", desactivar);
  }

  // ---------- Ciclo de inicio / reinicio ----------
  function comenzarJuego() {
    // Si ya habia un loop corriendo, se cancela para no duplicar el bucle
    // (evita que el juego se acelere al reiniciar).
    if (idAnimacion !== null) {
      cancelAnimationFrame(idAnimacion);
      idAnimacion = null;
    }

    mariposa.x = ANCHO / 2;
    mariposa.y = ALTO / 2;
    puntaje = 0;
    vidas = 3;
    nivel = 1;
    frecuenciaObstaculos = 90;
    contadorObstaculos = 0;
    flores = [];
    obstaculos = [];
    mariposaInvulnerableHasta = 0;

    for (let i = 0; i < 3; i++) {
      flores.push(crearFlor());
    }

    actualizarPanel();
    pantallaInicio.classList.add("d-none");
    pantallaFin.classList.add("d-none");
    estadoJuego = "jugando";

    idAnimacion = requestAnimationFrame(bucleJuego);
  }

  // ---------- Bucle principal ----------
  function bucleJuego() {
    actualizar();
    dibujar();
    if (estadoJuego === "jugando") {
      idAnimacion = requestAnimationFrame(bucleJuego);
    }
  }

  function actualizar() {
    moverMariposa();
    moverObstaculos();
    generarObstaculosPeriodicamente();
    revisarColisionesConFlores();
    revisarColisionesConObstaculos();
    revisarSubidaDeNivel();
  }

  function moverMariposa() {
    if (teclas.arriba) mariposa.y -= mariposa.velocidad;
    if (teclas.abajo) mariposa.y += mariposa.velocidad;
    if (teclas.izquierda) mariposa.x -= mariposa.velocidad;
    if (teclas.derecha) mariposa.x += mariposa.velocidad;

    mariposa.x = limitar(mariposa.x, mariposa.radio, ANCHO - mariposa.radio);
    mariposa.y = limitar(mariposa.y, mariposa.radio, ALTO - mariposa.radio);
  }

  function limitar(valor, minimo, maximo) {
    return Math.max(minimo, Math.min(maximo, valor));
  }

  function crearFlor() {
    return {
      x: 30 + Math.random() * (ANCHO - 60),
      y: 30 + Math.random() * (ALTO - 60),
      radio: 12
    };
  }

  function crearObstaculo() {
    const tipo = Math.random() < 0.5 ? "pesticida" : "viento";
    const desdeIzquierda = Math.random() < 0.5;
    const velocidadBase = 1.6 + nivel * 0.5;

    return {
      tipo: tipo,
      x: desdeIzquierda ? -20 : ANCHO + 20,
      y: 20 + Math.random() * (ALTO - 40),
      radio: tipo === "pesticida" ? 16 : 20,
      velocidadX: desdeIzquierda ? velocidadBase : -velocidadBase
    };
  }

  function generarObstaculosPeriodicamente() {
    contadorObstaculos++;
    if (contadorObstaculos >= frecuenciaObstaculos) {
      obstaculos.push(crearObstaculo());
      contadorObstaculos = 0;
    }
  }

  function moverObstaculos() {
    obstaculos.forEach(function (obstaculo) {
      obstaculo.x += obstaculo.velocidadX;
    });
    obstaculos = obstaculos.filter(function (obstaculo) {
      return obstaculo.x > -40 && obstaculo.x < ANCHO + 40;
    });
  }

  function distancia(objetoA, objetoB) {
    const dx = objetoA.x - objetoB.x;
    const dy = objetoA.y - objetoB.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function revisarColisionesConFlores() {
    flores.forEach(function (flor, indice) {
      if (distancia(mariposa, flor) < mariposa.radio + flor.radio) {
        puntaje += 10;
        flores[indice] = crearFlor();
        actualizarPanel();
      }
    });
  }

  function revisarColisionesConObstaculos() {
    const ahora = Date.now();
    if (ahora < mariposaInvulnerableHasta) return;

    // Se usa un for con "break" (en vez de forEach) para que, si hay varios
    // obstaculos superpuestos en el mismo frame, solo se descuente una vida.
    for (let i = 0; i < obstaculos.length; i++) {
      const obstaculo = obstaculos[i];
      if (distancia(mariposa, obstaculo) < mariposa.radio + obstaculo.radio) {
        vidas -= 1;
        mariposaInvulnerableHasta = ahora + 1200;
        actualizarPanel();
        if (vidas <= 0) {
          finalizarJuego();
        }
        break;
      }
    }
  }

  function revisarSubidaDeNivel() {
    if (puntaje >= nivel * puntosParaSubirNivel) {
      nivel += 1;
      frecuenciaObstaculos = Math.max(35, frecuenciaObstaculos - 12);
      actualizarPanel();
    }
  }

  function finalizarJuego() {
    estadoJuego = "fin";
    if (idAnimacion !== null) {
      cancelAnimationFrame(idAnimacion);
      idAnimacion = null;
    }
    textoResultadoFinal.textContent =
      "Puntaje final: " + puntaje + " | Nivel alcanzado: " + nivel;
    const mensaje = mensajesEducativos[Math.floor(Math.random() * mensajesEducativos.length)];
    textoMensajeEducativo.textContent = mensaje;
    pantallaFin.classList.remove("d-none");
  }

  function actualizarPanel() {
    elementoPuntaje.textContent = puntaje;
    elementoVidas.textContent = vidas;
    elementoNivel.textContent = nivel;
  }

  // ---------- Dibujado ----------
  function dibujar() {
    contexto.clearRect(0, 0, ANCHO, ALTO);
    dibujarFondo();
    flores.forEach(dibujarFlor);
    obstaculos.forEach(dibujarObstaculo);
    dibujarMariposa();
  }

  function dibujarFondo() {
    contexto.fillStyle = "#d7ecd0";
    contexto.fillRect(0, 0, ANCHO, ALTO);
  }

  function dibujarFlor(flor) {
    contexto.beginPath();
    contexto.arc(flor.x, flor.y, flor.radio, 0, Math.PI * 2);
    contexto.fillStyle = "#e36c2d";
    contexto.fill();
    contexto.beginPath();
    contexto.arc(flor.x, flor.y, flor.radio / 2.5, 0, Math.PI * 2);
    contexto.fillStyle = "#f8f4e9";
    contexto.fill();
  }

  function dibujarObstaculo(obstaculo) {
    contexto.beginPath();
    contexto.arc(obstaculo.x, obstaculo.y, obstaculo.radio, 0, Math.PI * 2);
    contexto.fillStyle = obstaculo.tipo === "pesticida" ? "#8a4f7d" : "#9aa5ad";
    contexto.globalAlpha = 0.85;
    contexto.fill();
    contexto.globalAlpha = 1;
  }

  function dibujarMariposa() {
    const ahora = Date.now();
    const parpadea = ahora < mariposaInvulnerableHasta && Math.floor(ahora / 100) % 2 === 0;
    if (parpadea) return;

    contexto.save();
    contexto.translate(mariposa.x, mariposa.y);

    contexto.fillStyle = "#2e5e3a";
    contexto.beginPath();
    contexto.ellipse(0, 0, 3, 12, 0, 0, Math.PI * 2);
    contexto.fill();

    contexto.fillStyle = "#e36c2d";
    contexto.beginPath();
    contexto.ellipse(-10, -6, 10, 7, 0, 0, Math.PI * 2);
    contexto.fill();
    contexto.beginPath();
    contexto.ellipse(10, -6, 10, 7, 0, 0, Math.PI * 2);
    contexto.fill();

    contexto.fillStyle = "#8a4f7d";
    contexto.beginPath();
    contexto.ellipse(-9, 7, 7, 5, 0, 0, Math.PI * 2);
    contexto.fill();
    contexto.beginPath();
    contexto.ellipse(9, 7, 7, 5, 0, 0, Math.PI * 2);
    contexto.fill();

    contexto.restore();
  }
});
