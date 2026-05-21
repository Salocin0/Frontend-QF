# Plan de Responsive Design — Frontend QuickFood

> **Estado**: 🔍 Exploración en curso  
> **Objetivo**: Hacer responsive la aplicación web completa que fue construida sin considerar breakpoints ni layouts adaptativos.  
> **Estrategia**: Relevamiento completo → análisis por pantalla → implementación coordinada para evitar regresiones.

---

## 🧠 Entendimiento del Sistema de Estilos

Antes de tocar cualquier cosa, es CRÍTICO entender cómo funciona el sistema de estilos porque usa **3 capas simultáneas** que interactúan entre sí:

### Capa 1 — SCSS Partials (`main.scss` → `main.css`)
- Archivo central: `src/components/sass/main.scss`
- Importa ~22 partials desde `src/components/sass/partials/`
- Compilado a `main.css` y `main.css.map` (ya está compilado, cambios al `.scss` requieren recompilar)
- Provee clases globales: `.sidebar`, `.navitem`, `.logo`, `.ventana-emergente`, etc.
- Variables SCSS en `_variables.scss`: `$ancho-sidebar: 250px`, `$ancho-sidebar-reducido: 80px`, colores, etc.
- **Problema**: Ya tiene UN media query en `_sidebar.scss` (`max-width: 576px`) pero solo cambia el ancho del sidebar en SCSS. Sin embargo, el sidebar usa estilos inline que SOBREESCRIBEN estas clases.

### Capa 2 — Inline styles via `useDynamicColors()` hook
- Archivo: `src/UseDinamicColors.js`
- Hook que retorna un objeto `Colors` con valores distintos según `modoOscuroActivo` (leído de `localStorage`)
- Usado en prácticamente TODOS los componentes post-login
- Los estilos de **layout** (width, display, flex, grid, position, etc.) se aplican como inline styles usando este hook o directamente
- Ejemplo típico en Sidebar.js: `style={{ width: "20%", height: "100vh", position: "fixed" }}`
- **Problema crítico**: Los inline styles tienen mayor especificidad que las clases SCSS, así que el media query de SCSS en `.sidebar` NO tiene efecto porque el `width: "20%"` inline lo sobreescribe.

### Capa 3 — CSS Modules
- Solo en `ComponentesLandingPage/`: `style.module.css` y `styles.module.css`
- Estilos locales con hash automático, no afectan al resto de la app

### Capa 4 — CSS sueltos (no-module)
- `ComponenteRepartidor/asociarAEvento.css`
- `ComponentesEPC/kanban.css`
- `ComponenteRegister/placeholder.css`

### Bootstrap
- Usado para filas (`row`), columnas (`col-*`), y algunos componentes (`Modal`, `Button`)
- Mezclado con inline styles y SCSS

### Patrón de Layout General (pantallas con sidebar)
```jsx
<div style={{ display: "flex", height: "100vh" }}>
  <div style={{ width: "20%" }}>          // ← sidebar wrapper
    <Sidebar />                            // ← position: fixed, width: "20%"
  </div>
  <div style={{ flex: 1, padding: "20px" }}>  // ← content area
    // contenido de la pantalla
  </div>
</div>
```
> ⚠️ El sidebar es `position: fixed` + `width: 20%`. En pantallas pequeñas, 20% es ~75px — demasiado angosto para mostrar texto o iconos correctamente.

### Breakpoints a implementar
Siguiendo la convención de Bootstrap que ya usa el proyecto:
- `xs`: < 576px (móvil portrait)
- `sm`: 576px – 767px (móvil landscape / tablet pequeña)
- `md`: 768px – 991px (tablet)
- `lg`: 992px – 1199px (desktop pequeño)
- `xl`: ≥ 1200px (desktop — diseño original)

---

## 📐 Componentes Transversales (afectan TODAS las pantallas)

Estos componentes son compartidos. **Un cambio aquí impacta en múltiples pantallas a la vez.**  
Deben ser los PRIMEROS en resolverse.

---

### T1 — Sidebar (`ComponentesGenerales/Sidebar.js` + `_sidebar.scss`)
**Impacta**: Todas las pantallas post-login (≥ 30 rutas)

**Problemas detectados**:
- [ ] `width: "20%"` inline style sobreescribe la variable SCSS `$ancho-sidebar: 250px` y el media query de `_sidebar.scss`
- [ ] `position: "fixed"` hace que en pantallas pequeñas el sidebar tape el contenido
- [ ] No hay mecanismo de colapso/hamburguesa para móvil
- [ ] El wrapper del sidebar en cada pantalla tiene `width: "20%"` fijo que no cede espacio al contenido en mobile
- [ ] Los textos de los `navitem` se cortan si el ancho baja de ~200px

