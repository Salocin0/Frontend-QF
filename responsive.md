# Plan Responsive — QuickFood Frontend

## Convenciones de Breakpoints

| Dispositivo | Ancho | Breakpoint SCSS |
|-------------|-------|-----------------|
| 📱 Phone | < 768px | `xs`, `sm` |
| 📟 Tablet | 768px – 991px | `md` |
| 🖥️ Web | ≥ 992px | `lg`, `xl` |

## Stack de Estilos Actual

- **SCSS** con partials en `src/components/sass/`
- **Inline styles** (objetos `styles = {}`) en ~90% de componentes
- **`useBreakpoint.js`** ya existe con `isMobile`, `isTablet`, `isDesktop`
- **`PageLayout`** ya tiene sidebar responsive (drawer en mobile)
- **MUI** para algunos componentes (CircularProgress, etc.)
- **CSS Modules** solo en LandingPage

## Reglas Generales para TODOS los Componentes

1. **Reemplazar inline styles fijos** (`width: "80%"`, `height: "550px"`) por clases SCSS con media queries
2. **Usar `useBreakpoint`** para renderizado condicional (mostrar/ocultar elementos según dispositivo)
3. **Wrapping con `PageLayout`** en todas las vistas internas (las que tengan sidebar)
4. **Grids responsivos**: en mobile siempre 1 columna, tablet 2 columnas, web 3+ columnas
5. **Tablas** en mobile → convertir a cards/listas
6. **Formularios** en mobile → campos full-width, labels arriba del input
7. **Imágenes** → siempre `max-width: 100%`, `object-fit: cover`

---

## 1. AUTENTICACIÓN

### 1.1 LandingPage (`/`)
- **📁 Archivo:** `ComponentesLandingPage/LandingPage.js`
- **📱 Phone:** Hero section full-width, texto centrado, imagen de fondo. Navbar colapsa a hamburger. Secciones apiladas verticalmente. Cards de "Cómo funciona" 1 columna. Footer apilado.
- **📟 Tablet:** Hero con texto e imagen lado a lado. Navbar con links visibles. Cards 2 columnas. Footer en 2 columnas.
- **🖥️ Web:** Hero con texto izquierda, imagen derecha. Navbar completo horizontal. Cards 3 columnas. Footer en 3 columnas.
- **Componentes internos:** `Navbar`, `ComoFunciona`, `Contacto`, `Imagenes`, `Carrousel`, `FloatingButton`, `ChatBot`

### 1.2 Login (`/login`)
- **📁 Archivo:** `ComponentesLogin/Login.js`
- **📱 Phone:** Card de login full-width (padding 16px). Logo arriba. Inputs apilados verticalmente. Botón full-width. Links debajo.
- **📟 Tablet:** Card centrada max-width 450px. Mismo layout.
- **🖥️ Web:** Card centrada max-width 400px con sombra. Posible split screen (imagen izquierda, form derecha).

### 1.3 SeleccionRegister (`/seleccion-perfil`)
- **📁 Archivo:** `ComponenteRegister/SeleccionRegister.js`
- **📱 Phone:** Título arriba. Cards de rol apiladas verticalmente (1 columna). Cada card full-width con icono + texto.
- **📟 Tablet:** Grid 2x2 de cards de rol.
- **🖥️ Web:** Grid horizontal de 4 cards de rol lado a lado.

### 1.4 ProcesoRegistro (`/registrarse/:tipoUsuario`)
- **📁 Archivo:** `ComponenteRegister/ProcesoRegistro/ProcesoRegistro.js`
- **Sub-forms:** `FormUsuario`, `FormConsumidor`, `FormEncargado`, `FormProductor`, `FormRepartidor`
- **📱 Phone:** Stepper horizontal compacto (solo números). Formulario full-width con campos apilados. Botones de acción abajo full-width.
- **📟 Tablet:** Stepper horizontal con labels. Formulario centrado max-width 600px. Dos columnas para campos cortos (nombre + apellido).
- **🖥️ Web:** Stepper horizontal completo. Formulario centrado max-width 700px. Dos columnas para campos. Sidebar informativo opcional.

