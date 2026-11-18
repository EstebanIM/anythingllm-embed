# Globos con el sistema visual del Portal GC: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Los globos del widget usan los colores, tipografía y estados del Portal GC y su texto siempre cumple WCAG AA.

**Architecture:** Una función pura calcula el color de texto legible para cualquier fondo; los globos la aplican en cada render sobre `embedderSettings.*_STYLES.msgBg`. Las clases compartidas viven en `bubbleStyles.js`; los defaults del widget pasan a ser los del Portal.

**Tech Stack:** React 18, Tailwind 3.4 con prefijo `allm-`, Vite 5, i18next. Tests con `node --test` (Node 24, sin dependencias nuevas).

**Spec:** `docs/superpowers/specs/2026-11-18-globos-portal-design.md`

## Global Constraints

- Colores exactos: asistente `#F4F5F6`, usuario `#1A73E8`, texto navy `#1B2A41`, texto claro `#FFFFFF`, metadatos `#5F6368`, enlace asistente `#155FC4`, error texto `#B91C1C` sobre `#FEF2F2`.
- Radio 16 px, cola 6 px; padding 10 × 14 px; 12 px entre mensajes; 48 px libres del lado contrario.
- Nombre del asistente 12 px peso 400; hora 11 px.
- Sin sombras ni bordes en los globos normales.
- Tipografía de los globos: `font-family: inherit`.
- Sin dependencias nuevas. Sin em dash en textos.
- Copias en español: error `No se pudo responder al mensaje.`, detalle por defecto `Error del servidor`.

## Review Focus

- Fondo de marca en formato corto (`#09f`) o con mayúsculas: el texto debe seguir eligiéndose bien.
- Fondo inválido o vacío (`"azul"`, `""`): el navegador ignora el fondo, el globo queda sobre blanco, así que el texto debe ser navy.
- Fondo medio como `#1A73E8`, donde ambos colores rondan el límite: debe ganar el de mayor contraste (blanco, 4,51:1).
- Enlaces dentro de una respuesta en streaming (PromptReply), no solo en el historial.
- Idioma distinto de `es`/`en`: el error cae al inglés, no muestra la clave.

---

### Task 1: Color de texto legible

**Files:**
- Create: `src/utils/color.js`
- Test: `src/utils/color.test.mjs`

**Interfaces:**
- Produces: `contrastRatio(a: string, b: string): number` y `readableTextColor(background: string): "#FFFFFF" | "#1B2A41"`. Exporta también `TEXT_ON_LIGHT = "#1B2A41"` y `TEXT_ON_DARK = "#FFFFFF"`.

- [ ] **Step 1: Write the failing tests** en `src/utils/color.test.mjs` con `node:test` y `node:assert/strict`:
  - `contrastRatio("#FFFFFF", "#1A73E8")` redondeado a 2 decimales es `4.51`; `contrastRatio("#1B2A41", "#F4F5F6")` es `13.23`; el orden de los argumentos no cambia el resultado.
  - `readableTextColor("#F4F5F6") === "#1B2A41"`, `readableTextColor("#1B2B44") === "#FFFFFF"`, `readableTextColor("#1A73E8") === "#FFFFFF"`, `readableTextColor("#0b1f3a") === "#FFFFFF"`.
  - Formato corto y mayúsculas: `readableTextColor("#09F")` igual a `readableTextColor("#0099ff")`.
  - Inválidos: `readableTextColor("azul")`, `readableTextColor("")`, `readableTextColor(undefined)` devuelven `"#1B2A41"`.

- [ ] **Step 2: Run to verify it fails**
  Run: `node --test src/utils/color.test.mjs`
  Expected: FAIL, módulo `./color.js` no encontrado.

- [ ] **Step 3: Implement** en `src/utils/color.js`: luminancia relativa sRGB de WCAG 2.x; acepta `#RGB` y `#RRGGBB`; con entrada inválida devuelve `TEXT_ON_LIGHT`; elige el color con mayor `contrastRatio` frente al fondo (empate a favor de `TEXT_ON_DARK`). Sin imports con alias `@/`, para que corra en Node.

- [ ] **Step 4: Run to verify it passes**
  Run: `node --test src/utils/color.test.mjs`
  Expected: todos PASS.

- [ ] **Step 5: Commit**
  `git add src/utils/color.js src/utils/color.test.mjs` y `git commit -m "feat(embed): color de texto legible segun el fondo del globo"`

### Task 2: Globos con colores, forma y metadatos del Portal

**Files:**
- Modify: `src/main.jsx` (USER_STYLES / ASSISTANT_STYLES)
- Modify: `src/components/ChatWindow/ChatContainer/ChatHistory/bubbleStyles.js`
- Modify: `src/components/ChatWindow/ChatContainer/ChatHistory/HistoricalMessage/index.jsx`
- Modify: `src/components/ChatWindow/ChatContainer/ChatHistory/PromptReply/index.jsx`

**Interfaces:**
- Consumes: `readableTextColor` de Task 1.
- Produces: en `bubbleStyles.js`, `BUBBLE_FONT = "allm-font-[inherit]"` y las constantes existentes actualizadas. Los globos del asistente llevan siempre la clase `allm-anything-llm-assistant-message` (también en PromptReply), los del usuario `allm-anything-llm-user-message`; Task 3 depende de ambas.

