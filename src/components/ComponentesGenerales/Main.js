import React from "react";
import { Route, Routes } from "react-router-dom";
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
import EventoPrueba from "../ComponentesEventos/EventoPrueba";
import ListadoEventosUsers from "../ComponentesEventos/ListadoEventoUsers";
import ListadoEventosProductor from "../ComponentesEventos/ListadoEventosProductor";
import RegistrarEvento from "../ComponentesEventos/RegistrarEvento";
import RegistrarEvento2 from "../ComponentesEventos/RegistrarEvento2";
import RegistrarEvento3 from "../ComponentesEventos/RegistrarEvento3";
import RegistrarEvento4 from "../ComponentesEventos/RegistrarEvento4";
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
  CambiarContraseña, HabilitarUsuario, Login, RecuperarContraseña, ValidarEmail, ValidarUsuario,
  ListadoPedidos, ListadoPedidosEncargado, ListadoPedidosRepartidor, ConsultarProducto,
  ListadoProducto, ListadoProductoDeshabilitado, ListadoProductoUser, RegistrarProductos,
  AdquirirNuevoRolPE, AsociarPuestoAEvento, ConsultarPuesto, ConsultarPuestoSolicitud,
  CrearNuevoPuesto, ListadoPuestosEncargado, ListadoPuestosUser, ListadoPuestosDeshabilitados,
  PanelEncargado, PanelProductor, DocumentUpload, Inicio, Sidebar, Preventa
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

