import React from "react";
import { Route, Routes } from "react-router-dom";
import ProcesoRegistro from "../ComponenteRegister/ProcesoRegistro/ProcesoRegistro";
import RegistroEncargado from "../ComponenteRegister/RegistrarEncargado";
import RegistroProductor from "../ComponenteRegister/RegistrarProductor";
import RegistroRepartidor from "../ComponenteRegister/RegistrarRepartidor";
import SeleccionRegister from "../ComponenteRegister/SeleccionRegister";
import AdquirirNuevoRolR from "../ComponenteRepartidor/AdquirirNuevoRolR";
import AsociarRepartidorAEvento from "../ComponenteRepartidor/AsociarRepartidorAEvento";
import ConsultarUsuarioR from "../ComponenteRepartidor/ConsultarUsuarioR";
import FormDinamicoRestricciones from "../ComponenteRepartidor/FormDinamicoRestricciones";
import VerAsociacionesR from "../ComponenteRepartidor/VerAsociacionesR";
import Carrito from "../ComponentesCarrito/Carrito";
import ConsultarUsuario from "../ComponentesConsumidor/ConsultarUsuario";
import ConsultarUsuarioPrueba from "../ComponentesConsumidor/ConsultarUsuarioPrueba";
import AdquirirNuevoRolEPC from "../ComponentesEPC/AdquirirNuevoRolEPC";
import ConsultarUsuarioEPC from "../ComponentesEPC/ConsultarUsuarioEPC";
import ConsultarEvento from "../ComponentesEventos/ConsultarEvento";
import EventoPrueba from "../ComponentesEventos/EventoPrueba";
import ListadoEventos from "../ComponentesEventos/ListadoEvento";
import ListadoEventosUsers from "../ComponentesEventos/ListadoEventoUsers";
import RegistrarEvento from "../ComponentesEventos/RegistrarEvento";
import RegistrarEvento2 from "../ComponentesEventos/RegistrarEvento2";
import RegistrarEvento3 from "../ComponentesEventos/RegistrarEvento3";
import RegistrarEvento4 from "../ComponentesEventos/RegistrarEvento4";
import LandingPage from "../ComponentesLandingPage/LandingPage";
import CambiarContraseña from "../ComponentesLogin/CambiarContraseña";
import HabilitarUsuario from "../ComponentesLogin/HabilitarUsuario";
import Login from "../ComponentesLogin/Login";
import RecuperarContraseña from "../ComponentesLogin/RecuperarContraseña";
import ValidarEmail from "../ComponentesLogin/ValidarEmail";
import ValidarUsuario from "../ComponentesLogin/ValidarUsuario";
import ConsultarProducto from "../ComponentesProducto/ConsultarProducto";
import ListadoProducto from "../ComponentesProducto/ListadoProducto";
import ListadoProductoDeshabilitado from "../ComponentesProducto/ListadoProductoDeshabilitado";
import ListadoProductoUser from "../ComponentesProducto/ListadoProductoUser";
import RegistrarProductos from "../ComponentesProducto/RegistrarProductos";
import AdquirirNuevoRolPE from "../ComponentesProductorDeEventos/AdquirirNuevoRolPE";
import ConsultarUsuarioPE from "../ComponentesProductorDeEventos/ConsultarUsuarioPE";
import AsociarPuestoAEvento from "../ComponentesPuesto/AsociarPuestoAEvento";
import ConsultarPuesto from "../ComponentesPuesto/ConsultarPuesto";
import CrearNuevoPuesto from "../ComponentesPuesto/CrearPuesto";
import ListadoPuestos from "../ComponentesPuesto/ListadoPuestos";
import ListadoPuestosUser from "../ComponentesPuesto/ListadoPuestosUser";
import ListadoPuestosDeshabilitados from "../ComponentesPuesto/PuestoDeshabilitados.js";
import FiltersEventosConsumidor from "../filters/filtersEventosConsumidor";
import DocumentUpload from "./DocumentUpload";
import Home from "./Home";
import Inicio from "./Inicio";
import Sidebar from "./Sidebar";


