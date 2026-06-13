import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import ProcesoRegistro from "../ComponenteRegister/ProcesoRegistro/ProcesoRegistro";
import RegistroEncargado from "../ComponenteRegister/RegistrarEncargado";
import RegistroProductor from "../ComponenteRegister/RegistrarProductor";
import RegistroRepartidor from "../ComponenteRegister/RegistrarRepartidor";
import SeleccionRegister from "../ComponenteRegister/SeleccionRegister";
import AdquirirNuevoRolR from "../ComponenteRepartidor/AdquirirNuevoRolR";
import AsociarRepartidorAEvento from "../ComponenteRepartidor/AsociarRepartidorAEvento";
import FormDinamicoRestricciones from "../ComponenteRepartidor/FormDinamicoRestricciones";
import AsociacionesR from "../ComponenteRepartidor/VerAsociacionesR";
import Carrito from "../ComponentesCarrito/Carrito";
import ConsultarUsuarioPrueba from "../ComponentesConsumidor/ConsultarUsuarioPrueba";
import Notificaciones from "../ComponentesConsumidor/Notificaciones";
import AdquirirNuevoRolEPC from "../ComponentesEPC/AdquirirNuevoRolEPC";
import AsociacionesEPC from "../ComponentesEPC/AsociacionesEPC";
import ConsultarEvento from "../ComponentesEventos/ConsultarEvento";
import EventoDetalleWeb from "../ComponentesEventos/EventoDetalleWeb";
import EventoPrueba from "../ComponentesEventos/EventoPrueba";
import ListadoEventosUsers from "../ComponentesEventos/ListadoEventoUsers";
import ListadoEventosProductor from "../ComponentesEventos/ListadoEventosProductor";
import RegistrarEvento from "../ComponentesEventos/RegistrarEvento";
import RegistrarEvento2 from "../ComponentesEventos/RegistrarEvento2";
import RegistrarEvento3 from "../ComponentesEventos/RegistrarEvento3";
import RegistrarEvento4 from "../ComponentesEventos/RegistrarEvento4";
import RegistrarEvento5 from "../ComponentesEventos/RegistrarEvento5";
import VerSolicitudesEvento from "../ComponentesEventos/VerSolicitudes";
import LandingPage from "../ComponentesLandingPage/LandingPage";
import CambiarContraseña from "../ComponentesLogin/CambiarContraseña";
import HabilitarUsuario from "../ComponentesLogin/HabilitarUsuario";
import Login from "../ComponentesLogin/Login";
import RecuperarContraseña from "../ComponentesLogin/RecuperarContraseña";
import ValidarEmail from "../ComponentesLogin/ValidarEmail";
import ValidarUsuario from "../ComponentesLogin/ValidarUsuario";
import ListadoPedidos from "../ComponentesPedido/ListadoPedidos";
import ListadoPedidosEncargado from "../ComponentesPedido/PedidosEncargado/ListadoPedidosEncargado";
import ListadoPedidosRepartidor from "../ComponentesPedido/PedidosRepartidor/ListadoPedidosRepartidor";
import ConsultarProducto from "../ComponentesProducto/ConsultarProducto";
import ListadoProducto from "../ComponentesProducto/ListadoProducto";
import ListadoProductoDeshabilitado from "../ComponentesProducto/ListadoProductoDeshabilitado";
import ListadoProductoUser from "../ComponentesProducto/ListadoProductoUser";
import RegistrarProductos from "../ComponentesProducto/RegistrarProductos";
import AdquirirNuevoRolPE from "../ComponentesProductorDeEventos/AdquirirNuevoRolPE";
import AsociarPuestoAEvento from "../ComponentesPuesto/AsociarPuestoAEvento";
import ConsultarPuesto from "../ComponentesPuesto/ConsultarPuesto";
import ConsultarPuestoSolicitud from "../ComponentesPuesto/ConsultarPuestoSolicitud";
import CrearNuevoPuesto from "../ComponentesPuesto/CrearPuesto";
import ListadoPuestosEncargado from "../ComponentesPuesto/ListadoPuestosEncargado";
import ListadoPuestosUser from "../ComponentesPuesto/ListadoPuestosUser";
import ListadoPuestosDeshabilitados from "../ComponentesPuesto/PuestoDeshabilitados.js";
import PanelEncargado from "../PanelesDatos/PanelEncargado/PanelEncargado";
import PanelProductor from "../PanelesDatos/PanelProductor/PanelProductor";
import DocumentUpload from "./DocumentUpload";
import Inicio from "./Inicio";
import Sidebar from "./Sidebar";
import Preventa from "../ComponentesEventos/Preventa";