### 1.5 RecuperarContraseña (`/recuperar`)
- **📱 Phone:** Card full-width. Input de email + botón apilados.
- **📟 Tablet:** Card centrada max-width 400px.
- **🖥️ Web:** Card centrada max-width 400px.

### 1.6 CambiarContraseña (`/cambiar-contrasenia/:codigo`)
- **📱 Phone:** Card full-width. Dos inputs (nueva + confirmar) apilados.
- **📟 Tablet:** Card centrada max-width 400px.
- **🖥️ Web:** Card centrada max-width 400px.

### 1.7 ValidarEmail / ValidarUsuario / HabilitarUsuario
- **📱 Phone:** Mensaje centrado, spinner, botón de acción full-width.
- **📟 Tablet:** Card centrada.
- **🖥️ Web:** Card centrada.

### 1.8 RegistroRepartidor / RegistroProductor / RegistroEncargado
- **📁 Archivo:** `ComponenteRegister/RegistrarRepartidor.js`, etc.
- **📱 Phone:** Formulario full-width, campos apilados. Botón enviar full-width.
- **📟 Tablet:** Formulario centrado max-width 500px.
- **🖥️ Web:** Formulario centrado max-width 600px.

---

## 2. HOME / DASHBOARD

### 2.1 Inicio (`/inicio`)
- **📁 Archivo:** `ComponentesGenerales/Inicio.js`
- **Contiene:** Cards de acceso rápido, resumen de actividad, notificaciones
- **📱 Phone:** Sidebar como drawer (ya implementado). Cards de acceso rápido apiladas (1 columna). Resumen en cards apiladas. Sin sidebar visible por defecto.
- **📟 Tablet:** Sidebar colapsable. Cards en grid 2x2. Resumen en 2 columnas.
- **🖥️ Web:** Sidebar fijo izquierda. Cards en grid 3 columnas. Resumen en 3 columnas con stats.

### 2.2 CardInicio (componente reutilizable)
- **📱 Phone:** Card full-width, contenido compacto (icono + título + valor).
- **📟 Tablet:** Card con más detalle visible.
- **🖥️ Web:** Card con hover effects, detalle completo.

### 2.3 Sidebar
- **📱 Phone:** Drawer overlay (ya implementado en PageLayout). Se abre con hamburger. Cierra al hacer click fuera.
- **📟 Tablet:** Drawer overlay o sidebar colapsable (toggle).
- **🖥️ Web:** Sidebar fijo 250px izquierda.

### 2.4 UserProfile (componente)
- **📱 Phone:** Avatar + nombre. Menú desplegable full-width.
- **📟 Tablet:** Avatar + nombre + dropdown.
- **🖥️ Web:** Avatar + nombre + dropdown en la esquina superior derecha.

---

## 3. EVENTOS

### 3.1 ListadoEventosUsers (`/listado-eventos`)
- **📁 Archivo:** `ComponentesEventos/ListadoEventoUsers.js`
- **📱 Phone:** Buscador/filtros arriba (colapsables). Cards de evento apiladas verticalmente (1 columna). Cada card: imagen + título + fecha + botón. Paginación abajo.
- **📟 Tablet:** Filtros visibles arriba. Cards en grid 2 columnas.
- **🖥️ Web:** Sidebar izquierda con filtros. Cards en grid 3 columnas. Filtros siempre visibles.

### 3.2 ListadoEventosProductor (`/listado-eventos-productor`)
- **📱 Phone:** Misma estructura que ListadoEventosUsers pero con acciones de productor (editar, eliminar) en cada card. Menú de acciones como bottom sheet.
- **📟 Tablet:** Cards 2 columnas con acciones inline.
- **🖥️ Web:** Cards 3 columnas o tabla con acciones en cada fila.

### 3.3 ConsultarEvento (`/evento/:id`)
- **📁 Archivo:** `ComponentesEventos/ConsultarEvento.js`
- **📱 Phone:** Header con imagen full-width. Info del evento apilada (título, fecha, descripción). Tabs para puestos/productores. Botón de acción sticky abajo.
- **📟 Tablet:** Header con imagen + info lado a lado. Tabs debajo. Layout de 2 columnas para detalle.
- **🖥️ Web:** Hero section con imagen de fondo. Info overlay. Layout de 2 columnas (detalle izquierda, puestos derecha). Sidebar con acciones.

