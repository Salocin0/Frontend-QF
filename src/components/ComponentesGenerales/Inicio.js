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
import "./cards.css";
import style from "./inicio.module.css";

const Inicio = () => {
  const [session, setSession] = useState(null);
  const cardData = [
    { to: "/perfil-nuevo", imgSrc: perfil, title: "Perfil" },
    { to: "/eventos", imgSrc: eventos, title: "Eventos" },
    { to: "/consultar-pedidos", imgSrc: pedidos, title: "Pedidos" },
    //{ to: "/notificaciones", imgSrc: notificaciones, title: "Notificaciones" },
    { to: "/listado-puestos", imgSrc: puestos, title: "Puestos" },
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
    <div
      className={`${style.background} d-flex align-items-center justify-content-center`}
    >
      <div className="col-2">
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className="d-flex align-items-center justify-content-center">
        <section className="container py-5">
          <div className="row row-cols-2 g-4">
            {cardData.map((item, index) => (
              <div className="col" key={index}>
                <div
                  className="card bg-warning shadow-sm card-custom"
                  style={{
                    width: "300px",
                    height: "300px",
                    margin: index % 2 === 0 ? "0 auto auto 200px" : "0 10px",
                  }}
                >
                  <Link
                    to={item.to}
                    style={{ textDecoration: "none", height: "100%" }}
                  >
                    <div style={{ height: "100%" }}>
                      <div className="d-flex align-items-center justify-content-center">
                        <img
                          src={item.imgSrc}
                          className="card-img-top mx-auto mt-5"
                          style={{ width: "150px", height: "150px" }}
                          alt={`Icono de ${item.title}`}
                        />
                      </div>
                      <div className="card-body text-center">
                        <h2
                          className={`${style.cardtitle} card-title`}
                          style={{ textDecoration: "none" }}
                        >
                          {item.title}
                        </h2>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Inicio;