const Main = () => {
  return (
    <main>
      <Routes>
        <Route path="/registrarse/:tipoUsuario" element={<SafeRoute component={ProcesoRegistro} name="ProcesoRegistro" />} />
        <Route path="/login" element={<SafeRoute component={Login} name="Login" />} />
        <Route path="/seleccion-perfil" element={<SafeRoute component={SeleccionRegister} name="SeleccionRegister" />} />
        <Route path="/habilitar-Usuario-email/:id/:codigo" element={<SafeRoute component={ValidarEmail} name="ValidarEmail" />} />
        <Route path="/habilitar-Usuario/:id/:codigo" element={<SafeRoute component={ValidarUsuario} name="ValidarUsuario" />} />
        <Route path="/recuperar" element={<SafeRoute component={RecuperarContraseña} name="RecuperarContraseña" />} />
        <Route path="/cambiar-contrasenia/:codigo" element={<SafeRoute component={CambiarContraseña} name="CambiarContraseña" />} />
        <Route path="/habilitar-Usuario-deshabilitado/:id" element={<SafeRoute component={HabilitarUsuario} name="HabilitarUsuario" />} />
        <Route path="/" element={<SafeRoute component={LandingPage} name="LandingPage" />} />
        <Route path="/inicio" element={<SafeRoute component={Inicio} name="Inicio" />} />
        <Route path="/sidebar" element={<SafeRoute component={Sidebar} name="Sidebar" />} />
        <Route path="/listado-eventos" element={<SafeRoute component={ListadoEventosUsers} name="ListadoEventosUsers" />} />
        <Route path="/listado-puestos/:idEvento" element={<SafeRoute component={ListadoPuestosUser} name="ListadoPuestosUser" />} />
        <Route path="/productos-puesto/:id" element={<SafeRoute component={ListadoProductoUser} name="ListadoProductoUser" />} />
        <Route path="/carrito/" element={<SafeRoute component={Carrito} name="Carrito" />} />
        <Route path="/pedidos" element={<SafeRoute component={ListadoPedidos} name="ListadoPedidos" />} />
        <Route path="/adquirir-nuevo-rolR" element={<SafeRoute component={AdquirirNuevoRolR} name="AdquirirNuevoRolR" />} />
        <Route path="/adquirir-nuevo-rolPE" element={<SafeRoute component={AdquirirNuevoRolPE} name="AdquirirNuevoRolPE" />} />
        <Route path="/adquirir-nuevo-rolEPC" element={<SafeRoute component={AdquirirNuevoRolEPC} name="AdquirirNuevoRolEPC" />} />
        <Route path="/pedidos-asignados" element={<SafeRoute component={ListadoPedidosRepartidor} name="ListadoPedidosRepartidor" />} />
        <Route path="/asociarRepartidorAEvento" element={<SafeRoute component={AsociarRepartidorAEvento} name="AsociarRepartidorAEvento" />} />
        <Route path="/misAsociacionesR" element={<SafeRoute component={AsociacionesR} name="AsociacionesR" />} />
        <Route path="/listado-puestos-encargado" element={<SafeRoute component={ListadoPuestosEncargado} name="ListadoPuestosEncargado" />} />
        <Route path="/asociarPuestoAEvento/:puestoId" element={<SafeRoute component={AsociarPuestoAEvento} name="AsociarPuestoAEvento" />} />
        <Route path="/listado-productos/:id" element={<SafeRoute component={ListadoProducto} name="ListadoProducto" />} />
        <Route path="/crear-puesto" element={<SafeRoute component={CrearNuevoPuesto} name="CrearNuevoPuesto" />} />
        <Route path="/listado-productos-deshabilitados/:id" element={<SafeRoute component={ListadoProductoDeshabilitado} name="ListadoProductoDeshabilitado" />} />
        <Route path="/registrar-productos/:id" element={<SafeRoute component={RegistrarProductos} name="RegistrarProductos" />} />
        <Route path="/misAsociacionesEPC" element={<SafeRoute component={AsociacionesEPC} name="AsociacionesEPC" />} />
        <Route path="/pedidos-Encargado/:id" element={<SafeRoute component={ListadoPedidosEncargado} name="ListadoPedidosEncargado" />} />
        <Route path="/listado-eventos-productor" element={<SafeRoute component={ListadoEventosProductor} name="ListadoEventosProductor" />} />
        <Route path="/ver-solicitudes-evento/:evento" element={<SafeRoute component={VerSolicitudesEvento} name="VerSolicitudesEvento" />} />
        <Route path="/registrar-evento2" element={<SafeRoute component={RegistrarEvento2} name="RegistrarEvento2" />} />
        <Route path="/registrar-evento3" element={<SafeRoute component={RegistrarEvento3} name="RegistrarEvento3" />} />
        <Route path="/registrar-evento4/:diferenciaDiasEvento" element={<SafeRoute component={RegistrarEvento4} name="RegistrarEvento4" />} />
        <Route path="/grafica-productor" element={<SafeRoute component={PanelProductor} name="PanelProductor" />} />
        <Route path="/grafica-encargado" element={<SafeRoute component={PanelEncargado} name="PanelEncargado" />} />
        <Route path="/tipo-compra/:id" element={<SafeRoute component={Preventa} name="Preventa" />} />
        <Route path="/puestos-deshabilitados" element={<SafeRoute component={ListadoPuestosDeshabilitados} name="ListadoPuestosDeshabilitados" />} />
        <Route path="/notificaciones" element={<SafeRoute component={Notificaciones} name="Notificaciones" />} />
        <Route path="/perfil" element={<SafeRoute component={ConsultarUsuarioPrueba} name="ConsultarUsuarioPrueba" />} />
        <Route path="/info-puesto/:id" element={<SafeRoute component={ConsultarPuestoSolicitud} name="ConsultarPuestoSolicitud" />} />
        <Route path="/puesto/:id" element={<SafeRoute component={ConsultarPuesto} name="ConsultarPuesto" />} />
        <Route path="/ser-repartidor" element={<SafeRoute component={RegistroRepartidor} name="RegistroRepartidor" />} />
        <Route path="/ser-productor" element={<SafeRoute component={RegistroProductor} name="RegistroProductor" />} />
        <Route path="/ser-encargado" element={<SafeRoute component={RegistroEncargado} name="RegistroEncargado" />} />
        <Route path="/subir-archivo" element={<SafeRoute component={DocumentUpload} name="DocumentUpload" />} />
        <Route path="/producto/:id" element={<SafeRoute component={ConsultarProducto} name="ConsultarProducto" />} />
        <Route path="/registrar-evento" element={<SafeRoute component={RegistrarEvento} name="RegistrarEvento" />} />
        <Route path="/eventoPrueba" element={<SafeRoute component={EventoPrueba} name="EventoPrueba" />} />
        <Route path="/evento/:id" element={<SafeRoute component={ConsultarEvento} name="ConsultarEvento" />} />
        <Route path="/restriccionesEvento/:id" element={<SafeRoute component={FormDinamicoRestricciones} name="FormDinamicoRestricciones" />} />
      </Routes>
    </main>
  );
};

export default Main;