### 3.4 RegistrarEvento (`/registrar-evento`)
- **📁 Archivo:** `ComponentesEventos/RegistrarEvento.js`
- **📱 Phone:** Wizard con pasos apilados. Cada paso full-width. Navegación (anterior/siguiente) sticky abajo.
- **📟 Tablet:** Wizard horizontal con indicadores. Formulario centrado.
- **🖥️ Web:** Wizard horizontal. Formulario centrado max-width 800px. Preview a la derecha.

### 3.5 RegistrarEvento2-5
- **📱 Phone:** Cada paso del wizard full-width. Campos apilados. Botones sticky abajo.
- **📟 Tablet:** Formulario centrado. Dos columnas para campos cortos.
- **🖥️ Web:** Formulario centrado. Dos columnas. Preview lateral.

### 3.6 VerSolicitudesEvento (`/ver-solicitudes-evento/:evento`)
- **📱 Phone:** Lista de solicitudes apiladas. Cada solicitud como card con acciones (aprobar/rechazar) como swipe o bottom sheet.
- **📟 Tablet:** Lista o tabla compacta.
- **🖥️ Web:** Tabla con columnas: solicitante, fecha, estado, acciones.

### 3.7 Preventa (`/tipo-compra/:id`)
- **📱 Phone:** Opciones de compra apiladas (1 columna). Cards full-width con descripción + botón.
- **📟 Tablet:** 2 columnas de opciones.
- **🖥️ Web:** 3 columnas de opciones con descripción detallada.

### 3.8 EventoPrueba (`/eventoPrueba`)
- **📱 Phone:** Layout simple apilado.
- **📟 Tablet:** Layout centrado.
- **🖥️ Web:** Layout con columnas.

### 3.9 FormDinamicoRestricciones (`/restriccionesEvento/:id`)
- **📱 Phone:** Formulario dinámico full-width. Cada restricción como card apilada. Botón agregar abajo.
- **📟 Tablet:** Formulario centrado.
- **🖥️ Web:** Formulario centrado con panel de ayuda lateral.

### 3.10 CardPreCompra / CardCompraInstantanea (componentes)
- **📱 Phone:** Card full-width con imagen + info + botón.
- **📟 Tablet:** Card con más espacio.
- **🖥️ Web:** Card con hover effect.

---

## 4. PUESTOS

### 4.1 ListadoPuestosUser (`/listado-puestos/:idEvento`)
- **📁 Archivo:** `ComponentesPuesto/ListadoPuestosUser.js`
- **📱 Phone:** Cards de puesto apiladas (1 columna). Cada card: imagen + nombre + tipo + botón ver. Filtros colapsables arriba.
- **📟 Tablet:** Grid 2 columnas. Filtros visibles.
- **🖥️ Web:** Grid 3 columnas. Filtros en sidebar izquierda.

### 4.2 ListadoPuestosEncargado (`/listado-puestos-encargado`)
- **📱 Phone:** Cards apiladas con acciones (editar, deshabilitar). Menú de acciones como bottom sheet.
- **📟 Tablet:** Grid 2 columnas con acciones inline.
- **🖥️ Web:** Tabla o grid 3 columnas con acciones.

### 4.3 ConsultarPuesto (`/puesto/:id`)
- **📁 Archivo:** `ComponentesPuesto/ConsultarPuesto.js`
- **📱 Phone:** Imagen full-width arriba. Info apilada (nombre, descripción, horario, ubicación). Productos debajo como lista. Botón de acción sticky abajo.
- **📟 Tablet:** Imagen + info lado a lado. Productos en grid 2 columnas.
- **🖥️ Web:** Layout 2 columnas (info izquierda, productos derecha). Mapa embebido.

### 4.4 ConsultarPuestoSolicitud (`/info-puesto/:id`)
- **📱 Phone:** Info apilada. Documentos como lista. Botones de acción (aprobar/rechazar) sticky abajo.
- **📟 Tablet:** Layout 2 columnas.
- **🖥️ Web:** Layout 2 columnas con panel de detalles.

