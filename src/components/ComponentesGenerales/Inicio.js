import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../ComponentesGenerales/Sidebar";
import puestos from "../img/carro.png";
import pedidoimg from "../img/comida-rapida-casera.jpg";
import eventos from "../img/eventos.png";
import eventosimg2 from "../img/eventosimg2.png";
import encargado from "../img/foodtruck.jpg";
import notificaciones from "../img/notificaciones.png";
import pedidos from "../img/pedidos.png";
import perfil from "../img/perfil.png";
import productor from "../img/productor.jpg";
import repartidor from "../img/repartidor.jpg";
import "./../sass/main.scss";

const Inicio = () => {
  const [session, setSession] = useState(null);
  const cardData = [
    { to: "/perfil-nuevo", imgSrc: perfil, title: "Perfil" },
    { to: "/eventos", imgSrc: eventos, title: "Eventos" },
    { to: "/consultar-pedidos", imgSrc: pedidos, title: "Pedidos" },
    { to: "/notificaciones", imgSrc: notificaciones, title: "Notificaciones" },
    { to: "/notificaciones", imgSrc: notificaciones, title: "Notificaciones" },
    { to: "/inicio", imgSrc: puestos, title: "Puestos" },
  ];
  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId) {
      fetch("http://localhost:8000/user/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionID: sessionId }),
      })
        .then((response) => response.json())
        .then((data) => {
          setSession(data.data);
          console.log(data.data);
        })
        .catch((error) => console.error("Error fetching session:", error));
    }
  }, []);

  return (
    <div className="fondo">
      <Sidebar tipoUsuario={session?.tipoUsuario} />
      <div className="grid-container">
        <Link to="/Listado-eventos" className="grid-item a grid-container-div">
          <div className="grid-item-div type1 contenedor-img">
            <img src={eventosimg2} alt="" className="imagen" />
          </div>

          <div className="grid-item-div type2">
            <h2>Eventos</h2>
            <hr  className="m-3" style={{color: "black"}}/>
            <p>Busca tus eventos favoritos</p>
          </div>
        </Link>
        <Link to="/pedidos" className="grid-item a grid-container-div">
          <div className="grid-item-div type1 contenedor-img">
            <img src={pedidoimg} alt="" className="imagen" />
          </div>

          <div className="grid-item-div type2">
            <h2>Pedidos</h2>
            <hr  className="m-3" style={{color: "black"}}/>
            <p>¿Quieres ver tus pedidos?</p>
          </div>
        </Link>

        <Link to="/adquirir-nuevo-rolPE" className="grid-item a grid-container-div">
          <div className="grid-item-div type1 contenedor-img">
            <img src={productor} alt="" className="imagen" />
          </div>

          <div className="grid-item-div type2">
            <h2>Productores</h2>
            <hr  className="m-3" style={{color: "black"}}/>
            <p>Quickfood para tus eventos</p>
          </div>
        </Link>

        <Link to="/adquirir-nuevo-rolEPC" className="grid-item a grid-container-div">
          <div className="grid-item-div type1 contenedor-img">
            <img src={encargado} alt="" className="imagen" />
          </div>

          <div className="grid-item-div type2">
            <h2>Puestos</h2>
            <hr  className="m-3" style={{color: "black"}}/>
            <p>Quickfood para tus puestos</p>
          </div>
        </Link>

        <Link to="/adquirir-nuevo-rolR" className="grid-item a grid-container-div">
          <div className="grid-item-div type1 contenedor-img">
            <img src={repartidor} alt="" className="imagen" />
          </div>

          <div className="grid-item-div type2">
            <h2>Repartidores</h2>
            <hr  className="m-3" style={{color: "black"}}/>
            <p>Quickfood para repartidores</p>
          </div>
        </Link>


        <Link to="/perfil-nuevo" className="grid-item grid-item-cel button_slide button_configuracion">
          <p className="titulochiquito col-9">
            Mi Perfil
          </p>
          <div className="icono">
            <FontAwesomeIcon icon={faUser} className="icono-salir" />
          </div>
        </Link>

        <Link to="/" className="grid-item grid-item-cel button_slide button_salir">

          <p className="titulochiquito col-9">
            Cerrar Sesión
          </p>
          <div className="icono">
            <FontAwesomeIcon icon={faSignOutAlt} className="icono-salir" />
          </div>
        </Link>
      </div>

    </div>
  );
};

export default Inicio;
