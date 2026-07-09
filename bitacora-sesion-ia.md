# Bitácora de la sesión de trabajo con IA

Este documento resume, en orden cronológico, el proceso de trabajo con Claude (Anthropic)
durante el desarrollo del sitio **Mariposas del Mundo**. Complementa al informe de proyecto
(`Trabajo_Final_Mariposas_Informe_Proyecto_ACTUALIZADO.docx`) y a `registro-desarrollo.md`
(que se enfoca específicamente en el juego), dejando registro del proceso completo de
construcción del sitio con apoyo de IA, tal como pide la consigna del TP Final.

---

## 1. Punto de partida y creación del sitio

**Pedido inicial:** construir un sitio web responsive sobre mariposas a partir de la consigna
del TP Final y el informe de planificación ya redactados, usando únicamente contenido visto
en la carpeta `CLASES`, en un nivel de código principiante/intermedio.

**Proceso:**
- Se leyeron la consigna (`Consigna TP Final 2025.pdf`) y el informe de planificación completo
  (investigación, mapa de navegación, layout, decisiones de desarrollo).
- Se hicieron 6 preguntas de alcance antes de empezar: stack técnico (Bootstrap 5 + JS nativo,
  confirmado por la Clase 22), manejo de imágenes (fotos reales con licencia libre vs.
  placeholders), documentación del proceso de IA para el juego, método de envío del formulario
  (mailto), y si inicializar un repositorio Git con commits por etapa.
- Se descargaron 10 fotografías reales de mariposas con licencia libre (CC0, CC BY-SA, GFDL,
  dominio público) desde Wikimedia Commons, con crédito de autor y licencia documentado.
- Se armó la hoja de estilos (`custom.css`) con la paleta e identidad definidas en el informe,
  y los cuatro módulos de JavaScript: `main.js` (menú y comportamientos generales), `form.js`
  (validación del formulario de contacto), `gallery.js` (galería con filtros y modal) y
  `game.js` (el juego "Ruta de la mariposa", en canvas).
- Se crearon las 16 páginas HTML mínimas que pide la consigna: home, 6 secciones principales,
  6 subpáginas, 2 páginas complementarias (contacto y datos del alumno) y el juego.
- Se inicializó un repositorio Git local, con un commit por cada etapa del desarrollo
  (estructura inicial, estilos, cada sección, galería, juego, formulario, correcciones).

---

## 2. Publicación en GitHub

- Se conectó el repositorio local con un repositorio remoto en GitHub creado por la alumna
  (que ya incluía un README inicial), fusionando ambos historiales sin perder commits.
- Se corrigió el email de autor de todos los commits para que coincida con la cuenta de
  GitHub real de la alumna (se reescribió el historial local, que todavía no estaba publicado,
  así que fue seguro hacerlo).
- Se hizo el primer `push` (con un problema puntual del Credential Manager de Git al correr
  desde Git Bash, resuelto ejecutando el mismo comando desde PowerShell).
- Se explicó cómo activar GitHub Pages y, más adelante, cómo renombrar el repositorio
  (de `trabajo-final-ig` a `mariposas-del-mundo`), actualizando el `remote` local para que
  coincida.

---

## 3. Corrección de bugs de diseño reportados por la alumna

**"Los cuadros de texto se superponen con el footer" (página Juego):**
Causa: la clase `.card-mariposas` tenía `height: 100%` fijo en la hoja de estilos. Eso
funciona bien cuando varias tarjetas están una al lado de la otra en la misma fila, pero se
rompe cuando hay tarjetas apiladas verticalmente junto a una columna más alta (como en Juego,
donde "Instrucciones" y "Sobre el desarrollo" están al lado del tablero): cada una intentaba
ocupar el 100% de esa altura, duplicando el espacio necesario. Se sacó el `height: 100%` de la
clase base y se agregó como utilidad `h-100` de Bootstrap solo donde correspondía (filas de
tarjetas parejas).

**"Las imágenes no se ven de un tamaño moderado":**
Causa: varias fotos descargadas eran verticales (retrato), y con `img-fluid` (que solo fija el
ancho) la altura seguía la proporción original, agrandándose demasiado en columnas angostas.
Se agregaron clases (`img-contenido`, `img-vista-previa`, `img-modal-ampliada`) con altura
máxima y recorte, aplicadas según el contexto de cada imagen.