**Cambios necesarios**:
- [ ] Implementar sidebar colapsable con botón hamburguesa en mobile (< 768px)
- [ ] En mobile: sidebar ocupa 100% del ancho o se superpone como drawer lateral
- [ ] Estado `isOpen` manejado con `useState` o Context
- [ ] Cambiar `width: "20%"` inline a lógica responsiva
- [ ] Overlay detrás del sidebar cuando está abierto en mobile
- [ ] El wrapper padre en cada pantalla debe usar `marginLeft` condicional cuando el sidebar es fixed

**Pantallas afectadas si cambia**: TODAS las que tienen sidebar (≥ 30 pantallas)

---

### T2 — Footer (`ComponentesGenerales/Footer.js` + `_footer.scss`)
**Impacta**: LandingPage + todas las pantallas post-login

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### T3 — Breadcrumb (`ComponentesGenerales/Breadcrumb.js`)
**Impacta**: ~15 pantallas post-login

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### T4 — LoandingComponent (`ComponentesGenerales/LoandingComponent.js`)
**Impacta**: ~10 pantallas

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### T5 — Filtros y Buscadores
Archivos:
- `Filtros y Buscadores/Buscador.js`
- `Filtros y Buscadores/BuscadorEventosConsumidor.js`
- `Filtros y Buscadores/BuscadorProductoConsumidor.js`
- `Filtros y Buscadores/BuscadorPuestosConsumidor.js`
- `Filtros y Buscadores/Filtros.js`
- `Filtros y Buscadores/filtersEventosConsumidor.js`
- `Filtros y Buscadores/filtersEventosEncargado.js`
- `Filtros y Buscadores/filtersPuestosConsumidor.js`
- `Filtros y Buscadores/filtersPuestosEncargado.js`

**Impacta**: ~8 pantallas de listado

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

## 🏠 Pantallas Pre-Login (sin sidebar)

---

### P1 — LandingPage (`/`)
Componentes: `Navbar.js`, `FloatingButton.js`, `Imagenes.js`, `ComoFunciona.js`, `Carrousel.js`, `Contacto.js`  
Estilos: `style.module.css` + `styles.module.css` + `_landingPage.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### P2 — Login (`/login`)
Componentes: `Login.js`, `PasswordToggle.jsx`  
Estilos: `_login.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### P3 — Selección de perfil al registrarse (`/seleccion-perfil`)
Componente: `SeleccionRegister.js`  
Estilos: `_register.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### P4 — Proceso de Registro (`/registrarse/:tipoUsuario`)
Componentes: `ProcesoRegistro.js`, `FormConsumidor.js`, `FormEncargado.js`, `FormProductor.js`, `FormRepartidor.js`, `FormUsuario.js`  
Estilos: `_register.scss`, `placeholder.css`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### P5 — Recuperar Contraseña (`/recuperar`)
Componente: `RecuperarContraseña.js`  
Estilos: `_recuperarContrasenia.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### P6 — Cambiar Contraseña (`/cambiar-contrasenia/:codigo`)
Componente: `CambiarContraseña.js`  
Estilos: `_recuperarContrasenia.scss` (probablemente compartido)

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### P7 — Validar Email (`/habilitar-Usuario-email/:id/:codigo`)
Componente: `ValidarEmail.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### P8 — Validar Usuario (`/habilitar-Usuario/:id/:codigo`)
Componente: `ValidarUsuario.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### P9 — Habilitar Usuario Deshabilitado (`/habilitar-Usuario-deshabilitado/:id`)
Componente: `HabilitarUsuario.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

## 🏠 Dashboard

---

### D1 — Inicio / Dashboard (`/inicio`)
Componente: `ComponentesGenerales/Inicio.js`  
Estilos: inline via `useDynamicColors()` + `_inicio.scss`

**Problemas detectados**:
- [ ] Grillas CSS `repeat(16, 1fr)` y `repeat(5, 1fr)` con `gridTemplateAreas` hardcodeadas — imposibles de mostrar en mobile
- [ ] Altura de filas `repeat(10, 1fr)` con `height: 100vh` → en mobile el contenido queda aplastado
- [ ] 16 columnas en repartidor/productor → colapso total en mobile
- [ ] Las cards de inicio (`CardInicio.js`) tienen tamaños fijos

**Cambios necesarios**:
- [ ] Redefinir grilla para mobile: 1 columna o 2 columnas máximo
- [ ] Cambiar `gridTemplateAreas` según breakpoint
- [ ] Cambiar `gridTemplateRows: "repeat(10, 1fr)"` por `auto` en mobile
- [ ] `CardInicio.js`: verificar tamaños hardcodeados

**Pantallas afectadas por el cambio**: Solo esta pantalla, pero el patrón del Sidebar wrapper (`width: "20%"`) sí viene de aquí.

---

## 🎭 Pantallas de Eventos

---

### E1 — Listado de Eventos (consumidor) (`/listado-eventos`)
Componente: `ComponentesEventos/ListadoEventoUsers.js`  
Sub-componentes: `EventoUser.js`, `FiltersEventosConsumidor`, `BuscadorEventosConsumidor`, `Breadcrumb`  
Estilos: `_eventos.scss`, `_eventoCard.scss`, `_filtrosGeneral.scss`

**Problemas detectados**:
- [ ] Sin explorar aún (layout con sidebar + grid de cards)

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### E2 — Detalle de Evento (`/evento/:id`)
Componente: `ComponentesEventos/ConsultarEvento.js`  
Estilos: `_eventos.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### E3 — Preventa / Tipo de compra (`/tipo-compra/:id`)
Componente: `ComponentesEventos/Preventa.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### E4 — Listado Eventos Productor (`/listado-eventos-productor`)
Componente: `ComponentesEventos/ListadoEventosProductor.js`  
Sub-componente: `EventoProductor.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### E5 — Registrar Evento Paso 1 (`/registrar-evento`)
Componente: `ComponentesEventos/RegistrarEvento.js`  
Estilos: `_eventosForm.scss`

