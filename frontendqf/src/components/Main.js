import React from 'react'
import { Routes, Route } from "react-router-dom"
import Login from './Login'
import RecuperarContraseña from './RecuperarContraseña'
import RegistrarUsuario from './RegistrarUsuario'
import CambiarContraseña from './CambiarContraseña'
import ConsultarUsuario from './ComponentesCosumidor/ConsultarUsuario'
import Home from './Home'

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
      </Routes>
    </main>
  )
}

export default Main