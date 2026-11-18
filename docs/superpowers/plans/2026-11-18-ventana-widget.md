# Ventana, campo y botón del widget: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** La ventana, la cabecera, el campo de texto y el botón flotante siguen la mezcla aprobada (botón de C, ventana de A, campo de C).

**Architecture:** La regla de forma de una línea ya existe en `src/utils/bubbleShape.js`; se extiende al campo. Los colores de icono salen de `bubbleColorStyle`/`readableTextColor`. Cada parte vive en su componente actual.

**Tech Stack:** React 18, Tailwind 3.4 (prefijo `allm-`), lucide-react 1.67.0, `node --test`.

**Spec:** `docs/superpowers/specs/2026-11-18-ventana-widget-design.md`

## Global Constraints

- Colores: borde `#E3E5E8`, borde de campo `#D5D9DE`, texto `#1B2A41`, secundario `#5F6368`, superficie `#F4F5F6`, foco `#1A73E8`.
- Sombra única de la ventana: `0 8px 24px rgba(8,36,63,.12)`.
- Botones táctiles de 44 px; foco visible de 2 px.
- Sin dependencias nuevas; sin em dash.

## Review Focus

- Nombre del asistente muy largo: la cabecera lo trunca y los botones no se mueven.
- `noHeader` activo: "Restablecer chat" y "Cerrar chat" siguen accesibles bajo el campo.
- Enter con el campo vacío o solo espacios: no envía y el botón sigue gris.
- `buttonColor` claro (por ejemplo `#F4F5F6`) o con nombre (`white`): el icono del botón flotante sale navy.
- Texto pegado de varias líneas: el campo pasa a radio 20 px y vuelve a píldora al enviar.

---

### Task 1: Regla de forma del campo

**Files:** Modify `src/utils/bubbleShape.js`; Test `src/utils/bubbleShape.test.mjs`
**Interfaces:** Produces `fieldRadiusClass(singleLine: boolean): string` → `"allm-rounded-full"` o `"allm-rounded-[20px]"`.

- [ ] Test: `fieldRadiusClass(true) === "allm-rounded-full"`, `fieldRadiusClass(false) === "allm-rounded-[20px]"`. Run `node --test src/utils/bubbleShape.test.mjs` → FAIL (no export).
- [ ] Implementar; run → PASS. Commit `feat(embed): forma del campo de texto segun lineas`.

### Task 2: Botón flotante (C)

**Files:** Modify `src/components/OpenButton/index.jsx`, `src/hooks/useScriptAttributes.js` (default `buttonColor: "#1A73E8"`)
**Interfaces:** Consumes `readableTextColor` (`@/utils/color`), `normalizeCssColor` (`@/utils/cssColor`).

- [ ] Botón 52 × 52 px, `allm-rounded-full`, icono 24 px, color `readableTextColor(normalizeCssColor(buttonColor))`, foco visible 2 px offset 2.
- [ ] Verify en preview (`data-button-color` `#0b1f3a`, luego `white`): icono `rgb(255,255,255)` y luego `rgb(27,42,65)`; tamaño 52 px. Commit `feat(embed): boton flotante con el estilo del Portal`.

### Task 3: Ventana y cabecera (A)

**Files:** Modify `src/App.jsx` (clases de la ventana), `src/components/ChatWindow/Header/index.jsx`, `src/components/ChatWindow/index.jsx` (ResetChat solo con `noHeader`)

- [ ] Ventana: `allm-border-[#E3E5E8]`, sombra de la spec, quitar `allm-border-gray-300` y la sombra actual.
- [ ] Cabecera de 56 px según la spec; nombre = `settings.assistantName || "Chat Assistant"` (mismo respaldo que los globos), `truncate`; menú ⋮ reposicionado a `top-[60px]`.
- [ ] `ChatWindow`: `<ResetChat>` solo si `settings.noHeader`.
- [ ] Verify en preview: altura de cabecera 56, botones 44 × 44, nombre largo truncado sin mover botones, sin "Restablecer chat" bajo el campo; con `data-no-header="true"` vuelve. Commit `feat(embed): ventana y cabecera con el estilo del Portal`.

### Task 4: Campo y botón Enviar (C)

**Files:** Modify `src/components/ChatWindow/ChatContainer/PromptInput/index.jsx`
**Interfaces:** Consumes `fieldRadiusClass`, `isSingleLine` (`@/utils/bubbleShape`), `bubbleColorStyle` no: usa `readableTextColor` + `embedderSettings.USER_STYLES.msgBg`.

- [ ] Contenedor del campo: borde 1 px `#D5D9DE`, `fieldRadiusClass(singleLine)` con `singleLine` medido sobre el `textarea` tras `adjustTextArea`; `focus-within`: borde e anillo `#1A73E8`.
- [ ] Botón: 32 px círculo, Lucide `ArrowUp` 16 px; deshabilitado y gris si `!message.trim()`; activo con fondo `USER_STYLES.msgBg` e icono por contraste; `LoaderCircle` mientras `buttonDisabled`.
- [ ] Verify en preview: vacío gris y `disabled`; con texto azul; foco con anillo; texto de tres líneas → radio 20 px; tras enviar → píldora. Commit `feat(embed): campo de texto y boton enviar con el estilo del Portal`.

### Task 5: Cierre

- [ ] Teclado: Tab llega a ⋮, ×, campo y Enviar con foco visible. 375 px sin desbordes nuevos.
- [ ] Commit de spec y plan. Sin push.