**Problemas detectados**:
- [ ] Sin explorar aún (formulario multi-campo)

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### E6 — Registrar Evento Paso 2 (`/registrar-evento2`)
Componente: `ComponentesEventos/RegistrarEvento2.js`  
Estilos: `_eventosForm.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### E7 — Registrar Evento Paso 3 (`/registrar-evento3`)
Componente: `ComponentesEventos/RegistrarEvento3.js`  
Estilos: `_eventosForm.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### E8 — Registrar Evento Paso 4 (`/registrar-evento4/:diferenciaDiasEvento`)
Componente: `ComponentesEventos/RegistrarEvento4.js`  
Estilos: `_eventosForm.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### E9 — Registrar Evento Paso 5 (`/registrar-evento5/:eventoId/:diferenciaDiasEvento`)
Componente: `ComponentesEventos/RegistrarEvento5.js`  
Estilos: `_eventosForm.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### E10 — Ver Solicitudes de Evento (`/ver-solicitudes-evento/:evento`)
Componente: `ComponentesEventos/VerSolicitudes.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

## 🏪 Pantallas de Puestos

---

### PU1 — Listado de Puestos (consumidor) (`/listado-puestos/:idEvento`)
Componente: `ComponentesPuesto/ListadoPuestosUser.js`  
Sub-componentes: `PuestoUser.js`, `BuscadorPuestosConsumidor`, `filtersPuestosConsumidor`  
Estilos: `_puestos.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### PU2 — Info Puesto / Solicitud (`/info-puesto/:id`)
Componente: `ComponentesPuesto/ConsultarPuestoSolicitud.js`  
Estilos: `_infoPuesto.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### PU3 — Detalle Puesto (`/puesto/:id`)
Componente: `ComponentesPuesto/ConsultarPuesto.js`  
Estilos: `_puestos.scss`, `_infoPuesto.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### PU4 — Listado Puestos Encargado (`/listado-puestos-encargado`)
Componente: `ComponentesPuesto/ListadoPuestosEncargado.js`  
Sub-componentes: `PuestoEncargado.js`, `filtersPuestosEncargado`  
Estilos: `_puestos.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### PU5 — Crear Puesto (`/crear-puesto`)
Componente: `ComponentesPuesto/CrearPuesto.js`  
Estilos: `_puestos.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### PU6 — Puestos Deshabilitados (`/puestos-deshabilitados`)
Componente: `ComponentesPuesto/PuestoDeshabilitados.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### PU7 — Asociar Puesto a Evento (`/asociarPuestoAEvento/:puestoId`)
Componente: `ComponentesPuesto/AsociarPuestoAEvento.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

## 🛍️ Pantallas de Productos

---

