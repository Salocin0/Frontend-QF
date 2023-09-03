import React from 'react';
import { Route, Routes } from "react-router-dom";
import RegistroEncargado from '../ComponenteRegister/RegistrarEncargado';
import RegistroProductor from '../ComponenteRegister/RegistrarProductor';
import RegistroRepartidor from '../ComponenteRegister/RegistrarRepartidor';
import AdquirirNuevoRolR from '../ComponenteRepartidor/AdquirirNuevoRolR';
import ConsultarUsuarioR from '../ComponenteRepartidor/ConsultarUsuarioR';
import ConsultarUsuario from '../ComponentesConsumidor/ConsultarUsuario';
import ConsultarUsuarioPrueba from '../ComponentesConsumidor/ConsultarUsuarioPrueba';
import AdquirirNuevoRolEPC from '../ComponentesEPC/AdquirirNuevoRolEPC';
import ConsultarUsuarioEPC from '../ComponentesEPC/ConsultarUsuarioEPC';
import LandingPage from '../ComponentesLandingPage/LandingPage';
import CambiarContraseña from '../ComponentesLogin/CambiarContraseña';
import Login from '../ComponentesLogin/Login';
import RecuperarContraseña from '../ComponentesLogin/RecuperarContraseña';
import RegistrarUsuario from '../ComponentesLogin/RegistrarUsuario';
import AdquirirNuevoRolPE from '../ComponentesProductorDeEventos/AdquirirNuevoRolPE';
import ConsultarUsuarioPE from '../ComponentesProductorDeEventos/ConsultarUsuarioPE';
import ConsultarPuesto from '../ComponentesPuesto/ConsultarPuesto';
import CrearNuevoPuesto from '../ComponentesPuesto/CrearPuesto';
import ListadoPuestos from '../ComponentesPuesto/ListadoPuestos';
import Home from './Home';
import Inicio from './Inicio';
import Sidebar from './Sidebar';
import DocumentUpload from './DocumentUpload';
import SeleccionRegister from '../ComponenteRegister/SeleccionRegister';
import ProcesoRegistro from '../ComponenteRegister/ProcesoRegistro/ProcesoRegistro';

export const Main = () => {
  return (
    <main>
      <Routes>
          <Route path="/" element={<LandingPage/>} />
           <Route path="/recuperar" element={<RecuperarContraseña/>} />
           <Route path="/registrarse/:tipoUsuario" element={<ProcesoRegistro/>} />
           <Route path="/cambiar-contrasenia/:codigo" element={<CambiarContraseña/>} />
           <Route path="/home" element={<Home/>} />
           <Route path="/consultar-usuario" element={<ConsultarUsuario/>} />
           <Route path="/adquirir-nuevo-rolPE" element={<AdquirirNuevoRolPE/>} />
           <Route path="/sidebar" element={<Sidebar/>} />
           <Route path="/inicio" element={<Inicio/>} />
           <Route path="/adquirir-nuevo-rolEPC" element={<AdquirirNuevoRolEPC/>} />
           <Route path="/consultar-usuarioPE" element={<ConsultarUsuarioPE/>} />
           <Route path="/consultar-usuarioEPC" element={<ConsultarUsuarioEPC/>} />
           <Route path="/adquierir-nuevo-rolPE/:id" element={<AdquirirNuevoRolPE/>} />
           <Route path="/landingpage" element={<LandingPage/>} />

           <Route path="/crear-puesto" element={<CrearNuevoPuesto/>} />
           <Route path="/listado-puestos" element={<ListadoPuestos/>} />
           <Route path="/consultar-puesto" element={<ConsultarPuesto/>} />
           <Route path="/puesto/:id" element={<ConsultarPuesto/>} />

           <Route path="/adquirir-nuevo-rolR" element={<AdquirirNuevoRolR/>} />
           <Route path="/consultar-usuarioR" element={<ConsultarUsuarioR/>} />

           <Route path="/ser-repartidor" element={<RegistroRepartidor/>} />
           <Route path="/ser-productor" element={<RegistroProductor/>} />
           <Route path="/ser-encargado" element={<RegistroEncargado/>} />

           <Route path="/perfil-nuevo" element={<ConsultarUsuarioPrueba/>} />

           <Route path="/login" element={<Login/>} />

           <Route path="/subir-archivo" element={<DocumentUpload/>} />
           <Route path="/seleccion-perfil" element={<SeleccionRegister/>} />
      </Routes>
    </main>
  )
}

export default Main