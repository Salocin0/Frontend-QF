import React, { useEffect } from 'react';
import Footer from './Footer';
import { useState } from 'react';
import ConsultarUsuario from '../ComponentesConsumidor/ConsultarUsuario';
import HacerPedido from '../ComponentesConsumidor/HacerPedido';
import HistorialPedidos from '../ComponentesConsumidor/HistorialPedidos';
import Inicio from '../ComponentesConsumidor/Inicio';
import Notificaciones from '../ComponentesConsumidor/Notificaciones';

const Home = (data) => {
  const [selectedItem, setSelectedItem] = useState("Inicio");

  const handleNavbarItemClick = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    console.log(data);
  })

  return (
    <div>
      {selectedItem === "Inicio" && <Inicio />}
      {selectedItem === "Perfil" && <ConsultarUsuario />}
      {selectedItem === "Hacer Pedidos" && <HacerPedido />}
      {selectedItem === "Pedidos" && <HistorialPedidos />}
      {selectedItem === "Notificaciones" && <Notificaciones />}
      <Footer/>
    </div>
  );
};

export default Home;