### 4.5 CrearNuevoPuesto (`/crear-puesto`)
- **📱 Phone:** Formulario full-width. Campos apilados. Upload de imagen como área full-width. Botón enviar full-width.
- **📟 Tablet:** Formulario centrado max-width 500px. Dos columnas para campos cortos.
- **🖥️ Web:** Formulario centrado max-width 600px. Preview lateral.

### 4.6 AsociarPuestoAEvento (`/asociarPuestoAEvento/:puestoId`)
- **📱 Phone:** Lista de eventos disponibles apilada. Cada evento como card seleccionable.
- **📟 Tablet:** Grid 2 columnas de eventos.
- **🖥️ Web:** Grid 3 columnas o tabla.

### 4.7 ListadoPuestosDeshabilitados (`/puestos-deshabilitados`)
- **📱 Phone:** Cards apiladas con botón reactivar.
- **📟 Tablet:** Grid 2 columnas.
- **🖥️ Web:** Tabla con acciones.

### 4.8 PuestoEncargado / PuestoUser / PuestoDeshabilitado (cards)
- **📱 Phone:** Card full-width horizontal (imagen izquierda, info derecha).
- **📟 Tablet:** Card con más detalle.
- **🖥️ Web:** Card con hover, info completa.

### 4.9 FormPuestoEditar
- **📱 Phone:** Formulario full-width.
- **📟 Tablet:** Formulario centrado.
- **🖥️ Web:** Formulario centrado con preview.

---

## 5. PRODUCTOS

### 5.1 ListadoProductoUser (`/productos-puesto/:id`)
- **📁 Archivo:** `ComponentesProducto/ListadoProductoUser.js`
- **📱 Phone:** Cards de producto apiladas (1 columna). Cada card: imagen + nombre + precio + botón agregar. Filtro/buscador arriba colapsable.
- **📟 Tablet:** Grid 2 columnas.
- **🖥️ Web:** Grid 3-4 columnas. Filtros laterales.

### 5.2 ListadoProducto (`/listado-productos/:id`)
- **📱 Phone:** Cards apiladas con acciones (editar, deshabilitar). Botón "agregar producto" sticky abajo.
- **📟 Tablet:** Grid 2 columnas.
- **🖥️ Web:** Tabla o grid 3 columnas.

### 5.3 ListadoProductoDeshabilitado (`/listado-productos-deshabilitados/:id`)
- **📱 Phone:** Cards apiladas con botón reactivar.
- **📟 Tablet:** Grid 2 columnas.
- **🖥️ Web:** Tabla con acciones.

### 5.4 ConsultarProducto (`/producto/:id`)
- **📁 Archivo:** `ComponentesProducto/ConsultarProducto.js`
- **📱 Phone:** Imagen full-width arriba. Info apilada (nombre, precio, descripción, categoría). Botón agregar al carrito sticky abajo.
- **📟 Tablet:** Imagen + info lado a lado.
- **🖥️ Web:** Layout 2 columnas (imagen izquierda, info + compra derecha).

### 5.5 RegistrarProductos (`/registrar-productos/:id`)
- **📱 Phone:** Formulario full-width. Upload de imagen como área full-width. Campos apilados. Botón enviar full-width.
- **📟 Tablet:** Formulario centrado max-width 500px.
- **🖥️ Web:** Formulario centrado max-width 600px con preview.

### 5.6 Producto / ProductoUser / ProductoDeshabilitado (cards)
- **📱 Phone:** Card compacta (imagen + nombre + precio). Horizontal layout.
- **📟 Tablet:** Card con más detalle visible.
- **🖥️ Web:** Card con hover effect, info completa.

---

## 6. CARRITO / PEDIDOS

### 6.1 Carrito (`/carrito/`)
- **📁 Archivo:** `ComponentesCarrito/Carrito.js`
- **📱 Phone:** Lista de items apilada. Cada item: imagen + nombre + precio + controles de cantidad + eliminar. Resumen debajo (subtotal, envío, total). Botón pagar full-width sticky abajo.
- **📟 Tablet:** Lista de items más espaciosa. Resumen a la derecha (2 columnas).
- **🖥️ Web:** Layout 2 columnas (items izquierda 60%, resumen derecha 40%). Resumen sticky.

