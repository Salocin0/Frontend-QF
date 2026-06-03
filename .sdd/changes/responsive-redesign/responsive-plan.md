# Plan de Refactor Responsive — Frontend QuickFood

> **Estado**: ✅ Completado — Fases 0 a 5 implementadas  
> **Objetivo**: Hacer responsive la app sin romper la estructura visual de cada ventana.  
> **Estrategia**: Extraer patrones → sistematizar en CSS → refactor componentes uno por uno.  
> **Stack**: `openspec` (artefactos en archivos para evitar pérdida por compactación)

---

## Principio Rector

**NO reescribir componentes.** Mantener la misma estructura visual. Solo mover la lógica de layout de inline styles a CSS clases reutilizables, y agregar comportamiento responsive donde hoy no existe (sidebar colapsable, grids que se adaptan solos).

---

## ✅ Fase 0 — Fundación (1 archivo: `_layout.scss`)

### 0.1 Variables CSS de layout

Agregar a `:root`:
```css
--sidebar-width: 250px;
--sidebar-collapsed-width: 0px;
--sidebar-transition: 0.3s ease;
```

### 0.2 Clase `.page-layout--collapsible`

El PageLayout actual ya tiene `page-layout`, `page-layout__sidebar`, `page-layout__content`. Solo hay que:
- Agregar un estado `collapsed` en PageLayout
- Cuando collapsed → sidebar se oculta (`width: 0` o `transform: translateX(-100%)`)
- El contenido ocupa el 100%
- Botón toggle visible en desktop también (no solo mobile)

### 0.3 Clases utilitarias de layout (ya existen en `_layout.scss`)

Reforzar el uso de:
- `.qf-layout-row` → `display: flex; flex-direction: row`
- `.qf-layout-col` → `display: flex; flex-direction: column`
- `.qf-layout-sidebar-content` → el wrap sidebar + contenido con gap
- `.qf-aside` → columna lateral (filtros, buscadores)
- `.qf-main` → contenido principal
- `.qf-grid-cards` → `display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`

---

## ✅ Fase 1 — PageLayout: Sidebar colapsable

**Archivos afectados:**
- `src/components/ComponentesGenerales/PageLayout.js`
- `src/components/sass/partials/_layout.scss`

**Cambios:**
1. Agregar prop `collapsible={true}` (por defecto `true`)
2. Botón toggle (≡) visible siempre — en mobile es el hamburguesa actual, en desktop es un chevron angosto
3. Sidebar se desliza: en desktop se oculta/revela con animación, en mobile es drawer como ahora
4. `--sidebar-width` cambia de 250px a `--sidebar-collapsed-width` cuando está colapsado

**NO cambia:** La estructura visual del sidebar, los items, colores, nada.

---

## ✅ Fase 2 — Inicio (`/inicio`)

**Archivos afectados:**
- `src/components/ComponentesGenerales/Inicio.js`
- `src/components/ComponentesGenerales/CardInicio.js`

**Problema:** `gridTemplateAreas` hardcodeadas con `repeat(16, 1fr)` y `repeat(5, 1fr)`. En mobile fuerza `display: flex` que apila todo pero pierde el sentido de las áreas.

**Solución:**
- Reemplazar `gridTemplateAreas` por un grid simple con `auto-fill, minmax(280px, 1fr)`
- Cada `CardInicio` mantiene su `gridArea` visual (eventos, pedidos, etc.) pero ahora se reordena solo
- En mobile: 1 columna. En tablet: 2 columnas. En desktop: 3-4 columnas según el rol
- Mantener exactamente las mismas cards, imágenes, colores, sombras

**Visualmente:** Las cards se ven iguales. Solo cambia cómo se reordenan cuando la pantalla es chica.

---

## ✅ Fase 3 — ListadoEventos (users + productor)

**Archivos afectados:**
- `src/components/ComponentesEventos/ListadoEventoUsers.js`
- `src/components/ComponentesEventos/ListadoEventosProductor.js`
- `src/components/sass/partials/_layout.scss`

