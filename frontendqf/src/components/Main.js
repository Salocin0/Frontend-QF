import React from 'react'
import { Routes, Route } from "react-router-dom"
import Login from './Login'
import RecuperarContraseña from './RecuperarContraseña'
import RegistrarUsuario from './RegistrarUsuario'
import CambiarContraseña from './CambiarContraseña'
import ConsultarUsuario from './ConsultarUsuario'


export const Main = () => {

  return (
    <main>
      <Routes>
          <Route path="/" element={<Login/>} />
           <Route path="/recuperar" element={<RecuperarContraseña/>} />
           <Route path="/registrarse" element={<RegistrarUsuario/>} />
           <Route path="/cambiar-contraseña" element={<CambiarContraseña/>} />
           <Route path="/consultar-usuario" element={<ConsultarUsuario/>} />
      </Routes>
    </main>
  )
}

export default Main