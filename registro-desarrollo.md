# Registro de desarrollo y testeo — Trabajo Final Mariposas

Este archivo complementa al informe de proyecto (`Trabajo_Final_Mariposas_Informe_Proyecto_ACTUALIZADO.docx`)
y documenta el proceso de desarrollo técnico del sitio, con foco especial en el juego
"Ruta de la mariposa", desarrollado con apoyo de una herramienta de inteligencia artificial,
tal como pide la consigna del TP Final.

## 1. Herramienta de IA utilizada

Se utilizó **Claude Code** (Anthropic) como asistente de desarrollo para generar la estructura
inicial del sitio, la hoja de estilos y, en particular, el juego `assets/js/game.js`.

## 2. Proceso de trabajo con IA para el juego "Ruta de la mariposa"

El desarrollo del juego se guió mediante instrucciones sucesivas (prompts), siguiendo el mismo
criterio planificado en el informe de proyecto:

| Etapa | Instrucción / prompt utilizado |
|---|---|
| 1. Estructura inicial | Crear un juego en JavaScript puro (sin librerías externas) donde el jugador mueve una mariposa con el teclado (flechas o WASD) dentro de un `<canvas>`, recolecta flores y suma puntos. Organizar el código en funciones claras, sin usar clases ES6, para mantener un nivel intermedio acorde a lo visto en la cursada. |
| 2. Dificultad media/alta | Agregar obstáculos (pesticida y ráfagas de viento) que se desplazan por el canvas, un sistema de vidas, niveles con velocidad y frecuencia de obstáculos crecientes, pantalla de inicio y pantalla de fin con reinicio. |
| 3. Integración con Bootstrap | Adaptar la página del juego para que el canvas quede dentro de un contenedor responsive de Bootstrap, con panel de puntaje/vidas/nivel, instrucciones y botones de inicio/reinicio. |
| 4. Controles táctiles | Sumar botones de dirección visibles solo en pantallas chicas (`d-none` / media query) para que el juego sea jugable en celular sin teclado. |
| 5. Revisión y corrección de errores | Revisar el código generado, corregir errores de colisión, de reinicio del bucle de juego y de rendimiento. |

## 3. Errores encontrados durante el testeo y ajustes realizados

| Error encontrado | Causa | Corrección aplicada |
|---|---|---|
| El juego se aceleraba al reiniciar una partida | Cada clic en "Jugar de nuevo" iniciaba un nuevo `requestAnimationFrame` sin cancelar el anterior, duplicando el bucle. | En `comenzarJuego()` se agregó `cancelAnimationFrame(idAnimacion)` antes de reiniciar el estado del juego. |
| Se podían perder varias vidas de golpe si dos obstáculos coincidían en el mismo frame | `revisarColisionesConObstaculos()` recorría todos los obstáculos con `forEach` y no se detenía tras el primer impacto, por lo que descontaba una vida por cada obstáculo superpuesto. | Se reemplazó el `forEach` por un `for` con `break`, de forma que solo se descuenta una vida por colisión y se activa la invulnerabilidad temporal antes de seguir revisando. |
| Los controles táctiles quedaban activados si el dedo se arrastraba fuera del botón | Faltaba manejar la salida del puntero/touch. | Se agregaron los eventos `touchend`, `mouseup` y `mouseleave` para desactivar la dirección correspondiente. |
| El canvas no se achicaba correctamente en pantallas angostas | Solo se había definido `max-width: 100%` sin `height: auto`, por lo que el canvas mantenía su alto fijo (420px) aunque el ancho se redujera. | Se agregó `height: auto` a `#canvas-juego` en `custom.css` para mantener la proporción del canvas en mobile. |

## 4. Criterios de testeo aplicados al sitio completo

- **Enlaces internos**: se verificó con un script que los 16 archivos HTML referenciados desde
  los menús, tarjetas y footers existen realmente en la carpeta del proyecto (sin enlaces rotos).
- **Imágenes y scripts**: se verificó que todas las rutas `assets/img/...` y `assets/js/...`
  usadas en el HTML correspondan a archivos existentes.
- **IDs usados por JavaScript**: se revisó que los `id` que consultan `form.js`, `gallery.js` y
  `game.js` (formulario, modal de galería, canvas, pantallas del juego) estén presentes en sus
  páginas correspondientes.
- **Formulario de contacto**: se probó el envío vacío, con email inválido y con datos completos,
  verificando que se muestren los mensajes de error de Bootstrap y que el envío correcto arme un
  enlace `mailto` con asunto y cuerpo prellenados.
- **Galería**: se probaron los filtros por categoría y la apertura del modal con distintas
  imágenes, verificando que el título, la descripción y el crédito cambien correctamente.
- **Responsive**: se revisó la hoja de estilos para simular el comportamiento en anchos
  aproximados de celular (360px) y notebook (1366px): navbar colapsable, tarjetas que pasan a
  una columna, imágenes con `img-fluid` y canvas del juego con `max-width: 100%`.

## 5. Conclusión sobre el uso de la IA

La herramienta de IA resultó útil principalmente para acelerar la **estructura inicial** del
juego (bucle de animación, manejo de teclado, dibujo en canvas) y para sugerir mejoras de
dificultad y de integración con Bootstrap. Sin embargo, no reemplazó el proceso de revisión: los
errores de reinicio del bucle y de colisiones múltiples debieron detectarse probando el juego y
leyendo el código con atención, no fueron evidentes a simple vista en la primera versión
generada. La decisión de qué corregir, cómo nombrar funciones y cómo mantener el código en un
nivel intermedio (sin clases ES6 ni librerías adicionales) fue un criterio aplicado durante la
revisión, no algo resuelto automáticamente por la IA.

## 6. Framework y librerías utilizadas

- **Bootstrap 5.3.3** (CSS y JS bundle, vía CDN): grilla responsive, navbar colapsable, cards,
  formularios, modal y accordion.
- **JavaScript nativo**, sin frameworks ni librerías adicionales: `main.js`, `form.js`,
  `gallery.js`, `game.js`.
- **Google Fonts**: Playfair Display (títulos) y Lato (texto general).

## 7. Organización de archivos

```
/aguirre-sabrina-trabajo-integrador
|-- index.html
|-- conocer.html, ciclo-de-vida.html, anatomia.html
|-- especies.html, mariposa-monarca.html, mariposas-de-jardin.html
|-- habitat-jardines.html, plantas-nutricias.html, observacion-responsable.html
|-- galeria.html, conservacion.html, recursos.html
|-- juego.html, contacto.html, datos-alumno.html
|-- assets/css/custom.css
|-- assets/js/main.js, form.js, gallery.js, game.js
|-- assets/img/especies, assets/img/galeria, assets/img/iconos
|-- registro-desarrollo.md
|-- README.md
|-- Consigna TP Final 2025.pdf
|-- Trabajo_Final_Mariposas_Informe_Proyecto_ACTUALIZADO.docx
```

## 8. Indicaciones para actualizaciones futuras

- Nuevas especies: crear una nueva ficha a partir del modelo de `mariposa-monarca.html`,
  respetando el orden de datos rápidos, créditos de imagen y enlaces internos.
- Nuevas imágenes de galería: agregarlas en `assets/img/galeria`, con `alt` descriptivo y crédito
  agregado en `recursos.html`.
- Si se actualiza la versión de Bootstrap, probar primero en una rama aparte que la navbar, el
  modal, el accordion y los formularios sigan funcionando antes de reemplazar el enlace del CDN.