**Problema:** Layout manual 70/30 con inline styles y ternarios de breakpoint. Cada listado reinventa el mismo layout.

**Solución:**
- Extraer el layout (columna principal + aside de filtros) a clases CSS
- `ListadoEventoUsers` y `ListadoEventosProductor` usan la misma clase de layout
- El contenido de eventos: hoy está en flex column con width 100%. Pasarlo a un grid que acomode las cards responsivamente
- Cada evento (card) mantiene su estructura visual intacta

**Visualmente:** La distribución de filtros (derecha en desktop, arriba en mobile) se mantiene. Lo que cambia es que se usa una clase CSS en vez de 80 líneas de objeto styles.

---

## ✅ Fase 4 — Cards de evento

**Archivos afectados:**
- `src/components/ComponentesEventos/EventoUser.js`
- `src/components/ComponentesEventos/EventoProductor.js`

**Problema:** Inline styles con widths fijos. Imagen de 140px que no se adapta.

**Solución:**
- Reemplazar inline styles con clases CSS (`.qf-card-event`, `.qf-card-event__image`, etc.)
- La imagen pasa de `width: 140px` fijo a `max-width: 100%` con tamaño responsivo
- En mobile: la card se apila (imagen arriba, texto abajo) o mantiene imagen compacta a la izquierda

**Visualmente:** La card se ve igual en desktop. En mobile se adapta sin romperse.

---

## ✅ Fase 5 — Filtros y Buscadores

**Archivos afectados:**
- Todos los archivos en `Filtros y Buscadores/`

**Problema:** Cada filtro/buscador tiene inline styles propios. Se ven similares pero no son iguales.

**Solución:**
- Crear clases CSS compartidas: `.qf-filter`, `.qf-filter__group`, `.qf-search`, etc.
- Refactorizar cada componente para usar las clases en vez de inline styles
- Misma apariencia, pero ahora si cambia el diseño de filtros, cambia en todos lados

---

## Orden de Ejecución

```
Fase 0 (Fundación CSS)              ✅
  └── Fase 1 (PageLayout)           ✅
        └── Fase 2 (Inicio)         ✅
        └── Fase 3 (Listados)       ✅
              └── Fase 4 (Cards)    ✅
              └── Fase 5 (Filtros)  ✅
```

Cada fase es independiente y verificable. Si algo sale mal en una fase, las anteriores siguen funcionando.

---

## Archivos Modificados (totales)

| Archivo | Fase | Estado |
|---------|------|--------|
| `src/components/sass/partials/_layout.scss` | 0, 1, 3, 4, 5 | ✅ |
| `src/components/ComponentesGenerales/PageLayout.js` | 1 | ✅ |
| `src/components/ComponentesGenerales/Inicio.js` | 2 | ✅ |
| `src/components/ComponentesGenerales/CardInicio.js` | 2 | ✅ |
| `src/components/ComponentesEventos/ListadoEventoUsers.js` | 3 | ✅ |
| `src/components/ComponentesEventos/ListadoEventosProductor.js` | 3 | ✅ |
| `src/components/ComponentesEventos/EventoUser.js` | 4 | ✅ |
| `src/components/ComponentesEventos/EventoProductor.js` | 4 | ✅ |
| `src/components/Filtros y Buscadores/BuscadorEventosConsumidor.js` | 5 | ✅ |
| `src/components/Filtros y Buscadores/BuscadorProductoConsumidor.js` | 5 | ✅ |
| `src/components/Filtros y Buscadores/BuscadorPuestosConsumidor.js` | 5 | ✅ |
| `src/components/Filtros y Buscadores/filtersEventosConsumidor.js` | 5 | ✅ |
| `src/components/Filtros y Buscadores/filtersPuestosConsumidor.js` | 5 | ✅ |

---

## Verificación

Después de cada fase:
1. `npm run build` (o `react-scripts build`) — que compile sin errores
2. Revisar visualmente que la ventana se vea igual que antes
3. Revisar que el responsive nuevo funcione (redimensionar browser)
