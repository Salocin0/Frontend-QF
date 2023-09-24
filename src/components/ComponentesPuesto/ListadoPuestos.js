import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "../ComponentesConsumidor/ConsultarUsuario.module.css";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import Puesto from "./Puesto";
import stylepuesto from "./puestos.module.css";

const ListadoPuestos = () => {
  const [rows, setRows] = useState([]);
  const [carritos, setCarritos] = useState([]);
  const [session, setSession] = useState(null);
  const [recargar, setRecargar] = useState(0);

  const recargarComponente = () => {
    setRecargar(+1);
  };

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      console.error("No session ID found.");
      return;
    }

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
        console.log(data.data.tipoUsuario);
        console.log(data.data);
      })
      .catch((error) => console.error("Error fetching session:", error));
  }, []);

  useEffect(() => {
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
          const totalCarritos = Math.ceil(data.data.length / 4) * 4;
          const carritosConNulos = [
            ...data.data,
            ...Array(totalCarritos - data.data.length).fill(null),
          ];

          const generatedRows = [];
          for (let i = 0; i < carritosConNulos.length; i += 4) {
            const row = carritosConNulos.slice(i, i + 4);
            generatedRows.push(row);
          }
          setRows(generatedRows);
        })
        .catch((error) => console.log("No existen carritos."));
    }
  }, [session,recargar]);

  return (
    <div className={`${style.background} d-flex`}>
      <div className="col-2">
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className="flex-grow-1 pb-5">
        <div className="container pt-2 h-100">
          <div className="d-flex justify-content-center mb-3">
            <h1 className="pt-3" style={{ color: "white" }}>
              Puestos
            </h1>
          </div>
          <hr style={{ color: "white" }} className="me-4" />
          {Array.isArray(carritos) && carritos.length > 0 ? (
            rows.length > 0 &&
            rows.map((row, rowIndex) => (
              <div key={rowIndex} className={`row ${stylepuesto.row}`}>
                {row.map((carrito, index) => (
                  <div
                    key={index}
                    className={`${stylepuesto.colmd3} col-md-3 pb-2`}
                  >
                    {carrito !== null ? <Puesto carrito={carrito} recargar={recargarComponente} /> : null}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <h2 className={stylepuesto.centeredtext}>
              No tenes ningun puesto en este momento.
            </h2>
          )}
        </div>
        <Link
          to={`/crear-puesto`}
          className={`btn btn-primary ${stylepuesto.btnfloating} btn-lg`}
        >
          <i class="bi bi-plus-lg"></i> Agregar Puesto
        </Link>
        <Footer />
      </div>
    </div>
  );
};

export default ListadoPuestos;