### 6.2 ListadoPedidos (`/pedidos`)
- **📁 Archivo:** `ComponentesPedido/ListadoPedidos.js`
- **📱 Phone:** Cards de pedido apiladas. Cada card: # pedido + fecha + estado + total. Tap para ver detalle.
- **📟 Tablet:** Lista más espaciosa o tabla compacta.
- **🖥️ Web:** Tabla con columnas: #, fecha, estado, total, acciones.

### 6.3 ListadoPedidosEncargado (`/pedidos-Encargado/:id`)
- **📱 Phone:** Cards apiladas con acciones de encargado (marcar preparado, entregar).
- **📟 Tablet:** Tabla compacta.
- **🖥️ Web:** Tabla completa con filtros y acciones.

### 6.4 ListadoPedidosRepartidor (`/pedidos-asignados`)
- **📱 Phone:** Cards apiladas con info de entrega (dirección, distancia). Acciones: marcar en camino, entregado. Mapa embebido pequeño.
- **📟 Tablet:** Cards con mapa lateral.
- **🖥️ Web:** Layout 2 columnas (lista izquierda, mapa derecha).

### 6.5 Pedido (card componente)
- **📱 Phone:** Card compacta horizontal.
- **📟 Tablet:** Card expandida.
- **🖥️ Web:** Card o fila de tabla.

### 6.6 PaymentSheet / DialogWithPatmentSheet / Tarjeta
- **📱 Phone:** Modal/bottom sheet full-width. Formulario de tarjeta apilado.
- **📟 Tablet:** Modal centrado.
- **🖥️ Web:** Modal centrado max-width 500px.

---

## 7. REPARTIDOR

### 7.1 AdquirirNuevoRolR (`/adquirir-nuevo-rolR`)
- **📁 Archivo:** `ComponenteRepartidor/AdquirirNuevoRolR.js`
- **📱 Phone:** Info del rol apilada. Formulario full-width. Upload de documentos como áreas full-width. Botón solicitar full-width.
- **📟 Tablet:** Layout 2 columnas (info izquierda, form derecha).
- **🖥️ Web:** Layout 2 columnas con panel informativo.

### 7.2 AsociarRepartidorAEvento (`/asociarRepartidorAEvento`)
- **📱 Phone:** Lista de eventos disponibles apilada. Cada evento como card seleccionable.
- **📟 Tablet:** Grid 2 columnas.
- **🖥️ Web:** Grid 3 columnas o tabla.

### 7.3 VerAsociacionesR (`/misAsociacionesR`)
- **📱 Phone:** Cards de asociación apiladas. Cada card: evento + puesto + estado.
- **📟 Tablet:** Grid 2 columnas.
- **🖥️ Web:** Tabla con columnas.

### 7.4 FormDinamicoRestricciones (`/restriccionesEvento/:id`)
- **📱 Phone:** Formulario dinámico full-width. Restricciones como cards apiladas.
- **📟 Tablet:** Formulario centrado.
- **🖥️ Web:** Formulario centrado con panel lateral.

### 7.5 EventoRepartidor (card)
- **📱 Phone:** Card compacta con info esencial.
- **📟 Tablet:** Card expandida.
- **🖥️ Web:** Card con detalle completo.

---

## 8. ENCARGADO / PUESTO / COMERCIO (EPC)

### 8.1 AdquirirNuevoRolEPC (`/adquirir-nuevo-rolEPC`)
- **📱 Phone:** Info apilada. Formulario full-width. Upload full-width.
- **📟 Tablet:** Layout 2 columnas.
- **🖥️ Web:** Layout 2 columnas con panel informativo.

### 8.2 AsociacionesEPC (`/misAsociacionesEPC`)
- **📱 Phone:** Cards de asociación apiladas.
- **📟 Tablet:** Grid 2 columnas.
- **🖥️ Web:** Tabla o grid 3 columnas.

### 8.3 KanbanBoard (componente)
- **📱 Phone:** Un solo kanban a la vez (tabs para cambiar entre columnas: pendiente, en preparación, listo). Scroll horizontal deshabilitado.
- **📟 Tablet:** 2 columnas visibles, tercera con scroll.
- **🖥️ Web:** 3 columnas lado a lado (pendiente | en preparación | listo).

