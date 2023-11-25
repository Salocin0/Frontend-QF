import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.scss";
import PuestoEncargado from "./PuestoEncargado";

const ListadoPuestosEncargado = () => {
  const { idEvento } = useParams();
  const [rows, setRows] = useState([]);
  const [carritos, setCarritos] = useState([]);
  const [session, setSession] = useState(null);

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
      })
      .catch((error) => console.error("Error fetching session:", error));
  }, []);

  //      fetch(`http://localhost:8000/puesto/evento/${idEvento}`, {

  useEffect(() => {
    if (session) {
      const headers = new Headers();
      headers.append("ConsumidorId", session?.consumidorId);
      headers.append("Content-Type", "application/json");

      fetch(`http://localhost:8000/puesto/creados`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setCarritos(data.data);
          console.log(data.data);
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
  }, [session]);

  return (
    <div className={`row m-0 mainFormEventos`}>
      <div className="col-2 p-0">
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className={`col-10`}>
        <div className="d-flex align-items-center justify-content-center">
          <div className="pt-2 pb-4 h-100 w-100">
            {Array.isArray(carritos) && carritos.length > 0 ? (
              <React.Fragment>
                <div className="d-flex justify-content-center mb-3 tituloSeccion">
                  <h1 className="pt-2">Puestos</h1>
                </div>
                <hr style={{ color: "#F7B813" }} />
                {rows.length > 0 &&
                  rows.map((row, rowIndex) => (
                    <div key={rowIndex}>
                      {row.map((carrito, index) => (
                        <div key={index}>
                          {carrito !== null ? (
                            <PuestoEncargado carrito={carrito} />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ))}
              </React.Fragment>
            ) : (
              <div className="contenedor-grid">
                <div className="tituloSeccion">
                  <h2>Puestos</h2>
                </div>
                <div className="descripcion">
                  <p>
                    Con Quickfood, crea tus Puestos de Comida para hacerlo
                    mejor. Descubre nuestras increíbles características y ofrece
                    una experiencia única a tus consumidores.
                  </p>
                </div>
                <Link to={`/crear-puesto`} className="LinkAgregarEvento">
                  Crear Puesto
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListadoPuestosEncargado;
