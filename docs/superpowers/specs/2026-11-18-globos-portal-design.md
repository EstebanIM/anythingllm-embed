# Globos de mensajes con el sistema visual del Portal GC

Fecha: 2026-11-18. Tamaño: cambio pequeño. Rama: `iasmar/branding`.

## Intención

El widget vive en la página de cada experto del Portal GC. Los globos deben sentirse parte del Portal, no un producto aparte, y leerse bien. Hoy el Portal pasa `data-assistant-bg-color="#1B2B44"` y el widget escribe el texto del asistente en gris oscuro encima: 1,03:1, ilegible.

Dirección: `C:\Portal GC\docs\design-system.md` (blanco, un off-white `#F4F5F6`, texto navy `#1B2A41`, secundario `#5F6368`, azul `#1A73E8` como acento, radios 8/16 px, plano, Inter local). Gusto del usuario: compacto, discreto, peso regular, sin etiquetas redundantes.

Lectura de diseño: chat de consulta incrustado en un portal interno, para trabajadores de la organización, en el lenguaje plano y sobrio del Portal GC, dial ENERGY 1 / RHYTHM 1 / MOTION 1.

## Objetivos

- Globo del asistente claro: fondo `#F4F5F6`, texto `#1B2A41`.
- Globo del usuario en el azul del Portal `#1A73E8`, texto blanco (4,51:1).
- Todo texto de los globos y sus metadatos cumple WCAG AA (4,5:1).
- Ningún color configurado por un admin o por `data-*` deja el texto ilegible.

## No objetivos

- Header, botón flotante, input, bloques de código y sugerencias iniciales: se tratan después.
- El cambio de `data-assistant-bg-color` en el Portal GC vive en otro repo; se hace aparte.

## Antiobjetivos

- Que el widget parezca un chat genérico de terceros pegado al Portal.
- Sombras, bordes decorativos, más colores que los del Portal.

## Enfoques considerados

1. **Claro del Portal (elegido por el usuario):** asistente `#F4F5F6` + navy, usuario azul. Un solo acento, coherente con las superficies del Portal. Requiere que el Portal deje de mandar el navy.
2. **Navy del dock con texto blanco:** conserva `#1B2B44`. Legible, pero dos bloques de color fuerte sobre ventana blanca.

En ambos el widget elige el color del texto según el fondo.

## Diseño

| Elemento | Valor | Motivo |
|---|---|---|
| Globo asistente | fondo por defecto `#F4F5F6`, sin borde ni sombra; texto navy 13,2:1 | Off-white único del Portal; base plana |
| Globo usuario | fondo por defecto `#1A73E8` | Acento del Portal |
| Color de texto | Calculado por luminancia del fondo: blanco o `#1B2A41`, el de mayor contraste | Cualquier color de marca queda legible |
| Forma | radio 16 px, esquina de cola 6 px hacia quien habla | Radio de card del Portal; la cola indica emisor sin adornos |
| Padding / separación | 10 × 14 px; 12 px entre mensajes; 48 px libres del lado contrario | Compacto, alterna la conversación |
| Nombre del asistente | 12 px, peso 400, `#5F6368` | Discreto, sin negrita (gusto del usuario); 6,05:1 sobre blanco |
| Hora | 11 px, `#5F6368` | Hoy `#9CA3AF` da 2,5:1 y no cumple AA |
| Tipografía | `font-family: inherit` en el widget | Dentro del Portal hereda Inter sin incluir fuentes en el build |
| Indicador "escribiendo" | puntos en `#5F6368` en vez de negro | Mismo tono que los metadatos |
| Error | fondo `#FEF2F2`, texto `#B91C1C` (5,91:1), icono y mensaje en el idioma del widget | Tokens de error del Portal; hoy está en inglés |
| Enlaces en globos | asistente `#155FC4` subrayado (5,55:1); usuario: color del texto, subrayado | `--action` del Portal; en azul, el enlace no puede ser azul |

Los valores por defecto del widget pasan a ser los del Portal, así el widget se ve bien aunque nadie mande `data-*`.

## Decidido por el usuario

- Globo del asistente claro del Portal.
- Antislop en modo "durante".

## Decisiones mías (revisables)

- Texto automático por luminancia, nombre/hora en `#5F6368`, `font-family: inherit`, enlaces, indicador y error como en la tabla.
- Quitar el borde fino que añadí antes: el Portal no usa líneas ornamentales y `#F4F5F6` sobre blanco ya separa.

## Para quien construye

- Servidor de prueba y preview con los atributos reales del Portal: `C:\iasmar\dev-tools\mock-embed-server.mjs`, `embed/preview.html`.
- La preview hoy manda `#1B2B44`; tras el cambio del Portal, mandará `#F4F5F6` (o nada). Verificar con ambos.

## Ajuste del 2026-11-18 (pedido del usuario)

- Globos de una línea: píldora completa (`allm-rounded-full`), sin cola. Desde la segunda línea, radio 16 px con cola de 6 px hacia quien habla. Se mide el contenido con `ResizeObserver`, así que una respuesta en streaming pasa de píldora a globo al saltar de línea (`src/utils/bubbleShape.js`, `src/hooks/useSingleLine.js`).
- Iconos: todo el widget usa Lucide (`lucide-react` 1.67.0, verificado contra jsDelivr) con trazo 1,5, el mismo del Portal GC, fijado una vez con `LucideProvider` en `App.jsx`. Se retira `@phosphor-icons/react`. Las claves públicas de `data-chat-icon` no cambian.
