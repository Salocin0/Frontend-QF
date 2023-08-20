import React from 'react'
import { Routes, Route } from "react-router-dom"
import Login from '../ComponentesLogin/Login'
import RecuperarContraseña from '../ComponentesLogin/RecuperarContraseña'
import RegistrarUsuario from '../ComponentesLogin/RegistrarUsuario';
import CambiarContraseña from '../ComponentesLogin/CambiarContraseña'
import ConsultarUsuario from '../ComponentesConsumidor/ConsultarUsuario'
import Home from './Home'
import AdquirirNuevoRolPE from '../ComponentesProductorDeEventos/AdquirirNuevoRolPE';
import Sidebar from './Sidebar';
import Inicio from './Inicio';
import AdquirirNuevoRolEPC from '../ComponentesEPC/AdquirirNuevoRolEPC';
import ConsultarUsuarioPE from '../ComponentesProductorDeEventos/ConsultarUsuarioPE';
import ConsultarUsuarioEPC from '../ComponentesEPC/ConsultarUsuarioEPC';
import LandingPage from '../ComponentesLandingPage/LandingPage';

export const Main = () => {
  return (
    <main>
      <Routes>
          <Route path="/" element={<Login/>} />
           <Route path="/recuperar" element={<RecuperarContraseña/>} />
           <Route path="/registrarse" element={<RegistrarUsuario/>} />
           <Route path="/cambiar-contrasenia/:codigo" element={<CambiarContraseña/>} />
           <Route path="/home/:id" element={<Home/>} />
           <Route path="/consultar-usuario" element={<ConsultarUsuario/>} />
           <Route path="/adquirir-nuevo-rolPE" element={<AdquirirNuevoRolPE/>} />
           <Route path="/sidebar" element={<Sidebar/>} />
           <Route path="/inicio" element={<Inicio/>} />
           <Route path="/adquirir-nuevo-rolEPC" element={<AdquirirNuevoRolEPC/>} />
           <Route path="/consultar-usuarioPE" element={<ConsultarUsuarioPE/>} />
           <Route path="/consultar-usuarioEPC" element={<ConsultarUsuarioEPC/>} />
           <Route path="/adquierir-nuevo-rolPE/:id" element={<AdquirirNuevoRolPE/>} />
           <Route path="/landingpage" element={<LandingPage/>} />
      </Routes>
    </main>
  )
}

export default Main