### PR1 — Listado Productos (consumidor) (`/productos-puesto/:id`)
Componente: `ComponentesProducto/ListadoProductoUser.js`  
Sub-componentes: `ProductoUser.js`, `BuscadorProductoConsumidor`  
Estilos: `_listadoProducto.scss`, `_producto.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### PR2 — Detalle Producto (`/producto/:id`)
Componente: `ComponentesProducto/ConsultarProducto.js`  
Estilos: `_producto.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### PR3 — Listado Productos Encargado (`/listado-productos/:id`)
Componente: `ComponentesProducto/ListadoProducto.js`  
Sub-componentes: `Producto.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### PR4 — Listado Productos Deshabilitados (`/listado-productos-deshabilitados/:id`)
Componente: `ComponentesProducto/ListadoProductoDeshabilitado.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### PR5 — Registrar Productos (`/registrar-productos/:id`)
Componente: `ComponentesProducto/RegistrarProductos.js`  
Estilos: `_registrarProducto.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

## 🛒 Carrito y Pedidos

---

### C1 — Carrito (`/carrito/`)
Componente: `ComponentesCarrito/Carrito.js`  
Sub-componentes: `Tarjeta.js`, `DialogWithPatmentSheet.js`, `PaymentSheet.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### C2 — Listado Pedidos (consumidor) (`/pedidos`)
Componente: `ComponentesPedido/ListadoPedidos.js`  
Sub-componentes: `Pedido.js`, `Dialog.js`  
Estilos: `_dialog.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### C3 — Listado Pedidos Encargado (`/pedidos-Encargado/:id`)
Componente: `ComponentesPedido/PedidosEncargado/ListadoPedidosEncargado.js`  
Sub-componentes: `PedidoEncargado.js`, `KanbanBoard.js`, `PedidoDetalleDialog.js`  
Estilos: `kanban.css`, `_dialog.scss`

**Problemas detectados**:
- [ ] Sin explorar aún (Kanban puede ser muy problemático en mobile)

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### C4 — Listado Pedidos Repartidor (`/pedidos-asignados`)
Componente: `ComponentesPedido/PedidosRepartidor/ListadoPedidosRepartidor.js`  
Sub-componentes: `PedidoRepartidor.js`, `Tabs.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

## 👤 Perfil y Notificaciones

---

### U1 — Perfil de Usuario (`/perfil`)
Componente: `ComponentesConsumidor/ConsultarUsuarioPrueba.js`  
Sub-componentes: `FormUserPerfil.js`, `FormEncargadoPerfil.js`, `FormEventPerfil.js`, `FormRepartidorPerfil.js`, `RoleSection.js`, `EditableInput.js`, `estadisticasPerfil/EstadisticasPerfil.js`, `estadisticasPerfil/CardGenericaEstadistica.js`  
Estilos: `_consultarUsuario.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### U2 — Notificaciones (`/notificaciones`)
Componente: `ComponentesConsumidor/Notificaciones.js`  
Sub-componente: `CardNotificaicones.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

## 📊 Paneles de Estadísticas

---

### S1 — Panel Encargado (`/grafica-encargado`)
Componente: `PanelesDatos/PanelEncargado/PanelEncargado.js`  
Sub-componentes: `TiempoPromedioEntrega.js`, `TopProductos.js`, `TotalRecaudado.js`, `ValoracionPromedio.js`  
Gráficas: `GraficaBarras.js`, `GraficaLineas.js`, `GraficaTorta.js`, `GraficaTortaProductos.js`  
Estilos: `_PanelEncargado.scss`

**Problemas detectados**:
- [ ] Sin explorar aún (gráficas con dimensiones hardcodeadas son el mayor riesgo)

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### S2 — Panel Productor (`/grafica-productor`)
Componente: `PanelesDatos/PanelProductor/PanelProductor.js`  
Sub-componentes: `TablaPuestos.js`, `TopPuestos.js`, `TotalGenerado.js`, `ValoracionPromedio.js`  
Gráficas: `GraficaBarras.js`, `GraficaLineas.js`  
Estilos: `_PanelProductor.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

## 🚚 Pantallas Repartidor

---

### R1 — Asociar Repartidor a Evento (`/asociarRepartidorAEvento`)
Componente: `ComponenteRepartidor/AsociarRepartidorAEvento.js`  
Estilos: `asociarAEvento.css`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### R2 — Mis Asociaciones Repartidor (`/misAsociacionesR`)
Componente: `ComponenteRepartidor/VerAsociacionesR.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### R3 — Restricciones de Evento (`/restriccionesEvento/:id`)
Componente: `ComponenteRepartidor/FormDinamicoRestricciones.js`  
Estilos: `_restricciones.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### R4 — Adquirir Rol Repartidor (`/adquirir-nuevo-rolR`)
Componente: `ComponenteRepartidor/AdquirirNuevoRolR.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

