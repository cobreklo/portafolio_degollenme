# Portafolio Audiovisual — Guía para Cliente

## Descripción
Sitio web de portafolio enfocado en fotografía y audiovisual, con una estética elegante y minimal. Incluye una experiencia de precarga interactiva, un menú flotante tipo burbuja y tema oscuro.

## Funcionalidades Clave
- Precarga interactiva con cámara: animación de apertura, destello y sonido.
- Menú burbuja flotante: sigue el scroll, es colapsable y se puede arrastrar.
- Botón de prueba de sonido: reproduce `efectocamara.mp3` desde la burbuja.
- Tema oscuro: conmutador sol/luna, persistente entre visitas.
- Secciones: Acerca, Fotos, Contacto y Reseñas.
- Formulario de contacto: envío con estado y feedback visual.

## Uso Rápido
- Botón “Tema”: activa/desactiva el modo oscuro y se guarda su preferencia.
- Botón “Sonido”: prueba el audio de obturador.
- Arrastrar la burbuja: mantenga el dedo o el mouse sobre el área de la burbuja y muévala; tiene animación de “viscosidad”.
- Precarga: toque/clic para entrar; puede mover el dedo sobre la cámara para inclinarla.

## Compatibilidad Móvil
- Arrastre de la burbuja optimizado: bloquea el scroll durante el gesto para mayor control.
- Tilt de la cámara con táctil: responde al movimiento del dedo y se reinicia al soltar.

## Aspectos Técnicos
- Stack: HTML + Tailwind vía CDN + CSS/JS sin build.
- Fuentes: títulos con `Bodoni Moda`, texto con `Manrope`.
- Archivos principales:
  - `index.html`: estructura, fuentes y Tailwind config.
  - `assets/styles.css`: estilos personalizados y animaciones.
  - `assets/main.js`: interacciones (precarga, burbuja, tema, formulario).
  - `assets/efectocamara.mp3`: sonido de obturador.

## Publicación
- GitHub Pages:
  1) Suba el proyecto al repositorio.
  2) En “Settings” → “Pages”, seleccione la rama y carpeta raíz.
- Netlify/Vercel: arrastre y suelte la carpeta del proyecto; no requiere build.

## Mantenimiento
- Cambiar textos: modifique las secciones en `index.html`.
- Cambiar imágenes: reemplace rutas en la sección “Fotos” o añada nuevas.
- Cambiar paleta: ajuste colores en Tailwind config dentro de `index.html`.
- Cambiar fuentes: edite los enlaces de Google Fonts y las familias en Tailwind config.

## Soporte
Para ajustes, nuevas secciones o integración con redes sociales, contácteme y coordinamos los cambios.
