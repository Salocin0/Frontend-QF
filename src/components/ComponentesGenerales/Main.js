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


export const Main = () => {
  return (
    <main>
      <Routes>
        {/*nuevos estilos aplicados*/}
        <Route path="/registrarse/:tipoUsuario" element={<ProcesoRegistro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/seleccion-perfil" element={<SeleccionRegister />} />
        <Route path="/habilitar-Usuario-email/:id/:codigo" element={<ValidarEmail />} />
        <Route path="/habilitar-Usuario/:id/:codigo" element={<ValidarUsuario />} />
        <Route path="/recuperar" element={<RecuperarContraseña />} />
        <Route path="/cambiar-contrasenia/:codigo" element={<CambiarContraseña />}/>
        <Route path="/habilitar-Usuario-deshabilitado/:id" element={<HabilitarUsuario />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/listado-eventos" element={<ListadoEventosUsers />} />
        <Route path="/listado-puestos/:idEvento" element={<ListadoPuestosUser />} />
        <Route path="/productos-puesto/:id" element={<ListadoProductoUser />} />
        <Route path="/carrito/" element={<Carrito/>} />
        <Route path="/pedidos" element={<ListadoPedidos/>} />
        <Route path="/adquirir-nuevo-rolR" element={<AdquirirNuevoRolR />} />
        <Route path="/adquirir-nuevo-rolPE" element={<AdquirirNuevoRolPE />} />
        <Route path="/adquirir-nuevo-rolEPC" element={<AdquirirNuevoRolEPC />} />
        <Route path="/pedidos-asignados" element={<ListadoPedidosRepartidor/>} />
        <Route path="/asociarRepartidorAEvento" element={<AsociarRepartidorAEvento />} />
        <Route path="/misAsociacionesR" element={<AsociacionesR/>} />
        <Route path="/listado-puestos-encargado" element={<ListadoPuestosEncargado />} />
        <Route path="/asociarPuestoAEvento/:puestoId" element={<AsociarPuestoAEvento/>} />
        <Route path="/listado-productos/:id" element={<ListadoProducto />} />
        <Route path="/crear-puesto" element={<CrearNuevoPuesto />} />
        <Route path="/listado-productos-deshabilitados/:id" element={<ListadoProductoDeshabilitado/>} />
        <Route path="/registrar-productos/:id" element={<RegistrarProductos />}/>
        <Route path="/misAsociacionesEPC" element={<AsociacionesEPC/>} />
        <Route path="/pedidos-Encargado/:id" element={<ListadoPedidosEncargado/>} />
        <Route path="/listado-eventos-productor" element={<ListadoEventosProductor />} />
        <Route path="/ver-solicitudes-evento/:evento" element={<VerSolicitudesEvento/>} />
        <Route path="/registrar-evento2" element={<RegistrarEvento2 />} />
        <Route path="/registrar-evento3" element={<RegistrarEvento3 />} />
        <Route path="/registrar-evento4/:diferenciaDiasEvento" element={<RegistrarEvento4 />} />
        <Route path="/grafica-productor" element={<PanelProductor/>} />
        <Route path="/grafica-encargado" element={<PanelEncargado/>} />
        <Route path="/tipo-compra/:id" element={<Preventa/>} />
        {/*nuevos estilos por aplicar*/}
        <Route path="/puestos-deshabilitados" element={<ListadoPuestosDeshabilitados />} />
        <Route path="/notificaciones" element={<Notificaciones/>}/>
        <Route path="/perfil-nuevo" element={<ConsultarUsuarioPrueba />} />
        
        <Route path="/info-puesto/:id" element={<ConsultarPuestoSolicitud />} />
        <Route path="/puesto/:id" element={<ConsultarPuesto />} />
        <Route path="/ser-repartidor" element={<RegistroRepartidor />} />
        <Route path="/ser-productor" element={<RegistroProductor />} />
        <Route path="/ser-encargado" element={<RegistroEncargado />} />
        <Route path="/subir-archivo" element={<DocumentUpload />} />
        <Route path="/producto/:id" element={<ConsultarProducto />} />
        <Route path="/registrar-evento" element={<RegistrarEvento />} />
        <Route path="/eventoPrueba" element={<EventoPrueba />} />
        <Route path="/evento/:id" element={<ConsultarEvento />} />
        <Route path="/restriccionesEvento/:id" element={<FormDinamicoRestricciones/>} />
      </Routes>
    </main>
  );
};

export default Main;
