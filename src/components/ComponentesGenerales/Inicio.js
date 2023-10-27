import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import puestos from "../img/carro.png";
import eventos from "../img/eventos.png";
import pedidos from "../img/pedidos.png";
import perfil from "../img/perfil.png";
import notificaciones from "../img/notificaciones.png";
import eventosimg from "../img/Eventos-boton.png";
import pedidoimg from "../img/comida-rapida-casera.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpLong,
  faDolly,
  faShop,
  faUser,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
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
    /*
     */
  }, []);

  return (
    <div className="fondo">
      <Sidebar tipoUsuario={session?.tipoUsuario} />
      <div className="grid-container">
        <Link to="/eventos" className="grid-item a grid-container-div">
          <div className="grid-item-div type1 contenedor-img">
            <img src={eventosimg} alt="" className="imagen" />
          </div>

          <div className="grid-item-div type2">
            <h2>Eventos</h2>
            <p>¿Quieres buscar Eventos?</p>
          </div>
        </Link>
        <Link to="/pedidos" className="grid-item a grid-container-div">
          <div className="grid-item-div type1 contenedor-img">
            <img src={pedidoimg} alt="" className="imagen" />
          </div>

          <div className="grid-item-div type2">
            <h2>Pedidos</h2>
            <p>¿Quieres ver tus pedidos?</p>
          </div>
        </Link>
        <Link to="/adquirir-nuevo-rolPE" className="grid-item grid-item-cel">
          <div className="lefticon col-2">
            <FontAwesomeIcon icon={faUpLong} className="up" />
            <FontAwesomeIcon icon={faBriefcase} />
          </div>

          <p className="titulochiquito col-10">Ascender a Productor</p>
        </Link>
        <Link to="/adquirir-nuevo-rolR" className="grid-item grid-item-cel">
          <div className="lefticon col-2">
            <FontAwesomeIcon icon={faUpLong} className="up" />
            <FontAwesomeIcon icon={faDolly} />
          </div>
          <p className="titulochiquito col-10">Ascender a Repartidor</p>
        </Link>
        <Link to="/adquirir-nuevo-rolEPC" className="grid-item grid-item-cel">
          <div className="lefticon col-2">
            <FontAwesomeIcon icon={faUpLong} className="up" />
            <FontAwesomeIcon icon={faShop} />
          </div>
          <p className="titulochiquito col-10">
            Ascender a encargado de puesto
          </p>
        </Link>
        <Link to="/" className="grid-item grid-item-cel">
          6
        </Link>
        <Link to="/" className="grid-item grid-item-cel">
          7
        </Link>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Inicio;
