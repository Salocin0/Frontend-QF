import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import Sidebar from "../ComponentesGenerales/Sidebar";
import Puesto from "./Puesto";
import "./puestos.css";
import "../ComponentesConsumidor/ConsultarUsuario.css";
import { Link } from "react-router-dom";
import Footer from "../ComponentesGenerales/Footer";

const ListadoPuestos = () => {
  const [carritos, setCarritos] = useState([{},{}]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (!session) {
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
        })
        .catch((error) => console.error("Error fetching session:", error));
    }

    if (session) {
      const headers = new Headers();
      headers.append("ConsumidorId", session.consumidorId);
      fetch("http://localhost:8000/puesto", {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setCarritos(data.data);
        })
        .catch((error) => console.error("Error fetching carritos:", error));
    }
  }, [session]);

  const totalCarritos = Math.ceil(carritos.length / 4) * 4;
  const carritosConNulos = [
    ...carritos,
    ...Array(totalCarritos - carritos.length).fill(null),
  ];
  const rows = [];

  for (let i = 0; i < carritosConNulos.length; i += 4) {
    const row = carritosConNulos.slice(i, i + 4);
    rows.push(row);
  }

  return (
    <div className="d-flex">
      <div className="col-2">
        <Sidebar />
      </div>
      <div className="flex-grow-1 background pb-5">
        <div className="container pt-2 ">
          {carritos.length === 0 ? (
            <p>No hay carritos disponibles.</p>
          ) : (
            rows.length > 0 &&
            rows.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((carrito, index) => (
                  <div key={index} className="col-md-3 pb-2">
                    {carrito !== null ? <Puesto carrito={carrito} /> : null}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
        <Link
          to={`/crear-puesto`}
          className="btn btn-primary btn-floating btn-lg"
        >
          +
        </Link>
        <Footer />
      </div>
    </div>
  );
};

export default ListadoPuestos;