export const Main = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/recuperar" element={<RecuperarContraseña />} />
        <Route path="/registrarse/:tipoUsuario" element={<ProcesoRegistro />} />
        <Route
          path="/cambiar-contrasenia/:codigo"
          element={<CambiarContraseña />}
        />
        <Route path="/home" element={<Home />} />
        <Route path="/consultar-usuario" element={<ConsultarUsuario />} />
        <Route path="/adquirir-nuevo-rolPE" element={<AdquirirNuevoRolPE />} />
        <Route path="/sidebar" element={<Sidebar />} />

        <Route path="/filtersEventosConsumidor" element={<FiltersEventosConsumidor/>} />

        <Route path="/inicio" element={<Inicio />} />
        <Route
          path="/adquirir-nuevo-rolEPC"
          element={<AdquirirNuevoRolEPC />}
        />
        <Route path="/consultar-usuarioPE" element={<ConsultarUsuarioPE />} />
        <Route path="/consultar-usuarioEPC" element={<ConsultarUsuarioEPC />} />
        <Route
          path="/adquierir-nuevo-rolPE/:id"
          element={<AdquirirNuevoRolPE />}
        />
        <Route path="/landingpage" element={<LandingPage />} />

        <Route path="/crear-puesto" element={<CrearNuevoPuesto />} />
        <Route path="/listado-puestos" element={<ListadoPuestos />} />
        <Route path="/puestos-deshabilitados" element={<ListadoPuestosDeshabilitados />} />

        <Route path="/consultar-puesto" element={<ConsultarPuesto />} />
        <Route path="/puesto/:id" element={<ConsultarPuesto />} />

        <Route path="/adquirir-nuevo-rolR" element={<AdquirirNuevoRolR />} />
        <Route path="/consultar-usuarioR" element={<ConsultarUsuarioR />} />

        <Route path="/ser-repartidor" element={<RegistroRepartidor />} />
        <Route path="/ser-productor" element={<RegistroProductor />} />
        <Route path="/ser-encargado" element={<RegistroEncargado />} />

        <Route path="/perfil-nuevo" element={<ConsultarUsuarioPrueba />} />

        <Route path="/login" element={<Login />} />

        <Route path="/subir-archivo" element={<DocumentUpload />} />
        <Route path="/seleccion-perfil" element={<SeleccionRegister />} />

        <Route path="/listado-productos/:id" element={<ListadoProducto />} />
        <Route path="/listado-productos-deshabilitados/:id" element={<ListadoProductoDeshabilitado/>} />
        <Route
          path="/registrar-productos/:id"
          element={<RegistrarProductos />}
        />
        <Route path="/producto/:id" element={<ConsultarProducto />} />

        <Route path="/eventos" element={<ListadoEventos />} />
        <Route path="/listado-puestos/:idEvento" element={<ListadoPuestosUser />} />
        <Route path="/productos-puesto/:id" element={<ListadoProductoUser />} />

        <Route path="/listado-eventos" element={<ListadoEventosUsers />} />
        <Route path="/registrar-evento" element={<RegistrarEvento />} />
        <Route path="/registrar-evento2" element={<RegistrarEvento2 />} />
        <Route path="/registrar-evento3" element={<RegistrarEvento3 />} />
        <Route path="/registrar-evento4/:diferenciaDiasEvento" element={<RegistrarEvento4 />} />
        <Route path="/eventoPrueba" element={<EventoPrueba />} />

        <Route path="/evento/:id" element={<ConsultarEvento />} />
        <Route path="/habilitar-Usuario-email/:id/:codigo" element={<ValidarEmail />} />
        <Route path="/habilitar-Usuario-deshabilitado/:id" element={<HabilitarUsuario />} />
        <Route path="/habilitar-Usuario/:id/:codigo" element={<ValidarUsuario />} />

        <Route path="/asociarRepartidorAEvento" element={<AsociarRepartidorAEvento />} />
        <Route path="/restriccionesEvento/:id" element={<FormDinamicoRestricciones/>} />
        <Route path="/misAsociaciones" element={<VerAsociacionesR/>} />
        <Route path="/asociarPuestoAEvento/:puestoId" element={<AsociarPuestoAEvento/>} />
        <Route path="/carrito/" element={<Carrito/>} />
      </Routes>
    </main>
  );
};

export default Main;
