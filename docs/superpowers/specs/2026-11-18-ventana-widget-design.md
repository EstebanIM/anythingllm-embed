# Ventana, campo y botón del widget con el estilo del Portal GC

Fecha: 2026-11-18. Tamaño: cambio pequeño. Rama: `iasmar/branding`. Sigue a `2026-11-18-globos-portal-design.md` (globos, Lucide).

## Intención

Que todo el widget, no solo los globos, se vea parte del Portal GC: sobrio, compacto y legible. El usuario comparó tres direcciones (A Hoja limpia, B Cabecera navy, C Ligera) en el comparador visual y eligió una mezcla, con la maqueta aprobada en `.superpowers/brainstorm/.../mezcla-widget.html`.

Dirección: `C:\Portal GC\docs\design-system.md`. Antislop en modo "durante". Lectura: chat de consulta incrustado en un portal interno, dial ENERGY 1 / RHYTHM 1 / MOTION 1.

## Enfoques considerados

- **A Hoja limpia:** ventana blanca con borde y sombra suave, cabecera con nombre y línea, campo rectangular de 8 px, botón navy.
- **B Cabecera navy:** cabecera en navy del Portal, campo píldora gris, botón con texto "Preguntar".
- **C Ligera:** sin barra de cabecera, campo píldora con borde y flecha, botón azul.
- **Elegido por el usuario:** botón cerrado de C, ventana de A, campo de C.

## Diseño aprobado

| Parte | Valor | Motivo |
|---|---|---|
| Ventana | blanco, radio 16 px, borde 1 px `#E3E5E8`, sombra `0 8px 24px rgba(8,36,63,.12)` | Flota sobre la página: la sombra marca esa elevación y nada más la usa |
| Cabecera | 56 px; logo de la plataforma (alto máx. 24 px) solo si existe, nombre del asistente 14 px peso 600 `#1B2A41` truncado; línea inferior `#E3E5E8` | Orienta sin ocupar; respeta `eeb27b8` (sin logo de AnythingLLM) |
| Botones ⋮ y × | 44 × 44 px, icono 20 px `#5F6368`, hover `#F4F5F6`, foco visible 2 px `#1A73E8` | Tamaño táctil mínimo (R-03) y foco de teclado (R-32) |
| Campo | píldora con borde 1 px `#D5D9DE`; radio 20 px cuando el texto pasa a dos líneas; foco: borde y anillo de 1 px `#1A73E8` | Repite la regla de los globos |
| Enviar | círculo de 32 px con flecha hacia arriba (Lucide `arrow-up`); vacío: fondo `#F4F5F6`, icono `#5F6368`, deshabilitado; con texto: fondo del globo del usuario e icono por contraste; enviando: spinner | El estado dice si se puede enviar |
| Botón cerrado | círculo de 52 px, icono 24 px; fondo `buttonColor` (por defecto `#1A73E8`); icono blanco o navy según contraste | C; el color lo sigue mandando la plataforma |
| "Restablecer chat" bajo el campo | se muestra solo con `noHeader` (ahí es el único acceso, junto a "Cerrar chat") | Con cabecera ya está en el menú ⋮ |

## Fuera de este cambio

- Que el Portal GC mande `#1A73E8` como `data-button-color` y `#F4F5F6` como `data-assistant-bg-color` (otro repo).
- Menú ⋮ por dentro, sugerencias iniciales, bloques de código, la ventana a 375 px.

## Decisiones mías aprobadas por el usuario en la maqueta

- Logo pequeño antes del nombre solo si la plataforma lo tiene.
- Botones de 44 px.
- Quitar "Restablecer chat" de abajo cuando hay cabecera.
- Icono del botón flotante por contraste.

## Decisiones mías no mostradas

- El botón Enviar activo usa el color del globo del usuario (la maqueta mostraba `#1A73E8`, que es su valor por defecto), para que siga la marca.
- Valor por defecto de `buttonColor` pasa de `#262626` a `#1A73E8`.

## Ajuste del 2026-11-18 (pedido del usuario)

- Apertura: la ventana aparece con un fundido y una subida de 16 px y escala desde 96 % desde la esquina del botón, 240 ms con la curva del Portal `cubic-bezier(0.2, 0, 0, 1)`. Nada se anima con `prefers-reduced-motion`.
- Botón cerrado: al pasar el mouse o con foco de teclado se abre hacia la página mostrando "Chatea con el experto" (15 px, peso 400) antes del icono. El mismo texto es su `aria-label`. En pantallas táctiles queda como círculo.
- Crédito bajo el campo: "IASMAR · Desarrollado por C-766" en 11 px `#5F6368`, con un punto de 3 px como separador.
- Hover del botón cerrado más suave: la píldora crece hasta el ancho medido del texto en 360 ms y el texto aparece 80 ms después; 12 px entre texto e icono.
- Menú ⋮: aparece con fundido y caída de 4 px en 160 ms; filas de 40 px en 14 px peso 400 navy con iconos de 18 px grises; borde y sombra como la ventana.
- Botones ⋮ y ×: área de 44 px con un círculo de 32 px que se tiñe `#F4F5F6` al pasar el mouse (y el ⋮ mientras su menú está abierto); 16 px de aire a la derecha, igual que a la izquierda del nombre.
- La cabecera no se encoge con conversaciones largas (`flex-none`).
- Cierre: la misma animación al revés (fundido y bajada hacia la esquina del botón, 240 ms, curva de apertura invertida). La ventana se oculta al terminar; con `prefers-reduced-motion` se cierra al instante.
- Cabecera: el menú ⋮ se reemplaza por un botón de reset (icono `rotate-ccw`) junto a la ×. Hover y foco: reset con `#E8F0FE` e icono `#1A73E8`; × con el rojo de «Cerrar sesión» del Portal (`#FEF2F2` / `#DC2626`). Se retiran el ID de sesión (también de la vista de carga) y el correo de soporte, que solo vivían en ese menú.
- Crédito: separador `·` (punto medio). Saludo: el widget respeta los saltos de línea de `data-greeting`; el Portal manda "Respondo con lo que {nombre}⏎ha compartido de su experiencia.⏎¿Por dónde comenzamos?" con espacios duros (`\u00A0`) dentro del nombre, así el nombre completo nunca se parte y queda en la primera línea mientras quepa (hasta unas tres palabras).
- Saludo genérico por defecto del widget (i18n `chat.greeting`): "Respondo con lo que el experto ha compartido de su experiencia.⏎¿Por dónde comenzamos?". El nombre ya está en la cabecera. Un `data-greeting` del host sigue teniendo prioridad, así que el Portal GC debe dejar de mandarlo.
