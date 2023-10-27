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
    <div
      className={`background d-flex align-items-center justify-content-center`} style={{"backgroundColor":"#1C2135"}}
    >
      <div>
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className="d-flex align-items-center justify-content-center">
        <section className="container py-5">
          <div className="row row-cols-4 g-2" >
            {cardData.map((item, index) => (
              <div className="col" key={index}>
                <div
                  className="card shadow-sm"
                  style={{
                    width: "300px",
                    height: "300px",
                    margin: index % 2 === 0 ? "0 auto auto 200px" : "0 10px",
                    backgroundColor: "#1C2135",
                  }}
                >
                  <Link
                    to={item.to}
                    style={{ textDecoration: "none", height: "100%" }}
                  >
                    <div style={{ height: "100%" }}>
                      <div className="d-flex align-items-center justify-content-center">
                      </div>
                      <div className="card-body text-center"> 
                        
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
