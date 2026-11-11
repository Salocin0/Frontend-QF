import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import ProcesoRegistro from "../ComponenteRegister/ProcesoRegistro/ProcesoRegistro";
import RegistroEncargado from "../ComponenteRegister/RegistrarEncargado";
import RegistroProductor from "../ComponenteRegister/RegistrarProductor";
import RegistroRepartidor from "../ComponenteRegister/RegistrarRepartidor";
import SeleccionRegister from "../ComponenteRegister/SeleccionRegister";
import LandingPage from "../ComponentesLandingPage/LandingPage";
import CambiarContraseña from "../ComponentesLogin/CambiarContraseña";
import HabilitarUsuario from "../ComponentesLogin/HabilitarUsuario";
import Login from "../ComponentesLogin/Login";
import RecuperarContraseña from "../ComponentesLogin/RecuperarContraseña";
import ValidarEmail from "../ComponentesLogin/ValidarEmail";
import ValidarUsuario from "../ComponentesLogin/ValidarUsuario";

const AdquirirNuevoRolR = lazy(() => import("../ComponenteRepartidor/AdquirirNuevoRolR"));
const AsociarRepartidorAEvento = lazy(() => import("../ComponenteRepartidor/AsociarRepartidorAEvento"));
const FormDinamicoRestricciones = lazy(() => import("../ComponenteRepartidor/FormDinamicoRestricciones"));
const AsociacionesR = lazy(() => import("../ComponenteRepartidor/VerAsociacionesR"));
const Carrito = lazy(() => import("../ComponentesCarrito/Carrito"));
const ConsultarUsuarioPrueba = lazy(() => import("../ComponentesConsumidor/ConsultarUsuarioPrueba"));
const Notificaciones = lazy(() => import("../ComponentesConsumidor/Notificaciones"));
const AdquirirNuevoRolEPC = lazy(() => import("../ComponentesEPC/AdquirirNuevoRolEPC"));
const AsociacionesEPC = lazy(() => import("../ComponentesEPC/AsociacionesEPC"));
const ConsultarEvento = lazy(() => import("../ComponentesEventos/ConsultarEvento"));
const EventoDetalleWeb = lazy(() => import("../ComponentesEventos/EventoDetalleWeb"));
const EventoPrueba = lazy(() => import("../ComponentesEventos/EventoPrueba"));
const ListadoEventosUsers = lazy(() => import("../ComponentesEventos/ListadoEventoUsers"));
const ListadoEventosProductor = lazy(() => import("../ComponentesEventos/ListadoEventosProductor"));
const RegistrarEvento = lazy(() => import("../ComponentesEventos/RegistrarEvento"));
const RegistrarEvento2 = lazy(() => import("../ComponentesEventos/RegistrarEvento2"));
const RegistrarEvento3 = lazy(() => import("../ComponentesEventos/RegistrarEvento3"));
const RegistrarEvento4 = lazy(() => import("../ComponentesEventos/RegistrarEvento4"));
const RegistrarEvento5 = lazy(() => import("../ComponentesEventos/RegistrarEvento5"));
const VerSolicitudesEvento = lazy(() => import("../ComponentesEventos/VerSolicitudes"));
const ListadoPedidos = lazy(() => import("../ComponentesPedido/ListadoPedidos"));
const ListadoPedidosEncargado = lazy(() => import("../ComponentesPedido/PedidosEncargado/ListadoPedidosEncargado"));
const ListadoPedidosRepartidor = lazy(() => import("../ComponentesPedido/PedidosRepartidor/ListadoPedidosRepartidor"));
const ConsultarProducto = lazy(() => import("../ComponentesProducto/ConsultarProducto"));
const ListadoProducto = lazy(() => import("../ComponentesProducto/ListadoProducto"));
const ListadoProductoDeshabilitado = lazy(() => import("../ComponentesProducto/ListadoProductoDeshabilitado"));
const ListadoProductoUser = lazy(() => import("../ComponentesProducto/ListadoProductoUser"));
const RegistrarProductos = lazy(() => import("../ComponentesProducto/RegistrarProductos"));
const AdquirirNuevoRolPE = lazy(() => import("../ComponentesProductorDeEventos/AdquirirNuevoRolPE"));
const AsociarPuestoAEvento = lazy(() => import("../ComponentesPuesto/AsociarPuestoAEvento"));
const ConsultarPuesto = lazy(() => import("../ComponentesPuesto/ConsultarPuesto"));
const ConsultarPuestoSolicitud = lazy(() => import("../ComponentesPuesto/ConsultarPuestoSolicitud"));
const CrearNuevoPuesto = lazy(() => import("../ComponentesPuesto/CrearPuesto"));
const ListadoPuestosEncargado = lazy(() => import("../ComponentesPuesto/ListadoPuestosEncargado"));
const ListadoPuestosUser = lazy(() => import("../ComponentesPuesto/ListadoPuestosUser"));
const ListadoPuestosDeshabilitados = lazy(() => import("../ComponentesPuesto/PuestoDeshabilitados.js"));
const PanelEncargado = lazy(() => import("../PanelesDatos/PanelEncargado/PanelEncargado"));
const PanelProductor = lazy(() => import("../PanelesDatos/PanelProductor/PanelProductor"));
const DocumentUpload = lazy(() => import("./DocumentUpload"));
const Inicio = lazy(() => import("./Inicio"));
const Sidebar = lazy(() => import("./Sidebar"));
const Preventa = lazy(() => import("../ComponentesEventos/Preventa"));