### 8.4 PedidoDetalleDialog
- **📱 Phone:** Bottom sheet full-width con detalle del pedido.
- **📟 Tablet:** Modal centrado.
- **🖥️ Web:** Modal centrado max-width 600px.

---

## 9. PRODUCTOR DE EVENTOS

### 9.1 AdquirirNuevoRolPE (`/adquirir-nuevo-rolPE`)
- **📱 Phone:** Info apilada. Formulario full-width.
- **📟 Tablet:** Layout 2 columnas.
- **🖥️ Web:** Layout 2 columnas con panel informativo.

### 9.2 EventoProductor / EventoEncargado / EventoUser (cards)
- **📱 Phone:** Card full-width horizontal (imagen + info + estado).
- **📟 Tablet:** Card con más detalle.
- **🖥️ Web:** Card con hover, acciones inline.

---

## 10. PANELES / ESTADÍSTICAS

### 10.1 PanelEncargado (`/grafica-encargado`)
- **📁 Archivo:** `PanelesDatos/PanelEncargado/PanelEncargado.js`
- **Contiene:** TopProductos, TotalRecaudado, ValoracionPromedio, TiempoPromedioEntrega
- **📱 Phone:** Stats como cards apiladas (1 columna). Cada gráfico full-width debajo de su stat. Scroll vertical largo.
- **📟 Tablet:** Stats en grid 2x2. Gráficos en 2 columnas.
- **🖥️ Web:** Stats en grid 4 columnas arriba. Gráficos en grid 2x2 debajo.

### 10.2 PanelProductor (`/grafica-productor`)
- **📁 Archivo:** `PanelesDatos/PanelProductor/PanelProductor.js`
- **Contiene:** TablaPuestos, TotalGenerado, ValoracionPromedio, TopPuestos
- **📱 Phone:** Stats apiladas. Gráficos full-width. Tabla como cards apiladas.
- **📟 Tablet:** Stats 2x2. Gráficos 2 columnas.
- **🖥️ Web:** Stats 4 columnas. Gráficos 2x2.

### 10.3 GraficaBarras / GraficaLineas / GraficaTorta / GraficaTortaProductos
- **📱 Phone:** Gráfico full-width, leyenda debajo. Labels rotados 45° si no entran.
- **📟 Tablet:** Gráfico con leyenda lateral.
- **🖥️ Web:** Gráfico con leyenda lateral y tooltip detallado.

---

## 11. PERFIL / USUARIO

### 11.1 ConsultarUsuarioPrueba / Perfil (`/perfil`)
- **📁 Archivo:** `ComponentesConsumidor/ConsultarUsuarioPrueba.js`
- **Contiene:** FormUserPerfil, FormEncargadoPerfil, FormRepartidorPerfil, FormEventPerfil, RoleSection
- **📱 Phone:** Avatar centrado arriba. Info apilada. Secciones de rol como acordeones. Editar como modal full-screen.
- **📟 Tablet:** Layout 2 columnas (avatar + info izquierda, formularios derecha).
- **🖥️ Web:** Layout 2 columnas. Sidebar con avatar + acciones. Formularios a la derecha.

### 11.2 Notificaciones (`/notificaciones`)
- **📁 Archivo:** `ComponentesConsumidor/Notificaciones.js`
- **📱 Phone:** Lista de notificaciones apilada. Cada notificación: icono + título + descripción + fecha. Swipe para marcar leída.
- **📟 Tablet:** Lista más espaciosa.
- **🖥️ Web:** Lista con panel de detalle lateral.

### 11.3 DocumentUpload (`/subir-archivo`)
- **📱 Phone:** Área de drag & drop full-width. Lista de archivos apilada.
- **📟 Tablet:** Área centrada.
- **🖥️ Web:** Área centrada max-width 600px.

---

## 12. COMPONENTES COMPARTIDOS

### 12.1 Navbar (LandingPage)
- **📱 Phone:** Logo + hamburger. Menú como drawer overlay.
- **📟 Tablet:** Logo + links principales visibles. Más links en dropdown.
- **🖥️ Web:** Logo izquierda, links centro, botones derecha.