---

## 4. Mejoras de navegación

A pedido de la alumna, que notó que "la navegación se siente un poco torpe":
1. El menú ahora resalta la sección correspondiente también cuando se está en una subpágina
   (antes solo resaltaba si el nombre de archivo coincidía exactamente).
2. El menú desplegable en celular se cierra automáticamente al elegir una opción.
3. Se agregó navegación "anterior / siguiente" entre las subpáginas de una misma sección, y se
   encadenó la última subpágina de cada sección con el inicio de la siguiente, para que se
   sienta como un recorrido continuo por todo el sitio.

Cada uno de estos tres cambios se documentó y subió como un commit separado, a pedido de la
alumna.

---

## 5. Modernización del JavaScript (var → let → const)

- Primero se reemplazaron todas las declaraciones `var` por `let` en los 4 archivos JS
  (~85 declaraciones), verificando antes que no hubiera conflictos de scope.
- Más adelante, se revisó cuáles de esas variables `let` nunca se reasignan y se cambiaron a
  `const`: en `main.js`, `form.js` y `gallery.js` **todas** calificaban para `const`. En
  `game.js` (el más complejo, con estado de partida) se dejaron como `let` únicamente las 11
  variables que sí cambian durante el juego (puntaje, vidas, nivel, posición, etc.) y los 2
  contadores de bucles `for`.

---

## 6. Auditoría de "solo contenido visto en clase"

La alumna pidió verificar si **todo** el código (estructuras, nombres de variables, nombres de
archivos de imagen) estaba basado exclusivamente en el contenido de la carpeta `CLASES`.

**Proceso de verificación:** se revisaron a fondo las clases de HTML/CSS (02, 04, 07, 08) y de
JavaScript (09 a 17), tanto las presentaciones como los archivos de ejemplo, para armar una
lista real de qué técnicas están cubiertas.

**Hallazgos y correcciones aplicadas:**
- Las variables CSS (`:root` / `var()`) no se ven en la cursada → se reemplazaron por colores
  literales en todo `custom.css`.
- `box-shadow` y `transition` tampoco se ven → se sacaron (las sombras se reemplazaron por
  bordes; los hover quedaron sin animación, pero siguen funcionando).
- `clamp()` no se ve → se reemplazó por un tamaño de letra fijo más una media query (contenido
  visto en la Clase 08).
- `object-fit` y `background-size: cover` tampoco están en ninguna clase. Se probó resolverlo
  con porcentajes y `max-height` puro (sin recorte) para las fotos de contenido y la
  mini-galería de la home, y funcionó bien. Pero en 3 lugares puntuales —el fondo del hero a
  pantalla completa, los círculos de "ciclo de vida" y la grilla de la galería— no hay forma de
  lograr el mismo resultado solo con porcentajes sin deformar la imagen o romper la
  consistencia visual, así que ahí se dejaron como excepción justificada (documentada con
  comentarios en el CSS).
- Nombres de variables e imágenes: ya eran descriptivos, sin cambios necesarios.

---

## 7. Auditoría contra el checklist oficial del TP Final

Se leyó el PDF `tp_final_checklist_2025.pdf` (carpeta `Examen final`) punto por punto y se
comparó contra el sitio.

**Hallazgo importante (ítem 4.7 — "no deben existir definiciones CSS en los archivos HTML"):**
había alrededor de 30 atributos `style="..."` inline (fondo de los hero, tamaño del botón
"volver arriba", ancho de párrafos centrados, alertas destacadas, tamaño de imágenes de
tarjetas). Se revisó cada caso y se migró a clases nuevas en `custom.css`
(`hero-inicio`, `hero-especies`, etc., `ancho-lectura`, `alert-mariposas`, `img-tarjeta-220`,
`#btn-volver-arriba`, `overlay-juego-inicio`/`overlay-juego-fin`). De paso se encontró y corrigió
un bug: dos de esos `style` habían quedado apuntando a una variable CSS (`var(--verde-bosque)`)
que ya no existía porque se había sacado en el paso anterior.

**Hallazgo mayor (ítems 2.4/2.5 — cada sección principal debe tener su propia carpeta con su
propio `index.html`):** el sitio era plano (todos los HTML en la raíz), siguiendo la misma
convención que el informe de planificación y los ejemplos de la cursada. Se consultó a la
alumna antes de encarar un cambio de esta magnitud.