console.log("Main.js - Router Diagnostic:", { Routes, Route });

// Diagnostic log to find the undefined component causing the crash
console.log("Main.js - Checking imports for undefined values:");
const importsToCheck = {
  ProcesoRegistro, RegistroEncargado, RegistroProductor, RegistroRepartidor, SeleccionRegister,
  AdquirirNuevoRolR, AsociarRepartidorAEvento, FormDinamicoRestricciones, AsociacionesR,
  Carrito, ConsultarUsuarioPrueba, Notificaciones, AdquirirNuevoRolEPC, AsociacionesEPC,
  ConsultarEvento, EventoPrueba, ListadoEventosUsers, ListadoEventosProductor, RegistrarEvento,
  RegistrarEvento2, RegistrarEvento3, RegistrarEvento4, VerSolicitudesEvento, LandingPage,
  RegistrarEvento5,
  CambiarContraseña, HabilitarUsuario, Login, RecuperarContraseña, ValidarEmail, ValidarUsuario,
  ListadoPedidos, ListadoPedidosEncargado, ListadoPedidosRepartidor, ConsultarProducto,
  ListadoProducto, ListadoProductoDeshabilitado, ListadoProductoUser, RegistrarProductos,
  AdquirirNuevoRolPE, AsociarPuestoAEvento, ConsultarPuesto, ConsultarPuestoSolicitud,
  CrearNuevoPuesto, ListadoPuestosEncargado, ListadoPuestosUser, ListadoPuestosDeshabilitados,
  PanelEncargado, PanelProductor, DocumentUpload, Inicio, Sidebar, Preventa, EventoDetalleWeb
};
Object.entries(importsToCheck).forEach(([name, val]) => {
  if (typeof val === "undefined") console.error(`CRITICAL: Import ${name} is undefined in Main.js`);
});

const SafeRoute = ({ component: Component, name }) => {
  if (typeof Component === 'function') {
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

        {/* ─── Solo consumidor ─── */}
        <Route path="/pedidos" element={<PrivateRoute requiredRoles={["consumidor"]}><SafeRoute component={ListadoPedidos} name="ListadoPedidos" /></PrivateRoute>} />
        <Route path="/tipo-compra/:id" element={<PrivateRoute requiredRoles={["consumidor"]}><SafeRoute component={Preventa} name="Preventa" /></PrivateRoute>} />
        <Route path="/adquirir-nuevo-rolR" element={<PrivateRoute requiredRoles={["consumidor"]}><SafeRoute component={AdquirirNuevoRolR} name="AdquirirNuevoRolR" /></PrivateRoute>} />
        <Route path="/adquirir-nuevo-rolPE" element={<PrivateRoute requiredRoles={["consumidor"]}><SafeRoute component={AdquirirNuevoRolPE} name="AdquirirNuevoRolPE" /></PrivateRoute>} />
        <Route path="/adquirir-nuevo-rolEPC" element={<PrivateRoute requiredRoles={["consumidor"]}><SafeRoute component={AdquirirNuevoRolEPC} name="AdquirirNuevoRolEPC" /></PrivateRoute>} />

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
      </Routes>
    </main>
  );
};

export default Main;
