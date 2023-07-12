import React from 'react';
import '../estilos.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { useState } from 'react';
import ConsultarUsuario from './ComponentesCosumidor/ConsultarUsuario';
import HacerPedido from './ComponentesCosumidor/HacerPedido';
import HistorialPedidos from './ComponentesCosumidor/HistorialPedidos';
import Inicio from './ComponentesCosumidor/Inicio';
import Notificaciones from './ComponentesCosumidor/Notificaciones';

const Home = () => {
  //const { id } = useParams();
  const [selectedItem, setSelectedItem] = useState("Inicio");

  const handleNavbarItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div>
      <Navbar onItemClick={handleNavbarItemClick} />
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