## 🏭 Pantallas Productor de Eventos (adquisición de rol)

---

### PE1 — Adquirir Rol Productor de Eventos (`/adquirir-nuevo-rolPE`)
Componente: `ComponentesProductorDeEventos/AdquirirNuevoRolPE.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

## 🏢 Pantallas Encargado de Puesto y Consumidor (adquisición de rol)

---

### EPC1 — Adquirir Rol Encargado (`/adquirir-nuevo-rolEPC`)
Componente: `ComponentesEPC/AdquirirNuevoRolEPC.js`  
Estilos: `_adquirirNuevoRolEPC.scss`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### EPC2 — Mis Asociaciones Encargado (`/misAsociacionesEPC`)
Componente: `ComponentesEPC/AsociacionesEPC.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

## 🔑 Pantallas de Registro de Rol (con sidebar, formularios)

---

### REG1 — Ser Repartidor (`/ser-repartidor`)
Componente: `ComponenteRegister/RegistrarRepartidor.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### REG2 — Ser Productor (`/ser-productor`)
Componente: `ComponenteRegister/RegistrarProductor.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

### REG3 — Ser Encargado (`/ser-encargado`)
Componente: `ComponenteRegister/RegistrarEncargado.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

## 🤖 ChatBot / Panel IA

---

### BOT1 — ChatBot / ChatPanel
Componentes: `ComponentesLandingPage/ChatBot.js`, `ComponentesLandingPage/ChatPanel.js`, `ComponentesLandingPage/FloatingButton.js`

**Problemas detectados**:
- [ ] Sin explorar aún

**Cambios necesarios**:
- [ ] Pendiente de exploración

---

## 📋 Resumen de Impacto Cruzado

| Componente | Pantallas afectadas | Prioridad |
|---|---|---|
| **T1 - Sidebar** | TODAS (≥30) | 🔴 CRÍTICA — implementar primero |
| **T2 - Footer** | ~20 | 🟡 ALTA |
| **T3 - Breadcrumb** | ~15 | 🟡 ALTA |
| **T5 - Filtros/Buscadores** | ~8 | 🟡 ALTA |
| **D1 - Inicio/Dashboard** | 1 (pero sus patrones se repiten en todas) | 🔴 CRÍTICA |
| **S1/S2 - Paneles gráficas** | 2 | 🟠 MEDIA-ALTA |
| **C3 - Kanban pedidos** | 1 | 🟠 MEDIA |
| Resto de pantallas | 1 cada una | 🟢 NORMAL |

---

## 🗺️ Orden de Implementación Sugerido

1. **Transversales primero**: T1 → T2 → T3 → T4 → T5
2. **Dashboard**: D1
3. **Pre-login**: P1 → P2 → P3 → P4 → P5-P9
4. **Flujo principal consumidor**: E1 → PU1 → PR1 → C1 → C2
5. **Flujo encargado**: PU4 → PU5 → PR3 → PR5 → C3 → S1
6. **Flujo productor**: E4 → E5-E9 → E10 → S2
7. **Flujo repartidor**: C4 → R1 → R2 → R3
8. **Adquisición de roles**: R4 → PE1 → EPC1 → REG1-3
9. **Pantallas menores**: U1 → U2 → EPC2 → PU2-PU7 restantes

---

## 📝 Notas de Implementación

### ⚠️ Decisión de arquitectura de estilos
Dado que el sistema usa **3 capas simultáneas**, la estrategia para responsive debe ser:
- Para componentes con SCSS: agregar media queries en los partials correspondientes
- Para componentes con inline styles (la mayoría): cambiar de inline styles puros a combinar con CSS classes/variables, o manejar el estado del breakpoint con un custom hook `useBreakpoint()` que retorne el breakpoint actual
- **Alternativa pragmática**: Crear un hook `useResponsive()` que complemente `useDynamicColors()` con valores de layout responsivo (widths, paddings, flexDirection, etc.) — esto mantiene la arquitectura existente

### ⚠️ SCSS requiere recompilación
Los archivos `.scss` en `src/components/sass/partials/` se compilan a `main.css`. Para agregar media queries al SCSS hay que asegurarse de que el proceso de build lo recompile (probablemente `node-sass` o `sass` como script del `package.json`).

### ⚠️ Sidebar fixed + wrapper
El sidebar usa `position: fixed` + `width: 20%`. Esto significa que el contenido principal debe tener un `marginLeft` equivalente al ancho del sidebar. En mobile, si el sidebar se oculta, ese margin debe ser 0. Este cambio afecta el wrapper del sidebar en CADA pantalla.