### 12.2 Footer
- **📱 Phone:** Apilado verticalmente (1 columna). Logo + links + redes sociales.
- **📟 Tablet:** 2 columnas.
- **🖥️ Web:** 3 columnas (info, links, contacto).

### 12.3 Buscador / BuscadorEventosConsumidor / BuscadorProductoConsumidor / BuscadorPuestosConsumidor
- **📱 Phone:** Input full-width arriba. Filtros como chips scrollable horizontal o colapsables.
- **📟 Tablet:** Input + filtros en una línea.
- **🖥️ Web:** Input + filtros siempre visibles.

### 12.4 Filtros / filtersEventosConsumidor / filtersPuestosConsumidor
- **📱 Phone:** Bottom sheet o drawer con filtros. Botón "Aplicar" full-width.
- **📟 Tablet:** Panel colapsable arriba.
- **🖥️ Web:** Panel lateral izquierdo siempre visible.

### 12.5 Breadcrumb
- **📱 Phone:** Oculto o solo muestra nivel actual + "...".
- **📟 Tablet:** Breadcrumb completo.
- **🖥️ Web:** Breadcrumb completo.

### 12.6 ActionButton
- **📱 Phone:** FAB (Floating Action Button) en esquina inferior derecha. Icono only.
- **📟 Tablet:** FAB con label.
- **🖥️ Web:** Botón inline con label + icono.

### 12.7 ConfirmDialog
- **📱 Phone:** Bottom sheet full-width.
- **📟 Tablet:** Modal centrado.
- **🖥️ Web:** Modal centrado.

### 12.8 ChatBot / ChatPanel / FloatingButton
- **📱 Phone:** Chat como overlay full-screen. FloatingButton en esquina inferior derecha.
- **📟 Tablet:** Chat como panel lateral 40% ancho.
- **🖥️ Web:** Chat como panel lateral 350px.

### 12.9 Sidebar + PageLayout
- **📱 Phone:** Sidebar como drawer overlay (ya implementado). PageLayout sin margen izquierdo.
- **📟 Tablet:** Sidebar colapsable (toggle). PageLayout ajusta margen.
- **🖥️ Web:** Sidebar fijo 250px. PageLayout con margin-left 250px.

---

## 13. FILTROS Y BUSCADORES

### 13.1 Todos los filtros
- **📱 Phone:** Colapsables por defecto. Se expanden con tap. En móvil: bottom sheet para filtros avanzados.
- **📟 Tablet:** Visibles arriba, scroll horizontal si no entran.
- **🖥️ Web:** Siempre visibles en sidebar o barra superior.

---

## 14. PRIORIDAD DE IMPLEMENTACIÓN

### Fase 1 — Crítico (pantallas que más se rompen en mobile)
1. `PageLayout` + `Sidebar` — ya tiene drawer, auditar consistencia
2. `LandingPage` — es la primera vista
3. `Login` / `ProcesoRegistro` — auth flow
4. `Inicio` — dashboard principal
5. `ListadoEventosUsers` — listado más usado
6. `Carrito` — flujo de compra

### Fase 2 — Alto (listados y forms principales)
7. `ListadoPuestosUser` / `ListadoPuestosEncargado`
8. `ListadoProductoUser` / `ListadoProducto`
9. `ConsultarEvento` / `ConsultarPuesto` / `ConsultarProducto`
10. `ListadoPedidos` / `ListadoPedidosEncargado` / `ListadoPedidosRepartidor`
11. `RegistrarEvento` (wizard completo)

### Fase 3 — Medio (paneles y perfiles)
12. `PanelEncargado` / `PanelProductor`
13. `ConsultarUsuarioPrueba` (perfil)
14. `Notificaciones`
15. `KanbanBoard`

### Fase 4 — Bajo (secundarios)
16. Todos los formularios de registro de rol
17. `AsociarRepartidorAEvento` / `AsociacionesR`
18. `AsociacionesEPC`
19. `Preventa` / `VerSolicitudesEvento`
20. `DocumentUpload`
21. `FormDinamicoRestricciones`