- [ ] **Step 1:** En `main.jsx`, defaults `userBgColor ?? "#1A73E8"` y `assistantBgColor ?? "#F4F5F6"`. Quita de `base` las clases de color de texto (`allm-text-white`, `allm-text-[#1F2937]`) y el borde `allm-border*`. Conserva radios 16/6 px y márgenes `allm-ml-[48px] allm-mr-3` / `allm-mr-[48px] allm-ml-3`.
- [ ] **Step 2:** En `bubbleStyles.js`: `BUBBLE_ROW` = 12 px entre mensajes (`allm-py-[6px]` se mantiene); `ASSISTANT_NAME` a `allm-text-[12px] allm-font-normal allm-text-[#5F6368]`; `TIMESTAMP` a `allm-text-[11px] allm-text-[#5F6368]`; `ERROR_BUBBLE` a fondo `allm-bg-[#FEF2F2]` sin borde, radios del asistente. Reemplaza `allm-font-sans` por `BUBBLE_FONT` en las constantes de nombre y hora.
- [ ] **Step 3:** En ambos componentes, cada globo normal añade `color: readableTextColor(<msgBg del rol>)` a su `style` y usa `BUBBLE_FONT` en lugar de `allm-font-sans` (también el `span` de la respuesta en PromptReply, que hoy lleva `allm-font-sans`). Los textos del error usan `allm-text-[#B91C1C]`. PromptReply añade `allm-anything-llm-assistant-message` a sus tres variantes de globo.
- [ ] **Step 4: Build**
  Run: `npx vite build`
  Expected: `✓ built`, sin errores.
- [ ] **Step 5: Verify en la preview** (servidores `embed-widget` y `mock-embed-api` de `C:\iasmar\.claude\launch.json`, página `http://localhost:3080/preview`): enviar un mensaje y leer con JS el `backgroundColor` y `color` computados de un globo de cada rol. Con `data-assistant-bg-color="#1B2B44"` (actual del Portal): asistente texto `rgb(255, 255, 255)`. Cambiando la preview a `#F4F5F6`: texto `rgb(27, 42, 65)`. Usuario siempre `rgb(255, 255, 255)` sobre `rgb(26, 115, 232)`. `fontFamily` del globo igual al del `body`.
- [ ] **Step 6: Commit** de los cuatro archivos: `feat(embed): globos con el sistema visual del Portal GC`.

### Task 3: Enlaces, indicador de escritura y error en español

**Files:**
- Modify: `src/components/Head.jsx` (CSS inyectado: `.allm-dot-falling` y reglas de enlaces)
- Modify: `src/locales/en/common.js`, `src/locales/es/common.js` (y los demás vía `normalizeEn.mjs`)
- Modify: `HistoricalMessage/index.jsx`, `PromptReply/index.jsx` (textos del error)

**Interfaces:**
- Consumes: clases `allm-anything-llm-assistant-message` / `allm-anything-llm-user-message` de Task 2.
- Produces: claves i18n `chat.error-title` y `chat.error-detail`.

- [ ] **Step 1:** En `customCss` de `Head.jsx`, cambia todo `#000000` del indicador por `#5F6368`. Agrega: `.allm-anything-llm-assistant-message a { color: #155FC4; text-decoration: underline; }` y `.allm-anything-llm-user-message a { color: inherit; text-decoration: underline; }`.
- [ ] **Step 2:** Agrega en `en`: `"error-title": "Could not respond to message."`, `"error-detail": "Server error"`; en `es`: `"No se pudo responder al mensaje."`, `"Error del servidor"`. Ejecuta `yarn normalize:translations` equivalente: `cd src/locales && node normalizeEn.mjs`.
- [ ] **Step 3:** Los errores de ambos componentes usan `t("chat.error-title")` y, cuando no hay `errorMsg`, `t("chat.error-detail")` (`useTranslation` de `react-i18next`, como en `PromptInput`).
- [ ] **Step 4: Verify**
  Run: `cd src/locales && node verifyTranslations.mjs`
  Expected: sin "Keys are missing!".
  Run: `npx vite build` → `✓ built`.
  En la preview: escribir un mensaje con "error" muestra `No se pudo responder al mensaje.` en `rgb(185, 28, 28)` sobre `rgb(254, 242, 242)`; una respuesta con enlace (agregar uno a una respuesta del mock) muestra el enlace en `rgb(21, 95, 196)` subrayado.
- [ ] **Step 5: Commit**: `feat(embed): enlaces, indicador y error de los globos en el estilo del Portal`.

### Task 4: Cierre

- [ ] **Step 1:** Recorrido final en la preview con el teclado: Tab llega al input y al botón de enviar, Enter envía, el foco es visible. Revisar a 375 px de ancho que ningún globo desborde.
- [ ] **Step 2:** Commit del spec y este plan: `git add docs/superpowers` y `git commit -m "docs(embed): diseno y plan de los globos del Portal"`.
- [ ] **Step 3:** No hacer push sin pedirlo al usuario.