**Otros hallazgos:** imágenes más pesadas de lo necesario para el tamaño en que se muestran
(ítems 3.2/3.3), y el `<title>` de cada página sin indicar la sección (ítem 4.3).

---

## 8. Reestructuración final en carpetas por sección

A pedido explícito de la alumna ("reestructura todo según la consigna" + corregir los demás
puntos que se consigan), se hizo la reestructuración completa:

- Cada sección principal pasó a tener su propia carpeta con su propio `index.html`:
  `conocer/`, `especies/`, `habitat-jardines/`, `galeria/`, `conservacion/`, `recursos/`.
  Las subpáginas quedaron dentro de la carpeta de su sección
  (ej. `conocer/ciclo-de-vida.html`).
- Los archivos se movieron con `git mv` para conservar el historial de cada uno.
- Se corrigieron, en las 16 páginas, todas las rutas relativas afectadas: menú, migas de pan,
  footer, tarjetas, navegación anterior/siguiente y las rutas a `assets/css`, `assets/js` y
  `assets/img` (que ahora necesitan `../` desde las páginas que quedaron un nivel más
  profundo). Se verificó de forma automatizada que no quedara ningún enlace ni imagen rota.
- Se detectó y corrigió un efecto colateral: la lógica que resalta la sección activa del menú
  (en `main.js`) comparaba nombres de archivo exactos, y dejó de funcionar porque ahora varias
  páginas se llaman `index.html` (una por carpeta). Se rediseñó para detectar la sección según
  el nombre de la carpeta en la URL, usando atributos `data-seccion` en los enlaces del menú.
- Se optimizaron las 10 fotos de la galería con `System.Drawing` de .NET (no había herramientas
  como ImageMagick disponibles): se redujeron a un tamaño acorde a dónde se muestran y se
  recomprimieron a calidad 80. El peso total bajó de ~2,5 MB a ~980 KB.
- Se corrigió el `<title>` de las 16 páginas para incluir página, sección y sitio
  (ej. `Ciclo de vida | Conocer | Mariposas del Mundo`), y se unificó el nombre del sitio en el
  pie de página para que coincida con el de la barra de navegación.

---

## 9. Copia de la conversación

La alumna pidió una copia completa de la conversación con la IA. Se consultó qué formato
prefería (resumen, página para compartir, o transcripción literal) y se optó por una
**transcripción literal completa**, organizada por turnos numerados con índice, en un archivo
HTML pensado para leerse en pantalla o imprimirse a PDF (`transcripcion-conversacion.html`, en
la raíz del proyecto). Ese archivo es solo un documento de respaldo: no forma parte de la
navegación del sitio ni está enlazado desde ninguna página (se confirmó explícitamente que no
debía estarlo).

## 10. Unidades de medida: conversión a `em`

La alumna pidió pasar las unidades de medida de `custom.css` a `em`, su unidad de preferencia
para trabajar.

**Criterio aplicado:** se convirtieron todos los valores en `px` y `rem` a `em`, usando como
base 16px = 1em (el tamaño de letra por defecto del navegador, el mismo que ya usaba `body`).
Quedaron **sin convertir** los porcentajes (`%`) y las unidades de viewport (`vh`), porque miden
otra cosa —una proporción del contenedor o de la pantalla, no del tamaño de letra— y no
equivalen a `em`; convertirlas habría cambiado el comportamiento real de esas reglas (por
ejemplo, el alto del hero dejaría de ajustarse a la pantalla). También se convirtieron los
valores de los `@media` (breakpoints), ya que `em` en una media query siempre se calcula sobre
el tamaño de letra por defecto del navegador, sin importar los estilos de la página, así que la
conversión es segura y no cambia en qué ancho se activa cada regla.

Se dejó cada valor con un comentario al lado indicando el equivalente original en píxeles
(ej. `max-height: 23.75em; /* 380px */`) para que sea fácil de auditar.

---

## Cómo usar esta bitácora

Este documento está pensado como respaldo del proceso de trabajo con IA durante todo el
desarrollo del sitio (no solo el juego), en línea con lo que pide la consigna del TP Final.
Puede citarse o resumirse en la presentación oral para explicar decisiones de diseño y
desarrollo, y como evidencia del proceso iterativo de testeo y corrección del sitio.