// Public pre-login screens are imported eagerly; every other screen is loaded on demand (React.lazy), so the
// login and landing pages do not wait for the charts, maps, PDF and payment libraries of the private screens.
const isRenderable = (Component) => typeof Component === 'function' || Boolean(Component?.$$typeof);

const RouteFallback = () => <div className="qf-route-loading" role="status" aria-live="polite">Cargando…</div>;

const SafeRoute = ({ component: Component, name }) => {
  if (isRenderable(Component)) {
    return <Component />;
  } else {
    console.error(`ERROR: El componente "${name}" no es una función válida. Revisa su importación en Main.js`);
    return <div style={{padding: 20, color: 'red', border: '1px solid red'}}>Error: Componente "{name}" no encontrado o no válido.</div>;
  }
};

const ALL_ROLES = ["consumidor", "repartidor", "encargado", "productor"];

const Main = () => {
  return (
    <main>
      <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* ─── Públicas (sin protección) ─── */}
        <Route path="/registrarse/:tipoUsuario" element={<SafeRoute component={ProcesoRegistro} name="ProcesoRegistro" />} />
        <Route path="/login" element={<SafeRoute component={Login} name="Login" />} />
        <Route path="/seleccion-perfil" element={<SafeRoute component={SeleccionRegister} name="SeleccionRegister" />} />
        <Route path="/habilitar-Usuario-email/:id/:codigo" element={<SafeRoute component={ValidarEmail} name="ValidarEmail" />} />
        <Route path="/habilitar-Usuario/:id/:codigo" element={<SafeRoute component={ValidarUsuario} name="ValidarUsuario" />} />
        <Route path="/recuperar" element={<SafeRoute component={RecuperarContraseña} name="RecuperarContraseña" />} />
        <Route path="/cambiar-contrasenia/:codigo" element={<SafeRoute component={CambiarContraseña} name="CambiarContraseña" />} />
        <Route path="/habilitar-Usuario-deshabilitado/:id" element={<SafeRoute component={HabilitarUsuario} name="HabilitarUsuario" />} />
        <Route path="/" element={<SafeRoute component={LandingPage} name="LandingPage" />} />
        <Route path="/ser-repartidor" element={<SafeRoute component={RegistroRepartidor} name="RegistroRepartidor" />} />
        <Route path="/ser-productor" element={<SafeRoute component={RegistroProductor} name="RegistroProductor" />} />
        <Route path="/ser-encargado" element={<SafeRoute component={RegistroEncargado} name="RegistroEncargado" />} />
        {/* Legacy / guessable URLs that used to render an empty page */}
        <Route path="/registrarse" element={<Navigate to="/seleccion-perfil" replace />} />
        <Route path="/recuperar-contrasena" element={<Navigate to="/recuperar" replace />} />
        <Route path="/olvide-contrasena" element={<Navigate to="/recuperar" replace />} />
        <Route path="/subir-archivo" element={<SafeRoute component={DocumentUpload} name="DocumentUpload" />} />

        {/* ─── Todos autenticados ─── */}
        <Route path="/inicio" element={<PrivateRoute requiredRoles={ALL_ROLES}><SafeRoute component={Inicio} name="Inicio" /></PrivateRoute>} />
        <Route path="/sidebar" element={<PrivateRoute requiredRoles={ALL_ROLES}><SafeRoute component={Sidebar} name="Sidebar" /></PrivateRoute>} />
        <Route path="/listado-eventos" element={<PrivateRoute requiredRoles={ALL_ROLES}><SafeRoute component={ListadoEventosUsers} name="ListadoEventosUsers" /></PrivateRoute>} />
        <Route path="/listado-puestos/:idEvento" element={<PrivateRoute requiredRoles={ALL_ROLES}><SafeRoute component={ListadoPuestosUser} name="ListadoPuestosUser" /></PrivateRoute>} />
        <Route path="/productos-puesto/:id" element={<PrivateRoute requiredRoles={ALL_ROLES}><SafeRoute component={ListadoProductoUser} name="ListadoProductoUser" /></PrivateRoute>} />
        <Route path="/carrito/" element={<PrivateRoute requiredRoles={ALL_ROLES}><SafeRoute component={Carrito} name="Carrito" /></PrivateRoute>} />
        <Route path="/notificaciones" element={<PrivateRoute requiredRoles={ALL_ROLES}><SafeRoute component={Notificaciones} name="Notificaciones" /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute requiredRoles={ALL_ROLES}><SafeRoute component={ConsultarUsuarioPrueba} name="ConsultarUsuarioPrueba" /></PrivateRoute>} />
        <Route path="/info-puesto/:id" element={<PrivateRoute requiredRoles={ALL_ROLES}><SafeRoute component={ConsultarPuestoSolicitud} name="ConsultarPuestoSolicitud" /></PrivateRoute>} />
        <Route path="/puesto/:id" element={<PrivateRoute requiredRoles={ALL_ROLES}><SafeRoute component={ConsultarPuesto} name="ConsultarPuesto" /></PrivateRoute>} />
        <Route path="/producto/:id" element={<PrivateRoute requiredRoles={ALL_ROLES}><SafeRoute component={ConsultarProducto} name="ConsultarProducto" /></PrivateRoute>} />
        <Route path="/evento/:id" element={<PrivateRoute requiredRoles={ALL_ROLES}><SafeRoute component={ConsultarEvento} name="ConsultarEvento" /></PrivateRoute>} />
        <Route path="/eventoPrueba" element={<PrivateRoute requiredRoles={ALL_ROLES}><SafeRoute component={EventoPrueba} name="EventoPrueba" /></PrivateRoute>} />

        {/* ─── Todos los roles (antes solo consumidor) ─── */}
        <Route path="/pedidos" element={<PrivateRoute requiredRoles={ALL_ROLES}><SafeRoute component={ListadoPedidos} name="ListadoPedidos" /></PrivateRoute>} />
        <Route path="/tipo-compra/:id" element={<PrivateRoute requiredRoles={ALL_ROLES}><SafeRoute component={Preventa} name="Preventa" /></PrivateRoute>} />
        <Route path="/adquirir-nuevo-rolR" element={<PrivateRoute requiredRoles={ALL_ROLES}><SafeRoute component={AdquirirNuevoRolR} name="AdquirirNuevoRolR" /></PrivateRoute>} />
        <Route path="/adquirir-nuevo-rolPE" element={<PrivateRoute requiredRoles={ALL_ROLES}><SafeRoute component={AdquirirNuevoRolPE} name="AdquirirNuevoRolPE" /></PrivateRoute>} />
        <Route path="/adquirir-nuevo-rolEPC" element={<PrivateRoute requiredRoles={ALL_ROLES}><SafeRoute component={AdquirirNuevoRolEPC} name="AdquirirNuevoRolEPC" /></PrivateRoute>} />

        {/* ─── Solo repartidor ─── */}
        <Route path="/pedidos-asignados" element={<PrivateRoute requiredRoles={["repartidor"]}><SafeRoute component={ListadoPedidosRepartidor} name="ListadoPedidosRepartidor" /></PrivateRoute>} />
        <Route path="/asociarRepartidorAEvento" element={<PrivateRoute requiredRoles={["repartidor"]}><SafeRoute component={AsociarRepartidorAEvento} name="AsociarRepartidorAEvento" /></PrivateRoute>} />
        <Route path="/misAsociacionesR" element={<PrivateRoute requiredRoles={["repartidor"]}><SafeRoute component={AsociacionesR} name="AsociacionesR" /></PrivateRoute>} />
        <Route path="/restriccionesEvento/:id" element={<PrivateRoute requiredRoles={["repartidor"]}><SafeRoute component={FormDinamicoRestricciones} name="FormDinamicoRestricciones" /></PrivateRoute>} />

        {/* ─── Solo productor ─── */}
        <Route path="/listado-eventos-productor" element={<PrivateRoute requiredRoles={["productor"]}><SafeRoute component={ListadoEventosProductor} name="ListadoEventosProductor" /></PrivateRoute>} />
        <Route path="/ver-solicitudes-evento/:evento" element={<PrivateRoute requiredRoles={["productor"]}><SafeRoute component={VerSolicitudesEvento} name="VerSolicitudesEvento" /></PrivateRoute>} />
        <Route path="/registrar-evento2" element={<PrivateRoute requiredRoles={["productor"]}><SafeRoute component={RegistrarEvento2} name="RegistrarEvento2" /></PrivateRoute>} />
        <Route path="/registrar-evento3" element={<PrivateRoute requiredRoles={["productor"]}><SafeRoute component={RegistrarEvento3} name="RegistrarEvento3" /></PrivateRoute>} />
        <Route path="/registrar-evento4/:diferenciaDiasEvento" element={<PrivateRoute requiredRoles={["productor"]}><SafeRoute component={RegistrarEvento4} name="RegistrarEvento4" /></PrivateRoute>} />
        <Route path="/registrar-evento5/:eventoId/:diferenciaDiasEvento" element={<PrivateRoute requiredRoles={["productor"]}><SafeRoute component={RegistrarEvento5} name="RegistrarEvento5" /></PrivateRoute>} />
        <Route path="/grafica-productor" element={<PrivateRoute requiredRoles={["productor"]}><SafeRoute component={PanelProductor} name="PanelProductor" /></PrivateRoute>} />
        <Route path="/registrar-evento" element={<PrivateRoute requiredRoles={["productor"]}><SafeRoute component={RegistrarEvento} name="RegistrarEvento" /></PrivateRoute>} />
        <Route path="/evento-detalle/:id" element={<PrivateRoute requiredRoles={["productor","encargado"]}><SafeRoute component={EventoDetalleWeb} name="EventoDetalleWeb" /></PrivateRoute>} />

        {/* ─── Solo encargado ─── */}
        <Route path="/listado-puestos-encargado" element={<PrivateRoute requiredRoles={["encargado"]}><SafeRoute component={ListadoPuestosEncargado} name="ListadoPuestosEncargado" /></PrivateRoute>} />
        <Route path="/asociarPuestoAEvento/:puestoId" element={<PrivateRoute requiredRoles={["encargado"]}><SafeRoute component={AsociarPuestoAEvento} name="AsociarPuestoAEvento" /></PrivateRoute>} />
        <Route path="/listado-productos/:id" element={<PrivateRoute requiredRoles={["encargado"]}><SafeRoute component={ListadoProducto} name="ListadoProducto" /></PrivateRoute>} />
        <Route path="/crear-puesto" element={<PrivateRoute requiredRoles={["encargado"]}><SafeRoute component={CrearNuevoPuesto} name="CrearNuevoPuesto" /></PrivateRoute>} />
        <Route path="/listado-productos-deshabilitados/:id" element={<PrivateRoute requiredRoles={["encargado"]}><SafeRoute component={ListadoProductoDeshabilitado} name="ListadoProductoDeshabilitado" /></PrivateRoute>} />
        <Route path="/registrar-productos/:id" element={<PrivateRoute requiredRoles={["encargado"]}><SafeRoute component={RegistrarProductos} name="RegistrarProductos" /></PrivateRoute>} />
        <Route path="/misAsociacionesEPC" element={<PrivateRoute requiredRoles={["encargado"]}><SafeRoute component={AsociacionesEPC} name="AsociacionesEPC" /></PrivateRoute>} />
        <Route path="/pedidos-Encargado/:id" element={<PrivateRoute requiredRoles={["encargado"]}><SafeRoute component={ListadoPedidosEncargado} name="ListadoPedidosEncargado" /></PrivateRoute>} />
        <Route path="/grafica-encargado" element={<PrivateRoute requiredRoles={["encargado"]}><SafeRoute component={PanelEncargado} name="PanelEncargado" /></PrivateRoute>} />
        <Route path="/puestos-deshabilitados" element={<PrivateRoute requiredRoles={["encargado"]}><SafeRoute component={ListadoPuestosDeshabilitados} name="ListadoPuestosDeshabilitados" /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </main>
  );
};

export default Main;
